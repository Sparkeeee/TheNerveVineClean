// Target Ethical Sitemap Scraper
// Uses Target's official sitemaps for respectful, robots-compliant scraping

const { PlaywrightCrawler, Dataset, log } = require('crawlee');
const fs = require('fs').promises;

async function getTargetSitemapUrls() {
    // Target provides specific sitemaps in robots.txt
    const targetSitemaps = [
        'https://www.target.com/sitemap_pdp-index.xml.gz',  // Product Detail Pages
        'https://www.target.com/sitemap_taxonomy-categories-index.xml.gz',  // Categories
        'https://www.target.com/sitemap_taxonomy-brand-index.xml.gz'  // Brands
    ];
    const urls = [];

    try {
        log.info(`🔍 Target provides ${targetSitemaps.length} specific sitemaps`);
        
        // Process the main product sitemap first
        const mainSitemap = targetSitemaps[0];
        log.info(`📥 Fetching main product sitemap: ${mainSitemap}`);
        
        try {
            const res = await fetch(mainSitemap);
            if (!res.ok) throw new Error(`Status ${res.status}`);
            const xml = await res.text();
            
            // Parse the product sitemap
            const parsed = parseSitemapXml(xml);
            const productUrls = parsed?.urlset?.url?.map(u => u.loc?.[0]) ?? [];
            urls.push(...productUrls);
            log.info(`📦 Found ${productUrls.length} URLs in main product sitemap`);
            
        } catch (err) {
            log.warning(`❌ Failed to fetch main product sitemap: ${err.message}`);
        }
        
        // Try one more sitemap for variety
        if (targetSitemaps.length > 1) {
            const secondSitemap = targetSitemaps[1];
            log.info(`📥 Fetching second sitemap: ${secondSitemap}`);
            
            try {
                const res2 = await fetch(secondSitemap);
                if (res2.ok) {
                    const xml2 = await res2.text();
                    const parsed2 = parseSitemapXml(xml2);
                    const additionalUrls = parsed2?.urlset?.url?.map(u => u.loc?.[0]) ?? [];
                    urls.push(...additionalUrls);
                    log.info(`📦 Found ${additionalUrls.length} additional URLs in second sitemap`);
                }
            } catch (err) {
                log.warning(`❌ Failed to fetch second sitemap: ${err.message}`);
            }
        }
    } catch (err) {
        log.warning(`❌ Error processing Target sitemaps: ${err.message}`);
    }

    // Filter to product-like URLs (Target uses /p/ for products)
    const deduped = [...new Set(urls)].filter((u) =>
        /^https:\/\/www\.target\.com\/p\//i.test(u)
    );

    log.info(`✅ Collected ${deduped.length} product URLs from Target`);
    
    // Show sample URLs
    if (deduped.length > 0) {
        log.info('📋 Sample Target product URLs:');
        deduped.slice(0, 5).forEach((url, i) => {
            log.info(`  ${i + 1}. ${url}`);
        });
    }
    
    return deduped;
}

function parseSitemapXml(xmlString) {
    // Simple XML parser for sitemaps
    const urls = [];
    const sitemaps = [];
    
    // Extract URLs from sitemap
    const urlMatches = xmlString.match(/<loc>(.*?)<\/loc>/g);
    if (urlMatches) {
        urlMatches.forEach(match => {
            const url = match.replace(/<loc>/, '').replace(/<\/loc>/, '');
            if (url.includes('sitemap')) {
                sitemaps.push({ loc: [url] });
            } else {
                urls.push({ loc: [url] });
            }
        });
    }
    
    // Return in expected format
    if (sitemaps.length > 0) {
        return {
            sitemapindex: {
                sitemap: sitemaps
            }
        };
    } else {
        return {
            urlset: {
                url: urls
            }
        };
    }
}

async function main() {
    try {
        log.info('🚀 Starting Target Ethical Sitemap Scraper...');
        
        const allUrls = await getTargetSitemapUrls();
        
        if (allUrls.length === 0) {
            log.error('❌ No Target product URLs found in sitemaps');
            return;
        }

        // Sample only first 50 URLs for testing
        const startUrls = allUrls.slice(0, 50);
        log.info(`🚀 Will crawl ${startUrls.length} URLs (sampled from ${allUrls.length} total found)`);

        const crawler = new PlaywrightCrawler({
            maxConcurrency: 2,
            requestHandlerTimeoutSecs: 45,
            launchContext: {
                launchOptions: { 
                    headless: false, // Show browser for debugging
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox'
                    ]
                },
            },
            
            async requestHandler({ page, request }) {
                log.info(`🔍 Scraping: ${request.url}`);

                try {
                    // Wait for page to load
                    await page.waitForLoadState('domcontentloaded');
                    
                    // Extract product data using Target's selectors
                    const title = await page.locator('h1').first().textContent();
                    const price = await page.locator('[data-test="product-price"]').first().textContent();
                    const description = await page.locator('[data-test="item-details-description"]').first().textContent();

                    // Save data if we found meaningful content
                    if (title || price) {
                        await Dataset.pushData({
                            url: request.url,
                            title: title?.trim() || 'No title',
                            price: price?.trim() || 'No price',
                            description: description?.trim() || 'No description',
                            scrapedAt: new Date().toISOString()
                        });
                        
                        log.info(`✅ Product: ${title?.trim() || 'No title'} - ${price?.trim() || 'No price'}`);
                    }

                    // Polite delay between requests
                    await page.waitForTimeout(2000 + Math.floor(Math.random() * 2000));
                    
                } catch (error) {
                    log.error(`❌ Error processing ${request.url}: ${error.message}`);
                }
            },
            
            failedRequestHandler({ request, error }) {
                log.warning(`❌ Request failed: ${request.url} - ${error.message}`);
            },
        });

        log.info(`🚀 Starting crawler with ${startUrls.length} Target product URLs`);
        await crawler.run(startUrls);
        
        // Export results
        const results = await Dataset.getData();
        log.info(`📊 Scraping complete! Found ${results.items.length} Target products`);
        
        // Save to file
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `target-ethical-results-${timestamp}.json`;
        await fs.writeFile(filename, JSON.stringify(results.items, null, 2));
        log.info(`💾 Results saved to: ${filename}`);
        
    } catch (error) {
        log.error('❌ Main function failed:', error);
    }
}

// Export for use as module
module.exports = { main, getTargetSitemapUrls };

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}
