// HerbEra JSON API Scraper - Uses Shopify's built-in JSON endpoints
const axios = require('axios');
const fs = require('fs').promises;

class HerbEraJsonScraper {
    constructor() {
        this.allProducts = [];
        this.matchedProducts = [];
        this.baseUrl = 'https://herb-era.com';
        this.stats = {
            totalFound: 0,
            matches: 0,
            endpointsChecked: 0,
            startTime: Date.now()
        };
    }

    async fetchJsonEndpoint(endpoint, endpointName) {
        console.log(`\n📡 Fetching ${endpointName}: ${endpoint}`);
        try {
            const response = await axios.get(endpoint, {
                timeout: 30000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'application/json, text/plain, */*'
                }
            });

            if (response.status === 200 && response.data) {
                const products = response.data.products || [];
                console.log(`✅ ${endpointName}: Found ${products.length} products`);
                
                // Transform products to consistent format
                const transformedProducts = products.map(product => ({
                    id: product.id,
                    title: product.title,
                    handle: product.handle,
                    url: `${this.baseUrl}/products/${product.handle}`,
                    vendor: product.vendor,
                    product_type: product.product_type,
                    tags: product.tags || [],
                    price: this.extractPrice(product),
                    variants: product.variants || [],
                    images: product.images || [],
                    description: product.body_html || '',
                    available: product.available,
                    collection: endpointName,
                    scrapedAt: new Date().toISOString()
                }));

                return transformedProducts;
            } else {
                console.log(`⚠️ ${endpointName}: No products data found`);
                return [];
            }
        } catch (error) {
            if (error.response) {
                console.log(`❌ ${endpointName}: HTTP ${error.response.status} - ${error.response.statusText}`);
            } else if (error.code === 'ENOTFOUND') {
                console.log(`❌ ${endpointName}: Domain not found or network error`);
            } else if (error.code === 'ECONNABORTED') {
                console.log(`❌ ${endpointName}: Request timeout`);
            } else {
                console.log(`❌ ${endpointName}: ${error.message}`);
            }
            return [];
        }
    }

    extractPrice(product) {
        if (!product.variants || product.variants.length === 0) return 'N/A';
        
        const prices = product.variants
            .filter(v => v.price)
            .map(v => parseFloat(v.price));
        
        if (prices.length === 0) return 'N/A';
        
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        
        if (minPrice === maxPrice) {
            return `$${minPrice}`;
        } else {
            return `$${minPrice} - $${maxPrice}`;
        }
    }

    async scrapeAllProducts() {
        console.log(`🚀 HerbEra JSON API Scraper - Fast & Efficient`);
        console.log(`🎯 Using Shopify's built-in JSON endpoints`);
        console.log('='.repeat(60));

        // Shopify JSON endpoints to try
        const endpoints = [
            { name: 'all-products', url: `${this.baseUrl}/products.json` },
            { name: 'collections-all', url: `${this.baseUrl}/collections/all/products.json` },
            { name: 'collections-tinctures', url: `${this.baseUrl}/collections/tinctures/products.json` },
            { name: 'collections-capsules', url: `${this.baseUrl}/collections/capsules/products.json` },
            { name: 'collections-dried-herbs', url: `${this.baseUrl}/collections/dried-herbs/products.json` },
            { name: 'collections-powders', url: `${this.baseUrl}/collections/powders/products.json` },
            { name: 'collections-herbal-extracts', url: `${this.baseUrl}/collections/herbal-extracts/products.json` }
        ];

        console.log(`📂 Will check these JSON endpoints:`);
        endpoints.forEach(endpoint => {
            console.log(`   - ${endpoint.name}: ${endpoint.url}`);
        });

        // Fetch from all endpoints
        for (const endpoint of endpoints) {
            const products = await this.fetchJsonEndpoint(endpoint.url, endpoint.name);
            this.allProducts.push(...products);
            this.stats.endpointsChecked++;
            this.stats.totalFound += products.length;
            
            // Add small delay to be respectful
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Handle pagination for endpoints that might have limits
        await this.handlePagination();

        // NEW: Search for base products when size suffixes are found
        await this.searchBaseProducts();

        // Remove duplicates
        this.removeDuplicates();

        console.log(`\n📊 DISCOVERY RESULTS:`);
        console.log(`   Endpoints checked: ${this.stats.endpointsChecked}`);
        console.log(`   Total products found: ${this.allProducts.length}`);
        console.log(`   Unique products: ${this.allProducts.length}`);

        if (this.allProducts.length > 0) {
            console.log(`📋 Sample products discovered:`);
            this.allProducts.slice(0, 10).forEach((product, index) => {
                console.log(`   ${index + 1}. "${product.title}" - ${product.price}`);
            });
            if (this.allProducts.length > 10) {
                console.log(`   ... and ${this.allProducts.length - 10} more products`);
            }
        }
    }

    // NEW METHOD: Search for base products when size suffixes are found
    async searchBaseProducts() {
        console.log(`\n🔍 Searching for base products to get complete variants...`);
        
        const productsWithSuffixes = this.allProducts.filter(product => {
            const handle = product.handle || '';
            // Look for common size suffixes
            return /_gallon$|_5_gallons$|_large$|_bottle$|_small$/.test(handle);
        });

        if (productsWithSuffixes.length === 0) {
            console.log(`✅ No products with size suffixes found, skipping base product search`);
            return;
        }

        console.log(`📦 Found ${productsWithSuffixes.length} products with size suffixes`);
        
        const baseHandles = new Set();
        
        // Extract base handles by removing size suffixes
        productsWithSuffixes.forEach(product => {
            const handle = product.handle || '';
            // Remove common size suffixes to get base product handle
            const baseHandle = handle
                .replace(/_gallon$/, '')
                .replace(/_5_gallons$/, '')
                .replace(/_large$/, '')
                .replace(/_bottle$/, '')
                .replace(/_small$/, '');
            
            if (baseHandle !== handle) {
                baseHandles.add(baseHandle);
                console.log(`🔄 ${handle} → ${baseHandle}`);
            }
        });

        console.log(`🎯 Will search for ${baseHandles.size} base products...`);

        // Query base products for complete variant data
        for (const baseHandle of baseHandles) {
            try {
                const baseProductUrl = `${this.baseUrl}/products/${baseHandle}.json`;
                console.log(`📡 Fetching base product: ${baseProductUrl}`);
                
                const response = await axios.get(baseProductUrl, {
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Accept': 'application/json, text/plain, */*'
                    }
                });

                if (response.status === 200 && response.data && response.data.product) {
                    const baseProduct = response.data.product;
                    console.log(`✅ Base product found: ${baseProduct.title}`);
                    
                    // Transform base product to include ALL variants
                    const transformedProduct = {
                        id: baseProduct.id,
                        title: baseProduct.title,
                        handle: baseProduct.handle,
                        url: `${this.baseUrl}/products/${baseProduct.handle}`,
                        vendor: baseProduct.vendor,
                        product_type: baseProduct.product_type,
                        tags: baseProduct.tags || [],
                        price: this.extractPrice(baseProduct),
                        variants: baseProduct.variants || [],
                        images: baseProduct.images || [],
                        description: baseProduct.body_html || '',
                        available: baseProduct.available,
                        collection: 'base-product-complete',
                        scrapedAt: new Date().toISOString()
                    };

                    // Add to products list
                    this.allProducts.push(transformedProduct);
                    this.stats.totalFound++;
                    
                    console.log(`📊 Base product has ${baseProduct.variants?.length || 0} variants`);
                    
                    // Show variant details
                    if (baseProduct.variants && baseProduct.variants.length > 0) {
                        baseProduct.variants.forEach((variant, index) => {
                            const size = variant.title || variant.option1 || 'Unknown size';
                            const price = variant.price ? `$${variant.price}` : 'N/A';
                            const available = variant.available ? '✅' : '❌';
                            console.log(`   ${index + 1}. ${size} - ${price} ${available}`);
                        });
                    }
                    
                } else {
                    console.log(`⚠️ Base product not found: ${baseHandle}`);
                }
                
                // Add delay between requests
                await new Promise(resolve => setTimeout(resolve, 1500));
                
            } catch (error) {
                if (error.response) {
                    console.log(`❌ Base product ${baseHandle}: HTTP ${error.response.status}`);
                } else {
                    console.log(`❌ Base product ${baseHandle}: ${error.message}`);
                }
            }
        }

        console.log(`🎉 Base product search complete!`);
    }

    async handlePagination() {
        console.log(`\n🔄 Checking for pagination on main products endpoint...`);
        
        // Shopify's products.json endpoint typically returns 250 products max
        // If we got exactly 250, there might be more
        const mainEndpointProducts = this.allProducts.filter(p => p.collection === 'all-products');
        
        if (mainEndpointProducts.length >= 250) {
            console.log(`📄 Found ${mainEndpointProducts.length} products - checking for more pages...`);
            
            let page = 2;
            let hasMore = true;
            
            while (hasMore && page <= 10) { // Limit to 10 pages for safety
                const paginatedUrl = `${this.baseUrl}/products.json?page=${page}`;
                console.log(`📡 Checking page ${page}: ${paginatedUrl}`);
                
                const pageProducts = await this.fetchJsonEndpoint(paginatedUrl, `all-products-page-${page}`);
                
                if (pageProducts.length > 0) {
                    this.allProducts.push(...pageProducts);
                    console.log(`✅ Page ${page}: Found ${pageProducts.length} more products`);
                    page++;
                    await new Promise(resolve => setTimeout(resolve, 1500));
                } else {
                    console.log(`🏁 Page ${page}: No more products - end reached`);
                    hasMore = false;
                }
            }
        }
    }

    removeDuplicates() {
        const uniqueProducts = [];
        const seenIds = new Set();
        const seenUrls = new Set();
        
        this.allProducts.forEach(product => {
            const uniqueKey = product.id || product.url;
            if (!seenIds.has(uniqueKey) && !seenUrls.has(product.url)) {
                seenIds.add(uniqueKey);
                seenUrls.add(product.url);
                uniqueProducts.push(product);
            }
        });
        
        console.log(`🔄 Removed ${this.allProducts.length - uniqueProducts.length} duplicates`);
        this.allProducts = uniqueProducts;
    }

    filterProducts(keywords, mode = 'OR') {
        console.log(`\n🔍 FILTERING ${this.allProducts.length} PRODUCTS:`);
        console.log(`🎯 Keywords: ${keywords.join(', ')}`);
        console.log(`📋 Mode: ${mode}`);

        this.matchedProducts = this.allProducts.filter(product => {
            const tags = Array.isArray(product.tags) ? product.tags : [];
            const searchText = `${product.title} ${product.url} ${tags.join(' ')} ${product.description}`.toLowerCase();
            
            const matches = [];
            keywords.forEach(keyword => {
                const variations = this.getKeywordVariations(keyword);
                variations.forEach(variation => {
                    if (searchText.includes(variation.toLowerCase())) {
                        matches.push({ keyword, variation });
                    }
                });
            });

            const hasMatch = mode === 'OR' ? matches.length > 0 : matches.length === keywords.length;
            
            if (hasMatch) {
                console.log(`✅ MATCH: "${product.title}"`);
                matches.forEach(match => {
                    console.log(`   🌿 Found "${match.keyword}" as "${match.variation}"`);
                });
                product.matches = matches;
            }

            return hasMatch;
        });

        console.log(`🎉 Found ${this.matchedProducts.length} matching products!`);
    }

    getKeywordVariations(keyword) {
        const base = [keyword];
        const variations = {
            'ashwagandha': ['ashwagandha', 'withania', 'withania somnifera', 'winter cherry', 'indian ginseng'],
            'kava': ['kava', 'kava kava', 'kava-kava', 'piper methysticum', 'kavain'],
            'skullcap': ['skullcap', 'skull cap', 'skull-cap', 'scutellaria', 'scutellaria baicalensis', 'scutellaria lateriflora'],
            'valerian': ['valerian', 'valeriana', 'valeriana officinalis'],
            'passionflower': ['passionflower', 'passion flower', 'passiflora'],
            'lemon balm': ['lemon balm', 'lemonbalm', 'melissa'],
            'chamomile': ['chamomile', 'matricaria'],
            'lavender': ['lavender', 'lavandula'],
            'st johns wort': ['st johns wort', 'st john\'s wort', 'hypericum']
        };

        const keywordLower = keyword.toLowerCase();
        if (variations[keywordLower]) {
            base.push(...variations[keywordLower]);
        }

        // Add common variations
        const originalBase = [...base];
        originalBase.forEach(term => {
            base.push(term.replace(/\s+/g, '_'));
            base.push(term.replace(/\s+/g, '-'));
            base.push(term.replace(/\s+/g, ''));
        });

        return [...new Set(base)];
    }

    async saveResults(keywords) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        // Save all products discovered
        const allProductsFile = `herbera-json-all-products-${timestamp}.json`;
        await fs.writeFile(allProductsFile, JSON.stringify({
            searchInfo: {
                totalProducts: this.allProducts.length,
                endpointsChecked: this.stats.endpointsChecked,
                timestamp: new Date().toISOString()
            },
            products: this.allProducts
        }, null, 2));
        console.log(`💾 All products saved: ${allProductsFile}`);

        // Save matches
        if (this.matchedProducts.length > 0) {
            const matchesFile = `herbera-json-matches-${keywords.join('-')}-${timestamp}.json`;
            await fs.writeFile(matchesFile, JSON.stringify({
                searchInfo: {
                    keywords: keywords,
                    totalMatches: this.matchedProducts.length,
                    timestamp: new Date().toISOString()
                },
                matches: this.matchedProducts
            }, null, 2));
            console.log(`🎯 Matches saved: ${matchesFile}`);

            // Create a simple report
            const reportFile = `herbera-json-report-${keywords.join('-')}-${timestamp}.txt`;
            let report = `HerbEra Product Search Report\n`;
            report += `Generated: ${new Date().toISOString()}\n`;
            report += `Keywords: ${keywords.join(', ')}\n`;
            report += `Total Products Found: ${this.allProducts.length}\n`;
            report += `Matching Products: ${this.matchedProducts.length}\n\n`;
            
            this.matchedProducts.forEach((product, index) => {
                const herbs = [...new Set(product.matches.map(m => m.keyword))].join(', ');
                report += `${index + 1}. ${product.title}\n`;
                report += `   Herbs: ${herbs}\n`;
                report += `   Price: ${product.price}\n`;
                report += `   URL: ${product.url}\n`;
                report += `   Tags: ${Array.isArray(product.tags) ? product.tags.join(', ') : 'No tags'}\n\n`;
            });
            
            await fs.writeFile(reportFile, report);
            console.log(`📄 Report saved: ${reportFile}`);
        }
    }

    async run(keywords = ['ashwagandha', 'kava', 'skullcap']) {
        console.log(`🚀 HerbEra JSON API Scraper - Lightning Fast!`);
        console.log(`🎯 Searching for: ${keywords.join(', ')}`);
        console.log('='.repeat(60));

        try {
            // Scrape all products using JSON API
            await this.scrapeAllProducts();

            // Filter for target keywords
            this.filterProducts(keywords);

            // Save results
            await this.saveResults(keywords);

            // Summary
            console.log(`\n🎉 SCRAPING COMPLETE!`);
            if (this.matchedProducts.length > 0) {
                console.log(`✅ Found ${this.matchedProducts.length} products containing your herbs:`);
                this.matchedProducts.forEach((product, index) => {
                    const herbs = [...new Set(product.matches.map(m => m.keyword))].join(', ');
                    console.log(`   ${index + 1}. ${product.title} (${herbs})`);
                    console.log(`      💰 ${product.price}`);
                    const tags = Array.isArray(product.tags) ? product.tags : [];
                    console.log(`      🏷️ Tags: ${tags.slice(0, 3).join(', ')}${tags.length > 3 ? '...' : ''}`);
                    console.log(`      🔗 ${product.url}`);
                    console.log('');
                });
            } else {
                console.log(`❌ No products found containing: ${keywords.join(', ')}`);
                console.log(`💡 Checking saved data for all available products...`);
                
                // Show some available products for reference
                if (this.allProducts.length > 0) {
                    console.log(`\n📋 Available products (sample):`);
                    this.allProducts.slice(0, 10).forEach((product, index) => {
                        console.log(`   ${index + 1}. ${product.title}`);
                    });
                }
            }

            const duration = (Date.now() - this.stats.startTime) / 1000;
            console.log(`⏱️ Completed in ${duration.toFixed(1)} seconds`);

        } catch (error) {
            console.error(`💥 Fatal error: ${error.message}`);
        }
    }
}

// Alternative: Simple single-endpoint scraper
class SimpleHerbEraScraper {
    async scrapeQuick(keywords = ['ashwagandha', 'kava', 'skullcap']) {
        console.log(`⚡ Quick HerbEra Scraper - Single Endpoint`);
        console.log(`🎯 Keywords: ${keywords.join(', ')}`);
        
        try {
            // Try the main products endpoint first
            const response = await axios.get('https://herb-era.com/products.json', {
                timeout: 30000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            if (response.data && response.data.products) {
                const products = response.data.products;
                console.log(`✅ Found ${products.length} total products`);

                // Filter products
                const matches = products.filter(product => {
                    const searchText = `${product.title} ${product.handle} ${(product.tags || []).join(' ')}`.toLowerCase();
                    return keywords.some(keyword => {
                        const variations = this.getVariations(keyword);
                        return variations.some(variation => searchText.includes(variation.toLowerCase()));
                    });
                });

                console.log(`\n🎉 Found ${matches.length} matching products:`);
                matches.forEach((product, index) => {
                    const price = product.variants && product.variants[0] ? `$${product.variants[0].price}` : 'N/A';
                    console.log(`   ${index + 1}. ${product.title} - ${price}`);
                    console.log(`      🔗 https://herb-era.com/products/${product.handle}`);
                });

                return matches;
            } else {
                console.log(`❌ No products data found`);
                return [];
            }
        } catch (error) {
            console.error(`❌ Error: ${error.message}`);
            return [];
        }
    }

    getVariations(keyword) {
        const variations = {
            'ashwagandha': ['ashwagandha', 'withania'],
            'kava': ['kava', 'kava kava'],
            'skullcap': ['skullcap', 'skull cap', 'scutellaria']
        };
        return variations[keyword.toLowerCase()] || [keyword];
    }
}

// Export both classes
module.exports = { HerbEraJsonScraper, SimpleHerbEraScraper };

if (require.main === module) {
    const args = process.argv.slice(2);
    const keywords = args.length > 0 ? 
        args[0].split(',').map(k => k.trim()) : 
        ['ashwagandha', 'kava', 'skullcap'];
    
    console.log(`🎯 Starting JSON API search for: ${keywords.join(', ')}\n`);
    
    // Ask user which scraper to use
    const scraperType = args[1] || 'full'; // 'full' or 'quick'
    
    if (scraperType === 'quick') {
        const scraper = new SimpleHerbEraScraper();
        scraper.scrapeQuick(keywords).catch(console.error);
    } else {
        const scraper = new HerbEraJsonScraper();
        scraper.run(keywords).catch(console.error);
    }
}

/*
USAGE:

1. Full scraper (checks all endpoints):
   node herbera-json-scraper.js "ashwagandha,kava,skullcap"

2. Quick scraper (main endpoint only):
   node herbera-json-scraper.js "ashwagandha,kava,skullcap" quick

ADVANTAGES OF JSON API METHOD:

✅ NO PAGINATION ISSUES - Gets all data directly
✅ MUCH FASTER - No browser automation overhead  
✅ MORE RELIABLE - Direct HTTP requests vs complex page interactions
✅ COMPLETE DATA - Gets product IDs, variants, tags, descriptions
✅ NO TIMEOUTS - Simple HTTP requests with reasonable timeouts
✅ NO INFINITE LOOPS - No pagination logic needed
✅ RESPECTFUL - Can add proper delays between requests
✅ ROBUST - Works even if site layout changes

REQUIREMENTS:
npm install axios

This method should find all products instantly without any of the 
pagination or timeout issues you were experiencing!
*/
