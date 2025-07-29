'use client';

import { useState } from 'react';

interface CascadePreviewProps {
  productId: string;
  targetHerb?: string;
  targetSupplement?: string;
  productName: string;
}

interface CascadePreview {
  primaryTarget: string;
  cascadeTargets: string[];
  totalPagesAffected: number;
  estimatedUpdateTime: string;
}

export default function CascadePreview({ 
  productId, 
  targetHerb, 
  targetSupplement, 
  productName 
}: CascadePreviewProps) {
  const [preview, setPreview] = useState<CascadePreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const loadPreview = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (targetHerb) params.set('herb', targetHerb);
      if (targetSupplement) params.set('supplement', targetSupplement);

      const response = await fetch(`/api/product-cascade?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setPreview(data.preview);
      }
    } catch (error) {
      console.error('Failed to load cascade preview:', error);
    } finally {
      setLoading(false);
    }
  };

  const executeCascade = async (action: 'approve' | 'reject') => {
    setExecuting(true);
    try {
      const response = await fetch('/api/product-cascade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          productId,
          targetHerb,
          targetSupplement,
          updateType: 'phytopharmaceutical'
        })
      });

      const data = await response.json();
      setResult(data);
      
      if (data.success) {
        // Show success animation or notification
        console.log('🌊 CASCADE COMPLETE!', data.data.cascadeEffect);
      }
    } catch (error) {
      console.error('Cascade execution failed:', error);
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          🌊 Domino Rally Cascade Preview
        </h3>
        <button
          onClick={loadPreview}
          disabled={loading}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Preview Cascade'}
        </button>
      </div>

      <div className="mb-4 p-3 bg-white rounded border">
        <h4 className="font-medium text-gray-800 mb-2">Product: {productName}</h4>
        <div className="text-sm text-gray-600">
          <p><strong>Target:</strong> {targetHerb ? `Herb: ${targetHerb}` : `Supplement: ${targetSupplement}`}</p>
          <p><strong>Product ID:</strong> {productId}</p>
        </div>
      </div>

      {preview && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-3">📍 CASCADE IMPACT ANALYSIS</h4>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-green-600 font-medium">✓ Primary Target:</span>
                <code className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                  {preview.primaryTarget}
                </code>
              </div>

              {preview.cascadeTargets.length > 0 && (
                <div>
                  <span className="text-orange-600 font-medium">🌊 Cascade Targets:</span>
                  <div className="mt-2 space-y-1">
                    {preview.cascadeTargets.map((target, index) => (
                      <code 
                        key={index}
                        className="block px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm"
                      >
                        {target}
                      </code>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-purple-600 font-medium">
                  📊 Total Impact: {preview.totalPagesAffected} pages
                </span>
                <span className="text-gray-500 text-sm">
                  ⏱️ Est. time: {preview.estimatedUpdateTime}
                </span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => executeCascade('approve')}
              disabled={executing}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
            >
              {executing ? '🌊 Cascading...' : '✅ APPROVE & CASCADE'}
            </button>
            
            <button
              onClick={() => executeCascade('reject')}
              disabled={executing}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium"
            >
              {executing ? 'Processing...' : '❌ REJECT'}
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className={`mt-4 p-4 rounded-lg border ${
          result.success 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <h4 className="font-semibold mb-2">
            {result.success ? '🎉 CASCADE COMPLETED!' : '❌ CASCADE FAILED'}
          </h4>
          
          {result.success ? (
            <div>
              <p className="mb-2">{result.message}</p>
              <div className="text-sm">
                <p><strong>Pages Updated:</strong> {result.data.cascadeEffect.totalPagesAffected}</p>
                <p><strong>Herbs Updated:</strong> {result.data.cascadeEffect.herbsUpdated}</p>
                <p><strong>Symptoms Updated:</strong> {result.data.cascadeEffect.symptomsUpdated}</p>
              </div>
            </div>
          ) : (
            <div>
              <p>{result.error}</p>
              {result.details && (
                <ul className="mt-2 text-sm">
                  {Array.isArray(result.details) ? result.details.map((detail: string, i: number) => (
                    <li key={i}>• {detail}</li>
                  )) : (
                    <li>• {result.details}</li>
                  )}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      {!preview && !loading && (
        <div className="text-center py-8 text-gray-500">
          <p>Click "Preview Cascade" to see the domino effect this approval will trigger</p>
          <p className="text-sm mt-1">🎯 One approval → Multiple page updates automatically</p>
        </div>
      )}
    </div>
  );
} 