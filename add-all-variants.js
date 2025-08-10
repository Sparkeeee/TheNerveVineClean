import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addAllVariants() {
  try {
    // IBS variants
    const ibs = await prisma.symptom.findUnique({
      where: { slug: 'ibs' }
    });

    if (ibs) {
      const ibsVariants = [
        {
          name: 'IBS-C',
          slug: 'ibs-constipation',
          description: 'Irritable Bowel Syndrome with Constipation (IBS-C) is characterized by infrequent bowel movements, hard stools, and difficulty passing stool. This type often involves abdominal discomfort and bloating.',
          metaTitle: 'IBS-C (Constipation) - Natural Solutions',
          metaDescription: 'Learn about IBS-C and natural remedies for constipation-predominant IBS.',
          cautions: 'Consult with a healthcare provider before starting any new supplement regimen, especially if you have existing medical conditions or are taking medications.'
        },
        {
          name: 'IBS-D',
          slug: 'ibs-diarrhea',
          description: 'Irritable Bowel Syndrome with Diarrhea (IBS-D) involves frequent, loose stools and urgent bowel movements. This type often includes abdominal pain and cramping.',
          metaTitle: 'IBS-D (Diarrhea) - Natural Solutions',
          metaDescription: 'Learn about IBS-D and natural remedies for diarrhea-predominant IBS.',
          cautions: 'Consult with a healthcare provider before starting any new supplement regimen, especially if you have existing medical conditions or are taking medications.'
        },
        {
          name: 'IBS-M',
          slug: 'ibs-mixed',
          description: 'Irritable Bowel Syndrome with Mixed bowel habits (IBS-M) involves alternating between constipation and diarrhea. This type can be particularly challenging to manage.',
          metaTitle: 'IBS-M (Mixed) - Natural Solutions',
          metaDescription: 'Learn about IBS-M and natural remedies for mixed bowel habit IBS.',
          cautions: 'Consult with a healthcare provider before starting any new supplement regimen, especially if you have existing medical conditions or are taking medications.'
        }
      ];

      for (const variantData of ibsVariants) {
        await prisma.symptomVariant.create({
          data: {
            parentSymptomId: ibs.id,
            ...variantData
          }
        });
        console.log(`Created IBS variant: ${variantData.name}`);
      }
    }

    // Anxiety variants
    const anxiety = await prisma.symptom.findUnique({
      where: { slug: 'anxiety' }
    });

    if (anxiety) {
      const anxietyVariants = [
        {
          name: 'Generalized',
          slug: 'anxiety-generalized',
          description: 'Generalized Anxiety Disorder (GAD) involves persistent, excessive worry about everyday situations. This type is characterized by chronic anxiety that interferes with daily life.',
          metaTitle: 'Generalized Anxiety - Natural Solutions',
          metaDescription: 'Learn about generalized anxiety and natural remedies for GAD.',
          cautions: 'Consult with a healthcare provider before starting any new supplement regimen, especially if you have existing medical conditions or are taking medications.'
        },
        {
          name: 'Social',
          slug: 'anxiety-social',
          description: 'Social Anxiety Disorder involves intense fear of social situations and being judged by others. This type can significantly impact relationships and daily activities.',
          metaTitle: 'Social Anxiety - Natural Solutions',
          metaDescription: 'Learn about social anxiety and natural remedies for social situations.',
          cautions: 'Consult with a healthcare provider before starting any new supplement regimen, especially if you have existing medical conditions or are taking medications.'
        },
        {
          name: 'Panic',
          slug: 'anxiety-panic',
          description: 'Panic Disorder involves sudden, intense episodes of fear and physical symptoms. This type can include heart palpitations, shortness of breath, and feelings of impending doom.',
          metaTitle: 'Panic Disorder - Natural Solutions',
          metaDescription: 'Learn about panic disorder and natural remedies for panic attacks.',
          cautions: 'Consult with a healthcare provider before starting any new supplement regimen, especially if you have existing medical conditions or are taking medications.'
        }
      ];

      for (const variantData of anxietyVariants) {
        await prisma.symptomVariant.create({
          data: {
            parentSymptomId: anxiety.id,
            ...variantData
          }
        });
        console.log(`Created Anxiety variant: ${variantData.name}`);
      }
    }

    // Stress variants
    const stress = await prisma.symptom.findUnique({
      where: { slug: 'stress' }
    });

    if (stress) {
      const stressVariants = [
        {
          name: 'Adrenal Overload',
          slug: 'stress-adrenal-overload',
          description: 'Adrenal overload occurs when the adrenal glands are overstimulated by chronic stress, leading to elevated cortisol levels and heightened stress responses. This type is characterized by feeling wired, anxious, and unable to relax.',
          metaTitle: 'Adrenal Overload - Natural Solutions',
          metaDescription: 'Learn about adrenal overload and natural remedies for overstimulated adrenal function.',
          cautions: 'Consult with a healthcare provider before starting any new supplement regimen, especially if you have existing medical conditions or are taking medications.'
        },
        {
          name: 'Adrenal Exhaustion',
          slug: 'stress-adrenal-exhaustion',
          description: 'Adrenal exhaustion develops when the adrenal glands become depleted after prolonged periods of stress. This type is characterized by fatigue, low energy, difficulty handling stress, and feeling burned out.',
          metaTitle: 'Adrenal Exhaustion - Natural Solutions',
          metaDescription: 'Learn about adrenal exhaustion and natural remedies for depleted adrenal function.',
          cautions: 'Consult with a healthcare provider before starting any new supplement regimen, especially if you have existing medical conditions or are taking medications.'
        },
        {
          name: 'Burnout',
          slug: 'stress-burnout',
          description: 'Burnout is a state of emotional, physical, and mental exhaustion caused by excessive and prolonged stress. This type often affects work performance and personal relationships.',
          metaTitle: 'Burnout - Natural Solutions',
          metaDescription: 'Learn about burnout and natural remedies for recovery.',
          cautions: 'Consult with a healthcare provider before starting any new supplement regimen, especially if you have existing medical conditions or are taking medications.'
        }
      ];

      for (const variantData of stressVariants) {
        await prisma.symptomVariant.create({
          data: {
            parentSymptomId: stress.id,
            ...variantData
          }
        });
        console.log(`Created Stress variant: ${variantData.name}`);
      }
    }

    // Fatigue variants
    const fatigue = await prisma.symptom.findUnique({
      where: { slug: 'fatigue' }
    });

    if (fatigue) {
      const fatigueVariants = [
        {
          name: 'Physical',
          slug: 'fatigue-physical',
          description: 'Physical fatigue involves tiredness and lack of energy in the body. This type can affect daily activities and exercise capacity.',
          metaTitle: 'Physical Fatigue - Natural Solutions',
          metaDescription: 'Learn about physical fatigue and natural remedies for energy support.',
          cautions: 'Consult with a healthcare provider before starting any new supplement regimen, especially if you have existing medical conditions or are taking medications.'
        },
        {
          name: 'Mental',
          slug: 'fatigue-mental',
          description: 'Mental fatigue involves cognitive tiredness, difficulty concentrating, and reduced mental performance. This type can affect work and daily tasks.',
          metaTitle: 'Mental Fatigue - Natural Solutions',
          metaDescription: 'Learn about mental fatigue and natural remedies for cognitive support.',
          cautions: 'Consult with a healthcare provider before starting any new supplement regimen, especially if you have existing medical conditions or are taking medications.'
        },
        {
          name: 'Chronic',
          slug: 'fatigue-chronic',
          description: 'Chronic fatigue is persistent tiredness that lasts for months or years. This type can significantly impact quality of life and daily functioning.',
          metaTitle: 'Chronic Fatigue - Natural Solutions',
          metaDescription: 'Learn about chronic fatigue and natural remedies for long-term support.',
          cautions: 'Consult with a healthcare provider before starting any new supplement regimen, especially if you have existing medical conditions or are taking medications.'
        }
      ];

      for (const variantData of fatigueVariants) {
        await prisma.symptomVariant.create({
          data: {
            parentSymptomId: fatigue.id,
            ...variantData
          }
        });
        console.log(`Created Fatigue variant: ${variantData.name}`);
      }
    }

    // Brain Fog variants
    const brainFog = await prisma.symptom.findUnique({
      where: { slug: 'brain-fog' }
    });

    if (brainFog) {
      const brainFogVariants = [
        {
          name: 'Memory',
          slug: 'brain-fog-memory',
          description: 'Memory-related brain fog involves difficulty recalling information, forgetfulness, and reduced ability to retain new information.',
          metaTitle: 'Memory Brain Fog - Natural Solutions',
          metaDescription: 'Learn about memory-related brain fog and natural remedies for cognitive support.',
          cautions: 'Consult with a healthcare provider before starting any new supplement regimen, especially if you have existing medical conditions or are taking medications.'
        },
        {
          name: 'Focus',
          slug: 'brain-fog-focus',
          description: 'Focus-related brain fog involves difficulty concentrating, reduced attention span, and inability to maintain mental clarity.',
          metaTitle: 'Focus Brain Fog - Natural Solutions',
          metaDescription: 'Learn about focus-related brain fog and natural remedies for concentration.',
          cautions: 'Consult with a healthcare provider before starting any new supplement regimen, especially if you have existing medical conditions or are taking medications.'
        },
        {
          name: 'Processing',
          slug: 'brain-fog-processing',
          description: 'Processing-related brain fog involves slowed thinking, difficulty processing information, and reduced mental speed.',
          metaTitle: 'Processing Brain Fog - Natural Solutions',
          metaDescription: 'Learn about processing-related brain fog and natural remedies for mental speed.',
          cautions: 'Consult with a healthcare provider before starting any new supplement regimen, especially if you have existing medical conditions or are taking medications.'
        }
      ];

      for (const variantData of brainFogVariants) {
        await prisma.symptomVariant.create({
          data: {
            parentSymptomId: brainFog.id,
            ...variantData
          }
        });
        console.log(`Created Brain Fog variant: ${variantData.name}`);
      }
    }

    console.log('All variants created successfully!');
  } catch (error) {
    console.error('Error adding variants:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addAllVariants(); 