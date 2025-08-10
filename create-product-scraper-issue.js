const https = require('https');

// Linear API script to create a product scraper issue
const LINEAR_API_KEY = process.env.LINEAR_API_KEY || 'YOUR_API_KEY_HERE';
const TEAM_ID = process.env.LINEAR_TEAM_ID || 'YOUR_TEAM_ID_HERE';

const issueData = {
  title: "Build URL-Based Product Data Scraper",
  description: `## Objective
Create a manual input system for URL-based product data scraping to automate product information collection.

## Current Problem
- Manual product data entry is time-consuming
- Need to extract product info from various e-commerce sites
- Want to streamline affiliate product integration

## Technical Requirements
### Core Functionality
- **URL Input Interface**: Simple form to paste product URLs
- **Multi-Site Support**: Handle Amazon, iHerb, Vitacost, etc.
- **Data Extraction**: Product name, price, images, description, availability
- **Data Validation**: Ensure extracted data is complete and accurate
- **Export Options**: JSON, CSV, or direct database insertion

### Technical Stack
- **Backend**: Node.js with Puppeteer/Cheerio
- **Frontend**: Simple React form component
- **Database**: Store extracted product data
- **Error Handling**: Graceful failures for unsupported sites

## Implementation Steps
1. **Phase 1**: Basic URL input form
2. **Phase 2**: Single-site scraper (start with Amazon)
3. **Phase 3**: Multi-site support
4. **Phase 4**: Data validation and export
5. **Phase 5**: Integration with existing product system

## Success Criteria
- [ ] Can input product URL manually
- [ ] Extracts basic product info (name, price, image)
- [ ] Handles at least 3 major e-commerce sites
- [ ] Exports data in usable format
- [ ] Integrates with existing NerveVine product database

## Priority: High
## Labels: product, scraper, automation, data-collection, affiliate`,
  teamId: TEAM_ID,
  priority: 2, // High priority
  labels: ["product", "scraper", "automation", "data-collection", "affiliate"]
};

console.log('Product Scraper Issue Details');
console.log('=============================');
console.log('');
console.log('Title: Build URL-Based Product Data Scraper');
console.log('Priority: High');
console.log('Labels: product, scraper, automation, data-collection, affiliate');
console.log('');
console.log('Manual creation steps:');
console.log('1. Go to linear.app');
console.log('2. Click "New Issue"');
console.log('3. Copy the title and description above');
console.log('4. Set priority to High');
console.log('5. Add the labels listed above');
console.log('');
console.log('This issue focuses on:');
console.log('- Manual URL input system');
console.log('- Multi-site product data extraction');
console.log('- Integration with NerveVine product database');
console.log('- Automation of affiliate product collection');
