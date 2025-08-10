const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function backupDatabase() {
  console.log('Starting comprehensive database backup (corrected)...\n');
  
  try {
    // Map table names to actual Prisma model names
    const tableMappings = [
      { name: 'Herb', model: 'herb' },
      { name: 'Symptom', model: 'symptom' },
      { name: 'SymptomVariant', model: 'symptomVariant' },
      { name: 'Supplement', model: 'supplement' },
      { name: 'BlogPage', model: 'blogPage' },
      { name: 'QualitySpecification', model: 'qualitySpecification' },
      { name: 'Merchant', model: 'merchant' },
      { name: 'PendingProduct', model: 'pendingProduct' },
      { name: 'Product', model: 'product' },
      { name: 'Indication', model: 'indication' },
      { name: 'ShoppingList', model: 'shoppingList' }
    ];

    const backup = {};

    for (const mapping of tableMappings) {
      console.log(`Backing up ${mapping.name}...`);
      
      try {
        const data = await prisma[mapping.model].findMany();
        backup[mapping.name] = {
          count: data.length,
          data: data
        };
        console.log(`  ✓ ${mapping.name}: ${data.length} records`);
      } catch (error) {
        console.log(`  ✗ ${mapping.name}: Error - ${error.message}`);
        backup[mapping.name] = { error: error.message };
      }
    }

    // Save backup to file
    const fs = require('fs');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `database_backup_corrected_${timestamp}.json`;
    
    fs.writeFileSync(filename, JSON.stringify(backup, null, 2));
    console.log(`\n✓ Backup saved to: ${filename}`);
    
    // Also save as SQL-like format
    const sqlFilename = `database_backup_corrected_${timestamp}.sql`;
    let sqlContent = `-- Database Backup Generated on ${new Date().toISOString()}\n`;
    sqlContent += `-- This file contains all data from your database\n\n`;
    
    for (const [table, tableData] of Object.entries(backup)) {
      if (tableData.data && Array.isArray(tableData.data)) {
        sqlContent += `-- Table: ${table}\n`;
        sqlContent += `-- Records: ${tableData.count}\n\n`;
        
        for (const record of tableData.data) {
          const columns = Object.keys(record).filter(key => key !== 'id');
          const values = columns.map(col => {
            const val = record[col];
            if (val === null) return 'NULL';
            if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
            if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
            return val;
          });
          
          sqlContent += `INSERT INTO "${table}" (${columns.map(c => `"${c}"`).join(', ')}) VALUES (${values.join(', ')});\n`;
        }
        sqlContent += '\n';
      }
    }
    
    fs.writeFileSync(sqlFilename, sqlContent);
    console.log(`✓ SQL backup saved to: ${sqlFilename}`);
    
  } catch (error) {
    console.error('Backup failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

backupDatabase();
