import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST - Batch import products from URLs
export async function POST(req: NextRequest) {
  try {
    const { urls, useScraping = false } = await req.json();
    
    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json(
        { success: false, error: 'URLs array is required' },
        { status: 400 }
      );
    }

    const importedProducts = [];
    const errors = [];

    for (const url of urls) {
      try {
        // Add delay between requests to be respectful
        if (importedProducts.length > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        let productData;
        
        if (useScraping) {
          productData = await extractProductFromUrlWithScraping(url);
        } else {
          productData = await extractProductFromUrl(url);
        }
        
        if (productData) {
          // Create or find merchant based on domain
          const merchant = await getOrCreateMerchant(productData.domain);
          
          // Create product
          const product = await prisma.product.create({
            data: {
              name: productData.name,
              description: productData.description,
              merchantId: merchant.id,
              affiliateLink: url,
              price: productData.price,
              currency: productData.currency || 'USD',
              region: productData.region || 'US',
              imageUrl: productData.imageUrl,
              qualityScore: productData.qualityScore || 5,
              affiliateRate: merchant.defaultAffiliateRate || 5.0,
              affiliateYield: productData.price ? (productData.price * (merchant.defaultAffiliateRate || 5.0) / 100) : null,
            },
            include: {
              merchant: true,
            },
          });
          
          importedProducts.push(product);
        }
      } catch (error) {
        console.error(`Error processing URL ${url}:`, error);
        errors.push({ url, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        importedCount: importedProducts.length,
        importedProducts,
        errors,
      },
    });
  } catch (error) {
    console.error('Batch import error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process batch import' },
      { status: 500 }
    );
  }
}

// Enhanced extraction with web scraping
async function extractProductFromUrlWithScraping(url: string) {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    
    // Check if we should scrape this domain
    const supportedDomains = ['amazon.com', 'iherb.com', 'vitacost.com', 'swanson.com'];
    const isSupported = supportedDomains.some(domain => urlObj.hostname.includes(domain));
    
    if (!isSupported) {
      console.log(`Domain ${domain} not supported for scraping, using basic extraction`);
      return await extractProductFromUrl(url);
    }

    // For now, return basic extraction (Puppeteer would be added here)
    /*
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    // Extract product data based on domain
    const productData = await page.evaluate(() => {
      // Domain-specific selectors
      const selectors = {
        'amazon.com': {
          name: '#productTitle',
          price: '.a-price-whole',
          image: '#landingImage',
          description: '#productDescription'
        },
        'iherb.com': {
          name: '.product-title',
          price: '.price',
          image: '.product-image img',
          description: '.product-description'
        }
        // Add more domains as needed
      };
      
      // Implementation would go here
    });
    
    await browser.close();
    return productData;
    */
    
    // Fallback to basic extraction
    return await extractProductFromUrl(url);
    
  } catch (error) {
    console.error('Error extracting product from URL with scraping:', error);
    return await extractProductFromUrl(url);
  }
}

// Basic extraction (existing function)
async function extractProductFromUrl(url: string) {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    
    // Extract basic information from URL path
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    const productName = pathParts[pathParts.length - 1]?.replace(/[-_]/g, ' ') || 'Unknown Product';
    
    return {
      name: productName,
      description: `Product from ${domain}`,
      price: null,
      currency: 'USD',
      region: 'US',
      imageUrl: null,
      qualityScore: 5,
      domain,
    };
  } catch (error) {
    console.error('Error extracting product from URL:', error);
    return null;
  }
}

// Helper function to get or create merchant
async function getOrCreateMerchant(domain: string) {
  // Try to find existing merchant
  let merchant = await prisma.merchant.findFirst({
    where: {
      websiteUrl: {
        contains: domain,
      },
    },
  });

  if (!merchant) {
    // Create new merchant
    merchant = await prisma.merchant.create({
      data: {
        name: domain.replace(/^www\./, '').split('.')[0],
        websiteUrl: `https://${domain}`,
        region: 'US',
        defaultAffiliateRate: 5.0,
      },
    });
  }

  return merchant;
} 