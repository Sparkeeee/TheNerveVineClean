// Main entry point for the Herb Scraper
// This demonstrates our hybrid system: our button logic + Crawlee Camoufox

import { HerbScraper, HerbSearchRequest } from './herb-scraper.js';

async function main() {
  console.log('🌿 Herb Scraper - Hybrid System');
  console.log('Combining our button logic with Crawlee Camoufox technology\n');
  
  // Create scraper instance
  const scraper = new HerbScraper();
  
  // Example scraping requests - these demonstrate our button logic
  const scrapingRequests: HerbSearchRequest[] = [
    {
      herbName: 'ashwagandha',
      productType: 'tinctures',
      maxResults: 15,
      sites: ['target', 'amazon']
    },
    {
      herbName: 'ashwagandha',
      productType: 'capsules',
      maxResults: 15,
      sites: ['target', 'amazon']
    },
    {
      herbName: 'ashwagandha',
      productType: 'powders',
      maxResults: 15,
      sites: ['target', 'amazon']
    }
  ];
  
  console.log('📋 Scraping Plan:');
  scrapingRequests.forEach((request, index) => {
    console.log(`   ${index + 1}. ${request.herbName} ${request.productType} (${request.maxResults} results)`);
  });
  
  console.log('\n🚀 Starting automated scraping...\n');
  
  // Process each request
  for (const request of scrapingRequests) {
    try {
      console.log(`\n🔍 Scraping: ${request.herbName} ${request.productType}`);
      console.log(`   Sites: ${request.sites.join(', ')}`);
      console.log(`   Max results: ${request.maxResults}`);
      
      const startTime = Date.now();
      const products = await scraper.scrapeHerbProducts(request);
      const endTime = Date.now();
      
      console.log(`   ✅ Completed in ${endTime - startTime}ms`);
      console.log(`   📊 Found ${products.length} products`);
      
      // Show sample results
      if (products.length > 0) {
        console.log(`   🎯 Sample product: ${products[0].name} - ${products[0].price}`);
      }
      
    } catch (error) {
      console.error(`   ❌ Error scraping ${request.herbName} ${request.productType}:`, error);
    }
  }
  
  console.log('\n🎉 All scraping requests completed!');
  console.log('\n💡 This hybrid system demonstrates:');
  console.log('   • Our button logic: keyword → URL generation → product types');
  console.log('   • Crawlee Camoufox: professional scraping + anti-detection');
  console.log('   • Best of both worlds: custom functionality + proven technology');
}

// Run the main function
main().catch(console.error);
