'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface HierarchySymptom {
  id: number;
  title: string;
  slug: string;
  variants: {
    id: number;
    name: string;
    slug: string;
  }[];
}

interface SymptomHierarchyDiagramProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SymptomHierarchyDiagram({ isOpen, onClose }: SymptomHierarchyDiagramProps) {
  const [hierarchyData, setHierarchyData] = useState<HierarchySymptom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchHierarchyData();
    }
  }, [isOpen]);

  const fetchHierarchyData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/symptoms/hierarchy');
      if (response.ok) {
        const result = await response.json();
        console.log('Hierarchy API Response:', result); // Debug log
        
        // Handle the API response format: { success: true, data: [...] }
        if (result.success && result.data && Array.isArray(result.data)) {
          setHierarchyData(result.data);
        } else if (Array.isArray(result)) {
          // Fallback if API returns array directly
          setHierarchyData(result);
        } else {
          console.error('Unexpected hierarchy API response format:', result);
          setHierarchyData([]);
        }
      } else {
        console.error('Hierarchy API response not OK:', response.status, response.statusText);
        setHierarchyData([]);
      }
    } catch (error) {
      console.error('Error fetching hierarchy data:', error);
      setHierarchyData([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Desktop: Compact Dropdown */}
      <div className="hidden md:block absolute top-16 left-1/2 transform -translate-x-1/2 z-40 w-full bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-gray-800">All Symptoms/Variants</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg font-bold transition-colors"
          >
            ×
          </button>
        </div>

        {/* Content - Tree Visualization */}
        <div className="p-3 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600 text-xs">Loading...</span>
            </div>
          ) : (
            <div className="font-mono text-xs text-gray-700">
              {hierarchyData.map((symptom, index) => (
                <div key={symptom.id} className="mb-2">
                  <div className="font-bold text-blue-600 text-xs">
                    <Link 
                      href={`/symptoms/${symptom.slug}`}
                      className="hover:underline"
                      onClick={onClose}
                    >
                      {symptom.title}
                    </Link>
                  </div>
                  {symptom.variants.map((variant, vIndex) => (
                    <div key={variant.id} className="ml-2 mt-0.5">
                      <span className="text-gray-400 text-xs">
                        {vIndex === symptom.variants.length - 1 ? '└─ ' : '├─ '}
                      </span>
                      <Link 
                        href={`/symptoms/${symptom.slug}?variant=${variant.name}`}
                        className="text-green-600 hover:underline text-xs"
                        onClick={onClose}
                      >
                        {variant.name}
                      </Link>
                    </div>
                  ))}
                </div>
              ))}
              
              {/* Quick Summary at bottom */}
              <div className="border-t border-gray-200 pt-2 mt-3">
                <div className="text-center text-xs text-gray-500">
                  <span className="font-semibold text-blue-600">{hierarchyData.length}</span> symptoms • 
                  <span className="font-semibold text-green-600 ml-1">
                    {hierarchyData.reduce((sum, symptom) => sum + symptom.variants.length, 0)}
                  </span> variants
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: Full Viewport Takeover */}
      <div className="md:hidden fixed inset-0 z-50 bg-white">
        {/* Mobile Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex justify-between items-center shadow-sm">
          <h2 className="text-lg font-bold text-gray-800">All Symptoms/Variants</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold transition-colors"
          >
            ×
          </button>
        </div>

        {/* Mobile Content - Full Screen Tree */}
        <div className="p-4 overflow-y-auto h-full pb-20">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600 text-sm">Loading...</span>
            </div>
          ) : (
            <div className="font-mono text-sm text-gray-700">
              {hierarchyData.map((symptom, index) => (
                <div key={symptom.id} className="mb-4">
                  <div className="font-bold text-blue-600 text-base">
                    <Link 
                      href={`/symptoms/${symptom.slug}`}
                      className="hover:underline"
                      onClick={onClose}
                    >
                      {symptom.title}
                    </Link>
                  </div>
                  {symptom.variants.map((variant, vIndex) => (
                    <div key={variant.id} className="ml-4 mt-2">
                      <span className="text-gray-400 text-sm">
                        {vIndex === symptom.variants.length - 1 ? '└─ ' : '├─ '}
                      </span>
                      <Link 
                        href={`/symptoms/${symptom.slug}?variant=${variant.name}`}
                        className="text-green-600 hover:underline text-sm"
                        onClick={onClose}
                      >
                        {variant.name}
                      </Link>
                    </div>
                  ))}
                </div>
              ))}
              
              {/* Mobile Summary */}
              <div className="border-t border-gray-200 pt-4 mt-6">
                <div className="text-center text-sm text-gray-500">
                  <span className="font-semibold text-blue-600">{hierarchyData.length}</span> symptoms • 
                  <span className="font-semibold text-green-600 ml-1">
                    {hierarchyData.reduce((sum, symptom) => sum + symptom.variants.length, 0)}
                  </span> variants
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
