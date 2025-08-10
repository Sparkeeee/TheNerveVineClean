import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteOldTensionSymptoms() {
  try {
    console.log('🗑️ Deleting old standalone tension symptoms...');
    
    // Find and delete muscle-tension symptom
    const muscleTension = await prisma.symptom.findFirst({
      where: {
        OR: [
          { slug: 'muscle-tension' },
          { title: { contains: 'Muscle Tension', mode: 'insensitive' } }
        ]
      }
    });

    if (muscleTension) {
      console.log(`📋 Found muscle tension symptom: "${muscleTension.title}" (${muscleTension.slug})`);
      await prisma.symptom.delete({
        where: { id: muscleTension.id }
      });
      console.log('✅ Deleted muscle tension symptom');
    } else {
      console.log('❓ No muscle tension symptom found');
    }

    // Find and delete neck-tension symptom  
    const neckTension = await prisma.symptom.findUnique({
      where: { slug: 'neck-tension' }
    });

    if (neckTension) {
      console.log(`📋 Found neck tension symptom: "${neckTension.title}" (${neckTension.slug})`);
      await prisma.symptom.delete({
        where: { id: neckTension.id }
      });
      console.log('✅ Deleted neck tension symptom');
    } else {
      console.log('❓ No neck tension symptom found');
    }

    // Verify the main Tension symptom and its variants are still intact
    const mainTension = await prisma.symptom.findUnique({
      where: { slug: 'tension' },
      include: { variants: true }
    });

    if (mainTension) {
      console.log('\n✅ Main Tension symptom structure verified:');
      console.log(`🎯 Main Symptom: ${mainTension.title} (${mainTension.slug})`);
      console.log(`🔢 Variants: ${mainTension.variants.length}`);
      
      mainTension.variants.forEach((variant, index) => {
        console.log(`   ${index + 1}. ${variant.name} (${variant.slug})`);
      });
    }

    console.log('\n🎉 Cleanup completed successfully!');
    console.log('📝 Old standalone symptoms deleted');
    console.log('✅ Main Tension symptom with variants preserved');
    console.log('\nNow users will be directed to:');
    console.log('- /symptoms/tension (main page with variant selection)');
    console.log('- /symptoms/tension?variant=neck-tension');
    console.log('- /symptoms/tension?variant=tension-headaches');

  } catch (error) {
    console.error('❌ Error deleting old symptoms:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteOldTensionSymptoms();
