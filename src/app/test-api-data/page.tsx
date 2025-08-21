'use client';

import React, { useState } from 'react';

export default function TestApiDataPage() {
  const [slug, setSlug] = useState('st-johns-wort'); // Default slug for convenience
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!slug) {
      setError('Please enter a slug.');
      return;
    }
    setLoading(true);
    setError(null);
    setApiResponse(null);

    try {
      const response = await fetch(`/api/herbs/${slug}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Request failed with status ${response.status}`);
      }
      
      setApiResponse(data);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">API Data Diagnostic Page</h1>
        <p className="text-gray-600 mb-6">
          This page fetches data directly from the <code>/api/herbs/[slug]</code> endpoint and displays the raw JSON response. This helps us verify exactly what data the backend is sending to the frontend, bypassing any complex rendering logic.
        </p>

        <div className="flex items-center space-x-4 mb-4">
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Enter herb slug (e.g., st-johns-wort)"
            className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {loading ? 'Loading...' : 'Fetch Data'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        {apiResponse && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Raw API Response:</h2>
            <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
