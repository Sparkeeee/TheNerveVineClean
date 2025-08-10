const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function backupDatabase() {
  console.log('Starting comprehensive database backup...\n');
  
  try {
    // Backup all tables with their data
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
      'ShoppingList'
    ];

    const backup = {};

    for (const table of tables) {
      console.log(`Backing up ${table}...`);
      
      try {
        const data = await prisma[table.toLowerCase()].findMany();
        backup[table] = {
          count: data.length,
          data: data
        };
        console.log(`  ✓ ${table}: ${data.length} records`);
      } catch (error) {
        console.log(`  ✗ ${table}: Error - ${error.message}`);
        backup[table] = { error: error.message };
      }
    }

    // Save backup to file
    const fs = require('fs');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `database_backup_${timestamp}.json`;
    
    fs.writeFileSync(filename, JSON.stringify(backup, null, 2));
    console.log(`\n✓ Backup saved to: ${filename}`);
    
    // Also save as SQL-like format
    const sqlFilename = `database_backup_${timestamp}.sql`;
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
