"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Symptom, Product } from '../../../types/symptom';

const relatedSymptomsMap: Record<string, Array<{ name: string; href: string; color: string }>> = {
  'Insomnia': [
    { name: 'Anxiety', href: '/symptoms/anxiety', color: 'purple' },
    { name: 'Depression', href: '/symptoms/depression', color: 'blue' },
    { name: 'Fatigue', href: '/symptoms/fatigue', color: 'green' },
  ],
  'Poor Focus': [
    { name: 'Brain Fog', href: '/symptoms/poor-focus', color: 'purple' },
    { name: 'Anxiety', href: '/symptoms/anxiety', color: 'blue' },
    { name: 'Mood Swings', href: '/symptoms/mood-swings', color: 'green' },
  ],
};

const quickActionsDefault = [
  { name: 'Anxiety & Stress', href: '/symptoms/anxiety', color: 'purple' },
  { name: 'Sleep Issues', href: '/symptoms/insomnia', color: 'blue' },
  { name: 'Muscle Tension', href: '/symptoms/muscle-tension', color: 'green' },
];

export default function VariantSymptomPage({ symptom }: { symptom: Symptom }) {
  const variantNames = Object.keys(symptom.variants ?? {});
  const [selectedVariant, setSelectedVariant] = useState(variantNames[0]);
  const variant = symptom.variants[selectedVariant];
  const isInsomnia = symptom.title.toLowerCase().includes('insomnia');
  const related = relatedSymptomsMap[symptom.title] || [];
  const quickActions = symptom.quickActions || quickActionsDefault;
  const emergencyNote = symptom.emergencyNote;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-900 mb-2">{symptom.title}</h1>
          <p className="text-xl text-purple-700 mb-4">{symptom.description}</p>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            ← Back to Body Map
          </Link>
        </div>

        {/* Variant Selector */}
        <div className="mb-8 flex gap-4 justify-center">
          {variantNames.map((name) => (
            <button
              key={name}
              onClick={() => setSelectedVariant(name)}
              className={`px-4 py-2 rounded-lg font-semibold border transition-colors duration-150 ${selectedVariant === name ? 'bg-blue-200 text-blue-900 border-blue-300' : 'bg-white text-blue-700 border-blue-100 hover:bg-blue-50'}`}
              style={{ boxShadow: selectedVariant === name ? '0 2px 8px rgba(59, 130, 246, 0.08)' : undefined }}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Tips for Better Sleep (only for insomnia) */}
        {isInsomnia && (
          <div className="mb-8 bg-blue-50 border-l-4 border-blue-300 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">💡 Tips for Better Sleep</h3>
            <ul className="list-disc ml-6 text-gray-700 text-sm space-y-1">
              <li>Keep a consistent sleep schedule—even on weekends.</li>
              <li>Avoid screens and bright lights for 1 hour before bed.</li>
              <li>Limit caffeine and alcohol, especially in the evening.</li>
              <li>Try a relaxing bedtime routine: reading, gentle stretching, or meditation.</li>
              <li>Keep your bedroom cool, dark, and quiet.</li>
            </ul>
          </div>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Education */}
          <div className="lg:col-span-2 space-y-8">
            {/* Variant-specific Paragraphs */}
            {Array.isArray(variant.paragraphs) && (
              <div className="bg-white rounded-lg shadow-lg p-6 space-y-4 border-l-4 border-purple-300">
                {variant.paragraphs.map((para: string, idx: number) => (
                  <p key={idx} className="text-gray-700 text-base">{para}</p>
                ))}
              </div>
            )}
            {/* General Paragraphs (if present) */}
            {Array.isArray(symptom.paragraphs) && (
              <div className="bg-white rounded-lg shadow-lg p-6 space-y-4 border-l-4 border-purple-200">
                {symptom.paragraphs.map((para: string, idx: number) => (
                  <p key={idx} className="text-gray-700 text-base">{para}</p>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            {quickActions.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-purple-800 mb-4">⚡ Quick Actions</h3>
                <div className="space-y-3">
                  {quickActions.map((item) => (
                    <Link key={item.href} href={item.href} className="block">
                      <div className={`bg-gradient-to-r from-${item.color}-50 to-blue-50 rounded-lg p-3 hover:from-${item.color}-100 hover:to-blue-100 transition-colors cursor-pointer`} style={{ background: 'linear-gradient(90deg, #f3f4f6 0%, #e0e7ff 100%)' }}>
                        <div className={`text-${item.color}-800 font-medium text-sm`}>{item.name}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Product Recommendations */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-green-800 mb-4">🌿 Herbal Support</h2>
              {/* Best Herb */}
              {variant.bestHerb && (
                <ProductCard product={variant.bestHerb} label="Best Traditional Herb" color="green" />
              )}
              <h2 className="text-xl font-semibold text-blue-800 mb-4 mt-6">💊 Supplemental Support</h2>
              {/* Best Standardized Extract */}
              {variant.bestStandardized && (
                <ProductCard product={variant.bestStandardized} label="Best Standardized Extract" color="blue" />
              )}
              {/* Top Supplements */}
              {Array.isArray(variant.topSupplements) && variant.topSupplements.map((prod: Product, idx: number) => (
                <ProductCard key={idx} product={prod} label={idx === 0 ? "Top Non-Herbal Supplement" : undefined} color="blue" />
              ))}
            </div>

            {/* Related Symptoms */}
            {related.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-purple-800 mb-4">🔗 Related Symptoms</h3>
                <div className="space-y-3">
                  {related.map((item) => (
                    <Link key={item.href} href={item.href} className="block">
                      <div className={`bg-gradient-to-r from-${item.color}-50 to-blue-50 rounded-lg p-3 hover:from-${item.color}-100 hover:to-blue-100 transition-colors cursor-pointer`} style={{ background: 'linear-gradient(90deg, #f3f4f6 0%, #e0e7ff 100%)' }}>
                        <div className={`text-${item.color}-800 font-medium text-sm`}>{item.name}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Emergency/Warning Card */}
            {emergencyNote && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Emergency</h3>
                <p className="text-sm text-yellow-700">{emergencyNote}</p>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        {symptom.disclaimer && (
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Disclaimer:</strong> {symptom.disclaimer}
            </p>
          </div>
        )}

        {/* Red Flag and Caution for Insomnia */}
        {isInsomnia && (
          <div className="mt-8 p-4 bg-red-50 border border-red-300 rounded-lg">
            <p className="text-sm text-red-800 font-semibold mb-2">
              <span className="mr-2">⚠️</span>
              <strong>Red flag:</strong> Insomnia accompanied by severe headache is a red flag—seek medical attention.
            </p>
            <p className="text-sm text-red-700">
              <span className="mr-2">🚫</span>
              <strong>Caution:</strong> Do not combine Valerian or Melatonin with sedatives or alcohol.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product, label, color }: { product: Product; label?: string; color?: string }) {
  return (
    <div className={`border border-gray-200 rounded-lg p-4 flex flex-col gap-2 ${color === 'green' ? 'bg-green-50' : color === 'blue' ? 'bg-blue-50' : ''}`}> 
      {label && <div className={`text-xs font-semibold ${color === 'green' ? 'text-green-700' : color === 'blue' ? 'text-blue-700' : 'text-blue-700'} mb-1`}>{label}</div>}
      <div className="flex items-center gap-4">
        <Image 
          src={product.image || '/images/closed-medical-brown-glass-bottle-yellow-vitamins.png'} 
          alt={product.name} 
          width={60}
          height={60}
          className="object-contain rounded" 
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-1">{product.description}</p>
          {product.price && <div className="text-blue-700 font-bold mb-1">{product.price}</div>}
          {product.affiliateLink && (
            <a 
              href={product.affiliateLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors text-xs"
            >
              View on Amazon →
            </a>
          )}
        </div>
      </div>
    </div>
  );
} 