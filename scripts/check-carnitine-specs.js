const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkCarnitineSpecs() {
  try {
    console.log('🔍 Checking all carnitine-related quality specifications...');
    
    const carnitineSpecs = await prisma.qualitySpecification.findMany({
      where: {
        OR: [
          { supplementSlug: { contains: 'carnitine' } },
          { supplementName: { contains: 'carnitine' } },
          { supplementSlug: { contains: 'Carnitine' } },
          { supplementName: { contains: 'Carnitine' } }
        ]
      },
      select: {
        id: true,
        supplementName: true,
        supplementSlug: true,
        productType: true,
        notes: true,
        customSpecs: true,
        approach: true,
        standardised: true
      }
    });
    
    console.log(`📊 Found ${carnitineSpecs.length} carnitine-related specs:\n`);
    
    carnitineSpecs.forEach(spec => {
      console.log(`ID ${spec.id}: ${spec.supplementName || 'N/A'} (${spec.supplementSlug || 'N/A'})`);
      console.log(`  Type: ${spec.productType}`);
      console.log(`  Approach: ${spec.approach || 'N/A'}`);
      console.log(`  Standardised: ${spec.standardised ? 'Yes' : 'No'}`);
      console.log(`  Custom Specs: "${spec.customSpecs || 'N/A'}"`);
      console.log(`  Notes: "${spec.notes || 'N/A'}"`);
      console.log('  ---');
    });
    
  } catch (error) {
    console.error('❌ Error checking carnitine specs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCarnitineSpecs();
