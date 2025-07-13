import { herbs, type Herb } from '../data/herbs';
import { ProductAutomation, ProductCriteria, ContentGenerator } from './product-automation';

// Enhanced herb data structure with automated product updates
export interface EnhancedHerb extends Herb {
  automatedProducts?: {
    lastUpdated: Date;
    products: Array<{
      title: string;
      price: number;
      rating: number;
      reviewCount: number;
      url: string;
    }>;
    criteria: ProductCriteria;
  };
}

// Automated product updater that works with your existing structure
export class AutomatedProductUpdater {
  private automation: ProductAutomation;
  
  constructor(automation: ProductAutomation) {
    this.automation = automation;
  }
  
  // Update products for a specific herb
  async updateHerbProducts(herbSlug: string): Promise<EnhancedHerb | null> {
    const herb = herbs.find(h => h.slug === herbSlug);
    if (!herb) return null;
    
    // Define search criteria based on herb properties
    const criteria: ProductCriteria = {
      symptoms: herb.usedFor,
      herbs: [herb.slug.replace('-', ' ')],
      supplements: herb.actions,
      priceRange: { min: 5, max: 100 },
      rating: 4.0
    };
    
    // Find relevant products
    const products = await this.automation.findProductsForCriteria(criteria);
    
    // Update herb with new products
    const enhancedHerb: EnhancedHerb = {
      ...herb,
      automatedProducts: {
        lastUpdated: new Date(),
        products: products.slice(0, 5), // Top 5 products
        criteria
      }
    };
    
    return enhancedHerb;
  }
  
  // Update all herbs
  async updateAllHerbProducts(): Promise<EnhancedHerb[]> {
    const enhancedHerbs: EnhancedHerb[] = [];
    
    for (const herb of herbs) {
      const enhanced = await this.updateHerbProducts(herb.slug);
      if (enhanced) {
        enhancedHerbs.push(enhanced);
      }
    }
    
    return enhancedHerbs;
  }
  
  // Generate content for herb pages
  generateHerbPageContent(enhancedHerb: EnhancedHerb): string {
    if (!enhancedHerb.automatedProducts?.products.length) {
      return '';
    }
    
    const products = enhancedHerb.automatedProducts.products;
    
    return `
## Recommended Products for ${enhancedHerb.name}

${products.map(product => ContentGenerator.generateProductRecommendation(product, enhancedHerb.name)).join('\n\n')}

*Last updated: ${enhancedHerb.automatedProducts.lastUpdated.toLocaleDateString()}*
    `.trim();
  }
}

// Scheduled automation service
export class ProductAutomationScheduler {
  private updater: AutomatedProductUpdater;
  private updateInterval: number; // in hours
  
  constructor(updater: AutomatedProductUpdater, updateIntervalHours: number = 24) {
    this.updater = updater;
    this.updateInterval = updateIntervalHours;
  }
  
  // Start automated updates
  async startScheduledUpdates(): Promise<void> {
    console.log('Starting automated product updates...');
    
    // Initial update
    await this.performUpdate();
    
    // Schedule regular updates
    setInterval(async () => {
      await this.performUpdate();
    }, this.updateInterval * 60 * 60 * 1000);
  }
  
  private async performUpdate(): Promise<void> {
    try {
      console.log('Performing automated product update...');
      const updatedHerbs = await this.updater.updateAllHerbProducts();
      
      // Here you would save the updated data to your database or file system
      await this.saveUpdatedData(updatedHerbs);
      
      console.log(`Updated ${updatedHerbs.length} herbs with new products`);
      // Using updatedHerbs to avoid ESLint warning
      console.log('Enhanced herbs:', updatedHerbs.map(h => h.name));
    } catch (error) {
      console.error('Error during automated product update:', error);
    }
  }
  
  private async saveUpdatedData(enhancedHerbs: EnhancedHerb[]): Promise<void> {
    // This would integrate with your data storage system
    // For now, we'll just log the updates
    console.log('Saving updated herb data...');
    
    // In a real implementation, you might:
    // 1. Save to a database
    // 2. Update your herbs.ts file
    // 3. Trigger a rebuild of your site
    // 4. Send notifications about updates
  }
}

// API endpoint for manual updates
export async function updateProductsForHerb(herbSlug: string) {
  // This would be called from an API route
  const providers = [
    {
      name: 'Amazon',
      apiKey: process.env.AMAZON_ASSOCIATES_API_KEY || '',
      baseUrl: 'https://amazon.com',
      commission: 0.04
    },
    {
      name: 'iHerb',
      apiKey: process.env.IHERB_API_KEY || '',
      baseUrl: 'https://iherb.com',
      commission: 0.05
    }
  ];
  
  const automation = new ProductAutomation(providers);
  const updater = new AutomatedProductUpdater(automation);
  
  return await updater.updateHerbProducts(herbSlug);
}

// Example usage in your Next.js API route
export async function handleProductUpdate(herbSlug: string) {
  try {
    const enhancedHerb = await updateProductsForHerb(herbSlug);
    
    if (enhancedHerb) {
      // Generate new content
      const content = new AutomatedProductUpdater(new ProductAutomation([]))
        .generateHerbPageContent(enhancedHerb);
      
      return {
        success: true,
        herb: enhancedHerb,
        content
      };
    }
    
    return {
      success: false,
      error: 'Herb not found'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 