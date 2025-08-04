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
    .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1 text-gray-900 font-medium">$1</li>')
    .replace(/^(\d+)\. (.*$)/gim, '<li class="ml-4 mb-1 text-gray-900 font-medium">$1. $2</li>')
    // Wrap lists in ul/ol
    .replace(/(<li.*<\/li>)/g, '<ul class="list-disc ml-6 mb-4">$1</ul>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p class="mb-4 text-gray-900 leading-relaxed font-medium">')
    // Wrap in paragraph tags
    .replace(/^(?!<[h|u|o]|<p>)(.*)$/gm, '<p class="mb-4 text-gray-900 leading-relaxed font-medium">$1</p>')
    // Clean up empty paragraphs
    .replace(/<p class="mb-4 text-gray-900 leading-relaxed font-medium"><\/p>/g, '')
    .replace(/<p class="mb-4 text-gray-800 leading-relaxed"><\/p>/g, '');
}

// Science Modal Component
function ScienceModal({ 
  isOpen, 
  onClose, 
  markdownArticle, 
  references, 
  herbName 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  markdownArticle: string | null; 
  references: any[]; 
  herbName: string;
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
          shareUrl={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://thenervevine.com'}/herbs/${herbName.toLowerCase().replace(/\s+/g, '-')}`}
          shareTitle={`Scientific Research: ${herbName}`}
        >
                     <div className="p-6">
             {/* Comprehensive Article with full FPV features */}
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
                    <div key={index} className="text-sm text-gray-900 leading-relaxed p-4 bg-gray-100 rounded border border-gray-200 font-medium">
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

export default function HerbPage({ params }: { params: Promise<{ slug: string }> }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [herb, setHerb] = React.useState<any>(null);
  const [markdownArticle, setMarkdownArticle] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      const { slug } = await params;
      
      // Fetch herb data via API
      try {
        const herbResponse = await fetch(`/api/herbs/${slug}`);
        if (herbResponse.ok) {
          const herbData = await herbResponse.json();
          setHerb(herbData);
          
          // Use comprehensiveArticle from database if available
          if (herbData.comprehensiveArticle) {
            setMarkdownArticle(herbData.comprehensiveArticle);
          } else {
            // Fallback to file-based system
            try {
              const articleResponse = await fetch(`/api/articles/${slug}`);
              if (articleResponse.ok) {
                const article = await articleResponse.text();
                setMarkdownArticle(article);
              }
            } catch (error) {
              console.log('No markdown article found for this herb');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching herb data:', error);
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

  if (!herb) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Herb Not Found</h1>
          <p className="text-gray-600 mb-4">The herb could not be found.</p>
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
    <ContentProtection 
      pageType="herb-detail"
      shareUrl={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://thenervevine.com'}/herbs/${herb.slug}`}
      shareTitle={`${herb.name} - The NerveVine`}
    >
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
                <p className="text-lg text-gray-700 italic mb-4">
                  {herb.latinName}
                </p>
              )}
              
              {/* Overview Section */}
              <div className="text-lg text-gray-800 max-w-2xl lg:max-w-none prose prose-lg text-justify mb-6">
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

                             {/* More Comprehensive Info Card */}
               {(markdownArticle || (herb.references && herb.references.length > 0)) && (
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
                 href={`/herbs/${herb.slug}/research`}
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
                      className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Traditional Uses */}
            {herb.traditionalUses && Array.isArray(herb.traditionalUses) && herb.traditionalUses.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Traditional Uses</h2>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <ul className="list-disc list-inside space-y-2 text-gray-800">
                    {herb.traditionalUses.map((use: string, index: number) => (
                      <li key={index} className="text-lg">{use}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Cautions */}
            {herb.cautions && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Cautions</h2>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="text-yellow-800">
                    {herb.cautions.split('\n\n').map((paragraph: string, index: number) => (
                      <p key={index} className="mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Back to Herbs Link */}
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
                          <p className="text-gray-700 text-sm mb-2">{product.description}</p>
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
                          <p className="text-gray-700 text-sm mb-2">{product.description}</p>
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

             {/* Science Modal */}
       <ScienceModal
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         markdownArticle={markdownArticle}
         references={herb.references || []}
         herbName={herb.name}
       />
     </div>
     </ContentProtection>
   );
}
