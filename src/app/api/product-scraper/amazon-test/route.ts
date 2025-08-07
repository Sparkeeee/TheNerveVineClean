import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    console.log('Amazon test for URL:', url);

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Try multiple approaches for Amazon
    const results = {
      basic: null,
      withHeaders: null,
      mobile: null,
      api: null
    };

    // Approach 1: Basic fetch
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      const html = await response.text();
      results.basic = {
        status: response.status,
        length: html.length,
        title: html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() || 'No title',
        hasProduct: html.includes('product') || html.includes('buy'),
        hasPrice: html.includes('$') || html.includes('price')
      };
    } catch (error) {
      results.basic = { error: error.message };
    }

    // Approach 2: Enhanced headers
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        }
      });
      const html = await response.text();
      results.withHeaders = {
        status: response.status,
        length: html.length,
        title: html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() || 'No title',
        hasProduct: html.includes('product') || html.includes('buy'),
        hasPrice: html.includes('$') || html.includes('price')
      };
    } catch (error) {
      results.withHeaders = { error: error.message };
    }

    // Approach 3: Mobile user agent
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1'
        }
      });
      const html = await response.text();
      results.mobile = {
        status: response.status,
        length: html.length,
        title: html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() || 'No title',
        hasProduct: html.includes('product') || html.includes('buy'),
        hasPrice: html.includes('$') || html.includes('price')
      };
    } catch (error) {
      results.mobile = { error: error.message };
    }

    return NextResponse.json({
      success: true,
      url: url,
      results: results,
      summary: {
        bestApproach: Object.entries(results).find(([key, result]) => 
          result && !result.error && result.hasProduct && result.hasPrice
        )?.[0] || 'none',
        totalApproaches: Object.keys(results).length,
        workingApproaches: Object.values(results).filter(r => r && !r.error).length
      }
    });

  } catch (error) {
    console.error('Amazon test error:', error);
    return NextResponse.json({
      error: `Amazon test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}
