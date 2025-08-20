// starwest-scraper.js
// Standalone Puppeteer scraper for Starwest Botanicals product URLs

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

// Add stealth plugin to evade bot detection
puppeteer.use(StealthPlugin());

// Config
const config = {
  startUrl: 'https://www.starwest-botanicals.com/shop/', // main shop page
  scrollDelayMin: 500,
  scrollDelayMax: 1500,
  maxScrolls: 30, // safety cap
  outputFile: 'starwest-urls.json',
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function autoScroll(page) {
  let previousHeight = 0;
  for (let i = 0; i < config.maxScrolls; i++) {
    const delay = Math.floor(
      Math.random() * (config.scrollDelayMax - config.scrollDelayMin) +
        config.scrollDelayMin
    );
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });
    await sleep(delay);

    const currentHeight = await page.evaluate('document.body.scrollHeight');
    if (currentHeight === previousHeight) {
      console.log(`✅ No more content after ${i} scrolls`);
      break;
    }
    previousHeight = currentHeight;
  }
}

async function scrapeStarwest() {
  console.log('🚀 Launching browser...');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Rotate user-agent
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118 Safari/537.36'
  );

  console.log(`🌐 Navigating to ${config.startUrl}`);
  await page.goto(config.startUrl, { waitUntil: 'domcontentloaded' });

  console.log('📜 Scrolling to load products...');
  await autoScroll(page);

  console.log('🔍 Extracting product URLs...');
  const urls = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('a[href]'));
    return anchors
      .map((a) => a.href)
      .filter((href) => href.includes('/products/')); // only product links
  });

  // Deduplicate
  const uniqueUrls = [...new Set(urls)];

  console.log(`🎯 Found ${uniqueUrls.length} product URLs`);
  fs.writeFileSync(config.outputFile, JSON.stringify(uniqueUrls, null, 2));

  console.log(`💾 Saved to ${config.outputFile}`);

  await browser.close();
}

scrapeStarwest().catch((err) => {
  console.error('❌ Scraper failed:', err);
});
