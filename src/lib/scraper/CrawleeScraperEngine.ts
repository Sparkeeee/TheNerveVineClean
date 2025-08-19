import { PlaywrightCrawler, Dataset } from 'crawlee';
import { ScrapedProduct, ScrapingProgress, ScrapingSession, ScrapingError } from './types';
import { Logger } from './utils/Logger';
import { ProgressTracker } from './ProgressTracker';
import { QualityFilter } from './QualityFilter';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

export class CrawleeScraperEngine {
  private prisma: PrismaClient;
  private logger: Logger;
  private progressTracker: ProgressTracker;
  private qualityFilter: QualityFilter;
  private session!: ScrapingSession;
  private dataset!: Dataset;
  private tempStoragePath: string;

  constructor() {
    this.prisma = new PrismaClient();
    this.logger = new Logger();
    this.progressTracker = new ProgressTracker();
    this.qualityFilter = new QualityFilter();
    this.tempStoragePath = path.join(process.cwd(), 'temp-scraped-products.json');
    // Initialize dataset in startScrapingSession
  }

  async startScrapingSession(searchType: 'herbs' | 'supplements' | 'symptoms' = 'herbs'): Promise<void> {
    this.logger.info(`🚀 Starting The Nine Realms Scraper with Crawlee Power...`);
    this.logger.info(`🎯 Search Type: ${searchType}`);
    
    // Initialize dataset for local storage
    this.dataset = await Dataset.open('scraper-dataset');
    
    // Initialize session
    this.session = {
      id: this.generateSessionId(),
      startTime: new Date(),
      status: 'RUNNING',
      progress: {
        totalProducts: 0,
        scrapedProducts: 0,
        failedProducts: 0,
        currentSite: '',
        currentProduct: '',
        startTime: new Date(),
        estimatedTimeRemaining: 0,
        successRate: 0
      },
      errors: [],
      lastSavedProduct: 0
    };

    try {
      // Get search terms based on type
      const searchTerms = await this.getSearchTerms(searchType);
      this.logger.info(`📋 Found ${searchTerms.length} search terms: ${searchTerms.slice(0, 5).join(', ')}${searchTerms.length > 5 ? '...' : ''}`);
      
      // Process each search term with Crawlee
      for (const term of searchTerms) {
        await this.processSearchTermWithCrawlee(term, searchType);
      }

      this.session.status = 'COMPLETED';
      this.logger.success('✅ Scraping session completed successfully with Crawlee!');
      
      // Export data to temporary storage
      await this.exportToTempStorage();
      
    } catch (error) {
      this.session.status = 'ERROR';
      this.logger.error('❌ Scraping session failed:', error);
      throw error;
    }
  }

  private async getSearchTerms(searchType: 'herbs' | 'supplements' | 'symptoms'): Promise<string[]> {
    try {
      // TEMPORARY: For testing, just use 3 herbs
      if (searchType === 'herbs') {
        // Return just 3 herbs for testing
        return ['Lemon Balm', 'Ashwagandha', 'Chamomile'];
        
        // TODO: Uncomment this when ready for full database
        // const herbs = await this.prisma.herb.findMany({
        //   select: { name: true, slug: true }
        // });
        // return herbs.map(h => h.name || h.slug).filter(Boolean);
      } else if (searchType === 'supplements') {
        const supplements = await this.prisma.supplement.findMany({
          select: { name: true, slug: true }
        });
        return supplements.map(s => s.name || s.slug).filter((item): item is string => item !== null && item !== undefined);
      } else {
        const symptoms = await this.prisma.symptom.findMany({
          select: { title: true, slug: true }
        });
        return symptoms.map(s => s.title || s.slug).filter(Boolean);
      }
    } catch (error) {
      this.logger.error('❌ Failed to get search terms from database:', error);
      // Fallback to basic terms for testing
      return ['ashwagandha', 'ginkgo-biloba', 'valerian', 'chamomile', 'melatonin'];
    }
  }

  private async processSearchTermWithCrawlee(searchTerm: string, searchType: string): Promise<void> {
    this.logger.info(`🌿 Processing search term: ${searchTerm} (${searchType}) with Crawlee`);
    
    // Create Crawlee crawler for this search term
    const crawler = new PlaywrightCrawler({
      // Use the requestHandler to process each of the crawled pages
      requestHandler: async ({ request, page, enqueueLinks, pushData, log }) => {
        try {
          log.info(`Processing: ${request.url}`);
          
          // Extract product data using Playwright
          const productData = await this.extractProductData(page, searchTerm);
          
          if (productData) {
            log.info(`Found product: ${productData.name}`);
            // Save to Crawlee dataset
            await pushData(productData);
            
            // Update progress
            this.progressTracker.updateProgress(request.url, 1);
          } else {
            log.info(`No product data found on: ${request.url}`);
          }

          // Extract links from the current page and add them to the crawling queue
          await enqueueLinks({
            globs: ['**/product/**', '**/supplement/**', '**/herb/**'],
            label: 'product'
          });

        } catch (error) {
          log.error(`Failed to process ${request.url}:`, error as any);
          this.handleScrapingError(error as any, request.url, searchTerm);
        }
      },

      // Handle failed requests
      failedRequestHandler: ({ request, error }) => {
        this.logger.error(`❌ Failed to process ${request.url}:`, error);
        this.handleScrapingError(error as any, request.url, 'unknown');
      },

      // Rate limiting and anti-detection
      maxRequestRetries: 3,
      requestHandlerTimeoutSecs: 60,
      maxRequestsPerCrawl: 100, // Increased from 10 to 100
      
      // Browser configuration for anti-detection
      headless: true,

      // Session management
      sessionPoolOptions: {
        maxPoolSize: 10,
        sessionOptions: {
          maxUsageCount: 50,
        },
      },
    });

    // Add starting URLs for this search term
    const startingUrls = this.generateStartingUrls(searchTerm);
    
    // Start the crawler
    await crawler.run(startingUrls);
  }

  private async extractProductData(page: any, searchTerm: string): Promise<ScrapedProduct | null> {
    try {
      // Wait for page to load
      await page.waitForLoadState('networkidle');

      // Extract product information using Playwright
      const productData = await page.evaluate(() => {
        // Extract title
        const title = document.querySelector('h1, .product-title, .product-name')?.textContent?.trim();
        
        // Extract price
        const priceElement = document.querySelector('[data-price], .price, .product-price, .current-price');
        const price = priceElement?.textContent?.trim();
        
        // Extract image
        const imgElement = document.querySelector('img[src*="product"], .product-image img, .main-image img');
        const imageUrl = imgElement?.getAttribute('src') || imgElement?.getAttribute('data-src');
        
        // Extract description
        const description = document.querySelector('.product-description, .description, [class*="description"]')?.textContent?.trim();
        
        return { title, price, imageUrl, description };
      });

      if (!productData.title || !productData.price) {
        return null;
      }

      // Clean and validate data
      const cleanedData = this.cleanProductData(productData);
      
      // Check quality
      if (!this.qualityFilter.validateProduct(cleanedData)) {
        return null;
      }

      return {
        name: cleanedData.name || 'Unknown Product',
        price: cleanedData.price || '0',
        imageUrl: cleanedData.imageUrl || '',
        description: cleanedData.description || '',
        availability: 'Unknown',
        site: this.extractSiteFromUrl(page.url()),
        url: page.url(),
        scrapedAt: new Date()
      };

    } catch (error) {
      this.logger.error(`❌ Failed to extract data from ${page.url()}:`, error);
      return null;
    }
  }

  private cleanProductData(rawData: any): Partial<ScrapedProduct> {
    return {
      name: this.cleanTitle(rawData.title),
      price: this.cleanPrice(rawData.price),
      imageUrl: this.normalizeImageUrl(rawData.imageUrl),
      description: rawData.description ? this.cleanDescription(rawData.description) : undefined
    };
  }

  private cleanTitle(title: string): string {
    return title
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s\-&.,()]/g, '')
      .trim();
  }

  private cleanPrice(priceText: string): string {
    const cleaned = priceText.replace(/[^\d.,]/g, '');
    const price = parseFloat(cleaned.replace(',', '.'));
    return isNaN(price) ? '0' : price.toString();
  }

  private normalizeImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('//')) return `https:${imageUrl}`;
    if (imageUrl.startsWith('/')) return `https://${this.extractSiteFromUrl(imageUrl)}${imageUrl}`;
    return imageUrl;
  }

  private cleanDescription(description: string): string {
    return description
      .replace(/\s+/g, ' ')
      .substring(0, 500)
      .trim();
  }

  private extractSiteFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return 'unknown';
    }
  }

  private generateStartingUrls(searchTerm: string): string[] {
    // Generate starting URLs for each of the 9 working sites based on search term
    const urls: string[] = [];
    
    // Clean the search term for URL use
    const cleanTerm = searchTerm.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    // 1. Amazon - search results page
    urls.push(`https://www.amazon.com/s?k=${encodeURIComponent(searchTerm)}+supplement`);
    
    // 2. Target - search results page
    urls.push(`https://www.target.com/s?searchTerm=${encodeURIComponent(searchTerm)}+supplement`);
    
    // 3. Vitacost - search results page
    urls.push(`https://www.vitacost.com/search?w=${encodeURIComponent(searchTerm)}`);
    
    // 4. Gaia Herbs - search results page
    urls.push(`https://www.gaiaherbs.com/search?q=${encodeURIComponent(searchTerm)}`);
    
    // 5. Wise Woman Herbals - search results page
    urls.push(`https://www.wisewomanherbals.com/search?q=${encodeURIComponent(searchTerm)}`);
    
    // 6. Pacific Botanicals - search results page
    urls.push(`https://www.pacificbotanicals.com/search?q=${encodeURIComponent(searchTerm)}`);
    
    // 7. Traditional Medicinals - search results page
    urls.push(`https://www.traditionalmedicinals.com/search?q=${encodeURIComponent(searchTerm)}`);
    
    // 8. Nature's Answer - search results page
    urls.push(`https://naturesanswer.com/search?q=${encodeURIComponent(searchTerm)}`);
    
    // 9. HerbEra - search results page
    urls.push(`https://herb-era.com/search?q=${encodeURIComponent(searchTerm)}`);
    
    return urls;
  }

  private async exportToTempStorage(): Promise<void> {
    try {
      const { items } = await this.dataset.getData();
      fs.writeFileSync(this.tempStoragePath, JSON.stringify(items, null, 2));
      this.logger.info(`✅ Exported ${items.length} products to ${this.tempStoragePath}`);
    } catch (error) {
      this.logger.error(`❌ Failed to export data to temporary storage:`, error);
    }
  }

  private handleScrapingError(error: any, url: string, searchTerm: string): void {
    const scrapingError: ScrapingError = {
      type: this.categorizeError(error),
      message: error.message || 'Unknown error',
      site: this.extractSiteFromUrl(url),
      url,
      timestamp: new Date(),
      retryable: this.isRetryableError(error)
    };
    
    this.session.errors.push(scrapingError);
    
    if (scrapingError.type === 'BLOCKED') {
      this.logger.warn(`⚠️ Site ${scrapingError.site} is blocked. Consider VPN switch.`);
    }
  }

  private categorizeError(error: any): 'CAPTCHA' | 'BLOCKED' | 'NETWORK' | 'PARSE' | 'QUALITY' {
    if (error.message?.includes('captcha')) return 'CAPTCHA';
    if (error.message?.includes('blocked') || error.message?.includes('403')) return 'BLOCKED';
    if (error.message?.includes('network') || error.message?.includes('timeout')) return 'NETWORK';
    if (error.message?.includes('parse') || error.message?.includes('selector')) return 'PARSE';
    return 'NETWORK';
  }

  private isRetryableError(error: any): boolean {
    return ['NETWORK', 'TIMEOUT'].includes(this.categorizeError(error));
  }

  private generateSessionId(): string {
    return `crawlee_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Public methods for external control
  pause(): void {
    this.session.status = 'PAUSED';
    this.logger.info('⏸️ Scraping paused');
  }

  resume(): void {
    this.session.status = 'RUNNING';
    this.logger.info('▶️ Scraping resumed');
  }

  stop(): void {
    this.session.status = 'COMPLETED';
    this.logger.info('⏹️ Scraping stopped');
  }

  getStatus(): ScrapingSession {
    return { ...this.session };
  }

  getProgress(): ScrapingProgress {
    return { ...this.session.progress };
  }
}