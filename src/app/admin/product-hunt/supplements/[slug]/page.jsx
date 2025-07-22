"use client";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Image from 'next/image';
export default function SupplementSubstancePage() {
    const params = useParams();
    const slug = params.slug;
    const [supplementInfo, setSupplementInfo] = useState(null);
    const [pendingProducts, setPendingProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [approving, setApproving] = useState(false);
    const [rejecting, setRejecting] = useState(false);
    const fetchSupplementInfo = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        try {
            // Mock data - in real implementation, this would come from your API
            const mockSupplementInfo = {
                name: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                slug: slug,
                description: `Quality specifications and pending products for ${slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}.`,
                category: getSupplementCategory(slug)
            };
            setSupplementInfo(mockSupplementInfo);
        }
        catch (error) {
            console.error('Error fetching supplement info:', error);
        }
    }), [slug]);
    const getSupplementCategory = (slug) => {
        const categories = {
            'l-theanine': 'Amino Acids',
            'magnesium': 'Minerals',
            'vitamin-d3': 'Vitamins',
            'omega-3': 'Essential Fatty Acids',
            'b-complex': 'Vitamins',
            'zinc': 'Minerals',
            'probiotics': 'Gut Health',
            'melatonin': 'Sleep Support',
            '5-htp': 'Amino Acids',
            'gaba': 'Amino Acids',
            'creatine': 'Performance',
            'coq10': 'Antioxidants',
            'nac': 'Amino Acids',
            'alpha-gpc': 'Cognitive Support',
            'phosphatidylserine': 'Brain Health'
        };
        return categories[slug] || 'Supplements';
    };
    const fetchPendingProducts = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            // Mock data - in real implementation, this would come from your API
            const mockProducts = [
                {
                    id: '1',
                    name: `${(supplementInfo === null || supplementInfo === void 0 ? void 0 : supplementInfo.name) || 'Supplement'} Capsules`,
                    brand: 'NOW Foods',
                    price: 19.99,
                    rating: 4.6,
                    reviewCount: 156,
                    image: `/images/supplements/${slug}.jpg`,
                    url: 'https://example.com/product1',
                    description: `High-quality ${(supplementInfo === null || supplementInfo === void 0 ? void 0 : supplementInfo.name) || 'supplement'} capsules, 60 count`,
                    qualityScore: 88,
                    qualityReasons: ['Third-party tested', 'Good bioavailability', 'Proper dosage'],
                    qualityWarnings: [],
                    formulationMatch: 'Modern Capsule',
                    approach: 'modern',
                    selected: false
                },
                {
                    id: '2',
                    name: `${(supplementInfo === null || supplementInfo === void 0 ? void 0 : supplementInfo.name) || 'Supplement'} Powder`,
                    brand: 'Bulk Supplements',
                    price: 15.99,
                    rating: 4.3,
                    reviewCount: 89,
                    image: `/images/supplements/${slug}-powder.jpg`,
                    url: 'https://example.com/product2',
                    description: `Pure ${(supplementInfo === null || supplementInfo === void 0 ? void 0 : supplementInfo.name) || 'supplement'} powder, 100g`,
                    qualityScore: 82,
                    qualityReasons: ['Pure powder', 'Good value', 'No fillers'],
                    qualityWarnings: ['No third-party testing'],
                    formulationMatch: 'Pure Powder',
                    approach: 'traditional',
                    selected: false
                },
                {
                    id: '3',
                    name: `${(supplementInfo === null || supplementInfo === void 0 ? void 0 : supplementInfo.name) || 'Supplement'} Liquid`,
                    brand: 'Nature\'s Bounty',
                    price: 22.99,
                    rating: 4.4,
                    reviewCount: 203,
                    image: `/images/supplements/${slug}-liquid.jpg`,
                    url: 'https://example.com/product3',
                    description: `Liquid ${(supplementInfo === null || supplementInfo === void 0 ? void 0 : supplementInfo.name) || 'supplement'}, fast absorption`,
                    qualityScore: 79,
                    qualityReasons: ['Fast absorption', 'Easy to take'],
                    qualityWarnings: ['Contains artificial flavors'],
                    formulationMatch: 'Liquid Formulation',
                    approach: 'modern',
                    selected: false
                }
            ];
            setPendingProducts(mockProducts);
        }
        catch (error) {
            console.error('Error fetching pending products:', error);
        }
        finally {
            setLoading(false);
        }
    }), [slug, supplementInfo === null || supplementInfo === void 0 ? void 0 : supplementInfo.name]);
    useEffect(() => {
        fetchSupplementInfo();
        fetchPendingProducts();
    }, [slug, fetchSupplementInfo, fetchPendingProducts]);
    const handleProductSelection = (productId) => {
        setSelectedProducts(prev => prev.includes(productId)
            ? prev.filter(id => id !== productId)
            : [...prev, productId]);
    };
    const handleApproveProducts = () => __awaiter(this, void 0, void 0, function* () {
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
            yield new Promise(resolve => setTimeout(resolve, 1000));
            // Remove approved products from pending list
            setPendingProducts(prev => prev.filter(product => !selectedProducts.includes(product.id)));
            setSelectedProducts([]);
            alert(`${selectedProducts.length} products approved successfully!`);
        }
        catch (error) {
            console.error('Error approving products:', error);
            alert('Error approving products');
        }
        finally {
            setApproving(false);
        }
    });
    const handleRejectProducts = () => __awaiter(this, void 0, void 0, function* () {
        if (selectedProducts.length === 0) {
            alert('Please select products to reject');
            return;
        }
        setRejecting(true);
        try {
            // In real implementation, this would mark the selected products as rejected
            console.log('Rejecting products:', selectedProducts);
            // Simulate API call
            yield new Promise(resolve => setTimeout(resolve, 1000));
            // Remove rejected products from pending list
            setPendingProducts(prev => prev.filter(product => !selectedProducts.includes(product.id)));
            setSelectedProducts([]);
            alert(`${selectedProducts.length} products rejected successfully!`);
        }
        catch (error) {
            console.error('Error rejecting products:', error);
            alert('Error rejecting products');
        }
        finally {
            setRejecting(false);
        }
    });
    const getQualityScoreColor = (score) => {
        if (score >= 80)
            return 'text-green-700 bg-green-100 border border-green-200';
        if (score >= 60)
            return 'text-yellow-700 bg-yellow-100 border border-yellow-200';
        return 'text-red-700 bg-red-100 border border-red-200';
    };
    const getApproachColor = (approach) => {
        switch (approach) {
            case 'traditional': return 'bg-green-100 text-green-800 border border-green-200';
            case 'modern': return 'bg-purple-100 text-purple-800 border border-purple-200';
            case 'both': return 'bg-blue-100 text-blue-800 border border-blue-200';
            default: return 'bg-gray-100 text-gray-800 border border-gray-200';
        }
    };
    if (loading) {
        return (<div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading supplement information...</p>
          </div>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/admin/product-hunt" className="text-blue-600 hover:text-blue-800 font-medium">
              ← Back to Product Hunt
            </Link>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {supplementInfo === null || supplementInfo === void 0 ? void 0 : supplementInfo.name}
              </h1>
              {(supplementInfo === null || supplementInfo === void 0 ? void 0 : supplementInfo.category) && (<p className="text-lg text-blue-600 font-medium">{supplementInfo.category}</p>)}
              <p className="text-gray-600 mt-2">{supplementInfo === null || supplementInfo === void 0 ? void 0 : supplementInfo.description}</p>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-600">Pending Products</p>
              <p className="text-3xl font-bold text-red-600">{pendingProducts.length}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {selectedProducts.length > 0 && (<div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between">
              <p className="text-gray-700">
                {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
              </p>
              <div className="flex space-x-4">
                <button onClick={handleRejectProducts} disabled={rejecting} className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition font-medium disabled:opacity-50">
                  {rejecting ? 'Rejecting...' : `Reject Selected (${selectedProducts.length})`}
                </button>
                <button onClick={handleApproveProducts} disabled={approving} className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition font-medium disabled:opacity-50">
                  {approving ? 'Approving...' : `Approve Selected (${selectedProducts.length})`}
                </button>
              </div>
            </div>
          </div>)}

        {/* Products Grid */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              Pending Products ({pendingProducts.length})
            </h2>
            <div className="flex space-x-2">
              <button onClick={() => setSelectedProducts(pendingProducts.map(p => p.id))} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Select All
              </button>
              <button onClick={() => setSelectedProducts([])} className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                Clear Selection
              </button>
            </div>
          </div>

          {pendingProducts.length === 0 ? (<div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <p className="text-gray-600">No pending products for this supplement.</p>
              <p className="text-sm text-gray-500 mt-2">All products have been reviewed.</p>
            </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingProducts.map((product) => (<div key={product.id} className={`border rounded-lg p-6 hover:shadow-lg transition ${selectedProducts.includes(product.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  {/* Product Image */}
                  <div className="mb-4">
                    <Image src={product.image || '/images/placeholder-product.jpg'} alt={product.name} width={200} height={120} className="w-full h-48 object-cover rounded-md"/>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.brand}</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm text-gray-700 font-medium">{product.rating}</span>
                        <span className="text-xs text-gray-600">({product.reviewCount})</span>
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
                    {product.qualityReasons.length > 0 && (<div>
                        <p className="text-xs font-semibold text-gray-700 mb-1">Strengths:</p>
                        <ul className="text-xs text-green-700 space-y-1">
                          {product.qualityReasons.map((reason, index) => (<li key={index}>• {reason}</li>))}
                        </ul>
                      </div>)}

                    {/* Quality Warnings */}
                    {product.qualityWarnings.length > 0 && (<div>
                        <p className="text-xs font-semibold text-gray-700 mb-1">Concerns:</p>
                        <ul className="text-xs text-red-700 space-y-1">
                          {product.qualityWarnings.map((warning, index) => (<li key={index}>• {warning}</li>))}
                        </ul>
                      </div>)}

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-3">
                      <button onClick={() => handleProductSelection(product.id)} className={`flex-1 px-3 py-2 rounded text-sm font-medium transition ${selectedProducts.includes(product.id)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                        {selectedProducts.includes(product.id) ? 'Selected' : 'Select'}
                      </button>
                      <a href={product.url} target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-300 transition">
                        View
                      </a>
                    </div>
                  </div>
                </div>))}
            </div>)}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex gap-4">
          <Link href="/admin/product-hunt" className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition font-medium">
            Back to Product Hunt
          </Link>
          <Link href="/admin/quality-specifications" className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition font-medium">
            Manage Quality Specs
          </Link>
        </div>
      </div>
    </div>);
}
