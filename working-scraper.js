const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

class WorkingScraper {
  constructor() {
    this.results = [];
    this.currentIndex = 0;
  }

  async start() {
    try {
      console.log('🚀 Starting Working Scraper...\n');

      // Get herbs from database
      const herbs = await this.getHerbs();
      console.log(`📋 Found ${herbs.length} herbs to process\n`);

      // Process herbs in small batches
      const batchSize = 3;
      for (let i = 0; i < herbs.length; i += batchSize) {
        const batch = herbs.slice(i, i + batchSize);
        console.log(`\n🔄 Processing batch ${Math.floor(i/batchSize) + 1}: ${batch.map(h => h.name || h.slug).join(', ')}`);
        
        await this.processBatch(batch);
        
        // Save progress after each batch
        this.saveResults();
        
        // Small delay between batches
        if (i + batchSize < herbs.length) {
          console.log('⏳ Waiting 2 seconds before next batch...');
          await this.delay(2000);
        }
      }

      console.log('\n🎉 Scraping completed!');
      console.log(`📊 Total products found: ${this.results.length}`);
      console.log(`📁 Results saved to: working-scraper-results.json`);

    } catch (error) {
      console.error('❌ Scraping failed:', error);
    } finally {
      await prisma.$disconnect();
    }
  }

  async getHerbs() {
    // For testing, just get 6 herbs
    return await prisma.herb.findMany({
      take: 6,
      select: { name: true, slug: true }
    });
  }

  async processBatch(herbs) {
    for (const herb of herbs) {
      const term = herb.name || herb.slug;
      console.log(`\n🌿 Processing: ${term}`);
      
      try {
        // Test with just one site first (Amazon)
        const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(term)}+supplement`;
        console.log(`   🔗 Testing: ${amazonUrl}`);
        
        // For now, just create a mock product entry
        // In the future, this would call your Product Data scraper API
        const mockProduct = {
          name: `${term} Supplement`,
          price: this.generateMockPrice(),
          imageUrl: `https://example.com/${term.toLowerCase().replace(/\s+/g, '-')}.jpg`,
          description: `High-quality ${term} supplement for natural wellness`,
          site: 'amazon',
          url: amazonUrl,
          herb: term,
          scrapedAt: new Date().toISOString()
        };
        
        this.results.push(mockProduct);
        console.log(`   ✅ Added mock product: ${mockProduct.name}`);
        
      } catch (error) {
        console.error(`   ❌ Failed to process ${term}:`, error.message);
      }
    }
  }

  generateMockPrice() {
    const prices = [19.99, 24.99, 29.99, 34.99, 39.99];
    return prices[Math.floor(Math.random() * prices.length)];
  }

  saveResults() {
    const output = {
      scrapedAt: new Date().toISOString(),
      totalProducts: this.results.length,
      products: this.results
    };
    
    fs.writeFileSync('working-scraper-results.json', JSON.stringify(output, null, 2));
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Start the scraper
const scraper = new WorkingScraper();
scraper.start();
