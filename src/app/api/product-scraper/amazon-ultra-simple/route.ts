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
    console.log('Amazon Ultra Simple scraper for URL:', url);

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Extract ASIN from URL
    const asinMatch = url.match(/\/dp\/([A-Z0-9]{10})/);
    const asin = asinMatch ? asinMatch[1] : null;
    
    if (!asin) {
      return NextResponse.json({ error: 'Could not extract ASIN from URL' }, { status: 400 });
    }

    // Try multiple user agents and approaches
    const approaches = [
      {
        name: 'Mobile Safari',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1.2 Mobile/15E148 Safari/604.1',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        }
      },
      {
        name: 'Desktop Chrome',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"Windows"',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1'
        }
      },
      {
        name: 'Clean ASIN URL',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        },
        url: `https://www.amazon.com/dp/${asin}`
      }
    ];

    let html = '';
    let successfulApproach = '';

    // Try each approach
    for (const approach of approaches) {
      try {
        console.log(`Trying approach: ${approach.name}`);
        
        const targetUrl = approach.url || url;
        const response = await fetch(targetUrl, {
          headers: {
            'User-Agent': approach.userAgent,
            ...(approach.headers as Record<string, string>)
          }
        });

        if (response.ok) {
          html = await response.text();
          successfulApproach = approach.name;
          console.log(`Success with ${approach.name}, HTML length:`, html.length);
          break;
        }
      } catch (error) {
        console.log(`Failed with ${approach.name}:`, error);
        continue;
      }
    }

    if (!html) {
      throw new Error('Failed to fetch page with any approach');
    }

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    let title = titleMatch ? titleMatch[1].trim() : 'Product name not found';
    
    // Clean up title
    if (title.includes('Amazon.com')) {
      title = title.replace(/Amazon\.com[:\s]*/, '').trim();
    }

    // Extract price with refined patterns that filter out volume/weight info
    let price = 'Price not found';
    
    // Helper function to validate price (exclude volume/weight measurements)
    const isValidPrice = (priceText: string): boolean => {
      const lowerText = priceText.toLowerCase();
      // Exclude common volume/weight measurements
      const volumePatterns = [
        /fl\s*oz/i, /fluid\s*ounce/i, /ml/i, /milliliter/i, /liter/i, /l\b/i,
        /gram/i, /g\b/i, /ounce/i, /oz\b/i, /pound/i, /lb\b/i, /kg/i, /kilogram/i,
        /cup/i, /tablespoon/i, /tbsp/i, /teaspoon/i, /tsp/i, /serving/i, /capsule/i,
        /tablet/i, /pill/i, /softgel/i, /gummy/i, /drop/i, /spray/i
      ];
      
      // Check if text contains volume/weight measurements
      for (const pattern of volumePatterns) {
        if (pattern.test(lowerText)) {
          return false;
        }
      }
      
      // Must look like a price (starts with $ and has numbers)
      return /^\$[\d,]+\.?\d*$/.test(priceText.trim());
    };

    // Priority 1: Amazon-specific price classes (most reliable)
    const amazonPriceSelectors = [
      /<span[^>]*class="[^"]*a-price-whole[^"]*"[^>]*>([^<]+)<\/span>/gi,
      /<span[^>]*class="[^"]*a-price-fraction[^"]*"[^>]*>([^<]+)<\/span>/gi,
      /<span[^>]*class="[^"]*a-price[^"]*"[^>]*>([^<]+)<\/span>/gi,
      /<div[^>]*class="[^"]*a-price[^"]*"[^>]*>([^<]+)<\/div>/gi,
      /<span[^>]*class="[^"]*price[^"]*"[^>]*>([^<]+)<\/span>/gi,
      /<div[^>]*class="[^"]*price[^"]*"[^>]*>([^<]+)<\/div>/gi
    ];

    // Priority 2: JSON data patterns
    const jsonPricePatterns = [
      /"price":\s*"([^"]+)"/g,
      /"priceAmount":\s*"([^"]+)"/g,
      /"currentPrice":\s*"([^"]+)"/g,
      /"priceCurrency":\s*"USD"[^}]*"price":\s*"([^"]+)"/g,
      /"price":\s*(\d+\.?\d*)/g,
      /"priceAmount":\s*(\d+\.?\d*)/g
    ];

    // Priority 3: Data attributes
    const dataPricePatterns = [
      /data-price="([^"]+)"/g,
      /data-asin-price="([^"]+)"/g
    ];

    // Try Amazon-specific selectors first (most reliable)
    for (const selector of amazonPriceSelectors) {
      const matches = html.match(selector);
      if (matches && matches.length > 0) {
        for (const match of matches) {
          // Extract the content between tags
          const contentMatch = match.match(/>([^<]+)</);
          if (contentMatch) {
            const content = contentMatch[1].trim();
            // Look for price patterns in the content
            const priceMatches = content.match(/\$[\d,]+\.?\d*/g);
            if (priceMatches) {
              for (const priceMatch of priceMatches) {
                if (isValidPrice(priceMatch)) {
                  price = priceMatch;
                  console.log(`Found valid price via Amazon selector: ${price}`);
                  break;
                }
              }
            }
          }
          if (price !== 'Price not found') break;
        }
        if (price !== 'Price not found') break;
      }
    }

    // If no price found via selectors, try JSON patterns
    if (price === 'Price not found') {
      for (const pattern of jsonPricePatterns) {
        const matches = html.match(pattern);
        if (matches && matches.length > 0) {
          for (const match of matches) {
            let extractedPrice = match;
            // If it's a JSON pattern with quotes, extract the value
            if (match.includes('"')) {
              const valueMatch = match.match(/"([^"]+)"/);
              if (valueMatch) {
                extractedPrice = valueMatch[1];
              }
            }
            
            // Format as price if it's just a number
            if (/^\d+\.?\d*$/.test(extractedPrice)) {
              extractedPrice = `$${extractedPrice}`;
            }
            
            if (isValidPrice(extractedPrice)) {
              price = extractedPrice;
              console.log(`Found valid price via JSON: ${price}`);
              break;
            }
          }
          if (price !== 'Price not found') break;
        }
      }
    }

    // If still no price, try data attributes
    if (price === 'Price not found') {
      for (const pattern of dataPricePatterns) {
        const matches = html.match(pattern);
        if (matches && matches.length > 0) {
          for (const match of matches) {
            const valueMatch = match.match(/"([^"]+)"/);
            if (valueMatch) {
              const extractedPrice = valueMatch[1];
              if (isValidPrice(extractedPrice)) {
                price = extractedPrice;
                console.log(`Found valid price via data attribute: ${price}`);
                break;
              }
            }
          }
          if (price !== 'Price not found') break;
        }
      }
    }

    // Final fallback: look for any $XX.XX pattern that passes validation
    if (price === 'Price not found') {
      const allPriceMatches = html.match(/\$[\d,]+\.?\d*/g);
      if (allPriceMatches) {
        for (const match of allPriceMatches) {
          if (isValidPrice(match)) {
            price = match;
            console.log(`Found valid price via fallback: ${price}`);
            break;
          }
        }
      }
    }

    // Extract image with better filtering for actual product images
    let image = '';
    
    // Helper function to validate image URL (exclude sprites, icons, nav elements)
    const isValidProductImage = (imageUrl: string): boolean => {
      const lowerUrl = imageUrl.toLowerCase();
      
      // Exclude common non-product image patterns
      const excludePatterns = [
        /sprite/i, /icon/i, /nav/i, /logo/i, /button/i, /banner/i, /header/i, /footer/i,
        /arrow/i, /star/i, /check/i, /close/i, /menu/i, /search/i, /cart/i, /user/i,
        /social/i, /share/i, /play/i, /pause/i, /volume/i, /fullscreen/i, /loading/i,
        /placeholder/i, /default/i, /no-image/i, /error/i, /404/i, /blank/i, /empty/i
      ];
      
      // Check if URL contains excluded patterns
      for (const pattern of excludePatterns) {
        if (pattern.test(lowerUrl)) {
          return false;
        }
      }
      
      // Must be a valid image URL with proper extension
      return /\.(jpg|jpeg|png|webp|gif)$/i.test(imageUrl) && 
             imageUrl.includes('media-amazon.com') &&
             !imageUrl.includes('sprite') &&
             imageUrl.length > 50; // Reasonable length for product image URLs
    };

    // Priority 1: Amazon product image data attributes (most reliable)
    const productImageSelectors = [
      /data-old-hires="([^"]*\.(?:jpg|jpeg|png|webp))"/gi,
      /data-a-dynamic-image="([^"]*\.(?:jpg|jpeg|png|webp))"/gi,
      /data-a-image-name="([^"]*\.(?:jpg|jpeg|png|webp))"/gi
    ];

    // Priority 2: JSON patterns for product images
    const jsonImagePatterns = [
      /"largeImage":\s*"([^"]*\.(?:jpg|jpeg|png|webp))"/g,
      /"mainImage":\s*"([^"]*\.(?:jpg|jpeg|png|webp))"/g,
      /"image":\s*"([^"]*\.(?:jpg|jpeg|png|webp))"/g,
      /"imageUrl":\s*"([^"]*\.(?:jpg|jpeg|png|webp))"/g,
      /"primaryImage":\s*"([^"]*\.(?:jpg|jpeg|png|webp))"/g
    ];

    // Priority 3: HTML img tags with product-specific classes
    const htmlImagePatterns = [
      /<img[^>]*class="[^"]*a-dynamic-image[^"]*"[^>]*src=["']([^"']*\.(?:jpg|jpeg|png|webp))["'][^>]*>/gi,
      /<img[^>]*class="[^"]*product-image[^"]*"[^>]*src=["']([^"']*\.(?:jpg|jpeg|png|webp))["'][^>]*>/gi,
      /<img[^>]*id="[^"]*landingImage[^"]*"[^>]*src=["']([^"']*\.(?:jpg|jpeg|png|webp))["'][^>]*>/gi,
      /<img[^>]*data-old-hires="[^"]*"[^>]*src=["']([^"']*\.(?:jpg|jpeg|png|webp))["'][^>]*>/gi
    ];

    // Priority 4: Meta tags for product images
    const metaImagePatterns = [
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*\.(?:jpg|jpeg|png|webp))["']/gi,
      /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']*\.(?:jpg|jpeg|png|webp))["']/gi
    ];

    // Try product image selectors first (most reliable)
    for (const selector of productImageSelectors) {
      const matches = html.match(selector);
      if (matches && matches.length > 0) {
        for (const match of matches) {
          const valueMatch = match.match(/"([^"]+)"/);
          if (valueMatch) {
            const imageUrl = valueMatch[1];
            if (isValidProductImage(imageUrl)) {
              image = imageUrl;
              console.log(`Found valid product image via selector: ${image}`);
              break;
            }
          }
        }
        if (image !== '') break;
      }
    }

    // If no image found via selectors, try JSON patterns
    if (image === '') {
      for (const pattern of jsonImagePatterns) {
        const matches = html.match(pattern);
        if (matches && matches.length > 0) {
          for (const match of matches) {
            const valueMatch = match.match(/"([^"]+)"/);
            if (valueMatch) {
              const imageUrl = valueMatch[1];
              if (isValidProductImage(imageUrl)) {
                image = imageUrl;
                console.log(`Found valid product image via JSON: ${image}`);
                break;
              }
            }
          }
          if (image !== '') break;
        }
      }
    }

    // If still no image, try HTML patterns
    if (image === '') {
      for (const pattern of htmlImagePatterns) {
        const matches = html.match(pattern);
        if (matches && matches.length > 0) {
          for (const match of matches) {
            const srcMatch = match.match(/src=["']([^"']+)["']/);
            if (srcMatch) {
              const imageUrl = srcMatch[1];
              if (isValidProductImage(imageUrl)) {
                image = imageUrl;
                console.log(`Found valid product image via HTML: ${image}`);
                break;
              }
            }
          }
          if (image !== '') break;
        }
      }
    }

    // If still no image, try meta patterns
    if (image === '') {
      for (const pattern of metaImagePatterns) {
        const matches = html.match(pattern);
        if (matches && matches.length > 0) {
          for (const match of matches) {
            const contentMatch = match.match(/content=["']([^"']+)["']/);
            if (contentMatch) {
              const imageUrl = contentMatch[1];
              if (isValidProductImage(imageUrl)) {
                image = imageUrl;
                console.log(`Found valid product image via meta: ${image}`);
                break;
              }
            }
          }
          if (image !== '') break;
        }
      }
    }

    // Final fallback: look for any media-amazon image that passes validation
    if (image === '') {
      const allImageMatches = html.match(/https:\/\/[^"']*media-amazon[^"']*\.(?:jpg|jpeg|png|webp)/gi);
      if (allImageMatches) {
        for (const match of allImageMatches) {
          if (isValidProductImage(match)) {
            image = match;
            console.log(`Found valid product image via fallback: ${image}`);
            break;
          }
        }
      }
    }

    // Extract description
    let description = 'Description not found';
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) || 
                     html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i);
    if (descMatch) {
      description = descMatch[1];
    }

    // Extract availability
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

    const result: ScrapedProduct = {
      name: title,
      price: price,
      image: image,
      description: description,
      availability: availability,
      url: url,
      rawData: {
        htmlLength: html.length,
        title: title,
        hasPrice: price !== 'Price not found',
        hasImage: image !== '',
        hasDescription: description !== 'Description not found',
        method: 'Ultra Simple',
        successfulApproach: successfulApproach,
        asin: asin
      }
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Amazon Ultra Simple scraper error:', error);
    return NextResponse.json({
      error: `Amazon Ultra Simple scraper failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}
