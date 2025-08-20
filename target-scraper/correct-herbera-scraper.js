// Correct HerbEra Scraper - Targets the right collections where individual herbs are located
const { PlaywrightCrawler, Dataset } = require('crawlee');
const fs = require('fs').promises;
const path = require('path');

class CorrectHerbEraScraper {
  constructor() {
    this.allProducts = [];
    this.matchedProducts = [];
    this.stats = {
      totalFound: 0,
      matches: 0,
      collectionsProcessed: 0,
      startTime: Date.now()
    };
  }

  async scrapeProductsFromCollection(page, collectionName, collectionUrl) {
    console.log(`\n📂 Scraping ${collectionName.toUpperCase()}: ${collectionUrl}`);
    
    try {
      await page.goto(collectionUrl, { waitUntil: 'networkidle', timeout: 15000 });
      
      const allProducts = [];
      let currentPage = 1;
      let hasNextPage = true;
      let pageHistory = new Set(); // Track visited pages to detect loops
      
      while (hasNextPage) {
        console.log(`\n📄 Processing page ${currentPage} of ${collectionName}...`);
        
        // Get current URL to track page changes
        const currentUrl = page.url();
        console.log(`🌐 Current URL: ${currentUrl}`);
        
        // Check if we're in a loop
        if (pageHistory.has(currentUrl)) {
          console.log(`⚠️ WARNING: Page URL already visited! Possible pagination loop detected.`);
          console.log(`🔄 Breaking loop to prevent infinite cycling`);
          break;
        }
        pageHistory.add(currentUrl);
        
        // Wait for products to load
        await page.waitForTimeout(2000);
        
        // Extract products from current page
        const pageProducts = await page.evaluate(() => {
          const productSelectors = [
            '.grid-item',
            '.product-item',
            '.product-card',
            '.grid__item',
            '.product',
            'a[href*="/products/"]'
          ];
          
          const allProducts = [];
          const seenUrls = new Set();
          
          // Try each selector
          productSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            console.log(`Selector "${selector}" found ${elements.length} elements`);
            
            elements.forEach(element => {
              // Get the product link
              let linkElement = element.querySelector('a[href*="/products/"]') || 
                               (element.tagName === 'A' && element.href.includes('/products/') ? element : null);
              
              if (linkElement && linkElement.href) {
                const url = linkElement.href;
                
                if (!seenUrls.has(url)) {
                  seenUrls.add(url);
                  
                  // Extract title from multiple possible locations
                  let title = '';
                  const titleSelectors = [
                    '.product__title',
                    '.product-item__title',
                    '.card__heading',
                    'h3',
                    'h2',
                    '.title'
                  ];
                  
                  for (const titleSelector of titleSelectors) {
                    const titleEl = element.querySelector(titleSelector);
                    if (titleEl && titleEl.textContent.trim()) {
                      title = titleEl.textContent.trim();
                      break;
                    }
                  }
                  
                  // Fallback: use link text or alt text
                  if (!title) {
                    title = linkElement.textContent.trim() || 
                           linkElement.getAttribute('title') || 
                           linkElement.getAttribute('alt') || 
                           'Unknown Product';
                  }
                  
                  // Get additional info
                  const imageEl = element.querySelector('img');
                  const priceEl = element.querySelector('.price, .product-price, .money');
                  
                  allProducts.push({
                    title: title,
                    url: url,
                    collection: window.location.pathname,
                    image: imageEl ? imageEl.src : '',
                    price: priceEl ? priceEl.textContent.trim() : '',
                    scrapedAt: new Date().toISOString()
                  });
                }
              }
            });
          });
          
          return allProducts;
        });
        
        console.log(`✅ Found ${pageProducts.length} products on page ${currentPage}`);
        allProducts.push(...pageProducts);
        
        // Look for next page button
        console.log(`🔍 Looking for next page button...`);
        hasNextPage = await this.findAndClickNextPage(page);
        
        if (hasNextPage) {
          currentPage++;
          console.log(`🔄 Moving to page ${currentPage}...`);
          await page.waitForTimeout(3000); // Wait for next page to load
        } else {
          console.log(`🏁 No more pages found - reached end of collection`);
        }
        
        // Safety limit to prevent infinite loops
        if (currentPage > 20) {
          console.log(`⚠️ Reached safety limit of 20 pages, stopping pagination`);
          break;
        }
      }
      
      console.log(`\n✅ Total: Found ${allProducts.length} products across ${currentPage} pages in ${collectionName}`);
      console.log(`📊 Pages visited: ${pageHistory.size}`);
      
      if (allProducts.length > 0) {
        console.log(`📋 Sample products from ${collectionName}:`);
        allProducts.slice(0, 5).forEach((product, index) => {
          console.log(`   ${index + 1}. "${product.title}"`);
        });
        if (allProducts.length > 5) {
          console.log(`   ... and ${allProducts.length - 5} more products`);
        }
      }
      
      return allProducts;
      
    } catch (error) {
      console.error(`❌ Error scraping ${collectionName}: ${error.message}`);
      return [];
    }
  }

  async findAndClickNextPage(page) {
    try {
      // Look for common pagination selectors - be more specific about "next" buttons
      const nextPageSelectors = [
        'a[rel="next"]',
        '.next-page',
        '.pagination .next',
        '.pagination__next',
        '.pagination-next',
        'a.next',
        'a[aria-label*="Next"]',
        'a[aria-label*="next"]',
        'a[aria-label="Next page"]',
        'a[aria-label="next page"]'
      ];
      
      // First try the specific "next" selectors
      for (const selector of nextPageSelectors) {
        try {
          const nextButton = await page.$(selector);
          if (nextButton) {
            const isVisible = await nextButton.isVisible();
            const isEnabled = await nextButton.isEnabled();
            
            if (isVisible && isEnabled) {
              const buttonText = await nextButton.textContent();
              const buttonHref = await nextButton.getAttribute('href');
              
              console.log(`🔍 Found next page button: ${selector}`);
              console.log(`📝 Button text: "${buttonText}"`);
              console.log(`🔗 Button href: ${buttonHref}`);
              
              // Validate this is actually a "next" button
              if (this.isNextPageButton(buttonText, buttonHref)) {
                await nextButton.click();
                console.log(`✅ Clicked next page button`);
                return true;
              } else {
                console.log(`⚠️ Button found but doesn't appear to be "next" - skipping`);
              }
            }
          }
        } catch (err) {
          // Try next selector
          continue;
        }
      }
      
      // If no specific "next" button found, try to find any pagination button and validate
      const allPaginationButtons = await page.$$('a[href*="page="]');
      console.log(`🔍 Found ${allPaginationButtons.length} pagination buttons`);
      
      for (const button of allPaginationButtons) {
        try {
          const buttonText = await button.textContent();
          const buttonHref = await button.getAttribute('href');
          const isVisible = await button.isVisible();
          const isEnabled = await button.isEnabled();
          
          console.log(`🔍 Checking button: "${buttonText}" -> ${buttonHref}`);
          
          if (isVisible && isEnabled && this.isNextPageButton(buttonText, buttonHref)) {
            console.log(`✅ Found valid next page button: "${buttonText}"`);
            await button.click();
            console.log(`✅ Clicked next page button`);
            return true;
          }
        } catch (err) {
          continue;
        }
      }
      
      // If no next button found, try to find pagination info
      const paginationInfo = await page.evaluate(() => {
        const paginationElements = document.querySelectorAll('.pagination, .pagination__list, [class*="pagination"]');
        if (paginationElements.length > 0) {
          return Array.from(paginationElements).map(el => ({
            html: el.outerHTML,
            text: el.textContent
          }));
        }
        return null;
      });
      
      if (paginationInfo) {
        console.log(`📄 Pagination elements found:`, paginationInfo);
      }
      
      console.log(`❌ No valid next page button found - reached end of collection`);
      return false;
      
    } catch (error) {
      console.error(`❌ Error finding next page: ${error.message}`);
      return false;
    }
  }

  isNextPageButton(buttonText, buttonHref) {
    if (!buttonText || !buttonHref) return false;
    
    const text = buttonText.toLowerCase().trim();
    const href = buttonHref.toLowerCase();
    
    // Check if button text indicates "next"
    const nextIndicators = ['next', 'next page', 'nextpage', '>', '→', 'forward'];
    const hasNextText = nextIndicators.some(indicator => text.includes(indicator));
    
    // Check if button text indicates "previous"
    const prevIndicators = ['previous', 'prev', 'previous page', 'prev page', '<', '←', 'back'];
    const hasPrevText = prevIndicators.some(indicator => text.includes(indicator));
    
    // If button text clearly indicates previous, reject it
    if (hasPrevText) {
      return false;
    }
    
    // If button text clearly indicates next, accept it
    if (hasNextText) {
      return true;
    }
    
    // Check if href indicates moving forward (higher page number)
    const pageMatch = href.match(/page=(\d+)/);
    if (pageMatch) {
      const pageNum = parseInt(pageMatch[1]);
      
      // Get current page number from URL
      const currentUrl = window.location.href;
      const currentPageMatch = currentUrl.match(/page=(\d+)/);
      const currentPage = currentPageMatch ? parseInt(currentPageMatch[1]) : 1;
      
      // Only accept buttons that go to a higher page number
      if (pageNum > currentPage) {
        return true;
      } else {
        console.log(`⚠️ Rejecting button: page ${pageNum} is not > current page ${currentPage}`);
        return false;
      }
    }
    
    // If we can't determine from href, be conservative and reject
    console.log(`⚠️ Cannot determine if button moves forward - rejecting for safety`);
    return false;
  }

  filterProducts(keywords, mode = 'OR') {
    console.log(`\n🔍 FILTERING ${this.allProducts.length} PRODUCTS:`);
    console.log(`🎯 Keywords: ${keywords.join(', ')}`);
    console.log(`📋 Mode: ${mode}`);
    
    this.matchedProducts = this.allProducts.filter(product => {
      const searchText = `${product.title} ${product.url}`.toLowerCase();
      
      // Enhanced matching with variations
      const matches = [];
      
      keywords.forEach(keyword => {
        const variations = this.getKeywordVariations(keyword);
        
        variations.forEach(variation => {
          if (searchText.includes(variation.toLowerCase())) {
            matches.push({ keyword, variation });
          }
        });
      });
      
      const hasMatch = mode === 'OR' ? matches.length > 0 : matches.length === keywords.length;
      
      if (hasMatch) {
        console.log(`✅ MATCH: "${product.title}"`);
        matches.forEach(match => {
          console.log(`   📌 Found "${match.keyword}" as "${match.variation}"`);
        });
        product.matches = matches;
      }
      
      return hasMatch;
    });
    
    console.log(`🎉 Found ${this.matchedProducts.length} matching products!`);
  }

  getKeywordVariations(keyword) {
    const base = [keyword];
    
    const variations = {
      'ashwagandha': ['ashwagandha', 'withania', 'withania somnifera', 'winter cherry', 'indian ginseng'],
      'kava': ['kava', 'kava kava', 'kava-kava', 'piper methysticum', 'kavain'],
      'skullcap': ['skullcap', 'skull cap', 'skull-cap', 'scutellaria', 'scutellaria baicalensis', 'scutellaria lateriflora'],
      'valerian': ['valerian', 'valeriana', 'valeriana officinalis'],
      'passionflower': ['passionflower', 'passion flower', 'passiflora'],
      'lemon balm': ['lemon balm', 'lemonbalm', 'melissa'],
      'chamomile': ['chamomile', 'matricaria'],
      'lavender': ['lavender', 'lavandula'],
      'st johns wort': ['st johns wort', 'st john\'s wort', 'hypericum']
    };
    
    const keywordLower = keyword.toLowerCase();
    if (variations[keywordLower]) {
      base.push(...variations[keywordLower]);
    }
    
    // Add underscored versions (common in URLs)
    const originalBase = [...base];
    originalBase.forEach(term => {
      base.push(term.replace(/\s+/g, '_'));
      base.push(term.replace(/\s+/g, '-'));
    });
    
    return [...new Set(base)];
  }

  async saveResults(keywords) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Save all products discovered
    const allProductsFile = `herbera-correct-all-products-${timestamp}.json`;
    await fs.writeFile(allProductsFile, JSON.stringify({
      searchInfo: {
        totalProducts: this.allProducts.length,
        collectionsScraped: this.stats.collectionsProcessed,
        timestamp: new Date().toISOString()
      },
      products: this.allProducts
    }, null, 2));
    console.log(`💾 All products saved: ${allProductsFile}`);
    
    // Save matches
    if (this.matchedProducts.length > 0) {
      const matchesFile = `herbera-herb-matches-${keywords.join('-')}-${timestamp}.json`;
      await fs.writeFile(matchesFile, JSON.stringify({
        searchInfo: {
          keywords: keywords,
          totalMatches: this.matchedProducts.length,
          timestamp: new Date().toISOString()
        },
        matches: this.matchedProducts
      }, null, 2));
      console.log(`🎯 Matches saved: ${matchesFile}`);
       
       // Simple URL list
       const urlsFile = `herbera-herb-urls-${keywords.join('-')}-${timestamp}.txt`;
       const urlList = this.matchedProducts.map(product => 
         `${product.title} - ${product.price} - ${product.url}`
       ).join('\n');
       await fs.writeFile(urlsFile, urlList);
       console.log(`📄 URLs saved: ${urlsFile}`);
     }
   }

   async run(keywords = ['ashwagandha', 'kava', 'skullcap']) {
     console.log(`🚀 CORRECT HerbEra Scraper - Targeting Right Collections`);
     console.log(`🎯 Searching for: ${keywords.join(', ')}`);
     console.log('='.repeat(60));
     
     // Correct collection URLs based on search results
     const collections = {
       'herbal-extracts': 'https://herb-era.com/collections/herbal-extracts',
       'tinctures': 'https://herb-era.com/collections/tinctures',
       'capsules': 'https://herb-era.com/collections/capsules',
       'powders': 'https://herb-era.com/collections/powders',
       'dried-herbs': 'https://herb-era.com/collections/dried-herbs',
       'all-products': 'https://herb-era.com/collections/all'
     };
     
     console.log(`📂 Will check these collections:`);
     Object.keys(collections).forEach(name => {
       console.log(`   - ${name}: ${collections[name]}`);
     });
     
     const crawler = new PlaywrightCrawler({
       headless: false, // Keep visible to see what's happening
       maxRequestsPerCrawl: Object.keys(collections).length,
       requestHandler: async ({ request, page }) => {
         const collectionName = Object.keys(collections).find(name => 
           collections[name] === request.url
         );
         
         if (collectionName) {
           const products = await this.scrapeProductsFromCollection(page, collectionName, request.url);
           this.allProducts.push(...products);
           this.stats.collectionsProcessed++;
           this.stats.totalFound += products.length;
         }
       }
     });
     
     // Start crawling
     const requests = Object.values(collections).map(url => ({ url }));
     await crawler.run(requests);
     
     // Remove duplicates
     const uniqueProducts = [];
     const seenUrls = new Set();
     this.allProducts.forEach(product => {
       if (!seenUrls.has(product.url)) {
         seenUrls.add(product.url);
         uniqueProducts.push(product);
       }
     });
     this.allProducts = uniqueProducts;
     
     console.log(`\n📊 DISCOVERY RESULTS:`);
     console.log(`   Collections processed: ${this.stats.collectionsProcessed}`);
     console.log(`   Total products found: ${this.allProducts.length}`);
     console.log(`   Unique products: ${this.allProducts.length}`);
     
     // Filter for target keywords
     this.filterProducts(keywords);
     
     // Save results
     await this.saveResults(keywords);
     
     // Summary
     console.log(`\n🎉 SCRAPING COMPLETE!`);
     if (this.matchedProducts.length > 0) {
       console.log(`✅ Found ${this.matchedProducts.length} products containing your herbs:`);
       this.matchedProducts.forEach((product, index) => {
         const herbs = [...new Set(product.matches.map(m => m.keyword))].join(', ');
         console.log(`   ${index + 1}. ${product.title} (${herbs})`);
         console.log(`      💰 ${product.price || 'Price not shown'}`);
         console.log(`      🔗 ${product.url}`);
       });
     } else {
       console.log(`❌ No products found containing: ${keywords.join(', ')}`);
       console.log(`💡 Try checking the saved product list for similar items`);
     }
     
     const duration = (Date.now() - this.stats.startTime) / 1000;
     console.log(`⏱️ Completed in ${duration.toFixed(1)} seconds`);
   }
 }

 // Export and CLI usage
 module.exports = CorrectHerbEraScraper;

 if (require.main === module) {
   const scraper = new CorrectHerbEraScraper();
   
   const args = process.argv.slice(2);
   const keywords = args.length > 0 ? 
     args[0].split(',').map(k => k.trim()) : 
     ['ashwagandha', 'kava', 'skullcap'];
   
   console.log(`🎯 Starting targeted search for: ${keywords.join(', ')}`);
   scraper.run(keywords).catch(console.error);
 }

 /*
 USAGE:
 1. Save as 'correct-herbera-scraper.js' 
 2. Run: node correct-herbera-scraper.js "ashwagandha,kava,skullcap"

 KEY IMPROVEMENTS:
 ✅ Targets the CORRECT collections:
    - /collections/herbal-extracts (where individual herbs are!)
    - /collections/tinctures
    - /collections/capsules
    - /collections/powders
    - /collections/dried-herbs
 ✅ Better product detection with multiple selectors
 ✅ Enhanced keyword matching with variations
 ✅ Handles underscored URLs (ashwagandha_herbal_tincture)
 ✅ Deduplicates products across collections
 ✅ Shows prices when available
 ✅ Comprehensive reporting
 ✅ PAGINATION SUPPORT - clicks "Next Page" buttons instead of just scrolling
 ✅ IMPROVED BUTTON VALIDATION - properly distinguishes next vs previous buttons

 This should find the individual herb tinctures that manual searching confirmed exist!
 */