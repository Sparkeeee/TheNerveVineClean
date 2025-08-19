#!/usr/bin/env ts-node

import { CrawleeScraperEngine } from '../lib/scraper/CrawleeScraperEngine';
import { Logger } from '../lib/scraper/utils/Logger';
import { ProgressTracker } from '../lib/scraper/ProgressTracker';
import chalk from 'chalk';
import ora from 'ora';
import cliProgress from 'cli-progress';

class ScraperCLI {
  private engine: CrawleeScraperEngine;
  private logger: Logger;
  private progressBar: cliProgress.SingleBar;
  private spinner: ora.Ora;

  constructor() {
    this.engine = new CrawleeScraperEngine();
    this.logger = new Logger();
    this.progressBar = new cliProgress.SingleBar({
      format: '🚀 Scraping Progress |{bar}| {percentage}% | {value}/{total} Products | ETA: {eta}s | Speed: {speed} products/s',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true
    });
    
    this.spinner = ora('Initializing The Nine Realms Scraper with Crawlee Power...');
  }

  async start(): Promise<void> {
    try {
      this.showBanner();
      
      // Get search type from user
      const searchType = await this.getSearchType();
      
      this.spinner.succeed('Crawlee-powered scraper initialized successfully!');
      
      // Start progress tracking
      this.startProgressTracking();
      
      // Start the scraping session
      await this.engine.startScrapingSession(searchType);
      
      this.progressBar.stop();
      this.logger.success('🎉 Scraping session completed successfully with Crawlee!');
      
    } catch (error) {
      this.spinner.fail('Scraping session failed');
      this.progressBar.stop();
      this.logger.error('❌ Fatal error:', error);
      process.exit(1);
    }
  }

  private showBanner(): void {
    this.logger.showBanner();
  }

  private async getSearchType(): Promise<'herbs' | 'supplements' | 'symptoms'> {
    // For now, default to herbs for testing
    // In the future, this could be interactive or read from config
    const searchType: 'herbs' | 'supplements' | 'symptoms' = 'herbs';

    this.logger.info(`🎯 Search Type: ${searchType.toUpperCase()}`);
    this.logger.info(`📋 This will search for products using ${searchType} from your database`);
    
    return searchType;
  }

  private startProgressTracking(): void {
    this.progressBar.start(100, 0); // Estimate 100 products total
    
    // Update progress every second
    const progressInterval = setInterval(() => {
      try {
        const progress = this.engine.getProgress();
        const status = this.engine.getStatus();
        
        if (status.status === 'COMPLETED' || status.status === 'ERROR') {
          clearInterval(progressInterval);
          return;
        }
        
        this.progressBar.update(progress.scrapedProducts);
        
        // Update banner with real-time data
        this.logger.updateBanner(progress, status);
        
      } catch (error) {
        // If engine methods aren't available yet, just continue
        console.log('Waiting for scraper to initialize...');
      }
      
    }, 1000);
  }
}

// Start the CLI
if (require.main === module) {
  const cli = new ScraperCLI();
  cli.start().catch(console.error);
}
