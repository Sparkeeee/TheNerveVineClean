import Link from "next/link";
import { getCachedSymptoms } from '@/lib/database';

// Use ISR for optimal caching with database updates
export const revalidate = 900; // 15 minutes - matches cache TTL

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
    <div className="min-h-screen bg-white relative" style={{
      backgroundImage: "url('/images/RoseWPWM.PNG')",
      backgroundSize: "110%",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed"
    }}>
      <div className="absolute inset-0 bg-pink-100 opacity-90"></div>
      <div className="relative max-w-6xl mx-auto px-6 py-8">
        <div className="rounded-xl p-8 shadow-sm border border-gray-100 mb-8" style={{background: 'linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 50%, #f0fdf4 100%)'}}>
          <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Symptoms & Conditions</h1>
          
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Explore natural solutions for various health concerns. Each symptom page provides 
            targeted herbal and supplement recommendations to support your wellness journey.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {symptomList.map((symptom: Symptom, index: number) => (
            <Link 
              key={index} 
              href={symptom.href}
              className="rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-200 hover:scale-105"
              style={{background: 'linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 50%, #f0fdf4 100%)'}}
            >
              <h3 className="text-xl font-semibold text-blue-800 mb-2">{symptom.name}</h3>
              <p className="text-gray-600 text-sm">{symptom.description}</p>
            </Link>
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