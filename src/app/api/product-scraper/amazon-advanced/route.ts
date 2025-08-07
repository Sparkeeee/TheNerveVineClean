import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    console.log('Advanced Amazon test for URL:', url);

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Extract ASIN from URL
    const asinMatch = url.match(/\/dp\/([A-Z0-9]{10})/);
    const asin = asinMatch ? asinMatch[1] : null;
    
    console.log('Extracted ASIN:', asin);

    const results = {
      basic: null,
      enhanced: null,
      mobile: null,
      api: null,
      cleanUrl: null
    };

    // Approach 1: Basic fetch with minimal headers
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      const html = await response.text();
      results.basic = {
        status: response.status,
        length: html.length,
        title: html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() || 'No title',
        hasProduct: html.includes('product') || html.includes('buy') || html.includes('add to cart'),
        hasPrice: html.includes('$') || html.includes('price') || html.includes('USD'),
        isBlocked: html.includes('continue shopping') || html.includes('captcha') || html.includes('robot')
      };
    } catch (error) {
      results.basic = { error: error.message };
    }

    // Approach 2: Enhanced headers with full browser simulation
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'max-age=0',
          'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"Windows"',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Upgrade-Insecure-Requests': '1'
        }
      });
      const html = await response.text();
      results.enhanced = {
        status: response.status,
        length: html.length,
        title: html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() || 'No title',
        hasProduct: html.includes('product') || html.includes('buy') || html.includes('add to cart'),
        hasPrice: html.includes('$') || html.includes('price') || html.includes('USD'),
        isBlocked: html.includes('continue shopping') || html.includes('captcha') || html.includes('robot')
      };
    } catch (error) {
      results.enhanced = { error: error.message };
    }

    // Approach 3: Mobile user agent
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1.2 Mobile/15E148 Safari/604.1'
        }
      });
      const html = await response.text();
      results.mobile = {
        status: response.status,
        length: html.length,
        title: html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() || 'No title',
        hasProduct: html.includes('product') || html.includes('buy') || html.includes('add to cart'),
        hasPrice: html.includes('$') || html.includes('price') || html.includes('USD'),
        isBlocked: html.includes('continue shopping') || html.includes('captcha') || html.includes('robot')
      };
    } catch (error) {
      results.mobile = { error: error.message };
    }

    // Approach 4: Clean URL (just ASIN)
    if (asin) {
      try {
        const cleanUrl = `https://www.amazon.com/dp/${asin}`;
        const response = await fetch(cleanUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        const html = await response.text();
        results.cleanUrl = {
          status: response.status,
          length: html.length,
          title: html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() || 'No title',
          hasProduct: html.includes('product') || html.includes('buy') || html.includes('add to cart'),
          hasPrice: html.includes('$') || html.includes('price') || html.includes('USD'),
          isBlocked: html.includes('continue shopping') || html.includes('captcha') || html.includes('robot')
        };
      } catch (error) {
        results.cleanUrl = { error: error.message };
      }
    }

    // Analysis
    const workingApproaches = Object.entries(results).filter(([key, result]) => 
      result && !result.error && !result.isBlocked && result.hasProduct
    );

    const bestApproach = workingApproaches.find(([key, result]) => 
      result.hasPrice && result.hasProduct
    )?.[0] || 'none';

    return NextResponse.json({
      success: true,
      url: url,
      asin: asin,
      results: results,
      analysis: {
        bestApproach: bestApproach,
        workingApproaches: workingApproaches.length,
        totalApproaches: Object.keys(results).length,
        isBlocked: Object.values(results).some(r => r && r.isBlocked),
        recommendation: bestApproach !== 'none' ? 
          `Use ${bestApproach} approach` : 
          'All approaches blocked - need Puppeteer or proxy'
      }
    });

  } catch (error) {
    console.error('Advanced Amazon test error:', error);
    return NextResponse.json({
      error: `Advanced Amazon test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}
