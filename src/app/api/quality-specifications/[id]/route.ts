import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT - Update quality specification
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    
    // Validate required fields
    if (!body.productType || !body.formulationName) {
      return NextResponse.json(
        { error: 'Product type and formulation name are required' },
        { status: 400 }
      );
    }

    // Convert arrays to JSON for storage
    const specification = {
      herbSlug: body.herbSlug || null,
      supplementSlug: body.supplementSlug || null,
      herbName: body.herbName || null,
      supplementName: body.supplementName || null,
      productType: body.productType,
      formulationName: body.formulationName,
      approach: body.approach || 'traditional',
      requiredTerms: JSON.stringify(body.requiredTerms || []),
      preferredTerms: JSON.stringify(body.preferredTerms || []),
      avoidTerms: JSON.stringify(body.avoidTerms || []),
      standardization: body.standardization ? JSON.stringify(body.standardization) : null,
      alcoholSpecs: body.alcoholSpecs ? JSON.stringify(body.alcoholSpecs) : null,
      dosageSpecs: body.dosageSpecs ? JSON.stringify(body.dosageSpecs) : null,
      priceRange: JSON.stringify(body.priceRange || { min: 0, max: 100, currency: 'USD' }),
      ratingThreshold: body.ratingThreshold || 4.0,
      reviewCountThreshold: body.reviewCountThreshold || 50,
      brandPreferences: body.brandPreferences ? JSON.stringify(body.brandPreferences) : null,
      brandAvoid: body.brandAvoid ? JSON.stringify(body.brandAvoid) : null,
      notes: body.notes || null
    };

    const updatedSpecification = await prisma.qualitySpecification.update({
      where: { id },
      data: {
        ...specification,
        standardization: specification.standardization ? JSON.parse(specification.standardization) : undefined,
        alcoholSpecs: specification.alcoholSpecs ? JSON.parse(specification.alcoholSpecs) : undefined,
        dosageSpecs: specification.dosageSpecs ? JSON.parse(specification.dosageSpecs) : undefined,
        priceRange: specification.priceRange ? JSON.parse(specification.priceRange) : undefined,
        brandPreferences: specification.brandPreferences ? JSON.parse(specification.brandPreferences) : undefined,
        brandAvoid: specification.brandAvoid ? JSON.parse(specification.brandAvoid) : undefined,
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
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    await prisma.qualitySpecification.delete({
      where: { id }
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