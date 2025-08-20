import fs from "fs";
import path from "path";
import { Page } from "playwright";
import { paginateUntilDone } from '../utils/pagination';

// Load iHerb-specific config safely in ES module
const configPath = path.join(process.cwd(), "config", "iherb.json");
const iherbConfig = JSON.parse(fs.readFileSync(configPath, "utf-8")).iherb;

function randomDelay(min: number, max: number) {
    return new Promise(res => setTimeout(res, Math.floor(Math.random() * (max - min + 1)) + min));
}

async function humanScroll(page: Page) {
    const steps = iherbConfig.scraper.scrollSteps;
    for (let i = 0; i < steps; i++) {
        await page.evaluate(y => window.scrollBy(0, y), 400 + Math.random() * 200);
        await randomDelay(
            iherbConfig.scraper.scrollDelayMin,
            iherbConfig.scraper.scrollDelayMax
        );
    }
}

async function extractProductLinks(page: Page): Promise<string[]> {
    const { selectors } = iherbConfig;
    
    // Try primary selector first
    try {
        const primaryUrls = await page.$$eval(selectors.productLinks, els =>
            els
                .map(el => el.getAttribute('href'))
                .filter((href): href is string => !!href && href.includes('/p/'))
                .map(href => new URL(href, 'https://www.iherb.com').toString())
        );
        if (primaryUrls.length > 0) {
            console.log(`✅ iHerb Primary selector found ${primaryUrls.length} URLs`);
            return primaryUrls;
        }
    } catch (err) {
        console.log('⚠️ iHerb Primary selector failed:', err);
    }

    // Try fallback selectors
    try {
        const fallbackUrls = await page.$$eval(selectors.fallbackProductLinks, els =>
            els
                .map(el => el.getAttribute('href'))
                .filter((href): href is string => !!href && href.includes('/p/'))
                .map(href => new URL(href, 'https://www.iherb.com').toString())
        );
        if (fallbackUrls.length > 0) {
            console.log(`🔄 iHerb Fallback selector found ${fallbackUrls.length} URLs`);
            return fallbackUrls;
        }
    } catch (err) {
        console.log('⚠️ iHerb Fallback selector failed:', err);
    }

    // Try backup selector
    try {
        const backupUrls = await page.$$eval(selectors.backupProductLinks, els =>
            els
                .map(el => el.getAttribute('href'))
                .filter((href): href is string => !!href && href.includes('/p/'))
                .map(href => new URL(href, 'https://www.iherb.com').toString())
        );
        if (backupUrls.length > 0) {
            console.log(`🔄 iHerb Backup selector found ${backupUrls.length} URLs`);
            return backupUrls;
        }
    } catch (err) {
        console.log('⚠️ iHerb Backup selector failed:', err);
    }

    return [];
}

export async function extractIherbUrls(
    page: Page,
    herb: string,
    type: string,
    maxResults = iherbConfig.filters.maxResults
): Promise<string[]> {
    try {
        console.log(`🔍 iHerb: Starting extraction for ${herb} ${type}`);
        
        const searchUrl = `${iherbConfig.baseUrl}${encodeURIComponent(herb + " " + type)}`;
        await page.goto(searchUrl, { 
            waitUntil: iherbConfig.scraper.waitUntil, 
            timeout: iherbConfig.scraper.timeout 
        });
        
        // Wait for page stabilization
        await page.waitForTimeout(iherbConfig.scraper.pageStabilizationDelay);
        
        // Human-like scrolling
        if (iherbConfig.antiDetection.humanScroll) {
            await humanScroll(page);
        }

        const seenUrls = new Set<string>();

        return await paginateUntilDone(
            page,
            async () => {
                let urls: string[] = [];

                // Multi-strategy selectors
                try {
                    await Promise.race([
                        page.waitForSelector('.product-cell-container', { timeout: 25000 }),
                        page.waitForSelector('.product-cell', { timeout: 25000 }),
                        page.waitForSelector('[data-testid="product-card"]', { timeout: 25000 }),
                    ]);

                    urls = await extractProductLinks(page);
                    console.log(`📊 iHerb: Found ${urls.length} URLs on this page`);
                } catch (err) {
                    console.log('⚠️ iHerb: No products found on this page, skipping...');
                }

                // Filter, remove duplicates
                urls = urls
                    .filter(href => {
                        const isValid = href.includes('/p/') && 
                                      !seenUrls.has(href) &&
                                      href.length >= iherbConfig.filters.minProductUrlLength &&
                                      iherbConfig.filters.requiredUrlPatterns.every(pattern => href.includes(pattern));
                        
                        // Check exclusion patterns
                        const isExcluded = iherbConfig.filters.excludePatterns.some(pattern => href.includes(pattern));
                        
                        return isValid && !isExcluded;
                    })
                    .map(href => {
                        seenUrls.add(href);
                        return href;
                    });

                console.log(`✅ iHerb: ${urls.length} new valid URLs`);
                return urls;
            },
            iherbConfig.selectors.nextPage,
            iherbConfig.scraper.maxPages
        ).then(urls => {
            // Final filtering and deduplication
            const validUrls = [...new Set(urls)].slice(0, maxResults);
            
            console.log(`✅ iHerb: ${validUrls.length} valid URLs for ${herb} ${type}`);
            return validUrls;
        });
    } catch (err) {
        console.error('❌ iHerb extractor failed:', err);
        return [];
    }
}
