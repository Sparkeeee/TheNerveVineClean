import chalk from 'chalk';

export class Logger {
  info(message: string, ...args: any[]): void {
    console.log(chalk.blue('ℹ️  INFO:'), message, ...args);
  }

  success(message: string, ...args: any[]): void {
    console.log(chalk.green('✅ SUCCESS:'), message, ...args);
  }

  warn(message: string, ...args: any[]): void {
    console.log(chalk.yellow('⚠️  WARNING:'), message, ...args);
  }

  error(message: string, ...args: any[]): void {
    console.log(chalk.red('❌ ERROR:'), message, ...args);
  }

  debug(message: string, ...args: any[]): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(chalk.gray('🐛 DEBUG:'), message, ...args);
    }
  }

  // Special logging for scraper operations
  scraperStart(site: string, category: string): void {
    console.log(chalk.cyan(`🚀 Starting scraper for ${site} - ${category}`));
  }

  scraperSuccess(site: string, productsFound: number): void {
    console.log(chalk.green(`✅ ${site}: Found ${productsFound} products`));
  }

  scraperError(site: string, error: any): void {
    console.log(chalk.red(`❌ ${site}: ${error.message || 'Unknown error'}`));
  }

  progress(current: number, total: number, site: string): void {
    const percentage = Math.round((current / total) * 100);
    const bar = this.createProgressBar(percentage);
    console.log(chalk.cyan(`📊 Progress: [${bar}] ${percentage}% (${current}/${total}) - ${site}`));
  }

  private createProgressBar(percentage: number): string {
    const filled = Math.round(percentage / 5);
    const empty = 20 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  }

  // Banner methods
  showBanner(): void {
    console.log('\n');
    console.log(chalk.cyan.bold('╔══════════════════════════════════════════════════════════════════════════════╗'));
    console.log(chalk.cyan.bold('║                    🚀 THE NINE REALMS SCRAPER - CRAWLEE                    ◑'));
    console.log(chalk.cyan.bold('║                              Status: INITIALIZING                           ◑'));
    console.log(chalk.cyan.bold('╠══════════════════════════════════════════════════════════════════════════════╣'));
    console.log(chalk.cyan.bold('║                                                                              ◑'));
    console.log(chalk.cyan.bold('║  🌟 MISSION STATUS:                                                         ◑'));
    console.log(chalk.cyan.bold('║     • Target: 66 Symptom Categories                                        ◑'));
    console.log(chalk.cyan.bold('║     • Objective: Product Population                                        ◑'));
    console.log(chalk.cyan.bold('║     • Current Phase: Phase 1 of 4                                          ◑'));
    console.log(chalk.cyan.bold('║                                                                              ◑'));
    console.log(chalk.cyan.bold('║  🎯 REAL-TIME METRICS:                                                     ◑'));
    console.log(chalk.cyan.bold('║     • Products Scraped: [██████████] 0 / 2,000 (0%)                         ◑'));
    console.log(chalk.cyan.bold('║     • Success Rate: [████████████████████] 0%                               ◑'));
    console.log(chalk.cyan.bold('║     • Current Speed: 0 products/hour                                        ◑'));
    console.log(chalk.cyan.bold('║     • Active Sites: 0/9 realms engaged                                      ◑'));
    console.log(chalk.cyan.bold('║                                                                              ◑'));
    console.log(chalk.cyan.bold('║  🔧 SYSTEM STATUS:                                                         ◑'));
    console.log(chalk.cyan.bold('║     • Rate Limiting: [████████████████████] OPTIMAL                          ◑'));
    console.log(chalk.cyan.bold('║     • Memory Usage: [████████████████████] 0%                               ◑'));
    console.log(chalk.cyan.bold('║     • Database: [████████████████████] HEALTHY                              ◑'));
    console.log(chalk.cyan.bold('║                                                                              ◑'));
    console.log(chalk.cyan.bold('╚══════════════════════════════════════════════════════════════════════════════╝'));
    console.log('\n');
  }

  updateBanner(progress: any, status: any): void {
    // Clear screen and redraw banner
    process.stdout.write('\x1B[2J\x1B[0f');
    this.showBanner();
    
    // Update with real progress
    const percentage = Math.round((progress.scrapedProducts / progress.totalProducts) * 100) || 0;
    const successRate = Math.round(progress.successRate) || 0;
    
    console.log(chalk.green.bold(`     • Products Scraped: [${this.createProgressBar(percentage)}] ${progress.scrapedProducts} / ${progress.totalProducts} (${percentage}%)`));
    console.log(chalk.green.bold(`     • Success Rate: [${this.createProgressBar(successRate)}] ${successRate}%`));
    console.log(chalk.green.bold(`     • Current Speed: ${Math.round(progress.scrapedProducts / Math.max(1, (Date.now() - progress.startTime.getTime()) / 3600000))} products/hour`));
    console.log(chalk.green.bold(`     • Active Sites: ${status.status === 'RUNNING' ? '9/9' : '0/9'} realms engaged`));
  }
}
