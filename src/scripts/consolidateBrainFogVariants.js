import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function consolidateBrainFogVariants() {
  console.log('🔄 Consolidating Poor Focus and Poor Memory as variants under Brain Fog...\n');

  // 1. Fetch Brain Fog, Poor Focus, and Memory Loss by slug
  const brainFog = await prisma.symptom.findUnique({ where: { slug: 'brain-fog' } });
  const poorFocus = await prisma.symptom.findUnique({ where: { slug: 'poor-focus' } });
  const memoryLoss = await prisma.symptom.findUnique({ where: { slug: 'memory-loss' } });

  if (!brainFog) {
    console.error('❌ Brain Fog symptom not found!');
    return;
  }
  if (!poorFocus) {
    console.error('❌ Poor Focus symptom (slug: poor-focus) not found!');
    return;
  }
  if (!memoryLoss) {
    console.error('❌ Memory Loss symptom (slug: memory-loss) not found!');
    return;
  }

  // 2. Prepare new variants object for Brain Fog
  const brainFogVariants = brainFog.variants || {};
  // Move existing Brain Fog content to Default variant if not already present
  if (!brainFogVariants.Default && brainFog.description) {
    brainFogVariants.Default = { paragraphs: [brainFog.description] };
  }

  // Add Poor Focus as a variant
  brainFogVariants['Poor Focus'] = poorFocus.variants?.Default || { paragraphs: [poorFocus.description || ''] };

  // Add Poor Memory as a variant (from memory-loss)
  brainFogVariants['Poor Memory'] = memoryLoss.variants?.Default || { paragraphs: [memoryLoss.description || ''] };

  // 3. Update Brain Fog with new variants
  await prisma.symptom.update({
    where: { id: brainFog.id },
    data: {
      variants: brainFogVariants
    }
  });
  console.log('✅ Updated Brain Fog with Poor Focus and Poor Memory as variants.');

  // 4. Delete Poor Focus and Memory Loss as separate symptoms
  await prisma.symptom.delete({ where: { id: poorFocus.id } });
  await prisma.symptom.delete({ where: { id: memoryLoss.id } });
  console.log('🗑️ Deleted Poor Focus and Memory Loss as separate symptoms.');

  await prisma.$disconnect();
  console.log('🎉 Consolidation complete!');
}

consolidateBrainFogVariants(); 