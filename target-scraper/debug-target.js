const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Simple diagnostic tool to debug Target.com
async function debugTarget() {
  console.log('🔍 TARGET.COM DEBUG TOOL');
  console.log('==========================');
  console.log('🔍 Search term: "magnesium glycinate supplement"');
  console.log('📸 Taking screenshots and analyzing page structure...\n');

  let browser = null;
  
  try {
    // Launch browser
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

    // Navigate to Target search
    const searchUrl = 'https://www.target.com/s?searchTerm=magnesium%20glycinate%20supplement';
    console.log(`🌐 Navigating to: ${searchUrl}`);
    
    await page.goto(searchUrl, { 
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Wait for page to load
    console.log('⏳ Waiting for page to load...');
    await page.waitForTimeout(5000);

    // Take screenshot
    await takeScreenshot(page, '01_initial_page');

    // Scroll down
    console.log('📜 Scrolling to trigger lazy loading...');
    await scrollPage(page);
    await page.waitForTimeout(3000);

    // Take screenshot after scrolling
    await takeScreenshot(page, '02_after_scroll');

    // Analyze page structure
    await analyzePageStructure(page);

    // Test selectors
    await testSelectors(page);

    console.log('\n✅ Debug complete! Check the debug_screenshots folder.');

  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    if (browser) {
      await browser.close();
      console.log('🔒 Browser closed');
    }
  }
}

async function takeScreenshot(page, name) {
  try {
    const screenshotDir = './debug_screenshots';
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

async function scrollPage(page) {
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

async function analyzePageStructure(page) {
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
    return document.body.textContent.includes('search') || 
           document.body.textContent.includes('results') ||
           document.body.textContent.includes('products');
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

    const counts = {};
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
}

async function testSelectors(page) {
  console.log('\n🧪 TESTING SELECTORS');
  console.log('====================');

  // Test current selectors
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
          return elements
            .slice(0, 3)
            .map(el => el.href)
            .filter(href => href);
        });
        
        console.log(`  📍 Sample URLs: ${sampleUrls.join(', ')}`);
      }
    } catch (error) {
      console.log(`⚠️ ${selector}: Error - ${error.message}`);
    }
  }

  // Test additional selectors
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

// Run the debug
debugTarget().catch(console.error);


