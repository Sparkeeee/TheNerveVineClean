// Simple test to see what's in the Vitacost sitemap

const { gunzipSync } = require('zlib');

async function testSitemap() {
    try {
        console.log('🔍 Testing Vitacost sitemap...');
        
        const sitemapUrl = 'https://www.vitacost.com/Sitemap.Index.xml.gz';
        console.log(`📄 Fetching: ${sitemapUrl}`);
        
        const res = await fetch(sitemapUrl);
        if (!res.ok) {
            console.error(`❌ HTTP ${res.status}: ${res.statusText}`);
            return;
        }
        
        const buf = await res.arrayBuffer();
        console.log(`📏 Response size: ${buf.byteLength} bytes`);
        
        // Try to decompress
        let xml;
        try {
            xml = gunzipSync(Buffer.from(buf)).toString('utf8');
            console.log('✅ Successfully decompressed gzip');
        } catch (error) {
            console.log('❌ Failed to decompress, treating as plain text');
            xml = Buffer.from(buf).toString('utf8');
        }
        
        console.log(`📋 Content length: ${xml.length} characters`);
        console.log(`📋 First 1000 characters:`);
        console.log(xml.substring(0, 1000));
        
        // Look for URLs
        console.log('\n🔍 Looking for URLs...');
        const urlMatches = xml.match(/https?:\/\/[^\s<>"']+/g);
        if (urlMatches) {
            console.log(`✅ Found ${urlMatches.length} URLs:`);
            urlMatches.slice(0, 10).forEach((url, i) => {
                console.log(`  ${i + 1}. ${url}`);
            });
        } else {
            console.log('❌ No URLs found');
        }
        
        // Look for sitemap references
        console.log('\n🔍 Looking for sitemap references...');
        const sitemapMatches = xml.match(/<sitemap>.*?<loc>(.*?)<\/loc>.*?<\/sitemap>/gs);
        if (sitemapMatches) {
            console.log(`✅ Found ${sitemapMatches.length} sitemap references:`);
            sitemapMatches.forEach((match, i) => {
                const loc = match.match(/<loc>(.*?)<\/loc>/);
                if (loc) {
                    console.log(`  ${i + 1}. ${loc[1]}`);
                }
            });
        } else {
            console.log('❌ No sitemap references found');
        }
        
        // Save raw content
        const fs = require('fs').promises;
        await fs.writeFile('sitemap-raw.xml', xml);
        console.log('💾 Raw sitemap saved to sitemap-raw.xml');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testSitemap().catch(console.error);
