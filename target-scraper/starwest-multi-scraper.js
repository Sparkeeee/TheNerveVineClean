// starwest-multi-scraper.js
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
const fs = require('fs');

// Use stealth plugin to avoid detection
puppeteer.use(StealthPlugin());

// Use recaptcha plugin to handle Cloudflare challenges
puppeteer.use(
  RecaptchaPlugin({
    provider: {
      id: '2captcha',
      token: process.env.CAPTCHA_TOKEN || 'your-2captcha-token-here'
    },
    visualFeedback: true
  })
);

async function waitForCloudflare(page, maxWaitTime = 60000) {
  console.log('🔍 Checking for Cloudflare challenges...');
  
  const startTime = Date.now();
  let attempts = 0;
  
  while (Date.now() - startTime < maxWaitTime) {
    attempts++;
    console.log(`⏳ Cloudflare check attempt ${attempts}...`);
    
    try {
      // Check if we're still on Cloudflare
      const pageContent = await page.content();
      const hasCloudflare = pageContent.includes('cloudflare') || 
                           pageContent.includes('checking your browser') ||
                           pageContent.includes('verifying');
      
      if (!hasCloudflare) {
        console.log('✅ Cloudflare challenge appears to be resolved!');
        return true;
      }
      
      // Check if verification is stuck
      const isStuck = await page.evaluate(() => {
        const verifyingText = document.querySelector('*:contains("Verifying")') || 
                             Array.from(document.querySelectorAll('*')).find(el => 
                               el.textContent && el.textContent.includes('Verifying')
                             );
        return verifyingText && verifyingText.textContent.includes('Verifying');
      });
      
      if (isStuck) {
        console.log('⚠️ Cloudflare verification appears stuck, trying to refresh...');
        
        // Try refreshing the page
        await page.reload({ waitUntil: 'domcontentloaded' });
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Check if we're still stuck
        const stillStuck = await page.evaluate(() => {
          return document.body.textContent.includes('Verifying');
        });
        
        if (stillStuck) {
          console.log('🔄 Still stuck, trying alternative approach...');
          
          // Try navigating to a different URL first, then back
          const currentUrl = page.url();
          await page.goto('https://www.starwest-botanicals.com/', { 
            waitUntil: 'domcontentloaded', 
            timeout: 30000 
          });
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          await page.goto(currentUrl, { 
            waitUntil: 'domcontentloaded', 
            timeout: 30000 
          });
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
      
      // Wait before next check
      await new Promise(resolve => setTimeout(resolve, 10000));
      
    } catch (error) {
      console.log(`⚠️ Error during Cloudflare check: ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  console.log('⏰ Max wait time exceeded for Cloudflare');
  return false;
}

async function scrapeStarwest() {
  console.log('🚀 Starting browser with stealth mode and recaptcha support...');
  
  const browser = await puppeteer.launch({ 
    headless: false, // Show browser so you can see what's happening
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--disable-dev-shm-usage',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-default-apps',
      '--disable-extensions',
      '--disable-plugins',
      '--disable-images', // Don't load images to speed up
      '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ]
  });

  const page = await browser.newPage();
  
  // Set more realistic viewport and user agent
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  // Set extra headers to look more human
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Upgrade-Insecure-Requests': '1'
  });
  
  // Remove webdriver property
  await page.evaluateOnNewDocument(() => {
    delete navigator.__proto__.webdriver;
    Object.defineProperty(navigator, 'webdriver', {
      get: () => undefined,
    });
  });
  
  const allUrls = [];
  
  const urls = [
    "https://www.starwest-botanicals.com/shop-all-herbal-supplements-powder/"
  ];

  for (const url of urls) {
    console.log(`\n🌐 Visiting: ${url}`);
    
    try {
      // Navigate with more realistic settings
      await page.goto(url, { 
        waitUntil: 'domcontentloaded', 
        timeout: 60000 
      });
      
      // Wait for Cloudflare to resolve
      const cloudflareResolved = await waitForCloudflare(page);
      
      if (!cloudflareResolved) {
        console.log('❌ Could not resolve Cloudflare challenge, skipping this URL');
        continue;
      }
      
      // Wait explicitly for main content to appear (GPT's suggestion)
      console.log('🔍 Waiting for main content to load...');
      try {
        await page.waitForSelector('#main-content', { timeout: 60000 });
        console.log('✅ Main content detected!');
      } catch (e) {
        console.log('⚠️ Main content selector not found, trying alternative selectors...');
        // Try alternative selectors
        try {
          await page.waitForSelector('.product-list, .product-card, [class*="product"]', { timeout: 30000 });
          console.log('✅ Product elements detected!');
        } catch (e2) {
          console.log('⚠️ No product elements found, continuing anyway...');
        }
      }
      
      // Additional wait for page to fully load
      console.log('⏳ Waiting for page content to load...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Human-like scrolling with random delays
      console.log('📜 Performing human-like scrolling...');
      for (let i = 0; i < 5; i++) {
        const scrollAmount = Math.floor(Math.random() * 500) + 200;
        await page.evaluate((amount) => {
          window.scrollBy(0, amount);
        }, scrollAmount);
        
        const delay = Math.floor(Math.random() * 2000) + 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      // Scroll to bottom
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Take a screenshot to see what we got
      const urlSlug = url.split('/').filter(Boolean).pop() || 'page';
      await page.screenshot({ path: `screenshot-${urlSlug}.png`, fullPage: true });
      console.log(`📸 Screenshot saved: screenshot-${urlSlug}.png`);
      
      // Try to find product links with enhanced debugging
      const productUrls = await page.evaluate(() => {
        const urls = new Set();
        
        console.log('=== DEBUGGING PAGE CONTENT ===');
        console.log('Page title:', document.title);
        console.log('Page URL:', window.location.href);
        
        // Log what's actually on the page
        const allElements = document.querySelectorAll('*');
        console.log(`Total elements on page: ${allElements.length}`);
        
        // Look for any elements with "product" in class names
        const productElements = document.querySelectorAll('[class*="product" i]');
        console.log(`Elements with "product" in class: ${productElements.length}`);
        
        productElements.forEach((el, i) => {
          if (i < 5) { // Log first 5
            console.log(`Product element ${i}: ${el.tagName} class="${el.className}"`);
          }
        });
        
        // Strategy 1: Look for .product-list and .product-card
        const productList = document.querySelector('.product-list');
        if (productList) {
          console.log('✅ Found .product-list');
          const cards = productList.querySelectorAll('.product-card');
          console.log(`Found ${cards.length} .product-card elements`);
          
          cards.forEach((card, i) => {
            const links = card.querySelectorAll('a[href]');
            console.log(`Card ${i} has ${links.length} links`);
            
            links.forEach(link => {
              if (link.href && !link.href.includes('#') && link.href.includes('/product/')) {
                console.log(`Adding product URL: ${link.href}`);
                urls.add(link.href);
              }
            });
          });
        } else {
          console.log('❌ No .product-list found');
        }
        
        // Strategy 2: Look for any links with /product/ in href
        const productLinks = document.querySelectorAll('a[href*="/product/"]');
        console.log(`Found ${productLinks.length} links with /product/ in href`);
        productLinks.forEach((link, i) => {
          if (i < 10) {
            console.log(`Product link ${i}: ${link.href}`);
          }
          if (!link.href.includes('#')) {
            urls.add(link.href);
          }
        });
        
        // Strategy 3: Look for any reasonable product-looking links
        const allLinks = document.querySelectorAll('a[href]');
        console.log(`Scanning ${allLinks.length} total links for product patterns`);
        
        let productPatternCount = 0;
        allLinks.forEach((link, i) => {
          const href = link.href;
          const text = link.textContent.trim();
          
          // Look for links that look like products (not just anchors)
          if (href && 
              !href.includes('#') && 
              (href.includes('/product/') || 
               href.includes('/shop/') ||
               (text.length > 3 && text.length < 100))) {
            
            if (productPatternCount < 20) { // Log first 20
              console.log(`Potential product link ${productPatternCount}: "${text}" -> ${href}`);
            }
            productPatternCount++;
            
            // Only add if it looks like a real product URL
            if (href.includes('/product/') || 
                (href.includes('/shop/') && href.includes('-') && !href.endsWith('/'))) {
              urls.add(href);
            }
          }
        });
        
        console.log(`Total potential product links found: ${productPatternCount}`);
        console.log(`Final unique URLs to return: ${urls.size}`);
        
        return Array.from(urls);
      });
      
      console.log(`✅ Found ${productUrls.length} product URLs`);
      
      // Show first few URLs
      productUrls.slice(0, 5).forEach((url, i) => {
        console.log(`   ${i + 1}. ${url}`);
      });
      
      allUrls.push(...productUrls);
      
      // Now implement pagination to get ALL products
      console.log('🔄 Implementing pagination to get all products...');
      let currentPage = 1;
      let hasMorePages = true;
      let totalProductsFound = productUrls.length;
      let baseUrl = 'https://www.starwest-botanicals.com/shop-all-herbal-supplements-powder/?view=products';
      
      while (hasMorePages && currentPage <= 20) { // Safety limit of 20 pages
        console.log(`📄 Looking for page ${currentPage + 1}...`);
        
        // Construct the next page URL using the pattern we know works
        const nextPageUrl = currentPage === 1 ? 
          `${baseUrl}&pp=2` : 
          `${baseUrl}&pp=${currentPage + 1}`;
        
        console.log(`🔄 Navigating to next page: ${nextPageUrl}`);
        
        try {
          await page.goto(nextPageUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
          await new Promise(resolve => setTimeout(resolve, 5000));
          
          // Scroll to load content
          await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
          });
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Extract products from this page
          const nextPageProducts = await page.evaluate(() => {
            const urls = new Set();
            const productLinks = document.querySelectorAll('a[href*="/product/"]');
            productLinks.forEach(link => {
              if (link.href && !link.href.includes('#')) {
                urls.add(link.href);
              }
            });
            return Array.from(urls);
          });
          
          if (nextPageProducts.length > 0) {
            // Check if this page has different products than the first page
            const isNewPage = !nextPageProducts.every(url => 
              productUrls.includes(url)
            );
            
            if (isNewPage) {
              console.log(`✅ Page ${currentPage + 1}: Found ${nextPageProducts.length} NEW products`);
              allUrls.push(...nextPageProducts);
              totalProductsFound += nextPageProducts.length;
              currentPage++;
              
              // Show some examples
              nextPageProducts.slice(0, 3).forEach((url, i) => {
                console.log(`   ${i + 1}. ${url}`);
              });
            } else {
              console.log('⚠️ This page has the same products as page 1 - likely reached the end');
              hasMorePages = false;
            }
          } else {
            console.log('⚠️ Next page has no products, stopping pagination');
            hasMorePages = false;
          }
          
        } catch (error) {
          console.log(`❌ Error navigating to next page: ${error.message}`);
          hasMorePages = false;
        }
        
        // Wait between page requests
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
      console.log(`🎯 Pagination complete! Total products found: ${totalProductsFound}`);
      
    } catch (error) {
      console.log(`❌ Error processing ${url}: ${error.message}`);
    }
    
    // Longer wait between pages to avoid triggering more Cloudflare
    console.log('⏳ Waiting between pages...');
    await new Promise(resolve => setTimeout(resolve, 8000));
  }

  await browser.close();
  
  // Save results
  const uniqueUrls = [...new Set(allUrls)];
  console.log(`\n📊 Total unique URLs: ${uniqueUrls.length}`);
  
  if (uniqueUrls.length > 0) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `starwest-urls-${timestamp}.json`;
    fs.writeFileSync(filename, JSON.stringify(uniqueUrls, null, 2));
    console.log(`💾 Saved to ${filename}`);
    
    // Also save as text
    const txtFilename = `starwest-urls-${timestamp}.txt`;
    fs.writeFileSync(txtFilename, uniqueUrls.join('\n'));
    console.log(`💾 Also saved as ${txtFilename}`);
  }
}

scrapeStarwest().catch(console.error);
