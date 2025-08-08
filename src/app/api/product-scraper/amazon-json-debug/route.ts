import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    console.log('Amazon JSON debug for URL:', url);

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Use the successful mobile approach
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1.2 Mobile/15E148 Safari/604.1'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    console.log('Mobile HTML length:', html.length);

    // Find all JSON data blocks
    const jsonBlocks = [];
    
    // Look for script tags with JSON data
    const scriptRegex = /<script[^>]*>([^<]+)<\/script>/gi;
    let scriptMatch: RegExpExecArray | null;
    while ((scriptMatch = scriptRegex.exec(html)) !== null) {
      const scriptContent = scriptMatch[1];
      
      // Look for JSON-like patterns
      if (scriptContent.includes('{') && scriptContent.includes('}')) {
        try {
          // Try to find JSON objects within the script
          const jsonMatches = scriptContent.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g);
          if (jsonMatches) {
            jsonMatches.forEach((jsonStr, index) => {
              try {
                const parsed = JSON.parse(jsonStr);
                jsonBlocks.push({
                  type: 'script-json',
                  index: scriptMatch.index,
                  data: parsed,
                  original: jsonStr.substring(0, 200) + '...'
                });
              } catch (e) {
                // Not valid JSON, skip
              }
            });
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }

    // Look for specific Amazon data patterns
    const amazonDataPatterns = [
      /"price":\s*"([^"]+)"/g,
      /"priceAmount":\s*"([^"]+)"/g,
      /"priceCurrency":\s*"([^"]+)"/g,
      /"currentPrice":\s*"([^"]+)"/g,
      /"offerPrice":\s*"([^"]+)"/g,
      /"listPrice":\s*"([^"]+)"/g,
      /"priceRange":\s*"([^"]+)"/g,
      /"priceInfo":\s*\{[^}]+\}/g,
      /"productInfo":\s*\{[^}]+\}/g,
      /"availability":\s*"([^"]+)"/g,
      /"inStock":\s*(true|false)/g,
      /"stockStatus":\s*"([^"]+)"/g
    ];

    const amazonData: any[] = [];
    amazonDataPatterns.forEach((pattern, index) => {
      let match;
      while ((match = pattern.exec(html)) !== null) {
        amazonData.push({
          pattern: pattern.source,
          match: match[0],
          value: match[1] || match[0],
          index: match.index,
          context: html.substring(Math.max(0, match.index - 100), match.index + 200)
        });
      }
    });

    // Look for structured data (JSON-LD)
    const structuredDataRegex = /<script[^>]*type="application\/ld\+json"[^>]*>([^<]+)<\/script>/gi;
    let structuredMatch;
    while ((structuredMatch = structuredDataRegex.exec(html)) !== null) {
      try {
        const structuredData = JSON.parse(structuredMatch[1]);
        jsonBlocks.push({
          type: 'structured-data',
          index: structuredMatch.index,
          data: structuredData,
          original: structuredMatch[1].substring(0, 200) + '...'
        });
      } catch (e) {
        // Invalid JSON, skip
      }
    }

    // Look for Amazon-specific data attributes
    const dataAttributes = [];
    const dataAttrRegex = /data-[^=]+="([^"]+)"/g;
    let dataMatch;
    while ((dataMatch = dataAttrRegex.exec(html)) !== null) {
      const attrName = dataMatch[0].split('=')[0];
      const attrValue = dataMatch[1];
      
      if (attrName.includes('price') || attrName.includes('product') || attrName.includes('stock')) {
        dataAttributes.push({
          attribute: dataMatch[0],
          name: attrName,
          value: attrValue,
          index: dataMatch.index,
          context: html.substring(Math.max(0, dataMatch.index - 50), dataMatch.index + 100)
        });
      }
    }

    return NextResponse.json({
      success: true,
      url: url,
      htmlLength: html.length,
      jsonBlocks: jsonBlocks,
      amazonData: amazonData,
      dataAttributes: dataAttributes,
      summary: {
        jsonBlocksFound: jsonBlocks.length,
        amazonDataFound: amazonData.length,
        dataAttributesFound: dataAttributes.length
      }
    });

  } catch (error) {
    console.error('Amazon JSON debug error:', error);
    return NextResponse.json({
      error: `Amazon JSON debug failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}
