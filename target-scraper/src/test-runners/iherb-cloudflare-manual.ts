const { PuppeteerCrawler, Dataset, ProxyConfiguration } = require('crawlee');
const { addExtra } = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Configure puppeteer-extra with enhanced stealth
const puppeteerExtra = addExtra(puppeteer);
puppeteerExtra.use(StealthPlugin());

class IHerbURLCrawler {
    constructor(options = {}) {
        this.maxRequestsPerCrawl = options.maxRequestsPerCrawl || 100;
        this.requestDelay = options.requestDelay || 10000; // 10 second delays
        this.outputFile = options.outputFile || 'iherb_supplement_urls.json';
        this.collectedUrls = new Set();
        this.sessionDir = options.sessionDir || './browser_session';
        this.useProxy = options.useProxy || false;
        
        // Ensure session directory exists
        if (!fs.existsSync(this.sessionDir)) {
            fs.mkdirSync(this.sessionDir, { recursive: true });
        }
    }

    async initialize() {
        this.crawler = new PuppeteerCrawler({
            launchContext: {
                launcher: puppeteerExtra,
                launchOptions: {
                    headless: false, // Keep visible for manual intervention
                    userDataDir: this.sessionDir, // Persist browser session
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-blink-features=AutomationControlled',
                        '--disable-features=VizDisplayCompositor,AutomationControlled',
                        '--disable-web-security',
                        '--disable-dev-shm-usage',
                        '--no-first-run',
                        '--disable-default-apps',
                        '--disable-extensions',
                        '--window-size=1920,1080',
                        '--start-maximized',
                        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        // Additional anti-detection flags
                        '--disable-automation',
                        '--disable-plugins-discovery',
                        '--allow-running-insecure-content',
                        '--no-default-browser-check',
                        '--no-first-run',
                        '--disable-background-timer-throttling',
                        '--disable-backgrounding-occluded-windows',
                        '--disable-renderer-backgrounding'
                    ],
                    defaultViewport: null // Use full window
                }
            },
            maxRequestsPerCrawl: this.maxRequestsPerCrawl,
            requestHandlerTimeoutSecs: 300, // 5 minute timeout
            maxConcurrency: 1,
            
            preNavigationHooks: [
                async ({ page, request }) => {
                    console.log(`\n🌐 Navigating to: ${request.url}`);
                    
                    // Enhanced anti-detection
                    await page.evaluateOnNewDocument(() => {
                        // Remove webdriver property
                        delete navigator.__proto__.webdriver;
                        
                        // Mock plugins
                        Object.defineProperty(navigator, 'plugins', {
                            get: () => [
                                { name: 'Chrome PDF Plugin', description: 'Portable Document Format' },
                                { name: 'Chrome PDF Viewer', description: 'PDF Viewer' },
                                { name: 'Native Client', description: 'Native Client Executable' }
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
                        };
                        
                        // Override the `plugins` property to use a custom getter.
                        Object.defineProperty(Navigator.prototype, 'webdriver', {
                            get: () => false,
                        });
                    });
                    
                    // Set additional headers
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
                }
            ],

            async requestHandler({ page, request, enqueueLinks }) {
                try {
                    console.log(`\n📄 Processing: ${request.url}`);
                    
                    // Wait for the page to fully load
                    await page.waitForLoadState('networkidle', { timeout: 30000 });
                    
                    // Check for and handle Cloudflare
                    const cfResult = await this.handleCloudflareAdvanced(page, request.url);
                    if (!cfResult.success) {
                        console.log(`❌ Cloudflare block detected, skipping: ${request.url}`);
                        return; // Skip this request
                    }
                    
                    // Add human delay
                    await this.humanDelay();
                    
                    const url = request.url;
                    
                    if (this.isCategoryPage(url)) {
                        await this.handleCategoryPage(page, enqueueLinks);
                    } else if (this.isProductPage(url)) {
                        await this.handleProductPage(page, url);
                    } else {
                        await this.handleNavigationPage(page, enqueueLinks);
                    }
                    
                } catch (error) {
                    console.error(`💥 Error processing ${request.url}:`, error.message);
                    
                    // If it's a 403 or Cloudflare error, don't retry immediately
                    if (error.message.includes('403') || error.message.includes('blocked')) {
                        console.log('🛡️  Detected blocking - adding extra delay before next request');
                        await this.humanDelay(15000, 30000); // 15-30 second delay
                    }
                    
                    throw error;
                }
            },

            failedRequestHandler({ request }) {
                console.log(`💀 Request failed permanently: ${request.url}`);
            }
        });
    }

    async handleCloudflareAdvanced(page, url) {
        console.log('🔍 Checking for Cloudflare protection...');
        
        try {
            // Wait for initial page load
            await page.waitForTimeout(3000);
            
            // Check for various Cloudflare indicators
            const pageContent = await page.content();
            const title = await page.title();
            
            const cloudflareIndicators = [
                'checking your browser',
                'cloudflare',
                'please wait',
                'ddos protection',
                'security check',
                'ray id',
                'cf-browser-verification'
            ];
            
            const hasCloudflareChallenge = cloudflareIndicators.some(indicator => 
                pageContent.toLowerCase().includes(indicator) || 
                title.toLowerCase().includes(indicator)
            );
            
            if (hasCloudflareChallenge) {
                console.log('⚠️  Cloudflare challenge detected - manual intervention needed');
                console.log('🎯 Please solve the challenge manually in the browser window');
                console.log('⏳ Waiting up to 60 seconds for challenge completion...');
                
                // Wait for user to solve challenge
                await this.waitForCloudflareResolution(page);
                
                // Verify we're past the challenge
                const newContent = await page.content();
                const newTitle = await page.title();
                const stillBlocked = cloudflareIndicators.some(indicator => 
                    newContent.toLowerCase().includes(indicator) || 
                    newTitle.toLowerCase().includes(indicator)
                );
                
                if (stillBlocked) {
                    return { success: false, reason: 'Cloudflare challenge not resolved' };
                }
                
                console.log('✅ Cloudflare challenge appears to be resolved');
                await page.waitForTimeout(5000); // Extra wait after resolution
            }
            
            return { success: true };
            
        } catch (error) {
            console.error('🚨 Error handling Cloudflare:', error.message);
            return { success: false, reason: error.message };
        }
    }

    async waitForCloudflareResolution(page) {
        const maxWaitTime = 60000; // 60 seconds
        const checkInterval = 2000;  // Check every 2 seconds
        let elapsed = 0;
        
        while (elapsed < maxWaitTime) {
            try {
                // Check if we can access normal page content
                const hasNormalContent = await page.evaluate(() => {
                    const body = document.body ? document.body.textContent : '';
                    const title = document.title;
                    
                    // Look for signs we're on the actual site
                    return body.includes('iHerb') && 
                           !title.toLowerCase().includes('checking') &&
                           !body.toLowerCase().includes('checking your browser');
                });
                
                if (hasNormalContent) {
                    console.log('🎉 Normal page content detected!');
                    return true;
                }
                
                await page.waitForTimeout(checkInterval);
                elapsed += checkInterval;
                
                if (elapsed % 10000 === 0) { // Log every 10 seconds
                    console.log(`⏰ Still waiting... ${elapsed/1000}s elapsed`);
                }
                
            } catch (error) {
                console.log('⚠️  Error during challenge wait:', error.message);
                await page.waitForTimeout(checkInterval);
                elapsed += checkInterval;
            }
        }
        
        console.log('⏰ Timeout waiting for Cloudflare resolution');
        return false;
    }

    async humanDelay(min = 8000, max = 15000) {
        const delay = Math.floor(Math.random() * (max - min + 1)) + min;
        console.log(`⏱️  Human delay: ${delay/1000}s`);
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    isCategoryPage(url) {
        return url.includes('/c/') || url.includes('category');
    }

    isProductPage(url) {
        return url.includes('/pr/') && !url.includes('/c/');
    }

    async handleCategoryPage(page, enqueueLinks) {
        console.log('📂 Processing category page...');
        
        // Gentle scroll to reveal content
        await this.gentleScroll(page);
        
        const productUrls = await page.evaluate(() => {
            const links = [];
            const productLinks = document.querySelectorAll('a[href*="/pr/"]');
            productLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href) {
                    const absoluteUrl = href.startsWith('http') ? href : `https://www.iherb.com${href}`;
                    links.push(absoluteUrl);
                }
            });
            return [...new Set(links)];
        });

        console.log(`📦 Found ${productUrls.length} product URLs on this page`);

        // Collect URLs but don't enqueue them all (to avoid overwhelming the queue)
        productUrls.forEach(url => {
            if (!this.collectedUrls.has(url)) {
                this.collectedUrls.add(url);
            }
        });

        // Only enqueue a few for verification
        const samplesToVerify = productUrls.slice(0, 5);
        for (const url of samplesToVerify) {
            await enqueueLinks({
                urls: [url],
                label: 'PRODUCT'
            });
        }

        console.log(`✅ Collected ${productUrls.length} URLs, queued ${samplesToVerify.length} for verification`);
    }

    async gentleScroll(page) {
        await page.evaluate(async () => {
            await new Promise((resolve) => {
                let totalHeight = 0;
                const distance = 200;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if(totalHeight >= scrollHeight){
                        clearInterval(timer);
                        window.scrollTo(0, 0); // Back to top
                        setTimeout(resolve, 1000);
                    }
                }, 300); // Slower scrolling
            });
        });
    }

    async handleProductPage(page, url) {
        console.log(`🔍 Verifying product: ${url}`);
        
        const isSupplementProduct = await page.evaluate(() => {
            const title = document.title.toLowerCase();
            const content = document.body ? document.body.textContent.toLowerCase() : '';
            
            const supplementKeywords = [
                'supplement', 'vitamin', 'mineral', 'herbal', 'herb',
                'capsule', 'tablet', 'powder', 'liquid', 'extract',
                'mg', 'iu', 'mcg', 'probiotic', 'omega', 'amino'
            ];
            
            return supplementKeywords.some(keyword => 
                title.includes(keyword) || content.includes(keyword)
            );
        });

        if (isSupplementProduct) {
            this.collectedUrls.add(url);
            console.log(`✅ Verified supplement: ${url}`);
        } else {
            console.log(`❌ Not a supplement: ${url}`);
        }
    }

    async handleNavigationPage(page, enqueueLinks) {
        console.log('🧭 Processing navigation page...');
        // For now, just collect any product links we find
        await this.handleCategoryPage(page, enqueueLinks);
    }

    async saveResults() {
        const urlArray = Array.from(this.collectedUrls);
        const results = {
            totalUrls: urlArray.length,
            timestamp: new Date().toISOString(),
            crawlerSettings: {
                maxRequests: this.maxRequestsPerCrawl,
                requestDelay: this.requestDelay,
                sessionDir: this.sessionDir
            },
            urls: urlArray
        };

        fs.writeFileSync(this.outputFile, JSON.stringify(results, null, 2));
        console.log(`\n💾 Saved ${urlArray.length} URLs to ${this.outputFile}`);

        const txtFile = this.outputFile.replace('.json', '.txt');
        fs.writeFileSync(txtFile, urlArray.join('\n'));
        console.log(`💾 Saved URLs to ${txtFile} (text format)`);

        return results;
    }

    async run() {
        await this.initialize();
        
        // Start with just one URL to test
        const startUrls = [
            'https://www.iherb.com/c/vitamins'
        ];

        console.log('\n🚀 Starting iHerb URL crawler (Enhanced Cloudflare handling)');
        console.log(`📊 Max requests: ${this.maxRequestsPerCrawl}`);
        console.log(`⏱️  Request delay: ${this.requestDelay}ms`);
        console.log(`💾 Session directory: ${this.sessionDir}`);
        console.log(`🎯 Starting with ${startUrls.length} URL\n`);
        
        console.log('⚠️  IMPORTANT: If you see Cloudflare challenges, solve them manually in the browser window!');
        console.log('🤖 The crawler will wait for you to complete them.\n');

        await this.crawler.run(startUrls);
        
        const results = await this.saveResults();
        
        console.log('\n🎉 === CRAWL COMPLETE ===');
        console.log(`📦 Total supplement URLs collected: ${results.totalUrls}`);
        console.log(`💾 Results saved to: ${this.outputFile}`);
        
        return results;
    }
}

// Usage with ultra-conservative settings for Cloudflare
async function main() {
    const crawler = new IHerbURLCrawler({
        maxRequestsPerCrawl: 20,    // Very small to test
        requestDelay: 12000,       // 12 second delays
        outputFile: 'iherb_supplement_urls.json',
        sessionDir: './iherb_session' // Persist browser session
    });

    try {
        await crawler.run();
    } catch (error) {
        console.error('💥 Crawler failed:', error);
    }
}

module.exports = IHerbURLCrawler;

if (require.main === module) {
    main().catch(console.error);
}
