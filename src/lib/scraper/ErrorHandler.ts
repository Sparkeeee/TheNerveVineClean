import { ScrapingError } from './types';

export class ErrorHandler {
  private errorCounts: Map<string, number> = new Map();
  private errorHistory: ScrapingError[] = [];

  handleError(error: any, site: string, category: string): ScrapingError {
    const errorType = this.categorizeError(error);
    const errorMessage = this.extractErrorMessage(error);
    
    const scrapingError: ScrapingError = {
      type: errorType,
      message: errorMessage,
      site,
      url: this.extractUrlFromError(error) || 'unknown',
      timestamp: new Date(),
      retryable: this.isRetryableError(errorType, error)
    };

    // Update error counts
    const currentCount = this.errorCounts.get(errorType) || 0;
    this.errorCounts.set(errorType, currentCount + 1);

    // Add to history
    this.errorHistory.push(scrapingError);

    // Log the error
    this.logError(scrapingError);

    return scrapingError;
  }

  private categorizeError(error: any): 'CAPTCHA' | 'BLOCKED' | 'NETWORK' | 'PARSE' | 'QUALITY' {
    const errorMessage = error.message?.toLowerCase() || '';
    const errorCode = error.code || '';
    const statusCode = error.response?.status || error.status || 0;

    // Check for specific error types
    if (errorMessage.includes('captcha') || errorMessage.includes('robot')) {
      return 'CAPTCHA';
    }

    if (errorMessage.includes('blocked') || errorMessage.includes('forbidden') || 
        statusCode === 403 || statusCode === 429) {
      return 'BLOCKED';
    }

    if (errorMessage.includes('network') || errorMessage.includes('timeout') || 
        errorMessage.includes('connection') || errorCode === 'ECONNRESET') {
      return 'NETWORK';
    }

    if (errorMessage.includes('parse') || errorMessage.includes('selector') || 
        errorMessage.includes('element not found')) {
      return 'PARSE';
    }

    // Default to network error
    return 'NETWORK';
  }

  private extractErrorMessage(error: any): string {
    if (error.message) {
      return error.message;
    }

    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    if (error.code) {
      return `Error code: ${error.code}`;
    }

    if (error.status) {
      return `HTTP ${error.status}`;
    }

    return 'Unknown error occurred';
  }

  private extractUrlFromError(error: any): string | null {
    if (error.url) return error.url;
    if (error.request?.url) return error.request.url;
    if (error.config?.url) return error.config.url;
    return null;
  }

  private isRetryableError(errorType: string, error: any): boolean {
    switch (errorType) {
      case 'CAPTCHA':
        return false; // Don't retry captchas automatically
      
      case 'BLOCKED':
        return false; // Don't retry blocked requests
      
      case 'NETWORK':
        // Retry network errors up to 3 times
        const retryCount = error.retryCount || 0;
        return retryCount < 3;
      
      case 'PARSE':
        return false; // Don't retry parsing errors
      
      case 'QUALITY':
        return false; // Don't retry quality validation failures
      
      default:
        return false;
    }
  }

  private logError(error: ScrapingError): void {
    const timestamp = error.timestamp.toISOString();
    const logMessage = `[${timestamp}] ${error.type.toUpperCase()}: ${error.site} - ${error.message}`;
    
    switch (error.type) {
      case 'CAPTCHA':
        console.log(`🔄 CAPTCHA detected on ${error.site} - Manual intervention required`);
        break;
      
      case 'BLOCKED':
        console.log(`🚫 Site ${error.site} is blocked - Consider VPN switch`);
        break;
      
      case 'NETWORK':
        console.log(`🌐 Network error on ${error.site} - Will retry if possible`);
        break;
      
      case 'PARSE':
        console.log(`🔍 Parse error on ${error.site} - Check selectors`);
        break;
      
      case 'QUALITY':
        console.log(`✅ Quality filter rejected product from ${error.site}`);
        break;
      
      default:
        console.log(`❓ Unknown error on ${error.site}: ${error.message}`);
    }
  }

  // Public methods for error analysis
  getErrorCounts(): Map<string, number> {
    return new Map(this.errorCounts);
  }

  getErrorHistory(): ScrapingError[] {
    return [...this.errorHistory];
  }

  getErrorsBySite(site: string): ScrapingError[] {
    return this.errorHistory.filter(error => error.site === site);
  }

  getErrorsByType(type: string): ScrapingError[] {
    return this.errorHistory.filter(error => error.type === type);
  }

  getRecentErrors(limit: number = 10): ScrapingError[] {
    return this.errorHistory
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Error recovery suggestions
  getRecoverySuggestions(errorType: string): string[] {
    switch (errorType) {
      case 'CAPTCHA':
        return [
          'Solve captcha manually',
          'Wait for captcha to expire',
          'Consider using different user agent'
        ];
      
      case 'BLOCKED':
        return [
          'Switch VPN location',
          'Wait for IP block to expire',
          'Reduce request frequency',
          'Use residential proxies'
        ];
      
      case 'NETWORK':
        return [
          'Check internet connection',
          'Wait and retry',
          'Increase timeout values',
          'Use different network'
        ];
      
      case 'PARSE':
        return [
          'Check if website structure changed',
          'Update CSS selectors',
          'Verify page is fully loaded',
          'Check for JavaScript errors'
        ];
      
      case 'QUALITY':
        return [
          'Review quality filter settings',
          'Check product data validity',
          'Adjust price ranges',
          'Update brand lists'
        ];
      
      default:
        return ['Review error logs', 'Check system configuration'];
    }
  }

  // Reset error tracking
  reset(): void {
    this.errorCounts.clear();
    this.errorHistory = [];
  }

  // Get error summary
  getErrorSummary(): any {
    const totalErrors = this.errorHistory.length;
    const errorTypes = Object.fromEntries(this.errorCounts);
    const sitesWithErrors = new Set(this.errorHistory.map(e => e.site));
    
    return {
      totalErrors,
      errorTypes,
      sitesWithErrors: Array.from(sitesWithErrors),
      mostCommonError: this.getMostCommonError(),
      errorRate: this.calculateErrorRate()
    };
  }

  private getMostCommonError(): string | null {
    if (this.errorCounts.size === 0) return null;
    
    let maxCount = 0;
    let mostCommon = '';
    
    for (const [type, count] of this.errorCounts.entries()) {
      if (count > maxCount) {
        maxCount = count;
        mostCommon = type;
      }
    }
    
    return mostCommon;
  }

  private calculateErrorRate(): number {
    // This would need to be calculated based on total requests
    // For now, return a simple percentage of errors vs successful operations
    return this.errorHistory.length > 0 ? 
      (this.errorHistory.length / (this.errorHistory.length + 100)) * 100 : 0;
  }
}
