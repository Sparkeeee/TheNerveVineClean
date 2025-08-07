import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    console.log('Debug request for URL:', url);

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Test 1: URL validation
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
      console.log('URL parsed successfully:', parsedUrl.hostname);
    } catch (error) {
      console.log('URL parsing failed:', error);
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Test 2: Basic fetch
    console.log('Attempting to fetch URL...');
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    console.log('Fetch response status:', response.status);
    console.log('Fetch response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      return NextResponse.json({ 
        error: `HTTP ${response.status}: ${response.statusText}`,
        url: url,
        status: response.status
      }, { status: 500 });
    }

    // Test 3: Get HTML content
    const html = await response.text();
    console.log('HTML content length:', html.length);
    console.log('First 500 characters:', html.substring(0, 500));

    // Test 4: Basic extraction
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : 'No title found';

    // Try multiple price patterns
    let price = 'No price found';
    const pricePatterns = [
      /\$[\d,]+\.?\d*/,
      /[\d,]+\.?\d*\s*USD/,
      /Price:\s*\$[\d,]+\.?\d*/,
      /[\d,]+\.?\d*\s*dollars/
    ];
    
    for (const pattern of pricePatterns) {
      const match = html.match(pattern);
      if (match) {
        price = match[0];
        break;
      }
    }

    // Check if this looks like a product page or generic page
    const isProductPage = html.includes('product') || html.includes('buy') || html.includes('add to cart');
    const hasProductInfo = html.includes('price') || html.includes('$') || html.includes('USD');

    return NextResponse.json({
      success: true,
      url: url,
      hostname: parsedUrl.hostname,
      htmlLength: html.length,
      title: title,
      price: price,
      isProductPage: isProductPage,
      hasProductInfo: hasProductInfo,
      sampleHtml: html.substring(0, 1000)
    });

  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({
      error: `Debug failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
