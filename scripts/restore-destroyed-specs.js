const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function restoreDestroyedSpecs() {
  try {
    console.log('🔧 Restoring destroyed quality specifications...');
    
    // First, get the supplement IDs
    const htpSupplement = await prisma.supplement.findUnique({
      where: { slug: '5-htp' }
    });
    
    const carnitineSupplement = await prisma.supplement.findUnique({
      where: { slug: 'acetyl-l-carnitine' }
    });
    
    if (!htpSupplement) {
      console.log('❌ 5-HTP supplement not found in database');
      return;
    }
    
    if (!carnitineSupplement) {
      console.log('❌ Acetyl-L-Carnitine supplement not found in database');
      return;
    }
    
    console.log(`✅ Found 5-HTP supplement ID: ${htpSupplement.id}`);
    console.log(`✅ Found Acetyl-L-Carnitine supplement ID: ${carnitineSupplement.id}`);
    
    // Get the formulation type for supplement capsules/tablets
    const formulationType = await prisma.formulationType.findFirst({
      where: { name: 'Supplement Capsules/Tablets' }
    });
    
    if (!formulationType) {
      console.log('❌ Supplement Capsules/Tablets formulation type not found');
      return;
    }
    
    console.log(`✅ Found formulation type ID: ${formulationType.id}`);
    
    // Restore 5-HTP spec
    console.log('\n🔧 Restoring 5-HTP quality specification...');
    const htpSpec = await prisma.qualitySpecification.create({
      data: {
        productType: 'supplement',
        supplementId: htpSupplement.id,
        supplementSlug: '5-htp',
        supplementName: '5-HTP',
        formulationTypeId: formulationType.id,
        approach: 'modern',
        standardised: false,
        customSpecs: 'Minimum 100mg, 200mg preferred, enteric coated',
        notes: '5-HTP should be enteric coated to prevent stomach upset and ensure absorption.',
        requiredTerms: [],
        preferredTerms: [],
        avoidTerms: [],
        standardization: {},
        alcoholSpecs: {},
        dosageSpecs: {},
        priceRange: { min: 0, max: 1000 },
        ratingThreshold: 4.0,
        reviewCountThreshold: 10,
        brandPreferences: [],
        brandAvoid: []
      }
    });
    
    console.log(`✅ 5-HTP spec restored with ID: ${htpSpec.id}`);
    
    // Restore Acetyl-L-Carnitine spec
    console.log('\n🔧 Restoring Acetyl-L-Carnitine quality specification...');
    const carnitineSpec = await prisma.qualitySpecification.create({
      data: {
        productType: 'supplement',
        supplementId: carnitineSupplement.id,
        supplementSlug: 'acetyl-l-carnitine',
        supplementName: 'Acetyl L-Carnitine',
        formulationTypeId: formulationType.id,
        approach: 'modern',
        standardised: false,
        customSpecs: '500mg, 1000mg, acetyl-L-carnitine form',
        notes: 'Acetyl-L-carnitine is the most bioavailable form for brain function and energy support.',
        requiredTerms: [],
        preferredTerms: [],
        avoidTerms: [],
        standardization: {},
        alcoholSpecs: {},
        dosageSpecs: {},
        priceRange: { min: 0, max: 1000 },
        ratingThreshold: 4.0,
        reviewCountThreshold: 10,
        brandPreferences: [],
        brandAvoid: []
      }
    });
    
    console.log(`✅ Acetyl-L-Carnitine spec restored with ID: ${carnitineSpec.id}`);
    
    console.log('\n🎉 Both quality specifications successfully restored!');
    
  } catch (error) {
    console.error('❌ Error restoring specs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

restoreDestroyedSpecs();
