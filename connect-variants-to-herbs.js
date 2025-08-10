const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function connectVariantsToHerbs() {
  try {
    console.log('🔗 Connecting variants to herbs and supplements...');
    
    // Brain Fog variants
    const brainFogVariants = await prisma.symptomVariant.findMany({
      where: {
        parentSymptom: { slug: 'brain-fog' }
      }
    });
    
    // Get relevant herbs for brain fog
    const brainFogHerbs = await prisma.herb.findMany({
      where: {
        slug: {
          in: ['ginkgo-biloba', 'brahmi', 'rhodiola-rosea', 'ashwagandha', 'lion-s-mane']
        }
      }
    });
    
    // Connect Memory variant to memory herbs
    const memoryVariant = brainFogVariants.find(v => v.slug === 'brain-fog-memory');
    if (memoryVariant) {
      await prisma.symptomVariant.update({
        where: { id: memoryVariant.id },
        data: {
          herbs: {
            connect: brainFogHerbs.filter(h => ['ginkgo-biloba', 'brahmi'].includes(h.slug)).map(h => ({ id: h.id }))
          }
        }
      });
      console.log('✅ Connected Memory variant to herbs');
    }
    
    // Connect Focus variant to focus herbs
    const focusVariant = brainFogVariants.find(v => v.slug === 'brain-fog-focus');
    if (focusVariant) {
      await prisma.symptomVariant.update({
        where: { id: focusVariant.id },
        data: {
          herbs: {
            connect: brainFogHerbs.filter(h => ['rhodiola-rosea', 'ashwagandha'].includes(h.slug)).map(h => ({ id: h.id }))
          }
        }
      });
      console.log('✅ Connected Focus variant to herbs');
    }
    
    // Connect Processing variant to processing herbs
    const processingVariant = brainFogVariants.find(v => v.slug === 'brain-fog-processing');
    if (processingVariant) {
      await prisma.symptomVariant.update({
        where: { id: processingVariant.id },
        data: {
          herbs: {
            connect: brainFogHerbs.filter(h => ['lion-s-mane', 'ginkgo-biloba'].includes(h.slug)).map(h => ({ id: h.id }))
          }
        }
      });
      console.log('✅ Connected Processing variant to herbs');
    }
    
    // IBS variants
    const ibsVariants = await prisma.symptomVariant.findMany({
      where: {
        parentSymptom: { slug: 'ibs' }
      }
    });
    
    // Get relevant herbs for IBS
    const ibsHerbs = await prisma.herb.findMany({
      where: {
        slug: {
          in: ['chamomile', 'peppermint', 'ginger', 'licorice', 'slippery-elm']
        }
      }
    });
    
    // Connect IBS-C variant to constipation herbs
    const ibsCVariant = ibsVariants.find(v => v.slug === 'ibs-constipation');
    if (ibsCVariant) {
      await prisma.symptomVariant.update({
        where: { id: ibsCVariant.id },
        data: {
          herbs: {
            connect: ibsHerbs.filter(h => ['ginger', 'licorice'].includes(h.slug)).map(h => ({ id: h.id }))
          }
        }
      });
      console.log('✅ Connected IBS-C variant to herbs');
    }
    
    // Connect IBS-D variant to diarrhea herbs
    const ibsDVariant = ibsVariants.find(v => v.slug === 'ibs-diarrhea');
    if (ibsDVariant) {
      await prisma.symptomVariant.update({
        where: { id: ibsDVariant.id },
        data: {
          herbs: {
            connect: ibsHerbs.filter(h => ['chamomile', 'peppermint'].includes(h.slug)).map(h => ({ id: h.id }))
          }
        }
      });
      console.log('✅ Connected IBS-D variant to herbs');
    }
    
    // Connect IBS-M variant to mixed herbs
    const ibsMVariant = ibsVariants.find(v => v.slug === 'ibs-mixed');
    if (ibsMVariant) {
      await prisma.symptomVariant.update({
        where: { id: ibsMVariant.id },
        data: {
          herbs: {
            connect: ibsHerbs.filter(h => ['slippery-elm', 'chamomile'].includes(h.slug)).map(h => ({ id: h.id }))
          }
        }
      });
      console.log('✅ Connected IBS-M variant to herbs');
    }
    
    console.log('🎉 All variants connected successfully!');
    
  } catch (error) {
    console.error('❌ Error connecting variants:', error);
  } finally {
    await prisma.$disconnect();
  }
}

connectVariantsToHerbs();
