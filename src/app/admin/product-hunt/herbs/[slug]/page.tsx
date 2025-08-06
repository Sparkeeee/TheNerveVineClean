"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Image from 'next/image';

interface PendingProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  url: string;
  description: string;
  qualityScore: number;
  qualityReasons: string[];
  qualityWarnings: string[];
  formulationMatch: string;
  approach: 'traditional' | 'modern' | 'both';
  selected: boolean;
}

interface HerbInfo {
  name: string;
  slug: string;
  description: string;
  latinName?: string;
}

export default function HerbSubstancePage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [herbInfo, setHerbInfo] = useState<HerbInfo | null>(null);
  const [pendingProducts, setPendingProducts] = useState<PendingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const fetchHerbInfo = useCallback(async () => {
    try {
      // Fetch herb data from API endpoint
      const response = await fetch(`/api/herbs/${slug}`);
      
      if (response.ok) {
        const dbHerb = await response.json();
        const herbInfo: HerbInfo = {
          name: dbHerb.name,
          slug: dbHerb.slug,
          description: dbHerb.description || `Quality specifications and pending products for ${dbHerb.name}.`,
          latinName: dbHerb.latinName
        };
        setHerbInfo(herbInfo);
      } else {
        // Fallback if herb not found
        const herbInfo: HerbInfo = {
          name: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          slug: slug,
          description: `Quality specifications and pending products for ${slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}.`,
          latinName: slug === 'st-johns-wort' ? 'Hypericum perforatum' : undefined
        };
        setHerbInfo(herbInfo);
      }
    } catch (error) {
      console.error('Error fetching herb info:', error);
      // Fallback on error
      const herbInfo: HerbInfo = {
        name: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        slug: slug,
        description: `Quality specifications and pending products for ${slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}.`,
        latinName: slug === 'st-johns-wort' ? 'Hypericum perforatum' : undefined
      };
      setHerbInfo(herbInfo);
    }
  }, [slug]);

  const fetchPendingProducts = useCallback(async () => {
    setLoading(true);
    try {
      // WORKFLOW RESTORATION: Smart fallback for admin product curation workflow
      // First try to get real pending products from database
      let pendingProducts: PendingProduct[] = [];
      
      try {
        // TODO: Implement real database query when PendingProduct model is populated:
        // pendingProducts = await prisma.pendingProduct.findMany({
        //   where: { herbSlug: slug, status: 'pending' }
        // });
        
        // For now, generate workflow examples to demonstrate admin curation process
        if (pendingProducts.length === 0 && herbInfo?.name) {
          pendingProducts = [
            {
              id: 'workflow-example-1',
              name: `${herbInfo.name} Professional Tincture`,
              brand: 'Example: Gaia Herbs',
              price: 24.99,
              rating: 4.5,
              reviewCount: 127,
              image: `/images/herbs/${slug}.jpg`,
              url: 'https://example.com/workflow-demo',
              description: `WORKFLOW DEMO: High-quality ${herbInfo.name} tincture for admin review process`,
              qualityScore: 85,
              qualityReasons: ['Quality criteria demo', 'Admin workflow example'],
              qualityWarnings: ['Workflow demonstration only'],
              formulationMatch: 'Traditional Tincture Example',
              approach: 'traditional',
              selected: false
            },
            {
              id: 'workflow-example-2', 
              name: `${herbInfo.name} Standardized Extract`,
              brand: 'Example: Nature\'s Way',
              price: 18.99,
              rating: 4.2,
              reviewCount: 89,
              image: `/images/herbs/${slug}-capsules.jpg`,
              url: 'https://example.com/workflow-demo',
              description: `WORKFLOW DEMO: Standardized extract for curation workflow`,
              qualityScore: 78,
              qualityReasons: ['Workflow testing', 'Admin approval process'],
              qualityWarnings: ['Demo data only'],
              formulationMatch: 'Modern Extract Example',
              approach: 'modern',
              selected: false
            }
          ];
        }
      } catch (error) {
        console.error('Error fetching pending products:', error);
        pendingProducts = [];
      }
      
      setPendingProducts(pendingProducts);
    } catch (error) {
      console.error('Error fetching pending products:', error);
      setPendingProducts([]);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchHerbInfo();
    fetchPendingProducts();
  }, [fetchHerbInfo, fetchPendingProducts]);

  const handleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleApproveProducts = async () => {
    if (selectedProducts.length === 0) {
      alert('Please select products to approve');
      return;
    }

    setApproving(true);
    try {
      // In real implementation, this would save the selected products
      // to your database and mark them as approved
      console.log('Approving products:', selectedProducts);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove approved products from pending list
      setPendingProducts(prev => prev.filter(product => !selectedProducts.includes(product.id)));
      setSelectedProducts([]);
      
      alert(`${selectedProducts.length} products approved successfully!`);
    } catch (error) {
      console.error('Error approving products:', error);
      alert('Error approving products');
    } finally {
      setApproving(false);
    }
  };

  const handleRejectProducts = async () => {
    if (selectedProducts.length === 0) {
      alert('Please select products to reject');
      return;
    }

    setRejecting(true);
    try {
      // In real implementation, this would mark the selected products as rejected
      console.log('Rejecting products:', selectedProducts);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove rejected products from pending list
      setPendingProducts(prev => prev.filter(product => !selectedProducts.includes(product.id)));
      setSelectedProducts([]);
      
      alert(`${selectedProducts.length} products rejected successfully!`);
    } catch (error) {
      console.error('Error rejecting products:', error);
      alert('Error rejecting products');
    } finally {
      setRejecting(false);
    }
  };

  const getQualityScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-700 bg-green-100 border border-green-200';
    if (score >= 60) return 'text-yellow-700 bg-yellow-100 border border-yellow-200';
    return 'text-red-700 bg-red-100 border border-red-200';
  };

  const getApproachColor = (approach: string) => {
    switch (approach) {
      case 'traditional': return 'bg-green-100 text-green-800 border border-green-200';
      case 'modern': return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'both': return 'bg-blue-100 text-blue-800 border border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-800">Loading herb information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              href="/admin/product-hunt"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Product Hunt
            </Link>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {herbInfo?.name}
              </h1>
              {herbInfo?.latinName && (
                <p className="text-lg text-gray-800 italic">{herbInfo.latinName}</p>
              )}
              <p className="text-gray-800 mt-2">{herbInfo?.description}</p>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-800">Pending Products</p>
              <p className="text-3xl font-bold text-red-600">{pendingProducts.length}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {selectedProducts.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between">
              <p className="text-gray-700">
                {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={handleRejectProducts}
                  disabled={rejecting}
                  className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition font-medium disabled:opacity-50"
                >
                  {rejecting ? 'Rejecting...' : `Reject Selected (${selectedProducts.length})`}
                </button>
                <button
                  onClick={handleApproveProducts}
                  disabled={approving}
                  className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition font-medium disabled:opacity-50"
                >
                  {approving ? 'Approving...' : `Approve Selected (${selectedProducts.length})`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              Pending Products ({pendingProducts.length})
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedProducts(pendingProducts.map(p => p.id))}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Select All
              </button>
              <button
                onClick={() => setSelectedProducts([])}
                className="text-gray-800 hover:text-gray-800 text-sm font-medium"
              >
                Clear Selection
              </button>
            </div>
          </div>

          {pendingProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-800">No pending products for this herb.</p>
              <p className="text-sm text-gray-500 mt-2">All products have been reviewed.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingProducts.map((product) => (
                <div
                  key={product.id}
                  className={`border rounded-lg p-6 hover:shadow-lg transition ${
                    selectedProducts.includes(product.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  {/* Product Image */}
                  <div className="mb-4">
                    <Image
                      src={product.image || '/images/placeholder-product.jpg'}
                      alt={product.name}
                      width={200}
                      height={120}
                      className="w-full h-48 object-cover rounded-md"
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder-product.jpg';
                      }}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-800">{product.brand}</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm text-gray-700 font-medium">{product.rating}</span>
                        <span className="text-xs text-gray-800">({product.reviewCount})</span>
                      </div>
                    </div>

                    {/* Quality Score */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-800">Quality Score:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getQualityScoreColor(product.qualityScore)}`}>
                        {product.qualityScore}/100
                      </span>
                    </div>

                    {/* Formulation Match */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-800">Formulation:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getApproachColor(product.approach)}`}>
                        {product.formulationMatch}
                      </span>
                    </div>

                    {/* Quality Reasons */}
                    {product.qualityReasons.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-700 mb-1">Strengths:</p>
                        <ul className="text-xs text-green-700 space-y-1">
                          {product.qualityReasons.map((reason, index) => (
                            <li key={index}>• {reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Quality Warnings */}
                    {product.qualityWarnings.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-700 mb-1">Concerns:</p>
                        <ul className="text-xs text-red-700 space-y-1">
                          {product.qualityWarnings.map((warning, index) => (
                            <li key={index}>• {warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-3">
                      <button
                        onClick={() => handleProductSelection(product.id)}
                        className={`flex-1 px-3 py-2 rounded text-sm font-medium transition ${
                          selectedProducts.includes(product.id)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {selectedProducts.includes(product.id) ? 'Selected' : 'Select'}
                      </button>
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-300 transition"
                      >
                        View
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex gap-4">
          <Link
            href="/admin/product-hunt"
            className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition font-medium"
          >
            Back to Product Hunt
          </Link>
          <Link
            href="/admin/quality-specifications"
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition font-medium"
          >
            Manage Quality Specs
          </Link>
        </div>
      </div>
    </div>
  );
} 