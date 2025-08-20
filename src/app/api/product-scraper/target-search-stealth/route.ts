import { NextRequest, NextResponse } from 'next/server';
import { chromium } from 'playwright';

// Anti-detection utilities
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0'
];

const randomDelay = (min: number, max: number) => 
  new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));

const getRandomUserAgent = () => 
  userAgents[Math.floor(Math.random() * userAgents.length)];

const realisticHeaders = () => ({
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'DNT': '1',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Cache-Control': 'max-age=0',
  'Referer': 'https://www.google.com/'
});

export async function POST(request: NextRequest) {
  console.log('🚀 TARGET SEARCH STEALTH: Starting stealth search');
  
  let searchTerm: string = 'unknown';
  let browser;
  let context;
  
  try {
    const body = await request.json();
    const { searchTerm: term, maxResults = 5 } = body;
    searchTerm = term;
    
    if (!searchTerm) {
      return NextResponse.json({ error: 'Search term is required' }, { status: 400 });
    }

    console.log(`🔍 TARGET SEARCH STEALTH: Searching for "${searchTerm}"`);

    // Random initial delay to avoid pattern detection
    await randomDelay(2000, 5000);
    console.log('⏳ TARGET SEARCH STEALTH: Initial delay completed');

    // Launch browser with stealth settings
    browser = await chromium.launch({
      headless: true,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--lang=en-US',
        '--accept-lang=en-US',
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    });

    // Create context with random user agent and realistic settings
    context = await browser.newContext({
      userAgent: getRandomUserAgent(),
      viewport: { width: 1920, height: 1080 },
      locale: 'en-US',
      timezoneId: 'America/New_York',
      extraHTTPHeaders: realisticHeaders()
    });

    console.log('🌐 TARGET SEARCH STEALTH: Browser context created');

    const page = await context.newPage();
    
    // Advanced anti-detection measures
    await page.addInitScript(() => {
      // Hide automation indicators
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
      Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
      Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
      
      // Simulate realistic mouse movements
      const originalQuerySelector = document.querySelector;
      document.querySelector = function(...args: any[]) {
        const result = originalQuerySelector.apply(this, args as [string]);
        if (result) {
          // Simulate human-like interaction
          setTimeout(() => {
            if (result.dispatchEvent) {
              result.dispatchEvent(new Event('mouseover', { bubbles: true }));
            }
          }, Math.random() * 100);
        }
        return result;
      };
    });

    // Build search URL
    const searchUrl = `https://www.target.com/s?searchTerm=${encodeURIComponent(searchTerm)}`;
    console.log(`🔍 TARGET SEARCH STEALTH: Navigating to search page`);

    // Navigate with realistic timing
    await page.goto(searchUrl, { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });

    // Random delay after page load
    await randomDelay(3000, 7000);
    console.log('⏳ TARGET SEARCH STEALTH: Post-load delay completed');

    // Wait for content with multiple fallback strategies
    let productsFound = false;
    const selectors = [
      '[data-test="product-grid"]',
      'a[href*="/p/"]',
      '[data-test="@web/ProductCard"]',
      '.product-card'
    ];

    for (const selector of selectors) {
      try {
        await page.waitForSelector(selector, { timeout: 8000 });
        console.log(`✅ TARGET SEARCH STEALTH: Found products with selector: ${selector}`);
        productsFound = true;
        break;
      } catch (error) {
        console.log(`⚠️ TARGET SEARCH STEALTH: Selector ${selector} failed, trying next...`);
        continue;
      }
    }

    if (!productsFound) {
      throw new Error('No products found on page - possible IP blocking');
    }

    // Additional realistic delay
    await randomDelay(2000, 5000);

    // Extract product URLs with stealth approach and duplicate detection
    const productUrls = await page.evaluate(() => {
      const links = new Set<string>();
      const productIds = new Set<string>(); // Track unique product IDs
      
      // Multiple extraction strategies
      const strategies = [
        () => document.querySelectorAll('[data-test="@web/ProductCard"] a[href*="/p/"]'),
        () => document.querySelectorAll('a[href*="/p/"]'),
        () => document.querySelectorAll('[data-test="product-grid"] a[href*="/p/"]'),
        () => document.querySelectorAll('.product-card a[href*="/p/"]')
      ];

      strategies.forEach(strategy => {
        try {
          const elements = strategy();
          elements.forEach((link: any) => {
            if (link.href && 
                link.href.includes('/p/') && 
                !link.href.includes('/s/') && 
                !link.href.includes('/search') &&
                !link.href.includes('javascript:')) {
              
              // Extract product ID from URL to detect duplicates
              const urlMatch = link.href.match(/\/p\/([^\/\?#]+)/);
              if (urlMatch) {
                const productId = urlMatch[1];
                
                // Only add if we haven't seen this product ID before
                if (!productIds.has(productId)) {
                  productIds.add(productId);
                  links.add(link.href);
                }
              }
            }
          });
        } catch (e) {
          // Continue with next strategy
        }
      });

      return Array.from(links);
    });

    console.log(`🔍 TARGET SEARCH STEALTH: Found ${productUrls.length} unique product URLs`);

    // Filter and limit results
    const filteredUrls = productUrls
      .filter(url => url.includes('/p/'))
      .slice(0, maxResults);
    
    console.log(`🎯 TARGET SEARCH STEALTH: Filtered to ${filteredUrls.length} results (max: ${maxResults})`);

    // Format results
    const results = filteredUrls.map((url, index) => ({
      title: `Product ${index + 1}`,
      url: url,
      price: undefined,
      imageUrl: undefined,
      rating: undefined,
      reviewCount: undefined
    }));

    console.log(`🎯 TARGET SEARCH STEALTH: Successfully extracted ${results.length} products`);

    return NextResponse.json({
      success: true,
      searchTerm,
      results,
      totalFound: results.length,
      method: 'Stealth Search',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('💥 TARGET SEARCH STEALTH ERROR:', error);
    
    // Check if it's an IP blocking error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isBlocked = errorMessage.includes('403') || 
                     errorMessage.includes('Forbidden') || 
                     errorMessage.includes('blocked') ||
                     errorMessage.includes('IP');

    return NextResponse.json({ 
      success: false, 
      error: errorMessage,
      searchTerm: searchTerm || 'unknown',
      isBlocked,
      recommendation: isBlocked ? 'Try VPN IP rotation or wait before retrying' : 'Check search term and try again'
    }, { status: 500 });
  } finally {
    if (context) {
      await context.close();
    }
    if (browser) {
      await browser.close();
    }
    console.log('🧹 TARGET SEARCH STEALTH: Browser closed');
  }
}
