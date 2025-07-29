import { NextResponse } from 'next/server';
import prisma from '@/lib/database';

export async function GET() {
  try {
    // Simple connection test
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      test: result
    });
    
  } catch (error) {
    console.error('Database connection test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}