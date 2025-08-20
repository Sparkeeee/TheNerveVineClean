const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAllSpecs() {
  try {
    console.log('🔍 Checking all quality specifications...');
    
    const allSpecs = await prisma.qualitySpecification.findMany({
      select: {
        id: true,
        herbName: true,
        supplementName: true,
        herbSlug: true,
        supplementSlug: true,
        productType: true,
        formulationTypeId: true
      },
      orderBy: { id: 'asc' }
    });
    
    console.log(`📊 Found ${allSpecs.length} total specs:\n`);
    
    allSpecs.forEach(spec => {
      console.log(`ID ${spec.id}: ${spec.productType}`);
      console.log(`  Herb: "${spec.herbName || 'NULL'}" (slug: "${spec.herbSlug || 'NULL'}")`);
      console.log(`  Supplement: "${spec.supplementName || 'NULL'}" (slug: "${spec.supplementSlug || 'NULL'}")`);
      console.log(`  Formulation Type ID: ${spec.formulationTypeId || 'NULL'}`);
      console.log('  ---');
    });
    
  } catch (error) {
    console.error('❌ Error checking specs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAllSpecs();
