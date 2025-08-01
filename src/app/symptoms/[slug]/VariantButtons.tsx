"use client";
import React, { useState } from 'react';

interface VariantButtonsProps {
  variantNames: string[];
}

export default function VariantButtons({ variantNames }: VariantButtonsProps) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  return (
    <div className="mt-6 flex gap-3 justify-center flex-wrap">
      {variantNames.map((name) => (
        <button
          key={name}
          onClick={() => setSelectedVariant(name === selectedVariant ? null : name)}
          className={`px-6 py-3 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm ${
            name === selectedVariant 
              ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
          }`}
        >
          {name}
        </button>
      ))}
    </div>
  );
} 