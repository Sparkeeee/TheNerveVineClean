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
  const variant = symptom.variants?.[selectedVariant];
  const isInsomnia = symptom.title.toLowerCase().includes('insomnia');
  const related = relatedSymptomsMap[symptom.title] || [];
  const quickActions = symptom.quickActions || quickActionsDefault;
  const emergencyNote = symptom.emergencyNote;

  // Calculate total text length of variant paragraphs
  const totalTextLength = (variant?.paragraphs ?? []).reduce((acc, para) => acc + para.length, 0);

  // Decide how many products to show in the sidebar based on text length
  let sidebarProductCount = 1;
  if (totalTextLength > 800) sidebarProductCount = 3;
  else if (totalTextLength > 400) sidebarProductCount = 2;

  // Gather all products (bestHerb, bestStandardized, topSupplements)
  const allProducts = [
    ...(variant?.bestHerb ? [variant.bestHerb] : []),
    ...(variant?.bestStandardized ? [variant.bestStandardized] : []),
    ...((variant?.topSupplements ?? []) as Product[])
  ];
  const sidebarProducts = allProducts.slice(0, sidebarProductCount);
  const mainGridProducts = allProducts.slice(sidebarProductCount);

  // Filter mainGridProducts to exclude any products already in sidebarProducts (by name and affiliateLink)
  const sidebarProductSet = new Set(sidebarProducts.map(p => p.name + (p.affiliateLink || '')));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-r from-blue-200 to-purple-100 py-10 mb-8 rounded-b-3xl shadow-md flex flex-col items-center justify-center relative">
        <div className="absolute top-4 left-4">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-lg font-semibold">← Body Map</Link>
        </div>
        {/* Removed emoji icon from hero */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-purple-900 mb-2 drop-shadow-lg text-center">{symptom.title}</h1>
        <p className="text-lg md:text-xl text-purple-700 text-center max-w-2xl mx-auto mb-2">{symptom.description}</p>
        {variantNames.length > 1 && (
          <div className="mt-4 flex gap-2 justify-center flex-wrap">
            {variantNames.map((name) => (
              <button
                key={name}
                onClick={() => setSelectedVariant(name)}
                className={`px-4 py-2 rounded-full font-semibold border transition-colors duration-150 shadow-sm ${selectedVariant === name ? 'bg-blue-300 text-blue-900 border-blue-400' : 'bg-white text-blue-700 border-blue-100 hover:bg-blue-50'}`}
                style={{ boxShadow: selectedVariant === name ? '0 2px 8px rgba(59, 130, 246, 0.12)' : undefined }}
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-2 md:px-6 pb-12">
        {/* Tips for Insomnia */}
        {isInsomnia && (
          <SectionDivider label="Tips for Better Sleep" icon="" color="blue" />
        )}
        {isInsomnia && (
          <div className="mb-8 bg-blue-50 border-l-4 border-blue-300 rounded-lg p-6 shadow-sm">
            <ul className="list-disc ml-6 text-gray-700 text-base space-y-1">
              <li>Keep a consistent sleep schedule—even on weekends.</li>
              <li>Avoid screens and bright lights for 1 hour before bed.</li>
              <li>Limit caffeine and alcohol, especially in the evening.</li>
              <li>Try a relaxing bedtime routine: reading, gentle stretching, or meditation.</li>
              <li>Keep your bedroom cool, dark, and quiet.</li>
            </ul>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Education */}
          <div className="lg:col-span-2 space-y-8">
            <SectionDivider label="About" icon="" color="purple" />
            {(variant?.paragraphs ?? []).length > 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-6 space-y-4 border-l-4 border-purple-300">
                {(variant?.paragraphs ?? []).map((para: string, idx: number) => (
                  <p key={idx} className="text-gray-700 text-base">{para}</p>
                ))}
              </div>
            ) : (
              <Placeholder message="No detailed information available for this variant yet." />
            )}

            {/* Replace Recommended Products with Herbal & Supplement Support */}
            <SectionDivider label="Herbal & Supplement Support" icon="" color="blue" />
            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* Best Herb */}
              {variant?.bestHerb ? (
                <ProductCard product={variant.bestHerb} label="Best Traditional Herb" color="green" />
              ) : (
                <Placeholder message="No best herb for this variant." />
              )}
              {/* Best Standardized Extract */}
              {variant?.bestStandardized ? (
                <ProductCard product={variant.bestStandardized} label="Best Standardized Extract" color="blue" />
              ) : (
                <Placeholder message="No best standardized extract for this variant." />
              )}
              {/* Top Supplements */}
              {(variant?.topSupplements ?? []).length > 0 ? (
                (variant?.topSupplements ?? []).map((prod: Product, idx: number) => (
                  <ProductCard key={idx} product={prod} label={idx === 0 ? "Top Non-Herbal Supplement" : undefined} color="blue" />
                ))
              ) : (
                <Placeholder message="No top supplements for this variant." />
              )}
            </div>

            {Array.isArray(symptom.paragraphs) && symptom.paragraphs.length > 0 && (
              <>
                <SectionDivider label="General Info" icon="" color="purple" />
                <div className="bg-white rounded-lg shadow-lg p-6 space-y-4 border-l-4 border-purple-200">
                  {symptom.paragraphs.map((para: string, idx: number) => (
                    <p key={idx} className="text-gray-700 text-base">{para}</p>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            <SectionDivider label="Top Picks" icon="" color="green" />
            {sidebarProducts.length > 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="space-y-4">
                  {sidebarProducts.map((product, idx) => (
                    <ProductCard key={idx} product={product} />
                  ))}
                </div>
              </div>
            ) : (
              <Placeholder message="No top picks for this variant." />
            )}

            {/* Quick Actions section removed as requested */}

            {/* Herbal & Supplement Support section removed as requested */}

            <SectionDivider label="Related Symptoms" icon="" color="purple" />
            {related.length > 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-6">
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
            ) : (
              <Placeholder message="No related symptoms found." />
            )}

            {/* Emergency/Warning Card */}
            {emergencyNote && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Emergency</h3>
                <p className="text-sm text-yellow-700">{emergencyNote}</p>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        {symptom.disclaimer && (
          <div className="mt-12 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
            <p className="text-sm text-yellow-800">
              <strong>Disclaimer:</strong> {symptom.disclaimer}
            </p>
          </div>
        )}

        {/* Red Flag and Caution for Insomnia */}
        {isInsomnia && (
          <div className="mt-8 p-4 bg-red-50 border border-red-300 rounded-lg">
            <p className="text-sm text-red-800 font-semibold mb-2">
              <strong>Red flag:</strong> Insomnia accompanied by severe headache is a red flag—seek medical attention.
            </p>
            <p className="text-sm text-red-700">
              <strong>Caution:</strong> Do not combine Valerian or Melatonin with sedatives or alcohol.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionDivider({ label, icon, color }: { label: string; icon: string; color: string }) {
  return (
    <div className={`flex items-center gap-2 mb-2 mt-8`}>
      <span className={`text-2xl ${color === 'blue' ? 'text-blue-500' : color === 'green' ? 'text-green-500' : 'text-purple-500'}`}>{icon}</span>
      <span className={`uppercase tracking-wide font-bold text-xs ${color === 'blue' ? 'text-blue-700' : color === 'green' ? 'text-green-700' : 'text-purple-700'}`}>{label}</span>
      <div className="flex-1 border-t border-gray-200 ml-2" />
    </div>
  );
}

function Placeholder({ message }: { message: string }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center text-gray-400 text-sm italic">
      {message}
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
          alt={product.name || 'Product image'} 
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