import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function moveNeckTensionContent() {
  try {
    console.log('🔄 Moving content from neck-tension symptom to Neck Tension variant...');
    
    // First, find the existing neck-tension symptom
    const neckTensionSymptom = await prisma.symptom.findUnique({
      where: { slug: 'neck-tension' }
    });

    if (!neckTensionSymptom) {
      console.log('❓ No existing neck-tension symptom found');
      return;
    }

    console.log(`📋 Found existing symptom: "${neckTensionSymptom.title}" (${neckTensionSymptom.slug})`);
    console.log(`📝 Description: ${neckTensionSymptom.description?.substring(0, 100)}...`);
    
    // Find the Neck Tension variant under the main Tension symptom
    const neckTensionVariant = await prisma.symptomVariant.findUnique({
      where: { slug: 'neck-tension' }
    });

    if (!neckTensionVariant) {
      console.log('❌ Neck Tension variant not found under main Tension symptom');
      return;
    }

    console.log(`📋 Found Neck Tension variant: "${neckTensionVariant.name}" (${neckTensionVariant.slug})`);
    
    // Update the Neck Tension variant with content from the standalone symptom
    const updatedVariant = await prisma.symptomVariant.update({
      where: { id: neckTensionVariant.id },
      data: {
        description: neckTensionSymptom.description,
        metaTitle: neckTensionSymptom.metaTitle || 'Neck Tension - Natural Relief & Prevention',
        metaDescription: neckTensionSymptom.metaDescription || 'Discover natural remedies for neck tension including herbs, supplements, and lifestyle approaches for lasting relief.',
        cautions: neckTensionSymptom.cautions,
        references: neckTensionSymptom.references
      }
    });
    
    console.log('✅ Updated Neck Tension variant with content from standalone symptom');
    console.log(`📝 New description: ${updatedVariant.description?.substring(0, 100)}...`);
    
    // Show what we can do with the old standalone symptom
    console.log('\n🤔 What to do with the old neck-tension symptom?');
    console.log(`   - Keep it as is: "${neckTensionSymptom.title}" (${neckTensionSymptom.slug})`);
    console.log('   - Delete it since content is now in the variant');
    console.log('   - You can decide manually');

    // Show the current state
    const tensionWithVariants = await prisma.symptom.findUnique({
      where: { slug: 'tension' },
      include: { 
        variants: {
          include: {
            herbs: { select: { name: true, commonName: true } },
            supplements: { select: { name: true } }
          }
        }
      }
    });

    console.log('\n📋 Updated Tension Structure:');
    console.log('==============================');
    console.log(`🎯 Main Symptom: ${tensionWithVariants.title} (${tensionWithVariants.slug})`);
    console.log(`   Variants: ${tensionWithVariants.variants.length}`);
    
    tensionWithVariants.variants.forEach((variant, index) => {
      console.log(`\n   ${index + 1}. ${variant.name} (${variant.slug})`);
      console.log(`      Description: ${variant.description?.substring(0, 80)}...`);
      console.log(`      Meta Title: ${variant.metaTitle || 'None'}`);
      console.log(`      Cautions: ${variant.cautions ? 'Present' : 'None'}`);
      console.log(`      Herbs: ${variant.herbs.length}`);
      console.log(`      Supplements: ${variant.supplements.length}`);
    });

    console.log('\n🎉 Neck tension content move completed successfully!');

  } catch (error) {
    console.error('❌ Error moving neck tension content:', error);
  } finally {
    await prisma.$disconnect();
  }
}

moveNeckTensionContent();
