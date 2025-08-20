const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

// Configuration - can be loaded from external file
const config = {
  target: {
    selectors: {
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

class WorkingTargetExtractor {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
  }

  async initialize() {
    console.log('🚀 Initializing Working Target Extractor...');
    
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

  async extractTargetUrls(herb, type) {
    const { selectors, pagination } = config.target;
    const urls = new Set();
    const searchTerm = `${herb} ${type}`;

    console.log(`🔍 Starting extraction for: "${searchTerm}"`);
    console.log(`📊 Max pages: ${pagination.maxPages}`);

    let currentPage = 1;
    let hasNext = true;

    while (hasNext && currentPage <= pagination.maxPages) {
      console.log(`\n🔍 Page ${currentPage}/${pagination.maxPages}`);

      try {
        // Build search URL
        const searchUrl = `https://www.target.com/s?searchTerm=${encodeURIComponent(searchTerm)}${currentPage > 1 ? `&page=${currentPage}` : ''}`;
        console.log(`🌐 Navigating to: ${searchUrl}`);
        
        await this.page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

        // STRATEGY 1: Gradual scrolling to trigger dynamic loading (from your working code)
        console.log('📜 Gradual scrolling to trigger dynamic loading...');
        const viewportHeight = this.page.viewportSize()?.height || 800;
        
        for (let i = 0; i < 5; i++) {
          await this.page.evaluate((h) => window.scrollBy(0, h), viewportHeight / 2);
          await this.page.waitForTimeout(1000 + Math.random() * 1000);
          console.log(`📏 Scroll step ${i + 1}/5 completed`);
        }

        // STRATEGY 2: Wait for product links to appear
        console.log('⏳ Waiting for product links to appear...');
        try {
          await this.page.waitForSelector("a[href*='/p/']", { timeout: 10000 });
          console.log('✅ Product links found!');
        } catch (error) {
          console.log('⚠️ Product links not found after waiting');
        }

        // STRATEGY 3: Extract URLs with refined JS fallback
        let rawUrls = await this.extractUrlsWithRefinedFallback();

        // Add new URLs to our set
        rawUrls.forEach(u => urls.add(u));
        console.log(`✅ Extracted ${rawUrls.length} URLs (running total: ${urls.size})`);

        // Take screenshot for debugging
        await this.page.screenshot({ 
          path: `./target_page_${currentPage}_${Date.now()}.png`, 
          fullPage: true 
        });

      } catch (err) {
        console.warn(`⚠️ Failed to extract URLs on page ${currentPage}: ${err}`);
      }

      // Random delay before next page
      if (currentPage < pagination.maxPages) {
        const delay = Math.floor(Math.random() * (pagination.maxDelay - pagination.minDelay + 1)) + pagination.minDelay;
        console.log(`⏱ Waiting ${delay}ms before next page...`);
        await this.page.waitForTimeout(delay);
      }

      // Pagination logic
      try {
        const nextBtn = await this.page.$(selectors.nextPage);
        if (nextBtn) {
          console.log('🔄 Clicking next page button...');
          await Promise.all([
            this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }), 
            nextBtn.click()
          ]);
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

    console.log(`\n🎯 EXTRACTION COMPLETE!`);
    console.log(`Total unique URLs found: ${urls.size}`);
    console.log(`Pages processed: ${currentPage - 1}`);
    
    return [...urls];
  }

  async extractUrlsWithRefinedFallback() {
    try {
      // Primary extraction: direct /p/ links
      let rawUrls = await this.page.$$eval("a[href*='/p/']", els =>
        els
          .map(el => el.getAttribute("href"))
          .filter((href) => !!href)
          .map(href => new URL(href, "https://www.target.com").toString())
      );

      console.log(`🔍 Primary extraction found ${rawUrls.length} URLs`);

      // Refined fallback: click "Show more" or similar dynamic loaders
      if (rawUrls.length === 0) {
        console.log("🔍 Using refined JS fallback...");
        try {
          await this.page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll("button"));
            buttons.forEach(btn => {
              if (btn.textContent?.includes("Show more") || btn.textContent?.includes("Load more")) {
                btn.click();
              }
            });
          });
          
          await this.page.waitForTimeout(3000 + Math.random() * 2000);

          // Retry extraction after JS interaction
          rawUrls = await this.page.$$eval("a[href*='/p/']", els =>
            els
              .map(el => el.getAttribute("href"))
              .filter((href) => !!href)
              .map(href => new URL(href, "https://www.target.com").toString())
          );
          
          console.log(`🔁 Refined fallback extracted ${rawUrls.length} URLs`);
        } catch (err) {
          console.warn("⚠️ Refined fallback failed:", err.message);
        }
      }

      return rawUrls;
      
    } catch (error) {
      console.warn(`⚠️ URL extraction failed: ${error.message}`);
      return [];
    }
  }

  async saveResults(urls, searchTerm) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `target_results_${searchTerm.replace(/\s+/g, '_')}_${timestamp}`;
    
    try {
      // Save as JSON with metadata
      const jsonData = {
        searchTerm,
        timestamp: new Date().toISOString(),
        totalUrls: urls.length,
        urls: urls,
        config: config
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
  const extractor = new WorkingTargetExtractor();
  
  try {
    await extractor.initialize();
    
    // Test with your working search term
    const herb = 'magnesium glycinate';
    const type = 'supplement';
    
    const urls = await extractor.extractTargetUrls(herb, type);
    
    if (urls.length > 0) {
      await extractor.saveResults(urls, `${herb} ${type}`);
      
      console.log('\n🎉 SUCCESS! First 5 URLs:');
      urls.slice(0, 5).forEach((url, i) => {
        console.log(`  ${i + 1}. ${url}`);
      });
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

module.exports = { WorkingTargetExtractor, main };
