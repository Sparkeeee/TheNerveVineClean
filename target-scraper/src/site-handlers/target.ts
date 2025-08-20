import fs from "fs";
import path from "path";
import { Page } from "playwright";

// Load config safely in ES module
const configPath = path.join(process.cwd(), "config", "target.json");
const targetConfig = JSON.parse(fs.readFileSync(configPath, "utf-8")).target;

function randomDelay(min: number, max: number) {
    return new Promise(res => setTimeout(res, Math.floor(Math.random() * (max - min + 1)) + min));
}

async function humanScroll(page: Page) {
    const steps = targetConfig.scraper.scrollSteps;
    for (let i = 0; i < steps; i++) {
        await page.evaluate(y => window.scrollBy(0, y), 500 + Math.random() * 300);
        await randomDelay(
            targetConfig.scraper.scrollDelayMin,
            targetConfig.scraper.scrollDelayMax
        );
    }
}

async function extractProductLinks(page: Page): Promise<string[]> {
    const { selectors } = targetConfig;
    
    // Try primary selector first
    try {
        const primaryUrls = await page.$$eval(selectors.productLinks, els =>
            els
                .map(el => el.getAttribute('href'))
                .filter((href): href is string => !!href && href.includes('/p/'))
                .map(href => new URL(href, 'https://www.target.com').toString())
        );
        if (primaryUrls.length > 0) {
            console.log(`✅ Primary selector found ${primaryUrls.length} URLs`);
            return primaryUrls;
        }
    } catch (err) {
        console.log('⚠️ Primary selector failed:', err);
    }

    // Try fallback selectors
    try {
        const fallbackUrls = await page.$$eval(selectors.fallbackProductLinks, els =>
            els
                .map(el => el.getAttribute('href'))
                .filter((href): href is string => !!href && href.includes('/p/'))
                .map(href => new URL(href, 'https://www.target.com').toString())
        );
        if (fallbackUrls.length > 0) {
            console.log(`🔄 Fallback selector found ${fallbackUrls.length} URLs`);
            return fallbackUrls;
        }
    } catch (err) {
        console.log('⚠️ Fallback selector failed:', err);
    }

    // Try backup selector
    try {
        const backupUrls = await page.$$eval(selectors.backupProductLinks, els =>
            els
                .map(el => el.getAttribute('href'))
                .filter((href): href is string => !!href && href.includes('/p/'))
                .map(href => new URL(href, 'https://www.target.com').toString())
        );
        if (backupUrls.length > 0) {
            console.log(`🔄 Backup selector found ${backupUrls.length} URLs`);
            return backupUrls;
        }
    } catch (err) {
        console.log('⚠️ Backup selector failed:', err);
    }

    return [];
}

export async function extractTargetUrls(
    page: Page,
    herb: string,
    type: string,
    maxResults = targetConfig.filters.maxResults
): Promise<string[]> {
    const { baseUrl, selectors, scraper } = targetConfig;
    
    let allUrls: string[] = [];
    let currentPage = 1;
    let retries = 0;

    while (currentPage <= scraper.maxPages) {
        const url = `${baseUrl}${encodeURIComponent(herb + ' ' + type)}&page=${currentPage}`;
        console.log(`➡️ Navigating to: ${url}`);

        try {
            await page.goto(url, { 
                waitUntil: scraper.waitUntil, 
                timeout: scraper.timeout 
            });

            // Human-like scrolling
            await humanScroll(page);

            // Extract product links
            const rawUrls = await extractProductLinks(page);

            // Dedupe and add new URLs
            const before = allUrls.length;
            allUrls.push(...rawUrls);
            allUrls = [...new Set(allUrls)];
            const after = allUrls.length;

            console.log(
                `✅ Page ${currentPage}: Extracted ${rawUrls.length} raw → ${after - before} new unique`
            );

            // Check for next page
            const hasNext = await page.$(selectors.nextPage);
            if (!hasNext) {
                console.log('🚪 No next page button, stopping early');
                break;
            }

            // Random delay between pages
            await randomDelay(scraper.minDelay, scraper.maxDelay);
            currentPage++;
            retries = 0; // Reset retries since page succeeded

        } catch (err) {
            retries++;
            console.warn(
                `⚠️ Error on page ${currentPage}, retry ${retries}/${scraper.maxRetries}: ${err}`
            );

            if (retries >= scraper.maxRetries) {
                console.error(`❌ Max retries reached, aborting pagination at page ${currentPage}`);
                break;
            }

            await randomDelay(scraper.minDelay, scraper.maxDelay);
        }
    }

    // Final filtering and deduplication
    const validUrls = allUrls.filter(href => 
        href.includes('target.com') && 
        href.includes('/p/') &&
        !targetConfig.filters.excludePatterns.some(pattern => href.includes(pattern))
    );

    const finalUrls = [...new Set(validUrls)].slice(0, maxResults);
    
    console.log(
        `🎯 Target total unique URLs extracted: ${finalUrls.length}`
    );

    return finalUrls;
}
