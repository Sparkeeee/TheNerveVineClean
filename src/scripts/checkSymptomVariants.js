import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkSymptomVariants() {
  console.log('🔍 Checking variants for symptoms needing content...\n');
  
  const symptomsNeedingContent = [
    'fatigue',
    'liver-detox', 
    'blood-pressure',
    'dysbiosis',
    'memory-loss',
    'digestive-health'
  ];

  try {
    const symptoms = await prisma.symptom.findMany({
      where: {
        slug: { in: symptomsNeedingContent }
      },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        variants: true
      }
    });

    console.log('📊 VARIANT ANALYSIS FOR SYMPTOMS NEEDING CONTENT:');
    console.log('================================================');
    
    const withRealVariants = [];
    const withoutVariants = [];
    
    symptoms.forEach(symptom => {
      const hasVariants = symptom.variants && typeof symptom.variants === 'object' && Object.keys(symptom.variants).length > 0;
      const variantCount = hasVariants ? Object.keys(symptom.variants).length : 0;
      
      // Check if variants have actual content (not just "Default" placeholder)
      const hasRealContent = hasVariants && symptom.variants && 
        Object.values(symptom.variants).some(variant => 
          variant && typeof variant === 'object' && 
          (variant.paragraphs || variant.productFormulations || variant.cautions)
        );
      
      console.log(`\n• ${symptom.title} (${symptom.slug})`);
      console.log(`  Has variants field: ${hasVariants ? '✅' : '❌'}`);
      console.log(`  Has real variant content: ${hasRealContent ? '✅' : '❌'}`);
      console.log(`  Variant count: ${variantCount}`);
      
      if (hasVariants) {
        console.log(`  Variant names: ${Object.keys(symptom.variants).join(', ')}`);
        // Show a sample of variant content
        const firstVariant = Object.values(symptom.variants)[0];
        if (firstVariant && typeof firstVariant === 'object') {
          console.log(`  Sample content: ${JSON.stringify(firstVariant).substring(0, 100)}...`);
        }
      }
      
      console.log(`  Current description: "${symptom.description || 'No description'}"`);
      
      if (hasRealContent) {
        withRealVariants.push(symptom);
      } else {
        withoutVariants.push(symptom);
      }
    });

    console.log('\n📈 SUMMARY:');
    console.log(`• Symptoms with REAL variants: ${withRealVariants.length}`);
    console.log(`• Symptoms without variants (or only placeholders): ${withoutVariants.length}`);
    console.log(`• Total symptoms checked: ${symptoms.length}`);

    if (withRealVariants.length > 0) {
      console.log('\n✅ SYMPTOMS WITH REAL VARIANTS:');
      withRealVariants.forEach(s => console.log(`  • ${s.title} (${s.slug})`));
    }

    if (withoutVariants.length > 0) {
      console.log('\n❌ SYMPTOMS WITHOUT VARIANTS:');
      withoutVariants.forEach(s => console.log(`  • ${s.title} (${s.slug})`));
    }

  } catch (error) {
    console.error('💥 Error checking variants:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSymptomVariants(); 