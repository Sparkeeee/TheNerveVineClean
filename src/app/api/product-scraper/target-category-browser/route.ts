import { NextRequest, NextResponse } from 'next/server';
import { chromium } from 'playwright';

export async function POST(request: NextRequest) {
  try {
    const { categoryUrl, maxProducts = 15 } = await request.json();

    if (!categoryUrl) {
      return NextResponse.json({ error: 'Category URL is required' }, { status: 400 });
    }

    console.log('🌐 Starting Target Category Browser for:', categoryUrl);

    const browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 },
      locale: 'en-US',
      timezoneId: 'America/New_York',
      extraHTTPHeaders: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0',
        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"'
      }
    });

    const page = await context.newPage();

    // Add stealth scripts to hide automation
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      });
      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en'],
      });
    });

    // Random delay to avoid detection
    const delay = Math.floor(Math.random() * 5000) + 3000;
    await new Promise(resolve => setTimeout(resolve, delay));

    console.log('📱 Starting with search strategy to avoid detection...');
    
    // Use search as primary strategy instead of category page
    const searchUrl = 'https://www.target.com/s?searchTerm=ashwagandha+supplements';
    await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Wait for search results to load with random timing
    await page.waitForTimeout(3000 + Math.random() * 2000);
    
    // Simulate human-like scrolling behavior on search page
    console.log('📜 Scrolling through search results...');
    for (let i = 0; i < 5; i++) {
      // Random scroll distance
      const scrollDistance = Math.floor(Math.random() * 800) + 400;
      await page.evaluate((distance) => {
        window.scrollBy(0, distance);
      }, scrollDistance);
      
      // Random delay between scrolls
      await page.waitForTimeout(800 + Math.random() * 1200);
    }
    
    // Simulate mouse movement (human-like behavior)
    await page.mouse.move(Math.random() * 800, Math.random() * 600);
    await page.waitForTimeout(500 + Math.random() * 1000);
    
    // Extract product information from search results
    console.log('🔍 Extracting product information from search results...');
    
    // First, let's debug what elements are available
    const debugInfo = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      const productRelated = Array.from(allElements).filter(el => {
        const text = el.textContent?.toLowerCase() || '';
        const className = el.className;
        const classString = typeof className === 'string' ? className : className?.toString() || '';
        const id = el.id?.toLowerCase() || '';
        return text.includes('product') || classString.includes('product') || id.includes('product') ||
               text.includes('supplement') || classString.includes('supplement') || id.includes('supplement') ||
               text.includes('herb') || classString.includes('herb') || id.includes('herb');
      });
      
      return {
        totalElements: allElements.length,
        productRelatedElements: productRelated.length,
        sampleElements: productRelated.slice(0, 5).map(el => ({
          tag: el.tagName,
          className: typeof el.className === 'string' ? el.className : el.className?.toString() || '',
          id: el.id,
          text: el.textContent?.substring(0, 100)
        }))
      };
    });
    
    console.log('🔍 Debug info:', debugInfo);
    
    const products = await page.evaluate(() => {
      try {
        // Try multiple selector strategies
        const selectors = [
          '[data-testid="product-card"]',
          '[data-testid="product"]',
          '.product-card',
          '.product-item',
          '[data-testid="product-title"]',
          'h3',
          'h4',
          '.product-name',
          '[class*="product"]',
          '[class*="card"]'
        ];
        
        let productElements: Element[] = [];
        
        // Try each selector
        for (const selector of selectors) {
          try {
            const found = document.querySelectorAll(selector);
            if (found.length > 0) {
              console.log(`Found ${found.length} elements with selector: ${selector}`);
              productElements = Array.from(found);
              break;
            }
          } catch (e) {
            console.log(`Selector failed: ${selector}`, e);
          }
        }
        
        // If no specific selectors work, look for elements with product-like content
        if (productElements.length === 0) {
          console.log('No specific selectors worked, trying content-based detection...');
          const allElements = document.querySelectorAll('*');
          productElements = Array.from(allElements).filter(el => {
            try {
              const text = el.textContent?.toLowerCase() || '';
              return text.includes('ashwagandha') || text.includes('supplement') || text.includes('vitamin') ||
                     text.includes('herb') || text.includes('gummy') || text.includes('capsule');
            } catch (e) {
              console.log('Error filtering element:', e);
              return false;
            }
          });
          console.log(`Found ${productElements.length} elements with product-like content`);
        }
        
        const extractedProducts: any[] = [];
        
        productElements.forEach((element, index) => {
          if (extractedProducts.length >= 20) return; // Limit to 20 products
          
          try {
            // Extract product name - try multiple approaches
            let name = '';
            const nameSelectors = [
              '[data-testid="product-title"]',
              '.product-title',
              'h3',
              'h4',
              '.product-name',
              'title',
              'alt'
            ];
            
            for (const selector of nameSelectors) {
              try {
                const nameEl = element.querySelector(selector);
                if (nameEl?.textContent?.trim()) {
                  name = nameEl.textContent.trim();
                  break;
                }
              } catch (e) {
                // Try next selector
              }
            }
            
            // If still no name, try to get text from the element itself
            if (!name) {
              name = element.textContent?.trim() || `Product ${index + 1}`;
            }
            
            // Extract price - try multiple approaches
            let price = 'Price not found';
            const priceSelectors = [
              '[data-testid="product-price"]',
              '.product-price',
              '.price',
              '[data-testid="price"]',
              '.current-price',
              '[class*="price"]'
            ];
            
            for (const selector of priceSelectors) {
              try {
                const priceEl = element.querySelector(selector);
                if (priceEl?.textContent?.trim()) {
                  price = priceEl.textContent.trim();
                  break;
                }
              } catch (e) {
                // Try next selector
              }
            }
            
            // Extract image
            const imageElement = element.querySelector('img');
            const image = imageElement?.src || imageElement?.getAttribute('data-src') || '';
            
            // Extract product URL
            let url = '';
            const linkElement = element.querySelector('a');
            if (linkElement?.href) {
              url = linkElement.href;
            } else if (element.tagName === 'A') {
              url = (element as HTMLAnchorElement).href;
            }
            
            // Extract product type/form from name and description
            const productText = name.toLowerCase();
            let productType = 'Unknown';
            
            if (productText.includes('gummy') || productText.includes('gummies')) {
              productType = 'Gummies';
            } else if (productText.includes('capsule') || productText.includes('capsules')) {
              productType = 'Capsules';
            } else if (productText.includes('tincture') || productText.includes('tinctures')) {
              productType = 'Tinctures';
            } else if (productText.includes('powder') || productText.includes('powders')) {
              productType = 'Powders';
            } else if (productText.includes('tablet') || productText.includes('tablets')) {
              productType = 'Tablets';
            } else if (productText.includes('liquid') || productText.includes('drops')) {
              productType = 'Liquid';
            } else if (productText.includes('tea') || productText.includes('loose leaf')) {
              productType = 'Tea';
            }
            
            // Extract description/summary
            let description = '';
            const descSelectors = [
              '[data-testid="product-description"]',
              '.product-description',
              '.description',
              'p'
            ];
            
            for (const selector of descSelectors) {
              try {
                const descEl = element.querySelector(selector);
                if (descEl?.textContent?.trim()) {
                  description = descEl.textContent.trim();
                  break;
                }
              } catch (e) {
                // Try next selector
              }
            }
            
            if (name && url) {
              extractedProducts.push({
                name,
                price,
                image,
                url,
                description,
                productType,
                index: index + 1
              });
            }
          } catch (error) {
            console.log('Error extracting product:', error);
          }
        });
        
        return extractedProducts;
      } catch (error) {
        console.error('Error in product extraction:', error);
        return [];
      }
    });

    console.log(`✅ Found ${products.length} products`);

    // Analyze product diversity
    const productTypes = products.reduce((acc: any, product) => {
      acc[product.productType] = (acc[product.productType] || 0) + 1;
      return acc;
    }, {});

    const diversityScore = Object.keys(productTypes).length;
    const hasGummies = productTypes['Gummies'] > 0;
    const hasCapsules = productTypes['Capsules'] > 0;
    const hasTinctures = productTypes['Tinctures'] > 0;
    const hasPowders = productTypes['Powders'] > 0;

    await browser.close();

    const result = {
      success: true,
      categoryUrl,
      totalProducts: products.length,
      productTypes,
      diversityScore,
      diversityAnalysis: {
        hasGummies,
        hasCapsules,
        hasTinctures,
        hasPowders,
        recommendation: diversityScore >= 4 ? 'Excellent diversity' : 
                      diversityScore >= 3 ? 'Good diversity' : 
                      diversityScore >= 2 ? 'Moderate diversity' : 'Limited diversity'
      },
      products: products.slice(0, maxProducts),
      timestamp: new Date().toISOString()
    };

    console.log('🎯 Category Browser Results:', {
      totalProducts: result.totalProducts,
      diversityScore: result.diversityScore,
      productTypes: result.productTypes
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ Target Category Browser Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Category browsing failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
