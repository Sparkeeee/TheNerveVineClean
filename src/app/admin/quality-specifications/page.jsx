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
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
export default function QualitySpecificationsPage() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const [herbs, setHerbs] = useState([]);
    const [supplements, setSupplements] = useState([]);
    const [selectedHerb, setSelectedHerb] = useState('');
    const [selectedSupplement, setSelectedSupplement] = useState('');
    const [specifications, setSpecifications] = useState([]);
    const [editingSpec, setEditingSpec] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    // Form state
    const [formData, setFormData] = useState({
        productType: '',
        formulationName: '',
        approach: 'traditional',
        requiredTerms: [],
        preferredTerms: [],
        avoidTerms: [],
        priceRange: { min: 0, max: 100, currency: 'USD' },
        ratingThreshold: 4.0,
        reviewCountThreshold: 50
    });
    useEffect(() => {
        fetchHerbsAndSupplements();
        fetchSpecifications();
    }, []);
    const fetchHerbsAndSupplements = () => __awaiter(this, void 0, void 0, function* () {
        try {
            // Fetch herbs
            const herbsResponse = yield fetch('/api/herbs');
            const herbsData = yield herbsResponse.json();
            setHerbs(herbsData);
            // Fetch supplements
            const supplementsResponse = yield fetch('/api/supplements');
            const supplementsData = yield supplementsResponse.json();
            setSupplements(supplementsData);
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
    });
    const fetchSpecifications = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('/api/quality-specifications');
            const data = yield response.json();
            setSpecifications(data);
        }
        catch (error) {
            console.error('Error fetching specifications:', error);
        }
    });
    const handleHerbChange = (herbSlug) => {
        setSelectedHerb(herbSlug);
        setSelectedSupplement('');
        const herb = herbs.find(h => h.slug === herbSlug);
        if (herb) {
            setFormData(prev => (Object.assign(Object.assign({}, prev), { herbSlug: herbSlug, herbName: herb.name, supplementSlug: undefined, supplementName: undefined })));
        }
    };
    const handleSupplementChange = (supplementSlug) => {
        setSelectedSupplement(supplementSlug);
        setSelectedHerb('');
        const supplement = supplements.find(s => s.slug === supplementSlug);
        if (supplement) {
            setFormData(prev => (Object.assign(Object.assign({}, prev), { supplementSlug: supplementSlug, supplementName: supplement.name, herbSlug: undefined, herbName: undefined })));
        }
    };
    const handleInputChange = (field, value) => {
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [field]: value })));
    };
    const handleArrayInputChange = (field, value) => {
        const items = value.split(',').map(item => item.trim()).filter(item => item);
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [field]: items })));
    };
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        try {
            const url = isEditing
                ? `/api/quality-specifications/${editingSpec === null || editingSpec === void 0 ? void 0 : editingSpec.id}`
                : '/api/quality-specifications';
            const method = isEditing ? 'PUT' : 'POST';
            const response = yield fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                fetchSpecifications();
                resetForm();
            }
            else {
                console.error('Error saving specification');
            }
        }
        catch (error) {
            console.error('Error:', error);
        }
    });
    const handleEdit = (spec) => {
        setEditingSpec(spec);
        setFormData(spec);
        setIsEditing(true);
    };
    const handleDelete = (id) => __awaiter(this, void 0, void 0, function* () {
        if (confirm('Are you sure you want to delete this specification?')) {
            try {
                const response = yield fetch(`/api/quality-specifications/${id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    fetchSpecifications();
                }
            }
            catch (error) {
                console.error('Error deleting specification:', error);
            }
        }
    });
    const resetForm = () => {
        setFormData({
            productType: '',
            formulationName: '',
            approach: 'traditional',
            requiredTerms: [],
            preferredTerms: [],
            avoidTerms: [],
            priceRange: { min: 0, max: 100, currency: 'USD' },
            ratingThreshold: 4.0,
            reviewCountThreshold: 50
        });
        setEditingSpec(null);
        setIsEditing(false);
        setSelectedHerb('');
        setSelectedSupplement('');
    };
    return (<div className="min-h-screen p-6 relative" style={{
            backgroundImage: "url('/images/CapSize.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        }}>
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-white/50 pointer-events-none"/>
      <div className="relative max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quality Specifications Management
          </h1>
          <p className="text-gray-600">
            Define quality criteria for herbs and supplements to ensure only the best products are recommended.
          </p>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-extrabold mb-4 text-gray-800 tracking-tight drop-shadow">
            {isEditing ? 'Edit Quality Specification' : 'Add New Quality Specification'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Herb/Supplement Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Herb
                </label>
                <select value={selectedHerb} onChange={(e) => handleHerbChange(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white">
                  <option value="" className="text-gray-900 bg-white">Choose a herb...</option>
                  {herbs.map(herb => (<option key={herb.id} value={herb.slug} className="text-gray-900 bg-white">
                      {herb.name} {herb.latinName && `(${herb.latinName})`}
                    </option>))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Supplement
                </label>
                <select value={selectedSupplement} onChange={(e) => handleSupplementChange(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white">
                  <option value="" className="text-gray-900 bg-white">Choose a supplement...</option>
                  {supplements.map(supplement => (<option key={supplement.id} value={supplement.slug} className="text-gray-900 bg-white">
                      {supplement.name}
                    </option>))}
                </select>
              </div>
            </div>

            {/* Product Type and Formulation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Type
                </label>
                <select value={formData.productType} onChange={(e) => handleInputChange('productType', e.target.value)} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white" required>
                  <option value="" className="text-gray-900 bg-white">Select type...</option>
                  <option value="tincture" className="text-gray-900 bg-white">Tincture</option>
                  <option value="capsule" className="text-gray-900 bg-white">Capsule</option>
                  <option value="tablet" className="text-gray-900 bg-white">Tablet</option>
                  <option value="powder" className="text-gray-900 bg-white">Powder</option>
                  <option value="tea" className="text-gray-900 bg-white">Tea</option>
                  <option value="extract" className="text-gray-900 bg-white">Extract</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Formulation Name
                </label>
                                  <input type="text" value={formData.formulationName} onChange={(e) => handleInputChange('formulationName', e.target.value)} placeholder="e.g., Strong Traditional Tincture" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500" required/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Approach
                </label>
                <select value={formData.approach} onChange={(e) => handleInputChange('approach', e.target.value)} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white">
                  <option value="traditional" className="text-gray-900 bg-white">Traditional</option>
                  <option value="modern" className="text-gray-900 bg-white">Modern</option>
                  <option value="both" className="text-gray-900 bg-white">Both</option>
                </select>
              </div>
            </div>

            {/* Terms */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Terms (comma-separated)
                </label>
                                  <input type="text" value={formData.requiredTerms.join(', ')} onChange={(e) => handleArrayInputChange('requiredTerms', e.target.value)} placeholder="e.g., organic, standardized, extract" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Terms (comma-separated)
                </label>
                                  <input type="text" value={formData.preferredTerms.join(', ')} onChange={(e) => handleArrayInputChange('preferredTerms', e.target.value)} placeholder="e.g., wildcrafted, certified, third-party tested" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avoid Terms (comma-separated)
                </label>
                                  <input type="text" value={formData.avoidTerms.join(', ')} onChange={(e) => handleArrayInputChange('avoidTerms', e.target.value)} placeholder="e.g., proprietary blend, artificial, synthetic" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"/>
              </div>
            </div>

            {/* Standardization */}
            {formData.productType === 'capsule' || formData.productType === 'tablet' || formData.productType === 'extract' ? (<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Standardized Compound
                  </label>
                  <input type="text" value={((_a = formData.standardization) === null || _a === void 0 ? void 0 : _a.compound) || ''} onChange={(e) => handleInputChange('standardization', Object.assign(Object.assign({}, formData.standardization), { compound: e.target.value }))} placeholder="e.g., hypericin, withanolides" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"/>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Percentage
                  </label>
                  <input type="number" step="0.1" value={((_b = formData.standardization) === null || _b === void 0 ? void 0 : _b.percentage) || ''} onChange={(e) => handleInputChange('standardization', Object.assign(Object.assign({}, formData.standardization), { percentage: parseFloat(e.target.value) }))} placeholder="e.g., 2.5" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"/>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit
                  </label>
                  <select value={((_c = formData.standardization) === null || _c === void 0 ? void 0 : _c.unit) || '%'} onChange={(e) => handleInputChange('standardization', Object.assign(Object.assign({}, formData.standardization), { unit: e.target.value }))} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white">
                    <option value="%" className="text-gray-900 bg-white">%</option>
                    <option value="mg" className="text-gray-900 bg-white">mg</option>
                    <option value="mcg" className="text-gray-900 bg-white">mcg</option>
                  </select>
                </div>
              </div>) : null}

            {/* Alcohol Specifications for Tinctures */}
            {formData.productType === 'tincture' ? (<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alcohol Ratio
                  </label>
                  <input type="text" value={((_d = formData.alcoholSpecs) === null || _d === void 0 ? void 0 : _d.ratio) || ''} onChange={(e) => handleInputChange('alcoholSpecs', Object.assign(Object.assign({}, formData.alcoholSpecs), { ratio: e.target.value }))} placeholder="e.g., 1:2, 1:1" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"/>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organic Alcohol
                  </label>
                  <select value={((_e = formData.alcoholSpecs) === null || _e === void 0 ? void 0 : _e.organic) ? 'true' : 'false'} onChange={(e) => handleInputChange('alcoholSpecs', Object.assign(Object.assign({}, formData.alcoholSpecs), { organic: e.target.value === 'true' }))} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white">
                    <option value="true" className="text-gray-900 bg-white">Required</option>
                    <option value="false" className="text-gray-900 bg-white">Optional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alcohol Types (comma-separated)
                  </label>
                  <input type="text" value={((_g = (_f = formData.alcoholSpecs) === null || _f === void 0 ? void 0 : _f.type) === null || _g === void 0 ? void 0 : _g.join(', ')) || ''} onChange={(e) => handleInputChange('alcoholSpecs', Object.assign(Object.assign({}, formData.alcoholSpecs), { type: e.target.value.split(',').map(t => t.trim()).filter(t => t) }))} placeholder="e.g., grain alcohol, vodka, brandy" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"/>
                </div>
              </div>) : null}

            {/* Price and Rating */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Price (USD)
                </label>
                <input type="number" value={formData.priceRange.min} onChange={(e) => handleInputChange('priceRange', Object.assign(Object.assign({}, formData.priceRange), { min: parseFloat(e.target.value) }))} placeholder="e.g., 15" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price (USD)
                </label>
                <input type="number" value={formData.priceRange.max} onChange={(e) => handleInputChange('priceRange', Object.assign(Object.assign({}, formData.priceRange), { max: parseFloat(e.target.value) }))} placeholder="e.g., 50" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Rating
                </label>
                <input type="number" step="0.1" min="0" max="5" value={formData.ratingThreshold} onChange={(e) => handleInputChange('ratingThreshold', parseFloat(e.target.value))} placeholder="e.g., 4.0" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Reviews
                </label>
                <input type="number" value={formData.reviewCountThreshold} onChange={(e) => handleInputChange('reviewCountThreshold', parseInt(e.target.value))} placeholder="e.g., 100" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"/>
              </div>
            </div>

            {/* Brand Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Brands (comma-separated)
                </label>
                <input type="text" value={((_h = formData.brandPreferences) === null || _h === void 0 ? void 0 : _h.join(', ')) || ''} onChange={(e) => handleArrayInputChange('brandPreferences', e.target.value)} placeholder="e.g., Nature's Way, NOW Foods, Gaia Herbs" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brands to Avoid (comma-separated)
                </label>
                <input type="text" value={((_j = formData.brandAvoid) === null || _j === void 0 ? void 0 : _j.join(', ')) || ''} onChange={(e) => handleArrayInputChange('brandAvoid', e.target.value)} placeholder="e.g., Generic Brand, Cheap Supplements" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"/>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea value={formData.notes || ''} onChange={(e) => handleInputChange('notes', e.target.value)} rows={3} placeholder="Additional notes about this quality specification..." className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"/>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition font-medium">
                {isEditing ? 'Update Specification' : 'Add Specification'}
              </button>
              
              {isEditing && (<button type="button" onClick={resetForm} className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition font-medium">
                  Cancel Edit
                </button>)}
            </div>
          </form>
        </div>

        {/* Specifications List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quality Specifications</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Formulation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Approach
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price Range
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {specifications.map((spec) => (<tr key={spec.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {spec.herbName || spec.supplementName}
                      </div>
                      <div className="text-sm text-gray-600">
                        {spec.herbSlug || spec.supplementSlug}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {spec.productType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {spec.formulationName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${spec.approach === 'traditional' ? 'bg-green-100 text-green-800' :
                spec.approach === 'modern' ? 'bg-purple-100 text-purple-800' :
                    'bg-yellow-100 text-yellow-800'}`}>
                        {spec.approach}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${spec.priceRange.min} - ${spec.priceRange.max}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => handleEdit(spec)} className="text-blue-600 hover:text-blue-900 mr-4">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(spec.id)} className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex gap-4">
          <Link href="/admin" className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition font-medium">
            Back to Admin
          </Link>
          <Link href="/admin/product-hunt" className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition font-medium">
            Product Hunt Dashboard
          </Link>
        </div>
      </div>
    </div>);
}
