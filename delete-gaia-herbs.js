const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteGaiaHerbsProduct() {
  try {
    console.log('🗑️ Deleting Gaia Herbs product with JavaScript image URL...');
    
    // Find the Gaia Herbs product with the problematic image URL
    const productToDelete = await prisma.product.findFirst({
      where: {
        imageUrl: {
          contains: 'getBundleOptionImage'
        },
        merchant: {
          name: 'gaiaherbs.com'
        }
      }
    });

    if (productToDelete) {
      console.log(`Found product: ${productToDelete.name}`);
      console.log(`Image URL: ${productToDelete.imageUrl}`);
      
      // Delete the product
      await prisma.product.delete({
        where: {
          id: productToDelete.id
        }
      });
      
      console.log('✅ Gaia Herbs product deleted successfully!');
    } else {
      console.log('❌ No Gaia Herbs product with JavaScript image URL found');
    }

  } catch (error) {
    console.error('Error deleting product:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteGaiaHerbsProduct();
