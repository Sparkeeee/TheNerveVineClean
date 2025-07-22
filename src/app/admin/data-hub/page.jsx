"use client";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useState } from 'react';
import Link from 'next/link';
export default function DataHubAdminPage() {
    var _a, _b, _c, _d;
    const [criteria, setCriteria] = useState({
        herbs: ['ashwagandha'],
        userSegment: 'balanced',
        priceRange: { min: 5, max: 100 },
        qualityThreshold: 6
    });
    const [herbSlug, setHerbSlug] = useState('ashwagandha');
    const [supplementSlug, setSupplementSlug] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const processData = () => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        setError(null);
        try {
            const response = yield fetch('/api/process-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(criteria),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = yield response.json();
            setResults(data);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
        finally {
            setLoading(false);
        }
    });
    const updateCriteria = (field, value) => {
        setCriteria(prev => (Object.assign(Object.assign({}, prev), { [field]: value })));
    };
    const addHerb = () => {
        const newHerb = prompt('Enter herb name:');
        if (newHerb) {
            updateCriteria('herbs', [...(criteria.herbs || []), newHerb]);
        }
    };
    const removeHerb = (index) => {
        var _a;
        updateCriteria('herbs', (_a = criteria.herbs) === null || _a === void 0 ? void 0 : _a.filter((_, i) => i !== index));
    };
    const addSymptom = () => {
        const newSymptom = prompt('Enter symptom:');
        if (newSymptom) {
            updateCriteria('symptoms', [...(criteria.symptoms || []), newSymptom]);
        }
    };
    const removeSymptom = (index) => {
        var _a;
        updateCriteria('symptoms', (_a = criteria.symptoms) === null || _a === void 0 ? void 0 : _a.filter((_, i) => i !== index));
    };
    return (<div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/admin" className="bg-blue-700 text-white px-4 py-2 rounded shadow hover:bg-blue-800 transition font-bold">
            Admin Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Data Processing Hub</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Processing Criteria Panel */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Processing Criteria</h2>
            
            {/* Herbs */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Herbs:</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(_a = criteria.herbs) === null || _a === void 0 ? void 0 : _a.map((herb, index) => (<span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded flex items-center gap-1">
                    {herb}
                    <button onClick={() => removeHerb(index)} className="text-red-600 hover:text-red-800">
                      ×
                    </button>
                  </span>))}
              </div>
              <button onClick={addHerb} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                + Add Herb
              </button>
            </div>

            {/* Symptoms */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Symptoms:</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(_b = criteria.symptoms) === null || _b === void 0 ? void 0 : _b.map((symptom, index) => (<span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1">
                    {symptom}
                    <button onClick={() => removeSymptom(index)} className="text-red-600 hover:text-red-800">
                      ×
                    </button>
                  </span>))}
              </div>
              <button onClick={addSymptom} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                + Add Symptom
              </button>
            </div>

            {/* User Segment */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">User Segment:</label>
              <select value={criteria.userSegment || 'balanced'} onChange={(e) => updateCriteria('userSegment', e.target.value)} className="w-full border rounded px-3 py-2">
                <option value="quality-focused">Quality Focused</option>
                <option value="price-sensitive">Price Sensitive</option>
                <option value="balanced">Balanced</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Price Range:</label>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" value={((_c = criteria.priceRange) === null || _c === void 0 ? void 0 : _c.min) || ''} onChange={(e) => updateCriteria('priceRange', Object.assign(Object.assign({}, criteria.priceRange), { min: parseFloat(e.target.value) || 0 }))} className="w-1/2 border rounded px-3 py-2"/>
                <input type="number" placeholder="Max" value={((_d = criteria.priceRange) === null || _d === void 0 ? void 0 : _d.max) || ''} onChange={(e) => updateCriteria('priceRange', Object.assign(Object.assign({}, criteria.priceRange), { max: parseFloat(e.target.value) || 0 }))} className="w-1/2 border rounded px-3 py-2"/>
              </div>
            </div>

            {/* Quality Threshold */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Quality Threshold:</label>
              <input type="number" min="1" max="10" value={criteria.qualityThreshold || 6} onChange={(e) => updateCriteria('qualityThreshold', parseInt(e.target.value))} className="w-full border rounded px-3 py-2"/>
            </div>

            {/* Database Integration */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Database Integration:</h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm mb-1">Herb Slug:</label>
                  <input type="text" value={herbSlug} onChange={(e) => setHerbSlug(e.target.value)} placeholder="e.g., ashwagandha" className="w-full border rounded px-3 py-2"/>
                </div>
                <div>
                  <label className="block text-sm mb-1">Supplement Slug:</label>
                  <input type="text" value={supplementSlug} onChange={(e) => setSupplementSlug(e.target.value)} placeholder="e.g., vitamin-d" className="w-full border rounded px-3 py-2"/>
                </div>
              </div>
            </div>

            {/* Process Button */}
            <button onClick={processData} disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-400">
              {loading ? 'Processing...' : 'Process Data'}
            </button>

            {error && (<div className="mt-4 p-3 bg-red-100 text-red-800 rounded">
                {error}
              </div>)}
          </div>

          {/* Results Panel */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Processing Results</h2>
            
            {results ? (<div>
                {/* Summary */}
                <div className="mb-6 p-4 bg-gray-50 rounded">
                  <h3 className="font-bold mb-2">Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Total Found: {results.summary.totalFound}</div>
                    <div>Total Processed: {results.summary.totalProcessed}</div>
                    <div>Avg Quality: {results.summary.averageQualityScore}</div>
                    <div>Avg Commission: {(results.summary.averageCommissionRate * 100).toFixed(1)}%</div>
                  </div>
                  <div className="mt-2">
                    <strong>Top Suppliers:</strong> {results.summary.topSuppliers.join(', ')}
                  </div>
                  {results.summary.recommendations.length > 0 && (<div className="mt-2">
                      <strong>Recommendations:</strong>
                      <ul className="list-disc ml-4">
                        {results.summary.recommendations.map((rec, index) => (<li key={index}>{rec}</li>))}
                      </ul>
                    </div>)}
                </div>

                {/* Products List */}
                <div>
                  <h3 className="font-bold mb-2">Products ({results.products.length})</h3>
                  <div className="max-h-96 overflow-y-auto">
                    {results.products.map((product) => (<div key={product.id} onClick={() => setSelectedProduct(product)} className="border rounded p-3 mb-2 cursor-pointer hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold">{product.name}</h4>
                            <p className="text-sm text-gray-600">{product.brand} - {product.supplier}</p>
                            <div className="flex gap-4 text-xs mt-1">
                              <span>${product.price}</span>
                              <span>Quality: {product.qualityScore}/10</span>
                              <span>Commission: {(product.commissionRate * 100).toFixed(1)}%</span>
                              <span>Score: {product.compositeScore.toFixed(1)}</span>
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded text-xs font-bold ${product.category === 'traditional' ? 'bg-green-100 text-green-800' :
                    product.category === 'phytopharmaceutical' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'}`}>
                            {product.category}
                          </div>
                        </div>
                      </div>))}
                  </div>
                </div>

                {/* Processing Metadata */}
                <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
                  <strong>Processing Time:</strong> {results.metadata.processingTime}ms<br />
                  <strong>Sources Used:</strong> {results.metadata.sourcesUsed.join(', ')}<br />
                  <strong>Filters Applied:</strong> {results.metadata.filtersApplied.join(', ')}
                </div>
              </div>) : (<div className="text-gray-500 text-center py-8">
                No results yet. Set criteria and click &quot;Process Data&quot; to get started.
              </div>)}
          </div>
        </div>

        {/* Product Detail Modal */}
        {selectedProduct && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{selectedProduct.name}</h3>
                  <button onClick={() => setSelectedProduct(null)} className="text-gray-500 hover:text-gray-700">
                    ×
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <strong>Brand:</strong> {selectedProduct.brand}<br />
                    <strong>Supplier:</strong> {selectedProduct.supplier}<br />
                    <strong>Category:</strong> {selectedProduct.category}<br />
                    <strong>Price:</strong> ${selectedProduct.price} {selectedProduct.currency}
                  </div>
                  <div>
                    <strong>Quality Score:</strong> {selectedProduct.qualityScore}/10<br />
                    <strong>Commission Rate:</strong> {(selectedProduct.commissionRate * 100).toFixed(1)}%<br />
                    <strong>User Value Score:</strong> {selectedProduct.userValueScore.toFixed(1)}<br />
                    <strong>Composite Score:</strong> {selectedProduct.compositeScore.toFixed(1)}
                  </div>
                </div>

                {selectedProduct.description && (<div className="mb-4">
                    <strong>Description:</strong><br />
                    <p className="text-sm text-gray-600">{selectedProduct.description}</p>
                  </div>)}

                <div className="mb-4">
                  <strong>Tags:</strong><br />
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedProduct.tags.map((tag, index) => (<span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <a href={selectedProduct.affiliateUrl} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    View Product
                  </a>
                  <button onClick={() => setSelectedProduct(null)} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>)}
      </div>
    </div>);
}
