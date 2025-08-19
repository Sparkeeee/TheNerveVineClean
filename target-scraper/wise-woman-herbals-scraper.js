// Wise Woman Herbals Sitemap Scraper - World #6
// Uses Wise Woman Herbals' official sitemap for respectful, robots-compliant scraping
// Built on Shopify platform - predictable URL structure

const { PlaywrightCrawler, Dataset, log } = require('crawlee');
const fetch = require('node-fetch');

async function getWiseWomanSitemapUrls() {
  const indexUrl = "https://wisewomanherbals.com/sitemap.xml";
  const allUrls = [];

  try {
    log.info(`📥 Fetching Wise Woman Herbals sitemap index: ${indexUrl}`);
    const res = await fetch(indexUrl);
    if (!res.ok) throw new Error(`Failed: ${res.status}`);
    const xml = await res.text();
    
    // Parse XML to extract sub-sitemap URLs using regex (no xml2js dependency)
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
    log.error(`❌ Error fetching sitemap index: ${err.message}`);
  }

  // Keep only product pages (Shopify structure)
  const productUrls = [...new Set(allUrls)].filter((u) =>
    /^https:\/\/wisewomanherbals\.com\/products\//i.test(u)
  );

  log.info(`✅ Collected ${productUrls.length} product URLs`);
  log.info(`🔍 Sample: ${productUrls.slice(0, 5).join(", ")}`);

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

async function run() {
  log.info("🚀 Starting Wise Woman Herbals Scraper...");

  const productUrls = await getWiseWomanSitemapUrls();

  if (productUrls.length === 0) {
    log.error("❌ No product URLs found, exiting.");
    return;
  }

  const crawler = new PlaywrightCrawler({
    maxRequestsPerCrawl: 50, // 👈 adjust for testing
    async requestHandler({ request, page, enqueueLinks, log }) {
      log.info(`🛒 Scraping: ${request.url}`);

      // Extract Shopify product data
      const data = await page.evaluate(() => {
        const name =
          document.querySelector("h1.product__title")?.textContent?.trim() ?? null;
        const price =
          document.querySelector(".price-item--regular")?.textContent?.trim() ?? null;
        const desc =
          document.querySelector(".product__description")?.innerText?.trim() ?? null;

        return { name, price, desc, url: location.href };
      });

      await Dataset.pushData(data);
    },
    failedRequestHandler({ request }) {
      log.error(`❌ Request failed: ${request.url}`);
    },
  });

  log.info(`🚀 Starting crawler with ${productUrls.length} product URLs...`);
  await crawler.run(productUrls);

  log.info("📊 Scraping complete!");
}

// Export for use as module
module.exports = { run, getWiseWomanSitemapUrls };

// Run if called directly
if (require.main === module) {
  run().catch(console.error);
}
