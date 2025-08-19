// Amazon Standalone Scraper - Isolated Testing
// Based on the working amazon-ultra-simple scraper

const fetch = require('node-fetch');

class AmazonStandaloneScraper {
    constructor() {
        this.results = [];
    }

    async scrapeProduct(url) {
        console.log(`🔍 Scraping Amazon product: ${url}`);
        
        try {
            // Extract ASIN from URL
            const asinMatch = url.match(/\/dp\/([A-Z0-9]{10})/);
            const asin = asinMatch ? asinMatch[1] : null;
            
            if (!asin) {
                throw new Error('Could not extract ASIN from URL');
            }

            console.log(`📦 ASIN extracted: ${asin}`);

            // Try multiple user agents and approaches
            const approaches = [
                {
                    name: 'Mobile Safari',
                    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1.2 Mobile/15E148 Safari/604.1',
                    headers: {
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                        'Accept-Language': 'en-US,en;q=0.5',
                        'Accept-Encoding': 'gzip, deflate, br',
                        'DNT': '1',
                        'Connection': 'keep-alive',
                        'Upgrade-Insecure-Requests': '1'
                    }
                },
                {
                    name: 'Desktop Chrome',
                    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    headers: {
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                        'Accept-Language': 'en-US,en;q=0.5',
                        'Accept-Encoding': 'gzip, deflate, br',
                        'DNT': '1',
                        'Connection': 'keep-alive',
                        'Upgrade-Insecure-Requests': '1'
                    }
                },
                {
                    name: 'Clean ASIN URL',
                    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    headers: {
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                        'Accept-Language': 'en-US,en;q=0.5',
                        'Accept-Encoding': 'gzip, deflate, br',
                        'DNT': '1',
                        'Connection': 'keep-alive',
                        'Upgrade-Insecure-Requests': '1'
                    },
                    url: `https://www.amazon.com/dp/${asin}`
                }
            ];

            let html = '';
            let successfulApproach = '';

            // Try each approach
            for (const approach of approaches) {
                try {
                    console.log(`🔄 Trying approach: ${approach.name}`);
                    
                    const targetUrl = approach.url || url;
                    const response = await fetch(targetUrl, {
                        headers: {
                            'User-Agent': approach.userAgent,
                            ...approach.headers
                        }
                    });

                    if (response.ok) {
                        html = await response.text();
                        successfulApproach = approach.name;
                        console.log(`✅ Success with ${approach.name}, HTML length: ${html.length}`);
                        break;
                    }
                } catch (error) {
                    console.log(`❌ Failed with ${approach.name}: ${error.message}`);
                    continue;
                }
            }

            if (!html) {
                throw new Error('Failed to fetch page with any approach');
            }

            // Extract product data
            const productData = this.extractProductData(html, url, asin, successfulApproach);
            
            console.log(`✅ Product scraped successfully: ${productData.name}`);
            return productData;

        } catch (error) {
            console.error(`❌ Error scraping ${url}: ${error.message}`);
            return null;
        }
    }

    extractProductData(html, url, asin, successfulApproach) {
        // Extract title
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        let title = titleMatch ? titleMatch[1].trim() : 'Product name not found';
        
        // Clean up title
        if (title.includes('Amazon.com')) {
            title = title.replace(/Amazon\.com[:\s]*/, '').trim();
        }

        // Extract price
        let price = this.extractPrice(html);
        
        // Extract image
        let image = this.extractImage(html);
        
        // Extract description
        let description = this.extractDescription(html);
        
        // Extract availability
        let availability = this.extractAvailability(html);

        return {
            name: title,
            price: price,
            image: image,
            description: description,
            availability: availability,
            url: url,
            asin: asin,
            method: 'Standalone Ultra Simple',
            successfulApproach: successfulApproach,
            scrapedAt: new Date().toISOString()
        };
    }

    extractPrice(html) {
        // Priority 1: Amazon-specific price classes
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
                            return priceMatches[0];
                        }
                    }
                }
            }
        }

        // Fallback: look for any $XX.XX pattern
        const allPriceMatches = html.match(/\$[\d,]+\.?\d*/g);
        if (allPriceMatches && allPriceMatches.length > 0) {
            return allPriceMatches[0];
        }

        return 'Price not found';
    }

    extractImage(html) {
        // Priority 1: Amazon product image data attributes
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
                        return imageUrl;
                    }
                }
            }
        }

        // Fallback: look for any media-amazon image
        const allImageMatches = html.match(/https:\/\/[^"']*media-amazon[^"']*\.(?:jpg|jpeg|png|webp)/gi);
        if (allImageMatches && allImageMatches.length > 0) {
            return allImageMatches[0];
        }

        return '';
    }

    extractDescription(html) {
        const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) || 
                         html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i);
        if (descMatch) {
            return descMatch[1];
        }
        return 'Description not found';
    }

    extractAvailability(html) {
        if (html.includes('in stock') || html.includes('In Stock')) {
            return 'In Stock';
        } else if (html.includes('out of stock') || html.includes('Out of Stock')) {
            return 'Out of Stock';
        } else if (html.includes('temporarily out of stock')) {
            return 'Temporarily Out of Stock';
        } else if (html.includes('available')) {
            return 'Available';
        }
        return 'Availability unknown';
    }

    async testWithSampleProducts() {
        console.log('🚀 Testing Amazon Standalone Scraper with sample products...\n');
        
        const testUrls = [
            'https://www.amazon.com/dp/B08N5WRWNW', // Example product
            'https://www.amazon.com/dp/B07ZPKBL9V'  // Another example
        ];

        for (const url of testUrls) {
            const result = await this.scrapeProduct(url);
            if (result) {
                this.results.push(result);
                console.log(`📊 Product: ${result.name}`);
                console.log(`💰 Price: ${result.price}`);
                console.log(`🖼️ Image: ${result.image ? 'Found' : 'Not found'}`);
                console.log(`📝 Description: ${result.description !== 'Description not found' ? 'Found' : 'Not found'}`);
                console.log(`📦 Availability: ${result.availability}`);
                console.log(`🔗 URL: ${result.url}`);
                console.log(`🏷️ ASIN: ${result.asin}`);
                console.log(`⚡ Method: ${result.method}`);
                console.log(`✅ Approach: ${result.successfulApproach}\n`);
            }
        }

        // Save results
        if (this.results.length > 0) {
            const fs = require('fs');
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `amazon-standalone-results-${timestamp}.json`;
            fs.writeFileSync(filename, JSON.stringify(this.results, null, 2));
            console.log(`💾 Results saved to: ${filename}`);
        }

        console.log(`🎯 Test complete! Successfully scraped ${this.results.length}/${testUrls.length} products`);
        return this.results;
    }
}

// Export for use as module
module.exports = AmazonStandaloneScraper;

// Run if called directly
if (require.main === module) {
    const scraper = new AmazonStandaloneScraper();
    scraper.testWithSampleProducts().catch(console.error);
}
