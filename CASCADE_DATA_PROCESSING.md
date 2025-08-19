# 🌿 Cascade Data Processing Pipeline

**Enterprise-grade, multi-site herb product extraction and processing system**

## 📋 **1. Overview**

**Goal**: Automated, repeatable extraction of high-quality herb & supplement products from 9 sites, with deduplication, normalization, and quality filtering, running every 2–4 weeks.

## 🏗️ **2. High-Level Architecture**

```
[Herb List / Formulation List] 
            │
            ▼
[Site-Specific URL Extractors] ──> [Raw URL Pool]
            │                         │
            │                         ▼
            ▼                 [Deduplication & Normalization]
[Unified URL Queue] ──────────────> [Clean URL Pool]
            │
            ▼
[Product Data Extractor (existing)]
            │
            ▼
[Structured Product Data Store (DB)]
            │
            ▼
[Quality Filtering Layer]
            │
            ▼
[Final Curated Product Pool]
            │
            ▼
[Reporting / Export / Dashboard]
```

## 🔧 **3. Component Breakdown**

### **A. Herb List / Formulation List**

JSON or database table containing:

```json
[
  { "herb": "Ashwagandha", "forms": ["tincture", "capsule"] },
  { "herb": "Echinacea", "forms": ["dried herb", "tincture"] }
]
```

Drives which search queries / URLs to generate per site.

### **B. Site-Specific URL Extractors**

One extractor per site, isolated modules:

- Accept herb + form
- Output raw URLs
- Handles site-specific quirks, paginations, query parameters

**Example:**
```typescript
async function extractAmazonUrls(herb, form) {
  // navigate search pages, collect product links
  return urlsArray;
}
```

### **C. Raw URL Pool**

- Temporary storage of all URLs per run
- Use a lightweight DB (LevelDB / MongoDB / SQLite) or JSON files
- Keeps raw data for debugging / auditing

### **D. Deduplication & Normalization**

Key for eliminating duplicates, especially on Amazon:

- Strip query params (`?ref=...`)
- Canonicalize product IDs (`/dp/<ID>` for Amazon)
- Store as Set or in DB with unique constraints
- Optional: cross-site deduplication by matching product name + manufacturer

### **E. Unified URL Queue**

Merge all site-specific results into a single queue, ready for product extraction.

### **F. Product Data Extractor**

Your existing extractor module:

- Accepts URLs from the unified queue
- Outputs structured JSON:

```json
{
  "name": "Organic Ashwagandha Tincture",
  "brand": "HerbPharm",
  "form": "tincture",
  "dosage": "1ml per day",
  "reviews": 450,
  "rating": 4.5,
  "price": 24.99
}
```

### **G. Structured Product Data Store**

Store extracted products with fields for:

- URL, brand, herb, form, rating, reviews, dosage, alcohol content, certifications

**DB choice:**
- **MongoDB** → flexible JSON storage, easy updates
- **SQLite** → lightweight, file-based

### **H. Quality Filtering Layer**

Apply specification rules (configurable JSON):

```json
{
  "minRating": 4.0,
  "minReviews": 50,
  "maxAlcoholPercent": 25,
  "requiredCertifications": ["organic"]
}
```

Filters products down to your curated set.

### **I. Final Curated Product Pool**

Ready for use in your site or downstream processes. Could trigger:

- Export to CSV / JSON
- Push into your existing system
- Generate reports for decision-making

### **J. Scheduler**

Use node-cron or serverless cron (AWS Lambda / GCP Cloud Functions) to:

- Run every 2–4 weeks
- Append new URLs, deduplicate, extract, and filter automatically

## 🛠️ **4. Tech Stack Recommendations**

| Layer | Technology |
|-------|------------|
| **Node.js runtime** | Node 20+ |
| **DB** | MongoDB (recommended) or SQLite |
| **URL extraction** | Puppeteer / Playwright (headless browser) |
| **Deduplication** | JS Sets + DB unique constraints |
| **Scheduler** | node-cron or serverless cron |
| **Logging / Reporting** | Winston + JSON/CSV exports |

## 📚 **5. Notes / Best Practices**

- **Site Isolation**: Keep each site extractor separate to avoid cascading failures
- **Canonicalization**: Very important for Amazon and other sites with multiple query strings
- **Incremental Updates**: Store last-run URLs or product IDs to avoid full re-scrape every run
- **Error Handling**: Wrap extractors with retry logic; log failures for later review
- **Scaling**: If the number of herbs & sites grows, consider a queue system like BullMQ to parallelize URL extraction & data extraction

---

## 🎯 **Pipeline Overview**

The Cascade Data Processing Pipeline is a repeating, multi-site, multi-product system that:

1. **Pulls raw URLs** for a wide array of herbs and forms from 9 working sites
2. **Deduplicates and normalizes** URLs into canonical formats
3. **Extracts structured product data** using existing extractors
4. **Applies quality filters** to distill the best products
5. **Repeats every 2-4 weeks** to keep the product pool fresh

## 🏗️ **Architecture Components**

### **Core Pipeline Stages**
```
Raw URL Discovery → URL Normalization → Data Extraction → Quality Filtering → Storage & Management
```

### **Data Flow**
```
9 Sites × Multiple Herbs × Multiple Forms → URL Pool → Canonical URLs → Product Data → Quality Products → Database
```

## 🔧 **Technical Implementation**

### **1. URL Normalization & Deduplication**

#### **Canonicalization Strategies**
- **Amazon**: Extract `dp/<ID>` pattern for unique product identification
- **Target**: Use product ID from URL structure
- **Vitacost**: Extract SKU or product identifier
- **Herbal Sites**: Use product slug or ID patterns

#### **Deduplication Engine**
```typescript
interface CanonicalURL {
  originalUrl: string;
  canonicalId: string;
  site: string;
  herb: string;
  form: string;
  extractedAt: Date;
  lastSeen: Date;
}

class URLNormalizer {
  normalizeAmazon(url: string): string {
    // Extract dp/<ID> pattern
    const match = url.match(/\/dp\/([A-Z0-9]{10})/);
    return match ? `https://www.amazon.com/dp/${match[1]}` : url;
  }
  
  normalizeTarget(url: string): string {
    // Extract Target product ID
    const match = url.match(/\/p\/([^\/]+)/);
    return match ? `https://www.target.com/p/${match[1]}` : url;
  }
  
  // Site-specific normalizers...
}
```

### **2. Site-Specific Extraction Engines**

#### **Isolated Extractors**
Keep your working site-specific extractors isolated and reliable:

- **Amazon**: `extractors/amazon/extractor.ts` ✅ Working
- **Target**: `site-handlers/target.ts` ✅ Working  
- **Vitacost**: `site-handlers/vitacost.ts` ✅ Working
- **Herbal Sites**: `site-handlers/herbal-sites.ts` ✅ Working

#### **Unified Orchestrator**
```typescript
class CascadeOrchestrator {
  async processSite(site: string, herb: string, form: string): Promise<CanonicalURL[]> {
    const extractor = this.getExtractor(site);
    const rawUrls = await extractor.extractUrls(herb, form);
    return this.normalizeUrls(rawUrls, site, herb, form);
  }
  
  async processAllSites(herbs: string[], forms: string[]): Promise<CanonicalURL[]> {
    const allUrls: CanonicalURL[] = [];
    
    for (const herb of herbs) {
      for (const form of forms) {
        for (const site of this.workingSites) {
          const urls = await this.processSite(site, herb, form);
          allUrls.push(...urls);
        }
      }
    }
    
    return this.deduplicateUrls(allUrls);
  }
}
```

### **3. Data Storage & Management**

#### **Storage Strategy**
- **Raw URLs**: Store separately for debugging and analysis
- **Canonical URLs**: Normalized, deduplicated product references
- **Product Data**: Structured information from extraction
- **Quality Metrics**: Filtered and scored products

#### **Database Schema**
```sql
-- Raw URL storage
CREATE TABLE raw_urls (
  id INTEGER PRIMARY KEY,
  url TEXT NOT NULL,
  site TEXT NOT NULL,
  herb TEXT NOT NULL,
  form TEXT NOT NULL,
  extracted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'pending'
);

-- Canonical URLs
CREATE TABLE canonical_urls (
  id INTEGER PRIMARY KEY,
  canonical_id TEXT UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  site TEXT NOT NULL,
  herb TEXT NOT NULL,
  form TEXT NOT NULL,
  first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'active'
);

-- Product Data
CREATE TABLE product_data (
  id INTEGER PRIMARY KEY,
  canonical_url_id INTEGER,
  name TEXT,
  price DECIMAL(10,2),
  image_url TEXT,
  description TEXT,
  availability TEXT,
  extracted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  quality_score INTEGER,
  FOREIGN KEY (canonical_url_id) REFERENCES canonical_urls(id)
);
```

### **4. Automated Periodic Execution**

#### **Scheduler Implementation**
```typescript
import cron from 'node-cron';
import { CascadeOrchestrator } from './CascadeOrchestrator';

class CascadeScheduler {
  private orchestrator: CascadeOrchestrator;
  
  constructor() {
    this.orchestrator = new CascadeOrchestrator();
  }
  
  startScheduledRuns() {
    // Run every 3 weeks on Sunday at 2 AM
    cron.schedule('0 2 * * 0/3', async () => {
      console.log('🔄 Starting scheduled cascade run...');
      await this.runFullCascade();
    });
    
    // Run every 2 weeks on Wednesday at 3 AM
    cron.schedule('0 3 * * 3/2', async () => {
      console.log('🔄 Starting bi-weekly cascade run...');
      await this.runFullCascade();
    });
  }
  
  async runFullCascade() {
    try {
      const herbs = ['ashwagandha', 'st-johns-wort', 'ginkgo-biloba', 'valerian', 'chamomile'];
      const forms = ['tincture', 'capsule', 'powder', 'tea', 'extract'];
      
      const urls = await this.orchestrator.processAllSites(herbs, forms);
      console.log(`✅ Cascade complete: ${urls.length} unique products found`);
      
      // Trigger product data extraction
      await this.extractProductData(urls);
      
    } catch (error) {
      console.error('❌ Cascade run failed:', error);
    }
  }
}
```

### **5. Quality Filtering & Scoring**

#### **Filtering Pipeline**
```typescript
interface QualityMetrics {
  priceRange: { min: number; max: number };
  reviewScore: number;
  reviewCount: number;
  organic: boolean;
  nonGmo: boolean;
  alcoholFree: boolean;
  dosage: string;
  certifications: string[];
}

class QualityFilter {
  filterProducts(products: ProductData[], criteria: QualityMetrics): ProductData[] {
    return products.filter(product => {
      // Price validation
      if (product.price < criteria.priceRange.min || product.price > criteria.priceRange.max) {
        return false;
      }
      
      // Review quality
      if (product.reviewScore < criteria.reviewScore || product.reviewCount < criteria.reviewCount) {
        return false;
      }
      
      // Certification requirements
      if (criteria.organic && !product.certifications.includes('organic')) {
        return false;
      }
      
      return true;
    });
  }
  
  calculateQualityScore(product: ProductData): number {
    let score = 0;
    
    // Price scoring (lower is better for affiliate)
    if (product.price < 20) score += 30;
    else if (product.price < 50) score += 20;
    else if (product.price < 100) score += 10;
    
    // Review scoring
    if (product.reviewScore >= 4.5) score += 25;
    else if (product.reviewScore >= 4.0) score += 15;
    
    // Review count scoring
    if (product.reviewCount >= 100) score += 20;
    else if (product.reviewCount >= 50) score += 10;
    
    // Certification bonuses
    if (product.certifications.includes('organic')) score += 15;
    if (product.certifications.includes('non-gmo')) score += 10;
    
    return Math.min(score, 100);
  }
}
```

## 🚀 **Implementation Phases**

### **Phase 1: Foundation (Week 1-2)**
- [ ] Set up database schema
- [ ] Implement URL normalizers for each site
- [ ] Create basic deduplication engine
- [ ] Test with 2-3 herbs and 2-3 sites

### **Phase 2: Extraction Engine (Week 3-4)**
- [ ] Integrate existing site-specific extractors
- [ ] Build unified orchestrator
- [ ] Implement product data extraction pipeline
- [ ] Test end-to-end with small dataset

### **Phase 3: Quality & Automation (Week 5-6)**
- [ ] Implement quality filtering system
- [ ] Add scoring algorithms
- [ ] Set up automated scheduling
- [ ] Test full pipeline with all sites

### **Phase 4: Production & Monitoring (Week 7-8)**
- [ ] Deploy production pipeline
- [ ] Add monitoring and alerting
- [ ] Implement error recovery
- [ ] Document maintenance procedures

## 📊 **Expected Outputs**

### **Data Volume Estimates**
- **9 sites** × **20 herbs** × **5 forms** = **900 product categories**
- **Average 50-200 products per category** = **45,000 - 180,000 raw URLs**
- **After deduplication**: **15,000 - 60,000 unique products**
- **After quality filtering**: **5,000 - 20,000 premium products**

### **Update Frequency**
- **Full cascade**: Every 3 weeks
- **Quick refresh**: Every 2 weeks  
- **Incremental updates**: Daily for new products
- **Quality re-scoring**: Weekly

## 🔍 **Monitoring & Maintenance**

### **Health Checks**
- URL extraction success rates per site
- Product data extraction quality
- Database performance and storage
- Error rates and recovery times

### **Alerting**
- Failed extraction runs
- Database storage thresholds
- Quality score degradation
- Site blocking detection

## 💡 **Benefits of This Approach**

1. **Scalable**: Handles thousands of products across multiple sites
2. **Maintainable**: Isolated components, easy to debug and update
3. **Reliable**: Built-in error handling and recovery
4. **Fresh**: Regular updates keep product pool current
5. **Quality-focused**: Multiple filtering layers ensure premium products
6. **Affiliate-ready**: Structured data ready for marketing automation

## 🎯 **Next Steps**

1. **Review and approve** this architecture
2. **Set up development environment** with database
3. **Start with Phase 1** - URL normalization and deduplication
4. **Test incrementally** with small datasets
5. **Scale up** as each phase proves successful

This pipeline will give you a robust, automated system for maintaining a fresh, high-quality product database across all your working sites.

---

## 🌟 **Complete Pipeline Vision & Integration**

Let's map this out carefully. Here's a full vision for your pipeline, broken into discrete stages with Node.js in mind, and showing how it integrates with your existing extractor.

### **1. Input Layer: Herb & Form Catalog**

You maintain a structured list of target herbs and formulations (e.g., tinctures, dried herbs).

**Example JSON:**
```json
[
  { "herb": "Ashwagandha", "forms": ["tincture", "dried herb"] },
  { "herb": "Turmeric", "forms": ["tincture", "capsules"] }
]
```

This drives which pages the URL extractors will visit.

### **2. Site-Specific URL Extractors**

Each site (Amazon, iHerb, Vitacost, etc.) has a discrete extractor module.

**Responsibilities:**
- Query the site for the herb/form combination
- Extract product URLs from search results
- Handle pagination, throttling, and site-specific quirks
- Normalize URLs to remove tracking parameters

**Example Node.js skeleton:**
```typescript
async function extractAmazonURLs(herb, form) {
  const searchURL = `https://www.amazon.com/s?k=${herb}+${form}`;
  // Fetch page, parse HTML, extract product links
  const urls = parseAmazonHTML(await fetch(searchURL));
  return urls.map(normalizeURL); // remove duplicates/trackers
}
```

### **3. URL Deduplication & Normalization**

After extraction from multiple pages/sites, URLs are cleaned:

- Remove duplicates across pages
- Remove duplicates across sites (same product listed differently)
- Optionally, store a hash of product title + brand to detect duplicates

### **4. Relevance Filtering**

Optional lightweight filters to discard irrelevant URLs early:

- Check for keywords in URL or title (herb + form)
- Discard obvious non-products or ads

At this stage, the list is a "candidate pool" of URLs for detailed scraping.

### **5. Feeding Your Existing Product Extractor**

The cleaned URL list is passed to your extractor, which:

- Pulls structured product data (title, price, form, concentration, reviews, brand, etc.)
- Stores it in a database or JSON file

### **6. Quality Specification Filters**

After extraction, run rules/filters:

- Minimum potency/concentration
- Brand reputation
- Price thresholds
- Formulation types

Products failing the filters are discarded. This produces a curated pool of high-quality options.

### **7. Storage & Scheduling**

Store curated product data in a database (MongoDB, Postgres, or JSON).

Schedule the whole pipeline via Node.js cron or a task scheduler:

```typescript
const cron = require("node-cron");

// Run every 2–4 weeks
cron.schedule("0 0 */14 * *", async () => {
  await runFullPipeline();
});
```

### **8. Optional Enhancements**

- **Scoring & ranking**: rate products by quality, price, reviews
- **Automated notifications**: alert when a new top-tier product appears
- **Extensible architecture**: add new sites by dropping in new extractor modules

### **Flow Diagram (Textual)**
```
[Herb Catalog] 
      ↓
[Site-Specific URL Extractors] → [Raw URL Pool] 
      ↓
[Deduplication & Normalization] → [Candidate URLs]
      ↓
[Existing Product Extractor] → [Raw Product Data]
      ↓
[Quality Specification Filters] → [Curated Product Pool]
      ↓
[Database / Reports / Scheduler]
```

### **✅ With this approach, you eliminate:**

- **Manual URL entry**
- **Duplicates and noise**
- **Irrelevant products**

And you make your process **fully repeatable, scalable, and automated**.

---

## 🏗️ **Layered Architecture Clarification**

Think of your data pipeline in layers:

### **1. URL Extraction Layer (what you've done with Amazon etc.)**
- **Input**: search terms like "ashwagandha tincture"
- **Output**: raw URLs
- **Goal**: produce a list of candidate product URLs
- **Status**: ✅ already working

### **2. Deduplication / Normalization Layer (optional but recommended)**
- **Input**: raw URLs from multiple sites
- **Process**: remove duplicates, normalize URLs
- **Output**: unique URLs ready for extraction
- **Status**: you're partially there, just need Set or a small function in Node

### **3. Product Data Extraction Layer (your current "awesome custom product extractor")**
- **Input**: a single URL
- **Output**: structured product info: name, herb, form, potency, purity, price, etc.
- **Status**: ✅ already done
- **Key**: do not replace this. All new code for quality specs comes after this.

### **4. Quality Specification / Postgres Layer (the snippet I sent)**
- **Input**: structured product data from your extractor
- **Process**: check each product against your database specs
- **Output**: boolean or "passes/fails" + optional filtered list table
- **Status**: NEW. This is adjunctive, not a replacement.
- **Where to put it**: immediately after your extractor call, inside your loop that iterates over URLs.

### **Visual Pseudocode Flow**
```
[raw URLs] 
     │
     ▼
[deduplicate / normalize] 
     │
     ▼
[product extractor]  <-- your existing code stays here
     │
     ▼
[check Postgres quality specs]  <-- new code snippet fits here
     │
     ▼
[store or process only passing products]
```

---

## 🚀 **Practical Implementation Template**

Perfect — we can create a Node.js starter template that:

Takes a catalog of herbs + formulations.
Extracts product URLs from Amazon (site-specific module).
Deduplicates & normalizes URLs.
Passes them to your existing extractor.

Here's a clean, modular starting point:

```javascript
// file: pipeline.js
const fetch = require("node-fetch");
const cheerio = require("cheerio");

// --- 1. Herb Catalog ---
const catalog = [
  { herb: "Ashwagandha", forms: ["tincture", "dried herb"] },
  { herb: "Turmeric", forms: ["tincture"] },
];

// --- 2. Amazon URL Extractor ---
async function extractAmazonURLs(herb, form) {
  const query = encodeURIComponent(`${herb} ${form}`);
  const searchURL = `https://www.amazon.com/s?k=${query}`;
  
  const res = await fetch(searchURL, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });
  
  const html = await res.text();
  const $ = cheerio.load(html);

  // Amazon product URLs are usually under a[data-asin]
  const urls = [];
  $("a.a-link-normal.s-no-outline").each((i, el) => {
    let href = $(el).attr("href");
    if (href && href.includes("/dp/")) {
      href = `https://www.amazon.com${href.split("/ref=")[0]}`; // clean URL
      urls.push(href);
    }
  });

  return [...new Set(urls)]; // deduplicate
}

// --- 3. Run extraction for all catalog items ---
async function runExtraction() {
  let allURLs = [];

  for (const item of catalog) {
    for (const form of item.forms) {
      console.log(`Extracting URLs for ${item.herb} (${form})...`);
      const urls = await extractAmazonURLs(item.herb, form);
      allURLs.push(...urls);
    }
  }

  // Deduplicate across all searches
  allURLs = [...new Set(allURLs)];
  console.log("Total unique URLs extracted:", allURLs.length);

  // --- 4. Pass to your existing product extractor ---
  // Example placeholder:
  for (const url of allURLs) {
    console.log("Send to extractor:", url);
    // await yourExtractor.process(url);
  }
}

// --- Execute pipeline ---
runExtraction().catch(console.error);
```

### **✅ Notes**

- Uses cheerio for HTML parsing (no Python needed)
- Handles Amazon search, URL extraction, deduplication
- Modular: you can drop in more site extractors later (`extractiHerbURLs()`, `extractVitacostURLs()`, etc.)
- The last step is just a placeholder for your current extractor — you just feed each URL into it

### **Installation**
```bash
npm install node-fetch cheerio
```

This template gives you a working foundation that you can immediately test and then expand with additional sites and your existing extractor integration.

---

## 🚀 **Single-Herb Pipeline Skeleton**

Here's a practical Node.js skeleton pipeline focused on one herb to prove the flow before scaling up. This provides the structure, hooks, and deduplication logic ready for your Postgres quality filters and product extractor.

### **singleHerbPipeline.js**
```javascript
// singleHerbPipeline.js
// Node.js skeleton for 1-herb product pipeline

const axios = require('axios'); // for HTTP requests
const { Pool } = require('pg'); // Postgres connection
const crypto = require('crypto'); // for simple URL deduplication hashing

// ---- CONFIG ----
const HERB = 'ashwagandha';
const SITES = ['amazon']; // expand later
const POSTGRES_CONFIG = {
  user: 'your_user',
  host: 'localhost',
  database: 'herb_quality',
  password: 'your_pass',
  port: 5432,
};

// ---- DATABASE POOL ----
const pool = new Pool(POSTGRES_CONFIG);

// ---- SITE-SPECIFIC URL EXTRACTOR (example) ----
async function extractAmazonURLs(herb) {
  // placeholder: replace with real scraping or API logic
  console.log(`Extracting Amazon URLs for ${herb}...`);
  return [
    'https://www.amazon.com/example-product-1',
    'https://www.amazon.com/example-product-2',
  ];
}

// ---- DEDUPLICATE FUNCTION ----
function deduplicateURLs(urls) {
  const seen = new Set();
  const result = [];
  urls.forEach((url) => {
    // Simple hash to normalize URLs
    const hash = crypto.createHash('sha256').update(url).digest('hex');
    if (!seen.has(hash)) {
      seen.add(hash);
      result.push(url);
    }
  });
  return result;
}

// ---- FETCH PRODUCT DATA (placeholder) ----
async function fetchProductData(url) {
  // Here you would call your existing product extractor
  console.log(`Fetching product data for ${url}...`);
  return {
    url,
    name: 'Example Product',
    form: 'Tincture',
    strength: '500mg',
    alcoholPercent: 40,
    organic: true,
  };
}

// ---- APPLY QUALITY FILTERS ----
async function applyQualityFilters(product) {
  // Fetch herb-specific quality specs from Postgres
  const res = await pool.query(
    'SELECT * FROM herb_quality_specs WHERE herb = $1',
    [HERB]
  );
  const specs = res.rows[0];

  // Example filter logic
  if (specs.min_strength && parseInt(product.strength) < specs.min_strength) {
    return null;
  }
  if (specs.require_organic && !product.organic) {
    return null;
  }
  return product;
}

// ---- MAIN PIPELINE ----
async function main() {
  try {
    let allURLs = [];

    // 1. Extract URLs per site
    for (const site of SITES) {
      let urls = [];
      if (site === 'amazon') {
        urls = await extractAmazonURLs(HERB);
      }
      // expand with other site extractors here
      allURLs = allURLs.concat(urls);
    }

    // 2. Deduplicate URLs
    allURLs = deduplicateURLs(allURLs);
    console.log(`Deduped URLs:`, allURLs);

    // 3. Fetch product data
    let products = [];
    for (const url of allURLs) {
      const product = await fetchProductData(url);
      products.push(product);
    }

    // 4. Apply quality filters
    const filteredProducts = [];
    for (const product of products) {
      const valid = await applyQualityFilters(product);
      if (valid) filteredProducts.push(valid);
    }

    console.log(`Filtered products:`, filteredProducts);
  } catch (err) {
    console.error('Pipeline error:', err);
  } finally {
    await pool.end();
  }
}

// Run the pipeline
main();
```

### **✅ Key Points**

- **Single herb + single site** is fully supported
- **Deduplication works** across all URLs
- **Hooks for your existing product extractor** and Postgres quality specs
- **Expanding to multiple herbs/sites** only requires:
  - Adding extractor functions for other sites
  - Looping over a herb list instead of just `HERB`

### **🔧 Implementation Steps**

1. **Replace placeholder extractor** with your working Amazon extractor
2. **Connect to your Postgres database** with quality specs
3. **Integrate your existing product extractor** in the `fetchProductData` function
4. **Test with ashwagandha** to prove the flow
5. **Scale up** by adding more herbs and sites

### **📦 Installation**
```bash
npm install axios pg crypto
```

This skeleton gives you the exact pipeline structure you outlined, ready for immediate testing and expansion.

---

## 📋 **Scraper → Product Card Prototype Workflow**

Here's a compact cheat sheet for your immediate workflow from scraper to product card prototype:

### **1. Scrape / Collect Data**

- **Focus on the minimum**: title, image, price, short description
- **Test with one herb first** (e.g., Ashwagandha)
- **Output should be structured in JSON**

**Example JSON structure:**
```json
{
  "title": "Ashwagandha Tincture",
  "image": "https://example.com/images/ashwagandha.jpg",
  "price": 19.99,
  "description": "Herbal extract traditionally used for stress support."
}
```

### **2. Normalize / Clean Data**

- Ensure all fields exist; handle missing images or prices
- Truncate overly long descriptions
- Keep the structure consistent for easy rendering

### **3. Render Product Cards**

- Front-end loops over JSON to display cards
- Fields: title, image, price, description
- Style via Tailwind or your own CSS
- Cards can be inserted into:
  - Herb profile pages
  - Symptom profile pages

### **4. Prototype → API Ready**

- Keep JSON structure consistent so you can swap scraping with affiliate API data later
- Prototype works with placeholder or scraped data now, but future API products fit without HTML changes

### **5. UI Layer (Optional for Later)**

Build after extractors are stable:

**Features:**
- Input/search box for herb or supplement
- "Fetch products" button
- Preview of cards
- "Slot into page" button

This keeps your workflow lean and focused: **scraping → cleaning → rendering → later UI/affiliate integration**.
