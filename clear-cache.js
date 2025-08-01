const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearCache() {
  try {
    console.log('Clearing database cache...');
    
    // Force a fresh connection
    await prisma.$disconnect();
    await prisma.$connect();
    
    console.log('Cache cleared. Database reconnected.');
    
    // Test by fetching herbs
    const herbs = await prisma.herb.findMany({
      select: {
        id: true,
        name: true,
        slug: true
      },
      orderBy: { name: 'asc' }
    });
    
    console.log(`Found ${herbs.length} herbs in database:`);
    herbs.forEach(herb => {
      console.log(`- ${herb.name} (${herb.slug})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearCache(); 