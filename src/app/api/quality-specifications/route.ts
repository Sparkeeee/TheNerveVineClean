import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all quality specifications
export async function GET() {
  try {
    const specifications = await prisma.qualitySpecification.findMany({
      orderBy: {
        herbName: 'asc'
      }
    });

    return NextResponse.json(specifications);
  } catch (error) {
    console.error('Error fetching quality specifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quality specifications' },
      { status: 500 }
    );
  }
}

// POST - Create new quality specification
export async function POST(request: NextRequest) {
  try {
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

    const newSpecification = await prisma.qualitySpecification.create({
      data: specification
    });

    return NextResponse.json(newSpecification, { status: 201 });
  } catch (error) {
    console.error('Error creating quality specification:', error);
    return NextResponse.json(
      { error: 'Failed to create quality specification' },
      { status: 500 }
    );
  }
} 