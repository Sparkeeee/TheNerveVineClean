import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCachedSupplement } from '@/lib/database';

export default async function SupplementPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Fetch supplement data from database
  const supplement = await getCachedSupplement(slug);

  if (!supplement) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Supplement Not Found</h1>
          <p className="text-gray-600 mb-4">The supplement &quot;{slug}&quot; could not be found.</p>
          <Link 
            href="/supplements" 
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Supplements
          </Link>
        </div>
      </div>
    );
  }

  const products = supplement.products || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Image - Moved to top */}
        {supplement.heroImageUrl && (
          <div className="mb-8 max-w-full overflow-hidden">
            <Image
              src={supplement.heroImageUrl}
              alt={supplement.name}
              width={800}
              height={400}
              className="w-full h-64 object-contain rounded-lg shadow-lg"
            />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {supplement.name}
              </h1>
              {/* Formatted description with proper paragraph spacing */}
              <div className="text-lg text-gray-600 max-w-2xl mx-auto prose prose-lg text-justify">
                {supplement.description ? (
                  supplement.description.split('\n\n').map((paragraph: string, index: number) => (
                    <p key={index} className="mb-4 last:mb-0 text-justify">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-justify">This supplement supports overall wellness.</p>
                )}
              </div>
            </div>

            {/* Gallery Images */}
            {supplement.galleryImages && Array.isArray(supplement.galleryImages) && supplement.galleryImages.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {supplement.galleryImages.map((image: string, index: number) => (
                    <Image
                      key={index}
                      src={image}
                      alt={`${supplement.name} - Image ${index + 1}`}
                      width={300}
                      height={200}
                      className="w-full h-32 object-cover rounded-lg shadow-md"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Cautions */}
            {supplement.cautions && (
              <div className="mb-8 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Important Notes</h2>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">{supplement.cautions}</p>
                </div>
              </div>
            )}

            {/* References Section */}
            <div className="mb-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">References</h2>
              {supplement.references && Array.isArray(supplement.references) && supplement.references.length > 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <ul className="list-disc list-inside space-y-2">
                    {supplement.references.map((reference: string, index: number) => (
                      <li key={index} className="text-gray-700 text-sm">
                        {reference}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-500 text-center italic">
                    References will be added here as research becomes available.
                  </p>
                </div>
              )}
            </div>

            {/* Back to Supplements */}
            <div className="text-center">
              <Link 
                href="/supplements" 
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                ← Back to All Supplements
              </Link>
            </div>
          </div>

          {/* Right Sidebar - Recommended Products */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg shadow-lg p-6 border border-blue-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recommended Products</h3>
                {products.length > 0 ? (
                  <div className="space-y-4">
                    {products.map((product: any, index: number) => (
                      <div key={index} className="border border-lime-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                        <h4 className="font-semibold text-lime-900 mb-2 text-sm">{product.name}</h4>
                        {product.description && (
                          <p className="text-gray-600 text-xs mb-2">{product.description}</p>
                        )}
                        <Image 
                          src={product.imageUrl || "/images/closed-medical-brown-glass-bottle-yellow-vitamins.png"} 
                          alt={product.name} 
                          width={64} 
                          height={64} 
                          className="w-16 h-16 object-contain mb-2" 
                        />
                        <div className="flex items-center justify-between">
                          {product.price && (
                            <span className="text-sm font-bold text-lime-900">${product.price}</span>
                          )}
                          {product.affiliateLink && (
                            <a 
                              href={product.affiliateLink} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="px-2 py-1 bg-lime-700 text-white rounded hover:bg-lime-800 text-xs"
                            >
                              Buy Now
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm italic">
                      Product recommendations coming soon.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 