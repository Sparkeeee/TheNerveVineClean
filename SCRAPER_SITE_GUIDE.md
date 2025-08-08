# 🕷️ Product Scraper Site Guide

## 📋 Overview
This guide documents which scraper methods work for different e-commerce sites and their specific requirements.

## 🎯 Current Status
- ✅ **Amazon** - "Ultra Simple" method working
- ✅ **Vitacost** - "Extract Product Data" method working
- ✅ **Target** - "Extract Product Data" method partially working (Name + Price)
- ❌ **iHerb** - Blocked (HTTP 403)
- ❌ **CVS Pharmacy** - Blocked (HTTP 403)
- ❌ **GNC** - Redirect Error (HTTP 307)
- ❌ **Vitamin Shoppe** - Blocked (HTTP 403)
- 🔄 **Smaller Herbal Sites** - Testing in progress

---

## 🛒 Site-Specific Scraping Methods

### Amazon
**✅ WORKING**
- **Best Method:** "Ultra Simple"
- **Why it works:** Mobile Safari user agent + ASIN extraction
- **Success Rate:** High
- **Notes:** Bypasses bot detection effectively

**Tested URLs:**
- ✅ `https://www.amazon.com/BIO-KRAUTER-Johns-Wort-Tincture/dp/B0CJQT34X6/...`
- ✅ St. John's Wort Tincture - $18.59

**Required Fields:**
- Product Name ✅
- Price ✅  
- Image URL ✅
- Description ✅
- Availability ✅

---

### iHerb
**❌ BLOCKED (ALL METHODS)**
- **Issue:** HTTP 403: Forbidden - Very strong bot protection
- **Tested Methods:** "Extract Product Data", "Debug", "iHerb Hacker" - All failed
- **Status:** Advanced protection defeated all approaches
- **Notes:** iHerb has enterprise-level bot detection

**Tested URLs:**
- ❌ `https://www.iherb.com/pr/healths-harmony-st-john-s-wort-120-capsules/115142` - 403 Forbidden
- ❌ `https://www.iherb.com/pr/now-foods-ginkgo-biloba-double-strength-120-mg-200-veg-capsules/583` - 403 Forbidden

**Advanced Methods Tried:**
- Desktop Chrome headers
- Mobile Safari headers  
- Firefox headers
- Multiple user agents
- Sophisticated browser simulation

**Conclusion:** iHerb has enterprise-level protection that requires proxy rotation or other advanced techniques

---

### Vitacost
**✅ WORKING**
- **Best Method:** "Extract Product Data"
- **Why it works:** Weak bot protection, basic extraction sufficient
- **Success Rate:** High
- **Notes:** Easier to scrape than iHerb, basic method works

**Tested URLs:**
- ✅ `https://www.vitacost.com/nature-s-way-st-johns-wort-300-mg-60-capsules` - Basic EPD successful

**Required Fields:**
- Product Name ✅
- Price ✅
- Image URL ✅
- Description ✅
- Availability ✅

---

### CVS Pharmacy (US)
**❌ BLOCKED**
- **Issue:** HTTP 403: Forbidden - Strong bot protection
- **Tested Methods:** "Extract Product Data" - Failed
- **Status:** Needs stronger anti-detection measures
- **Notes:** Major US pharmacy chain but has strong protection

**Tested URLs:**
- ❌ `https://www.cvs.com/shop/vitamins-supplements/st-johns-wort` - 403 Forbidden

**Next Steps:**
- Try "Puppeteer" method
- Try "Advanced" method
- Consider custom headers
- May need proxy rotation

### GNC (US)
**❌ REDIRECT ERROR**
- **Issue:** HTTP 307 - Temporary redirect
- **Tested Methods:** "Extract Product Data" - Failed
- **Status:** URL structure may be incorrect or site redirecting
- **Notes:** Premium US supplement store but URL may need adjustment

**Tested URLs:**
- ❌ `https://www.gnc.com/vitamins-supplements/st-johns-wort` - 307 Redirect

**Next Steps:**
- Try different URL structure
- Try "Puppeteer" method (handles redirects better)
- Try "Advanced" method
- May need to find correct product URLs

### Target (US)
**✅ PARTIAL SUCCESS**
- **Best Method:** "Extract Product Data"
- **Why it works:** Basic extraction successful, some data missing
- **Success Rate:** Medium (partial data)
- **Notes:** Major US retailer, good for affiliate marketing

**Tested URLs:**
- ✅ `https://www.target.com/p/piping-rock-ginkgo-biloba-standardized-extract-120-mg-200-capsules/-/A-88217969` - Partial success

**Extracted Data:**
- ✅ Product Name: "Piping Rock Ginkgo Biloba Standardized Extract 120"
- ✅ Price: "$35"
- ❌ Image URL: Not found
- ❌ Description: Not found
- ❌ Availability: Not found

**Next Steps:**
- Improve image extraction logic
- Enhance description extraction
- May need site-specific parsing

### Vitamin Shoppe (US)
**❌ BLOCKED**
- **Issue:** HTTP 403: Forbidden - Strong bot protection
- **Tested Methods:** "Extract Product Data" - Failed
- **Status:** Major supplement retailer with enterprise protection
- **Notes:** Premium supplements but heavily protected

**Tested URLs:**
- ❌ `https://www.vitaminshoppe.com/c/vitamins-supplements/st-johns-wort` - 403 Forbidden

**Next Steps:**
- Try "Puppeteer" method
- Try "Advanced" method
- Consider custom headers
- May need proxy rotation

---

## 🌿 Smaller Herbal Sites (Recommended Testing)

### Mountain Rose Herbs
**❌ BLOCKED**
- **Issue:** HTTP 403: Forbidden - Strong bot protection
- **Tested Methods:** "Extract Product Data" - Failed
- **Status:** Premium herbal supplier with protection
- **Notes:** Even smaller herbal sites are implementing protection

**Tested URLs:**
- ❌ `https://mountainroseherbs.com/st-johns-wort` - 403 Forbidden

**Next Steps:**
- Try "Puppeteer" method
- Try "Advanced" method
- May need custom headers

### Starwest Botanicals
**🔄 TO TEST**
- **Expected:** Weak protection, bulk herbs
- **Notes:** Wholesale herbal supplier, good for bulk products
- **Test URL:** `https://www.starwest-botanicals.com/st-johns-wort`

### Frontier Co-op
**🔄 TO TEST**
- **Expected:** Weak protection, organic herbs
- **Notes:** Cooperative organic products, good reputation
- **Test URL:** `https://www.frontiercoop.com/st-johns-wort`

### Bulk Apothecary
**🔄 TO TEST**
- **Expected:** Weak protection, bulk supplies
- **Notes:** Essential oils and herbs, good for DIY market
- **Test URL:** `https://www.bulkapothecary.com/st-johns-wort`

### Penn Herb Company
**🔄 TO TEST**
- **Expected:** Weak protection, traditional herbs
- **Notes:** Long-established herbal supplier, good selection
- **Test URL:** `https://www.pennherb.com/st-johns-wort`

### Monterey Bay Spice Company
**🔄 TO TEST**
- **Expected:** Weak protection, culinary and medicinal herbs
- **Notes:** Quality herbs, good for both culinary and medicinal
- **Test URL:** `https://www.herbco.com/st-johns-wort`

### Balanced Root Apothecary
**❌ NOT USABLE**
- **Issue:** HTTP 403: Forbidden - Missing critical data
- **Tested Methods:** "Extract Product Data" - Partial success but unusable
- **Status:** Missing price and image - cannot be used for affiliate marketing
- **Notes:** Small herbal apothecary with protection, data incomplete

**Tested URLs:**
- ❌ `https://balancedrootapothecary.com/st-johns-wort` - Partial success (Name + Description only)

**Extracted Data:**
- ✅ Product Name: Extracted
- ✅ Description: Extracted
- ❌ Price: Not found (CRITICAL MISSING)
- ❌ Image URL: Not found (CRITICAL MISSING)
- ❌ Availability: Not found

**Conclusion:** Cannot be used for affiliate marketing without price and image data

---

## 🌿 Tincture-Specific Herbal Businesses (Recommended Testing)

### Herb Pharm
**🔄 TO TEST**
- **Expected:** Weak protection, premium tinctures
- **Notes:** High-quality herbal tinctures, excellent for herbal niche
- **Test URL:** `https://www.herb-pharm.com/st-johns-wort`

### Gaia Herbs
**✅ WORKING**
- **Best Method:** "Extract Product Data"
- **Why it works:** Weak bot protection, basic extraction sufficient
- **Success Rate:** High
- **Notes:** Premium organic herbal supplements, excellent for herbal niche

**Tested URLs:**
- ✅ `https://www.gaiaherbs.com/st-johns-wort` - Basic EPD successful

**Required Fields:**
- Product Name ✅
- Price ✅
- Image URL ✅
- Description ✅
- Availability ✅

### Wise Woman Herbals
**✅ WORKING**
- **Best Method:** "Extract Product Data"
- **Why it works:** Weak bot protection, basic extraction sufficient
- **Success Rate:** High
- **Notes:** Traditional herbal medicine, excellent for authentic herbal products

**Tested URLs:**
- ✅ `https://www.wisewomanherbals.com/st-johns-wort` - Basic EPD successful

**Required Fields:**
- Product Name ✅
- Price ✅
- Image URL ✅
- Description ✅
- Availability ✅

### Herb Lore
**🔄 TO TEST**
- **Expected:** Weak protection, bulk tinctures
- **Notes:** Bulk herbal supplies, good for DIY market
- **Test URL:** `https://www.herblore.com/st-johns-wort`

### Pacific Botanicals
**✅ WORKING**
- **Best Method:** "Mobile Scrape"
- **Why it works:** Mobile user agent bypasses desktop restrictions
- **Success Rate:** High
- **Notes:** Wholesale herbal supplier, excellent for bulk products and wholesale market

**Tested URLs:**
- ✅ `https://www.pacificbotanicals.com/st-johns-wort` - Mobile scrape successful

**Required Fields:**
- Product Name ✅
- Price ✅
- Image URL ✅
- Description ✅
- Availability ✅

### Oregon's Wild Harvest
**✅ WORKING**
- **Best Method:** "Extract Product Data"
- **Why it works:** Weak bot protection, basic extraction sufficient
- **Success Rate:** High
- **Notes:** Organic herbal products, excellent for premium organic market

**Tested URLs:**
- ✅ `https://www.oregonswildharvest.com/st-johns-wort` - Basic EPD successful

**Required Fields:**
- Product Name ✅
- Price ✅
- Image URL ✅
- Description ✅
- Availability ✅

### Traditional Medicinals
**✅ WORKING**
- **Best Method:** "Extract Product Data"
- **Why it works:** Weak bot protection, basic extraction sufficient
- **Success Rate:** High
- **Notes:** Well-known herbal tea and supplement brand, excellent reputation

**Tested URLs:**
- ✅ `https://www.traditionalmedicinals.com/st-johns-wort` - Basic EPD successful

**Required Fields:**
- Product Name ✅
- Price ✅
- Image URL ✅
- Description ✅
- Availability ✅

### Nature's Answer
**✅ WORKING**
- **Best Method:** "Mobile Scrape"
- **Why it works:** Mobile user agent bypasses desktop restrictions
- **Success Rate:** High
- **Notes:** Liquid extracts and tinctures specialist, excellent for liquid herbal products

**Tested URLs:**
- ✅ `https://naturesanswer.com/st-johns-wort` - Mobile scrape successful

**Required Fields:**
- Product Name ✅
- Price ✅
- Image URL ✅
- Description ✅
- Availability ✅

### HerbEra
**✅ PARTIAL SUCCESS**
- **Best Method:** "Extract Product Data"
- **Why it works:** Weak bot protection, but extraction needs refinement
- **Success Rate:** Medium (partial data)
- **Notes:** Modern herbal supplements, good for contemporary market

**Tested URLs:**
- ✅ `https://www.herbera.com/st-johns-wort` - Partial success (not 403 blocked)

**Extracted Data:**
- ✅ Product Name: Extracted
- ✅ Description: Extracted
- ❌ Price: Not found (CRITICAL MISSING)
- ❌ Image URL: Not found (CRITICAL MISSING)
- ❌ Availability: Not found

**Next Steps:**
- Improve price extraction logic for HerbEra
- Enhance image extraction for HerbEra
- May need site-specific parsing for HerbEra
- Consider "Puppeteer" method for better data extraction

### Mountain Meadow Herbs
**🔄 TO TEST**
- **Expected:** Weak protection, wildcrafted herbs
- **Notes:** Wildcrafted herbal products, good for authentic niche
- **Test URL:** `https://www.mountainmeadowherbs.com/st-johns-wort`

---

## 🔧 Scraper Methods Reference

### "Ultra Simple"
- **Best for:** Amazon, Walmart
- **How it works:** Mobile Safari user agent + multiple extraction approaches
- **Success rate:** High for supported sites

### "Simple Fallback"
- **Best for:** iHerb, Vitacost, general sites
- **How it works:** Multiple user agents + basic extraction
- **Success rate:** Medium

### "Puppeteer"
- **Best for:** JavaScript-heavy sites
- **How it works:** Full browser simulation
- **Success rate:** High but slow

### "Advanced"
- **Best for:** Debugging and analysis
- **How it works:** Tests multiple approaches
- **Success rate:** Diagnostic tool

---

## 📊 Testing Protocol

### For Each New Site:
1. **Try "Ultra Simple" first** (works for Amazon)
2. **Try "Simple Fallback"** (general purpose)
3. **Try "Puppeteer"** (if others fail)
4. **Use "Advanced"** for debugging
5. **Document results** in this guide

### Data to Record:
- ✅/❌ Success status
- Which method worked
- Extracted data quality
- Any special requirements
- Test URL used

---

## 🚀 Next Steps

### Immediate Testing:
1. **iHerb** - Test with St. John's Wort products
2. **Vitacost** - Test with similar products
3. **Walmart** - Test with Amazon-like approach

### Future Enhancements:
- Site-specific extraction logic
- Automatic method selection
- Quality scoring system
- Batch processing capability

---

## 📝 Notes
- Always test with development database
- Document any site-specific requirements
- Update this guide as new sites are tested
- Consider rate limiting for production use

---

*Last Updated: [Current Date]*
*Status: Amazon working, other sites pending*
