"use client";

import { useState, useEffect } from 'react';
import InteractiveTreeDiagram from './InteractiveTreeDiagram';

interface SymptomVariant {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

interface Symptom {
  id: number;
  title: string;
  slug: string;
  variants: SymptomVariant[];
}

interface SymptomTreeProps {
  onSymptomSelect: (symptom: Symptom, variant?: SymptomVariant) => void;
  onManageIndications: (symptom: Symptom, variant?: SymptomVariant) => void;
}

export default function SymptomTree({ onSymptomSelect, onManageIndications }: SymptomTreeProps) {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [expandedSymptoms, setExpandedSymptoms] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showVineDiagram, setShowVineDiagram] = useState(false);

  useEffect(() => {
    fetchSymptoms();
  }, []);

  const fetchSymptoms = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/symptoms/hierarchy');
      if (!response.ok) {
        throw new Error('Failed to fetch symptoms');
      }
      const data = await response.json();
      setSymptoms(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch symptoms');
    } finally {
      setLoading(false);
    }
  };

  const toggleSymptom = (symptomId: number) => {
    const newExpanded = new Set(expandedSymptoms);
    if (newExpanded.has(symptomId)) {
      newExpanded.delete(symptomId);
    } else {
      newExpanded.add(symptomId);
    }
    setExpandedSymptoms(newExpanded);
  };

  const filteredSymptoms = symptoms.filter(symptom =>
    symptom.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    symptom.variants.some(variant => 
      variant.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Loading symptoms...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="text-red-800">Error: {error}</div>
        <button 
          onClick={fetchSymptoms}
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* View as Vine Button */}
      <div className="text-center mb-6">
        <button
          onClick={() => setShowVineDiagram(true)}
          className="inline-flex items-center px-6 py-3 rounded-full font-semibold border-2 transition-all duration-200 shadow-lg bg-green-600 text-white border-transparent hover:bg-green-700 hover:border-green-700 hover:shadow-xl hover:scale-105"
        >
                     <span className="material-symbols-outlined mr-2 text-xl">account_tree</span>
           View Interactive Tree
         </button>
         <p className="text-sm text-gray-600 mt-2">
           Explore the complete symptom hierarchy as an interactive tree diagram
         </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search symptoms and variants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          search
        </span>
      </div>

      {/* Tree Structure */}
      <div className="space-y-2">
        {filteredSymptoms.map((symptom) => (
          <div key={symptom.id} className="border border-gray-200 rounded-lg">
            {/* Symptom Header */}
            <div className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleSymptom(symptom.id)}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    {expandedSymptoms.has(symptom.id) ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
                <span className="font-semibold text-gray-800">{symptom.title}</span>
                <span className="text-sm text-gray-500">({symptom.variants.length} variants)</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSymptomSelect(symptom)}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  View
                </button>
                <button
                  onClick={() => onManageIndications(symptom)}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                >
                  Manage Indications
                </button>
              </div>
            </div>

            {/* Variants */}
            {expandedSymptoms.has(symptom.id) && (
              <div className="border-t border-gray-200">
                {symptom.variants.map((variant, index) => (
                  <div 
                    key={variant.id} 
                    className={`flex items-center justify-between p-3 hover:bg-gray-50 transition-colors ${
                      index === symptom.variants.length - 1 ? '' : 'border-b border-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2 ml-8">
                      <span className="text-gray-400">└─</span>
                      <span className="text-gray-700">{variant.name}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onSymptomSelect(symptom, variant)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onManageIndications(symptom, variant)}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                      >
                        Manage Indications
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="text-sm text-gray-600 text-center p-4">
        Showing {filteredSymptoms.length} symptoms with {filteredSymptoms.reduce((sum, s) => sum + s.variants.length, 0)} total variants
      </div>

      {/* Interactive Tree Diagram Modal */}
      <InteractiveTreeDiagram 
        isOpen={showVineDiagram} 
        onClose={() => setShowVineDiagram(false)} 
      />
    </div>
  );
}
