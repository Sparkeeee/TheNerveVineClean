"use client";

import { AffiliateOptimizer } from './affiliateOptimizer';
import { ProductAutomation } from './product-automation';
import { DatabaseQualityAnalyzer } from './database-quality-analyzer';

// Core data interfaces
export interface ProcessedProduct {
  id: string;
  name: string;
  brand: string;
  supplier: string;
  category: 'traditional' | 'phytopharmaceutical' | 'mass-market';
  price: number;
  currency: string;
  commissionRate: number;
  qualityScore: number;
  rating?: number;
  reviewCount?: number;
  affiliateUrl: string;
  imageUrl?: string;
  description?: string;
  tags: string[];
  availability: boolean;
  
  // Calculated scores
  profitMargin: number;
  userValueScore: number;
  compositeScore: number;
  regionalScore: number;
  
  // Processing metadata
  source: string;
  lastUpdated: Date;
  processingPriority: number;
}

export interface ProcessingCriteria {
  symptoms?: string[];
  herbs?: string[];
  supplements?: string[];
  priceRange?: { min: number; max: number };
  qualityThreshold?: number;
  ratingThreshold?: number;
  commissionThreshold?: number;
  userSegment?: 'quality-focused' | 'price-sensitive' | 'balanced';
  region?: string;
  excludeSuppliers?: string[];
  includeSuppliers?: string[];
}

export interface ProcessingResult {
  products: ProcessedProduct[];
  summary: {
    totalFound: number;
    totalProcessed: number;
    averageQualityScore: number;
    averageCommissionRate: number;
    topSuppliers: string[];
    recommendations: string[];
  };
  metadata: {
    processingTime: number;
    sourcesUsed: string[];
    filtersApplied: string[];
  };
}

// API Provider Interface
export interface APIProvider {
  name: string;
  apiKey: string;
  baseUrl: string;
  commission: number;
  enabled: boolean;
  priority: number;
  rateLimit: number;
  lastUsed?: Date;
}

// Data Processing Hub
export class DataProcessingHub {
  private providers: APIProvider[];
  private affiliateOptimizer: AffiliateOptimizer;
  private productAutomation: ProductAutomation;
  private qualityAnalyzer: DatabaseQualityAnalyzer;
  private processingQueue: Array<{ criteria: ProcessingCriteria; priority: number }> = [];
  private cache: Map<string, ProcessedProduct[]> = new Map();
  
  constructor(providers: APIProvider[]) {
    this.providers = providers.filter(p => p.enabled);
    this.affiliateOptimizer = new AffiliateOptimizer([]);
    this.productAutomation = new ProductAutomation(providers);
    this.qualityAnalyzer = new DatabaseQualityAnalyzer();
  }

  // Main processing method
  async processData(criteria: ProcessingCriteria): Promise<ProcessingResult> {
    const startTime = Date.now();
    const cacheKey = this.generateCacheKey(criteria);
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return {
        products: cached,
        summary: this.generateSummary(cached),
        metadata: {
          processingTime: 0,
          sourcesUsed: ['cache'],
          filtersApplied: Object.keys(criteria)
        }
      };
    }

    // Fetch from all enabled providers
    const rawProducts = await this.fetchFromAllProviders(criteria);
    
    // Process and score products
    const processedProducts = await this.processAndScore(rawProducts, criteria);
    
    // Apply intelligent sorting
    const sortedProducts = this.applyIntelligentSorting(processedProducts, criteria);
    
    // Cache results
    this.cache.set(cacheKey, sortedProducts);
    
    const processingTime = Date.now() - startTime;
    
    return {
      products: sortedProducts,
      summary: this.generateSummary(sortedProducts),
      metadata: {
        processingTime,
        sourcesUsed: this.providers.map(p => p.name),
        filtersApplied: Object.keys(criteria)
      }
    };
  }

  // Fetch data from all providers
  private async fetchFromAllProviders(criteria: ProcessingCriteria): Promise<any[]> {
    const allProducts: any[] = [];
    
    // Sort providers by priority
    const sortedProviders = this.providers.sort((a, b) => b.priority - a.priority);
    
    for (const provider of sortedProviders) {
      try {
        const products = await this.fetchFromProvider(provider, criteria);
        allProducts.push(...products);
        
        // Update last used timestamp
        provider.lastUsed = new Date();
        
        // Rate limiting
        if (provider.rateLimit > 0) {
          await this.delay(1000 / provider.rateLimit);
        }
      } catch (error) {
        console.error(`Error fetching from ${provider.name}:`, error);
      }
    }
    
    return allProducts;
  }

  // Fetch from specific provider
  private async fetchFromProvider(provider: APIProvider, criteria: ProcessingCriteria): Promise<any[]> {
    switch (provider.name.toLowerCase()) {
      case 'amazon':
        return await this.productAutomation.amazonAPI.searchProducts(
          this.buildSearchQuery(criteria),
          this.buildFilters(criteria)
        );
      case 'iherb':
        return await this.productAutomation.iherbAPI.searchProducts(
          this.buildSearchQuery(criteria),
          this.buildFilters(criteria)
        );
      default:
        // Mock data for other providers
        return this.generateMockProducts(provider, criteria);
    }
  }

  // Process and score products
  private async processAndScore(rawProducts: any[], criteria: ProcessingCriteria): Promise<ProcessedProduct[]> {
    return rawProducts.map(product => {
      const processed: ProcessedProduct = {
        id: product.id,
        name: product.name,
        brand: product.brand,
        supplier: product.supplier || 'Unknown',
        category: this.categorizeProduct(product),
        price: product.price,
        currency: product.currency || 'USD',
        commissionRate: this.getCommissionRate(product),
        qualityScore: (await this.qualityAnalyzer.analyzeProductQuality(product)).score,
        rating: product.rating,
        reviewCount: product.reviewCount,
        affiliateUrl: product.affiliateUrl,
        imageUrl: product.imageUrl,
        description: product.description,
        tags: product.tags || [],
        availability: product.availability !== false,
        
        // Calculated scores
        profitMargin: this.calculateProfitMargin(product),
        userValueScore: this.calculateUserValueScore(product),
        compositeScore: 0, // Will be calculated in sorting
        regionalScore: this.calculateRegionalScore(product, criteria.region),
        
        // Metadata
        source: product.source || 'unknown',
        lastUpdated: new Date(),
        processingPriority: this.calculateProcessingPriority(product, criteria)
      };
      
      return processed;
    });
  }

  // Apply intelligent sorting based on criteria
  private applyIntelligentSorting(products: ProcessedProduct[], criteria: ProcessingCriteria): ProcessedProduct[] {
    const userSegment = criteria.userSegment || 'balanced';
    
    return products.sort((a, b) => {
      let aScore = 0;
      let bScore = 0;
      
      switch (userSegment) {
        case 'quality-focused':
          aScore = (a.qualityScore * 0.6) + (a.userValueScore * 0.3) + (a.profitMargin * 0.1);
          bScore = (b.qualityScore * 0.6) + (b.userValueScore * 0.3) + (b.profitMargin * 0.1);
          break;
        case 'price-sensitive':
          aScore = (a.userValueScore * 0.7) + (a.profitMargin * 0.2) + (a.qualityScore * 0.1);
          bScore = (b.userValueScore * 0.7) + (b.profitMargin * 0.2) + (b.qualityScore * 0.1);
          break;
        case 'balanced':
        default:
          aScore = (a.qualityScore * 0.4) + (a.userValueScore * 0.4) + (a.profitMargin * 0.2);
          bScore = (b.qualityScore * 0.4) + (b.userValueScore * 0.4) + (b.profitMargin * 0.2);
          break;
      }
      
      // Update composite score
      a.compositeScore = aScore;
      b.compositeScore = bScore;
      
      return bScore - aScore;
    });
  }

  // Helper methods
  private categorizeProduct(product: any): 'traditional' | 'phytopharmaceutical' | 'mass-market' {
    const name = product.name.toLowerCase();
    const description = product.description?.toLowerCase() || '';
    
    if (name.includes('tincture') || name.includes('loose') || name.includes('powder')) {
      return 'traditional';
    } else if (name.includes('extract') || name.includes('standardized') || name.includes('capsule')) {
      return 'phytopharmaceutical';
    } else {
      return 'mass-market';
    }
  }

  private getCommissionRate(product: any): number {
    const supplier = this.providers.find(p => p.name.toLowerCase() === product.supplier?.toLowerCase());
    return supplier?.commission || 0.05;
  }

  private calculateProfitMargin(product: any): number {
    const commissionRate = this.getCommissionRate(product);
    const qualityCost = (10 - product.qualityScore) * 0.01; // Higher quality = lower cost
    return Math.max(0, commissionRate - qualityCost);
  }

  private calculateUserValueScore(product: any): number {
    const qualityScore = product.qualityScore || 5;
    const priceScore = Math.max(0, 10 - (product.price / 10)); // Lower price = higher score
    const ratingScore = product.rating || 3;
    
    return (qualityScore * 0.5) + (priceScore * 0.3) + (ratingScore * 0.2);
  }

  private calculateRegionalScore(product: any, region?: string): number {
    if (!region) return 5; // Neutral score if no region specified
    
    // Simple regional scoring - can be enhanced
    const regionalFactors = {
      'US': 1.0,
      'UK': 0.9,
      'CA': 0.8,
      'AU': 0.7
    };
    
    return regionalFactors[region as keyof typeof regionalFactors] || 0.5;
  }

  private calculateProcessingPriority(product: any, criteria: ProcessingCriteria): number {
    let priority = 5; // Base priority
    
    // Boost priority for products matching specific criteria
    if (criteria.herbs?.some(herb => product.name.toLowerCase().includes(herb))) {
      priority += 3;
    }
    if (criteria.symptoms?.some(symptom => product.tags?.includes(symptom))) {
      priority += 2;
    }
    if (product.qualityScore >= 8) {
      priority += 2;
    }
    if (product.commissionRate >= 0.1) {
      priority += 1;
    }
    
    return priority;
  }

  private buildSearchQuery(criteria: ProcessingCriteria): string {
    const terms: string[] = [];
    
    if (criteria.herbs) terms.push(...criteria.herbs);
    if (criteria.symptoms) terms.push(...criteria.symptoms);
    if (criteria.supplements) terms.push(...criteria.supplements);
    
    return terms.join(' ');
  }

  private buildFilters(criteria: ProcessingCriteria): Record<string, any> {
    const filters: Record<string, any> = {};
    
    if (criteria.priceRange) {
      filters.priceMin = criteria.priceRange.min;
      filters.priceMax = criteria.priceRange.max;
    }
    
    if (criteria.qualityThreshold) {
      filters.minQuality = criteria.qualityThreshold;
    }
    
    if (criteria.ratingThreshold) {
      filters.minRating = criteria.ratingThreshold;
    }
    
    return filters;
  }

  private generateMockProducts(provider: APIProvider, criteria: ProcessingCriteria): any[] {
    // Generate realistic mock data based on criteria
    const mockProducts = [];
    const searchTerms = this.buildSearchQuery(criteria);
    
    for (let i = 1; i <= 5; i++) {
      mockProducts.push({
        id: `${provider.name.toLowerCase()}-${i}`,
        name: `${searchTerms} Product ${i}`,
        brand: `${provider.name} Brand`,
        supplier: provider.name,
        price: 10 + (i * 5),
        currency: 'USD',
        affiliateUrl: `https://${provider.baseUrl}/product-${i}`,
        imageUrl: `/images/mock-product-${i}.jpg`,
        rating: 4.0 + (Math.random() * 1),
        reviewCount: Math.floor(Math.random() * 1000),
        availability: true,
        categories: ['supplements', 'herbs'],
        tags: criteria.herbs || [],
        source: provider.name
      });
    }
    
    return mockProducts;
  }

  private generateCacheKey(criteria: ProcessingCriteria): string {
    return JSON.stringify(criteria);
  }

  private generateSummary(products: ProcessedProduct[]): any {
    if (products.length === 0) {
      return {
        totalFound: 0,
        totalProcessed: 0,
        averageQualityScore: 0,
        averageCommissionRate: 0,
        topSuppliers: [],
        recommendations: []
      };
    }

    const suppliers = products.reduce((acc, p) => {
      acc[p.supplier] = (acc[p.supplier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topSuppliers = Object.entries(suppliers)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([name]) => name);

    const avgQuality = products.reduce((sum, p) => sum + p.qualityScore, 0) / products.length;
    const avgCommission = products.reduce((sum, p) => sum + p.commissionRate, 0) / products.length;

    const recommendations = [];
    if (avgQuality < 7) recommendations.push('Consider higher quality suppliers');
    if (avgCommission < 0.08) recommendations.push('Look for higher commission rates');
    if (products.length < 10) recommendations.push('Expand search criteria for more options');

    return {
      totalFound: products.length,
      totalProcessed: products.length,
      averageQualityScore: Math.round(avgQuality * 10) / 10,
      averageCommissionRate: Math.round(avgCommission * 100) / 100,
      topSuppliers,
      recommendations
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Public methods for external use
  async getRecommendations(criteria: ProcessingCriteria, limit: number = 5): Promise<ProcessedProduct[]> {
    const result = await this.processData(criteria);
    return result.products.slice(0, limit);
  }

  async getTopProducts(category: string, limit: number = 10): Promise<ProcessedProduct[]> {
    const criteria: ProcessingCriteria = {
      herbs: [category],
      userSegment: 'balanced'
    };
    
    const result = await this.processData(criteria);
    return result.products.slice(0, limit);
  }

  async updateProductData(productId: string): Promise<ProcessedProduct | null> {
    // Implementation for updating specific product data
    // This would fetch fresh data for a specific product
    return null;
  }

  // Cache management
  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Factory function for easy instantiation
export function createDataProcessingHub(): DataProcessingHub {
  const providers: APIProvider[] = [
    {
      name: 'Amazon',
      apiKey: process.env.AMAZON_ASSOCIATES_API_KEY || '',
      baseUrl: 'https://amazon.com',
      commission: 0.06,
      enabled: true,
      priority: 1,
      rateLimit: 5 // requests per second
    },
    {
      name: 'iHerb',
      apiKey: process.env.IHERB_API_KEY || '',
      baseUrl: 'https://iherb.com',
      commission: 0.08,
      enabled: true,
      priority: 2,
      rateLimit: 3
    },
    {
      name: 'Vitacost',
      apiKey: process.env.VITACOST_API_KEY || '',
      baseUrl: 'https://vitacost.com',
      commission: 0.07,
      enabled: true,
      priority: 3,
      rateLimit: 2
    }
  ];

  return new DataProcessingHub(providers);
} 