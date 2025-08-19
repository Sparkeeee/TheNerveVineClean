import { ConfigDrivenTargetScraper } from '../scrapers/target-scraper';

async function testTargetOnly() {
    console.log('🔍 Testing Target Extractor Only');
    
    try {
        const searchTerm = 'magnesium glycinate';
        
        console.log(`\n🌐 Testing Target for "${searchTerm}"`);
        
        // Use our working scraper
        const scraper = new ConfigDrivenTargetScraper();
        await scraper.loadConfig();
        
        // Test with the search term that we know works
        const results = await scraper.scrapeProducts(searchTerm);
        
        console.log(`🎯 Target total unique URLs extracted: ${results.urls.length}`);
        if (results.urls.length === 0) {
            console.log('⚠️ No URLs found for Target');
        } else {
            console.log('✅ URLs found for Target');
            results.urls.slice(0, 5).forEach((url, index) => {
                console.log(`  ${index + 1}. ${url}`);
            });
        }
        
    } catch (err) {
        console.error('❌ Error testing Target:', err);
    }
    
    console.log('\n🎬 Target test complete!');
}

testTargetOnly().catch(console.error);
