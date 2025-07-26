import { PrismaClient } from '@prisma/client';
import { symptoms } from '../data/symptomsData';

const prisma = new PrismaClient();

interface MigrationSymptom {
  slug: string;
  title: string;
  description: string;
  name?: string;
  paragraphs?: string[];
  symptoms?: string[];
  causes?: string[];
  naturalSolutions?: any[];
  relatedSymptoms?: any[];
  disclaimer?: string;
  emergencyNote?: string;
  variants?: Record<string, any>;
}

async function migrateSymptomData() {
  console.log('🚀 Starting symptom data migration...');
  
  try {
    // Extract and transform data from static object
    const symptomsToMigrate: MigrationSymptom[] = Object.entries(symptoms).map(([slug, symptom]) => ({
      slug,
      title: symptom.title || symptom.name || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      description: symptom.description || '',
      name: symptom.name,
      paragraphs: symptom.paragraphs,
      symptoms: symptom.symptoms,
      causes: symptom.causes,
      naturalSolutions: symptom.naturalSolutions,
      relatedSymptoms: symptom.relatedSymptoms,
      disclaimer: symptom.disclaimer,
      emergencyNote: symptom.emergencyNote,
      variants: symptom.variants
    }));

    console.log(`📊 Found ${symptomsToMigrate.length} symptoms to migrate`);

    let successCount = 0;
    let errorCount = 0;

    for (const symptomData of symptomsToMigrate) {
      try {
        await prisma.symptom.upsert({
          where: { slug: symptomData.slug },
          update: {
            title: symptomData.title,
            description: symptomData.description,
            name: symptomData.name,
            paragraphs: symptomData.paragraphs,
            symptoms: symptomData.symptoms,
            causes: symptomData.causes,
            naturalSolutions: symptomData.naturalSolutions,
            relatedSymptoms: symptomData.relatedSymptoms,
            disclaimer: symptomData.disclaimer,
            emergencyNote: symptomData.emergencyNote,
            variants: symptomData.variants
          },
          create: {
            slug: symptomData.slug,
            title: symptomData.title,
            description: symptomData.description,
            name: symptomData.name,
            paragraphs: symptomData.paragraphs,
            symptoms: symptomData.symptoms,
            causes: symptomData.causes,
            naturalSolutions: symptomData.naturalSolutions,
            relatedSymptoms: symptomData.relatedSymptoms,
            disclaimer: symptomData.disclaimer,
            emergencyNote: symptomData.emergencyNote,
            variants: symptomData.variants
          }
        });

        console.log(`✅ Migrated: ${symptomData.title} (${symptomData.slug})`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to migrate ${symptomData.slug}:`, error);
        errorCount++;
      }
    }

    console.log('\n📈 Migration Summary:');
    console.log(`✅ Successfully migrated: ${successCount} symptoms`);
    console.log(`❌ Failed migrations: ${errorCount} symptoms`);
    console.log(`📊 Total processed: ${symptomsToMigrate.length} symptoms`);

  } catch (error) {
    console.error('💥 Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateSymptomData();
}

export { migrateSymptomData }; 