'use client';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useState } from 'react';
import { ProductQualityAnalyzer, qualitySpecs } from '@/lib/product-quality-specs';
export default function TestQualityPage() {
    var _a, _b, _c, _d, _e, _f;
    const [selectedHerb, setSelectedHerb] = useState('');
    const [selectedProductType, setSelectedProductType] = useState('');
    const [testResults, setTestResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const herbs = ['st-johns-wort', 'lemon-balm', 'valerian', 'chamomile'];
    const productTypes = ['tincture', 'capsule', 'tea', 'essential-oil'];
    const handleTestQuality = () => __awaiter(this, void 0, void 0, function* () {
        if (!selectedHerb || !selectedProductType)
            return;
        setLoading(true);
        try {
            const analyzer = new ProductQualityAnalyzer();
            const specs = analyzer.getSpecsForHerb(selectedHerb, selectedProductType);
            // Mock test results for now
            const mockResults = [
                {
                    product: {
                        title: 'Test Product',
                        price: 25.99,
                        rating: 4.5,
                        reviewCount: 150,
                        url: 'https://example.com'
                    },
                    score: 85,
                    passed: true,
                    reasons: ['All required terms present', 'Price within acceptable range']
                }
            ];
            // Use specs to validate the mock results
            console.log('Quality specifications:', specs);
            setTestResults(mockResults);
        }
        catch (error) {
            console.error('Error testing quality:', error);
        }
        finally {
            setLoading(false);
        }
    });
    return (<div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Quality Filter Test</h1>
      
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Test Quality Filtering</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Herb</label>
            <select value={selectedHerb} onChange={(e) => setSelectedHerb(e.target.value)} className="w-full p-2 border rounded">
              {herbs.map(herb => (<option key={herb} value={herb}>
                  {herb.replace('-', ' ')}
                </option>))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Product Type</label>
            <select value={selectedProductType} onChange={(e) => setSelectedProductType(e.target.value)} className="w-full p-2 border rounded">
              {productTypes.map(type => (<option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>))}
            </select>
          </div>
        </div>
        
        <button onClick={handleTestQuality} disabled={loading} className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50">
          {loading ? 'Testing...' : 'Test Quality Filter'}
        </button>
      </div>
      
      {testResults && (<div className="space-y-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded">
            <h3 className="font-semibold text-green-800 mb-2">Test Results</h3>
            <p className="text-green-700">
              Found {testResults.length} quality products out of {testResults.length} total products
            </p>
          </div>
          
          {testResults.length > 0 && (<div className="border rounded p-4">
              <h3 className="font-semibold mb-3">Quality Specifications Used</h3>
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Required Terms:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {((_a = qualitySpecs.find(spec => spec.herbSlug === selectedHerb && spec.productType === selectedProductType)) === null || _a === void 0 ? void 0 : _a.requiredTerms.map((term) => (<span key={term} className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                          {term}
                        </span>))) || []}
                    </div>
                  </div>
                  
                  <div>
                    <strong>Preferred Terms:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {((_b = qualitySpecs.find(spec => spec.herbSlug === selectedHerb && spec.productType === selectedProductType)) === null || _b === void 0 ? void 0 : _b.preferredTerms.map((term) => (<span key={term} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          {term}
                        </span>))) || []}
                    </div>
                  </div>
                  
                  <div>
                    <strong>Avoid Terms:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {((_c = qualitySpecs.find(spec => spec.herbSlug === selectedHerb && spec.productType === selectedProductType)) === null || _c === void 0 ? void 0 : _c.avoidTerms.map((term) => (<span key={term} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                          {term}
                        </span>))) || []}
                    </div>
                  </div>
                  
                  <div>
                    <strong>Price Range:</strong>
                    <div className="mt-1">
                      ${((_d = qualitySpecs.find(spec => spec.herbSlug === selectedHerb && spec.productType === selectedProductType)) === null || _d === void 0 ? void 0 : _d.priceRange.min) || 0} - ${((_e = qualitySpecs.find(spec => spec.herbSlug === selectedHerb && spec.productType === selectedProductType)) === null || _e === void 0 ? void 0 : _e.priceRange.max) || 0} {((_f = qualitySpecs.find(spec => spec.herbSlug === selectedHerb && spec.productType === selectedProductType)) === null || _f === void 0 ? void 0 : _f.priceRange.currency) || 'USD'}
                    </div>
                  </div>
                </div>
              </div>
            </div>)}
          
          {testResults.length > 0 && (<div className="border rounded p-4">
              <h3 className="font-semibold mb-3">Filtered Products (Ranked by Quality)</h3>
              <div className="space-y-4">
                {testResults.map((product, index) => (<div key={index} className="border rounded p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{product.product.title}</h4>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          Quality Score: {product.score}/100
                        </div>
                        <div className="text-sm text-gray-600">
                          ${product.product.price} • {product.product.rating}/5 ({product.product.reviewCount} reviews)
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{product.product.url}</p>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <strong className="text-green-700">✓ Quality Score: {product.score}/100</strong>
                        <div className="mt-1 text-sm text-gray-600">
                          {product.passed ? 'Passed quality filter' : 'Failed quality filter'}
                        </div>
                      </div>
                      
                      <div>
                        <strong className="text-blue-700">Reasons:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {product.reasons.map((reason, idx) => (<span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              {reason}
                            </span>))}
                        </div>
                      </div>
                      
                      <div>
                        <strong className="text-gray-700">Product Details:</strong>
                        <div className="mt-1 text-sm text-gray-600">
                          Rating: {product.product.rating}/5 ({product.product.reviewCount} reviews)
                        </div>
                      </div>
                    </div>
                  </div>))}
              </div>
            </div>)}
        </div>)}
      
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
    </div>);
}
