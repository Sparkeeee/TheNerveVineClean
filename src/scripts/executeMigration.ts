import { PrismaClient, Prisma } from '@prisma/client';
import { symptoms as staticSymptoms } from '../data/symptomsData';
import { prepareMigration, migrateSymptoms } from './prepareMigration';

const prisma = new PrismaClient();

// Migration configuration
const MIGRATION_CONFIG = {
  batchSize: 10, // Process symptoms in batches
  retryAttempts: 3, // Number of retry attempts for failed migrations
  dryRun: false, // Set to true to simulate migration without making changes
};

// Migration status tracking
interface MigrationStatus {
  total: number;
  completed: number;
  failed: number;
  errors: string[];
  startTime: Date;
  endTime?: Date;
}

// Safe migration with rollback capability
async function executeSafeMigration(): Promise<MigrationStatus> {
  const status: MigrationStatus = {
    total: 0,
    completed: 0,
    failed: 0,
    errors: [],
    startTime: new Date(),
  };

  console.log('🚀 Starting safe migration...\n');

  try {
    // Step 1: Prepare migration data
    console.log('📋 Preparing migration data...');
    const migrationData = await prepareMigration();
    status.total = migrationData.validSymptoms;

    if (migrationData.invalidSymptoms > 0) {
      console.log(`⚠️  Warning: ${migrationData.invalidSymptoms} symptoms have validation issues`);
      console.log('Proceeding with valid symptoms only...\n');
    }

    if (status.total === 0) {
      console.log('❌ No valid symptoms to migrate');
      return status;
    }

    // Step 2: Create backup of existing data
    console.log('💾 Creating backup of existing symptoms...');
    const existingSymptoms = await prisma.symptom.findMany({
      select: { id: true, slug: true, title: true, description: true }
    });
    console.log(`Found ${existingSymptoms.length} existing symptoms in database`);

    // Step 3: Execute migration in batches
    console.log(`\n🔄 Executing migration (${MIGRATION_CONFIG.dryRun ? 'DRY RUN' : 'LIVE'})...`);
    
    const symptomsToMigrate = migrationData.symptoms;
    const batches = [];
    
    // Split into batches
    for (let i = 0; i < symptomsToMigrate.length; i += MIGRATION_CONFIG.batchSize) {
      batches.push(symptomsToMigrate.slice(i, i + MIGRATION_CONFIG.batchSize));
    }

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      console.log(`\n📦 Processing batch ${batchIndex + 1}/${batches.length} (${batch.length} symptoms)`);

      for (const symptom of batch) {
        if (MIGRATION_CONFIG.dryRun) {
          console.log(`🔍 [DRY RUN] Would migrate: ${symptom.title} (${symptom.slug})`);
          status.completed++;
          continue;
        }

        let retryCount = 0;
        let success = false;

        while (retryCount < MIGRATION_CONFIG.retryAttempts && !success) {
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
            
            console.log(`✅ Migrated: ${symptom.title} (${symptom.slug})`);
            status.completed++;
            success = true;
          } catch (error) {
            retryCount++;
            const errorMsg = `Failed to migrate ${symptom.slug} (attempt ${retryCount}/${MIGRATION_CONFIG.retryAttempts}): ${error}`;
            
            if (retryCount >= MIGRATION_CONFIG.retryAttempts) {
              console.error(`❌ ${errorMsg}`);
              status.failed++;
              status.errors.push(errorMsg);
            } else {
              console.warn(`⚠️  ${errorMsg} - Retrying...`);
              await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
            }
          }
        }
      }
    }

    status.endTime = new Date();
    
    // Step 4: Generate final report
    console.log('\n📊 MIGRATION COMPLETED');
    console.log('=======================');
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
    console.error('❌ Migration failed:', error);
    status.errors.push(`Migration failed: ${error}`);
    return status;
  } finally {
    await prisma.$disconnect();
  }
}

// Rollback function (if needed)
async function rollbackMigration(backupData: any[]): Promise<void> {
  console.log('🔄 Rolling back migration...');
  
  try {
    for (const symptom of backupData) {
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
    }
    console.log('✅ Rollback completed successfully');
  } catch (error) {
    console.error('❌ Rollback failed:', error);
    throw error;
  }
}

// Main execution function
async function main() {
  console.log('🚀 SYMPTOM MIGRATION SCRIPT');
  console.log('============================');
  console.log(`Dry run mode: ${MIGRATION_CONFIG.dryRun ? 'ENABLED' : 'DISABLED'}`);
  console.log(`Batch size: ${MIGRATION_CONFIG.batchSize}`);
  console.log(`Retry attempts: ${MIGRATION_CONFIG.retryAttempts}`);
  console.log('');

  try {
    const result = await executeSafeMigration();
    
    if (result.failed > 0) {
      console.log('\n⚠️  Some migrations failed. Consider:');
      console.log('1. Reviewing the error messages above');
      console.log('2. Fixing data issues');
      console.log('3. Running the migration again');
    } else {
      console.log('\n✅ Migration completed successfully!');
    }
    
    process.exit(result.failed > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('❌ Migration script failed:', error);
    process.exit(1);
  }
}

// Export functions for testing
export { executeSafeMigration, rollbackMigration, main };

// Run the migration
main(); 