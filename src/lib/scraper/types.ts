export interface ScrapedProduct {
  name: string;
  price: string;
  imageUrl: string;
  description?: string;
  availability?: string;
  site: string;
  url: string;
  scrapedAt: Date;
}

export interface ScrapingProgress {
  totalProducts: number;
  scrapedProducts: number;
  failedProducts: number;
  currentSite: string;
  currentProduct: string;
  startTime: Date;
  estimatedTimeRemaining: number;
  successRate: number;
}

export interface ScrapingSession {
  id: string;
  startTime: Date;
  status: 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'ERROR';
  progress: ScrapingProgress;
  errors: ScrapingError[];
  lastSavedProduct: number;
}

export interface ScrapingError {
  type: 'CAPTCHA' | 'BLOCKED' | 'NETWORK' | 'PARSE' | 'QUALITY';
  message: string;
  site: string;
  url: string;
  timestamp: Date;
  retryable: boolean;
}

export interface SiteConfig {
  name: string;
  baseUrl: string;
  rateLimit: number; // requests per second
  userAgents: string[];
  retryAttempts: number;
  timeout: number;
  requiresMobile: boolean;
}

export interface QualitySpecs {
  priceRanges: {
    herbs: { min: number; max: number };
    supplements: { min: number; max: number };
  };
  brands: {
    approved: string[];
    blocked: string[];
  };
  minDescriptionLength: number;
}
