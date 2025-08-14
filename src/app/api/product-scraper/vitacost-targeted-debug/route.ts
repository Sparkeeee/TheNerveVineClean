import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    console.log('Vitacost Targeted Debug scraper for URL:', url);

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL is from Vitacost
    if (!url.includes('vitacost.com')) {
      return NextResponse.json({ error: 'URL must be from Vitacost' }, { status: 400 });
    }

    // Fetch with Vitacost-specific headers
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    console.log('Fetched HTML length:', html.length);

    // Extract product name from title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const name = titleMatch ? titleMatch[1].trim() : 'Product name not found';

    // Find ALL price mentions with more context
    const allPriceMatches = html.match(/\$[\d,]+\.?\d*/g) || [];
    
    // Get context around each price mention
    const priceContexts = allPriceMatches.map(price => {
      const priceIndex = html.indexOf(price);
      const start = Math.max(0, priceIndex - 300);
      const end = Math.min(html.length, priceIndex + 300);
      const context = html.substring(start, end);
      
      // Find the HTML element containing this price
      const beforePrice = html.substring(0, priceIndex);
      const afterPrice = html.substring(priceIndex + price.length);
      
      // Look for opening tag before price
      const beforeMatch = beforePrice.match(/<[^>]*>$/);
      const afterMatch = afterPrice.match(/^[^<]*<\/[^>]*>/);
      
      let element = 'Unknown';
      if (beforeMatch && afterMatch) {
        element = beforeMatch[0] + price + afterMatch[0];
      }
      
      return {
        price,
        context: context.replace(/\s+/g, ' ').trim(),
        element: element.replace(/\s+/g, ' ').trim(),
        position: priceIndex
      };
    });

    // Look for specific price-related patterns
    const pricePatterns = [
      'pRetailPrice',
      'price',
      'cost',
      'amount',
      'value',
      'sale',
      'discount',
      'retail'
    ];

    const priceElements = pricePatterns.map(pattern => {
      const regex = new RegExp(`<[^>]*class="[^"]*${pattern}[^"]*"[^>]*>([^<]*)</[^>]*>`, 'gi');
      const matches = html.match(regex) || [];
      return { pattern, matches };
    });

    // Look for description-related content
    const descriptionPatterns = [
      'description',
      'summary',
      'details',
      'info',
      'content',
      'about'
    ];

    const descriptionElements = descriptionPatterns.map(pattern => {
      const regex = new RegExp(`<[^>]*class="[^"]*${pattern}[^"]*"[^>]*>([^<]*)</[^>]*>`, 'gi');
      const matches = html.match(regex) || [];
      return { pattern, matches };
    });

    // Look for meta descriptions
    const metaDescriptions = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/gi) || [];
    const metaDescriptionsContent = metaDescriptions.map(meta => {
      const contentMatch = meta.match(/content="([^"]*)"/);
      return contentMatch ? contentMatch[1] : meta;
    });

    // Look for product-specific sections
    const productSections = html.match(/<[^>]*class="[^"]*product[^"]*"[^>]*>([^<]*)</[^>]*>/gi) || [];
    const mainSections = html.match(/<[^>]*class="[^"]*main[^"]*"[^>]*>([^<]*)</[^>]*>/gi) || [];

    // Find the main content area (often contains product info)
    const mainContentMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    const mainContent = mainContentMatch ? mainContentMatch[1] : 'No main tag found';

    // Look for specific price elements in the main content
    const mainContentPrices = mainContent.match(/\$[\d,]+\.?\d*/g) || [];
    const mainContentPriceContexts = mainContentPrices.map(price => {
      const priceIndex = mainContent.indexOf(price);
      const start = Math.max(0, priceIndex - 200);
      const end = Math.min(mainContent.length, priceIndex + 200);
      const context = mainContent.substring(start, end);
      return { price, context: context.replace(/\s+/g, ' ').trim() };
    });

    const debugData = {
      name,
      htmlLength: html.length,
      allPriceMatches,
      priceContexts: priceContexts.slice(0, 10), // First 10 price contexts
      priceElements,
      descriptionElements,
      metaDescriptions: metaDescriptionsContent,
      productSections: productSections.slice(0, 5),
      mainSections: mainSections.slice(0, 5),
      mainContentLength: mainContent.length,
      mainContentPrices,
      mainContentPriceContexts: mainContentPriceContexts.slice(0, 5),
      url
    };

    console.log('Vitacost Targeted Debug extraction results:', debugData);

    return NextResponse.json(debugData);

  } catch (error) {
    console.error('Vitacost Targeted Debug scraper error:', error);
    return NextResponse.json({
      error: `Vitacost Targeted Debug scraper failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}
