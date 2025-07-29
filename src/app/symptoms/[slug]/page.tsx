import Link from 'next/link';
import Image from 'next/image';
import VariantSymptomPage from './VariantSymptomPage';
import { getCachedSymptom } from '@/lib/database';

export default async function SymptomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Fetch symptom data directly from database instead of API
  let symptom;
  try {
    symptom = await getCachedSymptom(slug);
  } catch (error) {
    console.error('Error in symptom page:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Service Temporarily Unavailable</h1>
          <p className="text-gray-600 mb-4">We&apos;re experiencing technical difficulties. Please try again later.</p>
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

  if (!symptom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Symptom Not Found</h1>
          <p className="text-gray-600 mb-4">The symptom &quot;{slug}&quot; could not be found.</p>
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

  // Transform database data to match expected format with error handling
  let transformedSymptom;
  try {
    transformedSymptom = {
      name: symptom.title,
      title: symptom.title,
      description: symptom.description || '',
      paragraphs: [],
      symptoms: [],
      causes: [],
      naturalSolutions: [],
      relatedSymptoms: [],
      disclaimer: undefined,
      emergencyNote: undefined,
      variants: symptom.variants || {},
      products: symptom.products || []
    };
  } catch (error) {
    console.error('Error transforming symptom data:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Data Error</h1>
          <p className="text-gray-600 mb-4">Unable to process symptom data.</p>
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
  const hasVariants = transformedSymptom.variants && typeof transformedSymptom.variants === 'object' && !Array.isArray(transformedSymptom.variants);
  if (hasVariants) {
    return <VariantSymptomPage symptom={transformedSymptom} />;
  }

  // Use database products or empty array if none available
  const products = transformedSymptom.products || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {transformedSymptom.name}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {transformedSymptom.description}
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
                Understanding {transformedSymptom.name}
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  {transformedSymptom.description} Understanding the underlying causes and symptoms can help you 
                  make informed decisions about natural support options.
                </p>
                <p className="text-gray-700 mb-4">
                  Natural approaches to {(transformedSymptom.name?.toLowerCase() ?? "")} often involve addressing root causes, 
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
                    {transformedSymptom.symptoms && transformedSymptom.symptoms.slice(0, 6).map((symptomItem: string, index: number) => (
                      <li key={index}>• {symptomItem}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Common Causes</h3>
                  <ul className="text-gray-700 space-y-1">
                    {transformedSymptom.causes && transformedSymptom.causes.slice(0, 6).map((cause: string, index: number) => (
                      <li key={index}>• {cause}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Natural Solutions Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Natural Solutions
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  Natural approaches to {transformedSymptom.name?.toLowerCase() ?? ""} focus on supporting the body&apos;s 
                  natural healing processes through evidence-based herbs, supplements, and lifestyle modifications.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  {transformedSymptom.naturalSolutions && transformedSymptom.naturalSolutions.slice(0, 4).map((solution: string, index: number) => (
                    <div key={index} className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Solution {index + 1}</h4>
                      <p className="text-blue-700 text-sm">{solution}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Products */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Recommended Products
              </h2>
              <div className="space-y-4">
                {products.length > 0 ? (
                  products.map((product: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold text-gray-800 mb-2">{product.name || 'Product'}</h3>
                      {product.description && <p className="text-gray-600 text-sm mb-2">{product.description}</p>}
                      {product.imageUrl && (
                        <Image 
                          src={product.imageUrl} 
                          alt={product.name || 'Product'} 
                          width={80} 
                          height={80} 
                          className="w-20 h-20 object-contain mb-2" 
                        />
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-800">{product.price ? `$${product.price}` : ''}</span>
                        {product.affiliateLink && (
                          <a 
                            href={product.affiliateLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                          >
                            Buy Now
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm italic text-center py-4">
                    No products available for this symptom yet. Check back soon for recommendations.
                  </p>
                )}
              </div>
            </div>

            {/* Related Symptoms */}
            {transformedSymptom.relatedSymptoms && transformedSymptom.relatedSymptoms.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Related Symptoms</h3>
                <div className="space-y-2">
                  {transformedSymptom.relatedSymptoms.map((relatedSymptom: string, index: number) => (
                    <Link 
                      key={index}
                      href={`/symptoms/${relatedSymptom.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      • {relatedSymptom}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        {transformedSymptom.disclaimer && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Important Notice</h3>
            <p className="text-yellow-700 text-sm">{transformedSymptom.disclaimer}</p>
          </div>
        )}

        {/* Emergency Note */}
        {transformedSymptom.emergencyNote && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-800 mb-2">⚠️ Emergency Warning</h3>
            <p className="text-red-700 text-sm">{transformedSymptom.emergencyNote}</p>
          </div>
        )}
      </div>
    </div>
  );
} 