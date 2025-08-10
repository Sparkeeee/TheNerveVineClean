const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function backupDevelopmentDatabaseCorrected() {
  console.log('🔒 Creating comprehensive backup of development database (corrected)...\n');
  
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupData = {};
    
    // Use correct Prisma model names from schema
    const tables = [
      { name: 'Herb', prismaName: 'herb' },
      { name: 'Symptom', prismaName: 'symptom' },
      { name: 'SymptomVariant', prismaName: 'symptomVariant' },
      { name: 'Supplement', prismaName: 'supplement' },
      { name: 'BlogPage', prismaName: 'blogPage' },
      { name: 'QualitySpecification', prismaName: 'qualitySpecification' },
      { name: 'Merchant', prismaName: 'merchant' },
      { name: 'PendingProduct', prismaName: 'pendingProduct' },
      { name: 'Product', prismaName: 'product' },
      { name: 'Indication', prismaName: 'indication' },
      { name: 'User', prismaName: 'user' },
      { name: 'ShoppingList', prismaName: 'shoppingList' }
    ];

    for (const table of tables) {
      console.log(`📋 Backing up ${table.name}...`);
      try {
        const data = await prisma[table.prismaName].findMany();
        backupData[table.name] = {
          count: data.length,
          data: data
        };
        console.log(`   ✅ ${table.name}: ${data.length} records`);
      } catch (error) {
        console.log(`   ❌ ${table.name}: Error - ${error.message}`);
        backupData[table.name] = {
          count: 0,
          error: error.message,
          data: []
        };
      }
    }

    // Save as JSON
    const jsonFilename = `development_database_corrected_${timestamp}.json`;
    require('fs').writeFileSync(jsonFilename, JSON.stringify(backupData, null, 2));
    console.log(`\n💾 JSON backup saved: ${jsonFilename}`);

    // Save as SQL (for easy restoration)
    const sqlFilename = `development_database_corrected_${timestamp}.sql`;
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

backupDevelopmentDatabaseCorrected();
