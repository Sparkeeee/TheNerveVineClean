const puppeteer = require('puppeteer');
const fs = require('fs').promises;

class StealthTargetTest {
  constructor() {
    this.results = [];
  }

  async run() {
    console.log('🕵️ STEALTH TARGET TEST - Mimicking Manual User Behavior');
    console.log('========================================================\n');

    const browser = await puppeteer.launch({
      headless: false, // Visible browser for debugging
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-blink-features=AutomationControlled', // Hide automation
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });

    try {
      const page = await browser.newPage();
      
      // Set realistic viewport
      await page.setViewport({ width: 1366, height: 768 });
      
      // Set realistic user agent
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      
      // Hide automation indicators
      await page.evaluateOnNewDocument(() => {
        // Remove webdriver property
        delete navigator.__proto__.webdriver;
        
        // Override permissions
        const originalQuery = window.navigator.permissions.query;
        window.navigator.permissions.query = (parameters) => (
          parameters.name === 'notifications' ?
            Promise.resolve({ state: Notification.permission }) :
            originalQuery(parameters)
        );
        
        // Override plugins
        Object.defineProperty(navigator, 'plugins', {
          get: () => [1, 2, 3, 4, 5]
        });
        
        // Override languages
        Object.defineProperty(navigator, 'languages', {
          get: () => ['en-US', 'en']
        });
      });

      console.log('🌐 Step 1: Going to Target homepage...');
      await page.goto('https://www.target.com', { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      // Wait like a human
      await this.humanDelay(2000, 4000);
      
      console.log('🔍 Step 2: Looking for search box...');
      
      // Wait for search box to appear
      await page.waitForSelector('input[data-test="search-input"], input[placeholder*="search"], input[name="searchTerm"]', { timeout: 10000 });
      
      // Type like a human (slowly)
      const searchTerm = 'magnesium glycinate supplement';
      console.log(`📝 Step 3: Typing search term: "${searchTerm}"`);
      
      const searchInput = await page.$('input[data-test="search-input"], input[placeholder*="search"], input[name="searchTerm"]');
      if (searchInput) {
        // Click first, then type
        await searchInput.click();
        await this.humanDelay(500, 1000);
        
        // Type character by character like a human
        for (let i = 0; i < searchTerm.length; i++) {
          await searchInput.type(searchTerm[i]);
          await this.humanDelay(50, 150);
        }
        
        await this.humanDelay(1000, 2000);
        
        // Press Enter
        await searchInput.press('Enter');
        console.log('⏳ Step 4: Waiting for search results...');
        
        // Wait for navigation
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
        
        // Wait like a human for content to load
        await this.humanDelay(3000, 5000);
        
        console.log('📜 Step 5: Scrolling to trigger lazy loading...');
        
        // Scroll like a human (slow and natural)
        await this.humanScroll(page);
        
        // Wait for content to settle
        await this.humanDelay(2000, 4000);
        
        console.log('🔍 Step 6: Extracting product URLs...');
        
        // Take screenshot to see what's there
        await page.screenshot({ path: './stealth_screenshot.png', fullPage: true });
        console.log('📸 Screenshot saved: stealth_screenshot.png');
        
        // Try multiple extraction methods
        const urls = await this.extractUrlsMultipleMethods(page);
        
        console.log(`\n🎯 RESULTS:`);
        console.log(`Total URLs found: ${urls.length}`);
        if (urls.length > 0) {
          console.log('First 5 URLs:');
          urls.slice(0, 5).forEach((url, i) => {
            console.log(`  ${i + 1}. ${url}`);
          });
        }
        
        // Save results
        await this.saveResults(urls);
        
      } else {
        console.log('❌ Search input not found!');
      }
      
    } catch (error) {
      console.error('❌ Error:', error);
    } finally {
      await browser.close();
      console.log('🔒 Browser closed');
    }
  }

  async humanDelay(min, max) {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  async humanScroll(page) {
    const scrollSteps = 5 + Math.floor(Math.random() * 5); // 5-10 scroll steps
    
    for (let i = 0; i < scrollSteps; i++) {
      const scrollAmount = 300 + Math.floor(Math.random() * 400); // 300-700px
      
      await page.evaluate((amount) => {
        window.scrollBy(0, amount);
      }, scrollAmount);
      
      // Random delay between scrolls
      await this.humanDelay(800, 2000);
    }
    
    // Scroll to bottom
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    await this.humanDelay(2000, 4000);
  }

  async extractUrlsMultipleMethods(page) {
    const urls = new Set();
    
          // Method 1: Direct /p/ links
      try {
        const directUrls = await page.$$eval('a[href*="/p/"]', (els) =>
          els
            .map((el) => el.getAttribute("href"))
            .filter((href) => !!href)
            .map((href) => new URL(href, "https://www.target.com").toString())
        );
        
        directUrls.forEach(url => urls.add(url));
        console.log(`🔍 Method 1 (direct /p/): ${directUrls.length} URLs`);
        
      } catch (error) {
        console.log('⚠️ Method 1 failed:', error.message);
      }
      
      // Method 2: Product card links
      try {
        const cardUrls = await page.$$eval('[data-test*="ProductCard"] a, [data-test*="product"] a', (els) =>
          els
            .map((el) => el.getAttribute("href"))
            .filter((href) => !!href && href.includes('/p/'))
            .map((href) => new URL(href, "https://www.target.com").toString())
        );
        
        cardUrls.forEach(url => urls.add(url));
        console.log(`🔍 Method 2 (product cards): ${cardUrls.length} URLs`);
        
      } catch (error) {
        console.log('⚠️ Method 1 failed:', error.message);
      }
      
      // Method 3: Any links containing /p/
      try {
        const allLinks = await page.$$eval('a', (els) =>
          els
            .map((el) => el.getAttribute("href"))
            .filter((href) => !!href && href.includes('/p/'))
            .map((href) => new URL(href, "https://www.target.com").toString())
        );
        
        allLinks.forEach(url => urls.add(url));
        console.log(`🔍 Method 3 (all /p/ links): ${allLinks.length} URLs`);
        
      } catch (error) {
        console.log('⚠️ Method 3 failed:', error.message);
      }
    
    return Array.from(urls);
  }

  async saveResults(urls) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `stealth_results_${timestamp}`;
    
    try {
      // Save as JSON
      await fs.writeFile(`${filename}.json`, JSON.stringify({
        timestamp: new Date().toISOString(),
        totalUrls: urls.length,
        urls: urls
      }, null, 2));
      
      // Save as TXT
      await fs.writeFile(`${filename}.txt`, urls.join('\n'));
      
      console.log(`💾 Results saved: ${filename}.json and ${filename}.txt`);
    } catch (error) {
      console.error('❌ Failed to save results:', error);
    }
  }
}

// Run the stealth test
const stealthTest = new StealthTargetTest();
stealthTest.run().catch(console.error);
