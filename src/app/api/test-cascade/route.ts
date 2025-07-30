import { NextRequest, NextResponse } from 'next/server';
import { ProductCascadeManager } from '@/lib/product-cascade';

export async function GET(request: NextRequest) {
  try {
    const cascadeManager = new ProductCascadeManager();
    
    // Simple test - just try to get affected symptoms for a known herb
    const affectedSymptoms = await cascadeManager.getAffectedSymptoms('ginkgo-biloba');
    
    return NextResponse.json({
      success: true,
      message: 'Cascade system test successful',
      data: {
        testHerb: 'ginkgo-biloba',
        affectedSymptoms,
        systemStatus: 'operational'
      }
    });
    
  } catch (error) {
    console.error('CASCADE TEST ERROR:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Cascade test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 