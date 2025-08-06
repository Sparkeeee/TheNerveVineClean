import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT - Update quality specification
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const parsedId = parseInt(id);
    const body = await request.json();
    
    // Validate required fields
    if (!body.productType) {
      return NextResponse.json(
        { error: 'Product type is required' },
        { status: 400 }
      );
    }

    if (!body.herbSlug && !body.supplementSlug) {
      return NextResponse.json(
        { error: 'Either herb slug or supplement slug is required' },
        { status: 400 }
      );
    }

    const updatedSpecification = await prisma.qualitySpecification.update({
      where: { id: parsedId },
      data: {
        herbSlug: body.herbSlug || null,
        herbName: body.herbName || null,
        supplementSlug: body.supplementSlug || null,
        supplementName: body.supplementName || null,
        productType: body.productType,
        formulationName: body.formulationName || null,
        approach: body.approach || 'traditional',
        requiredTerms: body.requiredTerms || [],
        preferredTerms: body.preferredTerms || [],
        avoidTerms: body.avoidTerms || [],
        standardization: body.standardization || null,
        alcoholSpecs: body.alcoholSpecs || null,
        dosageSpecs: body.dosageSpecs || null,
        priceRange: body.priceRange || { min: 0, max: 100, currency: 'USD' },
        ratingThreshold: body.ratingThreshold || 4.0,
        reviewCountThreshold: body.reviewCountThreshold || 50,
        brandPreferences: body.brandPreferences || null,
        brandAvoid: body.brandAvoid || null,
        notes: body.notes || null
      }
    });

    return NextResponse.json(updatedSpecification);
  } catch (error) {
    console.error('Error updating quality specification:', error);
    return NextResponse.json(
      { error: 'Failed to update quality specification' },
      { status: 500 }
    );
  }
}

// DELETE - Delete quality specification
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const parsedId = parseInt(id);
    
    await prisma.qualitySpecification.delete({
      where: { id: parsedId }
    });

    return NextResponse.json({ message: 'Quality specification deleted successfully' });
  } catch (error) {
    console.error('Error deleting quality specification:', error);
    return NextResponse.json(
      { error: 'Failed to delete quality specification' },
      { status: 500 }
    );
  }
} 