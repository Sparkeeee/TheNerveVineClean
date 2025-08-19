import puppeteer, { Browser, Page } from 'puppeteer';
import { promises as fs } from 'fs';
import path from 'path';

// Configuration interfaces
interface TimingConfig {
  minDelay: number;
  maxDelay: number;
  scrollDelay: {
    min: number;
    max: number;
  };
  retryDelay: {
    min: number;
    max: number;
  };
  pageTimeout: number;
  networkTimeout: number;
}

interface TargetConfig {
  baseUrl: string;
  searchParam: string;
  maxPages: number;
  resultsPerPage: number;
  earlyStopThreshold: number;
}

interface BrowserConfig {
  headless: boolean | 'new';
  viewport: {
    width: number;
    height: number;
  };
  args: string[];
}

interface ProxyConfig {
  host: string;
  port: number;
  username?: string;
  password?: string;
}

interface DebugConfig {
  enabled: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  saveScreenshots: boolean;
  screenshotPath: string;
}

interface OutputConfig {
  format: 'json' | 'csv' | 'txt';
  filename: string;
  includeDuplicates: boolean;
  includeMetadata: boolean;
}

interface RetryConfig {
  maxAttempts: number;
  backoffMultiplier: number;
}

interface SelectorsConfig {
  productWrappers: string[];
  productLinks: string[];
  nextPageButton: string[];
}

export interface ScraperConfig {
  target: TargetConfig;
  timing: TimingConfig;
  browser: BrowserConfig;
  proxies: ProxyConfig[];
  userAgents: string[];
  retries: RetryConfig;
  debug: DebugConfig;
  output: OutputConfig;
  selectors: SelectorsConfig;
}

interface ScrapingResults {
  searchTerm: string;
  urls: string[];
  totalPages: number;
  timestamp: string;
  config?: ScraperConfig;
}

// Default configuration
export const defaultConfig: ScraperConfig = {
  target: {
    baseUrl: 'https://www.target.com/s',
    searchParam: 'searchTerm',
    maxPages: 5,
    resultsPerPage: 24,
    earlyStopThreshold: 10,
  },
  
  timing: {
    minDelay: 2000,        // Minimum delay between pages
    maxDelay: 8000,        // Maximum delay between pages
    scrollDelay: {
      min: 1000,
      max: 3000
    },
    retryDelay: {
      min: 5000,
      max: 15000
    },
    pageTimeout: 30000,
    networkTimeout: 10000
  },
  
  browser: {
    headless: 'new',
    viewport: {
      width: 1366,
      height: 768
    },
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  },
  
  proxies: [],
  
  userAgents: [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  ],
  
  retries: {
    maxAttempts: 3,
    backoffMultiplier: 2
  },
  
  debug: {
    enabled: true,
    logLevel: 'info',
    saveScreenshots: false,
    screenshotPath: './screenshots'
  },
  
  output: {
    format: 'json',
    filename: 'target_products',
    includeDuplicates: false,
    includeMetadata: true
  },
  
  // Updated with working selectors from actual Target.com HTML
  selectors: {
    productWrappers: [
      '[data-test="@web/site-top-of-funnel/ProductCardWrapper"]',
      '[data-test="@web/ProductCard/ProductCardVariantDefault"]',
      '[data-test="product-title"]',
      '.styles_cardWrapper__Lo85r'
    ],
    productLinks: [
      '[data-test="product-title"] a',                    // Primary: Product title links
      '[data-test="@web/ProductCard/ProductCardImageHoverableLink"] a', // Secondary: Image links
      'a[href*="/p/"]',                                  // Fallback: Any /p/ links
      '[data-test="@web/site-top-of-funnel/ProductCardWrapper"] a[href*="/p/"]' // Wrapper + /p/ links
    ],
    nextPageButton: [
      '[data-test="next"]',
      '.btn-pagination-next',
      'button[aria-label="next page"]',
      'a[aria-label="Next"]',
      '[class*="next"]',
      '[class*="Next"]'
    ]
  }
};

// Logger class
class Logger {
  private config: DebugConfig;
  private levels = { debug: 0, info: 1, warn: 2, error: 3 };
  private currentLevel: number;

  constructor(debugConfig: DebugConfig) {
    this.config = debugConfig;
    this.currentLevel = this.levels[debugConfig.logLevel] || 1;
  }

  updateConfig(debugConfig: DebugConfig): void {
    this.config = debugConfig;
    this.currentLevel = this.levels[debugConfig.logLevel] || 1;
  }

  private log(level: keyof typeof this.levels, message: string, ...args: any[]): void {
    if (!this.config.enabled || this.levels[level] < this.currentLevel) return;
    
    const timestamp = new Date().toISOString();
    const levelEmoji = { debug: '🔍', info: 'ℹ️', warn: '⚠️', error: '❌' };
    
    console.log(`${timestamp} ${levelEmoji[level]} [${level.toUpperCase()}] ${message}`, ...args);
  }

  debug(message: string, ...args: any[]): void { this.log('debug', message, ...args); }
  info(message: string, ...args: any[]): void { this.log('info', message, ...args); }
  warn(message: string, ...args: any[]): void { this.log('warn', message, ...args); }
  error(message: string, ...args: any[]): void { this.log('error', message, ...args); }
}

export class ConfigDrivenTargetScraper {
  private config: ScraperConfig;
  private configPath?: string;
  private logger: Logger;
  private allUrls: Set<string> = new Set();
  private pageCount: number = 0;
  private currentProxyIndex: number = 0;
  private currentUserAgentIndex: number = 0;

  constructor(configPath?: string) {
    this.config = { ...defaultConfig };
    this.configPath = configPath;
    this.logger = new Logger(this.config.debug);
  }

  // Load configuration from file
  async loadConfig(configPath?: string): Promise<ScraperConfig> {
    const targetPath = configPath || this.configPath;
    if (targetPath && await this.fileExists(targetPath)) {
      try {
        const configContent = await fs.readFile(targetPath, 'utf8');
        const userConfig = JSON.parse(configContent);
        this.config = this.mergeConfig(this.config, userConfig);
        this.logger.info(`Configuration loaded from: ${targetPath}`);
      } catch (error) {
        this.logger.error(`Failed to load config from ${targetPath}:`, error);
        throw error;
      }
    }
    
    this.logger.updateConfig(this.config.debug);
    return this.config;
  }

  // Deep merge configuration objects
  private mergeConfig(defaultConfig: any, userConfig: any): ScraperConfig {
    const result = { ...defaultConfig };
    
    for (const key in userConfig) {
      if (userConfig[key] && typeof userConfig[key] === 'object' && !Array.isArray(userConfig[key])) {
        result[key] = this.mergeConfig(result[key] || {}, userConfig[key]);
      } else {
        result[key] = userConfig[key];
      }
    }
    
    return result;
  }

  // Main scraping method with random delays
  async scrapeProducts(searchTerm: string, configOverrides: Partial<ScraperConfig> = {}): Promise<ScrapingResults> {
    // Apply runtime config overrides
    if (Object.keys(configOverrides).length > 0) {
      this.config = this.mergeConfig(this.config, configOverrides);
    }

    this.logger.info(`🚀 Starting Target scraping for: "${searchTerm}"`);
    this.logger.debug('Configuration:', JSON.stringify(this.config, null, 2));

    let browser: Browser | null = null;
    const startTime = Date.now();

    try {
      browser = await this.launchBrowser();
      const results = await this.scrapeAllPages(browser, searchTerm);
      
      const duration = Date.now() - startTime;
      this.logger.info(`✅ Scraping completed in ${duration}ms. Found ${results.urls.length} unique URLs`);
      
      return results;

    } catch (error) {
      this.logger.error('❌ Scraping failed:', error);
      throw error;
    } finally {
      if (browser) {
        await browser.close();
        this.logger.debug('🔒 Browser closed');
      }
    }
  }

  // Launch browser with configuration
  private async launchBrowser(): Promise<Browser> {
    const browserConfig: any = {
      headless: this.config.browser.headless,
      args: [...this.config.browser.args]
    };

    // Add proxy if configured
    if (this.config.proxies.length > 0) {
      const proxy = this.getNextProxy();
      if (proxy) {
        browserConfig.args.push(`--proxy-server=${proxy.host}:${proxy.port}`);
        this.logger.debug(`🔄 Using proxy: ${proxy.host}:${proxy.port}`);
      }
    }

    const browser = await puppeteer.launch(browserConfig);
    this.logger.debug('🌐 Browser launched');
    return browser;
  }

  // Scrape all pages with pagination and random delays
  private async scrapeAllPages(browser: Browser, searchTerm: string): Promise<ScrapingResults> {
    this.allUrls.clear();
    this.pageCount = 0;
    let consecutiveFailures = 0;

    while (this.pageCount < this.config.target.maxPages) {
      try {
        const pageResults = await this.scrapePage(browser, searchTerm, this.pageCount);
        
        if (pageResults.success) {
          const newUrls = pageResults.urls.filter(url => !this.allUrls.has(url));
          newUrls.forEach(url => this.allUrls.add(url));
          
          this.logger.info(`📄 Page ${this.pageCount + 1}: Found ${newUrls.length} new URLs (${pageResults.urls.length} total)`);
          
          // Early stopping condition
          if (newUrls.length < this.config.target.earlyStopThreshold) {
            this.logger.info(`⏹️ Early stopping: Less than ${this.config.target.earlyStopThreshold} new URLs found`);
            break;
          }
          
          consecutiveFailures = 0;
        } else {
          consecutiveFailures++;
          this.logger.warn(`⚠️ Page ${this.pageCount + 1} failed. Consecutive failures: ${consecutiveFailures}`);
          
          if (consecutiveFailures >= 3) {
            this.logger.error('❌ Too many consecutive failures. Stopping.');
            break;
          }
        }

        this.pageCount++;

        // RANDOM DELAY BETWEEN PAGES - Key requested feature!
        if (this.pageCount < this.config.target.maxPages) {
          await this.randomDelay(this.config.timing.minDelay, this.config.timing.maxDelay);
        }

      } catch (error) {
        this.logger.error(`❌ Error on page ${this.pageCount + 1}:`, error);
        consecutiveFailures++;
        
        if (consecutiveFailures >= 3) break;
        
        // Random retry delay
        await this.randomDelay(
          this.config.timing.retryDelay.min, 
          this.config.timing.retryDelay.max
        );
      }
    }

    const urlsArray = Array.from(this.allUrls);
    const results: ScrapingResults = {
      searchTerm,
      urls: urlsArray,
      totalPages: this.pageCount,
      timestamp: new Date().toISOString(),
      config: this.config.output.includeMetadata ? this.config : undefined
    };

    await this.saveResults(results);
    
    return results;
  }

  // Scrape individual page with retries
  private async scrapePage(browser: Browser, searchTerm: string, pageIndex: number): Promise<{ success: boolean; urls: string[] }> {
    let attempt = 0;
    const maxAttempts = this.config.retries.maxAttempts;

    while (attempt < maxAttempts) {
      let page: Page | null = null;
      try {
        page = await this.setupPage(browser);
        const url = this.buildUrl(searchTerm, pageIndex);
        
        this.logger.debug(`🔍 Attempting page ${pageIndex + 1}, attempt ${attempt + 1}: ${url}`);
        
        const result = await this.extractFromPage(page, url);
        
        return { success: true, urls: result };

      } catch (error) {
        attempt++;
        this.logger.warn(`⚠️ Page ${pageIndex + 1} attempt ${attempt} failed:`, (error as Error).message);
        
        if (attempt < maxAttempts) {
          const delay = this.config.timing.retryDelay.min * Math.pow(this.config.retries.backoffMultiplier, attempt - 1);
          await this.randomDelay(delay, delay * 2);
        }
      } finally {
        if (page) {
          await page.close();
        }
      }
    }

    return { success: false, urls: [] };
  }

  // Setup page with rotation and human-like behavior
  private async setupPage(browser: Browser): Promise<Page> {
    const page = await browser.newPage();
    
    await page.setViewport(this.config.browser.viewport);
    
    // Rotate user agent
    const userAgent = this.getNextUserAgent();
    await page.setUserAgent(userAgent);
    this.logger.debug(`🔄 Using user agent: ${userAgent.substring(0, 50)}...`);
    
    page.setDefaultTimeout(this.config.timing.pageTimeout);
    page.setDefaultNavigationTimeout(this.config.timing.pageTimeout);
    
    return page;
  }

  // Extract URLs from page using the proven Playwright approach
  private async extractFromPage(page: Page, url: string): Promise<string[]> {
    await page.goto(url, { 
      waitUntil: 'domcontentloaded',
      timeout: this.config.timing.pageTimeout
    });

    this.logger.debug(`📄 Page loaded: ${page.url()}`);
    
    // Take screenshot if enabled
    if (this.config.debug.saveScreenshots) {
      await this.takeScreenshot(page);
    }

    // STRATEGY 1: Gradual scrolling to trigger dynamic loading (from your working code)
    this.logger.debug('📜 Gradual scrolling to trigger dynamic loading...');
    const viewportHeight = page.viewport()?.height || 800;
    
    for (let i = 0; i < 5; i++) {
      await page.evaluate((h) => window.scrollBy(0, h), viewportHeight / 2);
      await page.waitForTimeout(1000 + Math.random() * 1000);
      this.logger.debug(`📏 Scroll step ${i + 1}/5 completed`);
    }

    // STRATEGY 2: Wait for product links to appear
    this.logger.debug('⏳ Waiting for product links to appear...');
    try {
      await page.waitForSelector("a[href*='/p/']", { timeout: 10000 });
      this.logger.debug('✅ Product links found!');
    } catch (error) {
      this.logger.warn('⚠️ Product links not found after waiting');
    }

    // STRATEGY 3: Extract URLs with refined JS fallback
    const urls = await this.extractUrlsWithRefinedFallback(page);
    
    this.logger.debug(`🔗 Extracted ${urls.length} URLs from page`);
    return urls;
  }

  // Auto-scroll page to trigger lazy loading (from your working code)
  private async autoScrollForLazyLoading(page: Page): Promise<void> {
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let totalHeight = 0;
        const distance = 200;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
    
    this.logger.debug('✅ Auto-scroll completed');
  }

  // Aggressive scrolling specifically for lazy loading
  private async aggressiveScrollForLazyLoading(page: Page): Promise<void> {
    let previousHeight = 0;
    let currentHeight = await page.evaluate(() => document.body.scrollHeight);
    let scrollAttempts = 0;
    const maxScrollAttempts = 15; // More aggressive scrolling
    
    this.logger.debug('🔄 Starting aggressive lazy loading scroll...');
    
    while (scrollAttempts < maxScrollAttempts && currentHeight > previousHeight) {
      previousHeight = currentHeight;
      
      // Scroll down in larger chunks to trigger lazy loading
      await page.evaluate(() => {
        window.scrollBy(0, 1000); // Bigger scroll steps
      });
      
      // Wait for content to load
      await page.waitForTimeout(1500);
      
      // Check if page height increased (new content loaded)
      currentHeight = await page.evaluate(() => document.body.scrollHeight);
      
      this.logger.debug(`📏 Scroll attempt ${scrollAttempts + 1}: Height ${previousHeight} → ${currentHeight}`);
      
      // If height didn't increase, try scrolling to bottom
      if (currentHeight === previousHeight) {
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
        await page.waitForTimeout(2000);
        currentHeight = await page.evaluate(() => document.body.scrollHeight);
      }
      
      scrollAttempts++;
    }
    
    // Final scroll to bottom
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(2000);
    
    this.logger.debug(`✅ Aggressive scrolling completed after ${scrollAttempts} attempts`);
  }

  // Try to load more content via buttons
  private async tryLoadMoreContent(page: Page): Promise<void> {
    this.logger.debug('🔍 Looking for Load More buttons...');
    
    try {
      // Look for various "Load More" button patterns
      const loadMoreSelectors = [
        '[data-test="load-more"]',
        '.load-more',
        'button:contains("Load More")',
        'button:contains("Show More")',
        'button:contains("View More")',
        '[aria-label*="load more"]',
        '[aria-label*="show more"]'
      ];
      
      for (const selector of loadMoreSelectors) {
        try {
          const button = await page.$(selector);
          if (button) {
            this.logger.debug(`🔄 Found Load More button: ${selector}`);
            await button.click();
            await page.waitForTimeout(3000);
            this.logger.debug('✅ Load More button clicked');
            break;
          }
        } catch (error) {
          // Continue to next selector
        }
      }
      
      // Also try to find and click any pagination buttons
      const paginationSelectors = [
        '[data-test="next"]',
        '.btn-pagination-next',
        'button[aria-label="next page"]',
        'a[aria-label="Next"]'
      ];
      
      for (const selector of paginationSelectors) {
        try {
          const button = await page.$(selector);
          if (button) {
            this.logger.debug(`🔄 Found pagination button: ${selector}`);
            await button.click();
            await page.waitForTimeout(3000);
            this.logger.debug('✅ Pagination button clicked');
            break;
          }
        } catch (error) {
          // Continue to next selector
        }
      }
      
    } catch (error) {
      this.logger.debug('⚠️ Error trying to load more content:', (error as Error).message);
    }
  }

  // Human-like scrolling behavior (kept for compatibility)
  private async humanLikeScroll(page: Page): Promise<void> {
    const scrollSteps = 3 + Math.floor(Math.random() * 3); // 3-5 scroll steps
    
    for (let i = 0; i < scrollSteps; i++) {
      const scrollAmount = 200 + Math.floor(Math.random() * 400); // 200-600px
      await page.evaluate((amount: number) => {
        window.scrollBy(0, amount);
      }, scrollAmount);
      
      // Random delay between scrolls
      await this.randomDelay(
        this.config.timing.scrollDelay.min,
        this.config.timing.scrollDelay.max
      );
    }
    
    // Scroll to bottom to trigger lazy loading
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    await this.randomDelay(1000, 2000);
  }

  // Extract URLs with refined JS fallback (from your working code)
  private async extractUrlsWithRefinedFallback(page: Page): Promise<string[]> {
    try {
      // Primary extraction: direct /p/ links
      let rawUrls = await page.$$eval("a[href*='/p/']", els =>
        els
          .map(el => el.getAttribute("href"))
          .filter((href): href is string => !!href)
          .map(href => new URL(href, "https://www.target.com").toString())
      );

      this.logger.debug(`🔍 Primary extraction found ${rawUrls.length} URLs`);

      // Refined fallback: click "Show more" or similar dynamic loaders
      if (rawUrls.length === 0) {
        this.logger.debug("🔍 Using refined JS fallback...");
        try {
          await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll("button"));
            buttons.forEach(btn => {
              if (btn.textContent?.includes("Show more") || btn.textContent?.includes("Load more")) {
                btn.click();
              }
            });
          });
          
          await page.waitForTimeout(3000 + Math.random() * 2000);

          // Retry extraction after JS interaction
          rawUrls = await page.$$eval("a[href*='/p/']", els =>
            els
              .map(el => el.getAttribute("href"))
              .filter((href): href is string => !!href)
              .map(href => new URL(href, "https://www.target.com").toString())
          );
          
          this.logger.debug(`🔁 Refined fallback extracted ${rawUrls.length} URLs`);
        } catch (err) {
          this.logger.warn("⚠️ Refined fallback failed:", (err as Error).message);
        }
      }

      return rawUrls;
      
    } catch (error) {
      this.logger.warn(`⚠️ URL extraction failed: ${(error as Error).message}`);
      return [];
    }
  }

  // Extract product URLs using the working method from your config
  private async extractProductUrlsWithWorkingMethod(page: Page): Promise<string[]> {
    try {
      // Use the working selector: "a[href*='/p/']"
      const rawUrls = await page.$$eval('a[href*="/p/"]', (els) =>
        els
          .map((el) => el.getAttribute("href"))
          .filter((href): href is string => !!href)
          .map((href) => new URL(href, "https://www.target.com").toString())
      );
      
      this.logger.debug(`🔍 Working selector found ${rawUrls.length} raw URLs`);
      return rawUrls;
      
    } catch (error) {
      this.logger.warn(`⚠️ Working selector failed: ${(error as Error).message}`);
      return [];
    }
  }

  // Extract product URLs using configured selectors (preserved from diagnostic)
  private async extractProductUrls(page: Page): Promise<string[]> {
    const urls = new Set<string>();
    
    for (const selector of this.config.selectors.productLinks) {
      try {
        const links = await page.$$eval(selector, (elements: Element[]) => {
          return (elements as HTMLAnchorElement[])
            .map(el => el.href)
            .filter(href => href && href.includes('/p/'))
            .map(href => href.split('#')[0]) // Remove fragments
            .map(href => href.split('?')[0]); // Remove query params
        });
        
        links.forEach(link => urls.add(link));
        this.logger.debug(`🔍 Selector "${selector}" found ${links.length} URLs`);
        
      } catch (error) {
        this.logger.debug(`⚠️ Selector "${selector}" failed:`, (error as Error).message);
      }
    }
    
    return Array.from(urls);
  }

  // Build URL for specific page - Updated to use search instead of category browsing
  private buildUrl(searchTerm: string, pageIndex: number): string {
    // Use search URL format that actually works
    const baseUrl = `${this.config.target.baseUrl}?${this.config.target.searchParam}=${encodeURIComponent(searchTerm)}`;
    if (pageIndex > 0) {
      // Target uses 'page' parameter, not 'offset'
      return `${baseUrl}&page=${pageIndex + 1}`;
    }
    return baseUrl;
  }

  // Random delay utility - CORE FEATURE
  private async randomDelay(min: number, max: number): Promise<void> {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    this.logger.debug(`⏱️ Random delay: ${delay}ms`);
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  // Proxy rotation
  private getNextProxy(): ProxyConfig | null {
    if (this.config.proxies.length === 0) return null;
    const proxy = this.config.proxies[this.currentProxyIndex];
    this.currentProxyIndex = (this.currentProxyIndex + 1) % this.config.proxies.length;
    return proxy;
  }

  // User agent rotation
  private getNextUserAgent(): string {
    const userAgent = this.config.userAgents[this.currentUserAgentIndex];
    this.currentUserAgentIndex = (this.currentUserAgentIndex + 1) % this.config.userAgents.length;
    return userAgent;
  }

  // Take screenshot for debugging
  private async takeScreenshot(page: Page): Promise<void> {
    try {
      await fs.mkdir(this.config.debug.screenshotPath, { recursive: true });
      const filename = `screenshot_${Date.now()}.png`;
      const filepath = path.join(this.config.debug.screenshotPath, filename);
      await page.screenshot({ path: filepath, fullPage: true });
      this.logger.debug(`📸 Screenshot saved: ${filepath}`);
    } catch (error) {
      this.logger.warn('⚠️ Screenshot failed:', (error as Error).message);
    }
  }

  // Save results in configured format
  private async saveResults(results: ScrapingResults): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${this.config.output.filename}_${timestamp}`;
    
    try {
      switch (this.config.output.format.toLowerCase()) {
        case 'json':
          await fs.writeFile(`${filename}.json`, JSON.stringify(results, null, 2));
          break;
          
        case 'csv':
          const csv = 'URL\n' + results.urls.join('\n');
          await fs.writeFile(`${filename}.csv`, csv);
          break;
          
        case 'txt':
          await fs.writeFile(`${filename}.txt`, results.urls.join('\n'));
          break;
      }
      
      this.logger.info(`💾 Results saved: ${filename}.${this.config.output.format}`);
    } catch (error) {
      this.logger.error('❌ Failed to save results:', error);
    }
  }

  // Utility method
  private async fileExists(filepath: string): Promise<boolean> {
    try {
      await fs.access(filepath);
      return true;
    } catch {
      return false;
    }
  }

  // Get current configuration
  getConfig(): ScraperConfig {
    return { ...this.config };
  }

  // Update configuration
  updateConfig(newConfig: Partial<ScraperConfig>): void {
    this.config = this.mergeConfig(this.config, newConfig);
    this.logger.updateConfig(this.config.debug);
  }
}
