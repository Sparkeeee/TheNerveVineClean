import { extractAmazonUrls } from '../extractors/amazon/extractor';

async function testAmazonOnly() {
    console.log('🔍 Testing Amazon Extractor Only');
    
    try {
        const searchTerm = 'magnesium glycinate';
        
        console.log(`\n🌐 Testing Amazon for "${searchTerm}"`);
        
        const urls = await extractAmazonUrls(searchTerm);
        
        if (!urls.length) {
            console.log('⚠️ No URLs found for Amazon');
        } else {
            console.log(`✅ ${urls.length} URLs found (showing first 10):`);
            urls.slice(0, 10).forEach((url, idx) => console.log(`   ${idx + 1}. ${url}`));
        }
        
    } catch (err) {
        console.error('❌ Error testing Amazon:', err);
    }
    
    console.log('\n🎬 Amazon test complete!');
}

testAmazonOnly().catch(console.error);
