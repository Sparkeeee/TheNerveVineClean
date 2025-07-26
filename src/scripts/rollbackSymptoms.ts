import { PrismaClient } from '@prisma/client';
import { symptoms as staticSymptoms } from '../data/symptomsData';

const prisma = new PrismaClient();

// Rollback symptoms migration
async function rollbackSymptomsMigration() {
  console.log('🔄 ROLLING BACK SYMPTOMS MIGRATION');
  console.log('====================================');
  console.log('This will remove symptoms that were migrated from static data.');
  console.log('');

  try {
    // Get all symptoms that were in the static data
    const staticSymptomSlugs = Object.keys(staticSymptoms);
    console.log(`Found ${staticSymptomSlugs.length} symptoms in static data to potentially remove:`);
    staticSymptomSlugs.forEach((slug, index) => {
      console.log(`${index + 1}. ${slug}`);
    });

    // Get current symptoms in database
    const currentSymptoms = await prisma.symptom.findMany({
      select: { id: true, slug: true, title: true }
    });
    console.log(`\nFound ${currentSymptoms.length} symptoms currently in database:`);
    currentSymptoms.forEach((symptom, index) => {
      console.log(`${index + 1}. ${symptom.title} (${symptom.slug})`);
    });

    // Find symptoms that were migrated (exist in both static data and database)
    const symptomsToRemove = currentSymptoms.filter(symptom => 
      staticSymptomSlugs.includes(symptom.slug)
    );

    console.log(`\n⚠️  SYMPTOMS TO BE REMOVED (${symptomsToRemove.length}):`);
    symptomsToRemove.forEach((symptom, index) => {
      console.log(`${index + 1}. ${symptom.title} (${symptom.slug})`);
    });

    if (symptomsToRemove.length === 0) {
      console.log('\n✅ No symptoms to remove - rollback not needed');
      return;
    }

    // Confirm before proceeding
    console.log('\n⚠️  WARNING: This will permanently delete these symptoms from the database!');
    console.log('Are you sure you want to proceed? (This action cannot be undone)');
    console.log('\nTo proceed, run: npm run rollback:symptoms -- --confirm');

    // Check if --confirm flag is provided
    const args = process.argv.slice(2);
    if (!args.includes('--confirm')) {
      console.log('\n❌ Rollback aborted. Use --confirm flag to proceed.');
      return;
    }

    console.log('\n🔄 Proceeding with rollback...');

    // Remove the symptoms
    let removedCount = 0;
    for (const symptom of symptomsToRemove) {
      try {
        await prisma.symptom.delete({
          where: { id: symptom.id }
        });
        console.log(`✅ Removed: ${symptom.title} (${symptom.slug})`);
        removedCount++;
      } catch (error) {
        console.error(`❌ Failed to remove ${symptom.slug}: ${error}`);
      }
    }

    // Verify rollback
    const remainingSymptoms = await prisma.symptom.findMany({
      select: { id: true, slug: true, title: true }
    });

    console.log('\n📊 ROLLBACK COMPLETED');
    console.log('=======================');
    console.log(`Symptoms removed: ${removedCount}`);
    console.log(`Symptoms remaining in database: ${remainingSymptoms.length}`);

    if (remainingSymptoms.length > 0) {
      console.log('\nRemaining symptoms:');
      remainingSymptoms.forEach((symptom, index) => {
        console.log(`${index + 1}. ${symptom.title} (${symptom.slug})`);
      });
    }

    console.log('\n✅ Rollback completed successfully!');

  } catch (error) {
    console.error('❌ Rollback failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

rollbackSymptomsMigration(); 