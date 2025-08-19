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
  let title = titleMatch ? titleMatch[1].trim() : 'Product name not found';

  // Decode HTML entities for cleaner product names
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
  title = decodeHtmlEntities(title);

  // Extract price - try multiple patterns for Amazon mobile
  let price = 'Price not found';
  
  // WISE WOMAN HERBALS SPECIFIC: Check if this is Wise Woman Herbals first
  const isWiseWomanHerbals = url.includes('wisewomanherbals.com');
  
  if (isWiseWomanHerbals) {
    console.log('Wise Woman Herbals detected, using site-specific price extraction...');
    
    // Wise Woman Herbals-specific price selectors (from HTML analysis)
    const wiseWomanPricePatterns = [
      // Primary: Sale price if different from regular
      /<span[^>]*class="[^"]*f-price-item--sale[^"]*"[^>]*>([^<]+)<\/span>/i,
      // Fallback: Regular price
      /<span[^>]*class="[^"]*f-price-item--regular[^"]*"[^>]*>([^<]+)<\/span>/i,
      // Alternative: Price container
      /<div[^>]*class="[^"]*f-price__regular[^"]*"[^>]*>.*?<span[^>]*class="[^"]*f-price-item[^"]*"[^>]*>([^<]+)<\/span>/is,
      // Generic: Any f-price-item class
      /<span[^>]*class="[^"]*f-price-item[^"]*"[^>]*>([^<]+)<\/span>/i
    ];
    
    for (const pattern of wiseWomanPricePatterns) {
      const match = html.match(pattern);
      if (match) {
        const extractedPrice = match[1] || match[0];
        // Clean up the price - keep dollar sign and numbers
        const cleanedPrice = extractedPrice.replace(/[^\d.,$]/g, '').trim();
        if (cleanedPrice && cleanedPrice !== '$') {
          price = cleanedPrice;
          console.log('Wise Woman Herbals: Found price using pattern:', pattern.source, 'Price:', price);
          break;
        }
      }
    }
    
    if (price === 'Price not found') {
      console.log('Wise Woman Herbals: No price found with site-specific patterns, falling back to generic patterns');
    }
  }
  
  // Generic price patterns for all other sites (unchanged)
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
  
  // Only run generic patterns if Wise Woman Herbals patterns didn't find a price
  if (price === 'Price not found') {
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
  }

  // Extract image URL - try multiple patterns for Amazon mobile
  let image = '';
  const imagePatterns = [
    // NATURE'S ANSWER SPECIFIC: Target data-src attributes first (original uploads)
    /<img[^>]*data-src=["']([^"']*naturesanswer\.com\/wp-content\/uploads[^"']*\.(?:jpg|jpeg|png))["'][^>]*>/i,
    // NATURE'S ANSWER SPECIFIC: Target direct uploads, reject CDN
    /<img[^>]*src=["']([^"']*naturesanswer\.com\/wp-content\/uploads[^"']*\.(?:jpg|jpeg|png))["'][^>]*>/i,
    // Look for product images in various formats
    /<img[^>]*src=["']([^"']*images[^"']*\.(?:jpg|jpeg|png|webp))["'][^>]*>/i,
    /<img[^>]*src=["']([^"']*product[^"']*\.(?:jpg|jpeg|png|webp))["'][^>]*>/i,
    /<img[^>]*src=["']([^"']*media-amazon[^"']*\.(?:jpg|jpeg|png|webp))["'][^>]*>/i,
    // Look for data-src attributes (lazy loading) - GENERAL PATTERN
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
  
  // AGGRESSIVE CDN REJECTION: Check if this is Nature's Answer first
  const isNaturesAnswer = url.includes('naturesanswer.com');
  
  if (isNaturesAnswer) {
    console.log('Nature\'s Answer detected, using aggressive image extraction...');
  }
  
  for (const pattern of imagePatterns) {
    const match = html.match(pattern);
    if (match) {
      const potentialImage = match[1];
      console.log('Pattern matched, potential image:', potentialImage);
      
      // FIX URL PREFIXES IMMEDIATELY: Ensure proper https:// prefix
      let fixedImage = potentialImage;
      if (fixedImage && fixedImage.startsWith('//')) {
        fixedImage = 'https:' + fixedImage;
        console.log('Fixed protocol-relative URL:', fixedImage);
      } else if (fixedImage && fixedImage.startsWith('/')) {
        // Handle relative URLs by adding the base domain
        const urlObj = new URL(url);
        fixedImage = urlObj.protocol + '//' + urlObj.host + fixedImage;
        console.log('Fixed relative URL:', fixedImage);
      }
      
      // FOR NATURE'S ANSWER: Smart CDN rejection
      if (isNaturesAnswer) {
        // MUST be direct upload, NO CDN allowed
        if (fixedImage && 
            fixedImage.includes('naturesanswer.com') &&
            !fixedImage.includes('spcdn.shortpixel.ai') &&
            !fixedImage.includes('cdn.') &&
            !fixedImage.includes('static.') &&
            !fixedImage.includes('assets.') &&
            !fixedImage.includes('sprite') && 
            !fixedImage.includes('icon') && 
            !fixedImage.includes('nav') && 
            !fixedImage.includes('logo') &&
            !fixedImage.includes('favicon')) {
          image = fixedImage;
          console.log('Nature\'s Answer: Found direct upload image:', image);
          break;
        } else {
          console.log('Nature\'s Answer: Image rejected:', fixedImage);
        }
      } else {
        // FOR OTHER SITES: Standard filtering
        if (fixedImage && 
            !fixedImage.includes('sprite') && 
            !fixedImage.includes('icon') && 
            !fixedImage.includes('nav') && 
            !fixedImage.includes('logo') &&
            !fixedImage.includes('favicon') &&
            !fixedImage.includes('cdn.') &&
            !fixedImage.includes('static.') &&
            !fixedImage.includes('assets.')) {
          image = fixedImage;
          break;
        }
      }
    }
  }

  // If no image found for Nature's Answer, try a more lenient approach
  if (isNaturesAnswer && !image) {
    console.log('Nature\'s Answer: No direct upload found, trying fallback...');
    // Look for ANY image that contains naturesanswer.com but isn't CDN
    const fallbackMatch = html.match(/<img[^>]*src=["']([^"']*naturesanswer\.com[^"']*\.(?:jpg|jpeg|png))["'][^>]*>/i);
    if (fallbackMatch) {
      const fallbackImage = fallbackMatch[1];
      console.log('Fallback match found:', fallbackImage);
      if (fallbackImage && !fallbackImage.includes('spcdn.shortpixel.ai')) {
        image = fallbackImage;
        console.log('Nature\'s Answer: Found fallback image:', fallbackImage);
      } else {
        console.log('Fallback image rejected (CDN):', fallbackImage);
      }
    } else {
      console.log('No fallback match found');
    }
  }

  // FINAL FALLBACK: If still no image for Nature's Answer, try ANY image
  if (isNaturesAnswer && !image) {
    console.log('Nature\'s Answer: Trying final fallback - any image...');
    const finalFallback = html.match(/<img[^>]*src=["']([^"']*\.(?:jpg|jpeg|png))["'][^>]*>/i);
    if (finalFallback) {
      const finalImage = finalFallback[1];
      console.log('Final fallback found:', finalImage);
      if (finalImage && !finalImage.includes('spcdn.shortpixel.ai')) {
        image = finalImage;
        console.log('Nature\'s Answer: Using final fallback image:', finalImage);
      }
    }
  }

  // ULTIMATE FALLBACK: For Nature's Answer, if no images found, create a placeholder
  if (isNaturesAnswer && !image) {
    console.log('Nature\'s Answer: No images found, creating placeholder...');
    image = 'https://www.naturesanswer.com/wp-content/uploads/placeholder-product.jpg';
    console.log('Nature\'s Answer: Using placeholder image:', image);
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
      hasDescription: description !== 'Description not found',
      // Wise Woman Herbals specific debug info
      isWiseWomanHerbals: isWiseWomanHerbals,
      priceExtractionMethod: isWiseWomanHerbals ? 'Wise Woman Herbals-specific patterns' : 'Generic patterns'
    }
  };
}
