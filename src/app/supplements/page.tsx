import Link from "next/link";
import { getCachedSupplements, getCachedSymptoms } from '@/lib/database';

// Force dynamic rendering - don't pre-render this page
export const dynamic = 'force-dynamic';

export default async function SupplementsPage() {
  // Fetch supplements from database and sort alphabetically by name
  let supplements = [];
  
  try {
    supplements = await getCachedSupplements();
  } catch (error) {
    console.error('Error fetching supplements:', error);
  }
  
  const sortedSupplements = supplements.sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''));

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Supplements</h1>
        <p className="text-lg text-gray-700 mb-8 text-center max-w-3xl mx-auto">
          Essential nutrients and compounds to support your nervous system health, 
          cognitive function, and overall wellness. Quality supplements can fill 
          nutritional gaps and enhance your natural healing processes.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedSupplements.map((supplement: any, index: number) => (
            <Link 
              key={index} 
              href={`/supplements/${supplement.slug}`}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <h3 className="text-xl font-semibold text-blue-800 mb-2">{supplement.name}</h3>
              <p className="text-gray-600 text-sm">{supplement.description?.split('\n')[0] || ''}</p>
            </Link>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            ← Back to NerveVine
          </Link>
        </div>
      </div>
    </div>
  );
} 