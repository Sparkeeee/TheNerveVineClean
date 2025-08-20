import { Page } from 'playwright';

export async function extractIherbUrls(page: Page, herb: string, type: string): Promise<string[]> {
    console.log(`🔍 iHerb: extracting ${herb} ${type}`);
    try {
        await page.goto(`https://www.iherb.com/search?kw=${encodeURIComponent(herb + ' ' + type)}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(2000);
        
        const urls = await page.$$eval('a[href*="/p/"]', links => links.map(a => (a as HTMLAnchorElement).href));
        console.log(`✅ iHerb: found ${urls.length} URLs`);
        return [...new Set(urls)].slice(0, 25);
    } catch (err) {
        console.error('❌ iHerb extractor failed:', err);
        return [];
    }
}
