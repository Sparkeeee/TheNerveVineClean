"use client";
import React, { useState } from 'react';
import Link from 'next/link';

// Mock data for pending products
const initialMockProducts = [
  {
    id: 1,
    name: 'SuperHerb Extract',
    merchant: 'iHerb',
    price: 19.99,
    currency: 'USD',
    qualityScore: 92,
    affiliateRate: 0.12,
    affiliateYield: 2.40,
    region: 'US',
  },
  {
    id: 2,
    name: 'PureRoot Capsules',
    merchant: 'Amazon',
    price: 14.5,
    currency: 'USD',
    qualityScore: 88,
    affiliateRate: 0.08,
    affiliateYield: 1.16,
    region: 'US',
  },
  {
    id: 3,
    name: 'CheapRoot Tabs',
    merchant: 'Amazon',
    price: 5.0,
    currency: 'USD',
    qualityScore: 85,
    affiliateRate: 0.10,
    affiliateYield: 0.50,
    region: 'US',
  },
];

// Helper to normalize value score (lower price = higher value, 0-100)
function getValueScore(price: number, minPrice: number, maxPrice: number) {
  if (maxPrice === minPrice) return 100;
  // Invert so lower price = higher score
  return Math.round(100 * (1 - (price - minPrice) / (maxPrice - minPrice)));
}

// Composite score: weighted average of quality and value
function getCompositeScore(quality: number, value: number, qualityWeight = 0.6, valueWeight = 0.4) {
  return Math.round(quality * qualityWeight + value * valueWeight);
}

export default function ProductHuntAdminPage() {
  const [minYield, setMinYield] = useState(1.0);

  // Find min/max price for normalization
  const prices = initialMockProducts.map((p) => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // Filter and score products
  const filteredProducts = initialMockProducts
    .filter((p) => p.affiliateYield >= minYield)
    .map((p) => {
      const valueScore = getValueScore(p.price, minPrice, maxPrice);
      const compositeScore = getCompositeScore(p.qualityScore, valueScore);
      return { ...p, valueScore, compositeScore };
    })
    .sort((a, b) => b.compositeScore - a.compositeScore);

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/images/Archery_Arrows_in_Paper_Target.jpg')",
      }}
    >
      <div className="relative z-10 flex flex-col items-center p-6">
        <div className="w-full max-w-6xl mx-auto rounded-lg" style={{background: 'rgba(255,255,255,0.75)'}}>
          {/* Navigation Links */}
          <div className="flex justify-between items-center p-4 pb-0">
            <Link href="/admin" className="bg-blue-700 text-white px-4 py-2 rounded shadow hover:bg-blue-800 transition font-bold">Admin Home</Link>
            <span className="text-blue-900 font-bold underline text-lg">Product Hunt</span>
          </div>

          {/* Header */}
          <header className="mb-8 flex items-center justify-between p-6 pb-0">
            <h1 className="text-3xl font-bold text-gray-900">Product Hunt Admin Dashboard</h1>
          </header>

          {/* Auto-Hunt Scheduler & Controls */}
          <section className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 pt-0">
            <div className="flex items-center gap-4">
              <button className="bg-green-700 text-white px-4 py-2 rounded shadow hover:bg-green-800 transition font-bold">Start New Product Hunt</button>
              <div className="flex items-center gap-2 ml-6">
                <label htmlFor="min-yield" className="font-semibold text-gray-900">Minimum Yield ($):</label>
                <input
                  id="min-yield"
                  type="number"
                  min={0}
                  step={0.01}
                  value={minYield}
                  onChange={(e) => setMinYield(Number(e.target.value))}
                  className="border rounded px-2 py-1 w-20 text-gray-900"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="auto-hunt" className="font-semibold text-gray-900">Auto-Hunt Scheduler:</label>
              <select id="auto-hunt" className="border rounded px-2 py-1 text-gray-900">
                <option>Every week</option>
                <option>Every 2 weeks</option>
                <option>Every month</option>
              </select>
              <button className="ml-2 px-3 py-1 bg-blue-700 text-white rounded shadow hover:bg-blue-800 transition font-bold">Save</button>
              <button
                className="ml-2 px-3 py-1 bg-green-700 text-white rounded shadow hover:bg-green-800 transition font-bold"
                onClick={() => {
                  if (window.confirm('Are you sure you want to trigger a product hunt now?')) {
                    alert('Product hunt triggered!');
                  }
                }}
              >
                Trigger Hunt Now
              </button>
            </div>
          </section>

          {/* Filters */}
          <section className="mb-6 flex flex-wrap gap-4 items-center px-6">
            <input type="text" placeholder="Search by product name..." className="border px-3 py-2 rounded w-64 text-gray-900" />
            <select className="border px-2 py-2 rounded text-gray-900">
              <option>All Merchants</option>
              <option>iHerb</option>
              <option>Amazon</option>
            </select>
            <select className="border px-2 py-2 rounded text-gray-900">
              <option>All Regions</option>
              <option>US</option>
              <option>UK</option>
            </select>
            <select className="border px-2 py-2 rounded text-gray-900">
              <option>All Quality Scores</option>
              <option>&gt; 90</option>
              <option>&gt; 80</option>
            </select>
          </section>

          {/* Pending Products Table */}
          <section className="bg-white rounded shadow p-4 mb-8 mx-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Pending Products</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-gray-900 font-bold">Name</th>
                    <th className="px-4 py-2 text-gray-900 font-bold">Merchant</th>
                    <th className="px-4 py-2 text-gray-900 font-bold">Price</th>
                    <th className="px-4 py-2 text-gray-900 font-bold">Quality</th>
                    <th className="px-4 py-2 text-gray-900 font-bold">Affiliate Rate</th>
                    <th className="px-4 py-2 text-gray-900 font-bold">Yield</th>
                    <th className="px-4 py-2 text-gray-900 font-bold">Value Score</th>
                    <th className="px-4 py-2 text-gray-900 font-bold">Composite Score</th>
                    <th className="px-4 py-2 text-gray-900 font-bold">Region</th>
                    <th className="px-4 py-2 text-gray-900 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-4 text-center text-gray-500">No products meet the minimum yield requirement.</td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 font-semibold text-gray-900">{product.name}</td>
                        <td className="px-4 py-2 text-gray-900">{product.merchant}</td>
                        <td className="px-4 py-2 text-gray-900">{product.currency} ${product.price.toFixed(2)}</td>
                        <td className="px-4 py-2 text-gray-900">{product.qualityScore}</td>
                        <td className="px-4 py-2 text-gray-900">{(product.affiliateRate * 100).toFixed(1)}%</td>
                        <td className="px-4 py-2 text-gray-900">{product.currency} ${product.affiliateYield.toFixed(2)}</td>
                        <td className="px-4 py-2 text-gray-900">{product.valueScore}</td>
                        <td className="px-4 py-2 text-gray-900 font-bold">{product.compositeScore}</td>
                        <td className="px-4 py-2 text-gray-900">{product.region}</td>
                        <td className="px-4 py-2 flex gap-2">
                          <button className="bg-green-700 text-white px-2 py-1 rounded cursor-not-allowed opacity-50 font-bold" disabled>Approve</button>
                          <button className="bg-red-700 text-white px-2 py-1 rounded cursor-not-allowed opacity-50 font-bold" disabled>Reject</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Product Detail Modal Placeholder */}
          <section className="mb-8 mx-6">
            <div className="bg-blue-100 border border-blue-300 rounded p-4 text-blue-900 font-semibold">
              <strong>Product Detail Modal:</strong> (Coming soon) Click a product row to view full details, images, and admin notes.
            </div>
          </section>

          {/* Hunt History / Logs */}
          <section className="mx-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Hunt History & Logs</h2>
            <div className="bg-gray-100 border rounded p-4 text-gray-900">
              <ul className="list-disc ml-6">
                <li>2024-07-21: Product hunt completed, 12 products pending review.</li>
                <li>2024-07-07: Product hunt completed, 9 products pending review.</li>
                <li>2024-06-23: Product hunt completed, 15 products pending review.</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 