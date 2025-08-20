const fs = require('fs').promises;
const path = require('path');

class VitacostManualHTMLParser {
  constructor() {
    this.config = {
      selectors: {
        productLinks: "a[href*='/product/'], a[href*='/p/'], a[href*='/vitamins/'], a[href*='/supplements/']",
        productGrid: "[data-test*='product'], .product-grid, .search-results, .product-list",
        nextPage: "a[aria-label*='Next'], button[aria-label*='Next'], a:contains('Next'), .pagination a:last-child"
      },
      baseUrl: "https://www.vitacost.com",
      outputDir: "./vitacost_results"
    };
  }

  parseHTML(htmlContent) {
    console.log("🔍 Parsing Vitacost HTML content...");
    
    // Extract product URLs using multiple strategies
    const urls = new Set();
    
    // Strategy 1: Direct product link extraction
    const productLinkRegex = /href=["']([^"']*\/product\/[^"']*|https?:\/\/[^"']*\/product\/[^"']*)["']/gi;
    let match;
    while ((match = productLinkRegex.exec(htmlContent)) !== null) {
      let url = match[1];
      if (url.startsWith('/')) {
        url = this.config.baseUrl + url;
      }
      urls.add(url);
    }

    // Strategy 2: Look for product grid containers
    const productGridRegex = /<div[^>]*class="[^"]*product[^"]*"[^>]*>.*?<\/div>/gis;
    const gridMatches = htmlContent.match(productGridRegex);
    if (gridMatches) {
      gridMatches.forEach(grid => {
        const gridUrls = grid.match(/href=["']([^"']*\/product\/[^"']*)["']/gi);
        if (gridUrls) {
          gridUrls.forEach(urlMatch => {
            let url = urlMatch.replace(/href=["']/, '').replace(/["']$/, '');
            if (url.startsWith('/')) {
              url = this.config.baseUrl + url;
            }
            urls.add(url);
          });
        }
      });
    }

    // Strategy 3: Extract from JSON-LD structured data
    const jsonLdRegex = /<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gis;
    const jsonMatches = htmlContent.match(jsonLdRegex);
    if (jsonMatches) {
      jsonMatches.forEach(jsonScript => {
        try {
          const jsonContent = jsonScript.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
          const data = JSON.parse(jsonContent);
          if (data.url && data.url.includes('/product/')) {
            urls.add(data.url);
          }
          if (data.offers && data.offers.url && data.offers.url.includes('/product/')) {
            urls.add(data.offers.url);
          }
        } catch (e) {
          // Ignore JSON parsing errors
        }
      });
    }

    console.log(`✅ Found ${urls.size} unique product URLs`);
    return Array.from(urls);
  }

  async parseHTMLFile(filePath) {
    try {
      console.log(`📁 Reading HTML file: ${filePath}`);
      const htmlContent = await fs.readFile(filePath, 'utf-8');
      return this.parseHTML(htmlContent);
    } catch (error) {
      console.error(`❌ Error reading file: ${error.message}`);
      return [];
    }
  }

  async saveResults(urls, searchTerm) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const baseFilename = `vitacost_results_${searchTerm.replace(/\s+/g, '_')}_${timestamp}`;
    
    // Ensure output directory exists
    try {
      await fs.mkdir(this.config.outputDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Save as JSON
    const jsonPath = path.join(this.config.outputDir, `${baseFilename}.json`);
    const jsonData = {
      searchTerm,
      timestamp: new Date().toISOString(),
      totalUrls: urls.length,
      urls: urls,
      source: 'manual_html_parser',
      site: 'vitacost'
    };
    await fs.writeFile(jsonPath, JSON.stringify(jsonData, null, 2));
    console.log(`💾 JSON saved: ${jsonPath}`);

    // Save as TXT
    const txtPath = path.join(this.config.outputDir, `${baseFilename}.txt`);
    const txtContent = `Vitacost Product URLs - ${searchTerm}\nGenerated: ${new Date().toISOString()}\nTotal URLs: ${urls.length}\n\n${urls.join('\n')}`;
    await fs.writeFile(txtPath, txtContent);
    console.log(`💾 TXT saved: ${txtPath}`);

    return { jsonPath, txtPath };
  }

  async interactiveMode() {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log("🎯 Vitacost Manual HTML Parser - Interactive Mode");
    console.log("=" .repeat(50));

    try {
      // Get search term
      const searchTerm = await this.question(rl, "Enter the search term/supplement name: ");
      
      // Get HTML content
      console.log("\n📋 Paste your HTML content below (press Enter twice when done):");
      const htmlLines = [];
      let line;
      
      while ((line = await this.question(rl, "")) !== "") {
        htmlLines.push(line);
      }
      
      const htmlContent = htmlLines.join('\n');
      
      if (htmlContent.trim().length === 0) {
        console.log("❌ No HTML content provided");
        return;
      }

      // Parse HTML
      const urls = this.parseHTML(htmlContent);
      
      if (urls.length === 0) {
        console.log("❌ No product URLs found in the HTML");
        return;
      }

      // Save results
      const savedPaths = await this.saveResults(urls, searchTerm);
      
      console.log("\n🎉 EXTRACTION COMPLETE!");
      console.log(`Total unique URLs found: ${urls.length}`);
      console.log(`💾 Results saved:`);
      console.log(`  📄 JSON: ${path.basename(savedPaths.jsonPath)}`);
      console.log(`  📝 TXT: ${path.basename(savedPaths.txtPath)}`);
      
      console.log("\n🎯 First 5 URLs:");
      urls.slice(0, 5).forEach((url, index) => {
        console.log(`  ${index + 1}. ${url}`);
      });

    } catch (error) {
      console.error("❌ Error:", error.message);
    } finally {
      rl.close();
    }
  }

  question(rl, question) {
    return new Promise((resolve) => {
      rl.question(question, resolve);
    });
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    console.log("✅ Configuration updated");
  }
}

async function main() {
  const parser = new VitacostManualHTMLParser();
  
  if (process.argv.length > 2) {
    // File mode
    const filePath = process.argv[2];
    const urls = await parser.parseHTMLFile(filePath);
    
    if (urls.length > 0) {
      const searchTerm = path.basename(filePath, path.extname(filePath));
      await parser.saveResults(urls, searchTerm);
    }
  } else {
    // Interactive mode
    await parser.interactiveMode();
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { VitacostManualHTMLParser };


