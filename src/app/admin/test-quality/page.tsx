'use client';

import { useState } from 'react';

export default function TestQualityPage() {
  const [herbSlug, setHerbSlug] = useState('st-johns-wort');
  const [productType, setProductType] = useState('capsule');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const herbs = ['st-johns-wort', 'lemon-balm', 'valerian', 'chamomile'];
  const productTypes = ['tincture', 'capsule', 'tea', 'essential-oil'];
  
  const testQualityFilter = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-quality-filter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ herbSlug, productType }),
      });
      
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error testing quality filter:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Quality Filter Test</h1>
      
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Test Quality Filtering</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Herb</label>
            <select 
              value={herbSlug}
              onChange={(e) => setHerbSlug(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {herbs.map(herb => (
                <option key={herb} value={herb}>
                  {herb.replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Product Type</label>
            <select 
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {productTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <button
          onClick={testQualityFilter}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Quality Filter'}
        </button>
      </div>
      
      {results && (
        <div className="space-y-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded">
            <h3 className="font-semibold text-green-800 mb-2">Test Results</h3>
            <p className="text-green-700">
              Found {results.filteredProducts} quality products out of {results.totalProducts} total products
            </p>
          </div>
          
          {results.specifications && results.specifications.length > 0 && (
            <div className="border rounded p-4">
              <h3 className="font-semibold mb-3">Quality Specifications</h3>
              {results.specifications.map((spec: any, index: number) => (
                <div key={index} className="mb-4 p-3 bg-gray-50 rounded">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Required Terms:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {spec.requiredTerms.map((term: string) => (
                          <span key={term} className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                            {term}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <strong>Preferred Terms:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {spec.preferredTerms.map((term: string) => (
                          <span key={term} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                            {term}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <strong>Avoid Terms:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {spec.avoidTerms.map((term: string) => (
                          <span key={term} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                            {term}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <strong>Price Range:</strong>
                      <div className="mt-1">
                        ${spec.priceRange.min} - ${spec.priceRange.max} {spec.priceRange.currency}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {results.products && results.products.length > 0 && (
            <div className="border rounded p-4">
              <h3 className="font-semibold mb-3">Filtered Products (Ranked by Quality)</h3>
              <div className="space-y-4">
                {results.products.map((product: any, index: number) => (
                  <div key={product.id} className="border rounded p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{product.name}</h4>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          Quality Score: {product.qualityScore.score}/100
                        </div>
                        <div className="text-sm text-gray-600">
                          ${product.price} • {product.rating}/5 ({product.reviewCount} reviews)
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{product.description}</p>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <strong className="text-green-700">✓ Matched Required:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {product.qualityScore.matches.required.map((term: string) => (
                            <span key={term} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                              {term}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <strong className="text-blue-700">+ Preferred:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {product.qualityScore.matches.preferred.map((term: string) => (
                            <span key={term} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              {term}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <strong className="text-red-700">⚠ Avoided:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {product.qualityScore.matches.avoided.map((term: string) => (
                            <span key={term} className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                              {term}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {product.qualityScore.reasons.length > 0 && (
                      <div className="mt-3">
                        <strong className="text-green-700">Reasons for high score:</strong>
                        <ul className="list-disc list-inside text-sm text-green-700 mt-1">
                          {product.qualityScore.reasons.map((reason: string, idx: number) => (
                            <li key={idx}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {product.qualityScore.warnings.length > 0 && (
                      <div className="mt-3">
                        <strong className="text-red-700">Warnings:</strong>
                        <ul className="list-disc list-inside text-sm text-red-700 mt-1">
                          {product.qualityScore.warnings.map((warning: string, idx: number) => (
                            <li key={idx}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-semibold text-blue-800 mb-3">How Quality Filtering Works</h3>
        <div className="text-blue-700 space-y-2">
          <p><strong>Required Terms:</strong> Products must contain these terms to pass basic filtering</p>
          <p><strong>Preferred Terms:</strong> Bonus points for products containing these quality indicators</p>
          <p><strong>Avoid Terms:</strong> Penalties for products containing low-quality indicators</p>
          <p><strong>Standardization:</strong> Checks for specific compound percentages (e.g., 0.3% hypericin)</p>
          <p><strong>Alcohol Specs:</strong> For tinctures, checks ratio (1:1 vs 1:4) and organic alcohol</p>
          <p><strong>Price & Rating:</strong> Ensures products are within acceptable price range and have good reviews</p>
        </div>
      </div>
    </div>
  );
} 