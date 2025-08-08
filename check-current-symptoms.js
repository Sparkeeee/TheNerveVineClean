const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkCurrentSymptoms() {
  try {
    console.log('🔍 Checking current symptoms...');
    
    const symptoms = await prisma.symptom.findMany({
      select: {
        title: true,
        slug: true,
        description: true
      },
      orderBy: {
        title: 'asc'
      }
    });
    
    console.log('📋 Current symptoms in database:');
    console.log('================================');
    
    symptoms.forEach((symptom, index) => {
      console.log(`${index + 1}. ${symptom.title} (${symptom.slug})`);
      if (symptom.description) {
        const shortDesc = symptom.description.length > 80 ? 
          symptom.description.substring(0, 80) + '...' : 
          symptom.description;
        console.log(`   ${shortDesc}`);
      }
      console.log('');
    });
    
    console.log(`📊 Total: ${symptoms.length} symptoms`);
    
    // Check for burnout-related symptoms
    const burnoutSymptoms = symptoms.filter(s => 
      s.title.toLowerCase().includes('burnout') || 
      s.title.toLowerCase().includes('adrenal') ||
      s.title.toLowerCase().includes('exhaustion') ||
      s.title.toLowerCase().includes('fatigue')
    );
    
    if (burnoutSymptoms.length > 0) {
      console.log('\n🔥 Burnout/Adrenal related symptoms:');
      burnoutSymptoms.forEach(s => console.log(`- ${s.title}`));
    } else {
      console.log('\n🔥 No burnout/adrenal symptoms found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCurrentSymptoms();
