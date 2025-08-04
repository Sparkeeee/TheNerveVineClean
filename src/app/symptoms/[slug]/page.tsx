'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ContentProtection from '@/components/ContentProtection';

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
  symptomTitle 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  markdownArticle: string | null; 
  references: any[]; 
  symptomTitle: string;
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
            className="inline-flex items-center px-3 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors text-sm"
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
          shareUrl={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://thenervevine.com'}/symptoms/${symptomTitle.toLowerCase().replace(/\s+/g, '-')}`}
          shareTitle={`Scientific Research: ${symptomTitle}`}
        >
          <div className="p-6">
            {/* Comprehensive Article */}
            {markdownArticle && (
              <div className="mb-8">
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(markdownArticle) }}
                />
              </div>
            )}

            {/* References */}
            {references && references.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">References</h3>
                <div className="space-y-3">
                  {references.map((reference: any, index: number) => (
                    <div key={index} className="text-sm text-gray-800 leading-relaxed p-3 bg-gray-50 rounded">
                      {reference.value}
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

export default function SymptomPage({ params }: { params: Promise<{ slug: string }> }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [symptom, setSymptom] = React.useState<any>(null);
  const [markdownArticle, setMarkdownArticle] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      const { slug } = await params;
      
      // Fetch symptom data via API
      try {
        const symptomResponse = await fetch(`/api/symptoms/by-slug/${slug}`);
        if (symptomResponse.ok) {
          const symptomData = await symptomResponse.json();
          setSymptom(symptomData);
          
          // Use comprehensiveArticle from database if available
          if (symptomData.comprehensiveArticle) {
            setMarkdownArticle(symptomData.comprehensiveArticle);
          } else {
            // Fallback to file-based system
            try {
              const articleResponse = await fetch(`/api/articles/${slug}`);
              if (articleResponse.ok) {
                const article = await articleResponse.text();
                setMarkdownArticle(article);
              }
            } catch (error) {
              console.log('No markdown article found for this symptom');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching symptom data:', error);
      }
      
      setLoading(false);
    }

    loadData();
  }, [params]);

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

  if (!symptom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Symptom Not Found</h1>
          <p className="text-gray-600 mb-4">The symptom could not be found.</p>
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

  const products = symptom.products || [];

  return (
    <ContentProtection 
      pageType="symptom-detail"
      shareUrl={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://thenervevine.com'}/symptoms/${symptom.slug}`}
      shareTitle={`${symptom.title} - The NerveVine`}
    >
      <div className="min-h-screen bg-white relative" style={{
        backgroundImage: "url('/images/RoseWPWM.PNG')",
        backgroundSize: "110%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed"
      }}>
        <div className="absolute inset-0 bg-pink-100 opacity-90"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              {/* Header */}
              <div className="text-center mb-8 rounded-xl p-8 shadow-sm border border-gray-100" style={{background: 'linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 50%, #f0fdf4 100%)'}}>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  {symptom.title as string}
                </h1>
                {/* Formatted description with proper paragraph spacing */}
                <div className="text-lg text-gray-600 max-w-2xl mx-auto prose prose-lg text-justify">
                  {symptom.description ? (
                    symptom.description.split('\n\n').map((paragraph: string, index: number) => (
                      <p key={index} className="mb-4 last:mb-0 text-justify">
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <p className="text-justify">Natural solutions for health and wellness.</p>
                  )}
                </div>
              </div>

              {/* More Comprehensive Info Card */}
              {(markdownArticle || (symptom.references && symptom.references.length > 0)) && (
                <div className="mb-8 bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    More Comprehensive Info
                  </h2>
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      View Here
                    </button>
                    <Link
                      href={`/symptoms/${symptom.slug}/research`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors shadow-lg"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Full Page View
                    </Link>
                  </div>
                </div>
              )}

              {/* Cautions */}
              {symptom.cautions && (
                <div className="mb-8 rounded-xl p-8 shadow-sm border border-gray-100" style={{background: 'linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 50%, #f0fdf4 100%)'}}>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Important Notes</h2>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">{symptom.cautions}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar - Recommended Solutions */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="sticky top-8">
                <div className="p-6 rounded-xl shadow-sm border border-gray-100" style={{background: 'linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 50%, #f0fdf4 100%)'}}>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Recommended Solutions</h3>
                  {products.length > 0 ? (
                    <div className="space-y-4">
                      {products.map((product: any, index: number) => (
                        <div key={index} className="border border-lime-200 rounded-lg p-4 hover:shadow-md transition-shadow">
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

          {/* Back to Symptoms */}
          <div className="text-center mt-8">
            <Link 
              href="/symptoms" 
              className="inline-flex items-center px-6 py-3 bg-green-700 text-blue-50 font-semibold rounded-lg hover:bg-green-800 transition-colors"
            >
              ← Back to All Symptoms
            </Link>
          </div>
        </div>

        {/* Science Modal */}
        <ScienceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          markdownArticle={markdownArticle}
          references={symptom.references || []}
          symptomTitle={symptom.title}
        />
      </div>
    </ContentProtection>
  );
} 