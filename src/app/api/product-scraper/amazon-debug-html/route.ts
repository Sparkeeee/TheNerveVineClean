import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    console.log('Amazon HTML debug for URL:', url);

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

    // Analyze the HTML structure
    const analysis = {
      htmlLength: html.length,
      title: html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() || 'No title found',
      
      // Find all price-related content
      priceMatches: [] as any[],
      priceElements: [] as any[],
      
      // Find all image URLs
      imageUrls: [] as any[],
      
      // Find JSON data
      jsonData: [] as any[],
      
      // Sample HTML sections
      sampleSections: [] as any[]
    };

    // Extract all price-related content
    const priceRegex = /(\$[\d,]+\.?\d*)/g;
    let priceMatch;
    while ((priceMatch = priceRegex.exec(html)) !== null) {
      analysis.priceMatches.push({
        match: priceMatch[0],
        index: priceMatch.index,
        context: html.substring(Math.max(0, priceMatch.index - 50), priceMatch.index + 100)
      });
    }

    // Find price elements with classes
    const priceElementRegex = /<[^>]*class="[^"]*(?:price|a-price)[^"]*"[^>]*>([^<]*)<\/[^>]*>/gi;
    let priceElement;
    while ((priceElement = priceElementRegex.exec(html)) !== null) {
      analysis.priceElements.push({
        element: priceElement[0],
        content: priceElement[1],
        index: priceElement.index
      });
    }

    // Extract all image URLs
    const imageRegex = /<img[^>]*src=["']([^"']+)["'][^>]*>/gi;
    let imageMatch;
    while ((imageMatch = imageRegex.exec(html)) !== null) {
      const imageUrl = imageMatch[1];
      if (imageUrl && !imageUrl.includes('sprite') && !imageUrl.includes('icon')) {
        analysis.imageUrls.push({
          url: imageUrl,
          index: imageMatch.index,
          context: html.substring(Math.max(0, imageMatch.index - 50), imageMatch.index + 200)
        });
      }
    }

    // Find JSON data blocks
    const jsonRegex = /<script[^>]*type="application\/json"[^>]*>([^<]+)<\/script>/gi;
    let jsonMatch;
    while ((jsonMatch = jsonRegex.exec(html)) !== null) {
      try {
        const jsonData = JSON.parse(jsonMatch[1]);
        analysis.jsonData.push({
          data: jsonData,
          index: jsonMatch.index
        });
      } catch (e) {
        // Invalid JSON, skip
      }
    }

    // Extract sample sections around price matches
    analysis.priceMatches.slice(0, 5).forEach((match, index) => {
      analysis.sampleSections.push({
        type: 'price',
        index: index,
        content: html.substring(Math.max(0, match.index - 200), match.index + 300)
      });
    });

    // Extract sample sections around image URLs
    analysis.imageUrls.slice(0, 5).forEach((img, index) => {
      analysis.sampleSections.push({
        type: 'image',
        index: index,
        content: html.substring(Math.max(0, img.index - 200), img.index + 300)
      });
    });

    return NextResponse.json({
      success: true,
      url: url,
      analysis: analysis
    });

  } catch (error) {
    console.error('Amazon HTML debug error:', error);
    return NextResponse.json({
      error: `Amazon HTML debug failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}
