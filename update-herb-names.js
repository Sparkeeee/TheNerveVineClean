const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const nameUpdates = [
  { oldName: "Astragalus Root", newName: "Astragalus" },
  { oldName: "Capsaicin (Chilli Extract)", newName: "Chilli Pepper" },
  { oldName: "Siberian Ginseng (Eleuthero)", newName: "Siberian Ginseng" },
  { oldName: "Holy Basil (Tulsi)", newName: "Holy Basil" }
];

async function updateHerbNames() {
  try {
    console.log('Starting herb name updates...');
    
    for (const update of nameUpdates) {
      const herb = await prisma.herb.findFirst({
        where: { name: update.oldName }
      });
      
      if (herb) {
        await prisma.herb.update({
          where: { id: herb.id },
          data: { name: update.newName }
        });
        console.log(`Updated: "${update.oldName}" → "${update.newName}"`);
      } else {
        console.log(`Not found: "${update.oldName}"`);
      }
    }
    
    console.log('Herb name updates completed!');
    
  } catch (error) {
    console.error('Error updating herb names:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateHerbNames(); 