// target-scraper/src/extractors/amazon/extractor.ts

import { chromium, Page, Browser } from "playwright-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { amazonConfig } from "./config";

chromium.use(StealthPlugin());

async function createBrowser(proxy?: string): Promise<Browser> {
    return chromium.launch({
        headless: amazonConfig.headless,
        proxy: proxy ? { server: proxy } : undefined,
    });
}

export async function extractAmazonUrls(
    searchTerm: string,
    maxPages = amazonConfig.maxPages,
    maxRetries = amazonConfig.maxRetries
): Promise<string[]> {
    console.log(`🌐 Amazon: Starting extraction for "${searchTerm}"`);

    let urls: string[] = [];

    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
        let success = false;
        let attempt = 0;

        while (!success && attempt < maxRetries) {
            attempt++;

            const proxy =
                amazonConfig.proxies.length > 0
                    ? amazonConfig.proxies[(pageNum + attempt) % amazonConfig.proxies.length]
                    : undefined;

            console.log(`➡️ Navigating to page ${pageNum} (Attempt ${attempt}) ${proxy ? "via proxy" : ""}`);

            const browser = await createBrowser(proxy);
            const context = await browser.newContext();
            const page: Page = await context.newPage();

            try {
                const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(
                    searchTerm
                )}&page=${pageNum}`;
                await page.goto(searchUrl, { waitUntil: "networkidle", timeout: 45000 });

                // Check for Captcha
                const captcha = await page.$('form[action*="/errors/validateCaptcha"]');
                if (captcha) throw new Error("Amazon blocked by Captcha");

                // Scroll for lazy loading
                await page.evaluate(async () => {
                    window.scrollBy(0, window.innerHeight);
                    await new Promise((r) => setTimeout(r, 2000));
                });

                // Collect URLs
                const links = await page.$$eval('a[href*="/dp/"]', (elements) =>
                    elements
                        .map((el) => el.getAttribute("href"))
                        .filter((href): href is string => !!href && href.includes("/dp/"))
                );

                // Clean and normalize URLs to extract only the product ID
                const pageUrls = links.map((href) => {
                    // Extract the product ID from /dp/PRODUCT_ID pattern
                    const match = href.match(/\/dp\/([A-Z0-9]{10})/);
                    if (match) {
                        return `https://www.amazon.com/dp/${match[1]}`;
                    }
                    // Fallback: clean the URL by removing everything after /dp/
                    if (href.includes("/dp/")) {
                        const cleanUrl = href.split("/dp/")[0] + "/dp/" + href.split("/dp/")[1].split("/")[0];
                        return cleanUrl.startsWith("http") ? cleanUrl : `https://www.amazon.com${cleanUrl}`;
                    }
                    return href.startsWith("http") ? href : `https://www.amazon.com${href}`;
                });

                urls.push(...pageUrls);
                console.log(`✅ Page ${pageNum}: Extracted ${pageUrls.length} URLs`);

                success = true;
            } catch (err) {
                console.warn(`⚠️ Page ${pageNum} attempt ${attempt} failed:`, (err as Error).message);
            } finally {
                await browser.close();
            }
        }

        if (!success) {
            console.error(`❌ Failed to extract page ${pageNum} after ${maxRetries} retries`);
            break;
        }

        // Delay between pages
        const delay =
            amazonConfig.minDelayMs +
            Math.random() * (amazonConfig.maxDelayMs - amazonConfig.minDelayMs);
        console.log(`⏱ Waiting ${Math.round(delay)}ms before next page...`);
        await new Promise((res) => setTimeout(res, delay));
    }

    urls = Array.from(new Set(urls)); // remove duplicates
    console.log(`🎯 Total Amazon product URLs extracted: ${urls.length}`);
    return urls;
}
