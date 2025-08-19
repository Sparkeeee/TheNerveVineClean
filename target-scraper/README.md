# Target Scraper

A modular web scraping framework with site-specific extractors for various e-commerce sites.

## Project Structure

```
target-scraper/
├── src/
│   ├── extractors/
│   │   ├── vitacost/
│   │   │   └── VitacostSearchExtractor.js
│   │   ├── amazon/
│   │   ├── target/
│   │   └── iherb/
│   └── test-runners/
│       └── VitacostExtractorTest.js
├── package.json
├── README.md
└── simple-crawler.js
```

## Features

- **Modular Design**: Each site has its own dedicated extractor
- **Multiple Browser Support**: Works with both Puppeteer and Playwright
- **Comprehensive Testing**: Built-in test runners for each extractor
- **Error Handling**: Robust error handling and retry mechanisms
- **Data Export**: Multiple output formats (JSON, CSV)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Install Puppeteer browsers (if needed):
```bash
npx puppeteer browsers install chrome
```

## Usage

### Testing the Vitacost Extractor

Run the test suite to verify the extractor works correctly:

```bash
# Run tests with visible browser
npm test

# Run tests in headless mode
npm run test:headless
```

### Using the Extractor Programmatically

```javascript
const VitacostSearchExtractor = require('./src/extractors/vitacost/VitacostSearchExtractor');
const puppeteer = require('puppeteer');

async function example() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    // Navigate to a Vitacost search page
    await page.goto('https://www.vitacost.com/productsearch.aspx?t=l-theanine');
    
    // Extract data
    const extractor = new VitacostSearchExtractor();
    const data = await extractor.extract(page);
    
    console.log(`Extracted ${data.totalProducts} products`);
    console.log(`Current page: ${data.pagination.currentPage}`);
    console.log(`Total pages: ${data.pagination.totalPages}`);
    
    await browser.close();
}

example().catch(console.error);
```

## Vitacost Extractor Features

The `VitacostSearchExtractor` is specifically designed for Vitacost search results pages and can extract:

### Product Information
- Product name and URL
- Price and price per serving
- Rating and review count
- Brand information
- Product images
- SKU numbers
- Availability status
- Special badges and features

### Pagination Data
- Current page number
- Total pages available
- Total product count
- Next/previous page URLs
- All available page URLs

### Search Metadata
- Search terms
- Sort options
- Applied filters
- Breadcrumb navigation

## Extractor Methods

### Core Methods
- `extract(page, options)` - Main extraction method
- `extractProducts(page)` - Extract product listings
- `extractPaginationInfo(page)` - Extract pagination data
- `extractSearchMetadata(page)` - Extract search context

### Helper Methods
- `hasMoreResults(page)` - Check if more pages exist
- `extractNextPageUrl(page)` - Get next page URL
- `getAllPageUrls(page)` - Get all available page URLs

## Testing

The test runner (`VitacostExtractorTest`) automatically tests:

1. **Multiple Search Terms**: Tests with different supplement searches
2. **Data Extraction**: Verifies all extractor methods work correctly
3. **Error Handling**: Tests error scenarios and edge cases
4. **Output Generation**: Saves test results and extracted data

### Test Output

Tests generate detailed output files:
- `vitacost-test-results-[timestamp].json` - Overall test results
- `vitacost-data-[search-term]-[timestamp].json` - Extracted data for each test

## Configuration

### Browser Options
- **Headless Mode**: Set `headless: true` for automated runs
- **User Agent**: Customizable browser fingerprinting
- **Viewport**: Configurable browser dimensions

### Extraction Options
- **Timeout Settings**: Configurable wait times
- **Retry Logic**: Automatic retry on failures
- **Rate Limiting**: Built-in delays between requests

## Error Handling

The extractor includes comprehensive error handling:

- **Page Load Failures**: Graceful handling of timeouts
- **Missing Elements**: Fallback selectors and default values
- **Network Issues**: Retry mechanisms for failed requests
- **Blocking Detection**: Identifies anti-bot measures

## Contributing

To add a new site extractor:

1. Create a new directory in `src/extractors/[site-name]/`
2. Implement the extractor class with required methods
3. Create a corresponding test runner
4. Update the main README with documentation

## License

MIT License - see LICENSE file for details.

## Support

For issues or questions:
1. Check the test output for error details
2. Verify the target site structure hasn't changed
3. Review the extractor selectors for accuracy
4. Check browser console for JavaScript errors
