import { NextResponse } from 'next/server';
import { getCachedSupplements, getCachedSupplement } from '@/lib/database';

export async function GET() {
  try {
    // Get all supplements to see their slugs
    const allSupplements = await getCachedSupplements();
    
    // Test individual queries for specific supplements
    const lTryptophan = await getCachedSupplement('l-tryptophan');
    const lTheanine = await getCachedSupplement('l-theanine');
    
    // Create analysis
    const analysis = {
      listingQuery: {
        function: 'getCachedSupplements()',
        resultCount: allSupplements.length,
        supplements: allSupplements.map((s: any) => ({
          name: s.name,
          slug: s.slug,
          id: s.id
        }))
      },
      individualQueries: {
        'l-tryptophan': lTryptophan ? {
          found: true,
          name: lTryptophan.name,
          slug: lTryptophan.slug
        } : {
          found: false
        },
        'l-theanine': lTheanine ? {
          found: true,
          name: lTheanine.name,
          slug: lTheanine.slug
        } : {
          found: false
        }
      },
      mismatch: {
        listingWorks: allSupplements.length > 0,
        individualFails: !lTryptophan,
        hasMismatch: allSupplements.length > 0 && !lTryptophan
      }
    };
    
    return NextResponse.json(analysis);
    
  } catch (error) {
    console.error('Error in slug mismatch test:', error);
    return NextResponse.json(
      { error: 'Failed to test slug mismatch', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}