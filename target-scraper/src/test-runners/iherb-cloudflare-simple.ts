import { PlaywrightCrawler, Dataset } from 'crawlee';
import { extractIherbUrls } from '../site-handlers/iherb';

interface IHerbCloudflareRequest {
    herb: string;
    type: string;
    maxResults?: number;
    maxPages?: number;
}

// Cloudflare-aware iHerb configuration
const iherbCloudflareConfig = {
    maxConcurrency: 1, // Single thread to avoid triggering Cloudflare
    maxRequestRetries: 5, // More retries for Cloudflare challenges
    navigationTimeoutSecs: 60, // Longer timeout for Cloudflare
    requestHandlerTimeoutSecs: 120,
    useSessionPool: true,
    headless: false, // Non-headless to better handle Cloudflare
    launchContext: {
        launchOptions: {
            slowMo: 1000, // Slower for Cloudflare
            args: [
                '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
                '--disable-blink-features=AutomationControlled',
                '--disable-features=VizDisplayCompositor',
                '--disable-web-security',
                '--no-first-run',
                '--disable-default-apps',
                '--window-size=1366,768',
                '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            ]
        }
    }
};

// Test requests for iHerb
const testRequests: IHerbCloudflareRequest[] = [
    { herb: 'ashwagandha', type: 'tincture', maxResults: 5, maxPages: 1 },
    { herb: 'turmeric', type: 'capsule', maxResults: 5, maxPages: 1 },
];

async function handleCloudflareChallenge(page: any) {
    console.log('🔒 Checking for Cloudflare protection...');
    
    try {
        // Wait for page to load
        await page.waitForLoadState('networkidle', { timeout: 30000 });
        
        // Check for Cloudflare challenge indicators
        const cloudflareSelectors = [
            '[data-ray]', // Cloudflare ray ID
            '.cf-browser-verification',
            '.cf-checking-browser',
            '#cf-wrapper',
            '.cf-error-overview'
        ];
        
        let isCloudflareChallenge = false;
        for (const selector of cloudflareSelectors) {
            try {
                const element = await page.$(selector);
                if (element) {
                    isCloudflareChallenge = true;
                    console.log(`⚠️ Cloudflare challenge detected: ${selector}`);
                    break;
                }
            } catch (error) {
                // Selector not found, continue
            }
        }
        
        // If Cloudflare challenge detected, wait for it to complete
        if (isCloudflareChallenge) {
            console.log('⏳ Waiting for Cloudflare challenge to complete...');
            
            // Wait up to 45 seconds for challenge to complete
            try {
                await page.waitForFunction(
                    () => {
                        const title = document.title.toLowerCase();
                        const body = document.body ? document.body.textContent.toLowerCase() : '';
                        
                        // Check if we're past the challenge
                        return !title.includes('checking') && 
                               !title.includes('cloudflare') && 
                               !body.includes('checking your browser') &&
                               !body.includes('please wait');
                    },
                    { timeout: 45000 }
                );
                
                console.log('✅ Cloudflare challenge completed');
                
                // Additional wait to ensure page is fully loaded
                await page.waitForTimeout(5000);
                
            } catch (error) {
                console.log('⚠️ Cloudflare challenge timeout - attempting to continue');
                throw new Error('Cloudflare challenge failed');
            }
        }
        
        // Verify we can access the page content
        try {
            await page.waitForSelector('body', { timeout: 15000 });
            console.log('✅ Page loaded successfully after Cloudflare check');
        } catch (error) {
            throw new Error('Page failed to load after Cloudflare check');
        }
        
    } catch (error) {
        console.error('❌ Error during Cloudflare handling:', error);
        throw error;
    }
}

async function runIHerbCloudflareScraper() {
    console.log('🌿 Starting iHerb Cloudflare-Aware Scraper...');
    
    const crawler = new PlaywrightCrawler({
        ...iherbCloudflareConfig,
        async requestHandler({ page, request }) {
            const req: IHerbCloudflareRequest = request.userData;
            console.log(`\n🔍 Processing iHerb: ${req.herb} ${req.type}`);

            try {
                // Navigate to iHerb search page
                const searchUrl = `https://www.iherb.com/search?kw=${encodeURIComponent(req.herb + ' ' + req.type)}`;
                console.log(`🌐 Navigating to: ${searchUrl}`);
                
                await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
                
                // Handle Cloudflare challenge
                await handleCloudflareChallenge(page);
                
                // Wait for page to stabilize
                await page.waitForTimeout(3000);
                
                // Extract product URLs using enhanced iHerb handler
                const urls = await extractIherbUrls(page, req.herb, req.type, req.maxResults);
                console.log(`✅ Found ${urls.length} iHerb product URLs`);

                // Save URLs to dataset
                for (const url of urls) {
                    await Dataset.pushData({
                        url,
                        herb: req.herb,
                        type: req.type,
                        site: 'iherb',
                        timestamp: new Date().toISOString(),
                        source: 'cloudflare-aware-scraper'
                    });
                }

                console.log(`🎯 iHerb ${req.herb} ${req.type}: ${urls.length} URLs collected`);

            } catch (err: any) {
                console.error(`❌ Error processing iHerb ${req.herb} ${req.type}:`, err.message);
                
                // If it's a Cloudflare error, we might want to retry
                if (err.message.includes('Cloudflare') || err.message.includes('403')) {
                    console.log('🔄 Cloudflare error detected - this request will be retried');
                    throw err; // Let Crawlee handle retry
                }
            }
        }
    });

    // Add iHerb-specific requests
    for (const req of testRequests) {
        const searchUrl = `https://www.iherb.com/search?kw=${encodeURIComponent(req.herb + ' ' + req.type)}`;
        await crawler.addRequests([{ url: searchUrl, userData: req }]);
    }

    await crawler.run();
    
    console.log('\n🌿 iHerb Cloudflare-Aware Scraper completed!');
    console.log('📊 Check the storage/datasets directory for results');
}

// Command line argument handling
const args = process.argv.slice(2);
if (args.includes('quick')) {
    console.log('🚀 Quick mode: Reducing test requests...');
    testRequests.length = 1;
    testRequests[0].maxResults = 3;
    testRequests[0].maxPages = 1;
}

runIHerbCloudflareScraper().catch(console.error);


