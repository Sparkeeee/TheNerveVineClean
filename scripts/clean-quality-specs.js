const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanQualitySpecs() {
  try {
    console.log('🧹 Cleaning up QualitySpecification table...\n');
    
    // Count existing records
    const count = await prisma.qualitySpecification.count();
    console.log(`📊 Found ${count} existing quality specifications`);
    
    if (count === 0) {
      console.log('✅ Table is already empty, nothing to clean');
      return;
    }
    
    // Delete all records
    const result = await prisma.qualitySpecification.deleteMany({});
    console.log(`🗑️  Deleted ${result.count} quality specifications`);
    
    // Verify table is empty
    const newCount = await prisma.qualitySpecification.count();
    console.log(`📊 Table now contains ${newCount} records`);
    
    console.log('\n🎉 Cleanup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanQualitySpecs();
