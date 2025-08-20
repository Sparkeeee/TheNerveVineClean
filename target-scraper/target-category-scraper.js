const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Working Target scraper that uses category browsing
class TargetCategoryScraper {
  constructor() {
    this.allUrls = new Set();
    this.pageCount = 0;
  }

  async scrapeSupplementsCategory(maxPages = 5) {
    console.log('🎯 TARGET SUPPLEMENTS CATEGORY SCRAPER');
    console.log('=====================================\n');
    
    let browser = null;
    
    try {
      browser = await puppeteer.launch({
        headless: false, // Show browser for debugging
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--window-size=1366,768'
        ]
      });

      const page = await browser.newPage();
      await page.setViewport({ width: 1366, height: 768 });
      
      // Set realistic user agent
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

      // Start with supplements category
      const categoryUrl = 'https://www.target.com/c/supplements';
      console.log(`🌐 Navigating to supplements category: ${categoryUrl}`);
      
      await page.goto(categoryUrl, { 
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // Wait for page to load
      console.log('⏳ Waiting for page to load...');
      await page.waitForTimeout(3000);

      // Take screenshot
      await this.takeScreenshot(page, '01_supplements_category');

      // Extract products from first page
      await this.extractProductsFromPage(page);
      
      // Try to navigate through pages
      for (let currentPage = 1; currentPage < maxPages; currentPage++) {
        console.log(`\n📄 Attempting page ${currentPage + 1}...`);
        
        // Try to find and click next page button
        const hasNextPage = await this.tryNextPage(page);
        
        if (!hasNextPage) {
          console.log('🚪 No more pages available, stopping.');
          break;
        }
        
        // Wait for page to load
        await page.waitForTimeout(3000);
        
        // Extract products from this page
        await this.extractProductsFromPage(page);
        
        // Random delay between pages (2-5 seconds)
        const delay = 2000 + Math.random() * 3000;
        console.log(`⏱️ Waiting ${Math.round(delay/1000)}s before next page...`);
        await page.waitForTimeout(delay);
      }

      // Final results
      const urlsArray = Array.from(this.allUrls);
      console.log(`\n🎉 SCRAPING COMPLETE!`);
      console.log(`📊 Total unique product URLs found: ${urlsArray.length}`);
      console.log(`📄 Pages processed: ${this.pageCount}`);
      
      // Save results
      await this.saveResults(urlsArray);
      
      return urlsArray;

    } catch (error) {
      console.error('❌ Scraping failed:', error);
      throw error;
    } finally {
      if (browser) {
        await browser.close();
        console.log('🔒 Browser closed');
      }
    }
  }

  async extractProductsFromPage(page) {
    console.log(`🔍 Extracting products from page ${this.pageCount + 1}...`);
    
    try {
      // Try multiple selector strategies
      const selectors = [
        'a[href*="/p/"]',                    // Direct product links
        '[data-test*="product"] a',          // Product test attributes
        '[data-testid*="product"] a',        // Product test IDs
        '.ProductCard a',                     // Product card links
        '[class*="product"] a',              // Class-based product links
        '[class*="Product"] a',              // Capitalized class names
        'a[href*="target.com/p/"]',          // Full URL product links
        '[data-test="product-title"] a',     // Product title links
        '[data-testid="product-card"] a'     // Product card test IDs
      ];

      let foundUrls = 0;
      
      for (const selector of selectors) {
        try {
          const urls = await page.$$eval(selector, (elements) => {
            return elements
              .map(el => el.href)
              .filter(href => href && href.includes('/p/'))
              .map(href => href.split('#')[0]) // Remove fragments
              .map(href => href.split('?')[0]); // Remove query params
          });
          
          if (urls.length > 0) {
            console.log(`✅ Selector "${selector}" found ${urls.length} URLs`);
            
            // Add new URLs to our set
            urls.forEach(url => this.allUrls.add(url));
            foundUrls += urls.length;
            
            // Show sample URLs
            if (urls.length > 0) {
              console.log(`📍 Sample: ${urls[0]}`);
            }
          }
        } catch (error) {
          // Silently skip failed selectors
        }
      }
      
      if (foundUrls > 0) {
        console.log(`🎯 Page ${this.pageCount + 1}: Found ${foundUrls} new URLs (${this.allUrls.size} total unique)`);
        this.pageCount++;
      } else {
        console.log(`⚠️ Page ${this.pageCount + 1}: No product URLs found`);
      }
      
    } catch (error) {
      console.error(`❌ Error extracting from page:`, error.message);
    }
  }

  async tryNextPage(page) {
    try {
      // Try different next page selectors
      const nextPageSelectors = [
        '[data-test="next"]',
        '.btn-pagination-next',
        'button[aria-label="next page"]',
        'a[aria-label="Next"]',
        '[class*="next"]',
        '[class*="Next"]',
        'a[href*="page="]',
        'a[href*="offset="]'
      ];
      
      for (const selector of nextPageSelectors) {
        try {
          const nextButton = await page.$(selector);
          if (nextButton) {
            // Check if it's clickable
            const isVisible = await nextButton.isVisible();
            if (isVisible) {
              console.log(`✅ Found next page button: ${selector}`);
              await nextButton.click();
              return true;
            }
          }
        } catch (error) {
          // Try next selector
        }
      }
      
      return false;
    } catch (error) {
      console.log('⚠️ Error finding next page:', error.message);
      return false;
    }
  }

  async takeScreenshot(page, name) {
    try {
      const screenshotDir = './category_screenshots';
      await fs.mkdir(screenshotDir, { recursive: true });
      
      const filename = `${name}_${Date.now()}.png`;
      const filepath = path.join(screenshotDir, filename);
      
      await page.screenshot({ 
        path: filepath, 
        fullPage: true 
      });
      
      console.log(`📸 Screenshot saved: ${filepath}`);
    } catch (error) {
      console.error('⚠️ Screenshot failed:', error.message);
    }
  }

  async saveResults(urls) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `target_supplements_${timestamp}`;
      
      // Save as JSON
      const jsonData = {
        category: 'supplements',
        totalUrls: urls.length,
        timestamp: new Date().toISOString(),
        urls: urls
      };
      
      await fs.writeFile(`${filename}.json`, JSON.stringify(jsonData, null, 2));
      console.log(`💾 Results saved: ${filename}.json`);
      
      // Save as TXT
      await fs.writeFile(`${filename}.txt`, urls.join('\n'));
      console.log(`💾 Results saved: ${filename}.txt`);
      
    } catch (error) {
      console.error('❌ Failed to save results:', error);
    }
  }
}

// Run the scraper
async function main() {
  const scraper = new TargetCategoryScraper();
  await scraper.scrapeSupplementsCategory(3); // Try 3 pages
}

main().catch(console.error);


