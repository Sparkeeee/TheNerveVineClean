import fs from "fs";
import path from "path";
import { Page } from "playwright";

// Load config
const configPath = path.join(process.cwd(), "config", "target.json");
const targetConfig = JSON.parse(fs.readFileSync(configPath, "utf-8")).target;

export async function extractTargetUrls(page: Page, herb: string, type: string): Promise<string[]> {
  const { pagination, debug } = targetConfig;
  const urls: Set<string> = new Set();
  
  console.log(`🔍 Starting diagnostic extraction for: ${herb}`);
  
  try {
    const pageUrl = `https://www.target.com/s?searchTerm=${encodeURIComponent(herb)}`;
    console.log(`➡️ Navigating to: ${pageUrl}`);
    
    // Navigate with more lenient settings
    await page.goto(pageUrl, { 
      waitUntil: "domcontentloaded",
      timeout: 60000 
    });
    
    console.log("✅ Page loaded, starting diagnostics...");
    
    // Wait a bit for initial JS
    await page.waitForTimeout(3000);
    
    // Diagnostic: Check what we can actually see
    await runDiagnostics(page);
    
    // Try scrolling to trigger lazy loading
    console.log("📜 Scrolling to trigger lazy loading...");
    await enhancedScroll(page);
    
    // Wait for content to load after scroll
    await page.waitForTimeout(3000);
    
    // Run diagnostics again after scroll
    console.log("\n🔍 Post-scroll diagnostics:");
    await runDiagnostics(page);
    
    // Try multiple extraction strategies
    const extractedUrls = await tryAllExtractionMethods(page);
    extractedUrls.forEach(url => urls.add(url));
    
    console.log(`\n🎯 Final extraction result: ${urls.size} URLs found`);
    if (urls.size > 0) {
      console.log("📋 First few URLs found:");
      [...urls].slice(0, 5).forEach((url, i) => console.log(`   ${i + 1}. ${url}`));
    }
    
  } catch (error) {
    console.error("❌ Error during extraction:", error);
    
    // Take a screenshot for debugging
    try {
      await page.screenshot({ 
        path: `debug-screenshot-${Date.now()}.png`,
        fullPage: true 
      });
      console.log("📸 Debug screenshot saved");
    } catch (screenshotError) {
      console.log("⚠️ Could not save screenshot");
    }
  }
  
  return [...urls];
}

async function runDiagnostics(page: Page) {
  try {
    // Check page title
    const title = await page.title();
    console.log(`📄 Page title: ${title}`);
    
    // Check if we're blocked or redirected
    const currentUrl = page.url();
    console.log(`🌐 Current URL: ${currentUrl}`);
    
    // Check for common blocking indicators
    const blockingIndicators = [
      'blocked', 'captcha', 'robot', 'bot', 'access denied', 
      'forbidden', 'security', 'protection'
    ];
    
    const pageText = await page.textContent('body') || '';
    const lowerPageText = pageText.toLowerCase();
    
    for (const indicator of blockingIndicators) {
      if (lowerPageText.includes(indicator)) {
        console.log(`⚠️ Potential blocking detected: "${indicator}" found in page text`);
      }
    }
    
    // Count various elements
    const diagnostics = await page.evaluate(() => {
      return {
        totalLinks: document.querySelectorAll('a').length,
        productLinksV1: document.querySelectorAll('a[href*="/p/"]').length,
        productLinksV2: document.querySelectorAll('a[data-test="product-title"]').length,
        productCards: document.querySelectorAll('div[data-testid="product-card"]').length,
        productCardsAlt: document.querySelectorAll('[data-test*="product"]').length,
        allProductLinks: document.querySelectorAll('a[href*="product"]').length,
        searchResults: document.querySelectorAll('[data-test="search-result"]').length,
        mainContent: document.querySelector('main') ? 'Found' : 'Missing',
        bodyClasses: document.body.className,
        hasReactRoot: document.getElementById('__next') ? 'Yes' : 'No'
      };
    });
    
    console.log("🔍 Element counts:");
    Object.entries(diagnostics).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });
    
    // Check for specific Target elements
    const targetSpecificElements = await page.evaluate(() => {
      const selectors = [
        '[data-test="@web/site-top-of-funnel/ProductCardWrapper"]',
        '[data-test="product-title"]',
        '.ProductCard',
        '[data-testid="product-card"]',
        '.h-display-flex.h-flex-wrap',
        '[role="main"] [data-test]'
      ];
      
      return selectors.map(selector => ({
        selector,
        count: document.querySelectorAll(selector).length,
        exists: document.querySelector(selector) ? 'Yes' : 'No'
      }));
    });
    
    console.log("🎯 Target-specific elements:");
    targetSpecificElements.forEach(({ selector, count, exists }) => {
      console.log(`   ${selector}: ${count} elements (${exists})`);
    });
    
    // Sample some href attributes
    const sampleLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href]'))
        .slice(0, 10)
        .map(a => (a as HTMLAnchorElement).href)
        .filter(href => href && !href.startsWith('javascript:'));
      return links;
    });
    
    console.log("🔗 Sample links found:");
    sampleLinks.forEach((link, i) => {
      console.log(`   ${i + 1}. ${link}`);
    });
    
  } catch (error) {
    console.error("❌ Diagnostic error:", error);
  }
}

async function enhancedScroll(page: Page) {
  await page.evaluate(async () => {
    // Scroll down gradually
    const scrollStep = 300;
    const scrollDelay = 500;
    let currentPosition = 0;
    const maxHeight = document.body.scrollHeight;
    
    while (currentPosition < maxHeight) {
      window.scrollBy(0, scrollStep);
      currentPosition += scrollStep;
      
      // Wait for potential lazy loading
      await new Promise(resolve => setTimeout(resolve, scrollDelay));
      
      // Check if new content loaded
      const newHeight = document.body.scrollHeight;
      if (newHeight > maxHeight) {
        break; // New content appeared, continue scrolling
      }
    }
    
    // Scroll back to top
    window.scrollTo(0, 0);
  });
}

async function tryAllExtractionMethods(page: Page): Promise<string[]> {
  const methods = [
    {
      name: "Standard /p/ links",
      extractor: async () => await page.$$eval('a[href*="/p/"]', els =>
        els.map(el => el.getAttribute("href")).filter(Boolean)
      )
    },
    {
      name: "Product title links", 
      extractor: async () => await page.$$eval('a[data-test="product-title"]', els =>
        els.map(el => el.getAttribute("href")).filter(Boolean)
      )
    },
    {
      name: "Product card links",
      extractor: async () => await page.$$eval('div[data-testid="product-card"] a', els =>
        els.map(el => el.getAttribute("href")).filter(Boolean)
      )
    },
    {
      name: "Generic product links",
      extractor: async () => await page.$$eval('a[href*="product"]', els =>
        els.map(el => el.getAttribute("href")).filter(Boolean)
      )
    },
    {
      name: "All links (filtered)",
      extractor: async () => await page.$$eval('a[href]', els =>
        els
          .map(el => el.getAttribute("href"))
          .filter(Boolean)
          .filter(href => href.includes('/p/') || href.includes('product'))
      )
    }
  ];
  
  const allUrls: string[] = [];
  
  for (const method of methods) {
    try {
      console.log(`🔧 Trying method: ${method.name}`);
      const urls = await method.extractor();
      console.log(`   Found ${urls.length} URLs`);
      
      if (urls.length > 0) {
        console.log(`   Sample: ${urls[0]}`);
        // Convert relative URLs to absolute
        const absoluteUrls = urls.map(url => {
          if (url.startsWith('/')) {
            return `https://www.target.com${url}`;
          }
          return url;
        });
        allUrls.push(...absoluteUrls);
      }
    } catch (error) {
      console.log(`   ❌ Method failed: ${error}`);
    }
  }
  
  // Remove duplicates
  return [...new Set(allUrls)];
}
