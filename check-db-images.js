const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabaseImages() {
  try {
    console.log('🔍 Checking database for image URLs...\n');
    
    const products = await prisma.product.findMany({
      include: {
        merchant: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (products.length === 0) {
      console.log('❌ No products found in database');
      return;
    }

    console.log(`📊 Found ${products.length} products:\n`);

    products.forEach((product, index) => {
      console.log(`${index + 1}. Product: ${product.name}`);
      console.log(`   Merchant: ${product.merchant.name}`);
      console.log(`   Image URL: ${product.imageUrl || 'NO IMAGE'}`);
      console.log(`   Price: ${product.price}`);
      console.log(`   Created: ${product.createdAt}`);
      console.log('   ---');
    });

    // Check for suspicious patterns
    console.log('\n🚨 SUSPICIOUS PATTERNS FOUND:');
    
    const suspiciousProducts = products.filter(product => {
      const imageUrl = product.imageUrl || '';
      return imageUrl.includes('<%') || 
             imageUrl.includes('{{') || 
             imageUrl.includes('[PRODUCT') ||
             imageUrl.includes('template') ||
             imageUrl.includes('placeholder');
    });

    if (suspiciousProducts.length > 0) {
      suspiciousProducts.forEach(product => {
        console.log(`❌ SUSPICIOUS: ${product.name} (${product.merchant.name})`);
        console.log(`   Image URL: ${product.imageUrl}`);
      });
    } else {
      console.log('✅ No suspicious patterns found');
    }

  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseImages();
