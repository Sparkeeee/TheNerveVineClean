import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const supplement = await prisma.supplement.findFirst({
      where: { slug },
      select: { 
        id: true, 
        name: true, 
        slug: true, 
        description: true, 
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

    if (!supplement) {
      return NextResponse.json(
        { error: 'Supplement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(supplement);
  } catch (error) {
    console.error('Error fetching supplement:', error);
    return NextResponse.json(
      { error: 'Failed to fetch supplement' },
      { status: 500 }
    );
  }
} 