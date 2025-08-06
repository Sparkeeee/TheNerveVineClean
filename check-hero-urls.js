const { PrismaClient } = require('@prisma/client');

async function checkHeroUrls() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Connecting to database...');
    
    const herbs = await prisma.herb.findMany({
      where: { 
        slug: { 
          in: ['ginkgo-biloba', 'ashwagandha', 'st-johns-wort', 'rhodiola', 'ginseng'] 
        } 
      },
      select: { 
        name: true, 
        slug: true, 
        heroImageUrl: true 
      }
    });

    console.log(`Found ${herbs.length} herbs:`);
    herbs.forEach(h => {
      console.log(`${h.name} (${h.slug}): ${h.heroImageUrl || 'NULL'}`);
    });

    // Also check a few random herbs
    const randomHerbs = await prisma.herb.findMany({
      where: { heroImageUrl: { not: null } },
      select: { name: true, slug: true, heroImageUrl: true },
      take: 5
    });

    console.log(`\nFound ${randomHerbs.length} herbs with hero images:`);
    randomHerbs.forEach(h => {
      console.log(`${h.name} (${h.slug}): ${h.heroImageUrl}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
    console.log('Database connection closed.');
  }
}

checkHeroUrls(); 