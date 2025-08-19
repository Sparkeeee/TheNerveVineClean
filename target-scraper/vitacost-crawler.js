const puppeteer = require('puppeteer');
const fs = require('fs');
const readline = require('readline');

class ManualVitacostCrawler {
    constructor(options = {}) {
        this.outputFile = options.outputFile || 'vitacost_kava_urls.json';
        this.collectedUrls = new Set();
        this.maxPages = options.maxPages || 5;
        this.currentPage = 0;
    }

    async createReadlineInterface() {
        return readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    async waitForUserInput(message) {
        const rl = await this.createReadlineInterface();
        return new Promise((resolve) => {
            rl.question(message, (answer) => {
                rl.close();
                resolve(answer);
            });
        });
    }

    async run() {
        console.log('\n🚀 Starting Manual Vitacost Crawler');
        console.log('🎯 This approach bypasses Crawlee and gives you full control\n');

        let browser;
        try {
            console.log('🌐 Launching browser...');
            browser = await puppeteer.launch({
                headless: false,
                defaultViewport: null,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-web-security',
                    '--start-maximized',
                    '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                ]
            });

            const page = await browser.newPage();
            
            // Set additional headers to look more human
            await page.setExtraHTTPHeaders({
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
            });

            console.log('✅ Browser launched successfully!');
            
            // Start with Kava search on Vitacost
            const startUrl = 'https://www.vitacost.com/search?search=kava';
            console.log(`\n🔗 Navigating to: ${startUrl}`);
            
            await this.processPage(page, startUrl);
            
        } catch (error) {
            console.error('💥 Error:', error.message);
        } finally {
            if (browser) {
                console.log('\n🔄 Keeping browser open for manual navigation...');
                await this.waitForUserInput('Press Enter when you want to close the browser and save results...');
                await browser.close();
            }
        }

        await this.saveResults();
    }

    async processPage(page, url) {
        try {
            console.log(`\n📄 Processing page ${this.currentPage + 1}/${this.maxPages}: ${url}`);
            
            // Navigate with timeout
            await page.goto(url, { 
                waitUntil: 'domcontentloaded',
                timeout: 60000 
            });

            console.log('⏰ Waiting 5 seconds for page to load...');
            await page.waitForTimeout(5000);

            // Check current state
            const title = await page.title();
            const currentUrl = page.url();
            
            console.log(`📄 Page title: ${title}`);
            console.log(`🔗 Current URL: ${currentUrl}`);

            // Check for blocking or challenges
            const pageContent = await page.content();
            const isBlocked = this.detectBlocking(title, pageContent, currentUrl);

            if (isBlocked) {
                console.log('\n⚠️  🛡️  BLOCKING DETECTED! 🛡️');
                console.log('🤖 The page appears to be blocked or showing a challenge');
                console.log('👁️  Check the browser window - you should see:');
                console.log('   - Security challenge page');
                console.log('   - "Checking your browser" message');
                console.log('   - CAPTCHA or verification');
                console.log('\n🎯 INSTRUCTIONS:');
                console.log('1. Go to the browser window');
                console.log('2. Complete any challenges (checkboxes, CAPTCHAs, etc.)');
                console.log('3. Wait for the normal Vitacost page to load');
                console.log('4. Come back here and press Enter');
                
                await this.waitForUserInput('\n⏸️  Press Enter after you\'ve solved the challenges...');
                
                // Check if resolved
                const newTitle = await page.title();
                const newUrl = page.url();
                console.log(`\n✅ After resolution:`);
                console.log(`📄 New title: ${newTitle}`);
                console.log(`🔗 New URL: ${newUrl}`);
            }

            // Extract URLs from current page
            await this.extractUrls(page);
            
            // Ask user if they want to continue
            if (this.currentPage < this.maxPages - 1) {
                const continueChoice = await this.waitForUserInput('\n🤔 Do you want to navigate to another page? (y/n): ');
                
                if (continueChoice.toLowerCase() === 'y' || continueChoice.toLowerCase() === 'yes') {
                    const nextUrl = await this.waitForUserInput('🔗 Enter the next URL to scrape (or press Enter to skip): ');
                    
                    if (nextUrl.trim()) {
                        this.currentPage++;
                        await this.processPage(page, nextUrl.trim());
                    }
                }
            }

        } catch (error) {
            console.error(`💥 Error processing page: ${error.message}`);
            
            if (error.name === 'TimeoutError') {
                console.log('⏰ Page load timeout - this might be due to blocking');
                console.log('🔍 Check the browser window for challenges');
                
                const retry = await this.waitForUserInput('🔄 Try to continue anyway? (y/n): ');
                if (retry.toLowerCase() === 'y') {
                    await this.extractUrls(page);
                }
            }
        }
    }

    detectBlocking(title, content, url) {
        const blockingIndicators = [
            // Title indicators
            title.toLowerCase().includes('security'),
            title.toLowerCase().includes('checking'),
            title.toLowerCase().includes('verification'),
            title.toLowerCase().includes('challenge'),
            title.toLowerCase().includes('blocked'),
            
            // Content indicators
            content.toLowerCase().includes('checking your browser'),
            content.toLowerCase().includes('security check'),
            content.toLowerCase().includes('please wait'),
            content.toLowerCase().includes('verify you are human'),
            content.toLowerCase().includes('access denied'),
            
            // URL indicators
            url.includes('security-check'),
            url.includes('challenge'),
            url.includes('blocked')
        ];

        return blockingIndicators.some(indicator => indicator === true);
    }

    async extractUrls(page) {
        try {
            console.log('\n🔍 Extracting product URLs...');

            // Scroll to load any lazy content
            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });
            await page.waitForTimeout(2000);

            // Extract URLs - Vitacost uses different selectors
            const urls = await page.evaluate(() => {
                const links = [];
                // Vitacost product selectors
                const productSelectors = [
                    'a[href*="/product/"]',
                    'a[href*="/p/"]',
                    'a[data-product-id]',
                    '.product-link',
                    '.product-title a'
                ];

                productSelectors.forEach(selector => {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href && !href.includes('#') && !href.includes('javascript:')) {
                            let fullUrl = href;
                            if (!href.startsWith('http')) {
                                fullUrl = href.startsWith('/') ? 
                                    `https://www.vitacost.com${href}` : 
                                    `https://www.vitacost.com/${href}`;
                            }
                            // Only keep actual product URLs
                            if (fullUrl.includes('/product/') || fullUrl.includes('/p/')) {
                                links.push(fullUrl);
                            }
                        }
                    });
                });

                return [...new Set(links)];
            });

            // Filter URLs to only keep those containing "kava" (case-insensitive)
            const kavaUrls = urls.filter(url => {
                const urlLower = url.toLowerCase();
                return urlLower.includes('kava');
            });

            console.log(`📦 Found ${urls.length} total product URLs`);
            console.log(`🔍 Filtered to ${kavaUrls.length} Kava-related URLs`);

            // Add filtered URLs to collection
            let newUrlsCount = 0;
            kavaUrls.forEach(url => {
                if (!this.collectedUrls.has(url)) {
                    this.collectedUrls.add(url);
                    newUrlsCount++;
                }
            });

            console.log(`✅ Added ${newUrlsCount} new Kava URLs`);
            console.log(`📊 Total unique Kava URLs collected: ${this.collectedUrls.size}`);

            // Show some sample URLs
            if (kavaUrls.length > 0) {
                console.log('\n📋 Sample Kava URLs found:');
                kavaUrls.slice(0, 3).forEach((url, index) => {
                    console.log(`   ${index + 1}. ${url}`);
                });
                if (kavaUrls.length > 3) {
                    console.log(`   ... and ${kavaUrls.length - 3} more`);
                }
            } else {
                // Debug info if no Kava URLs found
                const debugInfo = await page.evaluate(() => {
                    return {
                        allLinksCount: document.querySelectorAll('a').length,
                        bodyText: document.body ? document.body.textContent.substring(0, 200) + '...' : 'No body',
                        firstFewLinks: Array.from(document.querySelectorAll('a')).slice(0, 5).map(a => a.href)
                    };
                });

                console.log('\n🔬 Debug info (no Kava URLs found):');
                console.log(`   Total links on page: ${debugInfo.allLinksCount}`);
                console.log(`   Page content preview: ${debugInfo.bodyText}`);
                console.log('   First few links:', debugInfo.firstFewLinks);
                console.log('   Note: This might mean the search results changed or no Kava products were found');
            }

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

        console.log('\n🎉 Results saved! You can now use these URLs with your manual scraper.');

        return results;
    }
}

// Usage
async function main() {
    console.log('🧪 Testing Puppeteer installation...');
    
    try {
        const testBrowser = await puppeteer.launch({ headless: true });
        await testBrowser.close();
        console.log('✅ Puppeteer is working!\n');
    } catch (error) {
        console.error('❌ Puppeteer test failed:', error.message);
        console.log('\n🔧 Try running one of these:');
        console.log('   npm install puppeteer');
        console.log('   npx @puppeteer/browsers install chrome');
        return;
    }

    const crawler = new ManualVitacostCrawler({
        maxPages: 3,
        outputFile: 'vitacost_kava_urls.json'
    });

    await crawler.run();
}

if (require.main === module) {
    main().catch(console.error);
}


