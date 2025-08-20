const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function destroyNanaSpecs() {
  try {
    console.log('🔍 Searching for corrupted "N/A N/A" specs...');
    
    // Find all specs with N/A values
    const corruptedSpecs = await prisma.qualitySpecification.findMany({
      where: {
        OR: [
          { herbName: 'N/A' },
          { supplementName: 'N/A' },
          { herbSlug: 'N/A' },
          { supplementSlug: 'N/A' }
        ]
      },
      select: {
        id: true,
        herbName: true,
        supplementName: true,
        herbSlug: true,
        supplementSlug: true,
        productType: true
      }
    });
    
    console.log(`📊 Found ${corruptedSpecs.length} corrupted specs:`);
    corruptedSpecs.forEach(spec => {
      console.log(`  ID ${spec.id}: ${spec.productType} - Herb: ${spec.herbName || 'N/A'} (${spec.herbSlug || 'N/A'}), Supplement: ${spec.supplementName || 'N/A'} (${spec.supplementSlug || 'N/A'})`);
    });
    
    if (corruptedSpecs.length === 0) {
      console.log('✅ No corrupted specs found!');
      return;
    }
    
    // Delete all corrupted specs
    console.log('\n🗑️  Destroying corrupted specs...');
    for (const spec of corruptedSpecs) {
      console.log(`  Deleting spec ID ${spec.id}...`);
      await prisma.qualitySpecification.delete({
        where: { id: spec.id }
      });
      console.log(`  ✅ Spec ID ${spec.id} destroyed`);
    }
    
    console.log(`\n🎉 Successfully destroyed ${corruptedSpecs.length} corrupted specs!`);
    
  } catch (error) {
    console.error('❌ Error destroying N/A specs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

destroyNanaSpecs();
