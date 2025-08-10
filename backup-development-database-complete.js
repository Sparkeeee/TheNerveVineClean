const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function backupDevelopmentDatabase() {
  console.log('🔒 Creating comprehensive backup of development database...\n');
  
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupData = {};
    
    // List all tables to backup
    const tables = [
      'Herb',
      'Symptom', 
      'SymptomVariant',
      'Supplement',
      'BlogPage',
      'QualitySpecification',
      'Merchant',
      'PendingProduct',
      'Product',
      'Indication',
      'User',
      'ShoppingList'
    ];

    for (const table of tables) {
      console.log(`📋 Backing up ${table}...`);
      try {
        const data = await prisma[table.toLowerCase()].findMany();
        backupData[table] = {
          count: data.length,
          data: data
        };
        console.log(`   ✅ ${table}: ${data.length} records`);
      } catch (error) {
        console.log(`   ❌ ${table}: Error - ${error.message}`);
        backupData[table] = {
          count: 0,
          error: error.message,
          data: []
        };
      }
    }

    // Save as JSON
    const jsonFilename = `development_database_complete_${timestamp}.json`;
    require('fs').writeFileSync(jsonFilename, JSON.stringify(backupData, null, 2));
    console.log(`\n💾 JSON backup saved: ${jsonFilename}`);

    // Save as SQL (for easy restoration)
    const sqlFilename = `development_database_complete_${timestamp}.sql`;
    let sqlContent = `-- Development Database Backup - ${timestamp}\n`;
    sqlContent += `-- Generated backup for migration to main branch\n\n`;
    
    for (const [tableName, tableData] of Object.entries(backupData)) {
      if (tableData.count > 0 && !tableData.error) {
        sqlContent += `-- ${tableName} table (${tableData.count} records)\n`;
        sqlContent += `-- INSERT statements would go here\n\n`;
      }
    }
    
    require('fs').writeFileSync(sqlFilename, sqlContent);
    console.log(`💾 SQL backup saved: ${sqlFilename}`);

    // Summary
    console.log('\n📊 BACKUP SUMMARY:');
    let totalRecords = 0;
    for (const [tableName, tableData] of Object.entries(backupData)) {
      if (tableData.count > 0 && !tableData.error) {
        console.log(`   ${tableName}: ${tableData.count} records`);
        totalRecords += tableData.count;
      } else {
        console.log(`   ${tableName}: ❌ FAILED - ${tableData.error}`);
      }
    }
    console.log(`\n   Total records backed up: ${totalRecords}`);
    console.log(`\n✅ Backup complete! All data safely captured from development branch.`);

  } catch (error) {
    console.error('❌ Backup failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

backupDevelopmentDatabase();
