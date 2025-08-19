'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ScrapedProduct {
  name: string;
  price: string;
  image: string;
  description: string;
  url: string;
  rawData: any;
}

export default function ProductScraperPage() {
  const [url, setUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapedProduct, setScrapedProduct] = useState<ScrapedProduct | null>(null);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [maxResults, setMaxResults] = useState(5);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);
  
  // Amazon Search state
  const [amazonSearchTerm, setAmazonSearchTerm] = useState('');
  const [amazonMaxResults, setAmazonMaxResults] = useState(10);
  const [isAmazonSearching, setIsAmazonSearching] = useState(false);
  const [amazonSearchResults, setAmazonSearchResults] = useState<any>(null);

  const handleScrape = async () => {
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setIsScraping(true);
    setError('');
    setScrapedProduct(null);

    try {
      const response = await fetch('/api/product-scraper/simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to scrape product');
      }

      const data = await response.json();
      setScrapedProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsScraping(false);
    }
  };

  const handleSave = async () => {
    if (!scrapedProduct) return;

    try {
      const response = await fetch('/api/product-scraper/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scrapedProduct),
      });

      if (!response.ok) {
        throw new Error('Failed to save product');
      }

      alert('Product saved successfully!');
      setScrapedProduct(null);
      setUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product');
    }
  };

  // Stealth search handler
  const handleStealthSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    setIsSearching(true);
    setError('');
    setSearchResults(null);

    try {
      const response = await fetch('/api/product-scraper/target-search-stealth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchTerm, maxResults }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Search failed');
      }

      const data = await response.json();
      setSearchResults(data);
      console.log('🔍 Stealth search results:', data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  // Stealth batch processing handler
  const handleStealthBatch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    setIsSearching(true);
    setError('');
    setSearchResults(null);

    try {
      const response = await fetch('/api/product-scraper/target-batch-stealth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchTerm, maxResults }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Batch processing failed');
      }

      const data = await response.json();
      setSearchResults(data);
      console.log('🚀 Stealth batch results:', data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Batch processing failed');
    } finally {
      setIsSearching(false);
    }
  };

  // Category Browser state
  const [categoryUrl, setCategoryUrl] = useState('');
  const [maxCategoryProducts, setMaxCategoryProducts] = useState(15);
  const [isBrowsing, setIsBrowsing] = useState(false);
  const [categoryResults, setCategoryResults] = useState<any>(null);

  // Amazon Search handler
  const handleAmazonSearch = async () => {
    if (!amazonSearchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    setIsAmazonSearching(true);
    setError('');
    setAmazonSearchResults(null);

    try {
      const response = await fetch('/api/product-scraper/amazon-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          searchTerm: amazonSearchTerm, 
          maxResults: amazonMaxResults 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Amazon search failed');
      }

      const data = await response.json();
      setAmazonSearchResults(data);
      console.log('🛒 Amazon Search results:', data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Amazon search failed');
    } finally {
      setIsAmazonSearching(false);
    }
  };

  // Category Browser handler
  const handleCategoryBrowse = async () => {
    if (!categoryUrl.trim()) {
      setError('Please enter a category URL');
      return;
    }

    setIsBrowsing(true);
    setError('');
    setCategoryResults(null);

    try {
      const response = await fetch('/api/product-scraper/target-category-browser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryUrl, maxProducts: maxCategoryProducts }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Category browsing failed');
      }

      const data = await response.json();
      setCategoryResults(data);
      console.log('🎯 Category Browser results:', data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Category browsing failed');
    } finally {
      setIsBrowsing(false);
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
        <div className="rounded-xl p-8 shadow-sm border-2 border-gray-300 mb-8 bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="flex items-center justify-between mb-6">
            <Link href="/admin" 
                  className="text-gray-600 hover:text-gray-800 transition-colors">
              <span className="material-symbols-outlined text-2xl">keyboard_backspace</span>
            </Link>
            <h1 className="text-4xl font-bold text-gray-800 flex-1 text-center">Product Data Scraper</h1>
            <div className="w-10"></div>
          </div>
          
          {/* Nine Worlds Scraper Link */}
          <div className="text-center mb-6">
            <Link href="/admin/data-hub" 
                  className="inline-flex items-center px-6 py-3 rounded-full font-semibold border-2 transition-all duration-200 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-500 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:scale-105">
              🌍 Launch Nine Worlds Scraper
              <span className="ml-2 text-sm opacity-90">→</span>
            </Link>
            <p className="text-gray-600 mt-2 text-sm">
              Automated scraping across all 9 working sites using database search terms
            </p>
          </div>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Extract product information from e-commerce URLs to build your affiliate product database.
          </p>
        </div>

        {/* URL Input Section */}
        <div className="rounded-xl p-6 shadow-sm border-2 border-gray-300 mb-6" style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
          <h2 className="text-xl font-semibold mb-2 text-gray-900">URL Input</h2>
          <p className="text-gray-700 mb-4">
            Paste a product URL from supported e-commerce sites (Amazon, iHerb, Vitacost, etc.)
          </p>
          <div className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-900 mb-1">
                Product URL
              </label>
              <input
                id="url"
                type="url"
                placeholder="https://www.amazon.com/product/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                onFocus={() => {
                  // Clear any debug info that might have been accidentally pasted
                  if (url.includes('Debug Information')) {
                    setUrl('');
                  }
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-start">
              <button 
                onClick={handleScrape} 
                disabled={isScraping || !url.trim()}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isScraping ? 'Scraping...' : 'Extract Product Data'}
              </button>
              
              <button
                onClick={async () => {
                  if (!url.trim() || !url.includes('vitacost')) return;
                  setIsScraping(true);
                  setError('');
                  setScrapedProduct(null);
                  try {
                    const response = await fetch('/api/product-scraper/vitacost-refined', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ url }),
                    });

                    if (!response.ok) {
                      const errorData = await response.json();
                      throw new Error(errorData.error || 'Failed to scrape product');
                    }

                    const data = await response.json();
                    setScrapedProduct(data);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'An error occurred');
                  } finally {
                    setIsScraping(false);
                  }
                }}
                disabled={isScraping || !url.trim() || !url.includes('vitacost')}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                title="Refined Vitacost scraper with better price detection, image URL fixing, and description targeting"
              >
                Vitacost Refined
              </button>
              
              <button
                onClick={async () => {
                  console.log('🔍 Target Refined button clicked');
                  console.log('🔍 URL being sent:', url);
                  if (!url.trim() || !url.includes('target')) return;
                  setIsScraping(true);
                  setError('');
                  setScrapedProduct(null);
                  try {
                    console.log('🔍 Calling /api/product-scraper/target-refined');
                    const response = await fetch('/api/product-scraper/target-refined', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ url }),
                    });

                    console.log('🔍 Response status:', response.status);
                    if (!response.ok) {
                      const errorData = await response.json();
                      console.log('🔍 Error response:', errorData);
                      throw new Error(errorData.error || 'Failed to scrape product');
                    }

                    const data = await response.json();
                    console.log('🔍 Success response:', data);
                    setScrapedProduct(data);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'An error occurred');
                  } finally {
                    setIsScraping(false);
                  }
                }}
                disabled={isScraping || !url.trim() || !url.includes('target')}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                title="Refined Target scraper with comprehensive filtering and Target-specific extraction patterns"
              >
                Target Refined
              </button>
              

              
              <button 
                onClick={async () => {
                  if (!url.trim()) return;
                  setIsScraping(true);
                  setError('');
                  setDebugInfo(null);
                  try {
                    const response = await fetch('/api/product-scraper/debug', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ url }),
                    });
                    const data = await response.json();
                    setDebugInfo(data);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Debug failed');
                  } finally {
                    setIsScraping(false);
                  }
                }}
                disabled={isScraping || !url.trim()}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
              >
                Debug
              </button>
              <button 
                onClick={async () => {
                  if (!url.trim() || !url.includes('amazon')) return;
                  setIsScraping(true);
                  setError('');
                  setDebugInfo(null);
                  try {
                    const response = await fetch('/api/product-scraper/amazon-test', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ url }),
                    });
                    const data = await response.json();
                    setDebugInfo(data);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Amazon test failed');
                  } finally {
                    setIsScraping(false);
                  }
                }}
                disabled={isScraping || !url.trim() || !url.includes('amazon')}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                title="Test different approaches for Amazon URLs"
              >
                Amazon Test
              </button>
              <button 
                onClick={async () => {
                  if (!url.trim() || !url.includes('amazon')) return;
                  setIsScraping(true);
                  setError('');
                  setDebugInfo(null);
                  try {
                    const response = await fetch('/api/product-scraper/amazon-advanced', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ url }),
                    });
                    const data = await response.json();
                    setDebugInfo(data);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Advanced Amazon test failed');
                  } finally {
                    setIsScraping(false);
                  }
                }}
                disabled={isScraping || !url.trim() || !url.includes('amazon')}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                title="Advanced Amazon testing with multiple approaches"
              >
                Advanced
              </button>
              <button 
                onClick={async () => {
                  if (!url.trim()) return;
                  setIsScraping(true);
                  setError('');
                  setScrapedProduct(null);
                  try {
                    const response = await fetch('/api/product-scraper/amazon-mobile', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ url }),
                    });
                    if (!response.ok) {
                      const errorData = await response.json();
                      throw new Error(errorData.error || 'Failed to scrape product');
                    }
                    const data = await response.json();
                    setScrapedProduct(data);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Mobile scrape failed');
                  } finally {
                    setIsScraping(false);
                  }
                }}
                disabled={isScraping || !url.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                title="Use mobile approach to scrape products (works well for many sites)"
              >
                Mobile Scrape
              </button>
              <button 
                onClick={async () => {
                  if (!url.trim()) return;
                  setIsScraping(true);
                  setError('');
                  setDebugInfo(null);
                  try {
                    const response = await fetch('/api/product-scraper/amazon-debug-html', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ url }),
                    });
                    const data = await response.json();
                    setDebugInfo(data);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'HTML debug failed');
                  } finally {
                    setIsScraping(false);
                  }
                }}
                disabled={isScraping || !url.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                title="Analyze HTML structure to find correct price and image patterns"
              >
                HTML Debug
              </button>
              <button 
                onClick={async () => {
                  if (!url.trim()) return;
                  setIsScraping(true);
                  setError('');
                  setDebugInfo(null);
                  try {
                    const response = await fetch('/api/product-scraper/amazon-json-debug', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ url }),
                    });
                    const data = await response.json();
                    setDebugInfo(data);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'JSON debug failed');
                  } finally {
                    setIsScraping(false);
                  }
                }}
                disabled={isScraping || !url.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                title="Analyze JSON data blocks to find price and product information"
              >
                JSON Debug
              </button>
              <button 
                onClick={async () => {
                  if (!url.trim()) return;
                  setIsScraping(true);
                  setError('');
                  setDebugInfo(null);
                  try {
                    const response = await fetch('/api/product-scraper/amazon-js-debug', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ url }),
                    });
                    const data = await response.json();
                    setDebugInfo(data);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'JavaScript debug failed');
                  } finally {
                    setIsScraping(false);
                  }
                }}
                disabled={isScraping || !url.trim()}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                title="Analyze JavaScript variables and functions for price data"
              >
                JS Debug
              </button>
              <button 
                onClick={async () => {
                  if (!url.trim()) return;
                  setIsScraping(true);
                  setError('');
                  setScrapedProduct(null);
                  try {
                    const response = await fetch('/api/product-scraper/amazon-puppeteer', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ url }),
                    });
                    if (!response.ok) {
                      const errorData = await response.json();
                      throw new Error(errorData.error || 'Failed to scrape product');
                    }
                    const data = await response.json();
                    setScrapedProduct(data);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Puppeteer scrape failed');
                  } finally {
                    setIsScraping(false);
                  }
                }}
                disabled={isScraping || !url.trim()}
                className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                title="Use Puppeteer to handle dynamic content and bypass bot detection (works for most sites)"
              >
                Puppeteer
              </button>
              <button 
                onClick={async () => {
                  if (!url.trim()) return;
                  setIsScraping(true);
                  setError('');
                  setScrapedProduct(null);
                  try {
                    const response = await fetch('/api/product-scraper/amazon-simple-fallback', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ url }),
                    });
                    if (!response.ok) {
                      const errorData = await response.json();
                      throw new Error(errorData.error || 'Failed to scrape product');
                    }
                    const data = await response.json();
                    setScrapedProduct(data);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Simple Fallback scrape failed');
                  } finally {
                    setIsScraping(false);
                  }
                }}
                disabled={isScraping || !url.trim()}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                title="Use simple fetch with multiple user agents as fallback (good for basic sites)"
              >
                Simple Fallback
              </button>
              <button 
                onClick={async () => {
                  if (!url.trim()) return;
                  setIsScraping(true);
                  setError('');
                  setScrapedProduct(null);
                  try {
                    const response = await fetch('/api/product-scraper/amazon-ultra-simple', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ url }),
                    });
                    if (!response.ok) {
                      const errorData = await response.json();
                      throw new Error(errorData.error || 'Failed to scrape product');
                    }
                    const data = await response.json();
                    setScrapedProduct(data);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Ultra Simple scrape failed');
                  } finally {
                    setIsScraping(false);
                  }
                }}
                disabled={isScraping || !url.trim()}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                title="Ultra simple fetch-based scraper with multiple approaches (excellent for Amazon)"
              >
                Ultra Simple
              </button>

            </div>
          </div>
        </div>

        {/* Search Section - Stealth Mode */}
        <div className="rounded-xl p-6 shadow-sm border-2 border-gray-300 mb-6" style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
          <h2 className="text-xl font-semibold mb-2 text-gray-900">🔍 Search & Batch Processing - Stealth Mode</h2>
          <p className="text-gray-700 mb-4">
            Search for products by term and process them with anti-detection measures. Use this for bulk product discovery.
          </p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-900 mb-1">
                  Search Term
                </label>
                <input
                  id="searchTerm"
                  type="text"
                  placeholder="e.g., st johns wort, ashwagandha, valerian root"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>
              <div>
                <label htmlFor="maxResults" className="block text-sm font-medium text-gray-900 mb-1">
                  Max Results
                </label>
                <select
                  id="maxResults"
                  value={maxResults}
                  onChange={(e) => setMaxResults(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                >
                  <option value={3}>3 products</option>
                  <option value={5}>5 products</option>
                  <option value={10}>10 products</option>
                  <option value={15}>15 products</option>
                </select>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-start">
              <button 
                onClick={handleStealthSearch}
                disabled={isSearching || !searchTerm.trim()}
                className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                title="Stealth search with anti-detection measures"
              >
                {isSearching ? 'Searching...' : '🔍 Stealth Search'}
              </button>
              
              <button 
                onClick={handleStealthBatch}
                disabled={isSearching || !searchTerm.trim()}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                title="Complete stealth batch processing - search + scrape all products"
              >
                {isSearching ? 'Processing...' : '🚀 Stealth Batch'}
              </button>
            </div>
          </div>
        </div>

        {/* Category Browser Section - Target Diversity */}
        <div className="rounded-xl p-6 shadow-sm border-2 border-gray-300 mb-6" style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
          <h2 className="text-xl font-semibold mb-2 text-gray-900">🎯 Target Category Browser - Product Diversity</h2>
          <p className="text-gray-700 mb-4">
            Browse Target categories to find diverse product types (tinctures, capsules, powders) instead of just gummies. 
            This solves the product diversity issue by exploring category pages directly.
          </p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="categoryUrl" className="block text-sm font-medium text-gray-900 mb-1">
                  Category URL
                </label>
                <input
                  id="categoryUrl"
                  type="url"
                  placeholder="https://www.target.com/c/herbal-supplements/-/N-5q0f9"
                  value={categoryUrl}
                  onChange={(e) => setCategoryUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Use Target category URLs like: Herbal Supplements, Vitamins & Supplements, etc.
                </p>
              </div>
              <div>
                <label htmlFor="maxCategoryProducts" className="block text-sm font-medium text-gray-900 mb-1">
                  Max Products
                </label>
                <select
                  id="maxCategoryProducts"
                  value={maxCategoryProducts}
                  onChange={(e) => setMaxCategoryProducts(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                >
                  <option value={10}>10 products</option>
                  <option value={15}>15 products</option>
                  <option value={20}>20 products</option>
                  <option value={25}>25 products</option>
                </select>
                <p className="text-xs text-gray-600 mt-1">
                  Higher numbers = more diverse product types
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-start">
              <button 
                onClick={handleCategoryBrowse}
                disabled={isBrowsing || !categoryUrl.trim()}
                className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                title="Browse Target categories to find diverse product types"
              >
                {isBrowsing ? 'Browsing...' : '🎯 Browse Category'}
              </button>
              
              <button
                onClick={() => {
                  setCategoryUrl('https://www.target.com/c/herbal-supplements/-/N-5q0f9');
                  setMaxCategoryProducts(15);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200"
                title="Quick setup for Herbal Supplements category"
              >
                🍃 Herbal Supplements
              </button>
              
              <button
                onClick={() => {
                  setCategoryUrl('https://www.target.com/c/vitamins-supplements/-/N-5q0f8');
                  setMaxCategoryProducts(15);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200"
                title="Quick setup for Vitamins & Supplements category"
              >
                💊 Vitamins & Supplements
              </button>
            </div>
          </div>
        </div>

        {/* Amazon Search Section */}
        <div className="rounded-xl p-6 shadow-sm border-2 border-orange-300 mb-6 bg-gradient-to-br from-orange-50 to-orange-100">
          <h2 className="text-xl font-semibold mb-2 text-black">🛒 Amazon Search - Diverse Product Discovery</h2>
          <p className="mb-4 text-black">
            Search Amazon for diverse ashwagandha products (tinctures, capsules, powders, gummies) using our working Amazon scraper.
          </p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="amazonSearchTerm" className="block text-sm font-medium mb-1 text-black">
                  Amazon Search Term
                </label>
                <input
                  id="amazonSearchTerm"
                  type="text"
                  placeholder="e.g., ashwagandha supplements, ashwagandha tincture"
                  value={amazonSearchTerm}
                  onChange={(e) => setAmazonSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                />
              </div>
              <div>
                <label htmlFor="amazonMaxResults" className="block text-sm font-medium mb-1 text-black">
                  Max Results
                </label>
                <select
                  id="amazonMaxResults"
                  value={amazonMaxResults}
                  onChange={(e) => setAmazonMaxResults(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                >
                  <option value={5}>5 products</option>
                  <option value={10}>10 products</option>
                  <option value={15}>15 products</option>
                  <option value={20}>20 products</option>
                </select>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-start">
              <button 
                onClick={handleAmazonSearch}
                disabled={isAmazonSearching || !amazonSearchTerm.trim()}
                className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                title="Search Amazon for diverse ashwagandha products"
              >
                {isAmazonSearching ? 'Searching...' : '🔍 Amazon Search'}
              </button>
              
              <button
                onClick={() => {
                  setAmazonSearchTerm('ashwagandha supplements');
                  setAmazonMaxResults(15);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200"
                title="Quick setup for ashwagandha supplements search"
              >
                🍃 Ashwagandha Supplements
              </button>
              
              <button
                onClick={() => {
                  setAmazonSearchTerm('ashwagandha tincture');
                  setAmazonMaxResults(10);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200"
                title="Quick setup for ashwagandha tinctures search"
              >
                💧 Ashwagandha Tinctures
              </button>
            </div>
          </div>
        </div>

        {/* Amazon Search Results Display */}
        {amazonSearchResults && (
          <div className="rounded-xl p-6 shadow-sm border-2 border-orange-200 mb-6 bg-gradient-to-br from-yellow-50 to-yellow-100">
            <h3 className="text-lg font-semibold mb-4 text-black">🛒 Amazon Search Results</h3>
            
            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-black">
                <div><strong>Search Term:</strong> {amazonSearchResults.searchTerm}</div>
                <div><strong>Total Found:</strong> {amazonSearchResults.totalFound}</div>
                <div><strong>Results:</strong> {amazonSearchResults.results?.length || 0}</div>
                <div><strong>Status:</strong> {amazonSearchResults.success ? '✅ Success' : '❌ Failed'}</div>
              </div>
            </div>

            {amazonSearchResults.results && amazonSearchResults.results.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-semibold mb-3 text-black">📦 Found Products</h4>
                {amazonSearchResults.results.map((result: any, index: number) => (
                  <div key={index} className="p-4 bg-white border border-orange-200 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="font-medium text-black">{result.title || `Product ${index + 1}`}</div>
                        <div className="text-sm mt-1 text-black">
                          <div><strong>URL:</strong> <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{result.url}</a></div>
                          <div><strong>Price:</strong> {result.price || 'Not found'}</div>
                          <div><strong>Image:</strong> {result.imageUrl ? '✅ Available' : '❌ Not found'}</div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button 
                          onClick={() => {
                            setUrl(result.url);
                            setAmazonSearchResults(null);
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all duration-200"
                          title="Use this URL for individual product scraping"
                        >
                          🎯 Scrape This Product
                        </button>
                        <button 
                          onClick={() => {
                            setUrl(result.url);
                            setAmazonSearchResults(null);
                            // Auto-trigger Amazon Ultra Simple scraper
                            setTimeout(() => {
                              const amazonButton = document.querySelector('button[title*="Ultra simple"]') as HTMLButtonElement;
                              if (amazonButton) amazonButton.click();
                            }, 100);
                          }}
                          className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-all duration-200"
                          title="Auto-scrape with Amazon Ultra Simple"
                        >
                          🚀 Auto-Scrape
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <button 
                onClick={() => setAmazonSearchResults(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-all duration-200"
              >
                Clear Results
              </button>
            </div>
          </div>
        )}

        {/* Search Results Display */}
        {searchResults && (
          <div className="rounded-xl p-6 shadow-sm border-2 border-green-200 mb-6" style={{background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)'}}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 Search Results</h3>
            
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div><strong>Search Term:</strong> {searchResults.searchTerm}</div>
                <div><strong>Method:</strong> {searchResults.method}</div>
                <div><strong>Total Found:</strong> {searchResults.totalFound}</div>
                <div><strong>Successfully Processed:</strong> {searchResults.successfullyProcessed || searchResults.totalFound}</div>
              </div>
            </div>



            {searchResults.products && searchResults.products.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">📦 Processed Products</h4>
                {searchResults.products.map((product: any, index: number) => (
                  <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="font-medium text-gray-900">{product.name || `Product ${index + 1}`}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          <div><strong>Price:</strong> {product.price || 'Not found'}</div>
                          <div><strong>Processing Order:</strong> {product.processingOrder || 'N/A'}</div>
                          <div><strong>Scraped At:</strong> {new Date(product.scrapedAt).toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div><strong>URL:</strong> <a href={product.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{product.url}</a></div>
                        {product.image && (
                          <div className="mt-2">
                            <strong>Image:</strong> <a href={product.image} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{product.image}</a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {searchResults.results && searchResults.results.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">🔗 Product URLs Found</h4>
                {searchResults.results.map((result: any, index: number) => (
                  <div key={index} className="p-3 bg-white border border-gray-200 rounded">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{result.title}</div>
                        <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm break-all">{result.url}</a>
                      </div>
                      <button
                        onClick={async () => {
                          setUrl(result.url);
                          setScrapedProduct(null);
                          setError('');
                        }}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        Scrape This
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {searchResults.errorDetails && searchResults.errorDetails.length > 0 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                <h4 className="font-semibold text-red-800 mb-2">❌ Errors ({searchResults.errorDetails.length})</h4>
                {searchResults.errorDetails.map((error: any, index: number) => (
                  <div key={index} className="text-sm text-red-700 mb-1">
                    <strong>URL:</strong> {error.url} - <strong>Error:</strong> {error.error}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setSearchResults(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Clear Results
              </button>
            </div>
          </div>
        )}




        {/* Category Results Display - SECOND DUPLICATE - REMOVE THIS */}
        {categoryResults && (
          <div className="rounded-xl p-6 shadow-sm border-2 border-emerald-200 mb-6" style={{background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)'}}>
            <h3 className="text-2xl font-bold text-black mb-4">🎯 Category Browser Results</h3>
            
            {/* Diversity Analysis */}
            <div style={{marginBottom: '16px', padding: '16px', backgroundColor: 'white', border: '2px solid #10b981', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'}}>
              <h4 style={{fontSize: '20px', fontWeight: 'bold', color: 'black', marginBottom: '12px'}}>📊 Product Diversity Analysis</h4>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '14px'}}>
                <div style={{color: 'black'}}><strong>Total Products:</strong> {categoryResults.totalProducts}</div>
                <div style={{color: 'black'}}><strong>Diversity Score:</strong> {categoryResults.diversityScore}/6</div>
                <div style={{color: 'black'}}><strong>Recommendation:</strong> {categoryResults.diversityAnalysis?.recommendation}</div>
                <div style={{color: 'black'}}><strong>Category URL:</strong> <a href={categoryResults.categoryUrl} target="_blank" rel="noopener noreferrer" style={{color: '#1d4ed8', textDecoration: 'underline'}}>View Category</a></div>
              </div>
              
              {/* Product Type Breakdown */}
              <div style={{marginTop: '16px', padding: '16px', backgroundColor: '#f9fafb', border: '2px solid #d1d5db', borderRadius: '8px'}}>
                <h5 style={{fontSize: '18px', fontWeight: 'bold', color: 'black', marginBottom: '12px'}}>Product Types Found:</h5>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', fontSize: '14px'}}>
                  <div style={{padding: '12px', borderRadius: '8px', border: '2px solid', color: 'black', backgroundColor: categoryResults.diversityAnalysis?.hasGummies ? '#dcfce7' : '#f3f4f6', borderColor: categoryResults.diversityAnalysis?.hasGummies ? '#22c55e' : '#9ca3af'}}>
                    <strong>Gummies:</strong> {categoryResults.productTypes?.Gummies || 0}
                  </div>
                  <div style={{padding: '12px', borderRadius: '8px', border: '2px solid', color: 'black', backgroundColor: categoryResults.diversityAnalysis?.hasCapsules ? '#dbeafe' : '#f3f4f6', borderColor: categoryResults.diversityAnalysis?.hasCapsules ? '#3b82f6' : '#9ca3af'}}>
                    <strong>Capsules:</strong> {categoryResults.productTypes?.Capsules || 0}
                  </div>
                  <div style={{padding: '12px', borderRadius: '8px', border: '2px solid', color: 'black', backgroundColor: categoryResults.diversityAnalysis?.hasTinctures ? '#f3e8ff' : '#f3f4f6', borderColor: categoryResults.diversityAnalysis?.hasTinctures ? '#a855f7' : '#9ca3af'}}>
                    <strong>Tinctures:</strong> {categoryResults.productTypes?.Tinctures || 0}
                  </div>
                  <div style={{padding: '12px', borderRadius: '8px', border: '2px solid', color: 'black', backgroundColor: categoryResults.diversityAnalysis?.hasPowders ? '#d1fae5' : '#f3f4f6', borderColor: categoryResults.diversityAnalysis?.hasPowders ? '#10b981' : '#9ca3af'}}>
                    <strong>Powders:</strong> {categoryResults.productTypes?.Powders || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Products List */}
            {categoryResults.products && categoryResults.products.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-black">📦 Products Found</h4>
                {categoryResults.products.map((product: any, index: number) => (
                  <div key={index} className="p-4 bg-white border-2 border-gray-300 rounded-lg shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <div style={{color: 'black', fontSize: '18px', fontWeight: 'bold'}} className="mb-2">{product.name}</div>
                        <div style={{color: 'black', fontSize: '14px'}} className="space-y-2">
                          <div><strong>Price:</strong> <span style={{color: '#15803d', fontWeight: '600'}}>{product.price}</span></div>
                          <div><strong>Type:</strong> <span style={{padding: '8px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', border: '2px solid', color: 'black', backgroundColor: product.productType === 'Gummies' ? '#fef3c7' : product.productType === 'Capsules' ? '#dbeafe' : product.productType === 'Tinctures' ? '#f3e8ff' : product.productType === 'Powders' ? '#d1fae5' : '#f3f4f6', borderColor: product.productType === 'Gummies' ? '#eab308' : product.productType === 'Capsules' ? '#3b82f6' : product.productType === 'Tinctures' ? '#a855f7' : product.productType === 'Powders' ? '#10b981' : '#9ca3af'}}>{product.productType}</span></div>
                          {product.description && <div><strong>Description:</strong> <span style={{color: '#1f2937'}}>{product.description.substring(0, 100)}...</span></div>}
                        </div>
                      </div>
                      <div style={{color: 'black', fontSize: '14px'}}>
                        <div className="mb-3">
                          <strong>URL:</strong> <a href={product.url} target="_blank" rel="noopener noreferrer" style={{color: '#1d4ed8', textDecoration: 'underline'}} className="break-all font-medium">{product.url}</a>
                        </div>
                        {product.image && (
                          <div className="mb-3">
                            <strong>Image:</strong> <a href={product.image} target="_blank" rel="noopener noreferrer" style={{color: '#1d4ed8', textDecoration: 'underline'}} className="break-all font-medium">{product.image}</a>
                          </div>
                        )}
                        <div className="mt-3">
                          <button
                            onClick={() => {
                              setUrl(product.url);
                              setScrapedProduct(null);
                              setError('');
                            }}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                          >
                            Scrape This Product
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setCategoryResults(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Clear Results
              </button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="rounded-xl p-4 shadow-sm border-2 border-red-200 mb-6" style={{background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 50%, #fecaca 100%)'}}>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Debug Information */}
        {debugInfo && (
          <div className="rounded-xl p-6 shadow-sm border-2 border-blue-200 mb-6" style={{background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #bfdbfe 100%)'}}>
            <h3 className="text-lg font-semibold text-black mb-2">Debug Information</h3>
            <div className="space-y-2 text-sm text-black">
              <div><strong>URL:</strong> {debugInfo.url}</div>
              {debugInfo.hostname && <div><strong>Hostname:</strong> {debugInfo.hostname}</div>}
              <div><strong>Status:</strong> {debugInfo.success ? '✅ Success' : '❌ Failed'}</div>
              {debugInfo.asin && <div><strong>ASIN:</strong> {debugInfo.asin}</div>}
              {debugInfo.htmlLength && <div><strong>HTML Length:</strong> {debugInfo.htmlLength.toLocaleString()} characters</div>}
              {debugInfo.title && <div><strong>Title:</strong> {debugInfo.title}</div>}
              {debugInfo.price && <div><strong>Price Found:</strong> {debugInfo.price}</div>}
              {debugInfo.isProductPage !== undefined && <div><strong>Looks like Product Page:</strong> {debugInfo.isProductPage ? '✅ Yes' : '❌ No'}</div>}
              {debugInfo.hasProductInfo !== undefined && <div><strong>Has Product Info:</strong> {debugInfo.hasProductInfo ? '✅ Yes' : '❌ No'}</div>}
              {debugInfo.analysis && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <div><strong>Best Approach:</strong> {debugInfo.analysis.bestApproach}</div>
                  <div><strong>Working Approaches:</strong> {debugInfo.analysis.workingApproaches}/{debugInfo.analysis.totalApproaches}</div>
                  <div><strong>Recommendation:</strong> {debugInfo.analysis.recommendation}</div>
                </div>
              )}
              {debugInfo.results && (
                <div className="mt-4">
                  <div className="font-semibold mb-2">Detailed Results:</div>
                  {Object.entries(debugInfo.results).map(([approach, result]) => 
                    result ? (
                      <div key={approach} className="mb-2 p-2 bg-gray-50 rounded text-xs">
                        <div><strong>{approach}:</strong></div>
                        {(result as any).error ? (
                          <div className="text-red-600">Error: {(result as any).error}</div>
                        ) : (
                          <>
                            <div>Status: {(result as any).status}</div>
                            <div>Length: {(result as any).length?.toLocaleString()}</div>
                            <div>Title: {(result as any).title}</div>
                            <div>Has Product: {(result as any).hasProduct ? '✅' : '❌'}</div>
                            <div>Has Price: {(result as any).hasPrice ? '✅' : '❌'}</div>
                            <div>Blocked: {(result as any).isBlocked ? '❌' : '✅'}</div>
                          </>
                        )}
                      </div>
                    ) : null
                  )}
                </div>
              )}
              {debugInfo.analysis && (
                <div className="mt-4">
                  <div className="font-semibold mb-2">HTML Analysis:</div>
                  <div className="space-y-2 text-xs">
                    <div><strong>HTML Length:</strong> {debugInfo.analysis.htmlLength?.toLocaleString()} characters</div>
                    <div><strong>Title:</strong> {debugInfo.analysis.title}</div>
                    <div><strong>Price Matches Found:</strong> {debugInfo.analysis.priceMatches?.length || 0}</div>
                    <div><strong>Price Elements Found:</strong> {debugInfo.analysis.priceElements?.length || 0}</div>
                    <div><strong>Image URLs Found:</strong> {debugInfo.analysis.imageUrls?.length || 0}</div>
                    <div><strong>JSON Data Blocks:</strong> {debugInfo.analysis.jsonData?.length || 0}</div>
                  </div>
                  
                  {debugInfo.analysis.priceMatches && debugInfo.analysis.priceMatches.length > 0 && (
                    <div className="mt-3">
                      <div className="font-semibold mb-1">Price Matches:</div>
                      {debugInfo.analysis.priceMatches.slice(0, 3).map((match: any, index: number) => (
                        <div key={index} className="mb-1 p-1 bg-yellow-50 rounded text-xs">
                          <div><strong>Match {index + 1}:</strong> {match.match}</div>
                          <div className="text-gray-600">Context: {match.context}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {debugInfo.analysis.imageUrls && debugInfo.analysis.imageUrls.length > 0 && (
                    <div className="mt-3">
                      <div className="font-semibold mb-1">Image URLs:</div>
                      {debugInfo.analysis.imageUrls.slice(0, 3).map((img: any, index: number) => (
                        <div key={index} className="mb-1 p-1 bg-blue-50 rounded text-xs">
                          <div><strong>Image {index + 1}:</strong> {img.url}</div>
                          <div className="text-gray-600">Context: {img.context}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {debugInfo.analysis.sampleSections && debugInfo.analysis.sampleSections.length > 0 && (
                    <div className="mt-3">
                      <div className="font-semibold mb-1">Sample HTML Sections:</div>
                      {debugInfo.analysis.sampleSections.slice(0, 2).map((section: any, index: number) => (
                        <div key={index} className="mb-2 p-2 bg-gray-50 rounded text-xs">
                          <div><strong>{section.type} Section {index + 1}:</strong></div>
                          <div className="text-gray-600 font-mono whitespace-pre-wrap overflow-x-auto">
                            {section.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {debugInfo.summary && (
                    <div className="mt-3">
                      <div className="font-semibold mb-1">JSON Analysis Summary:</div>
                      <div className="space-y-1 text-xs">
                        <div><strong>JSON Blocks Found:</strong> {debugInfo.summary.jsonBlocksFound}</div>
                        <div><strong>Amazon Data Found:</strong> {debugInfo.summary.amazonDataFound}</div>
                        <div><strong>Data Attributes Found:</strong> {debugInfo.summary.dataAttributesFound}</div>
                      </div>
                    </div>
                  )}
                  
                  {debugInfo.amazonData && debugInfo.amazonData.length > 0 && (
                    <div className="mt-3">
                      <div className="font-semibold mb-1">Amazon Data Found:</div>
                      {debugInfo.amazonData.slice(0, 5).map((item: any, index: number) => (
                        <div key={index} className="mb-1 p-1 bg-green-50 rounded text-xs">
                          <div><strong>Pattern:</strong> {item.pattern}</div>
                          <div><strong>Match:</strong> {item.match}</div>
                          <div><strong>Value:</strong> {item.value}</div>
                          <div className="text-gray-600">Context: {item.context}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {debugInfo.jsonBlocks && debugInfo.jsonBlocks.length > 0 && (
                    <div className="mt-3">
                      <div className="font-semibold mb-1">JSON Blocks Found:</div>
                      {debugInfo.jsonBlocks.slice(0, 3).map((block: any, index: number) => (
                        <div key={index} className="mb-2 p-2 bg-yellow-50 rounded text-xs">
                          <div><strong>Type:</strong> {block.type}</div>
                          <div><strong>Data:</strong></div>
                          <div className="text-gray-600 font-mono whitespace-pre-wrap overflow-x-auto">
                            {JSON.stringify(block.data, null, 2).substring(0, 500)}...
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {debugInfo.dataAttributes && debugInfo.dataAttributes.length > 0 && (
                    <div className="mt-3">
                      <div className="font-semibold mb-1">Data Attributes Found:</div>
                      {debugInfo.dataAttributes.slice(0, 5).map((attr: any, index: number) => (
                        <div key={index} className="mb-1 p-1 bg-blue-50 rounded text-xs">
                          <div><strong>Attribute:</strong> {attr.attribute}</div>
                          <div><strong>Value:</strong> {attr.value}</div>
                          <div className="text-gray-600">Context: {attr.context}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {debugInfo.error && <div className="text-red-600"><strong>Error:</strong> {debugInfo.error}</div>}
            </div>
            <div className="flex gap-2 mt-3">
              <button 
                onClick={() => setDebugInfo(null)}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-all duration-200"
              >
                Clear Debug
              </button>
              <button 
                onClick={() => {
                  setDebugInfo(null);
                  setUrl('');
                  setError('');
                  setScrapedProduct(null);
                }}
                className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-all duration-200"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Extracted Product Data */}
        {scrapedProduct && (
          <div className="rounded-xl p-6 shadow-sm border-2 border-gray-300" style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
            <h2 className="text-xl font-semibold mb-2 text-gray-900">Extracted Product Data</h2>
            <p className="text-gray-700 mb-4">
              Review and edit the extracted information before saving
            </p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-1">
                    Product Name
                  </label>
                  <input
                    id="name"
                    value={scrapedProduct.name}
                    onChange={(e) => setScrapedProduct({...scrapedProduct, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-900 mb-1">
                    Price
                  </label>
                  <input
                    id="price"
                    value={scrapedProduct.price}
                    onChange={(e) => setScrapedProduct({...scrapedProduct, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-900 mb-1">
                  Image URL
                </label>
                <input
                  id="image"
                  value={scrapedProduct.image}
                  onChange={(e) => setScrapedProduct({...scrapedProduct, image: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={scrapedProduct.description}
                  onChange={(e) => setScrapedProduct({...scrapedProduct, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>

              {/* Debug Information */}
              {scrapedProduct.rawData?.debug && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-3">🔍 Debug Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p><strong>Found $18.19:</strong> {scrapedProduct.rawData.debug.foundPrice18_19 ? '✅ Yes' : '❌ No'}</p>
                      <p><strong>Found data-test=&quot;product-price&quot;:</strong> {scrapedProduct.rawData.debug.foundDataTestProductPrice ? '✅ Yes' : '❌ No'}</p>
                      <p><strong>Found &ldquo;About this item&rdquo;:</strong> {scrapedProduct.rawData.debug.foundAboutThisItem ? '✅ Yes' : '❌ No'}</p>
                    </div>
                    <div>
                      <p><strong>Total Price Patterns:</strong> {scrapedProduct.rawData.debug.totalPricePatterns}</p>
                      <p><strong>Price Patterns Found:</strong> {scrapedProduct.rawData.debug.pricePatterns?.join(', ') || 'None'}</p>
                      <p><strong>Data Test Elements:</strong> {scrapedProduct.rawData.debug.dataTestElements?.length || 0}</p>
                    </div>
                  </div>
                  {scrapedProduct.rawData.debug.dataTestElements && scrapedProduct.rawData.debug.dataTestElements.length > 0 && (
                    <div className="mt-3">
                      <p className="font-semibold text-yellow-800">Data Test Elements:</p>
                      {scrapedProduct.rawData.debug.dataTestElements.map((el: string, index: number) => (
                        <p key={index} className="text-xs bg-white p-2 rounded mt-1 border border-yellow-200">{el}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <button 
                  onClick={handleSave} 
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all duration-200"
                >
                  Save to Database
                </button>
                <button 
                  onClick={() => setScrapedProduct(null)}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-all duration-200"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-12 text-center">
          <a 
            href="/admin" 
            className="inline-flex items-center px-6 py-3 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-gray-400 hover:text-gray-600 hover:shadow-gray-300 hover:shadow-lg hover:scale-105"
          >
            ← Back to Admin
          </a>
        </div>
      </div>
    </div>
  );
}
