import React from 'react';
export default function SymptomLayout({ children, }) {
    return (<div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-purple-50 py-6 sm:py-8">
      <div className="max-w-5xl mx-auto px-2 sm:px-4 md:px-6">
        {children}
      </div>
    </div>);
}
