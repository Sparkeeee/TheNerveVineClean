const fetch = require('node-fetch');

async function testVitacostSearch() {
  try {
    console.log('🧪 Testing Vitacost Search API...');
    
    // Test the search URL directly first
    const searchTerm = 'Ashwagandha';
    const searchUrl = `https://www.vitacost.com/search?search=${encodeURIComponent(searchTerm)}`;
    console.log('🔍 Testing search URL:', searchUrl);
    
    // Test direct fetch to Vitacost
    console.log('📡 Testing direct fetch to Vitacost...');
    const directResponse = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1.2 Mobile/15E148 Safari/604.1',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    });
    
    console.log('📊 Direct response status:', directResponse.status);
    console.log('📊 Direct response headers:', Object.fromEntries(directResponse.headers.entries()));
    
    // Always get the HTML content, even on 404
    const html = await directResponse.text();
    console.log('📄 HTML length:', html.length);
    console.log('📄 First 1000 chars:', html.substring(0, 1000));
    
    // Look for any search-related patterns in the HTML
    console.log('\n🔍 Looking for search patterns in HTML...');
    if (html.includes('search')) console.log('✅ Found "search" in HTML');
    if (html.includes('Search')) console.log('✅ Found "Search" in HTML');
    if (html.includes('SEARCH')) console.log('✅ Found "SEARCH" in HTML');
    if (html.includes('ashwagandha')) console.log('✅ Found "ashwagandha" in HTML');
    if (html.includes('Ashwagandha')) console.log('✅ Found "Ashwagandha" in HTML');
    
    // Look for any form elements or search inputs
    if (html.includes('<form')) console.log('✅ Found form elements');
    if (html.includes('input')) console.log('✅ Found input elements');
    if (html.includes('type="search"')) console.log('✅ Found search input');
    if (html.includes('type="text"')) console.log('✅ Found text input');
    
    // Look for any error messages
    if (html.includes('404')) console.log('✅ Found "404" in HTML');
    if (html.includes('not found')) console.log('✅ Found "not found" in HTML');
    if (html.includes('error')) console.log('✅ Found "error" in HTML');
    
    console.log('\n--- Now testing our API ---\n');
    
    // Test our API
    const response = await fetch('http://localhost:3000/api/product-scraper/vitacost-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        searchTerm: 'Ashwagandha',
        maxResults: 5
      })
    });

    const data = await response.json();
    console.log('📊 API Response status:', response.status);
    console.log('📊 API Response data:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log(`✅ Found ${data.totalFound} products for "Ashwagandha"`);
      data.results.forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.title}: ${product.url}`);
      });
    } else {
      console.log('❌ Search failed:', data.error);
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
}

testVitacostSearch();
