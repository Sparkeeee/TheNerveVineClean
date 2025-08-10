const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function migrateDevDataToMain() {
  console.log('🚀 Starting migration of development data to main database...\n');

  try {
    // Load the backup data
    const backupFile = 'development_database_corrected_2025-08-10T16-34-14-694Z.json';
    
    if (!fs.existsSync(backupFile)) {
      console.log('❌ Backup file not found. Please ensure the backup file exists.');
      return;
    }

    const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    console.log('📁 Backup data loaded successfully');

    // Step 1: Clear existing symptom variants (to avoid conflicts)
    console.log('\n🧹 Clearing existing symptom variants...');
    const deletedVariants = await prisma.symptomVariant.deleteMany({});
    console.log(`   ✅ Deleted ${deletedVariants.count} existing variants`);

    // Step 2: Clear existing symptoms (to avoid conflicts)
    console.log('🧹 Clearing existing symptoms...');
    const deletedSymptoms = await prisma.symptom.deleteMany({});
    console.log(`   ✅ Deleted ${deletedSymptoms.count} existing symptoms`);

    // Step 3: Restore symptoms from backup and track ID mappings
    console.log('\n📥 Restoring symptoms from backup...');
    const symptoms = backupData.Symptom.data;
    const idMapping = {}; // old ID -> new ID mapping
    
    for (const symptom of symptoms) {
      const oldId = symptom.id;
      // Remove the id field to let Prisma generate new ones
      const { id, ...symptomData } = symptom;
      
      const newSymptom = await prisma.symptom.create({
        data: symptomData
      });
      
      idMapping[oldId] = newSymptom.id;
      console.log(`   ✅ Restored: ${symptom.title} (${oldId} -> ${newSymptom.id})`);
    }
    console.log(`   ✅ Restored ${symptoms.length} symptoms`);

    // Step 4: Restore symptom variants from backup with updated parent IDs
    console.log('📥 Restoring symptom variants from backup...');
    const variants = backupData.SymptomVariant.data;
    
    for (const variant of variants) {
      const oldParentId = variant.parentSymptomId;
      const newParentId = idMapping[oldParentId];
      
      if (!newParentId) {
        console.log(`   ⚠️  Skipping variant ${variant.name} - parent symptom not found`);
        continue;
      }
      
      // Remove the id field and update parentSymptomId
      const { id, parentSymptomId, ...variantData } = variant;
      
      await prisma.symptomVariant.create({
        data: {
          ...variantData,
          parentSymptomId: newParentId
        }
      });
      console.log(`   ✅ Restored variant: ${variant.name} -> ${variant.title}`);
    }
    console.log(`   ✅ Restored ${variants.length} symptom variants`);

    // Step 5: Verify the migration
    console.log('\n🔍 Verifying migration...');
    const finalSymptomCount = await prisma.symptom.count();
    const finalVariantCount = await prisma.symptomVariant.count();
    
    console.log(`   📊 Final counts:`);
    console.log(`      Symptoms: ${finalSymptomCount}`);
    console.log(`      Variants: ${finalVariantCount}`);

    if (finalSymptomCount === symptoms.length && finalVariantCount === variants.length) {
      console.log('\n✅ MIGRATION SUCCESSFUL!');
      console.log('   Your symptom consolidation data has been restored to main database.');
    } else {
      console.log('\n⚠️  Migration completed but counts may not match expected values.');
    }

  } catch (error) {
    console.error('❌ Error during migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateDevDataToMain();
