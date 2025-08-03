import { NextRequest, NextResponse } from 'next/server';
import { getCachedHerb } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const herb = await getCachedHerb(slug);
    
    if (!herb) {
      return new NextResponse('Herb not found', { status: 404 });
    }
    
    return NextResponse.json(herb);
  } catch (error) {
    console.error('Error fetching herb:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
} 