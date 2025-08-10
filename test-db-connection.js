const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  console.log('🔍 Testing database connection...\n');
  
  try {
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Check symptoms count
    const symptomCount = await prisma.symptom.count();
    console.log(`📊 Total symptoms in database: ${symptomCount}`);
    
    // Check variants count
    const variantCount = await prisma.symptomVariant.count();
    console.log(`📊 Total variants in database: ${variantCount}`);
    
    // List first few symptoms
    const symptoms = await prisma.symptom.findMany({
      select: { title: true, slug: true },
      take: 5,
      orderBy: { title: 'asc' }
    });
    
    console.log('\n📋 First 5 symptoms:');
    symptoms.forEach(s => console.log(`   • ${s.title} (${s.slug})`));
    
    // Check if Stress exists
    const stress = await prisma.symptom.findFirst({
      where: { title: { contains: 'Stress' } },
      select: { title: true, slug: true }
    });
    
    if (stress) {
      console.log(`\n✅ Found Stress: ${stress.title} (${stress.slug})`);
    } else {
      console.log('\n❌ Stress not found in database');
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
