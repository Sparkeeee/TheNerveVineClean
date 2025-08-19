// Crawlee-based Vitacost Supplement Scraper
// Supports both Puppeteer and Playwright

const { PuppeteerCrawler, PlaywrightCrawler, Dataset, log } = require('crawlee');
const fs = require('fs').promises;

class VitacostSupplementScraper {
    constructor(options = {}) {
        this.browser = options.browser || 'puppeteer'; // 'puppeteer' or 'playwright'
        this.headless = options.headless !== false; // Default to headless
        this.maxConcurrency = options.maxConcurrency || 2;
        this.requestDelay = options.requestDelay || 1000;
        this.maxRequestRetries = options.maxRequestRetries || 3;
        
        this.baseUrl = 'https://www.vitacost.com';
        this.results = new Map();
        
        this.setupCrawler();
    }

    setupCrawler() {
        const commonOptions = {
            maxConcurrency: this.maxConcurrency,
            requestHandlerTimeoutSecs: 120, // Increased timeout
            maxRequestRetries: this.maxRequestRetries,
            requestHandler: this.createRequestHandler(),
            failedRequestHandler: this.createFailedRequestHandler(),
        };

        if (this.browser === 'playwright') {
            this.crawler = new PlaywrightCrawler({
                ...commonOptions,
                launchContext: {
                    launchOptions: {
                        headless: this.headless,
                        args: [
                            '--no-sandbox', 
                            '--disable-setuid-sandbox',
                            '--disable-blink-features=AutomationControlled',
                            '--disable-web-security',
                            '--disable-features=VizDisplayCompositor'
                        ],
                    },
                },
            });
        } else {
            this.crawler = new PuppeteerCrawler({
                ...commonOptions,
                launchContext: {
                    launchOptions: {
                        headless: this.headless,
                        args: [
                            '--no-sandbox', 
                            '--disable-setuid-sandbox',
                            '--disable-blink-features=AutomationControlled',
                            '--disable-web-security',
                            '--disable-features=VizDisplayCompositor'
                        ],
                    },
                },
            });
        }
    }

    createRequestHandler() {
        return async ({ request, page }) => {
            const { userData } = request;
            const { supplementName, pageNum, action } = userData;

            log.info(`Processing: ${action} for ${supplementName} (Page ${pageNum || 1})`);

            try {
                // Set additional headers to appear more like a real browser
                await page.setExtraHTTPHeaders({
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'DNT': '1',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                });

                // Set viewport
                await page.setViewport({ width: 1366, height: 768 });

                // Wait for page to load
                await page.waitForLoadState?.('domcontentloaded') || 
                      await page.waitForSelector('body', { timeout: 15000 });

                if (action === 'search') {
                    await this.handleSearchPage(page, supplementName, pageNum);
                } else if (action === 'product') {
                    await this.handleProductPage(page, userData);
                }

                // Add delay between requests
                if (this.requestDelay > 0) {
                    await new Promise(resolve => setTimeout(resolve, this.requestDelay));
                }

            } catch (error) {
                log.error(`Error processing ${request.url}: ${error.message}`);
                throw error;
            }
        };
    }

    createFailedRequestHandler() {
        return async ({ request, error }) => {
            log.error(`Request failed: ${request.url}`);
            log.error(`Error: ${error.message}`);
            
            // Save failed URLs for manual review
            await Dataset.pushData({
                type: 'failed_request',
                url: request.url,
                error: error.message,
                userData: request.userData,
                timestamp: new Date().toISOString(),
            });
        };
    }

    async handleSearchPage(page, supplementName, pageNum) {
        // Handle cookie consent if present
        await this.handleCookieConsent(page);

        // Wait for search results to load
        const searchResultsSelector = 'div[data-testid="product-tile"], .product-tile, .search-result-item, a[href*="/product/"]';
        
        try {
            await page.waitForSelector(searchResultsSelector, { timeout: 10000 });
        } catch (error) {
            log.warning(`No search results found for ${supplementName} on page ${pageNum}`);
            return;
        }

        // Extract product URLs and basic info
        const products = await page.evaluate((supplementName, pageNum) => {
            const productLinks = [];
            
            // Multiple selectors to catch different page structures
            const selectors = [
                'a[href*="/product/"]',
                'a[href*="/p/"]',
                '.product-tile a',
                '[data-testid="product-tile"] a',
                '.search-result-item a'
            ];

            const foundLinks = new Set();

            selectors.forEach(selector => {
                const links = document.querySelectorAll(selector);
                links.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && (href.includes('/product/') || href.includes('/p/')) && !foundLinks.has(href)) {
                        foundLinks.add(href);
                        
                        // Extract product name
                        let productName = link.querySelector('img')?.getAttribute('alt') ||
                                         link.querySelector('h2, h3, h4')?.textContent?.trim() ||
                                         link.textContent?.trim() ||
                                         'Unknown Product';

                        // Clean up product name
                        productName = productName.replace(/\s+/g, ' ').trim();

                        const fullUrl = href.startsWith('http') ? href : `https://www.vitacost.com${href}`;

                        productLinks.push({
                            name: productName,
                            url: fullUrl,
                            supplementName,
                            pageNum,
                            extractedAt: new Date().toISOString()
                        });
                    }
                });
            });

            return productLinks;
        }, supplementName, pageNum);

        log.info(`Found ${products.length} products for ${supplementName} on page ${pageNum}`);

        // Store results
        if (!this.results.has(supplementName)) {
            this.results.set(supplementName, []);
        }
        this.results.get(supplementName).push(...products);

        // Save to dataset
        for (const product of products) {
            await Dataset.pushData({
                type: 'product_url',
                ...product
            });
        }

        // Check for next page
        const hasNextPage = await page.evaluate(() => {
            const nextButton = document.querySelector('a[aria-label*="next"], .pagination-next:not(.disabled), a[href*="p="]:last-child');
            return nextButton && !nextButton.classList.contains('disabled');
        });

        if (hasNextPage && pageNum < 10) { // Limit to 10 pages per supplement
            const nextPageUrl = this.buildSearchUrl(supplementName, pageNum + 1);
            await this.crawler.addRequests([{
                url: nextPageUrl,
                userData: { supplementName, pageNum: pageNum + 1, action: 'search' }
            }]);
        }
    }

    async handleProductPage(page, userData) {
        // Extract detailed product information
        const productDetails = await page.evaluate(() => {
            const details = {
                title: '',
                price: '',
                brand: '',
                rating: '',
                availability: '',
                description: '',
                ingredients: [],
                images: []
            };

            // Title
            const titleSelectors = ['h1', '.product-title', '[data-testid="product-title"]'];
            for (const selector of titleSelectors) {
                const titleEl = document.querySelector(selector);
                if (titleEl) {
                    details.title = titleEl.textContent.trim();
                    break;
                }
            }

            // Price
            const priceSelectors = ['.price', '.product-price', '[data-testid="price"]', '.current-price'];
            for (const selector of priceSelectors) {
                const priceEl = document.querySelector(selector);
                if (priceEl) {
                    details.price = priceEl.textContent.trim();
                    break;
                }
            }

            // Brand
            const brandSelectors = ['.brand', '[data-testid="brand"]', '.product-brand'];
            for (const selector of brandSelectors) {
                const brandEl = document.querySelector(selector);
                if (brandEl) {
                    details.brand = brandEl.textContent.trim();
                    break;
                }
            }

            // Rating
            const ratingEl = document.querySelector('.rating, [data-testid="rating"], .stars');
            if (ratingEl) {
                details.rating = ratingEl.textContent.trim();
            }

            // Availability
            const availabilityEl = document.querySelector('.availability, .stock-status, [data-testid="availability"]');
            if (availabilityEl) {
                details.availability = availabilityEl.textContent.trim();
            }

            // Images
            const images = document.querySelectorAll('.product-image img, .product-gallery img');
            details.images = Array.from(images).map(img => img.src).filter(src => src);

            return details;
        });

        await Dataset.pushData({
            type: 'product_details',
            url: page.url(),
            ...productDetails,
            ...userData,
            scrapedAt: new Date().toISOString()
        });
    }

    async handleCookieConsent(page) {
        try {
            // Common cookie consent selectors
            const cookieSelectors = [
                '#onetrust-accept-btn-handler',
                '.cookie-accept',
                '[data-testid="accept-cookies"]',
                'button[id*="accept"]',
                'button[class*="accept"]'
            ];

            for (const selector of cookieSelectors) {
                const button = await page.$(selector);
                if (button) {
                    await button.click();
                    log.info('Accepted cookie consent');
                    await page.waitForTimeout(1000);
                    break;
                }
            }
        } catch (error) {
            log.debug('No cookie consent found or error accepting:', error.message);
        }
    }

    buildSearchUrl(supplementName, page = 1) {
        const encodedName = encodeURIComponent(supplementName);
        return `${this.baseUrl}/search?t=${encodedName}&p=${page}`;
    }

    async scrapeSupplements(supplementNames, options = {}) {
        const { includeProductDetails = false, maxPagesPerSupplement = 5 } = options;

        log.info(`Starting scrape for supplements: ${supplementNames.join(', ')}`);

        // Create initial requests
        const requests = supplementNames.map(supplementName => ({
            url: this.buildSearchUrl(supplementName, 1),
            userData: { 
                supplementName, 
                pageNum: 1, 
                action: 'search',
                includeProductDetails
            }
        }));

        // Start crawling
        await this.crawler.addRequests(requests);
        await this.crawler.run();

        // Optionally scrape detailed product information
        if (includeProductDetails) {
            await this.scrapeProductDetails();
        }

        return this.getResults();
    }

    async scrapeProductDetails() {
        log.info('Scraping detailed product information...');
        
        const productRequests = [];
        for (const [supplementName, products] of this.results.entries()) {
            for (const product of products.slice(0, 20)) { // Limit to first 20 products per supplement
                productRequests.push({
                    url: product.url,
                    userData: {
                        supplementName,
                        productName: product.name,
                        action: 'product'
                    }
                });
            }
        }

        if (productRequests.length > 0) {
            await this.crawler.addRequests(productRequests);
            await this.crawler.run();
        }
    }

    getResults() {
        const results = {};
        for (const [supplementName, products] of this.results.entries()) {
            results[supplementName] = products;
        }
        return results;
    }

    async exportResults(format = 'json', filename = null) {
        const results = this.getResults();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        if (format === 'json') {
            const file = filename || `vitacost-supplements-${timestamp}.json`;
            await fs.writeFile(file, JSON.stringify(results, null, 2));
            log.info(`Results exported to ${file}`);
        } else if (format === 'csv') {
            const file = filename || `vitacost-supplements-${timestamp}.csv`;
            const csvLines = ['Supplement,Product Name,URL,Page,Extracted At'];
            
            for (const [supplementName, products] of Object.entries(results)) {
                for (const product of products) {
                    const line = [
                        supplementName,
                        `"${product.name.replace(/"/g, '""')}"`,
                        product.url,
                        product.pageNum || 1,
                        product.extractedAt || ''
                    ].join(',');
                    csvLines.push(line);
                }
            }
            
            await fs.writeFile(file, csvLines.join('\n'));
            log.info(`Results exported to ${file}`);
        }
    }

    async close() {
        if (this.crawler) {
            await this.crawler.teardown();
        }
    }
}

// Usage example
async function main() {
    const scraper = new VitacostSupplementScraper({
        browser: 'puppeteer', // or 'playwright'
        headless: true,
        maxConcurrency: 2,
        requestDelay: 1000
    });

    try {
        const supplementsToScrape = [
            'kava kava',
            'ashwagandha',
            'turmeric curcumin',
            'vitamin d3',
            'omega 3 fish oil'
        ];

        const results = await scraper.scrapeSupplements(supplementsToScrape, {
            includeProductDetails: false, // Set to true for detailed product info
            maxPagesPerSupplement: 3
        });

        // Print summary
        console.log('\n=== SCRAPING RESULTS ===');
        let totalProducts = 0;
        for (const [supplement, products] of Object.entries(results)) {
            console.log(`${supplement}: ${products.length} products found`);
            totalProducts += products.length;
            
            // Show first 3 products as examples
            products.slice(0, 3).forEach(product => {
                console.log(`  - ${product.name}`);
                console.log(`    ${product.url}`);
            });
            console.log('');
        }
        
        console.log(`Total products found: ${totalProducts}`);

        // Export results
        await scraper.exportResults('json');
        await scraper.exportResults('csv');

        console.log('Scraping completed successfully!');

    } catch (error) {
        log.error('Scraping failed:', error);
    } finally {
        await scraper.close();
    }
}

// Export for use as module
module.exports = VitacostSupplementScraper;

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}
