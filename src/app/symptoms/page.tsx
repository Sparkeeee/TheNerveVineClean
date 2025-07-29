import Link from "next/link";
import { getCachedSymptoms } from '@/lib/database';

interface Symptom {
  name: string;
  href: string;
  description: string;
}

export default async function SymptomsPage() {
  let symptoms = [];
  
  try {
    symptoms = await getCachedSymptoms();
  } catch (error) {
    console.error('Error fetching symptoms:', error);
  }

  const symptomList: Symptom[] = symptoms.map((symptom: any): Symptom => ({
    name: symptom.title,
    href: `/symptoms/${symptom.slug}`,
    description: symptom.description ? 
      (symptom.description.length > 100 ? 
        symptom.description.substring(0, 100) + '...' : 
        symptom.description) : 
      'Natural solutions for health and wellness'
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Symptoms & Conditions</h1>
        
        <p className="text-lg text-gray-700 mb-8 text-center max-w-3xl mx-auto">
          Explore natural solutions for various health concerns. Each symptom page provides 
          targeted herbal and supplement recommendations to support your wellness journey.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {symptomList.map((symptom: Symptom, index: number) => (
            <Link 
              key={index} 
              href={symptom.href}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <h3 className="text-xl font-semibold text-blue-800 mb-2">{symptom.name}</h3>
              <p className="text-gray-600 text-sm">{symptom.description}</p>
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