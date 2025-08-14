import { NextRequest, NextResponse } from 'next/server';

interface ScrapedProduct {
  name: string;
  price: string;
  image: string;
  description: string;
  url: string;
  rawData: any;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    if (typeof url !== 'string') {
      return NextResponse.json({ error: 'URL must be a string' }, { status: 400 });
    }

    // Validate URL is from Target
    if (!url.includes('target.com')) {
      return NextResponse.json({ error: 'URL must be from Target' }, { status: 400 });
    }

    // Fetch with Target-specific headers
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
    console.log('🔍 HTML length received:', html.length);
    
    // Debug: Search for the exact price we're looking for
    if (html.includes('$18.19')) {
      console.log('✅ Found $18.19 in HTML');
      const priceIndex = html.indexOf('$18.19');
      const context = html.substring(Math.max(0, priceIndex - 200), priceIndex + 200);
      console.log('Context around $18.19:', context);
    } else {
      console.log('❌ $18.19 NOT found in HTML');
    }
    
    // Debug: Search for data-test="product-price" elements
    const allProductPriceElements = html.match(/data-test="product-price"[^>]*>/gi) || [];
    console.log(`Found ${allProductPriceElements.length} data-test="product-price" elements:`, allProductPriceElements.slice(0, 3));
    
    // Debug: Search for "About this item" section
    if (html.includes('About this item')) {
      console.log('✅ Found "About this item" in HTML');
      const aboutIndex = html.indexOf('About this item');
      const context = html.substring(Math.max(0, aboutIndex - 100), aboutIndex + 300);
      console.log('Context around "About this item":', context);
    } else {
      console.log('❌ "About this item" NOT found in HTML');
    }
    
    // Debug: Search for all price patterns
    const allPricePatterns = html.match(/\$[\d,]+\.?\d*/g) || [];
    console.log(`Found ${allPricePatterns.length} total price patterns:`, allPricePatterns.slice(0, 10));

    // Extract product name from title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    let name = titleMatch ? titleMatch[1].trim() : 'Product name not found';
    
    // Clean up Target title
    if (name.includes('Target')) {
      name = name.replace(/Target[:\s]*/, '').trim();
    }

    // Extract price with refined Target-specific patterns
    let price = 'Price not found';
    
    // Pattern 1: Look for price in structured data (most reliable)
    const structuredDataMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i);
    if (structuredDataMatch) {
      try {
        const jsonData = JSON.parse(structuredDataMatch[1]);
        if (jsonData.offers && jsonData.offers.price) {
          price = `$${jsonData.offers.price}`;
        }
      } catch (e) {
        // JSON parse failed, continue to next pattern
      }
    }
    
    // Pattern 2: Look for price in specific Target price elements (most reliable for Target)
    if (price === 'Price not found') {
      console.log('🔍 Trying Pattern 2: data-test="product-price"');
      const targetPriceMatch = html.match(/<span[^>]*data-test="product-price"[^>]*>([^<]*)<\/span>/i);
      if (targetPriceMatch) {
        console.log('✅ Found data-test="product-price" element:', targetPriceMatch[0]);
        const priceText = targetPriceMatch[1];
        console.log('Price text content:', priceText);
        const priceMatch = priceText.match(/\$([\d,]+\.?\d*)/);
        if (priceMatch) {
          price = `$${priceMatch[1]}`;
          console.log(`✅ Found price via data-test="product-price": ${price}`);
        } else {
          console.log('❌ No price pattern found in data-test="product-price" content');
        }
      } else {
        console.log('❌ No data-test="product-price" elements found');
        // Debug: search for any elements with data-test="product-price"
        const allProductPriceElements = html.match(/data-test="product-price"[^>]*>/gi) || [];
        console.log(`Found ${allProductPriceElements.length} data-test="product-price" elements:`, allProductPriceElements.slice(0, 3));
      }
    }
    
         // Pattern 2.5: Smart price detection - find the real product price among decoys
     if (price === 'Price not found') {
       console.log('🔍 Trying Pattern 2.5: Smart price detection');
       
       // Get all price patterns and filter intelligently
       const allPriceMatches = html.match(/\$[\d,]+\.?\d*/g) || [];
       console.log('All price patterns found:', allPriceMatches);
       
       // Filter out obvious non-product prices
       const filteredPrices = allPriceMatches.filter(p => {
         const priceValue = parseFloat(p.replace('$', ''));
         return priceValue > 1 && priceValue < 500 && // More inclusive range for books, supplements, etc.
                !p.includes('shipping') && 
                !p.includes('free') &&
                !p.includes('per serving') &&
                !p.includes('Fl Oz') &&
                !p.includes('oz') &&
                !p.includes('minimum') &&
                !p.includes('order');
       });
       
       console.log('Filtered prices:', filteredPrices);
       
       if (filteredPrices.length > 0) {
         // Find unique prices (appear only once) - these are likely real
         const uniquePrices = filteredPrices.filter(price => {
           const count = allPriceMatches.filter(p => p === price).length;
           return count === 1; // Only appears once
         });
         
         console.log('Unique prices found:', uniquePrices);
         
         if (uniquePrices.length === 2) {
           // Two unique prices found - choose the lower one (current selling price)
           const price1 = parseFloat(uniquePrices[0].replace('$', ''));
           const price2 = parseFloat(uniquePrices[1].replace('$', ''));
           price = price1 < price2 ? uniquePrices[0] : uniquePrices[1];
           console.log(`✅ Two unique prices found: ${uniquePrices[0]} and ${uniquePrices[1]}, using lower: ${price}`);
         } else if (uniquePrices.length === 1) {
           // One unique price found
           price = uniquePrices[0];
           console.log(`✅ One unique price found: ${price}`);
         } else {
           // No unique prices - try the .99 pricing rule
           console.log('🔍 No unique prices found, trying .99 pricing rule');
           const dot99Prices = filteredPrices.filter(p => 
             p.endsWith('.99') && 
             !p.includes('shipping') && 
             !p.includes('return') &&
             !p.includes('policy')
           );
           
           if (dot99Prices.length > 0) {
             // Use the lowest .99 price (most likely real)
             const sortedDot99Prices = dot99Prices.sort((a, b) => 
               parseFloat(a.replace('$', '')) - parseFloat(b.replace('$', ''))
             );
             price = sortedDot99Prices[0];
             console.log(`✅ Using .99 pricing rule: ${price} (lowest of ${dot99Prices.length} .99 prices)`);
           } else {
             // No .99 prices either - fallback to first reasonable price
             price = filteredPrices[0];
             console.log(`⚠️ No unique or .99 prices found, using first reasonable price: ${price}`);
           }
         }
       }
     }
    
    // Pattern 3: Look for price in product data attributes
    if (price === 'Price not found') {
      const priceDataMatch = html.match(/data-price="\$([\d,]+\.?\d*)"/i);
      if (priceDataMatch) {
        price = `$${priceDataMatch[1]}`;
      }
    }
    
    // Pattern 4: Look for price in product details section
    if (price === 'Price not found') {
      const productDetailsMatch = html.match(/<div[^>]*class="[^"]*product-details[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
      if (productDetailsMatch) {
        const priceMatch = productDetailsMatch[1].match(/\$([\d,]+\.?\d*)/);
        if (priceMatch) {
          price = `$${priceMatch[1]}`;
        }
      }
    }
    
    // Pattern 5: Filtered general price fallback
    if (price === 'Price not found') {
      const allPriceMatches = html.match(/\$[\d,]+\.?\d*/g) || [];
      const filteredPrices = allPriceMatches.filter(p => {
        const priceValue = parseFloat(p.replace('$', ''));
        return priceValue > 5 && priceValue < 200 && 
               !p.includes('shipping') && 
               !p.includes('free') &&
               !p.includes('per serving') &&
               !p.includes('Fl Oz') &&
               !p.includes('oz');
      });
      
      if (filteredPrices.length > 0) {
        filteredPrices.sort((a, b) => {
          const aVal = parseFloat(a.replace('$', ''));
          const bVal = parseFloat(b.replace('$', ''));
          return aVal - bVal;
        });
        price = filteredPrices[0];
      }
    }

    // Extract image with comprehensive filtering for Target
    let image = '';
    
    // Helper function to fix Target image URLs
    const fixTargetImageUrl = (imageUrl: string): string => {
      if (imageUrl.startsWith('http')) {
        return imageUrl;
      }
      if (imageUrl.startsWith('//')) {
        return `https:${imageUrl}`;
      }
      if (imageUrl.startsWith('/')) {
        return `https://www.target.com${imageUrl}`;
      }
      return `https://www.target.com/${imageUrl}`;
    };
    
    // Pattern 1: Target-specific product images (most reliable)
    const targetProductImageMatch = html.match(/<img[^>]*src=["']([^"']*target\.scene7\.com[^"']*)["'][^>]*alt=["'][^"']*1 of [^"']*["'][^>]*>/i);
    if (targetProductImageMatch) {
      const candidateImage = targetProductImageMatch[1];
      if (!candidateImage.toLowerCase().includes('logo') && 
          !candidateImage.toLowerCase().includes('banner') &&
          !candidateImage.toLowerCase().includes('nav')) {
        image = fixTargetImageUrl(candidateImage);
      }
    }
    
    // Pattern 2: Target product images with width placeholder
    if (!image) {
      const productImageMatch = html.match(/<img[^>]*src=["']([^"']*\{width\}[^"']*)["'][^>]*>/i);
      if (productImageMatch) {
        const candidateImage = productImageMatch[1].replace('{width}', '500');
        if (!candidateImage.toLowerCase().includes('logo') && 
            !candidateImage.toLowerCase().includes('banner') &&
            !candidateImage.toLowerCase().includes('nav')) {
          image = fixTargetImageUrl(candidateImage);
        }
      }
    }
    
    // Pattern 3: Smart filtering - exclude obvious non-product images
    if (!image) {
      const allImages = html.match(/<img[^>]*src=["']([^"']*)["'][^>]*>/g) || [];
      const imageUrls = allImages.map(img => {
        const srcMatch = img.match(/src=["']([^"']*)["']/);
        return srcMatch ? srcMatch[1] : '';
      }).filter(src => src);
      
      const filteredCandidates = imageUrls.filter(imgUrl => {
        const lowerUrl = imgUrl.toLowerCase();
        return !lowerUrl.includes('logo') && 
               !lowerUrl.includes('sprite') && 
               !lowerUrl.includes('sprites') &&
               !lowerUrl.includes('icon') &&
               !lowerUrl.includes('nav') &&
               !lowerUrl.includes('banner') &&
               !lowerUrl.includes('ad') &&
               !lowerUrl.includes('promo') &&
               !lowerUrl.includes('marketing') &&
               !lowerUrl.includes('hero') &&
               !lowerUrl.includes('carousel');
      });
      
      if (filteredCandidates.length > 0) {
        image = fixTargetImageUrl(filteredCandidates[0]);
      }
    }

    // Extract description with refined targeting for "About this item" section
    let description = 'Description not found';
    
    // Pattern 1: Look for "About this item" section specifically
    const aboutItemMatch = html.match(/<h2[^>]*>About this item<\/h2>([\s\S]*?)(?=<h2|<\/section|<\/div>)/i);
    if (aboutItemMatch) {
      const cleanDesc = aboutItemMatch[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      if (cleanDesc && cleanDesc.length > 20) {
        description = cleanDesc.substring(0, 500); // Limit length
        console.log('✅ Found description via "About this item" section');
      }
    }
    
    // Pattern 1.5: Look for "About this item" with more flexible matching
    if (description === 'Description not found') {
      console.log('🔍 Trying Pattern 1.5: Flexible "About this item" matching');
      const aboutItemFlexible = html.match(/About this item[^<]*<\/h2>([\s\S]*?)(?=<h2|<\/section|<\/div>|<\/main>)/i);
      if (aboutItemFlexible) {
        const cleanDesc = aboutItemFlexible[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        if (cleanDesc && cleanDesc.length > 20) {
          description = cleanDesc.substring(0, 500);
          console.log('✅ Found description via flexible "About this item" matching');
        }
      }
    }
    
    // Pattern 2: Look for product description in structured data
    if (description === 'Description not found' && structuredDataMatch) {
      try {
        const jsonData = JSON.parse(structuredDataMatch[1]);
        if (jsonData.description) {
          description = jsonData.description;
        }
      } catch (e) {
        // JSON parse failed, continue to next pattern
      }
    }
    
    // Pattern 3: Look for meta description
    if (description === 'Description not found') {
      const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
      if (metaDescMatch) {
        description = metaDescMatch[1];
      }
    }
    
    // Pattern 4: Look for any meaningful text content near the product
    if (description === 'Description not found') {
      const contentMatch = html.match(/<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
                          html.match(/<section[^>]*class="[^"]*product[^"]*"[^>]*>([\s\S]*?)<\/section>/i);
      if (contentMatch) {
        const cleanDesc = contentMatch[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        if (cleanDesc && cleanDesc.length > 30) {
          description = cleanDesc.substring(0, 300);
        }
      }
    }

    const result: ScrapedProduct = {
      name,
      price,
      image,
      description,
      url,
      rawData: {
        htmlLength: html.length,
        name,
        hasPrice: price !== 'Price not found',
        hasImage: image !== '',
        hasDescription: description !== 'Description not found',
        method: 'Target Refined',
        url,
        debug: {
          foundPrice18_19: html.includes('$18.19'),
          foundDataTestProductPrice: html.includes('data-test="product-price"'),
          foundAboutThisItem: html.includes('About this item'),
          totalPricePatterns: (html.match(/\$[\d,]+\.?\d*/g) || []).length,
          pricePatterns: (html.match(/\$[\d,]+\.?\d*/g) || []).slice(0, 10),
          dataTestElements: (html.match(/data-test="product-price"[^>]*>/gi) || []).slice(0, 3)
        }
      }
    };

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Target Refined scraper error:', error);
    return NextResponse.json({
      error: `Target Refined scraper failed: ${error.message}`
    }, { status: 500 });
  }
}
