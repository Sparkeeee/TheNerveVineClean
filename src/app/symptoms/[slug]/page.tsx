import Link from 'next/link';
import Image from 'next/image';
import VariantSymptomPage from './VariantSymptomPage';
import { Symptom, Product } from '../../../types/symptom';
import { getSymptomBySlug } from '../../../lib/symptoms';

export default async function SymptomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Fetch symptom data from database
  const symptom = await getSymptomBySlug(slug);

  if (!symptom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Symptom Not Found</h1>
          <p className="text-gray-600 mb-4">The symptom "{slug}" could not be found.</p>
          <Link 
            href="/symptoms" 
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Symptoms
          </Link>
        </div>
      </div>
    );
  }

  // --- VARIANT LOGIC ---
  const hasVariants = symptom.variants && typeof symptom.variants === 'object' && !Array.isArray(symptom.variants);
  if (hasVariants) {
    return <VariantSymptomPage symptom={symptom} />;
  }

  // --- OLD STRUCTURE FALLBACK ---
  // Example: Add placeholder products if not present (for plug-and-play API integration)
  const products = symptom.products || [
    {
      name: "Best Magnesium Glycinate",
      description: "Highly bioavailable magnesium for stress and sleep support.",
      affiliateUrl: "https://amzn.to/placeholder-magnesium",
      price: "$18.99",
      qualityScore: 9.2,
      affiliateRevenue: 0.08, // 8% commission
      image: "/images/magnesium.jpg",
      supplier: "Amazon"
    },
    {
      name: "Premium Ashwagandha Extract",
      description: "Clinically studied adaptogen for stress and anxiety.",
      affiliateUrl: "https://amzn.to/placeholder-ashwagandha",
      price: "$21.99",
      qualityScore: 9.5,
      affiliateRevenue: 0.10,
      image: "/images/ashwagandha.jpg",
      supplier: "Amazon"
    },
    {
      name: "Top L-Theanine Capsules",
      description: "Supports calm focus and relaxation without drowsiness.",
      affiliateUrl: "https://amzn.to/placeholder-theanine",
      price: "$16.99",
      qualityScore: 9.0,
      affiliateRevenue: 0.07,
      image: "/images/theanine.jpg",
      supplier: "Amazon"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {symptom.name}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {symptom.description}
          </p>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Body Map
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Education */}
          <div className="md:col-span-2 space-y-8">
            {/* Understanding Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Understanding {symptom.name}
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  {symptom.description} Understanding the underlying causes and symptoms can help you 
                  make informed decisions about natural support options.
                </p>
                <p className="text-gray-700 mb-4">
                  Natural approaches to {(symptom.name?.toLowerCase() ?? "")} often involve addressing root causes, 
                  supporting the body&apos;s natural healing processes, and using evidence-based herbs and 
                  supplements that have been traditionally and clinically studied.
                </p>
              </div>
            </div>

            {/* Symptoms Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Common Symptoms
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Primary Symptoms</h3>
                  <ul className="text-gray-700 space-y-1">
                    {symptom.symptoms && symptom.symptoms.slice(0, 6).map((symptomItem: string, index: number) => (
                      <li key={index}>• {symptomItem}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Common Causes</h3>
                  <ul className="text-gray-700 space-y-1">
                    {symptom.causes && symptom.causes.slice(0, 6).map((cause: string, index: number) => (
                      <li key={index}>• {cause}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Natural Solutions Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Natural Support Options
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Herbal Support</h3>
                  <ul className="text-gray-700 space-y-1">
                    {symptom.naturalSolutions && symptom.naturalSolutions
                      .filter((solution: Product) => solution.type === 'herb')
                      .slice(0, 3)
                      .map((solution: { name: string; description: string }, index: number) => (
                        <li key={index}>• {solution.name} - {solution.description}</li>
                      ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Supplemental Support</h3>
                  <ul className="text-gray-700 space-y-1">
                    {symptom.naturalSolutions && symptom.naturalSolutions
                      .filter((solution: Product) => solution.type === 'supplement')
                      .slice(0, 3)
                      .map((solution: { name: string; description: string }, index: number) => (
                        <li key={index}>• {solution.name} - {solution.description}</li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Product Recommendations */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Recommended Products
              </h2>
              <div className="space-y-4">
                {products.map((product, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 flex flex-col gap-4">
                    <Image 
                      src={product.image || '/images/closed-medical-brown-glass-bottle-yellow-vitamins.png'} 
                      alt={product.name} 
                      width={80}
                      height={80}
                      className="object-contain rounded mb-2" 
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-blue-700 font-bold">{product.price}</span>
                        <span className="text-xs text-green-700 bg-green-100 rounded px-2 py-0.5">Quality: {product.qualityScore}</span>
                        <span className="text-xs text-purple-700 bg-purple-100 rounded px-2 py-0.5">Affiliate: {Math.round((product.affiliateRevenue ?? 0) * 100)}%</span>
                        {product.supplier && (
                          <span className="text-xs text-gray-500 ml-2">{product.supplier}</span>
                        )}
                      </div>
                      <a 
                        href={product.affiliateUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                      >
                        View on {product.supplier || 'Amazon'} →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Conditions */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-3">Related Conditions</h3>
              <div className="space-y-2">
                <Link 
                  href="/symptoms/anxiety" 
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                >
                  → Anxiety
                </Link>
                <Link 
                  href="/symptoms/depression" 
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                >
                  → Depression
                </Link>
                <Link 
                  href="/symptoms/fatigue" 
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                >
                  → Fatigue
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> This information is for educational purposes only and should not 
            replace professional medical advice. Always consult with a healthcare provider before starting 
            any new supplement regimen, especially if you have underlying health conditions or are taking 
            medications. The product links are affiliate links that support this educational content.
          </p>
        </div>
      </div>
    </div>
  );
} 