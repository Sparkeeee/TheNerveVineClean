const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkHerbs() {
  try {
    const herbs = await prisma.herb.findMany({
      select: { id: true, name: true, slug: true }
    });
    
    console.log(`\n📊 Total herbs in database: ${herbs.length}`);
    console.log('\n🌿 First 15 herbs:');
    herbs.slice(0, 15).forEach(h => console.log(`  ${h.id}: ${h.name}`));
    
    if (herbs.length > 15) {
      console.log(`\n... and ${herbs.length - 15} more herbs`);
    }
    
  } catch (error) {
    console.error('❌ Error checking herbs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkHerbs();
