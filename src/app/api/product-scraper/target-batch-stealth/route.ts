import { NextRequest, NextResponse } from 'next/server';

// Anti-detection utilities
const randomDelay = (min: number, max: number) => 
  new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));

const realisticBatchDelay = () => randomDelay(8000, 15000); // Longer delays for batch processing

export async function POST(request: NextRequest) {
  console.log('🚀 TARGET BATCH STEALTH: Starting stealth batch processing');
  
  let searchTerm: string = 'unknown';
  
  try {
    const body = await request.json();
    const { searchTerm: term, maxResults = 5 } = body;
    searchTerm = term;
    
    if (!searchTerm) {
      return NextResponse.json({ error: 'Search term is required' }, { status: 400 });
    }

    console.log(`🔍 TARGET BATCH STEALTH: Processing "${searchTerm}" with max ${maxResults} results`);

    // Step 1: Use stealth search to get product URLs
    console.log('📋 TARGET BATCH STEALTH: Step 1 - Getting product URLs via stealth search');
    
    const searchResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/product-scraper/target-search-stealth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ searchTerm, maxResults })
    });

    if (!searchResponse.ok) {
      const searchError = await searchResponse.json();
      throw new Error(`Search failed: ${searchError.error}`);
    }

    const searchData = await searchResponse.json();
    
    if (!searchData.success || !searchData.results || searchData.results.length === 0) {
      throw new Error('No products found in search');
    }

    console.log(`✅ TARGET BATCH STEALTH: Found ${searchData.results.length} product URLs`);

    // Step 2: Process each product with realistic delays
    console.log('🔄 TARGET BATCH STEALTH: Step 2 - Processing individual products');
    
    const processedProducts = [];
    const errors = [];

    for (let i = 0; i < searchData.results.length; i++) {
      const product = searchData.results[i];
      console.log(`📦 TARGET BATCH STEALTH: Processing product ${i + 1}/${searchData.results.length}: ${product.url}`);
      
      try {
        // Realistic delay between product requests
        if (i > 0) {
          console.log(`⏳ TARGET BATCH STEALTH: Waiting before next product...`);
          await realisticBatchDelay();
        }

        // Scrape individual product using Target Refined
        const productResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/product-scraper/target-refined`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: product.url })
        });

        if (productResponse.ok) {
          const productData = await productResponse.json();
          processedProducts.push({
            ...product,
            ...productData,
            scrapedAt: new Date().toISOString(),
            processingOrder: i + 1
          });
          console.log(`✅ TARGET BATCH STEALTH: Successfully scraped product ${i + 1}`);
        } else {
          const errorData = await productResponse.json();
          errors.push({
            url: product.url,
            error: errorData.error,
            step: 'product-scraping'
          });
          console.log(`❌ TARGET BATCH STEALTH: Failed to scrape product ${i + 1}: ${errorData.error}`);
        }

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push({
          url: product.url,
          error: errorMessage,
          step: 'product-scraping'
        });
        console.log(`❌ TARGET BATCH STEALTH: Error processing product ${i + 1}: ${errorMessage}`);
      }
    }

    // Step 3: Final delay before completion
    console.log('⏳ TARGET BATCH STEALTH: Final processing delay...');
    await randomDelay(3000, 6000);

    // Step 4: Compile results
    const results = {
      success: true,
      searchTerm,
      totalRequested: maxResults,
      totalFound: searchData.results.length,
      successfullyProcessed: processedProducts.length,
      errors: errors.length,
      method: 'Stealth Batch Processing',
      timestamp: new Date().toISOString(),
      products: processedProducts,
      errorDetails: errors,
      processingSummary: {
        searchSuccess: searchData.success,
        searchMethod: searchData.method,
        batchProcessing: 'Stealth with realistic delays',
        totalProcessingTime: 'Variable (realistic delays applied)'
      }
    };

    console.log(`🎯 TARGET BATCH STEALTH: Batch processing completed successfully`);
    console.log(`📊 TARGET BATCH STEALTH: Summary - ${processedProducts.length} products processed, ${errors.length} errors`);

    return NextResponse.json(results);

  } catch (error) {
    console.error('💥 TARGET BATCH STEALTH ERROR:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isBlocked = errorMessage.includes('403') || 
                     errorMessage.includes('Forbidden') || 
                     errorMessage.includes('blocked') ||
                     errorMessage.includes('IP');

    return NextResponse.json({ 
      success: false, 
      error: errorMessage,
      searchTerm: searchTerm || 'unknown',
      isBlocked,
      recommendation: isBlocked ? 'Try VPN IP rotation or wait before retrying' : 'Check search term and try again',
      method: 'Stealth Batch Processing',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
