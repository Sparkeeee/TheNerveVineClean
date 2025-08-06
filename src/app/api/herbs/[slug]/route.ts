import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const herb = await prisma.herb.findFirst({
      where: { slug },
      select: { 
        id: true, 
        name: true, 
        slug: true, 
        description: true, 
        latinName: true,
        comprehensiveArticle: true,
        heroImageUrl: true, 
        galleryImages: true, 
        cautions: true,
        references: true,
        products: {
          select: {
            id: true,
            name: true,
            description: true,
            imageUrl: true,
            price: true,
            affiliateLink: true,
            qualityScore: true,
            affiliateRate: true
          }
        }
      }
    });

    if (!herb) {
      return NextResponse.json(
        { error: 'Herb not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(herb);
  } catch (error) {
    console.error('Error fetching herb:', error);
    return NextResponse.json(
      { error: 'Failed to fetch herb' },
      { status: 500 }
    );
  }
} 