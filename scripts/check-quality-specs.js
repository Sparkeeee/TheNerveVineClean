const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkQualitySpecs() {
  try {
    console.log('🔍 Checking QualitySpecification table status...');
    
    // Check current table structure
    const tableInfo = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'QualitySpecification'
      ORDER BY ordinal_position;
    `;
    
    console.log('\n📋 Current table structure:');
    tableInfo.forEach(col => {
      console.log(`  • ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    // Check record count
    const count = await prisma.qualitySpecification.count();
    console.log(`\n📊 Total records: ${count}`);
    
    if (count > 0) {
      console.log('\n📝 Sample records:');
      const samples = await prisma.qualitySpecification.findMany({
        take: 3,
        select: {
          id: true,
          approach: true,
          notes: true,
          herbId: true,
          supplementId: true,
          formulationTypeId: true,
          standardised: true,
          customSpecs: true,
          createdAt: true,
          updatedAt: true
        }
      });
      
      samples.forEach((record, index) => {
        console.log(`\n  Record ${index + 1}:`);
        console.log(`    ID: ${record.id}`);
        console.log(`    Approach: ${record.approach || 'null'}`);
        console.log(`    Notes: ${record.notes || 'null'}`);
        console.log(`    Herb ID: ${record.herbId || 'null'}`);
        console.log(`    Supplement ID: ${record.supplementId || 'null'}`);
        console.log(`    Formulation Type ID: ${record.formulationTypeId || 'null'}`);
        console.log(`    Standardised: ${record.standardised}`);
        console.log(`    Custom Specs: ${record.customSpecs || 'null'}`);
        console.log(`    Created: ${record.createdAt}`);
        console.log(`    Updated: ${record.updatedAt}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking table:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkQualitySpecs();
