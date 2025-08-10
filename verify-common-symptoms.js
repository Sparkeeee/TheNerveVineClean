const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyCommonSymptomsData() {
  console.log('Verifying commonSymptoms data restoration...\n');

  try {
    // Check symptoms with commonSymptoms (using isEmpty: false for arrays)
    const symptoms = await prisma.symptom.findMany({
      where: {
        commonSymptoms: {
          isEmpty: false
        }
      },
      select: {
        id: true,
        title: true,
        slug: true,
        commonSymptoms: true
      }
    });

    console.log(`Found ${symptoms.length} symptoms with commonSymptoms data:`);
    symptoms.forEach(symptom => {
      console.log(`\n📋 ${symptom.title} (${symptom.slug}):`);
      symptom.commonSymptoms.forEach(symptomItem => {
        console.log(`   • ${symptomItem}`);
      });
    });

    // Check symptom variants with commonSymptoms
    const variants = await prisma.symptomVariant.findMany({
      where: {
        commonSymptoms: {
          isEmpty: false
        }
      },
      select: {
        id: true,
        name: true,
        slug: true,
        commonSymptoms: true
      }
    });

    console.log(`\n\nFound ${variants.length} symptom variants with commonSymptoms data:`);
    variants.forEach(variant => {
      console.log(`\n🔍 ${variant.name} (${variant.slug}):`);
      variant.commonSymptoms.forEach(symptomItem => {
        console.log(`   • ${symptomItem}`);
      });
    });

    // Check total counts
    const totalSymptoms = await prisma.symptom.count();
    const totalVariants = await prisma.symptomVariant.count();
    
    console.log(`\n📊 Summary:`);
    console.log(`   Total Symptoms: ${totalSymptoms}`);
    console.log(`   Symptoms with commonSymptoms: ${symptoms.length}`);
    console.log(`   Total Variants: ${totalVariants}`);
    console.log(`   Variants with commonSymptoms: ${variants.length}`);

  } catch (error) {
    console.error('Error verifying commonSymptoms data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyCommonSymptomsData();
