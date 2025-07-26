import { PrismaClient, Prisma } from '@prisma/client';
import { symptoms as staticSymptoms } from '../data/symptomsData';

const prisma = new PrismaClient();

// Migration configuration
const MIGRATION_CONFIG = {
  batchSize: 10,
  retryAttempts: 3,
  dryRun: false,
};

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

// Migration status tracking
interface MigrationStatus {
  total: number;
  completed: number;
  failed: number;
  errors: string[];
  startTime: Date;
  endTime?: Date;
}

// Extract all symptoms from static data
function extractSymptoms(): MigrationSymptom[] {
  const extractedSymptoms: MigrationSymptom[] = [];
  
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

// Migrate symptoms
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
  console.log('\n📊 SYMPTOMS MIGRATION REPORT');
  console.log('==============================');
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

// Main symptoms-only migration function
async function executeSymptomsMigration(): Promise<MigrationStatus> {
  const status: MigrationStatus = {
    total: 0,
    completed: 0,
    failed: 0,
    errors: [],
    startTime: new Date(),
  };

  console.log('🚀 Starting symptoms-only migration...\n');

  try {
    // Step 1: Extract and validate symptoms
    console.log('📋 Extracting symptoms from static data...');
    const allSymptoms = extractSymptoms();
    console.log(`Found ${allSymptoms.length} symptoms in static data`);
    
    // Validate data
    console.log('\n🔍 Validating symptom data...');
    const validation = validateSymptomData(allSymptoms);
    
    // Generate report
    const report = generateMigrationReport(allSymptoms, validation);
    
    status.total = report.validSymptoms.length;

    if (status.total === 0) {
      console.log('❌ No valid symptoms to migrate');
      return status;
    }

    // Step 2: Create backup of existing symptoms
    console.log('\n💾 Creating backup of existing symptoms...');
    const existingSymptoms = await prisma.symptom.findMany({
      select: { id: true, slug: true, title: true, description: true }
    });
    console.log(`Found ${existingSymptoms.length} existing symptoms in database`);

    // Step 3: Execute migration
    console.log(`\n🔄 Executing symptoms migration (${MIGRATION_CONFIG.dryRun ? 'DRY RUN' : 'LIVE'})...`);
    
    if (MIGRATION_CONFIG.dryRun) {
      console.log('🔍 [DRY RUN] Would migrate symptoms:', report.validSymptoms.length);
      status.completed = report.validSymptoms.length;
    } else {
      const results = await migrateSymptoms(report.validSymptoms);
      status.completed = results.success;
      status.failed = results.failed;
      status.errors = results.errors;
    }

    status.endTime = new Date();
    
    // Step 4: Generate final report
    console.log('\n📊 SYMPTOMS MIGRATION COMPLETED');
    console.log('==================================');
    console.log(`Total symptoms processed: ${status.total}`);
    console.log(`Successfully migrated: ${status.completed}`);
    console.log(`Failed migrations: ${status.failed}`);
    console.log(`Duration: ${status.endTime.getTime() - status.startTime.getTime()}ms`);
    
    if (status.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      status.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    // Step 5: Verify migration
    if (!MIGRATION_CONFIG.dryRun) {
      console.log('\n🔍 Verifying migration...');
      const migratedCount = await prisma.symptom.count();
      console.log(`Total symptoms in database: ${migratedCount}`);
      
      if (migratedCount >= status.completed) {
        console.log('✅ Migration verification successful');
      } else {
        console.warn('⚠️  Migration verification: Some symptoms may not have been migrated');
      }
    }

    return status;

  } catch (error) {
    console.error('❌ Symptoms migration failed:', error);
    status.errors.push(`Migration failed: ${error}`);
    return status;
  } finally {
    await prisma.$disconnect();
  }
}

// Main execution function
async function main() {
  console.log('🚀 SYMPTOMS-ONLY MIGRATION');
  console.log('===========================');
  console.log(`Dry run mode: ${MIGRATION_CONFIG.dryRun ? 'ENABLED' : 'DISABLED'}`);
  console.log(`Batch size: ${MIGRATION_CONFIG.batchSize}`);
  console.log(`Retry attempts: ${MIGRATION_CONFIG.retryAttempts}`);
  console.log('');

  try {
    const result = await executeSymptomsMigration();
    
    if (result.failed > 0) {
      console.log('\n⚠️  Some migrations failed. Consider:');
      console.log('1. Reviewing the error messages above');
      console.log('2. Fixing data issues');
      console.log('3. Running the migration again');
    } else {
      console.log('\n✅ Symptoms migration completed successfully!');
    }
    
    process.exit(result.failed > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('❌ Migration script failed:', error);
    process.exit(1);
  }
}

// Export functions for testing
export { executeSymptomsMigration, main };

// Run the migration
main(); 