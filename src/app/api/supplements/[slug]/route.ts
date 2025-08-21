import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database';
import { createApiResponse, createErrorResponse, createNotFoundResponse } from '@/lib/api-utils';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const supplement = await prisma.supplement.findUnique({
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
        }
      }
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