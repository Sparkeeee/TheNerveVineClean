const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function destroyId1() {
  try {
    console.log('🔍 Checking ID 1 spec...');
    
    const spec = await prisma.qualitySpecification.findUnique({
      where: { id: 1 },
      select: {
        id: true,
        herbName: true,
        supplementName: true,
        herbSlug: true,
        supplementSlug: true,
        productType: true
      }
    });
    
    if (!spec) {
      console.log('✅ ID 1 spec not found - already destroyed');
      return;
    }
    
    console.log('📊 Found corrupted ID 1 spec:');
    console.log(`  ID: ${spec.id}`);
    console.log(`  Product Type: ${spec.productType}`);
    console.log(`  Herb Name: "${spec.herbName || 'NULL'}"`);
    console.log(`  Herb Slug: "${spec.herbSlug || 'NULL'}"`);
    console.log(`  Supplement Name: "${spec.supplementName || 'NULL'}"`);
    console.log(`  Supplement Slug: "${spec.supplementSlug || 'NULL'}"`);
    
    console.log('\n🗑️  Destroying corrupted ID 1 spec...');
    await prisma.qualitySpecification.delete({
      where: { id: 1 }
    });
    
    console.log('✅ ID 1 spec successfully destroyed!');
    
  } catch (error) {
    console.error('❌ Error destroying ID 1 spec:', error);
  } finally {
    await prisma.$disconnect();
  }
}

destroyId1();
