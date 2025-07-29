import { NextRequest } from 'next/server';
import { getCachedHerbsOptimized, getCachedSymptomsOptimized, getCachedSupplementsOptimized } from '@/lib/database';
import { createApiResponse, createErrorResponse, withDatabaseTimeout } from '@/lib/api-utils';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'herb' | 'supplement' | 'symptom';
  url: string;
  tags: string[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!query.trim()) {
      return createApiResponse([]);
    }

    const searchTerm = query.toLowerCase();

    // Use optimized cached functions with pagination for Vercel
    const [herbs, symptoms, supplements] = await withDatabaseTimeout(async () => {
      return Promise.all([
        getCachedHerbsOptimized(50, 0), // Limit to 50 herbs for search
        getCachedSymptomsOptimized(50, 0), // Limit to 50 symptoms for search
        getCachedSupplementsOptimized(50, 0) // Limit to 50 supplements for search
      ]);
    });

    const results: SearchResult[] = [];

    // Search herbs
    const herbMatches = herbs.filter((herb: any) => 
      herb.name?.toLowerCase().includes(searchTerm) ||
      herb.description?.toLowerCase().includes(searchTerm) ||
      herb.latinName?.toLowerCase().includes(searchTerm)
    );

    herbMatches.forEach((herb: any) => {
      results.push({
        id: herb.id,
        title: herb.name,
        description: herb.description,
        type: 'herb',
        url: `/herbs/${herb.slug}`,
        tags: []
      });
    });

    // Search symptoms
    const symptomMatches = symptoms.filter((symptom: any) => 
      symptom.title?.toLowerCase().includes(searchTerm) ||
      symptom.description?.toLowerCase().includes(searchTerm)
    );

    symptomMatches.forEach((symptom: any) => {
      results.push({
        id: symptom.id,
        title: symptom.title,
        description: symptom.description,
        type: 'symptom',
        url: `/symptoms/${symptom.slug}`,
        tags: []
      });
    });

    // Search supplements
    const supplementMatches = supplements.filter((supplement: any) => 
      supplement.name?.toLowerCase().includes(searchTerm) ||
      supplement.description?.toLowerCase().includes(searchTerm)
    );

    supplementMatches.forEach((supplement: any) => {
      results.push({
        id: supplement.id,
        title: supplement.name,
        description: supplement.description,
        type: 'supplement',
        url: `/supplements/${supplement.slug}`,
        tags: []
      });
    });

    // Apply pagination to results
    const paginatedResults = results.slice(offset, offset + limit);

    return createApiResponse({
      results: paginatedResults,
      total: results.length,
      page: Math.floor(offset / limit) + 1,
      hasMore: offset + limit < results.length
    });

  } catch (error) {
    console.error('Search error:', error);
    return createErrorResponse('Search operation failed');
  }
} 