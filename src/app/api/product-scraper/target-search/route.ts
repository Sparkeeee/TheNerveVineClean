import { NextRequest, NextResponse } from 'next/server';
import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

console.log(`🧪 TARGET SEARCH FILE LOADED - MODULE INITIALIZATION`);

export async function POST(request: NextRequest) {
  console.log('🚀 TARGET SEARCH: Starting search');
  
  let searchTerm: string = 'unknown';
  let browser;
  
  try {
    const body = await request.json();
    const { searchTerm: term, maxResults = 5 } = body;
    searchTerm = term;
    
    if (!searchTerm) {
      return NextResponse.json({ error: 'Search term is required' }, { status: 400 });
    }

    console.log(`📝 TARGET SEARCH: Parsed searchTerm: "${searchTerm}", maxResults: ${maxResults}`);

    console.log(`🔍 TARGET SEARCH: Starting search for "${searchTerm}"`);

    // Launch browser with US geographic settings
    browser = await chromium.launch({
      headless: true,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--lang=en-US',
        '--accept-lang=en-US'
      ]
    });

    console.log(`🌐 TARGET SEARCH: Browser launched with US settings`);

    // Create context with US geographic indicators
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 },
      locale: 'en-US',
      timezoneId: 'America/New_York',
      extraHTTPHeaders: {
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0'
      }
    });

    console.log(`🌐 TARGET SEARCH: Context created with US locale and timezone`);

    const page = await context.newPage();
    
    // Hide automation indicators
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
      Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
      Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
    });

    console.log(`🔒 TARGET SEARCH: Automation indicators hidden`);

    // Build Target search URL
    const searchUrl = `https://www.target.com/s?searchTerm=${encodeURIComponent(searchTerm)}`;
    console.log(`🔍 TARGET SEARCH: Navigating to: ${searchUrl}`);

    // Navigate to search page
    await page.goto(searchUrl, { waitUntil: 'networkidle' });
    console.log(`✅ TARGET SEARCH: Page loaded`);

    // Wait for products to load with longer timeout for US geo-blocking
    console.log(`⏳ TARGET SEARCH: Waiting for products to load...`);
    try {
      await page.waitForSelector('[data-test="product-grid"]', { timeout: 15000 });
      console.log(`✅ TARGET SEARCH: Product grid found`);
    } catch (error) {
      console.log(`⚠️ TARGET SEARCH: Product grid not found, trying alternative selectors...`);
      try {
        await page.waitForSelector('a[href*="/p/"]', { timeout: 10000 });
        console.log(`✅ TARGET SEARCH: Product links found with alternative selector`);
      } catch (altError) {
        console.log(`❌ TARGET SEARCH: No products found with any selector`);
        throw new Error('No products found on page');
      }
    }

    // Additional wait for dynamic content
    console.log(`⏳ TARGET SEARCH: Waiting for dynamic content...`);
    await page.waitForTimeout(5000);

    // Save debug info
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const debugHtml = await page.content();
    const debugScreenshot = await page.screenshot();
    
    // Save debug files
    writeFileSync(`target-search-${searchTerm}-debug.html`, debugHtml);
    writeFileSync(`target-search-${searchTerm}-debug.png`, debugScreenshot);
    
    console.log(`💾 TARGET SEARCH: Debug files saved`);

    // Extract product links with multiple selector strategies
    console.log(`🔍 TARGET SEARCH: Extracting product links...`);
    
    const allLinks = await page.evaluate(() => {
      const links: string[] = [];
      
      // Extract product links from search results
      const productLinks = document.querySelectorAll('a[data-testid="product-title"]');
      productLinks.forEach((link) => {
        const href = (link as HTMLAnchorElement).href;
        if (href && !href.includes('/s/') && !href.includes('/search')) {
          links.push(href);
        }
      });

      // Also check for alternative product link selectors
      const altProductLinks = document.querySelectorAll('a[href*="/p/"]');
      altProductLinks.forEach((link) => {
        const href = (link as HTMLAnchorElement).href;
        if (href && !href.includes('/s/') && !href.includes('/search') && !links.includes(href)) {
          links.push(href);
        }
      });

      // Check for product grid links
      const gridLinks = document.querySelectorAll('a[data-testid="product-grid-item"]');
      gridLinks.forEach((link) => {
        const href = (link as HTMLAnchorElement).href;
        if (href && !href.includes('/s/') && !href.includes('/search') && !links.includes(href)) {
          links.push(href);
        }
      });

      return links;
    });

    console.log(`🔍 TARGET SEARCH: Found ${allLinks.length} total links`);

    // Filter and process links
    const productUrls = allLinks
      .filter(url => {
        // Must be a product URL
        const isProduct = url.includes('/p/');
        // Must not be search or category
        const notSearch = !url.includes('/s/') && !url.includes('/search');
        // Must not be javascript or anchor
        const notJavascript = !url.includes('javascript:') && !url.includes('#');
        
        return isProduct && notSearch && notJavascript;
      })
      .slice(0, maxResults);

    console.log(`✅ TARGET SEARCH: Filtered to ${productUrls.length} product URLs`);

    // Format results
    const results = productUrls.map((url, index) => ({
      title: `Product ${index + 1}`,
      url: url,
      price: undefined,
      imageUrl: undefined,
      rating: undefined,
      reviewCount: undefined
    }));

    console.log(`🎯 TARGET SEARCH: Returning ${results.length} results for "${searchTerm}"`);

    return NextResponse.json({
      success: true,
      searchTerm,
      results,
      totalFound: results.length,
      debug: {
        totalLinks: allLinks.length,
        filteredUrls: productUrls.length,
        timestamp: timestamp
      }
    });

  } catch (error) {
    console.error(`💥 TARGET SEARCH ERROR:`, error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Search failed',
      searchTerm: searchTerm || 'unknown'
    }, { status: 500 });
  } finally {
    if (browser) {
      console.log(`🧹 TARGET SEARCH: Closing browser`);
      await browser.close();
    }
  }
}