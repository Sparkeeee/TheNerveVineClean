import { NextRequest, NextResponse } from 'next/server';
import { getCachedSymptom } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const symptom = await getCachedSymptom(slug);
    
    if (!symptom) {
      return NextResponse.json({ error: 'Symptom not found' }, { status: 404 });
    }
    
    return NextResponse.json(symptom);
  } catch (error) {
    console.error('Error fetching symptom:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 