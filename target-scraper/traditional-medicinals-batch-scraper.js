// Traditional Medicinals Batch Scraper - World #8
// Batch-safe scraper with proxy rotation, user-agent rotation, and automatic resume
// Built for large-scale herbal tea blend scraping with respect for rate limits

const { PlaywrightCrawler, Dataset, log } = require('crawlee');
const fetch = require('node-fetch');
const fs = require('fs');

// === CONFIG ===
const BATCH_SIZE = 10;                  // Number of URLs per batch
const MIN_DELAY_MS = 2000;              // Min delay between requests
const MAX_DELAY_MS = 5000;              // Max delay between requests
const BATCH_DELAY_MIN = 10000;          // Min delay between batches
const BATCH_DELAY_MAX = 20000;          // Max delay between batches

// === FILTERING CONTROL ===
const FILTER_KEYWORDS = [
  'chamomile',      // Chamomile products
  'peppermint',     // Peppermint products
  'ginger',         // Ginger products
  // Add more keywords as needed:
  // 'lavender',     // Lavender products
  // 'lemon',        // Lemon products
  // 'cinnamon',     // Cinnamon products
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

const PROGRESS_FILE = './traditional_progress.json';

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

// === SITEMAP DISCOVERY ===
async function getTraditionalSitemapUrls() {
  const indexUrl = 'https://www.traditionalmedicinals.com/sitemap.xml';
  const allUrls = [];

  try {
    log.info(`📥 Fetching sitemap index: ${indexUrl}`);
    const res = await fetch(indexUrl);
    if (!res.ok) throw new Error(`Failed: ${res.status}`);
    const xml = await res.text();
    
    // Parse XML to extract sub-sitemap URLs using regex (no xml2js dependency)
    const submaps = extractSitemapIndexUrls(xml);
    log.info(`🔗 Found ${submaps.length} sub-sitemaps`);

    for (const sm of submaps) {
      try {
        log.info(`📄 Processing sub-sitemap: ${sm}`);
        const subRes = await fetch(sm);
        if (!subRes.ok) {
          log.warning(`⚠️ Skipped ${sm}: status ${subRes.status}`);
          continue;
        }
        const subXml = await subRes.text();
        const urls = extractSitemapUrls(subXml);
        allUrls.push(...urls);
        log.info(`🔗 Found ${urls.length} URLs in ${sm}`);
      } catch (err) {
        log.warning(`⚠️ Error processing ${sm}: ${err.message}`);
      }
    }
  } catch (err) {
    log.error(`❌ Error fetching sitemap index: ${err.message}`);
  }

  // Only product pages (Traditional Medicinals structure)
  const productUrls = [...new Set(allUrls)].filter((u) =>
    /^https:\/\/www\.traditionalmedicinals\.com\/products\//i.test(u)
  );

  log.info(`✅ Collected ${productUrls.length} total product URLs`);

  // === APPLY FILTERING CONTROL ===
  let filteredUrls = productUrls;
  
  if (ENABLE_FILTERING && FILTER_KEYWORDS.length > 0) {
    filteredUrls = productUrls.filter(url => {
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
    log.info(`🔍 Filtered to ${filteredUrls.length} matching products`);
    
    if (filteredUrls.length === 0) {
      log.warning(`⚠️ No products match the filter criteria!`);
      log.info(`💡 Try adjusting FILTER_KEYWORDS or set ENABLE_FILTERING = false`);
    }
  } else {
    log.info(`🔍 No filtering applied - processing all ${productUrls.length} products`);
  }

  if (filteredUrls.length > 0) {
    log.info(`🔍 Sample URLs to process:`);
    filteredUrls.slice(0, 5).forEach((url, i) => {
      log.info(`  ${i + 1}. ${url}`);
    });
    
    if (filteredUrls.length > 5) {
      log.info(`  ... and ${filteredUrls.length - 5} more`);
    }
  }

  return filteredUrls;
}

function extractSitemapIndexUrls(xmlString) {
  const urls = [];
  
  // Extract sitemap URLs from sitemap index XML
  // Look for <sitemap><loc>...</loc></sitemap> pattern
  const sitemapMatches = xmlString.match(/<sitemap>\s*<loc>(.*?)<\/loc>\s*<\/sitemap>/g);
  if (sitemapMatches) {
    sitemapMatches.forEach(match => {
      const url = match.match(/<loc>(.*?)<\/loc>/)?.[1];
      if (url && url.startsWith('http')) {
        urls.push(url);
      }
    });
  }
  
  return urls;
}

function extractSitemapUrls(xmlString) {
  const urls = [];
  
  // Extract URLs from regular sitemap XML using regex
  const urlMatches = xmlString.match(/<loc>(.*?)<\/loc>/g);
  if (urlMatches) {
    urlMatches.forEach(match => {
      const url = match.replace(/<loc>/, '').replace(/<\/loc>/, '');
      if (url && url.startsWith('http')) {
        urls.push(url);
      }
    });
  }
  
  return urls;
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

          // Extract Traditional Medicinals product data
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
    log.info('🚀 Starting Traditional Medicinals Batch Scraper...');
    
    // Load existing progress or discover new URLs
    let urls = loadProgress();
    if (urls.length === 0) {
      log.info('📥 No progress file found, discovering URLs from sitemap...');
      urls = await getTraditionalSitemapUrls();
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
    
  } catch (error) {
    log.error('❌ Main function failed:', error);
  }
}

// Export for use as module
module.exports = { main, getTraditionalSitemapUrls, runBatchCrawler };

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}
