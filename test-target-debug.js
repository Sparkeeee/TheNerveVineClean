const { chromium } = require('playwright');

async function debugTargetSearch() {
  let browser;
  
  try {
    console.log('🧪 Debugging Target Search...');
    
    // Launch browser with more stealth options
    browser = await chromium.launch({ 
      headless: false, // Set to false to see what's happening
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });
    
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 },
      locale: 'en-US',
      timezoneId: 'America/New_York',
      extraHTTPHeaders: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      }
    });
    
    const page = await context.newPage();
    
    // Hide automation indicators
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      });
    });
    
    // Try a more common search term first
    const searchUrl = 'https://www.target.com/s?searchTerm=vitamin';
    console.log(`🔍 Navigating to: ${searchUrl}`);
    
    await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Wait a bit for content to load
    await page.waitForTimeout(5000);
    
    // Take a screenshot to see what we're looking at
    await page.screenshot({ path: 'target-search-vitamin-debug.png', fullPage: true });
    console.log('📸 Screenshot saved as target-search-vitamin-debug.png');
    
    // Check what's actually on the page
    const pageTitle = await page.title();
    console.log(`📄 Page title: ${pageTitle}`);
    
    // Look for any links
    const allLinks = await page.$$eval('a', (elements) => 
      elements.map(el => ({
        href: el.getAttribute('href'),
        text: el.textContent?.trim().substring(0, 100),
        className: el.className,
        id: el.id
      }))
    );
    
    console.log(`🔗 Found ${allLinks.length} total links`);
    
    // Show first 10 links
    console.log('🔗 First 10 links:');
    allLinks.slice(0, 10).forEach((link, i) => {
      console.log(`  ${i + 1}. ${link.text} -> ${link.href}`);
    });
    
    // Look specifically for product links
    const productLinks = allLinks.filter(link => 
      link.href && link.href.includes('/p/')
    );
    
    console.log(`🎯 Found ${productLinks.length} product links (/p/):`);
    productLinks.forEach((link, i) => {
      console.log(`  ${i + 1}. ${link.text} -> ${link.href}`);
    });
    
    // Check for product cards
    const productCards = await page.$$('[data-test="@web/ProductCard"], .product-card, [data-focusid*="_product_card"]');
    console.log(`🃏 Found ${productCards.length} product cards`);
    
    // Get page HTML for manual inspection
    const pageHtml = await page.content();
    console.log(`📄 Page HTML length: ${pageHtml.length}`);
    
    // Save HTML for inspection
    const fs = require('fs');
    fs.writeFileSync('target-search-vitamin-debug.html', pageHtml);
    console.log('💾 HTML saved as target-search-vitamin-debug.html');
    
    // Look for specific patterns
    if (pageHtml.includes('vitamin')) {
      console.log('✅ Found "vitamin" in page HTML');
    }
    
    if (pageHtml.includes('product')) {
      console.log('✅ Found "product" in page HTML');
    }
    
    if (pageHtml.includes('supplement')) {
      console.log('✅ Found "supplement" in page HTML');
    }
    
    // Check for error messages
    if (pageHtml.includes('There was an issue getting your results')) {
      console.log('❌ Found error message: "There was an issue getting your results"');
    }
    
    if (pageHtml.includes('Oops! Something went wrong')) {
      console.log('❌ Found error message: "Oops! Something went wrong"');
    }
    
    // Wait for user to see the browser
    console.log('⏳ Browser will stay open for 30 seconds...');
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    if (browser) {
      console.log('🔒 Closing browser...');
      await browser.close();
    }
  }
}

debugTargetSearch();
