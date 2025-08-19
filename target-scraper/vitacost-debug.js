const puppeteer = require('puppeteer');

async function debugVitacostPage() {
    console.log('🔍 Debugging Vitacost page structure...');
    
    const browser = await puppeteer.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    try {
        // Navigate to Vitacost search
        const searchUrl = 'https://www.vitacost.com/search?search=kava';
        console.log(`🌐 Navigating to: ${searchUrl}`);
        
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(5000); // Wait for content to load
        
        console.log('📄 Page loaded, analyzing structure...');
        
        // Check page title and URL
        const title = await page.title();
        const currentUrl = page.url();
        console.log(`📄 Page title: ${title}`);
        console.log(`🔗 Current URL: ${currentUrl}`);
        
        // Check for common product selectors
        const selectorsToTest = [
            'a[href*="/product/"]',
            'a[href*="/p/"]',
            '.product-tile',
            '.product-item',
            '.search-result',
            '[data-testid*="product"]',
            '.product-link',
            '.product-title a',
            'a[href*="product"]',
            'a[href*="supplement"]'
        ];
        
        console.log('\n🔍 Testing selectors:');
        for (const selector of selectorsToTest) {
            try {
                const count = await page.evaluate((sel) => {
                    return document.querySelectorAll(sel).length;
                }, selector);
                console.log(`  ${selector}: ${count} elements found`);
                
                if (count > 0) {
                    // Show some examples
                    const examples = await page.evaluate((sel) => {
                        const elements = document.querySelectorAll(sel);
                        return Array.from(elements).slice(0, 3).map(el => {
                            const href = el.getAttribute('href') || el.href;
                            const text = el.textContent?.trim() || 'No text';
                            return { href, text: text.substring(0, 50) };
                        });
                    }, selector);
                    
                    console.log(`    Examples:`);
                    examples.forEach((ex, i) => {
                        console.log(`      ${i + 1}. ${ex.text} -> ${ex.href}`);
                    });
                }
            } catch (error) {
                console.log(`  ${selector}: Error - ${error.message}`);
            }
        }
        
        // Check for any links at all
        const allLinks = await page.evaluate(() => {
            const links = document.querySelectorAll('a[href]');
            return Array.from(links).slice(0, 10).map(link => ({
                href: link.getAttribute('href'),
                text: link.textContent?.trim().substring(0, 30) || 'No text'
            }));
        });
        
        console.log('\n🔗 First 10 links on page:');
        allLinks.forEach((link, i) => {
            console.log(`  ${i + 1}. ${link.text} -> ${link.href}`);
        });
        
        // Check page content for clues
        const pageContent = await page.content();
        console.log('\n📝 Page content analysis:');
        console.log(`  Total HTML length: ${pageContent.length} characters`);
        
        // Look for common patterns
        const patterns = [
            'product',
            'supplement',
            'search',
            'result',
            'item',
            'tile'
        ];
        
        patterns.forEach(pattern => {
            const count = (pageContent.match(new RegExp(pattern, 'gi')) || []).length;
            console.log(`  "${pattern}" appears ${count} times`);
        });
        
        // Check if we're on a different page than expected
        if (pageContent.includes('no results') || pageContent.includes('no matches')) {
            console.log('⚠️ Page shows "no results" - search might not be working');
        }
        
        if (pageContent.includes('captcha') || pageContent.includes('security')) {
            console.log('⚠️ Page shows security/captcha - might be blocked');
        }
        
        console.log('\n✅ Debug complete! Check the browser window to see the actual page.');
        
    } catch (error) {
        console.error('❌ Error during debug:', error.message);
    }
    
    // Keep browser open for manual inspection
    console.log('\n🔄 Browser will stay open for manual inspection...');
    console.log('Press Ctrl+C in terminal to close when done.');
}

debugVitacostPage().catch(console.error);
