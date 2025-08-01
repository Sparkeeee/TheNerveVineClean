const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function removeDuplicateHerbs() {
  try {
    console.log('Finding and removing duplicate herbs with less content...');
    
    // Find all herbs
    const herbs = await prisma.herb.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        productFormulations: true,
        references: true,
        traditionalUses: true
      }
    });
    
    // Group by name
    const herbGroups = {};
    herbs.forEach(herb => {
      if (!herbGroups[herb.name]) {
        herbGroups[herb.name] = [];
      }
      herbGroups[herb.name].push(herb);
    });
    
    // Find duplicates and remove the ones with less content
    for (const [name, duplicates] of Object.entries(herbGroups)) {
      if (duplicates.length > 1) {
        console.log(`\nFound ${duplicates.length} entries for "${name}":`);
        
        // Sort by content richness (description length + other fields)
        duplicates.sort((a, b) => {
          const aContent = (a.description?.length || 0) + 
                          (a.productFormulations ? JSON.stringify(a.productFormulations).length : 0) +
                          (a.references ? JSON.stringify(a.references).length : 0) +
                          (a.traditionalUses ? JSON.stringify(a.traditionalUses).length : 0);
          
          const bContent = (b.description?.length || 0) + 
                          (b.productFormulations ? JSON.stringify(b.productFormulations).length : 0) +
                          (b.references ? JSON.stringify(b.references).length : 0) +
                          (b.traditionalUses ? JSON.stringify(b.traditionalUses).length : 0);
          
          return bContent - aContent; // Keep the one with more content
        });
        
        // Keep the first one (most content), delete the rest
        const toKeep = duplicates[0];
        const toDelete = duplicates.slice(1);
        
        console.log(`  Keeping entry ID ${toKeep.id} (most content)`);
        
        for (const herb of toDelete) {
          await prisma.herb.delete({
            where: { id: herb.id }
          });
          console.log(`  Deleted entry ID ${herb.id} (less content)`);
        }
      }
    }
    
    console.log('\nDuplicate removal completed!');
    
  } catch (error) {
    console.error('Error removing duplicates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

removeDuplicateHerbs(); 