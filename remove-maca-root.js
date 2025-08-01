const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function removeMacaRoot() {
  try {
    console.log('Removing Maca Root duplicate...');
    
    // Find the Maca Root entry
    const macaRoot = await prisma.herb.findFirst({
      where: {
        name: "Maca Root"
      }
    });
    
    if (macaRoot) {
      console.log(`Found Maca Root with ID: ${macaRoot.id}`);
      
      // Delete the Maca Root entry
      await prisma.herb.delete({
        where: {
          id: macaRoot.id
        }
      });
      
      console.log('Maca Root deleted successfully!');
    } else {
      console.log('No Maca Root entry found');
    }
    
    // Verify only Maca remains
    const macaEntries = await prisma.herb.findMany({
      where: {
        OR: [
          { name: { contains: 'Maca' } },
          { slug: { contains: 'maca' } }
        ]
      },
      select: {
        id: true,
        name: true,
        slug: true
      }
    });
    
    console.log('\nRemaining Maca entries:');
    macaEntries.forEach(entry => {
      console.log(`- ${entry.name} (${entry.slug})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

removeMacaRoot(); 