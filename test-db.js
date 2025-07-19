const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test the connection
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Check if we can query herbs
    const herbCount = await prisma.herb.count();
    console.log(`Found ${herbCount} herbs in database`);
    
    // List existing herbs
    const herbs = await prisma.herb.findMany();
    console.log('Existing herbs:');
    herbs.forEach(h => console.log(`- ${h.name}`));
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection(); 