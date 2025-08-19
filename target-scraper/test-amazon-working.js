// Test Amazon Working Scraper - Isolated Testing
// Tests the actual working amazon-ultra-simple logic

const fetch = require('node-fetch');

async function testAmazonWorking() {
    console.log('🚀 Testing Amazon Working Scraper Logic...\n');
    
    const testUrl = 'https://www.amazon.com/dp/B08N5WRWNW'; // Example product
    
    try {
        console.log(`🔍 Testing URL: ${testUrl}`);
        
        // Extract ASIN from URL (same logic as working scraper)
        const asinMatch = testUrl.match(/\/dp\/([A-Z0-9]{10})/);
        const asin = asinMatch ? asinMatch[1] : null;
        
        if (!asin) {
            throw new Error('Could not extract ASIN from URL');
        }

        console.log(`📦 ASIN extracted: ${asin}`);

        // Use the working approach from amazon-ultra-simple
        const response = await fetch(testUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'DNT': '1',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const html = await response.text();
        console.log(`✅ HTML fetched successfully, length: ${html.length} characters`);

        // Extract data using the working logic
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        let title = titleMatch ? titleMatch[1].trim() : 'Product name not found';
        
        // Clean up title (same as working scraper)
        if (title.includes('Amazon.com')) {
            title = title.replace(/Amazon\.com[:\s]*/, '').trim();
        }

        // Extract price using working selectors
        let price = 'Price not found';
        const amazonPriceSelectors = [
            /<span[^>]*class="[^"]*a-price-whole[^"]*"[^>]*>([^<]+)<\/span>/gi,
            /<span[^>]*class="[^"]*a-price-fraction[^"]*"[^>]*>([^<]+)<\/span>/gi,
            /<span[^>]*class="[^"]*a-price[^"]*"[^>]*>([^<]+)<\/span>/gi
        ];

        for (const selector of amazonPriceSelectors) {
            const matches = html.match(selector);
            if (matches && matches.length > 0) {
                for (const match of matches) {
                    const contentMatch = match.match(/>([^<]+)</);
                    if (contentMatch) {
                        const content = contentMatch[1].trim();
                        const priceMatches = content.match(/\$[\d,]+\.?\d*/g);
                        if (priceMatches && priceMatches.length > 0) {
                            price = priceMatches[0];
                            break;
                        }
                    }
                }
                if (price !== 'Price not found') break;
            }
        }

        // Extract image using working logic
        let image = '';
        const productImageSelectors = [
            /data-old-hires="([^"]*\.(?:jpg|jpeg|png|webp))"/gi,
            /data-a-dynamic-image="([^"]*\.(?:jpg|jpeg|png|webp))"/gi
        ];

        for (const selector of productImageSelectors) {
            const matches = html.match(selector);
            if (matches && matches.length > 0) {
                const valueMatch = matches[0].match(/"([^"]+)"/);
                if (valueMatch) {
                    const imageUrl = valueMatch[1];
                    if (imageUrl.includes('media-amazon.com') && imageUrl.length > 50) {
                        image = imageUrl;
                        break;
                    }
                }
            }
        }

        // Extract description using working logic
        let description = 'Description not found';
        const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) || 
                         html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i);
        if (descMatch) {
            description = descMatch[1];
        }

        // Extract availability using working logic
        let availability = 'Availability unknown';
        if (html.includes('in stock') || html.includes('In Stock')) {
            availability = 'In Stock';
        } else if (html.includes('out of stock') || html.includes('Out of Stock')) {
            availability = 'Out of Stock';
        } else if (html.includes('temporarily out of stock')) {
            availability = 'Temporarily Out of Stock';
        } else if (html.includes('available')) {
            availability = 'Available';
        }

        // Display results
        console.log('\n📊 SCRAPING RESULTS:');
        console.log(`📦 Product: ${title}`);
        console.log(`💰 Price: ${price}`);
        console.log(`🖼️ Image: ${image ? 'Found' : 'Not found'}`);
        console.log(`📝 Description: ${description !== 'Description not found' ? 'Found' : 'Not found'}`);
        console.log(`📦 Availability: ${availability}`);
        console.log(`🔗 URL: ${testUrl}`);
        console.log(`🏷️ ASIN: ${asin}`);

        // Save results
        const result = {
            name: title,
            price: price,
            image: image,
            description: description,
            availability: availability,
            url: testUrl,
            asin: asin,
            method: 'Working Amazon Ultra Simple',
            scrapedAt: new Date().toISOString()
        };

        const fs = require('fs');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `amazon-working-test-${timestamp}.json`;
        fs.writeFileSync(filename, JSON.stringify(result, null, 2));
        console.log(`\n💾 Results saved to: ${filename}`);

        return result;

    } catch (error) {
        console.error(`❌ Test failed: ${error.message}`);
        return null;
    }
}

// Run the test
testAmazonWorking().catch(console.error);
