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
    console.log('Amazon Simple Fallback scraper for URL:', url);

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Use multiple user agents to try to bypass blocks
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1.2 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ];

    let html = '';
    let success = false;

    // Try each user agent until one works
    for (const userAgent of userAgents) {
      try {
        console.log('Trying user agent:', userAgent.substring(0, 50) + '...');
        
        const response = await fetch(url, {
          headers: {
            'User-Agent': userAgent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Cache-Control': 'max-age=0',
            'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Windows"',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1'
          }
        });

        if (response.ok) {
          html = await response.text();
          console.log('Success with user agent, HTML length:', html.length);
          success = true;
          break;
        }
      } catch (error) {
        console.log('Failed with user agent:', error);
        continue;
      }
    }

    if (!success || !html) {
      throw new Error('Failed to fetch page with any user agent');
    }

    // Extract data using regex patterns
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    let title = titleMatch ? titleMatch[1].trim() : 'Product name not found';

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
    title = decodeHtmlEntities(title);

    // Try multiple price patterns
    let price = 'Price not found';
    const pricePatterns = [
      /\$[\d,]+\.?\d*/g,
      /Price:\s*\$[\d,]+\.?\d*/g,
      /[\d,]+\.?\d*\s*USD/g,
      /[\d,]+\.?\d*\s*dollars/g,
      /"price":\s*"([^"]+)"/g,
      /"priceAmount":\s*"([^"]+)"/g,
      /"currentPrice":\s*"([^"]+)"/g,
      /data-price="([^"]+)"/g,
      /data-asin-price="([^"]+)"/g,
      /<span[^>]*class="[^"]*price[^"]*"[^>]*>([^<]+)<\/span>/gi,
      /<span[^>]*class="[^"]*a-price[^"]*"[^>]*>([^<]+)<\/span>/gi,
      /<div[^>]*class="[^"]*price[^"]*"[^>]*>([^<]+)<\/div>/gi,
      /<div[^>]*class="[^"]*a-price[^"]*"[^>]*>([^<]+)<\/div>/gi
    ];

    for (const pattern of pricePatterns) {
      const matches = html.match(pattern);
      if (matches && matches.length > 0) {
        const match = matches[0];
        if (match.includes('$') && match.length > 1) {
          price = match.replace(/[^\d.,$]/g, '').trim();
          if (price && price !== '$') {
            break;
          }
        }
      }
    }

    // Extract image
    let image = '';
    const imagePatterns = [
      /<img[^>]*src=["']([^"']*images[^"']*\.(?:jpg|jpeg|png|webp))["'][^>]*>/i,
      /<img[^>]*src=["']([^"']*product[^"']*\.(?:jpg|jpeg|png|webp))["'][^>]*>/i,
      /<img[^>]*src=["']([^"']*media-amazon[^"']*\.(?:jpg|jpeg|png|webp))["'][^>]*>/i,
      /<img[^>]*data-src=["']([^"']*images[^"']*\.(?:jpg|jpeg|png|webp))["'][^>]*>/i,
      /"image":\s*"([^"]*\.(?:jpg|jpeg|png|webp))"/g,
      /"imageUrl":\s*"([^"]*\.(?:jpg|jpeg|png|webp))"/g,
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

    // Decode HTML entities for cleaner product names and descriptions
    description = decodeHtmlEntities(description);

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
        method: 'Simple Fallback'
      }
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Amazon Simple Fallback scraper error:', error);
    return NextResponse.json({
      error: `Amazon Simple Fallback scraper failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}
