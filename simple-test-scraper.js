const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function simpleTest() {
  try {
    console.log('🧪 Simple Scraper Test...\n');

    // Test 1: Database connection
    console.log('1️⃣ Testing database connection...');
    const herbCount = await prisma.herb.count();
    console.log(`✅ Found ${herbCount} herbs in database\n`);

    // Test 2: Get 3 test herbs
    console.log('2️⃣ Getting test herbs...');
    const testHerbs = await prisma.herb.findMany({
      take: 3,
      select: { name: true, slug: true }
    });
    
    console.log('✅ Test herbs:');
    testHerbs.forEach(herb => {
      console.log(`   - ${herb.name || herb.slug}`);
    });

    // Test 3: Generate test URLs
    console.log('\n3️⃣ Generating test URLs...');
    testHerbs.forEach(herb => {
      const term = herb.name || herb.slug;
      console.log(`\n${term}:`);
      console.log(`   Amazon: https://www.amazon.com/s?k=${encodeURIComponent(term)}+supplement`);
      console.log(`   Vitacost: https://www.vitacost.com/search?w=${encodeURIComponent(term)}`);
      console.log(`   Gaia Herbs: https://www.gaiaherbs.com/search?q=${encodeURIComponent(term)}`);
    });

    // Test 4: Create simple output file
    console.log('\n4️⃣ Creating test output...');
    const fs = require('fs');
    const testData = {
      testDate: new Date().toISOString(),
      herbs: testHerbs,
      urls: testHerbs.map(herb => {
        const term = herb.name || herb.slug;
        return {
          herb: term,
          amazon: `https://www.amazon.com/s?k=${encodeURIComponent(term)}+supplement`,
          vitacost: `https://www.vitacost.com/search?w=${encodeURIComponent(term)}`,
          gaiaHerbs: `https://www.gaiaherbs.com/search?q=${encodeURIComponent(term)}`
        };
      })
    };

    fs.writeFileSync('test-output.json', JSON.stringify(testData, null, 2));
    console.log('✅ Created test-output.json');

    console.log('\n🎉 Simple test completed successfully!');
    console.log('📁 Check test-output.json for results');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

simpleTest();
