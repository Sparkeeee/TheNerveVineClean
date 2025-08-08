import { NextResponse } from 'next/server';
import { getCachedSymptom } from '@/lib/database';

export async function GET() {
  try {
    const data = await getCachedSymptom('stress');
    if (!data) {
      return NextResponse.json(
        { error: 'Stress symptom not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching stress symptom:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stress symptom' },
      { status: 500 }
    );
  }
}
