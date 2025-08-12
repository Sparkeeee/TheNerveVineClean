"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Herb {
  id: number;
  name: string;
  slug: string;
  latinName?: string;
}

interface Supplement {
  id: number;
  name: string;
  slug: string;
}

interface QualitySpecification {
  id?: number;
  herbSlug?: string;
  herbName?: string;
  supplementSlug?: string;
  supplementName?: string;
  productType: string;
  formulationName?: string;
  approach?: string;
  requiredTerms: string[];
  preferredTerms: string[];
  avoidTerms: string[];
  standardization?: {
    compound: string;
    percentage: number;
    unit: string;
  };
  alcoholSpecs?: {
    ratio: string;
    organic: boolean;
    type: string[];
  };
  dosageSpecs?: {
    minAmount: number;
    unit: string;
    frequency: string;
  };
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  ratingThreshold: number;
  reviewCountThreshold: number;
  brandPreferences?: string[];
  brandAvoid?: string[];
  notes?: string;
}

export default function QualitySpecificationsPage() {
  const [herbs, setHerbs] = useState<Herb[]>([]);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [selectedHerb, setSelectedHerb] = useState<string>('');
  const [selectedSupplement, setSelectedSupplement] = useState<string>('');
  const [specifications, setSpecifications] = useState<QualitySpecification[]>([]);
  const [editingSpec, setEditingSpec] = useState<QualitySpecification | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState<QualitySpecification>({
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

  const fetchHerbsAndSupplements = async () => {
    setIsLoading(true);
    try {
      // Fetch herbs
      const herbsResponse = await fetch('/api/herbs');
      if (!herbsResponse.ok) {
        throw new Error(`Herbs API responded with status: ${herbsResponse.status}`);
      }
      const herbsData = await herbsResponse.json();
      console.log('Herbs API response:', herbsData); // Debug log
      
      // Handle the response structure: { success: true, data: { herbs: [...], pagination: {...} } }
      const herbsArray = herbsData.data?.herbs || herbsData.herbs || herbsData || [];
      if (!Array.isArray(herbsArray)) {
        console.error('Herbs data is not an array:', herbsArray);
        setHerbs([]);
      } else {
        setHerbs(herbsArray);
      }

      // Fetch supplements
      const supplementsResponse = await fetch('/api/supplements');
      if (!supplementsResponse.ok) {
        throw new Error(`Supplements API responded with status: ${supplementsResponse.status}`);
      }
      const supplementsData = await supplementsResponse.json();
      console.log('Supplements API response:', supplementsData); // Debug log
      
      // Handle the response structure: { success: true, data: { supplements: [...], pagination: {...} } }
      const supplementsArray = supplementsData.data?.supplements || supplementsData.supplements || supplementsData || [];
      if (!Array.isArray(supplementsArray)) {
        console.error('Supplements data is not an array:', supplementsArray);
        setSupplements([]);
      } else {
        setSupplements(supplementsArray);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setHerbs([]); // Set to empty array on error
      setSupplements([]); // Set to empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSpecifications = async () => {
    try {
      const response = await fetch('/api/quality-specifications');
      const data = await response.json();
      setSpecifications(data);
    } catch (error) {
      console.error('Error fetching specifications:', error);
    }
  };

  const handleHerbChange = (herbSlug: string) => {
    setSelectedHerb(herbSlug);
    setSelectedSupplement('');
    const herb = herbs.find(h => h.slug === herbSlug);
    if (herb) {
      setFormData(prev => ({
        ...prev,
        herbSlug: herbSlug,
        herbName: herb.name,
        supplementSlug: undefined,
        supplementName: undefined
      }));
    }
  };

  const handleSupplementChange = (supplementSlug: string) => {
    setSelectedSupplement(supplementSlug);
    setSelectedHerb('');
    const supplement = supplements.find(s => s.slug === supplementSlug);
    if (supplement) {
      setFormData(prev => ({
        ...prev,
        supplementSlug: supplementSlug,
        supplementName: supplement.name,
        herbSlug: undefined,
        herbName: undefined
      }));
    }
  };

  const handleInputChange = (field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayInputChange = (field: string, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [field]: items
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = isEditing 
        ? `/api/quality-specifications/${editingSpec?.id}`
        : '/api/quality-specifications';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchSpecifications();
        resetForm();
        alert(isEditing ? 'Quality specification updated successfully!' : 'Quality specification created successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Failed to save specification'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving specification. Please try again.');
    }
  };

  const handleEdit = (spec: QualitySpecification) => {
    setEditingSpec(spec);
    // Ensure all fields have proper default values to prevent null errors
    setFormData({
      productType: spec.productType || '',
      formulationName: spec.formulationName || '',
      approach: spec.approach || 'traditional',
      requiredTerms: spec.requiredTerms || [],
      preferredTerms: spec.preferredTerms || [],
      avoidTerms: spec.avoidTerms || [],
      standardization: spec.standardization || undefined,
      alcoholSpecs: spec.alcoholSpecs || undefined,
      dosageSpecs: spec.dosageSpecs || undefined,
      priceRange: spec.priceRange || { min: 0, max: 100, currency: 'USD' },
      ratingThreshold: spec.ratingThreshold || 4.0,
      reviewCountThreshold: spec.reviewCountThreshold || 50,
      brandPreferences: spec.brandPreferences || undefined,
      brandAvoid: spec.brandAvoid || undefined,
      herbSlug: spec.herbSlug || '',
      herbName: spec.herbName || '',
      supplementSlug: spec.supplementSlug || '',
      supplementName: spec.supplementName || ''
    });
    setIsEditing(true);
    
    // Set the selected herb/supplement dropdowns
    if (spec.herbSlug) {
      setSelectedHerb(spec.herbSlug);
      setSelectedSupplement('');
    } else if (spec.supplementSlug) {
      setSelectedSupplement(spec.supplementSlug);
      setSelectedHerb('');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this specification?')) {
      try {
        const response = await fetch(`/api/quality-specifications/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          fetchSpecifications();
        }
      } catch (error) {
        console.error('Error deleting specification:', error);
      }
    }
  };

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

      <div className="relative max-w-6xl mx-auto px-6 pt-8 pb-8">
        {/* Hero Section */}
        <div className="rounded-xl p-8 shadow-sm border-2 border-gray-300 mb-8" style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
          <div className="flex items-center justify-between mb-6">
            <Link href="/admin" 
                  className="text-gray-600 hover:text-gray-800 transition-colors">
              <span className="material-symbols-outlined text-2xl">keyboard_backspace</span>
            </Link>
            <h1 className="text-4xl font-bold text-gray-800 flex-1 text-center">Quality Specifications Management</h1>
            <div className="w-10"></div>
          </div>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Define quality criteria for herbs and supplements to ensure only the best products are recommended.
          </p>
        </div>

        {/* Form Section */}
        <div className="rounded-xl p-6 shadow-sm border-2 border-gray-300 mb-8" style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
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
                <select
                  value={selectedHerb}
                  onChange={(e) => handleHerbChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                >
                  <option value="" className="text-gray-900 bg-white">Choose a herb...</option>
                  {!isLoading && Array.isArray(herbs) && herbs.length > 0 ? herbs.map(herb => (
                    <option key={herb.id} value={herb.slug} className="text-gray-900 bg-white">
                      {herb.name} {herb.latinName && `(${herb.latinName})`}
                    </option>
                  )) : (
                    <option value="" className="text-gray-900 bg-white">
                      {isLoading ? 'Loading herbs...' : 'No herbs available'}
                    </option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Supplement
                </label>
                <select
                  value={selectedSupplement}
                  onChange={(e) => handleSupplementChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                >
                  <option value="" className="text-gray-900 bg-white">Choose a supplement...</option>
                  {!isLoading && Array.isArray(supplements) && supplements.length > 0 ? supplements.map(supplement => (
                    <option key={supplement.id} value={supplement.slug} className="text-gray-900 bg-white">
                      {supplement.name}
                    </option>
                  )) : (
                    <option value="" className="text-gray-900 bg-white">
                      {isLoading ? 'Loading supplements...' : 'No supplements available'}
                    </option>
                  )}
                </select>
              </div>
            </div>

            {/* Product Type and Formulation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Type
                </label>
                <select
                  value={formData.productType}
                  onChange={(e) => handleInputChange('productType', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  required
                >
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
                <input
                  type="text"
                  value={formData.formulationName}
                  onChange={(e) => handleInputChange('formulationName', e.target.value)}
                  placeholder="e.g., Strong Traditional Tincture"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Approach
                </label>
                <select
                  value={formData.approach}
                  onChange={(e) => handleInputChange('approach', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                >
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
                <input
                  type="text"
                  value={formData.requiredTerms.join(', ')}
                  onChange={(e) => handleArrayInputChange('requiredTerms', e.target.value)}
                  placeholder="e.g., organic, standardized, extract"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Terms (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.preferredTerms.join(', ')}
                  onChange={(e) => handleArrayInputChange('preferredTerms', e.target.value)}
                  placeholder="e.g., wildcrafted, certified, third-party tested"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avoid Terms (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.avoidTerms.join(', ')}
                  onChange={(e) => handleArrayInputChange('avoidTerms', e.target.value)}
                  placeholder="e.g., proprietary blend, artificial, synthetic"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
                />
              </div>
            </div>

            {/* Standardization */}
            {formData.productType === 'capsule' || formData.productType === 'tablet' || formData.productType === 'extract' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Standardized Compound
                  </label>
                  <input
                    type="text"
                    value={formData.standardization?.compound || ''}
                    onChange={(e) => handleInputChange('standardization', {
                      ...formData.standardization,
                      compound: e.target.value || undefined
                    })}
                    placeholder="e.g., hypericin, withanolides"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Percentage
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.standardization?.percentage?.toString() || ''}
                    onChange={(e) => handleInputChange('standardization', {
                      ...formData.standardization,
                      percentage: e.target.value ? parseFloat(e.target.value) : undefined
                    })}
                    placeholder="e.g., 2.5"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit
                  </label>
                  <select
                    value={formData.standardization?.unit || '%'}
                    onChange={(e) => handleInputChange('standardization', {
                      ...formData.standardization,
                      unit: e.target.value
                    })}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  >
                    <option value="%" className="text-gray-900 bg-white">%</option>
                    <option value="mg" className="text-gray-900 bg-white">mg</option>
                    <option value="mcg" className="text-gray-900 bg-white">mcg</option>
                  </select>
                </div>
              </div>
            ) : null}

            {/* Alcohol Specifications for Tinctures */}
            {formData.productType === 'tincture' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alcohol Ratio
                  </label>
                  <input
                    type="text"
                    value={formData.alcoholSpecs?.ratio || ''}
                    onChange={(e) => handleInputChange('alcoholSpecs', {
                      ...formData.alcoholSpecs,
                      ratio: e.target.value || undefined
                    })}
                    placeholder="e.g., 1:2, 1:1"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organic Alcohol
                  </label>
                  <select
                    value={formData.alcoholSpecs?.organic ? 'true' : 'false'}
                    onChange={(e) => handleInputChange('alcoholSpecs', {
                      ...formData.alcoholSpecs,
                      organic: e.target.value === 'true'
                    })}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  >
                    <option value="true" className="text-gray-900 bg-white">Required</option>
                    <option value="false" className="text-gray-900 bg-white">Optional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alcohol Types (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.alcoholSpecs?.type?.join(', ') || ''}
                    onChange={(e) => handleInputChange('alcoholSpecs', {
                      ...formData.alcoholSpecs,
                      type: e.target.value ? e.target.value.split(',').map(t => t.trim()).filter(t => t) : undefined
                    })}
                    placeholder="e.g., grain alcohol, vodka, brandy"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
                  />
                </div>
              </div>
            ) : null}

            {/* Price and Rating */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Price (USD)
                </label>
                <input
                  type="number"
                  value={formData.priceRange.min || ''}
                  onChange={(e) => handleInputChange('priceRange', {
                    ...formData.priceRange,
                    min: e.target.value ? parseFloat(e.target.value) : 0
                  })}
                  placeholder="e.g., 15"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price (USD)
                </label>
                <input
                  type="number"
                  value={formData.priceRange.max || ''}
                  onChange={(e) => handleInputChange('priceRange', {
                    ...formData.priceRange,
                    max: e.target.value ? parseFloat(e.target.value) : 100
                  })}
                  placeholder="e.g., 50"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Rating
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.ratingThreshold || ''}
                  onChange={(e) => handleInputChange('ratingThreshold', e.target.value ? parseFloat(e.target.value) : 4.0)}
                  placeholder="e.g., 4.0"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Reviews
                </label>
                <input
                  type="number"
                  value={formData.reviewCountThreshold || ''}
                  onChange={(e) => handleInputChange('reviewCountThreshold', e.target.value ? parseInt(e.target.value) : 50)}
                  placeholder="e.g., 100"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
                />
              </div>
            </div>

            {/* Brand Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Brands (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.brandPreferences?.join(', ') || ''}
                  onChange={(e) => handleArrayInputChange('brandPreferences', e.target.value)}
                  placeholder="e.g., Nature's Way, NOW Foods, Gaia Herbs"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brands to Avoid (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.brandAvoid?.join(', ') || ''}
                  onChange={(e) => handleArrayInputChange('brandAvoid', e.target.value)}
                  placeholder="e.g., Generic Brand, Cheap Supplements"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                placeholder="Additional notes about this quality specification..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-all duration-200 font-medium"
              >
                {isEditing ? 'Update Specification' : 'Add Specification'}
              </button>
              
              {isEditing ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition-all duration-200 font-medium"
                >
                  Cancel Edit
                </button>
              ) : (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-400 transition-all duration-200 font-medium"
                >
                  Clear Form
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Specifications List */}
        <div className="rounded-xl p-6 shadow-sm border-2 border-gray-300" style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Quality Specifications</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Formulation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Approach
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Price Range
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(specifications) && specifications.map((spec) => (
                  <tr key={spec.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {spec.herbName || spec.supplementName}
                      </div>
                      <div className="text-sm text-gray-800">
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
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        spec.approach === 'traditional' ? 'bg-green-100 text-green-800' :
                        spec.approach === 'modern' ? 'bg-purple-100 text-purple-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {spec.approach}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${spec.priceRange.min} - ${spec.priceRange.max}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(spec)}
                        className="text-blue-600 hover:text-blue-900 mr-2 transition-all duration-200"
                        title="Edit specification"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          alert(`Quality Specification Details:\n\n` +
                            `Product: ${spec.herbName || spec.supplementName}\n` +
                            `Type: ${spec.productType}\n` +
                            `Formulation: ${spec.formulationName}\n` +
                            `Approach: ${spec.approach}\n` +
                            `Required Terms: ${spec.requiredTerms.join(', ')}\n` +
                            `Preferred Terms: ${spec.preferredTerms.join(', ')}\n` +
                            `Avoid Terms: ${spec.avoidTerms.join(', ')}\n` +
                            `Price Range: $${spec.priceRange.min} - $${spec.priceRange.max}\n` +
                            `Rating Threshold: ${spec.ratingThreshold}+\n` +
                            `Review Count: ${spec.reviewCountThreshold}+`
                          );
                        }}
                        className="text-green-600 hover:text-green-900 mr-2 transition-all duration-200"
                        title="View details"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(spec.id!)}
                        className="text-red-600 hover:text-red-900 transition-all duration-200"
                        title="Delete specification"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex gap-4">
          <Link
            href="/admin"
            className="inline-flex items-center px-6 py-3 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-gray-400 hover:text-gray-600 hover:shadow-gray-300 hover:shadow-lg hover:scale-105"
          >
            Back to Admin
          </Link>
          <Link
            href="/admin/product-hunt"
            className="inline-flex items-center px-6 py-3 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-gray-400 hover:text-gray-600 hover:shadow-gray-300 hover:shadow-lg hover:scale-105"
          >
            Product Hunt Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
} 