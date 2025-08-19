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
    
    const supplement = await prisma.supplement.findUnique({
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

    if (!supplement) {
      return createNotFoundResponse('Supplement');
    }

    return createApiResponse({
      supplement: {
        id: supplement.id,
        name: supplement.name,
        slug: supplement.slug
      },
      indications: supplement.indicationTags
    });
  } catch (error) {
    console.error('Error fetching supplement indications:', error);
    return createErrorResponse('Failed to fetch supplement indications');
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

    // Verify the supplement exists
    const supplement = await prisma.supplement.findUnique({
      where: { slug }
    });

    if (!supplement) {
      return createNotFoundResponse('Supplement');
    }

    // Verify all indication IDs exist
    const indications = await prisma.indication.findMany({
      where: { id: { in: indicationIds } }
    });

    if (indications.length !== indicationIds.length) {
      return createErrorResponse('One or more indication IDs not found', 400);
    }

    // Update the supplement's indication tags
    await prisma.supplement.update({
      where: { slug },
      data: {
        indicationTags: {
          set: indicationIds.map(id => ({ id }))
        }
      }
    });

    return createApiResponse({
      message: 'Supplement indications updated successfully',
      supplementSlug: slug,
      indicationIds
    });
  } catch (error) {
    console.error('Error updating supplement indications:', error);
    return createErrorResponse('Failed to update supplement indications');
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

    // Remove the specific indication from the supplement
    await prisma.supplement.update({
      where: { slug },
      data: {
        indicationTags: {
          disconnect: { id: indicationId }
        }
      }
    });

    return createApiResponse({
      message: 'Indication removed from supplement successfully',
      supplementSlug: slug,
      indicationId
    });
  } catch (error) {
    console.error('Error removing indication from supplement:', error);
    return createErrorResponse('Failed to remove indication from supplement');
  }
}















