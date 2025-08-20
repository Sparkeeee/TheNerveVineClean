# Crawlee Documentation & Key Concepts

## Core Documentation Links

### Introduction Series
- **[Setting Up](https://crawlee.dev/js/docs/introduction/setting-up)** - Prerequisites, CLI setup, project creation
- **[First Crawler](https://crawlee.dev/js/docs/introduction/first-crawler)** - Basic concepts, Request/RequestQueue, requestHandler
- **[Adding URLs](https://crawlee.dev/js/docs/introduction/adding-urls)** - How crawling works, enqueueLinks, filtering
- **[Real-world Project](https://crawlee.dev/js/docs/introduction/real-world-project)** - Practical implementation examples
- **[Crawling](https://crawlee.dev/js/docs/introduction/crawling)** - Core crawling concepts and patterns
- **[Scraping](https://crawlee.dev/js/docs/introduction/scraping)** - Data extraction techniques
- **[Saving Data](https://crawlee.dev/js/docs/introduction/saving-data)** - Dataset.pushData(), storage patterns
- **[Refactoring](https://crawlee.dev/js/docs/introduction/refactoring)** - Code organization and best practices

### Advanced Guides
- **[Got Scraping](https://crawlee.dev/js/docs/guides/got-scraping)** - Advanced scraping techniques
- **[Parallel Scraping](https://crawlee.dev/js/docs/guides/parallel-scraping)** - Performance optimization
- **[Request Storage](https://crawlee.dev/js/docs/guides/request-storage)** - Managing request queues
- **[Result Storage](https://crawlee.dev/js/docs/guides/result-storage)** - Data persistence and export
- **[Custom HTTP Client](https://crawlee.dev/js/docs/guides/custom-http-client)** - Customization options

## Key Concepts Learned

### 1. **Core Architecture**
- **3 Main Crawler Classes**: CheerioCrawler, PuppeteerCrawler, PlaywrightCrawler
- **Two Core Questions**: "Where should I go?" and "What should I do there?"
- **RequestQueue**: Dynamic queue of URLs to visit
- **requestHandler**: Function that processes each page

### 2. **Data Flow Pattern**
- **enqueueLinks()**: Standard way to add new URLs to the queue
- **Dataset.pushData()**: Standard way to save extracted data
- **Request Labels**: Use `request.label` to distinguish page types (e.g., 'DETAIL' vs 'CATEGORY')
- **userData**: Pass context between requests

### 3. **Standard Two-Stage Pattern**
From the docs, the standard approach is:
1. **Category/List Pages**: Extract product URLs using `enqueueLinks()`
2. **Detail Pages**: Extract product data and save with `Dataset.pushData()`
3. **Use Labels**: `request.label === 'DETAIL'` vs `request.label === 'CATEGORY'`

### 4. **Why My Current Approach Might Be Wrong**
- I'm using custom `userData` instead of standard `request.label` patterns
- I'm manually managing data arrays instead of using `Dataset.pushData()`
- I'm not following the standard `enqueueLinks()` pattern for adding product URLs

### 5. **The Correct Pattern Should Be**
```typescript
// Search/List pages
if (request.label === 'SEARCH') {
    const productUrls = await extractProductUrls(page);
    await enqueueLinks({
        urls: productUrls,
        label: 'PRODUCT'
    });
}
// Product detail pages
else if (request.label === 'PRODUCT') {
    const productData = await extractProductData(page);
    await Dataset.pushData(productData);
}
```

## Next Steps
1. **Refactor to use standard Crawlee patterns** with `request.label`
2. **Use `enqueueLinks()`** instead of manual queue management
3. **Let `Dataset.pushData()`** handle data collection automatically
4. **Follow the documented two-stage pattern** for search → product extraction

## Key Insight
Crawlee is designed to work as a **data pipeline** where:
- **Requests flow through** the queue with labels
- **Data flows out** through the dataset
- **The framework handles** the complexity of managing this flow

My current approach is fighting against this design instead of working with it.
