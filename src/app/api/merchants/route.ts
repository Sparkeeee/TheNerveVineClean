import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all merchants
export async function GET() {
  try {
    const merchants = await prisma.merchant.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      data: { merchants },
    });
  } catch (error) {
    console.error('Error fetching merchants:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch merchants' },
      { status: 500 }
    );
  }
}

// POST - Create a new merchant
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    const merchant = await prisma.merchant.create({
      data: {
        name: data.name,
        apiSource: data.apiSource,
        logoUrl: data.logoUrl,
        websiteUrl: data.websiteUrl,
        region: data.region,
        defaultAffiliateRate: data.defaultAffiliateRate ? parseFloat(data.defaultAffiliateRate) : null,
      },
    });

    return NextResponse.json({
      success: true,
      data: merchant,
    });
  } catch (error) {
    console.error('Error creating merchant:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create merchant' },
      { status: 500 }
    );
  }
}

// PUT - Update a merchant
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    
    if (!data.id) {
      return NextResponse.json(
        { success: false, error: 'Merchant ID is required' },
        { status: 400 }
      );
    }

    const merchant = await prisma.merchant.update({
      where: { id: parseInt(data.id) },
      data: {
        name: data.name,
        apiSource: data.apiSource,
        logoUrl: data.logoUrl,
        websiteUrl: data.websiteUrl,
        region: data.region,
        defaultAffiliateRate: data.defaultAffiliateRate ? parseFloat(data.defaultAffiliateRate) : null,
      },
    });

    return NextResponse.json({
      success: true,
      data: merchant,
    });
  } catch (error) {
    console.error('Error updating merchant:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update merchant' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a merchant
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Merchant ID is required' },
        { status: 400 }
      );
    }

    await prisma.merchant.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      success: true,
      message: 'Merchant deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting merchant:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete merchant' },
      { status: 500 }
    );
  }
} 