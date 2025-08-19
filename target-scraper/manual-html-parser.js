const fs = require('fs').promises;
const path = require('path');

class ManualHTMLParser {
  constructor() {
    this.config = {
      selectors: {
        productLinks: "a[href*='/p/']",
        productCards: "[data-test*='ProductCard']",
        productTitles: "[data-test='product-title']"
      },
      output: {
        format: 'json', // 'json', 'csv', 'txt'
        filename: 'manual_target_results'
      }
    };
  }

  // Parse HTML string and extract product URLs
  parseHTML(htmlContent) {
    console.log('🔍 Parsing HTML content...');
    
    const urls = new Set();
    
    try {
      // Method 1: Extract all /p/ links
      const pLinkRegex = /href=["']([^"']*\/p\/[^"']*)["']/g;
      let match;
      
      while ((match = pLinkRegex.exec(htmlContent)) !== null) {
        const url = match[1];
        if (url && !url.startsWith('#')) {
          const fullUrl = url.startsWith('http') ? url : `https://www.target.com${url}`;
          urls.add(fullUrl);
        }
      }
      
      console.log(`🔍 Method 1 (regex): Found ${urls.size} /p/ URLs`);
      
      // Method 2: Look for product card patterns
      const productCardRegex = /data-test[^>]*ProductCard[^>]*>/g;
      const productCards = htmlContent.match(productCardRegex) || [];
      console.log(`🔍 Method 2 (product cards): Found ${productCards.length} product card elements`);
      
      // Method 3: Look for product title patterns
      const productTitleRegex = /data-test[^>]*product-title[^>]*>/g;
      const productTitles = htmlContent.match(productTitleRegex) || [];
      console.log(`🔍 Method 3 (product titles): Found ${productTitles.length} product title elements`);
      
      // Method 4: Extract any links that might be products
      const linkRegex = /<a[^>]*href=["']([^"']*)["'][^>]*>/g;
      const allLinks = [];
      
      while ((match = linkRegex.exec(htmlContent)) !== null) {
        const url = match[1];
        if (url && !url.startsWith('#') && !url.startsWith('javascript:')) {
          allLinks.push(url);
        }
      }
      
      console.log(`🔍 Method 4 (all links): Found ${allLinks.length} total links`);
      
      // Filter all links for potential products
      allLinks.forEach(url => {
        if (url.includes('/p/') || url.includes('product') || url.includes('supplement')) {
          const fullUrl = url.startsWith('http') ? url : `https://www.target.com${url}`;
          urls.add(fullUrl);
        }
      });
      
    } catch (error) {
      console.error('❌ Error parsing HTML:', error.message);
    }
    
    return Array.from(urls);
  }

  // Parse HTML from file
  async parseHTMLFile(filePath) {
    try {
      console.log(`📁 Reading HTML file: ${filePath}`);
      const htmlContent = await fs.readFile(filePath, 'utf8');
      return this.parseHTML(htmlContent);
    } catch (error) {
      console.error('❌ Error reading HTML file:', error.message);
      return [];
    }
  }

  // Save results in configured format
  async saveResults(urls, searchTerm) {
    if (urls.length === 0) {
      console.log('⚠️ No URLs to save');
      return;
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${this.config.output.filename}_${searchTerm.replace(/\s+/g, '_')}_${timestamp}`;
    
    try {
      switch (this.config.output.format.toLowerCase()) {
        case 'json':
          const jsonData = {
            searchTerm,
            timestamp: new Date().toISOString(),
            totalUrls: urls.length,
            urls: urls,
            config: this.config,
            method: 'Manual HTML Parsing'
          };
          await fs.writeFile(`${filename}.json`, JSON.stringify(jsonData, null, 2));
          break;
          
        case 'csv':
          const csv = 'URL\n' + urls.join('\n');
          await fs.writeFile(`${filename}.csv`, csv);
          break;
          
        case 'txt':
          await fs.writeFile(`${filename}.txt`, urls.join('\n'));
          break;
          
        default:
          console.error('❌ Unknown output format:', this.config.output.format);
          return;
      }
      
      console.log(`💾 Results saved: ${filename}.${this.config.output.format}`);
      
    } catch (error) {
      console.error('❌ Failed to save results:', error);
    }
  }

  // Interactive mode for manual HTML input
  async interactiveMode() {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    console.log('🎯 MANUAL HTML PARSER - Interactive Mode');
    console.log('=========================================\n');
    console.log('Instructions:');
    console.log('1. Go to Target.com and search for your product');
    console.log('2. Right-click on the product section and "Inspect Element"');
    console.log('3. Copy the HTML that contains the product cards');
    console.log('4. Paste it here when prompted\n');
    
    try {
      const searchTerm = await this.question(rl, '🔍 Enter your search term (e.g., "magnesium glycinate supplement"): ');
      
      console.log('\n📋 Now paste the HTML content below (press Enter twice when done):');
      
      let htmlContent = '';
      let line;
      
      while ((line = await this.question(rl, '')) !== '') {
        htmlContent += line + '\n';
      }
      
      if (htmlContent.trim()) {
        console.log('\n🔍 Parsing HTML content...');
        const urls = this.parseHTML(htmlContent);
        
        if (urls.length > 0) {
          await this.saveResults(urls, searchTerm);
          
          console.log('\n🎉 SUCCESS! First 5 URLs:');
          urls.slice(0, 5).forEach((url, i) => {
            console.log(`  ${i + 1}. ${url}`);
          });
          
          if (urls.length > 5) {
            console.log(`  ... and ${urls.length - 5} more URLs`);
          }
        } else {
          console.log('\n❌ No URLs found in the HTML');
        }
      } else {
        console.log('\n⚠️ No HTML content provided');
      }
      
    } catch (error) {
      console.error('❌ Interactive mode failed:', error);
    } finally {
      rl.close();
    }
  }

  // Helper function for readline questions
  question(rl, question) {
    return new Promise((resolve) => {
      rl.question(question, resolve);
    });
  }

  // Update configuration
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    console.log('✅ Configuration updated');
  }
}

// Main execution function
async function main() {
  const parser = new ManualHTMLParser();
  
  // Check command line arguments
  const args = process.argv.slice(2);
  
  if (args.length > 0) {
    // File mode: parse HTML from file
    const filePath = args[0];
    const searchTerm = args[1] || 'manual_search';
    
    console.log(`🔍 Parsing HTML file: ${filePath}`);
    const urls = await parser.parseHTMLFile(filePath);
    
    if (urls.length > 0) {
      await parser.saveResults(urls, searchTerm);
      console.log(`\n🎉 Found ${urls.length} URLs!`);
    } else {
      console.log('\n❌ No URLs found in the HTML file');
    }
    
  } else {
    // Interactive mode: manual HTML input
    await parser.interactiveMode();
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { ManualHTMLParser };


