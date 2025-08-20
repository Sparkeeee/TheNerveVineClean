const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkTimezone() {
  try {
    console.log('🕐 Checking Neon database timezone...');
    
    // Check current timezone
    const timezoneResult = await prisma.$queryRaw`SHOW timezone;`;
    console.log('Timezone:', timezoneResult[0].TimeZone);
    
    // Check current timestamp
    const nowResult = await prisma.$queryRaw`SELECT NOW();`;
    console.log('Current database time:', nowResult[0].now);
    
    // Check timezone abbreviations
    const abbrevResult = await prisma.$queryRaw`SELECT * FROM pg_timezone_names LIMIT 5;`;
    console.log('\nSample timezone names:');
    abbrevResult.forEach(tz => {
      console.log(`  • ${tz.name} (${tz.abbrev})`);
    });
    
  } catch (error) {
    console.error('❌ Error checking timezone:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTimezone();
