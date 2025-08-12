import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch current indications for a symptom or variant
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { searchParams } = new URL(request.url);
    const targetType = searchParams.get('targetType');
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID' },
        { status: 400 }
      );
    }

    // Check if this is a symptom or variant
    const symptom = await prisma.symptom.findUnique({
      where: { id },
      include: {
        variants: {
          include: {
            herbs: true,
            supplements: true
          }
        }
      }
    });

    if (symptom) {
      // This is a symptom - check if we want symptom-level or variant-level data
      if (targetType === 'variant') {
        // Return aggregated data from all variants (for when clicking on variants)
        const allHerbs = new Set();
        const allSupplements = new Set();

        symptom.variants.forEach(variant => {
          variant.herbs.forEach(herb => allHerbs.add(herb.id));
          variant.supplements.forEach(supplement => allSupplements.add(supplement.id));
        });

        const herbs = await prisma.herb.findMany({
          where: { id: { in: Array.from(allHerbs) } },
          select: { id: true, name: true, slug: true }
        });

        const supplements = await prisma.supplement.findMany({
          where: { id: { in: Array.from(allSupplements) } },
          select: { id: true, name: true, slug: true }
        });

        return NextResponse.json({
          success: true,
          data: { herbs, supplements }
        });
      } else {
        // Return empty data for symptom-level (symptoms don't have direct indications)
        return NextResponse.json({
          success: true,
          data: { herbs: [], supplements: [] }
        });
      }
    }

    // Check if this is a variant
    const variant = await prisma.symptomVariant.findUnique({
      where: { id },
      include: {
        herbs: {
          select: { id: true, name: true, slug: true }
        },
        supplements: {
          select: { id: true, name: true, slug: true }
        }
      }
    });

    if (variant) {
      return NextResponse.json({
        success: true,
        data: {
          herbs: variant.herbs,
          supplements: variant.supplements
        }
      });
    }

    return NextResponse.json(
      { success: false, error: 'Symptom or variant not found' },
      { status: 404 }
    );

  } catch (error) {
    console.error('Error fetching indications:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Update indications for a symptom or variant
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { herbs, supplements, targetType } = await request.json();
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID' },
        { status: 400 }
      );
    }

    if (targetType === 'variant') {
      // Update variant indications
      await prisma.symptomVariant.update({
        where: { id },
        data: {
          herbs: {
            set: herbs.map((herbId: number) => ({ id: herbId }))
          },
          supplements: {
            set: supplements.map((supplementId: number) => ({ id: supplementId }))
          }
        }
      });
    } else {
      // Update symptom indications (apply to all variants)
      const symptom = await prisma.symptom.findUnique({
        where: { id },
        include: { variants: true }
      });

      if (!symptom) {
        return NextResponse.json(
          { success: false, error: 'Symptom not found' },
          { status: 404 }
        );
      }

      // Update all variants with the same indications
      for (const variant of symptom.variants) {
        await prisma.symptomVariant.update({
          where: { id: variant.id },
          data: {
            herbs: {
              set: herbs.map((herbId: number) => ({ id: herbId }))
            },
            supplements: {
              set: supplements.map((supplementId: number) => ({ id: supplementId }))
            }
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Indications updated successfully'
    });

  } catch (error) {
    console.error('Error updating indications:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
