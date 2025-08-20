import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const formulationTypes = await prisma.formulationType.findMany({
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(formulationTypes);
  } catch (error) {
    console.error('Error fetching formulation types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch formulation types' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
