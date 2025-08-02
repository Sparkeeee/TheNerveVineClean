import React from 'react';

export default function SymptomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white py-6 sm:py-8 relative" style={{
      backgroundImage: "url('/images/RoseWPWM.PNG')",
      backgroundSize: "110%",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed"
    }}>
      <div className="absolute inset-0 bg-pink-100 opacity-90"></div>
      <div className="relative max-w-5xl mx-auto px-2 sm:px-4 md:px-6">
        {children}
      </div>
    </div>
  );
} 