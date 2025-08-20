# 🚀 The Nine Realms Scraper - Quick Start Guide

## ✅ **What's Fixed:**
- **Search Criteria**: Now uses herbs/supplements from your database instead of symptoms
- **Temporary Storage**: Products saved to `temp-scraped-products.json` during testing
- **9 Working Sites**: All sites from your scraper guide are integrated
- **Database Integration**: Automatically pulls search terms from your Prisma database

## 🎯 **What It Does:**
1. **Reads your database**: Gets herb/supplement names automatically
2. **Searches 9 sites**: Amazon, Target, Vitacost, Gaia Herbs, etc.
3. **Extracts products**: Name, price, image, description
4. **Saves temporarily**: To JSON file for review before database import

## 🚀 **Quick Start:**

### **1. Test the Setup:**
```bash
node test-scraper.js
```

### **2. Start Scraping:**
```bash
npm run scraper:start
```

### **3. Check Results:**
```bash
# Look for the output file
cat temp-scraped-products.json
```

## ⚙️ **Configuration:**

### **Change Search Type:**
Edit `scraper-config.json`:
```json
{
  "scraper": {
    "searchType": "supplements"  // or "herbs" or "symptoms"
  }
}
```

### **Control Sites:**
```json
{
  "sites": {
    "amazon": { "enabled": false },  // Disable Amazon
    "vitacost": { "enabled": true }  // Keep Vitacost
  }
}
```

## 📊 **What You'll Get:**

### **Sample Output:**
```json
[
  {
    "name": "Ashwagandha Root Supplement",
    "price": "24.99",
    "imageUrl": "https://example.com/image.jpg",
    "description": "Organic ashwagandha root...",
    "site": "amazon",
    "url": "https://amazon.com/product/...",
    "scrapedAt": "2025-01-10T..."
  }
]
```

## 🔧 **Troubleshooting:**

### **"Playwright browsers not found"**
```bash
npx playwright install
```

### **"Database connection failed"**
```bash
npx prisma generate
npx prisma db push
```

### **"No products found"**
- Check if sites are blocking your IP
- Try switching VPN location
- Reduce scraping speed in config

## 🎯 **Next Steps:**
1. **Test with small batch** (5-10 herbs first)
2. **Review scraped data** in temp file
3. **Import to database** when satisfied
4. **Scale up** to more herbs/supplements

## 📁 **Files Created:**
- `temp-scraped-products.json` - Scraped products
- `scraper-config.json` - Configuration
- `test-scraper.js` - Testing script

---

**🎉 Your "9 Worlds" scraper is now ready to use herbs/supplements from your database!**
