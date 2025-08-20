import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createApiResponse, createErrorResponse } from '@/lib/api-utils';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (id) {
      // Get specific indication
      const indication = await prisma.indication.findUnique({
        where: { id: parseInt(id) }
      });

      if (!indication) {
        return NextResponse.json(
          { success: false, error: 'Indication not found' },
          { status: 404 }
        );
      }

      return createApiResponse(indication);
    } else {
      // Get all indications
      const indications = await prisma.indication.findMany({
        orderBy: { name: 'asc' }
      });

      return createApiResponse(indications);
    }
  } catch (error) {
    console.error('Error fetching indications:', error);
    return createErrorResponse('Failed to fetch indications');
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, slug, description, color } = await req.json();

    if (!name || !slug) {
      return createErrorResponse('Name and slug are required', 400);
    }

    const indication = await prisma.indication.create({
      data: {
        name,
        slug,
        description,
        color: color || 'blue'
      }
    });

    return createApiResponse(indication);
  } catch (error) {
    console.error('Error creating indication:', error);
    return createErrorResponse('Failed to create indication');
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    
    const indication = await prisma.indication.update({
      where: { id: data.id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        color: data.color || 'blue'
      },
    });
    return NextResponse.json(indication);
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    await prisma.indication.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 400 });
  }
} 