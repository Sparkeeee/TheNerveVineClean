# 🚀 The Nine Realms Scraper - Crawlee Powered

**Enterprise-grade web scraping for NerveVine's cascade system, powered by [Crawlee](https://crawlee.dev/)**

## 🌟 Features

### **Core Capabilities**
- **9 Working Sites**: Amazon, Target, Vitacost, Gaia Herbs, Wise Woman Herbals, Pacific Botanicals, Traditional Medicinals, Nature's Answer, HerbEra
- **66 Symptom Categories**: Comprehensive coverage of herbal wellness conditions
- **Quality Filtering**: Built-in validation for price ranges, brand quality, and content standards
- **Real-time Progress**: Beautiful CLI interface with live updates

### **Enterprise Features (Powered by Crawlee)**
- **Anti-Detection**: Built-in browser fingerprinting and user agent rotation
- **Proxy Support**: Easy integration with residential and datacenter proxies
- **Session Management**: Intelligent session pooling and rotation
- **Error Recovery**: Sophisticated retry mechanisms with exponential backoff
- **Rate Limiting**: Adaptive delays based on site responses

### **VPN Integration**
- **Block Detection**: Automatic detection of IP blocks
- **Graceful Pausing**: Pause execution when blocked for manual VPN switch
- **Resume Capability**: Continue from last successful point
- **IP Logging**: Track which IPs work for which sites

## 🛠️ Installation

### **1. Install Dependencies**
```bash
npm install
```

### **2. Install Playwright Browsers**
```bash
npx playwright install
```

### **3. Verify Prisma Setup**
```bash
npx prisma generate
```

## 🚀 Usage

### **Start Scraping Session**
```bash
npm run scraper:start
```

### **Development Mode (Watch for Changes)**
```bash
npm run scraper:dev
```

### **Target Specific Categories**
```bash
# Edit src/scripts/start-scraper.ts to modify categories
const categories = [
  'stress',
  'anxiety', 
  'depression',
  'insomnia',
  'fatigue'
];
```

## 🏗️ Architecture

### **Core Components**
```
src/lib/scraper/
├── CrawleeScraperEngine.ts    # Main orchestration with Crawlee
├── types.ts                   # TypeScript interfaces
├── utils/
│   ├── Logger.ts             # Beautiful console output
│   ├── ProgressTracker.ts    # Real-time progress monitoring
│   └── ErrorHandler.ts       # Sophisticated error management
└── QualityFilter.ts          # Product validation
```

### **Crawlee Integration**
- **PlaywrightCrawler**: Full browser automation for JavaScript-heavy sites
- **Dataset Management**: Built-in data storage and export
- **Session Pooling**: Intelligent browser session management
- **Request Queuing**: Sophisticated URL processing

## 🎯 How It Works

### **1. Session Initialization**
- Creates new scraping session with unique ID
- Initializes progress tracking and error handling
- Sets up Crawlee crawler with anti-detection settings

### **2. Category Processing**
- Processes each symptom category sequentially
- Creates site-specific starting URLs
- Launches Crawlee crawler for each category

### **3. Product Extraction**
- Uses Playwright for dynamic content extraction
- Applies quality filters to validate products
- Stores results in Crawlee dataset

### **4. Database Integration**
- Exports data from Crawlee dataset
- Saves validated products to Prisma database
- Updates progress tracking in real-time

## 🔧 Configuration

### **Quality Filter Settings**
```typescript
// Edit src/lib/scraper/QualityFilter.ts
private priceRanges = {
  herbs: { min: 5, max: 50 },
  supplements: { min: 10, max: 100 }
};

private approvedBrands = [
  'Gaia Herbs',
  'Nature\'s Answer',
  'Traditional Medicinals'
  // Add more brands...
];
```

### **Rate Limiting**
```typescript
// Built into Crawlee - automatically handles:
// - Request delays
// - Session rotation
// - Error backoff
// - Proxy rotation (if configured)
```

### **Anti-Detection Settings**
```typescript
// Crawlee automatically handles:
// - Browser fingerprinting
// - User agent rotation
// - Session management
// - Cookie handling
```

## 🚨 Error Handling

### **Error Types**
- **CAPTCHA**: Manual intervention required
- **BLOCKED**: Site blocking detected, VPN switch recommended
- **NETWORK**: Connection issues, automatic retry
- **PARSE**: Selector issues, check website structure
- **QUALITY**: Product validation failed

### **Recovery Actions**
- **Automatic**: Network errors retry with backoff
- **Manual**: CAPTCHA solving, VPN switching
- **Adaptive**: Rate limiting adjusts based on errors

## 📊 Monitoring

### **Real-time Metrics**
- Products scraped vs. total
- Success rate percentage
- Current processing speed
- Active site status
- Error counts by type

### **Progress Tracking**
- Live progress bars
- ETA calculations
- Site-specific progress
- Session statistics

## 🔒 Security & Ethics

### **Rate Limiting**
- Conservative delays (3-5 seconds between requests)
- Adaptive backoff on errors
- Respect for robots.txt (handled by Crawlee)

### **Data Quality**
- Only saves validated products
- Filters out spam and low-quality content
- Respects site terms of service

## 🚀 Performance

### **Expected Throughput**
- **Conservative**: 100-200 products/hour
- **Optimal**: 300-500 products/hour
- **Success Rate**: 85%+ with quality filtering

### **Resource Usage**
- **Memory**: ~200-500MB during operation
- **CPU**: Moderate usage during page processing
- **Network**: Controlled bandwidth usage

## 🛠️ Troubleshooting

### **Common Issues**

#### **"Playwright browsers not found"**
```bash
npx playwright install
```

#### **"Prisma client not generated"**
```bash
npx prisma generate
```

#### **"Site blocking detected"**
- Switch VPN location
- Wait for IP block to expire
- Reduce scraping frequency

#### **"Captcha detected"**
- Manual intervention required
- Wait for captcha to expire
- Consider different user agent

### **Debug Mode**
```bash
# Set environment variable for detailed logging
NODE_ENV=development npm run scraper:start
```

## 🔮 Future Enhancements

### **Planned Features**
- **Web Dashboard**: Browser-based monitoring interface
- **Proxy Rotation**: Automated IP switching
- **Captcha Solving**: Integration with 2captcha/anti-captcha
- **Batch Processing**: Process multiple categories simultaneously
- **Data Export**: CSV, JSON, Excel export options

### **Integration Opportunities**
- **Quality Specifications**: Link to your existing quality system
- **Affiliate Links**: Generate affiliate URLs for products
- **Inventory Management**: Track product availability
- **Price Monitoring**: Track price changes over time

## 📚 Resources

### **Crawlee Documentation**
- [Official Docs](https://crawlee.dev/)
- [GitHub Repository](https://github.com/apify/crawlee)
- [Examples & Tutorials](https://crawlee.dev/docs/examples)

### **Playwright Documentation**
- [Official Docs](https://playwright.dev/)
- [API Reference](https://playwright.dev/docs/api/class-playwright)

### **Prisma Documentation**
- [Official Docs](https://www.prisma.io/docs/)
- [Database Schema](https://www.prisma.io/docs/concepts/components/prisma-schema)

## 🤝 Support

### **Getting Help**
1. Check the troubleshooting section above
2. Review Crawlee documentation for advanced features
3. Check error logs for specific error messages
4. Verify your database connection and Prisma setup

### **Contributing**
- Follow TypeScript best practices
- Add comprehensive error handling
- Include progress tracking for new features
- Update this README for new functionality

---

**Built with ❤️ for NerveVine's cascade system**

**Powered by [Crawlee](https://crawlee.dev/) - The most reliable web scraping library**
