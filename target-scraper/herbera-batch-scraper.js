// HerbEra Batch Scraper - World #9
// Ethical product URL discovery with batch processing, proxy rotation, and filtering
// Built for Shopify-based herbal supplement site with respect for rate limits

const { PlaywrightCrawler, Dataset, log } = require('crawlee');
const fs = require('fs');

// === CONFIG ===
const START_URLS = [
    'https://herb-era.com/search?q=skullcap',           // Direct search for skullcap
    'https://herb-era.com/search?q=kava',               // Direct search for kava
    'https://herb-era.com/collections/all',             // Fallback: all products
    'https://herb-era.com/collections/formulas',        // Fallback: formulas
    // Removed broken collections that return 404s:
    // 'https://herb-era.com/collections/herbs',      // Returns 404
    // 'https://herb-era.com/collections/supplements', // Returns 404  
    // 'https://herb-era.com/collections/tinctures',  // Returns 404
    // 'https://herb-era.com/collections/teas'        // Returns 404
];
const BATCH_SIZE = 10;
const MIN_DELAY_MS = 2000;
const MAX_DELAY_MS = 5000;
const SCROLL_DELAY_MS = 1000;
const MAX_SCROLLS = 15;
const BATCH_DELAY_MIN = 10000;
const BATCH_DELAY_MAX = 20000;

// === FILTERING CONTROL ===
const FILTER_KEYWORDS = [
    'kava',            // Kava products
    'skullcap',        // Skullcap products
    // Removed other keywords to focus on specific search
];

const ENABLE_FILTERING = true;          // Re-enabled filtering now that we have direct search URLs
const FILTER_MODE = 'OR';               // 'OR' = any keyword, 'AND' = all keywords

// === ETHICAL SCRAPING CONFIG ===
const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1.2 Mobile/15E148 Safari/604.1'
];

const PROXIES = [
    // Add your proxy list here - for now using empty array for testing
    // 'http://username:password@proxy1:port',
    // 'http://username:password@proxy2:port',
    // 'http://username:password@proxy3:port',
];

const PROGRESS_FILE = './herbera_progress.json';

// === UTILITIES ===
function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function loadProgress() {
    if (fs.existsSync(PROGRESS_FILE)) {
        try {
            const data = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
            return data.remainingUrls ?? [];
        } catch (error) {
            log.warning(`⚠️ Error reading progress file: ${error.message}`);
            return [];
        }
    }
    return [];
}

function saveProgress(remainingUrls) {
    try {
        fs.writeFileSync(PROGRESS_FILE, JSON.stringify({ remainingUrls }, null, 2));
        log.info(`💾 Progress saved: ${remainingUrls.length} URLs remaining`);
    } catch (error) {
        log.error(`❌ Error saving progress: ${error.message}`);
    }
}

// === PRODUCT URL DISCOVERY ===
async function discoverProductUrls() {
    const allUrls = new Set();
    let totalScrollCount = 0;

    console.log('🔍 Discovering products from HerbEra collections...');
    console.log(`📂 Processing ${START_URLS.length} collections for: ${FILTER_KEYWORDS.join(', ')}`);

    const crawler = new PlaywrightCrawler({
        maxConcurrency: 1,
        launchContext: {
            launchOptions: {
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        },
        async requestHandler({ page, request }) {
            const collectionName = request.url.split('/collections/')[1] || 'unknown';
            console.log(`📄 ${collectionName.toUpperCase()}: Loading...`);

            // Wait for product container to load
            try {
                await page.waitForSelector('li.grid__item.grid__item--collection-template', { timeout: 10000 });
            } catch (error) {
                console.log(`⚠️ ${collectionName}: No products found`);
                return;
            }

            // Initial product count
            let initialCount = 0;
            try {
                initialCount = await page.$$eval('a.grid-view-item__link', links => 
                    links.filter(link => link.href && link.href.includes('/products/')).length
                );
                
                if (initialCount === 0) {
                    initialCount = await page.$$eval('a[href*="/products/"]', links => links.length);
                }
            } catch (error) {
                console.log(`⚠️ ${collectionName}: Error counting products`);
                return;
            }
            
            console.log(`🔗 ${collectionName}: Found ${initialCount} products`);

            // Scroll loop to trigger lazy loading
            let previousHeight = 0;
            let previousCount = initialCount;
            let noNewProductsCount = 0;
            let categoryScrollCount = 0;
            const MAX_NO_NEW_PRODUCTS = 3;

            for (let i = 0; i < MAX_SCROLLS; i++) {
                categoryScrollCount++;
                totalScrollCount++;

                const currentHeight = await page.evaluate(() => document.body.scrollHeight);
                await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
                await page.waitForTimeout(SCROLL_DELAY_MS);
                
                let currentCount = 0;
                try {
                    currentCount = await page.$$eval('a.grid-view-item__link', links => 
                        links.filter(link => link.href && link.href.includes('/products/')).length
                    );
                    
                    if (currentCount === 0) {
                        currentCount = await page.$$eval('a[href*="/products/"]', links => links.length);
                    }
                } catch (error) {
                    // Continue silently
                }
                
                if (currentCount > previousCount) {
                    console.log(`🎉 ${collectionName}: +${currentCount - previousCount} new products`);
                    noNewProductsCount = 0;
                } else if (currentCount === previousCount) {
                    noNewProductsCount++;
                    if (noNewProductsCount >= MAX_NO_NEW_PRODUCTS) {
                        break;
                    }
                }
                
                if (currentHeight === previousHeight && currentCount === previousCount) {
                    break;
                }
                
                previousHeight = currentHeight;
                previousCount = currentCount;
            }

            // Extract product URLs
            let productLinks = [];
            try {
                productLinks = await page.$$eval('a.grid-view-item__link', links =>
                    links.map(a => a.href).filter(href => href && href.includes('/products/'))
                );
                
                if (productLinks.length === 0) {
                    productLinks = await page.$$eval('a[href*="/products/"]', links =>
                        links.map(a => a.href).filter(href => href && href.length > 0)
                    );
                }
                
                productLinks = productLinks.filter(url => url && url.startsWith('http') && !url.includes('#'));
                productLinks = [...new Set(productLinks)];
                
            } catch (error) {
                console.log(`❌ ${collectionName}: Error extracting URLs`);
                return;
            }

            // Add to collection
            let newUrls = 0;
            for (const link of productLinks) {
                if (!allUrls.has(link)) {
                    allUrls.add(link);
                    newUrls++;
                }
            }

            console.log(`✅ ${collectionName}: Added ${newUrls} new URLs (Total: ${allUrls.size})`);

            // Category completion delay
            const categoryDelay = randomBetween(2000, 4000);
            await page.waitForTimeout(categoryDelay);
        },
        failedRequestHandler({ request, response }) {
            if (response?.status() === 404) {
                console.log(`❌ ${request.url.split('/collections/')[1] || 'unknown'}: 404 Not Found`);
            }
        }
    });

    await crawler.run(START_URLS);

    let urlsArray = Array.from(allUrls);
    console.log(`\n📊 DISCOVERY COMPLETE:`);
    console.log(`   Total products found: ${urlsArray.length}`);
    console.log(`   Total scrolls: ${totalScrollCount}`);

    // Apply filtering
    if (ENABLE_FILTERING && FILTER_KEYWORDS.length > 0) {
        const originalCount = urlsArray.length;
        urlsArray = urlsArray.filter(url => {
            const urlLower = url.toLowerCase();
            if (FILTER_MODE === 'OR') {
                return FILTER_KEYWORDS.some(keyword => urlLower.includes(keyword));
            } else if (FILTER_MODE === 'AND') {
                return FILTER_KEYWORDS.every(keyword => urlLower.includes(keyword));
            }
            return false;
        });
        
        console.log(`\n🔍 FILTERING RESULTS:`);
        console.log(`   Keywords: ${FILTER_KEYWORDS.join(', ')}`);
        console.log(`   Mode: ${FILTER_MODE}`);
        console.log(`   Before: ${originalCount} products`);
        console.log(`   After: ${urlsArray.length} products`);
        
        if (urlsArray.length > 0) {
            console.log(`\n📋 MATCHING PRODUCTS:`);
            urlsArray.forEach((url, i) => {
                const productName = url.split('/products/')[1]?.replace(/-/g, ' ') || 'Unknown';
                console.log(`   ${i + 1}. ${productName}`);
                console.log(`      ${url}`);
            });
        } else {
            console.log(`\n⚠️ No products match the filter criteria!`);
        }
    } else {
        console.log(`\n🔍 No filtering applied - processing all ${urlsArray.length} products`);
    }

    if (urlsArray.length === 0) {
        console.log(`\n❌ No product URLs found after filtering!`);
        return [];
    }

    return urlsArray;
}

// === BATCH CRAWLER ===
async function runBatchCrawler(urls) {
    const remainingUrls = [...urls];
    
    console.log(`\n🚀 BATCH PROCESSING:`);
    console.log(`   URLs to process: ${urls.length}`);
    console.log(`   Batch size: ${BATCH_SIZE}`);
    
    let batchNumber = 1;
    let totalProcessed = 0;
    
    while (remainingUrls.length > 0) {
        const batch = remainingUrls.splice(0, BATCH_SIZE);
        console.log(`\n📦 Batch ${batchNumber}: ${batch.length} URLs`);

        const crawler = new PlaywrightCrawler({
            maxConcurrency: 1,
            requestHandlerTimeoutSecs: 60,
            async requestHandler({ page, request }) {
                const ua = USER_AGENTS[randomBetween(0, USER_AGENTS.length - 1)];
                await page.setExtraHTTPHeaders({'User-Agent': ua});
                
                if (PROXIES.length > 0) {
                    const proxy = PROXIES[randomBetween(0, PROXIES.length - 1)];
                    await page.goto(request.url, { 
                        waitUntil: 'domcontentloaded', 
                        timeout: 60000,
                        proxy: { server: proxy }
                    });
                } else {
                    await page.goto(request.url, { 
                        waitUntil: 'domcontentloaded', 
                        timeout: 60000 
                    });
                }

                // Extract product data
                const data = await page.evaluate(() => {
                    const name = document.querySelector('.grid-view-item__title.product-card__title')?.textContent?.trim() ?? null;
                    
                    let price = document.querySelector('.price-item--regular')?.textContent?.trim() ?? null;
                    if (!price || price === '$0.00') {
                        price = document.querySelector('.price-item--sale')?.textContent?.trim() ?? null;
                    }
                    
                    const availability = document.querySelector('.price__availability .price-item')?.textContent?.trim() ?? null;
                    
                    return { name, price, availability, url: location.href };
                });

                // Log the extracted data
                if (data.name && data.price) {
                    console.log(`✅ ${data.name} - ${data.price}`);
                    if (data.availability) {
                        console.log(`   Availability: ${data.availability}`);
                    }
                } else {
                    console.log(`⚠️ Incomplete: ${data.name || 'No name'} - ${data.price || 'No price'}`);
                }

                await Dataset.pushData(data);
                totalProcessed++;

                const delay = randomBetween(MIN_DELAY_MS, MAX_DELAY_MS);
                await page.waitForTimeout(delay);
            },
            failedRequestHandler({ request, response }) {
                if (response?.status() === 429) {
                    remainingUrls.push(request.url);
                } else {
                    console.log(`❌ Failed: ${request.url}`);
                }
            }
        });

        await crawler.run(batch);
        console.log(`✅ Batch ${batchNumber} complete`);
        
        saveProgress(remainingUrls);
        
        if (remainingUrls.length > 0) {
            const batchDelay = randomBetween(BATCH_DELAY_MIN, BATCH_DELAY_MAX);
            await new Promise(r => setTimeout(r, batchDelay));
        }
        
        batchNumber++;
    }

    console.log(`\n🎉 SCRAPING COMPLETE: ${totalProcessed} products processed`);
    
    if (fs.existsSync(PROGRESS_FILE)) {
        fs.unlinkSync(PROGRESS_FILE);
    }
}

// === MAIN ===
async function main() {
    try {
        console.log('🚀 HerbEra Scraper - Searching for: ' + FILTER_KEYWORDS.join(', '));
        console.log('=====================================');

        let urls = loadProgress();
        if (urls.length === 0) {
            urls = await discoverProductUrls();
        } else {
            console.log(`📂 Resuming: ${urls.length} URLs remaining`);
        }

        if (urls.length === 0) {
            console.log("❌ No product URLs found, exiting.");
            return;
        }

        if (PROXIES.length === 0) {
            console.log(`⚠️ No proxies configured`);
        }

        await runBatchCrawler(urls);

        console.log('\n🏆 World #9 CONQUERED!');

    } catch (error) {
        console.error('❌ Main function failed:', error);
    }
}

// Export for use as module
module.exports = { main, discoverProductUrls, runBatchCrawler };

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}
