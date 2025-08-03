'use client';

import { useEffect } from 'react';

export default function ResearchPageWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Hide header elements on research page
    const style = document.createElement('style');
    style.textContent = `
      header, 
      .bg-blue-950,
      nav,
      .container {
        display: none !important;
      }
      body {
        padding-top: 0 !important;
      }
    `;
    document.head.appendChild(style);

    // Cleanup function
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return <>{children}</>;
} 