const puppeteer = require('puppeteer');

// Test different search terms to find one that works
async function testSearchTerms() {
  console.log('🔍 TESTING DIFFERENT SEARCH TERMS ON TARGET.COM');
  console.log('================================================\n');

  const searchTerms = [
    'vitamin d',
    'protein powder',
    'omega 3',
    'multivitamin',
    'supplements',
    'vitamins'
  ];

  let browser = null;
  
  try {
    browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    
    for (const searchTerm of searchTerms) {
      console.log(`\n🧪 Testing: "${searchTerm}"`);
      
      try {
        const searchUrl = `https://www.target.com/s?searchTerm=${encodeURIComponent(searchTerm)}`;
        console.log(`🌐 URL: ${searchUrl}`);
        
        await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 20000 });
        await page.waitForTimeout(3000);
        
        // Check for product links
        const productCount = await page.$$eval('a[href*="/p/"]', (elements) => elements.length);
        console.log(`📊 Product links found: ${productCount}`);
        
        if (productCount > 0) {
          console.log(`✅ SUCCESS! "${searchTerm}" returns ${productCount} products`);
          
          // Get sample URLs
          const sampleUrls = await page.$$eval('a[href*="/p/"]', (elements) => {
            return elements.slice(0, 3).map(el => el.href);
          });
          
          console.log(`📍 Sample URLs: ${sampleUrls.join(', ')}`);
          break; // Found a working search term
        } else {
          console.log(`❌ No products found for "${searchTerm}"`);
        }
        
      } catch (error) {
        console.log(`⚠️ Error with "${searchTerm}": ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    if (browser) {
      await browser.close();
      console.log('\n🔒 Browser closed');
    }
  }
}

testSearchTerms().catch(console.error);


