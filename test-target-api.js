const fetch = require('node-fetch');

async function testTargetAPI() {
  try {
    console.log('🧪 Testing Target Search API...');
    
    const response = await fetch('http://localhost:3000/api/product-scraper/target-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        searchTerm: 'vitamin',
        maxResults: 1
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Response:', JSON.stringify(data, null, 2));
    } else {
      console.log('❌ API Error:', response.status, response.statusText);
      const errorText = await response.text();
      console.log('Error details:', errorText);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testTargetAPI();

