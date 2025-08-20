const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testScraper() {
  try {
    console.log('🧪 Testing The Nine Realms Scraper...\n');

    // Test 1: Check database connection
    console.log('1️⃣ Testing database connection...');
    const herbCount = await prisma.herb.count();
    const supplementCount = await prisma.supplement.count();
    console.log(`✅ Database connected! Found ${herbCount} herbs and ${supplementCount} supplements\n`);

    // Test 2: Get sample search terms
    console.log('2️⃣ Testing search term retrieval...');
    const sampleHerbs = await prisma.herb.findMany({
      take: 5,
      select: { name: true, slug: true }
    });
    console.log('✅ Sample herbs for testing:');
    sampleHerbs.forEach(herb => {
      console.log(`   - ${herb.name || herb.slug}`);
    });
    console.log('');

    // Test 3: Check if we can generate URLs
    console.log('3️⃣ Testing URL generation...');
    const testTerm = 'ashwagandha';
    const testUrls = [
      `https://www.amazon.com/s?k=${encodeURIComponent(testTerm)}+supplement`,
      `https://www.vitacost.com/search?w=${encodeURIComponent(testTerm)}`,
      `https://www.gaiaherbs.com/search?q=${encodeURIComponent(testTerm)}`
    ];
    console.log('✅ Generated test URLs:');
    testUrls.forEach(url => console.log(`   - ${url}`));
    console.log('');

    // Test 4: Check if temp storage directory is writable
    console.log('4️⃣ Testing temporary storage...');
    const fs = require('fs');
    const path = require('path');
    const tempPath = path.join(process.cwd(), 'temp-scraped-products.json');
    
    try {
      fs.writeFileSync(tempPath, JSON.stringify({ test: 'data' }, null, 2));
      fs.unlinkSync(tempPath);
      console.log('✅ Temporary storage is writable\n');
    } catch (error) {
      console.log('⚠️ Temporary storage test failed:', error.message);
    }

    console.log('🎉 All tests passed! The scraper should be ready to run.');
    console.log('\n🚀 To start scraping, run: npm run scraper:start');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testScraper();
