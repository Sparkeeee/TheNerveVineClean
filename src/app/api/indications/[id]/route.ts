import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await prisma.indication.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting indication:', error);
    return NextResponse.json(
      { error: (error instanceof Error ? error.message : String(error)) },
      { status: 400 }
    );
  }
} 