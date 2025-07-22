"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Herb {
  id: number;
  name: string;
  slug: string;
  pendingCount: number;
}

interface Supplement {
  id: number;
  name: string;
  slug: string;
  pendingCount: number;
}

export default function ProductHuntDashboard() {
  const [herbs, setHerbs] = useState<Herb[]>([]);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [loading, setLoading] = useState(true);

  // Get today's date in yyyy-mm-dd format
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchSubstances();
  }, []);

  const fetchSubstances = async () => {
    setLoading(true);
    try {
      // Mock data - in real implementation, this would come from your API
      const mockHerbs: Herb[] = [
        { id: 1, name: 'Ashwagandha', slug: 'ashwagandha', pendingCount: 3 },
        { id: 2, name: 'St. John\'s Wort', slug: 'st-johns-wort', pendingCount: 2 },
        { id: 3, name: 'Rhodiola Rosea', slug: 'rhodiola-rosea', pendingCount: 1 },
        { id: 4, name: 'Ginseng', slug: 'ginseng', pendingCount: 4 },
        { id: 5, name: 'Lemon Balm', slug: 'lemon-balm', pendingCount: 2 },
        { id: 6, name: 'Valerian Root', slug: 'valerian-root', pendingCount: 3 },
        { id: 7, name: 'Chamomile', slug: 'chamomile', pendingCount: 1 },
        { id: 8, name: 'Passionflower', slug: 'passionflower', pendingCount: 2 },
        { id: 9, name: 'Lavender', slug: 'lavender', pendingCount: 1 },
        { id: 10, name: 'Skullcap', slug: 'skullcap', pendingCount: 2 },
        { id: 11, name: 'Oat Straw', slug: 'oat-straw', pendingCount: 1 },
        { id: 12, name: 'Holy Basil', slug: 'holy-basil', pendingCount: 3 },
        { id: 13, name: 'Maca Root', slug: 'maca-root', pendingCount: 2 },
        { id: 14, name: 'Schisandra', slug: 'schisandra', pendingCount: 1 },
        { id: 15, name: 'Reishi Mushroom', slug: 'reishi-mushroom', pendingCount: 2 }
      ];

      const mockSupplements: Supplement[] = [
        { id: 1, name: 'L-Theanine', slug: 'l-theanine', pendingCount: 2 },
        { id: 2, name: 'Magnesium', slug: 'magnesium', pendingCount: 4 },
        { id: 3, name: 'Vitamin D3', slug: 'vitamin-d3', pendingCount: 3 },
        { id: 4, name: 'Omega-3', slug: 'omega-3', pendingCount: 2 },
        { id: 5, name: 'B-Complex', slug: 'b-complex', pendingCount: 1 },
        { id: 6, name: 'Zinc', slug: 'zinc', pendingCount: 2 },
        { id: 7, name: 'Probiotics', slug: 'probiotics', pendingCount: 3 },
        { id: 8, name: 'Melatonin', slug: 'melatonin', pendingCount: 2 },
        { id: 9, name: '5-HTP', slug: '5-htp', pendingCount: 1 },
        { id: 10, name: 'GABA', slug: 'gaba', pendingCount: 2 },
        { id: 11, name: 'Creatine', slug: 'creatine', pendingCount: 1 },
        { id: 12, name: 'CoQ10', slug: 'coq10', pendingCount: 2 },
        { id: 13, name: 'NAC', slug: 'nac', pendingCount: 1 },
        { id: 14, name: 'Alpha-GPC', slug: 'alpha-gpc', pendingCount: 2 },
        { id: 15, name: 'Phosphatidylserine', slug: 'phosphatidylserine', pendingCount: 1 }
      ];

      setHerbs(mockHerbs);
      setSupplements(mockSupplements);
    } catch (error) {
      console.error('Error fetching substances:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPendingHerbs = herbs.reduce((sum, herb) => sum + herb.pendingCount, 0);
  const totalPendingSupplements = supplements.reduce((sum, supplement) => sum + supplement.pendingCount, 0);

  // Handler for Trigger Hunt Now with confirmation
  const handleTriggerHuntNow = () => {
    if (window.confirm('Are you sure you want to trigger a Product Hunt now?')) {
      // TODO: Add actual trigger logic here
      alert('Product Hunt triggered!');
    }
  };

  return (
    <div className="min-h-screen p-6 relative" style={{
      backgroundImage: "url('/images/Archery_Arrows_in_Paper_Target.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-white/60 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto">
        {/* Hunt Controls */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 flex flex-wrap items-center gap-4">
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded shadow">
              Start New Product Hunt
            </button>
            <label className="font-semibold text-gray-800 flex items-center gap-2">
              Minimum Yield ($):
              <input type="number" min="0" defaultValue={1} className="border border-gray-300 rounded px-2 py-1 w-20" />
            </label>
            <label className="font-semibold text-gray-800 flex items-center gap-2">
              Auto-Hunt Scheduler:
              <select className="border border-gray-300 rounded px-2 py-1">
                <option>Every day</option>
                <option>Every week</option>
                <option>Fortnightly</option>
                <option>Every month</option>
              </select>
            </label>
            <label className="font-semibold text-gray-800 flex items-center gap-2">
              Start Date:
              <input type="date" className="border border-gray-300 rounded px-2 py-1" defaultValue={today} />
            </label>
            <button className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded shadow">
              Save
            </button>
            <button
              className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-6 rounded shadow"
              type="button"
              onClick={handleTriggerHuntNow}
            >
              Trigger Hunt Now
            </button>
          </div>
        </div>
        {/* Search and Filter Controls */}
        <div className="flex flex-wrap gap-4 mb-8">
          <input type="text" placeholder="Search by product name..." className="border border-gray-400 rounded px-4 py-2 bg-white/80 text-gray-900 placeholder-gray-500 shadow" />
          <select className="border border-gray-400 rounded px-4 py-2 bg-white/80 text-gray-900 shadow">
            <option>All Merchants</option>
          </select>
          <select className="border border-gray-400 rounded px-4 py-2 bg-white/80 text-gray-900 shadow">
            <option>All Regions</option>
          </select>
          <select className="border border-gray-400 rounded px-4 py-2 bg-white/80 text-gray-900 shadow">
            <option>All Quality Scores</option>
          </select>
        </div>
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Product Hunt Dashboard
            </h1>
            <p className="text-gray-600">
              Review and approve products based on quality specifications and research criteria.
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pending Herbs</p>
                <p className="text-3xl font-bold text-green-600">{totalPendingHerbs}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pending Supplements</p>
                <p className="text-3xl font-bold text-blue-600">{totalPendingSupplements}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pending</p>
                <p className="text-3xl font-bold text-purple-600">{totalPendingHerbs + totalPendingSupplements}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading substances...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Herbs Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Herbs ({herbs.length})</h2>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  {totalPendingHerbs} pending
                </span>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {herbs.map((herb) => (
                  <Link
                    key={herb.id}
                    href={`/admin/product-hunt/herbs/${herb.slug}`}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{herb.name}</h3>
                        <p className="text-sm text-gray-600">Slug: {herb.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {herb.pendingCount > 0 && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                          {herb.pendingCount} pending
                        </span>
                      )}
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Supplements Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Supplements ({supplements.length})</h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {totalPendingSupplements} pending
                </span>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {supplements.map((supplement) => (
                  <Link
                    key={supplement.id}
                    href={`/admin/product-hunt/supplements/${supplement.slug}`}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{supplement.name}</h3>
                        <p className="text-sm text-gray-600">Slug: {supplement.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {supplement.pendingCount > 0 && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                          {supplement.pendingCount} pending
                        </span>
                      )}
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex gap-4">
          <Link
            href="/admin"
            className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition font-medium"
          >
            Back to Admin
          </Link>
          <Link
            href="/admin/quality-specifications"
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition font-medium"
          >
            Manage Quality Specs
          </Link>
          <Link
            href="/admin/data-hub"
            className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition font-medium"
          >
            Data Processing Hub
          </Link>
        </div>
        {/* Clear All Pending Button */}
        <div className="flex justify-end mt-8">
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded shadow"
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to clear ALL pending products? This action cannot be undone.')) {
                // TODO: Add actual clear logic here
                alert('All pending products cleared!');
              }
            }}
          >
            Clear All Pending
          </button>
        </div>
      </div>
    </div>
  );
} 