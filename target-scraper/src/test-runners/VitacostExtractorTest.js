// Test script for Vitacost scraper with debugging
const VitacostSupplementScraper = require('../../vitacost-crawlee-scraper');
const { log } = require('crawlee');

async function testScraper() {
    // Enable debug logging
    log.setLevel(log.LEVELS.DEBUG);

    const scraper = new VitacostSupplementScraper({
        browser: 'puppeteer',
        headless: false, // Set to false for debugging
        maxConcurrency: 1, // Reduced for debugging
        requestDelay: 2000 // Increased delay
    });

    try {
        console.log('🧪 Testing Vitacost scraper with single supplement...\n');

        // Test with just one supplement first
        const testSupplement = 'kava kava';
        
        console.log(`Testing with: ${testSupplement}`);
        
        const results = await scraper.scrapeSupplements([testSupplement], {
            includeProductDetails: false,
            maxPagesPerSupplement: 1 // Just test first page
        });

        console.log('\n=== TEST RESULTS ===');
        for (const [supplement, products] of Object.entries(results)) {
            console.log(`${supplement}: ${products.length} products found`);
            
            if (products.length > 0) {
                console.log('Sample products:');
                products.slice(0, 3).forEach((product, index) => {
                    console.log(`  ${index + 1}. ${product.name}`);
                    console.log(`     URL: ${product.url}`);
                });
            } else {
                console.log('⚠️  No products found - this indicates a scraping issue');
            }
        }

        if (Object.values(results).some(products => products.length > 0)) {
            console.log('\n✅ Scraper is working! Running full batch...');
            
            // If test passed, run the full batch
            const fullSupplements = [
                'kava kava',
                'ashwagandha', 
                'turmeric curcumin',
                'vitamin d3',
                'omega 3 fish oil'
            ];

            const fullResults = await scraper.scrapeSupplements(fullSupplements, {
                includeProductDetails: false,
                maxPagesPerSupplement: 3
            });

            // Export results
            await scraper.exportResults('json');
            await scraper.exportResults('csv');

            console.log('\n=== FULL RESULTS ===');
            let totalProducts = 0;
            for (const [supplement, products] of Object.entries(fullResults)) {
                console.log(`${supplement}: ${products.length} products`);
                totalProducts += products.length;
            }
            console.log(`\nTotal products found: ${totalProducts}`);
        } else {
            console.log('\n❌ Test failed - no products found');
            console.log('This could be due to:');
            console.log('1. Vitacost blocking automated requests');
            console.log('2. Changed page structure');
            console.log('3. Network issues');
            console.log('4. Need to solve CAPTCHA or other challenges');
        }

    } catch (error) {
        console.error('❌ Scraper failed:', error.message);
        console.error('Stack trace:', error.stack);
    } finally {
        await scraper.close();
    }
}

// Alternative manual test function
async function manualTest() {
    console.log('🔧 Running manual test...');
    
    const scraper = new VitacostSupplementScraper({
        browser: 'puppeteer',
        headless: false, // Show browser for manual inspection
        maxConcurrency: 1,
        requestDelay: 5000 // Give time to inspect
    });

    try {
        // Just navigate to a known product category page
        const categoryUrls = [
            'https://www.vitacost.com/kava-kava',
            'https://www.vitacost.com/ashwagandha',
            'https://www.vitacost.com/turmeric',
            'https://www.vitacost.com/vitamin-d',
            'https://www.vitacost.com/omega-3'
        ];

        console.log('Testing category pages...');
        // This will help us see what the actual page structure looks like
        
    } catch (error) {
        console.error('Manual test failed:', error);
    } finally {
        await scraper.close();
    }
}

// Check if we should run manual test based on command line args
if (process.argv.includes('--manual')) {
    manualTest().catch(console.error);
} else {
    testScraper().catch(console.error);
}
