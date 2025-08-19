// Vitacost Debug Scraper
// Inspects page structure to find correct selectors

const { PuppeteerCrawler, Dataset, log } = require('crawlee');
const fs = require('fs').promises;

class VitacostDebugScraper {
    constructor(options = {}) {
        this.headless = false; // Always show browser for debugging
        this.maxConcurrency = 1;
        this.baseUrl = 'https://www.vitacost.com';
        this.setupCrawler();
    }

    setupCrawler() {
        this.crawler = new PuppeteerCrawler({
            maxConcurrency: this.maxConcurrency,
            requestHandlerTimeoutSecs: 300, // 5 minutes for debugging
            maxRequestRetries: 1,
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
                        '--window-size=1920,1080',
                        '--start-maximized'
                    ],
                    defaultViewport: null
                },
            },
        });
    }

    createRequestHandler() {
        return async ({ request, page }) => {
            const { userData } = request;
            const { supplementName, pageNum, action } = userData;

            log.info(`🔍 DEBUG: Processing ${action} for ${supplementName} (Page ${pageNum || 1})`);

            try {
                // Wait for page to load
                await page.waitForSelector('body', { timeout: 30000 });
                
                // Wait extra time for dynamic content
                await page.waitForTimeout(5000);

                if (action === 'search') {
                    await this.debugSearchPage(page, supplementName, pageNum);
                }

                // Keep browser open for manual inspection
                log.info('🔍 Browser will stay open for 60 seconds for manual inspection...');
                await page.waitForTimeout(60000);

            } catch (error) {
                log.error(`❌ Error processing ${request.url}: ${error.message}`);
                throw error;
            }
        };
    }

    async debugSearchPage(page, supplementName, pageNum) {
        log.info('🔍 Starting page structure analysis...');

        // 1. Check page title and URL
        const title = await page.title();
        const url = page.url();
        log.info(`📄 Page Title: ${title}`);
        log.info(`🔗 Current URL: ${url}`);

        // 2. Check for blocking indicators
        const isBlocked = await this.checkForBlocking(page);
        if (isBlocked) {
            log.warning('⚠️ Page appears to be blocked');
            return;
        }

        // 3. Analyze page structure
        await this.analyzePageStructure(page);

        // 4. Try different extraction methods
        await this.testExtractionMethods(page, supplementName, pageNum);

        // 5. Save page HTML for manual inspection
        await this.savePageHTML(page, supplementName, pageNum);
    }

    async analyzePageStructure(page) {
        log.info('🔍 Analyzing page structure...');

        try {
            // Check for common page elements
            const pageInfo = await page.evaluate(() => {
                const info = {
                    hasBody: !!document.body,
                    bodyTextLength: document.body ? document.body.textContent.length : 0,
                    allLinks: document.querySelectorAll('a').length,
                    allImages: document.querySelectorAll('img').length,
                    allDivs: document.querySelectorAll('div').length,
                    allSpans: document.querySelectorAll('span').length,
                    allButtons: document.querySelectorAll('button').length,
                    pageHeight: document.body ? document.body.scrollHeight : 0,
                    viewportHeight: window.innerHeight
                };

                // Look for product-related elements
                const productSelectors = [
                    'a[href*="/product/"]',
                    'a[href*="/p/"]',
                    '.product',
                    '.product-tile',
                    '.product-card',
                    '.product-item',
                    '[data-testid*="product"]',
                    '.search-result',
                    '.search-result-item'
                ];

                info.productElements = {};
                productSelectors.forEach(selector => {
                    try {
                        const elements = document.querySelectorAll(selector);
                        info.productElements[selector] = elements.length;
                    } catch (e) {
                        info.productElements[selector] = 'error';
                    }
                });

                // Look for any links that might be products
                const allLinks = Array.from(document.querySelectorAll('a[href]'));
                info.linkAnalysis = {
                    total: allLinks.length,
                    withProductInHref: allLinks.filter(link => 
                        link.href.includes('product') || 
                        link.href.includes('/p/') ||
                        link.href.includes('/pr/')
                    ).length,
                    withProductInText: allLinks.filter(link => 
                        link.textContent.toLowerCase().includes('product') ||
                        link.textContent.toLowerCase().includes('buy') ||
                        link.textContent.toLowerCase().includes('shop')
                    ).length
                };

                return info;
            });

            log.info('📊 Page Structure Analysis:');
            log.info(`  Body exists: ${pageInfo.hasBody}`);
            log.info(`  Body text length: ${pageInfo.bodyTextLength}`);
            log.info(`  Total links: ${pageInfo.allLinks}`);
            log.info(`  Total images: ${pageInfo.allImages}`);
            log.info(`  Total divs: ${pageInfo.allDivs}`);
            log.info(`  Page height: ${pageInfo.pageHeight}px`);
            log.info(`  Viewport height: ${pageInfo.viewportHeight}px`);

            log.info('🔍 Product Element Analysis:');
            Object.entries(pageInfo.productElements).forEach(([selector, count]) => {
                log.info(`  ${selector}: ${count} elements`);
            });

            log.info('🔗 Link Analysis:');
            log.info(`  Total links: ${pageInfo.linkAnalysis.total}`);
            log.info(`  Links with 'product' in href: ${pageInfo.linkAnalysis.withProductInHref}`);
            log.info(`  Links with product-related text: ${pageInfo.linkAnalysis.withProductInText}`);

        } catch (error) {
            log.error(`❌ Error analyzing page structure: ${error.message}`);
        }
    }

    async testExtractionMethods(page, supplementName, pageNum) {
        log.info('🧪 Testing different extraction methods...');

        // Method 1: Direct product links
        const directProducts = await this.extractProductsDirect(page, supplementName, pageNum);
        log.info(`📦 Direct extraction found: ${directProducts.length} products`);

        // Method 2: Search for any clickable elements
        const clickableElements = await this.findClickableElements(page);
        log.info(`🔘 Found ${clickableElements.length} clickable elements`);

        // Method 3: Look for any text that might be product names
        const possibleProductTexts = await this.findPossibleProductTexts(page);
        log.info(`📝 Found ${possibleProductTexts.length} possible product text elements`);

        // Show samples
        if (directProducts.length > 0) {
            log.info('📦 Sample direct products:');
            directProducts.slice(0, 3).forEach((product, i) => {
                log.info(`  ${i + 1}. ${product.name} - ${product.url}`);
            });
        }

        if (clickableElements.length > 0) {
            log.info('🔘 Sample clickable elements:');
            clickableElements.slice(0, 5).forEach((elem, i) => {
                log.info(`  ${i + 1}. ${elem.text} (${elem.tag}) - ${elem.href || 'no href'}`);
            });
        }
    }

    async extractProductsDirect(page, supplementName, pageNum) {
        try {
            const products = await page.evaluate((supplementName, pageNum) => {
                const productLinks = [];
                const foundLinks = new Set();

                // Test multiple selector strategies
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
                    'a[href*="vitacost.com/p/"]',
                    // Add more generic selectors
                    'a[href*="buy"]',
                    'a[href*="shop"]',
                    'a[class*="product"]',
                    'a[class*="item"]'
                ];

                selectors.forEach(selector => {
                    try {
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
                    } catch (e) {
                        // Continue with next selector
                    }
                });

                return productLinks;
            }, supplementName, pageNum);

            return products;
        } catch (error) {
            log.error(`❌ Error extracting products directly: ${error.message}`);
            return [];
        }
    }

    async findClickableElements(page) {
        try {
            const elements = await page.evaluate(() => {
                const clickable = [];
                const allElements = document.querySelectorAll('a, button, [role="button"], [tabindex]');

                allElements.forEach((elem, index) => {
                    if (index < 50) { // Limit to first 50
                        const text = elem.textContent?.trim() || '';
                        const href = elem.href || elem.getAttribute('href') || '';
                        const tag = elem.tagName.toLowerCase();
                        const classes = elem.className || '';
                        const id = elem.id || '';

                        if (text.length > 0 && text.length < 100) {
                            clickable.push({
                                text: text.substring(0, 50),
                                tag,
                                href,
                                classes: classes.substring(0, 50),
                                id
                            });
                        }
                    }
                });

                return clickable;
            });

            return elements;
        } catch (error) {
            log.error(`❌ Error finding clickable elements: ${error.message}`);
            return [];
        }
    }

    async findPossibleProductTexts(page) {
        try {
            const texts = await page.evaluate(() => {
                const possibleProducts = [];
                const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div');

                textElements.forEach((elem, index) => {
                    if (index < 100) { // Limit to first 100
                        const text = elem.textContent?.trim() || '';
                        
                        // Look for text that might be product names
                        if (text.length > 10 && text.length < 200) {
                            const lowerText = text.toLowerCase();
                            
                            // Check if it contains supplement-related keywords
                            const supplementKeywords = [
                                'mg', 'mcg', 'iu', 'capsule', 'tablet', 'powder', 'liquid',
                                'supplement', 'vitamin', 'mineral', 'herb', 'extract', 'formula'
                            ];

                            const hasSupplementKeywords = supplementKeywords.some(keyword => 
                                lowerText.includes(keyword)
                            );

                            if (hasSupplementKeywords) {
                                possibleProducts.push({
                                    text: text.substring(0, 100),
                                    tag: elem.tagName.toLowerCase(),
                                    classes: elem.className?.substring(0, 50) || ''
                                });
                            }
                        }
                    }
                });

                return possibleProducts;
            });

            return texts;
        } catch (error) {
            log.error(`❌ Error finding possible product texts: ${error.message}`);
            return [];
        }
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

    async savePageHTML(page, supplementName, pageNum) {
        try {
            const html = await page.content();
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `vitacost-debug-${supplementName.replace(/\s+/g, '-')}-${timestamp}.html`;
            
            await fs.writeFile(filename, html);
            log.info(`💾 Page HTML saved to: ${filename}`);
            
            // Also save a screenshot
            const screenshotFilename = `vitacost-debug-${supplementName.replace(/\s+/g, '-')}-${timestamp}.png`;
            await page.screenshot({ path: screenshotFilename, fullPage: true });
            log.info(`📸 Screenshot saved to: ${screenshotFilename}`);
            
        } catch (error) {
            log.error(`❌ Error saving page content: ${error.message}`);
        }
    }

    createFailedRequestHandler() {
        return async ({ request, error }) => {
            log.error(`❌ Request failed: ${request.url}`);
            log.error(`❌ Error: ${error.message}`);
        };
    }

    async debugSupplement(supplementName) {
        log.info(`🔍 Starting debug scrape for: ${supplementName}`);

        const request = {
            url: `${this.baseUrl}/search?t=${encodeURIComponent(supplementName)}`,
            userData: {
                supplementName,
                pageNum: 1,
                action: 'search'
            }
        };

        await this.crawler.addRequests([request]);
        await this.crawler.run();
    }

    async close() {
        if (this.crawler) {
            await this.crawler.teardown();
        }
    }
}

// Test function
async function testDebugScraper() {
    const scraper = new VitacostDebugScraper();

    try {
        console.log('🔍 Starting Vitacost Debug Scraper...\n');
        console.log('⚠️  IMPORTANT: Browser will stay open for 60 seconds for manual inspection');
        console.log('🔍 Use this time to manually examine the page structure\n');

        await scraper.debugSupplement('kava kava');

    } catch (error) {
        console.error('❌ Debug scraper failed:', error.message);
    } finally {
        await scraper.close();
    }
}

if (require.main === module) {
    testDebugScraper().catch(console.error);
}

module.exports = VitacostDebugScraper;
