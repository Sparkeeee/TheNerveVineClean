import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database';

interface ScrapedProduct {
  name: string;
  price: string;
  image: string;
  description: string;
  availability?: string; // Make optional since scrapers don't always provide it
  url: string;
  rawData: any;
}

export async function POST(request: NextRequest) {
  let body: any;
  
  try {
    body = await request.json();

    // Validate required fields
    if (!body.name || !body.url) {
      return NextResponse.json(
        { error: 'Product name and URL are required' },
        { status: 400 }
      );
    }

    // Handle missing availability field
    if (!body.availability) {
      body.availability = 'Unknown'; // Default value
    }

    // Decode HTML entities for cleaner product names and descriptions
    const decodeHtmlEntities = (text: string): string => {
      if (!text) return text;
      return text
        .replace(/&#39;/g, "'")        // apostrophe
        .replace(/&amp;/g, "&")       // ampersand
        .replace(/&quot;/g, '"')      // quote
        .replace(/&lt;/g, "<")        // less than
        .replace(/&gt;/g, ">")        // greater than
        .replace(/&nbsp;/g, " ")      // non-breaking space
        .replace(/&rsquo;/g, "'")     // right single quote
        .replace(/&lsquo;/g, "'")     // left single quote
        .replace(/&rdquo;/g, '"')     // right double quote
        .replace(/&ldquo;/g, '"');    // left double quote
    };

    // Clean up product data
    const cleanProductData = {
      ...body,
      name: decodeHtmlEntities(body.name),
      description: decodeHtmlEntities(body.description)
    };

    console.log('🔍 Cleaned product name:', cleanProductData.name);
    console.log('🔍 Cleaned description preview:', cleanProductData.description?.substring(0, 100));

    // Extract domain for merchant identification
    const domain = new URL(body.url).hostname;
    console.log('🔍 Extracted domain:', domain);
    
    // Create or find merchant
    let merchant = await prisma.merchant.findFirst({
      where: { 
        name: domain.replace('www.', ''),
        region: 'US'
      }
    });

    if (!merchant) {
      console.log('🔍 Creating new merchant for domain:', domain);
      merchant = await prisma.merchant.create({
        data: {
          name: domain.replace('www.', ''),
          region: 'US',
          apiSource: 'scraper'
        }
      });
      console.log('✅ Merchant created:', merchant.id, merchant.name);
    } else {
      console.log('✅ Found existing merchant:', merchant.id, merchant.name);
    }

    // Create product
    console.log('🔍 Creating product with data:', {
      name: cleanProductData.name,
      description: cleanProductData.description?.substring(0, 100) + '...',
      price: cleanProductData.price,
      imageUrl: cleanProductData.image,
      affiliateLink: cleanProductData.url,
      merchantId: merchant.id
    });
    
    const product = await prisma.product.create({
      data: {
        name: cleanProductData.name,
        description: cleanProductData.description,
        price: cleanProductData.price,
        currency: 'USD',
        region: 'US',
        imageUrl: cleanProductData.image,
        affiliateLink: cleanProductData.url,
        merchantId: merchant.id
      }
    });
    
    console.log('✅ Product created successfully:', product.id);

    return NextResponse.json({
      success: true,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        merchant: merchant.name
      }
    });

  } catch (error) {
    console.error('Save product error:', error);
    console.error('Product data received:', JSON.stringify(body, null, 2));
    return NextResponse.json(
      { error: `Failed to save product data: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
