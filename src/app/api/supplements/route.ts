import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database';
import { createApiResponse, createErrorResponse, createNotFoundResponse } from '@/lib/api-utils';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');
  
  try {
    if (id) {
      const supplement = await prisma.supplement.findUnique({ 
        where: { id: Number(id) },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          metaTitle: true,
          metaDescription: true,
          heroImageUrl: true,
          cardImageUrl: true,
          cautions: true
        }
      });
      if (!supplement) return createNotFoundResponse('Supplement');
      return createApiResponse(supplement);
    } else {
      const supplements = await prisma.supplement.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          description: true
        },
        take: limit,
        skip: offset,
        orderBy: { name: 'asc' }
      });
      
      const total = await prisma.supplement.count();
      
      return createApiResponse({
        supplements,
        pagination: {
          page: Math.floor(offset / limit) + 1,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasMore: offset + limit < total
        }
      });
    }
  } catch (error) {
    console.error('Supplements API error:', error);
    return createErrorResponse('Failed to fetch supplements');
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const supplement = await prisma.supplement.create({
      data: data,
    });
    return NextResponse.json(supplement, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    const { id, ...supplementData } = data;
    const supplement = await prisma.supplement.update({
      where: { id: data.id },
      data: supplementData,
    });
    return NextResponse.json(supplement);
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    await prisma.supplement.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 });
  }
} 