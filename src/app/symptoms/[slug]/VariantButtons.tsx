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
  const [internalSelectedVariant, setInternalSelectedVariant] = React.useState<string | null>(null);

  // Use external state if provided, otherwise use internal state
  const currentSelectedVariant = selectedVariant !== undefined ? selectedVariant : internalSelectedVariant;
  const handleVariantSelect = onVariantSelect || setInternalSelectedVariant;

  // Create all available options including main symptom
  const allOptions = [
    ...(mainSymptomTitle ? [mainSymptomTitle] : []),
    ...variantNames
  ];

  // Filter out the currently selected variant, but always show all options
  const availableVariants = allOptions.filter(variantName => variantName !== currentSelectedVariant);

  return (
    <div className="mt-6 flex gap-3 justify-center flex-wrap">
      {availableVariants.map((variantName) => (
        <button
          key={variantName}
          onClick={() => handleVariantSelect(variantName)}
          className="px-6 py-3 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
        >
          {variantName}
        </button>
      ))}
    </div>
  );
} 