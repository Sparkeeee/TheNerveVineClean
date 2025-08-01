const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkMacaDetails() {
  try {
    console.log('Getting detailed info about Maca...');
    
    const maca = await prisma.herb.findFirst({
      where: {
        name: "Maca"
      }
    });
    
    if (maca) {
      console.log('Maca entry found:');
      console.log(`- ID: ${maca.id}`);
      console.log(`- Name: "${maca.name}"`);
      console.log(`- Slug: "${maca.slug}"`);
      console.log(`- Latin Name: "${maca.latinName}"`);
      console.log(`- Indications:`, maca.indications);
    } else {
      console.log('No Maca entry found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkMacaDetails(); 