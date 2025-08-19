const { PlaywrightCrawler } = require('crawlee');
const fs = require('fs');

class SimpleIHerbCrawler {
    constructor(options = {}) {
        this.maxRequestsPerCrawl = options.maxRequestsPerCrawl || 10;
        this.outputFile = options.outputFile || 'iherb_urls.json';
        this.collectedUrls = new Set();
        this.sessionDir = options.sessionDir || './browser_session';
        
        // Create session directory
        if (!fs.existsSync(this.sessionDir)) {
            fs.mkdirSync(this.sessionDir, { recursive: true });
        }
    }

    async initialize() {
        this.crawler = new PlaywrightCrawler({
            maxRequestsPerCrawl: this.maxRequestsPerCrawl,
            maxConcurrency: 1,
            requestHandlerTimeoutSecs: 180,
            
            launchContext: {
                launchOptions: {
                    headless: false,
                    userDataDir: this.sessionDir,
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-web-security',
                        '--window-size=1366,768'
                    ]
                }
            },

            async requestHandler({ page, request }) {
                console.log(`\n🌐 Processing: ${request.url}`);
                
                try {
                    // Simple wait for page load
                    await page.waitForTimeout(5000);
                    
                    // Check for Cloudflare manually
                    const title = await page.title();
                    const url = page.url();
                    
                    console.log(`📄 Page title: ${title}`);
                    console.log(`🔗 Current URL: ${url}`);
                    
                    // Check if we're blocked
                    if (title.toLowerCase().includes('cloudflare') || 
                        title.toLowerCase().includes('checking') ||
                        title.toLowerCase().includes('security')) {
                        
                        console.log('\n⚠️  CLOUDFLARE DETECTED!');
                        console.log('🤖 Please solve the challenge in the browser window');
                        console.log('⏰ Waiting 60 seconds for you to complete it...\n');
                        
                        // Wait for manual intervention
                        await page.waitForTimeout(60000);
                        
                        // Check again
                        const newTitle = await page.title();
                        console.log(`📄 New page title: ${newTitle}`);
                    }
                    
                    // Try to find product links
                    await this.extractUrls(page);
                    
                } catch (error) {
                    console.error(`💥 Error: ${error.message}`);
                }
            },

            failedRequestHandler({ request }) {
                console.log(`💀 Failed: ${request.url}`);
            }
        });
    }

    async extractUrls(page) {
        try {
            // Wait for content
            await page.waitForSelector('body', { timeout: 10000 });
            
            // Extract product URLs
            const urls = await page.evaluate(() => {
                const links = [];
                const productLinks = document.querySelectorAll('a[href*="/pr/"]');
                
                productLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href) {
                        const fullUrl = href.startsWith('http') ? href : `https://www.iherb.com${href}`;
                        links.push(fullUrl);
                    }
                });
                
                return [...new Set(links)];
            });
            
            console.log(`📦 Found ${urls.length} product URLs`);
            
            // Add to collection
            urls.forEach(url => {
                this.collectedUrls.add(url);
            });
            
            console.log(`✅ Total collected: ${this.collectedUrls.size}`);
            
        } catch (error) {
            console.error(`🚨 Error extracting URLs: ${error.message}`);
        }
    }

    async saveResults() {
        const urlArray = Array.from(this.collectedUrls);
        const results = {
            totalUrls: urlArray.length,
            timestamp: new Date().toISOString(),
            urls: urlArray
        };

        fs.writeFileSync(this.outputFile, JSON.stringify(results, null, 2));
        console.log(`\n💾 Saved ${urlArray.length} URLs to ${this.outputFile}`);

        // Also save as text
        const txtFile = this.outputFile.replace('.json', '.txt');
        fs.writeFileSync(txtFile, urlArray.join('\n'));
        console.log(`💾 Also saved to ${txtFile}`);

        return results;
    }

    async run() {
        console.log('\n🚀 Starting Simple iHerb Crawler');
        console.log('⚠️  If you see Cloudflare, solve it manually in the browser!\n');
        
        await this.initialize();
        
        const startUrls = [
            'https://www.iherb.com/c/vitamins'
        ];

        await this.crawler.run(startUrls);
        
        const results = await this.saveResults();
        
        console.log('\n🎉 Crawl Complete!');
        console.log(`📊 Total URLs: ${results.totalUrls}`);
        
        return results;
    }
}

// Simple usage
async function main() {
    const crawler = new SimpleIHerbCrawler({
        maxRequestsPerCrawl: 5,  // Very small test
        outputFile: 'iherb_simple_urls.json'
    });

    try {
        await crawler.run();
        
        // Give instructions for next steps
        console.log('\n📋 Next Steps:');
        console.log('1. Check the saved URLs in iherb_simple_urls.txt');
        console.log('2. If successful, increase maxRequestsPerCrawl');
        console.log('3. Add more starting URLs to crawl more categories');
        
    } catch (error) {
        console.error('💥 Error:', error.message);
        
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Make sure Chrome is installed');
        console.log('2. Try running: npm install puppeteer');
        console.log('3. Or install Chrome manually and update the executablePath');
    }
}

module.exports = SimpleIHerbCrawler;

if (require.main === module) {
    main().catch(console.error);
}
