const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function continueSymptomConsolidation() {
  console.log('🔍 Analyzing current symptom structure and suggesting consolidation...\n');

  try {
    // Get all symptoms
    const symptoms = await prisma.symptom.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        _count: {
          select: {
            variants: true
          }
        }
      },
      orderBy: {
        title: 'asc'
      }
    });

    // Separate symptoms with and without variants
    const symptomsWithVariants = symptoms.filter(s => s._count.variants > 0);
    const symptomsWithoutVariants = symptoms.filter(s => s._count.variants === 0);

    console.log(`📊 Current Status:`);
    console.log(`   Total Symptoms: ${symptoms.length}`);
    console.log(`   Symptoms with Variants: ${symptomsWithVariants.length}`);
    console.log(`   Symptoms without Variants: ${symptomsWithoutVariants.length}\n`);

    // Show current consolidated structure
    console.log('🎯 Currently Consolidated Symptoms:');
    symptomsWithVariants.forEach(symptom => {
      console.log(`\n   ${symptom.title} (${symptom.slug}) - ${symptom._count.variants} variants`);
    });

    // Analyze symptoms without variants for potential consolidation
    console.log('\n🔍 Symptoms Ready for Consolidation:');
    symptomsWithoutVariants.forEach(symptom => {
      console.log(`   • ${symptom.title} (${symptom.slug})`);
    });

    // Suggest logical groupings for consolidation
    console.log('\n💡 Suggested Consolidation Groups:');
    
    // Group 1: Adrenal/Hormonal Issues
    console.log('\n   1. Adrenal & Hormonal Support:');
    console.log('      Parent: Adrenal Health');
    console.log('      Variants:');
    console.log('        • Adrenal Exhaustion');
    console.log('        • Adrenal Overload');
    console.log('        • Hormonal Imbalances');
    console.log('        • Thyroid Issues');

    // Group 2: Digestive Issues
    console.log('\n   2. Digestive Health:');
    console.log('      Parent: Digestive Wellness');
    console.log('      Variants:');
    console.log('        • IBS (already consolidated)');
    console.log('        • Dysbiosis');
    console.log('        • Leaky Gut');
    console.log('        • Digestive Health (general)');

    // Group 3: Cardiovascular Issues
    console.log('\n   3. Cardiovascular Support:');
    console.log('      Parent: Heart & Circulation');
    console.log('      Variants:');
    console.log('        • Blood Pressure Balance');
    console.log('        • Heart Muscle Support');

    // Group 4: Cognitive Issues
    console.log('\n   4. Cognitive Health:');
    console.log('      Parent: Brain & Memory');
    console.log('      Variants:');
    console.log('        • Brain Fog (already consolidated)');
    console.log('        • Memory Loss');
    console.log('        • Migraine Relief');

    // Group 5: Musculoskeletal Issues
    console.log('\n   5. Musculoskeletal Tension:');
    console.log('      Parent: Tension & Pain');
    console.log('      Variants:');
    console.log('        • Muscle Tension / Tension Headaches');
    console.log('        • Neck Tension');

    // Group 6: Sleep & Circadian Issues
    console.log('\n   6. Sleep & Circadian Health:');
    console.log('      Parent: Sleep Wellness');
    console.log('      Variants:');
    console.log('        • Insomnia (already consolidated)');
    console.log('        • Circadian Support');

    // Group 7: Emotional & Mood Issues
    console.log('\n   7. Emotional & Mood Health:');
    console.log('      Parent: Emotional Wellness');
    console.log('      Variants:');
    console.log('        • Anxiety (already consolidated)');
    console.log('        • Depression (already has 1 variant)');
    console.log('        • Mood Swings');
    console.log('        • Emotional Burnout');

    // Group 8: Energy & Vitality Issues
    console.log('\n   8. Energy & Vitality:');
    console.log('      Parent: Vitality Support');
    console.log('      Variants:');
    console.log('        • Fatigue (already consolidated)');
    console.log('        • Vagus Nerve Support');

    console.log('\n📋 Next Steps:');
    console.log('   1. Choose which consolidation groups to implement first');
    console.log('   2. Create parent symptoms for each group');
    console.log('   3. Convert existing symptoms to variants');
    console.log('   4. Update descriptions and metadata');
    console.log('   5. Ensure proper relationships with herbs/supplements');

    console.log('\n⚠️  Important Notes:');
    console.log('   • This will require careful planning to avoid data loss');
    console.log('   • Consider creating a backup before making changes');
    console.log('   • Update any existing content that references old symptom slugs');
    console.log('   • Ensure proper redirects for SEO purposes');

  } catch (error) {
    console.error('Error analyzing symptom structure:', error);
  } finally {
    await prisma.$disconnect();
  }
}

continueSymptomConsolidation();
