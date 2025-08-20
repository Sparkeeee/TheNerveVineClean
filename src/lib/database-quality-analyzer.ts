// Database-driven Quality Analyzer
// Replaces static quality specifications with dynamic database queries

export interface QualitySpecification {
  id: number;
  herbSlug?: string;
  supplementSlug?: string;
  herbName?: string;
  supplementName?: string;
  productType: string;
  formulationName?: string;
  approach?: string;
  requiredTerms: string[];
  preferredTerms: string[];
  avoidTerms: string[];
  standardization?: {
    compound: string;
    percentage: number;
    unit: string;
  };
  alcoholSpecs?: {
    ratio: string;
    organic: boolean;
    type: string[];
  };
  dosageSpecs?: {
    minAmount: number;
    unit: string;
    frequency: string;
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
  notes?: string;
  // New fields for formulation-based system
  herbId?: number;
  supplementId?: number;
  formulationTypeId?: number;
  standardised?: boolean;
  customSpecs?: string;
  updatedAt?: Date;
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

export class DatabaseQualityAnalyzer {
  // Fetch quality specifications from database
  async getQualitySpecifications(herbSlug?: string, supplementSlug?: string, productType?: string): Promise<QualitySpecification[]> {
    try {
      let url = '/api/quality-specifications';
      const params = new URLSearchParams();
      
      if (herbSlug) params.append('herbSlug', herbSlug);
      if (supplementSlug) params.append('supplementSlug', supplementSlug);
      if (productType) params.append('productType', productType);
      
      if (params.toString()) {
        url += '?' + params.toString();
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch quality specifications: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching quality specifications:', error);
      return [];
    }
  }

  // Analyze a product against quality specifications
  analyzeProductQuality(product: any, specs: QualitySpecification[]): ProductQualityScore {
    if (specs.length === 0) {
      return {
        score: 0,
        reasons: ['No quality specifications found'],
        warnings: [],
        matches: { required: [], preferred: [], avoid: [] }
      };
    }

    let totalScore = 0;
    const allReasons: string[] = [];
    const allWarnings: string[] = [];
    const allMatches = {
      required: [] as string[],
      preferred: [] as string[],
      avoid: [] as string[]
    };

    for (const spec of specs) {
      const analysis = this.analyzeSingleQualitySpec(product, spec);
      totalScore += analysis.score;
      allReasons.push(...analysis.reasons);
      allWarnings.push(...analysis.warnings);
      allMatches.required.push(...analysis.matches.required);
      allMatches.preferred.push(...analysis.matches.preferred);
      allMatches.avoid.push(...analysis.matches.avoid);
    }

    // Average the score across all specs
    const averageScore = specs.length > 0 ? totalScore / specs.length : 0;

    return {
      score: Math.max(0, Math.min(100, averageScore)),
      reasons: allReasons,
      warnings: allWarnings,
      matches: {
        required: [...new Set(allMatches.required)],
        preferred: [...new Set(allMatches.preferred)],
        avoid: [...new Set(allMatches.avoid)]
      }
    };
  }

  private analyzeSingleQualitySpec(product: any, spec: QualitySpecification): ProductQualityScore {
    let score = 0;
    const reasons: string[] = [];
    const warnings: string[] = [];
    const matches = {
      required: [] as string[],
      preferred: [] as string[],
      avoid: [] as string[]
    };

    const productText = `${product.name} ${product.description}`.toLowerCase();

    // Check required terms
    for (const term of spec.requiredTerms) {
      if (productText.includes(term.toLowerCase())) {
        matches.required.push(term);
        score += 20;
        reasons.push(`Contains required term: ${term}`);
      }
    }

    // Check preferred terms
    for (const term of spec.preferredTerms) {
      if (productText.includes(term.toLowerCase())) {
        matches.preferred.push(term);
        score += 10;
        reasons.push(`Contains preferred term: ${term}`);
      }
    }

    // Check avoid terms
    for (const term of spec.avoidTerms) {
      if (productText.includes(term.toLowerCase())) {
        matches.avoid.push(term);
        score -= 30;
        warnings.push(`Contains avoid term: ${term}`);
      }
    }

    // Check price range
    if (product.price) {
      if (product.price >= spec.priceRange.min && product.price <= spec.priceRange.max) {
        score += 15;
        reasons.push(`Price within range: $${spec.priceRange.min}-${spec.priceRange.max}`);
      } else {
        score -= 20;
        warnings.push(`Price outside range: $${spec.priceRange.min}-${spec.priceRange.max}`);
      }
    }

    // Check rating threshold
    if (product.rating) {
      if (product.rating >= spec.ratingThreshold) {
        score += 15;
        reasons.push(`Rating meets threshold: ${spec.ratingThreshold}+`);
      } else {
        score -= 15;
        warnings.push(`Rating below threshold: ${spec.ratingThreshold}+`);
      }
    }

    // Check review count threshold
    if (product.reviewCount) {
      if (product.reviewCount >= spec.reviewCountThreshold) {
        score += 10;
        reasons.push(`Review count meets threshold: ${spec.reviewCountThreshold}+`);
      } else {
        score -= 10;
        warnings.push(`Review count below threshold: ${spec.reviewCountThreshold}+`);
      }
    }

    // Check standardization if applicable
    if (spec.standardization && product.description) {
      const standardizationText = `${spec.standardization.percentage}${spec.standardization.unit} ${spec.standardization.compound}`;
      if (product.description.toLowerCase().includes(standardizationText.toLowerCase())) {
        score += 20;
        reasons.push(`Contains standardization: ${standardizationText}`);
      }
    }

    // Check alcohol specifications for tinctures
    if (spec.alcoholSpecs && spec.productType === 'tincture') {
      if (spec.alcoholSpecs.organic && productText.includes('organic alcohol')) {
        score += 15;
        reasons.push('Contains organic alcohol');
      }
      if (spec.alcoholSpecs.ratio && productText.includes(spec.alcoholSpecs.ratio)) {
        score += 10;
        reasons.push(`Correct alcohol ratio: ${spec.alcoholSpecs.ratio}`);
      }
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      reasons,
      warnings,
      matches
    };
  }

  // Filter products by quality specifications
  async filterProductsByQuality(products: any[], herbSlug?: string, supplementSlug?: string, productType?: string): Promise<any[]> {
    const specs = await this.getQualitySpecifications(herbSlug, supplementSlug, productType);
    
    if (specs.length === 0) {
      return products; // Return all products if no specs found
    }

    return products.filter(product => {
      const analysis = this.analyzeProductQuality(product, specs);
      return analysis.score >= 50; // Minimum quality threshold
    }).sort((a, b) => {
      const analysisA = this.analyzeProductQuality(a, specs);
      const analysisB = this.analyzeProductQuality(b, specs);
      return analysisB.score - analysisA.score; // Sort by quality score descending
    });
  }

  // Get quality specifications for a specific herb/supplement and product type
  async getSpecsForProduct(herbSlug?: string, supplementSlug?: string, productType?: string): Promise<QualitySpecification[]> {
    return this.getQualitySpecifications(herbSlug, supplementSlug, productType);
  }
} 