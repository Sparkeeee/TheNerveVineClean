import { chromium, Page } from 'playwright';
import { extractAmazonUrls } from '../extractors/amazon/extractor';
import { extractTargetUrls } from '../extractors/target/extractor';
import { extractIherbUrls } from '../extractors/iherb/extractor';
import { extractVitacostUrls } from '../extractors/vitacost/extractor';

interface TestRequest {
    herb: string;
    type: string;
    site: string;
}

const testRequests: TestRequest[] = [
    { herb: 'ashwagandha', type: 'tincture', site: 'amazon' },
    { herb: 'ashwagandha', type: 'tincture', site: 'target' },
    { herb: 'ashwagandha', type: 'tincture', site: 'iherb' },
    { herb: 'ashwagandha', type: 'tincture', site: 'vitacost' },
];

async function runDiagnostic() {
    const browser = await chromium.launch({ headless: false, slowMo: 100 });
    const page = await browser.newPage();

    for (const req of testRequests) {
        console.log(`\n🌐 Testing ${req.site.toUpperCase()} for "${req.herb} ${req.type}"`);

        try {
            let searchUrl = '';
            if (req.site === 'amazon') searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(req.herb + ' ' + req.type)}`;
            if (req.site === 'target') searchUrl = `https://www.target.com/s?searchTerm=${encodeURIComponent(req.herb + ' ' + req.type)}`;
            if (req.site === 'iherb') searchUrl = `https://www.iherb.com/search?kw=${encodeURIComponent(req.herb + ' ' + req.type)}`;
            if (req.site === 'vitacost') searchUrl = `https://www.vitacost.com/search?search=${encodeURIComponent(req.herb + ' ' + req.type)}`;

            await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
            await page.waitForTimeout(2000); // stabilize page

            let urls: string[] = [];
            if (req.site === 'amazon') urls = await extractAmazonUrls(page, req.herb, req.type);
            if (req.site === 'target') urls = await extractTargetUrls(page, req.herb, req.type);
            if (req.site === 'iherb') urls = await extractIherbUrls(page, req.herb, req.type);
            if (req.site === 'vitacost') urls = await extractVitacostUrls(page, req.herb, req.type);

            if (!urls.length) {
                console.log(`⚠️ No URLs found for ${req.site}`);
            } else {
                console.log(`✅ ${urls.length} URLs found (showing first 5):`);
                urls.slice(0, 5).forEach((url, idx) => console.log(`   ${idx + 1}. ${url}`));
            }
        } catch (err) {
            console.error(`❌ Error testing ${req.site}:`, err);
        }
    }

    await browser.close();
    console.log('\n🎬 Diagnostic run complete!');
}

runDiagnostic().catch(console.error);
