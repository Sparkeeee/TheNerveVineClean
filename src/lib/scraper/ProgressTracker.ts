export class ProgressTracker {
  private progress: Map<string, number> = new Map();
  private startTime: Date = new Date();
  private totalProducts: number = 0;

  updateProgress(site: string, productsFound: number): void {
    const current = this.progress.get(site) || 0;
    this.progress.set(site, current + productsFound);
    this.totalProducts += productsFound;
  }

  getProgress(): any {
    const now = new Date();
    const elapsed = now.getTime() - this.startTime.getTime();
    const hoursElapsed = elapsed / 3600000;
    
    const currentProducts = Array.from(this.progress.values()).reduce((sum, count) => sum + count, 0);
    const successRate = this.totalProducts > 0 ? (currentProducts / this.totalProducts) * 100 : 0;
    
    return {
      totalProducts: this.totalProducts,
      scrapedProducts: currentProducts,
      failedProducts: this.totalProducts - currentProducts,
      currentSite: this.getCurrentSite(),
      currentProduct: 'Processing...',
      startTime: this.startTime,
      estimatedTimeRemaining: this.calculateETA(currentProducts, hoursElapsed),
      successRate: successRate
    };
  }

  private getCurrentSite(): string {
    // Return the site with the most recent activity
    let maxCount = 0;
    let currentSite = '';
    
    for (const [site, count] of this.progress.entries()) {
      if (count > maxCount) {
        maxCount = count;
        currentSite = site;
      }
    }
    
    return currentSite || 'Initializing...';
  }

  private calculateETA(currentProducts: number, hoursElapsed: number): number {
    if (currentProducts === 0 || hoursElapsed === 0) return 0;
    
    const productsPerHour = currentProducts / hoursElapsed;
    const remainingProducts = this.totalProducts - currentProducts;
    
    return Math.round(remainingProducts / productsPerHour * 3600); // Return in seconds
  }

  reset(): void {
    this.progress.clear();
    this.startTime = new Date();
    this.totalProducts = 0;
  }

  getSiteProgress(site: string): number {
    return this.progress.get(site) || 0;
  }

  getAllSiteProgress(): Map<string, number> {
    return new Map(this.progress);
  }
}
