const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateAnxietyVariants() {
  try {
    console.log('🔄 Updating Anxiety variants with proper content...');
    
    // Get the Anxiety symptom
    const anxiety = await prisma.symptom.findUnique({
      where: { slug: 'anxiety' },
      include: { variants: true }
    });
    
    if (!anxiety) {
      console.log('❌ Anxiety symptom not found');
      return;
    }
    
    // Update Generalized variant with comprehensive GAD content
    const generalizedVariant = anxiety.variants.find(v => v.slug === 'anxiety-generalized');
    if (generalizedVariant) {
      await prisma.symptomVariant.update({
        where: { id: generalizedVariant.id },
        data: {
          name: 'Generalized Anxiety',
          description: `Generalized Anxiety Disorder (GAD) is characterized by persistent and excessive worry about various aspects of life, even when there's little or no reason to worry. This type of anxiety goes beyond normal stress and can significantly impact daily functioning.

People with GAD often experience:
• Persistent worry about everyday activities
• Difficulty controlling worry
• Physical symptoms like restlessness, fatigue, and muscle tension
• Sleep disturbances and concentration problems
• Irritability and mood changes

The worry in GAD is typically about multiple areas of life, such as health, work, relationships, and everyday responsibilities. This differs from other anxiety disorders which may focus on specific situations or triggers.

Natural approaches for GAD often focus on herbs and supplements that support the nervous system's stress response, promote relaxation, and help regulate mood. These can be particularly helpful for managing the persistent worry and physical symptoms associated with GAD.`
        }
      });
      console.log('✅ Updated Generalized Anxiety variant');
    }
    
    // Update Social variant
    const socialVariant = anxiety.variants.find(v => v.slug === 'anxiety-social');
    if (socialVariant) {
      await prisma.symptomVariant.update({
        where: { id: socialVariant.id },
        data: {
          name: 'Social Anxiety',
          description: `Social Anxiety Disorder involves intense fear and anxiety about social situations where you might be judged, embarrassed, or humiliated. This goes beyond normal shyness and can significantly impact relationships, work, and daily activities.

Key characteristics of social anxiety include:
• Fear of being judged or criticized by others
• Avoidance of social situations or performance situations
• Physical symptoms like blushing, sweating, trembling, or rapid heartbeat
• Difficulty speaking in public or meeting new people
• Worry about embarrassing yourself in social settings

Social anxiety can range from mild discomfort in specific situations to severe avoidance that impacts multiple areas of life. The fear is typically focused on negative evaluation by others rather than the situation itself.

Natural support for social anxiety often involves herbs and supplements that help calm the nervous system, reduce performance anxiety, and support confidence in social interactions.`
        }
      });
      console.log('✅ Updated Social Anxiety variant');
    }
    
    // Update Panic variant
    const panicVariant = anxiety.variants.find(v => v.slug === 'anxiety-panic');
    if (panicVariant) {
      await prisma.symptomVariant.update({
        where: { id: panicVariant.id },
        data: {
          name: 'Panic Disorder',
          description: `Panic Disorder is characterized by recurrent, unexpected panic attacks - sudden episodes of intense fear that trigger severe physical reactions when there's no real danger or apparent cause.

Panic attacks typically include:
• Sudden onset of intense fear or discomfort
• Physical symptoms like heart palpitations, chest pain, shortness of breath
• Dizziness, lightheadedness, or feeling faint
• Trembling, shaking, or sweating
• Fear of losing control or "going crazy"
• Fear of dying

Panic attacks can occur unexpectedly or be triggered by specific situations. The fear of having another attack can lead to avoidance behaviors and significant lifestyle changes.

Natural approaches for panic disorder often focus on herbs and supplements that help regulate the nervous system's fight-or-flight response, promote calm, and support the body's natural stress management systems.`
        }
      });
      console.log('✅ Updated Panic Disorder variant');
    }
    
    console.log('🎉 All Anxiety variants updated successfully!');
    
  } catch (error) {
    console.error('❌ Error updating anxiety variants:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAnxietyVariants();
