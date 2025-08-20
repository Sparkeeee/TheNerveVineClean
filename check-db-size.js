import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabaseSize() {
  try {
    console.log('🔍 Checking database size and table statistics...\n');
    
    // Check table counts
    const herbCount = await prisma.herb.count();
    const supplementCount = await prisma.supplement.count();
    const symptomCount = await prisma.symptom.count();
    const productCount = await prisma.product.count();
    const merchantCount = await prisma.merchant.count();
    const indicationCount = await prisma.indication.count();
    const qualitySpecCount = await prisma.qualitySpecification.count();
    const herbIndicationScoreCount = await prisma.herbIndicationScore.count();
    
    console.log('📊 Table Statistics:');
    console.log(`- Herbs: ${herbCount}`);
    console.log(`- Supplements: ${supplementCount}`);
    console.log(`- Symptoms: ${symptomCount}`);
    console.log(`- Products: ${productCount}`);
    console.log(`- Merchants: ${merchantCount}`);
    console.log(`- Indications: ${indicationCount}`);
    console.log(`- Quality Specs: ${qualitySpecCount}`);
    console.log(`- Herb Indication Scores: ${herbIndicationScoreCount}`);
    
    // Check for large text fields
    console.log('\n🔍 Checking for large content fields...');
    
    const herbsWithLargeContent = await prisma.herb.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        comprehensiveArticle: true
      }
    });
    
    let totalHerbSize = 0;
    herbsWithLargeContent.forEach(herb => {
      const size = (herb.description?.length || 0) + (herb.comprehensiveArticle?.length || 0);
      totalHerbSize += size;
      if (size > 10000) {
        console.log(`⚠️  Large herb content: ${herb.name} (${size} chars)`);
      }
    });
    
    const supplementsWithLargeContent = await prisma.supplement.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        comprehensiveArticle: true
      }
    });
    
    let totalSupplementSize = 0;
    supplementsWithLargeContent.forEach(supp => {
      const size = (supp.description?.length || 0) + (supp.comprehensiveArticle?.length || 0);
      totalSupplementSize += size;
      if (size > 10000) {
        console.log(`⚠️  Large supplement content: ${supp.name} (${size} chars)`);
      }
    });
    
    console.log(`\n📏 Content Size Summary:`);
    console.log(`- Total herb content: ${totalHerbSize.toLocaleString()} characters`);
    console.log(`- Total supplement content: ${totalSupplementSize.toLocaleString()} characters`);
    console.log(`- Estimated text storage: ${((totalHerbSize + totalSupplementSize) / 1024 / 1024).toFixed(2)} MB`);
    
    // Check for old/unused data
    console.log('\n🗑️  Checking for potential cleanup opportunities...');
    
    const oldProducts = await prisma.product.findMany({
      where: {
        createdAt: {
          lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
        }
      },
      select: { id: true, name: true, createdAt: true }
    });
    
    if (oldProducts.length > 0) {
      console.log(`- ${oldProducts.length} products older than 30 days`);
      console.log('  Consider archiving or removing old test products');
    }
    
    // Check for duplicate or test data
    const duplicateNames = await prisma.product.groupBy({
      by: ['name'],
      _count: { name: true },
      having: {
        name: {
          _count: { gt: 1 }
        }
      }
    });
    
    if (duplicateNames.length > 0) {
      console.log(`- ${duplicateNames.length} product names with duplicates`);
      console.log('  Consider consolidating duplicate products');
    }
    
    console.log('\n💡 Recommendations:');
    console.log('1. Check Neon dashboard for actual database size');
    console.log('2. Consider archiving old test products');
    console.log('3. Review large content fields for optimization');
    console.log('4. Check if any tables have excessive JSON data');
    
  } catch (error) {
    console.error('❌ Error checking database size:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseSize();
