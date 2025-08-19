import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import * as cheerio from 'cheerio';
import { ScrapedProduct } from '../types';

export abstract class BaseScraper {
  protected httpClient: AxiosInstance;
  protected userAgents: string[];
  protected currentUserAgent: string;

  constructor() {
    this.userAgents = [
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    ];

    this.currentUserAgent = this.userAgents[0];
    this.httpClient = this.createHttpClient();
  }

  protected createHttpClient(): AxiosInstance {
    return axios.create({
      timeout: 30000,
      headers: {
        'User-Agent': this.currentUserAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    });
  }

  protected rotateUserAgent(): void {
    const currentIndex = this.userAgents.indexOf(this.currentUserAgent);
    const nextIndex = (currentIndex + 1) % this.userAgents.length;
    this.currentUserAgent = this.userAgents[nextIndex];
    
    // Update the HTTP client with new user agent
    this.httpClient = this.createHttpClient();
  }

  protected async fetchPage(url: string, config?: AxiosRequestConfig): Promise<cheerio.CheerioAPI> {
    try {
      const response = await this.httpClient.get(url, config);
      return cheerio.load(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          throw new Error('BLOCKED: Site is blocking requests');
        } else if (error.response?.status === 429) {
          throw new Error('RATE_LIMIT: Too many requests');
        } else if (error.code === 'ECONNRESET') {
          throw new Error('NETWORK: Connection reset');
        }
      }
      throw error;
    }
  }

  protected extractPrice($: cheerio.CheerioAPI): string | null {
    // Common price extraction patterns
    const priceSelectors = [
      '[data-price]',
      '.price',
      '.product-price',
      '.current-price',
      '[class*="price"]',
      'span[class*="price"]',
      'div[class*="price"]'
    ];

    for (const selector of priceSelectors) {
      const priceElement = $(selector).first();
      if (priceElement.length > 0) {
        const priceText = priceElement.text().trim();
        const price = this.cleanPrice(priceText);
        if (price) return price;
      }
    }

    return null;
  }

  protected extractImage($: cheerio.CheerioAPI): string | null {
    // Common image extraction patterns
    const imageSelectors = [
      'img[src*="product"]',
      'img[data-src*="product"]',
      '.product-image img',
      '.main-image img',
      'img[class*="product"]',
      'img[alt*="product"]'
    ];

    for (const selector of imageSelectors) {
      const imgElement = $(selector).first();
      if (imgElement.length > 0) {
        const src = imgElement.attr('src') || imgElement.attr('data-src');
        if (src) {
          return this.normalizeImageUrl(src);
        }
      }
    }

    return null;
  }

  protected extractTitle($: cheerio.CheerioAPI): string | null {
    // Common title extraction patterns
    const titleSelectors = [
      'h1',
      '.product-title',
      '.product-name',
      '[class*="title"]',
      '[class*="name"]',
      'title'
    ];

    for (const selector of titleSelectors) {
      const titleElement = $(selector).first();
      if (titleElement.length > 0) {
        const title = titleElement.text().trim();
        if (title && title.length > 5) {
          return this.cleanTitle(title);
        }
      }
    }

    return null;
  }

  protected cleanPrice(priceText: string): string | null {
    // Remove currency symbols and clean up price
    const cleaned = priceText.replace(/[^\d.,]/g, '');
    const price = parseFloat(cleaned.replace(',', '.'));
    
    if (isNaN(price) || price <= 0) return null;
    
    return price.toFixed(2);
  }

  protected cleanTitle(title: string): string {
    // Clean up product title
    return title
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s\-&.,()]/g, '')
      .trim();
  }

  protected normalizeImageUrl(url: string): string {
    // Handle relative and protocol-relative URLs
    if (url.startsWith('//')) {
      return 'https:' + url;
    } else if (url.startsWith('/')) {
      // This will need to be handled by the specific scraper
      return url;
    }
    return url;
  }

  protected decodeHtmlEntities(text: string): string {
    // Decode common HTML entities
    return text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/&rsquo;/g, "'")
      .replace(/&lsquo;/g, "'")
      .replace(/&rdquo;/g, '"')
      .replace(/&ldquo;/g, '"');
  }

  // Abstract method that each site must implement
  abstract scrapeCategory(category: string): Promise<ScrapedProduct[]>;
  
  // Abstract method for site-specific product URL generation
  abstract generateProductUrls(category: string): string[];
}
