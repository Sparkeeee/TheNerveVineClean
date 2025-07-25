import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  try {
    if (id) {
      const herb = await prisma.herb.findUnique({
        where: { id: Number(id) },
      });
      if (!herb) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json(herb);
    } else {
      const herbs = await prisma.herb.findMany();
      return NextResponse.json(herbs);
    }
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { indications, ...herbData } = data;
    const herb = await prisma.herb.create({
      data: {
        ...herbData,
        indications: indications && indications.length > 0
          ? { connect: indications.map((id: number) => ({ id })) }
          : undefined,
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
        indications: indications
          ? {
              set: indications.map((id: number) => ({ id })),
            }
          : undefined,
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