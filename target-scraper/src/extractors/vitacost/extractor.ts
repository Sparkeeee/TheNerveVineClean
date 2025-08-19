import { Page } from 'playwright';

export async function extractVitacostUrls(page: Page, herb: string, type: string): Promise<string[]> {
    console.log(`🔍 Vitacost: extracting ${herb} ${type}`);
    try {
        await page.goto(`https://www.vitacost.com/search?search=${encodeURIComponent(herb + ' ' + type)}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(2000);

        const urls = await page.$$eval('a[href*="/Product.aspx"]', links => links.map(a => (a as HTMLAnchorElement).href));
        console.log(`✅ Vitacost: found ${urls.length} URLs`);
        return [...new Set(urls)].slice(0, 25);
    } catch (err) {
        console.error('❌ Vitacost extractor failed:', err);
        return [];
    }
}
