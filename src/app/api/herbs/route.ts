import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database';
import { createApiResponse, createErrorResponse, createNotFoundResponse } from '@/lib/api-utils';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');
  
  try {
    // Test database connection first
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('Database connected successfully');
    
    if (id) {
      const herb = await prisma.herb.findUnique({
        where: { id: Number(id) },
        select: {
          id: true,
          name: true,
          latinName: true,
          slug: true,
          description: true,
          metaTitle: true,
          metaDescription: true,
          heroImageUrl: true,
          cardImageUrl: true,
          cautions: true
        }
      });
      if (!herb) return createNotFoundResponse('Herb');
      return createApiResponse(herb);
    } else {
      const herbs = await prisma.herb.findMany({
        select: {
          id: true,
          name: true,
          latinName: true,
          slug: true,
          description: true
        },
        take: limit,
        skip: offset,
        orderBy: { name: 'asc' }
      });
      
      const total = await prisma.herb.count();
      
      return createApiResponse({
        herbs,
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
    console.error('Herbs API error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      name: error instanceof Error ? error.name : 'Unknown name',
      cause: error instanceof Error ? error.cause : 'No cause'
    });
    return createErrorResponse(`Failed to fetch herbs: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { indications, ...herbData } = data;
    const herb = await prisma.herb.create({
      data: {
        ...herbData,
        indications: indications && indications.length > 0 ? indications : null,
      },
    });
    return NextResponse.json(herb, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    const { indications, ...herbData } = data;
    const herb = await prisma.herb.update({
      where: { id: data.id },
      data: {
        ...herbData,
        indications: indications && indications.length > 0 ? indications : null,
      },
    });
    return NextResponse.json(herb);
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    await prisma.herb.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 400 });
  }
} 