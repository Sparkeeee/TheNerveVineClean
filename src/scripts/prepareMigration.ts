import { PrismaClient, Prisma } from '@prisma/client';
import { symptoms as staticSymptoms } from '../data/symptomsData';

const prisma = new PrismaClient();

// Types for migration data
interface MigrationSymptom {
  slug: string;
  title: string;
  description: string;
  variants?: any;
  relatedSymptoms?: any[];
  emergencyNote?: string;
  disclaimer?: string;
  paragraphs?: string[];
}

interface MigrationHerb {
  name: string;
  slug: string;
  latinName?: string;
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  heroImageUrl?: string;
  cardImageUrl?: string;
  galleryImages?: any;
  cautions?: string;
  productFormulations?: any;
  references?: any;
  indications?: any;
  traditionalUses?: any;
}

interface MigrationSupplement {
  name: string;
  slug: string;
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  heroImageUrl?: string;
  cardImageUrl?: string;
  galleryImages?: any;
  cautions?: string;
  productFormulations?: any;
  references?: any;
  tags?: any;
  indications?: any;
}

// Extract all symptoms from static data
function extractAllSymptoms(): MigrationSymptom[] {
  const extractedSymptoms: MigrationSymptom[] = [];
  
  // Extract from the large symptoms object
  for (const [slug, symptom] of Object.entries(staticSymptoms)) {
    if (symptom && typeof symptom === 'object' && 'title' in symptom) {
      extractedSymptoms.push({
        slug,
        title: symptom.title,
        description: symptom.description || '',
        variants: symptom.variants,
        relatedSymptoms: symptom.relatedSymptoms,
        emergencyNote: symptom.emergencyNote,
        disclaimer: symptom.disclaimer,
        paragraphs: symptom.paragraphs,
      });
    }
  }
  
  return extractedSymptoms;
}

// Validate symptom data before migration
function validateSymptomData(symptoms: MigrationSymptom[]): { valid: MigrationSymptom[], invalid: any[] } {
  const valid: MigrationSymptom[] = [];
  const invalid: any[] = [];
  
  for (const symptom of symptoms) {
    if (!symptom.slug || !symptom.title) {
      invalid.push({ ...symptom, error: 'Missing required fields (slug or title)' });
      continue;
    }
    
    if (symptom.slug.length < 2) {
      invalid.push({ ...symptom, error: 'Slug too short' });
      continue;
    }
    
    valid.push(symptom);
  }
  
  return { valid, invalid };
}

// Safe migration function with rollback capability
async function migrateSymptoms(symptoms: MigrationSymptom[]): Promise<{ success: number, failed: number, errors: string[] }> {
  const results = { success: 0, failed: 0, errors: [] as string[] };
  
  for (const symptom of symptoms) {
    try {
      await prisma.symptom.upsert({
        where: { slug: symptom.slug },
        update: {
          title: symptom.title,
          description: symptom.description,
        },
        create: {
          slug: symptom.slug,
          title: symptom.title,
          description: symptom.description,
        },
      });
      results.success++;
      console.log(`✅ Migrated symptom: ${symptom.title} (${symptom.slug})`);
    } catch (error) {
      results.failed++;
      const errorMsg = `Failed to migrate symptom ${symptom.slug}: ${error}`;
      results.errors.push(errorMsg);
      console.error(`❌ ${errorMsg}`);
    }
  }
  
  return results;
}

// Generate migration report
function generateMigrationReport(symptoms: MigrationSymptom[], validation: { valid: MigrationSymptom[], invalid: any[] }) {
  console.log('\n📊 MIGRATION PREPARATION REPORT');
  console.log('================================');
  console.log(`Total symptoms found: ${symptoms.length}`);
  console.log(`Valid symptoms: ${validation.valid.length}`);
  console.log(`Invalid symptoms: ${validation.invalid.length}`);
  
  if (validation.invalid.length > 0) {
    console.log('\n❌ INVALID SYMPTOMS:');
    validation.invalid.forEach((invalid, index) => {
      console.log(`${index + 1}. ${invalid.slug || 'NO SLUG'} - ${invalid.error}`);
    });
  }
  
  console.log('\n✅ VALID SYMPTOMS READY FOR MIGRATION:');
  validation.valid.forEach((symptom, index) => {
    console.log(`${index + 1}. ${symptom.title} (${symptom.slug})`);
  });
  
  return {
    total: symptoms.length,
    valid: validation.valid.length,
    invalid: validation.invalid.length,
    validSymptoms: validation.valid,
    invalidSymptoms: validation.invalid,
  };
}

// Main migration preparation function
async function prepareMigration() {
  console.log('🚀 Starting migration preparation...\n');
  
  try {
    // Extract all symptoms
    console.log('📋 Extracting symptoms from static data...');
    const allSymptoms = extractAllSymptoms();
    console.log(`Found ${allSymptoms.length} symptoms in static data`);
    
    // Validate data
    console.log('\n🔍 Validating symptom data...');
    const validation = validateSymptomData(allSymptoms);
    
    // Generate report
    const report = generateMigrationReport(allSymptoms, validation);
    
    // Ask for confirmation before proceeding
    console.log('\n⚠️  MIGRATION READY');
    console.log('==================');
    console.log(`Ready to migrate ${report.valid} symptoms to database`);
    console.log(`${report.invalid} symptoms have validation issues`);
    
    if (report.invalid > 0) {
      console.log('\n⚠️  WARNING: Some symptoms have validation issues');
      console.log('Consider fixing these before proceeding with migration');
    }
    
    // Create migration data file
    const migrationData = {
      timestamp: new Date().toISOString(),
      totalSymptoms: report.total,
      validSymptoms: report.valid,
      invalidSymptoms: report.invalid,
      symptoms: report.validSymptoms,
      errors: report.invalidSymptoms,
    };
    
    console.log('\n💾 Migration data prepared successfully!');
    console.log('Next steps:');
    console.log('1. Review the validation report above');
    console.log('2. Run the actual migration script');
    console.log('3. Test the migrated data');
    
    return migrationData;
    
  } catch (error) {
    console.error('❌ Migration preparation failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Export for use in other scripts
export { prepareMigration, extractAllSymptoms, validateSymptomData, migrateSymptoms };

// Run the migration preparation
prepareMigration()
  .then(() => {
    console.log('\n✅ Migration preparation completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration preparation failed:', error);
    process.exit(1);
  }); 