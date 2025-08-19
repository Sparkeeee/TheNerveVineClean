import { Page } from 'playwright';
import { paginateUntilDone } from '../utils/pagination';

export async function extractVitacostUrls(
    page: Page,
    herb: string,
    type: string,
    maxResults = 30
): Promise<string[]> {
    try {
        console.log(`🔍 Vitacost: Starting extraction for ${herb} ${type}`);

        const searchUrl = `https://www.vitacost.com/search?search=${encodeURIComponent(herb + " " + type)}`;
        await page.goto(searchUrl, { waitUntil: "networkidle", timeout: 40000 });
        await page.waitForTimeout(3000);

        const seenUrls = new Set<string>();

        return await paginateUntilDone(
            page,
            async () => {
                let urls: string[] = [];

                try {
                    await Promise.race([
                        page.waitForSelector('.product-tile', { timeout: 30000 }),
                        page.waitForSelector('.product-item', { timeout: 30000 }),
                        page.waitForSelector('[data-testid="product-card"]', { timeout: 30000 }),
                    ]);

                    urls = await page.$$eval(
                        '.product-tile a[href*="/Product.aspx"], .product-item a[href*="/Product.aspx"], [data-testid="product-card"] a[href*="/Product.aspx"]',
                        (links) => links.map((a) => (a as HTMLAnchorElement).href)
                    );
                    console.log(`📊 Vitacost: Found ${urls.length} URLs on this page`);
                } catch (err) {
                    console.log('⚠️ Vitacost: No products found on this page, skipping...');
                }

                // Filter, remove duplicates
                urls = urls
                    .filter(href => (href.includes('/Product.aspx') || href.includes('/product')) && !seenUrls.has(href))
                    .map(href => {
                        seenUrls.add(href);
                        return href;
                    });

                console.log(`✅ Vitacost: ${urls.length} new valid URLs`);
                return urls;
            },
            ".pagination .next a, .pagination-next, a[aria-label='Next'], a:has-text('Next')",
            3
        ).then(urls => {
            // Filter for valid Vitacost URLs
            const validUrls = urls.filter(href => 
                href.includes('vitacost.com') &&
                (href.includes('/Product.aspx') || href.includes('/product')) &&
                !href.includes('search') &&
                !href.includes('cart') &&
                !href.includes('account') &&
                href.length > 20 // Basic URL validation
            );
            
            console.log(`✅ Vitacost: ${validUrls.length} valid URLs for ${herb} ${type}`);
            return validUrls.slice(0, maxResults);
        });
    } catch (err) {
        console.error('❌ Vitacost extractor failed:', err);
        return [];
    }
}
