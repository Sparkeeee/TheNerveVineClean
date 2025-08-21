import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database';
import { createApiResponse, createErrorResponse, createNotFoundResponse } from '@/lib/api-utils';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    const symptom = await prisma.symptom.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        articles: true,
        associatedSymptoms: true,
        cautions: true,
        references: true,
        metaDescription: true,
        metaTitle: true,
        comprehensiveArticle: true,
        commonSymptoms: true,
        herbs: true,
        supplements: true,
        variants: {
          include: {
            herbs: true,
            supplements: true,
          },
        },
        products: {
          include: {
            merchant: true,
          },
        },
      },
    });

    if (!symptom) {
      return createNotFoundResponse('Symptom not found');
    }

    return createApiResponse(symptom);
  } catch (error) {
    console.error('Error fetching symptom:', error);
    return createErrorResponse('Failed to fetch symptom');
  }
}