import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter required' }, { status: 400 });
    }
    
    const supplement = await prisma.supplement.findFirst({
      where: { slug },
      select: { 
        id: true, 
        name: true, 
        slug: true, 
        galleryImages: true,
        heroImageUrl: true
      }
    });
    
    if (!supplement) {
      return NextResponse.json({ error: 'Supplement not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      supplement,
      galleryImagesType: typeof supplement.galleryImages,
      galleryImagesValue: supplement.galleryImages,
      isArray: Array.isArray(supplement.galleryImages),
      isString: typeof supplement.galleryImages === 'string',
      isObject: typeof supplement.galleryImages === 'object' && supplement.galleryImages !== null
    });
    
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}