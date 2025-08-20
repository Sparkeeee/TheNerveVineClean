// Test script for the new stealth scrapers
const BASE_URL = 'http://localhost:3000';

async function testStealthSearch() {
  console.log('🧪 Testing Target Search Stealth...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/product-scraper/target-search-stealth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        searchTerm: 'st johns wort',
        maxResults: 3
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.log('❌ Search failed:', error);
      return;
    }

    const data = await response.json();
    console.log('✅ Search successful:', {
      searchTerm: data.searchTerm,
      totalFound: data.totalFound,
      method: data.method,
      results: data.results?.length || 0
    });

    if (data.results && data.results.length > 0) {
      console.log('🔗 First product URL:', data.results[0].url);
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

async function testStealthBatch() {
  console.log('🧪 Testing Target Batch Stealth...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/product-scraper/target-batch-stealth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        searchTerm: 'st johns wort',
        maxResults: 2
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.log('❌ Batch processing failed:', error);
      return;
    }

    const data = await response.json();
    console.log('✅ Batch processing successful:', {
      searchTerm: data.searchTerm,
      totalRequested: data.totalRequested,
      successfullyProcessed: data.successfullyProcessed,
      errors: data.errors,
      method: data.method
    });

    if (data.products && data.products.length > 0) {
      console.log('📦 First processed product:', {
        name: data.products[0].name,
        price: data.products[0].price,
        processingOrder: data.products[0].processingOrder
      });
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting stealth scraper tests...\n');
  
  await testStealthSearch();
  console.log('');
  
  await testStealthBatch();
  console.log('');
  
  console.log('✅ All tests completed!');
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { testStealthSearch, testStealthBatch };
