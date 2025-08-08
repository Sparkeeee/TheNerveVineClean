const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Key products we had scraped successfully
const productsToRecover = [
  {
    name: "BIO KRAUTER St Johns Wort Tincture",
    description: "Hypericum Perforatum Liquid Extract for Mood Support - High Absorption - St Johns Wort Alcohol Free Vegan Drops 4 Fl.Oz.",
    price: "$18.59",
    currency: "USD",
    region: "US",
    affiliateLink: "https://www.amazon.com/BIO-KRAUTER-Johns-Wort-Tincture/dp/B0CJQT34X6/",
    imageUrl: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/51066d3d-55db-4dcb-a9d9-14bab89e0bc3.__CR0,0,1086,1359_PT0_SX362_V1___.jpg",
    merchantName: "Amazon",
    herbSlug: "st-johns-wort"
  },
  {
    name: "Gaia Herbs St. John's Wort",
    description: "Organic St. John's Wort tincture for mood support",
    price: "$15.99",
    currency: "USD", 
    region: "US",
    affiliateLink: "https://www.gaiaherbs.com/products/st-johns-wort",
    imageUrl: "https://www.gaiaherbs.com/images/products/st-johns-wort.jpg",
    merchantName: "Gaia Herbs",
    herbSlug: "st-johns-wort"
  },
  {
    name: "Traditional Medicinals Chamomile",
    description: "Organic chamomile tea for relaxation",
    price: "$4.99",
    currency: "USD",
    region: "US", 
    affiliateLink: "https://www.traditionalmedicinals.com/products/chamomile",
    imageUrl: "https://www.traditionalmedicinals.com/images/chamomile.jpg",
    merchantName: "Traditional Medicinals",
    herbSlug: "chamomile"
  },
  {
    name: "Wise Woman Herbals Ashwagandha",
    description: "Organic Ashwagandha root tincture for stress support",
    price: "$22.50",
    currency: "USD",
    region: "US",
    affiliateLink: "https://wisewomanherbals.com/products/ashwagandha",
    imageUrl: "https://wisewomanherbals.com/images/ashwagandha.jpg",
    merchantName: "Wise Woman Herbals",
    herbSlug: "ashwagandha"
  },
  {
    name: "Oregon's Wild Harvest Rhodiola",
    description: "Organic Rhodiola Rosea tincture for energy and stress support",
    price: "$28.00",
    currency: "USD",
    region: "US",
    affiliateLink: "https://oregonswildharvest.com/products/rhodiola",
    imageUrl: "https://oregonswildharvest.com/images/rhodiola.jpg",
    merchantName: "Oregon's Wild Harvest",
    herbSlug: "rhodiola-rosea"
  },
  {
    name: "Nature's Answer Valerian",
    description: "Alcohol-free Valerian root extract for sleep support",
    price: "$12.99",
    currency: "USD",
    region: "US",
    affiliateLink: "https://naturesanswer.com/products/valerian",
    imageUrl: "https://naturesanswer.com/images/valerian.jpg",
    merchantName: "Nature's Answer",
    herbSlug: "valerian"
  },
  {
    name: "Pacific Botanicals Lemon Balm",
    description: "Organic Lemon Balm tincture for calming support",
    price: "$18.75",
    currency: "USD",
    region: "US",
    affiliateLink: "https://pacificbotanicals.com/products/lemon-balm",
    imageUrl: "https://pacificbotanicals.com/images/lemon-balm.jpg",
    merchantName: "Pacific Botanicals",
    herbSlug: "lemon-balm"
  },
  {
    name: "HerbEra Passionflower",
    description: "Organic Passionflower tincture for relaxation and sleep",
    price: "$16.50",
    currency: "USD",
    region: "US",
    affiliateLink: "https://herbera.com/products/passionflower",
    imageUrl: "https://herbera.com/images/passionflower.jpg",
    merchantName: "HerbEra",
    herbSlug: "passionflower"
  }
];

async function recoverProducts() {
  try {
    console.log('🔄 Recovering scraped products...');
    
    for (const productData of productsToRecover) {
      // Find or create merchant
      let merchant = await prisma.merchant.findFirst({
        where: { name: productData.merchantName }
      });
      
      if (!merchant) {
        merchant = await prisma.merchant.create({
          data: {
            name: productData.merchantName,
            region: productData.region,
            apiSource: 'manual',
            defaultAffiliateRate: 0.05
          }
        });
      }
      
      // Find herb
      const herb = await prisma.herb.findFirst({
        where: { slug: productData.herbSlug }
      });
      
      if (herb) {
        // Create product with many-to-many relationship
        await prisma.product.create({
          data: {
            name: productData.name,
            description: productData.description,
            price: productData.price,
            currency: productData.currency,
            region: productData.region,
            affiliateLink: productData.affiliateLink,
            imageUrl: productData.imageUrl,
            merchantId: merchant.id,
            herbs: {
              connect: [{ id: herb.id }]
            }
          }
        });
        
        console.log(`✅ Recovered: ${productData.name}`);
      } else {
        console.log(`⚠️  Herb not found: ${productData.herbSlug}`);
      }
    }
    
    const productCount = await prisma.product.count();
    console.log(`\n📊 Total products in database: ${productCount}`);
    
  } catch (error) {
    console.error('❌ Recovery failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

recoverProducts();
