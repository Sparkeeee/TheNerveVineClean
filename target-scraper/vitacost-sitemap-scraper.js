// Vitacost Sitemap-based Scraper
// Uses sitemaps to find valid URLs instead of guessing search patterns

const { PlaywrightCrawler, Dataset, log } = require('crawlee');
const fs = require('fs').promises;

const USER_AGENT = 'YourProjectBot/1.0 (+you@example.com) purpose=price-monitoring; robots-respecting';

async function getSitemapUrls() {
    const roots = [
        'https://www.vitacost.com/Sitemap.Index.xml.gz', // listed in robots.txt
        'https://www.vitacost.com/blog/sitemap.xml',
    ];
    const urls = [];

    for (const root of roots) {
        try {
            log.info(`Fetching sitemap: ${root}`);
            const res = await fetch(root);
            const buf = await res.arrayBuffer();

            // handle .gz vs .xml
            let text;
            if (root.endsWith('.gz')) {
                const { gunzipSync } = require('zlib');
                text = gunzipSync(Buffer.from(buf)).toString('utf8');
            } else {
                text = Buffer.from(buf).toString('utf8');
            }

            const xml = await parseStringPromise(text);
            const submaps = xml.sitemapindex?.sitemap?.map(s => s.loc?.[0]) ?? [];
            
            if (submaps.length) {
                log.info(`Found ${submaps.length} sub-sitemaps, recursing...`);
                // recurse 1 level
                for (const sm of submaps) {
                    try {
                        const r = await fetch(sm);
                        const t = await r.text();
                        const x = await parseStringPromise(t);
                        const locs = x.urlset?.url?.map(u => u.loc?.[0]) ?? [];
                        urls.push(...locs);
                        log.info(`Sub-sitemap ${sm}: ${locs.length} URLs`);
                    } catch (error) {
                        log.warning(`Failed to fetch sub-sitemap ${sm}: ${error.message}`);
                    }
                }
            } else {
                const locs = xml.urlset?.url?.map(u => u.loc?.[0]) ?? [];
                urls.push(...locs);
                log.info(`Direct sitemap: ${locs.length} URLs`);
            }
        } catch (error) {
            log.warning(`Failed to fetch sitemap ${root}: ${error.message}`);
        }
    }
    
    // de-dupe + keep only vitacost.com HTTP(S)
    const filteredUrls = [...new Set(urls)].filter(u => 
        /^https?:\/\/www\.vitacost\.com\//i.test(u)
    );
    
    log.info(`Total unique URLs found: ${filteredUrls.length}`);
    return filteredUrls;
}

async function parseStringPromise(xmlString) {
    // Simple XML parser for sitemaps
    const urls = [];
    const sitemaps = [];
    
    // Extract URLs from sitemap
    const urlMatches = xmlString.match(/<loc>(.*?)<\/loc>/g);
    if (urlMatches) {
        urlMatches.forEach(match => {
            const url = match.replace(/<loc>/, '').replace(/<\/loc>/, '');
            if (url.includes('sitemap')) {
                sitemaps.push(url);
            } else {
                urls.push(url);
            }
        });
    }
    
    // Return in expected format
    if (sitemaps.length > 0) {
        return {
            sitemapindex: {
                sitemap: sitemaps.map(url => ({ loc: [url] }))
            }
        };
    } else {
        return {
            urlset: {
                url: urls.map(url => ({ loc: [url] }))
            }
        };
    }
}

async function main() {
    try {
        log.info('🔍 Starting Vitacost Sitemap Scraper...');
        
        // Get URLs from sitemaps
        const startUrls = await getSitemapUrls();
        
        if (startUrls.length === 0) {
            log.error('❌ No URLs found in sitemaps');
            return;
        }

        // Filter for supplement-related URLs
        const supplementUrls = startUrls.filter(url => {
            const lowerUrl = url.toLowerCase();
            return lowerUrl.includes('supplement') || 
                   lowerUrl.includes('vitamin') || 
                   lowerUrl.includes('herb') || 
                   lowerUrl.includes('mineral') ||
                   lowerUrl.includes('probiotic') ||
                   lowerUrl.includes('omega') ||
                   lowerUrl.includes('amino') ||
                   lowerUrl.includes('antioxidant');
        });

        log.info(`📦 Found ${supplementUrls.length} supplement-related URLs`);
        
        // Show sample URLs
        if (supplementUrls.length > 0) {
            log.info('📋 Sample supplement URLs:');
            supplementUrls.slice(0, 5).forEach((url, i) => {
                log.info(`  ${i + 1}. ${url}`);
            });
        }

        // Create crawler
        const crawler = new PlaywrightCrawler({
            // Compliant crawling:
            maxRequestsPerCrawl: Math.min(100, supplementUrls.length), // modest cap
            maxConcurrency: 2,                   // slow & steady
            requestHandlerTimeoutSecs: 45,
            
            // Browser settings
            launchContext: {
                launchOptions: { 
                    headless: false, // Show browser for debugging
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-blink-features=AutomationControlled'
                    ]
                },
                userAgent: USER_AGENT,
            },
            
            requestHandler: async ({ page, request, enqueueLinks }) => {
                log.info(`🔍 Processing: ${request.url}`);
                
                try {
                    // Wait for page to load
                    await page.waitForLoadState('domcontentloaded');
                    
                    // Example extraction from a product page
                    if (/\/product\//i.test(request.url)) {
                        const title = await page.locator('h1').first().textContent();
                        const price = await page.locator('[data-testid="price"], .price, .product-price').first().textContent();
                        
                        if (title) {
                            await Dataset.pushData({
                                url: request.url,
                                title: title.trim(),
                                price: price?.trim() || 'N/A',
                                scrapedAt: new Date().toISOString()
                            });
                            
                            log.info(`✅ Product: ${title.trim()} - ${price?.trim() || 'N/A'}`);
                        }
                    }
                    
                    // Follow only on-site product links found on allowed pages
                    await enqueueLinks({
                        strategy: 'same-domain',
                        globs: ['https://www.vitacost.com/*'],
                        // Restrict to product URL patterns
                        transformRequestFunction: (req) => {
                            if (req.url.includes('/product/') || req.url.includes('/p/')) {
                                return req;
                            }
                            return false; // Don't follow non-product links
                        }
                    });
                    
                    // Polite delay
                    await page.waitForTimeout(2000 + Math.floor(Math.random() * 1500));
                    
                } catch (error) {
                    log.error(`❌ Error processing ${request.url}: ${error.message}`);
                }
            },
            
            failedRequestHandler: ({ request, error }) => {
                log.warning(`❌ Request failed: ${request.url} - ${error.message}`);
            },
        });

        log.info(`🚀 Starting crawler with ${supplementUrls.length} supplement URLs`);
        await crawler.run(supplementUrls.slice(0, 50)); // Keep scope reasonable
        
        // Export results
        const results = await Dataset.getData();
        log.info(`📊 Scraping complete! Found ${results.items.length} products`);
        
        // Save to file
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `vitacost-sitemap-results-${timestamp}.json`;
        await fs.writeFile(filename, JSON.stringify(results.items, null, 2));
        log.info(`💾 Results saved to: ${filename}`);
        
    } catch (error) {
        log.error('❌ Main function failed:', error);
    }
}

// Export for use as module
module.exports = { main, getSitemapUrls };

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}
