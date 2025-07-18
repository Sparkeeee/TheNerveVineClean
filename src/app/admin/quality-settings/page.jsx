'use client';
import { useState } from 'react';
import { qualitySpecs } from '../../../lib/product-quality-specs';
export default function QualitySettingsPage() {
    const [selectedHerb, setSelectedHerb] = useState('');
    const [selectedProductType, setSelectedProductType] = useState('');
    const [editingSpec, setEditingSpec] = useState(null);
    const [customSpecs, setCustomSpecs] = useState([]);
    const herbs = Array.from(new Set([...qualitySpecs.map(spec => spec.herbSlug), ...customSpecs.map(spec => spec.herbSlug)]));
    const productTypes = ['tincture', 'capsule', 'tea', 'essential-oil', 'powder', 'tablet'];
    const currentSpecs = [...qualitySpecs, ...customSpecs].filter(spec => spec.herbSlug === selectedHerb && spec.productType === selectedProductType);
    const handleEditSpec = (spec) => {
        setEditingSpec(Object.assign({}, spec));
    };
    const handleSaveSpec = () => {
        if (!editingSpec)
            return;
        const existingSpecIndex = customSpecs.findIndex(spec => spec.herbSlug === editingSpec.herbSlug && spec.productType === editingSpec.productType);
        if (existingSpecIndex >= 0) {
            const updatedCustomSpecs = [...customSpecs];
            updatedCustomSpecs[existingSpecIndex] = editingSpec;
            setCustomSpecs(updatedCustomSpecs);
        }
        else {
            setCustomSpecs([...customSpecs, editingSpec]);
        }
        setEditingSpec(null);
    };
    const handleCreateSpec = () => {
        if (!selectedHerb || !selectedProductType)
            return;
        const newSpec = {
            herbSlug: selectedHerb,
            herbName: selectedHerb.replace('-', ' '),
            productType: selectedProductType,
            requiredTerms: [],
            preferredTerms: [],
            avoidTerms: [],
            priceRange: { min: 5, max: 50, currency: 'USD' },
            ratingThreshold: 4.0,
            reviewCountThreshold: 50
        };
        setEditingSpec(newSpec);
    };
    const handleDeleteSpec = (specToDelete) => {
        setCustomSpecs(customSpecs.filter(spec => !(spec.herbSlug === specToDelete.herbSlug && spec.productType === specToDelete.productType)));
    };
    return (<div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-white">Quality Settings</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Herb</label>
            <select value={selectedHerb} onChange={(e) => setSelectedHerb(e.target.value)} className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
              <option value="">Select a herb</option>
              {herbs.map(herb => (<option key={herb} value={herb}>
                  {herb.replace('-', ' ')}
                </option>))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Product Type</label>
            <select value={selectedProductType} onChange={(e) => setSelectedProductType(e.target.value)} className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
              <option value="">Select product type</option>
              {productTypes.map(type => (<option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>))}
            </select>
          </div>
        </div>
        
        {selectedHerb && selectedProductType && (<div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                Quality Specifications for {selectedHerb.replace('-', ' ')} {selectedProductType}
              </h2>
              <button onClick={handleCreateSpec} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                Create New Spec
              </button>
            </div>
            
            {currentSpecs.length > 0 ? (<div className="space-y-4">
                {currentSpecs.map((spec, index) => {
                    const isCustomSpec = customSpecs.some(customSpec => customSpec.herbSlug === spec.herbSlug && customSpec.productType === spec.productType);
                    return (<div key={`${spec.herbSlug}-${spec.productType}-${index}`} className="border border-gray-700 rounded-lg p-4 bg-gray-800">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-white">Specification {index + 1}</h3>
                          {isCustomSpec && (<span className="text-xs text-blue-400 bg-blue-900 px-2 py-1 rounded">
                              Custom Spec
                            </span>)}
                        </div>
                        <div className="flex space-x-2">
                          <button onClick={() => handleEditSpec(spec)} className="text-blue-400 hover:text-blue-300 transition-colors">
                            Edit
                          </button>
                          {isCustomSpec && (<button onClick={() => handleDeleteSpec(spec)} className="text-red-400 hover:text-red-300 transition-colors">
                              Delete
                            </button>)}
                        </div>
                      </div>
                    
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong className="text-gray-200">Required Terms:</strong>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {spec.requiredTerms.map(term => (<span key={term} className="bg-red-900 text-red-200 px-2 py-1 rounded text-xs border border-red-700">
                                {term}
                              </span>))}
                          </div>
                        </div>
                        
                        <div>
                          <strong className="text-gray-200">Preferred Terms:</strong>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {spec.preferredTerms.map(term => (<span key={term} className="bg-green-900 text-green-200 px-2 py-1 rounded text-xs border border-green-700">
                                {term}
                              </span>))}
                          </div>
                        </div>
                        
                        <div>
                          <strong className="text-gray-200">Avoid Terms:</strong>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {spec.avoidTerms.map(term => (<span key={term} className="bg-yellow-900 text-yellow-200 px-2 py-1 rounded text-xs border border-yellow-700">
                                {term}
                              </span>))}
                          </div>
                        </div>
                        
                        <div>
                          <strong className="text-gray-200">Price Range:</strong>
                          <div className="mt-1 text-gray-300">
                            ${spec.priceRange.min} - ${spec.priceRange.max} {spec.priceRange.currency}
                          </div>
                        </div>
                        
                        {spec.standardization && (<div>
                            <strong className="text-gray-200">Standardization:</strong>
                            <div className="mt-1 text-gray-300">
                              {spec.standardization.compound} {spec.standardization.percentage}{spec.standardization.unit}
                            </div>
                          </div>)}
                        
                        {spec.alcoholSpecs && (<div>
                            <strong className="text-gray-200">Alcohol Specs:</strong>
                            <div className="mt-1 text-gray-300">
                              Ratio: {spec.alcoholSpecs.ratio}, Organic: {spec.alcoholSpecs.organic ? 'Yes' : 'No'}
                            </div>
                          </div>)}
                      </div>
                    </div>);
                })}
              </div>) : (<div className="text-gray-400 text-center py-8 bg-gray-800 rounded-lg border border-gray-700">
                No specifications found for this herb and product type.
              </div>)}
          </div>)}
        
        {editingSpec && (<div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold mb-4 text-white">Edit Quality Specification</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-200">Required Terms (comma-separated)</label>
                  <input type="text" value={editingSpec.requiredTerms.join(', ')} onChange={(e) => setEditingSpec(Object.assign(Object.assign({}, editingSpec), { requiredTerms: e.target.value.split(',').map(term => term.trim()).filter(Boolean) }))} className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"/>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-200">Preferred Terms (comma-separated)</label>
                  <input type="text" value={editingSpec.preferredTerms.join(', ')} onChange={(e) => setEditingSpec(Object.assign(Object.assign({}, editingSpec), { preferredTerms: e.target.value.split(',').map(term => term.trim()).filter(Boolean) }))} className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"/>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-200">Avoid Terms (comma-separated)</label>
                  <input type="text" value={editingSpec.avoidTerms.join(', ')} onChange={(e) => setEditingSpec(Object.assign(Object.assign({}, editingSpec), { avoidTerms: e.target.value.split(',').map(term => term.trim()).filter(Boolean) }))} className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"/>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-200">Min Price</label>
                    <input type="number" value={editingSpec.priceRange.min} onChange={(e) => setEditingSpec(Object.assign(Object.assign({}, editingSpec), { priceRange: Object.assign(Object.assign({}, editingSpec.priceRange), { min: parseFloat(e.target.value) }) }))} className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"/>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-200">Max Price</label>
                    <input type="number" value={editingSpec.priceRange.max} onChange={(e) => setEditingSpec(Object.assign(Object.assign({}, editingSpec), { priceRange: Object.assign(Object.assign({}, editingSpec.priceRange), { max: parseFloat(e.target.value) }) }))} className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"/>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-200">Rating Threshold</label>
                    <input type="number" step="0.1" value={editingSpec.ratingThreshold} onChange={(e) => setEditingSpec(Object.assign(Object.assign({}, editingSpec), { ratingThreshold: parseFloat(e.target.value) }))} className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"/>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-200">Review Count Threshold</label>
                    <input type="number" value={editingSpec.reviewCountThreshold} onChange={(e) => setEditingSpec(Object.assign(Object.assign({}, editingSpec), { reviewCountThreshold: parseInt(e.target.value) }))} className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"/>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <button onClick={() => setEditingSpec(null)} className="px-4 py-2 border border-gray-600 rounded bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors">
                  Cancel
                </button>
                <button onClick={handleSaveSpec} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                  Save
                </button>
              </div>
            </div>
          </div>)}
      </div>
    </div>);
}
