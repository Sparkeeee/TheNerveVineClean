import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database';
import { createApiResponse, createErrorResponse, createNotFoundResponse } from '@/lib/api-utils';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    const symptom = await prisma.symptom.findUnique({
      where: { slug },
      include: {
        variants: {
          include: {
            herbs: {
              select: {
                id: true,
                name: true,
                slug: true,
                description: true
              }
            },
            supplements: {
              select: {
                id: true,
                name: true,
                slug: true,
                description: true
              }
            }
          }
        },
        products: {
          include: {
            merchant: true
          }
        }
      }
    });

    if (!symptom) {
      return createNotFoundResponse('Symptom not found');
    }

    return createApiResponse(symptom);
  } catch (error) {
    console.error('Error fetching symptom:', error);
    return createErrorResponse('Failed to fetch symptom');
  }
}