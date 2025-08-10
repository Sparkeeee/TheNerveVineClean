import { NextResponse } from 'next/server';
import prisma from '@/lib/database';
import { createApiResponse, createErrorResponse } from '@/lib/api-utils';

export async function GET() {
  try {
    console.log('Fetching hierarchy data...');
    
    // Connect to database
    await prisma.$connect();
    console.log('Database connected for hierarchy query');
    
    // Fetch all symptoms with their variants using a direct query
    const symptoms = await prisma.symptom.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        variants: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
          orderBy: {
            name: 'asc'
          }
        }
      },
      orderBy: {
        title: 'asc'
      }
    });

    console.log(`Found ${symptoms.length} symptoms for hierarchy`);
    console.log('Sample symptom with variants:', symptoms[0]);
    
    return createApiResponse(symptoms);
  } catch (error) {
    console.error('Error fetching symptom hierarchy:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      name: error instanceof Error ? error.name : 'Unknown name',
    });
    return createErrorResponse(`Failed to fetch symptom hierarchy: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
