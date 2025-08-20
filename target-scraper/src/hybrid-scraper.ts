import { PlaywrightCrawler, Dataset } from 'crawlee';
import { scrapeProductDetails } from './manual-scraper';
import { extractAmazonUrls } from './site-handlers/amazon';
import { extractIherbUrls } from './site-handlers/iherb';
import { extractVitacostUrls } from './site-handlers/vitacost';

// Types
type Site = 'amazon' | 'target' | 'iherb' | 'vitacost';

interface ScrapeRequest {
    herb: string;
    type: string;
    site: Site;
    maxResults?: number;
}

// Example requests
const requests: ScrapeRequest[] = [
    { herb: 'ashwagandha', type: 'tincture', site: 'amazon', maxResults: 15 },
    { herb: 'ashwagandha', type: 'tincture', site: 'target', maxResults: 15 },
    { herb: 'ashwagandha', type: 'tincture', site: 'iherb', maxResults: 15 },
    { herb: 'ashwagandha', type: 'tincture', site: 'vitacost', maxResults: 15 },
];

// Global summary tracker
const summary: Record<string, { scraped: number; duplicates: number }> = {};

async function extractUrls(page: any, req: ScrapeRequest): Promise<string[]> {
    switch (req.site) {
        case 'amazon': return extractAmazonUrls(page, req.herb, req.type);
        case 'iherb': return extractIherbUrls(page, req.herb, req.type);
        case 'vitacost': return extractVitacostUrls(page, req.herb, req.type);
        case 'target':
            return await page.$$eval('a[data-test="product-title"]', links =>
                links.map(a => (a as HTMLAnchorElement).href)
            );
        default: return [];
    }
}

async function runHybridScraper() {
    console.log('🎬 Starting Hybrid Scraper with Reporting...');
    
    const crawler = new PlaywrightCrawler({
        maxConcurrency: 2,
        maxRequestRetries: 3,
        navigationTimeoutSecs: 45,
        requestHandlerTimeoutSecs: 90,
        useSessionPool: true,
        headless: false,
        launchContext: {
            launchOptions: {
                slowMo: 100,
                args: [
                    '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas', '--no-first-run', '--no-zygote', '--disable-gpu'
                ]
            }
        },
        async requestHandler({ page, request }) {
            const req: ScrapeRequest = request.userData;
            const key = `${req.site}-${req.herb}-${req.type}`;
            summary[key] = { scraped: 0, duplicates: 0 };

            console.log(`\n🌐 Processing ${req.site.toUpperCase()}: ${req.herb} ${req.type}`);
            try {
                await page.waitForLoadState('domcontentloaded', { timeout: 30000 });
                
                const urls = await extractUrls(page, req);
                const uniqueUrls = [...new Set(urls)].slice(0, req.maxResults || 20);

                summary[key].duplicates = urls.length - uniqueUrls.length;

                for (const url of uniqueUrls) {
                    try {
                        const data = await scrapeProductDetails(url);
                        if (data) {
                            await Dataset.pushData(data);
                            summary[key].scraped++;
                            console.log(`✅ Scraped: ${data.name}`);
                        }
                    } catch (err) {
                        console.error(`❌ Error scraping ${url}:`, err);
                    }
                }

                console.log(`🎯 ${req.site.toUpperCase()} done: ${summary[key].scraped}/${uniqueUrls.length} products scraped (duplicates skipped: ${summary[key].duplicates})`);
            } catch (err) {
                console.error(`❌ Error processing ${req.site} - ${req.herb} ${req.type}:`, err);
            }
        }
    });

    // Add requests
    for (const req of requests) {
        const query = encodeURIComponent(`${req.herb} ${req.type}`);
        let url = '';
        if (req.site === 'amazon') url = `https://www.amazon.com/s?k=${query}`;
        else if (req.site === 'target') url = `https://www.target.com/s?searchTerm=${query}`;
        else if (req.site === 'iherb') url = `https://www.iherb.com/search?kw=${query}`;
        else if (req.site === 'vitacost') url = `https://www.vitacost.com/search?search=${query}`;
        if (url) await crawler.addRequests([{ url, userData: req }]);
    }

    await crawler.run();

    // Reporting summary
    console.log('\n📊 Hybrid Scraper Summary Report:');
    let totalScraped = 0, totalDuplicates = 0;
    for (const key in summary) {
        const s = summary[key];
        console.log(`- ${key}: Scraped=${s.scraped}, Duplicates Skipped=${s.duplicates}`);
        totalScraped += s.scraped;
        totalDuplicates += s.duplicates;
    }
    console.log(`\n✅ Total Products Scraped: ${totalScraped}`);
    console.log(`⚠️ Total Duplicates Skipped: ${totalDuplicates}`);
}

runHybridScraper().catch(console.error);
