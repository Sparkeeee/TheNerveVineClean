const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

// Configuration - matches your working config
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

// Utility functions from your enhanced version
function randomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function humanScroll(page, steps = 5) {
  const viewportHeight = page.viewportSize()?.height || 800;
  for (let i = 0; i < steps; i++) {
    await page.evaluate((h) => window.scrollBy(0, h), viewportHeight / steps);
    await page.waitForTimeout(randomDelay(500, 1500));
  }
}

async function moveMouseRandomly(page) {
  const { width, height } = page.viewportSize() || { width: 800, height: 600 };
  const x = randomDelay(0, width);
  const y = randomDelay(0, height);
  await page.mouse.move(x, y, { steps: 5 });
  await page.waitForTimeout(randomDelay(200, 700));
}

class EnhancedTargetExtractor {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
  }

  async initialize() {
    console.log('🚀 Initializing Enhanced Target Extractor...');
    
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

        // Human-like actions (from your enhanced version)
        console.log('📜 Performing human-like actions...');
        await humanScroll(this.page);
        await moveMouseRandomly(this.page);

        // Wait for product links to appear
        console.log('⏳ Waiting for product links to appear...');
        try {
          await this.page.waitForSelector("a[href*='/p/']", { timeout: 10000 });
          console.log('✅ Product links found!');
        } catch (error) {
          console.log('⚠️ Product links not found after waiting');
        }

        // Primary product extraction
        let rawUrls = await this.page.$$eval("a[href*='/p/']", els =>
          els
            .map(el => el.getAttribute("href"))
            .filter((href) => !!href)
            .map(href => new URL(href, "https://www.target.com").toString())
        );

        console.log(`🔍 Primary extraction found ${rawUrls.length} URLs`);

        // Refined fallback for dynamically loaded products (from your enhanced version)
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
            
            await this.page.waitForTimeout(randomDelay(3000, 5000));
            await humanScroll(this.page);
            await moveMouseRandomly(this.page);

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

        // Add new URLs to our set
        rawUrls.forEach(u => urls.add(u));
        console.log(`✅ Extracted ${rawUrls.length} URLs (running total: ${urls.size})`);

        // Take screenshot for debugging
        await this.page.screenshot({ 
          path: `./enhanced_target_page_${currentPage}_${Date.now()}.png`, 
          fullPage: true 
        });

      } catch (err) {
        console.warn(`⚠️ Failed to extract URLs on page ${currentPage}: ${err}`);
      }

      // Random delay before next page (from your enhanced version)
      if (currentPage < pagination.maxPages) {
        const delay = randomDelay(pagination.minDelay, pagination.maxDelay);
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

  async saveResults(urls, searchTerm) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `enhanced_target_results_${searchTerm.replace(/\s+/g, '_')}_${timestamp}`;
    
    try {
      // Save as JSON with metadata
      const jsonData = {
        searchTerm,
        timestamp: new Date().toISOString(),
        totalUrls: urls.length,
        urls: urls,
        config: config,
        extractor: 'Enhanced Target Extractor with Human-like Behavior'
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
  const extractor = new EnhancedTargetExtractor();
  
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

module.exports = { EnhancedTargetExtractor, main, humanScroll, moveMouseRandomly, randomDelay };


