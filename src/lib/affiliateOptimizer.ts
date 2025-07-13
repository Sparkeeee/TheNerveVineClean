export interface AffiliateProduct {
  id: string;
  name: string;
  brand: string;
  supplier: string;
  category: 'traditional' | 'phytopharmaceutical' | 'mass-market';
  qualityScore: number; // 1-10
  commissionRate: number; // 0.05-0.15
  price: number;
  rating: number; // 1-5
  reviewCount: number;
  organic: boolean;
  standardized: boolean;
  thirdPartyTested: boolean;
  affiliateLink: string;
  profitMargin: number; // Calculated
  userValueScore: number; // Calculated
}

export interface AffiliateSupplier {
  name: string;
  category: 'traditional' | 'phytopharmaceutical' | 'mass-market';
  commissionRate: number;
  qualityFocus: number; // 1-10
  reliability: number; // 1-10
  shippingSpeed: number; // 1-10
  returnPolicy: number; // 1-10
  customerService: number; // 1-10
}

// Quality-focused suppliers (higher commission, better products)
const qualitySuppliers: AffiliateSupplier[] = [
  {
    name: 'Mountain Rose Herbs',
    category: 'traditional',
    commissionRate: 0.12,
    qualityFocus: 9,
    reliability: 9,
    shippingSpeed: 8,
    returnPolicy: 8,
    customerService: 9
  },
  {
    name: 'Herb Pharm',
    category: 'traditional',
    commissionRate: 0.10,
    qualityFocus: 9,
    reliability: 9,
    shippingSpeed: 8,
    returnPolicy: 8,
    customerService: 8
  },
  {
    name: 'Thorne Research',
    category: 'phytopharmaceutical',
    commissionRate: 0.12,
    qualityFocus: 10,
    reliability: 9,
    shippingSpeed: 8,
    returnPolicy: 8,
    customerService: 9
  },
  {
    name: 'Pure Encapsulations',
    category: 'phytopharmaceutical',
    commissionRate: 0.10,
    qualityFocus: 9,
    reliability: 9,
    shippingSpeed: 8,
    returnPolicy: 8,
    customerService: 8
  }
];

// Mass market suppliers (lower commission, wider reach)
const massMarketSuppliers: AffiliateSupplier[] = [
  {
    name: 'Amazon',
    category: 'mass-market',
    commissionRate: 0.06,
    qualityFocus: 6,
    reliability: 9,
    shippingSpeed: 10,
    returnPolicy: 9,
    customerService: 7
  },
  {
    name: 'iHerb',
    category: 'mass-market',
    commissionRate: 0.08,
    qualityFocus: 7,
    reliability: 8,
    shippingSpeed: 8,
    returnPolicy: 8,
    customerService: 7
  },
  {
    name: 'Vitacost',
    category: 'mass-market',
    commissionRate: 0.08,
    qualityFocus: 7,
    reliability: 8,
    shippingSpeed: 8,
    returnPolicy: 8,
    customerService: 7
  }
];

export class AffiliateOptimizer {
  private products: AffiliateProduct[] = [];

  // Add product to optimization pool
  addProduct(product: AffiliateProduct) {
    this.products.push(product);
  }

  // Calculate profit margin (commission - quality cost)
  calculateProfitMargin(product: AffiliateProduct): number {
    const qualityCost = (10 - product.qualityScore) * 0.01; // Higher quality = lower cost
    return product.commissionRate - qualityCost;
  }

  // Calculate user value score (quality + price + reviews)
  calculateUserValueScore(product: AffiliateProduct): number {
    const qualityWeight = 0.4;
    const priceWeight = 0.3;
    const reviewWeight = 0.3;

    const qualityScore = product.qualityScore / 10;
    const priceScore = Math.max(0, 1 - (product.price / 100)); // Lower price = higher score
    const reviewScore = (product.rating * Math.log(product.reviewCount + 1)) / 25; // Weighted by review count

    return (qualityScore * qualityWeight) + (priceScore * priceWeight) + (reviewScore * reviewWeight);
  }

  // Smart recommendation algorithm
  getOptimalRecommendations(
    category: 'traditional' | 'phytopharmaceutical' | 'mass-market',
    maxResults: number = 3
  ): AffiliateProduct[] {
    const categoryProducts = this.products.filter(p => p.category === category);

    // Calculate scores for all products
    const scoredProducts = categoryProducts.map(product => ({
      ...product,
      profitMargin: this.calculateProfitMargin(product),
      userValueScore: this.calculateUserValueScore(product)
    }));

    // Sort by combined score (profit + user value)
    const sortedProducts = scoredProducts.sort((a, b) => {
      const aScore = (a.profitMargin * 0.6) + (a.userValueScore * 0.4);
      const bScore = (b.profitMargin * 0.6) + (b.userValueScore * 0.4);
      return bScore - aScore;
    });

    return sortedProducts.slice(0, maxResults);
  }

  // Get recommendations by quality tier
  getQualityTierRecommendations(
    tier: 'premium' | 'standard' | 'budget',
    category: 'traditional' | 'phytopharmaceutical' | 'mass-market'
  ): AffiliateProduct[] {
    const categoryProducts = this.products.filter(p => p.category === category);
    
    let qualityFilter: (product: AffiliateProduct) => boolean;
    
    switch (tier) {
      case 'premium':
        qualityFilter = (p) => p.qualityScore >= 8 && p.organic && p.thirdPartyTested;
        break;
      case 'standard':
        qualityFilter = (p) => p.qualityScore >= 6 && p.rating >= 4;
        break;
      case 'budget':
        qualityFilter = (p) => p.qualityScore >= 4 && p.price <= 30;
        break;
    }

    const filteredProducts = categoryProducts.filter(qualityFilter);
    
    // Sort by profit margin for each tier
    return filteredProducts
      .map(p => ({ ...p, profitMargin: this.calculateProfitMargin(p) }))
      .sort((a, b) => b.profitMargin - a.profitMargin)
      .slice(0, 3);
  }

  // Get supplier recommendations
  getSupplierRecommendations(category: 'traditional' | 'phytopharmaceutical' | 'mass-market'): AffiliateSupplier[] {
    const allSuppliers = [...qualitySuppliers, ...massMarketSuppliers];
    return allSuppliers
      .filter(s => s.category === category)
      .sort((a, b) => {
        // Weight: commission rate (40%) + quality focus (30%) + reliability (30%)
        const aScore = (a.commissionRate * 0.4) + (a.qualityFocus / 10 * 0.3) + (a.reliability / 10 * 0.3);
        const bScore = (b.commissionRate * 0.4) + (b.qualityFocus / 10 * 0.3) + (b.reliability / 10 * 0.3);
        return bScore - aScore;
      });
  }

  // Dynamic pricing optimization
  optimizeForUserSegment(
    segment: 'quality-focused' | 'price-sensitive' | 'balanced',
    category: 'traditional' | 'phytopharmaceutical' | 'mass-market'
  ): AffiliateProduct[] {
    const categoryProducts = this.products.filter(p => p.category === category);
    
    const scoredProducts = categoryProducts.map(product => ({
      ...product,
      profitMargin: this.calculateProfitMargin(product),
      userValueScore: this.calculateUserValueScore(product)
    }));

    switch (segment) {
      case 'quality-focused':
        return scoredProducts
          .filter(p => p.qualityScore >= 8)
          .sort((a, b) => (a.userValueScore * 0.7) + (a.profitMargin * 0.3) - (b.userValueScore * 0.7) - (b.profitMargin * 0.3))
          .slice(0, 3);
      
      case 'price-sensitive':
        return scoredProducts
          .filter(p => p.price <= 50)
          .sort((a, b) => (a.userValueScore * 0.8) + (a.profitMargin * 0.2) - (b.userValueScore * 0.8) - (b.profitMargin * 0.2))
          .slice(0, 3);
      
      case 'balanced':
        return scoredProducts
          .sort((a, b) => (a.userValueScore * 0.5) + (a.profitMargin * 0.5) - (b.userValueScore * 0.5) - (b.profitMargin * 0.5))
          .slice(0, 3);
    }
  }
}

// Usage example
export const affiliateOptimizer = new AffiliateOptimizer();

// Example product data
export const sampleProducts: AffiliateProduct[] = [
  {
    id: 'ashwagandha-mountain-rose',
    name: 'Organic Ashwagandha Root Powder',
    brand: 'Mountain Rose Herbs',
    supplier: 'Mountain Rose Herbs',
    category: 'traditional',
    qualityScore: 9,
    commissionRate: 0.12,
    price: 25.99,
    rating: 4.8,
    reviewCount: 150,
    organic: true,
    standardized: false,
    thirdPartyTested: true,
    affiliateLink: 'https://mountainroseherbs.com/ashwagandha',
    profitMargin: 0,
    userValueScore: 0
  },
  {
    id: 'ashwagandha-amazon',
    name: 'Ashwagandha Supplement',
    brand: 'NOW Foods',
    supplier: 'Amazon',
    category: 'mass-market',
    qualityScore: 7,
    commissionRate: 0.06,
    price: 15.99,
    rating: 4.5,
    reviewCount: 2500,
    organic: false,
    standardized: true,
    thirdPartyTested: true,
    affiliateLink: 'https://amazon.com/ashwagandha-now',
    profitMargin: 0,
    userValueScore: 0
  }
]; 