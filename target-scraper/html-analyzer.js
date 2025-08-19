const puppeteer = require('puppeteer');
const fs = require('fs').promises;

class HTMLAnalyzer {
  constructor() {
    this.results = [];
  }

  async run() {
    console.log('🔍 HTML STRUCTURE ANALYZER FOR TARGET.COM');
    console.log('==========================================\n');

    const browser = await puppeteer.launch({
      headless: false, // Visible browser for debugging
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });

    try {
      const page = await browser.newPage();
      
      // Set realistic viewport
      await page.setViewport({ width: 1366, height: 768 });
      
      // Set user agent
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

      console.log('🌐 Navigating to Target search...');
      await page.goto('https://www.target.com/s?searchTerm=magnesium%20glycinate', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // Wait for content to load
      await page.waitForTimeout(5000);
      
      // Scroll to trigger lazy loading
      console.log('📜 Scrolling to trigger lazy loading...');
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await page.waitForTimeout(3000);
      
      // Analyze the page structure
      console.log('🔍 Analyzing page structure...');
      await this.analyzePageStructure(page);
      
      // Save results
      await this.saveResults();
      
    } finally {
      await browser.close();
      console.log('🔒 Browser closed');
    }
  }

  async analyzePageStructure(page) {
    console.log('\n📊 PAGE STRUCTURE ANALYSIS:');
    console.log('============================');
    
    // 1. Check page title and URL
    const title = await page.title();
    const url = page.url();
    console.log(`📍 Page Title: ${title}`);
    console.log(`🌐 Current URL: ${url}`);
    
    // 2. Count all links
    const allLinks = await page.$$eval('a', (links) => {
      return links.map(link => ({
        href: link.href,
        text: link.textContent?.trim().substring(0, 100) || '',
        className: link.className || '',
        id: link.id || '',
        'data-test': link.getAttribute('data-test') || ''
      }));
    });
    
    console.log(`🔗 Total links found: ${allLinks.length}`);
    
    // 3. Filter for product links
    const productLinks = allLinks.filter(link => 
      link.href.includes('/p/') || 
      link.href.includes('product') ||
      link.text.toLowerCase().includes('magnesium')
    );
    
    console.log(`🎯 Product-related links: ${productLinks.length}`);
    productLinks.slice(0, 10).forEach((link, index) => {
      console.log(`  ${index + 1}. ${link.text} -> ${link.href}`);
    });
    
    // 4. Look for specific data attributes
    console.log('\n🔍 SEARCHING FOR DATA ATTRIBUTES:');
    const dataAttributes = await page.$$eval('[data-test]', (elements) => {
      const attrs = new Set();
      elements.forEach(el => {
        attrs.add(el.getAttribute('data-test'));
      });
      return Array.from(attrs);
    });
    
    console.log(`📋 Data-test attributes found: ${dataAttributes.length}`);
    dataAttributes.slice(0, 20).forEach(attr => {
      console.log(`  • ${attr}`);
    });
    
    // 5. Look for product card patterns
    console.log('\n🎴 SEARCHING FOR PRODUCT CARDS:');
    const productCardSelectors = [
      '[data-test*="ProductCard"]',
      '[class*="ProductCard"]',
      '[class*="product"]',
      '[class*="card"]',
      '[class*="item"]'
    ];
    
    for (const selector of productCardSelectors) {
      try {
        const elements = await page.$$(selector);
        if (elements.length > 0) {
          console.log(`✅ Selector "${selector}": ${elements.length} elements`);
          
          // Get details of first few elements
          const details = await page.$$eval(selector, (els) => {
            return els.slice(0, 3).map(el => ({
              tagName: el.tagName,
              className: el.className || '',
              id: el.id || '',
              'data-test': el.getAttribute('data-test') || '',
              innerHTML: el.innerHTML.substring(0, 200) + '...'
            }));
          });
          
          details.forEach((detail, index) => {
            console.log(`  ${index + 1}. <${detail.tagName}> class="${detail.className}" data-test="${detail.dataTest}"`);
          });
        }
      } catch (error) {
        console.log(`❌ Selector "${selector}" failed: ${error.message}`);
      }
    }
    
    // 6. Check for any /p/ URLs in page source
    console.log('\n📄 SEARCHING PAGE SOURCE FOR /p/ URLs:');
    const pageContent = await page.content();
    const urlMatches = pageContent.match(/\/p\/[^"'\s>]+/g) || [];
    const uniqueUrls = [...new Set(urlMatches)];
    
    console.log(`🔗 /p/ URLs found in source: ${uniqueUrls.length}`);
    uniqueUrls.slice(0, 10).forEach((url, index) => {
      console.log(`  ${index + 1}. /p/${url}`);
    });
    
    // 7. Look for any clickable elements with product-like text
    console.log('\n🖱️ SEARCHING FOR CLICKABLE PRODUCT ELEMENTS:');
    const clickableElements = await page.$$eval('a, button, [role="button"]', (elements) => {
      return elements
        .filter(el => {
          const text = el.textContent?.toLowerCase() || '';
          return text.includes('magnesium') || text.includes('supplement') || text.includes('vitamin');
        })
        .map(el => ({
          tagName: el.tagName,
          text: el.textContent?.trim().substring(0, 100) || '',
          className: el.className || '',
          href: el.href || '',
          'data-test': el.getAttribute('data-test') || ''
        }));
    });
    
    console.log(`🖱️ Clickable product elements: ${clickableElements.length}`);
    clickableElements.slice(0, 10).forEach((el, index) => {
      console.log(`  ${index + 1}. <${el.tagName}> "${el.text}" -> ${el.href}`);
    });
    
    // Store results for saving
    this.results = {
      title,
      url,
      totalLinks: allLinks.length,
      productLinks: productLinks.length,
      dataAttributes: dataAttributes.length,
      urlMatches: uniqueUrls.length,
      clickableElements: clickableElements.length,
      sampleProductLinks: productLinks.slice(0, 20),
      sampleDataAttributes: dataAttributes.slice(0, 20),
      sampleUrlMatches: uniqueUrls.slice(0, 20),
      sampleClickableElements: clickableElements.slice(0, 20)
    };
  }

  async saveResults() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    const filename = `html_analysis_${timestamp}.json`;
    await fs.writeFile(filename, JSON.stringify({
      timestamp: new Date().toISOString(),
      analysis: this.results
    }, null, 2));
    
    console.log(`\n💾 Analysis saved: ${filename}`);
    console.log(`\n📊 SUMMARY:`);
    console.log(`  Total links: ${this.results.totalLinks}`);
    console.log(`  Product links: ${this.results.productLinks}`);
    console.log(`  Data attributes: ${this.results.dataAttributes}`);
    console.log(`  /p/ URLs in source: ${this.results.urlMatches}`);
    console.log(`  Clickable product elements: ${this.results.clickableElements}`);
  }
}

// Run the analyzer
async function main() {
  const analyzer = new HTMLAnalyzer();
  await analyzer.run();
}

main().catch(console.error);


