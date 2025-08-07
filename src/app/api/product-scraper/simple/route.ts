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

    // Basic extraction using regex (very limited but works for testing)
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const name = titleMatch ? titleMatch[1].trim() : 'Product name not found';

    const priceMatch = html.match(/\$[\d,]+\.?\d*/);
    const price = priceMatch ? priceMatch[0] : 'Price not found';

    const imageMatch = html.match(/<img[^>]*src=["']([^"']*product[^"']*)["'][^>]*>/i);
    const image = imageMatch ? imageMatch[1] : '';

    const descriptionMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
    const description = descriptionMatch ? descriptionMatch[1] : 'Description not found';

    const scrapedData: Partial<ScrapedProduct> = {
      name,
      price,
      image,
      description,
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
