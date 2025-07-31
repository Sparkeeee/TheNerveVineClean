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
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {supplement.name}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {supplement.description || 'This supplement supports overall wellness.'}
          </p>
        </div>

        {/* Hero Image */}
        {supplement.heroImageUrl && (
          <div className="mb-8">
            <Image
              src={supplement.heroImageUrl}
              alt={supplement.name}
              width={800}
              height={400}
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

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

        {/* Indications */}
        {supplement.indications && Array.isArray(supplement.indications) && supplement.indications.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Common Uses</h2>
            <div className="flex flex-wrap gap-2">
              {supplement.indications.map((indication: string, index: number) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {indication}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Cautions */}
        {supplement.cautions && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Important Notes</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">{supplement.cautions}</p>
            </div>
          </div>
        )}

        {/* Products */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recommended Products</h2>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: any, index: number) => (
                <div key={index} className="border border-lime-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                  <h3 className="font-semibold text-lime-900 mb-2">{product.name}</h3>
                  {product.description && (
                    <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                  )}
                  <Image 
                    src={product.imageUrl || "/images/closed-medical-brown-glass-bottle-yellow-vitamins.png"} 
                    alt={product.name} 
                    width={96} 
                    height={96} 
                    className="w-24 h-24 object-contain mb-2" 
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
            <p className="text-gray-500 text-center">Product recommendations coming soon.</p>
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
    </div>
  );
} 