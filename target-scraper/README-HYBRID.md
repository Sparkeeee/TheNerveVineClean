# Hybrid Scraper System

## Overview
This hybrid system combines **Crawlee's URL discovery** with **your proven button logic** for reliable, scalable product scraping.

## How It Works
1. **Crawlee** finds product URLs from search pages (handles anti-detection, retries, concurrency)
2. **Your manual scraper** processes each URL individually (reliable, proven selectors)
3. **Best of both worlds**: Scalability + reliability

## File Structure
```
src/
├── hybrid-scraper.ts      # Main orchestrator (Crawlee for URL discovery)
├── manual-scraper.ts      # Your proven button logic for individual products
├── site-handlers/         # Site-specific URL extractors
│   ├── index.ts          # Routes to correct site handler
│   ├── amazon.ts         # Amazon search page URL extraction
│   ├── target.ts         # Target search page URL extraction
│   ├── iherb.ts          # iHerb search page URL extraction
│   └── vitacost.ts       # Vitacost search page URL extraction
├── utils/
│   └── pagination.ts     # Shared pagination helper for all sites
└── test-hybrid.ts        # Test script
```

## Supported Sites
- ✅ **Amazon** - Product search and extraction
- ✅ **Target** - Product search and extraction  
- ✅ **iHerb** - Product search and extraction
- ✅ **Vitacost** - Product search and extraction

## Usage

### Run the Hybrid Scraper
```bash
npm run hybrid-scraper
```

### Test the System
```bash
npm run test:hybrid
```

## Configuration
Edit `hybrid-scraper.ts` to add more herbs, product types, or sites:

```typescript
const requests: ScrapeRequest[] = [
    { herb: 'ashwagandha', type: 'tincture', site: 'amazon', maxResults: 10 },
    { herb: 'ashwagandha', type: 'capsule', site: 'amazon', maxResults: 10 },
    { herb: 'echinacea', type: 'tincture', site: 'target', maxResults: 10 },
    { herb: 'ashwagandha', type: 'tincture', site: 'iherb', maxResults: 10 },
    { herb: 'ashwagandha', type: 'tincture', site: 'vitacost', maxResults: 10 },
    // Add more as needed
];
```

## Benefits
- ✅ **No manual intervention** - fully automated
- ✅ **Keeps your working logic** - proven selectors intact
- ✅ **Scalable** - handles hundreds of products
- ✅ **Reliable** - uses your tested extraction methods
- ✅ **Anti-detection** - Crawlee handles blocking/retries
- ✅ **Multi-site support** - Amazon, Target, iHerb, Vitacost
- ✅ **Pagination support** - automatically handles multiple pages

## Output
Results are saved to `storage/datasets/default/` in JSON format, just like before.

## Adding New Sites
1. Create new handler in `site-handlers/` (e.g., `newsite.ts`)
2. Add to `site-handlers/index.ts`
3. Update search URL generation in `hybrid-scraper.ts`
4. Add site-specific extraction logic to `manual-scraper.ts`

## Shared Pagination Helper
The `utils/pagination.ts` provides a unified way to handle pagination across all sites:
- Automatically detects "Next" buttons
- Collects URLs from multiple pages
- Deduplicates results
- Configurable max pages per site

This system gives you the best of both worlds without fighting Crawlee's design!
