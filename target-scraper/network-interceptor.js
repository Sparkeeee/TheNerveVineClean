const puppeteer = require('puppeteer');
const fs = require('fs').promises;

class NetworkInterceptor {
  constructor() {
    this.apiCalls = [];
    this.productData = [];
  }

  async run() {
    console.log('🔍 NETWORK INTERCEPTOR FOR TARGET.COM');
    console.log('=====================================\n');

    const browser = await puppeteer.launch({
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });

    try {
      const page = await browser.newPage();
      
      // Intercept network requests
      await page.setRequestInterception(true);
      
      page.on('request', (request) => {
        const url = request.url();
        
        // Log interesting requests
        if (url.includes('api') || url.includes('graphql') || url.includes('search') || url.includes('products')) {
          console.log(`📡 REQUEST: ${request.method()} ${url}`);
          this.apiCalls.push({
            method: request.method(),
            url: url,
            headers: request.headers(),
            timestamp: new Date().toISOString()
          });
        }
        
        request.continue();
      });

      page.on('response', async (response) => {
        const url = response.url();
        
        // Capture product-related responses
        if (url.includes('api') || url.includes('graphql') || url.includes('search') || url.includes('products')) {
          try {
            const contentType = response.headers()['content-type'] || '';
            
            if (contentType.includes('json')) {
              const responseBody = await response.text();
              console.log(`📥 RESPONSE: ${response.status()} ${url}`);
              console.log(`   Content-Type: ${contentType}`);
              console.log(`   Body length: ${responseBody.length} chars`);
              
              // Try to parse JSON and look for product data
              try {
                const jsonData = JSON.parse(responseBody);
                this.analyzeResponse(jsonData, url);
              } catch (parseError) {
                // Not JSON, check if it contains product URLs
                if (responseBody.includes('/p/')) {
                  console.log(`   ⚠️ Contains /p/ URLs but not valid JSON`);
                }
              }
            }
          } catch (error) {
            console.log(`   ❌ Error processing response: ${error.message}`);
          }
        }
      });

      // Navigate to Target supplements
      console.log('🌐 Navigating to Target supplements...');
      await page.goto('https://www.target.com/c/supplements', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // Wait for content to load
      await page.waitForTimeout(5000);
      
      // Scroll to trigger more requests
      console.log('📜 Scrolling to trigger more requests...');
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      
      await page.waitForTimeout(3000);
      
      // Try to search for something to trigger API calls
      console.log('🔍 Trying search to trigger API calls...');
      try {
        const searchInput = await page.$('input[type="search"], input[placeholder*="search"], input[name="search"]');
        if (searchInput) {
          await searchInput.type('magnesium');
          await searchInput.press('Enter');
          await page.waitForTimeout(3000);
        }
      } catch (error) {
        console.log('⚠️ Search input not found');
      }

      // Save captured data
      await this.saveResults();
      
    } finally {
      await browser.close();
      console.log('🔒 Browser closed');
    }
  }

  analyzeResponse(data, url) {
    // Look for product data in various formats
    const productPatterns = [
      'products', 'items', 'results', 'hits', 'data', 'content'
    ];
    
    for (const pattern of productPatterns) {
      if (data[pattern] && Array.isArray(data[pattern])) {
        console.log(`   🎯 Found array '${pattern}' with ${data[pattern].length} items`);
        this.productData.push({
          source: url,
          pattern: pattern,
          count: data[pattern].length,
          sample: data[pattern].slice(0, 3)
        });
      }
    }
    
    // Look for nested product data
    this.searchForProducts(data, url);
  }

  searchForProducts(obj, url, path = '') {
    if (typeof obj === 'object' && obj !== null) {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (Array.isArray(value) && value.length > 0) {
          // Check if this array contains product-like objects
          const firstItem = value[0];
          if (firstItem && typeof firstItem === 'object') {
            const hasProductFields = firstItem.id || firstItem.name || firstItem.title || firstItem.url;
            if (hasProductFields) {
              console.log(`   🎯 Found potential product array at '${currentPath}' with ${value.length} items`);
              this.productData.push({
                source: url,
                path: currentPath,
                count: value.length,
                sample: value.slice(0, 2)
              });
            }
          }
        }
        
        // Recursively search nested objects
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          this.searchForProducts(value, url, currentPath);
        }
      }
    }
  }

  async saveResults() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Save API calls
    const apiFilename = `network_interceptor_api_calls_${timestamp}.json`;
    await fs.writeFile(apiFilename, JSON.stringify({
      timestamp: new Date().toISOString(),
      totalApiCalls: this.apiCalls.length,
      apiCalls: this.apiCalls
    }, null, 2));
    
    // Save product data
    const productFilename = `network_interceptor_product_data_${timestamp}.json`;
    await fs.writeFile(productFilename, JSON.stringify({
      timestamp: new Date().toISOString(),
      totalProductData: this.productData.length,
      productData: this.productData
    }, null, 2));
    
    console.log(`\n💾 Results saved:`);
    console.log(`  API Calls: ${apiFilename}`);
    console.log(`  Product Data: ${productFilename}`);
    console.log(`\n📊 SUMMARY:`);
    console.log(`  Total API calls captured: ${this.apiCalls.length}`);
    console.log(`  Product data sources found: ${this.productData.length}`);
  }
}

// Run the interceptor
async function main() {
  const interceptor = new NetworkInterceptor();
  await interceptor.run();
}

main().catch(console.error);


