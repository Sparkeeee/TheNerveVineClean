import { Page } from 'playwright';
import { paginateUntilDone } from '../utils/pagination';

export async function extractAmazonUrls(
    page: Page,
    herb: string,
    type: string,
    maxResults = 30
): Promise<string[]> {
    return paginateUntilDone(
        page,
        async () => {
            // Try multiple selector strategies like before
            let urls: string[] = [];
            
            // Strategy 1: Primary working selector (was working before)
            try {
                urls = await page.$$eval(
                    'a[href*="/dp/"]',
                    els => els.map(el => (el as HTMLAnchorElement).href.split('?')[0])
                );
                console.log(`📊 Amazon Strategy 1: Found ${urls.length} URLs`);
            } catch (err) {
                console.log('⚠️ Amazon Strategy 1 failed, trying next...');
            }
            
            // Strategy 2: Alternative selectors if primary fails
            if (!urls.length) {
                try {
                    urls = await page.$$eval(
                        'a[href*="/dp/"], a[data-testid="product-title"]',
                        els => els.map(el => (el as HTMLAnchorElement).href.split('?')[0])
                    );
                    console.log(`📊 Amazon Strategy 2: Found ${urls.length} URLs`);
                } catch (err) {
                    console.log('⚠️ Amazon Strategy 2 failed');
                }
            }
            
            // Filter for valid product URLs
            urls = urls.filter(href => 
                href.includes('amazon.com') && 
                href.includes('/dp/') &&
                !href.includes('review') && 
                !href.includes('question') &&
                !href.includes('customer-reviews') &&
                !href.includes('sponsored') &&
                href.length > 20 // Basic URL validation
            );
            
            console.log(`✅ Amazon: ${urls.length} valid URLs for ${herb} ${type}`);
            return urls;
        },
        'a.s-pagination-next',
        3
    ).then(urls => [...new Set(urls)].slice(0, maxResults));
}
