const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Configuration file structure
const defaultConfig = {
  // Target settings
  target: {
    baseUrl: 'https://www.target.com/s',
    searchParam: 'searchTerm',
    maxPages: 5,
    resultsPerPage: 24,
    earlyStopThreshold: 10, // Stop if less than this many new URLs found
  },
  
  // Timing settings (all in milliseconds)
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
    pageTimeout: 30000,    // Page load timeout
    networkTimeout: 10000  // Network idle timeout
  },
  
  // Browser settings
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
  
  // Proxy settings (rotate per page)
  proxies: [
    // Add your proxy list here
    // { host: 'proxy1.example.com', port: 8080, username: 'user', password: 'pass' },
    // { host: 'proxy2.example.com', port: 8080, username: 'user', password: 'pass' }
  ],
  
  // User agents (rotate per page)
  userAgents: [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  ],
  
  // Retry settings
  retries: {
    maxAttempts: 3,
    backoffMultiplier: 2
  },
  
  // Debug settings
  debug: {
    enabled: true,
    logLevel: 'info', // 'debug', 'info', 'warn', 'error'
    saveScreenshots: false,
    screenshotPath: './screenshots'
  },
  
  // Output settings
  output: {
    format: 'json', // 'json', 'csv', 'txt'
    filename: 'target_products',
    includeDuplicates: false,
    includeMetadata: true
  },
  
  // Target-specific selectors (preserved from your working version)
  selectors: {
    productWrappers: [
      '[data-test="@web/site-top-of-funnel/ProductCardWrapper"]',
      '[data-test="product-title"]',
      '.ProductCard',
      '[data-testid="product-card"]'
    ],
    productLinks: [
      'a[href*="/p/"]',
      '[data-test="product-title"] a',
      '.ProductCard a',
      '[data-testid="product-card"] a'
    ],
    nextPageButton: [
      '[data-test="next"]',
      '.btn-pagination-next',
      'button[aria-label="next page"]',
      'a[aria-label="Next"]'
    ]
  }
};

class ConfigDrivenTargetScraper {
  constructor(configPath = null) {
    this.config = { ...defaultConfig };
    this.configPath = configPath;
    this.logger = new Logger(this.config.debug);
    this.allUrls = new Set();
    this.pageCount = 0;
    this.currentProxyIndex = 0;
    this.currentUserAgentIndex = 0;
  }

  // Load configuration from file
  async loadConfig(configPath = null) {
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
    
    // Update logger with new config
    this.logger.updateConfig(this.config.debug);
    return this.config;
  }

  // Save current configuration to file
  async saveConfig(configPath) {
    try {
      await fs.writeFile(configPath, JSON.stringify(this.config, null, 2));
      this.logger.info(`Configuration saved to: ${configPath}`);
    } catch (error) {
      this.logger.error(`Failed to save config to ${configPath}:`, error);
      throw error;
    }
  }

  // Deep merge configuration objects
  mergeConfig(defaultConfig, userConfig) {
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

  // Main scraping method
  async scrapeProducts(searchTerm, configOverrides = {}) {
    // Apply any runtime config overrides
    if (Object.keys(configOverrides).length > 0) {
      this.config = this.mergeConfig(this.config, configOverrides);
    }

    this.logger.info(`🚀 Starting Target scraping for: "${searchTerm}"`);
    this.logger.debug('Configuration:', JSON.stringify(this.config, null, 2));

    let browser = null;
    const startTime = Date.now();

    try {
      // Launch browser with config
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
  async launchBrowser() {
    const browserConfig = {
      headless: this.config.browser.headless,
      args: [...this.config.browser.args]
    };

    // Add proxy if configured
    if (this.config.proxies.length > 0) {
      const proxy = this.getNextProxy();
      browserConfig.args.push(`--proxy-server=${proxy.host}:${proxy.port}`);
      this.logger.debug(`🔄 Using proxy: ${proxy.host}:${proxy.port}`);
    }

    const browser = await puppeteer.launch(browserConfig);
    this.logger.debug('🌐 Browser launched');
    return browser;
  }

  // Scrape all pages with pagination
  async scrapeAllPages(browser, searchTerm) {
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

        // Random delay between pages (key feature requested)
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
    const results = {
      searchTerm,
      urls: urlsArray,
      totalPages: this.pageCount,
      timestamp: new Date().toISOString(),
      config: this.config.output.includeMetadata ? this.config : undefined
    };

    // Save results based on config
    await this.saveResults(results);
    
    return results;
  }

  // Scrape individual page with retries
  async scrapePage(browser, searchTerm, pageIndex) {
    let attempt = 0;
    const maxAttempts = this.config.retries.maxAttempts;

    while (attempt < maxAttempts) {
      try {
        const page = await this.setupPage(browser);
        const url = this.buildUrl(searchTerm, pageIndex);
        
        this.logger.debug(`🔍 Attempting page ${pageIndex + 1}, attempt ${attempt + 1}: ${url}`);
        
        const result = await this.extractFromPage(page, url);
        await page.close();
        
        return { success: true, urls: result };

      } catch (error) {
        attempt++;
        this.logger.warn(`⚠️ Page ${pageIndex + 1} attempt ${attempt} failed:`, error.message);
        
        if (attempt < maxAttempts) {
          const delay = this.config.timing.retryDelay.min * Math.pow(this.config.retries.backoffMultiplier, attempt - 1);
          await this.randomDelay(delay, delay * 2);
        }
      }
    }

    return { success: false, urls: [] };
  }

  // Setup page with rotation and human-like behavior
  async setupPage(browser) {
    const page = await browser.newPage();
    
    // Set viewport from config
    await page.setViewport(this.config.browser.viewport);
    
    // Rotate user agent
    const userAgent = this.getNextUserAgent();
    await page.setUserAgent(userAgent);
    this.logger.debug(`🔄 Using user agent: ${userAgent.substring(0, 50)}...`);
    
    // Set timeouts from config
    page.setDefaultTimeout(this.config.timing.pageTimeout);
    page.setDefaultNavigationTimeout(this.config.timing.pageTimeout);
    
    return page;
  }

  // Extract URLs from page with human-like scrolling
  async extractFromPage(page, url) {
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: this.config.timing.pageTimeout
    });

    this.logger.debug(`📄 Page loaded: ${page.url()}`);
    
    // Take screenshot if enabled
    if (this.config.debug.saveScreenshots) {
      await this.takeScreenshot(page);
    }

    // Human-like scrolling with random delays
    await this.humanLikeScroll(page);
    
    // Wait for dynamic content
    await page.waitForTimeout(2000);
    
    // Extract product URLs using configured selectors
    const urls = await this.extractProductUrls(page);
    
    this.logger.debug(`🔗 Extracted ${urls.length} URLs from page`);
    return urls;
  }

  // Human-like scrolling behavior
  async humanLikeScroll(page) {
    const scrollSteps = 3 + Math.floor(Math.random() * 3); // 3-5 scroll steps
    
    for (let i = 0; i < scrollSteps; i++) {
      const scrollAmount = 200 + Math.floor(Math.random() * 400); // 200-600px
      await page.evaluate((amount) => {
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

  // Extract product URLs using configured selectors
  async extractProductUrls(page) {
    const urls = new Set();
    
    for (const selector of this.config.selectors.productLinks) {
      try {
        const links = await page.$$eval(selector, (elements) => {
          return elements
            .map(el => el.href)
            .filter(href => href && href.includes('/p/'))
            .map(href => href.split('#')[0]) // Remove fragments
            .map(href => href.split('?')[0]); // Remove query params
        });
        
        links.forEach(link => urls.add(link));
        this.logger.debug(`🔍 Selector "${selector}" found ${links.length} URLs`);
        
      } catch (error) {
        this.logger.debug(`⚠️ Selector "${selector}" failed:`, error.message);
      }
    }
    
    return Array.from(urls);
  }

  // Build URL for specific page
  buildUrl(searchTerm, pageIndex) {
    const baseUrl = `${this.config.target.baseUrl}?${this.config.target.searchParam}=${encodeURIComponent(searchTerm)}`;
    if (pageIndex > 0) {
      const offset = pageIndex * this.config.target.resultsPerPage;
      return `${baseUrl}&offset=${offset}`;
    }
    return baseUrl;
  }

  // Random delay utility
  async randomDelay(min, max) {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    this.logger.debug(`⏱️ Random delay: ${delay}ms`);
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  // Proxy rotation
  getNextProxy() {
    if (this.config.proxies.length === 0) return null;
    const proxy = this.config.proxies[this.currentProxyIndex];
    this.currentProxyIndex = (this.currentProxyIndex + 1) % this.config.proxies.length;
    return proxy;
  }

  // User agent rotation
  getNextUserAgent() {
    const userAgent = this.config.userAgents[this.currentUserAgentIndex];
    this.currentUserAgentIndex = (this.currentUserAgentIndex + 1) % this.config.userAgents.length;
    return userAgent;
  }

  // Take screenshot for debugging
  async takeScreenshot(page) {
    try {
      await fs.mkdir(this.config.debug.screenshotPath, { recursive: true });
      const filename = `screenshot_${Date.now()}.png`;
      const filepath = path.join(this.config.debug.screenshotPath, filename);
      await page.screenshot({ path: filepath, fullPage: true });
      this.logger.debug(`📸 Screenshot saved: ${filepath}`);
    } catch (error) {
      this.logger.warn('⚠️ Screenshot failed:', error.message);
    }
  }

  // Save results in configured format
  async saveResults(results) {
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
  async fileExists(filepath) {
    try {
      await fs.access(filepath);
      return true;
    } catch {
      return false;
    }
  }
}

// Logger class
class Logger {
  constructor(debugConfig) {
    this.config = debugConfig;
    this.levels = { debug: 0, info: 1, warn: 2, error: 3 };
    this.currentLevel = this.levels[debugConfig.logLevel] || 1;
  }

  updateConfig(debugConfig) {
    this.config = debugConfig;
    this.currentLevel = this.levels[debugConfig.logLevel] || 1;
  }

  log(level, message, ...args) {
    if (!this.config.enabled || this.levels[level] < this.currentLevel) return;
    
    const timestamp = new Date().toISOString();
    const levelEmoji = { debug: '🔍', info: 'ℹ️', warn: '⚠️', error: '❌' };
    
    console.log(`${timestamp} ${levelEmoji[level]} [${level.toUpperCase()}] ${message}`, ...args);
  }

  debug(message, ...args) { this.log('debug', message, ...args); }
  info(message, ...args) { this.log('info', message, ...args); }
  warn(message, ...args) { this.log('warn', message, ...args); }
  error(message, ...args) { this.log('error', message, ...args); }
}

// Export for use
module.exports = { ConfigDrivenTargetScraper, defaultConfig };

// Example usage
if (require.main === module) {
  async function main() {
    const scraper = new ConfigDrivenTargetScraper();
    
    // Load config from file (optional)
    // await scraper.loadConfig('./config.json');
    
    // Runtime config overrides (optional)
    const overrides = {
      timing: {
        minDelay: 3000,
        maxDelay: 7000
      },
      debug: {
        enabled: true,
        logLevel: 'debug'
      }
    };
    
    try {
      const results = await scraper.scrapeProducts('magnesium glycinate supplement', overrides);
      console.log(`Found ${results.urls.length} unique product URLs`);
    } catch (error) {
      console.error('Scraping failed:', error);
    }
  }
  
  main();
}
