const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixBrainFogVariants() {
  try {
    console.log('Fetching current brain-fog symptom...');
    
    const symptom = await prisma.symptom.findUnique({
      where: { slug: 'brain-fog' }
    });

    if (!symptom) {
      console.log('Brain-fog symptom not found in database');
      return;
    }

    console.log('Current variants:', symptom.variants);

    // The correct structure should be:
    // - Default content (Brain Fog/Cognitive Fog) - no variant button
    // - Poor Focus - variant button
    // - Poor Memory - variant button

    // Remove "Cognitive Fog" from variants if it exists
    // Keep only "Poor Focus" and "Poor Memory" as variants
    const currentVariants = symptom.variants || {};
    
    // Filter out "Cognitive Fog" and keep only the actual variants
    const correctedVariants = {};
    
    Object.keys(currentVariants).forEach(key => {
      if (key !== 'Cognitive Fog' && key !== 'Default') {
        correctedVariants[key] = currentVariants[key];
      }
    });

    console.log('Corrected variants:', correctedVariants);

    // Update the symptom with corrected variants
    await prisma.symptom.update({
      where: { slug: 'brain-fog' },
      data: {
        variants: correctedVariants
      }
    });

    console.log('Brain-fog variants fixed successfully!');
    
  } catch (error) {
    console.error('Error fixing brain-fog variants:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixBrainFogVariants(); 