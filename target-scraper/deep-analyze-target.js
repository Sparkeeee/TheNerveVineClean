const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path'); // Added missing import for path

// Deep analysis tool to understand Target.com's current structure
async function deepAnalyzeTarget() {
  console.log('🔍 DEEP ANALYSIS OF TARGET.COM STRUCTURE');
  console.log('========================================\n');
  
  let browser = null;
  
  try {
    browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    
    // Test multiple URLs to see what's actually there
    const testUrls = [
      'https://www.target.com/c/supplements',
      'https://www.target.com/c/health-beauty',
      'https://www.target.com/c/vitamins-supplements',
      'https://www.target.com/s?searchTerm=vitamin%20d'
    ];
    
    for (const url of testUrls) {
      console.log(`\n🌐 TESTING: ${url}`);
      console.log('='.repeat(50));
      
      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
        await page.waitForTimeout(3000);
        
        // Get page title and URL
        const title = await page.title();
        const currentUrl = page.url();
        console.log(`📄 Title: ${title}`);
        console.log(`🔗 Current URL: ${currentUrl}`);
        
        // Check if we were redirected
        if (currentUrl !== url) {
          console.log(`⚠️ REDIRECTED from ${url} to ${currentUrl}`);
        }
        
        // Analyze page content
        await analyzePageContent(page);
        
        // Take screenshot
        const screenshotName = url.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
        await takeScreenshot(page, screenshotName);
        
      } catch (error) {
        console.log(`❌ Error with ${url}: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Analysis failed:', error);
  } finally {
    if (browser) {
      await browser.close();
      console.log('\n🔒 Browser closed');
    }
  }
}

async function analyzePageContent(page) {
  try {
    // Get all links on the page
    const allLinks = await page.$$eval('a', (elements) => {
      return elements.map(el => ({
        href: el.href,
        text: el.textContent?.trim().substring(0, 50),
        className: el.className,
        id: el.id,
        'data-test': el.getAttribute('data-test'),
        'data-testid': el.getAttribute('data-testid')
      }));
    });
    
    console.log(`\n🔗 Total links found: ${allLinks.length}`);
    
    // Categorize links
    const productLinks = allLinks.filter(link => link.href.includes('/p/'));
    const categoryLinks = allLinks.filter(link => link.href.includes('/c/'));
    const searchLinks = allLinks.filter(link => link.href.includes('/s?'));
    
    console.log(`📦 Product links (/p/): ${productLinks.length}`);
    console.log(`📁 Category links (/c/): ${categoryLinks.length}`);
    console.log(`🔍 Search links (/s?): ${searchLinks.length}`);
    
    // Show sample links
    if (productLinks.length > 0) {
      console.log('\n✅ PRODUCT LINKS FOUND:');
      productLinks.slice(0, 5).forEach((link, i) => {
        console.log(`  ${i + 1}. ${link.text} -> ${link.href}`);
      });
    }
    
    if (categoryLinks.length > 0) {
      console.log('\n📁 CATEGORY LINKS FOUND:');
      categoryLinks.slice(0, 5).forEach((link, i) => {
        console.log(`  ${i + 1}. ${link.text} -> ${link.href}`);
      });
    }
    
    // Check for common patterns
    const patterns = await page.evaluate(() => {
      return {
        hasProductGrid: document.querySelectorAll('[class*="grid"], [class*="Grid"]').length,
        hasProductList: document.querySelectorAll('[class*="list"], [class*="List"]').length,
        hasProductWrapper: document.querySelectorAll('[class*="wrapper"], [class*="Wrapper"]').length,
        hasProductCard: document.querySelectorAll('[class*="card"], [class*="Card"]').length,
        hasSearchResults: document.querySelectorAll('[class*="search"], [class*="Search"], [class*="result"], [class*="Result"]').length,
        hasProductTitle: document.querySelectorAll('[class*="title"], [class*="Title"]').length,
        hasProductName: document.querySelectorAll('[class*="name"], [class*="Name"]').length,
        hasProductImage: document.querySelectorAll('[class*="image"], [class*="Image"], img').length
      };
    });
    
    console.log('\n🎯 PAGE PATTERNS:');
    Object.entries(patterns).forEach(([pattern, count]) => {
      console.log(`  ${pattern}: ${count} elements`);
    });
    
    // Check for specific Target.com patterns
    const targetPatterns = await page.evaluate(() => {
      return {
        hasDataTest: document.querySelectorAll('[data-test]').length,
        hasDataTestId: document.querySelectorAll('[data-testid]').length,
        hasAriaLabel: document.querySelectorAll('[aria-label]').length,
        hasRole: document.querySelectorAll('[role]').length
      };
    });
    
    console.log('\n🎯 TARGET.COM ATTRIBUTES:');
    Object.entries(targetPatterns).forEach(([pattern, count]) => {
      console.log(`  ${pattern}: ${count} elements`);
    });
    
    // Look for any clickable elements that might be products
    const clickableElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('button, a, [role="button"], [tabindex]');
      return Array.from(elements).map(el => ({
        tag: el.tagName,
        text: el.textContent?.trim().substring(0, 30),
        className: el.className,
        'data-test': el.getAttribute('data-test'),
        'data-testid': el.getAttribute('data-testid'),
        href: el.href || null
      })).slice(0, 20); // First 20 elements
    });
    
    console.log('\n🖱️ CLICKABLE ELEMENTS (first 20):');
    clickableElements.forEach((el, i) => {
      console.log(`  ${i + 1}. ${el.tag} "${el.text}" (${el.className}) [${el['data-test'] || 'no-test'}]`);
    });
    
  } catch (error) {
    console.error('❌ Error analyzing page content:', error.message);
  }
}

async function takeScreenshot(page, name) {
  try {
    const screenshotDir = './deep_analysis_screenshots';
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

// Run the analysis
deepAnalyzeTarget().catch(console.error);


