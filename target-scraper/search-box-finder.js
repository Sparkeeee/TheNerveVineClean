const { chromium } = require('playwright');
const fs = require('fs').promises;

class SearchBoxFinder {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
  }

  async initialize() {
    console.log('🔍 Initializing Search Box Finder...');
    
    this.browser = await chromium.launch({ 
      headless: false, // Visible for debugging
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });
    
    this.context = await this.browser.newContext({
      viewport: { width: 1366, height: 768 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    
    this.page = await this.context.newPage();
    console.log('✅ Browser initialized successfully');
  }

  async findSearchBox() {
    try {
      console.log('🌐 Opening Target homepage...');
      await this.page.goto("https://www.target.com/", { waitUntil: "domcontentloaded" });
      
      // Wait a bit for the page to fully load
      await this.page.waitForTimeout(3000);
      
      console.log('🔍 Analyzing page structure...');
      
      // Take a screenshot
      await this.page.screenshot({ 
        path: `./target_homepage_${Date.now()}.png`, 
        fullPage: true 
      });
      
      // Method 1: Look for common search input selectors
      const commonSelectors = [
        'input[type="search"]',
        'input[placeholder*="search"]',
        'input[placeholder*="Search"]',
        'input[name*="search"]',
        'input[id*="search"]',
        'input[class*="search"]',
        'input[data-test*="search"]',
        'input[aria-label*="search"]',
        'input[aria-label*="Search"]'
      ];
      
      console.log('\n🔍 Testing common search selectors:');
      for (const selector of commonSelectors) {
        try {
          const element = await this.page.$(selector);
          if (element) {
            const placeholder = await element.getAttribute('placeholder');
            const name = await element.getAttribute('name');
            const id = await element.getAttribute('id');
            const className = await element.getAttribute('class');
            const dataTest = await element.getAttribute('data-test');
            
            console.log(`✅ FOUND: ${selector}`);
            console.log(`   Placeholder: ${placeholder || 'N/A'}`);
            console.log(`   Name: ${name || 'N/A'}`);
            console.log(`   ID: ${id || 'N/A'}`);
            console.log(`   Class: ${className || 'N/A'}`);
            console.log(`   Data-test: ${dataTest || 'N/A'}`);
          } else {
            console.log(`❌ Not found: ${selector}`);
          }
        } catch (err) {
          console.log(`⚠️ Error with ${selector}: ${err.message}`);
        }
      }
      
      // Method 2: Look for any input elements
      console.log('\n🔍 Looking for all input elements:');
      const allInputs = await this.page.$$eval('input', inputs => 
        inputs.map(input => ({
          type: input.type,
          placeholder: input.placeholder,
          name: input.name,
          id: input.id,
          className: input.className,
          dataTest: input.getAttribute('data-test'),
          ariaLabel: input.getAttribute('aria-label')
        }))
      );
      
      allInputs.forEach((input, index) => {
        console.log(`Input ${index + 1}:`);
        console.log(`  Type: ${input.type}`);
        console.log(`  Placeholder: ${input.placeholder || 'N/A'}`);
        console.log(`  Name: ${input.name || 'N/A'}`);
        console.log(`  ID: ${input.id || 'N/A'}`);
        console.log(`  Class: ${input.className || 'N/A'}`);
        console.log(`  Data-test: ${input.dataTest || 'N/A'}`);
        console.log(`  Aria-label: ${input.ariaLabel || 'N/A'}`);
        console.log('');
      });
      
      // Method 3: Look for search-related elements
      console.log('🔍 Looking for search-related elements:');
      const searchElements = await this.page.$$eval('*', elements => {
        const searchRelated = [];
        elements.forEach(el => {
          const text = el.textContent?.toLowerCase() || '';
          const tagName = el.tagName.toLowerCase();
          const attributes = Array.from(el.attributes).map(attr => `${attr.name}="${attr.value}"`).join(' ');
          
          if (text.includes('search') || 
              attributes.includes('search') || 
              tagName === 'form' ||
              tagName === 'button') {
            searchRelated.push({
              tagName,
              text: text.substring(0, 100),
              attributes: attributes.substring(0, 200)
            });
          }
        });
        return searchRelated.slice(0, 20); // Limit to first 20
      });
      
      searchElements.forEach((element, index) => {
        console.log(`Search element ${index + 1}:`);
        console.log(`  Tag: ${element.tagName}`);
        console.log(`  Text: ${element.text}`);
        console.log(`  Attributes: ${element.attributes}`);
        console.log('');
      });
      
    } catch (error) {
      console.error('❌ Error finding search box:', error);
    }
  }

  async close() {
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
    console.log('🔒 Browser closed');
  }
}

// Main execution function
async function main() {
  const finder = new SearchBoxFinder();
  
  try {
    await finder.initialize();
    await finder.findSearchBox();
  } catch (error) {
    console.error('❌ Search box finder failed:', error);
  } finally {
    await finder.close();
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { SearchBoxFinder };


