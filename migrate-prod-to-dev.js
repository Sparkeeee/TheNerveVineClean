const { PrismaClient } = require('@prisma/client');

// This script migrates all production data to development database
// Run this when .env has production DATABASE_URL

const prisma = new PrismaClient();

async function migrateProductionData() {
  try {
    console.log('🔄 Starting production data migration...');
    
    // Extract all production data
    console.log('📊 Extracting production data...');
    
    const productionHerbs = await prisma.herb.findMany({
      include: {
        indicationTags: true,
        products: true,
        symptomVariants: true
      }
    });
    
    const productionSymptoms = await prisma.symptom.findMany({
      include: {
        variants: true,
        products: true
      }
    });
    
    const productionSupplements = await prisma.supplement.findMany({
      include: {
        indicationTags: true,
        products: true,
        symptomVariants: true
      }
    });
    
    const productionQualitySpecs = await prisma.qualitySpecification.findMany();
    const productionMerchants = await prisma.merchant.findMany();
    const productionProducts = await prisma.product.findMany();
    const productionIndications = await prisma.indication.findMany();
    
    console.log(`✅ Extracted production data:`);
    console.log(`   - ${productionHerbs.length} herbs`);
    console.log(`   - ${productionSymptoms.length} symptoms`);
    console.log(`   - ${productionSupplements.length} supplements`);
    console.log(`   - ${productionQualitySpecs.length} quality specs`);
    console.log(`   - ${productionMerchants.length} merchants`);
    console.log(`   - ${productionProducts.length} products`);
    console.log(`   - ${productionIndications.length} indications`);
    
    // Save data to JSON files for transfer
    const fs = require('fs');
    const path = require('path');
    
    const migrationData = {
      herbs: productionHerbs,
      symptoms: productionSymptoms,
      supplements: productionSupplements,
      qualitySpecs: productionQualitySpecs,
      merchants: productionMerchants,
      products: productionProducts,
      indications: productionIndications,
      migratedAt: new Date().toISOString()
    };
    
    fs.writeFileSync('migration-data.json', JSON.stringify(migrationData, null, 2));
    
    console.log('💾 Production data saved to migration-data.json');
    console.log('✅ Migration extraction complete!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Switch .env back to development DATABASE_URL');
    console.log('2. Run: node import-migration-data.js');
    console.log('3. Verify all data is imported correctly');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateProductionData();
