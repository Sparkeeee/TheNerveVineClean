'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ContentProtection from '@/components/ContentProtection';
// InteractiveCitations is no longer needed here if we simplify the display
// import InteractiveCitations from '@/components/InteractiveCitations';

// Simple Markdown to HTML converter
function convertMarkdownToHtml(markdown: string): string {
  if (!markdown) return '';
  return markdown
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 mt-8 mb-6">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />');
}

export default function SupplementPage({ params }: { params: { slug: string } }) {
  const [supplement, setSupplement] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      const { slug } = params;
      try {
        const supplementResponse = await fetch(`/api/supplements/${slug}`);
        if (supplementResponse.ok) {
          const responseJson = await supplementResponse.json();
          setSupplement(responseJson.data);
        }
      } catch (error) {
        console.error('Error fetching supplement data:', error);
      }
      setLoading(false);
    }

    loadData();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!supplement) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Supplement Not Found</h1>
          <p className="text-gray-600 mb-4">The supplement could not be found.</p>
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
    <ContentProtection 
      pageType="supplement-detail"
      shareUrl={supplement.slug ? `${process.env.NEXT_PUBLIC_SITE_URL || 'https://thenervevine.com'}/supplements/${supplement.slug}` : ''}
      shareTitle={supplement.name ? `${supplement.name} - The NerveVine` : 'The NerveVine'}
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Hero Image - Moved to top */}
          {supplement.heroImageUrl && (
            <div className="mb-8 max-w-full overflow-hidden">
              <Image
                src={supplement.heroImageUrl}
                alt={supplement.name || 'Supplement image'}
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
                             <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-gray-300 border-b-2 border-b-gray-300" style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
                <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
                  {supplement.name || 'Supplement Details'}
                </h1>
                {/* Render comprehensive article or fallback to description */}
                <div className="text-lg text-gray-600 max-w-2xl mx-auto prose prose-lg text-justify">
                  {supplement.comprehensiveArticle ? (
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: convertMarkdownToHtml(supplement.comprehensiveArticle) 
                      }} 
                    />
                  ) : supplement.description ? (
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: convertMarkdownToHtml(supplement.description) 
                      }} 
                    />
                  ) : (
                    <p>No description available.</p>
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
                  <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4" style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
                    <ul className="list-disc list-inside space-y-2">
                      {supplement.references.map((reference: any, index: number) => (
                        <li key={index} className="text-gray-700 text-sm">
                          {typeof reference === 'string' ? reference : reference.value || ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4" style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
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
                  className="inline-flex items-center px-6 py-3 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-gray-400 hover:text-gray-600 hover:shadow-gray-300 hover:shadow-lg hover:scale-105"
                >
                  ← Back to All Supplements
                </Link>
              </div>
            </div>

            {/* Right Sidebar - Recommended Products */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="sticky top-8">
                <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-300" style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
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
    </ContentProtection>
  );
} 