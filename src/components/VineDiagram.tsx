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

interface VineDiagramProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VineDiagram({ isOpen, onClose }: VineDiagramProps) {
  const [hierarchyData, setHierarchyData] = useState<HierarchySymptom[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSymptom, setExpandedSymptom] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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
        
        if (result.success && result.data && Array.isArray(result.data)) {
          setHierarchyData(result.data);
        } else if (Array.isArray(result)) {
          setHierarchyData(result);
        } else {
          setHierarchyData([]);
        }
      } else {
        setHierarchyData([]);
      }
    } catch (error) {
      console.error('Error fetching hierarchy data:', error);
      setHierarchyData([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSymptom = (symptomId: number) => {
    setExpandedSymptom(expandedSymptom === symptomId ? null : symptomId);
  };

  const filteredSymptoms = hierarchyData.filter(symptom =>
    symptom.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    symptom.variants.some(variant => 
      variant.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Desktop: Enhanced Vine Diagram */}
      <div className="hidden md:block absolute top-16 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-4 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold">🌿 The Nerve Vine - Symptom Hierarchy</h3>
            <p className="text-sm text-green-100 mt-1">Explore the interconnected web of symptoms and variants</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-green-200 text-2xl font-bold transition-colors"
          >
            ×
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="relative">
            <input
              type="text"
              placeholder="Search symptoms and variants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              search
            </span>
          </div>
        </div>

        {/* Content - Enhanced Vine Visualization */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-3 text-gray-600">Growing the vine...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSymptoms.map((symptom, index) => (
                <div key={symptom.id} className="relative">
                  {/* Main Symptom Node */}
                  <div className="relative">
                    {/* Connection Line */}
                    {index > 0 && (
                      <div className="absolute left-6 top-0 w-0.5 h-4 bg-gradient-to-b from-green-400 to-transparent"></div>
                    )}
                    
                    {/* Symptom Card */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-4 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <div>
                            <h4 className="font-bold text-blue-800 text-lg">
                              <Link 
                                href={`/symptoms/${symptom.slug}`}
                                className="hover:text-blue-600 transition-colors"
                                onClick={onClose}
                              >
                                {symptom.title}
                              </Link>
                            </h4>
                            <p className="text-blue-600 text-sm">
                              {symptom.variants.length} variant{symptom.variants.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => toggleSymptom(symptom.id)}
                          className="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-full hover:bg-blue-100"
                        >
                          <span className="material-symbols-outlined text-xl">
                            {expandedSymptom === symptom.id ? 'expand_less' : 'expand_more'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Variants Branch */}
                  {expandedSymptom === symptom.id && symptom.variants.length > 0 && (
                    <div className="ml-8 mt-3 relative">
                      {/* Branch Line */}
                      <div className="absolute left-0 top-0 w-0.5 h-full bg-gradient-to-b from-green-400 to-green-200"></div>
                      
                      <div className="space-y-2">
                        {symptom.variants.map((variant, vIndex) => (
                          <div key={variant.id} className="relative">
                            {/* Variant Connection */}
                            <div className="absolute left-0 top-3 w-4 h-0.5 bg-green-400"></div>
                            
                            {/* Variant Card */}
                            <div className="ml-6 bg-gradient-to-r from-green-50 to-emerald-100 border-2 border-green-200 rounded-lg p-3 hover:shadow-md transition-all duration-200 hover:scale-[1.01]">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <Link 
                                  href={`/symptoms/${symptom.slug}?variant=${variant.name}`}
                                  className="text-green-800 hover:text-green-600 font-medium transition-colors"
                                  onClick={onClose}
                                >
                                  {variant.name}
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Summary Footer */}
              <div className="border-t border-gray-200 pt-4 mt-6">
                <div className="text-center">
                  <div className="inline-flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span><span className="font-semibold text-blue-600">{filteredSymptoms.length}</span> symptoms</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span><span className="font-semibold text-green-600">
                        {filteredSymptoms.reduce((sum, symptom) => sum + symptom.variants.length, 0)}
                      </span> variants</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: Enhanced Full Screen Vine */}
      <div className="md:hidden fixed inset-0 z-50 bg-white">
        {/* Mobile Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-4 flex justify-between items-center shadow-lg">
          <div>
            <h2 className="text-lg font-bold">🌿 The Nerve Vine</h2>
            <p className="text-sm text-green-100">Symptom Hierarchy</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-green-200 text-2xl font-bold transition-colors"
          >
            ×
          </button>
        </div>

        {/* Mobile Search */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="relative">
            <input
              type="text"
              placeholder="Search symptoms and variants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              search
            </span>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="p-4 overflow-y-auto h-full pb-20">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-3 text-gray-600">Growing the vine...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSymptoms.map((symptom, index) => (
                <div key={symptom.id} className="relative">
                  {/* Main Symptom Node */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div>
                          <h4 className="font-bold text-blue-800 text-base">
                            <Link 
                              href={`/symptoms/${symptom.slug}`}
                              className="hover:text-blue-600 transition-colors"
                              onClick={onClose}
                            >
                              {symptom.title}
                            </Link>
                          </h4>
                          <p className="text-blue-600 text-sm">
                            {symptom.variants.length} variant{symptom.variants.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => toggleSymptom(symptom.id)}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-full hover:bg-blue-100"
                      >
                        <span className="material-symbols-outlined text-xl">
                          {expandedSymptom === symptom.id ? 'expand_less' : 'expand_more'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Variants Branch */}
                  {expandedSymptom === symptom.id && symptom.variants.length > 0 && (
                    <div className="ml-6 mt-3 space-y-2">
                      {symptom.variants.map((variant, vIndex) => (
                        <div key={variant.id} className="bg-gradient-to-r from-green-50 to-emerald-100 border-2 border-green-200 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <Link 
                              href={`/symptoms/${symptom.slug}?variant=${variant.name}`}
                              className="text-green-800 hover:text-green-600 font-medium transition-colors"
                              onClick={onClose}
                            >
                              {variant.name}
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Mobile Summary */}
              <div className="border-t border-gray-200 pt-4 mt-6">
                <div className="text-center text-sm text-gray-600">
                  <span className="font-semibold text-blue-600">{filteredSymptoms.length}</span> symptoms • 
                  <span className="font-semibold text-green-600 ml-1">
                    {filteredSymptoms.reduce((sum, symptom) => sum + symptom.variants.length, 0)}
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
