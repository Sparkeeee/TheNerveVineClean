import React from 'react';

export default function SymptomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white py-6 sm:py-8">
      <div className="max-w-5xl mx-auto px-2 sm:px-4 md:px-6">
        {children}
      </div>
    </div>
  );
} 