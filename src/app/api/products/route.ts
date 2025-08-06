import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        merchant: true,
        herbs: true,
        supplements: true,
        symptoms: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: { products },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST - Create a new product
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        merchantId: parseInt(data.merchantId),
        affiliateLink: data.affiliateLink,
        price: data.price ? parseFloat(data.price) : null,
        currency: data.currency,
        region: data.region,
        imageUrl: data.imageUrl,
        qualityScore: data.qualityScore ? parseInt(data.qualityScore) : null,
        affiliateRate: data.affiliateRate ? parseFloat(data.affiliateRate) : null,
        affiliateYield: data.affiliateYield ? parseFloat(data.affiliateYield) : null,
        approvedBy: data.approvedBy || null,
        approvedAt: data.approvedBy ? new Date() : null,
      },
      include: {
        merchant: true,
        herbs: true,
        supplements: true,
        symptoms: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

// PUT - Update a product
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    
    if (!data.id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id: parseInt(data.id) },
      data: {
        name: data.name,
        description: data.description,
        merchantId: parseInt(data.merchantId),
        affiliateLink: data.affiliateLink,
        price: data.price ? parseFloat(data.price) : null,
        currency: data.currency,
        region: data.region,
        imageUrl: data.imageUrl,
        qualityScore: data.qualityScore ? parseInt(data.qualityScore) : null,
        affiliateRate: data.affiliateRate ? parseFloat(data.affiliateRate) : null,
        affiliateYield: data.affiliateYield ? parseFloat(data.affiliateYield) : null,
        approvedBy: data.approvedBy || null,
        approvedAt: data.approvedBy ? new Date() : null,
      },
      include: {
        merchant: true,
        herbs: true,
        supplements: true,
        symptoms: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a product
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
} 