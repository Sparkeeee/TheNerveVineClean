# Web Scraping Implementation Guide

## Overview

This guide covers implementing web scraping for product data extraction using Puppeteer and Cheerio, with a focus on legal compliance and best practices.

## Tools Comparison

### Cheerio (Recommended for Static Content)
**Pros:**
- Lightweight and fast
- Server-side only
- Easy to implement
- Free and open source

**Cons:**
- Can't handle JavaScript-rendered content
- Limited to static HTML

**Best for:** Simple product pages with static content

### Puppeteer (Recommended for Dynamic Content)
**Pros:**
- Full browser automation
- Handles JavaScript-rendered content
- Can interact with pages (click, scroll, etc.)
- Free and open source

**Cons:**
- Resource intensive
- Slower than Cheerio
- More complex setup

**Best for:** Modern e-commerce sites with dynamic content

## Legal Considerations

### ✅ Generally Legal
- Public product information
- Product names, prices, descriptions
- Images (with proper attribution)
- Reviews and ratings

### ⚠️ Be Cautious
- Personal user data
- Proprietary algorithms
- Rate limiting violations
- Terms of service violations

### ❌ Avoid
- Scraping private/authenticated content
- Circumventing security measures
- Excessive request rates
- Commercial use without permission

## Implementation Strategy

### Phase 1: Basic Implementation (Current)
```typescript
// Current implementation in batch-import/route.ts
async function extractProductFromUrl(url: string) {
  // Basic URL parsing
  // Domain detection
  // Simple data extraction
}
```

### Phase 2: Cheerio Implementation
```typescript
import * as cheerio from 'cheerio';

async function extractProductWithCheerio(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ProductBot/1.0)'
      }
    });
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Domain-specific selectors
    const selectors = getSelectorsForDomain(url);
    
    return {
      name: $(selectors.name).text().trim(),
      price: extractPrice($(selectors.price).text()),
      imageUrl: $(selectors.image).attr('src'),
      description: $(selectors.description).text().trim()
    };
  } catch (error) {
    console.error('Cheerio extraction failed:', error);
    return null;
  }
}
```

### Phase 3: Puppeteer Implementation
```typescript
import puppeteer from 'puppeteer';

async function extractProductWithPuppeteer(url: string) {
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set user agent
    await page.setUserAgent('Mozilla/5.0 (compatible; ProductBot/1.0)');
    
    // Navigate to page
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Wait for content to load
    await page.waitForSelector('body', { timeout: 10000 });
    
    // Extract data
    const productData = await page.evaluate(() => {
      const selectors = getSelectorsForCurrentDomain();
      
      return {
        name: document.querySelector(selectors.name)?.textContent?.trim(),
        price: extractPriceFromText(document.querySelector(selectors.price)?.textContent),
        imageUrl: document.querySelector(selectors.image)?.getAttribute('src'),
        description: document.querySelector(selectors.description)?.textContent?.trim()
      };
    });
    
    return productData;
  } catch (error) {
    console.error('Puppeteer extraction failed:', error);
    return null;
  } finally {
    if (browser) await browser.close();
  }
}
```

## Domain-Specific Selectors

### Amazon
```typescript
const amazonSelectors = {
  name: '#productTitle',
  price: '.a-price-whole, .a-price .a-offscreen',
  image: '#landingImage, #imgBlkFront',
  description: '#productDescription p, #feature-bullets ul'
};
```

### iHerb
```typescript
const iherbSelectors = {
  name: '.product-title, h1.product-name',
  price: '.price, .product-price',
  image: '.product-image img, .gallery-image',
  description: '.product-description, .product-details'
};
```

### Vitacost
```typescript
const vitacostSelectors = {
  name: '.product-name, h1',
  price: '.price, .product-price',
  image: '.product-image img',
  description: '.product-description, .product-details'
};
```

## Rate Limiting & Best Practices

### 1. Respectful Scraping
```typescript
// Add delays between requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

for (const url of urls) {
  await extractProduct(url);
  await delay(2000); // 2 second delay
}
```

### 2. User Agent Rotation
```typescript
const userAgents = [
  'Mozilla/5.0 (compatible; ProductBot/1.0)',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
];

const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
```

### 3. Error Handling
```typescript
async function robustExtraction(url: string) {
  const maxRetries = 3;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await extractProduct(url);
    } catch (error) {
      if (attempt === maxRetries) {
        console.error(`Failed to extract ${url} after ${maxRetries} attempts`);
        return null;
      }
      
      // Exponential backoff
      await delay(1000 * Math.pow(2, attempt));
    }
  }
}
```

## Installation & Setup

### 1. Install Dependencies
```bash
npm install cheerio puppeteer
```

### 2. Environment Variables
```env
# .env.local
SCRAPING_ENABLED=true
SCRAPING_DELAY=2000
SCRAPING_TIMEOUT=30000
```

### 3. Configuration
```typescript
// lib/scraping-config.ts
export const SCRAPING_CONFIG = {
  enabled: process.env.SCRAPING_ENABLED === 'true',
  delay: parseInt(process.env.SCRAPING_DELAY || '2000'),
  timeout: parseInt(process.env.SCRAPING_TIMEOUT || '30000'),
  maxRetries: 3,
  supportedDomains: ['amazon.com', 'iherb.com', 'vitacost.com']
};
```

## Integration with Product Hunt Dashboard

### 1. Enhanced Batch Import
- Add scraping options to batch import modal
- Show progress indicators
- Handle errors gracefully

### 2. Quality Assessment
- Use scraped data to auto-assess product quality
- Apply quality specifications to imported products
- Flag products for manual review

### 3. Workflow Integration
- Imported products appear as "pending review"
- Admin can approve/reject in product hunt dashboard
- Bulk actions for multiple products

## Monitoring & Analytics

### 1. Success Rates
```typescript
const scrapingStats = {
  totalRequests: 0,
  successfulExtractions: 0,
  failedExtractions: 0,
  averageResponseTime: 0
};
```

### 2. Error Tracking
```typescript
const errorLog = {
  domain: string,
  error: string,
  timestamp: Date,
  url: string
};
```

## Cost Considerations

### Free Tools
- **Cheerio**: Free
- **Puppeteer**: Free
- **Basic hosting**: $5-20/month

### Optional Paid Services
- **Proxy rotation**: $10-50/month
- **Advanced hosting**: $20-100/month
- **Legal compliance**: $100-500/month

## Amazon Associates Compliance

### ✅ Compliant Practices
- Scraping for product research
- Using data for content creation
- Respecting rate limits
- Following robots.txt

### ⚠️ Be Careful
- Don't scrape Amazon's affiliate links
- Don't compete directly with Amazon
- Don't violate their terms of service

### 📋 Best Practices
1. Use official Amazon APIs when possible
2. Focus on product information, not pricing
3. Add value through content and curation
4. Maintain transparency about data sources

## Implementation Timeline

### Week 1: Basic Setup
- Install dependencies
- Configure environment
- Implement basic Cheerio extraction

### Week 2: Enhanced Features
- Add Puppeteer for dynamic content
- Implement rate limiting
- Add error handling

### Week 3: Integration
- Connect to product hunt dashboard
- Add quality assessment
- Implement approval workflow

### Week 4: Optimization
- Performance tuning
- Monitoring setup
- Legal compliance review

## Conclusion

Web scraping can be a powerful tool for product data extraction when implemented responsibly. Start with Cheerio for simple sites, then add Puppeteer for complex ones. Always respect rate limits and terms of service, and focus on adding value rather than competing directly with the sites you're scraping. 