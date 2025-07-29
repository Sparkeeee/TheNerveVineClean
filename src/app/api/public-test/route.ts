import { NextResponse } from 'next/server';
import prisma from '@/lib/database';

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Count herbs
    const herbCount = await prisma.herb.count();
    
    // Get a sample herb
    const sampleHerb = await prisma.herb.findFirst({
      select: { id: true, name: true, slug: true }
    });
    
    await prisma.$disconnect();
    
    return NextResponse.json({
      status: 'success',
      connection: 'Connected',
      herbCount,
      sampleHerb,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      connection: 'Failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}