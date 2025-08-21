import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database';
import { createApiResponse, createErrorResponse, createNotFoundResponse } from '@/lib/api-utils';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    const supplement = await prisma.supplement.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
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
        tags: true,
        comprehensiveArticle: true,
        indicationTags: true,
        products: {
          include: {
            merchant: true,
          },
        },
      },
    });

    if (!supplement) {
      return createNotFoundResponse('Supplement not found');
    }

    return createApiResponse(supplement);
  } catch (error) {
    console.error('Error fetching supplement:', error);
    return createErrorResponse('Failed to fetch supplement');
  }
}