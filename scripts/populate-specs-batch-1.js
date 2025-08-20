const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// BATCH 1: First 10 herbs and first 10 supplements
const qualitySpecs = [
  // HERBS - First 10
  {
    herbSlug: 'agnus-castus',
    formulationTypeName: 'Capsules/Tablets',
    approach: 'Traditional',
    standardised: false,
    customSpecs: 'Whole herb powder, 400-500mg per capsule',
    notes: 'Agnus castus works best as whole herb powder for hormonal balance support.'
  },
  {
    herbSlug: 'american-ginseng',
    formulationTypeName: 'Capsules/Tablets',
    approach: 'Modern',
    standardised: true,
    customSpecs: 'Standardized to 5% ginsenosides, minimum 100mg per dose',
    notes: 'American ginseng should be standardized for consistent ginsenoside content.'
  },
  {
    herbSlug: 'ashwagandha',
    formulationTypeName: 'Capsules/Tablets',
    approach: 'Modern',
    standardised: true,
    customSpecs: 'Standardized to 5% withanolides, minimum 300mg per dose',
    notes: 'Ashwagandha withanolides are key active compounds for stress support.'
  },
  {
    herbSlug: 'astragalus-root',
    formulationTypeName: 'Capsules/Tablets',
    approach: 'Traditional',
    standardised: false,
    customSpecs: 'Whole root powder, 500-1000mg per dose',
    notes: 'Astragalus root powder provides complete immune-supporting compounds.'
  },
  {
    herbSlug: 'bilberry',
    formulationTypeName: 'Capsules/Tablets',
    approach: 'Modern',
    standardised: true,
    customSpecs: 'Standardized to 25% anthocyanins, minimum 100mg per dose',
    notes: 'Bilberry anthocyanins are essential for eye health and circulation.'
  },
  {
    herbSlug: 'bladderwrack',
    formulationTypeName: 'Capsules/Tablets',
    approach: 'Traditional',
    standardised: false,
    customSpecs: 'Whole seaweed powder, 300-500mg per dose',
    notes: 'Bladderwrack provides natural iodine and minerals for thyroid support.'
  },
  {
    herbSlug: 'brahmi',
    formulationTypeName: 'Capsules/Tablets',
    approach: 'Modern',
    standardised: true,
    customSpecs: 'Standardized to 20% bacosides, minimum 300mg per dose',
    notes: 'Brahmi bacosides are key for cognitive enhancement and memory.'
  },
  {
    herbSlug: 'butterbur',
    formulationTypeName: 'Capsules/Tablets',
    approach: 'Modern',
    standardised: true,
    customSpecs: 'Standardized to 15% petasins, PA-free, minimum 50mg per dose',
    notes: 'Butterbur must be PA-free and standardized for migraine prevention.'
  },
  {
    herbSlug: 'chamomile',
    formulationTypeName: 'Tincture',
    approach: 'Traditional',
    standardised: false,
    customSpecs: '1:5 ratio preferred, fresh flowers, 40% alcohol',
    notes: 'Chamomile tinctures should use fresh flowers for best volatile oil content.'
  },
  {
    herbSlug: 'chilli-pepper',
    formulationTypeName: 'Capsules/Tablets',
    approach: 'Modern',
    standardised: true,
    customSpecs: 'Standardized to 2% capsaicin, minimum 100mg per dose',
    notes: 'Capsaicin content determines the metabolic and pain-relieving effects.'
  },

  // SUPPLEMENTS - First 10
  {
    supplementSlug: '5-htp',
    formulationTypeName: 'Supplement Capsules/Tablets',
    approach: 'Modern',
    standardised: false,
    customSpecs: 'Minimum 100mg, 200mg preferred, enteric coated',
    notes: '5-HTP should be enteric coated to prevent stomach upset and ensure absorption.'
  },
  {
    supplementSlug: 'acetyl-l-carnitine',
    formulationTypeName: 'Supplement Capsules/Tablets',
    approach: 'Modern',
    standardised: false,
    customSpecs: '500mg, 1000mg, acetyl-L-carnitine form',
    notes: 'Acetyl-L-carnitine is the most bioavailable form for brain and energy support.'
  },
  {
    supplementSlug: 'alpha-lipoic-acid',
    formulationTypeName: 'Supplement Capsules/Tablets',
    approach: 'Modern',
    standardised: false,
    customSpecs: '300mg, 600mg, R-alpha-lipoic acid preferred',
    notes: 'R-alpha-lipoic acid is the natural, more effective form for antioxidant support.'
  },
  {
    supplementSlug: 'b-complex',
    formulationTypeName: 'Supplement Capsules/Tablets',
    approach: 'Modern',
    standardised: false,
    customSpecs: 'Complete B-vitamin complex, methylated forms preferred',
    notes: 'Methylated B-vitamins are better absorbed, especially for those with MTHFR variants.'
  },
  {
    supplementSlug: 'biotin',
    formulationTypeName: 'Supplement Capsules/Tablets',
    approach: 'Modern',
    standardised: false,
    customSpecs: '1000mcg, 5000mcg, D-biotin form',
    notes: 'D-biotin is the natural, active form for hair, skin, and nail support.'
  },
  {
    supplementSlug: 'boron',
    formulationTypeName: 'Supplement Capsules/Tablets',
    approach: 'Modern',
    standardised: false,
    customSpecs: '3mg, 6mg, boron citrate or glycinate',
    notes: 'Boron citrate or glycinate forms provide better absorption for bone health.'
  },
  {
    supplementSlug: 'bromelain',
    formulationTypeName: 'Supplement Capsules/Tablets',
    approach: 'Modern',
    standardised: true,
    customSpecs: 'Standardized to 2000 GDU, minimum 500mg per dose',
    notes: 'Bromelain activity is measured in GDU units for digestive and anti-inflammatory effects.'
  },
  {
    supplementSlug: 'calcium',
    formulationTypeName: 'Supplement Capsules/Tablets',
    approach: 'Modern',
    standardised: false,
    customSpecs: '500mg, 1000mg, calcium citrate or glycinate',
    notes: 'Calcium citrate and glycinate are more bioavailable than carbonate forms.'
  },
  {
    supplementSlug: 'carnitine',
    formulationTypeName: 'Supplement Capsules/Tablets',
    approach: 'Modern',
    standardised: false,
    customSpecs: '500mg, 1000mg, L-carnitine base or tartrate',
    notes: 'L-carnitine base or tartrate forms are effective for energy and fat metabolism.'
  },
  {
    supplementSlug: 'choline',
    formulationTypeName: 'Supplement Capsules/Tablets',
    approach: 'Modern',
    standardised: false,
    customSpecs: '250mg, 500mg, choline bitartrate or CDP-choline',
    notes: 'CDP-choline is the most bioavailable form for brain and liver support.'
  }
];

async function populateBatch1() {
  try {
    console.log('🌱 Populating BATCH 1: First 10 herbs and first 10 supplements...\n');
    
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
               productType: spec.herbSlug ? 'herb' : 'supplement',
               priceRange: { min: 0, max: 1000 },
               ratingThreshold: 4.0,
               reviewCountThreshold: 10,
               brandPreferences: [],
               brandAvoid: [],
               // Provide default values for old required fields
               requiredTerms: [],
               preferredTerms: [],
               avoidTerms: [],
               standardization: null,
               alcoholSpecs: null,
               dosageSpecs: null,
               formulationName: null,
               supplementName: spec.supplementSlug ? spec.supplementSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : null,
               herbName: spec.herbSlug ? spec.herbSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : null
             }
           });
          createdCount++;
          console.log(`🆕 Created: ${spec.herbSlug || spec.supplementSlug} - ${spec.formulationTypeName}`);
        }
        
      } catch (error) {
        console.error(`❌ Error processing ${spec.herbSlug || spec.supplementSlug}:`, error.message);
      }
    }
    
    console.log(`\n🎉 BATCH 1 completed successfully!`);
    console.log(`📊 Created: ${createdCount}, Updated: ${updatedCount}`);
    
    // Show summary
    const totalSpecs = await prisma.qualitySpecification.count();
    console.log(`\n📋 Total quality specifications in database: ${totalSpecs}`);
    
  } catch (error) {
    console.error('❌ Error populating batch 1:', error);
  } finally {
    await prisma.$disconnect();
  }
}

populateBatch1();
