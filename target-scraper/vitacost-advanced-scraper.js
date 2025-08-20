// Advanced Vitacost Scraper
// Uses sitemaps with proper configuration and sophisticated crawling

const { PlaywrightCrawler, Dataset, log } = require('crawlee');
const fs = require('fs').promises;
const { gunzipSync } = require('zlib');

// Load config
let config;

async function loadConfig() {
    try {
        const configData = await fs.readFile('./config.json', 'utf-8');
        return JSON.parse(configData);
    } catch (error) {
        console.error('❌ Error loading config.json:', error.message);
        process.exit(1);
    }
}

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getSitemapUrls() {
    const allUrls = [];
    const processedSitemaps = new Set();

    for (const indexUrl of config.startUrls) {
        try {
            log.info(`🔍 Fetching sitemap index: ${indexUrl}`);
            const res = await fetch(indexUrl);
            
            if (!res.ok) {
                log.warning(`⚠️ HTTP ${res.status} for ${indexUrl}`);
                continue;
            }
            
            const buf = Buffer.from(await res.arrayBuffer());
            const xml = indexUrl.endsWith('.gz')
                ? gunzipSync(buf).toString('utf8')
                : buf.toString('utf8');
            
            log.info(`📏 Index sitemap size: ${xml.length} characters`);
            
            // Parse the index to find sub-sitemaps
            const submaps = extractSitemapUrls(xml);
            log.info(`📋 Found ${submaps.length} sub-sitemaps in index`);
            
            // Show sample sub-sitemaps
            if (submaps.length > 0) {
                log.info('📋 Sample sub-sitemaps:');
                submaps.slice(0, 5).forEach((url, i) => {
                    log.info(`  ${i + 1}. ${url}`);
                });
            }

            // Process each sub-sitemap
            for (const sm of submaps) {
                if (processedSitemaps.has(sm)) {
                    log.debug(`⏭️ Already processed: ${sm}`);
                    continue;
                }
                
                try {
                    log.info(`📥 Fetching sub-sitemap: ${sm}`);
                    const subRes = await fetch(sm);
                    
                    if (!subRes.ok) {
                        log.warning(`⚠️ HTTP ${subRes.status} for sub-sitemap ${sm}`);
                        continue;
                    }
                    
                    const subBuf = Buffer.from(await subRes.arrayBuffer());
                    const subXml = sm.endsWith('.gz')
                        ? gunzipSync(subBuf).toString('utf8')
                        : subBuf.toString('utf8');
                    
                    log.info(`📏 Sub-sitemap size: ${subXml.length} characters`);
                    
                    // Extract product URLs from this sub-sitemap
                    const productUrls = extractProductUrls(subXml);
                    log.info(`📦 Found ${productUrls.length} product URLs in ${sm}`);
                    
                    allUrls.push(...productUrls);
                    processedSitemaps.add(sm);
                    
                    // Add a small delay between sub-sitemap requests
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                } catch (err) {
                    log.warning(`❌ Error processing sub-sitemap ${sm}: ${err.message}`);
                }
            }
            
        } catch (err) {
            log.warning(`❌ Error processing index ${indexUrl}: ${err.message}`);
        }
    }

    log.info(`📊 Total URLs collected from all sitemaps: ${allUrls.length}`);
    
    // Deduplicate and filter for valid product URLs
    const deduped = [...new Set(allUrls)].filter(url => {
        // Keep only "flat" product URLs (single segment after domain)
        // This matches patterns like: https://www.vitacost.com/product-name
        const isValidUrl = /^https:\/\/www\.vitacost\.com\/[^\/]+\/?$/i.test(url) &&
               !url.includes('sitemap') &&
               !url.includes('blog') &&
               !url.includes('category') &&
               !url.includes('search');
        
        // Additional filter: only keep URLs that contain kava-related keywords
        if (isValidUrl) {
            const urlLower = url.toLowerCase();
            const kavaKeywords = ['kava', 'kava-kava', 'kava-kava', 'kava-kava', 'kava-kava'];
            return kavaKeywords.some(keyword => urlLower.includes(keyword));
        }
        
        return false;
    });

    log.info(`✅ After filtering: ${deduped.length} unique KAVA KAVA product URLs`);
    
    // Show sample product URLs
    if (deduped.length > 0) {
        log.info('📋 Sample Kava Kava product URLs:');
        deduped.slice(0, 10).forEach((url, i) => {
            log.info(`  ${i + 1}. ${url}`);
        });
    } else {
        log.warning('⚠️ No kava kava products found in sitemaps - this might indicate the products use different naming conventions');
    }
    
    return deduped;
}

function extractSitemapUrls(xmlString) {
    // Extract sitemap URLs from the index sitemap
    const sitemapMatches = xmlString.match(/<sitemap>.*?<loc>(.*?)<\/loc>.*?<\/sitemap>/gs);
    const sitemapUrls = [];
    
    if (sitemapMatches) {
        sitemapMatches.forEach(match => {
            const loc = match.match(/<loc>(.*?)<\/loc>/);
            if (loc && loc[1]) {
                sitemapUrls.push(loc[1]);
            }
        });
    }
    
    return sitemapUrls;
}

function extractProductUrls(xmlString) {
    // Extract product URLs from a product sitemap
    const urlMatches = xmlString.match(/<url>.*?<loc>(.*?)<\/loc>.*?<\/url>/gs);
    const productUrls = [];
    
    if (urlMatches) {
        urlMatches.forEach(match => {
            const loc = match.match(/<loc>(.*?)<\/loc>/);
            if (loc && loc[1]) {
                productUrls.push(loc[1]);
            }
        });
    }
    
    return productUrls;
}

async function main() {
    try {
        // Load configuration
        config = await loadConfig();
        
        log.info('🚀 Starting Advanced Vitacost Scraper...');
        
        const allUrls = await getSitemapUrls();
        
        if (allUrls.length === 0) {
            log.error('❌ No URLs found in sitemaps');
            return;
        }

        // Limit the number of URLs to crawl to avoid overwhelming the system
        const maxUrlsToCrawl = Math.min(config.crawler.maxRequestsPerCrawl, 1000);
        const startUrls = allUrls.slice(0, maxUrlsToCrawl);
        
        log.info(`🚀 Will crawl ${startUrls.length} URLs (limited from ${allUrls.length} total found)`);

        let proxyIndex = 0;

        const crawler = new PlaywrightCrawler({
            maxConcurrency: 2, // Simplified
            requestHandlerTimeoutSecs: 60,
            launchContext: {
                launchOptions: { 
                    headless: false, // Show browser for debugging
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox'
                    ]
                },
            },
            
            async requestHandler({ page, request, enqueueLinks }) {
                log.info(`🔍 Processing: ${request.url}`);
                
                try {
                    // Rotate user-agent per page
                    const userAgent = config.crawler.userAgents[
                        randomBetween(0, config.crawler.userAgents.length - 1)
                    ];
                    // Use the correct Playwright method
                    await page.setExtraHTTPHeaders({
                        'User-Agent': userAgent
                    });
                    log.debug(`Using user-agent: ${userAgent}`);

                    // Handle proxy rotation (if configured)
                    if (config.crawler.proxies.length > 0 && config.crawler.proxies[0] !== 'http://proxy1.example:8000') {
                        proxyIndex = (proxyIndex + 1) % config.crawler.proxies.length;
                        const proxy = config.crawler.proxies[proxyIndex];
                        log.debug(`Using proxy: ${proxy}`);
                    }

                    // Wait for page to load
                    await page.waitForLoadState('domcontentloaded');

                    // Human-like scrolling
                    for (let i = 0; i < randomBetween(2, 5); i++) {
                        await page.mouse.wheel(0, randomBetween(200, 600));
                        await page.waitForTimeout(randomBetween(300, 800));
                    }

                    // Extract fields
                    const data = { url: request.url };
                    for (const [key, selector] of Object.entries(config.selectors)) {
                        try {
                            const text = await page.locator(selector).first().textContent();
                            data[key] = text?.trim();
                        } catch {
                            data[key] = null;
                        }
                    }
                    
                    // Only save if we found meaningful data
                    if (data.title || data.price) {
                        await Dataset.pushData(data);
                        log.info(`✅ Product: ${data.title || 'No title'} - ${data.price || 'No price'}`);
                    }

                    // Pagination with early stopping
                    for (let i = 0; i < config.pagination.maxPages; i++) {
                        const nextBtn = page.locator(config.pagination.nextButton);
                        if (await nextBtn.count()) {
                            await nextBtn.first().click();
                            await page.waitForTimeout(randomBetween(1500, 3000));
                        } else break;
                    }

                    // Random delay between requests
                    await page.waitForTimeout(
                        randomBetween(config.crawler.minDelayMs, config.crawler.maxDelayMs)
                    );

                    // Enqueue product links (simplified to avoid validation errors)
                    try {
                        await enqueueLinks({
                            globs: ['https://www.vitacost.com/*'],
                            strategy: 'same-domain'
                        });
                    } catch (error) {
                        log.debug(`Enqueue links error (non-critical): ${error.message}`);
                    }

                } catch (error) {
                    log.error(`❌ Error processing ${request.url}: ${error.message}`);
                }
            },
            
            failedRequestHandler({ request, error }) {
                log.warning(`❌ Request failed: ${request.url} - ${error.message}`);
            },
        });

        log.info(`🚀 Starting crawler with ${startUrls.length} URLs`);
        await crawler.run(startUrls);
        
        // Export results
        const results = await Dataset.getData();
        log.info(`📊 Scraping complete! Found ${results.items.length} products`);
        
        // Save to file
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `vitacost-kava-kava-results-${timestamp}.json`;
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
