import Link from "next/link";
import { getCachedHerbs } from '@/lib/database';
import HerbImage from '@/components/HerbImage';

// Helper function to truncate description to ~2 lines
function truncateDescription(description: string): string {
  if (!description) return '';
  
  // Check if content is HTML
  const isHtml = /<[^>]*>/.test(description);
  
  if (isHtml) {
    // For HTML content, strip tags and get plain text
    const plainText = description
      .replace(/<[^>]*>/g, '') // Remove all HTML tags
      .replace(/&nbsp;/g, ' ') // Replace HTML entities
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
    
    // Truncate the plain text
    if (plainText.length > 150) {
      return plainText.substring(0, 150).trim() + '...';
    }
    
    return plainText;
  } else {
    // For plain text, use the original logic
    const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const firstTwoSentences = sentences.slice(0, 2).join('. ');
    
    // If it's still too long, truncate to ~150 characters
    if (firstTwoSentences.length > 150) {
      return firstTwoSentences.substring(0, 150).trim() + '...';
    }
    
    return firstTwoSentences + (sentences.length > 2 ? '...' : '');
  }
}

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
              
              {/* Indications */}
              {herb.indicationTags && herb.indicationTags.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">Indications:</p>
                  <div className="flex flex-wrap gap-1">
                    {herb.indicationTags.map((indication: any) => (
                      <Link
                        key={indication.slug}
                        href={`/symptoms/${indication.slug}`}
                        className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
                      >
                        {indication.name}
                      </Link>
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