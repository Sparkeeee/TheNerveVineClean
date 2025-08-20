// Check Wise Woman Herbals Structure
// Let's see what they provide in robots.txt and sitemaps before building the scraper

const fetch = require('node-fetch');

async function checkWiseWomanStructure() {
    console.log('🔍 Checking Wise Woman Herbals structure...\n');
    
    const baseUrl = 'https://wisewomanherbals.com';
    
    try {
        // Check robots.txt first
        console.log('📋 Checking robots.txt...');
        const robotsResponse = await fetch(`${baseUrl}/robots.txt`);
        if (robotsResponse.ok) {
            const robotsText = await robotsResponse.text();
            console.log('✅ Robots.txt found:');
            console.log('─'.repeat(50));
            console.log(robotsText);
            console.log('─'.repeat(50));
            
            // Look for sitemap references
            const sitemapMatches = robotsText.match(/sitemap:\s*(.*)/gi);
            if (sitemapMatches) {
                console.log('\n🔗 Sitemaps found in robots.txt:');
                sitemapMatches.forEach((match, i) => {
                    console.log(`  ${i + 1}. ${match.trim()}`);
                });
            }
        } else {
            console.log('❌ No robots.txt found');
        }
        
        // Check for common sitemap locations
        console.log('\n🔍 Checking common sitemap locations...');
        const commonSitemaps = [
            '/sitemap.xml',
            '/sitemap_index.xml',
            '/sitemap/sitemap.xml',
            '/sitemap_products.xml',
            '/sitemap_categories.xml'
        ];
        
        for (const sitemap of commonSitemaps) {
            try {
                const sitemapResponse = await fetch(`${baseUrl}${sitemap}`);
                if (sitemapResponse.ok) {
                    const xml = await sitemapResponse.text();
                    console.log(`✅ Found sitemap: ${sitemap} (${xml.length} characters)`);
                    
                    // Check if it's a sitemap index
                    if (xml.includes('<sitemapindex>')) {
                        console.log('  📋 This is a sitemap index!');
                        
                        // Extract sub-sitemap URLs
                        const subSitemapMatches = xml.match(/<loc>(.*?)<\/loc>/g);
                        if (subSitemapMatches) {
                            console.log(`  🔗 Found ${subSitemapMatches.length} sub-sitemaps`);
                            subSitemapMatches.slice(0, 3).forEach((match, i) => {
                                const url = match.replace(/<loc>/, '').replace(/<\/loc>/, '');
                                console.log(`    ${i + 1}. ${url}`);
                            });
                        }
                    } else {
                        // Regular sitemap - count URLs
                        const urlMatches = xml.match(/<loc>(.*?)<\/loc>/g);
                        if (urlMatches) {
                            console.log(`  🔗 Found ${urlMatches.length} URLs`);
                            
                            // Show first few URLs
                            urlMatches.slice(0, 3).forEach((match, i) => {
                                const url = match.replace(/<loc>/, '').replace(/<\/loc>/, '');
                                console.log(`    ${i + 1}. ${url}`);
                            });
                        }
                    }
                } else {
                    console.log(`❌ No sitemap at: ${sitemap}`);
                }
            } catch (error) {
                console.log(`⚠️ Error checking ${sitemap}: ${error.message}`);
            }
        }
        
        // Check their main page structure
        console.log('\n🌐 Checking main page structure...');
        try {
            const mainPageResponse = await fetch(baseUrl);
            if (mainPageResponse.ok) {
                const html = await mainPageResponse.text();
                console.log(`✅ Main page accessible (${html.length} characters)`);
                
                // Look for product-related patterns
                if (html.includes('/products/') || html.includes('/product/')) {
                    console.log('  🛍️ Product URLs detected in main page');
                }
                if (html.includes('shop') || html.includes('store')) {
                    console.log('  🏪 Shop/store references found');
                }
            }
        } catch (error) {
            console.log(`⚠️ Error checking main page: ${error.message}`);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkWiseWomanStructure().catch(console.error);
