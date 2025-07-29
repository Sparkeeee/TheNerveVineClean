import { createApiResponse, createErrorResponse } from '@/lib/api-utils';
import prisma from '@/lib/database';

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Check if tables have data
    const herbCount = await prisma.herb.count();
    const supplementCount = await prisma.supplement.count();
    const symptomCount = await prisma.symptom.count();
    
    // Get a sample herb
    const sampleHerb = await prisma.herb.findFirst({
      select: { id: true, name: true, slug: true }
    });
    
    // Get a sample supplement
    const sampleSupplement = await prisma.supplement.findFirst({
      select: { id: true, name: true, slug: true }
    });
    
    // Get a sample symptom
    const sampleSymptom = await prisma.symptom.findFirst({
      select: { id: true, title: true, slug: true }
    });
    
    return createApiResponse({
      connection: 'success',
      counts: {
        herbs: herbCount,
        supplements: supplementCount,
        symptoms: symptomCount
      },
      samples: {
        herb: sampleHerb,
        supplement: sampleSupplement,
        symptom: sampleSymptom
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    return createErrorResponse(`Database test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}