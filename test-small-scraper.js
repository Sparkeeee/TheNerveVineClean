const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testSmallScraper() {
  try {
    console.log('🧪 Testing Small Batch Scraper...\n');

    // Get just 3 herbs for testing
    const testHerbs = await prisma.herb.findMany({
      take: 3,
      select: { name: true, slug: true }
    });

    console.log(`📋 Testing with ${testHerbs.length} herbs:`);
    testHerbs.forEach(herb => {
      console.log(`  - ${herb.name || herb.slug}`);
    });

    // Create a simple test scraper that just generates URLs
    console.log('\n🔗 Generated URLs for testing:');
    testHerbs.forEach(herb => {
      const term = herb.name || herb.slug;
      console.log(`\n${term}:`);
      console.log(`  Amazon: https://www.amazon.com/s?k=${encodeURIComponent(term)}+supplement`);
      console.log(`  Vitacost: https://www.vitacost.com/search?w=${encodeURIComponent(term)}`);
      console.log(`  Gaia Herbs: https://www.gaiaherbs.com/search?q=${encodeURIComponent(term)}`);
    });

    console.log('\n🎯 To test the actual scraper with these 3 herbs:');
    console.log('1. Edit src/lib/scraper/CrawleeScraperEngine.ts');
    console.log('2. Change getSearchTerms() to return only these 3 herbs');
    console.log('3. Run: npm run scraper:start');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSmallScraper();
