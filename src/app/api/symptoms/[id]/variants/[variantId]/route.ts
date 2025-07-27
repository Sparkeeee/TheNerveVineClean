import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// DELETE /api/symptoms/[id]/variants/[variantId] - Delete a specific variant
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  try {
    const { id, variantId } = await params;
    const symptomId = parseInt(id);
    const variantIdNum = parseInt(variantId);

    if (isNaN(symptomId) || isNaN(variantIdNum)) {
      return NextResponse.json({ error: 'Invalid IDs' }, { status: 400 });
    }

    // Check if variant exists and belongs to this symptom
    const existingVariant = await prisma.symptomVariant.findFirst({
      where: {
        id: variantIdNum,
        parentSymptomId: symptomId,
      },
    });

    if (!existingVariant) {
      return NextResponse.json({ error: 'Variant not found' }, { status: 404 });
    }

    // Delete the variant (this will also remove the many-to-many relationships)
    await prisma.symptomVariant.delete({
      where: { id: variantIdNum },
    });

    return NextResponse.json({ message: 'Variant deleted successfully' });
  } catch (error) {
    console.error('Error deleting variant:', error);
    return NextResponse.json({ error: 'Failed to delete variant' }, { status: 500 });
  }
} 