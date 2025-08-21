'use client';

import React from 'react';
import Link from 'next/link';
import { Symptom } from '@/types/symptom'; // Assuming Symptom type is defined here

interface VariantSymptomPageProps {
  symptom: Symptom;
  selectedVariant: string | null;
  onVariantSelect: (variant: string | null) => void;
  markdownArticle: string | null;
  products: any[]; // Define a proper type for products if available
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
  products,
}: VariantSymptomPageProps) {

  const activeVariant = selectedVariant && symptom.variants && symptom.variants[selectedVariant] 
    ? symptom.variants[selectedVariant] 
    : null;

  const activeContent = activeVariant || symptom;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-800 mb-4">{symptom.title || 'Symptom Details'}</h1>
          <div
            className="text-lg text-gray-600 max-w-3xl mx-auto"
            dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(symptom.description || '') }}
          />
        </div>

        {/* Variant Selector */}
        {symptom.variants && Object.keys(symptom.variants).length > 0 && (
          <div className="mb-12 flex justify-center flex-wrap gap-4">
            <button
              onClick={() => onVariantSelect(null)}
              className={`px-6 py-3 rounded-full font-semibold text-lg transition-all duration-200 shadow-md ${
                !selectedVariant
                  ? 'bg-blue-600 text-white scale-105'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-blue-50'
              }`}
            >
              Overview
            </button>
            {Object.keys(symptom.variants).map((variantName) => (
              <button
                key={variantName}
                onClick={() => onVariantSelect(variantName)}
                className={`px-6 py-3 rounded-full font-semibold text-lg transition-all duration-200 shadow-md ${
                  selectedVariant === variantName
                    ? 'bg-blue-600 text-white scale-105'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-blue-50'
                }`}
              >
                {variantName}
              </button>
            ))}
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">{activeContent.title || activeContent.name}</h2>
          
          <div className="prose prose-lg max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(activeContent.description || '') }}
          />

          {/* Further content sections can be added here, using `activeContent` */}
          
        </div>

        {/* Comprehensive Article / Research */}
        {markdownArticle && (
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