const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Quality specifications based on best practices for common herbs and supplements
const qualitySpecs = [
  // Herbs - Tinctures
  {
    herbSlug: 'chamomile',
    formulationTypeName: 'Tincture',
    approach: 'Traditional',
    standardised: false,
    customSpecs: '1:5 ratio preferred, fresh flowers, 40% alcohol',
    notes: 'Chamomile tinctures should use fresh flowers for best volatile oil content. 1:5 ratio provides good potency without being too concentrated.'
  },
  {
    herbSlug: 'valerian',
    formulationTypeName: 'Tincture',
    approach: 'Traditional',
    standardised: false,
    customSpecs: '1:3 ratio preferred, fresh root, 60% alcohol',
    notes: 'Valerian root requires higher alcohol content for proper extraction of active compounds. 1:3 ratio ensures adequate potency for sleep support.'
  },
  {
    herbSlug: 'passionflower',
    formulationTypeName: 'Tincture',
    approach: 'Traditional',
    standardised: false,
    customSpecs: '1:5 ratio, fresh aerial parts, 40% alcohol',
    notes: 'Passionflower aerial parts contain the most active compounds. 1:5 ratio provides balanced potency for anxiety support.'
  },
  {
    herbSlug: 'skullcap',
    formulationTypeName: 'Tincture',
    approach: 'Traditional',
    standardised: false,
    customSpecs: '1:4 ratio, fresh herb, 50% alcohol',
    notes: 'Skullcap is best extracted fresh to preserve volatile compounds. 1:4 ratio ensures good potency for nervous system support.'
  },

  // Herbs - Glycerites
  {
    herbSlug: 'chamomile',
    formulationTypeName: 'Glycerite',
    approach: 'Traditional',
    standardised: false,
    customSpecs: '1:3 ratio, fresh flowers, vegetable glycerin',
    notes: 'Glycerite alternative for those avoiding alcohol. 1:3 ratio compensates for glycerin\'s lower extraction efficiency.'
  },
  {
    herbSlug: 'elderberry',
    formulationTypeName: 'Glycerite',
    approach: 'Traditional',
    standardised: false,
    customSpecs: '1:2 ratio, fresh berries, vegetable glycerin',
    notes: 'Elderberry glycerite at 1:2 ratio provides concentrated immune support without alcohol. Fresh berries preferred for anthocyanin content.'
  },

  // Herbs - Capsules/Tablets
  {
    herbSlug: 'ginkgo',
    formulationTypeName: 'Capsules/Tablets',
    approach: 'Modern',
    standardised: true,
    customSpecs: 'Standardized to 24% ginkgolides, 6% terpene lactones, minimum 40mg bilobalides',
    notes: 'Ginkgo must be standardized for consistent efficacy. Look for specific compound percentages and avoid proprietary blends.'
  },
  {
    herbSlug: 'milk-thistle',
    formulationTypeName: 'Capsules/Tablets',
    approach: 'Modern',
    standardised: true,
    customSpecs: 'Standardized to 80% silymarin, minimum 200mg silymarin per dose',
    notes: 'Milk thistle efficacy depends on silymarin content. 80% standardization is industry standard for liver support.'
  },
  {
    herbSlug: 'turmeric',
    formulationTypeName: 'Capsules/Tablets',
    approach: 'Modern',
    standardised: true,
    customSpecs: 'Standardized to 95% curcuminoids, minimum 500mg curcumin per dose',
    notes: 'Turmeric needs high curcuminoid content for anti-inflammatory effects. 95% standardization ensures adequate potency.'
  },

  // Herbs - Dried Herb/Powder
  {
    herbSlug: 'nettle',
    formulationTypeName: 'Dried Herb/Powder',
    approach: 'Traditional',
    standardised: false,
    customSpecs: 'Finely ground leaves and stems, 2-3g per dose',
    notes: 'Nettle powder should be finely ground for better absorption. Whole plant (leaves and stems) provides complete nutrient profile.'
  },
  {
    herbSlug: 'dandelion',
    formulationTypeName: 'Dried Herb/Powder',
    approach: 'Traditional',
    standardised: false,
    customSpecs: 'Finely ground root and leaves, 1-2g per dose',
    notes: 'Dandelion root and leaves provide different benefits. Powder form allows for flexible dosing and better absorption.'
  },

  // Supplements - Capsules/Tablets
  {
    supplementSlug: '5-htp',
    formulationTypeName: 'Supplement Capsules/Tablets',
    approach: 'Modern',
    standardised: false,
    customSpecs: 'Minimum 100mg, 200mg preferred, enteric coated',
    notes: '5-HTP should be enteric coated to prevent stomach upset. 100-200mg range provides effective serotonin support.'
  },
  {
    supplementSlug: 'magnesium',
    formulationTypeName: 'Supplement Capsules/Tablets',
    approach: 'Modern',
    standardised: false,
    customSpecs: '200mg, 400mg, magnesium glycinate or citrate',
    notes: 'Magnesium glycinate and citrate are highly bioavailable forms. 200-400mg daily provides effective supplementation.'
  },
  {
    supplementSlug: 'vitamin-d3',
    formulationTypeName: 'Supplement Capsules/Tablets',
    approach: 'Modern',
    standardised: false,
    customSpecs: '1000IU, 2000IU, D3 form with K2',
    notes: 'Vitamin D3 with K2 provides optimal bone and immune support. 1000-2000IU daily is effective for most adults.'
  },
  {
    supplementSlug: 'omega-3',
    formulationTypeName: 'Supplement Capsules/Tablets',
    approach: 'Modern',
    standardised: false,
    customSpecs: '1000mg, 2000mg, EPA+DHA, fish oil or algae',
    notes: 'Omega-3 should provide both EPA and DHA. 1000-2000mg daily supports heart and brain health.'
  },

  // Supplements - Powder
  {
    supplementSlug: 'creatine',
    formulationTypeName: 'Supplement Powder',
    approach: 'Modern',
    standardised: false,
    customSpecs: '5g, 10g, creatine monohydrate, pure powder',
    notes: 'Creatine monohydrate is the most researched form. 5-10g daily provides effective muscle and cognitive support.'
  },
  {
    supplementSlug: 'protein',
    formulationTypeName: 'Supplement Powder',
    approach: 'Modern',
    standardised: false,
    customSpecs: '20g, 30g, whey isolate or plant-based, no artificial sweeteners',
    notes: 'Protein powder should provide 20-30g per serving. Whey isolate or quality plant-based options preferred.'
  },

  // Supplements - Standardized Extract
  {
    supplementSlug: 'curcumin',
    formulationTypeName: 'Supplement Standardized Extract',
    approach: 'Modern',
    standardised: true,
    customSpecs: '95% curcuminoids, 500mg, 1000mg, with piperine for absorption',
    notes: 'Curcumin needs piperine for optimal absorption. 95% standardization ensures consistent potency and efficacy.'
  }
];

async function populateQualitySpecs() {
  try {
    console.log('🌱 Populating quality specifications for herbs and supplements...\n');
    
    let createdCount = 0;
    let updatedCount = 0;
    
    for (const spec of qualitySpecs) {
      try {
        // Find the formulation type
        const formulationType = await prisma.formulationType.findUnique({
          where: { name: spec.formulationTypeName }
        });
        
        if (!formulationType) {
          console.log(`⚠️  Formulation type "${spec.formulationTypeName}" not found, skipping...`);
          continue;
        }
        
        // Check if this spec already exists
        let existingSpec;
        if (spec.herbSlug) {
          existingSpec = await prisma.qualitySpecification.findFirst({
            where: {
              herbSlug: spec.herbSlug,
              formulationTypeId: formulationType.id
            }
          });
        } else if (spec.supplementSlug) {
          existingSpec = await prisma.qualitySpecification.findFirst({
            where: {
              supplementSlug: spec.supplementSlug,
              formulationTypeId: formulationType.id
            }
          });
        }
        
        if (existingSpec) {
          // Update existing spec
          await prisma.qualitySpecification.update({
            where: { id: existingSpec.id },
            data: {
              approach: spec.approach,
              standardised: spec.standardised,
              customSpecs: spec.customSpecs,
              notes: spec.notes,
              updatedAt: new Date()
            }
          });
          updatedCount++;
          console.log(`✅ Updated: ${spec.herbSlug || spec.supplementSlug} - ${spec.formulationTypeName}`);
        } else {
          // Create new spec
          await prisma.qualitySpecification.create({
            data: {
              herbSlug: spec.herbSlug || null,
              supplementSlug: spec.supplementSlug || null,
              formulationTypeId: formulationType.id,
              approach: spec.approach,
              standardised: spec.standardised,
              customSpecs: spec.customSpecs,
              notes: spec.notes,
              // Provide default values for old required fields
              requiredTerms: [],
              preferredTerms: [],
              avoidTerms: [],
              standardization: '',
              alcoholSpecs: '',
              dosageSpecs: '',
              qualityNotes: ''
            }
          });
          createdCount++;
          console.log(`🆕 Created: ${spec.herbSlug || spec.supplementSlug} - ${spec.formulationTypeName}`);
        }
        
      } catch (error) {
        console.error(`❌ Error processing ${spec.herbSlug || spec.supplementSlug}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Quality specifications populated successfully!`);
    console.log(`📊 Created: ${createdCount}, Updated: ${updatedCount}`);
    
    // Show summary of what was created
    const totalSpecs = await prisma.qualitySpecification.count();
    console.log(`\n📋 Total quality specifications in database: ${totalSpecs}`);
    
  } catch (error) {
    console.error('❌ Error populating quality specifications:', error);
  } finally {
    await prisma.$disconnect();
  }
}

populateQualitySpecs();
