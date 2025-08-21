import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database';
import { createApiResponse, createErrorResponse, createNotFoundResponse } from '@/lib/api-utils';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const herb = await prisma.herb.findUnique({
      where: { slug },
      include: {
        indicationTags: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true
          }
        },
        products: {
          include: {
            merchant: {
              select: {
                id: true,
                name: true,
                logoUrl: true,
                websiteUrl: true
              }
            }
          }
        },
        HerbIndicationScore: {
          include: {
            Indication: {
              select: {
                name: true,
                slug: true
              }
            }
          }
        }
      }
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