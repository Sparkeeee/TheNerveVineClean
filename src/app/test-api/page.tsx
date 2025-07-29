'use client';

import { useState, useEffect } from 'react';

export default function TestApi() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/test-slug-mismatch');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Testing Slug Mismatch...</h1>
          <p>Loading test results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6 text-red-600">Error</h1>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Slug Mismatch Test Results</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Listing Query Results</h2>
            <div className="bg-gray-50 p-4 rounded">
              <p><strong>Function:</strong> {data.listingQuery.function}</p>
              <p><strong>Result Count:</strong> {data.listingQuery.resultCount}</p>
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Supplements Found:</h3>
                {data.listingQuery.supplements.map((supplement: any, index: number) => (
                  <div key={index} className="mb-2 p-2 bg-white rounded border">
                    <p><strong>Name:</strong> {supplement.name}</p>
                    <p><strong>Slug:</strong> <code>{supplement.slug}</code></p>
                    <p><strong>ID:</strong> {supplement.id}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2">Individual Query Results</h2>
            <div className="bg-gray-50 p-4 rounded space-y-4">
              {Object.entries(data.individualQueries).map(([slug, result]: [string, any]) => (
                <div key={slug}>
                  <h3 className="font-semibold">Query: &apos;{slug}&apos;</h3>
                  {result.found ? (
                    <div className="bg-green-50 p-2 rounded">
                      <p><strong>Found:</strong> {result.name}</p>
                      <p><strong>Slug:</strong> {result.slug}</p>
                    </div>
                  ) : (
                    <div className="bg-red-50 p-2 rounded">
                      <p><strong>Not Found</strong></p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2">Analysis</h2>
            <div className={`p-4 rounded ${data.mismatch.hasMismatch ? 'bg-red-50' : 'bg-green-50'}`}>
              <p><strong>Listing Query Works:</strong> {data.mismatch.listingWorks ? 'Yes' : 'No'}</p>
              <p><strong>Individual Query Fails:</strong> {data.mismatch.individualFails ? 'Yes' : 'No'}</p>
              <p><strong>Has Mismatch:</strong> {data.mismatch.hasMismatch ? 'YES - Problem Found!' : 'NO - Both work correctly'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}