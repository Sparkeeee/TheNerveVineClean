import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

interface ScrapedProduct {
  name: string;
  price: string;
  image: string;
  description: string;
  availability: string;
  url: string;
  rawData: any;
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    console.log('Amazon Puppeteer scraper for URL:', url);

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Add timeout wrapper to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Puppeteer operation timed out')), 60000); // 60 second timeout
    });

    const scraperPromise = (async () => {

    // Launch Puppeteer with stealth settings
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-extensions',
        '--disable-plugins',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-features=TranslateUI',
        '--disable-ipc-flooding-protection',
        '--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1.2 Mobile/15E148 Safari/604.1'
      ]
    });

    const page = await browser.newPage();
    
    // Set mobile viewport and user agent
    await page.setViewport({ width: 375, height: 667, isMobile: true });
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1.2 Mobile/15E148 Safari/604.1');

    // Set extra headers to mimic real browser
    await page.setExtraHTTPHeaders({
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Cache-Control': 'max-age=0',
      'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120"',
      'Sec-Ch-Ua-Mobile': '?1',
      'Sec-Ch-Ua-Platform': '"Android"',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1'
    });

    console.log('Navigating to URL:', url);
    
    try {
      await page.goto(url, { 
        waitUntil: 'domcontentloaded', 
        timeout: 45000 
      });
    } catch (navigationError) {
      console.log('Navigation failed, trying with different wait strategy:', navigationError);
      await page.goto(url, { 
        waitUntil: 'load', 
        timeout: 45000 
      });
    }

    // Wait for content to load with error handling
    try {
      await page.waitForTimeout(5000);
    } catch (timeoutError) {
      console.log('Timeout waiting for content, proceeding anyway:', timeoutError);
    }

    // Extract product data using page.evaluate with error handling
    let productData;
    try {
      // Check if page is still attached
      if (!page.isClosed()) {
        productData = await page.evaluate(() => {
      // Price extraction - try multiple selectors
      let price = 'Price not found';
      const priceSelectors = [
        '.a-price .a-offscreen',
        '.a-price-whole',
        '.a-price-range .a-offscreen',
        '[data-a-color="price"] .a-offscreen',
        '.a-price .a-price-whole',
        '.a-price-range .a-price-whole',
        '.a-price .a-price-symbol + .a-price-whole',
        '.a-price .a-price-fraction',
        '.a-price-range .a-price-fraction',
        '.a-price .a-price-symbol + .a-price-whole + .a-price-fraction'
      ];

      for (const selector of priceSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          const text = element.textContent?.trim();
          if (text && text.includes('$')) {
            price = text;
            break;
          }
        }
      }

      // If no price found in visible elements, try JavaScript variables
      if (price === 'Price not found') {
        // Look for price in window object or global variables
        const scripts = document.querySelectorAll('script');
        for (const script of scripts) {
          const content = script.textContent || '';
          if (content.includes('price') && content.includes('$')) {
            const priceMatch = content.match(/\$[\d,]+\.?\d*/);
            if (priceMatch) {
              price = priceMatch[0];
              break;
            }
          }
        }
      }

      // Title extraction
      let title = 'Product name not found';
      const titleSelectors = [
        '#productTitle',
        '.a-size-large.product-title-word-break',
        'h1.a-size-large',
        '.a-size-large.a-spacing-none.a-text-normal',
        'h1'
      ];

      for (const selector of titleSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          const text = element.textContent?.trim();
          if (text && text.length > 10) {
            title = text;
            break;
          }
        }
      }

      // Image extraction
      let image = '';
      const imageSelectors = [
        '#landingImage',
        '.a-dynamic-image',
        '.a-image-stretch img',
        '.a-image-stretch-vertical img',
        '.a-image-stretch-horizontal img',
        '.a-image-stretch-vertical-horizontal img',
        '.a-image-stretch-vertical-horizontal img',
        '.a-image-stretch-vertical-horizontal img',
        '.a-image-stretch-vertical-horizontal img',
        '.a-image-stretch-vertical-horizontal img'
      ];

      for (const selector of imageSelectors) {
        const element = document.querySelector(selector) as HTMLImageElement;
        if (element && element.src) {
          image = element.src;
          break;
        }
      }

      // Description extraction
      let description = 'Description not found';
      const descSelectors = [
        '#productDescription p',
        '.a-expander-content p',
        '.a-expander-content .a-list-item',
        '.a-expander-content .a-text-styles',
        '.a-expander-content .a-text-styles .a-list-item',
        '.a-expander-content .a-text-styles .a-list-item .a-list-item',
        '.a-expander-content .a-text-styles .a-list-item .a-list-item .a-list-item',
        '.a-expander-content .a-text-styles .a-list-item .a-list-item .a-list-item .a-list-item',
        '.a-expander-content .a-text-styles .a-list-item .a-list-item .a-list-item .a-list-item .a-list-item',
        '.a-expander-content .a-text-styles .a-list-item .a-list-item .a-list-item .a-list-item .a-list-item .a-list-item'
      ];

      for (const selector of descSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          const text = element.textContent?.trim();
          if (text && text.length > 20) {
            description = text;
            break;
          }
        }
      }

      // Availability extraction
      let availability = 'Availability unknown';
      const availabilitySelectors = [
        '#availability',
        '.a-size-medium.a-color-success',
        '.a-size-medium.a-color-price',
        '.a-size-medium.a-color-secondary',
        '.a-size-medium.a-color-tertiary',
        '.a-size-medium.a-color-quaternary',
        '.a-size-medium.a-color-quinary',
        '.a-size-medium.a-color-senary',
        '.a-size-medium.a-color-septenary',
        '.a-size-medium.a-color-octonary'
      ];

      for (const selector of availabilitySelectors) {
        const element = document.querySelector(selector);
        if (element) {
          const text = element.textContent?.trim();
          if (text && (text.includes('stock') || text.includes('available') || text.includes('unavailable'))) {
            availability = text;
            break;
          }
        }
      }

               return {
           name: title,
           price: price,
           image: image,
           description: description,
           availability: availability
         };
       });
      } else {
        throw new Error('Page was closed during execution');
      }
    } catch (evaluateError) {
      console.log('Page evaluation failed, using fallback extraction:', evaluateError);
      // Fallback to basic extraction
      productData = {
         name: 'Product name not found',
         price: 'Price not found',
         image: '',
         description: 'Description not found',
         availability: 'Availability unknown'
       };
    }

    // Safely close browser
    try {
      if (!browser.isConnected()) {
        console.log('Browser already disconnected');
      } else {
        await browser.close();
      }
    } catch (closeError) {
      console.log('Error closing browser:', closeError);
    }

    const result: ScrapedProduct = {
      ...productData,
      url: url,
      rawData: {
        htmlLength: 'Puppeteer extraction',
        title: productData.name,
        hasPrice: productData.price !== 'Price not found',
        hasImage: productData.image !== '',
        hasDescription: productData.description !== 'Description not found'
      }
    };

      return result;
    })();

    // Race between timeout and scraper
    const result = await Promise.race([scraperPromise, timeoutPromise]) as ScrapedProduct;
    return NextResponse.json(result);

  } catch (error) {
    console.error('Amazon Puppeteer scraper error:', error);
    return NextResponse.json({
      error: `Amazon Puppeteer scraper failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}
