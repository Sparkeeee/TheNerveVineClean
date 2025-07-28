import { NextRequest, NextResponse } from 'next/server';
import { getCachedHerbs, getCachedSymptoms, getCachedSupplements } from '@/lib/database';

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

    if (!query.trim()) {
      return NextResponse.json({ success: true, data: [] });
    }

    const searchTerm = query.toLowerCase();

    // Use cached functions to reduce database calls
    const [herbs, symptoms, supplements] = await Promise.all([
      getCachedHerbs(),
      getCachedSymptoms(),
      getCachedSupplements()
    ]);

    const results: SearchResult[] = [];

    // Search herbs
    const herbMatches = herbs.filter((herb: any) => 
      herb.name?.toLowerCase().includes(searchTerm) ||
      herb.description?.toLowerCase().includes(searchTerm) ||
      herb.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm))
    );

    herbMatches.forEach((herb: any) => {
      results.push({
        id: herb.id,
        title: herb.name,
        description: herb.description,
        type: 'herb',
        url: `/herbs/${herb.slug}`,
        tags: herb.tags || []
      });
    });

    // Search symptoms
    const symptomMatches = symptoms.filter((symptom: any) => 
      symptom.name?.toLowerCase().includes(searchTerm) ||
      symptom.description?.toLowerCase().includes(searchTerm) ||
      symptom.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm))
    );

    symptomMatches.forEach((symptom: any) => {
      results.push({
        id: symptom.id,
        title: symptom.name,
        description: symptom.description,
        type: 'symptom',
        url: `/symptoms/${symptom.slug}`,
        tags: symptom.tags || []
      });
    });

    // Search supplements
    const supplementMatches = supplements.filter((supplement: any) => 
      supplement.name?.toLowerCase().includes(searchTerm) ||
      supplement.description?.toLowerCase().includes(searchTerm) ||
      supplement.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm))
    );

    supplementMatches.forEach((supplement: any) => {
      results.push({
        id: supplement.id,
        title: supplement.name,
        description: supplement.description,
        type: 'supplement',
        url: `/supplements/${supplement.slug}`,
        tags: supplement.tags || []
      });
    });

    return NextResponse.json({ 
      success: true, 
      data: results.slice(0, 10) // Limit to 10 results
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ 
      success: true, 
      data: [] 
    });
  }
} 