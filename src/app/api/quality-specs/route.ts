import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const herbId = searchParams.get('herbId');
    const supplementId = searchParams.get('supplementId');
    const herbSlug = searchParams.get('herbSlug');
    const supplementSlug = searchParams.get('supplementSlug');
    const formulationTypeId = searchParams.get('formulationTypeId');

    console.log('API Debug - Search params:', { herbId, supplementId, herbSlug, supplementSlug, formulationTypeId });

    let whereClause: any = {};
    
    if (herbId) {
      whereClause.herbId = parseInt(herbId);
    } else if (supplementId) {
      whereClause.supplementId = parseInt(supplementId);
    } else if (herbSlug) {
      whereClause.herbSlug = herbSlug;
    } else if (supplementSlug) {
      whereClause.supplementSlug = supplementSlug;
    }

    if (formulationTypeId) {
      whereClause.formulationTypeId = parseInt(formulationTypeId);
    }

    console.log('API Debug - Where clause:', whereClause);

    const qualitySpecs = await prisma.qualitySpecification.findMany({
      where: whereClause,
      include: {
        formulationType: true
      },
      orderBy: { id: 'desc' }
    });

    // Now fetch herbs and supplements to populate missing names
    const herbSlugs = qualitySpecs
      .filter(spec => spec.herbSlug && !spec.herbName)
      .map(spec => spec.herbSlug!)
      .filter(Boolean);
    
    const supplementSlugs = qualitySpecs
      .filter(spec => spec.supplementSlug && !spec.supplementName)
      .map(spec => spec.supplementSlug!)
      .filter(Boolean);

    let herbs: any[] = [];
    let supplements: any[] = [];

    if (herbSlugs.length > 0) {
      herbs = await prisma.herb.findMany({
        where: { slug: { in: herbSlugs } },
        select: { slug: true, name: true }
      });
    }

    if (supplementSlugs.length > 0) {
      supplements = await prisma.supplement.findMany({
        where: { slug: { in: supplementSlugs } },
        select: { slug: true, name: true }
      });
    }

    // Populate missing names
    const enrichedSpecs = qualitySpecs.map(spec => {
      const enrichedSpec = { ...spec } as any;
      
      if (enrichedSpec.herbSlug && !enrichedSpec.herbName) {
        const herb = herbs.find(h => h.slug === enrichedSpec.herbSlug);
        if (herb) {
          enrichedSpec.herbName = herb.name;
        }
      }
      
      if (enrichedSpec.supplementSlug && !enrichedSpec.supplementName) {
        const supplement = supplements.find(s => s.slug === enrichedSpec.supplementSlug);
        if (supplement) {
          enrichedSpec.supplementName = supplement.name;
        }
      }
      
      return enrichedSpec;
    });

    return NextResponse.json(enrichedSpecs);
  } catch (error) {
    console.error('Error fetching quality specs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quality specifications' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const qualitySpec = await prisma.qualitySpecification.create({
      data: {
        herbId: body.herbId,
        supplementId: body.supplementId,
        formulationTypeId: body.formulationTypeId,
        customSpecs: body.customSpecs,
        approach: body.approach,
        notes: body.notes,
        productType: 'herb', // Default value
        requiredTerms: [], // Default empty array
        preferredTerms: [], // Default empty array
        avoidTerms: [], // Default empty array
        standardization: {},
        alcoholSpecs: {},
        dosageSpecs: {},
        priceRange: { min: 0, max: 1000 },
        ratingThreshold: 4.0,
        reviewCountThreshold: 10,
        brandPreferences: [],
        brandAvoid: []
      }
    });

    return NextResponse.json(qualitySpec);
  } catch (error) {
    console.error('Error creating quality spec:', error);
    return NextResponse.json(
      { error: 'Failed to create quality specification' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
