import Link from "next/link";
import { getCachedHerbs } from '@/lib/database';
import HerbImage from '@/components/HerbImage';

// Use ISR for optimal caching with database updates
export const revalidate = 900; // 15 minutes - matches cache TTL

// Helper to extract latin name from description if subtitle is missing
function getLatinName(description: string): string {
  const match = description.match(/\(([^)]+)\)/);
  return match ? match[1] : '';
}

export default async function HerbsPage() {
  // Fetch herbs directly from database
  let herbs = [];
  
  try {
    herbs = await getCachedHerbs();
  } catch (error) {
    console.error('Error fetching herbs:', error);
  }
  
  const sortedHerbs = herbs.sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''));

  return (
    <div className="min-h-screen bg-white relative" style={{
      backgroundImage: "url('/images/WMherbsBG.PNG')",
      backgroundSize: "110%",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed"
    }}>
      <div className="absolute inset-0 bg-emerald-200 opacity-50"></div>
      <div className="relative max-w-6xl mx-auto px-6 py-8">
        <div className="rounded-xl p-8 shadow-sm border-2 border-gray-300 mb-8" style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
          <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Herbal Medicines</h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Discover the power of natural herbs for nervous system support, stress relief, 
            and overall wellness. Each herb has unique properties to support your health journey.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedHerbs.map((herb: any, index: number) => (
            <div
              key={index}
              className="rounded-xl p-6 shadow-sm border-2 border-gray-300 hover:shadow-xl transition-all duration-200 hover:scale-105"
              style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}
            >
              <div className="flex items-start gap-4">
                {/* Text content on the left */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-blue-800 mb-1">
                    <Link href={`/herbs/${herb.slug}`}>{herb.name}</Link>
                  </h3>
                  {/* Latin name from database */}
                  <p className="text-gray-500 text-sm italic mb-2">
                    {herb.latinName || getLatinName(herb.description || '')}
                  </p>
                </div>
                
                {/* Herb image on the right */}
                {herb.cardImageUrl && (
                  <div className="flex-shrink-0">
                    <HerbImage 
                      src={herb.cardImageUrl} 
                      alt={`${herb.name} herb`}
                      className="w-20 h-20 object-contain rounded-lg shadow-sm border border-gray-200 bg-gray-50"
                    />
                  </div>
                )}
              </div>
              
              {/* Indication Tags */}
              {herb.indicationTags && herb.indicationTags.length > 0 && (
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {herb.indicationTags.map((indication: any) => (
                      <span
                        key={indication.slug}
                        className={`inline-block px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                          indication.color === 'blue' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          indication.color === 'green' ? 'bg-green-100 text-green-800 border-green-200' :
                          indication.color === 'red' ? 'bg-red-100 text-red-800 border-red-200' :
                          indication.color === 'purple' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                          indication.color === 'orange' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                          'bg-gray-100 text-gray-800 border-gray-200'
                        }`}
                      >
                        {indication.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center px-6 py-3 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-gray-400 hover:text-gray-600 hover:shadow-gray-300 hover:shadow-lg hover:scale-105"
          >
            ← Back to NerveVine
          </Link>
        </div>
      </div>
    </div>
  );
} 