import { Page } from 'playwright';

export async function extractTargetUrls(page: Page, herb: string, type: string): Promise<string[]> {
    console.log(`🔍 Target: extracting ${herb} ${type}`);
    try {
        await page.goto(`https://www.target.com/s?searchTerm=${encodeURIComponent(herb + ' ' + type)}`, { waitUntil: 'domcontentloaded', timeout: 30000 });

        const urls = await page.$$eval('a[data-test="product-title"]', links => links.map(a => (a as HTMLAnchorElement).href));
        console.log(`✅ Target: found ${urls.length} URLs`);
        return [...new Set(urls)].slice(0, 25);
    } catch (err) {
        console.error('❌ Target extractor failed:', err);
        return [];
    }
}
