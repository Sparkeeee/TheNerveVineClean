// herb-scraper-resilient.ts
import { PlaywrightCrawler, Dataset } from 'crawlee';
import { firefox } from 'playwright';

export interface HerbSearchRequest {
    herbName: string;
    productType?: string;
    maxResults: number;
    sites: string[];
}

export interface ScrapedProduct {
    name: string;
    price: string;
    image: string;
    description: string;
    url: string;
    site: string;
    herbName: string;
    productType: string;
    timestamp: string;
}

export class HerbScraper {
    private scrapedCount = 0;

    private generateCategoryUrls(herbName: string, productType: string, sites: string[]): string[] {
        const urls: string[] = [];
        const query = `${herbName} ${productType || ''}`.trim();

        sites.forEach(site => {
            switch (site.toLowerCase()) {
                case 'target':
                    urls.push(`https://www.target.com/s?searchTerm=${encodeURIComponent(query)}`);
                    break;
                case 'amazon':
                    urls.push(`https://www.amazon.com/s?k=${encodeURIComponent(query)}`);
                    break;
                default:
                    console.log(`Unknown site: ${site}`);
            }
        });

        return urls;
    }

    private async extractProductUrlsFromListing(page: any, site: string): Promise<string[]> {
        try {
            switch (site.toLowerCase()) {
                case 'target':
                    return await page.$$eval('a[href*="/p/"]', (links: HTMLAnchorElement[]) =>
                        links.map(l => l.href)
                            .filter(href => href.includes('target.com') && href.includes('/p/'))
                    );
                case 'amazon':
                    return await page.$$eval('a[href*="/dp/"]', (links: HTMLAnchorElement[]) =>
                        links.map(l => l.href)
                            .filter(href => href.includes('amazon.com') && href.includes('/dp/'))
                    );
                default:
                    return [];
            }
        } catch (err) {
            console.warn(`Failed to extract product URLs for ${site}:`, err);
            return [];
        }
    }

    public async scrapeHerbProducts(search: HerbSearchRequest) {
        const urls = this.generateCategoryUrls(search.herbName, search.productType || '', search.sites);
        const maxResults = search.maxResults;

        const crawler = new PlaywrightCrawler({
            launchContext: { 
                launcher: firefox,
                launchOptions: { 
                    headless: true, 
                    slowMo: 100,  // Increased for more stability
                    args: ['--no-sandbox', '--disable-setuid-sandbox'] // More stable browser
                }
            },
            maxConcurrency: 2,  // Reduced for maximum stability
            maxRequestRetries: 3, // Reasonable retry count
            requestHandlerTimeoutSecs: 90, // Increased timeout
            navigationTimeoutSecs: 60000, // Navigation timeout

            requestHandler: async ({ request, page }) => {
                if (this.scrapedCount >= maxResults) return;

                const site = search.sites.find(s => request.url.includes(s.toLowerCase())) || 'unknown';

                if (!request.userData.detailPage) {
                    // Listing page - more resilient
                    try {
                        await page.waitForLoadState('domcontentloaded', { timeout: 30000 });
                        const productUrls = await this.extractProductUrlsFromListing(page, site);
                        
                        for (const url of productUrls) {
                            if (this.scrapedCount < maxResults) {
                                await crawler.addRequests([{ 
                                    url, 
                                    userData: { detailPage: true, site },
                                    retryCount: 0
                                }]);
                            }
                        }
                    } catch (err) {
                        console.warn(`⚠️ Failed to process listing page: ${request.url}`, err);
                    }
                } else {
                    // Detail page - maximum resilience
                    try {
                        await page.goto(request.url, { 
                            waitUntil: 'domcontentloaded', 
                            timeout: 60000 
                        });
                        
                        // Wait for page to stabilize
                        await page.waitForTimeout(2000);
                        
                        // Extract data with multiple fallbacks
                        const product = await this.extractProductData(page, site, request.url, search);
                        
                        if (product) {
                            await Dataset.pushData(product);
                            this.scrapedCount++;
                            console.log(`✅ Scraped product ${this.scrapedCount}/${maxResults}: ${product.name}`);
                        }
                        
                    } catch (err) {
                        console.warn(`⚠️ Failed to process detail page: ${request.url}`, err);
                    }
                }
            }
        });

        await crawler.addRequests(urls);
        await crawler.run();

        // Export dataset to JSON
        await Dataset.exportToJSON('herb-products.json');
        console.log(`🎯 Scraping complete. Total products scraped: ${this.scrapedCount}`);
    }

    private async extractProductData(page: any, site: string, url: string, search: HerbSearchRequest): Promise<ScrapedProduct | null> {
        try {
            let price = 'N/A';
            let image = 'N/A';
            let description = '';
            let name = '';

            // Extract name
            try {
                name = await page.title() || 'Unknown Product';
            } catch {
                name = 'Unknown Product';
            }

            // Extract price with multiple strategies
            try {
                if (site.toLowerCase() === 'amazon') {
                    const priceSelectors = [
                        '#corePrice_feature_div .a-offscreen',
                        '.a-price .a-offscreen',
                        '#priceblock_ourprice',
                        '.a-price-whole',
                        '[data-a-color="price"]'
                    ];
                    
                    for (const selector of priceSelectors) {
                        try {
                            await page.waitForSelector(selector, { timeout: 5000 });
                            price = await page.$eval(selector, el => el.textContent?.trim() || 'N/A');
                            if (price !== 'N/A') break;
                        } catch {}
                    }
                } else {
                    const genericSelectors = [
                        '[class*="price"]',
                        '[data-test="product-price"]',
                        '.price',
                        '[data-price]'
                    ];
                    
                    for (const selector of genericSelectors) {
                        try {
                            await page.waitForSelector(selector, { timeout: 5000 });
                            price = await page.$eval(selector, el => el.textContent?.trim() || 'N/A');
                            if (price !== 'N/A') break;
                        } catch {}
                    }
                }
            } catch {}

            // Extract image with multiple strategies
            try {
                const imageSelectors = [
                    'img[src*="images"]',
                    'img[src*="product"]',
                    'img[src*="amazon"]',
                    '#landingImage',
                    '.product-image img',
                    'img'
                ];
                
                for (const selector of imageSelectors) {
                    try {
                        await page.waitForSelector(selector, { timeout: 5000 });
                        image = await page.$eval(selector, (el: HTMLImageElement) => el.src || 'N/A');
                        if (image !== 'N/A') break;
                    } catch {}
                }
            } catch {}

            // Extract description
            try {
                const descSelectors = [
                    '[data-test="product-description"]',
                    '.product-description',
                    'meta[name="description"]',
                    'body'
                ];
                
                for (const selector of descSelectors) {
                    try {
                        if (selector === 'meta[name="description"]') {
                            description = await page.$eval(selector, el => el.getAttribute('content') || '');
                        } else {
                            description = await page.$eval(selector, el => el.textContent?.trim() || '');
                        }
                        if (description) break;
                    } catch {}
                }
                
                // Limit description length
                description = description.slice(0, 300);
            } catch {}

            return {
                name,
                price,
                image,
                description,
                url,
                site,
                herbName: search.herbName,
                productType: search.productType || '',
                timestamp: new Date().toISOString(),
            };
            
        } catch (err) {
            console.warn(`⚠️ Failed to extract product data from ${url}:`, err);
            return null;
        }
    }

    // Optional alias for backwards compatibility
    public async run(search: HerbSearchRequest) {
        return this.scrapeHerbProducts(search);
    }
}
