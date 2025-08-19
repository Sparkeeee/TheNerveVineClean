import { Page } from 'playwright';
import { extractAmazonUrls } from './amazon';
import { extractTargetUrls } from './target';
import { extractIherbUrls } from './iherb';
import { extractVitacostUrls } from './vitacost';

export async function extractUrlsFromSite(page: Page, { herb, type, site, maxResults = 30 }: any) {
    switch (site) {
        case 'amazon':
            return extractAmazonUrls(page, herb, type, maxResults);
        case 'target':
            return extractTargetUrls(page, herb, type, maxResults);
        case 'iherb':
            return extractIherbUrls(page, herb, type, maxResults);
        case 'vitacost':
            return extractVitacostUrls(page, herb, type, maxResults);
        default:
            console.warn(`⚠️ Unknown site: ${site}`);
            return [];
    }
}
