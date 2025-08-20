import { NextRequest, NextResponse } from 'next/server';

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
    console.log('Simple scraping request for URL:', url);

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Simple fetch-based scraping (limited but works for basic testing)
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    console.log('Fetched HTML length:', html.length);

    // Enhanced extraction with multiple patterns for better coverage
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    let name = titleMatch ? titleMatch[1].trim() : 'Product name not found';

    // Decode HTML entities for cleaner product names and descriptions
    const decodeHtmlEntities = (text: string): string => {
      if (!text) return text;
      return text
        .replace(/&#39;/g, "'")        // apostrophe
        .replace(/&amp;/g, "&")       // ampersand
        .replace(/&quot;/g, '"')      // quote
        .replace(/&lt;/g, "<")        // less than
        .replace(/&gt;/g, ">")        // greater than
        .replace(/&nbsp;/g, " ")      // non-breaking space
        .replace(/&rsquo;/g, "'")     // right single quote
        .replace(/&lsquo;/g, "'")     // left single quote
        .replace(/&rdquo;/g, '"')     // right double quote
        .replace(/&ldquo;/g, '"');    // left double quote
    };

    // Clean up extracted data
    name = decodeHtmlEntities(name);

    // Enhanced price extraction with multiple patterns
    let price = 'Price not found';
    
    // Pattern 1: Target-specific JSON price extraction
    const targetPriceMatch = html.match(/"formatted_current_price":"\$([\d,]+\.?\d*)"/);
    if (targetPriceMatch) {
      price = `$${targetPriceMatch[1]}`;
    }
    
    // Pattern 2: HerbEra-style data attributes
    if (price === 'Price not found') {
      const herbEraPriceMatch = html.match(/<span[^>]*data-regular-price[^>]*>\s*\$([\d,]+\.?\d*)\s*<\/span>/i);
      if (herbEraPriceMatch) {
        price = `$${herbEraPriceMatch[1]}`;
      }
    }
    
    // Pattern 3: Price with price-item class
    if (price === 'Price not found') {
      const priceItemMatch = html.match(/<span[^>]*class="[^"]*price-item[^"]*"[^>]*>\s*\$([\d,]+\.?\d*)\s*<\/span>/i);
      if (priceItemMatch) {
        price = `$${priceItemMatch[1]}`;
      }
    }
    
    // Pattern 4: Standard price pattern (fallback)
    if (price === 'Price not found') {
      const priceMatch = html.match(/\$[\d,]+\.?\d*/);
      if (priceMatch) {
        price = priceMatch[0];
      }
    }

    // Enhanced image extraction with multiple patterns
    let image = '';
    
    // Pattern 1: Target-specific image extraction (first product image)
    const targetImageMatch = html.match(/<img[^>]*src=["']([^"']*target\.scene7\.com[^"']*)["'][^>]*alt=["'][^"']*1 of [^"']*["'][^>]*>/i);
    if (targetImageMatch) {
      image = targetImageMatch[1];
    }
    
    // Pattern 2: Product images with width placeholder
    if (!image) {
      const productImageMatch = html.match(/<img[^>]*src=["']([^"']*\{width\}[^"']*)["'][^>]*>/i);
      if (productImageMatch) {
        image = productImageMatch[1].replace('{width}', '500'); // Use 500px width
      }
    }
    
    // Pattern 3: Standard product image
    if (!image) {
      const imageMatch = html.match(/<img[^>]*src=["']([^"']*product[^"']*)["'][^>]*>/i);
      if (imageMatch) {
        image = imageMatch[1];
      }
    }
    
    // Pattern 4: Any image with product-related alt text
    if (!image) {
      const altImageMatch = html.match(/<img[^>]*alt=["']([^"']*product[^"']*)["'][^>]*src=["']([^"']*)["'][^>]*>/i);
      if (altImageMatch) {
        image = altImageMatch[2];
      }
    }

    // FIX URL PREFIXES: Ensure all image URLs have proper https:// prefix
    if (image && image.startsWith('//')) {
      image = 'https:' + image;
      console.log('Fixed protocol-relative URL:', image);
    } else if (image && image.startsWith('/')) {
      // Handle relative URLs by adding the base domain
      const urlObj = new URL(url);
      image = urlObj.protocol + '//' + urlObj.host + image;
      console.log('Fixed relative URL:', image);
    }

    const descriptionMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
    const description = descriptionMatch ? descriptionMatch[1] : 'Description not found';

    // Decode HTML entities for cleaner product names and descriptions
    const decodedDescription = decodeHtmlEntities(description);

    // Log extraction results for debugging
    console.log('Enhanced extraction results:', {
      name,
      price,
      image: image ? `${image.substring(0, 50)}...` : 'No image found',
      description: decodedDescription.substring(0, 100) + '...'
    });

    const scrapedData: Partial<ScrapedProduct> = {
      name,
      price,
      image,
      description: decodedDescription,
      availability: 'Availability unknown'
    };

    console.log('Simple scraped data:', scrapedData);

    const result: ScrapedProduct = {
      name: scrapedData.name || 'Product name not found',
      price: scrapedData.price || 'Price not found',
      image: scrapedData.image || '',
      description: scrapedData.description || 'Description not found',
      availability: scrapedData.availability || 'Availability unknown',
      url,
      rawData: scrapedData
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Simple scraping error:', error);
    return NextResponse.json(
      { error: `Failed to scrape product data: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
