import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createApiResponse, createErrorResponse, createNotFoundResponse } from '@/lib/api-utils';

const prisma = new PrismaClient();

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
            color: true,
            description: true
          }
        }
      }
    });

    if (!herb) {
      return createNotFoundResponse('Herb');
    }

    return createApiResponse({
      herb: {
        id: herb.id,
        name: herb.name,
        slug: herb.slug
      },
      indications: herb.indicationTags
    });
  } catch (error) {
    console.error('Error fetching herb indications:', error);
    return createErrorResponse('Failed to fetch herb indications');
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { indicationIds } = await req.json();

    if (!Array.isArray(indicationIds)) {
      return createErrorResponse('indicationIds must be an array', 400);
    }

    // Verify the herb exists
    const herb = await prisma.herb.findUnique({
      where: { slug }
    });

    if (!herb) {
      return createNotFoundResponse('Herb');
    }

    // Verify all indication IDs exist
    const indications = await prisma.indication.findMany({
      where: { id: { in: indicationIds } }
    });

    if (indications.length !== indicationIds.length) {
      return createErrorResponse('One or more indication IDs not found', 400);
    }

    // Update the herb's indication tags
    await prisma.herb.update({
      where: { slug },
      data: {
        indicationTags: {
          set: indicationIds.map(id => ({ id }))
        }
      }
    });

    return createApiResponse({
      message: 'Herb indications updated successfully',
      herbSlug: slug,
      indicationIds
    });
  } catch (error) {
    console.error('Error updating herb indications:', error);
    return createErrorResponse('Failed to update herb indications');
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { indicationId } = await req.json();

    if (!indicationId) {
      return createErrorResponse('indicationId is required', 400);
    }

    // Remove the specific indication from the herb
    await prisma.herb.update({
      where: { slug },
      data: {
        indicationTags: {
          disconnect: { id: indicationId }
        }
      }
    });

    return createApiResponse({
      message: 'Indication removed from herb successfully',
      herbSlug: slug,
      indicationId
    });
  } catch (error) {
    console.error('Error removing indication from herb:', error);
    return createErrorResponse('Failed to remove indication from herb');
  }
}



