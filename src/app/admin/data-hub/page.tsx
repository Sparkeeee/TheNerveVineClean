"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface ProcessingCriteria {
  symptoms?: string[];
  herbs?: string[];
  supplements?: string[];
  priceRange?: { min: number; max: number };
  qualityThreshold?: number;
  ratingThreshold?: number;
  commissionThreshold?: number;
  userSegment?: 'quality-focused' | 'price-sensitive' | 'balanced';
  region?: string;
}

interface ProcessedProduct {
  id: string;
  name: string;
  brand: string;
  supplier: string;
  category: 'traditional' | 'phytopharmaceutical' | 'mass-market';
  price: number;
  currency: string;
  commissionRate: number;
  qualityScore: number;
  rating?: number;
  reviewCount?: number;
  affiliateUrl: string;
  imageUrl?: string;
  description?: string;
  tags: string[];
  availability: boolean;
  profitMargin: number;
  userValueScore: number;
  compositeScore: number;
  regionalScore: number;
  source: string;
  lastUpdated: Date;
  processingPriority: number;
}

interface ProcessingResult {
  products: ProcessedProduct[];
  summary: {
    totalFound: number;
    totalProcessed: number;
    averageQualityScore: number;
    averageCommissionRate: number;
    topSuppliers: string[];
    recommendations: string[];
  };
  metadata: {
    processingTime: number;
    sourcesUsed: string[];
    filtersApplied: string[];
  };
}

export default function DataHubAdminPage() {
  const [criteria, setCriteria] = useState<ProcessingCriteria>({
    herbs: ['ashwagandha'],
    userSegment: 'balanced',
    priceRange: { min: 5, max: 100 },
    qualityThreshold: 6
  });
  
  const [herbSlug, setHerbSlug] = useState<string>('ashwagandha');
  const [supplementSlug, setSupplementSlug] = useState<string>('');
  
  const [results, setResults] = useState<ProcessingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProcessedProduct | null>(null);

  const processData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/process-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(criteria),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateCriteria = (field: keyof ProcessingCriteria, value: unknown) => {
    setCriteria(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addHerb = () => {
    const newHerb = prompt('Enter herb name:');
    if (newHerb) {
      updateCriteria('herbs', [...(criteria.herbs || []), newHerb]);
    }
  };

  const removeHerb = (index: number) => {
    updateCriteria('herbs', criteria.herbs?.filter((_, i) => i !== index));
  };

  const addSymptom = () => {
    const newSymptom = prompt('Enter symptom:');
    if (newSymptom) {
      updateCriteria('symptoms', [...(criteria.symptoms || []), newSymptom]);
    }
  };

  const removeSymptom = (index: number) => {
    updateCriteria('symptoms', criteria.symptoms?.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10" style={{
        backgroundImage: "url('/images/RoseWPWM.PNG')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>
        <div className="absolute inset-0 bg-pink-100 opacity-90"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-6 pt-8 pb-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/admin" 
                className="inline-flex items-center px-6 py-3 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-gray-400 hover:text-gray-600 hover:shadow-gray-300 hover:shadow-lg hover:scale-105">
            ← Admin Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Data Processing Hub</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Processing Criteria Panel */}
          <div className="rounded-xl p-6 shadow-sm border-2 border-gray-300" 
               style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Processing Criteria</h2>
            
            {/* Herbs */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-700">Herbs:</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {criteria.herbs?.map((herb, index) => (
                  <span key={index} className="bg-white text-green-700 px-3 py-1 rounded-full border border-green-300 flex items-center gap-1 shadow-sm">
                    {herb}
                    <button
                      onClick={() => removeHerb(index)}
                      className="text-red-500 hover:text-red-700 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <button
                onClick={addHerb}
                className="inline-flex items-center px-4 py-2 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-gray-400 hover:text-gray-600 hover:shadow-gray-300 hover:shadow-lg hover:scale-105"
              >
                + Add Herb
              </button>
            </div>

            {/* Symptoms */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-700">Symptoms:</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {criteria.symptoms?.map((symptom, index) => (
                  <span key={index} className="bg-white text-blue-700 px-3 py-1 rounded-full border border-blue-300 flex items-center gap-1 shadow-sm">
                    {symptom}
                    <button
                      onClick={() => removeSymptom(index)}
                      className="text-red-500 hover:text-red-700 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <button
                onClick={addSymptom}
                className="inline-flex items-center px-4 py-2 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-gray-400 hover:text-gray-600 hover:shadow-gray-300 hover:shadow-lg hover:scale-105"
              >
                + Add Symptom
              </button>
            </div>

            {/* User Segment */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-700">User Segment:</label>
              <select
                value={criteria.userSegment || 'balanced'}
                onChange={(e) => updateCriteria('userSegment', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="quality-focused">Quality-Focused</option>
                <option value="price-sensitive">Price-Sensitive</option>
                <option value="balanced">Balanced</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-700">Price Range:</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={criteria.priceRange?.min || ''}
                  onChange={(e) => updateCriteria('priceRange', { 
                    ...criteria.priceRange, 
                    min: parseFloat(e.target.value) || 0 
                  })}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={criteria.priceRange?.max || ''}
                  onChange={(e) => updateCriteria('priceRange', { 
                    ...criteria.priceRange, 
                    max: parseFloat(e.target.value) || 0 
                  })}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Quality Threshold */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2 text-gray-700">Quality Threshold:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={criteria.qualityThreshold || 6}
                onChange={(e) => updateCriteria('qualityThreshold', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Database Integration */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-gray-700">Database Integration:</h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm mb-1 text-gray-700">Herb Slug:</label>
                  <input
                    type="text"
                    value={herbSlug}
                    onChange={(e) => setHerbSlug(e.target.value)}
                    placeholder="e.g., ashwagandha"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-700">Supplement Slug:</label>
                  <input
                    type="text"
                    value={supplementSlug}
                    onChange={(e) => setSupplementSlug(e.target.value)}
                    placeholder="e.g., vitamin-d"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Process Button */}
            <button
              onClick={processData}
              disabled={loading}
              className="w-full inline-flex items-center px-6 py-3 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-green-600 text-white border-transparent hover:bg-green-700 hover:border-green-700 hover:shadow-lg hover:scale-105 disabled:bg-gray-400 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Process Data'}
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg shadow-sm border border-red-300">
                {error}
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="rounded-xl p-6 shadow-sm border-2 border-gray-300" 
               style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Processing Results</h2>
            
            {results ? (
              <div>
                {/* Summary */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-300">
                  <h3 className="font-bold mb-2 text-gray-800">Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>Total Found: {results.summary.totalFound}</div>
                    <div>Total Processed: {results.summary.totalProcessed}</div>
                    <div>Avg Quality: {results.summary.averageQualityScore}</div>
                    <div>Avg Commission: {(results.summary.averageCommissionRate * 100).toFixed(1)}%</div>
                  </div>
                  <div className="mt-2 text-gray-700">
                    <strong>Top Suppliers:</strong> {results.summary.topSuppliers.join(', ')}
                  </div>
                  {results.summary.recommendations.length > 0 && (
                    <div className="mt-2 text-gray-700">
                      <strong>Recommendations:</strong>
                      <ul className="list-disc ml-4 text-gray-700">
                        {results.summary.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Products List */}
                <div>
                  <h3 className="font-bold mb-2 text-gray-800">Products ({results.products.length})</h3>
                  <div className="max-h-96 overflow-y-auto">
                    {results.products.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className="border rounded-lg p-3 mb-2 cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{product.name}</h4>
                            <p className="text-sm text-gray-700">{product.brand} - {product.supplier}</p>
                            <div className="flex gap-4 text-xs text-gray-700 mt-1">
                              <span>${product.price}</span>
                              <span>Quality: {product.qualityScore}/10</span>
                              <span>Commission: {(product.commissionRate * 100).toFixed(1)}%</span>
                              <span>Score: {product.compositeScore.toFixed(1)}</span>
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                            product.category === 'traditional' ? 'bg-green-100 text-green-800' :
                            product.category === 'phytopharmaceutical' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {product.category}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Processing Metadata */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg shadow-sm border border-blue-300 text-sm text-gray-700">
                  <strong>Processing Time:</strong> {results.metadata.processingTime}ms<br/>
                  <strong>Sources Used:</strong> {results.metadata.sourcesUsed.join(', ')}<br/>
                  <strong>Filters Applied:</strong> {results.metadata.filtersApplied.join(', ')}
                </div>
              </div>
            ) : (
              <div className="text-gray-800 text-center py-8">
                No results yet. Set criteria and click &quot;Process Data&quot; to get started.
              </div>
            )}
          </div>
        </div>

        {/* Product Detail Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{selectedProduct.name}</h3>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="text-gray-800 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <strong>Brand:</strong> {selectedProduct.brand}<br/>
                    <strong>Supplier:</strong> {selectedProduct.supplier}<br/>
                    <strong>Category:</strong> {selectedProduct.category}<br/>
                    <strong>Price:</strong> ${selectedProduct.price} {selectedProduct.currency}
                  </div>
                  <div>
                    <strong>Quality Score:</strong> {selectedProduct.qualityScore}/10<br/>
                    <strong>Commission Rate:</strong> {(selectedProduct.commissionRate * 100).toFixed(1)}%<br/>
                    <strong>User Value Score:</strong> {selectedProduct.userValueScore.toFixed(1)}<br/>
                    <strong>Composite Score:</strong> {selectedProduct.compositeScore.toFixed(1)}
                  </div>
                </div>

                {selectedProduct.description && (
                  <div className="mb-4">
                    <strong>Description:</strong><br/>
                    <p className="text-sm text-gray-700">{selectedProduct.description}</p>
                  </div>
                )}

                <div className="mb-4">
                  <strong>Tags:</strong><br/>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedProduct.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={selectedProduct.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-blue-600 text-white border-transparent hover:bg-blue-700 hover:border-blue-700 hover:shadow-lg hover:scale-105"
                  >
                    View Product
                  </a>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="inline-flex items-center px-6 py-3 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-gray-600 text-white border-transparent hover:bg-gray-700 hover:border-gray-700 hover:shadow-lg hover:scale-105"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 