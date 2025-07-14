import React from 'react';

interface SymptomLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export default function SymptomLayout({ 
  children, 
  sidebar 
}: SymptomLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-purple-50 py-6 sm:py-8">
      <div
        className="max-w-5xl mx-auto px-2 sm:px-4 md:px-6 flex gap-8 custom-symptom-layout"
      >
        {/* Main Content (Left) */}
        <div className="flex-1 min-w-0 w-full">
          {children}
        </div>
        {/* Sidebar (Right) */}
        {sidebar && (
          <aside className="w-full custom-sidebar-width flex-shrink-0 flex flex-col gap-6 mt-8 custom-sidebar-mt">
            {sidebar}
          </aside>
        )}
      </div>
    </div>
  );
} 