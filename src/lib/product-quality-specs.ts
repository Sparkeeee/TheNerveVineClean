// Product Quality Specifications System
// Defines quality criteria for different herbs and product types

import type { Product } from './product-automation';

export interface QualitySpecification {
  herbSlug: string;
  herbName: string;
  productType: 'tincture' | 'capsule' | 'tea' | 'essential-oil' | 'powder' | 'tablet';
  requiredTerms: string[]; // Must contain these terms
  preferredTerms: string[]; // Bonus points for these terms
  avoidTerms: string[]; // Penalty or exclusion for these terms
  standardization?: {
    compound: string; // e.g., "hypericin", "rosmarinic acid"
    percentage: number; // e.g., 0.3% for St. John's Wort
    unit?: string; // "%", "mg", etc.
  };
  alcoholSpecs?: {
    ratio: string; // e.g., "1:1", "1:4"
    organic: boolean;
    type?: string[]; // ["grain alcohol", "ethanol"]
  };
  dosageSpecs?: {
    minAmount: number;
    unit: string;
    frequency?: string; // "daily", "twice daily"
  };
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  ratingThreshold: number;
  reviewCountThreshold: number;
  brandPreferences?: string[];
  brandAvoid?: string[];
}

export interface ProductQualityScore {
  score: number; // 0-100
  reasons: string[];
  warnings: string[];
  matches: {
    required: string[];
    preferred: string[];
    avoid: string[];
  };
}

// Quality specifications for different herbs
export const qualitySpecs: QualitySpecification[] = [
  {
    herbSlug: 'st-johns-wort',
    herbName: "St. John's Wort",
    productType: 'capsule',
    requiredTerms: ['standardized', 'hypericin', 'extract'],
    preferredTerms: ['0.3%', '300mg', 'perforatum', 'organic', 'certified'],
    avoidTerms: ['dietary supplement', 'proprietary blend', 'herbal blend'],
    standardization: {
      compound: 'hypericin',
      percentage: 0.3,
      unit: '%'
    },
    dosageSpecs: {
      minAmount: 300,
      unit: 'mg',
      frequency: 'daily'
    },
    priceRange: {
      min: 10,
      max: 50,
      currency: 'USD'
    },
    ratingThreshold: 4.0,
    reviewCountThreshold: 100
  },
  {
    herbSlug: 'st-johns-wort',
    herbName: "St. John's Wort",
    productType: 'tincture',
    requiredTerms: ['extract', 'tincture', 'hypericin'],
    preferredTerms: ['1:1', 'organic alcohol', 'fresh herb', 'certified'],
    avoidTerms: ['diluted', '1:10', 'glycerin'],
    alcoholSpecs: {
      ratio: '1:1',
      organic: true,
      type: ['grain alcohol', 'ethanol']
    },
    standardization: {
      compound: 'hypericin',
      percentage: 0.3,
      unit: '%'
    },
    dosageSpecs: {
      minAmount: 30,
      unit: 'drops',
      frequency: 'twice daily'
    },
    priceRange: {
      min: 15,
      max: 40,
      currency: 'USD'
    },
    ratingThreshold: 4.0,
    reviewCountThreshold: 50
  },
  {
    herbSlug: 'lemon-balm',
    herbName: 'Lemon Balm',
    productType: 'tincture',
    requiredTerms: ['melissa', 'officinalis', 'extract'],
    preferredTerms: ['1:1', 'organic alcohol', 'fresh herb', 'rosmarinic acid'],
    avoidTerms: ['diluted', '1:10', 'glycerin'],
    alcoholSpecs: {
      ratio: '1:1',
      organic: true
    },
    standardization: {
      compound: 'rosmarinic acid',
      percentage: 1.0,
      unit: '%'
    },
    dosageSpecs: {
      minAmount: 30,
      unit: 'drops',
      frequency: 'twice daily'
    },
    priceRange: {
      min: 12,
      max: 35,
      currency: 'USD'
    },
    ratingThreshold: 4.0,
    reviewCountThreshold: 50
  },
  {
    herbSlug: 'valerian',
    herbName: 'Valerian Root',
    productType: 'capsule',
    requiredTerms: ['valerian', 'root', 'extract'],
    preferredTerms: ['standardized', 'valerenic acid', 'organic', 'fresh'],
    avoidTerms: ['proprietary blend', 'herbal blend', 'dietary supplement'],
    standardization: {
      compound: 'valerenic acid',
      percentage: 0.8,
      unit: '%'
    },
    dosageSpecs: {
      minAmount: 300,
      unit: 'mg',
      frequency: 'daily'
    },
    priceRange: {
      min: 8,
      max: 30,
      currency: 'USD'
    },
    ratingThreshold: 4.0,
    reviewCountThreshold: 100
  },
  {
    herbSlug: 'chamomile',
    herbName: 'Chamomile',
    productType: 'tea',
    requiredTerms: ['chamomile', 'matricaria', 'recutita'],
    preferredTerms: ['organic', 'whole flower', 'certified', 'loose leaf'],
    avoidTerms: ['blend', 'flavoring', 'artificial'],
    dosageSpecs: {
      minAmount: 1,
      unit: 'tsp',
      frequency: 'as needed'
    },
    priceRange: {
      min: 5,
      max: 25,
      currency: 'USD'
    },
    ratingThreshold: 4.0,
    reviewCountThreshold: 50
  }
];

// Product quality analyzer
export class ProductQualityAnalyzer {
  
  // Analyze a product against quality specifications
  analyzeProduct(product: Product, specs: QualitySpecification): ProductQualityScore {
    const score: ProductQualityScore = { score: 0, reasons: [], warnings: [], matches: { required: [], preferred: [], avoid: [] } };
    
    // Check required terms
    const requiredMatches = this.checkRequiredTerms(product, specs);
    score.matches.required = requiredMatches;
    
    if (requiredMatches.length < specs.requiredTerms.length) {
      score.warnings.push(`Missing required terms: ${specs.requiredTerms.filter(term => !requiredMatches.includes(term)).join(', ')}`);
      score.score -= 30;
    } else {
      score.score += 40;
      score.reasons.push('All required terms present');
    }
    
    // Check preferred terms
    const preferredMatches = this.checkPreferredTerms(product, specs);
    score.matches.preferred = preferredMatches;
    
    if (preferredMatches.length > 0) {
      score.score += preferredMatches.length * 10;
      score.reasons.push(`Preferred terms found: ${preferredMatches.join(', ')}`);
    }
    
    // Check avoided terms
    const avoidedMatches = this.checkAvoidedTerms(product, specs);
    score.matches.avoid = avoidedMatches;
    
    if (avoidedMatches.length > 0) {
      score.score -= avoidedMatches.length * 15;
      score.warnings.push(`Avoided terms found: ${avoidedMatches.join(', ')}`);
    }
    
    // Check standardization
    if (specs.standardization) {
      const standardizationScore = this.checkStandardization(product, specs.standardization);
      score.score += standardizationScore;
      if (standardizationScore > 0) {
        score.reasons.push(`Standardization requirements met`);
      }
    }
    
    // Check alcohol specifications for tinctures
    if (specs.alcoholSpecs && specs.productType === 'tincture') {
      const alcoholScore = this.checkAlcoholSpecs(product, specs.alcoholSpecs);
      score.score += alcoholScore;
      if (alcoholScore > 0) {
        score.reasons.push('Alcohol specifications met');
      }
    }
    
    // Check price range
    if (product.price) {
      const price = parseFloat(product.price.toString().replace(/[^0-9.]/g, ''));
      if (price >= specs.priceRange.min && price <= specs.priceRange.max) {
        score.score += 10;
        score.reasons.push('Price within acceptable range');
      } else {
        score.score -= 10;
        score.warnings.push(`Price ${price} outside range ${specs.priceRange.min}-${specs.priceRange.max}`);
      }
    }
    
    // Check rating
    if (product.rating && product.rating >= specs.ratingThreshold) {
      score.score += 10;
      score.reasons.push(`Rating ${product.rating} meets threshold`);
    } else if (product.rating) {
      score.score -= 10;
      score.warnings.push(`Rating ${product.rating} below threshold ${specs.ratingThreshold}`);
    }
    
    // Check review count
    if (product.reviewCount && product.reviewCount >= specs.reviewCountThreshold) {
      score.score += 5;
      score.reasons.push(`Sufficient reviews (${product.reviewCount})`);
    } else if (product.reviewCount) {
      score.score -= 5;
      score.warnings.push(`Insufficient reviews (${product.reviewCount})`);
    }
    
    // Ensure score is within bounds
    score.score = Math.max(0, Math.min(100, score.score));
    
    return score;
  }
  
  private checkRequiredTerms(product: Product, specs: QualitySpecification): string[] {
    const productText = `${product.name} ${product.description} ${product.brand || ''}`.toLowerCase();
    return specs.requiredTerms.filter(term => 
      productText.includes(term.toLowerCase())
    );
  }
  
  private checkPreferredTerms(product: Product, specs: QualitySpecification): string[] {
    const productText = `${product.name} ${product.description} ${product.brand || ''}`.toLowerCase();
    return specs.preferredTerms.filter(term => 
      productText.includes(term.toLowerCase())
    );
  }
  
  private checkAvoidedTerms(product: Product, specs: QualitySpecification): string[] {
    const productText = `${product.name} ${product.description} ${product.brand || ''}`.toLowerCase();
    return specs.avoidTerms.filter(term => 
      productText.includes(term.toLowerCase())
    );
  }
  
  private checkStandardization(product: Product, standardization: QualitySpecification['standardization']): number {
    if (!standardization) return 0;
    const productText = `${product.name} ${product.description}`.toLowerCase();
    const compound = standardization.compound.toLowerCase();
    
    if (productText.includes(compound)) {
      // Look for percentage or amount
      const percentageMatch = productText.match(new RegExp(`${compound}.*?([0-9.]+)%`, 'i'));
      const amountMatch = productText.match(new RegExp(`${compound}.*?([0-9.]+)\\s*(mg|mcg)`, 'i'));
      
      if (percentageMatch) {
        const foundPercentage = parseFloat(percentageMatch[1]);
        if (foundPercentage >= standardization.percentage) {
          return 20;
        } else {
          return 10;
        }
      } else if (amountMatch) {
        return 15;
      } else {
        return 10;
      }
    }
    
    return 0;
  }
  
  private checkAlcoholSpecs(product: Product, alcoholSpecs: QualitySpecification['alcoholSpecs']): number {
    if (!alcoholSpecs) return 0;
    const productText = `${product.name} ${product.description}`.toLowerCase();
    let score = 0;
    
    // Check for ratio
    if (alcoholSpecs.ratio && productText.includes(alcoholSpecs.ratio.toLowerCase())) {
      score += 15;
    }
    
    // Check for organic alcohol
    if (alcoholSpecs.organic && productText.includes('organic alcohol')) {
      score += 10;
    }
    
    // Check for alcohol type
    if (alcoholSpecs.type) {
      const hasCorrectType = alcoholSpecs.type.some(type => 
        productText.includes(type.toLowerCase())
      );
      if (hasCorrectType) {
        score += 5;
      }
    }
    
    return score;
  }
  
  // Get quality specifications for a herb and product type
  getSpecsForHerb(herbSlug: string, productType: string): QualitySpecification[] {
    return qualitySpecs.filter(spec => 
      spec.herbSlug === herbSlug && spec.productType === productType
    );
  }
  
  // Filter and rank products based on quality specifications
  filterProductsByQuality(products: Product[], herbSlug: string, productType: string): (Product & { qualityScore: ProductQualityScore })[] {
    const specs = this.getSpecsForHerb(herbSlug, productType);
    const analyzer = new ProductQualityAnalyzer();
    if (specs.length === 0) return [];
    return products
      .map(product => {
        const bestScore = specs.reduce((best, spec) => {
          const score = analyzer.analyzeProduct(product, spec);
          return (score.score > best.score ? score : best) as ProductQualityScore;
        }, { score: 0, reasons: [], warnings: [], matches: { required: [], preferred: [], avoid: [] } } as ProductQualityScore);
        return {
          ...product,
          qualityScore: bestScore
        };
      })
      .filter(product => product.qualityScore.score >= 50)
      .sort((a, b) => b.qualityScore.score - a.qualityScore.score);
  }
} 