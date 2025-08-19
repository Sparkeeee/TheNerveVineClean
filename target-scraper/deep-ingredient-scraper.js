// Deep Ingredient Scraper - Checks product pages for ingredient lists
const { PlaywrightCrawler, Dataset } = require('crawlee');
const fs = require('fs').promises;
const path = require('path');

class DeepIngredientScraper {
  constructor() {
    this.productList = [];
    this.matchedProducts = [];
    this.stats = {
      totalProducts: 0,
      productsParsed: 0,
      matches: 0,
      errors: 0,
      startTime: Date.now()
    };
  }

  async loadProductList(filename) {
    try {
      const data = await fs.readFile(filename, 'utf8');
      const parsed = JSON.parse(data);
      this.productList = parsed.products || [];
      console.log(`📂 Loaded ${this.productList.length} products from ${filename}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to load product list: ${error.message}`);
      return false;
    }
  }

  async scrapeProductIngredients(page, productUrl, productTitle) {
    console.log(`\n🔍 Checking: ${productTitle}`);
    console.log(`🔗 URL: ${productUrl}`);
    
    try {
      await page.goto(productUrl, { waitUntil: 'networkidle', timeout: 15000 });
      
      // Extract all text content from the page
      const pageData = await page.evaluate(() => {
        // Look for ingredient sections
        const ingredientSelectors = [
          '.product-description',
          '.product__description',
          '.product-content',
          '.ingredients',
          '.supplement-facts',
          '.product-details',
          '[data-ingredients]',
          '.rte', // Rich text editor content
          '.product__text',
          '.product-form__text'
        ];
        
        let ingredientText = '';
        let fullPageText = document.body.textContent.toLowerCase();
        
        // Try to find specific ingredient sections
        for (const selector of ingredientSelectors) {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            ingredientText += el.textContent + ' ';
          });
        }
        
        // Get all text if no specific ingredient section found
        if (!ingredientText.trim()) {
          ingredientText = fullPageText;
        }
        
        // Look for supplement facts or ingredient labels
        const supplementFacts = document.querySelector('.supplement-facts, .nutrition-facts');
        let supplementFactsText = '';
        if (supplementFacts) {
          supplementFactsText = supplementFacts.textContent;
        }
        
        // Get product title and any subtitles
        const titleElements = document.querySelectorAll('h1, .product-title, .product__title');
        let titleText = '';
        titleElements.forEach(el => titleText += el.textContent + ' ');
        
        return {
          title: titleText.trim(),
          ingredients: ingredientText.toLowerCase().trim(),
          supplementFacts: supplementFactsText.toLowerCase().trim(),
          fullPage: fullPageText.substring(0, 2000), // First 2000 chars for analysis
          url: window.location.href
        };
      });
      
      console.log(`📄 Page loaded successfully`);
      return pageData;
      
    } catch (error) {
      console.error(`❌ Error scraping ${productUrl}: ${error.message}`);
      this.stats.errors++;
      return null;
    }
  }

  findIngredientMatches(pageData, keywords) {
    const matches = [];
    const searchText = [
      pageData.ingredients,
      pageData.supplementFacts,
      pageData.fullPage
    ].join(' ').toLowerCase();
    
    console.log(`📝 Checking ingredients in: ${searchText.substring(0, 150)}...`);
    
    keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      const variations = this.getHerbVariations(keywordLower);
      
      variations.forEach(variation => {
        if (searchText.includes(variation)) {
          matches.push({
            keyword: keyword,
            variation: variation,
            context: this.getMatchContext(searchText, variation)
          });
          console.log(`✅ FOUND: "${variation}" for keyword "${keyword}"`);
        }
      });
    });
    
    return matches;
  }

  getHerbVariations(keyword) {
    const baseVariations = [keyword];
    
    const herbVariations = {
      'kava': [
        'kava', 'kava kava', 'piper methysticum', 'kawa kawa',
        'kavain', 'kavalactones'
      ],
      'skullcap': [
        'skullcap', 'skull cap', 'scutellaria', 'scutellaria baicalensis',
        'scutellaria lateriflora', 'american skullcap', 'chinese skullcap',
        'baical skullcap', 'mad dog skullcap'
      ],
      'ashwagandha': [
        'ashwagandha', 'withania', 'withania somnifera', 'winter cherry',
        'indian winter cherry', 'poison gooseberry', 'withanolides'
      ],
      'valerian': [
        'valerian', 'valeriana', 'valeriana officinalis', 'valerian root'
      ],
      'passionflower': [
        'passionflower', 'passion flower', 'passiflora', 'passiflora incarnata'
      ],
      'lemon balm': [
        'lemon balm', 'lemonbalm', 'melissa', 'melissa officinalis'
      ],
      'chamomile': [
        'chamomile', 'matricaria', 'chamaemelum', 'german chamomile', 'roman chamomile'
      ]
    };
    
    if (herbVariations[keyword]) {
      baseVariations.push(...herbVariations[keyword]);
    }
    
    // Add common herb suffixes
    const suffixes = ['extract', 'powder', 'root', 'leaf', 'herb', 'standardized'];
    const originalVariations = [...baseVariations];
    
    originalVariations.forEach(variation => {
      suffixes.forEach(suffix => {
        baseVariations.push(`${variation} ${suffix}`);
      });
    });
    
    return [...new Set(baseVariations)]; // Remove duplicates
  }

  getMatchContext(text, variation, contextLength = 100) {
    const index = text.indexOf(variation);
    if (index === -1) return '';
    
    const start = Math.max(0, index - contextLength / 2);
    const end = Math.min(text.length, index + variation.length + contextLength / 2);
    
    return text.substring(start, end).trim();
  }

  async analyzeFormulas(keywords) {
    console.log(`🧪 Deep Ingredient Analysis Started`);
    console.log(`🎯 Looking for: ${keywords.join(', ')}`);
    console.log(`📦 Products to analyze: ${this.productList.length}`);
    console.log('='.repeat(60));
    
    // Filter products that might contain the herbs based on likely names
    const suspiciousProducts = this.productList.filter(product => {
      const title = product.title.toLowerCase();
      const suspiciousNames = [
        'stress', 'sleep', 'calm', 'relax', 'anxiety', 'nerve', 'brain',
        'energy', 'adapt', 'libido', 'testosterone', 'adren', 'cerebral'
      ];
      
      return suspiciousNames.some(name => title.includes(name));
    });
    
    console.log(`🎯 Found ${suspiciousProducts.length} potentially relevant products to check first`);
    
    // Check suspicious products first, then all others
    const productsToCheck = [
      ...suspiciousProducts,
      ...this.productList.filter(p => !suspiciousProducts.includes(p))
    ].slice(0, 20); // Limit to first 20 to avoid overwhelming
    
    const crawler = new PlaywrightCrawler({
      headless: false, // Keep visible for debugging
      maxRequestsPerCrawl: productsToCheck.length,
      maxConcurrency: 1, // Process one at a time to be respectful
      
      requestHandler: async ({ request, page }) => {
        const product = productsToCheck.find(p => p.url === request.url);
        if (!product) return;
        
        this.stats.productsParsed++;
        
        // Add delay between requests
        await page.waitForTimeout(2000 + Math.random() * 3000);
        
        const pageData = await this.scrapeProductIngredients(page, request.url, product.title);
        
        if (pageData) {
          const matches = this.findIngredientMatches(pageData, keywords);
          
          if (matches.length > 0) {
            this.matchedProducts.push({
              ...product,
              matches: matches,
              pageData: pageData
            });
            
            this.stats.matches++;
            console.log(`🎉 MATCH FOUND! ${product.title} contains:`);
            matches.forEach(match => {
              console.log(`   - ${match.keyword} (as "${match.variation}")`);
              console.log(`     Context: "${match.context.substring(0, 80)}..."`);
            });
          } else {
            console.log(`❌ No matches found in ${product.title}`);
          }
        }
        
        console.log(`📊 Progress: ${this.stats.productsParsed}/${productsToCheck.length} products checked`);
      }
    });
    
    // Add URLs to crawler
    const requests = productsToCheck.map(product => ({ url: product.url }));
    await crawler.run(requests);
  }

  async saveResults(keywords) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    if (this.matchedProducts.length > 0) {
      // Save detailed results
      const resultsFile = `herbera-ingredient-matches-${keywords.join('-')}-${timestamp}.json`;
      await fs.writeFile(resultsFile, JSON.stringify({
        searchInfo: {
          keywords: keywords,
          totalProductsAnalyzed: this.stats.productsParsed,
          matchesFound: this.stats.matches,
          timestamp: new Date().toISOString()
        },
        matches: this.matchedProducts
      }, null, 2));
      
      console.log(`💾 Results saved to: ${resultsFile}`);
      
      // Save simple URL list
      const urlsFile = `herbera-matching-urls-${keywords.join('-')}-${timestamp}.txt`;
      const urls = this.matchedProducts.map(p => `${p.title} - ${p.url}`).join('\n');
      await fs.writeFile(urlsFile, urls);
      
      console.log(`📄 URL list saved to: ${urlsFile}`);
      
      // Print summary
      console.log(`\n🎉 INGREDIENT ANALYSIS COMPLETE!`);
      console.log(`📊 Summary:`);
      console.log(`   Products analyzed: ${this.stats.productsParsed}`);
      console.log(`   Matches found: ${this.stats.matches}`);
      console.log(`   Success rate: ${((this.stats.matches / this.stats.productsParsed) * 100).toFixed(1)}%`);
      
      console.log(`\n🏆 Products containing your herbs:`);
      this.matchedProducts.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.title}`);
        product.matches.forEach(match => {
          console.log(`      ✅ Contains ${match.keyword} (as "${match.variation}")`);
        });
        console.log(`      🔗 ${product.url}`);
        console.log('');
      });
      
    } else {
      console.log(`\n❌ No products found containing: ${keywords.join(', ')}`);
      console.log(`📊 Analyzed ${this.stats.productsParsed} products`);
      console.log(`⚠️ This might mean:`);
      console.log(`   1. The herbs aren't available at HerbEra`);
      console.log(`   2. They're listed under different names`);
      console.log(`   3. They're in formulas but not clearly labeled`);
    }
  }

  async run(keywords = ['skullcap', 'kava', 'ashwagandha']) {
    console.log(`🚀 Deep Ingredient Analysis for HerbEra`);
    console.log('='.repeat(50));
    
    // Load the product list from previous scrape
    const productFiles = await fs.readdir('.');
    const latestProductFile = productFiles
      .filter(f => f.startsWith('herbera-all-products-') && f.endsWith('.json'))
      .sort()
      .pop();
    
    if (!latestProductFile) {
      console.error('❌ No product list file found. Please run the basic scraper first.');
      console.log('💡 Run: node enhanced-herbera-scraper.js');
      return;
    }
    
    if (!(await this.loadProductList(latestProductFile))) {
      return;
    }
    
    await this.analyzeFormulas(keywords);
    await this.saveResults(keywords);
    
    const duration = (Date.now() - this.stats.startTime) / 1000;
    console.log(`\n⏱️ Analysis completed in ${duration}s`);
  }
}

// Export for use as module
module.exports = DeepIngredientScraper;

// CLI usage
if (require.main === module) {
  const scraper = new DeepIngredientScraper();
  
  const args = process.argv.slice(2);
  const keywords = args.length > 0 ? args[0].split(',').map(k => k.trim()) : ['skullcap', 'kava', 'ashwagandha'];
  
  console.log(`Starting deep ingredient analysis for: ${keywords.join(', ')}`);
  scraper.run(keywords).catch(console.error);
}

/*
USAGE:
1. Save as 'deep-ingredient-scraper.js'
2. Make sure you have the herbera-all-products-*.json file from previous run
3. Run: node deep-ingredient-scraper.js
4. Or with custom keywords: node deep-ingredient-scraper.js "kava,valerian,passionflower"

WHAT THIS DOES:
✅ Loads the product list from your previous scrape
✅ Visits each product page individually
✅ Extracts ingredient lists and descriptions
✅ Searches for herbs using multiple name variations
✅ Checks formulas that might contain the herbs
✅ Provides context around matches
✅ Saves detailed results
✅ Focuses on "suspicious" products first (stress, sleep, calm formulas)

TARGETED ANALYSIS:
This scraper specifically looks at products like:
- "Sleepix Tincture" (might contain kava/valerian)
- "Anti Stress Mix" (might contain ashwagandha)
- "Cerebralix Tincture" (brain/stress formula)
- Any formulas with stress/sleep/calm keywords
*/
