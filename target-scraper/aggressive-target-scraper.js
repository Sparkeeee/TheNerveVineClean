const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

class AggressiveTargetScraper {
  constructor() {
    this.results = [];
    this.screenshotDir = './aggressive_screenshots';
  }

  async run() {
    console.log('🚀 AGGRESSIVE TARGET SCRAPER');
    console.log('=====================================\n');

    const browser = await puppeteer.launch({
      headless: false, // Visible browser for debugging
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });

    try {
      await this.scrapeSupplementsCategory(browser);
      await this.saveResults();
    } finally {
      await browser.close();
      console.log('🔒 Browser closed');
    }
  }

  async scrapeSupplementsCategory(browser) {
    const page = await browser.newPage();
    
    // Set realistic viewport
    await page.setViewport({ width: 1366, height: 768 });
    
    // Set user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    console.log('🌐 Navigating to supplements category...');
    await page.goto('https://www.target.com/c/supplements', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Wait for initial page load
    await page.waitForTimeout(3000);
    
    // Take initial screenshot
    await this.takeScreenshot(page, '01_initial_load');

    // STRATEGY 1: Wait for product cards to appear
    console.log('🔍 Strategy 1: Waiting for product cards...');
    try {
      await page.waitForSelector('[data-test="@web/site-top-of-funnel/ProductCardWrapper"]', { timeout: 10000 });
      console.log('✅ Product cards found!');
    } catch (error) {
      console.log('⚠️ Product cards not found, trying alternative selectors...');
    }

    // STRATEGY 2: Scroll aggressively to trigger lazy loading
    console.log('📜 Strategy 2: Aggressive scrolling...');
    await this.aggressiveScroll(page);
    
    // Take screenshot after scrolling
    await this.takeScreenshot(page, '02_after_scrolling');

    // STRATEGY 3: Wait for dynamic content
    console.log('⏳ Strategy 3: Waiting for dynamic content...');
    await page.waitForTimeout(5000);

    // STRATEGY 4: Try multiple extraction methods
    console.log('🔍 Strategy 4: Multiple extraction methods...');
    const urls = await this.extractWithMultipleMethods(page);
    
    console.log(`\n📊 EXTRACTION RESULTS:`);
    console.log(`Total URLs found: ${urls.length}`);
    urls.forEach((url, index) => {
      console.log(`${index + 1}. ${url}`);
    });

    this.results = urls;
  }

  async aggressiveScroll(page) {
    // Scroll down multiple times with delays
    for (let i = 0; i < 10; i++) {
      await page.evaluate(() => {
        window.scrollBy(0, 800);
      });
      await page.waitForTimeout(1000);
      
      // Try to trigger any "Load More" buttons
      try {
        const loadMoreButton = await page.$('[data-test="load-more"], .load-more, button:contains("Load More")');
        if (loadMoreButton) {
          console.log('🔄 Found Load More button, clicking...');
          await loadMoreButton.click();
          await page.waitForTimeout(2000);
        }
      } catch (error) {
        // Ignore errors
      }
    }
    
    // Scroll to bottom
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(2000);
  }

  async extractWithMultipleMethods(page) {
    const allUrls = new Set();
    
    // Method 1: Direct product card selectors
    console.log('  📋 Method 1: Product card selectors...');
    const method1Urls = await this.extractWithSelectors(page, [
      '[data-test="@web/site-top-of-funnel/ProductCardWrapper"] a[href*="/p/"]',
      '[data-test="product-title"] a',
      '[data-test="@web/ProductCard/ProductCardImageHoverableLink"] a',
      '.styles_cardWrapper__Lo85r a[href*="/p/"]'
    ]);
    method1Urls.forEach(url => allUrls.add(url));
    console.log(`    Found: ${method1Urls.length} URLs`);

    // Method 2: Generic /p/ links
    console.log('  🔗 Method 2: Generic /p/ links...');
    const method2Urls = await page.$$eval('a[href*="/p/"]', (links) => {
      return links.map(link => link.href)
        .filter(href => href.includes('/p/'))
        .map(href => href.split('#')[0])
        .map(href => href.split('?')[0]);
    });
    method2Urls.forEach(url => allUrls.add(url));
    console.log(`    Found: ${method2Urls.length} URLs`);

    // Method 3: Look for any clickable product elements
    console.log('  🖱️ Method 3: Clickable product elements...');
    const method3Urls = await page.$$eval('[data-test*="ProductCard"], [class*="ProductCard"]', (elements) => {
      const urls = [];
      elements.forEach(el => {
        const links = el.querySelectorAll('a[href*="/p/"]');
        links.forEach(link => {
          const href = link.href;
          if (href.includes('/p/')) {
            urls.push(href.split('#')[0].split('?')[0]);
          }
        });
      });
      return urls;
    });
    method3Urls.forEach(url => allUrls.add(url));
    console.log(`    Found: ${method3Urls.length} URLs`);

    // Method 4: Check page source for /p/ URLs
    console.log('  📄 Method 4: Page source analysis...');
    const pageContent = await page.content();
    const urlMatches = pageContent.match(/\/p\/[^"'\s>]+/g) || [];
    const method4Urls = urlMatches
      .map(match => `https://www.target.com${match}`)
      .filter(url => url.includes('/p/'));
    method4Urls.forEach(url => allUrls.add(url));
    console.log(`    Found: ${method4Urls.length} URLs`);

    return Array.from(allUrls);
  }

  async extractWithSelectors(page, selectors) {
    const urls = [];
    
    for (const selector of selectors) {
      try {
        const links = await page.$$eval(selector, (elements) => {
          return elements.map(el => el.href)
            .filter(href => href && href.includes('/p/'))
            .map(href => href.split('#')[0])
            .map(href => href.split('?')[0]);
        });
        urls.push(...links);
      } catch (error) {
        console.log(`    ⚠️ Selector "${selector}" failed: ${error.message}`);
      }
    }
    
    return urls;
  }

  async takeScreenshot(page, name) {
    try {
      await fs.mkdir(this.screenshotDir, { recursive: true });
      const filename = `${name}_${Date.now()}.png`;
      const filepath = path.join(this.screenshotDir, filename);
      await page.screenshot({ path: filepath, fullPage: true });
      console.log(`📸 Screenshot saved: ${filepath}`);
    } catch (error) {
      console.log(`⚠️ Screenshot failed: ${error.message}`);
    }
  }

  async saveResults() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Save as JSON
    const jsonFilename = `aggressive_target_results_${timestamp}.json`;
    await fs.writeFile(jsonFilename, JSON.stringify({
      timestamp: new Date().toISOString(),
      totalUrls: this.results.length,
      urls: this.results
    }, null, 2));
    
    // Save as TXT
    const txtFilename = `aggressive_target_results_${timestamp}.txt`;
    await fs.writeFile(txtFilename, this.results.join('\n'));
    
    console.log(`\n💾 Results saved:`);
    console.log(`  JSON: ${jsonFilename}`);
    console.log(`  TXT: ${txtFilename}`);
    console.log(`\n🎯 Total unique product URLs found: ${this.results.length}`);
  }
}

// Run the scraper
async function main() {
  const scraper = new AggressiveTargetScraper();
  await scraper.run();
}

main().catch(console.error);


