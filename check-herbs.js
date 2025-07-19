import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkHerbs() {
  try {
    const herbs = await prisma.herb.findMany();
    console.log('Herbs currently in database:');
    console.log('Total count:', herbs.length);
    herbs.forEach(h => console.log('- ' + h.name));
    
    const supplements = await prisma.supplement.findMany();
    console.log('\nSupplements currently in database:');
    console.log('Total count:', supplements.length);
    supplements.forEach(s => console.log('- ' + s.name));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkHerbs(); 