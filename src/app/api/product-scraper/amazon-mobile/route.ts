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
    console.log('Amazon mobile scraper for URL:', url);

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Extract ASIN from URL
    const asinMatch = url.match(/\/dp\/([A-Z0-9]{10})/);
    const asin = asinMatch ? asinMatch[1] : null;
    
    console.log('Extracted ASIN:', asin);

    // Use the successful mobile approach
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1.2 Mobile/15E148 Safari/604.1'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    console.log('Mobile HTML length:', html.length);

    // Extract product data using the mobile HTML
    const productData = await extractProductData(html, url);
    
    console.log('Extracted product data:', productData);

    return NextResponse.json(productData);

  } catch (error) {
    console.error('Amazon mobile scraper error:', error);
    return NextResponse.json({
      error: `Amazon mobile scraper failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}

async function extractProductData(html: string, url: string): Promise<ScrapedProduct> {
  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'Product name not found';

  // Extract price - try multiple patterns for Amazon mobile
  let price = 'Price not found';
  const pricePatterns = [
    // Amazon mobile specific patterns
    /\$[\d,]+\.?\d*/,
    /[\d,]+\.?\d*\s*USD/,
    /Price:\s*\$[\d,]+\.?\d*/,
    /[\d,]+\.?\d*\s*dollars/,
    // More specific Amazon patterns
    /"price":\s*"([^"]+)"/,
    /"priceAmount":\s*"([^"]+)"/,
    /"priceCurrency":\s*"USD"[^}]*"price":\s*"([^"]+)"/,
    // Look for price in data attributes
    /data-price="([^"]+)"/,
    /data-asin-price="([^"]+)"/,
    // Look for price in span elements
    /<span[^>]*class="[^"]*price[^"]*"[^>]*>([^<]+)<\/span>/i,
    /<span[^>]*class="[^"]*a-price[^"]*"[^>]*>([^<]+)<\/span>/i,
    // Look for price in div elements
    /<div[^>]*class="[^"]*price[^"]*"[^>]*>([^<]+)<\/div>/i,
    /<div[^>]*class="[^"]*a-price[^"]*"[^>]*>([^<]+)<\/div>/i
  ];
  
  for (const pattern of pricePatterns) {
    const match = html.match(pattern);
    if (match) {
      price = match[1] || match[0];
      // Clean up the price
      price = price.replace(/[^\d.,$]/g, '').trim();
      if (price && price !== '$') {
        break;
      }
    }
  }

  // Extract image URL - try multiple patterns for Amazon mobile
  let image = '';
  const imagePatterns = [
    // Look for product images in various formats
    /<img[^>]*src=["']([^"']*images[^"']*\.(?:jpg|jpeg|png|webp))["'][^>]*>/i,
    /<img[^>]*src=["']([^"']*product[^"']*\.(?:jpg|jpeg|png|webp))["'][^>]*>/i,
    /<img[^>]*src=["']([^"']*media-amazon[^"']*\.(?:jpg|jpeg|png|webp))["'][^>]*>/i,
    // Look for data-src attributes (lazy loading)
    /<img[^>]*data-src=["']([^"']*images[^"']*\.(?:jpg|jpeg|png|webp))["'][^>]*>/i,
    /<img[^>]*data-src=["']([^"']*product[^"']*\.(?:jpg|jpeg|png|webp))["'][^>]*>/i,
    // Look for JSON data with image URLs
    /"image":\s*"([^"]*\.(?:jpg|jpeg|png|webp))"/,
    /"imageUrl":\s*"([^"]*\.(?:jpg|jpeg|png|webp))"/,
    // Look for og:image meta tag
    /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
    // Look for structured data
    /"image":\s*"([^"]*media-amazon[^"]*\.(?:jpg|jpeg|png|webp))"/,
    // Fallback to any image that's not a sprite or icon
    /<img[^>]*src=["']([^"']*\.(?:jpg|jpeg|png|webp))["'][^>]*>/i
  ];
  
  for (const pattern of imagePatterns) {
    const match = html.match(pattern);
    if (match) {
      image = match[1];
      // Filter out sprites, icons, and other non-product images
      if (image && 
          !image.includes('sprite') && 
          !image.includes('icon') && 
          !image.includes('nav') && 
          !image.includes('logo') &&
          !image.includes('favicon')) {
        break;
      }
    }
  }

  // Extract description
  const descriptionMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
                          html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i);
  const description = descriptionMatch ? descriptionMatch[1] : 'Description not found';

  // Check availability - look for more specific patterns
  let availability = 'Availability unknown';
  if (html.includes('in stock') || html.includes('In Stock')) {
    availability = 'In Stock';
  } else if (html.includes('out of stock') || html.includes('Out of Stock')) {
    availability = 'Out of Stock';
  } else if (html.includes('temporarily out of stock')) {
    availability = 'Temporarily Out of Stock';
  } else if (html.includes('available')) {
    availability = 'Available';
  }

  return {
    name: title,
    price: price,
    image: image,
    description: description,
    availability: availability,
    url: url,
    rawData: {
      htmlLength: html.length,
      title: title,
      hasPrice: price !== 'Price not found' && price !== '$',
      hasImage: image !== '' && !image.includes('sprite'),
      hasDescription: description !== 'Description not found'
    }
  };
}
