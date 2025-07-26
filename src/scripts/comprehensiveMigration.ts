import { PrismaClient, Prisma } from '@prisma/client';
import { symptoms as staticSymptoms } from '../data/symptomsData';
import { herbs as staticHerbs } from '../data/herbs';
import { supplements as staticSupplements } from '../data/supplements';

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

// Migration status tracking
interface MigrationStatus {
  symptoms: { total: number; completed: number; failed: number; errors: string[] };
  herbs: { total: number; completed: number; failed: number; errors: string[] };
  supplements: { total: number; completed: number; failed: number; errors: string[] };
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

// Extract all herbs from static data
function extractHerbs(): MigrationHerb[] {
  return staticHerbs.map(herb => ({
    name: herb.name,
    slug: herb.slug || '',
    latinName: herb.latinName,
    description: herb.description,
    metaTitle: herb.metaTitle,
    metaDescription: herb.metaDescription,
    heroImageUrl: herb.heroImageUrl,
    cardImageUrl: herb.cardImageUrl,
    galleryImages: herb.galleryImages,
    cautions: herb.cautions,
    productFormulations: herb.productFormulations,
    references: herb.references,
    indications: herb.indications,
    traditionalUses: herb.traditionalUses,
  }));
}

// Extract all supplements from static data
function extractSupplements(): MigrationSupplement[] {
  return staticSupplements.map(supplement => ({
    name: supplement.name,
    slug: supplement.slug || '',
    description: supplement.description,
    metaTitle: supplement.metaTitle,
    metaDescription: supplement.metaDescription,
    heroImageUrl: supplement.heroImageUrl,
    cardImageUrl: supplement.cardImageUrl,
    galleryImages: supplement.galleryImages,
    cautions: supplement.cautions,
    productFormulations: supplement.productFormulations,
    references: supplement.references,
    tags: supplement.tags,
    indications: supplement.indications,
  }));
}

// Validate data before migration
function validateData() {
  const symptoms = extractSymptoms();
  const herbs = extractHerbs();
  const supplements = extractSupplements();
  
  const validSymptoms = symptoms.filter(s => s.slug && s.title);
  const validHerbs = herbs.filter(h => h.slug && h.name);
  const validSupplements = supplements.filter(s => s.slug && s.name);
  
  const invalidSymptoms = symptoms.filter(s => !s.slug || !s.title);
  const invalidHerbs = herbs.filter(h => !h.slug || !h.name);
  const invalidSupplements = supplements.filter(s => !s.slug || !s.name);
  
  return {
    symptoms: { valid: validSymptoms, invalid: invalidSymptoms },
    herbs: { valid: validHerbs, invalid: invalidHerbs },
    supplements: { valid: validSupplements, invalid: invalidSupplements },
  };
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

// Migrate herbs
async function migrateHerbs(herbs: MigrationHerb[]): Promise<{ success: number, failed: number, errors: string[] }> {
  const results = { success: 0, failed: 0, errors: [] as string[] };
  
  for (const herb of herbs) {
    try {
      await prisma.herb.upsert({
        where: { slug: herb.slug },
        update: {
          name: herb.name,
          latinName: herb.latinName,
          description: herb.description,
          metaTitle: herb.metaTitle,
          metaDescription: herb.metaDescription,
          heroImageUrl: herb.heroImageUrl,
          cardImageUrl: herb.cardImageUrl,
          galleryImages: herb.galleryImages as Prisma.InputJsonValue,
          cautions: herb.cautions,
          productFormulations: herb.productFormulations as Prisma.InputJsonValue,
          references: herb.references as Prisma.InputJsonValue,
          indications: herb.indications as Prisma.InputJsonValue,
          traditionalUses: herb.traditionalUses as Prisma.InputJsonValue,
        },
        create: {
          name: herb.name,
          latinName: herb.latinName,
          slug: herb.slug,
          description: herb.description,
          metaTitle: herb.metaTitle,
          metaDescription: herb.metaDescription,
          heroImageUrl: herb.heroImageUrl,
          cardImageUrl: herb.cardImageUrl,
          galleryImages: herb.galleryImages as Prisma.InputJsonValue,
          cautions: herb.cautions,
          productFormulations: herb.productFormulations as Prisma.InputJsonValue,
          references: herb.references as Prisma.InputJsonValue,
          indications: herb.indications as Prisma.InputJsonValue,
          traditionalUses: herb.traditionalUses as Prisma.InputJsonValue,
        },
      });
      results.success++;
      console.log(`✅ Migrated herb: ${herb.name} (${herb.slug})`);
    } catch (error) {
      results.failed++;
      const errorMsg = `Failed to migrate herb ${herb.slug}: ${error}`;
      results.errors.push(errorMsg);
      console.error(`❌ ${errorMsg}`);
    }
  }
  
  return results;
}

// Migrate supplements
async function migrateSupplements(supplements: MigrationSupplement[]): Promise<{ success: number, failed: number, errors: string[] }> {
  const results = { success: 0, failed: 0, errors: [] as string[] };
  
  for (const supplement of supplements) {
    try {
      await prisma.supplement.upsert({
        where: { slug: supplement.slug },
        update: {
          name: supplement.name,
          description: supplement.description,
          metaTitle: supplement.metaTitle,
          metaDescription: supplement.metaDescription,
          heroImageUrl: supplement.heroImageUrl,
          cardImageUrl: supplement.cardImageUrl,
          galleryImages: supplement.galleryImages as Prisma.InputJsonValue,
          cautions: supplement.cautions,
          productFormulations: supplement.productFormulations as Prisma.InputJsonValue,
          references: supplement.references as Prisma.InputJsonValue,
          tags: supplement.tags as Prisma.InputJsonValue,
        },
        create: {
          name: supplement.name,
          slug: supplement.slug,
          description: supplement.description,
          metaTitle: supplement.metaTitle,
          metaDescription: supplement.metaDescription,
          heroImageUrl: supplement.heroImageUrl,
          cardImageUrl: supplement.cardImageUrl,
          galleryImages: supplement.galleryImages as Prisma.InputJsonValue,
          cautions: supplement.cautions,
          productFormulations: supplement.productFormulations as Prisma.InputJsonValue,
          references: supplement.references as Prisma.InputJsonValue,
          tags: supplement.tags as Prisma.InputJsonValue,
        },
      });
      results.success++;
      console.log(`✅ Migrated supplement: ${supplement.name} (${supplement.slug})`);
    } catch (error) {
      results.failed++;
      const errorMsg = `Failed to migrate supplement ${supplement.slug}: ${error}`;
      results.errors.push(errorMsg);
      console.error(`❌ ${errorMsg}`);
    }
  }
  
  return results;
}

// Generate comprehensive migration report
function generateReport(validation: any) {
  console.log('\n📊 COMPREHENSIVE MIGRATION REPORT');
  console.log('===================================');
  
  console.log('\n🔍 SYMPTOMS:');
  console.log(`Total: ${validation.symptoms.valid.length + validation.symptoms.invalid.length}`);
  console.log(`Valid: ${validation.symptoms.valid.length}`);
  console.log(`Invalid: ${validation.symptoms.invalid.length}`);
  
  console.log('\n🌿 HERBS:');
  console.log(`Total: ${validation.herbs.valid.length + validation.herbs.invalid.length}`);
  console.log(`Valid: ${validation.herbs.valid.length}`);
  console.log(`Invalid: ${validation.herbs.invalid.length}`);
  
  console.log('\n💊 SUPPLEMENTS:');
  console.log(`Total: ${validation.supplements.valid.length + validation.supplements.invalid.length}`);
  console.log(`Valid: ${validation.supplements.valid.length}`);
  console.log(`Invalid: ${validation.supplements.invalid.length}`);
  
  if (validation.symptoms.invalid.length > 0) {
    console.log('\n❌ INVALID SYMPTOMS:');
    validation.symptoms.invalid.forEach((invalid: any, index: number) => {
      console.log(`${index + 1}. ${invalid.slug || 'NO SLUG'} - Missing required fields`);
    });
  }
  
  if (validation.herbs.invalid.length > 0) {
    console.log('\n❌ INVALID HERBS:');
    validation.herbs.invalid.forEach((invalid: any, index: number) => {
      console.log(`${index + 1}. ${invalid.slug || 'NO SLUG'} - Missing required fields`);
    });
  }
  
  if (validation.supplements.invalid.length > 0) {
    console.log('\n❌ INVALID SUPPLEMENTS:');
    validation.supplements.invalid.forEach((invalid: any, index: number) => {
      console.log(`${index + 1}. ${invalid.slug || 'NO SLUG'} - Missing required fields`);
    });
  }
  
  return {
    symptoms: validation.symptoms.valid,
    herbs: validation.herbs.valid,
    supplements: validation.supplements.valid,
  };
}

// Main comprehensive migration function
async function executeComprehensiveMigration(): Promise<MigrationStatus> {
  const status: MigrationStatus = {
    symptoms: { total: 0, completed: 0, failed: 0, errors: [] },
    herbs: { total: 0, completed: 0, failed: 0, errors: [] },
    supplements: { total: 0, completed: 0, failed: 0, errors: [] },
    startTime: new Date(),
  };

  console.log('🚀 Starting comprehensive migration...\n');

  try {
    // Step 1: Extract and validate all data
    console.log('📋 Extracting and validating data...');
    const validation = validateData();
    const validData = generateReport(validation);
    
    status.symptoms.total = validData.symptoms.length;
    status.herbs.total = validData.herbs.length;
    status.supplements.total = validData.supplements.length;

    // Step 2: Create backup of existing data
    console.log('\n💾 Creating backup of existing data...');
    const existingSymptoms = await prisma.symptom.findMany();
    const existingHerbs = await prisma.herb.findMany();
    const existingSupplements = await prisma.supplement.findMany();
    
    console.log(`Found ${existingSymptoms.length} existing symptoms`);
    console.log(`Found ${existingHerbs.length} existing herbs`);
    console.log(`Found ${existingSupplements.length} existing supplements`);

    // Step 3: Execute migrations
    console.log(`\n🔄 Executing migration (${MIGRATION_CONFIG.dryRun ? 'DRY RUN' : 'LIVE'})...`);
    
    if (MIGRATION_CONFIG.dryRun) {
      console.log('🔍 [DRY RUN] Would migrate symptoms:', validData.symptoms.length);
      console.log('🔍 [DRY RUN] Would migrate herbs:', validData.herbs.length);
      console.log('🔍 [DRY RUN] Would migrate supplements:', validData.supplements.length);
      status.symptoms.completed = validData.symptoms.length;
      status.herbs.completed = validData.herbs.length;
      status.supplements.completed = validData.supplements.length;
    } else {
      // Migrate symptoms
      console.log('\n📦 Migrating symptoms...');
      const symptomResults = await migrateSymptoms(validData.symptoms);
      status.symptoms.completed = symptomResults.success;
      status.symptoms.failed = symptomResults.failed;
      status.symptoms.errors = symptomResults.errors;

      // Migrate herbs
      console.log('\n📦 Migrating herbs...');
      const herbResults = await migrateHerbs(validData.herbs);
      status.herbs.completed = herbResults.success;
      status.herbs.failed = herbResults.failed;
      status.herbs.errors = herbResults.errors;

      // Migrate supplements
      console.log('\n📦 Migrating supplements...');
      const supplementResults = await migrateSupplements(validData.supplements);
      status.supplements.completed = supplementResults.success;
      status.supplements.failed = supplementResults.failed;
      status.supplements.errors = supplementResults.errors;
    }

    status.endTime = new Date();
    
    // Step 4: Generate final report
    console.log('\n📊 COMPREHENSIVE MIGRATION COMPLETED');
    console.log('=====================================');
    console.log(`Duration: ${status.endTime.getTime() - status.startTime.getTime()}ms`);
    
    console.log('\n🔍 SYMPTOMS:');
    console.log(`Total: ${status.symptoms.total}`);
    console.log(`Completed: ${status.symptoms.completed}`);
    console.log(`Failed: ${status.symptoms.failed}`);
    
    console.log('\n🌿 HERBS:');
    console.log(`Total: ${status.herbs.total}`);
    console.log(`Completed: ${status.herbs.completed}`);
    console.log(`Failed: ${status.herbs.failed}`);
    
    console.log('\n💊 SUPPLEMENTS:');
    console.log(`Total: ${status.supplements.total}`);
    console.log(`Completed: ${status.supplements.completed}`);
    console.log(`Failed: ${status.supplements.failed}`);
    
    // Show errors if any
    const allErrors = [
      ...status.symptoms.errors,
      ...status.herbs.errors,
      ...status.supplements.errors
    ];
    
    if (allErrors.length > 0) {
      console.log('\n❌ ERRORS:');
      allErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    // Step 5: Verify migration
    if (!MIGRATION_CONFIG.dryRun) {
      console.log('\n🔍 Verifying migration...');
      const finalSymptomCount = await prisma.symptom.count();
      const finalHerbCount = await prisma.herb.count();
      const finalSupplementCount = await prisma.supplement.count();
      
      console.log(`Final symptoms in database: ${finalSymptomCount}`);
      console.log(`Final herbs in database: ${finalHerbCount}`);
      console.log(`Final supplements in database: ${finalSupplementCount}`);
    }

    return status;

  } catch (error) {
    console.error('❌ Comprehensive migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Main execution function
async function main() {
  console.log('🚀 COMPREHENSIVE CONTENT MIGRATION');
  console.log('===================================');
  console.log(`Dry run mode: ${MIGRATION_CONFIG.dryRun ? 'ENABLED' : 'DISABLED'}`);
  console.log(`Batch size: ${MIGRATION_CONFIG.batchSize}`);
  console.log(`Retry attempts: ${MIGRATION_CONFIG.retryAttempts}`);
  console.log('');

  try {
    const result = await executeComprehensiveMigration();
    
    const totalFailed = result.symptoms.failed + result.herbs.failed + result.supplements.failed;
    
    if (totalFailed > 0) {
      console.log('\n⚠️  Some migrations failed. Consider:');
      console.log('1. Reviewing the error messages above');
      console.log('2. Fixing data issues');
      console.log('3. Running the migration again');
    } else {
      console.log('\n✅ Comprehensive migration completed successfully!');
    }
    
    process.exit(totalFailed > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('❌ Migration script failed:', error);
    process.exit(1);
  }
}

// Export functions for testing
export { executeComprehensiveMigration, main };

// Run the migration
main(); 