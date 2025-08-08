'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ContentProtection from '@/components/ContentProtection';
import InteractiveCitations from '@/components/InteractiveCitations';
import SaveToListButton from '@/components/SaveToListButton';

// Convert Markdown to HTML for better formatting
function convertMarkdownToHtml(content: string): string {
  // Check if content is already HTML
  const isHtml = /<[^>]*>/.test(content);
  
  if (isHtml) {
    // If it's already HTML, just clean it up and apply consistent styling
    return content
      // Remove any existing style attributes that might conflict
      .replace(/style="[^"]*"/g, '')
      // Remove any existing class attributes that might conflict
      .replace(/class="[^"]*"/g, '')
      // Ensure paragraphs have consistent styling
      .replace(/<p>/g, '<p class="mb-4 text-gray-800 leading-relaxed text-justify">')
      .replace(/<h1>/g, '<h1 class="text-3xl font-bold text-gray-900 mt-8 mb-6">')
      .replace(/<h2>/g, '<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">')
      .replace(/<h3>/g, '<h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">')
      .replace(/<strong>/g, '<strong class="font-bold text-gray-900">')
      .replace(/<em>/g, '<em class="italic text-gray-900">')
      .replace(/<ul>/g, '<ul class="list-disc ml-6 mb-4 pl-8">')
      .replace(/<li>/g, '<li class="ml-4 mb-1 text-gray-800 text-justify">');
  } else {
    // If it's markdown, convert it to HTML
    return content
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 mt-8 mb-6">$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-900">$1</em>')
      // Lists
      .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1 text-gray-800 text-justify">$1</li>')
      .replace(/^(\d+)\. (.*$)/gim, '<li class="ml-4 mb-1 text-gray-800 text-justify">$1. $2</li>')
      // Wrap lists in ul/ol
      .replace(/(<li.*<\/li>)/g, '<ul class="list-disc ml-6 mb-4 pl-8">$1</ul>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p class="mb-4 text-gray-800 leading-relaxed text-justify">')
      // Wrap in paragraph tags
      .replace(/^(?!<[h|u|o|d]|<p>)(.*)$/gm, '<p class="mb-4 text-gray-800 leading-relaxed text-justify">$1</p>')
      // Clean up empty paragraphs
      .replace(/<p class="mb-4 text-gray-800 leading-relaxed"><\/p>/g, '')
      .replace(/<p class="mb-4 text-gray-800 leading-relaxed"><\/p>/g, '');
  }
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
          {/* Hero Image */}
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
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-gray-300" style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
                <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center lg:text-left">
                  {herb.name} - Traditional Uses & Modern Research
                </h1>
                {herb.latinName && (
                  <p className="text-lg text-gray-700 italic mb-4 text-center lg:text-left">
                    {herb.latinName}
                  </p>
                )}
                
                {/* Save to My List Button */}
                <div className="mb-6 flex justify-center lg:justify-start">
                  <SaveToListButton 
                    type="herb" 
                    slug={herb.slug} 
                    name={herb.name}
                    className="text-sm"
                  />
                </div>
                
                {/* Brief Intro */}
                <div className="text-lg text-gray-800 max-w-2xl lg:max-w-none prose prose-lg text-justify">
                  {herb.description ? (
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: convertMarkdownToHtml(herb.description) 
                      }} 
                    />
                  ) : (
                    <p>This herb supports overall wellness.</p>
                  )}
                </div>
              </div>

              {/* Quick Reference */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-gray-300" style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Reference</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-gray-800">
                    <strong className="text-gray-900">Best for:</strong> {herb.traditionalUses && herb.traditionalUses.length > 0 ? herb.traditionalUses[0] : 'Overall wellness support'}
                  </div>
                  <div className="text-gray-800">
                    <strong className="text-gray-900">Typical dose:</strong> Varies by formulation
                  </div>
                  <div className="text-gray-800">
                    <strong className="text-gray-900">Duration:</strong> 4-8 weeks for full effects
                  </div>
                  <div className="text-gray-800">
                    <strong className="text-gray-900">Cost range:</strong> $15-45 for 30-day supply
                  </div>
                </div>
                
                {/* Indications Tags */}
                {herb.indicationTags && herb.indicationTags.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Indications</h3>
                    <div className="flex flex-wrap gap-2">
                      {herb.indicationTags.map((indication: any) => (
                        <Link
                          key={indication.slug}
                          href={`/symptoms/${indication.slug}`}
                          className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
                        >
                          {indication.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-gray-300" style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-gray-800">
                    <strong className="text-gray-900">Parts Used:</strong> {herb.partsUsed || 'Root and leaves'}
                  </div>
                  <div className="text-gray-800">
                    <strong className="text-gray-900">Active Compounds:</strong> {herb.activeCompounds || 'Various bioactive compounds'}
                  </div>
                  <div className="text-gray-800">
                    <strong className="text-gray-900">Taste:</strong> {herb.taste || 'Varies by preparation'}
                  </div>
                  <div className="text-gray-800">
                    <strong className="text-gray-900">Energetics:</strong> {herb.energetics || 'Adaptogenic'}
                  </div>
                </div>
              </div>

              {/* Traditional Usage & Formulations */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-gray-300" style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Traditional Usage & Formulations</h2>
                
                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Traditional Uses</h3>
                {herb.traditionalUses && Array.isArray(herb.traditionalUses) && herb.traditionalUses.length > 0 ? (
                  <ul className="list-disc list-inside space-y-2 text-gray-800 mb-6">
                    {herb.traditionalUses.map((use: string, index: number) => (
                      <li key={index}>{use}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-800 mb-6">Traditional uses information coming soon.</p>
                )}

                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Traditional Formulations</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-800">
                  <li><strong>Tinctures:</strong> Alcohol-based extracts, typical dose 30-60 drops 2-3x daily</li>
                  <li><strong>Teas:</strong> Traditional preparation using dried herb</li>
                  <li><strong>Powders:</strong> Ground herb mixed with warm liquid</li>
                  <li><strong>Traditional preparations:</strong> Various traditional methods</li>
                </ul>
              </div>

              {/* Key Research Areas & Modern Formulations */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-gray-300" style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Key Research Areas & Modern Formulations</h2>
                
                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Key Research Areas</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-800 mb-6">
                  <li><strong>Modern research:</strong> Ongoing studies on efficacy and safety</li>
                  <li><strong>Clinical applications:</strong> Evidence-based therapeutic uses</li>
                  <li><strong>Safety profile:</strong> Comprehensive safety evaluation</li>
                  <li><strong>Quality standards:</strong> Modern quality control measures</li>
                </ul>

                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Modern Formulations</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-800 mb-6">
                  <li><strong>Standardized Extracts:</strong> Consistent active compound content</li>
                  <li><strong>Capsules:</strong> Convenient dosing and storage</li>
                  <li><strong>Tablets:</strong> Precise dosing with excipients</li>
                  <li><strong>Liquid extracts:</strong> Concentrated formulations</li>
                </ul>
              </div>

              {/* Dive Deeper Here */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-gray-300" style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Dive Deeper Here
                </h2>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center px-6 py-3 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-gray-400 hover:text-gray-600 hover:shadow-gray-300 hover:shadow-lg hover:scale-105"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Open Research Here
                  </button>
                  <Link
                    href={`/herbs/${herb.slug}/research`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-gray-400 hover:text-gray-600 hover:shadow-gray-300 hover:shadow-lg hover:scale-105"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Go to Research Page
                  </Link>
                </div>
              </div>

              {/* Cautions */}
              {herb.cautions && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                  <h2 className="text-2xl font-bold text-yellow-800 mb-4">Cautions</h2>
                  <div className="text-yellow-800">
                    {herb.cautions.split('\n\n').map((paragraph: string, index: number) => (
                      <p key={index} className="mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Sustainability & Ethics */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-gray-300" style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Sustainability & Ethics</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-800">
                  <li><strong>Wild-harvested vs. cultivated:</strong> Sustainable sourcing practices</li>
                  <li><strong>Organic certification:</strong> Important for quality and safety</li>
                  <li><strong>Fair trade considerations:</strong> Supporting ethical supply chains</li>
                  <li><strong>Environmental impact:</strong> Sustainable cultivation practices</li>
                </ul>
              </div>

              {/* Related Content */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-gray-300" style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Related Content</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Related Herbs:</h3>
                    <div className="flex flex-wrap gap-2">
                      <Link href="/herbs/rhodiola" className="text-blue-600 hover:text-blue-800">Rhodiola Rosea</Link>
                      <Link href="/herbs/ginseng" className="text-blue-600 hover:text-blue-800">Ginseng</Link>
                      <Link href="/herbs/holy-basil" className="text-blue-600 hover:text-blue-800">Holy Basil</Link>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Related Supplements:</h3>
                    <div className="flex flex-wrap gap-2">
                      <Link href="/supplements/l-theanine" className="text-blue-600 hover:text-blue-800">L-Theanine</Link>
                      <Link href="/supplements/magnesium" className="text-blue-600 hover:text-blue-800">Magnesium</Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 mb-8" style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Disclaimer</h2>
                <p className="text-gray-700 text-sm leading-relaxed">
                  This information is for educational purposes only and is not intended as medical advice. The traditional uses described are based on historical herbalism practices and should not be considered medical recommendations. Always consult with a qualified healthcare provider before using any herbal products, especially if you have medical conditions or are taking medications. Individual results may vary, and herbal products are not intended to diagnose, treat, cure, or prevent any disease.
                </p>
              </div>

              {/* Back to Herbs Link */}
              <div className="text-center lg:text-left">
                <Link 
                  href="/herbs" 
                  className="inline-flex items-center px-6 py-3 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-gray-400 hover:text-gray-600 hover:shadow-gray-300 hover:shadow-lg hover:scale-105"
                >
                  ← Back to All Herbs
                </Link>
              </div>
            </div>

            {/* Right Sidebar - Products */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-8">
                {/* Quality Products Available */}
                <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-300" style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Quality Products Available</h3>
                  
                  {/* Traditional Products */}
                  {traditionalProducts.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Traditional Formulations</h4>
                      <div className="space-y-4">
                        {traditionalProducts.map((product: any, index: number) => (
                          <div key={index} className="border border-lime-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <h5 className="font-semibold text-lime-900 mb-2">{product.name}</h5>
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
                    </div>
                  )}

                  {/* Modern Products */}
                  {modernProducts.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Modern Formulations</h4>
                      <div className="space-y-4">
                        {modernProducts.map((product: any, index: number) => (
                          <div key={index} className="border border-lime-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <h5 className="font-semibold text-lime-900 mb-2">{product.name}</h5>
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
                    </div>
                  )}

                  {traditionalProducts.length === 0 && modernProducts.length === 0 && (
                    <p className="text-gray-500 text-sm">Quality products coming soon.</p>
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
