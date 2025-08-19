// Enhanced HerbEra Scraper with Improved Filtering and Debugging
const { PlaywrightCrawler, Dataset } = require('crawlee');
const fs = require('fs').promises;
const path = require('path');

class EnhancedHerbEraScraper {
  constructor() {
    this.allProducts = [];
    this.matchedProducts = [];
    this.stats = {
      totalFound: 0,
      totalFiltered: 0,
      collectionsProcessed: 0,
      startTime: Date.now()
    };
  }

  // Enhanced keyword matching with fuzzy logic
  matchesKeywords(productData, keywords, mode = 'OR') {
    if (!keywords || keywords.length === 0) return true;
    
    const searchText = [
      productData.title || '',
      productData.description || '',
      productData.url || ''
    ].join(' ').toLowerCase();

    console.log(`🔍 Checking product: "${productData.title}"`);
    console.log(`📝 Search text: ${searchText.substring(0, 100)}...`);

    const matches = [];
    
    keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      
      // Exact match
      if (searchText.includes(keywordLower)) {
        matches.push({ type: 'exact', keyword, confidence: 1.0 });
        console.log(`✅ EXACT match found: "${keyword}"`);
        return;
      }
      
      // Partial/fuzzy matching
      const variations = this.generateKeywordVariations(keywordLower);
      for (const variation of variations) {
        if (searchText.includes(variation)) {
          matches.push({ type: 'partial', keyword, variation, confidence: 0.8 });
          console.log(`🎯 PARTIAL match found: "${variation}" for "${keyword}"`);
          break;
        }
      }
      
      // Word boundary matching (for compound words)
      const wordBoundaryRegex = new RegExp(`\\b${keywordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (wordBoundaryRegex.test(searchText)) {
        matches.push({ type: 'word_boundary', keyword, confidence: 0.9 });
        console.log(`🎯 WORD BOUNDARY match found: "${keyword}"`);
      }
    });

    const hasMatch = mode === 'OR' ? matches.length > 0 : matches.length === keywords.length;
    console.log(`${hasMatch ? '✅' : '❌'} Final result: ${hasMatch} (${matches.length} matches)`);
    console.log('---');
    
    return hasMatch;
  }

  generateKeywordVariations(keyword) {
    const variations = [keyword];
    
    // Common herb name variations
    const herbVariations = {
      'kava': ['kava kava', 'piper methysticum', 'kawa'],
      'skullcap': ['skull cap', 'scutellaria', 'scutellaria baicalensis', 'scutellaria lateriflora'],
      'ashwagandha': ['withania', 'withania somnifera'],
      'turmeric': ['curcuma', 'curcuma longa'],
      'ginkgo': ['ginkgo biloba'],
      'ginseng': ['panax ginseng', 'panax'],
      'echinacea': ['echinacea purpurea'],
      'valerian': ['valeriana', 'valeriana officinalis'],
      'passionflower': ['passion flower', 'passiflora'],
      'lemon balm': ['lemonbalm', 'melissa', 'melissa officinalis'],
      'chamomile': ['matricaria', 'chamaemelum'],
      'lavender': ['lavandula'],
      'st johns wort': ['st john\'s wort', 'hypericum', 'hypericum perforatum'],
      'milk thistle': ['silybum', 'silybum marianum']
    };
    
    if (herbVariations[keyword]) {
      variations.push(...herbVariations[keyword]);
    }
    
    // Add plurals
    if (!keyword.endsWith('s')) {
      variations.push(keyword + 's');
    }
    
    // Add common prefixes/suffixes for herbs
    variations.push(`${keyword} extract`);
    variations.push(`${keyword} powder`);
    variations.push(`${keyword} supplement`);
    variations.push(`${keyword} capsule`);
    variations.push(`${keyword} tea`);
    variations.push(`${keyword} tincture`);
    variations.push(`organic ${keyword}`);
    
    return variations;
  }

  async scrapeCollection(page, collectionName, baseUrl) {
    console.log(`📄 ${collectionName.toUpperCase()}: Loading...`);
    
    try {
      // Wait for page to load
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      
      // Scroll to load all products
      await this.performIntelligentScrolling(page);
      
      // Extract product information with enhanced selectors
      const products = await page.evaluate(() => {
        const productElements = document.querySelectorAll([
          '.product-item',
          '.product-card', 
          '.grid__item',
          '[data-product-id]',
          'a[href*="/products/"]',
          '.product'
        ].join(', '));
        
        console.log(`Found ${productElements.length} product elements`);
        
        return Array.from(productElements).map(element => {
          // Try multiple approaches to get product data
          const titleElement = element.querySelector('.product-item__title, .product__title, .card__heading, h3, h2, .title') ||
                              element.querySelector('a[href*="/products/"]') ||
                              element;
          
          const linkElement = element.querySelector('a[href*="/products/"]') || 
                             (element.tagName === 'A' ? element : null);
          
          const imageElement = element.querySelector('img');
          const priceElement = element.querySelector('.price, .product-price, .money, [data-price]');
          
          // Extract text content
          let title = '';
          if (titleElement) {
            title = titleElement.textContent?.trim() || 
                   titleElement.getAttribute('alt') || 
                   titleElement.getAttribute('title') || '';
          }
          
          let url = '';
          if (linkElement && linkElement.href) {
            url = linkElement.href;
          }
          
          let image = '';
          if (imageElement && imageElement.src) {
            image = imageElement.src;
          }
          
          let price = '';
          if (priceElement) {
            price = priceElement.textContent?.trim() || '';
          }
          
          // Get additional context from surrounding elements
          const description = element.querySelector('.product-description, .card__text')?.textContent?.trim() || '';
          
          return {
            title: title,
            url: url,
            image: image,
            price: price,
            description: description,
            collection: window.location.pathname,
            scrapedAt: new Date().toISOString()
          };
        }).filter(product => product.title && product.url); // Only keep products with title and URL
      });
      
      console.log(`🔗 ${collectionName}: Found ${products.length} products`);
      
      if (products.length > 0) {
        // Debug: Show first few products found
        console.log(`📋 First few products found:`);
        products.slice(0, 3).forEach((product, index) => {
          console.log(`   ${index + 1}. "${product.title}" - ${product.url}`);
        });
        
        this.allProducts.push(...products);
        console.log(`✅ ${collectionName}: Added ${products.length} new URLs (Total: ${this.allProducts.length})`);
      } else {
        console.log(`⚠️ ${collectionName}: No products found`);
        
        // Debug: Check what's actually on the page
        const pageContent = await page.evaluate(() => {
          return {
            title: document.title,
            url: window.location.href,
            bodyText: document.body.textContent.substring(0, 200),
            productElements: document.querySelectorAll('.product-item, .product-card, .grid__item, [data-product-id]').length,
            allLinks: document.querySelectorAll('a[href*="/products/"]').length
          };
        });
        console.log(`🔍 Page debug info:`, pageContent);
      }
      
    } catch (error) {
      console.error(`❌ Error scraping ${collectionName}:`, error.message);
    }
  }

  async performIntelligentScrolling(page) {
    const scrollPauses = [500, 800, 1200, 1500];
    let lastHeight = 0;
    let scrollAttempts = 0;
    const maxScrollAttempts = 10;
    
    while (scrollAttempts < maxScrollAttempts) {
      // Scroll down
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      
      // Wait with random delay
      const pause = scrollPauses[Math.floor(Math.random() * scrollPauses.length)];
      await page.waitForTimeout(pause);
      
      // Check if new content loaded
      const currentHeight = await page.evaluate(() => document.body.scrollHeight);
      
      if (currentHeight === lastHeight) {
        // Try a few more times in case content is still loading
        if (scrollAttempts > 3) break;
      }
      
      lastHeight = currentHeight;
      scrollAttempts++;
    }
    
    console.log(`📜 Completed ${scrollAttempts} scroll attempts`);
  }

  async saveDetailedResults(keywords) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Save all products (for debugging)
    const allProductsFile = `herbera-all-products-${timestamp}.json`;
    await fs.writeFile(allProductsFile, JSON.stringify({
      searchInfo: {
        keywords: keywords,
        totalFound: this.allProducts.length,
        scrapedAt: new Date().toISOString(),
        collections: [...new Set(this.allProducts.map(p => p.collection))]
      },
      products: this.allProducts
    }, null, 2));
    
    console.log(`💾 All products saved to: ${allProductsFile}`);
    
    // Save filtered products
    if (this.matchedProducts.length > 0) {
      const filteredFile = `herbera-filtered-${keywords.join('-')}-${timestamp}.json`;
      await fs.writeFile(filteredFile, JSON.stringify({
        searchInfo: {
          keywords: keywords,
          totalMatched: this.matchedProducts.length,
          filterMode: 'OR',
          scrapedAt: new Date().toISOString()
        },
        products: this.matchedProducts
      }, null, 2));
      
      console.log(`💾 Filtered products saved to: ${filteredFile}`);
      
      // Save URLs only (for easy importing)
      const urlsFile = `herbera-urls-${keywords.join('-')}-${timestamp}.txt`;
      const urls = this.matchedProducts.map(p => p.url).join('\n');
      await fs.writeFile(urlsFile, urls);
      console.log(`📄 URLs saved to: ${urlsFile}`);
    }
  }

  async run(keywords = ['kava', 'skullcap'], collections = ['all', 'formulas', 'single-herbs', 'teas']) {
    console.log(`🚀 Enhanced HerbEra Scraper - Searching for: ${keywords.join(', ')}`);
    console.log('====================================================');
    
    const baseUrl = 'https://herb-era.com';
    const collectionUrls = {
      'all': `${baseUrl}/collections/all`,
      'formulas': `${baseUrl}/collections/formulas`,
      'single-herbs': `${baseUrl}/collections/single-herbs`,
      'teas': `${baseUrl}/collections/teas`,
      'tinctures': `${baseUrl}/collections/tinctures`,
      'capsules': `${baseUrl}/collections/capsules`
    };
    
    console.log(`🔍 Discovering products from HerbEra collections...`);
    console.log(`📂 Processing ${collections.length} collections for: ${keywords.join(', ')}`);
    
    const crawler = new PlaywrightCrawler({
      headless: false, // Set to false for debugging
      maxRequestsPerCrawl: collections.length,
      requestHandler: async ({ request, page }) => {
        const collectionName = Object.keys(collectionUrls).find(key => 
          collectionUrls[key] === request.url
        ) || 'unknown';
        
        await this.scrapeCollection(page, collectionName, baseUrl);
      },
    });
    
    // Add collection URLs to crawl
    const urlsToProcess = collections
      .filter(collection => collectionUrls[collection])
      .map(collection => ({ url: collectionUrls[collection] }));
    
    await crawler.run(urlsToProcess);
    
    console.log(`📊 DISCOVERY COMPLETE:`);
    console.log(`   Total products found: ${this.allProducts.length}`);
    console.log(`   Collections processed: ${collections.length}`);
    
    // Enhanced filtering with debug output
    console.log(`🔍 FILTERING RESULTS:`);
    console.log(`   Keywords: ${keywords.join(', ')}`);
    console.log(`   Mode: OR`);
    console.log(`   Before: ${this.allProducts.length} products`);
    
    // Filter products with detailed logging
    this.matchedProducts = this.allProducts.filter(product => 
      this.matchesKeywords(product, keywords, 'OR')
    );
    
    console.log(`   After: ${this.matchedProducts.length} products`);
    
    if (this.matchedProducts.length === 0) {
      console.log(`⚠️ No products match the filter criteria!`);
      console.log(`🔍 Showing sample of all products found for debugging:`);
      
      this.allProducts.slice(0, 10).forEach((product, index) => {
        console.log(`   ${index + 1}. "${product.title}" - ${product.url}`);
      });
      
      console.log(`\n💡 Suggestions:`);
      console.log(`   1. Check if the keywords are spelled correctly`);
      console.log(`   2. Try broader search terms`);
      console.log(`   3. Check the all-products file to see what was actually found`);
    }
    
    // Save results regardless of matches (for debugging)
    await this.saveDetailedResults(keywords);
    
    if (this.matchedProducts.length > 0) {
      console.log(`\n✅ SUCCESS: Found ${this.matchedProducts.length} matching products!`);
      this.matchedProducts.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.title} - ${product.price || 'No price'}`);
      });
    } else {
      console.log(`\n❌ No matching products found, but ${this.allProducts.length} total products were saved for analysis.`);
    }
    
    const duration = (Date.now() - this.stats.startTime) / 1000;
    console.log(`\n⏱️ Scraping completed in ${duration}s`);
  }
}

// Export for use as module
module.exports = EnhancedHerbEraScraper;

// CLI usage
if (require.main === module) {
  const scraper = new EnhancedHerbEraScraper();
  
  // Get command line arguments
  const args = process.argv.slice(2);
  const keywords = args.length > 0 ? args[0].split(',').map(k => k.trim()) : ['kava', 'skullcap'];
  
  console.log(`Starting scraper with keywords: ${keywords.join(', ')}`);
  scraper.run(keywords).catch(console.error);
}

/*
USAGE:
1. Save as 'enhanced-herbera-scraper.js'
2. Run: node enhanced-herbera-scraper.js
3. Or with custom keywords: node enhanced-herbera-scraper.js "kava,ashwagandha,turmeric"

IMPROVEMENTS:
✅ Enhanced keyword matching with variations
✅ Better product detection selectors
✅ Detailed debugging output
✅ Saves all products for analysis
✅ Fuzzy matching for herb names
✅ Multiple file output formats
✅ Visual browser mode for debugging
✅ Intelligent scrolling
✅ Better error handling
✅ Comprehensive logging
*/
