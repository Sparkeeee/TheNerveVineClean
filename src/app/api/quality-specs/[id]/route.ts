import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    
    const qualitySpec = await prisma.qualitySpecification.update({
      where: { id },
      data: {
        herbId: body.herbId,
        supplementId: body.supplementId,
        formulationTypeId: body.formulationTypeId,
        customSpecs: body.customSpecs,
        approach: body.approach,
        notes: body.notes,
        standardised: body.standardised,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(qualitySpec);
  } catch (error) {
    console.error('Error updating quality spec:', error);
    return NextResponse.json(
      { error: 'Failed to update quality specification' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    await prisma.qualitySpecification.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting quality spec:', error);
    return NextResponse.json(
      { error: 'Failed to delete quality specification' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
