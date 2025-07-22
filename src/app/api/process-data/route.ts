import { NextRequest, NextResponse } from 'next/server';
import { createDataProcessingHub, ProcessingCriteria } from '../../../lib/data-processing-hub';

export async function POST(request: NextRequest) {
  try {
    const criteria: ProcessingCriteria = await request.json();
    
    // Validate required fields
    if (!criteria.herbs && !criteria.symptoms && !criteria.supplements) {
      return NextResponse.json(
        { error: 'At least one of herbs, symptoms, or supplements must be specified' },
        { status: 400 }
      );
    }

    const hub = createDataProcessingHub();
    const result = await hub.processData(criteria);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing data:', error);
    return NextResponse.json(
      { error: 'Failed to process data' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const herb = searchParams.get('herb');
    const symptom = searchParams.get('symptom');
    const limit = parseInt(searchParams.get('limit') || '10');
    const userSegment = searchParams.get('userSegment') as 'quality-focused' | 'price-sensitive' | 'balanced' || 'balanced';

    if (!herb && !symptom) {
      return NextResponse.json(
        { error: 'Either herb or symptom parameter is required' },
        { status: 400 }
      );
    }

    const criteria: ProcessingCriteria = {
      userSegment,
      ...(herb && { herbs: [herb] }),
      ...(symptom && { symptoms: [symptom] })
    };

    const hub = createDataProcessingHub();
    const recommendations = await hub.getRecommendations(criteria, limit);

    return NextResponse.json({
      products: recommendations,
      criteria,
      cacheStats: hub.getCacheStats()
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
} 