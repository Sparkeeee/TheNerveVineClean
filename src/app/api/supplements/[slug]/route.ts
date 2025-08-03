import { NextRequest, NextResponse } from 'next/server';
import { getCachedSupplement } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const supplement = await getCachedSupplement(slug);
    
    if (!supplement) {
      return NextResponse.json({ error: 'Supplement not found' }, { status: 404 });
    }
    
    return NextResponse.json(supplement);
  } catch (error) {
    console.error('Error fetching supplement:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 