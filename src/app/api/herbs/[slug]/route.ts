import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database';
import { createApiResponse, createErrorResponse, createNotFoundResponse } from '@/lib/api-utils';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    const herb = await prisma.herb.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        commonName: true,
        latinName: true,
        slug: true,
        description: true,
        metaTitle: true,
        metaDescription: true,
        heroImageUrl: true,
        cardImageUrl: true,
        galleryImages: true,
        cautions: true,
        productFormulations: true,
        references: true,
        traditionalUses: true,
        comprehensiveArticle: true,
        indicationTags: true,
        products: {
          include: {
            merchant: true,
          },
        },
        HerbIndicationScore: {
          include: {
            Indication: true,
          },
        },
      },
    });

    if (!herb) {
      return createNotFoundResponse('Herb not found');
    }

    return createApiResponse(herb);
  } catch (error) {
    console.error('Error fetching herb:', error);
    return createErrorResponse('Failed to fetch herb');
  }
}