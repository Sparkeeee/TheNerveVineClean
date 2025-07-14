import { notFound } from 'next/navigation';
import Image from 'next/image';
import { herbs } from '../../../data/herbs';

interface HerbPageProps {
  params: Promise<{ slug: string }>;
}

export default async function HerbPage({ params }: HerbPageProps) {
  const { slug } = await params;
  const herb = herbs.find(h => h.slug === slug);

  if (!herb) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-900 mb-2">{herb.name}</h1>
          {herb.subtitle && <p className="text-xl text-purple-700 mb-4">{herb.subtitle}</p>}
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{herb.description}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Benefits & Traditional Uses */}
          <div className="lg:col-span-2 space-y-6">
            {/* Enhanced Benefits Section */}
            {herb.benefits && (
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-semibold text-purple-800 mb-4">🌟 Key Benefits & Research Highlights</h2>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-800 mb-2">Primary Benefits</h3>
                    <ul className="space-y-2">
                      {herb.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-purple-500 mr-3 mt-1">✓</span>
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {herb.traditionalUses && (
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
                      <h3 className="font-semibold text-green-800 mb-2">Traditional Wisdom</h3>
                      <ul className="space-y-1">
                        {herb.traditionalUses.map((use, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            <span className="text-gray-700 text-sm">{use}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Enhanced Safety Section */}
            {(herb.safety || herb.preparation) && (
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-semibold text-purple-800 mb-4">🛡️ Safety & Usage Guidelines</h2>
                <div className="space-y-4">
                  {herb.safety && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <h3 className="font-semibold text-orange-800 mb-2">📋 Specific Considerations</h3>
                      <p className="text-orange-700 text-sm">{herb.safety}</p>
                    </div>
                  )}
                  {herb.preparation && (
                    <div className="bg-white rounded-lg p-4 shadow-lg">
                      <h3 className="font-semibold text-purple-800 mb-2">🌿 Preparation</h3>
                      <p className="text-gray-700 text-sm">{herb.preparation}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Top Products */}
          {herb.affiliates && herb.affiliates.length > 0 && (
            <div className="bg-white rounded-lg p-6 shadow-lg h-fit">
              <h2 className="text-2xl font-semibold text-purple-800 mb-6">Top Products</h2>
              <div className="space-y-4">
                {herb.affiliates.map((product, index) => (
                  <div key={index} className="border border-purple-200 rounded-lg p-4 flex flex-col gap-4">
                    <Image
                      src={product.image || '/images/closed-medical-brown-glass-bottle-yellow-vitamins.png'}
                      alt={product.name}
                      width={80}
                      height={80}
                      className="object-contain rounded mb-2"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-purple-900 mb-2">{product.name}</h3>
                      {product.description && <p className="text-gray-600 text-sm mb-3">{product.description}</p>}
                      {product.price && <span className="text-purple-600 font-bold">{product.price}</span>}
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-purple-600 text-white text-center py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium mt-2"
                      >
                        Check Price →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            <strong>Disclaimer:</strong> These statements have not been evaluated by the FDA.
            This product is not intended to diagnose, treat, cure, or prevent any disease.
            Always consult with a healthcare professional before starting any new herbal regimen,
            especially if you are pregnant, nursing, or taking medications.
          </p>
        </div>
      </div>
    </div>
  );
}
