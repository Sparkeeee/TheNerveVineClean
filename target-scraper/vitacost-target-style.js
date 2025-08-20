const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

// Configuration for Vitacost
const config = {
  vitacost: {
    selectors: {
      productLinks: "a[href*='/product/'], a[href*='/p/']",
      nextPage: "a[aria-label*='Next'], a[rel='next'], .pagination a[href*='page']"
    },
    pagination: {
      maxPages: 5,
      minDelay: 2000,
      maxDelay: 5000
    }
  }
};

// Utility functions
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

class VitacostTargetStyleExtractor {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
    this.collectedUrls = new Set();
  }

  async initialize() {
    console.log('🚀 Initializing Vitacost Target-Style Extractor...');
    
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

  async extractVitacostUrls(searchTerm) {
    const { selectors, pagination } = config.vitacost;
    const urls = new Set();

    console.log(`🔍 Starting extraction for: "${searchTerm}"`);
    console.log(`📊 Max pages: ${pagination.maxPages}`);

    let currentPage = 1;
    let hasNext = true;

    while (hasNext && currentPage <= pagination.maxPages) {
      console.log(`\n🔍 Page ${currentPage}/${pagination.maxPages}`);

      try {
        // Build search URL for Vitacost
        const searchUrl = `https://www.vitacost.com/search?search=${encodeURIComponent(searchTerm)}${currentPage > 1 ? `&page=${currentPage}` : ''}`;
        console.log(`🌐 Navigating to: ${searchUrl}`);
        
        await this.page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

        // Human-like actions
        console.log('📜 Performing human-like actions...');
        await humanScroll(this.page);
        await moveMouseRandomly(this.page);
        
        // Wait for content to load
        await this.page.waitForTimeout(randomDelay(1000, 2000));

        // Check for blocking/challenges
        const isBlocked = await this.checkForBlocking();
        if (isBlocked) {
          console.log('⚠️ Blocking detected - waiting for manual intervention...');
          await this.waitForManualIntervention();
        }

        // Extract product URLs from current page
        const pageUrls = await this.extractPageUrls(selectors.productLinks);
        console.log(`📦 Found ${pageUrls.length} product URLs on page ${currentPage}`);
        
        // Filter for Kava-related URLs
        const kavaUrls = pageUrls.filter(url => url.toLowerCase().includes('kava'));
        console.log(`🔍 Filtered to ${kavaUrls.length} Kava-related URLs`);
        
        // Add to collection
        kavaUrls.forEach(url => {
          if (!this.collectedUrls.has(url)) {
            this.collectedUrls.add(url);
          }
        });

        console.log(`📊 Total unique Kava URLs collected: ${this.collectedUrls.size}`);

        // Check for next page
        hasNext = await this.checkForNextPage(selectors.nextPage);
        
        if (hasNext && currentPage < pagination.maxPages) {
          console.log('⏱️ Waiting before next page...');
          await this.page.waitForTimeout(randomDelay(pagination.minDelay, pagination.maxDelay));
        }

        currentPage++;

      } catch (error) {
        console.error(`❌ Error on page ${currentPage}:`, error.message);
        break;
      }
    }

    return Array.from(this.collectedUrls);
  }

  async extractPageUrls(selector) {
    try {
      const urls = await this.page.evaluate((sel) => {
        const links = [];
        const elements = document.querySelectorAll(sel);
        
        elements.forEach(link => {
          const href = link.getAttribute('href');
          if (href && !href.includes('#') && !href.includes('javascript:')) {
            let fullUrl = href;
            if (!href.startsWith('http')) {
              fullUrl = href.startsWith('/') ? 
                `https://www.vitacost.com${href}` : 
                `https://www.vitacost.com/${href}`;
            }
            // Only keep actual product URLs
            if (fullUrl.includes('/product/') || fullUrl.includes('/p/')) {
              links.push(fullUrl);
            }
          }
        });
        
        return [...new Set(links)];
      }, selector);

      return urls;
    } catch (error) {
      console.error('❌ Error extracting URLs:', error.message);
      return [];
    }
  }

  async checkForBlocking() {
    try {
      const title = await this.page.title();
      const content = await this.page.content();
      
      const blockingIndicators = [
        title.toLowerCase().includes('security'),
        title.toLowerCase().includes('checking'),
        title.toLowerCase().includes('verification'),
        title.toLowerCase().includes('challenge'),
        content.toLowerCase().includes('checking your browser'),
        content.toLowerCase().includes('security check'),
        content.toLowerCase().includes('please wait'),
        content.toLowerCase().includes('verify you are human')
      ];
      
      return blockingIndicators.some(indicator => indicator === true);
    } catch (error) {
      return false;
    }
  }

  async waitForManualIntervention() {
    console.log('🤖 Please solve any challenges in the browser window...');
    console.log('⏸️ Press Enter in the terminal when ready to continue...');
    
    // Wait for user input
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    await new Promise(resolve => {
      rl.question('', () => {
        rl.close();
        resolve();
      });
    });
    
    console.log('✅ Continuing with extraction...');
  }

  async checkForNextPage(selector) {
    try {
      const hasNext = await this.page.evaluate((sel) => {
        const nextElements = document.querySelectorAll(sel);
        return nextElements.length > 0;
      }, selector);
      
      return hasNext;
    } catch (error) {
      return false;
    }
  }

  async saveResults(urls, searchTerm) {
    if (urls.length === 0) {
      console.log('⚠️ No URLs to save');
      return;
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `vitacost_${searchTerm.replace(/\s+/g, '_')}_${timestamp}`;
    
    try {
      // Save as JSON
      const jsonData = {
        searchTerm,
        totalUrls: urls.length,
        timestamp: new Date().toISOString(),
        urls
      };
      
      await fs.writeFile(`${filename}.json`, JSON.stringify(jsonData, null, 2));
      console.log(`💾 Saved ${urls.length} URLs to ${filename}.json`);
      
      // Save as text
      await fs.writeFile(`${filename}.txt`, urls.join('\n'));
      console.log(`💾 Saved URLs to ${filename}.txt`);
      
    } catch (error) {
      console.error('❌ Error saving results:', error.message);
    }
  }

  async close() {
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
    console.log('🔒 Browser closed');
  }
}

// Main execution
async function main() {
  const extractor = new VitacostTargetStyleExtractor();
  
  try {
    await extractor.initialize();
    
    // Search for Kava products
    const searchTerm = 'kava';
    const urls = await extractor.extractVitacostUrls(searchTerm);
    
    console.log(`\n🎉 Extraction complete!`);
    console.log(`📊 Total Kava URLs found: ${urls.length}`);
    
    // Save results
    await extractor.saveResults(urls, searchTerm);
    
    // Show sample URLs
    if (urls.length > 0) {
      console.log('\n📋 Sample URLs found:');
      urls.slice(0, 5).forEach((url, index) => {
        console.log(`   ${index + 1}. ${url}`);
      });
      if (urls.length > 5) {
        console.log(`   ... and ${urls.length - 5} more`);
      }
    }
    
  } catch (error) {
    console.error('💥 Extraction failed:', error.message);
  } finally {
    await extractor.close();
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = VitacostTargetStyleExtractor;


