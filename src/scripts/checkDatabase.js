const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('Checking database contents...\n');
    
    const herbs = await prisma.herb.findMany();
    console.log(`Herbs in database: ${herbs.length}`);
    herbs.forEach(h => console.log(`- ${h.name} (ID: ${h.id})`));
    
    const supplements = await prisma.supplement.findMany();
    console.log(`\nSupplements in database: ${supplements.length}`);
    supplements.forEach(s => console.log(`- ${s.name} (ID: ${s.id})`));
    
    const symptoms = await prisma.symptom.findMany();
    console.log(`\nSymptoms in database: ${symptoms.length}`);
    symptoms.forEach(s => console.log(`- ${s.title} (slug: ${s.slug})`));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase(); 