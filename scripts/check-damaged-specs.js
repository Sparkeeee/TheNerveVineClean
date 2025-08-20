const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDamagedSpecs() {
  try {
    console.log('🔍 Checking for 5-HTP and acetyl-l-carnitine specs...');
    
    // Check for 5-HTP specs
    const htpSpecs = await prisma.qualitySpecification.findMany({
      where: {
        OR: [
          { supplementSlug: '5-htp' },
          { supplementName: '5-HTP' }
        ]
      }
    });
    
    console.log(`\n📊 5-HTP specs found: ${htpSpecs.length}`);
    htpSpecs.forEach(spec => {
      console.log(`  ID ${spec.id}: ${spec.supplementName || 'N/A'} (${spec.supplementSlug || 'N/A'})`);
      console.log(`    Notes: "${spec.notes || 'N/A'}"`);
      console.log(`    Custom Specs: "${spec.customSpecs || 'N/A'}"`);
    });
    
    // Check for acetyl-l-carnitine specs
    const carnitineSpecs = await prisma.qualitySpecification.findMany({
      where: {
        OR: [
          { supplementSlug: 'acetyl-l-carnitine' },
          { supplementName: 'Acetyl L-Carnitine' }
        ]
      }
    });
    
    console.log(`\n📊 Acetyl-L-Carnitine specs found: ${carnitineSpecs.length}`);
    carnitineSpecs.forEach(spec => {
      console.log(`  ID ${spec.id}: ${spec.supplementName || 'N/A'} (${spec.supplementSlug || 'N/A'})`);
      console.log(`    Notes: "${spec.notes || 'N/A'}"`);
      console.log(`    Custom Specs: "${spec.customSpecs || 'N/A'}"`);
    });
    
  } catch (error) {
    console.error('❌ Error checking damaged specs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDamagedSpecs();
