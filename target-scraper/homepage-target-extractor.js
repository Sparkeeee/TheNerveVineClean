const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

// Configuration - matches your working config
const config = {
  target: {
    selectors: {
      searchBox: "input[data-test='@web/Search/SearchInput']",
      productLinks: "a[href*='/p/']",
      nextPage: "button[aria-label='Next Page'], a[aria-label='Next']"
    },
    pagination: {
      maxPages: 10,
      minDelay: 1000,
      maxDelay: 3000
    }
  }
};

// Helper to scroll like a human
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 200;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 300 + Math.random() * 200);
    });
  });
}

class HomepageTargetExtractor {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
  }

  async initialize() {
    console.log('🚀 Initializing Homepage Target Extractor...');
    
    this.browser = await chromium.launch({ 
      headless: false, // Visible for debugging
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-blink-features=AutomationControlled'
      ]
    });
    
    this.context = await this.browser.newContext({
      viewport: { width: 1366, height: 768 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    
    this.page = await this.context.newPage();
    
    // Hide automation indicators
    await this.page.addInitScript(() => {
      delete navigator.__proto__.webdriver;
      Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
      Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
    });
    
    console.log('✅ Browser initialized successfully');
  }

  async extractTargetUrls(searchTerm) {
    const { selectors, pagination } = config.target;
    const urls = new Set();

    try {
      console.log(`🌐 Opening Target homepage...`);
      await this.page.goto("https://www.target.com/", { waitUntil: "domcontentloaded" });

      // Wait for search box to appear
      console.log('🔍 Looking for search box...');
      const searchInput = await this.page.$(selectors.searchBox);
      if (!searchInput) {
        throw new Error("Search box not found");
      }
      console.log('✅ Search box found!');

      // Human-like typing
      console.log(`⌨️ Typing search term: "${searchTerm}"`);
      for (const char of searchTerm) {
        await searchInput.type(char, { delay: 100 + Math.random() * 100 }); // human-like typing
      }
      
      // Press Enter to search
      console.log('🔍 Pressing Enter to search...');
      await searchInput.press("Enter");

      let currentPage = 1;
      let hasNext = true;

      while (hasNext && currentPage <= pagination.maxPages) {
        console.log(`\n📄 Page ${currentPage}/${pagination.maxPages}`);
        
        try {
          // Wait for product links to appear
          console.log('⏳ Waiting for product links...');
          await this.page.waitForSelector(selectors.productLinks, { timeout: 10000 });
          console.log('✅ Product links found!');

          // Scroll slowly to load products
          console.log('📜 Auto-scrolling to load all products...');
          await autoScroll(this.page);

          // Extract URLs
          const rawUrls = await this.page.$$eval(selectors.productLinks, els =>
            els
              .map(el => el.getAttribute("href"))
              .filter((href) => !!href && href.includes("/p/"))
              .map(href => new URL(href, "https://www.target.com").toString())
          );

          rawUrls.forEach(u => urls.add(u));
          console.log(`✅ Extracted ${rawUrls.length} URLs (running total: ${urls.size})`);

          // Take screenshot for debugging
          await this.page.screenshot({ 
            path: `./homepage_target_page_${currentPage}_${Date.now()}.png`, 
            fullPage: true 
          });

        } catch (err) {
          console.warn(`⚠️ Failed to extract URLs on page ${currentPage}: ${err}`);
        }

        // Pagination
        try {
          const nextBtn = await this.page.$(selectors.nextPage);
          if (nextBtn) {
            console.log('🔄 Clicking next page button...');
            await Promise.all([this.page.waitForNavigation(), nextBtn.click()]);
            
            const delay = Math.random() * (pagination.maxDelay - pagination.minDelay) + pagination.minDelay;
            console.log(`⏱ Waiting ${Math.round(delay)}ms before next page...`);
            await this.page.waitForTimeout(delay);
            
            currentPage++;
          } else {
            hasNext = false;
            console.log("🚪 No next page button, stopping");
          }
        } catch (error) {
          console.log("🚪 Pagination failed or ended:", error.message);
          hasNext = false;
        }
      }

    } catch (error) {
      console.error('❌ Extraction failed:', error);
    }

    console.log(`\n🎯 EXTRACTION COMPLETE!`);
    console.log(`Total unique URLs found: ${urls.size}`);
    console.log(`Pages processed: ${currentPage - 1}`);
    
    return [...urls];
  }

  async saveResults(urls, searchTerm) {
    if (urls.length === 0) {
      console.log('⚠️ No URLs to save');
      return;
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `homepage_target_results_${searchTerm.replace(/\s+/g, '_')}_${timestamp}`;
    
    try {
      // Save as JSON with metadata
      const jsonData = {
        searchTerm,
        timestamp: new Date().toISOString(),
        totalUrls: urls.length,
        urls: urls,
        config: config,
        extractor: 'Homepage Target Extractor with Human-like Behavior',
        method: 'Homepage search with human-like typing and scrolling'
      };
      
      await fs.writeFile(`${filename}.json`, JSON.stringify(jsonData, null, 2));
      
      // Save as TXT for easy copying
      await fs.writeFile(`${filename}.txt`, urls.join('\n'));
      
      console.log(`💾 Results saved:`);
      console.log(`  📄 JSON: ${filename}.json`);
      console.log(`  📝 TXT: ${filename}.txt`);
      
    } catch (error) {
      console.error('❌ Failed to save results:', error);
    }
  }

  async close() {
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
    console.log('🔒 Browser closed');
  }
}

// Main execution function
async function main() {
  const extractor = new HomepageTargetExtractor();
  
  try {
    await extractor.initialize();
    
    // Test with your working search term
    const searchTerm = 'magnesium glycinate supplement';
    
    const urls = await extractor.extractTargetUrls(searchTerm);
    
    if (urls.length > 0) {
      await extractor.saveResults(urls, searchTerm);
      
      console.log('\n🎉 SUCCESS! First 5 URLs:');
      urls.slice(0, 5).forEach((url, i) => {
        console.log(`  ${i + 1}. ${url}`);
      });
      
      if (urls.length > 5) {
        console.log(`  ... and ${urls.length - 5} more URLs`);
      }
    } else {
      console.log('\n❌ No URLs found');
    }
    
  } catch (error) {
    console.error('❌ Extraction failed:', error);
  } finally {
    await extractor.close();
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { HomepageTargetExtractor, main, autoScroll };
