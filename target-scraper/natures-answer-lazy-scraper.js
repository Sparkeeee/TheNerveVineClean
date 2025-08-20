// Nature's Answer Lazy Scraper - World #8
// Lazy-loading discovery scraper with scroll-triggered product loading
// Built for sites that use JavaScript lazy loading instead of pagination

const { PlaywrightCrawler, Dataset, log } = require('crawlee');
const fs = require('fs');

// === CONFIG ===
const START_URLS = [
    'https://www.naturesanswer.com/collections/herbs',
    'https://www.naturesanswer.com/collections/tinctures', 
    'https://www.naturesanswer.com/collections/single-herb-supplements',
    'https://www.naturesanswer.com/collections/vitamins',
    'https://www.naturesanswer.com/collections/minerals',
    'https://www.naturesanswer.com/collections/amino-acids',
    'https://www.naturesanswer.com/collections/omega-fatty-acids',
    'https://www.naturesanswer.com/collections/probiotics',
    'https://www.naturesanswer.com/collections/antioxidants',
    'https://www.naturesanswer.com/collections/digestive-health'
];
const BATCH_SIZE = 10;
const MIN_DELAY_MS = 2000;
const MAX_DELAY_MS = 5000;
const SCROLL_DELAY_MS = 1000;
const MAX_SCROLLS = 20; // max scroll iterations per page
const BATCH_DELAY_MIN = 10000;
const BATCH_DELAY_MAX = 20000;

// === FILTERING CONTROL ===
const FILTER_KEYWORDS = [
    'echinacea',      // Echinacea products
    'goldenseal',     // Goldenseal products
    'milk-thistle',   // Milk Thistle products
    // Add more keywords as needed:
    // 'valerian',     // Valerian products
    // 'ginseng',      // Ginseng products
    // 'st-johns-wort', // St. John's Wort products
];

const ENABLE_FILTERING = true;          // Set to false to process all products
const FILTER_MODE = 'OR';               // 'OR' = any keyword, 'AND' = all keywords

const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
];

const PROXIES = [
    // Add your proxy list here - for now using empty array for testing
    // 'http://username:password@proxy1:port',
    // 'http://username:password@proxy2:port',
    // 'http://username:password@proxy3:port',
];

const PROGRESS_FILE = './natures_answer_lazy_progress.json';

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
            log.warning(`⚠️ Error loading progress file: ${error.message}`);
            return [];
        }
    }
    return [];
}

function saveProgress(remainingUrls) {
    try {
        fs.writeFileSync(PROGRESS_FILE, JSON.stringify({ 
            remainingUrls,
            lastUpdated: new Date().toISOString(),
            totalRemaining: remainingUrls.length
        }, null, 2));
        log.info(`💾 Progress saved: ${remainingUrls.length} URLs remaining`);
    } catch (error) {
        log.error(`❌ Error saving progress: ${error.message}`);
    }
}

// === SCROLL + PRODUCT URL DISCOVERY ===
async function discoverProductUrls() {
    const allUrls = new Set();
    let totalScrollCount = 0;

    log.info('🔍 Starting lazy-loading product discovery across multiple categories...');
    log.info(`📂 Will process ${START_URLS.length} category pages`);
    log.info(`📜 Will scroll up to ${MAX_SCROLLS} times per category to trigger lazy loading`);

    const crawler = new PlaywrightCrawler({
        maxConcurrency: 1, // Single page discovery
        launchContext: {
            launchOptions: { 
                headless: false, // Show browser for debugging
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-web-security',
                    '--disable-features=VizDisplayCompositor'
                ]
            },
        },
        async requestHandler({ page, request }) {
            const categoryName = request.url.split('/collections/')[1] || 'unknown';
            log.info(`📄 Starting discovery on category: ${categoryName.toUpperCase()}`);
            log.info(`🌐 URL: ${request.url}`);

            // Rotate User-Agent
            const ua = USER_AGENTS[randomBetween(0, USER_AGENTS.length - 1)];
            await page.setExtraHTTPHeaders({'User-Agent': ua});
            log.debug(`🔄 Using User-Agent: ${ua.substring(0, 50)}...`);

            // Handle proxy if available
            if (PROXIES.length > 0) {
                const proxy = PROXIES[randomBetween(0, PROXIES.length - 1)];
                log.debug(`🌐 Using proxy: ${proxy}`);
                // Note: Proxy configuration would go here in production
            }

            // Navigate to the category page
            await page.goto(request.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
            log.info(`🌐 ${categoryName} page loaded, waiting for product containers...`);

            // Wait for product container to load
            try {
                await page.waitForSelector('li.product, .woocommerce-LoopProduct-link, .product, [class*="product"], [class*="woocommerce"]', { timeout: 10000 });
                log.info(`✅ Product containers detected on ${categoryName}`);
            } catch (error) {
                log.warning(`⚠️ Product containers not found on ${categoryName}, proceeding anyway...`);
            }

            // Initial product count - try multiple selector strategies
            let initialCount = 0;
            try {
                // Strategy 1: Look for WooCommerce product links (Nature's Answer specific)
                initialCount = await page.$$eval('a.woocommerce-LoopProduct-link, a[href*="/product/"]', links => links.length);
                if (initialCount === 0) {
                    // Strategy 2: Look for any product links
                    initialCount = await page.$$eval('a[href*="/products/"], a[href*="/product/"]', links => links.length);
                }
                if (initialCount === 0) {
                    // Strategy 3: Look for any links that might be products
                    initialCount = await page.$$eval('a[href*="/"], a[href*="product"], a[href*="item"]', links => links.length);
                }
                if (initialCount === 0) {
                    // Strategy 4: Look for any clickable elements that might be products
                    initialCount = await page.$$eval('a, [role="button"], [onclick], [data-href]', links => links.length);
                }
            } catch (error) {
                log.warning(`⚠️ Error counting initial products on ${categoryName}: ${error.message}`);
            }
            
            log.info(`🔗 Initial product links found on ${categoryName}: ${initialCount}`);
            
            // Debug: Let's see what's actually on the page
            try {
                const pageContent = await page.evaluate(() => {
                    // Look for any text that might indicate products
                    const bodyText = document.body.innerText.toLowerCase();
                    const hasProducts = bodyText.includes('product') || bodyText.includes('item') || bodyText.includes('add to cart') || bodyText.includes('buy now');
                    
                    // Look for any elements that might be product containers
                    const possibleContainers = document.querySelectorAll('div, section, article, li');
                    const containerClasses = Array.from(possibleContainers).map(el => el.className).filter(cls => cls.length > 0);
                    
                    return {
                        hasProducts,
                        containerClasses: containerClasses.slice(0, 10), // First 10 classes
                        bodyTextLength: bodyText.length,
                        title: document.title,
                        url: location.href
                    };
                });
                
                log.info(`🔍 ${categoryName} page debug info:`);
                log.info(`  - Has product-related text: ${pageContent.hasProducts}`);
                log.info(`  - Page title: ${pageContent.title}`);
                log.info(`  - Body text length: ${pageContent.bodyTextLength}`);
                log.info(`  - Container classes: ${pageContent.containerClasses.join(', ')}`);
                
            } catch (error) {
                log.warning(`⚠️ Error getting debug info for ${categoryName}: ${error.message}`);
            }

            // Scroll loop to trigger lazy loading
            let previousHeight = 0;
            let previousCount = initialCount;
            let noNewProductsCount = 0;
            let categoryScrollCount = 0;
            const MAX_NO_NEW_PRODUCTS = 3; // Stop if no new products for 3 consecutive scrolls

            for (let i = 0; i < MAX_SCROLLS; i++) {
                categoryScrollCount++;
                totalScrollCount++;
                log.info(`📜 ${categoryName}: Scroll ${categoryScrollCount}/${MAX_SCROLLS} - checking for new products...`);

                // Get current page height
                const currentHeight = await page.evaluate(() => document.body.scrollHeight);
                
                // Scroll to bottom
                await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
                
                // Wait for lazy loading to trigger
                await page.waitForTimeout(SCROLL_DELAY_MS);
                
                // Check if new products loaded
                let currentCount = 0;
                try {
                    // Strategy 1: Look for WooCommerce product links (Nature's Answer specific)
                    currentCount = await page.$$eval('a.woocommerce-LoopProduct-link, a[href*="/product/"]', links => links.length);
                    if (currentCount === 0) {
                        // Strategy 2: Look for any product links
                        currentCount = await page.$$eval('a[href*="/products/"], a[href*="/product/"]', links => links.length);
                    }
                    if (currentCount === 0) {
                        // Strategy 3: Look for any links that might be products
                        currentCount = await page.$$eval('a[href*="/"], a[href*="product"], a[href*="item"]', links => links.length);
                    }
                    if (currentCount === 0) {
                        // Strategy 4: Look for any clickable elements that might be products
                        currentCount = await page.$$eval('a, [role="button"], [onclick], [data-href]', links => links.length);
                    }
                } catch (error) {
                    log.warning(`⚠️ Error counting products on scroll ${categoryScrollCount}: ${error.message}`);
                }
                
                if (currentCount > previousCount) {
                    log.info(`🎉 ${categoryName}: New products found! ${previousCount} → ${currentCount} (+${currentCount - previousCount})`);
                    noNewProductsCount = 0; // Reset counter
                    
                    // Take a screenshot when we find new products for debugging
                    try {
                        const screenshotPath = `./debug_${categoryName}_scroll_${categoryScrollCount}.png`;
                        await page.screenshot({ path: screenshotPath, fullPage: true });
                        log.info(`📸 Screenshot saved: ${screenshotPath}`);
                    } catch (error) {
                        log.warning(`⚠️ Could not save screenshot: ${error.message}`);
                    }
                } else if (currentCount === previousCount) {
                    noNewProductsCount++;
                    log.info(`📊 ${categoryName}: No new products (${noNewProductsCount}/${MAX_NO_NEW_PRODUCTS} consecutive scrolls)`);
                    
                    // Stop if no new products for several scrolls
                    if (noNewProductsCount >= MAX_NO_NEW_PRODUCTS) {
                        log.info(`🏁 ${categoryName}: Stopping scroll - no new products for ${MAX_NO_NEW_PRODUCTS} consecutive scrolls`);
                        break;
                    }
                }
                
                // Check if page height changed (indicates new content)
                if (currentHeight === previousHeight && currentCount === previousCount) {
                    log.info(`📏 ${categoryName}: Page height unchanged, likely no more content to load`);
                    break;
                }
                
                previousHeight = currentHeight;
                previousCount = currentCount;
                
                // Human-like delay between scrolls
                const scrollDelay = randomBetween(500, 1500);
                await page.waitForTimeout(scrollDelay);
            }

            // Final product extraction for this category
            log.info(`🔍 Extracting all discovered product URLs from ${categoryName}...`);
            
            let productLinks = [];
            try {
                // Strategy 1: Look for WooCommerce product links (Nature's Answer specific)
                productLinks = await page.$$eval('a.woocommerce-LoopProduct-link, a[href*="/product/"]', links =>
                    links.map(a => a.href).filter(href => href && href.includes('/product/'))
                );
                
                if (productLinks.length === 0) {
                    // Strategy 2: Look for any product links
                    productLinks = await page.$$eval('a[href*="/products/"], a[href*="/product/"]', links =>
                        links.map(a => a.href).filter(href => href && href.length > 0)
                    );
                }
                
                if (productLinks.length === 0) {
                    // Strategy 3: Look for any links that might be products
                    productLinks = await page.$$eval('a[href*="/"], a[href*="product"], a[href*="item"]', links =>
                        links.map(a => a.href).filter(href => href && href.length > 0)
                    );
                }
                
                if (productLinks.length === 0) {
                    // Strategy 4: Look for any clickable elements that might be products
                    productLinks = await page.$$eval('a, [role="button"], [onclick], [data-href]', links =>
                        links.map(a => {
                            if (a.href) return a.href;
                            if (a.getAttribute('data-href')) return a.getAttribute('data-href');
                            if (a.onclick) return a.onclick.toString();
                            return null;
                        }).filter(href => href && href.length > 0)
                    );
                }
                
                // Filter out invalid URLs and duplicates
                productLinks = productLinks.filter(url => url && url.startsWith('http') && !url.includes('#'));
                productLinks = [...new Set(productLinks)];
                
                // Debug: Log what we found
                log.info(`🔍 ${categoryName}: Found ${productLinks.length} product links`);
                if (productLinks.length > 0) {
                    log.info(`🔍 ${categoryName}: Sample product URLs:`);
                    productLinks.slice(0, 3).forEach((url, i) => {
                        log.info(`  ${i + 1}. ${url}`);
                    });
                }
                
            } catch (error) {
                log.error(`❌ Error extracting product links from ${categoryName}: ${error.message}`);
            }
            
            // Debug: Save page HTML for manual inspection
            try {
                const pageHtml = await page.content();
                const htmlPath = `./debug_${categoryName}_page.html`;
                fs.writeFileSync(htmlPath, pageHtml);
                log.info(`📄 Page HTML saved: ${htmlPath}`);
            } catch (error) {
                log.warning(`⚠️ Could not save page HTML: ${error.message}`);
            }

            // Add to collection
            let newUrls = 0;
            for (const link of productLinks) {
                if (!allUrls.has(link)) {
                    allUrls.add(link);
                    newUrls++;
                }
            }

            log.info(`✅ ${categoryName}: Discovery complete! Found ${productLinks.length} product links after ${categoryScrollCount} scrolls`);
            log.info(`🆕 ${categoryName}: Added ${newUrls} new unique URLs to collection`);
            log.info(`📊 Total unique URLs collected so far: ${allUrls.size}`);
            
            // Category completion delay
            const categoryDelay = randomBetween(2000, 4000);
            log.info(`⏱ Waiting ${categoryDelay}ms before next category...`);
            await page.waitForTimeout(categoryDelay);
        },
        failedRequestHandler({ request, response }) {
            const categoryName = request.url.split('/collections/')[1] || 'unknown';
            if (response?.status() === 429) {
                log.warn(`⚠️ ${categoryName}: Hit 429 rate limit, will retry later`);
            } else {
                log.error(`❌ ${categoryName}: Request failed - Status: ${response?.status() || 'Unknown'}`);
            }
        }
    });

    await crawler.run(START_URLS);

    let urlsArray = Array.from(allUrls);
    log.info(`✅ Total discovery complete across all categories!`);
    log.info(`📊 Total scrolls performed: ${totalScrollCount}`);
    log.info(`🔗 Total unique product URLs found: ${urlsArray.length}`);

    // === APPLY FILTERING CONTROL ===
    if (ENABLE_FILTERING && FILTER_KEYWORDS.length > 0) {
        const originalCount = urlsArray.length;
        urlsArray = urlsArray.filter(url => {
            const urlLower = url.toLowerCase();
            
            if (FILTER_MODE === 'OR') {
                // Match ANY keyword (default)
                return FILTER_KEYWORDS.some(keyword => urlLower.includes(keyword));
            } else if (FILTER_MODE === 'AND') {
                // Match ALL keywords
                return FILTER_KEYWORDS.every(keyword => urlLower.includes(keyword));
            }
            return false;
        });
        
        log.info(`🔍 Filtering enabled: ${FILTER_KEYWORDS.join(', ')}`);
        log.info(`🔍 Filter mode: ${FILTER_MODE}`);
        log.info(`🔍 Filtered from ${originalCount} to ${urlsArray.length} matching products`);
        
        if (urlsArray.length === 0) {
            log.warning(`⚠️ No products match the filter criteria!`);
            log.info(`💡 Try adjusting FILTER_KEYWORDS or set ENABLE_FILTERING = false`);
        }
    } else {
        log.info(`🔍 No filtering applied - processing all ${urlsArray.length} products`);
    }

    if (urlsArray.length > 0) {
        log.info(`🔍 Sample URLs to process:`);
        urlsArray.slice(0, 5).forEach((url, i) => {
            log.info(`  ${i + 1}. ${url}`);
        });
        
        if (urlsArray.length > 5) {
            log.info(`  ... and ${urlsArray.length - 5} more`);
        }
    }

    return urlsArray;
}

// === BATCH CRAWLER ===
async function runBatchCrawler(urls) {
    const remainingUrls = [...urls];
    let batchNumber = 1;
    let totalProcessed = 0;

    log.info(`🚀 Starting batch processing with ${urls.length} URLs, batch size: ${BATCH_SIZE}`);

    while (remainingUrls.length > 0) {
        const batch = remainingUrls.splice(0, BATCH_SIZE);
        log.info(`📦 Batch ${batchNumber}: Processing ${batch.length} URLs, ${remainingUrls.length} remaining`);
        log.info(`📊 Total processed so far: ${totalProcessed}`);

        const crawler = new PlaywrightCrawler({
            maxConcurrency: 1, // Safe per proxy
            requestHandlerTimeoutSecs: 60,
            launchContext: {
                launchOptions: { 
                    headless: false, // Show browser for debugging
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-web-security',
                        '--disable-features=VizDisplayCompositor'
                    ]
                },
            },
            
            async requestHandler({ page, request }) {
                try {
                    // Rotate user-agent
                    const ua = USER_AGENTS[randomBetween(0, USER_AGENTS.length - 1)];
                    await page.setExtraHTTPHeaders({'User-Agent': ua});
                    log.debug(`🔄 Using User-Agent: ${ua.substring(0, 50)}...`);

                    // Handle proxy if available
                    if (PROXIES.length > 0) {
                        const proxy = PROXIES[randomBetween(0, PROXIES.length - 1)];
                        log.debug(`🌐 Using proxy: ${proxy}`);
                        // Note: Proxy configuration would go here in production
                    }

                    log.info(`🛒 Scraping: ${request.url}`);
                    
                    // Wait for page to load
                    await page.waitForLoadState('domcontentloaded');
                    
                    // Human-like scrolling
                    for (let i = 0; i < randomBetween(2, 4); i++) {
                        await page.mouse.wheel(0, randomBetween(200, 500));
                        await page.waitForTimeout(randomBetween(300, 700));
                    }

                    // Extract Nature's Answer product data
                    const data = await page.evaluate(() => {
                        const name = document.querySelector("h1.product__title, h1.product-title")?.textContent?.trim() ?? null;
                        const price = document.querySelector(".price-item--regular, .price, [data-price]")?.textContent?.trim() ?? null;
                        const desc = document.querySelector(".product__description, .description, #description")?.innerText?.trim() ?? null;
                        
                        // Additional selectors for better coverage
                        const altName = document.querySelector("h1")?.textContent?.trim() ?? null;
                        const altPrice = document.querySelector(".price, [data-price], .product-price")?.textContent?.trim() ?? null;
                        const altDesc = document.querySelector(".description, #description, .product-description")?.innerText?.trim() ?? null;
                        
                        return { 
                            name: name || altName, 
                            price: price || altPrice, 
                            desc: desc || altDesc, 
                            url: location.href,
                            scrapedAt: new Date().toISOString()
                        };
                    });

                    // Save data if we found meaningful content
                    if (data.name || data.price) {
                        await Dataset.pushData(data);
                        log.info(`✅ Product: ${data.name || 'No name'} - ${data.price || 'No price'}`);
                        totalProcessed++;
                    } else {
                        log.warning(`⚠️ No meaningful data extracted from ${request.url}`);
                    }

                    // Random delay between requests
                    const delay = randomBetween(MIN_DELAY_MS, MAX_DELAY_MS);
                    log.debug(`⏱ Waiting ${delay}ms before next request`);
                    await page.waitForTimeout(delay);
                    
                } catch (error) {
                    log.error(`❌ Error processing ${request.url}: ${error.message}`);
                }
            },
            
            failedRequestHandler({ request, response }) {
                if (response?.status() === 429) {
                    log.warn(`⚠️ Hit 429 rate limit: ${request.url}, will retry in next batch`);
                    remainingUrls.push(request.url); // Add back to retry later
                } else {
                    log.error(`❌ Request failed: ${request.url} - Status: ${response?.status() || 'Unknown'}`);
                }
            },
        });

        try {
            await crawler.run(batch);
            log.info(`✅ Batch ${batchNumber} completed successfully`);
        } catch (error) {
            log.error(`❌ Batch ${batchNumber} failed: ${error.message}`);
            // Add failed URLs back to remaining
            remainingUrls.push(...batch);
        }

        // Save progress after each batch
        saveProgress(remainingUrls);

        // Random delay between batches (if more URLs remain)
        if (remainingUrls.length > 0) {
            const batchDelay = randomBetween(BATCH_DELAY_MIN, BATCH_DELAY_MAX);
            log.info(`⏱ Waiting ${batchDelay}ms before next batch...`);
            await new Promise((r) => setTimeout(r, batchDelay));
        }

        batchNumber++;
    }

    log.info(`🎉 Scraping complete! All ${totalProcessed} products processed successfully!`);
    
    // === FILTERING SUMMARY ===
    if (ENABLE_FILTERING) {
        log.info(`🔍 Filtering Summary:`);
        log.info(`  - Total products available: ${urls.length}`);
        log.info(`  - Filtered products processed: ${totalProcessed}`);
        log.info(`  - Filter keywords: ${FILTER_KEYWORDS.join(', ')}`);
        log.info(`  - Filter mode: ${FILTER_MODE}`);
    }
    
    // Clean up progress file
    if (fs.existsSync(PROGRESS_FILE)) {
        fs.unlinkSync(PROGRESS_FILE);
        log.info(`🧹 Progress file cleaned up`);
    }
}

// === MAIN ===
async function main() {
    try {
        log.info('🚀 Starting Nature\'s Answer Lazy Scraper - World #8!');
        log.info('📜 Using lazy-loading scroll approach for dynamic content discovery');
        
        // Load existing progress or discover new URLs
        let urls = loadProgress();
        if (urls.length === 0) {
            log.info('📥 No progress file found, discovering URLs across multiple categories with lazy-loading scroll...');
            urls = await discoverProductUrls();
        } else {
            log.info(`📂 Resuming from progress file: ${urls.length} URLs remaining`);
        }

        if (urls.length === 0) {
            log.error("❌ No product URLs found, exiting.");
            return;
        }

        // Check proxy configuration
        if (PROXIES.length === 0) {
            log.warning(`⚠️ No proxies configured - running without proxy rotation`);
            log.info(`💡 Add proxy URLs to PROXIES array for production use`);
        } else {
            log.info(`🌐 Using ${PROXIES.length} proxies for rotation`);
        }

        await runBatchCrawler(urls);
        
        log.info('🏆 World #8 CONQUERED with LAZY LOADING! Your scraping empire grows stronger! 🏆');
        
    } catch (error) {
        log.error('❌ Main function failed:', error);
    }
}

// Export for use as module
module.exports = { main, discoverProductUrls, runBatchCrawler };

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}
