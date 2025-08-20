"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface ProcessingCriteria {
  symptoms?: string[];
  herbs?: string[];
  supplements?: string[];
  priceRange?: { min: number; max: number };
  qualityThreshold?: number;
  ratingThreshold?: number;
  commissionThreshold?: number;
  userSegment?: 'quality-focused' | 'price-sensitive' | 'balanced';
  region?: string;
}

interface ProcessedProduct {
  id: string;
  name: string;
  brand: string;
  supplier: string;
  category: 'traditional' | 'phytopharmaceutical' | 'mass-market';
  price: number;
  currency: string;
  commissionRate: number;
  qualityScore: number;
  rating?: number;
  reviewCount?: number;
  affiliateUrl: string;
  imageUrl?: string;
  description?: string;
  tags: string[];
  availability: boolean;
  profitMargin: number;
  userValueScore: number;
  compositeScore: number;
  regionalScore: number;
  source: string;
  lastUpdated: Date;
  processingPriority: number;
}

interface ProcessingResult {
  products: ProcessedProduct[];
  summary: {
    totalFound: number;
    totalProcessed: number;
    averageQualityScore: number;
    averageCommissionRate: number;
    topSuppliers: string[];
    recommendations: string[];
  };
  metadata: {
    processingTime: number;
    sourcesUsed: string[];
    filtersApplied: string[];
  };
}

interface ScrapedProduct {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  description: string;
  availability: string;
  site: string;
  searchTerm: string;
  scrapedAt: Date;
}

interface ScrapingStatus {
  isRunning: boolean;
  isPaused: boolean;
  currentSite: string;
  currentSearchTerm: string;
  progress: number;
  totalProducts: number;
  scrapedProducts: number;
  errors: number;
  handoffs: number;
  lastUpdated: Date;
}

export default function DataHubAdminPage() {
  const [criteria, setCriteria] = useState<ProcessingCriteria>({
    herbs: ['ashwagandha'],
    userSegment: 'balanced',
    priceRange: { min: 5, max: 100 },
    qualityThreshold: 6
  });
  
  const [herbSlug, setHerbSlug] = useState<string>('ashwagandha');
  const [supplementSlug, setSupplementSlug] = useState<string>('');
  
  const [results, setResults] = useState<ProcessingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProcessedProduct | null>(null);

  // New scraper state
  const [scrapingStatus, setScrapingStatus] = useState<ScrapingStatus>({
    isRunning: false,
    isPaused: false,
    currentSite: '',
    currentSearchTerm: '',
    progress: 0,
    totalProducts: 0,
    scrapedProducts: 0,
    errors: 0,
    handoffs: 0,
    lastUpdated: new Date()
  });

  // Debug function to check button state
  const debugButtonState = () => {
    console.log('🔍 Button State Debug:');
    console.log('scrapingStatus.isRunning:', scrapingStatus.isRunning);
    console.log('searchTerms.length:', searchTerms.length);
    console.log('Button should be disabled:', scrapingStatus.isRunning || searchTerms.length === 0);
    console.log('Full scrapingStatus:', scrapingStatus);
    console.log('Full searchTerms:', searchTerms);
  };

  const [searchTerms, setSearchTerms] = useState<string[]>([]);
  const [searchType, setSearchType] = useState<'herbs' | 'supplements' | 'symptoms'>('herbs');
  const [activeSites, setActiveSites] = useState<string[]>([
    'Amazon', 'Target', 'Vitacost', 'Gaia Herbs', 'Wise Woman Herbals', 
    'Pacific Botanicals', 'Traditional Medicinals', 'Nature\'s Answer', 'HerbEra'
  ]);
  const [scrapedProducts, setScrapedProducts] = useState<ScrapedProduct[]>([]);
  const [isLoadingTerms, setIsLoadingTerms] = useState(false);
  const [maxProductsPerSite, setMaxProductsPerSite] = useState<number>(10); // Limit products per site per herb

  const processData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/process-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(criteria),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateCriteria = (field: keyof ProcessingCriteria, value: unknown) => {
    setCriteria(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addHerb = () => {
    const newHerb = prompt('Enter herb name:');
    if (newHerb) {
      updateCriteria('herbs', [...(criteria.herbs || []), newHerb]);
    }
  };

  const removeHerb = (index: number) => {
    updateCriteria('herbs', criteria.herbs?.filter((_, i) => i !== index));
  };

  const addSymptom = () => {
    const newSymptom = prompt('Enter symptom:');
    if (newSymptom) {
      updateCriteria('symptoms', [...(criteria.symptoms || []), newSymptom]);
    }
  };

  const removeSymptom = (index: number) => {
    updateCriteria('symptoms', criteria.symptoms?.filter((_, i) => i !== index));
  };

  // Load search terms from database
  const loadSearchTermsFromDatabase = async () => {
    console.log('Button clicked! loadSearchTermsFromDatabase function called');
    setIsLoadingTerms(true);
    try {
      let response;
      if (searchType === 'herbs') {
        response = await fetch('/api/herbs');
      } else if (searchType === 'supplements') {
        response = await fetch('/api/supplements');
      } else {
        response = await fetch('/api/symptoms');
      }

      if (!response.ok) {
        throw new Error(`Failed to load ${searchType}`);
      }

      const data = await response.json();
      console.log('Raw API response:', data);
      
      // Handle different API response structures
      let terms: string[] = [];
      if (data.herbs && Array.isArray(data.herbs)) {
        // Herbs API returns { herbs: [...], pagination: {...} }
        terms = data.herbs.map((item: any) => item.name || item.slug).filter(Boolean);
      } else if (data.supplements && Array.isArray(data.supplements)) {
        // Supplements API might return similar structure
        terms = data.supplements.map((item: any) => item.name || item.slug).filter(Boolean);
      } else if (data.symptoms && Array.isArray(data.symptoms)) {
        // Symptoms API might return similar structure
        terms = data.symptoms.map((item: any) => item.title || item.name || item.slug).filter(Boolean);
      } else if (Array.isArray(data)) {
        // Direct array response
        terms = data.map((item: any) => item.name || item.title || item.slug).filter(Boolean);
      } else if (data.data && data.data.herbs && Array.isArray(data.data.herbs)) {
        // API wrapper structure: { success: true, data: { herbs: [...], pagination: {...} } }
        console.log('Found herbs in data wrapper, extracting...');
        terms = data.data.herbs.map((item: any) => item.name || item.slug).filter(Boolean);
        console.log('Extracted terms:', terms.slice(0, 5));
      } else if (data.data && data.data.supplements && Array.isArray(data.data.supplements)) {
        // API wrapper structure: { success: true, data: { supplements: [...], pagination: {...} } }
        terms = data.data.supplements.map((item: any) => item.name || item.slug).filter(Boolean);
      } else if (data.data && data.data.symptoms && Array.isArray(data.data.symptoms)) {
        // API wrapper structure: { success: true, data: { symptoms: [...], pagination: {...} } }
        terms = data.data.symptoms.map((item: any) => item.title || item.name || item.slug).filter(Boolean);
      } else {
        // Fallback: try to extract from any available property
        const items = data.data || data.items || data.results || data;
        if (Array.isArray(items)) {
          terms = items.map((item: any) => item.name || item.title || item.slug).filter(Boolean);
        } else {
          throw new Error(`Invalid response structure: expected array but got ${typeof data}`);
        }
      }
      
      console.log('Final terms array:', terms);
      console.log('Setting searchTerms state with:', terms.length, 'terms');
      
      // Force state update and verify it worked
      setSearchTerms(terms);
      
      // Immediately check if state was updated
      console.log('State should now be updated');
      
      // Force multiple state updates to ensure React picks it up
      setTimeout(() => {
        console.log('🔄 State check after 100ms:');
        console.log('searchTerms state should now be:', terms.length);
        // Force another state update if needed
        if (terms.length > 0) {
          setSearchTerms([...terms]); // Force React to see this as a new array
          console.log('🔄 Forced state update with new array reference');
          
          // Force one more update after a delay
          setTimeout(() => {
            console.log('🔄 Final state check after 200ms:');
            setSearchTerms(terms.map(term => term + '')); // Force new array with string concatenation
            console.log('🔄 Final forced state update');
          }, 100);
        }
      }, 100);
    } catch (err) {
      console.error('Error in loadSearchTermsFromDatabase:', err);
      setError(err instanceof Error ? err.message : 'Failed to load search terms');
    } finally {
      setIsLoadingTerms(false);
      console.log('Loading finished, isLoadingTerms set to false');
    }
  };

  // Simple test function
  const testStartScraping = () => {
    console.log('🧪 Test startScraping function called!');
    alert('Test startScraping function works!');
  };

  // Start scraping process
  const startScraping = async () => {
    console.log('🚀 Start Scraping button clicked!');
    console.log('Current searchTerms:', searchTerms);
    console.log('Current scrapingStatus:', scrapingStatus);
    
    if (searchTerms.length === 0) {
      console.log('❌ No search terms loaded, setting error');
      setError('Please load search terms from database first');
      return;
    }

    console.log('✅ Starting scraping process...');
    
    // Set running state first
    setScrapingStatus(prev => {
      console.log('🔄 Setting scraping status to running...');
      return {
        ...prev,
        isRunning: true,
        isPaused: false,
        progress: 0,
        totalProducts: 0,
        scrapedProducts: 0,
        errors: 0,
        handoffs: 0,
        lastUpdated: new Date()
      };
    });

    setScrapedProducts([]);
    setError(null);

    // Calculate total work - this is now more realistic
    const totalWork = searchTerms.length * activeSites.length;
    console.log(`📊 Total work: ${searchTerms.length} terms × ${activeSites.length} sites = ${totalWork} search operations`);
    console.log(`📊 Expected products: Up to ${totalWork * maxProductsPerSite} products (${maxProductsPerSite} per search operation)`);
    
    // Update total products - this represents search operations, not final products
    setScrapingStatus(prev => ({ ...prev, totalProducts: totalWork }));

    let currentProgress = 0;
    const newProducts: ScrapedProduct[] = [];

    try {
      console.log('🔄 Starting scraping loop...');
      console.log('Active sites:', activeSites);
      console.log('Search terms to process:', searchTerms.slice(0, 5));
      
      for (const searchTerm of searchTerms) {
        console.log(`🔍 Processing search term: ${searchTerm}`);
        
        // Check if we should continue
        const currentStatus = await new Promise(resolve => {
          setScrapingStatus(prev => {
            console.log('Checking status:', prev.isRunning);
            resolve(prev.isRunning);
            return prev;
          });
        });
        
        if (!currentStatus) {
          console.log('❌ Scraping stopped, breaking out of search term loop');
          break;
        }

        for (const site of activeSites) {
          console.log(`🔍 Scraping ${site} for ${searchTerm}...`);
          
          // Check if we should continue
          const siteStatus = await new Promise(resolve => {
            setScrapingStatus(prev => {
              console.log('Checking site status:', prev.isRunning);
              resolve(prev.isRunning);
              return prev;
            });
          });
          
          if (!siteStatus) {
            console.log('❌ Scraping stopped, breaking out of site loop');
            break;
          }

          setScrapingStatus(prev => ({
            ...prev,
            currentSite: site,
            currentSearchTerm: searchTerm,
            progress: currentProgress
          }));

          try {
            // Call the appropriate API endpoint based on site
            const product = await scrapeFromSite(site, searchTerm);
            if (product) {
              console.log(`✅ Got product from ${site}:`, product.name);
              newProducts.push(product);
              setScrapedProducts(prev => [...prev, product]);
            }
          } catch (err) {
            console.error(`❌ Error scraping ${site} for ${searchTerm}:`, err);
            setScrapingStatus(prev => ({ ...prev, errors: prev.errors + 1 }));
          }

          currentProgress++;
          setScrapingStatus(prev => ({ 
            ...prev, 
            progress: currentProgress,
            scrapedProducts: newProducts.length,
            lastUpdated: new Date()
          }));

          console.log(`📈 Progress: ${currentProgress}/${totalWork} (${Math.round((currentProgress/totalWork)*100)}%)`);

          // Small delay to avoid overwhelming the APIs
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    } catch (err) {
      console.error('❌ Scraping failed:', err);
      setError(err instanceof Error ? err.message : 'Scraping failed');
    } finally {
      console.log('🏁 Scraping finished');
      setScrapingStatus(prev => ({ ...prev, isRunning: false }));
    }
  };

  // Pause scraping
  const pauseScraping = () => {
    setScrapingStatus(prev => ({ ...prev, isPaused: true }));
  };

  // Stop scraping
  const stopScraping = () => {
    setScrapingStatus(prev => ({ ...prev, isRunning: false, isPaused: false }));
  };

  // Scrape from a specific site
  const scrapeFromSite = async (site: string, searchTerm: string): Promise<ScrapedProduct | null> => {
    try {
      let endpoint = '';
      let searchUrl = '';

      // Map sites to their API endpoints and generate search URLs
      switch (site) {
        case 'Amazon':
          endpoint = '/api/product-scraper/amazon-ultra-simple';
          searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(searchTerm)}`;
          break;
        case 'Target':
          endpoint = '/api/product-scraper/target-refined';
          searchUrl = `https://www.target.com/s?searchTerm=${encodeURIComponent(searchTerm)}`;
          break;
        case 'Vitacost':
          endpoint = '/api/product-scraper/vitacost-refined';
          searchUrl = `https://www.vitacost.com/search?search=${encodeURIComponent(searchTerm)}`;
          break;
        case 'Gaia Herbs':
          endpoint = '/api/product-scraper/amazon-ultra-simple'; // Use Amazon for now
          searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(searchTerm)}+gaia+herbs`;
          break;
        case 'Wise Woman Herbals':
          endpoint = '/api/product-scraper/amazon-ultra-simple'; // Use Amazon for now
          searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(searchTerm)}+wise+woman+herbals`;
          break;
        case 'Pacific Botanicals':
          endpoint = '/api/product-scraper/amazon-ultra-simple'; // Use Amazon for now
          searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(searchTerm)}+pacific+botanicals`;
          break;
        case 'Traditional Medicinals':
          endpoint = '/api/product-scraper/amazon-ultra-simple'; // Use Amazon for now
          searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(searchTerm)}+traditional+medicinals`;
          break;
        case 'Nature\'s Answer':
          endpoint = '/api/product-scraper/amazon-ultra-simple'; // Use Amazon for now
          searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(searchTerm)}+natures+answer`;
          break;
        case 'HerbEra':
          endpoint = '/api/product-scraper/amazon-ultra-simple'; // Use Amazon for now
          searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(searchTerm)}+herbera`;
          break;
        default:
          throw new Error(`Unknown site: ${site}`);
      }

      // For Amazon, use the new search + scrape approach
      if (site === 'Amazon') {
        console.log(`🔍 Using Amazon search + scrape for: ${searchTerm}`);
        
        try {
          // Step 1: Search for products
          const searchResponse = await fetch('/api/product-scraper/amazon-search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ searchTerm, maxResults: 1 })
          });
          
          if (!searchResponse.ok) {
            throw new Error(`Amazon search failed: ${searchResponse.status}`);
          }
          
          const searchData = await searchResponse.json();
          console.log(`🔍 Amazon search results:`, searchData);
          
          if (!searchData.success || !searchData.results || searchData.results.length === 0) {
            console.log(`⚠️ No Amazon search results for ${searchTerm}`);
            return null;
          }
          
          // Step 2: Scrape the first product found
          const productUrl = searchData.results[0].url;
          console.log(`🔗 Scraping Amazon product: ${productUrl}`);
          
          const scrapeResponse = await fetch('/api/product-scraper/amazon-ultra-simple', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: productUrl })
          });
          
          if (!scrapeResponse.ok) {
            throw new Error(`Amazon scrape failed: ${scrapeResponse.status}`);
          }
          
          const productData = await scrapeResponse.json();
          console.log(`✅ Amazon product data:`, productData);
          console.log(`🔍 Image field check:`, {
            image: productData.image,
            imageUrl: productData.imageUrl,
            hasImage: !!productData.image,
            imageType: typeof productData.image
          });
          
          // Transform to our format
          return {
            id: `amazon-${searchTerm}-${Date.now()}`,
            name: productData.name || `${searchTerm} from Amazon`,
            price: productData.price || 'Price not available',
            imageUrl: productData.image || '/images/placeholder-product.jpg',
            description: productData.description || `Product from Amazon`,
            availability: productData.availability || 'Check site',
            site: 'Amazon',
            searchTerm,
            scrapedAt: new Date()
          };
          
        } catch (error) {
          console.error(`❌ Amazon search+scrape failed for ${searchTerm}:`, error);
          return null;
        }
      }
      
      // For Target, use the new search + scrape approach
      if (site === 'Target') {
        console.log(`🔍 Using Target search + scrape for: ${searchTerm}`);
        
        try {
          // Step 1: Search for products
          const searchResponse = await fetch('/api/product-scraper/target-search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ searchTerm, maxResults: 1 })
          });
          
          if (!searchResponse.ok) {
            throw new Error(`Target search failed: ${searchResponse.status}`);
          }
          
          const searchData = await searchResponse.json();
          console.log(`🔍 Target search results:`, searchData);
          
          if (!searchData.success || !searchData.results || searchData.results.length === 0) {
            console.log(`⚠️ No Target search results for ${searchTerm}`);
            return null;
          }
          
          // Step 2: Scrape the first product found
          const productUrl = searchData.results[0].url;
          console.log(`🔗 Scraping Target product: ${productUrl}`);
          
          const scrapeResponse = await fetch('/api/product-scraper/target-refined', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: productUrl })
          });
          
          if (!scrapeResponse.ok) {
            throw new Error(`Target scrape failed: ${searchResponse.status}`);
          }
          
          const productData = await scrapeResponse.json();
          console.log(`✅ Target product data:`, productData);
          
          // Transform to our format
          return {
            id: `target-${searchTerm}-${Date.now()}`,
            name: productData.name || `${searchTerm} from Target`,
            price: productData.price || 'Price not available',
            imageUrl: productData.image || '/images/placeholder-product.jpg',
            description: productData.description || `Product from Target`,
            availability: productData.availability || 'Check site',
            site: 'Target',
            searchTerm,
            scrapedAt: new Date()
          };
          
        } catch (error) {
          console.error(`❌ Target search+scrape failed for ${searchTerm}:`, error);
          return null;
        }
      }
      
      // For Vitacost, use the new search + scrape approach
      if (site === 'Vitacost') {
        console.log(`🔍 Using Vitacost search + scrape for: ${searchTerm}`);
        
        try {
          // Step 1: Search for products
          const searchResponse = await fetch('/api/product-scraper/vitacost-search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ searchTerm, maxResults: 1 })
          });
          
          if (!searchResponse.ok) {
            throw new Error(`Vitacost search failed: ${searchResponse.status}`);
          }
          
          const searchData = await searchResponse.json();
          console.log(`🔍 Vitacost search results:`, searchData);
          
          if (!searchData.success || !searchData.results || searchData.results.length === 0) {
            console.log(`⚠️ No Vitacost search results for ${searchTerm}`);
            return null;
          }
          
          // Step 2: Scrape the first product found
          const productUrl = searchData.results[0].url;
          console.log(`🔗 Scraping Vitacost product: ${productUrl}`);
          
          const scrapeResponse = await fetch('/api/product-scraper/vitacost-refined', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: productUrl })
          });
          
          if (!scrapeResponse.ok) {
            throw new Error(`Vitacost scrape failed: ${searchResponse.status}`);
          }
          
          const productData = await scrapeResponse.json();
          console.log(`✅ Vitacost product data:`, productData);
          
          // Transform to our format
          return {
            id: `vitacost-${searchTerm}-${Date.now()}`,
            name: productData.name || `${searchTerm} from Vitacost`,
            price: productData.price || 'Price not available',
            imageUrl: productData.image || '/images/placeholder-product.jpg',
            description: productData.description || `Product from Vitacost`,
            availability: productData.availability || 'Check site',
            site: 'Vitacost',
            searchTerm,
            scrapedAt: new Date()
          };
          
        } catch (error) {
          console.error(`❌ Vitacost search+scrape failed for ${searchTerm}:`, error);
          return null;
        }
      }
      
      // For other sites, return placeholder for now
      console.log(`⚠️ Site ${site} not yet implemented - returning placeholder`);
      return {
        id: `${site}-${searchTerm}-${Date.now()}`,
        name: `${searchTerm} from ${site}`,
        price: 'Check site for price',
        imageUrl: '/images/placeholder-product.jpg',
        description: `Product available at ${site}`,
        availability: 'Check site',
        site,
        searchTerm,
        scrapedAt: new Date()
      };

    } catch (err) {
      console.error(`Error scraping ${site}:`, err);
      return null;
    }
  };

  // Toggle site selection
  const toggleSite = (site: string) => {
    setActiveSites(prev => 
      prev.includes(site) 
        ? prev.filter(s => s !== site)
        : [...prev, site]
    );
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
      
      <div className="relative z-10 container mx-auto px-6 pt-8 pb-6">
                 {/* Header */}
         <div className="mb-8">
           <div className="flex items-center justify-between mb-4">
             <Link href="/admin" 
                   className="inline-flex items-center px-6 py-3 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-gray-400 hover:text-gray-600 hover:shadow-gray-300 hover:shadow-lg hover:scale-105">
               ← Admin Home
             </Link>
             <div className="flex-1"></div>
           </div>
           <h1 className="text-3xl font-bold text-gray-800 text-center">Data Processing Hub</h1>
         </div>

        {/* Nine Worlds Scraper - Added at top */}
        <div className="mb-8 rounded-xl p-6 shadow-lg border-2 border-blue-300" 
             style={{background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)'}}>
          <h2 className="text-2xl font-bold mb-4 text-blue-800 flex items-center gap-2">
            🌍 Nine Worlds Product Scraper
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Search Terms Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Search Terms</h3>
              <div className="space-y-2">
                <label htmlFor="search-type" className="block text-sm font-medium text-gray-800">Search Type:</label>
                <select 
                  id="search-type"
                  name="search-type"
                  value={searchType} 
                  onChange={(e) => setSearchType(e.target.value as 'herbs' | 'supplements' | 'symptoms')}
                  className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white text-gray-800">
                  <option value="herbs">Herbs</option>
                  <option value="supplements">Supplements</option>
                  <option value="symptoms">Symptoms</option>
                </select>
                
                <label htmlFor="max-herbs" className="block text-sm font-medium text-gray-800">Max Herbs to Process:</label>
                <select 
                  id="max-herbs"
                  name="max-herbs"
                  value={Math.min(searchTerms.length, 10)} 
                  onChange={(e) => {
                    const max = parseInt(e.target.value);
                    setSearchTerms(prev => prev.slice(0, max));
                  }}
                  className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white text-gray-800">
                  <option value={5}>5 herbs ({5 * 9 * maxProductsPerSite} products)</option>
                  <option value={10}>10 herbs ({10 * 9 * maxProductsPerSite} products)</option>
                  <option value={20}>20 herbs ({20 * 9 * maxProductsPerSite} products)</option>
                  <option value={53}>All herbs ({53 * 9 * maxProductsPerSite} products)</option>
                </select>
                
                <label htmlFor="max-products" className="block text-sm font-medium text-gray-800">Max Products per Site per Herb:</label>
                <select 
                  id="max-products"
                  name="max-products"
                  value={maxProductsPerSite} 
                  onChange={(e) => setMaxProductsPerSite(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white text-gray-800">
                  <option value={1}>1 product (highest quality only)</option>
                  <option value={3}>3 products</option>
                  <option value={5}>5 products</option>
                  <option value={10}>10 products</option>
                  <option value={20}>20 products</option>
                </select>
                
                <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                  <strong>Quality Note:</strong> Products will be filtered against your Quality Specifications database to ensure only the highest quality items are retrieved.
                </div>
                
                <button 
                  onClick={loadSearchTermsFromDatabase}
                  disabled={isLoadingTerms}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                  {isLoadingTerms ? 'Loading Terms...' : 'Load from Database'}
                </button>

              </div>
            </div>

            {/* Site Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-700">Active Sites</h3>
              <div className="space-y-2">
                {['Amazon', 'Target', 'Vitacost', 'Gaia Herbs', 'Wise Woman Herbals', 'Pacific Botanicals', 'Traditional Medicinals', 'Nature\'s Answer', 'HerbEra'].map((site) => (
                  <label key={site} htmlFor={`site-${site.toLowerCase().replace(/\s+/g, '-')}`} className="flex items-center space-x-2">
                    <input 
                      id={`site-${site.toLowerCase().replace(/\s+/g, '-')}`}
                      name={`site-${site.toLowerCase().replace(/\s+/g, '-')}`}
                      type="checkbox" 
                      checked={activeSites.includes(site)}
                      onChange={() => toggleSite(site)}
                      className="rounded border-blue-300 text-blue-600" />
                    <span className="text-sm text-blue-700">{site}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Control Panel */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-700">Control Panel</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => {
                    try {
                      console.log('🚀 Start Scraping button clicked!');
                      console.log('startScraping function:', typeof startScraping);
                      startScraping(); // Call the real scraping function
                    } catch (error) {
                      console.error('❌ Error in Start Scraping button:', error);
                    }
                  }}
                  disabled={scrapingStatus.isRunning || searchTerms.length === 0}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                  🚀 Start Scraping
                </button>
                <button 
                  onClick={debugButtonState}
                  className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors mt-2">
                  🔍 Debug Button State
                </button>
                <button 
                  onClick={pauseScraping}
                  disabled={!scrapingStatus.isRunning || scrapingStatus.isPaused}
                  className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                  ⏸️ Pause
                </button>
                <button 
                  onClick={stopScraping}
                  disabled={!scrapingStatus.isRunning}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                  🛑 Stop
                </button>
                <button 
                  onClick={() => setScrapedProducts([])} // Clear scraped products
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                  📊 View Results
                </button>
              </div>
            </div>
          </div>

          {/* Progress & Status */}
          <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-700">Status: {scrapingStatus.isRunning ? (scrapingStatus.isPaused ? 'Paused' : 'Scraping') : 'Ready'}</span>
              <span className="text-sm text-blue-600">
                {scrapingStatus.scrapedProducts}/{scrapingStatus.totalProducts} search operations
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{width: `${(scrapingStatus.totalProducts > 0 ? (scrapingStatus.progress / scrapingStatus.totalProducts) * 100 : 0)}%`}}></div>
            </div>
            <div className="mt-2 text-xs text-blue-600">
              Expected products: Up to {scrapingStatus.totalProducts * maxProductsPerSite} | Errors: {scrapingStatus.errors} | Handoffs: {scrapingStatus.handoffs}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <span className="text-red-600 mr-2">⚠️</span>
                <span className="text-red-700 font-medium">Error: {error}</span>
                <button 
                  onClick={() => setError(null)}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Search Terms Display */}
          {searchTerms.length > 0 && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Loaded Search Terms ({searchTerms.length})</h4>
              <div className="flex flex-wrap gap-2">
                {searchTerms.slice(0, 10).map((term, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                    {term}
                  </span>
                ))}
                {searchTerms.length > 10 && (
                  <span className="text-blue-700 text-xs font-medium">+{searchTerms.length - 10} more</span>
                )}
              </div>
            </div>
          )}

          {/* Debug Display */}
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="text-sm font-semibold text-yellow-800 mb-2">Debug Info</h4>
            <div className="text-xs text-yellow-700">
              <p>searchTerms.length: {searchTerms.length}</p>
              <p>searchTerms array: {JSON.stringify(searchTerms.slice(0, 3))}</p>
              <p>isLoadingTerms: {isLoadingTerms.toString()}</p>
            </div>
          </div>

          {/* Test Display - Always Visible */}
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="text-sm font-semibold text-red-800 mb-2">TEST: Search Terms Display (Always Visible)</h4>
            <div className="text-xs text-red-700">
              <p>Condition: searchTerms.length &gt; 0 = {searchTerms.length > 0 ? 'TRUE' : 'FALSE'}</p>
              <p>searchTerms.length: {searchTerms.length}</p>
              {searchTerms.length > 0 && (
                <div className="mt-2">
                  <p>First 5 herbs:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {searchTerms.slice(0, 5).map((term, index) => (
                      <span key={index} className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs">
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Current Activity */}
          {scrapingStatus.isRunning && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Current Activity</h4>
              <div className="text-sm text-gray-700">
                <p>Site: {scrapingStatus.currentSite || 'None'}</p>
                <p>Search Term: {scrapingStatus.currentSearchTerm || 'None'}</p>
                <p>Progress: {scrapingStatus.progress} / {scrapingStatus.totalProducts}</p>
              </div>
            </div>
          )}

          {/* Scraped Products Results */}
          {scrapedProducts.length > 0 && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800">Scraped Products ({scrapedProducts.length})</h4>
                <button 
                  onClick={() => setScrapedProducts([])}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Clear Results
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {scrapedProducts.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-gray-800 text-sm line-clamp-2">{product.name}</h5>
                        <span className="text-xs text-gray-600 font-medium">{product.site}</span>
                      </div>
                      <p className="text-lg font-bold text-green-600 mb-1">{product.price}</p>
                      <p className="text-xs text-gray-700 mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span className="font-medium">{product.availability}</span>
                        <span className="font-medium">{product.searchTerm}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Processing Criteria Panel */}
          <div className="rounded-xl p-6 shadow-sm border-2 border-gray-300" 
               style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Processing Criteria</h2>
            
            {/* Herbs */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-700">Herbs:</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {criteria.herbs?.map((herb, index) => (
                  <span key={index} className="bg-white text-green-700 px-3 py-1 rounded-full border border-green-300 flex items-center gap-1 shadow-sm">
                    {herb}
                    <button
                      onClick={() => removeHerb(index)}
                      className="text-red-500 hover:text-red-700 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <button
                onClick={addHerb}
                className="inline-flex items-center px-4 py-2 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-gray-400 hover:text-gray-600 hover:shadow-gray-300 hover:shadow-lg hover:scale-105"
              >
                + Add Herb
              </button>
            </div>

            {/* Symptoms */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-700">Symptoms:</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {criteria.symptoms?.map((symptom, index) => (
                  <span key={index} className="bg-white text-blue-700 px-3 py-1 rounded-full border border-blue-300 flex items-center gap-1 shadow-sm">
                    {symptom}
                    <button
                      onClick={() => removeSymptom(index)}
                      className="text-red-500 hover:text-red-700 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <button
                onClick={addSymptom}
                className="inline-flex items-center px-4 py-2 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-gray-400 hover:text-gray-600 hover:shadow-gray-300 hover:shadow-lg hover:scale-105"
              >
                + Add Symptom
              </button>
            </div>

            {/* User Segment */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-700">User Segment:</label>
              <select
                value={criteria.userSegment || 'balanced'}
                onChange={(e) => updateCriteria('userSegment', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="quality-focused">Quality-Focused</option>
                <option value="price-sensitive">Price-Sensitive</option>
                <option value="balanced">Balanced</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-700">Price Range:</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={criteria.priceRange?.min || ''}
                  onChange={(e) => updateCriteria('priceRange', { 
                    ...criteria.priceRange, 
                    min: parseFloat(e.target.value) || 0 
                  })}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={criteria.priceRange?.max || ''}
                  onChange={(e) => updateCriteria('priceRange', { 
                    ...criteria.priceRange, 
                    max: parseFloat(e.target.value) || 0 
                  })}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Quality Threshold */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2 text-gray-700">Quality Threshold:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={criteria.qualityThreshold || 6}
                onChange={(e) => updateCriteria('qualityThreshold', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Database Integration */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-gray-700">Database Integration:</h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm mb-1 text-gray-700">Herb Slug:</label>
                  <input
                    type="text"
                    value={herbSlug}
                    onChange={(e) => setHerbSlug(e.target.value)}
                    placeholder="e.g., ashwagandha"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-700">Supplement Slug:</label>
                  <input
                    type="text"
                    value={supplementSlug}
                    onChange={(e) => setSupplementSlug(e.target.value)}
                    placeholder="e.g., vitamin-d"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Process Button */}
            <button
              onClick={processData}
              disabled={loading}
              className="w-full inline-flex items-center px-6 py-3 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-green-600 text-white border-transparent hover:bg-green-700 hover:border-green-700 hover:shadow-lg hover:scale-105 disabled:bg-gray-400 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Process Data'}
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg shadow-sm border border-red-300">
                {error}
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="rounded-xl p-6 shadow-sm border-2 border-gray-300" 
               style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Processing Results</h2>
            
            {results ? (
              <div>
                {/* Summary */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-300">
                  <h3 className="font-bold mb-2 text-gray-800">Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>Total Found: {results.summary.totalFound}</div>
                    <div>Total Processed: {results.summary.totalProcessed}</div>
                    <div>Avg Quality: {results.summary.averageQualityScore}</div>
                    <div>Avg Commission: {(results.summary.averageCommissionRate * 100).toFixed(1)}%</div>
                  </div>
                  <div className="mt-2 text-gray-700">
                    <strong>Top Suppliers:</strong> {results.summary.topSuppliers.join(', ')}
                  </div>
                  {results.summary.recommendations.length > 0 && (
                    <div className="mt-2 text-gray-700">
                      <strong>Recommendations:</strong>
                      <ul className="list-disc ml-4 text-gray-700">
                        {results.summary.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Products List */}
                <div>
                  <h3 className="font-bold mb-2 text-gray-800">Products ({results.products.length})</h3>
                  <div className="max-h-96 overflow-y-auto">
                    {results.products.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className="border rounded-lg p-3 mb-2 cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{product.name}</h4>
                            <p className="text-sm text-gray-700">{product.brand} - {product.supplier}</p>
                            <div className="flex gap-4 text-xs text-gray-700 mt-1">
                              <span>${product.price}</span>
                              <span>Quality: {product.qualityScore}/10</span>
                              <span>Commission: {(product.commissionRate * 100).toFixed(1)}%</span>
                              <span>Score: {product.compositeScore.toFixed(1)}</span>
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                            product.category === 'traditional' ? 'bg-green-100 text-green-800' :
                            product.category === 'phytopharmaceutical' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {product.category}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Processing Metadata */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg shadow-sm border border-blue-300 text-sm text-gray-700">
                  <strong>Processing Time:</strong> {results.metadata.processingTime}ms<br/>
                  <strong>Sources Used:</strong> {results.metadata.sourcesUsed.join(', ')}<br/>
                  <strong>Filters Applied:</strong> {results.metadata.filtersApplied.join(', ')}
                </div>
              </div>
            ) : (
              <div className="text-gray-800 text-center py-8">
                No results yet. Set criteria and click &quot;Process Data&quot; to get started.
              </div>
            )}
          </div>
        </div>

        {/* Product Detail Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{selectedProduct.name}</h3>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="text-gray-800 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <strong>Brand:</strong> {selectedProduct.brand}<br/>
                    <strong>Supplier:</strong> {selectedProduct.supplier}<br/>
                    <strong>Category:</strong> {selectedProduct.category}<br/>
                    <strong>Price:</strong> ${selectedProduct.price} {selectedProduct.currency}
                  </div>
                  <div>
                    <strong>Quality Score:</strong> {selectedProduct.qualityScore}/10<br/>
                    <strong>Commission Rate:</strong> {(selectedProduct.commissionRate * 100).toFixed(1)}%<br/>
                    <strong>User Value Score:</strong> {selectedProduct.userValueScore.toFixed(1)}<br/>
                    <strong>Composite Score:</strong> {selectedProduct.compositeScore.toFixed(1)}
                  </div>
                </div>

                {selectedProduct.description && (
                  <div className="mb-4">
                    <strong>Description:</strong><br/>
                    <p className="text-sm text-gray-700">{selectedProduct.description}</p>
                  </div>
                )}

                <div className="mb-4">
                  <strong>Tags:</strong><br/>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedProduct.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={selectedProduct.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-blue-600 text-white border-transparent hover:bg-blue-700 hover:border-blue-700 hover:shadow-lg hover:scale-105"
                  >
                    View Product
                  </a>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="inline-flex items-center px-6 py-3 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-gray-600 text-white border-transparent hover:bg-gray-700 hover:border-gray-700 hover:shadow-lg hover:scale-105"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 