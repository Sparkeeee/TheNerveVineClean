import { PrismaClient } from '@prisma/client';

export interface DatabaseQualityScore {
  score: number; // 0-100
  reasons: string[];
  warnings: string[];
  matches: {
    required: string[];
    preferred: string[];
    avoid: string[];
    standardization: string[];
    alcoholSpecs: string[];
    dosageSpecs: string[];
  };
  qualitySpec?: any;
}

export class DatabaseQualityAnalyzer {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // Analyze product quality based on QualitySpecification database records
  async analyzeProductQuality(
    product: any, 
    herbSlug?: string, 
    supplementSlug?: string,
    productType?: string
  ): Promise<DatabaseQualityScore> {
    const score: DatabaseQualityScore = {
      score: 0,
      reasons: [],
      warnings: [],
      matches: {
        required: [],
        preferred: [],
        avoid: [],
        standardization: [],
        alcoholSpecs: [],
        dosageSpecs: []
      }
    };

    try {
      // Get quality specifications from database
      let qualitySpecs = [];

      if (herbSlug) {
        qualitySpecs = await this.prisma.qualitySpecification.findMany({
          where: { 
            herbSlug: herbSlug,
            ...(productType && { productType: productType })
          }
        });
      }

      if (qualitySpecs.length === 0) {
        // Fallback to basic analysis if no quality specs found
        this.analyzeBasicProduct(product, score);
        return score;
      }

      // Analyze against all matching quality specifications
      const bestScore = await this.analyzeAgainstQualitySpecs(product, qualitySpecs, score);

      // Ensure score is within bounds
      score.score = Math.max(0, Math.min(100, bestScore));

    } catch (error) {
      console.error('Error analyzing product quality:', error);
      score.warnings.push('Error analyzing product quality');
    }

    return score;
  }

  private async analyzeAgainstQualitySpecs(
    product: any, 
    qualitySpecs: any[], 
    score: DatabaseQualityScore
  ): Promise<number> {
    let bestScore = 0;
    let bestSpec = null;

    for (const spec of qualitySpecs) {
      const specScore = await this.analyzeSingleQualitySpec(product, spec);
      
      if (specScore.score > bestScore) {
        bestScore = specScore.score;
        bestSpec = spec;
        // Update the main score object with the best analysis
        score.reasons = specScore.reasons;
        score.warnings = specScore.warnings;
        score.matches = specScore.matches;
        score.qualitySpec = spec;
      }
    }

    return bestScore;
  }

  private async analyzeSingleQualitySpec(product: any, spec: any): Promise<DatabaseQualityScore> {
    const score: DatabaseQualityScore = {
      score: 0,
      reasons: [],
      warnings: [],
      matches: {
        required: [],
        preferred: [],
        avoid: [],
        standardization: [],
        alcoholSpecs: [],
        dosageSpecs: []
      }
    };

    const productText = `${product.name} ${product.description} ${product.brand || ''}`.toLowerCase();

    // Check required terms
    const requiredTerms = Array.isArray(spec.requiredTerms) 
      ? spec.requiredTerms 
      : JSON.parse(spec.requiredTerms as string);
    
    const requiredMatches = this.findMatchingTerms(productText, requiredTerms);
    score.matches.required = requiredMatches;

    if (requiredMatches.length < requiredTerms.length) {
      const missingTerms = requiredTerms.filter(term => !requiredMatches.includes(term));
      score.warnings.push(`Missing required terms: ${missingTerms.join(', ')}`);
      score.score -= 30;
    } else {
      score.score += 40;
      score.reasons.push('All required terms present');
    }

    // Check preferred terms
    const preferredTerms = Array.isArray(spec.preferredTerms)
      ? spec.preferredTerms
      : JSON.parse(spec.preferredTerms as string);
    
    const preferredMatches = this.findMatchingTerms(productText, preferredTerms);
    score.matches.preferred = preferredMatches;

    if (preferredMatches.length > 0) {
      score.score += preferredMatches.length * 10;
      score.reasons.push(`Preferred terms found: ${preferredMatches.join(', ')}`);
    }

    // Check avoid terms
    const avoidTerms = Array.isArray(spec.avoidTerms)
      ? spec.avoidTerms
      : JSON.parse(spec.avoidTerms as string);
    
    const avoidMatches = this.findMatchingTerms(productText, avoidTerms);
    score.matches.avoid = avoidMatches;

    if (avoidMatches.length > 0) {
      score.score -= avoidMatches.length * 15;
      score.warnings.push(`Avoided terms found: ${avoidMatches.join(', ')}`);
    }

    // Check standardization
    if (spec.standardization) {
      const standardization = Array.isArray(spec.standardization)
        ? spec.standardization
        : JSON.parse(spec.standardization as string);
      
      const standardizationScore = this.checkStandardization(product, standardization);
      score.score += standardizationScore;
      if (standardizationScore > 0) {
        score.reasons.push('Standardization requirements met');
        score.matches.standardization = ['standardization_match'];
      }
    }

    // Check alcohol specifications
    if (spec.alcoholSpecs) {
      const alcoholSpecs = Array.isArray(spec.alcoholSpecs)
        ? spec.alcoholSpecs
        : JSON.parse(spec.alcoholSpecs as string);
      
      const alcoholScore = this.checkAlcoholSpecs(product, alcoholSpecs);
      score.score += alcoholScore;
      if (alcoholScore > 0) {
        score.reasons.push('Alcohol specifications met');
        score.matches.alcoholSpecs = ['alcohol_match'];
      }
    }

    // Check dosage specifications
    if (spec.dosageSpecs) {
      const dosageSpecs = Array.isArray(spec.dosageSpecs)
        ? spec.dosageSpecs
        : JSON.parse(spec.dosageSpecs as string);
      
      const dosageScore = this.checkDosageSpecs(product, dosageSpecs);
      score.score += dosageScore;
      if (dosageScore > 0) {
        score.reasons.push('Dosage specifications met');
        score.matches.dosageSpecs = ['dosage_match'];
      }
    }

    // Check price range
    if (spec.priceRange) {
      const priceRange = Array.isArray(spec.priceRange)
        ? spec.priceRange
        : JSON.parse(spec.priceRange as string);
      
      if (product.price) {
        const price = parseFloat(product.price.toString().replace(/[^0-9.]/g, ''));
        if (price >= priceRange.min && price <= priceRange.max) {
          score.score += 10;
          score.reasons.push(`Price ${price} within range ${priceRange.min}-${priceRange.max}`);
        } else {
          score.score -= 10;
          score.warnings.push(`Price ${price} outside range ${priceRange.min}-${priceRange.max}`);
        }
      }
    }

    // Check rating threshold
    if (spec.ratingThreshold && product.rating) {
      if (product.rating >= spec.ratingThreshold) {
        score.score += 10;
        score.reasons.push(`Rating ${product.rating} meets threshold ${spec.ratingThreshold}`);
      } else {
        score.score -= 10;
        score.warnings.push(`Rating ${product.rating} below threshold ${spec.ratingThreshold}`);
      }
    }

    // Check review count threshold
    if (spec.reviewCountThreshold && product.reviewCount) {
      if (product.reviewCount >= spec.reviewCountThreshold) {
        score.score += 5;
        score.reasons.push(`Sufficient reviews (${product.reviewCount})`);
      } else {
        score.score -= 5;
        score.warnings.push(`Insufficient reviews (${product.reviewCount})`);
      }
    }

    // Check brand preferences
    if (spec.brandPreferences) {
      const brandPreferences = Array.isArray(spec.brandPreferences)
        ? spec.brandPreferences
        : JSON.parse(spec.brandPreferences as string);
      
      const productBrand = product.brand?.toLowerCase() || '';
      const hasPreferredBrand = brandPreferences.some((brand: string) => 
        productBrand.includes(brand.toLowerCase())
      );
      
      if (hasPreferredBrand) {
        score.score += 15;
        score.reasons.push('Product from preferred brand');
      }
    }

    // Check brand avoid
    if (spec.brandAvoid) {
      const brandAvoid = Array.isArray(spec.brandAvoid)
        ? spec.brandAvoid
        : JSON.parse(spec.brandAvoid as string);
      
      const productBrand = product.brand?.toLowerCase() || '';
      const hasAvoidedBrand = brandAvoid.some((brand: string) => 
        productBrand.includes(brand.toLowerCase())
      );
      
      if (hasAvoidedBrand) {
        score.score -= 20;
        score.warnings.push('Product from avoided brand');
      }
    }

    return score;
  }

  private checkStandardization(product: any, standardization: any): number {
    if (!standardization || !standardization.compound) return 0;
    
    const productText = `${product.name} ${product.description}`.toLowerCase();
    const compound = standardization.compound.toLowerCase();
    
    if (productText.includes(compound)) {
      // Look for percentage or amount
      const percentageMatch = productText.match(new RegExp(`${compound}.*?([0-9.]+)%`, 'i'));
      const amountMatch = productText.match(new RegExp(`${compound}.*?([0-9.]+)\\s*(mg|mcg)`, 'i'));
      
      if (percentageMatch) {
        const foundPercentage = parseFloat(percentageMatch[1]);
        if (standardization.percentage && foundPercentage >= standardization.percentage) {
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

  private checkAlcoholSpecs(product: any, alcoholSpecs: any): number {
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
      const hasCorrectType = alcoholSpecs.type.some((type: string) => 
        productText.includes(type.toLowerCase())
      );
      if (hasCorrectType) {
        score += 5;
      }
    }
    
    return score;
  }

  private checkDosageSpecs(product: any, dosageSpecs: any): number {
    if (!dosageSpecs) return 0;
    
    const productText = `${product.name} ${product.description}`.toLowerCase();
    let score = 0;
    
    // Check for minimum amount
    if (dosageSpecs.minAmount) {
      const amountMatch = productText.match(new RegExp(`([0-9.]+)\\s*${dosageSpecs.unit}`, 'i'));
      if (amountMatch) {
        const foundAmount = parseFloat(amountMatch[1]);
        if (foundAmount >= dosageSpecs.minAmount) {
          score += 10;
        }
      }
    }
    
    // Check for frequency
    if (dosageSpecs.frequency && productText.includes(dosageSpecs.frequency.toLowerCase())) {
      score += 5;
    }
    
    return score;
  }

  private analyzeBasicProduct(product: any, score: DatabaseQualityScore) {
    const productText = `${product.name} ${product.description} ${product.brand || ''}`.toLowerCase();

    // Basic quality indicators
    this.checkQualityIndicators(product, score);

    // Price analysis
    this.analyzePrice(product, score);

    // Rating analysis
    this.analyzeRating(product, score);
  }

  private checkQualityIndicators(product: any, score: DatabaseQualityScore) {
    const productText = `${product.name} ${product.description} ${product.brand || ''}`.toLowerCase();

    // Quality indicators
    const qualityTerms = [
      'organic', 'certified', 'standardized', 'extract', 'pure', 'natural',
      'third-party tested', 'lab tested', 'gmp', 'usp', 'non-gmo'
    ];

    const foundQualityTerms = qualityTerms.filter(term => 
      productText.includes(term.toLowerCase())
    );

    if (foundQualityTerms.length > 0) {
      score.score += foundQualityTerms.length * 5;
      score.reasons.push(`Quality indicators: ${foundQualityTerms.join(', ')}`);
    }

    // Avoid low-quality indicators
    const lowQualityTerms = [
      'proprietary blend', 'herbal blend', 'dietary supplement', 'filler',
      'artificial', 'synthetic', 'cheap', 'generic'
    ];

    const foundLowQualityTerms = lowQualityTerms.filter(term => 
      productText.includes(term.toLowerCase())
    );

    if (foundLowQualityTerms.length > 0) {
      score.score -= foundLowQualityTerms.length * 10;
      score.warnings.push(`Low quality indicators: ${foundLowQualityTerms.join(', ')}`);
    }
  }

  private analyzePrice(product: any, score: DatabaseQualityScore) {
    if (product.price) {
      const price = parseFloat(product.price.toString().replace(/[^0-9.]/g, ''));
      
      // Price quality analysis
      if (price < 5) {
        score.score -= 15;
        score.warnings.push('Very low price may indicate poor quality');
      } else if (price > 100) {
        score.score += 5;
        score.reasons.push('Premium pricing suggests quality');
      } else if (price >= 15 && price <= 50) {
        score.score += 10;
        score.reasons.push('Price in optimal range');
      }
    }
  }

  private analyzeRating(product: any, score: DatabaseQualityScore) {
    if (product.rating) {
      if (product.rating >= 4.5) {
        score.score += 15;
        score.reasons.push(`Excellent rating: ${product.rating}`);
      } else if (product.rating >= 4.0) {
        score.score += 10;
        score.reasons.push(`Good rating: ${product.rating}`);
      } else if (product.rating < 3.5) {
        score.score -= 10;
        score.warnings.push(`Low rating: ${product.rating}`);
      }
    }

    if (product.reviewCount) {
      if (product.reviewCount >= 100) {
        score.score += 5;
        score.reasons.push(`Well-reviewed: ${product.reviewCount} reviews`);
      } else if (product.reviewCount < 10) {
        score.score -= 5;
        score.warnings.push(`Few reviews: ${product.reviewCount}`);
      }
    }
  }

  private findMatchingTerms(productText: string, terms: string[]): string[] {
    return terms.filter(term => 
      productText.includes(term.toLowerCase())
    );
  }

  // Get quality specifications from database
  async getQualitySpecsFromDatabase(herbSlug?: string, productType?: string) {
    try {
      if (herbSlug) {
        const specs = await this.prisma.qualitySpecification.findMany({
          where: { 
            herbSlug: herbSlug,
            ...(productType && { productType: productType })
          }
        });
        return specs;
      }

      return null;
    } catch (error) {
      console.error('Error getting quality specs from database:', error);
      return null;
    }
  }

  // Filter products by database-driven quality criteria
  async filterProductsByDatabaseQuality(
    products: any[], 
    herbSlug?: string, 
    productType?: string
  ): Promise<(any & { qualityScore: DatabaseQualityScore })[]> {
    const scoredProducts = await Promise.all(
      products.map(async (product) => {
        const qualityScore = await this.analyzeProductQuality(product, herbSlug, undefined, productType);
        return {
          ...product,
          qualityScore
        };
      })
    );

    return scoredProducts
      .filter(product => product.qualityScore.score >= 50)
      .sort((a, b) => b.qualityScore.score - a.qualityScore.score);
  }
} 