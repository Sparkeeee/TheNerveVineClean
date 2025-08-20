// Debug Gaia Herbs Sitemap
// Let's see what's actually in their sitemap

const fetch = require('node-fetch');

async function debugGaiaSitemap() {
    console.log('🔍 Debugging Gaia Herbs Sitemap...\n');
    
    try {
        const sitemapUrl = 'https://www.gaiaherbs.com/sitemap.xml';
        console.log(`📥 Fetching: ${sitemapUrl}`);
        
        const response = await fetch(sitemapUrl);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const xml = await response.text();
        console.log(`📄 XML Length: ${xml.length} characters`);
        console.log(`📄 Raw XML Content:`);
        console.log('─'.repeat(50));
        console.log(xml);
        console.log('─'.repeat(50));
        
        // Check if it's a sitemap index
        if (xml.includes('<sitemapindex>')) {
            console.log('\n🔍 This is a sitemap index!');
            
            // Extract sitemap URLs
            const sitemapMatches = xml.match(/<loc>(.*?)<\/loc>/g);
            if (sitemapMatches) {
                console.log('\n📋 Sitemap URLs found:');
                sitemapMatches.forEach((match, i) => {
                    const url = match.replace(/<loc>/, '').replace(/<\/loc>/, '');
                    console.log(`  ${i + 1}. ${url}`);
                });
                
                // Check the first sitemap
                if (sitemapMatches.length > 0) {
                    const firstSitemap = sitemapMatches[0].replace(/<loc>/, '').replace(/<\/loc>/, '');
                    console.log(`\n🔍 Checking first sitemap: ${firstSitemap}`);
                    
                    const sitemapResponse = await fetch(firstSitemap);
                    if (sitemapResponse.ok) {
                        const sitemapXml = await sitemapResponse.text();
                        console.log(`📄 First sitemap length: ${sitemapXml.length} characters`);
                        
                        // Look for product URLs
                        const productMatches = sitemapXml.match(/<loc>(.*?)<\/loc>/g);
                        if (productMatches) {
                            console.log(`🔗 Found ${productMatches.length} URLs in first sitemap`);
                            
                            // Show first few URLs
                            console.log('\n📋 First few URLs:');
                            productMatches.slice(0, 10).forEach((match, i) => {
                                const url = match.replace(/<loc>/, '').replace(/<\/loc>/, '');
                                console.log(`  ${i + 1}. ${url}`);
                            });
                            
                            // Check for product patterns
                            const productUrls = productMatches
                                .map(match => match.replace(/<loc>/, '').replace(/<\/loc>/, ''))
                                .filter(url => url.includes('/products/') || url.includes('/product/'));
                            
                            console.log(`\n🛍️ Product URLs found: ${productUrls.length}`);
                            if (productUrls.length > 0) {
                                console.log('📋 Product URLs:');
                                productUrls.slice(0, 5).forEach((url, i) => {
                                    console.log(`  ${i + 1}. ${url}`);
                                });
                            }
                        }
                    } else {
                        console.log(`❌ Failed to fetch first sitemap: ${sitemapResponse.status}`);
                    }
                }
            }
        } else {
            console.log('\n🔍 This appears to be a regular sitemap (not an index)');
            
            // Extract all URLs
            const urlMatches = xml.match(/<loc>(.*?)<\/loc>/g);
            if (urlMatches) {
                console.log(`\n🔗 All URLs found: ${urlMatches.length}`);
                urlMatches.forEach((match, i) => {
                    const url = match.replace(/<loc>/, '').replace(/<\/loc>/, '');
                    console.log(`  ${i + 1}. ${url}`);
                });
            }
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

debugGaiaSitemap().catch(console.error);
