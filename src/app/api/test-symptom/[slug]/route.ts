import { NextRequest, NextResponse } from 'next/server';
import { getCachedSymptom } from '@/lib/database';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  try {
    const symptom = await getCachedSymptom(slug);
    
    if (!symptom) {
      return NextResponse.json({ error: 'Symptom not found', slug }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      symptom: {
        title: symptom.title,
        description: symptom.description,
        slug: symptom.slug,
        hasProducts: symptom.products ? symptom.products.length > 0 : false,
        rawVariants: symptom.variants,
        variantsType: typeof symptom.variants,
        variantsIsArray: Array.isArray(symptom.variants),
        variantsKeys: symptom.variants ? Object.keys(symptom.variants) : [],
        variantsLength: symptom.variants ? (Array.isArray(symptom.variants) ? symptom.variants.length : Object.keys(symptom.variants).length) : 0
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Database error', 
      message: error instanceof Error ? error.message : String(error),
      slug 
    }, { status: 500 });
  }
}