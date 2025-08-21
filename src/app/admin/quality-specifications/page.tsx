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
  // New fields for formulation-based system
  herbId?: number;
  supplementId?: number;
  formulationTypeId?: number;
  standardised?: boolean;
  customSpecs?: string;
  updatedAt?: Date;
  // Relations
  formulationType?: {
    id: number;
    name: string;
    category: string;
  };
  herb?: {
    id: number;
    name: string;
    slug: string;
  };
  supplement?: {
    id: number;
    name: string;
    slug: string;
  };
}

export default function QualitySpecificationsPage() {
  const [herbs, setHerbs] = useState<Herb[]>([]);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [specifications, setSpecifications] = useState<QualitySpecification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form state for new formulation-based system
  const [selectedHerbId, setSelectedHerbId] = useState<number | ''>('');
  const [selectedSupplementId, setSelectedSupplementId] = useState<number | ''>('');
  const [selectedFormulationTypeId, setSelectedFormulationTypeId] = useState<number | ''>('');
  const [approach, setApproach] = useState('traditional');
  const [standardised, setStandardised] = useState(false);
  const [customSpecs, setCustomSpecs] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [herbUsedFormulations, setHerbUsedFormulations] = useState<any[]>([]);
  const [formulationTypes, setFormulationTypes] = useState<any[]>([]);
  const [customQualitySpec, setCustomQualitySpec] = useState<any>(null);
  
  // CRUD state
  const [isEditing, setIsEditing] = useState(false);
  const [editingSpecId, setEditingSpecId] = useState<number | null>(null);
  const [viewingSpecId, setViewingSpecId] = useState<number | null>(null);

  useEffect(() => {
    fetchHerbsAndSupplements();
    fetchSpecifications();
    fetchFormulationTypes();
  }, []);

  // Debug: Log when specifications change
  useEffect(() => {
    console.log('🔄 Specifications state changed:', specifications);
    console.log('🔄 Specifications length:', specifications?.length);
  }, [specifications]);

  useEffect(() => {
    if (selectedHerbId || selectedSupplementId) {
      fetchHerbUsedFormulations();
    }
  }, [selectedHerbId, selectedSupplementId]);

  // Debug: Log when herbUsedFormulations changes
  useEffect(() => {
    // State is working correctly, no need for debug logs
  }, [herbUsedFormulations]);

  useEffect(() => {
    if (selectedFormulationTypeId && formulationTypes.length > 0) {
      const type = formulationTypes.find(t => t.id === parseInt(selectedFormulationTypeId.toString()));
      if (type) {
        const template = JSON.parse(type.template);
        setSelectedTemplate(template);
      }
    }
  }, [selectedFormulationTypeId, formulationTypes]);

  // Fetch custom quality specs when formulation type is selected
  useEffect(() => {
    if (selectedFormulationTypeId && (selectedHerbId || selectedSupplementId)) {
      fetchCustomQualitySpec();
    } else {
      setCustomQualitySpec(null);
    }
  }, [selectedFormulationTypeId, selectedHerbId, selectedSupplementId]);

  const fetchHerbsAndSupplements = async () => {
    setIsLoading(true);
    try {
      // Fetch herbs
      const herbsResponse = await fetch('/api/herbs');
      if (!herbsResponse.ok) {
        throw new Error(`Herbs API responded with status: ${herbsResponse.status}`);
      }
      const herbsData = await herbsResponse.json();
      
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
      console.log('🔍 Fetching specifications...');
      const response = await fetch('/api/quality-specs');
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      
      if (!response.ok) {
        console.error('❌ Response not ok:', response.status, response.statusText);
        return;
      }
      
      const data = await response.json();
      console.log('📊 Specifications data:', data);
      console.log('📊 Number of specs:', data.length);
      console.log('📊 Data type:', typeof data);
      console.log('📊 Is array:', Array.isArray(data));
      
      if (data.length > 0) {
        console.log('📋 First spec:', data[0]);
        console.log('🔑 First spec ID:', data[0].id);
        console.log('🔑 First spec herb:', data[0].herb);
        console.log('🔑 First spec supplement:', data[0].supplement);
        console.log('🔑 First spec formulationType:', data[0].formulationType);
      }
      
      setSpecifications(data);
    } catch (error) {
      console.error('❌ Error fetching specifications:', error);
    }
  };

  const fetchFormulationTypes = async () => {
    try {
      const response = await fetch('/api/formulation-types');
      if (response.ok) {
        const data = await response.json();
        setFormulationTypes(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching formulation types:', error);
    }
  };

  const fetchHerbUsedFormulations = async () => {
    try {
      const targetId = selectedHerbId || selectedSupplementId;
      const targetType = selectedHerbId ? 'herb' : 'supplement';
      
      console.log('🔍 Fetching herb used formulations for:', targetType, targetId);
      
      // Get the slug for the selected herb/supplement
      let targetSlug = '';
      if (selectedHerbId) {
        const herb = herbs.find(h => h.id === selectedHerbId);
        targetSlug = herb?.slug || '';
      } else if (selectedSupplementId) {
        const supplement = supplements.find(s => s.id === selectedSupplementId);
        targetSlug = supplement?.slug || '';
      }
      
      console.log('🔍 Target slug:', targetSlug);
      
      // Query by slug instead of ID since existing specs use slug-based storage
      const response = await fetch(`/api/quality-specs?${targetType}Slug=${targetSlug}`);
      console.log('📡 Herb formulations response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Herb formulations data:', data);
        setHerbUsedFormulations(data);
      } else {
        console.error('❌ Herb formulations response not ok:', response.status);
      }
    } catch (error) {
      console.error('❌ Error fetching herb formulations:', error);
    }
  };

  const fetchCustomQualitySpec = async () => {
    if (!selectedFormulationTypeId || (!selectedHerbId && !selectedSupplementId)) {
      return;
    }
    
    try {
      const params = new URLSearchParams();
      if (selectedHerbId) {
        const herbSlug = herbs.find(h => h.id === selectedHerbId)?.slug || '';
        params.append('herbSlug', herbSlug);
      }
      if (selectedSupplementId) {
        const supplementSlug = supplements.find(s => s.id === selectedSupplementId)?.slug || '';
        params.append('supplementSlug', supplementSlug);
      }
      params.append('formulationTypeId', selectedFormulationTypeId.toString());
      
      const url = `/api/quality-specs?${params}`;
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setCustomQualitySpec(data[0]);
        } else {
          setCustomQualitySpec(null);
        }
      }
    } catch (error) {
      console.error('Error fetching custom quality spec:', error);
    }
  };

  const handleHerbChange = (herbId: number) => {
    setSelectedHerbId(herbId);
    setSelectedSupplementId('');
    setSelectedFormulationTypeId(''); // Clear formulation type when switching
  };

  const handleSupplementChange = (supplementId: number) => {
    setSelectedSupplementId(supplementId);
    setSelectedHerbId('');
    setSelectedFormulationTypeId(''); // Clear formulation type when switching
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const specData = {
        herbId: selectedHerbId || null,
        supplementId: selectedSupplementId || null,
        formulationTypeId: parseInt(selectedFormulationTypeId.toString()),
        standardised,
        customSpecs: customSpecs || null,
        approach,
        notes: notes || null
      };

      const response = await fetch('/api/quality-specs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(specData)
      });

      if (response.ok) {
        fetchSpecifications();
        resetForm();
        alert('Quality specification saved successfully!');
      } else {
        alert('Error saving quality specification');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form');
    }
  };

  const resetForm = () => {
    setSelectedHerbId('');
    setSelectedSupplementId('');
    setSelectedFormulationTypeId('');
    setApproach('traditional');
    setStandardised(false);
    setCustomSpecs('');
    setNotes('');
    setSelectedTemplate(null);
    setIsEditing(false);
    setEditingSpecId(null);
    setViewingSpecId(null);
  };

  const handleEdit = (spec: any) => {
    console.log('🔧 Editing spec:', spec);
    
    // Set the viewing spec ID so we know which spec to update
    setViewingSpecId(spec.id);
    
    // Populate form with existing data
    if (spec.herbSlug) {
      // Find the herb by slug to get its ID
      const herb = herbs.find(h => h.slug === spec.herbSlug);
      if (herb) {
        setSelectedHerbId(herb.id);
        setSelectedSupplementId('');
      }
    } else if (spec.supplementSlug) {
      // Find the supplement by slug to get its ID
      const supplement = supplements.find(s => s.slug === spec.supplementSlug);
      if (supplement) {
        setSelectedSupplementId(supplement.id);
        setSelectedHerbId('');
      }
    }
    
    setSelectedFormulationTypeId(spec.formulationTypeId || '');
    setApproach(spec.approach || 'traditional');
    setStandardised(spec.standardised || false);
    setCustomSpecs(spec.customSpecs || '');
    setNotes(spec.notes || '');
    
    console.log('🔧 Form populated for editing - viewingSpecId set to:', spec.id);
  };

  const handleDelete = async (specId: number) => {
    if (!confirm('Are you sure you want to delete this quality specification?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/quality-specs/${specId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchSpecifications();
        alert('Quality specification deleted successfully!');
      } else {
        alert('Error deleting quality specification');
      }
    } catch (error) {
      console.error('Error deleting spec:', error);
      alert('Error deleting quality specification');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingSpecId) return;
    
    try {
      const specData = {
        herbId: selectedHerbId || null,
        supplementId: selectedSupplementId || null,
        formulationTypeId: parseInt(selectedFormulationTypeId.toString()),
        standardised,
        customSpecs: customSpecs || null,
        approach,
        notes: notes || null
      };

      const response = await fetch(`/api/quality-specs/${editingSpecId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(specData)
      });

      if (response.ok) {
        fetchSpecifications();
        resetForm();
        alert('Quality specification updated successfully!');
      } else {
        alert('Error updating quality specification');
      }
    } catch (error) {
      console.error('Error updating spec:', error);
      alert('Error updating quality specification');
    }
  };

  const showStandardisedToggle = selectedFormulationTypeId && 
    ['Capsules/Tablets', 'Standardized Extracts'].includes(
      formulationTypes.find(t => t.id === parseInt(selectedFormulationTypeId.toString()))?.name || ''
    );

  // Filter formulation types based on selection
  const getFilteredFormulationTypes = () => {
    if (selectedSupplementId) {
      // Supplements: only show basic supplement templates (capsules/tablets and powder)
      return formulationTypes.filter(type => 
        type.name === 'Supplement Capsules/Tablets' || 
        type.name === 'Supplement Powder'
      );
    } else if (selectedHerbId) {
      // Herbs: only show traditional herb templates (exclude Standardized Extracts and supplement ones)
      return formulationTypes.filter(type => 
        !type.name.startsWith('Supplement') && 
        type.name !== 'Standardized Extracts'
      );
    } else {
      // Nothing selected: show all types
      return formulationTypes;
    }
  };

  const handleSaveChanges = async () => {
    if (!viewingSpecId) {
      console.error('❌ No viewingSpecId set for update');
      return;
    }

    console.log('💾 Starting update for spec ID:', viewingSpecId);

    try {
      const specData = {
        herbId: selectedHerbId || null,
        supplementId: selectedSupplementId || null,
        formulationTypeId: parseInt(selectedFormulationTypeId.toString()),
        standardised,
        customSpecs: customSpecs || null,
        approach,
        notes: notes || null
      };

      console.log('💾 Update data:', specData);

      const response = await fetch(`/api/quality-specs/${viewingSpecId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(specData)
      });

      if (response.ok) {
        console.log('✅ Update successful');
        fetchSpecifications();
        resetForm();
        alert('Quality specification updated successfully!');
      } else {
        console.error('❌ Update failed:', response.status);
        alert('Error updating quality specification');
      }
    } catch (error) {
      console.error('❌ Error updating spec:', error);
      alert('Error updating quality specification');
    }
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
          
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {/* This Herb's Used Formulations */}
            {(selectedHerbId || selectedSupplementId) && (
              <div className="p-4 bg-blue-50 rounded-lg border">
                <h3 className="text-lg font-semibold text-black mb-3">
                  This {selectedHerbId ? 'Herb' : 'Supplement'}&apos;s Existing Specifications
                </h3>
                
                {herbUsedFormulations.length > 0 ? (
                  <div className="space-y-2">
                    {herbUsedFormulations.map((spec) => {
                      const type = formulationTypes.find(t => t.id === spec.formulationTypeId);
                      return (
                        <div key={spec.id} className="p-3 bg-white rounded border">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-black">{type?.name || 'Unknown Type'}</span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(spec)}
                                className="text-blue-600 hover:text-blue-900 transition-all duration-200 px-3 py-1 rounded border border-blue-300 hover:bg-blue-50 text-sm font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => spec.id && handleDelete(spec.id)}
                                className="text-red-600 hover:text-red-900 transition-all duration-200 px-3 py-1 rounded border border-red-300 hover:bg-red-50 text-sm font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          
                          {/* Spec Details */}
                          <div className="space-y-1 text-sm text-black">
                            <div><strong>Approach:</strong> {spec.approach || 'N/A'}</div>
                            <div><strong>Standardised:</strong> {spec.standardised ? 'Yes' : 'No'}</div>
                            {spec.customSpecs && (
                              <div><strong>Strength & Specs:</strong> {spec.customSpecs}</div>
                            )}
                            {spec.notes && (
                              <div><strong>Notes:</strong> {spec.notes}</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-black">No existing specifications found for this {selectedHerbId ? 'herb' : 'supplement'}.</p>
                )}
              </div>
            )}

            {/* Herb/Supplement Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Herb
                </label>
                <select
                  value={selectedHerbId}
                  onChange={(e) => handleHerbChange(parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                >
                  <option value="">Choose a herb...</option>
                  {!isLoading && Array.isArray(herbs) && herbs.length > 0 ? herbs.map(herb => (
                    <option key={herb.id} value={herb.id} className="text-gray-900 bg-white">
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
                  value={selectedSupplementId}
                  onChange={(e) => handleSupplementChange(parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                >
                  <option value="" className="text-gray-900 bg-white">Choose a supplement...</option>
                  {!isLoading && Array.isArray(supplements) && supplements.length > 0 ? supplements.map(supplement => (
                    <option key={supplement.id} value={supplement.id} className="text-gray-900 bg-white">
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

            {/* Formulation Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formulation Type
              </label>
              <select
                value={selectedFormulationTypeId}
                onChange={(e) => setSelectedFormulationTypeId(e.target.value === '' ? '' : parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              >
                <option value="">Choose a formulation type...</option>
                {getFilteredFormulationTypes().map(type => (
                  <option key={type.id} value={type.id} className="text-gray-900 bg-white">
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Approach Selection - Only show for herbs */}
            {selectedHerbId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Approach
                </label>
                <select
                  value={approach}
                  onChange={(e) => setApproach(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                >
                  <option value="traditional">Traditional</option>
                  <option value="modern">Modern</option>
                </select>
              </div>
            )}

            {/* Standardised Toggle */}
            {showStandardisedToggle && (
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={standardised}
                    onChange={(e) => setStandardised(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Standardised Extract
                  </span>
                </label>
              </div>
            )}

            {/* Custom Specifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Strength & Specifications
              </label>
              <input
                type="text"
                value={customSpecs}
                onChange={(e) => setCustomSpecs(e.target.value)}
                placeholder="e.g., minimum 500mg, DGL (use low, high values based on bioavailability)"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Additional quality notes..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              {/* Add Specification button - only show when NOT viewing existing spec */}
              {!viewingSpecId && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-all duration-200 font-medium"
                >
                  Add Specification
                </button>
              )}
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-400 transition-all duration-200 font-medium"
              >
                Clear Form
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-yellow-500 text-white px-6 py-3 rounded-md hover:bg-yellow-600 transition-all duration-200 font-medium"
                >
                  Cancel Edit
                </button>
              )}
              {/* Save Changes button for when form is populated with existing data */}
              {viewingSpecId && (
                <button
                  type="button"
                  onClick={() => {
                    console.log('💾 Save Changes clicked!');
                    console.log('💾 viewingSpecId:', viewingSpecId);
                    console.log('💾 selectedHerbId:', selectedHerbId);
                    console.log('💾 selectedSupplementId:', selectedSupplementId);
                    console.log('💾 selectedFormulationTypeId:', selectedFormulationTypeId);
                    handleSaveChanges();
                  }}
                  className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-all duration-200 font-medium"
                >
                  Save Changes
                </button>
              )}
              
              {/* Debug info for button visibility */}
              {viewingSpecId && (
                <div className="text-xs text-gray-500 mt-2">
                  Debug: viewingSpecId={viewingSpecId}, 
                  selectedHerbId={selectedHerbId}, 
                  selectedSupplementId={selectedSupplementId}, 
                  selectedFormulationTypeId={selectedFormulationTypeId}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Existing Specifications Table */}
        <div className="rounded-xl p-6 shadow-sm border-2 border-gray-300 mb-8" style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
          <h2 className="text-2xl font-extrabold mb-6 text-gray-800 tracking-tight drop-shadow">
            Existing Quality Specifications ({specifications.length})
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Formulation Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Standardised
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Approach
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(specifications) && specifications.map((spec) => {
                  return (
                  <tr key={spec.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-black">
                        {spec.herbName || spec.supplementName || 'N/A'}
                      </div>
                      <div className="text-sm text-black">
                        {spec.herbSlug || spec.supplementSlug || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-black">
                        {spec.formulationType?.name || spec.formulationName || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      {spec.standardised ? 'Yes' : 'No'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-black">
                      {spec.approach || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black max-w-xs">
                      <div className="truncate" title={spec.notes || 'No notes'}>
                        {spec.notes || 'No notes'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(spec)}
                          className="text-blue-600 hover:text-blue-900 transition-all duration-200 px-2 py-1 rounded border border-blue-300 hover:bg-blue-50 text-black font-medium"
                          title="Edit specification"
                        >
                          Edit (ID: {spec.id})
                        </button>
                        <button
                          onClick={() => spec.id && handleDelete(spec.id)}
                          className="text-red-600 hover:text-red-900 transition-all duration-200 px-2 py-1 rounded border border-red-300 hover:bg-red-50 text-black font-medium"
                          title="Delete specification"
                        >
                          Delete (ID: {spec.id})
                        </button>
                      </div>
                    </td>
                  </tr>
                )})}
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