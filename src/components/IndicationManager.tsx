'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface Herb {
  id: number;
  name: string;
  latinName?: string;
  slug: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  heroImageUrl?: string;
  cardImageUrl?: string;
  galleryImages?: string[];
  cautions?: string;
  productFormulations?: Array<{
    type: string;
    qualityCriteria: string;
    tags: string[];
    affiliateLink: string;
    price: string;
  }>;
  references?: Array<{
    type: string;
    value: string;
  }>;
  traditionalUses?: string[];
}

interface Supplement {
  id: number;
  name: string;
  slug: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  heroImageUrl?: string;
  cardImageUrl?: string;
  galleryImages?: string[];
  cautions?: string;
  productFormulations?: Array<{
    type: string;
    qualityCriteria: string;
    tags: string[];
    affiliateLink: string;
    price: string;
  }>;
  references?: Array<{
    type: string;
    value: string;
  }>;
  traditionalUses?: string[];
}



interface EvidenceScore {
  id?: number;
  traditionalScore: number;
  researchScore: number;
  totalScore: number;
  notes?: string;
}

interface IndicationManagerProps {
  isOpen: boolean;
  onClose: () => void;
  symptomId?: number;
  variantId?: number;
  symptomTitle?: string;
  variantName?: string;
}



export default function IndicationManager({ 
  isOpen, 
  onClose, 
  symptomId, 
  variantId, 
  symptomTitle, 
  variantName 
}: IndicationManagerProps) {
  const [activeTab, setActiveTab] = useState<'herbs' | 'supplements'>('herbs');
  const [herbs, setHerbs] = useState<Herb[]>([]);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [selectedHerbs, setSelectedHerbs] = useState<number[]>([]);
  const [selectedSupplements, setSelectedSupplements] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Evidence scoring state
  const [evidenceScores, setEvidenceScores] = useState<Record<number, EvidenceScore>>({});
  const [showScoring, setShowScoring] = useState(false);

  const targetId = variantId || symptomId;
  const targetType = variantId ? 'variant' : 'symptom';
  const targetName = variantName || symptomTitle;

  // Debug logging
  console.log('🔍 IndicationManager props:', {
    variantId,
    symptomId,
    variantName,
    symptomTitle,
    targetId,
    targetType,
    targetName
  });

  useEffect(() => {
    if (isOpen && targetId) {
      console.log(`🚀 IndicationManager opened for:`, {
        targetId,
        targetType,
        targetName,
        isVariant: !!variantId
      });
      fetchAvailableItems();
      fetchCurrentIndications();
    }
  }, [isOpen, targetId, targetType, targetName, variantId, fetchAvailableItems, fetchCurrentIndications]);

  const fetchAvailableItems = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all available herbs and supplements
      const [herbsResponse, supplementsResponse] = await Promise.all([
        fetch('/api/herbs'),
        fetch('/api/supplements')
      ]);

      if (herbsResponse.ok) {
        const herbsData = await herbsResponse.json();
        console.log('Herbs API response:', herbsData);
        // Handle different response structures
        if (herbsData.data && herbsData.data.herbs) {
          setHerbs(herbsData.data.herbs);
        } else if (herbsData.herbs) {
          setHerbs(herbsData.herbs);
        } else if (Array.isArray(herbsData)) {
          setHerbs(herbsData);
        } else {
          console.warn('Unexpected herbs response structure:', herbsData);
          setHerbs([]);
        }
      }

      if (supplementsResponse.ok) {
        const supplementsData = await supplementsResponse.json();
        console.log('Supplements API response:', supplementsData);
        // Handle different response structures
        if (supplementsData.data && supplementsData.data.supplements) {
          setSupplements(supplementsData.data.supplements);
        } else if (supplementsData.supplements) {
          setSupplements(supplementsData.supplements);
        } else if (Array.isArray(supplementsData)) {
          setSupplements(supplementsData);
        } else {
          console.warn('Unexpected supplements response structure:', supplementsData);
          setSupplements([]);
        }
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCurrentIndications = useCallback(async () => {
    if (!targetId) return;
    
    try {
      console.log(`🔍 Fetching current indications for ${targetType} ${targetId}...`);
      
      // Add targetType parameter to distinguish between symptoms and variants
      const url = `/api/symptoms/${targetId}/indications?targetType=${targetType}`;
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url);
      if (response.ok) {
        const result = await response.json();
        console.log('Current indications API response:', result);
        
        if (result.success && result.data) {
          // Handle the API response format: { success: true, data: { herbs, supplements } }
          if (result.data.herbs && Array.isArray(result.data.herbs)) {
            const herbIds = result.data.herbs.map((h: { id: number; [key: string]: unknown }) => h.id);
            console.log('Setting selected herbs:', herbIds);
            setSelectedHerbs(herbIds);
          }
          
          if (result.data.supplements && Array.isArray(result.data.supplements)) {
            const supplementIds = result.data.supplements.map((s: { id: number; [key: string]: unknown }) => s.id);
            console.log('Setting selected supplements:', supplementIds);
            setSelectedSupplements(supplementIds);
          }
        } else {
          console.warn('API response missing success or data:', result);
        }
      } else {
        console.error('Failed to fetch current indications:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching current indications:', error);
    }
  }, [targetId, targetType]);



  const handleSave = async () => {
    if (!targetId) return;
    
    setSaving(true);
    try {
      console.log(`💾 Saving indications for ${targetType} ${targetId}:`, {
        herbs: selectedHerbs,
        supplements: selectedSupplements,
        targetType
      });
      
      const response = await fetch(`/api/symptoms/${targetId}/indications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          herbs: selectedHerbs,
          supplements: selectedSupplements,
          targetType
        })
      });

      if (response.ok) {
        console.log('Indications saved successfully');
        // Save evidence scores if any exist
        await saveEvidenceScores();
      } else {
        const errorData = await response.json();
        console.error('Failed to save indications:', errorData);
      }
    } catch (error) {
      console.error('Error saving indications:', error);
    } finally {
      setSaving(false);
    }
  };

  const saveEvidenceScores = async () => {
    try {
      for (const [itemId, score] of Object.entries(evidenceScores)) {
        if (score.traditionalScore && score.researchScore) {
          const response = await fetch('/api/evidence-scoring', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              herbId: parseInt(itemId),
              indicationId: targetId,
              traditionalScore: score.traditionalScore,
              researchScore: score.researchScore,
              notes: score.notes
            })
          });
          
          if (response.ok) {
            console.log(`Evidence score saved for herb ${itemId}`);
          }
        }
      }
    } catch (error) {
      console.error('Error saving evidence scores:', error);
    }
  };

  const updateEvidenceScore = (itemId: number, field: keyof EvidenceScore, value: string | number) => {
    setEvidenceScores(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value,
        totalScore: field === 'traditionalScore' || field === 'researchScore' 
          ? calculateTotalScore(
              field === 'traditionalScore' ? value : (prev[itemId]?.traditionalScore || 0),
              field === 'researchScore' ? value : (prev[itemId]?.researchScore || 0)
            )
          : (prev[itemId]?.totalScore || 0)
      }
    }));
  };

  const calculateTotalScore = (traditional: number, research: number): number => {
    return (traditional * 0.5) + (research * 1.0);
  };

  const filteredHerbs = Array.isArray(herbs) ? herbs.filter(herb => 
    herb && herb.name && herb.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const filteredSupplements = Array.isArray(supplements) ? supplements.filter(supplement => 
    supplement && supplement.name && supplement.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" 
         style={{
           backgroundImage: "url('/images/RoseWPWM.PNG')",
           backgroundSize: "cover",
           backgroundPosition: "center",
           backgroundRepeat: "no-repeat",
         }}>
      <div className="absolute inset-0 bg-pink-100 opacity-90"></div>
      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-300 max-w-6xl w-full max-h-[90vh] overflow-hidden relative z-10" 
           style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
        {/* Header */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 text-gray-700 px-6 py-4 flex justify-between items-center border-b-2 border-gray-300">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Manage Indications</h2>
            <p className="text-gray-800 font-medium text-sm mt-1">
              {targetType === 'variant' ? 'Variant' : 'Symptom'}: <span className="text-blue-700 font-semibold">{targetName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 text-2xl font-bold transition-colors"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search herbs and supplements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Evidence Scoring Toggle */}
          <div className="mb-6">
            <button
              onClick={() => setShowScoring(!showScoring)}
              className={`px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-200 ${
                showScoring 
                  ? 'bg-green-600 text-white shadow-lg hover:bg-green-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {showScoring ? '❌ Hide Evidence Scoring' : '📊 Show Evidence Scoring'}
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg border border-gray-300">
            <button
              onClick={() => setActiveTab('herbs')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'herbs'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-700 hover:text-green-700 hover:bg-gray-50'
              }`}
            >
              🌿 Herbs ({selectedHerbs.length})
            </button>
            <button
              onClick={() => setActiveTab('supplements')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'supplements'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-700 hover:text-blue-700 hover:bg-gray-50'
              }`}
            >
              💊 Supplements ({selectedSupplements.length})
            </button>
          </div>

          {/* Items List */}
          <div className="space-y-3 mb-6">
            {activeTab === 'herbs' ? (
              // Herbs Tab
              loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading herbs...</p>
                </div>
              ) : (
                filteredHerbs.map((herb) => (
                  <div
                    key={herb.id}
                    className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white"
                  >
                    <input
                      type="checkbox"
                      id={`herb-${herb.id}`}
                      checked={selectedHerbs.includes(herb.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedHerbs([...selectedHerbs, herb.id]);
                        } else {
                          setSelectedHerbs(selectedHerbs.filter(id => id !== herb.id));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`herb-${herb.id}`}
                      className="flex-1 cursor-pointer text-gray-700 hover:text-gray-900"
                    >
                      <span className="font-medium">{herb.name}</span>
                    </label>
                    
                    {/* Evidence Scoring Section */}
                    {showScoring && selectedHerbs.includes(herb.id) && (
                      <div className="ml-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 min-w-[400px]">
                        <h4 className="font-bold text-blue-900 mb-3 text-sm">Evidence Scoring</h4>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="block text-xs font-semibold text-blue-800 mb-1">Traditional (1-5)</label>
                            <input
                              type="number"
                              min="1"
                              max="5"
                              value={evidenceScores[herb.id]?.traditionalScore || ''}
                              onChange={(e) => updateEvidenceScore(herb.id, 'traditionalScore', parseInt(e.target.value) || 0)}
                              className="w-full p-2 text-sm border-2 border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-blue-800 mb-1">Research (1-5)</label>
                            <input
                              type="number"
                              min="1"
                              max="5"
                              value={evidenceScores[herb.id]?.researchScore || ''}
                              onChange={(e) => updateEvidenceScore(herb.id, 'researchScore', parseInt(e.target.value) || 0)}
                              className="w-full p-2 text-sm border-2 border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="block text-xs font-semibold text-blue-800 mb-1">Total Score</label>
                          <input
                            type="text"
                            value={evidenceScores[herb.id]?.totalScore?.toFixed(1) || '0.0'}
                            readOnly
                            className="w-full p-2 text-sm border-2 border-gray-400 rounded bg-gray-100 text-gray-900 font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-blue-800 mb-1">Notes</label>
                          <input
                            type="text"
                            value={evidenceScores[herb.id]?.notes || ''}
                            onChange={(e) => updateEvidenceScore(herb.id, 'notes', e.target.value)}
                            className="w-full p-2 text-sm border-2 border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                            placeholder="Optional notes..."
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )
            ) : (
              // Supplements Tab
              loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading supplements...</p>
                </div>
              ) : (
                filteredSupplements.map((supplement) => (
                  <div
                    key={supplement.id}
                    className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white"
                  >
                    <input
                      type="checkbox"
                      id={`supplement-${supplement.id}`}
                      checked={selectedSupplements.includes(supplement.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSupplements([...selectedSupplements, supplement.id]);
                        } else {
                          setSelectedSupplements(selectedSupplements.filter(id => id !== supplement.id));
                        }
                      }}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label
                      htmlFor={`supplement-${supplement.id}`}
                      className="flex-1 cursor-pointer text-gray-700 hover:text-gray-900"
                    >
                      <span className="font-medium">{supplement.name}</span>
                    </label>
                    
                    {/* Evidence Scoring Section for Supplements */}
                    {showScoring && selectedSupplements.includes(supplement.id) && (
                      <div className="ml-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 min-w-[400px]">
                        <h4 className="font-bold text-green-900 mb-3 text-sm">Evidence Scoring</h4>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="block text-xs font-semibold text-green-800 mb-1">Traditional (1-5)</label>
                            <input
                              type="number"
                              min="1"
                              max="5"
                              value={evidenceScores[supplement.id]?.traditionalScore || ''}
                              onChange={(e) => updateEvidenceScore(supplement.id, 'traditionalScore', parseInt(e.target.value) || 0)}
                              className="w-full p-2 text-sm border-2 border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-green-800 mb-1">Research (1-5)</label>
                            <input
                              type="number"
                              min="1"
                              max="5"
                              value={evidenceScores[supplement.id]?.researchScore || ''}
                              onChange={(e) => updateEvidenceScore(supplement.id, 'researchScore', parseInt(e.target.value) || 0)}
                              className="w-full p-2 text-sm border-2 border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="block text-xs font-semibold text-green-800 mb-1">Total Score</label>
                          <input
                            type="text"
                            value={evidenceScores[supplement.id]?.totalScore?.toFixed(1) || '0.0'}
                            readOnly
                            className="w-full p-2 text-sm border-2 border-gray-400 rounded bg-gray-100 text-gray-900 font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-green-800 mb-1">Notes</label>
                          <input
                            type="text"
                            value={evidenceScores[supplement.id]?.notes || ''}
                            onChange={(e) => updateEvidenceScore(supplement.id, 'notes', e.target.value)}
                            className="w-full p-2 text-sm border-2 border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                            placeholder="Optional notes..."
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )
            )}
          </div>

          {filteredHerbs.length === 0 && filteredSupplements.length === 0 && searchTerm && (
            <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-gray-300">
              No items found matching &ldquo;{searchTerm}&rdquo;
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-300 px-6 py-4 bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{selectedHerbs.length}</span> herbs,{' '}
            <span className="font-medium">{selectedSupplements.length}</span> supplements selected
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white text-gray-700 border-2 border-gray-300 rounded-lg font-semibold transition-all duration-200 shadow-sm hover:bg-amber-50 hover:border-gray-400 hover:text-gray-600 hover:shadow-gray-300 hover:shadow-lg hover:scale-105"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-white text-gray-700 border-2 border-gray-300 rounded-lg font-semibold transition-all duration-200 shadow-sm hover:bg-amber-50 hover:border-gray-400 hover:text-gray-600 hover:shadow-gray-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-sm"
            >
              {saving ? 'Saving...' : 'Save Indications & Scores'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
