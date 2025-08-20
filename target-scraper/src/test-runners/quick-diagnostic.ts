import { chromium } from "playwright";

async function runQuickDiagnostic() {
  console.log("🔍 Quick Target Diagnostic");
  
  const browser = await chromium.launch({
    headless: false, // Keep visible
    slowMo: 100,
    args: [
      '--no-sandbox',
      '--disable-blink-features=AutomationControlled'
    ]
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();
  
  try {
    const searchTerm = "magnesium glycinate supplement";
    const url = `https://www.target.com/s?searchTerm=${encodeURIComponent(searchTerm)}`;
    
    console.log(`➡️ Navigating to: ${url}`);
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    
    console.log("✅ Page loaded");
    await page.waitForTimeout(5000); // Wait for JS to load
    
    // Check page basics
    const title = await page.title();
    const currentUrl = page.url();
    console.log(`📄 Page title: ${title}`);
    console.log(`🌐 Current URL: ${currentUrl}`);
    
    // Check if we're blocked
    const pageText = await page.textContent('body') || '';
    if (pageText.toLowerCase().includes('blocked') || pageText.toLowerCase().includes('captcha')) {
      console.log("⚠️ Possible blocking detected");
    }
    
    // Count elements
    const counts = await page.evaluate(() => {
      return {
        allLinks: document.querySelectorAll('a').length,
        productLinksV1: document.querySelectorAll('a[href*="/p/"]').length,
        productLinksV2: document.querySelectorAll('a[data-test="product-title"]').length,
        productCards: document.querySelectorAll('[data-testid="product-card"]').length,
        searchResults: document.querySelectorAll('[data-test*="search"]').length,
        anyProductMention: document.querySelectorAll('a[href*="product"]').length
      };
    });
    
    console.log("🔍 Element counts:");
    Object.entries(counts).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });
    
    // Get sample links
    const sampleLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a[href]'))
        .slice(0, 15)
        .map(a => (a as HTMLAnchorElement).href)
        .filter(href => href && !href.startsWith('javascript:'));
    });
    
    console.log("🔗 Sample links:");
    sampleLinks.forEach((link, i) => {
      console.log(`   ${i + 1}. ${link}`);
    });
    
    // Try to scroll and see if more content loads
    console.log("📜 Scrolling to load more content...");
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(3000);
    
    // Check counts again after scroll
    const countsAfterScroll = await page.evaluate(() => {
      return {
        productLinksV1: document.querySelectorAll('a[href*="/p/"]').length,
        productLinksV2: document.querySelectorAll('a[data-test="product-title"]').length,
        productCards: document.querySelectorAll('[data-testid="product-card"]').length
      };
    });
    
    console.log("🔍 After scroll:");
    Object.entries(countsAfterScroll).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });
    
    // Try to extract URLs with the most permissive selector
    const foundUrls = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href]'))
        .map(a => (a as HTMLAnchorElement).href)
        .filter(href => href.includes('/p/') || href.includes('product'))
        .filter(href => !href.includes('javascript:'));
      
      return [...new Set(links)]; // Remove duplicates
    });
    
    console.log(`\n🎯 FOUND ${foundUrls.length} potential product URLs:`);
    foundUrls.slice(0, 10).forEach((url, i) => {
      console.log(`   ${i + 1}. ${url}`);
    });
    
    if (foundUrls.length === 0) {
      console.log("\n❌ No product URLs found. Possible issues:");
      console.log("   1. Target is blocking automated browsers");
      console.log("   2. Page structure has changed");
      console.log("   3. JavaScript didn't load properly");
      console.log("   4. Need to handle captcha/verification");
    }
    
    // Take screenshot for debugging
    await page.screenshot({ 
      path: `debug-${Date.now()}.png`,
      fullPage: true 
    });
    console.log("📸 Debug screenshot saved");
    
  } catch (error) {
    console.error("❌ Error:", error);
  }

  // Keep open for inspection
  console.log("\n⏸️ Browser staying open for 30 seconds for manual inspection...");
  await page.waitForTimeout(30000);
  
  await browser.close();
  console.log("🎬 Diagnostic complete!");
}

runQuickDiagnostic().catch(console.error);
