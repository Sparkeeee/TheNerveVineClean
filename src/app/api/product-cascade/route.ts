import { NextRequest, NextResponse } from 'next/server';
import { ProductCascadeManager, CascadeUpdate } from '@/lib/product-cascade';

/**
 * THE DOMINO RALLY CASCADE API
 * Handles product approvals and triggers network-wide content updates
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, productId, targetHerb, targetSupplement, updateType } = body;

    if (!action || !productId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: action, productId' },
        { status: 400 }
      );
    }

    // Initialize the cascade manager
    const cascadeManager = new ProductCascadeManager();

    // Determine affected symptoms based on herb/supplement
    const affectedSymptoms = await cascadeManager.getAffectedSymptoms(
      targetHerb,
      targetSupplement
    );

    // Create cascade update object
    const cascadeUpdate: CascadeUpdate = {
      productId,
      action,
      targetHerb,
      targetSupplement,
      affectedSymptoms,
      updateType: updateType || 'traditional'
    };

    // Execute the cascade
    const result = await cascadeManager.executeCascade(cascadeUpdate);

    if (result.success) {
      console.log(`🌊 CASCADE SUCCESS: Product ${productId} triggered updates to:`, result.updatedPages);
      
      return NextResponse.json({
        success: true,
        message: `Cascade completed successfully! Updated ${result.updatedPages.length} pages.`,
        data: {
          updatedPages: result.updatedPages,
          summary: result.summary,
          cascadeEffect: {
            herbsUpdated: result.summary.herbsUpdated,
            symptomsUpdated: result.summary.symptomsUpdated,
            supplementsUpdated: result.summary.supplementsUpdated,
            totalPagesAffected: result.updatedPages.length
          }
        }
      });
    } else {
      console.error('❌ CASCADE FAILED:', result.errors);
      
      return NextResponse.json({
        success: false,
        error: 'Cascade execution failed',
        details: result.errors
      }, { status: 500 });
    }

  } catch (error) {
    console.error('💥 CASCADE API ERROR:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error during cascade execution',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * GET: Preview cascade effects without executing
 * Useful for showing admin what will be affected before approval
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetHerb = searchParams.get('herb');
    const targetSupplement = searchParams.get('supplement');

    if (!targetHerb && !targetSupplement) {
      return NextResponse.json(
        { success: false, error: 'Must specify either herb or supplement' },
        { status: 400 }
      );
    }

    const cascadeManager = new ProductCascadeManager();
    const affectedSymptoms = await cascadeManager.getAffectedSymptoms(
      targetHerb || undefined,
      targetSupplement || undefined
    );

    // Build preview of cascade effects
    const preview = {
      primaryTarget: targetHerb ? `/herbs/${targetHerb}` : `/supplements/${targetSupplement}`,
      cascadeTargets: affectedSymptoms.map(slug => `/symptoms/${slug}`),
      totalPagesAffected: 1 + affectedSymptoms.length,
      estimatedUpdateTime: Math.max(5, affectedSymptoms.length * 2) + ' seconds'
    };

    return NextResponse.json({
      success: true,
      message: 'Cascade preview generated',
      preview
    });

  } catch (error) {
    console.error('🔍 CASCADE PREVIEW ERROR:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate cascade preview',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * PUT: Update cascade preferences (quality vs revenue weighting)
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { qualityWeight, revenueWeight, userReviewWeight } = body;

    // Validate weights sum to 1.0
    const totalWeight = (qualityWeight || 0) + (revenueWeight || 0) + (userReviewWeight || 0);
    if (Math.abs(totalWeight - 1.0) > 0.01) {
      return NextResponse.json(
        { success: false, error: 'Weights must sum to 1.0' },
        { status: 400 }
      );
    }

    // Store preferences (this could be in database or config)
    const preferences = {
      qualityWeight: qualityWeight || 0.4,
      revenueWeight: revenueWeight || 0.4,
      userReviewWeight: userReviewWeight || 0.2,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Cascade preferences updated',
      preferences
    });

  } catch (error) {
    console.error('⚙️ CASCADE PREFERENCES ERROR:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update cascade preferences',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 