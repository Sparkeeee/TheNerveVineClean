// Example usage of the Vitacost Search Extractor
// Demonstrates basic and advanced usage patterns

const puppeteer = require('puppeteer');
const VitacostSearchExtractor = require('./src/extractors/vitacost/VitacostSearchExtractor');
const fs = require('fs').promises;

class VitacostExample {
    constructor() {
        this.browser = null;
        this.page = null;
        this.extractor = new VitacostSearchExtractor();
    }

    async initialize() {
        console.log('🚀 Initializing Vitacost Example...');
        
        this.browser = await puppeteer.launch({
            headless: false, // Set to true for headless operation
            defaultViewport: null,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--start-maximized'
            ]
        });

        this.page = await this.browser.newPage();
        
        // Set realistic headers
        await this.page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        });

        console.log('✅ Browser initialized successfully!');
    }

    async basicExtraction() {
        console.log('\n📋 === Basic Extraction Example ===');
        
        try {
            // Navigate to a Vitacost search page
            const searchUrl = 'https://www.vitacost.com/productsearch.aspx?t=l-theanine';
            console.log(`🌐 Navigating to: ${searchUrl}`);
            
            await this.page.goto(searchUrl, { 
                waitUntil: 'domcontentloaded',
                timeout: 30000 
            });

            // Wait for page to load
            await this.page.waitForTimeout(3000);

            // Extract data using the extractor
            console.log('🔍 Extracting data...');
            const data = await this.extractor.extract(this.page);

            // Display results
            console.log('\n📊 Extraction Results:');
            console.log(`   📦 Total products: ${data.totalProducts}`);
            console.log(`   📄 Current page: ${data.pagination.currentPage}`);
            console.log(`   📊 Total pages: ${data.pagination.totalPages}`);
            console.log(`   🔍 Search term: "${data.searchMetadata.searchTerm}"`);
            console.log(`   📋 Sort option: ${data.searchMetadata.sortBy}`);

            // Show first few products
            if (data.products.length > 0) {
                console.log('\n📋 Sample Products:');
                data.products.slice(0, 3).forEach((product, index) => {
                    console.log(`   ${index + 1}. ${product.name}`);
                    console.log(`      💰 Price: ${product.price}`);
                    console.log(`      ⭐ Rating: ${product.rating || 'N/A'}`);
                    console.log(`      🔗 URL: ${product.url}`);
                    console.log('');
                });
            }

            return data;

        } catch (error) {
            console.error('❌ Basic extraction failed:', error.message);
            throw error;
        }
    }

    async paginationExample() {
        console.log('\n📄 === Pagination Example ===');
        
        try {
            // Navigate to first page
            const baseUrl = 'https://www.vitacost.com/productsearch.aspx?t=ashwagandha';
            console.log(`🌐 Starting with: ${baseUrl}`);
            
            await this.page.goto(baseUrl, { 
                waitUntil: 'domcontentloaded',
                timeout: 30000 
            });

            await this.page.waitForTimeout(3000);

            // Extract first page
            const firstPageData = await this.extractor.extract(this.page);
            console.log(`📄 Page 1: ${firstPageData.totalProducts} products`);

            // Check if there are more pages
            const hasMore = await this.extractor.hasMoreResults(this.page);
            if (hasMore) {
                console.log('✅ More pages available, extracting next page...');
                
                // Get next page URL
                const nextPageUrl = await this.extractor.extractNextPageUrl(this.page);
                if (nextPageUrl) {
                    console.log(`🌐 Navigating to next page: ${nextPageUrl}`);
                    
                    await this.page.goto(nextPageUrl, { 
                        waitUntil: 'domcontentloaded',
                        timeout: 30000 
                    });
                    
                    await this.page.waitForTimeout(3000);
                    
                    // Extract second page
                    const secondPageData = await this.extractor.extract(this.page);
                    console.log(`📄 Page 2: ${secondPageData.totalProducts} products`);
                    
                    // Compare results
                    console.log('\n📊 Page Comparison:');
                    console.log(`   Page 1: ${firstPageData.totalProducts} products`);
                    console.log(`   Page 2: ${secondPageData.totalProducts} products`);
                    console.log(`   Total: ${firstPageData.totalProducts + secondPageData.totalProducts} products`);
                }
            } else {
                console.log('ℹ️ Only one page of results available');
            }

        } catch (error) {
            console.error('❌ Pagination example failed:', error.message);
        }
    }

    async advancedFeatures() {
        console.log('\n🔧 === Advanced Features Example ===');
        
        try {
            const searchUrl = 'https://www.vitacost.com/productsearch.aspx?t=turmeric';
            console.log(`🌐 Testing advanced features with: ${searchUrl}`);
            
            await this.page.goto(searchUrl, { 
                waitUntil: 'domcontentloaded',
                timeout: 30000 
            });

            await this.page.waitForTimeout(3000);

            // Test all available page URLs
            console.log('🔍 Getting all available page URLs...');
            const allPageUrls = await this.extractor.getAllPageUrls(this.page);
            console.log(`📄 Found ${allPageUrls.length} page URLs:`);
            
            allPageUrls.slice(0, 5).forEach(pageInfo => {
                console.log(`   Page ${pageInfo.page}: ${pageInfo.url}`);
            });

            if (allPageUrls.length > 5) {
                console.log(`   ... and ${allPageUrls.length - 5} more pages`);
            }

            // Test pagination info extraction
            console.log('\n🔍 Testing pagination info extraction...');
            const paginationInfo = await this.extractor.extractPaginationInfo(this.page);
            console.log('📊 Pagination Details:');
            console.log(`   Current page: ${paginationInfo.currentPage}`);
            console.log(`   Total pages: ${paginationInfo.totalPages}`);
            console.log(`   Total products: ${paginationInfo.totalProducts}`);
            console.log(`   Products per page: ${paginationInfo.productsPerPage}`);
            console.log(`   Has next page: ${paginationInfo.hasNextPage}`);
            console.log(`   Has previous page: ${paginationInfo.hasPreviousPage}`);

            // Test search metadata extraction
            console.log('\n🔍 Testing search metadata extraction...');
            const searchMetadata = await this.extractor.extractSearchMetadata(this.page);
            console.log('🔍 Search Metadata:');
            console.log(`   Search term: "${searchMetadata.searchTerm}"`);
            console.log(`   Sort by: ${searchMetadata.sortBy}`);
            console.log(`   Breadcrumbs: ${searchMetadata.breadcrumbs.length} items`);

        } catch (error) {
            console.error('❌ Advanced features example failed:', error.message);
        }
    }

    async saveResults(data, filename = 'vitacost-example-results.json') {
        try {
            await fs.writeFile(filename, JSON.stringify(data, null, 2));
            console.log(`💾 Results saved to: ${filename}`);
        } catch (error) {
            console.error('❌ Failed to save results:', error.message);
        }
    }

    async cleanup() {
        try {
            if (this.browser) {
                await this.browser.close();
                console.log('🔒 Browser closed');
            }
        } catch (error) {
            console.error('❌ Error during cleanup:', error.message);
        }
    }

    async runAllExamples() {
        try {
            await this.initialize();
            
            // Run basic extraction
            const basicData = await this.basicExtraction();
            await this.saveResults(basicData, 'vitacost-basic-results.json');
            
            // Run pagination example
            await this.paginationExample();
            
            // Run advanced features
            await this.advancedFeatures();
            
            console.log('\n🎉 All examples completed successfully!');
            console.log('📁 Check the generated JSON files for detailed results.');
            
        } catch (error) {
            console.error('💥 Example execution failed:', error.message);
        } finally {
            await this.cleanup();
        }
    }
}

// Main execution
async function main() {
    const example = new VitacostExample();
    await example.runAllExamples();
}

// Export for use as module
module.exports = VitacostExample;

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

