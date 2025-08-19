// Gaia Herbs Sitemap Scraper - World #5
// Uses Gaia Herbs' official sitemap for respectful, robots-compliant scraping

const { PlaywrightCrawler, Dataset, log } = require('crawlee');
const fs = require('fs').promises;

// Load configuration from file
let config;
async function loadConfig() {
  try {
    const configData = await fs.readFile('./gaia-herbs-config.json', 'utf-8');
    config = JSON.parse(configData);
    log.info('✅ Configuration loaded successfully');
  } catch (error) {
    log.error('❌ Failed to load config.json:', error.message);
    // Fallback to default config
    config = {
      startUrls: ["https://www.gaiaherbs.com/sitemap.xml"],
      crawler: {
        maxRequestsPerCrawl: 50,
        maxConcurrency: 2,
        retryLimit: 2,
        minDelayMs: 1500,
        maxDelayMs: 4000,
        userAgents: [
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15"
        ],
        proxies: []
      },
      selectors: {
        title: "h1.product-title, .product-name",
        price: ".product-price, [data-product-price]",
        description: ".product-description, #description"
      },
      pagination: {
        nextButton: ".pagination-next, .next",
        maxPages: 3
      },
      filtering: {
        targetHerbs: ["st johns wort", "st. johns wort", "st john's wort", "st. john's wort", "hypericum", "johns wort"],
        enabled: true
      }
    };
    log.info('⚠️ Using fallback configuration');
  }
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getGaiaSitemapUrls() {
  const indexUrl = "https://www.gaiaherbs.com/sitemap.xml";
  const allUrls = [];

  try {
    log.info(`📥 Fetching Gaia sitemap index: ${indexUrl}`);
    const res = await fetch(indexUrl);
    if (!res.ok) throw new Error(`Failed: ${res.status}`);
    const xml = await res.text();
    
    // Parse XML to extract sub-sitemap URLs
    const submaps = extractSitemapIndexUrls(xml);
    log.info(`🔗 Found ${submaps.length} sub-sitemaps in index`);

    for (const sm of submaps) {
      try {
        log.info(`📄 Fetching child sitemap: ${sm}`);
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
    log.error(`❌ Error fetching Gaia sitemap index: ${err.message}`);
  }

  // Keep only product pages
  let productUrls = [...new Set(allUrls)].filter((u) =>
    /^https:\/\/www\.gaiaherbs\.com\/products\//i.test(u)
  );

  // Filter for St. John's Wort if enabled
  if (config.filtering && config.filtering.enabled) {
    const targetHerbs = config.filtering.targetHerbs;
    log.info(`🔍 Filtering for target herbs: ${targetHerbs.join(', ')}`);
    
    const filteredUrls = productUrls.filter(url => {
      const urlLower = url.toLowerCase();
      return targetHerbs.some(herb => urlLower.includes(herb.toLowerCase()));
    });
    
    if (filteredUrls.length > 0) {
      log.info(`🎯 Found ${filteredUrls.length} St. John's Wort related products`);
      productUrls = filteredUrls;
    } else {
      log.warning(`⚠️ No St. John's Wort products found, using all ${productUrls.length} products`);
    }
  }

  log.info(`✅ Collected ${productUrls.length} Gaia Herbs product URLs`);
  
  // Show sample URLs
  if (productUrls.length > 0) {
    log.info('📋 Sample Gaia Herbs product URLs:');
    productUrls.slice(0, 5).forEach((url, i) => {
      log.info(`  ${i + 1}. ${url}`);
    });
  }
  
  return productUrls;
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

async function main() {
  try {
    log.info('🚀 Starting Gaia Herbs Sitemap Scraper (World #5)...');
    
    // Load configuration first
    await loadConfig();
    
    const allUrls = await getGaiaSitemapUrls();
    
    if (allUrls.length === 0) {
      log.error('❌ No Gaia Herbs product URLs found in sitemaps');
      return;
    }

    // Limit URLs to prevent overwhelming the crawler
    const maxUrls = Math.min(config.crawler.maxRequestsPerCrawl, 50); // Hard cap at 50
    const startUrls = allUrls.slice(0, maxUrls);
    log.info(`🚀 Will crawl ${startUrls.length} URLs (sampled from ${allUrls.length} total found)`);

    let proxyIndex = 0;

    const crawler = new PlaywrightCrawler({
      maxConcurrency: 2,
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
        log.info(`🔍 Scraping: ${request.url}`);

        try {
          // Wait for page to load
          await page.waitForLoadState('domcontentloaded');
          
          // Rotate user agent
          const ua = config.crawler.userAgents[randomBetween(0, config.crawler.userAgents.length - 1)];
          await page.setExtraHTTPHeaders({'User-Agent': ua});
          log.debug(`🔄 Using User-Agent: ${ua.substring(0, 50)}...`);

          // Human-like scrolling
          for (let i = 0; i < randomBetween(2, 5); i++) {
            await page.mouse.wheel(0, randomBetween(200, 600));
            await page.waitForTimeout(randomBetween(300, 800));
          }

          // Extract product data
          const data = { url: request.url };
          
          for (const [key, selector] of Object.entries(config.selectors)) {
            try {
              const element = await page.locator(selector).first();
              if (await element.count() > 0) {
                const text = await element.textContent();
                data[key] = text?.trim() || null;
              } else {
                data[key] = null;
              }
            } catch (error) {
              data[key] = null;
              log.debug(`⚠️ Could not extract ${key}: ${error.message}`);
            }
          }
          
          // Save data if we found meaningful content
          if (data.title || data.price) {
            await Dataset.pushData({
              ...data,
              scrapedAt: new Date().toISOString()
            });
            
            log.info(`✅ Product: ${data.title || 'No title'} - ${data.price || 'No price'}`);
          } else {
            log.warning(`⚠️ No meaningful data extracted from ${request.url}`);
          }

          // Handle pagination (rare on product pages)
          for (let i = 0; i < config.pagination.maxPages; i++) {
            const btn = page.locator(config.pagination.nextButton);
            if (await btn.count() > 0) {
              await btn.first().click();
              await page.waitForTimeout(randomBetween(1500, 3000));
            } else {
              break;
            }
          }

          // Polite delay before next request
          const delay = randomBetween(config.crawler.minDelayMs, config.crawler.maxDelayMs);
          await page.waitForTimeout(delay);
          
          // DON'T enqueue new links - we only want the pre-filtered St. John's Wort URLs
          // This prevents the endless stream of cataloging the whole inventory
          log.debug(`🚫 Skipping link discovery - only crawling pre-filtered URLs`);
          
        } catch (error) {
          log.error(`❌ Error processing ${request.url}: ${error.message}`);
        }
      },
      
      failedRequestHandler({ request, error }) {
        log.warning(`❌ Request failed: ${request.url} - ${error.message}`);
      },
    });

    log.info(`🚀 Starting crawler with ${startUrls.length} Gaia Herbs product URLs`);
    await crawler.run(startUrls);
    
    // Export results
    const results = await Dataset.getData();
    log.info(`📊 Scraping complete! Found ${results.items.length} Gaia Herbs products`);
    
    // Save to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `gaia-herbs-results-${timestamp}.json`;
    await fs.writeFile(filename, JSON.stringify(results.items, null, 2));
    log.info(`💾 Results saved to: ${filename}`);
    
  } catch (error) {
    log.error('❌ Main function failed:', error);
  }
}

// Export for use as module
module.exports = { main, getGaiaSitemapUrls };

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}
