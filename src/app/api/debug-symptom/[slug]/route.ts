import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  try {
    // Test basic database connection
    await prisma.$connect();
    
    // Try to find the symptom
    const symptom = await prisma.symptom.findUnique({
      where: { slug },
      include: {
        products: true,
        variants: true
      }
    });
    
    if (!symptom) {
      // Check if any symptoms exist at all
      const allSymptoms = await prisma.symptom.findMany({
        select: { slug: true, title: true }
      });
      
      return NextResponse.json({ 
        error: 'Symptom not found', 
        requestedSlug: slug,
        availableSymptoms: allSymptoms,
        totalSymptoms: allSymptoms.length
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      symptom: {
        title: symptom.title,
        description: symptom.description,
        slug: symptom.slug,
        hasProducts: symptom.products ? symptom.products.length > 0 : false,
        hasVariants: symptom.variants ? symptom.variants.length > 0 : false
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Database error', 
      message: error instanceof Error ? error.message : String(error),
      requestedSlug: slug
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}