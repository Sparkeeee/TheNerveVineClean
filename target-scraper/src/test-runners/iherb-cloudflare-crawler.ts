import { PuppeteerCrawler, Dataset } from 'crawlee';
import { addExtra } from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha';
import puppeteer from 'puppeteer';
import fs from 'fs';

// Configure puppeteer-extra with plugins
const puppeteerExtra = addExtra(puppeteer);
puppeteerExtra.use(StealthPlugin());
puppeteerExtra.use(RecaptchaPlugin({
    provider: { id: '2captcha', token: 'OPTIONAL_2CAPTCHA_TOKEN' }
}));

interface IHerbCrawlerOptions {
    maxRequestsPerCrawl?: number;
    requestDelay?: number;
    outputFile?: string;
}

class IHerbURLCrawler {
    private maxRequestsPerCrawl: number;
    private requestDelay: number;
    private outputFile: string;
    private collectedUrls: Set<string>;
    private retryAttempts: number;
    private targetCategories: string[];
    private crawler: any;

    constructor(options: IHerbCrawlerOptions = {}) {
        this.maxRequestsPerCrawl = options.maxRequestsPerCrawl || 500;
        this.requestDelay = options.requestDelay || 5000; // Longer delay for Cloudflare
        this.outputFile = options.outputFile || 'iherb_supplement_urls.json';
        this.collectedUrls = new Set();
        this.retryAttempts = 3;
        this.targetCategories = [
            'herbs-and-traditional-medicine',
            'herbal-supplements',
            'ayurveda',
            'chinese-traditional-medicine',
            'vitamins',
            'minerals',
            'nutritional-supplements',
            'sports-nutrition',
            'amino-acids',
            'enzymes-and-digestive-aids',
            'omega-fatty-acids',
            'probiotics',
            'antioxidants',
            'specialty-supplements'
        ];
    }

    async initialize() {
        this.crawler = new PuppeteerCrawler({
            launchContext: {
                launcher: puppeteerExtra,
                launchOptions: {
                    headless: false, // Run in non-headless mode to better handle Cloudflare
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-blink-features=AutomationControlled',
                        '--disable-features=VizDisplayCompositor',
                        '--disable-web-security',
                        '--disable-dev-shm-usage',
                        '--no-first-run',
                        '--disable-default-apps',
                        '--disable-extensions-file-access-check',
                        '--disable-extensions-http-throttling',
                        '--disable-ipc-flooding-protection',
                        '--window-size=1366,768',
                        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    ],
                    defaultViewport: { width: 1366, height: 768 }
                }
            },
            maxRequestsPerCrawl: this.maxRequestsPerCrawl,
            requestHandlerTimeoutSecs: 180, // Increased timeout for Cloudflare
            maxConcurrency: 1, // Single thread to avoid triggering Cloudflare
            
            preNavigationHooks: [
                async ({ page }: any) => {
                    // Additional stealth measures
                    await page.evaluateOnNewDocument(() => {
                        Object.defineProperty(navigator, 'webdriver', {
                            get: () => undefined,
                        });
                        Object.defineProperty(navigator, 'plugins', {
                            get: () => [1, 2, 3, 4, 5],
                        });
                        Object.defineProperty(navigator, 'languages', {
                            get: () => ['en-US', 'en'],
                        });
                        (window as any).chrome = {
                            runtime: {},
                        };
                        Object.defineProperty(navigator, 'permissions', {
                            get: () => ({
                                query: () => Promise.resolve({ state: 'granted' }),
                            }),
                        });
                    });
                }
            ],

            async requestHandler({ page, request, enqueueLinks }: any) {
                console.log(`Processing: ${request.url}`);
                
                try {
                    // Handle Cloudflare challenge
                    await this.handleCloudflare(page);
                    
                    // Add human-like delay
                    await this.randomDelay(2000, 5000);
                    
                    const url = request.url;
                    
                    // Check if this is a category page
                    if (this.isCategoryPage(url)) {
                        await this.handleCategoryPage(page, enqueueLinks);
                    }
                    // Check if this is a product page
                    else if (this.isProductPage(url)) {
                        await this.handleProductPage(page, url);
                    }
                    // Handle pagination and subcategories
                    else {
                        await this.handleNavigationPage(page, enqueueLinks);
                    }
                    
                } catch (error: any) {
                    console.error(`Error processing ${request.url}:`, error.message);
                    throw error; // Let Crawlee handle retries
                }
            },

            failedRequestHandler({ request }: any) {
                console.log(`Request ${request.url} failed after ${this.retryAttempts} attempts.`);
            }
        });
    }

    async handleCloudflare(page: any) {
        console.log('Checking for Cloudflare protection...');
        
        // Wait for page to load
        await page.waitForLoadState('networkidle', { timeout: 30000 });
        
        // Check for Cloudflare challenge indicators
        const cloudflareSelectors = [
            '[data-ray]', // Cloudflare ray ID
            '.cf-browser-verification',
            '.cf-checking-browser',
            '#cf-wrapper',
            '.cf-error-overview'
        ];
        
        let isCloudflareChallenge = false;
        for (const selector of cloudflareSelectors) {
            try {
                const element = await page.$(selector);
                if (element) {
                    isCloudflareChallenge = true;
                    console.log(`Cloudflare challenge detected: ${selector}`);
                    break;
                }
            } catch (error) {
                // Selector not found, continue
            }
        }
        
        // If Cloudflare challenge detected, wait for it to complete
        if (isCloudflareChallenge) {
            console.log('Waiting for Cloudflare challenge to complete...');
            
            // Wait up to 30 seconds for challenge to complete
            try {
                await page.waitForFunction(
                    () => {
                        const title = document.title.toLowerCase();
                        const body = document.body ? document.body.textContent.toLowerCase() : '';
                        
                        // Check if we're past the challenge
                        return !title.includes('checking') && 
                               !title.includes('cloudflare') && 
                               !body.includes('checking your browser') &&
                               !body.includes('please wait');
                    },
                    { timeout: 30000 }
                );
                
                console.log('✓ Cloudflare challenge completed');
                
                // Additional wait to ensure page is fully loaded
                await this.randomDelay(3000, 6000);
                
            } catch (error) {
                console.log('Cloudflare challenge timeout - attempting to continue');
                throw new Error('Cloudflare challenge failed');
            }
        }
        
        // Verify we can access the page content
        try {
            await page.waitForSelector('body', { timeout: 10000 });
        } catch (error) {
            throw new Error('Page failed to load after Cloudflare check');
        }
    }

    async randomDelay(min: number, max: number) {
        const delay = Math.floor(Math.random() * (max - min + 1)) + min;
        console.log(`Waiting ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    isCategoryPage(url: string): boolean {
        return this.targetCategories.some(category => 
            url.includes(category) || url.includes('/c/')
        );
    }

    isProductPage(url: string): boolean {
        return url.includes('/pr/') && !url.includes('/c/');
    }

    async handleCategoryPage(page: any, enqueueLinks: any) {
        console.log('Processing category page...');
        
        // Scroll to load any lazy-loaded content
        await this.autoScroll(page);
        
        const productUrls = await page.evaluate(() => {
            const links: string[] = [];
            const productLinks = document.querySelectorAll('a[href*="/pr/"]');
            productLinks.forEach((link: Element) => {
                const href = (link as HTMLAnchorElement).getAttribute('href');
                if (href) {
                    const absoluteUrl = href.startsWith('http') ? href : `https://www.iherb.com${href}`;
                    links.push(absoluteUrl);
                }
            });
            return [...new Set(links)];
        });

        console.log(`Found ${productUrls.length} product URLs on this page`);

        // Add product URLs to queue with delay
        for (let i = 0; i < productUrls.length && i < 50; i++) {
            const url = productUrls[i];
            if (!this.collectedUrls.has(url)) {
                this.collectedUrls.add(url);
                await enqueueLinks({
                    urls: [url],
                    label: 'PRODUCT'
                });
            }
        }

        // Handle pagination with extra caution
        await this.enqueuePaginationLinks(page, enqueueLinks);
    }

    async autoScroll(page: any) {
        await page.evaluate(async () => {
            await new Promise((resolve) => {
                let totalHeight = 0;
                const distance = 100;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if(totalHeight >= scrollHeight){
                        clearInterval(timer);
                        resolve(undefined);
                    }
                }, 100);
            });
        });
        
        // Scroll back to top
        await page.evaluate(() => window.scrollTo(0, 0));
    }

    async handleProductPage(page: any, url: string) {
        console.log(`Verifying product page: ${url}`);
        
        const isSupplementProduct = await page.evaluate(() => {
            const title = document.title.toLowerCase();
            const content = document.body ? document.body.textContent.toLowerCase() : '';
            
            const supplementKeywords = [
                'supplement', 'vitamin', 'mineral', 'herbal', 'herb',
                'capsule', 'tablet', 'powder', 'liquid', 'extract',
                'mg', 'iu', 'mcg', 'probiotic', 'omega', 'amino',
                'antioxidant', 'enzyme', 'nutritional'
            ];
            
            return supplementKeywords.some(keyword => 
                title.includes(keyword) || content.includes(keyword)
            );
        });

        if (isSupplementProduct) {
            this.collectedUrls.add(url);
            console.log(`✓ Verified supplement URL: ${url}`);
        }
    }

    async handleNavigationPage(page: any, enqueueLinks: any) {
        await this.autoScroll(page);
        await this.enqueueRelevantLinks(page, enqueueLinks);
        await this.enqueuePaginationLinks(page, enqueueLinks);
    }

    async enqueueRelevantLinks(page: any, enqueueLinks: any) {
        const relevantUrls = await page.evaluate((targetCategories: string[]) => {
            const links: string[] = [];
            const allLinks = document.querySelectorAll('a[href]');
            
            allLinks.forEach((link: Element) => {
                const href = (link as HTMLAnchorElement).getAttribute('href');
                const text = (link as HTMLAnchorElement).textContent?.toLowerCase() || '';
                
                if (href && (href.includes('/c/') || href.includes('/pr/'))) {
                    const absoluteUrl = href.startsWith('http') ? href : `https://www.iherb.com${href}`;
                    
                    const supplementKeywords = [
                        'vitamin', 'mineral', 'supplement', 'herbal', 'herb',
                        'nutrition', 'health', 'wellness', 'probiotic', 'omega'
                    ];
                    
                    const isRelevant = targetCategories.some(cat => absoluteUrl.includes(cat)) ||
                                     supplementKeywords.some(keyword => 
                                         text.includes(keyword) || absoluteUrl.toLowerCase().includes(keyword)
                                     );
                    
                    if (isRelevant) {
                        links.push(absoluteUrl);
                    }
                }
            });
            
            return [...new Set(links)];
        }, this.targetCategories);

        // Limit links to prevent overwhelming the queue
        for (const url of relevantUrls.slice(0, 20)) {
            await enqueueLinks({
                urls: [url],
                label: 'NAVIGATE'
            });
        }
    }

    async enqueuePaginationLinks(page: any, enqueueLinks: any) {
        const paginationUrls = await page.evaluate(() => {
            const links: string[] = [];
            const paginationSelectors = [
                'a[aria-label*="Next"]',
                'a[aria-label*="Page"]',
                '.pagination a',
                'a[href*="p="]',
                'a[href*="page="]',
                'a[rel="next"]'
            ];
            
            paginationSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach((elem: Element) => {
                    const href = (elem as HTMLAnchorElement).getAttribute('href');
                    if (href && !href.includes('#')) {
                        const absoluteUrl = href.startsWith('http') ? href : `https://www.iherb.com${href}`;
                        links.push(absoluteUrl);
                    }
                });
            });
            
            return [...new Set(links)];
        });

        // Very limited pagination to avoid triggering rate limits
        for (const url of paginationUrls.slice(0, 3)) {
            await enqueueLinks({
                urls: [url],
                label: 'PAGINATION'
            });
        }
    }

    async saveResults() {
        const urlArray = Array.from(this.collectedUrls);
        const results = {
            totalUrls: urlArray.length,
            timestamp: new Date().toISOString(),
            crawlerSettings: {
                maxRequests: this.maxRequestsPerCrawl,
                requestDelay: this.requestDelay
            },
            urls: urlArray
        };

        fs.writeFileSync(this.outputFile, JSON.stringify(results, null, 2));
        console.log(`\n✓ Saved ${urlArray.length} URLs to ${this.outputFile}`);

        const txtFile = this.outputFile.replace('.json', '.txt');
        fs.writeFileSync(txtFile, urlArray.join('\n'));
        console.log(`✓ Saved URLs to ${txtFile} (text format)`);

        return results;
    }

    async run() {
        await this.initialize();
        
        // Conservative starting URLs
        const startUrls = [
            'https://www.iherb.com/c/vitamins',
            'https://www.iherb.com/c/herbs-and-traditional-medicine',
            'https://www.iherb.com/c/nutritional-supplements'
        ];

        console.log('Starting iHerb supplement URL crawler (Cloudflare-aware)...');
        console.log(`Max requests: ${this.maxRequestsPerCrawl}`);
        console.log(`Request delay: ${this.requestDelay}ms`);
        console.log(`Starting with ${startUrls.length} category URLs\n`);

        await this.crawler.run(startUrls);
        
        const results = await this.saveResults();
        
        console.log('\n=== CRAWL COMPLETE ===');
        console.log(`Total supplement URLs collected: ${results.totalUrls}`);
        console.log(`Results saved to: ${this.outputFile}`);
        
        return results;
    }
}

// Usage with Cloudflare-optimized settings
async function main() {
    const crawler = new IHerbURLCrawler({
        maxRequestsPerCrawl: 200, // Conservative limit for Cloudflare
        requestDelay: 5000,       // Longer delays
        outputFile: 'iherb_supplement_urls.json'
    });

    try {
        await crawler.run();
    } catch (error) {
        console.error('Crawler failed:', error);
    }
}

export { IHerbURLCrawler };

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}


