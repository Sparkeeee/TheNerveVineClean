const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class QualityScoringEngine {
  constructor() {
    this.scoreWeights = {
      requiredTerms: 40,    // 40% of total score
      preferredTerms: 30,   // 30% of total score
      avoidTerms: 20,       // 20% of total score
      ratioScoring: 10      // 10% of total score (for liquid forms)
    };
  }

  // Extract ratio from product description (e.g., "1:5 ratio", "1:10")
  extractRatio(description) {
    const ratioMatch = description.match(/(\d+):(\d+)/);
    if (ratioMatch) {
      const herb = parseInt(ratioMatch[1]);
      const solvent = parseInt(ratioMatch[2]);
      return { herb, solvent, ratio: herb/solvent };
    }
    return null;
  }

  // Calculate ratio score (lower ratios = higher scores)
  calculateRatioScore(ratio) {
    if (!ratio) return 0;
    
    // 1:1 = 100, 1:2 = 90, 1:5 = 70, 1:10 = 40, 1:20 = 20
    if (ratio.ratio >= 1) return 100;      // 1:1 or better
    if (ratio.ratio >= 0.5) return 90;     // 1:2
    if (ratio.ratio >= 0.2) return 70;     // 1:5
    if (ratio.ratio >= 0.1) return 40;     // 1:10
    if (ratio.ratio >= 0.05) return 20;    // 1:20
    return 10;                              // Worse than 1:20
  }

  // Check if description contains required terms
  checkRequiredTerms(description, requiredTerms) {
    const lowerDesc = description.toLowerCase();
    let foundCount = 0;
    
    for (const term of requiredTerms) {
      if (term.includes(' OR ')) {
        // Handle OR logic (e.g., "organic OR wildcrafted")
        const options = term.split(' OR ');
        if (options.some(option => lowerDesc.includes(option.toLowerCase()))) {
          foundCount++;
        }
      } else {
        if (lowerDesc.includes(term.toLowerCase())) {
          foundCount++;
        }
      }
    }
    
    return {
      found: foundCount,
      total: requiredTerms.length,
      score: (foundCount / requiredTerms.length) * 100
    };
  }

  // Check if description contains preferred terms
  checkPreferredTerms(description, preferredTerms) {
    const lowerDesc = description.toLowerCase();
    let foundCount = 0;
    
    for (const term of preferredTerms) {
      if (lowerDesc.includes(term.toLowerCase())) {
        foundCount++;
      }
    }
    
    return {
      found: foundCount,
      total: preferredTerms.length,
      score: (foundCount / preferredTerms.length) * 100
    };
  }

  // Check if description contains avoid terms (penalty)
  checkAvoidTerms(description, avoidTerms) {
    const lowerDesc = description.toLowerCase();
    let foundCount = 0;
    
    for (const term of avoidTerms) {
      if (lowerDesc.includes(term.toLowerCase())) {
        foundCount++;
      }
    }
    
    return {
      found: foundCount,
      total: avoidTerms.length,
      penalty: (foundCount / avoidTerms.length) * 100
    };
  }

  // Calculate overall quality score
  calculateQualityScore(productDescription, qualitySpec) {
    const template = JSON.parse(qualitySpec.template);
    
    // Check required terms (40% weight)
    const requiredScore = this.checkRequiredTerms(productDescription, template.requiredTerms);
    
    // Check preferred terms (30% weight)
    const preferredScore = this.checkPreferredTerms(productDescription, template.preferredTerms);
    
    // Check avoid terms (20% weight - penalty)
    const avoidPenalty = this.checkAvoidTerms(productDescription, template.avoidTerms);
    
    // Calculate ratio score for liquid forms (10% weight)
    let ratioScore = 0;
    if (qualitySpec.formulationType?.category === 'Liquid') {
      const ratio = this.extractRatio(productDescription);
      ratioScore = this.calculateRatioScore(ratio);
    }
    
    // Calculate weighted score
    const weightedScore = 
      (requiredScore.score * this.scoreWeights.requiredTerms / 100) +
      (preferredScore.score * this.scoreWeights.preferredTerms / 100) +
      (ratioScore * this.scoreWeights.ratioScoring / 100) -
      (avoidPenalty.penalty * this.scoreWeights.avoidTerms / 100);
    
    // Ensure score doesn't go below 0
    const finalScore = Math.max(0, Math.min(100, weightedScore));
    
    return {
      overallScore: Math.round(finalScore),
      breakdown: {
        requiredTerms: {
          score: requiredScore.score,
          found: requiredScore.found,
          total: requiredScore.total,
          weight: this.scoreWeights.requiredTerms
        },
        preferredTerms: {
          score: preferredScore.score,
          found: preferredScore.found,
          total: preferredScore.total,
          weight: this.scoreWeights.preferredTerms
        },
        avoidTerms: {
          penalty: avoidPenalty.penalty,
          found: avoidPenalty.found,
          total: avoidPenalty.total,
          weight: this.scoreWeights.avoidTerms
        },
        ratioScoring: {
          score: ratioScore,
          weight: this.scoreWeights.ratioScoring,
          ratio: this.extractRatio(productDescription)
        }
      },
      passed: finalScore >= 70, // 70% threshold for passing
      grade: this.getGrade(finalScore)
    };
  }

  // Convert score to letter grade
  getGrade(score) {
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'A-';
    if (score >= 75) return 'B+';
    if (score >= 70) return 'B';
    if (score >= 65) return 'B-';
    if (score >= 60) return 'C+';
    if (score >= 55) return 'C';
    if (score >= 50) return 'C-';
    if (score >= 45) return 'D+';
    if (score >= 40) return 'D';
    return 'F';
  }
}

// Test the scoring engine
async function testScoring() {
  try {
    console.log('🧪 Testing Quality Scoring Engine...\n');
    
    const scoringEngine = new QualityScoringEngine();
    
    // Test ratio extraction
    console.log('📊 Testing Ratio Extraction:');
    const testDescriptions = [
      'Organic chamomile tincture with 1:5 ratio',
      'Fresh herb glycerite 1:2 ratio',
      'Standardized extract 1:10 ratio',
      'No ratio mentioned'
    ];
    
    testDescriptions.forEach(desc => {
      const ratio = scoringEngine.extractRatio(desc);
      console.log(`"${desc}" -> ${ratio ? `${ratio.herb}:${ratio.solvent} (score: ${scoringEngine.calculateRatioScore(ratio)})` : 'No ratio'}`);
    });
    
    // Test quality scoring with sample data
    console.log('\n🎯 Testing Quality Scoring:');
    
    const qualitySpecs = await prisma.qualitySpecification.findMany({
      include: {
        formulationType: true
      },
      take: 2
    });
    
    if (qualitySpecs.length > 0) {
      const testProduct = 'Organic chamomile tincture with 1:5 ratio, fresh herb, 40% alcohol';
      const score = scoringEngine.calculateQualityScore(testProduct, qualitySpecs[0]);
      
      console.log(`\nProduct: "${testProduct}"`);
      console.log(`Overall Score: ${score.overallScore}/100 (${score.grade})`);
      console.log(`Passed: ${score.passed ? '✅ Yes' : '❌ No'}`);
      console.log('\nBreakdown:');
      console.log(`- Required Terms: ${score.breakdown.requiredTerms.score}/100 (${score.breakdown.requiredTerms.found}/${score.breakdown.requiredTerms.total} found)`);
      console.log(`- Preferred Terms: ${score.breakdown.preferredTerms.score}/100 (${score.breakdown.preferredTerms.found}/${score.breakdown.preferredTerms.total} found)`);
      console.log(`- Avoid Terms: -${score.breakdown.avoidTerms.penalty}/100 penalty (${score.breakdown.avoidTerms.found}/${score.breakdown.avoidTerms.total} found)`);
      console.log(`- Ratio Scoring: ${score.breakdown.ratioScoring.score}/100`);
    }
    
  } catch (error) {
    console.error('Error testing scoring engine:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testScoring();
