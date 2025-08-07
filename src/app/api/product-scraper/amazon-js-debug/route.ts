import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    console.log('Amazon JavaScript debug for URL:', url);

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

    // Look for JavaScript variables and patterns
    const jsPatterns = {
      // Price-related JavaScript patterns
      priceVariables: [
        /var\s+(\w+)\s*=\s*["']?\$[\d,]+\.?\d*["']?/g,
        /let\s+(\w+)\s*=\s*["']?\$[\d,]+\.?\d*["']?/g,
        /const\s+(\w+)\s*=\s*["']?\$[\d,]+\.?\d*["']?/g,
        /(\w+)\s*:\s*["']?\$[\d,]+\.?\d*["']?/g,
        /"price":\s*["']?\$[\d,]+\.?\d*["']?/g,
        /price\s*=\s*["']?\$[\d,]+\.?\d*["']?/g
      ],
      
      // Amazon-specific patterns
      amazonPatterns: [
        /"priceAmount":\s*["']?([^"']+)["']?/g,
        /"currentPrice":\s*["']?([^"']+)["']?/g,
        /"offerPrice":\s*["']?([^"']+)["']?/g,
        /"listPrice":\s*["']?([^"']+)["']?/g,
        /"priceRange":\s*["']?([^"']+)["']?/g,
        /"priceInfo":\s*\{[^}]+\}/g,
        /"productInfo":\s*\{[^}]+\}/g,
        /"availability":\s*["']?([^"']+)["']?/g,
        /"inStock":\s*(true|false)/g,
        /"stockStatus":\s*["']?([^"']+)["']?/g,
        /"asin":\s*["']?([A-Z0-9]{10})["']?/g,
        /"productId":\s*["']?([A-Z0-9]{10})["']?/g
      ],
      
      // Data attribute patterns
      dataPatterns: [
        /data-price="([^"]+)"/g,
        /data-asin="([^"]+)"/g,
        /data-product-id="([^"]+)"/g,
        /data-price-amount="([^"]+)"/g,
        /data-availability="([^"]+)"/g,
        /data-stock-status="([^"]+)"/g
      ],
      
      // Function calls that might contain price data
      functionPatterns: [
        /setPrice\(["']?([^"']+)["']?\)/g,
        /updatePrice\(["']?([^"']+)["']?\)/g,
        /displayPrice\(["']?([^"']+)["']?\)/g,
        /price\s*=\s*function\s*\([^)]*\)\s*\{[^}]*\}/g
      ]
    };

    const results = {
      htmlLength: html.length,
      priceVariables: [],
      amazonData: [],
      dataAttributes: [],
      functionCalls: [],
      sampleScripts: []
    };

    // Extract price variables
    jsPatterns.priceVariables.forEach((pattern, index) => {
      let match;
      while ((match = pattern.exec(html)) !== null) {
        results.priceVariables.push({
          pattern: pattern.source,
          match: match[0],
          variable: match[1] || 'unknown',
          value: match[0].match(/\$[\d,]+\.?\d*/)?.[0] || match[0],
          index: match.index,
          context: html.substring(Math.max(0, match.index - 100), match.index + 200)
        });
      }
    });

    // Extract Amazon-specific data
    jsPatterns.amazonPatterns.forEach((pattern, index) => {
      let match;
      while ((match = pattern.exec(html)) !== null) {
        results.amazonData.push({
          pattern: pattern.source,
          match: match[0],
          value: match[1] || match[0],
          index: match.index,
          context: html.substring(Math.max(0, match.index - 100), match.index + 200)
        });
      }
    });

    // Extract data attributes
    jsPatterns.dataPatterns.forEach((pattern, index) => {
      let match;
      while ((match = pattern.exec(html)) !== null) {
        results.dataAttributes.push({
          pattern: pattern.source,
          match: match[0],
          value: match[1],
          index: match.index,
          context: html.substring(Math.max(0, match.index - 50), match.index + 100)
        });
      }
    });

    // Extract function calls
    jsPatterns.functionPatterns.forEach((pattern, index) => {
      let match;
      while ((match = pattern.exec(html)) !== null) {
        results.functionCalls.push({
          pattern: pattern.source,
          match: match[0],
          value: match[1] || match[0],
          index: match.index,
          context: html.substring(Math.max(0, match.index - 100), match.index + 200)
        });
      }
    });

    // Extract sample script sections
    const scriptRegex = /<script[^>]*>([^<]+)<\/script>/gi;
    let scriptMatch;
    let scriptCount = 0;
    while ((scriptMatch = scriptRegex.exec(html)) !== null && scriptCount < 5) {
      const scriptContent = scriptMatch[1];
      if (scriptContent.includes('price') || scriptContent.includes('Price') || 
          scriptContent.includes('$') || scriptContent.includes('product')) {
        results.sampleScripts.push({
          index: scriptCount,
          content: scriptContent.substring(0, 500) + '...',
          hasPrice: scriptContent.includes('$'),
          hasProduct: scriptContent.includes('product'),
          hasPriceKeyword: scriptContent.includes('price')
        });
        scriptCount++;
      }
    }

    return NextResponse.json({
      success: true,
      url: url,
      results: results,
      summary: {
        priceVariablesFound: results.priceVariables.length,
        amazonDataFound: results.amazonData.length,
        dataAttributesFound: results.dataAttributes.length,
        functionCallsFound: results.functionCalls.length,
        sampleScriptsFound: results.sampleScripts.length
      }
    });

  } catch (error) {
    console.error('Amazon JavaScript debug error:', error);
    return NextResponse.json({
      error: `Amazon JavaScript debug failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}
