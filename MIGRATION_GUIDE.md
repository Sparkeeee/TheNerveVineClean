# Symptom Migration Guide

This guide explains how to safely migrate symptoms from static data to the database.

## Overview

The migration process consists of two main scripts:
1. **Preparation Script** (`prepareMigration.ts`) - Analyzes and validates data
2. **Execution Script** (`executeMigration.ts`) - Safely migrates data to database

## Prerequisites

- ✅ Database connection configured
- ✅ Prisma schema updated
- ✅ All static symptom data consolidated
- ✅ Backup of current database (recommended)

## Migration Steps

### Step 1: Prepare Migration

Run the preparation script to analyze and validate your data:

```bash
npm run migrate:prepare
```

This will:
- Extract all symptoms from static data
- Validate data integrity
- Generate a detailed report
- Identify any issues before migration

**Expected Output:**
```
🚀 Starting migration preparation...

📋 Extracting symptoms from static data...
Found 25 symptoms in static data

🔍 Validating symptom data...

📊 MIGRATION PREPARATION REPORT
================================
Total symptoms found: 25
Valid symptoms: 25
Invalid symptoms: 0

✅ VALID SYMPTOMS READY FOR MIGRATION:
1. Insomnia (insomnia)
2. Depression (depression)
3. Anxiety (anxiety)
...
```

### Step 2: Dry Run (Optional)

Test the migration without making changes:

```bash
npm run migrate:dry-run
```

This simulates the migration process and shows what would be migrated.

### Step 3: Execute Migration

Run the actual migration:

```bash
npm run migrate:execute
```

This will:
- Create backup of existing data
- Migrate symptoms in batches
- Provide detailed progress updates
- Generate final report

**Expected Output:**
```
🚀 Starting safe migration...

📋 Preparing migration data...
💾 Creating backup of existing symptoms...
Found 0 existing symptoms in database

🔄 Executing migration (LIVE)...
📦 Processing batch 1/3 (10 symptoms)
✅ Migrated: Insomnia (insomnia)
✅ Migrated: Depression (depression)
...

📊 MIGRATION COMPLETED
=======================
Total symptoms processed: 25
Successfully migrated: 25
Failed migrations: 0
Duration: 1234ms

🔍 Verifying migration...
Total symptoms in database: 25
✅ Migration verification successful
```

## Configuration

The migration scripts can be configured in `src/scripts/executeMigration.ts`:

```typescript
const MIGRATION_CONFIG = {
  batchSize: 10,        // Process symptoms in batches
  retryAttempts: 3,     // Retry failed migrations
  dryRun: false,        // Set to true for testing
};
```

## Safety Features

### Data Preservation
- ✅ **Upsert operations** - Won't overwrite existing data
- ✅ **Batch processing** - Reduces database load
- ✅ **Error handling** - Continues on individual failures
- ✅ **Retry logic** - Automatically retries failed operations

### Rollback Capability
If something goes wrong, you can rollback using the backup data:

```typescript
import { rollbackMigration } from './src/scripts/executeMigration';
// Use the backup data from the migration
```

### Validation
- ✅ **Required fields** - Ensures slug and title exist
- ✅ **Data integrity** - Validates symptom structure
- ✅ **Duplicate detection** - Handles existing records safely

## Troubleshooting

### Common Issues

**1. Database Connection Errors**
```
❌ Migration failed: connect ECONNREFUSED
```
**Solution:** Check your DATABASE_URL in `.env`

**2. Validation Errors**
```
❌ INVALID SYMPTOMS:
1. NO SLUG - Missing required fields (slug or title)
```
**Solution:** Fix the data issues before migrating

**3. Partial Migration**
```
⚠️  Some migrations failed. Consider:
1. Reviewing the error messages above
2. Fixing data issues
3. Running the migration again
```
**Solution:** Review errors and re-run migration

### Recovery Steps

1. **Check database state:**
   ```sql
   SELECT COUNT(*) FROM "Symptom";
   ```

2. **Verify migrated data:**
   ```sql
   SELECT slug, title FROM "Symptom" ORDER BY title;
   ```

3. **If rollback needed:**
   - Use the backup data from migration
   - Run rollback function manually

## Post-Migration

### Update Frontend

After successful migration, update your frontend to use database data:

1. **Update `/symptoms` page** to fetch from API
2. **Update individual symptom pages** to use database data
3. **Test all symptom routes** to ensure they work

### Cleanup

Once migration is confirmed working:
1. Remove static symptom data from `src/app/symptoms/[slug]/page.tsx`
2. Update imports to use database data
3. Test thoroughly before deployment

## Scripts Reference

| Command | Purpose |
|---------|---------|
| `npm run migrate:prepare` | Analyze and validate data |
| `npm run migrate:execute` | Execute the migration |
| `npm run migrate:dry-run` | Test migration without changes |

## File Structure

```
src/scripts/
├── prepareMigration.ts    # Data preparation and validation
├── executeMigration.ts    # Safe migration execution
└── importSymptomsHerbsSupplementsToDb.ts  # Original import script
```

## Support

If you encounter issues:
1. Check the console output for specific error messages
2. Verify database connectivity
3. Review the validation report
4. Test with dry-run mode first

---

**Remember:** Always backup your database before running migrations! 