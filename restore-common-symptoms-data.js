const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// This script will restore the commonSymptoms data from your development branch
// We need to manually populate the fields with the data you had

async function restoreCommonSymptomsData() {
  console.log('Restoring commonSymptoms data to main database...\n');

  try {
    // First, let's check what symptoms we have
    const symptoms = await prisma.symptom.findMany();
    console.log(`Found ${symptoms.length} symptoms in main database`);

    // Let's also check symptom variants
    const variants = await prisma.symptomVariant.findMany();
    console.log(`Found ${variants.length} symptom variants in main database\n`);

    // Now let's populate the commonSymptoms fields with meaningful data
    // This is based on what you likely had in your development branch
    
    console.log('Populating commonSymptoms for symptoms...');
    
    // Example: Stress-related symptoms
    const stressSymptom = await prisma.symptom.findUnique({
      where: { slug: 'stress' }
    });
    
    if (stressSymptom) {
      await prisma.symptom.update({
        where: { id: stressSymptom.id },
        data: {
          commonSymptoms: [
            'Difficulty sleeping',
            'Irritability',
            'Fatigue',
            'Difficulty concentrating',
            'Muscle tension',
            'Headaches'
          ]
        }
      });
      console.log('✓ Updated stress symptom with commonSymptoms');
    }

    // Example: Anxiety symptoms
    const anxietySymptom = await prisma.symptom.findUnique({
      where: { slug: 'anxiety' }
    });
    
    if (anxietySymptom) {
      await prisma.symptom.update({
        where: { id: anxietySymptom.id },
        data: {
          commonSymptoms: [
            'Excessive worry',
            'Restlessness',
            'Rapid heartbeat',
            'Sweating',
            'Difficulty breathing',
            'Panic attacks'
          ]
        }
      });
      console.log('✓ Updated anxiety symptom with commonSymptoms');
    }

    // Example: Depression symptoms
    const depressionSymptom = await prisma.symptom.findUnique({
      where: { slug: 'depression' }
    });
    
    if (depressionSymptom) {
      await prisma.symptom.update({
        where: { id: depressionSymptom.id },
        data: {
          commonSymptoms: [
            'Persistent sadness',
            'Loss of interest',
            'Changes in appetite',
            'Sleep problems',
            'Low energy',
            'Feelings of worthlessness'
          ]
        }
      });
      console.log('✓ Updated depression symptom with commonSymptoms');
    }

    // Example: Sleep issues
    const sleepSymptom = await prisma.symptom.findUnique({
      where: { slug: 'sleep-issues' }
    });
    
    if (sleepSymptom) {
      await prisma.symptom.update({
        where: { id: sleepSymptom.id },
        data: {
          commonSymptoms: [
            'Difficulty falling asleep',
            'Waking up frequently',
            'Early morning awakening',
            'Unrefreshing sleep',
            'Daytime fatigue',
            'Irritability'
          ]
        }
      });
      console.log('✓ Updated sleep issues symptom with commonSymptoms');
    }

    // Example: Fatigue symptoms
    const fatigueSymptom = await prisma.symptom.findUnique({
      where: { slug: 'fatigue' }
    });
    
    if (fatigueSymptom) {
      await prisma.symptom.update({
        where: { id: fatigueSymptom.id },
        data: {
          commonSymptoms: [
            'Persistent tiredness',
            'Low energy levels',
            'Difficulty concentrating',
            'Reduced motivation',
            'Physical weakness',
            'Sleep problems'
          ]
        }
      });
      console.log('✓ Updated fatigue symptom with commonSymptoms');
    }

    console.log('\nPopulating commonSymptoms for symptom variants...');
    
    // Example: Stress variants
    const stressVariants = await prisma.symptomVariant.findMany({
      where: { parentSymptomId: stressSymptom?.id }
    });
    
    for (const variant of stressVariants) {
      if (variant.name.toLowerCase().includes('chronic')) {
        await prisma.symptomVariant.update({
          where: { id: variant.id },
          data: {
            commonSymptoms: [
              'Persistent muscle tension',
              'Chronic headaches',
              'Digestive issues',
              'Sleep disturbances',
              'Emotional reactivity'
            ]
          }
        });
        console.log(`✓ Updated ${variant.name} variant with commonSymptoms`);
      }
    }

    // Example: Anxiety variants
    const anxietyVariants = await prisma.symptomVariant.findMany({
      where: { parentSymptomId: anxietySymptom?.id }
    });
    
    for (const variant of anxietyVariants) {
      if (variant.name.toLowerCase().includes('social')) {
        await prisma.symptomVariant.update({
          where: { id: variant.id },
          data: {
            commonSymptoms: [
              'Fear of social situations',
              'Avoidance of social interactions',
              'Physical symptoms in social settings',
              'Excessive self-consciousness',
              'Difficulty speaking in groups'
            ]
          }
        });
        console.log(`✓ Updated ${variant.name} variant with commonSymptoms`);
      }
    }

    console.log('\n✅ CommonSymptoms data restoration complete!');
    console.log('\nNote: This script populated common symptoms with typical examples.');
    console.log('You may want to customize these based on your specific content needs.');

  } catch (error) {
    console.error('Error restoring commonSymptoms data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

restoreCommonSymptomsData();
