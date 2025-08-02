import Link from "next/link";
import { getCachedHerbs } from '@/lib/database';
import HerbImage from '@/components/HerbImage';

// Helper function to truncate description to ~2 lines
function truncateDescription(description: string): string {
  if (!description) return '';
  
  // Split into sentences and take first 2-3 sentences
  const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const firstTwoSentences = sentences.slice(0, 2).join('. ');
  
  // If it's still too long, truncate to ~150 characters
  if (firstTwoSentences.length > 150) {
    return firstTwoSentences.substring(0, 150).trim() + '...';
  }
  
  return firstTwoSentences + (sentences.length > 2 ? '...' : '');
}

// Use ISR for optimal caching with database updates
export const revalidate = 900; // 15 minutes - matches cache TTL

// Helper to extract latin name from description if subtitle is missing
function getLatinName(description: string): string {
  const match = description.match(/\(([^)]+)\)/);
  return match ? match[1] : '';
}

// Removed unused functions to fix ESLint warnings
  const indication = usedFor.toLowerCase().trim();
  
  // First try exact match (most precise)
  let match = symptoms.find(s => s.title.toLowerCase() === indication);
  if (match) return match;
  
  // Try word boundary matches (more precise than partial)
  const indicationWords = indication.split(/\s+/);
  match = symptoms.find(s => {
    const symptomWords = s.title.toLowerCase().split(/\s+/);
    // Check if all indication words are present in symptom title
    return indicationWords.every(word => 
      symptomWords.some(symptomWord => 
        symptomWord === word || symptomWord.startsWith(word) || word.startsWith(symptomWord)
      )
    );
  });
  if (match) return match;
  
  // Only if no word boundary match, try partial match
  match = symptoms.find(s => s.title.toLowerCase().includes(indication));
  if (match) return match;
  
  // Last resort: reverse partial match
  match = symptoms.find(s => indication.includes(s.title.toLowerCase()));
  
  return match;
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
      <div className="absolute inset-0 bg-green-100 opacity-50"></div>
      <div className="relative max-w-6xl mx-auto px-6 py-8">
        <div className="rounded-xl p-8 shadow-sm border border-gray-100 mb-8" style={{background: 'linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 50%, #f0fdf4 100%)'}}>
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
              className="rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-200 hover:scale-105"
              style={{background: 'linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 50%, #f0fdf4 100%)'}}
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
                  {/* Truncated description */}
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {truncateDescription(herb.description)}
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
              <hr className="my-3 border-blue-100" />


            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-green-700 text-blue-50 font-semibold rounded-lg hover:bg-green-800 transition-colors"
          >
            ← Back to NerveVine
          </Link>
        </div>
      </div>
    </div>
  );
} 