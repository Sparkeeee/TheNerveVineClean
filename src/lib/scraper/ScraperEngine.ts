import { ScrapedProduct, ScrapingProgress, ScrapingSession, ScrapingError, SiteConfig } from './types';
import { RateLimiter } from './RateLimiter';
import { ProgressTracker } from './ProgressTracker';
import { ErrorHandler } from './ErrorHandler';
import { QualityFilter } from './QualityFilter';
import { BaseScraper } from './sites/BaseScraper';
import { AmazonScraper } from './sites/AmazonScraper';
import { TargetScraper } from './sites/TargetScraper';
import { HerbalScraper } from './sites/HerbalScraper';
import { Logger } from './utils/Logger';
import { PrismaClient } from '@prisma/client';

export class ScraperEngine {
  private prisma: PrismaClient;
  private rateLimiter: RateLimiter;
  private progressTracker: ProgressTracker;
  private errorHandler: ErrorHandler;
  private qualityFilter: QualityFilter;
  private logger: Logger;
  private session: ScrapingSession;
  private scrapers: Map<string, BaseScraper>;

  constructor() {
    this.prisma = new PrismaClient();
    this.rateLimiter = new RateLimiter();
    this.progressTracker = new ProgressTracker();
    this.errorHandler = new ErrorHandler();
    this.qualityFilter = new QualityFilter();
    this.logger = new Logger();
    this.scrapers = new Map();
    this.initializeScrapers();
  }

  private initializeScrapers(): void {
    // Initialize site-specific scrapers
    this.scrapers.set('amazon', new AmazonScraper());
    this.scrapers.set('target', new TargetScraper());
    this.scrapers.set('vitacost', new HerbalScraper());
    this.scrapers.set('gaia-herbs', new HerbalScraper());
    this.scrapers.set('wise-woman-herbals', new HerbalScraper());
    this.scrapers.set('pacific-botanicals', new HerbalScraper());
    this.scrapers.set('traditional-medicinals', new HerbalScraper());
    this.scrapers.set('natures-answer', new HerbalScraper());
    this.scrapers.set('herbera', new HerbalScraper());
  }

  async startScrapingSession(symptomCategories: string[]): Promise<void> {
    this.logger.info('🚀 Starting The Nine Realms Scraper...');
    
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
      // Process each symptom category
      for (const category of symptomCategories) {
        await this.processSymptomCategory(category);
      }

      this.session.status = 'COMPLETED';
      this.logger.success('✅ Scraping session completed successfully!');
    } catch (error) {
      this.session.status = 'ERROR';
      this.logger.error('❌ Scraping session failed:', error);
      throw error;
    }
  }

  private async processSymptomCategory(category: string): Promise<void> {
    this.logger.info(`🌿 Processing symptom category: ${category}`);
    
    // Get products for this category from all sites
    const sitePromises = Array.from(this.scrapers.entries()).map(async ([siteName, scraper]) => {
      try {
        await this.rateLimiter.wait(siteName);
        const products = await scraper.scrapeCategory(category);
        
        // Filter products by quality
        const qualityProducts = products.filter(product => 
          this.qualityFilter.validateProduct(product)
        );

        // Save to database
        await this.saveProducts(qualityProducts);
        
        // Update progress
        this.progressTracker.updateProgress(siteName, qualityProducts.length);
        
        return qualityProducts;
      } catch (error) {
        const scrapingError = this.errorHandler.handleError(error, siteName, category);
        this.session.errors.push(scrapingError);
        
        if (scrapingError.type === 'BLOCKED') {
          this.logger.warn(`⚠️ Site ${siteName} is blocked. Pausing for manual intervention...`);
          await this.pauseForIntervention('BLOCKED', siteName);
        }
        
        return [];
      }
    });

    await Promise.allSettled(sitePromises);
  }

  private async saveProducts(products: ScrapedProduct[]): Promise<void> {
    for (const product of products) {
      try {
        await this.prisma.product.create({
          data: {
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            description: product.description,
            availability: product.availability,
            merchant: {
              connectOrCreate: {
                where: { name: product.site },
                create: { name: product.site, url: product.baseUrl }
              }
            }
          }
        });
        
        this.session.progress.scrapedProducts++;
        this.session.lastSavedProduct = this.session.progress.scrapedProducts;
      } catch (error) {
        this.logger.error(`❌ Failed to save product ${product.name}:`, error);
        this.session.progress.failedProducts++;
      }
    }
  }

  private async pauseForIntervention(type: string, site: string): Promise<void> {
    this.session.status = 'PAUSED';
    this.logger.warn(`⏸️ Paused for ${type} intervention on ${site}`);
    
    // Wait for user intervention
    await new Promise(resolve => {
      const checkInterval = setInterval(() => {
        // Check if intervention is complete
        if (this.session.status === 'RUNNING') {
          clearInterval(checkInterval);
          resolve(true);
        }
      }, 1000);
    });
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
