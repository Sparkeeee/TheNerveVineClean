'use client';

import React, { useState, useEffect } from 'react';

interface Herb {
  id: number;
  name: string;
  slug: string;
}

interface Supplement {
  id: number;
  name: string;
  slug: string;
}

interface IndicationManagerProps {
  isOpen: boolean;
  onClose: () => void;
  symptomId?: number;
  variantId?: number;
  symptomTitle?: string;
  variantName?: string;
}

interface IndicationData {
  herbs: Herb[];
  supplements: Supplement[];
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

  const targetId = variantId || symptomId;
  const targetType = variantId ? 'variant' : 'symptom';
  const targetName = variantName || symptomTitle;

  useEffect(() => {
    if (isOpen && targetId) {
      fetchAvailableItems();
      fetchCurrentIndications();
    }
  }, [isOpen, targetId]);

  const fetchAvailableItems = async () => {
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
      setHerbs([]);
      setSupplements([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentIndications = async () => {
    if (!targetId) return;
    
    try {
      const response = await fetch(`/api/symptoms/${targetId}/indications`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setSelectedHerbs(result.data.herbs.map((h: Herb) => h.id));
          setSelectedSupplements(result.data.supplements.map((s: Supplement) => s.id));
        }
      }
    } catch (error) {
      console.error('Error fetching current indications:', error);
    }
  };

  const handleSave = async () => {
    if (!targetId) return;
    
    setSaving(true);
    try {
      const response = await fetch(`/api/symptoms/${targetId}/indications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          herbs: selectedHerbs,
          supplements: selectedSupplements,
          targetType
        }),
      });

      if (response.ok) {
        // Success - close the modal
        onClose();
      } else {
        console.error('Failed to save indications');
      }
    } catch (error) {
      console.error('Error saving indications:', error);
    } finally {
      setSaving(false);
    }
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
      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-300 max-w-4xl w-full max-h-[90vh] overflow-hidden relative z-10" 
           style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
        {/* Header */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 text-gray-700 px-6 py-4 flex justify-between items-center border-b-2 border-gray-300">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Manage Indications</h2>
            <p className="text-gray-600 text-sm mt-1">
              {targetType === 'variant' ? 'Variant' : 'Symptom'}: {targetName}
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
                      {herb.commonName && herb.commonName !== herb.name && (
                        <span className="text-gray-500 text-sm ml-2">({herb.commonName})</span>
                      )}
                    </label>
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
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`supplement-${supplement.id}`}
                      className="flex-1 cursor-pointer text-gray-700 hover:text-gray-900"
                    >
                      <span className="font-medium">{supplement.name}</span>
                    </label>
                  </div>
                ))
              )
            )}
          </div>

          {filteredHerbs.length === 0 && filteredSupplements.length === 0 && searchTerm && (
            <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-gray-300">
              No items found matching "{searchTerm}"
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
              {saving ? 'Saving...' : 'Save Indications'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
