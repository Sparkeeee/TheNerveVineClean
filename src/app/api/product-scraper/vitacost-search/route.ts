import { NextRequest, NextResponse } from 'next/server';

interface SearchResult {
  title: string;
  url: string;
  price?: string;
  imageUrl?: string;
  rating?: string;
  reviewCount?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { searchTerm, maxResults = 5 } = await request.json();
    
    if (!searchTerm) {
      return NextResponse.json({ error: 'Search term is required' }, { status: 400 });
    }

    console.log(`🔍 Vitacost search for: ${searchTerm}`);

    // Build Vitacost search URL
    const searchUrl = `https://www.vitacost.com/search?search=${encodeURIComponent(searchTerm)}`;
    
    // Use mobile user agent to avoid detection
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1.2 Mobile/15E148 Safari/604.1',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`);
    }

    const html = await response.text();
    console.log(`📄 Vitacost search results HTML length: ${html.length}`);

    // Extract product URLs from search results
    const results: SearchResult[] = [];
    
    // Look for Vitacost product links in search results
    // Vitacost uses URLs like: /product-name/prodId
    const productLinkRegex = /<a[^>]*href="([^"]*\/[^"]*\/[0-9]+[^"]*)"[^>]*>/g;
    
    let match;
    let count = 0;

    // Extract product URLs
    while ((match = productLinkRegex.exec(html)) !== null && count < maxResults) {
      const productUrl = match[1];
      
      // Skip sponsored/ads and non-product links
      if (productUrl.includes('sponsored') || productUrl.includes('ad') || 
          productUrl.includes('category') || productUrl.includes('brand')) {
        continue;
      }

      // Make URL absolute
      const fullUrl = productUrl.startsWith('http') ? productUrl : `https://www.vitacost.com${productUrl}`;
      
      // Extract product ID
      const productIdMatch = fullUrl.match(/\/([0-9]+)/);
      if (!productIdMatch) continue;

      const productId = productIdMatch[1];
      
      results.push({
        title: `Product ${count + 1}`,
        url: fullUrl,
        price: undefined,
        imageUrl: undefined,
        rating: undefined,
        reviewCount: undefined
      });
      
      count++;
    }

    console.log(`✅ Found ${results.length} Vitacost product URLs`);

    return NextResponse.json({
      success: true,
      searchTerm,
      results,
      totalFound: results.length
    });

  } catch (error) {
    console.error('Vitacost search error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Search failed' 
    }, { status: 500 });
  }
}

