// Enhanced Stealth Vitacost Scraper
// Uses aggressive anti-detection techniques

const { PuppeteerCrawler, Dataset, log } = require('crawlee');
const fs = require('fs').promises;

class VitacostStealthScraper {
    constructor(options = {}) {
        this.browser = 'puppeteer';
        this.headless = options.headless !== false; // Default to headless
        this.maxConcurrency = 1; // Single thread for stealth
        this.requestDelay = options.requestDelay || 3000; // Longer delays
        this.maxRequestRetries = options.maxRequestRetries || 2;
        
        this.baseUrl = 'https://www.vitacost.com';
        this.results = new Map();
        
        this.setupCrawler();
    }

    setupCrawler() {
        this.crawler = new PuppeteerCrawler({
            maxConcurrency: this.maxConcurrency,
            requestHandlerTimeoutSecs: 180, // 3 minutes
            maxRequestRetries: this.maxRequestRetries,
            requestHandler: this.createRequestHandler(),
            failedRequestHandler: this.createFailedRequestHandler(),
            launchContext: {
                launchOptions: {
                    headless: this.headless,
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-blink-features=AutomationControlled',
                        '--disable-web-security',
                        '--disable-features=VizDisplayCompositor',
                        '--disable-dev-shm-usage',
                        '--disable-accelerated-2d-canvas',
                        '--no-first-run',
                        '--no-default-browser-check',
                        '--disable-background-timer-throttling',
                        '--disable-backgrounding-occluded-windows',
                        '--disable-renderer-backgrounding',
                        '--disable-ipc-flooding-protection',
                        '--disable-hang-monitor',
                        '--disable-prompt-on-repost',
                        '--disable-domain-reliability',
                        '--disable-component-extensions-with-background-pages',
                        '--disable-default-apps',
                        '--disable-extensions',
                        '--disable-sync',
                        '--disable-translate',
                        '--hide-scrollbars',
                        '--mute-audio',
                        '--no-default-browser-check',
                        '--no-first-run',
                        '--disable-background-networking',
                        '--disable-default-apps',
                        '--disable-extensions',
                        '--disable-sync',
                        '--disable-translate',
                        '--hide-scrollbars',
                        '--metrics-recording-only',
                        '--mute-audio',
                        '--no-first-run',
                        '--safebrowsing-disable-auto-update',
                        '--ignore-certificate-errors',
                        '--ignore-ssl-errors',
                        '--ignore-certificate-errors-spki-list',
                        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    ],
                    defaultViewport: null, // Use full window
                    ignoreDefaultArgs: ['--enable-automation'],
                    ignoreHTTPSErrors: true
                },
            },
        });
    }

    createRequestHandler() {
        return async ({ request, page }) => {
            const { userData } = request;
            const { supplementName, pageNum, action } = userData;

            log.info(`Processing: ${action} for ${supplementName} (Page ${pageNum || 1})`);

            try {
                // Enhanced stealth measures
                await this.applyStealthMeasures(page);
                
                // Set realistic viewport
                await page.setViewport({ width: 1366, height: 768 });
                
                // Wait for page to load
                await page.waitForSelector('body', { timeout: 20000 });

                if (action === 'search') {
                    await this.handleSearchPage(page, supplementName, pageNum);
                } else if (action === 'product') {
                    await this.handleProductPage(page, userData);
                }

                // Human-like delay
                await this.randomDelay(2000, 5000);

            } catch (error) {
                log.error(`Error processing ${request.url}: ${error.message}`);
                throw error;
            }
        };
    }

    async applyStealthMeasures(page) {
        // Remove webdriver property
        await page.evaluateOnNewDocument(() => {
            // Remove webdriver
            delete navigator.__proto__.webdriver;
            
            // Mock plugins
            Object.defineProperty(navigator, 'plugins', {
                get: () => [
                    {
                        name: 'Chrome PDF Plugin',
                        description: 'Portable Document Format',
                        filename: 'internal-pdf-viewer',
                        length: 1
                    },
                    {
                        name: 'Chrome PDF Viewer',
                        description: 'PDF Viewer',
                        filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai',
                        length: 1
                    },
                    {
                        name: 'Native Client',
                        description: 'Native Client Executable',
                        filename: 'internal-nacl-plugin',
                        length: 1
                    }
                ],
            });

            // Mock languages
            Object.defineProperty(navigator, 'languages', {
                get: () => ['en-US', 'en'],
            });

            // Mock permissions
            Object.defineProperty(navigator, 'permissions', {
                get: () => ({
                    query: () => Promise.resolve({ state: 'granted' }),
                }),
            });

            // Mock chrome object
            window.chrome = {
                runtime: {},
                loadTimes: function() {},
                csi: function() {},
                app: {}
            };

            // Override the `plugins` property to use a custom getter.
            Object.defineProperty(Navigator.prototype, 'webdriver', {
                get: () => false,
            });

            // Mock screen properties
            Object.defineProperty(screen, 'colorDepth', { get: () => 24 });
            Object.defineProperty(screen, 'pixelDepth', { get: () => 24 });
        });

        // Set realistic headers
        await page.setExtraHTTPHeaders({
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'max-age=0'
        });

        // Add random mouse movements
        await this.simulateHumanBehavior(page);
    }

    async simulateHumanBehavior(page) {
        // Random mouse movements
        const viewport = await page.viewport();
        if (viewport) {
            for (let i = 0; i < 3; i++) {
                const x = Math.random() * viewport.width;
                const y = Math.random() * viewport.height;
                await page.mouse.move(x, y, { steps: 10 });
                await this.randomDelay(100, 300);
            }
        }

        // Random scrolling
        await page.evaluate(() => {
            window.scrollTo(0, Math.random() * 100);
        });
    }

    createFailedRequestHandler() {
        return async ({ request, error }) => {
            log.error(`Request failed: ${request.url}`);
            log.error(`Error: ${error.message}`);
            
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
        // Handle cookie consent
        await this.handleCookieConsent(page);

        // Check for blocking
        const isBlocked = await this.checkForBlocking(page);
        if (isBlocked) {
            log.warning(`Page appears blocked for ${supplementName}`);
            return;
        }

        // Try multiple search strategies
        let products = [];
        
        // Strategy 1: Direct search URL
        products = await this.extractProductsDirect(page, supplementName, pageNum);
        
        // Strategy 2: Search box if direct failed
        if (products.length === 0) {
            log.info('Direct search failed, trying search box...');
            products = await this.trySearchBox(page, supplementName, pageNum);
        }

        // Strategy 3: Category navigation if search failed
        if (products.length === 0) {
            log.info('Search failed, trying category navigation...');
            products = await this.tryCategoryNavigation(page, supplementName, pageNum);
        }

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
    }

    async extractProductsDirect(page, supplementName, pageNum) {
        try {
            const products = await page.evaluate((supplementName, pageNum) => {
                const productLinks = [];
                const foundLinks = new Set();

                // Multiple selector strategies
                const selectors = [
                    'a[href*="/product/"]',
                    'a[href*="/p/"]',
                    '.product-tile a',
                    '[data-testid="product-tile"] a',
                    '.search-result-item a',
                    '.product-card a',
                    '.product-item a',
                    '.product a',
                    'a[href*="vitacost.com/product"]',
                    'a[href*="vitacost.com/p/"]'
                ];

                selectors.forEach(selector => {
                    const links = document.querySelectorAll(selector);
                    links.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href && !foundLinks.has(href)) {
                            foundLinks.add(href);
                            
                            let productName = link.querySelector('img')?.getAttribute('alt') ||
                                             link.querySelector('h1, h2, h3, h4, h5')?.textContent?.trim() ||
                                             link.textContent?.trim() ||
                                             'Unknown Product';

                            productName = productName.replace(/\s+/g, ' ').trim();
                            
                            if (productName.length > 3 && productName !== 'Unknown Product') {
                                const fullUrl = href.startsWith('http') ? href : `https://www.vitacost.com${href}`;
                                
                                productLinks.push({
                                    name: productName,
                                    url: fullUrl,
                                    supplementName,
                                    pageNum,
                                    extractedAt: new Date().toISOString()
                                });
                            }
                        }
                    });
                });

                return productLinks;
            }, supplementName, pageNum);

            return products;
        } catch (error) {
            log.error(`Error extracting products directly: ${error.message}`);
            return [];
        }
    }

    async trySearchBox(page, supplementName, pageNum) {
        try {
            // Find search input
            const searchSelectors = [
                'input[type="search"]',
                'input[name="search"]',
                'input[name="q"]',
                'input[placeholder*="search"]',
                '#search',
                '.search-input',
                'input[aria-label*="search"]'
            ];

            let searchInput = null;
            for (const selector of searchSelectors) {
                try {
                    searchInput = await page.$(selector);
                    if (searchInput) {
                        log.info(`Found search input: ${selector}`);
                        break;
                    }
                } catch (e) {
                    continue;
                }
            }

            if (searchInput) {
                // Clear and type search term
                await searchInput.click();
                await searchInput.evaluate(el => el.value = '');
                await searchInput.type(supplementName, { delay: 100 }); // Human-like typing
                
                // Submit search
                await searchInput.press('Enter');
                await page.waitForTimeout(3000);
                
                // Extract products from search results
                return await this.extractProductsDirect(page, supplementName, pageNum);
            }
        } catch (error) {
            log.error(`Search box method failed: ${error.message}`);
        }
        
        return [];
    }

    async tryCategoryNavigation(page, supplementName, pageNum) {
        try {
            // Try to navigate to supplement category pages
            const categoryUrls = [
                `https://www.vitacost.com/${supplementName.replace(/\s+/g, '-')}`,
                `https://www.vitacost.com/supplements/${supplementName.replace(/\s+/g, '-')}`,
                `https://www.vitacost.com/vitamins/${supplementName.replace(/\s+/g, '-')}`,
                `https://www.vitacost.com/herbs/${supplementName.replace(/\s+/g, '-')}`
            ];

            for (const url of categoryUrls) {
                try {
                    log.info(`Trying category URL: ${url}`);
                    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
                    
                    // Check if page loaded successfully
                    const title = await page.title();
                    if (!title.includes('error') && !title.includes('not found')) {
                        log.info(`Category page loaded: ${title}`);
                        return await this.extractProductsDirect(page, supplementName, pageNum);
                    }
                } catch (error) {
                    log.debug(`Category URL failed: ${url} - ${error.message}`);
                    continue;
                }
            }
        } catch (error) {
            log.error(`Category navigation failed: ${error.message}`);
        }
        
        return [];
    }

    async checkForBlocking(page) {
        try {
            const title = await page.title();
            const content = await page.content();
            
            const blockingIndicators = [
                title.toLowerCase().includes('access denied'),
                title.toLowerCase().includes('blocked'),
                title.toLowerCase().includes('security'),
                title.toLowerCase().includes('captcha'),
                content.toLowerCase().includes('access denied'),
                content.toLowerCase().includes('blocked'),
                content.toLowerCase().includes('security check'),
                content.toLowerCase().includes('captcha'),
                content.toLowerCase().includes('verify you are human')
            ];
            
            return blockingIndicators.some(indicator => indicator === true);
        } catch (error) {
            return false;
        }
    }

    async handleCookieConsent(page) {
        try {
            const cookieSelectors = [
                '#onetrust-accept-btn-handler',
                '.cookie-accept',
                '[data-testid="accept-cookies"]',
                'button[id*="accept"]',
                'button[class*="accept"]',
                'button[class*="cookie"]'
            ];

            for (const selector of cookieSelectors) {
                try {
                    const button = await page.$(selector);
                    if (button) {
                        await button.click();
                        log.info('Accepted cookie consent');
                        await page.waitForTimeout(1000);
                        break;
                    }
                } catch (e) {
                    continue;
                }
            }
        } catch (error) {
            log.debug('No cookie consent found or error accepting:', error.message);
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

    buildSearchUrl(supplementName, page = 1) {
        const encodedName = encodeURIComponent(supplementName);
        // Try multiple URL patterns
        const patterns = [
            `${this.baseUrl}/search?t=${encodedName}&p=${page}`,
            `${this.baseUrl}/search?q=${encodedName}&page=${page}`,
            `${this.baseUrl}/search/${encodedName}?page=${page}`,
            `${this.baseUrl}/${encodedName.replace(/\s+/g, '-')}?page=${page}`
        ];
        
        return patterns[0];
    }

    async scrapeSupplements(supplementNames, options = {}) {
        const { includeProductDetails = false, maxPagesPerSupplement = 3 } = options;

        log.info(`Starting stealth scrape for supplements: ${supplementNames.join(', ')}`);

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

        return this.getResults();
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
            const file = filename || `vitacost-stealth-${timestamp}.json`;
            await fs.writeFile(file, JSON.stringify(results, null, 2));
            log.info(`Results exported to ${file}`);
        }
    }

    async close() {
        if (this.crawler) {
            await this.crawler.teardown();
        }
    }

    async randomDelay(min, max) {
        const delay = Math.floor(Math.random() * (max - min + 1)) + min;
        await new Promise(resolve => setTimeout(resolve, delay));
    }
}

// Test function
async function testStealthScraper() {
    const scraper = new VitacostStealthScraper({
        headless: false, // Show browser for debugging
        requestDelay: 3000
    });

    try {
        console.log('🧪 Testing Stealth Vitacost Scraper...\n');

        // Test with just one supplement first
        const testSupplement = 'kava kava';
        
        const results = await scraper.scrapeSupplements([testSupplement], {
            includeProductDetails: false,
            maxPagesPerSupplement: 1
        });

        console.log('\n=== STEALTH TEST RESULTS ===');
        for (const [supplement, products] of Object.entries(results)) {
            console.log(`${supplement}: ${products.length} products found`);
            
            if (products.length > 0) {
                console.log('Sample products:');
                products.slice(0, 3).forEach((product, index) => {
                    console.log(`  ${index + 1}. ${product.name}`);
                    console.log(`     URL: ${product.url}`);
                });
            } else {
                console.log('⚠️  No products found - stealth methods failed');
            }
        }

        // Export results
        await scraper.exportResults('json');

    } catch (error) {
        console.error('❌ Stealth scraper failed:', error.message);
    } finally {
        await scraper.close();
    }
}

if (require.main === module) {
    testStealthScraper().catch(console.error);
}

module.exports = VitacostStealthScraper;

