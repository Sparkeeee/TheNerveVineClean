import { NextRequest, NextResponse } from 'next/server';
import { DatabaseQualityAnalyzer } from '../../../lib/database-quality-analyzer';

export async function POST(request: NextRequest) {
  try {
    const { product, herbSlug, supplementSlug } = await request.json();
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product data is required' },
        { status: 400 }
      );
    }

    const analyzer = new DatabaseQualityAnalyzer();
    
    // Analyze product quality using database data
    const qualityScore = await analyzer.analyzeProductQuality(
      product, 
      herbSlug, 
      supplementSlug
    );

    // Get database specs for comparison
    const dbSpecs = await analyzer.getQualitySpecsFromDatabase(herbSlug, supplementSlug);

    return NextResponse.json({
      qualityScore,
      databaseSpecs: dbSpecs,
      analysis: {
        productName: product.name,
        herbSlug,
        supplementSlug,
        score: qualityScore.score,
        reasons: qualityScore.reasons,
        warnings: qualityScore.warnings,
        matches: qualityScore.matches
      }
    });
  } catch (error) {
    console.error('Error testing database quality:', error);
    return NextResponse.json(
      { error: 'Failed to analyze product quality' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const herbSlug = searchParams.get('herbSlug');
    const supplementSlug = searchParams.get('supplementSlug');

    if (!herbSlug && !supplementSlug) {
      return NextResponse.json(
        { error: 'Either herbSlug or supplementSlug is required' },
        { status: 400 }
      );
    }

    const analyzer = new DatabaseQualityAnalyzer();
    
    // Get database specifications
    const dbSpecs = await analyzer.getQualitySpecsFromDatabase(herbSlug || undefined, supplementSlug || undefined);

    if (!dbSpecs) {
      return NextResponse.json(
        { error: 'No database specifications found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      databaseSpecs: dbSpecs,
      analysis: {
        herbSlug,
        supplementSlug,
        name: dbSpecs.name,
        indications: dbSpecs.indications,
        traditionalUses: dbSpecs.traditionalUses,
        productFormulations: dbSpecs.productFormulations,
        cautions: dbSpecs.cautions,
        tags: dbSpecs.tags
      }
    });
  } catch (error) {
    console.error('Error getting database specs:', error);
    return NextResponse.json(
      { error: 'Failed to get database specifications' },
      { status: 500 }
    );
  }
} 