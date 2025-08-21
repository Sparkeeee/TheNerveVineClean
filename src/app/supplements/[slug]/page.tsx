'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ContentProtection from '@/components/ContentProtection';
import InteractiveCitations from '@/components/InteractiveCitations';

// Simple Markdown to HTML converter
function convertMarkdownToHtml(markdown: string): string {
  return markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 mt-8 mb-6">$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
    // Lists
    .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1 text-gray-800">$1</li>')
    .replace(/^(\d+)\. (.*$)/gim, '<li class="ml-4 mb-1 text-gray-800">$1. $2</li>')
    // Wrap lists in ul/ol
    .replace(/(<li.*<\/li>)/g, '<ul class="list-disc ml-6 mb-4">$1</ul>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p class="mb-4 text-gray-800 leading-relaxed">')
    // Wrap in paragraph tags
    .replace(/^(?!<[h|u|o]|<p>)(.*)$/gm, '<p class="mb-4 text-gray-800 leading-relaxed">$1</p>')
    // Clean up empty paragraphs
    .replace(/<p class="mb-4 text-gray-800 leading-relaxed"><\/p>/g, '')
    .replace(/<p class="mb-4 text-gray-800 leading-relaxed"><\/p>/g, '');
}

// Science Modal Component
function ScienceModal({ 
  isOpen, 
  onClose, 
  markdownArticle, 
  references, 
  supplementName 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  markdownArticle: string | null; 
  references: any[]; 
  supplementName: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurry Backdrop */}
      <div className="absolute inset-0 backdrop-blur-md"></div>
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <button
            onClick={onClose}
            className="inline-flex items-center px-3 py-2 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-gray-400 hover:text-gray-600 hover:shadow-gray-300 hover:shadow-lg hover:scale-105 text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Overview
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Modal Content with Protection */}
        <ContentProtection 
          pageType="modal"
          shareUrl={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://thenervevine.com'}/supplements/${supplementName.toLowerCase().replace(/\s+/g, '-')}`}
          shareTitle={`Scientific Research: ${supplementName}`}
        >
          <div className="p-6">
            {/* Comprehensive Article with interactive citations */}
            {markdownArticle && (
              <div className="mb-8">
                <InteractiveCitations content={markdownArticle} />
              </div>
            )}

            {/* References */}
            {references && references.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">References</h3>
                <div className="space-y-3">
                  {references.map((reference: any, index: number) => (
                    <div key={index} className="text-sm text-gray-800 leading-relaxed p-3 bg-gray-50 rounded">
                      {typeof reference === 'string' ? reference : reference.value || ''}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ContentProtection>
      </div>
    </div>
  );
}

export default function SupplementPage({ params }: { params: { slug: string } }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplement, setSupplement] = React.useState<any>(null);
  const [markdownArticle, setMarkdownArticle] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      const { slug } = params;
      
      // Fetch supplement data via API
      try {
        const supplementResponse = await fetch(`/api/supplements/${slug}`);
        if (supplementResponse.ok) {
          const supplementData = await supplementResponse.json();
          setSupplement(supplementData);
          
          // Use comprehensiveArticle from database if available
          if (supplementData.comprehensiveArticle) {
            setMarkdownArticle(supplementData.comprehensiveArticle);
          } else {
            // Fallback to file-based system
            try {
              const articleResponse = await fetch(`/api/articles/${slug}`);
              if (articleResponse.ok) {
                const article = await articleResponse.text();
                setMarkdownArticle(article);
              }
            } catch (error) {
              console.log('No markdown article found for this supplement');
            }
          }
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

              {/* More Comprehensive Info Card */}
              {(markdownArticle || (supplement.references && supplement.references.length > 0)) && (
                <div className="mb-8 bg-white rounded-lg shadow-lg p-6 border-2 border-gray-300" style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    More Comprehensive Info
                  </h2>
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="inline-flex items-center px-6 py-3 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-gray-400 hover:text-gray-600 hover:shadow-gray-300 hover:shadow-lg hover:scale-105"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      View Here
                    </button>
                    <Link
                      href={`/supplements/${supplement.slug}/research`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-gray-400 hover:text-gray-600 hover:shadow-gray-300 hover:shadow-lg hover:scale-105"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Full Page View
                    </Link>
                  </div>
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

        {/* Science Modal */}
        <ScienceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          markdownArticle={markdownArticle}
          references={supplement.references || []}
          supplementName={supplement.name || 'this supplement'}
        />
      </div>
    </ContentProtection>
  );
} 