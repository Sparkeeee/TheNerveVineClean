"use client";

import { useState } from 'react';

interface HerbImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function HerbImage({ src, alt, className }: HerbImageProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <span className="text-gray-400 text-xs text-center">No Image</span>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt}
      className={className}
      onError={() => setImageError(true)}
    />
  );
} 