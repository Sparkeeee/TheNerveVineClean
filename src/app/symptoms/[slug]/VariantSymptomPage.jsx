"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// TODO: Replace this hardcoded map with database-driven related symptoms
// This should be sourced from symptom.relatedSymptoms or similar database field
const relatedSymptomsMap = {
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
export default function VariantSymptomPage({ symptom }) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    
    // Debug: Log the actual symptom data
    console.log('Symptom data received:', {
      title: symptom.title,
      variants: symptom.variants,
      variantKeys: symptom.variants ? Object.keys(symptom.variants) : [],
      variantType: typeof symptom.variants,
      isArray: Array.isArray(symptom.variants)
    });
    
    const variantNames = Object.keys((_a = symptom.variants) !== null && _a !== void 0 ? _a : {});
    const [selectedVariant, setSelectedVariant] = useState(variantNames[0]);
    const variant = (_b = symptom.variants) === null || _b === void 0 ? void 0 : _b[selectedVariant];
    const isInsomnia = symptom.title.toLowerCase().includes('insomnia');
    const related = relatedSymptomsMap[symptom.title] || [];
    const emergencyNote = symptom.emergencyNote;
    // Calculate total text length of variant paragraphs
    const totalTextLength = ((_c = variant === null || variant === void 0 ? void 0 : variant.paragraphs) !== null && _c !== void 0 ? _c : []).reduce((acc, para) => acc + para.length, 0);
    // Decide how many products to show in the sidebar based on text length
    let sidebarProductCount = 1;
    if (totalTextLength > 800)
        sidebarProductCount = 3;
    else if (totalTextLength > 400)
        sidebarProductCount = 2;
    // Gather all products (bestHerb, bestStandardized, topSupplements)
    const allProducts = [
        ...((variant === null || variant === void 0 ? void 0 : variant.bestHerb) ? [variant.bestHerb] : []),
        ...((variant === null || variant === void 0 ? void 0 : variant.bestStandardized) ? [variant.bestStandardized] : []),
        ...((_d = variant === null || variant === void 0 ? void 0 : variant.topSupplements) !== null && _d !== void 0 ? _d : [])
    ];
    const sidebarProducts = allProducts.slice(0, sidebarProductCount);
    return (<div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-r from-blue-200 to-purple-100 py-10 mb-8 rounded-b-3xl shadow-md flex flex-col items-center justify-center relative">
        <div className="absolute top-4 left-4">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-lg font-semibold">← Body Map</Link>
        </div>
        {/* Removed emoji icon from hero */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-purple-900 mb-2 drop-shadow-lg text-center">{symptom.title}</h1>
        <p className="text-lg md:text-xl text-purple-700 text-center max-w-2xl mx-auto mb-2">{symptom.description}</p>
        {variantNames.length > 1 && (<div className="mt-4 flex gap-2 justify-center flex-wrap">
            {variantNames.filter(name => name !== selectedVariant).map((name) => (<button key={name} onClick={() => setSelectedVariant(name)} className="px-4 py-2 rounded-full font-semibold border transition-colors duration-150 shadow-sm bg-white text-blue-700 border-blue-100 hover:bg-blue-50">
                {name}
              </button>))}
          </div>)}
      </div>

      <div className="max-w-5xl mx-auto px-2 md:px-6 pb-12">
        {/* Tips for Insomnia */}
        {isInsomnia && (<SectionDivider label="Tips for Better Sleep" icon="" color="blue"/>)}
        {isInsomnia && (<div className="mb-8 bg-blue-50 border-l-4 border-blue-300 rounded-lg p-6 shadow-sm">
            <ul className="list-disc ml-6 text-gray-700 text-base space-y-1">
              <li>Keep a consistent sleep schedule—even on weekends.</li>
              <li>Avoid screens and bright lights for 1 hour before bed.</li>
              <li>Limit caffeine and alcohol, especially in the evening.</li>
              <li>Try a relaxing bedtime routine: reading, gentle stretching, or meditation.</li>
              <li>Keep your bedroom cool, dark, and quiet.</li>
            </ul>
          </div>)}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Education */}
          <div className="lg:col-span-2 space-y-8">
            <SectionDivider label="About" icon="" color="purple"/>
            {((_e = variant === null || variant === void 0 ? void 0 : variant.paragraphs) !== null && _e !== void 0 ? _e : []).length > 0 ? (<div className="bg-white rounded-lg shadow-lg p-6 space-y-4 border-l-4 border-purple-300">
                {((_f = variant === null || variant === void 0 ? void 0 : variant.paragraphs) !== null && _f !== void 0 ? _f : []).map((para, idx) => (<p key={idx} className="text-gray-700 text-base">{para}</p>))}
              </div>) : (<Placeholder message="No detailed information available for this variant yet."/>)}

            {/* Replace Recommended Products with Herbal & Supplement Support */}
            <SectionDivider label="Herbal & Supplement Support" icon="" color="blue"/>
            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* Best Herb */}
              {(variant === null || variant === void 0 ? void 0 : variant.bestHerb) ? (<ProductCard product={variant.bestHerb} label="Best Traditional Herb" color="green"/>) : (<Placeholder message="No best herb for this variant."/>)}
              {/* Best Standardized Extract */}
              {(variant === null || variant === void 0 ? void 0 : variant.bestStandardized) ? (<ProductCard product={variant.bestStandardized} label="Best Standardized Extract" color="blue"/>) : (<Placeholder message="No best standardized extract for this variant."/>)}
              {/* Top Supplements */}
              {((_g = variant === null || variant === void 0 ? void 0 : variant.topSupplements) !== null && _g !== void 0 ? _g : []).length > 0 ? (((_h = variant === null || variant === void 0 ? void 0 : variant.topSupplements) !== null && _h !== void 0 ? _h : []).map((prod, idx) => (<ProductCard key={idx} product={prod} label={idx === 0 ? "Top Non-Herbal Supplement" : undefined} color="blue"/>))) : (<Placeholder message="No top supplements for this variant."/>)}
            </div>

            {Array.isArray(symptom.paragraphs) && symptom.paragraphs.length > 0 && (<>
                <SectionDivider label="General Info" icon="" color="purple"/>
                <div className="bg-white rounded-lg shadow-lg p-6 space-y-4 border-l-4 border-purple-200">
                  {symptom.paragraphs.map((para, idx) => (<p key={idx} className="text-gray-700 text-base">{para}</p>))}
                </div>
              </>)}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            <SectionDivider label="Top Picks" icon="" color="green"/>
            {sidebarProducts.length > 0 ? (<div className="bg-white rounded-lg shadow-lg p-6">
                <div className="space-y-4">
                  {sidebarProducts.map((product, idx) => (<ProductCard key={idx} product={product}/>))}
                </div>
              </div>) : (<Placeholder message="No top picks for this variant."/>)}

            {/* Quick Actions section removed as requested */}

            {/* Herbal & Supplement Support section removed as requested */}

            <SectionDivider label="Related Symptoms" icon="" color="purple"/>
            {related.length > 0 ? (<div className="bg-white rounded-lg shadow-lg p-6">
                <div className="space-y-3">
                  {related.map((item) => (<Link key={item.href} href={item.href} className="block">
                      <div className={`bg-gradient-to-r from-${item.color}-50 to-blue-50 rounded-lg p-3 hover:from-${item.color}-100 hover:to-blue-100 transition-colors cursor-pointer`} style={{ background: 'linear-gradient(90deg, #f3f4f6 0%, #e0e7ff 100%)' }}>
                        <div className={`text-${item.color}-800 font-medium text-sm`}>{item.name}</div>
                      </div>
                    </Link>))}
                </div>
              </div>) : (<Placeholder message="No related symptoms found."/>)}

            {/* Emergency/Warning Card */}
            {emergencyNote && (<div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Emergency</h3>
                <p className="text-sm text-yellow-700">{emergencyNote}</p>
              </div>)}
          </div>
        </div>

        {/* Disclaimer */}
        {symptom.disclaimer && (<div className="mt-12 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
            <p className="text-sm text-yellow-800">
              <strong>Disclaimer:</strong> {symptom.disclaimer}
            </p>
          </div>)}

        {/* Red Flag and Caution for Insomnia */}
        {isInsomnia && (<div className="mt-8 p-4 bg-red-50 border border-red-300 rounded-lg">
            <p className="text-sm text-red-800 font-semibold mb-2">
              <strong>Red flag:</strong> Insomnia accompanied by severe headache is a red flag—seek medical attention.
            </p>
            <p className="text-sm text-red-700">
              <strong>Caution:</strong> Do not combine Valerian or Melatonin with sedatives or alcohol.
            </p>
          </div>)}
      </div>
    </div>);
}
function SectionDivider({ label, icon, color }) {
    return (<div className={`flex items-center gap-2 mb-2 mt-8`}>
      <span className={`text-2xl ${color === 'blue' ? 'text-blue-500' : color === 'green' ? 'text-green-500' : 'text-purple-500'}`}>{icon}</span>
      <span className={`uppercase tracking-wide font-bold text-xs ${color === 'blue' ? 'text-blue-700' : color === 'green' ? 'text-green-700' : 'text-purple-700'}`}>{label}</span>
      <div className="flex-1 border-t border-gray-200 ml-2"/>
    </div>);
}
function Placeholder({ message }) {
    return (<div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center text-gray-400 text-sm italic">
      {message}
    </div>);
}
function ProductCard({ product, label, color }) {
    return (<div className={`border border-gray-200 rounded-lg p-4 flex flex-col gap-2 ${color === 'green' ? 'bg-green-50' : color === 'blue' ? 'bg-blue-50' : ''}`}> 
      {label && <div className={`text-xs font-semibold ${color === 'green' ? 'text-green-700' : color === 'blue' ? 'text-blue-700' : 'text-blue-700'} mb-1`}>{label}</div>}
      <div className="flex items-center gap-4">
        <Image src={product.image || '/images/closed-medical-brown-glass-bottle-yellow-vitamins.png'} alt={product.name || 'Product image'} width={60} height={60} className="object-contain rounded"/>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-1">{product.description}</p>
          {product.price && <div className="text-blue-700 font-bold mb-1">{product.price}</div>}
          {product.affiliateLink && (<a href={product.affiliateLink} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors text-xs">
              View on Amazon →
            </a>)}
        </div>
      </div>
    </div>);
}
