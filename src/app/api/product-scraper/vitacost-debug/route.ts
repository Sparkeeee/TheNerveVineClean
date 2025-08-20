import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    console.log('Vitacost Debug scraper for URL:', url);

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

    // Find ALL price-related content
    const allPriceMatches = html.match(/\$[\d,]+\.?\d*/g) || [];
    const priceElements = html.match(/<[^>]*>\s*\$[\d,]+\.?\d*\s*<\/[^>]*>/g) || [];
    const priceSpans = html.match(/<span[^>]*>\s*\$[\d,]+\.?\d*\s*<\/span>/g) || [];
    const priceDivs = html.match(/<div[^>]*>\s*\$[\d,]+\.?\d*\s*<\/div>/g) || [];

    // Find ALL image-related content
    const allImages = html.match(/<img[^>]*src=["']([^"']*)["'][^>]*>/g) || [];
    const imageSrcs = html.match(/<img[^>]*src=["']([^"']*)["'][^>]*>/g) || [];
    const imageClasses = html.match(/<img[^>]*class=["']([^"']*)["'][^>]*>/g) || [];
    const imageAlts = html.match(/<img[^>]*alt=["']([^"']*)["'][^>]*>/g) || [];

    // Find ALL description-related content
    const metaDescriptions = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/g) || [];
    const descriptionDivs = html.match(/<div[^>]*class=["'][^"']*description[^"']*["'][^>]*>/g) || [];
    const summaryDivs = html.match(/<div[^>]*class=["'][^"']*summary[^"']*["'][^>]*>/g) || [];

    // Look for specific patterns that might contain price
    const pricePatterns = [
      'price',
      'cost',
      'amount',
      'value',
      'sale',
      'discount'
    ];

    const priceContexts = pricePatterns.map(pattern => {
      const regex = new RegExp(`<[^>]*class="[^"]*${pattern}[^"]*"[^>]*>([^<]*)</[^>]*>`, 'gi');
      const matches = html.match(regex) || [];
      return { pattern, matches };
    });

    // Look for specific patterns that might contain images
    const imagePatterns = [
      'product',
      'image',
      'photo',
      'picture',
      'main',
      'primary'
    ];

    const imageContexts = imagePatterns.map(pattern => {
      const regex = new RegExp(`<[^>]*class="[^"]*${pattern}[^"]*"[^>]*>([^<]*)</[^>]*>`, 'gi');
      const matches = html.match(regex) || [];
      return { pattern, matches };
    });

    // Extract a sample of HTML around price mentions
    const priceSample = html.substring(0, Math.min(10000, html.length));
    const priceContext = priceSample.match(/(.{0,200}\$[\d,]+\.?\d*.{0,200})/g) || [];

    // Extract a sample of HTML around image mentions
    const imageSample = html.substring(0, Math.min(10000, html.length));
    const imageContext = imageSample.match(/(.{0,200}<img[^>]*>.{0,200})/g) || [];

    const debugData = {
      name,
      htmlLength: html.length,
      allPriceMatches,
      priceElements,
      priceSpans,
      priceDivs,
      priceContexts,
      priceContext: priceContext.slice(0, 5), // First 5 price contexts
      allImages: allImages.slice(0, 10), // First 10 images
      imageSrcs: imageSrcs.slice(0, 10),
      imageClasses: imageClasses.slice(0, 10),
      imageAlts: imageAlts.slice(0, 10),
      imageContexts,
      imageContext: imageContext.slice(0, 5), // First 5 image contexts
      metaDescriptions,
      descriptionDivs,
      summaryDivs,
      url
    };

    console.log('Vitacost Debug extraction results:', debugData);

    return NextResponse.json(debugData);

  } catch (error) {
    console.error('Vitacost Debug scraper error:', error);
    return NextResponse.json({
      error: `Vitacost Debug scraper failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}
