import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database';
import { createApiResponse, createErrorResponse, createNotFoundResponse } from '@/lib/api-utils';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const slug = searchParams.get('slug');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');
  
  try {
    const dataPromise = (async () => {
      if (id) {
        const symptom = await prisma.symptom.findUnique({ 
          where: { id: Number(id) },
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            metaTitle: true,
            metaDescription: true,
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
                qualityScore: true
              }
            }
          }
        });
        if (!symptom) return createNotFoundResponse('Symptom');
        return createApiResponse(symptom);
      } else if (slug) {
        const symptom = await prisma.symptom.findUnique({ 
          where: { slug },
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            metaTitle: true,
            metaDescription: true,
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
                merchant: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            },
            variants: {
              select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                herbs: {
                  select: {
                    id: true,
                    name: true,
                    slug: true
                  }
                },
                supplements: {
                  select: {
                    id: true,
                    name: true,
                    slug: true
                  }
                }
              }
            }
          }
        });
        if (!symptom) return createNotFoundResponse('Symptom');
        return createApiResponse(symptom);
      } else {
        const symptoms = await prisma.symptom.findMany({
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            references: true
          },
          take: limit,
          skip: offset,
          orderBy: { title: 'asc' }
        });
        
        const total = await prisma.symptom.count();
        
        return createApiResponse({
          symptoms,
          pagination: {
            page: Math.floor(offset / limit) + 1,
            limit,
            total,
            pages: Math.ceil(total / limit),
            hasMore: offset + limit < total
          }
        });
      }
    })();

    // Add timeout for Vercel
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 8000);
    });

    // Race between timeout and data fetch
    return await Promise.race([dataPromise, timeoutPromise]) as NextResponse;
  } catch (error) {
    console.error('Symptoms API error:', error);
    return createErrorResponse('Failed to fetch symptoms');
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const symptom = await prisma.symptom.create({ data });
    return createApiResponse(symptom, 201);
  } catch (error) {
    console.error('POST symptoms error:', error);
    return createErrorResponse('Failed to create symptom', 400);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    console.log('PUT symptoms received data:', JSON.stringify(data, null, 2));
    
    if (!data.id) return createErrorResponse('ID required', 400);
    
    // Only include fields that can be updated directly on the Symptom model
    const { id: _id, ...updateData } = data;
    const cleanedData: Record<string, unknown> = {};
    
    // Only include the fields that exist in the Prisma Symptom model
    const allowedFields = [
      'title', 'slug', 'description', 'metaTitle', 'metaDescription', 
      'cautions', 'references', 'articles', 'associatedSymptoms', 
      'comprehensiveArticle'
    ];
    
    for (const field of allowedFields) {
      if (field in updateData) {
        cleanedData[field] = updateData[field];
      }
    }
    
    console.log('PUT symptoms cleaned data:', JSON.stringify(cleanedData, null, 2));
    
    // Log the exact Prisma query we're about to execute
    console.log('Prisma query:', { where: { id: data.id }, data: cleanedData });
    
    const symptom = await prisma.symptom.update({ where: { id: data.id }, data: cleanedData });
    return createApiResponse(symptom);
  } catch (error) {
    console.error('PUT symptoms error:', error);
    console.error('Error name:', (error as Error).name);
    console.error('Error message:', (error as Error).message);
    console.error('Error stack:', (error as Error).stack);
    
    // Check if it's a Prisma error
    if ((error as { code?: string }).code) {
      console.error('Prisma error code:', (error as { code?: string }).code);
    }
    
    return createErrorResponse('Failed to update symptom', 400);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return createErrorResponse('ID required', 400);
    await prisma.symptom.delete({ where: { id } });
    return createApiResponse({ success: true });
  } catch (error) {
    console.error('DELETE symptoms error:', error);
    return createErrorResponse('Failed to delete symptom', 400);
  }
} 