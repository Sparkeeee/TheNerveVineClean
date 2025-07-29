import Link from "next/link";
import { getCachedHerbs, getCachedSymptoms } from '@/lib/database';

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
    'Poor Focus': 'yellow',
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
    'Dysbiosis': 'gray',
    'Leaky Gut': 'stone',
    'IBS': 'violet',
    'Stress': 'blue',
    'Fatigue': 'orange',
    'Mood Swings': 'pink'
  };
  
  return colorMap[symptomName] || 'gray';
}

function getSymptomTag(usedFor: string, symptoms: any[]) {
  // Find a matching symptom (case-insensitive)
  return symptoms.find(
    s => s.title.toLowerCase() === usedFor.toLowerCase()
  );
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
                {herb.indications && Array.isArray(herb.indications) && herb.indications.map((indication: any, i: number) => {
                  const tag = getSymptomTag(indication as string, symptoms);
                  return tag ? (
                    <Link
                      key={i}
                      href={`/symptoms/${tag.slug}`}
                      className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold mr-2 mb-2 bg-${getColorForSymptom(tag.title)}-100 text-${getColorForSymptom(tag.title)}-700 border-${getColorForSymptom(tag.title)}-200 transition-colors duration-200 hover:brightness-110`}
                    >
                      {tag.title}
                    </Link>
                  ) : null;
                })}
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