'use client';

import { useState } from 'react';

interface ScrapedProduct {
  name: string;
  price: string;
  image: string;
  description: string;
  availability: string;
  url: string;
  rawData: any;
}

export default function ProductScraperPage() {
  const [url, setUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapedProduct, setScrapedProduct] = useState<ScrapedProduct | null>(null);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState<any>(null);

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

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Product Data Scraper</h1>
        <p className="text-gray-600">
          Extract product information from e-commerce URLs to build your affiliate product database.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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
               className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
             >
               {isScraping ? 'Scraping...' : 'Extract Product Data'}
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
               className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
               className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
               className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
               className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
               className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
               className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
               className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
               className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
               className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
               className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
               title="Ultra simple fetch-based scraper with multiple approaches (excellent for Amazon)"
             >
               Ultra Simple
             </button>
             <button 
               onClick={async () => {
                 if (!url.trim() || !url.includes('iherb')) return;
                 setIsScraping(true);
                 setError('');
                 setDebugInfo(null);
                 
                 try {
                   const response = await fetch('/api/product-scraper/iherb-advanced', {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({ url })
                   });
                   
                   const data = await response.json();
                   
                   if (data.success) {
                     setScrapedProduct(data.product);
                     setDebugInfo({
                       url,
                       hostname: new URL(url).hostname,
                       status: '✅ Success',
                       method: data.method,
                       htmlLength: data.product.rawData?.html?.length || 'Unknown'
                     });
                   } else {
                     setError(data.error || 'Failed to scrape product');
                   }
                 } catch (error) {
                   setError('Failed to scrape product');
                 } finally {
                   setIsScraping(false);
                 }
               }}
               disabled={isScraping || !url.trim() || !url.includes('iherb')}
               className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
               title="Advanced iHerb scraper with sophisticated headers and multiple approaches"
             >
               iHerb Hacker
             </button>
           </div>
        </div>
      </div>

             {error && (
         <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
           <p className="text-red-600">{error}</p>
         </div>
       )}

               {debugInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
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
                        {debugInfo.analysis.priceMatches.slice(0, 3).map((match: any, index) => (
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
                        {debugInfo.analysis.imageUrls.slice(0, 3).map((img, index) => (
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
                         {debugInfo.analysis.sampleSections.slice(0, 2).map((section, index) => (
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
                         {debugInfo.amazonData.slice(0, 5).map((item, index) => (
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
                         {debugInfo.jsonBlocks.slice(0, 3).map((block, index) => (
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
                         {debugInfo.dataAttributes.slice(0, 5).map((attr, index) => (
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
                 className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
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
                 className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
               >
                 Clear All
               </button>
             </div>
         </div>
       )}

      {scrapedProduct && (
        <div className="bg-white rounded-lg shadow-md p-6">
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

            <div>
              <label htmlFor="availability" className="block text-sm font-medium text-gray-900 mb-1">
                Availability
              </label>
              <input
                id="availability"
                value={scrapedProduct.availability}
                onChange={(e) => setScrapedProduct({...scrapedProduct, availability: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
            </div>

            <div className="flex gap-2">
              <button 
                onClick={handleSave} 
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Save to Database
              </button>
              <button 
                onClick={() => setScrapedProduct(null)}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
