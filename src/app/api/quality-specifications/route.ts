import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all quality specifications
export async function GET() {
  try {
    const specifications = await prisma.qualitySpecification.findMany({
      orderBy: [
        { herbName: 'asc' },
        { supplementName: 'asc' }
      ]
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
    
    // Validate required fields - must have either herb or supplement
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

    const newSpecification = await prisma.qualitySpecification.create({
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

    return NextResponse.json(newSpecification, { status: 201 });
  } catch (error) {
    console.error('Error creating quality specification:', error);
    return NextResponse.json(
      { error: 'Failed to create quality specification' },
      { status: 500 }
    );
  }
} 