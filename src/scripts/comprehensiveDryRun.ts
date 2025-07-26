import { PrismaClient } from '@prisma/client';
import { symptoms as staticSymptoms } from '../data/symptomsData';
import { herbs as staticHerbs } from '../data/herbs';
import { supplements as staticSupplements } from '../data/supplements';

const prisma = new PrismaClient();

// Dry run comprehensive migration function
async function comprehensiveDryRun() {
  console.log('🔍 COMPREHENSIVE DRY RUN MIGRATION');
  console.log('====================================');
  console.log('This will simulate the migration of all content types without making any changes to the database.');
  console.log('');

  try {
    // Extract all data
    console.log('📋 Extracting data from static files...');
    
    // Extract symptoms
    const allSymptoms = Object.entries(staticSymptoms).map(([slug, symptom]) => ({
      slug,
      title: symptom.title,
      description: symptom.description || '',
    }));
    
    // Extract herbs
    const allHerbs = staticHerbs.map(herb => ({
      slug: herb.slug || '',
      name: herb.name,
      description: herb.description,
    }));
    
    // Extract supplements
    const allSupplements = staticSupplements.map(supplement => ({
      slug: supplement.slug || '',
      name: supplement.name,
      description: supplement.description,
    }));
    
    console.log(`Found ${allSymptoms.length} symptoms in static data`);
    console.log(`Found ${allHerbs.length} herbs in static data`);
    console.log(`Found ${allSupplements.length} supplements in static data`);

    // Validate data
    console.log('\n🔍 Validating data...');
    
    const validSymptoms = allSymptoms.filter(s => s.slug && s.title);
    const validHerbs = allHerbs.filter(h => h.slug && h.name);
    const validSupplements = allSupplements.filter(s => s.slug && s.name);
    
    const invalidSymptoms = allSymptoms.filter(s => !s.slug || !s.title);
    const invalidHerbs = allHerbs.filter(h => !h.slug || !h.name);
    const invalidSupplements = allSupplements.filter(s => !s.slug || !s.name);
    
    console.log(`Valid symptoms: ${validSymptoms.length}`);
    console.log(`Valid herbs: ${validHerbs.length}`);
    console.log(`Valid supplements: ${validSupplements.length}`);
    console.log(`Invalid symptoms: ${invalidSymptoms.length}`);
    console.log(`Invalid herbs: ${invalidHerbs.length}`);
    console.log(`Invalid supplements: ${invalidSupplements.length}`);

    // Show invalid items
    if (invalidSymptoms.length > 0) {
      console.log('\n❌ INVALID SYMPTOMS:');
      invalidSymptoms.forEach((invalid, index) => {
        console.log(`${index + 1}. ${invalid.slug || 'NO SLUG'} - Missing required fields`);
      });
    }
    
    if (invalidHerbs.length > 0) {
      console.log('\n❌ INVALID HERBS:');
      invalidHerbs.forEach((invalid, index) => {
        console.log(`${index + 1}. ${invalid.slug || 'NO SLUG'} - Missing required fields`);
      });
    }
    
    if (invalidSupplements.length > 0) {
      console.log('\n❌ INVALID SUPPLEMENTS:');
      invalidSupplements.forEach((invalid, index) => {
        console.log(`${index + 1}. ${invalid.slug || 'NO SLUG'} - Missing required fields`);
      });
    }

    // Show valid items
    console.log('\n✅ VALID SYMPTOMS READY FOR MIGRATION:');
    validSymptoms.forEach((symptom, index) => {
      console.log(`${index + 1}. ${symptom.title} (${symptom.slug})`);
    });
    
    console.log('\n✅ VALID HERBS READY FOR MIGRATION:');
    validHerbs.forEach((herb, index) => {
      console.log(`${index + 1}. ${herb.name} (${herb.slug})`);
    });
    
    console.log('\n✅ VALID SUPPLEMENTS READY FOR MIGRATION:');
    validSupplements.forEach((supplement, index) => {
      console.log(`${index + 1}. ${supplement.name} (${supplement.slug})`);
    });

    // Simulate migration
    console.log('\n🔄 SIMULATING COMPREHENSIVE MIGRATION (DRY RUN)...');
    let processedSymptoms = 0;
    let processedHerbs = 0;
    let processedSupplements = 0;
    let errors = 0;

    // Simulate symptom migration
    for (const symptom of validSymptoms) {
      try {
        console.log(`🔍 [DRY RUN] Would migrate symptom: ${symptom.title} (${symptom.slug})`);
        processedSymptoms++;
      } catch (error) {
        console.error(`❌ [DRY RUN] Would fail symptom: ${symptom.slug} - ${error}`);
        errors++;
      }
    }

    // Simulate herb migration
    for (const herb of validHerbs) {
      try {
        console.log(`🔍 [DRY RUN] Would migrate herb: ${herb.name} (${herb.slug})`);
        processedHerbs++;
      } catch (error) {
        console.error(`❌ [DRY RUN] Would fail herb: ${herb.slug} - ${error}`);
        errors++;
      }
    }

    // Simulate supplement migration
    for (const supplement of validSupplements) {
      try {
        console.log(`🔍 [DRY RUN] Would migrate supplement: ${supplement.name} (${supplement.slug})`);
        processedSupplements++;
      } catch (error) {
        console.error(`❌ [DRY RUN] Would fail supplement: ${supplement.slug} - ${error}`);
        errors++;
      }
    }

    console.log('\n📊 COMPREHENSIVE DRY RUN RESULTS');
    console.log('==================================');
    console.log(`Total symptoms that would be processed: ${validSymptoms.length}`);
    console.log(`Total herbs that would be processed: ${validHerbs.length}`);
    console.log(`Total supplements that would be processed: ${validSupplements.length}`);
    console.log(`Symptoms that would be migrated: ${processedSymptoms}`);
    console.log(`Herbs that would be migrated: ${processedHerbs}`);
    console.log(`Supplements that would be migrated: ${processedSupplements}`);
    console.log(`Simulated failures: ${errors}`);
    
    console.log('\n✅ Comprehensive dry run completed successfully!');
    console.log('If the results look good, run: npm run migrate:comprehensive');
    
  } catch (error) {
    console.error('❌ Comprehensive dry run failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

comprehensiveDryRun(); 