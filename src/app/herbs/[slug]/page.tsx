import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCachedHerb } from '@/lib/database';

export default async function HerbPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Fetch herb data from database
  const herb = await getCachedHerb(slug);

  if (!herb) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Herb Not Found</h1>
          <p className="text-gray-600 mb-4">The herb &quot;{slug}&quot; could not be found.</p>
          <Link 
            href="/herbs" 
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Herbs
          </Link>
        </div>
      </div>
    );
  }

  const products = herb.products || [];


  // Separate products into Traditional and Modern formulations
  const traditionalProducts = products.filter((product: any) => 
    product.type === 'traditional' || product.formulation === 'traditional' || 
    product.name?.toLowerCase().includes('tincture') || 
    product.name?.toLowerCase().includes('tea') ||
    product.name?.toLowerCase().includes('powder')
  );
  
  const modernProducts = products.filter((product: any) => 
    product.type === 'modern' || product.formulation === 'modern' ||
    product.name?.toLowerCase().includes('extract') ||
    product.name?.toLowerCase().includes('capsule') ||
    product.name?.toLowerCase().includes('tablet')
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Image - Full Width Above Title */}
        {herb.heroImageUrl && (
          <div className="mb-8">
            <Image
              src={herb.heroImageUrl}
              alt={herb.name}
              width={1200}
              height={400}
              className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="text-center lg:text-left mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {herb.name}
              </h1>
              {herb.latinName && (
                <p className="text-lg text-gray-600 italic mb-4">
                  {herb.latinName}
                </p>
              )}
              {/* Formatted description with proper paragraph spacing */}
              <div className="text-lg text-gray-600 max-w-2xl lg:max-w-none prose prose-lg text-justify">
                {herb.description ? (
                  herb.description.split('\n\n').map((paragraph: string, index: number) => (
                    <p key={index} className="mb-4 last:mb-0 text-justify">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-justify">This herb supports overall wellness.</p>
                )}
              </div>
            </div>

            {/* Gallery Images */}
            {herb.galleryImages && Array.isArray(herb.galleryImages) && herb.galleryImages.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {herb.galleryImages.map((image: string, index: number) => (
                    <Image
                      key={index}
                      src={image}
                      alt={`${herb.name} - Image ${index + 1}`}
                      width={300}
                      height={200}
                      className="w-full h-32 object-cover rounded-lg shadow-md"
                    />
                  ))}
                </div>
              </div>
            )}



            {/* Traditional Uses */}
            {herb.traditionalUses && Array.isArray(herb.traditionalUses) && herb.traditionalUses.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Traditional Uses</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {herb.traditionalUses.map((use: string, index: number) => (
                    <li key={index}>{use}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cautions */}
            {herb.cautions && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Important Notes</h2>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">{herb.cautions}</p>
                </div>
              </div>
            )}

            {/* References */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">References</h2>
              {herb.references && Array.isArray(herb.references) && herb.references.length > 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    {herb.references.map((reference: string, index: number) => (
                      <li key={index} className="text-sm">{reference}</li>
                    ))}
                  </ol>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-500 text-sm italic">References coming soon.</p>
                </div>
              )}
            </div>

            {/* Back to Herbs */}
            <div className="text-center lg:text-left">
              <Link 
                href="/herbs" 
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                ← Back to All Herbs
              </Link>
            </div>
          </div>

          {/* Right Sidebar - Products */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Traditional Herbal Formulations */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Traditional Herbal Formulations</h3>
                {traditionalProducts.length > 0 ? (
                  <div className="space-y-4">
                    {traditionalProducts.map((product: any, index: number) => (
                      <div key={index} className="border border-lime-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h4 className="font-semibold text-lime-900 mb-2">{product.name}</h4>
                        {product.description && (
                          <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                        )}
                        <Image 
                          src={product.imageUrl || "/images/closed-medical-brown-glass-bottle-yellow-vitamins.png"} 
                          alt={product.name} 
                          width={80} 
                          height={80} 
                          className="w-20 h-20 object-contain mb-2" 
                        />
                        <div className="flex items-center justify-between">
                          {product.price && (
                            <span className="text-lg font-bold text-lime-900">${product.price}</span>
                          )}
                          {product.affiliateLink && (
                            <a 
                              href={product.affiliateLink} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="px-3 py-1 bg-lime-700 text-white rounded hover:bg-lime-800 text-xs"
                            >
                              Buy Now
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Traditional formulations coming soon.</p>
                )}
              </div>

              {/* Modern Herbal Formulations */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Modern Herbal Formulations</h3>
                {modernProducts.length > 0 ? (
                  <div className="space-y-4">
                    {modernProducts.map((product: any, index: number) => (
                      <div key={index} className="border border-lime-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h4 className="font-semibold text-lime-900 mb-2">{product.name}</h4>
                        {product.description && (
                          <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                        )}
                        <Image 
                          src={product.imageUrl || "/images/closed-medical-brown-glass-bottle-yellow-vitamins.png"} 
                          alt={product.name} 
                          width={80} 
                          height={80} 
                          className="w-20 h-20 object-contain mb-2" 
                        />
                        <div className="flex items-center justify-between">
                          {product.price && (
                            <span className="text-lg font-bold text-lime-900">${product.price}</span>
                          )}
                          {product.affiliateLink && (
                            <a 
                              href={product.affiliateLink} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="px-3 py-1 bg-lime-700 text-white rounded hover:bg-lime-800 text-xs"
                            >
                              Buy Now
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Modern formulations coming soon.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
