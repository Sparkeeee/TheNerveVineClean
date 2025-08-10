const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const newSymptoms = [
  {
    slug: 'multiple-sclerosis',
    title: 'Multiple Sclerosis (MS)',
    description: 'Multiple sclerosis is a chronic autoimmune disease that affects the central nervous system, causing nerve damage and mobility issues. The immune system attacks the protective myelin sheath around nerve fibers, disrupting communication between the brain and the rest of the body.',
    metaTitle: 'Multiple Sclerosis (MS) - Natural Support for Nerve Health',
    metaDescription: 'Explore natural herbal and supplement solutions for managing multiple sclerosis symptoms, supporting nerve health, and improving mobility.',
    commonSymptoms: ['Nerve damage', 'Mobility issues', 'Fatigue', 'Vision problems', 'Balance issues', 'Muscle weakness', 'Numbness', 'Tingling sensations'],
    cautions: 'Consult with healthcare professionals before starting any new supplements, especially if taking MS medications. Some herbs may interact with immunosuppressive treatments.',
    references: [
      'National Multiple Sclerosis Society',
      'Multiple Sclerosis Foundation',
      'Clinical studies on natural supplements for MS'
    ]
  },
  {
    slug: 'parkinsons-disease',
    title: 'Parkinson\'s Disease',
    description: 'Parkinson\'s disease is a progressive neurodegenerative disorder that affects movement, causing tremors, stiffness, and difficulty with balance and coordination. It results from the loss of dopamine-producing neurons in the brain.',
    metaTitle: 'Parkinson\'s Disease - Natural Support for Movement Disorders',
    metaDescription: 'Discover natural herbal and supplement approaches to support Parkinson\'s disease management, improve movement, and enhance quality of life.',
    commonSymptoms: ['Movement disorders', 'Tremors', 'Muscle rigidity', 'Balance problems', 'Slow movement', 'Speech difficulties', 'Sleep issues', 'Cognitive changes'],
    cautions: 'Always consult with healthcare providers before adding supplements, as some may interact with Parkinson\'s medications. Natural approaches should complement, not replace, prescribed treatments.',
    references: [
      'Parkinson\'s Foundation',
      'Michael J. Fox Foundation',
      'Research on natural compounds for Parkinson\'s support'
    ]
  },
  {
    slug: 'alzheimers-disease',
    title: 'Alzheimer\'s Disease',
    description: 'Alzheimer\'s disease is a progressive brain disorder that affects memory, thinking, and behavior. It\'s the most common cause of dementia, characterized by the accumulation of amyloid plaques and tau tangles in the brain.',
    metaTitle: 'Alzheimer\'s Disease - Natural Support for Memory and Cognition',
    metaDescription: 'Learn about natural herbal and supplement strategies to support brain health, memory, and cognitive function in Alzheimer\'s disease.',
    commonSymptoms: ['Memory loss', 'Cognitive decline', 'Confusion', 'Behavioral changes', 'Language difficulties', 'Disorientation', 'Mood swings', 'Sleep disturbances'],
    cautions: 'Natural supplements should be used under medical supervision. Some herbs may interact with Alzheimer\'s medications or affect blood clotting.',
    references: [
      'Alzheimer\'s Association',
      'Alzheimer\'s Research UK',
      'Studies on natural compounds for cognitive support'
    ]
  },
  {
    slug: 'neuropathy',
    title: 'Neuropathy',
    description: 'Neuropathy refers to damage or dysfunction of the peripheral nerves, often causing pain, numbness, tingling, and weakness in the hands and feet. It can result from various conditions including diabetes, autoimmune diseases, and vitamin deficiencies.',
    metaTitle: 'Neuropathy - Natural Relief for Nerve Pain and Discomfort',
    metaDescription: 'Explore natural herbal and supplement solutions for managing neuropathy symptoms, reducing nerve pain, and supporting nerve regeneration.',
    commonSymptoms: ['Nerve pain', 'Numbness', 'Tingling', 'Burning sensations', 'Muscle weakness', 'Loss of coordination', 'Sensitivity to touch', 'Balance issues'],
    cautions: 'Identify and treat the underlying cause of neuropathy. Some supplements may interact with medications or affect blood sugar levels.',
    references: [
      'Neuropathy Foundation',
      'American Diabetes Association',
      'Research on natural nerve support compounds'
    ]
  },
  {
    slug: 'fibromyalgia',
    title: 'Fibromyalgia',
    description: 'Fibromyalgia is a chronic condition characterized by widespread musculoskeletal pain, fatigue, sleep disturbances, and cognitive issues. It affects the way the brain processes pain signals, amplifying painful sensations.',
    metaTitle: 'Fibromyalgia - Natural Support for Chronic Pain and Fatigue',
    metaDescription: 'Discover natural herbal and supplement approaches to manage fibromyalgia symptoms, reduce pain, improve sleep, and boost energy levels.',
    commonSymptoms: ['Chronic pain', 'Fatigue', 'Sleep issues', 'Cognitive fog', 'Stiffness', 'Headaches', 'Irritable bowel symptoms', 'Mood changes'],
    cautions: 'Fibromyalgia treatment should be comprehensive. Some herbs may interact with pain medications or affect sleep patterns.',
    references: [
      'National Fibromyalgia Association',
      'Arthritis Foundation',
      'Studies on natural pain management for fibromyalgia'
    ]
  },
  {
    slug: 'chronic-fatigue-syndrome',
    title: 'Chronic Fatigue Syndrome',
    description: 'Chronic Fatigue Syndrome (CFS) is a complex disorder characterized by extreme fatigue that doesn\'t improve with rest and can\'t be explained by an underlying medical condition. It often includes cognitive difficulties and post-exertional malaise.',
    metaTitle: 'Chronic Fatigue Syndrome - Natural Energy and Cognitive Support',
    metaDescription: 'Learn about natural herbal and supplement strategies to manage chronic fatigue syndrome, boost energy levels, and improve cognitive function.',
    commonSymptoms: ['Extreme fatigue', 'Cognitive issues', 'Post-exertional malaise', 'Unrefreshing sleep', 'Muscle pain', 'Joint pain', 'Headaches', 'Sore throat'],
    cautions: 'CFS requires careful management. Some supplements may cause overstimulation or interact with medications. Start with low doses.',
    references: [
      'Centers for Disease Control and Prevention',
      'Solve ME/CFS Initiative',
      'Research on natural energy and cognitive support'
    ]
  },
  {
    slug: 'restless-leg-syndrome',
    title: 'Restless Leg Syndrome',
    description: 'Restless Leg Syndrome (RLS) is a neurological disorder characterized by an irresistible urge to move the legs, often accompanied by uncomfortable sensations. Symptoms typically worsen in the evening and can significantly disrupt sleep.',
    metaTitle: 'Restless Leg Syndrome - Natural Sleep and Rest Support',
    metaDescription: 'Explore natural herbal and supplement solutions for managing restless leg syndrome, improving sleep quality, and reducing leg discomfort.',
    commonSymptoms: ['Sleep disruption', 'Leg discomfort', 'Urge to move legs', 'Uncomfortable sensations', 'Evening worsening', 'Sleep deprivation', 'Daytime fatigue', 'Mood changes'],
    cautions: 'RLS can be caused by underlying conditions. Some supplements may affect iron absorption or interact with medications.',
    references: [
      'Restless Legs Syndrome Foundation',
      'National Sleep Foundation',
      'Studies on natural sleep and relaxation support'
    ]
  },
  {
    slug: 'essential-tremor',
    title: 'Essential Tremor',
    description: 'Essential tremor is a neurological disorder that causes involuntary shaking, most commonly affecting the hands, head, and voice. It\'s often hereditary and can significantly impact daily activities and quality of life.',
    metaTitle: 'Essential Tremor - Natural Support for Movement Control',
    metaDescription: 'Discover natural herbal and supplement approaches to manage essential tremor, reduce shaking, and improve movement control.',
    commonSymptoms: ['Involuntary shaking', 'Hand tremors', 'Head tremors', 'Voice tremors', 'Worsening with stress', 'Difficulty with fine motor tasks', 'Social anxiety', 'Fatigue'],
    cautions: 'Essential tremor should be properly diagnosed. Some supplements may interact with tremor medications or affect nervous system function.',
    references: [
      'International Essential Tremor Foundation',
      'National Institute of Neurological Disorders and Stroke',
      'Research on natural compounds for movement disorders'
    ]
  },
  {
    slug: 'peripheral-neuropathy',
    title: 'Peripheral Neuropathy',
    description: 'Peripheral neuropathy is damage to the peripheral nerves, typically affecting the hands and feet. It can cause pain, numbness, tingling, and weakness, often resulting from diabetes, autoimmune conditions, or vitamin deficiencies.',
    metaTitle: 'Peripheral Neuropathy - Natural Nerve Health Support',
    metaDescription: 'Learn about natural herbal and supplement strategies to support peripheral nerve health, reduce symptoms, and promote nerve regeneration.',
    commonSymptoms: ['Nerve damage in extremities', 'Pain in hands and feet', 'Numbness', 'Tingling', 'Burning sensations', 'Muscle weakness', 'Loss of coordination', 'Sensitivity to temperature'],
    cautions: 'Address underlying causes first. Some supplements may affect blood sugar or interact with medications. Monitor for any worsening symptoms.',
    references: [
      'Neuropathy Foundation',
      'American Academy of Neurology',
      'Studies on natural nerve regeneration support'
    ]
  },
  {
    slug: 'post-stroke-recovery',
    title: 'Post-Stroke Recovery',
    description: 'Post-stroke recovery involves rehabilitation to regain cognitive and physical function after a stroke. Natural approaches can support brain healing, improve mobility, and enhance recovery outcomes when used alongside medical treatment.',
    metaTitle: 'Post-Stroke Recovery - Natural Support for Rehabilitation',
    metaDescription: 'Explore natural herbal and supplement approaches to support post-stroke recovery, enhance brain healing, and improve rehabilitation outcomes.',
    commonSymptoms: ['Cognitive rehabilitation', 'Physical rehabilitation', 'Memory issues', 'Movement difficulties', 'Speech problems', 'Fatigue', 'Mood changes', 'Balance issues'],
    cautions: 'Post-stroke recovery requires medical supervision. Some supplements may affect blood clotting or interact with stroke medications. Always consult healthcare providers.',
    references: [
      'American Stroke Association',
      'National Stroke Association',
      'Research on natural compounds for brain recovery'
    ]
  }
];

async function addNewSymptoms() {
  try {
    console.log('Starting to add new symptoms to database...');
    
    for (const symptom of newSymptoms) {
      console.log(`Adding symptom: ${symptom.title}`);
      
      // Check if symptom already exists
      const existingSymptom = await prisma.symptom.findUnique({
        where: { slug: symptom.slug }
      });
      
      if (existingSymptom) {
        console.log(`Symptom ${symptom.title} already exists, skipping...`);
        continue;
      }
      
      // Create new symptom
      const newSymptom = await prisma.symptom.create({
        data: {
          slug: symptom.slug,
          title: symptom.title,
          description: symptom.description,
          metaTitle: symptom.metaTitle,
          metaDescription: symptom.metaDescription,
          commonSymptoms: symptom.commonSymptoms,
          cautions: symptom.cautions,
          references: symptom.references
        }
      });
      
      console.log(`Successfully added: ${newSymptom.title} (ID: ${newSymptom.id})`);
    }
    
    console.log('All new symptoms have been added successfully!');
    
  } catch (error) {
    console.error('Error adding symptoms:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
addNewSymptoms();
