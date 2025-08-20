const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabaseContent() {
  try {
    console.log('🔍 Checking database content...\n');

    // Check herbs
    const herbs = await prisma.herb.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true
      }
    });

    console.log(`📊 Found ${herbs.length} herbs:`);
    herbs.forEach(herb => {
      console.log(`  - ${herb.name} (${herb.slug})`);
    });

    console.log('\n' + '='.repeat(50) + '\n');

    // Check supplements
    const supplements = await prisma.supplement.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true
      }
    });

    console.log(`📊 Found ${supplements.length} supplements:`);
    supplements.forEach(supplement => {
      console.log(`  - ${supplement.name} (${supplement.slug})`);
    });

    console.log('\n' + '='.repeat(50) + '\n');

    // Check symptoms
    const symptoms = await prisma.symptom.findMany({
      select: {
        id: true,
        title: true,
        slug: true
      }
    });

    console.log(`📊 Found ${symptoms.length} symptoms:`);
    symptoms.forEach(symptom => {
      console.log(`  - ${symptom.title} (${symptom.slug})`);
    });

  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseContent();
