export class RateLimiter {
  private siteDelays: Map<string, number> = new Map();
  private lastRequestTime: Map<string, number> = new Map();
  private errorCounts: Map<string, number> = new Map();

  constructor() {
    // Initialize default delays for each site (in milliseconds)
    this.siteDelays.set('amazon', 5000);        // 5 seconds
    this.siteDelays.set('target', 5000);        // 5 seconds
    this.siteDelays.set('vitacost', 5000);      // 5 seconds
    this.siteDelays.set('gaia-herbs', 3000);    // 3 seconds
    this.siteDelays.set('wise-woman-herbals', 3000); // 3 seconds
    this.siteDelays.set('pacific-botanicals', 3000);  // 3 seconds
    this.siteDelays.set('traditional-medicinals', 3000); // 3 seconds
    this.siteDelays.set('natures-answer', 3000); // 3 seconds
    this.siteDelays.set('herbera', 3000);       // 3 seconds
  }

  async wait(siteName: string): Promise<void> {
    const currentTime = Date.now();
    const lastRequest = this.lastRequestTime.get(siteName) || 0;
    const delay = this.siteDelays.get(siteName) || 5000;

    // Calculate time since last request
    const timeSinceLastRequest = currentTime - lastRequest;
    
    if (timeSinceLastRequest < delay) {
      const waitTime = delay - timeSinceLastRequest;
      await this.sleep(waitTime);
    }

    // Update last request time
    this.lastRequestTime.set(siteName, Date.now());
  }

  // Adaptive rate limiting - increase delays on errors
  increaseDelay(siteName: string, errorType: string): void {
    const currentDelay = this.siteDelays.get(siteName) || 5000;
    let newDelay = currentDelay;

    switch (errorType) {
      case 'RATE_LIMIT':
        newDelay = Math.min(currentDelay * 2, 30000); // Max 30 seconds
        break;
      case 'BLOCKED':
        newDelay = Math.min(currentDelay * 3, 60000); // Max 1 minute
        break;
      case 'CAPTCHA':
        newDelay = Math.min(currentDelay * 1.5, 20000); // Max 20 seconds
        break;
      case 'NETWORK':
        newDelay = Math.min(currentDelay * 1.2, 15000); // Max 15 seconds
        break;
    }

    this.siteDelays.set(siteName, newDelay);
    console.log(`🔄 Increased delay for ${siteName} to ${newDelay}ms due to ${errorType}`);
  }

  // Reset delays after successful requests
  resetDelay(siteName: string): void {
    const defaultDelays: { [key: string]: number } = {
      'amazon': 5000,
      'target': 5000,
      'vitacost': 5000,
      'gaia-herbs': 3000,
      'wise-woman-herbals': 3000,
      'pacific-botanicals': 3000,
      'traditional-medicinals': 3000,
      'natures-answer': 3000,
      'herbera': 3000
    };

    const defaultDelay = defaultDelays[siteName] || 5000;
    this.siteDelays.set(siteName, defaultDelay);
    this.errorCounts.set(siteName, 0);
  }

  // Get current delay for a site
  getCurrentDelay(siteName: string): number {
    return this.siteDelays.get(siteName) || 5000;
  }

  // Get all current delays
  getAllDelays(): Map<string, number> {
    return new Map(this.siteDelays);
  }

  // Sleep utility
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Emergency stop - set all delays to maximum
  emergencyStop(): void {
    for (const [siteName] of this.siteDelays) {
      this.siteDelays.set(siteName, 60000); // 1 minute
    }
    console.log('🚨 Emergency stop activated - all delays set to maximum');
  }

  // Resume normal operation
  resumeNormal(): void {
    this.resetDelay('amazon');
    this.resetDelay('target');
    this.resetDelay('vitacost');
    this.resetDelay('gaia-herbs');
    this.resetDelay('wise-woman-herbals');
    this.resetDelay('pacific-botanicals');
    this.resetDelay('traditional-medicinals');
    this.resetDelay('natures-answer');
    this.resetDelay('herbera');
    console.log('✅ Normal operation resumed');
  }
}
