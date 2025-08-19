// Debug version to see what's actually in the sitemaps

const fs = require('fs').promises;

async function debugSitemaps() {
    console.log('🔍 Debugging Vitacost sitemaps...\n');
    
    const roots = [
        'https://www.vitacost.com/Sitemap.Index.xml.gz',
        'https://www.vitacost.com/blog/sitemap.xml',
    ];

    for (const root of roots) {
        try {
            console.log(`📄 Fetching: ${root}`);
            const res = await fetch(root);
            const buf = await res.arrayBuffer();

            // handle .gz vs .xml
            let text;
            if (root.endsWith('.gz')) {
                const { gunzipSync } = require('zlib');
                text = gunzipSync(Buffer.from(buf)).toString('utf8');
            } else {
                text = Buffer.from(buf).toString('utf8');
            }

            console.log(`📏 Raw content length: ${text.length} characters`);
            console.log(`📋 First 500 characters:`);
            console.log(text.substring(0, 500));
            console.log('\n🔍 Looking for <loc> tags...');

            // Extract all <loc> tags
            const locMatches = text.match(/<loc>(.*?)<\/loc>/g);
            if (locMatches) {
                console.log(`✅ Found ${locMatches.length} <loc> tags:`);
                locMatches.forEach((match, i) => {
                    const url = match.replace(/<loc>/, '').replace(/<\/loc>/, '');
                    console.log(`  ${i + 1}. ${url}`);
                });
            } else {
                console.log('❌ No <loc> tags found');
            }

            // Look for other patterns
            console.log('\n🔍 Looking for other URL patterns...');
            const urlPatterns = [
                /https?:\/\/[^\s<>"']+/g,
                /href=["']([^"']+)["']/g,
                /url["']([^"']+)["']/g
            ];

            urlPatterns.forEach((pattern, i) => {
                const matches = text.match(pattern);
                if (matches) {
                    console.log(`Pattern ${i + 1}: Found ${matches.length} matches`);
                    matches.slice(0, 5).forEach(match => {
                        console.log(`  ${match}`);
                    });
                }
            });

            // Save raw content for manual inspection
            const filename = `sitemap-debug-${root.replace(/[^a-zA-Z0-9]/g, '-')}.xml`;
            await fs.writeFile(filename, text);
            console.log(`💾 Raw sitemap saved to: ${filename}`);

        } catch (error) {
            console.error(`❌ Failed to fetch ${root}: ${error.message}`);
        }
        
        console.log('\n' + '='.repeat(80) + '\n');
    }
}

// Run debug
debugSitemaps().catch(console.error);
