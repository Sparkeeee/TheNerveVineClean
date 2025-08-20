const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const formulationTemplates = [
  // Herb-specific templates
  {
    name: 'Tincture',
    category: 'Liquid',
    template: JSON.stringify({
      requiredTerms: ['tincture', 'alcohol', 'organic OR wildcrafted'],
      preferredTerms: ['1:1 ratio', '1:2 ratio', '1:5 ratio', 'fresh herb', 'organic alcohol', 'high potency'],
      avoidTerms: ['1:10 ratio', '1:20 ratio', 'diluted', 'weak', 'conventional farming'],
      standardization: 'Must specify herb-to-solvent ratio (1:1 to 1:5 preferred, avoid 1:10+)',
      alcoholSpecs: 'Should specify alcohol percentage and organic status. Higher alcohol content (40-60%) preferred for better extraction.',
      dosageSpecs: 'Standard dose typically 30-60 drops (1-2ml) 2-3 times daily. Higher ratios require larger doses.',
      qualityNotes: 'Ratio scoring: 1:1 (highest score), 1:2 (very high), 1:5 (standard), 1:10+ (lower score). Fresh herb preferred over dried. Organic alcohol required.'
    })
  },
  {
    name: 'Glycerite',
    category: 'Liquid',
    template: JSON.stringify({
      requiredTerms: ['glycerite', 'glycerin', 'organic OR wildcrafted'],
      preferredTerms: ['1:1 ratio', '1:2 ratio', '1:5 ratio', 'fresh herb', 'vegetable glycerin', 'alcohol-free'],
      avoidTerms: ['1:10 ratio', '1:20 ratio', 'diluted', 'weak', 'conventional farming'],
      standardization: 'Must specify herb-to-glycerin ratio (1:1 to 1:5 preferred, avoid 1:10+)',
      alcoholSpecs: 'Alcohol-free alternative to tinctures. Uses vegetable glycerin for extraction.',
      dosageSpecs: 'Standard dose typically 30-60 drops (1-2ml) 2-3 times daily. Higher ratios require larger doses.',
      qualityNotes: 'Ratio scoring: 1:1 (highest score), 1:2 (very high), 1:5 (standard), 1:10+ (lower score). Fresh herb preferred over dried. Alcohol-free option for those avoiding alcohol.'
    })
  },
  {
    name: 'Capsules/Tablets',
    category: 'Solid',
    template: JSON.stringify({
      requiredTerms: ['capsule', 'tablet', 'extract', 'herb', 'organic OR wildcrafted'],
      preferredTerms: ['vegetarian', 'non-GMO', 'clear ratios', 'specific plant parts'],
      avoidTerms: ['artificial', 'fillers', 'binders', 'proprietary blend', 'conventional farming'],
      standardization: 'Standardized extract with specific compound percentages OR whole herb powder with clear ratios',
      alcoholSpecs: 'N/A for solid forms',
      dosageSpecs: 'Clear dosage per capsule/tablet (e.g., 500mg herb powder or 100mg standardized extract)',
      qualityNotes: 'MUST be organic OR wildcrafted - no conventional farming! Should specify herb-to-fill ratio, active compounds, and whether standardized or whole herb. Avoid "proprietary blends" that hide actual content.'
    })
  },
  {
    name: 'Dried Herb/Powder',
    category: 'Solid',
    template: JSON.stringify({
      requiredTerms: ['dried', 'powder', 'herb', 'whole', 'organic OR wildcrafted'],
      preferredTerms: ['freshly dried', 'finely ground', 'specific plant parts'],
      avoidTerms: ['irradiated', 'treated', 'preservatives', 'stems only', 'conventional farming'],
      standardization: 'Whole herb preparation - no standardization claims',
      alcoholSpecs: 'N/A for dried forms',
      dosageSpecs: 'Standard teaspoon (2-3g) or gram measurements per dose',
      qualityNotes: 'MUST be organic OR wildcrafted - no conventional farming! Should be finely ground and free of contaminants. Specify which parts of the plant (leaves, roots, etc.). Avoid irradiated or treated herbs.'
    })
  },
  {
    name: 'Standardized Extracts',
    category: 'Concentrated',
    template: JSON.stringify({
      requiredTerms: ['extract', 'standardized', 'herb', 'organic OR wildcrafted', 'compound percentage'],
      preferredTerms: ['specific compounds', 'clear percentages', 'bioavailable', 'high potency'],
      avoidTerms: ['proprietary blend', 'undefined', 'conventional farming', 'fillers'],
      standardization: 'Must specify exact compound percentages (e.g., "Standardized to 24% ginkgolides")',
      alcoholSpecs: 'N/A for standardized extracts',
      dosageSpecs: 'Clear dosage with compound amounts (e.g., 120mg extract standardized to 24% ginkgolides)',
      qualityNotes: 'MUST be organic OR wildcrafted - no conventional farming! Must specify exact compound percentages and dosages. Avoid "proprietary blends" that hide actual content.'
    })
  },
  
  // Supplement-specific templates
  {
    name: 'Supplement Capsules/Tablets',
    category: 'Solid',
    template: JSON.stringify({
      requiredTerms: ['capsule', 'tablet', 'minimum strength'],
      preferredTerms: ['vegetarian', 'non-GMO', 'bioavailable form', 'clear dosage', 'no fillers'],
      avoidTerms: ['proprietary blend', 'undefined amounts', 'artificial colors', 'binders'],
      standardization: 'Must specify exact dosage and compound form (e.g., "500mg 5-HTP", "200mg magnesium glycinate")',
      alcoholSpecs: 'N/A for solid supplements',
      dosageSpecs: 'Clear dosage per capsule/tablet with compound form specified',
      qualityNotes: 'Must specify exact dosage and compound form. Avoid "proprietary blends" that hide actual content. Should use bioavailable forms when available.'
    })
  },
  {
    name: 'Supplement Powder',
    category: 'Solid',
    template: JSON.stringify({
      requiredTerms: ['powder', 'minimum strength'],
      preferredTerms: ['pure', 'no fillers', 'bioavailable form', 'clear serving size'],
      avoidTerms: ['proprietary blend', 'undefined amounts', 'artificial flavors', 'sweeteners'],
      standardization: 'Must specify exact dosage per serving and compound form',
      alcoholSpecs: 'N/A for powder supplements',
      dosageSpecs: 'Clear serving size with compound form specified (e.g., "1 scoop = 5g creatine monohydrate")',
      qualityNotes: 'Must specify exact dosage per serving and compound form. Avoid "proprietary blends" that hide actual content. Should use pure forms without unnecessary additives.'
    })
  },
  {
    name: 'Supplement Standardized Extract',
    category: 'Concentrated',
    template: JSON.stringify({
      requiredTerms: ['extract', 'standardized', 'supplement', 'compound percentage', 'dosage'],
      preferredTerms: ['specific compounds', 'clear percentages', 'bioavailable', 'high potency'],
      avoidTerms: ['proprietary blend', 'undefined', 'fillers', 'binders'],
      standardization: 'Must specify exact compound percentages and dosages',
      alcoholSpecs: 'N/A for standardized extracts',
      dosageSpecs: 'Clear dosage with compound amounts and percentages specified',
      qualityNotes: 'Must specify exact compound percentages and dosages. Avoid "proprietary blends" that hide actual content. Should use bioavailable forms when available.'
    })
  }
];

async function createFormulationTemplates() {
  try {
    console.log('Creating formulation type templates...');
    
    for (const template of formulationTemplates) {
      const existing = await prisma.formulationType.findUnique({
        where: { name: template.name }
      });
      
      if (existing) {
        console.log(`Template "${template.name}" already exists, updating...`);
        await prisma.formulationType.update({
          where: { id: existing.id },
          data: template
        });
      } else {
        console.log(`Creating template "${template.name}"...`);
        await prisma.formulationType.create({
          data: template
        });
      }
    }
    
    console.log('✅ All formulation type templates created/updated successfully!');
    
    // Display what was created
    const allTemplates = await prisma.formulationType.findMany({
      orderBy: { name: 'asc' }
    });
    
    console.log('\n📋 Available Formulation Types:');
    allTemplates.forEach(template => {
      console.log(`  • ${template.name} (${template.category})`);
    });
    
  } catch (error) {
    console.error('❌ Error creating templates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createFormulationTemplates();
