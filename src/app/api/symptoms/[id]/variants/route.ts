import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/symptoms/[id]/variants - Fetch all variants for a symptom
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const symptomId = parseInt(id);

    if (isNaN(symptomId)) {
      return NextResponse.json({ error: 'Invalid symptom ID' }, { status: 400 });
    }

    const variants = await prisma.symptomVariant.findMany({
      where: {
        parentSymptomId: symptomId,
      },
      include: {
        herbs: true,
        supplements: true,
      },
    });

    return NextResponse.json(variants);
  } catch (error) {
    console.error('Error fetching variants:', error);
    return NextResponse.json({ error: 'Failed to fetch variants' }, { status: 500 });
  }
}

// POST /api/symptoms/[id]/variants - Create a new variant
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const symptomId = parseInt(id);

    if (isNaN(symptomId)) {
      return NextResponse.json({ error: 'Invalid symptom ID' }, { status: 400 });
    }

    const body = await request.json();
    const { name, slug, description, metaTitle, metaDescription, cautions, references } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    // Check if slug is unique
    const existingVariant = await prisma.symptomVariant.findUnique({
      where: { slug },
    });

    if (existingVariant) {
      return NextResponse.json({ error: 'Variant with this slug already exists' }, { status: 400 });
    }

    const variant = await prisma.symptomVariant.create({
      data: {
        parentSymptomId: symptomId,
        name,
        slug,
        description,
        metaTitle,
        metaDescription,
        cautions,
        references: references || [],
      },
      include: {
        herbs: true,
        supplements: true,
      },
    });

    return NextResponse.json(variant);
  } catch (error) {
    console.error('Error creating variant:', error);
    return NextResponse.json({ error: 'Failed to create variant' }, { status: 500 });
  }
}

// PUT /api/symptoms/[id]/variants - Update a variant
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const symptomId = parseInt(id);

    if (isNaN(symptomId)) {
      return NextResponse.json({ error: 'Invalid symptom ID' }, { status: 400 });
    }

    const body = await request.json();
    const { id: variantId, name, slug, description, metaTitle, metaDescription, cautions, references } = body;

    if (!variantId) {
      return NextResponse.json({ error: 'Variant ID is required' }, { status: 400 });
    }

    // Check if variant exists and belongs to this symptom
    const existingVariant = await prisma.symptomVariant.findFirst({
      where: {
        id: variantId,
        parentSymptomId: symptomId,
      },
    });

    if (!existingVariant) {
      return NextResponse.json({ error: 'Variant not found' }, { status: 404 });
    }

    // Check if slug is unique (excluding current variant)
    if (slug && slug !== existingVariant.slug) {
      const slugExists = await prisma.symptomVariant.findFirst({
        where: {
          slug,
          id: { not: variantId },
        },
      });

      if (slugExists) {
        return NextResponse.json({ error: 'Variant with this slug already exists' }, { status: 400 });
      }
    }

    const updatedVariant = await prisma.symptomVariant.update({
      where: { id: variantId },
      data: {
        name,
        slug,
        description,
        metaTitle,
        metaDescription,
        cautions,
        references: references || [],
      },
      include: {
        herbs: true,
        supplements: true,
      },
    });

    return NextResponse.json(updatedVariant);
  } catch (error) {
    console.error('Error updating variant:', error);
    return NextResponse.json({ error: 'Failed to update variant' }, { status: 500 });
  }
} 