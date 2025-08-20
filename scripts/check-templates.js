const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkTemplates() {
  try {
    console.log('Checking FormulationType templates...\n');
    
    const types = await prisma.formulationType.findMany({
      where: { name: { startsWith: 'Supplement' } }
    });
    
    console.log('Supplement templates:');
    types.forEach(t => {
      const template = JSON.parse(t.template);
      console.log(`\n${t.name}:`);
      console.log('Required Terms:', template.requiredTerms);
      console.log('Preferred Terms:', template.preferredTerms);
      console.log('Avoid Terms:', template.avoidTerms);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTemplates();
