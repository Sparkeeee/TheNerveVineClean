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
  qualitySpec?: unknown;
}

export class DatabaseQualityAnalyzer {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // Analyze product quality based on QualitySpecification database records
  async analyzeProductQuality(
    product: unknown, 
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
      let qualitySpecs: unknown[] = [];

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
    product: unknown, 
    qualitySpecs: unknown[], 
    score: DatabaseQualityScore
  ): Promise<number> {
    let bestScore = 0;

    for (const spec of qualitySpecs) {
      const specScore = await this.analyzeSingleQualitySpec(product, spec);
      
      if (specScore.score > bestScore) {
        bestScore = specScore.score;
        // Update the main score object with the best analysis
        score.reasons = specScore.reasons;
        score.warnings = specScore.warnings;
        score.matches = specScore.matches;
        score.qualitySpec = spec;
      }
    }

    return bestScore;
  }

  private async analyzeSingleQualitySpec(product: unknown, spec: unknown): Promise<DatabaseQualityScore> {
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

    const productText = `${((product as { name?: string; description?: string; brand?: string }).name || '').toLowerCase()} ${(product as { name?: string; description?: string; brand?: string }).description || ''} ${(product as { brand?: string }).brand || ''}`.toLowerCase();

    // Check required terms
    const requiredTerms = Array.isArray((spec as { requiredTerms?: string | string[] }).requiredTerms) 
      ? (spec as { requiredTerms?: string | string[] }).requiredTerms 
      : JSON.parse((spec as { requiredTerms?: string | string[] }).requiredTerms as string);
    
    const requiredMatches = this.findMatchingTerms(productText, requiredTerms);
    score.matches.required = requiredMatches;

    if (requiredMatches.length < requiredTerms.length) {
      const missingTerms = requiredTerms.filter((term: string) => !requiredMatches.includes(term));
      score.warnings.push(`Missing required terms: ${missingTerms.join(', ')}`);
      score.score -= 30;
    } else {
      score.score += 40;
      score.reasons.push('All required terms present');
    }

    // Check preferred terms
    const preferredTerms = Array.isArray((spec as { preferredTerms?: string | string[] }).preferredTerms)
      ? (spec as { preferredTerms?: string | string[] }).preferredTerms
      : JSON.parse((spec as { preferredTerms?: string | string[] }).preferredTerms as string);
    
    const preferredMatches = this.findMatchingTerms(productText, preferredTerms);
    score.matches.preferred = preferredMatches;

    if (preferredMatches.length > 0) {
      score.score += preferredMatches.length * 10;
      score.reasons.push(`Preferred terms found: ${preferredMatches.join(', ')}`);
    }

    // Check avoid terms
    const avoidTerms = Array.isArray((spec as { avoidTerms?: string | string[] }).avoidTerms)
      ? (spec as { avoidTerms?: string | string[] }).avoidTerms
      : JSON.parse((spec as { avoidTerms?: string | string[] }).avoidTerms as string);
    
    const avoidMatches = this.findMatchingTerms(productText, avoidTerms);
    score.matches.avoid = avoidMatches;

    if (avoidMatches.length > 0) {
      score.score -= avoidMatches.length * 15;
      score.warnings.push(`Avoided terms found: ${avoidMatches.join(', ')}`);
    }

    // Check standardization
    if ((spec as { standardization?: string | string[] }).standardization) {
      const standardization = Array.isArray((spec as { standardization?: string | string[] }).standardization)
        ? (spec as { standardization?: string | string[] }).standardization
        : JSON.parse((spec as { standardization?: string | string[] }).standardization as string);
      
      const standardizationScore = this.checkStandardization(product, standardization);
      score.score += standardizationScore;
      if (standardizationScore > 0) {
        score.reasons.push('Standardization requirements met');
        score.matches.standardization = ['standardization_match'];
      }
    }

    // Check alcohol specifications
    if ((spec as { alcoholSpecs?: string | string[] }).alcoholSpecs) {
      const alcoholSpecs = Array.isArray((spec as { alcoholSpecs?: string | string[] }).alcoholSpecs)
        ? (spec as { alcoholSpecs?: string | string[] }).alcoholSpecs
        : JSON.parse((spec as { alcoholSpecs?: string | string[] }).alcoholSpecs as string);
      
      const alcoholScore = this.checkAlcoholSpecs(product, alcoholSpecs);
      score.score += alcoholScore;
      if (alcoholScore > 0) {
        score.reasons.push('Alcohol specifications met');
        score.matches.alcoholSpecs = ['alcohol_match'];
      }
    }

    // Check dosage specifications
    if ((spec as { dosageSpecs?: string | string[] }).dosageSpecs) {
      const dosageSpecs = Array.isArray((spec as { dosageSpecs?: string | string[] }).dosageSpecs)
        ? (spec as { dosageSpecs?: string | string[] }).dosageSpecs
        : JSON.parse((spec as { dosageSpecs?: string | string[] }).dosageSpecs as string);
      
      const dosageScore = this.checkDosageSpecs(product, dosageSpecs);
      score.score += dosageScore;
      if (dosageScore > 0) {
        score.reasons.push('Dosage specifications met');
        score.matches.dosageSpecs = ['dosage_match'];
      }
    }

    // Check price range
    if ((spec as { priceRange?: string | string[] }).priceRange) {
      const priceRange = Array.isArray((spec as { priceRange?: string | string[] }).priceRange)
        ? (spec as { priceRange?: string | string[] }).priceRange
        : JSON.parse((spec as { priceRange?: string | string[] }).priceRange as string);
      
      if ((product as { price?: number }).price) {
        const price = parseFloat(((product as { price?: number }).price as number).toString().replace(/[^0-9.]/g, ''));
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
    if ((spec as { ratingThreshold?: number }).ratingThreshold && (product as { rating?: number }).rating) {
      const ratingThreshold = (spec as { ratingThreshold?: number }).ratingThreshold;
      const rating = (product as { rating?: number }).rating;
      if (ratingThreshold !== undefined && rating !== undefined && rating >= ratingThreshold) {
        score.score += 10;
        score.reasons.push(`Rating ${(product as { rating?: number }).rating} meets threshold ${(spec as { ratingThreshold?: number }).ratingThreshold}`);
      } else {
        score.score -= 10;
        score.warnings.push(`Rating ${(product as { rating?: number }).rating} below threshold ${(spec as { ratingThreshold?: number }).ratingThreshold}`);
      }
    }

    // Check review count threshold
    if ((spec as { reviewCountThreshold?: number }).reviewCountThreshold && (product as { reviewCount?: number }).reviewCount) {
      const reviewCountThreshold = (spec as { reviewCountThreshold?: number }).reviewCountThreshold;
      const reviewCount = (product as { reviewCount?: number }).reviewCount;
      if (reviewCountThreshold !== undefined && reviewCount !== undefined && reviewCount >= reviewCountThreshold) {
        score.score += 5;
        score.reasons.push(`Sufficient reviews ${(product as { reviewCount?: number }).reviewCount}`);
      } else {
        score.score -= 5;
        score.warnings.push(`Insufficient reviews ${(product as { reviewCount?: number }).reviewCount}`);
      }
    }

    // Check brand preferences
    if ((spec as { brandPreferences?: string | string[] }).brandPreferences) {
      const brandPreferences = Array.isArray((spec as { brandPreferences?: string | string[] }).brandPreferences)
        ? (spec as { brandPreferences?: string | string[] }).brandPreferences
        : JSON.parse((spec as { brandPreferences?: string | string[] }).brandPreferences as string);
      
      const productBrand = ((product as { brand?: string }).brand || '').toLowerCase() || '';
      const hasPreferredBrand = brandPreferences.some((brand: string) => 
        productBrand.includes(brand.toLowerCase())
      );
      
      if (hasPreferredBrand) {
        score.score += 15;
        score.reasons.push('Product from preferred brand');
      }
    }

    // Check brand avoid
    if ((spec as { brandAvoid?: string | string[] }).brandAvoid) {
      const brandAvoid = Array.isArray((spec as { brandAvoid?: string | string[] }).brandAvoid)
        ? (spec as { brandAvoid?: string | string[] }).brandAvoid
        : JSON.parse((spec as { brandAvoid?: string | string[] }).brandAvoid as string);
      
      const productBrand = ((product as { brand?: string }).brand || '').toLowerCase() || '';
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

  private checkStandardization(product: unknown, standardization: unknown): number {
    if (!standardization || !(standardization as { compound?: string }).compound) return 0;
    
    const productText = `${((product as { name?: string; description?: string }).name || '').toLowerCase()} ${(product as { name?: string; description?: string }).description || ''}`.toLowerCase();
    const compound = ((standardization as { compound?: string }).compound || '').toLowerCase();
    
    if (productText.includes(compound)) {
      // Look for percentage or amount
      const percentageMatch = productText.match(new RegExp(`${compound}.*?([0-9.]+)%`, 'i'));
      const amountMatch = productText.match(new RegExp(`${compound}.*?([0-9.]+)\s*(mg|mcg)`, 'i'));
      
      if (percentageMatch) {
        const foundPercentage = parseFloat(percentageMatch[1]);
        const percentage = (standardization as { percentage?: number }).percentage;
        if (percentage !== undefined && foundPercentage >= percentage) {
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

  private checkAlcoholSpecs(product: unknown, alcoholSpecs: unknown): number {
    if (!alcoholSpecs) return 0;
    
    const productText = `${((product as { name?: string; description?: string }).name || '').toLowerCase()} ${(product as { name?: string; description?: string }).description || ''}`.toLowerCase();
    let score = 0;
    
    // Check for ratio
    if ((alcoholSpecs as { ratio?: string }).ratio && productText.includes(((alcoholSpecs as { ratio?: string }).ratio || '').toLowerCase())) {
      score += 15;
    }
    
    // Check for organic alcohol
    if ((alcoholSpecs as { organic?: boolean }).organic && productText.includes('organic alcohol')) {
      score += 10;
    }
    
    // Check for alcohol type
    if ((alcoholSpecs as { type?: string[] }).type) {
      const hasCorrectType = ((alcoholSpecs as { type?: string[] }).type || []).some((type: string) => 
        productText.includes(type.toLowerCase())
      );
      if (hasCorrectType) {
        score += 5;
      }
    }
    
    return score;
  }

  private checkDosageSpecs(product: unknown, dosageSpecs: unknown): number {
    if (!dosageSpecs) return 0;
    
    const productText = `${((product as { name?: string; description?: string }).name || '').toLowerCase()} ${(product as { name?: string; description?: string }).description || ''}`.toLowerCase();
    let score = 0;
    
    // Check for minimum amount
    if ((dosageSpecs as { minAmount?: number; unit?: string }).minAmount) {
      const amountMatch = productText.match(new RegExp(`([0-9.]+)\s*${((dosageSpecs as { unit?: string }).unit || '')}`, 'i'));
      if (amountMatch) {
        const foundAmount = parseFloat(amountMatch[1]);
        if (foundAmount >= ((dosageSpecs as { minAmount?: number }).minAmount as number)) {
          score += 10;
        }
      }
    }
    
    // Check for frequency
    if ((dosageSpecs as { frequency?: string }).frequency && productText.includes(((dosageSpecs as { frequency?: string }).frequency || '').toLowerCase())) {
      score += 5;
    }
    
    return score;
  }

  private analyzeBasicProduct(product: unknown, score: DatabaseQualityScore) {
    // Basic quality indicators
    this.checkQualityIndicators(product, score);

    // Price analysis
    this.analyzePrice(product, score);

    // Rating analysis
    this.analyzeRating(product, score);
  }

  private checkQualityIndicators(product: unknown, score: DatabaseQualityScore) {
    const productText = `${((product as { name?: string; description?: string; brand?: string }).name || '').toLowerCase()} ${(product as { name?: string; description?: string; brand?: string }).description || ''} ${(product as { brand?: string }).brand || ''}`.toLowerCase();

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

  private analyzePrice(product: unknown, score: DatabaseQualityScore) {
    if ((product as { price?: number }).price) {
      const price = parseFloat(((product as { price?: number }).price as number).toString().replace(/[^0-9.]/g, ''));
      
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

  private analyzeRating(product: unknown, score: DatabaseQualityScore) {
    if ((product as { rating?: number }).rating) {
      const rating = (product as { rating?: number }).rating;
      if (rating !== undefined && rating >= 4.5) {
        score.score += 15;
        score.reasons.push(`Excellent rating: ${rating}`);
      } else if (rating !== undefined && rating >= 4.0) {
        score.score += 10;
        score.reasons.push(`Good rating: ${rating}`);
      } else if (rating !== undefined && rating < 3.5) {
        score.score -= 10;
        score.warnings.push(`Low rating: ${rating}`);
      }
    }

    if ((product as { reviewCount?: number }).reviewCount) {
      const reviewCount = (product as { reviewCount?: number }).reviewCount;
      if (reviewCount !== undefined && reviewCount >= 100) {
        score.score += 5;
        score.reasons.push(`Well-reviewed: ${reviewCount} reviews`);
      } else if (reviewCount !== undefined && reviewCount < 10) {
        score.score -= 5;
        score.warnings.push(`Few reviews: ${reviewCount}`);
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
    products: unknown[], 
    herbSlug?: string, 
    productType?: string
  ): Promise<(unknown & { qualityScore: DatabaseQualityScore })[]> {
    const scoredProducts = await Promise.all(
      products.map(async (product) => {
        const qualityScore = await this.analyzeProductQuality(product, herbSlug, undefined, productType);
        return {
          ...(typeof product === 'object' && product !== null ? product : {}),
          qualityScore
        };
      })
    );

    return scoredProducts
      .filter((product: unknown) => (product as { qualityScore: DatabaseQualityScore }).qualityScore.score >= 50)
      .sort((a: unknown, b: unknown) => (a as { qualityScore: DatabaseQualityScore }).qualityScore.score - (b as { qualityScore: DatabaseQualityScore }).qualityScore.score);
  }
} 