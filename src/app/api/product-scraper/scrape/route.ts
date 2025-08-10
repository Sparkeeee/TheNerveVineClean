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

// Site-specific scrapers
const scrapers = {
  amazon: async (page: any, url: string): Promise<Partial<ScrapedProduct>> => {
    console.log('Scraping Amazon URL:', url);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    const productData = await page.evaluate(() => {
      const name = document.querySelector('#productTitle')?.textContent?.trim() || '';
      const price = document.querySelector('.a-price-whole')?.textContent?.trim() || 
                   document.querySelector('.a-offscreen')?.textContent?.trim() || '';
      const image = document.querySelector('#landingImage')?.getAttribute('src') || 
                   document.querySelector('#imgBlkFront')?.getAttribute('src') || '';
      const description = document.querySelector('#productDescription')?.textContent?.trim() || 
                        document.querySelector('#feature-bullets')?.textContent?.trim() || '';
      const availability = document.querySelector('#availability')?.textContent?.trim() || '';

      console.log('Amazon scraped data:', { name, price, image, description, availability });
      return { name, price, image, description, availability };
    });

    return productData;
  },

  iherb: async (page: any, url: string): Promise<Partial<ScrapedProduct>> => {
    console.log('Scraping iHerb URL:', url);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    const productData = await page.evaluate(() => {
      const name = document.querySelector('h1[data-testid="product-title"]')?.textContent?.trim() || 
                  document.querySelector('.product-title')?.textContent?.trim() || '';
      const price = document.querySelector('[data-testid="price-current"]')?.textContent?.trim() || 
                   document.querySelector('.price-current')?.textContent?.trim() || '';
      const image = document.querySelector('.product-image img')?.getAttribute('src') || 
                   document.querySelector('[data-testid="product-image"] img')?.getAttribute('src') || '';
      const description = document.querySelector('.product-description')?.textContent?.trim() || 
                        document.querySelector('[data-testid="product-description"]')?.textContent?.trim() || '';
      const availability = document.querySelector('.availability')?.textContent?.trim() || '';

      return { name, price, image, description, availability };
    });

    return productData;
  },

  vitacost: async (page: any, url: string): Promise<Partial<ScrapedProduct>> => {
    console.log('Scraping Vitacost URL:', url);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    const productData = await page.evaluate(() => {
      const name = document.querySelector('.product-name')?.textContent?.trim() || 
                  document.querySelector('h1')?.textContent?.trim() || '';
      const price = document.querySelector('.price')?.textContent?.trim() || 
                   document.querySelector('.product-price')?.textContent?.trim() || '';
      const image = document.querySelector('.product-image img')?.getAttribute('src') || 
                   document.querySelector('.main-image')?.getAttribute('src') || '';
      const description = document.querySelector('.product-description')?.textContent?.trim() || 
                        document.querySelector('.description')?.textContent?.trim() || '';
      const availability = document.querySelector('.availability')?.textContent?.trim() || '';

      return { name, price, image, description, availability };
    });

    return productData;
  }
};

function detectSite(url: string): string {
  const hostname = new URL(url).hostname.toLowerCase();
  console.log('Detected site:', hostname);
  
  if (hostname.includes('amazon')) return 'amazon';
  if (hostname.includes('iherb')) return 'iherb';
  if (hostname.includes('vitacost')) return 'vitacost';
  
  return 'generic';
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    console.log('Received scraping request for URL:', url);

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    console.log('Launching Puppeteer browser...');
    
    // Launch browser with more options for serverless
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process'
      ]
    });

    console.log('Browser launched, creating new page...');
    const page = await browser.newPage();
    
    // Set user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    const site = detectSite(url);
    console.log('Using scraper for site:', site);
    
    let scrapedData: Partial<ScrapedProduct> = {};

    if (scrapers[site as keyof typeof scrapers]) {
      console.log('Using site-specific scraper for:', site);
      scrapedData = await scrapers[site as keyof typeof scrapers](page, url);
    } else {
      console.log('Using generic scraper');
      // Generic scraper for unsupported sites
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      
      scrapedData = await page.evaluate(() => {
        const name = document.querySelector('h1')?.textContent?.trim() || 
                    document.querySelector('.product-title')?.textContent?.trim() || 
                    document.querySelector('title')?.textContent?.trim() || '';
        const price = document.querySelector('.price')?.textContent?.trim() || 
                     document.querySelector('[class*="price"]')?.textContent?.trim() || '';
        const image = document.querySelector('img[src*="product"]')?.getAttribute('src') || 
                     document.querySelector('.product-image img')?.getAttribute('src') || '';
        const description = document.querySelector('.description')?.textContent?.trim() || 
                          document.querySelector('[class*="description"]')?.textContent?.trim() || '';
        const availability = document.querySelector('.availability')?.textContent?.trim() || '';

        return { name, price, image, description, availability };
      });
    }

    console.log('Scraped data:', scrapedData);
    await browser.close();

    const result: ScrapedProduct = {
      name: scrapedData.name || 'Product name not found',
      price: scrapedData.price || 'Price not found',
      image: scrapedData.image || '',
      description: scrapedData.description || 'Description not found',
      availability: scrapedData.availability || 'Availability unknown',
      url,
      rawData: scrapedData
    };

    console.log('Returning result:', result);
    return NextResponse.json(result);

  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json(
      { error: `Failed to scrape product data: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
