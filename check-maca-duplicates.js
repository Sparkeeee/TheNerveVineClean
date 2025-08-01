const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkMacaDuplicates() {
  try {
    console.log('Checking for Maca duplicates...');
    
    const herbs = await prisma.herb.findMany({
      where: {
        OR: [
          { name: { contains: 'Maca' } },
          { slug: { contains: 'maca' } }
        ]
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true
      }
    });
    
    console.log('Found herbs with Maca:');
    herbs.forEach(herb => {
      console.log(`- ID: ${herb.id}, Name: "${herb.name}", Slug: "${herb.slug}"`);
    });
    
    if (herbs.length > 1) {
      console.log('\nRecommendation: Keep "Maca" (shorter name) and remove "Maca Root"');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkMacaDuplicates(); 