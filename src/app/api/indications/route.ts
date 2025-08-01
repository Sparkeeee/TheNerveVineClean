import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database';
import { createApiResponse, createErrorResponse, createNotFoundResponse } from '@/lib/api-utils';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');
  
  try {
    await prisma.$connect();
    
    if (id) {
      const indication = await prisma.indication.findUnique({
        where: { id: Number(id) },
        include: {
          herbs: true,
          supplements: true
        }
      });
      if (!indication) return createNotFoundResponse('Indication');
      return createApiResponse(indication);
    } else {
      const indications = await prisma.indication.findMany({
        include: {
          herbs: true,
          supplements: true
        },
        take: limit,
        skip: offset,
        orderBy: { name: 'asc' }
      });
      
      const total = await prisma.indication.count();
      
      return createApiResponse({
        indications,
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
    console.error('Indications API error:', error);
    return createErrorResponse(`Failed to fetch indications: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const indication = await prisma.indication.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        color: data.color || 'blue'
      },
    });
    return NextResponse.json(indication, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 400 });
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