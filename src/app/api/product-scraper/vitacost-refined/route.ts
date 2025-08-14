import { NextRequest, NextResponse } from 'next/server';

interface ScrapedProduct {
  name: string;
  price: string;
  image: string;
  description: string;
  url: string;
  rawData: any;
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    console.log('Vitacost Refined scraper for URL:', url);

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL is from Vitacost
    if (!url.includes('vitacost.com')) {
      return NextResponse.json({ error: 'URL must be from Vitacost' }, { status: 400 });
    }

    // Fetch with Vitacost-specific headers
    const response = await fetch(url, {
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
        'Sec-Fetch-Site': 'none'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    console.log('Fetched HTML length:', html.length);

    // Extract product name from title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    let name = titleMatch ? titleMatch[1].trim() : 'Product name not found';
    
    // Clean up Vitacost title
    if (name.includes('Vitacost')) {
      name = name.replace(/Vitacost[:\s]*/, '').trim();
    }

    // Extract price with Vitacost-specific patterns
    let price = 'Price not found';
    
    // Pattern 1: Look for the exact "Our price:" pattern from the HTML
    const ourPriceMatch = html.match(/<p[^>]*class="[^"]*pRetailPrice[^"]*pOurPrice[^"]*"[^>]*>Our price:\s*\$([\d,]+\.?\d*)<\/p>/i);
    if (ourPriceMatch) {
      price = `$${ourPriceMatch[1]}`;
      console.log(`Found price via pRetailPrice pOurPrice class: ${price}`);
    }
    
    // Pattern 2: Look for any paragraph with "Our price:" text
    if (price === 'Price not found') {
      const ourPriceTextMatch = html.match(/Our price:\s*\$([\d,]+\.?\d*)/i);
      if (ourPriceTextMatch) {
        price = `$${ourPriceTextMatch[1]}`;
        console.log(`Found price via "Our price:" text: ${price}`);
      }
    }
    
    // Pattern 3: Look for any paragraph with price class
    if (price === 'Price not found') {
      const priceClassMatch = html.match(/<p[^>]*class="[^"]*price[^"]*"[^>]*>\s*\$([\d,]+\.?\d*)\s*<\/p>/i);
      if (priceClassMatch) {
        price = `$${priceClassMatch[1]}`;
        console.log(`Found price via price class: ${price}`);
      }
    }
    
    // Pattern 4: Look for price in data attributes
    if (price === 'Price not found') {
      const dataPriceMatch = html.match(/data-pp-amount="([\d,]+\.?\d*)"/i);
      if (dataPriceMatch) {
        price = `$${dataPriceMatch[1]}`;
        console.log(`Found price via data-pp-amount: ${price}`);
      }
    }
    
    // Pattern 5: Fallback to any reasonable price pattern
    if (price === 'Price not found') {
      const allPriceMatches = html.match(/\$[\d,]+\.?\d*/g) || [];
      // Filter out common non-product prices
      const filteredPrices = allPriceMatches.filter(p => {
        const priceValue = parseFloat(p.replace('$', ''));
        return priceValue > 5 && priceValue < 200 && 
               !p.includes('shipping') && 
               !p.includes('free') &&
               !p.includes('per serving');
      });
      
      if (filteredPrices.length > 0) {
        price = filteredPrices[0];
        console.log(`Found price via filtered fallback: ${price}`);
      }
    }

    // Extract image with proper URL prefixing for Vitacost
    let image = '';
    
    // Helper function to fix relative URLs
    const fixImageUrl = (imageUrl: string): string => {
      if (imageUrl.startsWith('http')) {
        return imageUrl;
      }
      if (imageUrl.startsWith('//')) {
        return `https:${imageUrl}`;
      }
      if (imageUrl.startsWith('/')) {
        return `https://www.vitacost.com${imageUrl}`;
      }
      return `https://www.vitacost.com/${imageUrl}`;
    };
    
    // Get ALL images first for debugging
    const allImages = html.match(/<img[^>]*src=["']([^"']*)["'][^>]*>/g) || [];
    const imageUrls = allImages.map(img => {
      const srcMatch = img.match(/src=["']([^"']*)["']/);
      return srcMatch ? srcMatch[1] : '';
    }).filter(src => src);
    
    console.log(`Found ${imageUrls.length} total images:`, imageUrls.slice(0, 5)); // Log first 5 for debugging
    
    // Pattern 1: Look for the main product image with pb-img class (most reliable)
    const mainProductImageMatch = html.match(/<img[^>]*class="[^"]*pb-img[^"]*"[^>]*src=["']([^"']*)["'][^>]*>/i);
    if (mainProductImageMatch) {
      const candidateImage = mainProductImageMatch[1];
      // Filter out sprites, icons, and marketing images even in the primary pattern
      if (!candidateImage.toLowerCase().includes('sprites') && 
          !candidateImage.toLowerCase().includes('icon') &&
          !candidateImage.toLowerCase().includes('modules') &&
          !candidateImage.toLowerCase().includes('email_sign_up') &&
          !candidateImage.toLowerCase().includes('lpa') &&
          !candidateImage.toLowerCase().includes('blog')) {
        image = fixImageUrl(candidateImage);
        console.log(`Found image via pb-img class: ${image}`);
      }
    }
    
    // Pattern 2: Look for images with product-related alt text
    if (!image) {
      const altImageMatch = html.match(/<img[^>]*alt=["']([^"']*product[^"']*)["'][^>]*src=["']([^"']*)["'][^>]*>/i);
      if (altImageMatch) {
        const candidateImage = altImageMatch[2];
        // Filter out sprites, icons, and marketing images
        if (!candidateImage.toLowerCase().includes('sprites') && 
            !candidateImage.toLowerCase().includes('icon') &&
            !candidateImage.toLowerCase().includes('modules') &&
            !candidateImage.toLowerCase().includes('email_sign_up') &&
            !candidateImage.toLowerCase().includes('lpa') &&
            !candidateImage.toLowerCase().includes('blog')) {
          image = fixImageUrl(candidateImage);
          console.log(`Found image via product alt text: ${image}`);
        }
      }
    }
    
    // Pattern 3: Look for images in product containers
    if (!image) {
      const productContainerMatch = html.match(/<div[^>]*class="[^"]*product[^"]*"[^>]*>[\s\S]*?<img[^>]*src=["']([^"']*)["'][^>]*>/i);
      if (productContainerMatch) {
        const candidateImage = productContainerMatch[1];
        // Filter out sprites, icons, and marketing images
        if (!candidateImage.toLowerCase().includes('sprites') && 
            !candidateImage.toLowerCase().includes('icon') &&
            !candidateImage.toLowerCase().includes('modules') &&
            !candidateImage.toLowerCase().includes('email_sign_up') &&
            !candidateImage.toLowerCase().includes('lpa') &&
            !candidateImage.toLowerCase().includes('blog')) {
          image = fixImageUrl(candidateImage);
          console.log(`Found image in product container: ${image}`);
        }
      }
    }
    
    // Pattern 4: Smart filtering - exclude obvious non-product images
    if (!image) {
      const filteredCandidates = imageUrls.filter(imgUrl => {
        const lowerUrl = imgUrl.toLowerCase();
        return !lowerUrl.includes('logo') && 
               !lowerUrl.includes('sprite') && 
               !lowerUrl.includes('sprites') &&
               !lowerUrl.includes('icon') &&
               !lowerUrl.includes('nav') &&
               !lowerUrl.includes('banner') &&
               !lowerUrl.includes('Top_Seller') &&
               !lowerUrl.includes('icon_authenticity') &&
               !lowerUrl.includes('icon_non-gmo') &&
               !lowerUrl.includes('icon-carbon') &&
               !lowerUrl.includes('A_BCorp_logo') &&
               !lowerUrl.includes('25Icon') &&
               !lowerUrl.includes('modules') &&
               !lowerUrl.includes('Email_sign_up') &&
               !lowerUrl.includes('lpa') &&
               !lowerUrl.includes('blog');
      });
      
      if (filteredCandidates.length > 0) {
        image = fixImageUrl(filteredCandidates[0]);
        console.log(`Found image via smart filtering: ${image}`);
      }
    }
    
    // Pattern 5: If still no image, take the first non-logo image
    if (!image && imageUrls.length > 0) {
      const nonLogoImages = imageUrls.filter(url => !url.toLowerCase().includes('logo'));
      if (nonLogoImages.length > 0) {
        image = fixImageUrl(nonLogoImages[0]);
        console.log(`Found image via fallback (first non-logo): ${image}`);
      }
    }

    // Extract description with Vitacost-specific targeting
    let description = 'Description not found';
    
    // Pattern 1: Look for the shortDescription span (most reliable)
    const shortDescMatch = html.match(/<span[^>]*id="shortDescription"[^>]*>([\s\S]*?)<\/span>/i);
    if (shortDescMatch) {
      // Clean up HTML tags and get just the text
      const cleanDesc = shortDescMatch[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      if (cleanDesc && cleanDesc.length > 10) {
        description = cleanDesc;
        console.log(`Found description via shortDescription span: ${description.substring(0, 100)}...`);
      }
    }
    
    // Pattern 2: Look for the pBlurb1 and pBlurb2 content
    if (description === 'Description not found') {
      const blurb1Match = html.match(/<p[^>]*class="[^"]*pBlurb1[^"]*"[^>]*>([\s\S]*?)<\/p>/i);
      const blurb2Match = html.match(/<p[^>]*class="[^"]*pBlurb2[^"]*"[^>]*>([\s\S]*?)<\/p>/i);
      
      let blurbText = '';
      if (blurb1Match) blurbText += blurb1Match[1] + ' ';
      if (blurb2Match) blurbText += blurb2Match[1];
      
      if (blurbText.trim()) {
        description = blurbText.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        console.log(`Found description via pBlurb classes: ${description.substring(0, 100)}...`);
      }
    }
    
    // Pattern 3: Meta description fallback
    if (description === 'Description not found') {
      const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
      if (metaDescMatch) {
        description = metaDescMatch[1];
        console.log(`Found description via meta tag: ${description.substring(0, 100)}...`);
      }
    }



    const result: ScrapedProduct = {
      name,
      price,
      image,
      description,
      url,
      rawData: {
        htmlLength: html.length,
        name,
        hasPrice: price !== 'Price not found',
        hasImage: image !== '',
        hasDescription: description !== 'Description not found',
        method: 'Vitacost Refined',
        url
      }
    };

    console.log('Vitacost Refined extraction results:', {
      name,
      price,
      image: image ? `${image.substring(0, 50)}...` : 'No image found',
      description: description.substring(0, 100) + '...'
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('Vitacost Refined scraper error:', error);
    return NextResponse.json({
      error: `Vitacost Refined scraper failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}
