const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkSymptomVariants() {
  try {
    console.log('🔍 Checking current symptom variants...');
    
    const symptoms = await prisma.symptom.findMany({
      include: {
        variants: {
          include: {
            herbs: true,
            supplements: true
          }
        }
      },
      orderBy: {
        title: 'asc'
      }
    });
    
    console.log('📋 Current symptoms and their variants:');
    console.log('========================================');
    
    symptoms.forEach((symptom, index) => {
      console.log(`${index + 1}. ${symptom.title} (${symptom.slug})`);
      console.log(`   Variants: ${symptom.variants.length}`);
      
      if (symptom.variants.length > 0) {
        symptom.variants.forEach(variant => {
          console.log(`   - ${variant.name} (${variant.slug})`);
          console.log(`     Herbs: ${variant.herbs.length}, Supplements: ${variant.supplements.length}`);
        });
      } else {
        console.log(`   ⚠️  NO VARIANTS`);
      }
      console.log('');
    });
    
    // Check for symptoms that should have variants but don't
    const symptomsNeedingVariants = symptoms.filter(s => 
      s.variants.length === 0 && 
      ['brain-fog', 'insomnia', 'anxiety', 'depression', 'fatigue', 'ibs'].includes(s.slug)
    );
    
    if (symptomsNeedingVariants.length > 0) {
      console.log('⚠️  Symptoms missing variants:');
      symptomsNeedingVariants.forEach(s => console.log(`- ${s.title} (${s.slug})`));
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSymptomVariants();
