const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const testHerbs = [
  { name: 'Ginkgo Biloba', slug: 'ginkgo-biloba', description: 'Traditional herb for cognitive support' },
  { name: 'Ashwagandha', slug: 'ashwagandha', description: 'Adaptogenic herb for stress support' },
  { name: 'Chamomile', slug: 'chamomile', description: 'Calming herb for relaxation' },
  { name: 'Valerian', slug: 'valerian', description: 'Herb for sleep support' },
  { name: 'Lavender', slug: 'lavender', description: 'Aromatic herb for calming effects' }
];

const testSupplements = [
  { name: 'Magnesium Glycinate', slug: 'magnesium-glycinate', description: 'Bioavailable magnesium for nervous system support' },
  { name: 'Vitamin B Complex', slug: 'vitamin-b-complex', description: 'Essential B vitamins for energy and nervous system' },
  { name: 'Omega-3 Fish Oil', slug: 'omega-3-fish-oil', description: 'Essential fatty acids for brain health' },
  { name: 'L-Theanine', slug: 'l-theanine', description: 'Amino acid for stress and focus' },
  { name: 'Melatonin', slug: 'melatonin', description: 'Natural sleep hormone' }
];

async function addTestData() {
  try {
    console.log('🌿 Adding test herbs...');
    
    for (const herb of testHerbs) {
      const existing = await prisma.herb.findUnique({
        where: { slug: herb.slug }
      });
      
      if (!existing) {
        await prisma.herb.create({
          data: {
            name: herb.name,
            slug: herb.slug,
            description: herb.description,
            metaTitle: herb.name,
            metaDescription: herb.description
          }
        });
        console.log(`✅ Added herb: ${herb.name}`);
      } else {
        console.log(`ℹ️ Herb already exists: ${herb.name}`);
      }
    }

    console.log('\n💊 Adding test supplements...');
    
    for (const supplement of testSupplements) {
      const existing = await prisma.supplement.findUnique({
        where: { slug: supplement.slug }
      });
      
      if (!existing) {
        await prisma.supplement.create({
          data: {
            name: supplement.name,
            slug: supplement.slug,
            description: supplement.description,
            metaTitle: supplement.name,
            metaDescription: supplement.description
          }
        });
        console.log(`✅ Added supplement: ${supplement.name}`);
      } else {
        console.log(`ℹ️ Supplement already exists: ${supplement.name}`);
      }
    }

    console.log('\n🎯 Test data added successfully!');
    
    // Show current counts
    const herbCount = await prisma.herb.count();
    const supplementCount = await prisma.supplement.count();
    
    console.log(`\n📊 Current database counts:`);
    console.log(`  • Herbs: ${herbCount}`);
    console.log(`  • Supplements: ${supplementCount}`);
    
  } catch (error) {
    console.error('❌ Error adding test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTestData();
