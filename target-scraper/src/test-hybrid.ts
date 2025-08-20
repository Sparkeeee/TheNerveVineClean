import { HerbScraper, HerbSearchRequest } from './herb-scraper-resilient.js';

(async () => {
    const scraper = new HerbScraper();
    
    // Define your scraping request here
    const searchRequest: HerbSearchRequest = {
        herbName: 'ashwagandha',
        productType: 'tincture',
        maxResults: 10,
        sites: ['target', 'amazon']
    };
    
    console.log(`🔍 Scraping request: ${searchRequest.herbName} ${searchRequest.productType}`);
    console.log(`📊 Max results: ${searchRequest.maxResults}`);
    console.log(`🌐 Sites: ${searchRequest.sites.join(', ')}`);
    
    try {
        await scraper.scrapeHerbProducts(searchRequest);
        console.log('✅ Scraping completed! Check herb-products.json for results.');
    } catch (err) {
        console.error('❌ Scraping failed:', err);
    }
})();
