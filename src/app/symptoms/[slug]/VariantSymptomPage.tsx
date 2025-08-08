"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Symptom } from '../../../types/symptom';
import VariantButtons from './VariantButtons';
import ContentProtection from '@/components/ContentProtection';

// Component to render common symptoms
function CommonSymptomsSection({ symptoms }: { symptoms: unknown }): React.ReactElement | null {
  if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl p-8 shadow-sm border-2 border-gray-300 mb-8" style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Symptoms</h2>
      <ul className="space-y-3">
        {(symptoms as string[]).map((symptomItem: string, index: number) => (
          <li key={index} className="flex items-start gap-3 text-gray-700">
            <span className="text-lime-500 font-semibold mt-1">•</span>
            <span className="text-lg">{symptomItem}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}



// Enhanced Markdown to HTML converter with proper bullet point handling
function convertMarkdownToHtml(markdown: string): string {
  if (!markdown) return '';
  
  // Split into lines for better processing
  const lines = markdown.split('\n');
  const processedLines: string[] = [];
  let inList = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Handle bullet points
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) {
        processedLines.push('<ul class="list-disc ml-6 mb-4 space-y-2">');
        inList = true;
      }
      const content = line.substring(2).trim();
      processedLines.push(`<li class="text-gray-700 leading-relaxed">${content}</li>`);
    }
    // Handle numbered lists
    else if (/^\d+\.\s/.test(line)) {
      if (!inList) {
        processedLines.push('<ol class="list-decimal ml-6 mb-4 space-y-2">');
        inList = true;
      }
      const content = line.replace(/^\d+\.\s/, '').trim();
      processedLines.push(`<li class="text-gray-700 leading-relaxed">${content}</li>`);
    }
    // Handle other content
    else {
      if (inList) {
        processedLines.push('</ul>');
        inList = false;
      }
      
      if (line === '') {
        processedLines.push('');
      } else if (line.startsWith('### ')) {
        processedLines.push(`<h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">${line.substring(4)}</h3>`);
      } else if (line.startsWith('## ')) {
        processedLines.push(`<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">${line.substring(3)}</h2>`);
      } else if (line.startsWith('# ')) {
        processedLines.push(`<h1 class="text-3xl font-bold text-gray-900 mt-8 mb-6">${line.substring(2)}</h1>`);
      } else {
        // Regular paragraph
        processedLines.push(line);
      }
    }
  }
  
  // Close any open list
  if (inList) {
    processedLines.push('</ul>');
  }
  
  // Join lines and process paragraphs
  let result = processedLines.join('\n');
  
  // Handle bold text
  result = result.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
  
  // Convert double newlines to paragraph breaks, but preserve HTML tags
  result = result.replace(/\n\n+/g, '</p><p class="mb-4 text-gray-700 leading-relaxed">');
  
  // Wrap content that isn't already in HTML tags
  const lines2 = result.split('\n');
  const finalLines = lines2.map(line => {
    if (!line.trim()) return '';
    if (line.startsWith('<')) return line; // Already HTML
    return `<p class="mb-4 text-gray-700 leading-relaxed">${line}</p>`;
  });
  
  return finalLines.join('\n').replace(/<p[^>]*><\/p>/g, ''); // Remove empty paragraphs
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

export default function VariantSymptomPage({ 
  symptom,
  selectedVariant,
  onVariantSelect,
  markdownArticle,
  products = []
}: { 
  symptom: Symptom;
  selectedVariant?: string | null;
  onVariantSelect?: (variant: string | null) => void;
  markdownArticle?: string | null;
  products?: any[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const variantNames = Object.keys(symptom.variants || {});

  // Get selected variant data
  const selectedVariantData = selectedVariant && symptom.variants?.[selectedVariant] || null;
  
  // Determine current title and description
  const currentTitle = selectedVariant || symptom.title;
  const currentDescription = (selectedVariantData as any)?.description || symptom.description;

  // Common symptoms data (you can move this to database later)
  const getCommonSymptoms = (symptomTitle: string, variantName?: string): string[] => {
    const title = (variantName || symptomTitle).toLowerCase();
    
    if (title.includes('anxiety') || title.includes('generalized')) {
      return [
        'Excessive worry about everyday situations',
        'Restlessness or feeling on edge',
        'Difficulty concentrating',
        'Muscle tension and fatigue',
        'Sleep disturbances',
        'Irritability'
      ];
    } else if (title.includes('social')) {
      return [
        'Fear of social judgment',
        'Avoidance of social situations',
        'Physical symptoms in social settings',
        'Self-consciousness in groups',
        'Difficulty speaking in public',
        'Fear of embarrassment'
      ];
    } else if (title.includes('panic')) {
      return [
        'Sudden onset of intense fear',
        'Rapid heartbeat or palpitations',
        'Shortness of breath',
        'Chest pain or discomfort',
        'Sweating and trembling',
        'Fear of losing control'
      ];
    } else if (title.includes('depression')) {
      return [
        'Persistent sad or empty mood',
        'Loss of interest in activities',
        'Changes in appetite or weight',
        'Sleep disturbances',
        'Fatigue and low energy',
        'Feelings of worthlessness'
      ];
    } else if (title.includes('stress') || title.includes('adrenal overload')) {
      return [
        'Feeling overwhelmed',
        'Physical tension and headaches',
        'Difficulty relaxing',
        'Rapid heartbeat',
        'Digestive issues',
        'Mood swings'
      ];
    } else if (title.includes('adrenal exhaustion')) {
      return [
        'Chronic fatigue',
        'Difficulty getting up in the morning',
        'Craving salty or sweet foods',
        'Low blood pressure',
        'Difficulty handling stress',
        'Brain fog and memory issues'
      ];
    } else if (title.includes('burnout')) {
      return [
        'Emotional exhaustion',
        'Cynicism about work or life',
        'Reduced sense of accomplishment',
        'Physical and mental fatigue',
        'Difficulty concentrating',
        'Increased irritability'
      ];
    }
    
    // Default symptoms for unknown conditions
    return [
      'Varies by individual',
      'May include physical discomfort',
      'Can affect daily activities',
      'May impact sleep patterns',
      'Often affects mood',
      'Can influence energy levels'
    ];
  };

  const commonSymptoms = getCommonSymptoms(symptom.title, selectedVariant || undefined);

  return (
    <ContentProtection 
      pageType="symptom-detail"
      shareUrl={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://thenervevine.com'}/symptoms/${symptom.title?.toLowerCase().replace(/\s+/g, '-')}`}
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
          <div className="w-full py-12 mb-8 rounded-b-3xl shadow-sm border-2 border-gray-300 flex flex-col items-center justify-center relative" style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
            <div className="absolute top-4 left-2 md:top-6 md:left-6 lg:top-8 lg:left-8">
              <Link href="/symptoms" className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-gray-400 hover:text-gray-600 hover:shadow-gray-300 hover:shadow-lg hover:scale-105 text-xs md:text-sm lg:text-base">
                ← Back to Symptoms
              </Link>
            </div>
            
            <div className="absolute top-4 right-2 md:top-6 md:right-6 lg:top-8 lg:right-8">
              <Link href="/?showBodymap=true" className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-gray-400 hover:text-gray-600 hover:shadow-gray-300 hover:shadow-lg hover:scale-105 text-xs md:text-sm lg:text-base">
                Bodymap →
              </Link>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 text-center leading-tight px-20 md:px-40 lg:px-48 mt-16 md:mt-20">
              {currentTitle}
            </h1>
            
            <VariantButtons 
              variantNames={variantNames} 
              selectedVariant={selectedVariant} 
              onVariantSelect={onVariantSelect}
              mainSymptomTitle={symptom.title}
            />
          </div>

          {/* Common Symptoms Section */}
          <div className="mb-8">
            <div className="rounded-xl p-8 shadow-sm border-2 border-gray-300" style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Symptoms</h2>
              <ul className="grid md:grid-cols-2 gap-3">
                {commonSymptoms.map((symptomText, index) => (
                                   <li key={index} className="flex items-start gap-3 text-gray-600">
                   <span className="text-gray-600 font-semibold mt-1 flex-shrink-0">•</span>
                   <span className="text-base leading-relaxed">{symptomText}</span>
                 </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              {/* About This Condition */}
              <div className="rounded-xl p-8 shadow-sm border-2 border-gray-300 mb-8" style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {selectedVariant ? `About ${selectedVariant}` : 'About This Condition'}
                </h2>
                <div className="prose prose-lg max-w-none text-justify">
                  {currentDescription ? (
                    <div 
                      className="text-gray-700 text-lg leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(currentDescription) }}
                    />
                  ) : (
                    <p className="text-gray-500 italic">No description available.</p>
                  )}
                </div>
              </div>

              {/* More Comprehensive Info Card */}
              {(markdownArticle || (symptom.references && Array.isArray(symptom.references) && symptom.references.length > 0)) && (
                <div className="mb-8 bg-white rounded-lg shadow-lg p-6 border-2 border-gray-300">
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
                      href={`/symptoms/${symptom.title?.toLowerCase().replace(/\s+/g, '-')}/research`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors shadow-lg"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Full Page View
                    </Link>
                  </div>
                </div>
              )}

              {/* Common Symptoms section temporarily removed due to TypeScript inference issue */}

              {/* Possible Causes */}
              {symptom.causes && symptom.causes.length > 0 && (
                <div className="rounded-xl p-8 shadow-sm border-2 border-gray-300 mb-8" style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Possible Causes</h2>
                  <ul className="space-y-3">
                    {symptom.causes.map((cause, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-700">
                        <span className="text-orange-500 font-semibold mt-1">•</span>
                        <span className="text-lg">{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Cautions */}
              {symptom.cautions && (
                <div className="mb-8 rounded-xl p-8 shadow-sm border-2 border-gray-300" style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Important Notes</h2>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">{symptom.cautions as string}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar - Recommended Solutions */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="sticky top-8">
                <div className="p-6 rounded-xl shadow-sm border-2 border-gray-300" style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
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

                  {/* Natural Solutions fallback for legacy data */}
                  {symptom.naturalSolutions && symptom.naturalSolutions.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Natural Solutions</h4>
                      <div className="space-y-4">
                        {symptom.naturalSolutions.map((solution, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-3 flex items-start gap-3">
                            <Image
                              src={"/images/closed-medical-brown-glass-bottle-yellow-vitamins.png"}
                              alt={solution.name}
                              width={40}
                              height={40}
                              className="object-contain rounded flex-shrink-0 mt-1"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h5 className="font-semibold text-gray-900 text-sm truncate" title={solution.name}>{solution.name}</h5>
                                {solution.price && (
                                  <span className="text-lime-600 font-bold text-base ml-2 whitespace-nowrap">{solution.price}</span>
                                )}
                              </div>
                              <p className="text-gray-600 text-xs leading-snug line-clamp-2" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                                {solution.description}
                              </p>
                              {solution.affiliateLink && (
                                <a
                                  href={solution.affiliateLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block bg-lime-600 text-white px-2 py-1 rounded mt-2 text-xs hover:bg-lime-700 transition-colors font-medium"
                                >
                                  View Product →
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          {symptom.disclaimer && (
            <div className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
              <p className="text-lg text-yellow-800">
                <strong>Disclaimer:</strong> {symptom.disclaimer}
              </p>
            </div>
          )}

          {/* Back to Symptoms */}
          <div className="text-center mt-8">
            <Link 
              href="/symptoms" 
              className="inline-flex items-center px-6 py-3 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-gray-400 hover:text-gray-600 hover:shadow-gray-300 hover:shadow-lg hover:scale-105"
            >
              ← Back to All Symptoms
            </Link>
          </div>
        </div>

        {/* Science Modal */}
        <ScienceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          markdownArticle={markdownArticle || null}
          references={symptom.references || []}
          symptomTitle={symptom.title}
        />
      </div>
    </ContentProtection>
  );
} 