import { createPlaywrightRouter } from 'crawlee';

export const router = createPlaywrightRouter();

router.addDefaultHandler(async ({ enqueueLinks, log, page }) => {
    log.info(`Processing search results page`);
    
    // Wait for products to load
    await page.waitForSelector('[data-test="product-card"]', { timeout: 10000 });
    
    // Extract product links from current page
    const productLinks = await page.$$eval('[data-test="product-card"] a[href*="/p/"]', (links) => 
        links.map(link => link.getAttribute('href'))
    );
    
    // Enqueue product detail pages
    for (const link of productLinks) {
        if (link) {
            await enqueueLinks({
                urls: [`https://www.target.com${link}`],
                label: 'product-detail',
            });
        }
    }
    
    // Enqueue next page if available
    const nextPageButton = await page.$('[data-test="pagination-next"]');
    if (nextPageButton) {
        await enqueueLinks({
            urls: [await nextPageButton.evaluate(btn => btn.getAttribute('href'))],
            label: 'detail',
        });
    }
});

router.addHandler('product-detail', async ({ request, page, log, pushData }) => {
    log.info(`Scraping product: ${request.loadedUrl}`);
    
    try {
        // Wait for product content to load
        await page.waitForSelector('[data-test="product-title"]', { timeout: 10000 });
        
        // Extract product data
        const productData = await page.evaluate(() => {
            const title = document.querySelector('[data-test="product-title"]')?.textContent?.trim();
            const price = document.querySelector('[data-test="product-price"]')?.textContent?.trim();
            const image = document.querySelector('[data-test="product-image"] img')?.getAttribute('src');
            const description = document.querySelector('[data-test="product-description"]')?.textContent?.trim();
            const rating = document.querySelector('[data-test="product-rating"]')?.textContent?.trim();
            
            return {
                title,
                price,
                image,
                description,
                rating,
                url: window.location.href,
                scrapedAt: new Date().toISOString(),
            };
        });
        
        // Save the product data
        await pushData(productData);
        log.info(`Product scraped: ${productData.title}`);
        
    } catch (error) {
        log.error(`Error scraping product: ${error}`);
    }
});

router.addHandler('detail', async ({ request, page, log, enqueueLinks }) => {
    log.info(`Processing search page: ${request.loadedUrl}`);
    
    // Wait for products to load
    await page.waitForSelector('[data-test="product-card"]', { timeout: 10000 });
    
    // Extract product links from current page
    const productLinks = await page.$$eval('[data-test="product-card"] a[href*="/p/"]', (links) => 
        links.map(link => link.getAttribute('href'))
    );
    
    // Enqueue product detail pages
    for (const link of productLinks) {
        if (link) {
            await enqueueLinks({
                urls: [`https://www.target.com${link}`],
                label: 'product-detail',
            });
        }
    }
    
    // Enqueue next page if available
    const nextPageButton = await page.$('[data-test="pagination-next"]');
    if (nextPageButton) {
        await enqueueLinks({
            urls: [await nextPageButton.evaluate(btn => btn.getAttribute('href'))],
            label: 'detail',
        });
    }
});
