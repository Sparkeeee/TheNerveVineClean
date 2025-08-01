import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Symptom } from '../../../types/symptom';
import VariantButtons from './VariantButtons';

export default function VariantSymptomPage({ symptom }: { symptom: Symptom }) {
  const variantNames = Object.keys(symptom.variants || {});

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full py-12 mb-8 rounded-b-3xl shadow-sm flex flex-col items-center justify-center relative" style={{background: 'linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 50%, #f0fdf4 100%)'}}>
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
        
        <VariantButtons variantNames={variantNames} />
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 pb-16">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
                         <div className="rounded-xl p-8 shadow-sm border border-gray-100" style={{background: 'linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 50%, #f0fdf4 100%)'}}>
               <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Condition</h2>
              <div className="prose prose-lg max-w-none text-justify">
                {symptom.description?.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 text-lg leading-relaxed mb-6 last:mb-0 text-justify">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

                         {symptom.symptoms && symptom.symptoms.length > 0 && (
               <div className="rounded-xl p-8 shadow-sm border border-gray-100" style={{background: 'linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 50%, #f0fdf4 100%)'}}>
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
               <div className="rounded-xl p-8 shadow-sm border border-gray-100" style={{background: 'linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 50%, #f0fdf4 100%)'}}>
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
             <div className="rounded-xl p-6 shadow-sm border border-gray-100" style={{background: 'linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 50%, #f0fdf4 100%)'}}>
               <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Solutions</h3>
              <div className="space-y-6">
                <p className="text-gray-500 text-sm italic text-center py-4">No products available for this variant.</p>
              </div>
            </div>

                         {symptom.naturalSolutions && symptom.naturalSolutions.length > 0 && (
               <div className="rounded-xl p-6 shadow-sm border border-gray-100" style={{background: 'linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 50%, #f0fdf4 100%)'}}>
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
    </div>
  );
} 