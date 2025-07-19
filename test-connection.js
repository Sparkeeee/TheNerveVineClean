const { PrismaClient } = require('@prisma/client');

console.log('Testing database connection...');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Attempting to connect to database...');
    
    // Test the connection
    const herbCount = await prisma.herb.count();
    console.log(`Database connection successful! Found ${herbCount} herbs.`);
    
    // List existing herbs
    const herbs = await prisma.herb.findMany({
      select: { name: true, latinName: true }
    });
    
    console.log('Existing herbs:');
    herbs.forEach(herb => {
      console.log(`- ${herb.name} (${herb.latinName})`);
    });
    
  } catch (error) {
    console.error('Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection(); 