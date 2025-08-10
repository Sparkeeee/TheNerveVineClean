"use client";
import React from 'react';

interface VariantButtonsProps {
  variantNames: string[];
  selectedVariant?: string | null;
  onVariantSelect?: (variant: string | null) => void;
  mainSymptomTitle?: string;
}

export default function VariantButtons({ 
  variantNames, 
  selectedVariant, 
  onVariantSelect,
  mainSymptomTitle
}: VariantButtonsProps) {
  // Use external state if provided (with null checks)
  const currentSelectedVariant = selectedVariant ?? null;
  const handleVariantSelect = onVariantSelect ?? (() => {});

  // Only show variants if we're on the main symptom page
  // If a variant is selected, show main symptom + other variants (but not current variant)
  let availableOptions: string[] = [];
  
  if (!currentSelectedVariant || currentSelectedVariant === mainSymptomTitle) {
    // On main symptom page - only show variant options
    availableOptions = variantNames;
  } else {
    // On a variant page - show main symptom + other variants (exclude current variant)
    availableOptions = [
      ...(mainSymptomTitle ? [mainSymptomTitle] : []),
      ...variantNames.filter(name => name !== currentSelectedVariant)
    ];
  }

  // Don't show any buttons if no variants available
  if (availableOptions.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 flex gap-3 justify-center flex-wrap">
      {availableOptions.map((name) => (
        <button
          key={name}
          onClick={() => handleVariantSelect(name)}
          className="px-6 py-3 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-gray-400 hover:text-gray-600 hover:shadow-gray-300 hover:shadow-lg hover:scale-105"
        >
          {name}
        </button>
      ))}
    </div>
  );
}