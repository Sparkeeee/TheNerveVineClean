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
  const indications = herb.indications || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {herb.name}
          </h1>
          {herb.latinName && (
            <p className="text-lg text-gray-600 italic mb-4">
              {herb.latinName}
            </p>
          )}
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {herb.description}
          </p>
        </div>

        {/* Hero Image */}
        {herb.heroImageUrl && (
          <div className="mb-8">
            <Image
              src={herb.heroImageUrl}
              alt={herb.name}
              width={800}
              height={400}
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

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

        {/* Indications (Symptoms) */}
        {indications.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Traditionally Used For</h2>
            <div className="flex flex-wrap gap-2">
              {indications.map((indication: string, index: number) => (
                <Link
                  key={index}
                  href={`/symptoms/${indication.toLowerCase().replace(/\s+/g, '-')}`}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors"
                >
                  {indication}
                </Link>
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

        {/* Back to Herbs */}
        <div className="text-center">
          <Link 
            href="/herbs" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Back to All Herbs
          </Link>
        </div>
      </div>
    </div>
  );
}
