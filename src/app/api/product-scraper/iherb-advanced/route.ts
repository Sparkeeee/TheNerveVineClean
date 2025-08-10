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

    if (!url || !url.includes('iherb.com')) {
      return NextResponse.json(
        { error: 'Invalid iHerb URL' },
        { status: 400 }
      );
    }

    console.log(`iHerb Advanced scraper for URL: ${url}`);

    // Multiple sophisticated approaches
    const approaches = [
      {
        name: 'Desktop Chrome',
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
          'Sec-Fetch-Site': 'none',
          'Cache-Control': 'max-age=0'
        }
      },
      {
        name: 'Mobile Safari',
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive'
        }
      },
      {
        name: 'Firefox',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        }
      }
    ];

    for (const approach of approaches) {
      try {
        console.log(`Trying approach: ${approach.name}`);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: approach.headers as Record<string, string>,
          redirect: 'follow'
        });

        if (response.ok) {
          const html = await response.text();
          console.log(`Success with ${approach.name}, HTML length: ${html.length}`);

          // Extract product data
          const productData = extractProductData(html, url);
          
          if (productData.name && productData.price) {
            return NextResponse.json({
              success: true,
              method: approach.name,
              product: productData
            });
          }
        } else {
          console.log(`${approach.name} failed: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.log(`${approach.name} error:`, error);
      }
    }

    return NextResponse.json(
      { error: 'All approaches failed for iHerb' },
      { status: 500 }
    );

  } catch (error) {
    console.error('iHerb Advanced scraper error:', error);
    return NextResponse.json(
      { error: 'Failed to scrape iHerb product' },
      { status: 500 }
    );
  }
}

function extractProductData(html: string, url: string): ScrapedProduct {
  // iHerb-specific extraction logic
  const productData: ScrapedProduct = {
    name: '',
    price: '',
    image: '',
    description: '',
    availability: '',
    url,
    rawData: { html: html.substring(0, 1000) }
  };

  try {
    // Extract product name
    const nameMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i) ||
                     html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (nameMatch) {
      productData.name = nameMatch[1].trim();
    }

    // Extract price
    const priceMatch = html.match(/\$(\d+\.?\d*)/);
    if (priceMatch) {
      productData.price = `$${priceMatch[1]}`;
    }

    // Extract image
    const imageMatch = html.match(/<img[^>]*src=["']([^"']*\.(?:jpg|jpeg|png|webp))["'][^>]*>/i);
    if (imageMatch) {
      productData.image = imageMatch[1];
    }

    // Extract description
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    if (descMatch) {
      productData.description = descMatch[1];
    }

    // Check availability
    if (html.includes('out of stock') || html.includes('unavailable')) {
      productData.availability = 'Out of Stock';
    } else {
      productData.availability = 'In Stock';
    }

  } catch (error) {
    console.error('Extraction error:', error);
  }

  return productData;
}
