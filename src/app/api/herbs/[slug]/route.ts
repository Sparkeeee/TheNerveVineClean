import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database';
import { createApiResponse, createErrorResponse, createNotFoundResponse } from '@/lib/api-utils';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    console.log(`[API HERB] Request received for slug: ${slug}`);

    console.log('[API HERB] Executing prisma.herb.findUnique...');
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
    console.log('[API HERB] Prisma query finished.');

    if (!herb) {
      console.log(`[API HERB] No herb found for slug: ${slug}`);
      return createNotFoundResponse('Herb not found');
    }

    console.log(`[API HERB] Found herb: ${herb.name}. Sending response.`);
    return createApiResponse(herb);
  } catch (error) {
    console.error('[API HERB] An error occurred:', error);
    return createErrorResponse('Failed to fetch herb');
  }
}