'use client';

import React from 'react';
import { Symptom, Variant } from '@/types/symptom'; 

interface VariantSymptomPageProps {
  symptom: Symptom & { variants: Variant[] }; // Ensure variants is an array
  selectedVariant: string | null;
  onVariantSelect: (variantSlug: string | null) => void;
  markdownArticle: string | null;
}

// Simple Markdown to HTML converter
function convertMarkdownToHtml(markdown: string): string {
  if (!markdown) return '';
  return markdown
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 mt-8 mb-6">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
    .replace(/\n/g, '<br />');
}

export default function VariantSymptomPage({
  symptom,
  selectedVariant,
  onVariantSelect,
  markdownArticle,
}: VariantSymptomPageProps) {

  // Find the full variant object from the slug
  const activeVariant = selectedVariant 
    ? symptom.variants?.find(v => v.slug === selectedVariant) 
    : null;

  // Determine what content to display
  const activeContent = activeVariant || symptom;
  const isOverview = !activeVariant;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header - Always show the main symptom title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-800 mb-4">{symptom.title || 'Symptom Details'}</h1>
        </div>

        {/* Variant Selector */}
        {symptom.variants && symptom.variants.length > 0 && (
          <div className="mb-12 flex justify-center flex-wrap gap-4">
            <button
              onClick={() => onVariantSelect(null)}
              className={`px-6 py-3 rounded-full font-semibold text-lg transition-all duration-200 shadow-md ${
                isOverview
                  ? 'bg-blue-600 text-white scale-105'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-blue-50'
              }`}
            >
              Overview
            </button>
            {symptom.variants.map((variant) => (
              <button
                key={variant.slug}
                onClick={() => onVariantSelect(variant.slug)}
                className={`px-6 py-3 rounded-full font-semibold text-lg transition-all duration-200 shadow-md ${
                  selectedVariant === variant.slug
                    ? 'bg-blue-600 text-white scale-105'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-blue-50'
                }`}
              >
                {variant.name}
              </button>
            ))}
          </div>
        )}

        {/* Main Content Area - This will now correctly toggle */}
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            {'title' in activeContent ? activeContent.title : activeContent.name}
          </h2>
          
          <div className="prose prose-lg max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(activeContent.description || '') }}
          />
        </div>

        {/* Comprehensive Article / Research - Only show on Overview */}
        {isOverview && markdownArticle && (
          <div className="mt-12 bg-white rounded-2xl shadow-xl p-8 lg:p-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">In-Depth Research</h2>
            <div className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(markdownArticle) }}
            />
          </div>
        )}
      </div>
    </div>
  );
} 