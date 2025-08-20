// src/extractors/amazon/config.ts

export const amazonConfig = {
    // ✅ Proxy list (rotate automatically per page)
    proxies: [
        // Example format:
        // "http://user:pass@proxy1:8000",
        // "http://user:pass@proxy2:8000",
    ],

    // ✅ Extraction settings
    maxPages: 3,       // how many result pages to crawl
    maxRetries: 3,     // retries per page if blocked/fails
    minDelayMs: 2000,  // minimum wait between pages (ms)
    maxDelayMs: 5000,  // maximum wait between pages (ms)

    // ✅ Browser settings
    headless: true,    // false = show browser window (debug mode)
};
