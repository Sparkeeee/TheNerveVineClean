const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const expectedHerbs = [
  "Lemon Balm", "Ashwagandha", "Chamomile", "Lavender", "St. John's Wort",
  "Rhodiola Rosea", "Holy Basil (Tulsi)", "Licorice Root", "Ginseng", "Feverfew",
  "Passionflower", "Damiana", "Skullcap", "Valerian Root", "Kava Kava",
  "Maca Root", "Siberian Ginseng (Eleuthero)", "Hawthorn", "Willow Bark",
  "Capsaicin (Chilli Extract)", "American Ginseng", "Schisandra Berry", "Astragalus Root",
  "Ginkgo Biloba", "Bilberry", "Milk Thistle"
];

async function checkMissingHerbs() {
  try {
    console.log('Checking database for herbs...');
    
    const herbs = await prisma.herb.findMany({
      select: { name: true, latinName: true }
    });
    
    console.log(`\nFound ${herbs.length} herbs in database:`);
    herbs.forEach(herb => {
      console.log(`- ${herb.name} (${herb.latinName || 'No Latin name'})`);
    });
    
    const existingNames = herbs.map(h => h.name);
    const missingHerbs = expectedHerbs.filter(name => !existingNames.includes(name));
    
    console.log(`\nMissing herbs (${missingHerbs.length}):`);
    missingHerbs.forEach(name => {
      console.log(`- ${name}`);
    });
    
    console.log(`\nSummary: ${herbs.length}/26 herbs present`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkMissingHerbs(); 