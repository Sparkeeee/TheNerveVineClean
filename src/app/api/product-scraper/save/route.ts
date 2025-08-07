import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database';

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
    const productData: ScrapedProduct = await request.json();

    // Validate required fields
    if (!productData.name || !productData.url) {
      return NextResponse.json(
        { error: 'Product name and URL are required' },
        { status: 400 }
      );
    }

    // Extract domain for merchant identification
    const domain = new URL(productData.url).hostname;
    
    // Create or find merchant
    let merchant = await prisma.merchant.findFirst({
      where: { 
        name: domain.replace('www.', ''),
        region: 'US'
      }
    });

    if (!merchant) {
      merchant = await prisma.merchant.create({
        data: {
          name: domain.replace('www.', ''),
          region: 'US',
          apiSource: 'scraper'
        }
      });
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        currency: 'USD',
        region: 'US',
        imageUrl: productData.image,
        affiliateLink: productData.url,
        merchantId: merchant.id
      }
    });

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
    return NextResponse.json(
      { error: 'Failed to save product data' },
      { status: 500 }
    );
  }
}
