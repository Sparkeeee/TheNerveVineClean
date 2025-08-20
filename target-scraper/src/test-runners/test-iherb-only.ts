import { PlaywrightCrawler, Dataset } from 'crawlee';
import { extractIherbUrls } from '../site-handlers/iherb';
import { scrapeProductDetails } from '../manual-scraper';

interface IHerbScrapeRequest {
    herb: string;
    type: string;
    maxResults?: number;
    maxPages?: number;
}

// iHerb-specific configuration
const iherbConfig = {
    maxConcurrency: 1, // Conservative for iHerb
    maxRequestRetries: 3,
    navigationTimeoutSecs: 45,
    requestHandlerTimeoutSecs: 90,
    useSessionPool: true,
    headless: false, // For debugging
    launchContext: {
        launchOptions: {
            slowMo: 200, // Slower for iHerb
            args: [
                '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas', '--no-first-run', '--no-zygote', '--disable-gpu'
            ]
        }
    }
};

// Test requests for iHerb
const testRequests: IHerbScrapeRequest[] = [
    { herb: 'ashwagandha', type: 'tincture', maxResults: 10, maxPages: 2 },
    { herb: 'turmeric', type: 'capsule', maxResults: 10, maxPages: 2 },
];

async function runIHerbScraper() {
    console.log('🌿 Starting iHerb Automated Scraper...');
    
    const crawler = new PlaywrightCrawler({
        ...iherbConfig,
        async requestHandler({ page, request }) {
            const req: IHerbScrapeRequest = request.userData;
            console.log(`\n🔍 Processing iHerb: ${req.herb} ${req.type}`);

            try {
                // Navigate to iHerb search page
                const searchUrl = `https://www.iherb.com/search?kw=${encodeURIComponent(req.herb + ' ' + req.type)}`;
                await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
                
                // Wait for page to stabilize
                await page.waitForTimeout(3000);
                
                // Extract product URLs using iHerb handler
                const urls = await extractIherbUrls(page, req.herb, req.type, req.maxResults);
                console.log(`✅ Found ${urls.length} iHerb product URLs`);

                // Scrape individual products
                let scrapedCount = 0;
                for (const url of urls) {
                    try {
                        const data = await scrapeProductDetails(url);
                        if (data) {
                            // Add iHerb-specific metadata
                            const iherbData = {
                                ...data,
                                site: 'iherb',
                                herbName: req.herb,
                                productType: req.type,
                                timestamp: new Date().toISOString(),
                            };
                            
                            await Dataset.pushData(iherbData);
                            scrapedCount++;
                            console.log(`✅ Scraped iHerb product: ${data.name}`);
                        }
                    } catch (err) {
                        console.error(`❌ Error scraping iHerb product ${url}:`, err);
                    }
                }

                console.log(`🎯 iHerb ${req.herb} ${req.type}: ${scrapedCount}/${urls.length} products scraped`);

            } catch (err) {
                console.error(`❌ Error processing iHerb ${req.herb} ${req.type}:`, err);
            }
        }
    });

    // Add iHerb-specific requests
    for (const req of testRequests) {
        const searchUrl = `https://www.iherb.com/search?kw=${encodeURIComponent(req.herb + ' ' + req.type)}`;
        await crawler.addRequests([{ url: searchUrl, userData: req }]);
    }

    await crawler.run();
    
    console.log('\n🌿 iHerb Scraper completed!');
    console.log('📊 Check the storage/datasets directory for results');
}

// Command line argument handling
const args = process.argv.slice(2);
if (args.includes('quick')) {
    console.log('🚀 Quick mode: Reducing test requests...');
    testRequests.length = 1;
    testRequests[0].maxResults = 5;
    testRequests[0].maxPages = 1;
}

if (args.includes('debug')) {
    console.log('🐛 Debug mode: Enabling verbose logging...');
    iherbConfig.headless = false;
    iherbConfig.launchContext.launchOptions.slowMo = 500;
}

runIHerbScraper().catch(console.error);


