import Link from "next/link";
import { getCachedSupplements, getCachedSymptoms } from '@/lib/database';

// Helper functions for indication tags (same as herbs page)
function getColorForSymptom(symptomName: string): string {
  const colors = [
    'bg-blue-100 text-blue-800 border-blue-200',
    'bg-green-100 text-green-800 border-green-200',
    'bg-purple-100 text-purple-800 border-purple-200',
    'bg-orange-100 text-orange-800 border-orange-200',
    'bg-red-100 text-red-800 border-red-200',
    'bg-indigo-100 text-indigo-800 border-indigo-200',
    'bg-pink-100 text-pink-800 border-pink-200',
    'bg-yellow-100 text-yellow-800 border-yellow-200',
    'bg-teal-100 text-teal-800 border-teal-200',
    'bg-cyan-100 text-cyan-800 border-cyan-200'
  ];
  
  // Simple hash function for consistent colors
  let hash = 0;
  for (let i = 0; i < symptomName.length; i++) {
    hash = ((hash << 5) - hash) + symptomName.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return colors[Math.abs(hash) % colors.length];
}

function getSymptomTagClasses(symptomName: string): string {
  return getColorForSymptom(symptomName);
}

function getSymptomTag(usedFor: string, symptoms: any[]) {
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
      symptomWords.some((symptomWord: string) => 
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

export default async function SupplementsPage() {
  // Fetch supplements and symptoms from database
  let supplements = [];
  let symptoms = [];
  
  try {
    supplements = await getCachedSupplements();
  } catch (error) {
    console.error('Error fetching supplements:', error);
  }
  
  try {
    symptoms = await getCachedSymptoms();
  } catch (error) {
    console.error('Error fetching symptoms:', error);
  }
  
  const sortedSupplements = supplements.sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''));

  return (
    <div className="min-h-screen bg-white relative" style={{
      backgroundImage: "url('/images/hexBG.jpg')",
      backgroundSize: "110%",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed"
    }}>
      <div className="absolute inset-0 bg-blue-100 opacity-70"></div>
      <div className="relative max-w-6xl mx-auto px-6 py-8">
        <div className="rounded-xl p-8 shadow-sm border border-gray-100 mb-8" style={{background: 'linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 50%, #f0fdf4 100%)'}}>
          <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Supplements</h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Essential nutrients and compounds to support your nervous system health, 
            cognitive function, and overall wellness. Quality supplements can fill 
            nutritional gaps and enhance your natural healing processes.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedSupplements.map((supplement: any, index: number) => (
            <div
              key={index}
              className="rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-200 hover:scale-105"
              style={{background: 'linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 50%, #f0fdf4 100%)'}}
            >
              {/* Card Image */}
              {supplement.cardImageUrl && (
                <div className="mb-4 flex justify-center">
                  <img 
                    src={supplement.cardImageUrl} 
                    alt={supplement.name}
                    className="w-16 h-16 object-contain rounded-lg"
                  />
                </div>
              )}
              
              <h3 className="text-xl font-semibold text-blue-800 mb-2">
                <Link href={`/supplements/${supplement.slug}`}>{supplement.name}</Link>
              </h3>
              
              {/* Truncated description */}
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {truncateDescription(supplement.description)}
              </p>
              
              {/* Indication tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {supplement.indicationTags && supplement.indicationTags.length > 0 && (() => {
                  const uniqueTags = new Map();
                  supplement.indicationTags.forEach((indication: any) => {
                    const tag = getSymptomTag(indication.name, symptoms);
                    if (tag && !uniqueTags.has(tag.slug)) {
                      uniqueTags.set(tag.slug, tag);
                    }
                  });
                  return Array.from(uniqueTags.values()).map((tag: any, i: number) => (
                    <Link
                      key={i}
                      href={`/symptoms/${tag.slug}`}
                      className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold mr-2 mb-2 transition-colors duration-200 hover:brightness-110 ${getSymptomTagClasses(tag.title)}`}
                    >
                      {tag.title}
                    </Link>
                  ));
                })()}
              </div>
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