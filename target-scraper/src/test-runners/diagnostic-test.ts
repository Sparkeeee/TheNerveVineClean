import { chromium } from "playwright";
import { extractTargetUrls } from "../scrapers/target-diagnostic";

async function runDiagnosticTest() {
  console.log("🔍 Starting Target Diagnostic Test");
  
  const browser = await chromium.launch({
    headless: false, // Keep visible to see what's happening
    slowMo: 100,
    args: [
      '--no-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-features=VizDisplayCompositor',
      '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ]
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 },
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    }
  });

  // Anti-detection measures
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
    Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
  });

  const page = await context.newPage();
  
  try {
    const searchTerm = "magnesium glycinate supplement";
    console.log(`🌐 Testing Target for "${searchTerm}"`);
    
    const urls = await extractTargetUrls(page, searchTerm, "supplement");
    
    console.log(`\n📊 FINAL RESULTS:`);
    console.log(`Total URLs extracted: ${urls.length}`);
    
    if (urls.length > 0) {
      console.log("\n✅ SUCCESS! URLs found:");
      urls.slice(0, 10).forEach((url, i) => {
        console.log(`${i + 1}. ${url}`);
      });
      
      if (urls.length > 10) {
        console.log(`... and ${urls.length - 10} more`);
      }
    } else {
      console.log("\n❌ No URLs found. Check the diagnostics above for clues.");
    }
    
  } catch (error) {
    console.error("❌ Test failed:", error);
  }

  // Keep browser open for manual inspection
  console.log("\n⏸️ Browser will stay open for 30 seconds for manual inspection...");
  await page.waitForTimeout(30000);
  
  await browser.close();
  console.log("🎬 Diagnostic test complete!");
}

// Self-executing
runDiagnosticTest().catch(console.error);
