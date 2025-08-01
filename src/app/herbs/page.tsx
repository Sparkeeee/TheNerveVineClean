import Link from "next/link";
import { getCachedHerbs, getCachedSymptoms } from '@/lib/database';

// Use ISR for optimal caching with database updates
export const revalidate = 900; // 15 minutes - matches cache TTL

// Helper to extract latin name from description if subtitle is missing
function getLatinName(description: string): string {
  const match = description.match(/\(([^)]+)\)/);
  return match ? match[1] : '';
}

function getColorForSymptom(symptomName: string): string {
  const colorMap: { [key: string]: string } = {
    'Insomnia': 'indigo',
    'Depression': 'pink',
    'Anxiety': 'blue',
    'Poor Focus': 'amber',
    'Tension Headaches': 'green',
    'Emotional Burnout': 'orange',
    'Thyroid Issues': 'purple',
    'Neck Tension': 'teal',
    'Blood Pressure Balance': 'red',
    'Heart Muscle Support': 'rose',
    'Liver Function Support': 'lime',
    'Hormonal Imbalances': 'fuchsia',
    'Adrenal Overload': 'cyan',
    'Adrenal Exhaustion': 'amber',
    'Circadian Support': 'sky',
    'Vagus Nerve Support': 'emerald',
    'Dysbiosis': 'slate',
    'Leaky Gut': 'stone',
    'IBS': 'violet',
    'Stress': 'blue',
    'Fatigue': 'orange',
    'Mood Swings': 'pink'
  };
  
  return colorMap[symptomName] || 'slate';
}

function getSymptomTagClasses(symptomName: string): string {
  const colorMap: { [key: string]: string } = {
    'Insomnia': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'Depression': 'bg-pink-100 text-pink-800 border-pink-200',
    'Anxiety': 'bg-blue-100 text-blue-800 border-blue-200',
    'Poor Focus': 'bg-amber-100 text-amber-800 border-amber-200',
    'Tension Headaches': 'bg-green-100 text-green-800 border-green-200',
    'Emotional Burnout': 'bg-orange-100 text-orange-800 border-orange-200',
    'Thyroid Issues': 'bg-purple-100 text-purple-800 border-purple-200',
    'Neck Tension': 'bg-teal-100 text-teal-800 border-teal-200',
    'Blood Pressure Balance': 'bg-red-100 text-red-800 border-red-200',
    'Heart Muscle Support': 'bg-rose-100 text-rose-800 border-rose-200',
    'Liver Function Support': 'bg-lime-100 text-lime-800 border-lime-200',
    'Hormonal Imbalances': 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
    'Adrenal Overload': 'bg-cyan-100 text-cyan-800 border-cyan-200',
    'Adrenal Exhaustion': 'bg-amber-100 text-amber-800 border-amber-200',
    'Circadian Support': 'bg-sky-100 text-sky-800 border-sky-200',
    'Vagus Nerve Support': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Dysbiosis': 'bg-slate-100 text-slate-800 border-slate-200',
    'Leaky Gut': 'bg-stone-100 text-stone-800 border-stone-200',
    'IBS': 'bg-violet-100 text-violet-800 border-violet-200',
    'Stress': 'bg-blue-100 text-blue-800 border-blue-200',
    'Fatigue': 'bg-orange-100 text-orange-800 border-orange-200',
    'Mood Swings': 'bg-pink-100 text-pink-800 border-pink-200'
  };
  
  return colorMap[symptomName] || 'bg-slate-100 text-slate-800 border-slate-200';
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
  // Fetch herbs and symptoms directly from database
  let herbs = [];
  let symptoms = [];
  
  try {
    herbs = await getCachedHerbs();
  } catch (error) {
    console.error('Error fetching herbs:', error);
  }
  
  try {
    symptoms = await getCachedSymptoms();
  } catch (error) {
    console.error('Error fetching symptoms:', error);
  }
  
  const sortedHerbs = herbs.sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''));

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Herbal Medicines</h1>
        <p className="text-lg text-gray-700 mb-8 text-center max-w-3xl mx-auto">
          Discover the power of natural herbs for nervous system support, stress relief, 
          and overall wellness. Each herb has unique properties to support your health journey.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedHerbs.map((herb: any, index: number) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <h3 className="text-xl font-semibold text-blue-800 mb-1">
                <Link href={`/herbs/${herb.slug}`}>{herb.name}</Link>
              </h3>
              {/* Latin name from database */}
              <p className="text-gray-500 text-sm italic mb-2">
                {herb.latinName || getLatinName(herb.description || '')}
              </p>
              <hr className="my-3 border-blue-100" />
              {/* Tags for main indications (symptoms) */}
              <div className="flex flex-wrap gap-2 mt-4">
                {herb.indications && Array.isArray(herb.indications) && (() => {
                  const uniqueTags = new Map();
                  herb.indications.forEach((indication: any) => {
                    const tag = getSymptomTag(indication as string, symptoms);
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
              {/* Traditional Uses */}
              <div className="flex flex-wrap gap-2 mt-4">
                {herb.traditionalUses && Array.isArray(herb.traditionalUses) && herb.traditionalUses.map((use: any, i: number) => (
                  <span
                    key={i}
                    className="inline-block px-3 py-1 rounded-full border text-xs font-semibold mr-2 mb-2 bg-gray-100 text-gray-700 border-gray-200"
                  >
                    {use as string}
                  </span>
                ))}
              </div>
            </div>
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