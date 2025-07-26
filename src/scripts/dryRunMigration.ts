import { PrismaClient } from '@prisma/client';
import { symptoms as staticSymptoms } from '../data/symptomsData';

const prisma = new PrismaClient();

// Dry run migration function
async function dryRunMigration() {
  console.log('🔍 DRY RUN MIGRATION');
  console.log('=====================');
  console.log('This will simulate the migration without making any changes to the database.');
  console.log('');

  try {
    // Extract all symptoms
    console.log('📋 Extracting symptoms from static data...');
    const allSymptoms = Object.entries(staticSymptoms).map(([slug, symptom]) => ({
      slug,
      title: symptom.title,
      description: symptom.description || '',
    }));
    console.log(`Found ${allSymptoms.length} symptoms in static data`);

    // Validate data
    console.log('\n🔍 Validating symptom data...');
    const validSymptoms = allSymptoms.filter(s => s.slug && s.title);
    const invalidSymptoms = allSymptoms.filter(s => !s.slug || !s.title);
    
    console.log(`Valid symptoms: ${validSymptoms.length}`);
    console.log(`Invalid symptoms: ${invalidSymptoms.length}`);

    if (invalidSymptoms.length > 0) {
      console.log('\n❌ INVALID SYMPTOMS:');
      invalidSymptoms.forEach((invalid, index) => {
        console.log(`${index + 1}. ${invalid.slug || 'NO SLUG'} - Missing required fields`);
      });
    }

    console.log('\n✅ VALID SYMPTOMS READY FOR MIGRATION:');
    validSymptoms.forEach((symptom, index) => {
      console.log(`${index + 1}. ${symptom.title} (${symptom.slug})`);
    });

    // Simulate migration
    console.log('\n🔄 SIMULATING MIGRATION (DRY RUN)...');
    let processed = 0;
    let errors = 0;

    for (const symptom of validSymptoms) {
      try {
        // Simulate database operation
        console.log(`🔍 [DRY RUN] Would migrate: ${symptom.title} (${symptom.slug})`);
        processed++;
      } catch (error) {
        console.error(`❌ [DRY RUN] Would fail: ${symptom.slug} - ${error}`);
        errors++;
      }
    }

    console.log('\n📊 DRY RUN RESULTS');
    console.log('==================');
    console.log(`Total symptoms that would be processed: ${validSymptoms.length}`);
    console.log(`Symptoms that would be migrated: ${processed}`);
    console.log(`Simulated failures: ${errors}`);
    
    console.log('\n✅ Dry run completed successfully!');
    console.log('If the results look good, run: npm run migrate:execute');
    
  } catch (error) {
    console.error('❌ Dry run failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

dryRunMigration(); 