"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Symptom } from '../../../types/symptom';

export default function VariantSymptomPage({ symptom }: { symptom: Symptom }) {
  const variantNames = Object.keys(symptom.variants ?? {});
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const variant = selectedVariant ? symptom.variants?.[selectedVariant] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-full bg-gradient-to-r from-gray-50 to-white py-12 mb-8 rounded-b-3xl shadow-sm flex flex-col items-center justify-center relative">
        <div className="absolute top-6 left-6">
          <Link href="/symptoms" className="text-gray-600 hover:text-gray-800 text-lg font-medium transition-colors">
            ← Back to Symptoms
          </Link>
        </div>
        
        <div className="absolute top-6 right-6">
          <Link href="/?showBodymap=true" className="text-gray-600 hover:text-gray-800 text-lg font-medium transition-colors">
            Bodymap →
          </Link>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center leading-tight">
          {symptom.title}
        </h1>
        
        <div className="mt-6 flex gap-3 justify-center flex-wrap">
          {/* Main/Overview button - always show if we're on a variant */}
          {selectedVariant && (
            <button
              onClick={() => setSelectedVariant(null)}
              className="px-6 py-3 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
            >
              Overview
            </button>
          )}
          
          {/* Variant buttons - show all variants, highlight current one */}
          {variantNames.map((name) => (
            <button
              key={name}
              onClick={() => setSelectedVariant(name)}
              className={`px-6 py-3 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm ${
                selectedVariant === name 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 pb-16">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Condition</h2>
              {variant ? (
                // Show variant-specific content
                <div className="prose prose-lg max-w-none">
                  {variant.paragraphs?.map((paragraph, index) => (
                    <p key={index} className="text-gray-700 text-lg leading-relaxed mb-6 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                // Show main symptom content
                <div className="prose prose-lg max-w-none">
                  {symptom.description?.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-700 text-lg leading-relaxed mb-6 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {symptom.symptoms && symptom.symptoms.length > 0 && (
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Symptoms</h2>
                <ul className="space-y-3">
                  {symptom.symptoms.map((symptomItem, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700">
                      <span className="text-lime-500 font-semibold mt-1">•</span>
                      <span className="text-lg">{symptomItem}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {symptom.causes && symptom.causes.length > 0 && (
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
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
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Products</h3>
              <div className="space-y-6">
                {variant?.bestHerb && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Image 
                        src={variant.bestHerb.image || '/images/closed-medical-brown-glass-bottle-yellow-vitamins.png'} 
                        alt={variant.bestHerb.name || 'Product image'} 
                        width={60}
                        height={60}
                        className="object-contain rounded-lg flex-shrink-0" 
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm mb-1 leading-tight">{variant.bestHerb.name}</h4>
                        <p className="text-gray-600 text-xs mb-2 leading-relaxed">{variant.bestHerb.description}</p>
                        {variant.bestHerb.price && (
                          <div className="text-sm font-bold text-blue-700 mb-2">{variant.bestHerb.price}</div>
                        )}
                        {variant.bestHerb.affiliateLink && (
                          <a 
                            href={variant.bestHerb.affiliateLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-block bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors font-medium text-xs"
                          >
                            View →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {variant?.bestStandardized && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Image 
                        src={variant.bestStandardized.image || '/images/closed-medical-brown-glass-bottle-yellow-vitamins.png'} 
                        alt={variant.bestStandardized.name || 'Product image'} 
                        width={60}
                        height={60}
                        className="object-contain rounded-lg flex-shrink-0" 
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm mb-1 leading-tight">{variant.bestStandardized.name}</h4>
                        <p className="text-gray-600 text-xs mb-2 leading-relaxed">{variant.bestStandardized.description}</p>
                        {variant.bestStandardized.price && (
                          <div className="text-sm font-bold text-blue-700 mb-2">{variant.bestStandardized.price}</div>
                        )}
                        {variant.bestStandardized.affiliateLink && (
                          <a 
                            href={variant.bestStandardized.affiliateLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-block bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors font-medium text-xs"
                          >
                            View →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {Array.isArray(variant?.topSupplements) && variant.topSupplements.length > 0 && variant.topSupplements.map((supplement, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Image 
                        src={supplement.image || '/images/closed-medical-brown-glass-bottle-yellow-vitamins.png'} 
                        alt={supplement.name || 'Product image'} 
                        width={60}
                        height={60}
                        className="object-contain rounded-lg flex-shrink-0" 
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm mb-1 leading-tight">{supplement.name}</h4>
                        <p className="text-gray-600 text-xs mb-2 leading-relaxed">{supplement.description}</p>
                        {supplement.price && (
                          <div className="text-sm font-bold text-blue-700 mb-2">{supplement.price}</div>
                        )}
                        {supplement.affiliateLink && (
                          <a 
                            href={supplement.affiliateLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-block bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors font-medium text-xs"
                          >
                            View →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {(!variant?.bestHerb && !variant?.bestStandardized && (!variant?.topSupplements || variant.topSupplements.length === 0)) && (
                  <p className="text-gray-500 text-sm italic text-center py-4">No products available for this variant.</p>
                )}
              </div>
            </div>

            {/* Natural Solutions in sidebar */}
            {symptom.naturalSolutions && symptom.naturalSolutions.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Natural Solutions</h3>
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
                          <h4 className="font-semibold text-gray-900 text-sm truncate" title={solution.name}>{solution.name}</h4>
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

        {symptom.disclaimer && (
          <div className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
            <p className="text-lg text-yellow-800">
              <strong>Disclaimer:</strong> {symptom.disclaimer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 