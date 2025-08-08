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

    // Extract price with comprehensive patterns
    let price = 'Price not found';
    const pricePatterns = [
      // JSON patterns
      /"price":\s*"([^"]+)"/g,
      /"priceAmount":\s*"([^"]+)"/g,
      /"currentPrice":\s*"([^"]+)"/g,
      /"priceCurrency":\s*"USD"[^}]*"price":\s*"([^"]+)"/g,
      
      // Data attribute patterns
      /data-price="([^"]+)"/g,
      /data-asin-price="([^"]+)"/g,
      
      // HTML patterns
      /<span[^>]*class="[^"]*price[^"]*"[^>]*>([^<]+)<\/span>/gi,
      /<span[^>]*class="[^"]*a-price[^"]*"[^>]*>([^<]+)<\/span>/gi,
      /<div[^>]*class="[^"]*price[^"]*"[^>]*>([^<]+)<\/div>/gi,
      /<div[^>]*class="[^"]*a-price[^"]*"[^>]*>([^<]+)<\/div>/gi,
      
      // General price patterns
      /\$[\d,]+\.?\d*/g,
      /Price:\s*\$[\d,]+\.?\d*/g,
      /[\d,]+\.?\d*\s*USD/g
    ];

    for (const pattern of pricePatterns) {
      const matches = html.match(pattern);
      if (matches && matches.length > 0) {
        for (const match of matches) {
          const cleanPrice = match.replace(/[^\d.,$]/g, '').trim();
          if (cleanPrice && cleanPrice !== '$' && cleanPrice.length > 1) {
            price = cleanPrice;
            break;
          }
        }
        if (price !== 'Price not found') break;
      }
    }

    // Extract image
    let image = '';
    const imagePatterns = [
      // JSON patterns
      /"image":\s*"([^"]*\.(?:jpg|jpeg|png|webp))"/g,
      /"imageUrl":\s*"([^"]*\.(?:jpg|jpeg|png|webp))"/g,
      
      // HTML patterns
      /<img[^>]*src=["']([^"']*images[^"']*\.(?:jpg|jpeg|png|webp))["'][^>]*>/i,
      /<img[^>]*src=["']([^"']*product[^"']*\.(?:jpg|jpeg|png|webp))["'][^>]*>/i,
      /<img[^>]*src=["']([^"']*media-amazon[^"']*\.(?:jpg|jpeg|png|webp))["'][^>]*>/i,
      /<img[^>]*data-src=["']([^"']*images[^"']*\.(?:jpg|jpeg|png|webp))["'][^>]*>/i,
      
      // Meta patterns
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i
    ];

    for (const pattern of imagePatterns) {
      const match = html.match(pattern);
      if (match) {
        image = match[1];
        if (image && !image.includes('sprite') && !image.includes('icon') && !image.includes('nav') && !image.includes('logo')) {
          break;
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
