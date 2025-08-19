import { firefox } from 'playwright';

export interface ScrapedProduct {
    name: string;
    price: string;
    image: string;
    description: string;
    url: string;
    site: string;
    herbName: string;
    productType: string;
    timestamp: string;
}

export async function scrapeProductDetails(url: string): Promise<ScrapedProduct | null> {
    try {
        const browser = await firefox.launch({ headless: true });
        const page = await browser.newPage();
        
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
        await page.waitForTimeout(2000); // Page stabilization
        
        // Determine site from URL
        const site = url.includes('amazon.com') ? 'amazon' : 
                    url.includes('target.com') ? 'target' : 
                    url.includes('iherb.com') ? 'iherb' :
                    url.includes('vitacost.com') ? 'vitacost' : 'unknown';
        
        // Extract data using your proven selectors
        const product = await extractProductData(page, site, url);
        
        await browser.close();
        return product;
        
    } catch (err) {
        console.error('Failed to scrape', url, err);
        return null;
    }
}

async function extractProductData(page: any, site: string, url: string): Promise<ScrapedProduct | null> {
    try {
        let price = 'N/A';
        let image = 'N/A';
        let description = '';
        let name = '';

        // Extract name
        try {
            name = await page.title() || 'Unknown Product';
        } catch {
            name = 'Unknown Product';
        }

        // Extract price with multiple strategies
        try {
            if (site.toLowerCase() === 'amazon') {
                const priceSelectors = [
                    '#corePrice_feature_div .a-offscreen',
                    '.a-price .a-offscreen',
                    '#priceblock_ourprice',
                    '.a-price-whole',
                    '[data-a-color="price"]'
                ];
                
                for (const selector of priceSelectors) {
                    try {
                        await page.waitForSelector(selector, { timeout: 5000 });
                        price = await page.$eval(selector, el => el.textContent?.trim() || 'N/A');
                        if (price !== 'N/A') break;
                    } catch {}
                }
            } else if (site === 'target') {
                const genericSelectors = [
                    '[class*="price"]',
                    '[data-test="product-price"]',
                    '.price',
                    '[data-price]'
                ];
                
                for (const selector of genericSelectors) {
                    try {
                        await page.waitForSelector(selector, { timeout: 5000 });
                        price = await page.$eval(selector, el => el.textContent?.trim() || 'N/A');
                        if (price !== 'N/A') break;
                    } catch {}
                }
            } else if (site === 'iherb') {
                // iHerb-specific price extraction
                try {
                    const priceMatch = await page.evaluate(() => {
                        const html = document.documentElement.outerHTML;
                        const match = html.match(/\$(\d+\.?\d*)/);
                        return match ? `$${match[1]}` : 'N/A';
                    });
                    price = priceMatch;
                } catch {}
            } else if (site === 'vitacost') {
                // Vitacost-specific price extraction with multiple patterns
                const vitacostSelectors = [
                    'p[class*="pRetailPrice"][class*="pOurPrice"]',
                    '[class*="price"]',
                    'p:contains("Our price:")'
                ];
                
                for (const selector of vitacostSelectors) {
                    try {
                        if (selector.includes('contains')) {
                            // Handle text-based selector
                            const priceMatch = await page.evaluate(() => {
                                const html = document.documentElement.outerHTML;
                                const match = html.match(/Our price:\s*\$([\d,]+\.?\d*)/i);
                                return match ? `$${match[1]}` : 'N/A';
                            });
                            if (priceMatch !== 'N/A') {
                                price = priceMatch;
                                break;
                            }
                        } else {
                            await page.waitForSelector(selector, { timeout: 5000 });
                            price = await page.$eval(selector, el => el.textContent?.trim() || 'N/A');
                            if (price !== 'N/A') break;
                        }
                    } catch {}
                }
            }
        } catch {}

        // Extract image with multiple strategies
        try {
            const imageSelectors = [
                'img[src*="images"]',
                'img[src*="product"]',
                'img[src*="amazon"]',
                '#landingImage',
                '.product-image img',
                'img'
            ];
            
            for (const selector of imageSelectors) {
                try {
                    await page.waitForSelector(selector, { timeout: 5000 });
                    image = await page.$eval(selector, (el: HTMLImageElement) => el.src || 'N/A');
                    if (image !== 'N/A') break;
                } catch {}
            }
        } catch {}

        // Extract description
        try {
            const descSelectors = [
                '[data-test="product-description"]',
                '.product-description',
                'meta[name="description"]',
                'body'
            ];
            
            for (const selector of descSelectors) {
                try {
                    if (selector === 'meta[name="description"]') {
                        description = await page.$eval(selector, el => el.getAttribute('content') || '');
                    } else {
                        description = await page.$eval(selector, el => el.textContent?.trim() || '');
                    }
                    if (description) break;
                } catch {}
            }
            
            // Limit description length
            description = description.slice(0, 300);
        } catch {}

        // Extract herb name and type from URL or page content
        const herbName = extractHerbName(url, name);
        const productType = extractProductType(url, name);

        return {
            name,
            price,
            image,
            description,
            url,
            site,
            herbName,
            productType,
            timestamp: new Date().toISOString(),
        };
        
    } catch (err) {
        console.warn(`⚠️ Failed to extract product data from ${url}:`, err);
        return null;
    }
}

function extractHerbName(url: string, title: string): string {
    const herbs = ['ashwagandha', 'echinacea', 'ginseng', 'turmeric', 'ginger', 'chamomile'];
    const lowerTitle = title.toLowerCase();
    const lowerUrl = url.toLowerCase();
    
    for (const herb of herbs) {
        if (lowerTitle.includes(herb) || lowerUrl.includes(herb)) {
            return herb;
        }
    }
    return 'unknown';
}

function extractProductType(url: string, title: string): string {
    const types = ['tincture', 'capsule', 'powder', 'tea', 'oil', 'extract'];
    const lowerTitle = title.toLowerCase();
    const lowerUrl = url.toLowerCase();
    
    for (const type of types) {
        if (lowerTitle.includes(type) || lowerUrl.includes(type)) {
            return type;
        }
    }
    return 'unknown';
}
