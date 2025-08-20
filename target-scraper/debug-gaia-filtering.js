// Debug Gaia Herbs URL filtering
// Let's see what URLs we're actually getting and why St. John's Wort filtering isn't working

const fetch = require('node-fetch');

async function debugGaiaFiltering() {
    console.log('🔍 Debugging Gaia Herbs URL filtering...\n');
    
    try {
        const indexUrl = "https://www.gaiaherbs.com/sitemap.xml";
        console.log(`📥 Fetching Gaia sitemap index: ${indexUrl}`);
        
        const res = await fetch(indexUrl);
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        const xml = await res.text();
        
        // Parse XML to extract sub-sitemap URLs
        const submaps = extractSitemapIndexUrls(xml);
        console.log(`🔗 Found ${submaps.length} sub-sitemaps in index`);
        
        const allUrls = [];
        
        for (const sm of submaps) {
            try {
                console.log(`📄 Fetching child sitemap: ${sm}`);
                const subRes = await fetch(sm);
                if (!subRes.ok) {
                    console.log(`⚠️ Skipped ${sm}: status ${subRes.status}`);
                    continue;
                }
                const subXml = await subRes.text();
                const urls = extractSitemapUrls(subXml);
                allUrls.push(...urls);
                console.log(`🔗 Found ${urls.length} URLs in ${sm}`);
            } catch (err) {
                console.log(`⚠️ Error processing ${sm}: ${err.message}`);
            }
        }
        
        // Keep only product pages
        let productUrls = [...new Set(allUrls)].filter((u) =>
            /^https:\/\/www\.gaiaherbs\.com\/products\//i.test(u)
        );
        
        console.log(`\n📦 Total product URLs found: ${productUrls.length}`);
        
        // Show ALL product URLs to see what we're working with
        console.log('\n📋 ALL Product URLs:');
        productUrls.forEach((url, i) => {
            console.log(`  ${i + 1}. ${url}`);
        });
        
        // Now try the St. John's Wort filtering
        const targetHerbs = ["st johns wort", "st. johns wort", "st john's wort", "st. john's wort", "hypericum", "johns wort"];
        console.log(`\n🔍 Filtering for target herbs: ${targetHerbs.join(', ')}`);
        
        const filteredUrls = productUrls.filter(url => {
            const urlLower = url.toLowerCase();
            const matches = targetHerbs.some(herb => urlLower.includes(herb.toLowerCase()));
            if (matches) {
                console.log(`✅ MATCH: ${url}`);
            }
            return matches;
        });
        
        console.log(`\n🎯 St. John's Wort products found: ${filteredUrls.length}`);
        
        if (filteredUrls.length === 0) {
            console.log('\n❌ No St. John's Wort products found. Let\'s check for similar patterns:');
            
            // Look for any URLs that might contain related terms
            const relatedTerms = ['wort', 'hypericum', 'st', 'john'];
            const relatedUrls = productUrls.filter(url => {
                const urlLower = url.toLowerCase();
                return relatedTerms.some(term => urlLower.includes(term));
            });
            
            if (relatedUrls.length > 0) {
                console.log(`\n🔍 Found ${relatedUrls.length} URLs with related terms:`);
                relatedUrls.forEach((url, i) => {
                    console.log(`  ${i + 1}. ${url}`);
                });
            }
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

function extractSitemapIndexUrls(xmlString) {
    const urls = [];
    
    // Extract sitemap URLs from sitemap index XML
    const sitemapMatches = xmlString.match(/<sitemap>\s*<loc>(.*?)<\/loc>\s*<\/sitemap>/g);
    if (sitemapMatches) {
        sitemapMatches.forEach(match => {
            const url = match.match(/<loc>(.*?)<\/loc>/)?.[1];
            if (url && url.startsWith('http')) {
                urls.push(url);
            }
        });
    }
    
    return urls;
}

function extractSitemapUrls(xmlString) {
    const urls = [];
    
    // Extract URLs from regular sitemap XML using regex
    const urlMatches = xmlString.match(/<loc>(.*?)<\/loc>/g);
    if (urlMatches) {
        urlMatches.forEach(match => {
            const url = match.replace(/<loc>/, '').replace(/<\/loc>/, '');
            if (url && url.startsWith('http')) {
                urls.push(url);
            }
        });
    }
    
    return urls;
}

debugGaiaFiltering().catch(console.error);
