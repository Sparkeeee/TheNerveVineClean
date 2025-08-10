const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkSymptomStructure() {
  console.log('🔍 Checking current symptom and variant structure...\n');

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

    console.log(`📋 Found ${symptoms.length} symptoms:`);
    symptoms.forEach(symptom => {
      console.log(`\n   ${symptom.title} (${symptom.slug})`);
      console.log(`   Variants: ${symptom._count.variants}`);
      if (symptom.description) {
        console.log(`   Description: ${symptom.description.substring(0, 100)}...`);
      }
    });

    // Get all symptom variants with their parent symptoms
    const variants = await prisma.symptomVariant.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        parentSymptom: {
          select: {
            title: true,
            slug: true
          }
        }
      },
      orderBy: {
        parentSymptom: {
          title: 'asc'
        }
      }
    });

    console.log(`\n🔍 Found ${variants.length} symptom variants:`);
    variants.forEach(variant => {
      console.log(`\n   ${variant.name} (${variant.slug})`);
      console.log(`   Parent: ${variant.parentSymptom.title} (${variant.parentSymptom.slug})`);
      if (variant.description) {
        console.log(`   Description: ${variant.description.substring(0, 100)}...`);
      }
    });

    // Check for symptoms that might be missing variants
    const symptomsWithoutVariants = symptoms.filter(s => s._count.variants === 0);
    console.log(`\n⚠️  Symptoms without variants (${symptomsWithoutVariants.length}):`);
    symptomsWithoutVariants.forEach(symptom => {
      console.log(`   • ${symptom.title} (${symptom.slug})`);
    });

    // Check for symptoms with many variants (consolidated ones)
    const symptomsWithManyVariants = symptoms.filter(s => s._count.variants > 2);
    console.log(`\n🎯 Symptoms with many variants (consolidated ones):`);
    symptomsWithManyVariants.forEach(symptom => {
      console.log(`   • ${symptom.title} (${symptom.slug}) - ${symptom._count.variants} variants`);
    });

  } catch (error) {
    console.error('Error checking symptom structure:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSymptomStructure();
