import puppeteer, { Browser, Page } from 'puppeteer';
import { promises as fs } from 'fs';
import path from 'path';

// Diagnostic scraper to debug Target.com structure
class TargetDiagnostic {
  private browser: Browser | null = null;

  async runDiagnostic(searchTerm: string = 'magnesium glycinate supplement'): Promise<void> {
    console.log('🔍 TARGET.COM DIAGNOSTIC TOOL');
    console.log('================================');
    console.log(`🔍 Search term: "${searchTerm}"`);
    console.log('📸 Taking screenshots and analyzing page structure...\n');

    try {
      this.browser = await puppeteer.launch({
        headless: false, // Show browser for debugging
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--window-size=1366,768'
        ]
      });

      const page = await this.browser.newPage();
      await page.setViewport({ width: 1366, height: 768 });
      
      // Set a realistic user agent
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

      // Navigate to Target search
      const searchUrl = `https://www.target.com/s?searchTerm=${encodeURIComponent(searchTerm)}`;
      console.log(`🌐 Navigating to: ${searchUrl}`);
      
      await page.goto(searchUrl, { 
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // Wait for page to fully load
      console.log('⏳ Waiting for page to load...');
      await page.waitForTimeout(5000);

      // Take screenshot of the page
      await this.takeScreenshot(page, '01_initial_page');

      // Scroll down to trigger lazy loading
      console.log('📜 Scrolling to trigger lazy loading...');
      await this.scrollPage(page);
      await page.waitForTimeout(3000);

      // Take screenshot after scrolling
      await this.takeScreenshot(page, '02_after_scroll');

      // Analyze page structure
      await this.analyzePageStructure(page);

      // Test different selectors
      await this.testSelectors(page);

      // Check for pagination
      await this.checkPagination(page);

      console.log('\n✅ Diagnostic complete! Check the screenshots folder for visual analysis.');

    } catch (error) {
      console.error('❌ Diagnostic failed:', error);
    } finally {
      if (this.browser) {
        await this.browser.close();
        console.log('🔒 Browser closed');
      }
    }
  }

  private async takeScreenshot(page: Page, name: string): Promise<void> {
    try {
      const screenshotDir = './diagnostic_screenshots';
      await fs.mkdir(screenshotDir, { recursive: true });
      
      const filename = `${name}_${Date.now()}.png`;
      const filepath = path.join(screenshotDir, filename);
      
      await page.screenshot({ 
        path: filepath, 
        fullPage: true 
      });
      
      console.log(`📸 Screenshot saved: ${filepath}`);
    } catch (error) {
      console.error('⚠️ Screenshot failed:', error);
    }
  }

  private async scrollPage(page: Page): Promise<void> {
    // Scroll down gradually
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => {
        window.scrollBy(0, 500);
      });
      await page.waitForTimeout(1000);
    }
    
    // Scroll to bottom
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
  }

  private async analyzePageStructure(page: Page): Promise<void> {
    console.log('\n🔍 ANALYZING PAGE STRUCTURE');
    console.log('============================');

    // Get page title
    const title = await page.title();
    console.log(`📄 Page title: ${title}`);

    // Get page URL
    const url = page.url();
    console.log(`🔗 Current URL: ${url}`);

    // Check if we're on a search results page
    const isSearchPage = await page.evaluate(() => {
      return document.body.textContent?.includes('search') || 
             document.body.textContent?.includes('results') ||
             document.body.textContent?.includes('products');
    });
    console.log(`🔍 Appears to be search page: ${isSearchPage}`);

    // Count potential product elements
    const productCounts = await page.evaluate(() => {
      const selectors = [
        'a[href*="/p/"]',
        '[data-test*="product"]',
        '[data-testid*="product"]',
        '.ProductCard',
        '.product-card',
        '[class*="product"]',
        '[class*="Product"]'
      ];

      const counts: Record<string, number> = {};
      selectors.forEach(selector => {
        try {
          counts[selector] = document.querySelectorAll(selector).length;
        } catch {
          counts[selector] = 0;
        }
      });

      return counts;
    });

    console.log('\n📊 Potential product element counts:');
    Object.entries(productCounts).forEach(([selector, count]) => {
      console.log(`  ${selector}: ${count} elements`);
    });

    // Check for common Target.com patterns
    const targetPatterns = await page.evaluate(() => {
      const patterns = {
        hasProductGrid: document.querySelectorAll('[class*="grid"], [class*="Grid"]').length > 0,
        hasProductList: document.querySelectorAll('[class*="list"], [class*="List"]').length > 0,
        hasProductWrapper: document.querySelectorAll('[class*="wrapper"], [class*="Wrapper"]').length > 0,
        hasProductCard: document.querySelectorAll('[class*="card"], [class*="Card"]').length > 0,
        hasSearchResults: document.querySelectorAll('[class*="search"], [class*="Search"], [class*="result"], [class*="Result"]').length > 0
      };
      return patterns;
    });

    console.log('\n🎯 Target.com pattern analysis:');
    Object.entries(targetPatterns).forEach(([pattern, found]) => {
      console.log(`  ${pattern}: ${found ? '✅' : '❌'}`);
    });
  }

  private async testSelectors(page: Page): Promise<void> {
    console.log('\n🧪 TESTING SELECTORS');
    console.log('====================');

    // Test current selectors from the main scraper
    const currentSelectors = [
      'a[href*="/p/"]',
      '[data-test="product-title"] a',
      '.ProductCard a',
      '[data-testid="product-card"] a'
    ];

    for (const selector of currentSelectors) {
      try {
        const count = await page.$$eval(selector, (elements) => elements.length);
        console.log(`🔍 ${selector}: ${count} elements found`);
        
        if (count > 0) {
          // Get sample URLs
          const sampleUrls = await page.$$eval(selector, (elements) => {
            return (elements as HTMLAnchorElement[])
              .slice(0, 3)
              .map(el => el.href)
              .filter(href => href);
          });
          
          console.log(`  📍 Sample URLs: ${sampleUrls.join(', ')}`);
        }
      } catch (error) {
        console.log(`⚠️ ${selector}: Error - ${(error as Error).message}`);
      }
    }

    // Test additional potential selectors
    const additionalSelectors = [
      'a[href*="target.com/p/"]',
      '[data-test*="Product"] a',
      '[data-testid*="Product"] a',
      '.product-title a',
      '.product-name a',
      '[class*="product"] a',
      '[class*="Product"] a'
    ];

    console.log('\n🔍 Testing additional selectors:');
    for (const selector of additionalSelectors) {
      try {
        const count = await page.$$eval(selector, (elements) => elements.length);
        if (count > 0) {
          console.log(`✅ ${selector}: ${count} elements found`);
        }
      } catch (error) {
        // Silently skip failed selectors
      }
    }
  }

  private async checkPagination(page: Page): Promise<void> {
    console.log('\n📄 CHECKING PAGINATION');
    console.log('========================');

    const paginationSelectors = [
      '[data-test="next"]',
      '.btn-pagination-next',
      'button[aria-label="next page"]',
      'a[aria-label="Next"]',
      '[class*="next"]',
      '[class*="Next"]',
      'a[href*="page="]',
      'a[href*="offset="]'
    ];

    for (const selector of paginationSelectors) {
      try {
        const count = await page.$$eval(selector, (elements) => elements.length);
        if (count > 0) {
          console.log(`✅ Pagination selector found: ${selector} (${count} elements)`);
          
          // Check if it's clickable
          const isClickable = await page.$$eval(selector, (elements) => {
            return elements.some(el => {
              const style = window.getComputedStyle(el);
              return style.display !== 'none' && style.visibility !== 'hidden';
            });
          });
          
          console.log(`  📍 Clickable: ${isClickable ? 'Yes' : 'No'}`);
        }
      } catch (error) {
        // Silently skip failed selectors
      }
    }

    // Check for page numbers
    const pageNumbers = await page.$$eval('a[href*="page="], a[href*="offset="]', (elements) => {
      return elements.map(el => (el as HTMLAnchorElement).href);
    });

    if (pageNumbers.length > 0) {
      console.log(`\n📊 Found pagination URLs: ${pageNumbers.length}`);
      pageNumbers.slice(0, 5).forEach((url, i) => {
        console.log(`  ${i + 1}. ${url}`);
      });
    }
  }
}

// Main execution
async function main() {
  const diagnostic = new TargetDiagnostic();
  await diagnostic.runDiagnostic();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { TargetDiagnostic };


