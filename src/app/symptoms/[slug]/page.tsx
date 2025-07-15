import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import VariantSymptomPage from './VariantSymptomPage';

interface SymptomPageProps {
  params: Promise<{ slug: string }>;
}

const symptoms = {
  'insomnia': {
    title: 'Insomnia',
    description: 'Difficulty falling asleep, staying asleep, or waking up too early.',
    paragraphs: [
      "Insomnia is a common sleep disorder that can take several forms: trouble falling asleep, trouble staying asleep, or waking up too early and being unable to return to sleep. Each type may have different underlying causes and best solutions.",
      "Natural approaches to insomnia focus on calming the nervous system, supporting circadian rhythms, and addressing root causes such as stress, nutrient deficiencies, or hormonal imbalances."
    ],
    variants: {
      'Sleep Onset Insomnia': {
        paragraphs: [
          "Sleep onset insomnia is difficulty falling asleep at the beginning of the night. It is often related to stress, anxiety, or an overactive mind.",
          "Supporting relaxation and calming the nervous system before bed is key."
        ],
        bestHerb: {
          name: 'Valerian Root',
          description: 'Traditional sleep herb with modern clinical studies showing effectiveness for falling asleep.',
          affiliateLink: 'https://amzn.to/valerian-sleep',
          price: '$18-25'
        },
        bestStandardized: {
          name: 'Melatonin (0.5-3mg)',
          description: 'Most researched sleep supplement. Regulates circadian rhythm and helps initiate sleep.',
          affiliateLink: 'https://amzn.to/melatonin-sleep',
          price: '$15-25'
        },
        topSupplements: [
          {
            name: 'Magnesium Glycinate',
            description: 'Essential mineral for muscle relaxation and GABA support. Deficiency common in insomnia.',
            affiliateLink: 'https://amzn.to/magnesium-sleep',
            price: '$18-28'
          },
          {
            name: 'L-Theanine',
            description: 'Amino acid that promotes calm focus and relaxation before bed.',
            affiliateLink: 'https://amzn.to/theanine-sleep',
            price: '$15-25'
          }
        ]
      },
      'Sleep Maintenance Insomnia': {
        paragraphs: [
          "Sleep maintenance insomnia is waking up frequently during the night or having trouble staying asleep. It can be related to blood sugar swings, stress hormones, or environmental factors.",
          "Stabilizing blood sugar and supporting stress resilience can help."
        ],
        bestHerb: {
          name: 'Passionflower',
          description: 'Gentle nervine herb that enhances GABA activity for natural sleep support and reduces nighttime awakenings.',
          affiliateLink: 'https://amzn.to/passionflower-sleep',
          price: '$15-25'
        },
        bestStandardized: {
          name: 'Magnesium Glycinate',
          description: 'Essential mineral for muscle relaxation and sleep maintenance.',
          affiliateLink: 'https://amzn.to/magnesium-sleep',
          price: '$18-28'
        },
        topSupplements: [
          {
            name: '5-HTP',
            description: 'Precursor to serotonin and melatonin. Supports natural sleep hormone production.',
            affiliateLink: 'https://amzn.to/5htp-sleep',
            price: '$20-30'
          },
          {
            name: 'GABA',
            description: 'Direct calming neurotransmitter that promotes deep, restorative sleep.',
            affiliateLink: 'https://amzn.to/gaba-sleep',
            price: '$20-30'
          }
        ]
      },
      'Early Morning Awakening': {
        paragraphs: [
          "Early morning awakening is waking up too early and being unable to return to sleep. It can be related to low mood, hormonal changes, or circadian rhythm disruptions.",
          "Supporting circadian rhythm and mood balance can help restore healthy sleep patterns."
        ],
        bestHerb: {
          name: 'St. John\'s Wort',
          description: 'Traditional herb with evidence for mood support and circadian rhythm regulation.',
          affiliateLink: 'https://amzn.to/st-johns-wort-sleep',
          price: '$20-30'
        },
        bestStandardized: {
          name: '5-HTP',
          description: 'Precursor to serotonin and melatonin. Supports mood and sleep regulation.',
          affiliateLink: 'https://amzn.to/5htp-sleep',
          price: '$20-30'
        },
        topSupplements: [
          {
            name: 'Vitamin D3',
            description: 'Sunshine vitamin. Deficiency linked to low mood and sleep issues.',
            affiliateLink: 'https://amzn.to/vitamin-d-sleep',
            price: '$15-25'
          },
          {
            name: 'Magnesium Glycinate',
            description: 'Essential mineral for sleep and mood balance.',
            affiliateLink: 'https://amzn.to/magnesium-sleep',
            price: '$18-28'
          }
        ]
      }
    },
    disclaimer: 'These recommendations are for general support. Consult your healthcare provider for personalized advice.',
    herb: null,
    extract: null,
    supplements: null,
    cautions: null,
    related: null,
    faq: null
  },
  'depression': {
    title: 'Depression',
    description: 'Persistent feelings of sadness and loss of interest',
    symptoms: [
      'Persistent sad or empty mood',
      'Loss of interest in activities',
      'Changes in appetite or weight',
      'Sleep problems',
      'Fatigue or loss of energy',
      'Feelings of worthlessness'
    ],
    causes: [
      'Biological factors',
      'Environmental stressors',
      'Life events',
      'Medical conditions',
      'Medications',
      'Substance use'
    ],
    naturalSolutions: [
      {
        type: 'supplement',
        name: 'Omega-3 EPA/DHA',
        description: 'Essential anti-inflammatory fats. EPA specifically supports mood regulation.',
        affiliateLink: 'https://amzn.to/omega3-depression',
        price: '$25-40',
        clinicalEvidence: '2-3g daily EPA/DHA shows significant benefits for depression in multiple studies'
      },
      {
        type: 'supplement',
        name: 'Vitamin D3',
        description: 'Sunshine vitamin. Deficiency strongly linked to depression and seasonal affective disorder.',
        affiliateLink: 'https://amzn.to/vitamin-d-depression',
        price: '$15-25',
        clinicalEvidence: '2000-5000 IU daily improves mood, especially in deficient individuals'
      },
      {
        type: 'supplement',
        name: 'B-Complex Vitamins',
        description: 'Essential for neurotransmitter production. B12 and folate particularly important for mood.',
        affiliateLink: 'https://amzn.to/b-complex-depression',
        price: '$18-28',
        clinicalEvidence: 'B12 and folate deficiency linked to depression. Supplementation improves symptoms'
      },
      {
        type: 'supplement',
        name: 'S-Adenosyl Methionine (SAMe)',
        description: 'Natural compound that supports methylation and neurotransmitter production.',
        affiliateLink: 'https://amzn.to/same-depression',
        price: '$30-50',
        clinicalEvidence: '400-1600mg daily shows antidepressant effects comparable to prescription medications'
      },
      {
        type: 'supplement',
        name: '5-HTP',
        description: 'Precursor to serotonin. Supports natural mood regulation and sleep.',
        affiliateLink: 'https://amzn.to/5htp-depression',
        price: '$20-30',
        clinicalEvidence: '100-300mg daily increases serotonin levels and improves depression scores'
      },
      {
        type: 'herb',
        name: 'St. John&apos;s Wort',
        description: 'Traditional herb with extensive clinical research for mild to moderate depression.',
        affiliateLink: 'https://amzn.to/st-johns-wort-depression',
        price: '$20-30',
        clinicalEvidence: '900mg daily extract shows effectiveness comparable to prescription antidepressants'
      }
    ],
    variants: [],
    herb: null,
    extract: null,
    supplements: null,
    cautions: null,
    related: null,
    faq: null,
  },
  'anxiety': {
    title: 'Anxiety',
    description: 'Excessive worry and nervousness',
    symptoms: [
      'Excessive worrying',
      'Restlessness or feeling on edge',
      'Difficulty concentrating',
      'Irritability',
      'Muscle tension',
      'Sleep problems'
    ],
    causes: [
      'Genetic factors',
      'Brain chemistry',
      'Environmental stressors',
      'Medical conditions',
      'Substance use',
      'Trauma'
    ],
    naturalSolutions: [
      {
        type: 'supplement',
        name: 'L-Theanine',
        description: 'Clinically proven to reduce anxiety and promote calm focus. Works with GABA receptors.',
        affiliateLink: 'https://amzn.to/l-theanine-anxiety',
        price: '$25-35',
        clinicalEvidence: 'Multiple RCTs show 200-400mg daily reduces anxiety scores'
      },
      {
        type: 'supplement',
        name: 'Magnesium Glycinate',
        description: 'Essential mineral for nervous system function. Deficiency linked to anxiety.',
        affiliateLink: 'https://amzn.to/magnesium-glycinate',
        price: '$18-28',
        clinicalEvidence: 'Studies show 200-400mg daily improves anxiety and stress response'
      },
      {
        type: 'supplement',
        name: 'Ashwagandha',
        description: 'Adaptogenic herb with multiple RCTs showing cortisol reduction and stress relief',
        affiliateLink: 'https://amzn.to/ashwagandha-anxiety',
        price: '$20-35',
        clinicalEvidence: '600mg daily for 8 weeks significantly reduced anxiety scores'
      },
      {
        type: 'supplement',
        name: 'Omega-3 EPA/DHA',
        description: 'Anti-inflammatory fats that support brain function and mood regulation',
        affiliateLink: 'https://amzn.to/omega3-anxiety',
        price: '$25-40',
        clinicalEvidence: '2-3g daily EPA/DHA shows benefits for anxiety and depression'
      },
      {
        type: 'supplement',
        name: 'GABA',
        description: 'Direct calming neurotransmitter supplement for acute anxiety relief',
        affiliateLink: 'https://amzn.to/gaba-supplement',
        price: '$20-30',
        clinicalEvidence: '500-750mg daily for anxiety and sleep support'
      },
      {
        type: 'herb',
        name: 'Passionflower',
        description: 'Traditional nervine herb that enhances GABA activity naturally',
        affiliateLink: 'https://amzn.to/passionflower-anxiety',
        price: '$15-25',
        clinicalEvidence: 'Traditional use for anxiety with modern safety studies'
      }
    ],
    variants: [],
    herb: null,
    extract: null,
    supplements: null,
    cautions: null,
    related: null,
    faq: null,
  },
  'memory-loss': {
    title: 'Memory Loss',
    description: 'Difficulty remembering information or events',
    symptoms: [
      'Forgetting recent events',
      'Difficulty learning new information',
      'Confusion about time or place',
      'Trouble with familiar tasks',
      'Poor judgment',
      'Changes in mood or behavior'
    ],
    causes: [
      'Aging',
      'Stress and anxiety',
      'Sleep deprivation',
      'Nutritional deficiencies',
      'Medical conditions',
      'Medications'
    ],
    naturalSolutions: [
      {
        type: 'supplement',
        name: 'Alpha-GPC',
        description: 'Bioavailable choline source. Essential for acetylcholine production and memory.',
        affiliateLink: 'https://amzn.to/alpha-gpc-memory',
        price: '$25-40',
        clinicalEvidence: '300-600mg daily improves memory, focus, and cognitive performance'
      },
      {
        type: 'supplement',
        name: 'Phosphatidylserine',
        description: 'Brain cell membrane support. Essential for memory and cognitive function.',
        affiliateLink: 'https://amzn.to/phosphatidylserine',
        price: '$30-45',
        clinicalEvidence: '100-300mg daily improves memory and cognitive performance in multiple studies'
      },
      {
        type: 'supplement',
        name: 'Omega-3 DHA',
        description: 'Essential for brain structure and function. DHA specifically supports memory.',
        affiliateLink: 'https://amzn.to/dha-memory',
        price: '$28-45',
        clinicalEvidence: '1-2g DHA daily supports memory and cognitive function, especially in aging'
      },
      {
        type: 'supplement',
        name: 'Bacopa Monnieri',
        description: 'Traditional nootropic herb with extensive clinical research for memory enhancement.',
        affiliateLink: 'https://amzn.to/bacopa-memory',
        price: '$20-35',
        clinicalEvidence: '300-600mg daily extract improves memory, learning, and information processing'
      },
      {
        type: 'supplement',
        name: 'Lion&apos;s Mane',
        description: 'Medicinal mushroom that supports nerve growth factor and brain plasticity.',
        affiliateLink: 'https://amzn.to/lions-mane-memory',
        price: '$25-40',
        clinicalEvidence: '1-3g daily supports cognitive function and may protect against age-related decline'
      },
      {
        type: 'supplement',
        name: 'B-Complex Vitamins',
        description: 'Essential for brain function. B12 and folate particularly important for memory.',
        affiliateLink: 'https://amzn.to/b-complex-memory',
        price: '$20-30',
        clinicalEvidence: 'B12 deficiency linked to memory problems. Supplementation improves cognitive function'
      },
      {
        name: 'Acetyl-L-Carnitine',
        description: 'Amino acid that supports brain energy and memory',
        affiliateLink: 'https://amzn.to/example-acetyl-carnitine',
        price: '$25-40'
      }
    ],
    variants: [],
    herb: null,
    extract: null,
    supplements: null,
    cautions: null,
    related: null,
    faq: null,
  },
  'muscle-tension': {
    title: 'Muscle Tension / Tension Headaches',
    description: 'Muscle tightness, tension, or headaches related to stress or posture.',
    symptoms: [
      'Tight or sore muscles',
      'Tension headaches',
      'Neck or shoulder pain',
      'Jaw clenching',
      'Difficulty relaxing'
    ],
    causes: [
      'Stress',
      'Poor posture',
      'Overuse or injury',
      'Dehydration',
      'Sleep issues'
    ],
    naturalSolutions: [
      {
        type: 'herb',
        name: 'Skullcap',
        description: 'Traditionally used for muscle tension and nervous headaches',
        affiliateLink: 'https://amzn.to/example-skullcap',
        price: '$15-25'
      },
      {
        type: 'herb',
        name: 'Cramp Bark (Viburnum opulus)',
        description: 'Skeletal muscle relaxant and nerve relaxant. Traditionally used for pain, pinched nerves, muscle cramps, and menstrual cramps.',
        affiliateLink: 'https://amzn.to/example-cramp-bark',
        price: '$14-22'
      }
    ],
    variants: [],
    herb: null,
    extract: null,
    supplements: null,
    cautions: null,
    related: null,
    faq: null,
  },
  'neck-tension': {
    title: 'Neck Tension',
    description: 'Muscle tightness, pain, or stiffness in the neck and upper shoulders.',
    quickActions: [
      { name: 'Muscle Tension', href: '/symptoms/muscle-tension', color: 'green' },
      { name: 'Migraine', href: '/symptoms/migraine', color: 'purple' },
      { name: 'Stress', href: '/symptoms/stress', color: 'blue' },
    ],
    variants: {
      'Neck Tension': {
        paragraphs: [
          "Neck tension is a common complaint, often caused by stress, poor posture, prolonged computer use, or muscle strain. It can also be associated with headaches, jaw pain, or upper back discomfort.",
          "Natural approaches to neck tension focus on muscle relaxation, stress reduction, and supporting healthy circulation."
        ],
        bestHerb: {
          name: 'Lavender',
          description: 'Traditional herb for muscle relaxation and stress relief.',
          affiliateLink: 'https://amzn.to/lavender-neck',
          price: '$15-22'
        },
        bestStandardized: {
          name: 'Magnesium',
          description: 'Essential mineral for muscle relaxation and nerve function.',
          affiliateLink: 'https://amzn.to/magnesium-neck',
          price: '$18-28'
        },
        topSupplements: [
          {
            name: 'Valerian Root',
            description: 'Herbal muscle relaxant and sleep aid.',
            affiliateLink: 'https://amzn.to/valerian-neck',
            price: '$18-25'
          },
          {
            name: 'CBD Oil',
            description: 'Supports muscle relaxation and reduces pain perception.',
            affiliateLink: 'https://amzn.to/cbd-neck',
            price: '$25-40'
          }
        ]
      }
    },
    relatedSymptoms: [
      { name: 'Muscle Tension', href: '/symptoms/muscle-tension', color: 'green' },
      { name: 'Migraine', href: '/symptoms/migraine', color: 'purple' },
      { name: 'Stress', href: '/symptoms/stress', color: 'blue' }
    ],
    disclaimer: 'These recommendations are for general support. Consult your healthcare provider for personalized advice.',
    herb: null,
    extract: null,
    supplements: null,
    cautions: null,
    related: null,
    faq: null
  },
  'blood-pressure': {
    title: 'Blood Pressure Balance',
    description: 'Support for healthy blood pressure levels.',
    symptoms: [
      'High or low blood pressure',
      'Dizziness',
      'Headaches',
      'Fatigue'
    ],
    causes: [
      'Diet',
      'Stress',
      'Genetics',
      'Medical conditions'
    ],
    naturalSolutions: [
      {
        type: 'herb',
        name: 'Hawthorn',
        description: 'Traditionally used for cardiovascular support',
        affiliateLink: 'https://amzn.to/example-hawthorn',
        price: '$15-25',
        herbLink: '/herbs/hawthorn'
      }
    ],
    variants: [],
    herb: null,
    extract: null,
    supplements: null,
    cautions: null,
    related: null,
    faq: null,
  },
  'heart-support': {
    title: 'Heart Muscle Support',
    description: 'Support for heart muscle function and cardiovascular health.',
    symptoms: [
      'Fatigue',
      'Shortness of breath',
      'Chest discomfort',
      'Palpitations'
    ],
    causes: [
      'Cardiovascular conditions',
      'Nutrient deficiencies',
      'Stress'
    ],
    naturalSolutions: [
      {
        type: 'supplement',
        name: 'CoQ10',
        description: 'Supports heart muscle energy and function',
        affiliateLink: 'https://amzn.to/example-coq10',
        price: '$20-35'
      },
      {
        type: 'herb',
        name: 'Hawthorn (Crataegus oxyacantha)',
        description: 'Traditional cardiovascular herb useful for heart palpitations, flutters, panic-related tachycardia, and overall heart support',
        affiliateLink: 'https://amzn.to/example-hawthorn-heart',
        price: '$15-25'
      }
    ],
    variants: [],
    herb: null,
    extract: null,
    supplements: null,
    cautions: null,
    related: null,
    faq: null,
  },
  'liver-detox': {
    title: 'Liver Function Support / Toxicity',
    description: 'Support for liver detoxification and function.',
    quickActions: [
      { name: 'Hormonal Imbalances', href: '/symptoms/hormonal-imbalances', color: 'purple' },
      { name: 'Digestive Health', href: '/symptoms/digestive-health', color: 'blue' },
      { name: 'Fatigue', href: '/symptoms/fatigue', color: 'green' },
    ],
    variants: {
      'Liver Detox': {
        paragraphs: [
          "The liver can struggle for many reasons—not just from self-inflicted causes like alcohol or chemical use, but also due to genetics, chronic illness, medications, infections, or nutrient deficiencies. When the liver is not functioning optimally, it cannot effectively clear hormones and metabolic byproducts from the bloodstream. This impaired clearance can disrupt healthy hormonal feedback loops and rhythms, leading to hormonal imbalances that may profoundly affect mood, focus, energy, and general wellbeing. Supporting liver health is therefore essential not only for detoxification, but also for maintaining balanced hormone signaling and overall vitality.",
          "Common symptoms of poor liver function include fatigue, digestive issues, skin problems, and brain fog. Addressing these symptoms often requires a holistic approach, including dietary changes, herbal support, and targeted supplementation.",
          "Natural approaches to liver detoxification focus on supporting the body's own detox pathways, reducing toxin exposure, and providing nutrients and herbs that enhance liver function."
        ],
        bestHerb: {
          name: 'Milk Thistle',
          description: 'Traditional liver herb with strong evidence for supporting detoxification and liver cell regeneration.',
          affiliateLink: 'https://amzn.to/milk-thistle-liver',
          price: '$18-28'
        },
        bestStandardized: {
          name: 'NAC (N-Acetyl Cysteine)',
          description: 'Amino acid supplement that boosts glutathione, the body’s master antioxidant for liver health.',
          affiliateLink: 'https://amzn.to/nac-liver',
          price: '$20-30'
        },
        topSupplements: [
          {
            name: 'Dandelion Root',
            description: 'Herbal bitter that stimulates bile flow and supports digestion and detoxification.',
            affiliateLink: 'https://amzn.to/dandelion-liver',
            price: '$15-22'
          },
          {
            name: 'Alpha Lipoic Acid',
            description: 'Powerful antioxidant that supports liver cell protection and regeneration.',
            affiliateLink: 'https://amzn.to/ala-liver',
            price: '$18-28'
          }
        ]
      }
    },
    relatedSymptoms: [
      { name: 'Hormonal Imbalances', href: '/symptoms/hormonal-imbalances', color: 'purple' },
      { name: 'Fatigue', href: '/symptoms/fatigue', color: 'green' },
      { name: 'Digestive Health', href: '/symptoms/digestive-health', color: 'blue' }
    ],
    disclaimer: 'These recommendations are for general support. Consult your healthcare provider for personalized advice.',
    herb: null,
    extract: null,
    supplements: null,
    cautions: null,
    related: null,
    faq: null
  },
  'digestive-health': {
    title: 'Hormonal Imbalances / Digestive Health',
    description: 'Support for hormone balance and digestive function.',
    symptoms: [
      'Bloating',
      'Irregular cycles',
      'Digestive discomfort',
      'Mood swings'
    ],
    causes: [
      'Hormonal fluctuations',
      'Gut dysbiosis',
      'Diet',
      'Stress'
    ],
    naturalSolutions: [
      {
        type: 'herb',
        name: 'Vitex',
        description: 'Supports hormone balance',
        affiliateLink: 'https://amzn.to/example-vitex',
        price: '$12-20'
      }
    ],
    variants: [],
    herb: null,
    extract: null,
    supplements: null,
    cautions: null,
    related: null,
    faq: null,
  },
  'adrenal-overload': {
    title: 'Adrenal Overload',
    description: 'Symptoms of excess stress and adrenal hormone output.',
    symptoms: [
      'Feeling wired',
      'Trouble sleeping',
      'Irritability',
      'Cravings for salt or sugar'
    ],
    causes: [
      'Chronic stress',
      'Overwork',
      'Poor sleep'
    ],
    naturalSolutions: [
      {
        type: 'herb',
        name: 'Rhodiola',
        description: 'Adaptogen for stress resilience',
        affiliateLink: 'https://amzn.to/example-rhodiola',
        price: '$18-28'
      }
    ],
    variants: [],
    herb: null,
    extract: null,
    supplements: null,
    cautions: null,
    related: null,
    faq: null,
  },
  'adrenal-exhaustion': {
    title: 'Adrenal Exhaustion',
    description: 'Symptoms of depleted adrenal function from chronic stress.',
    symptoms: [
      'Fatigue',
      'Low motivation',
      'Brain fog',
      'Cravings for salt',
      'Low blood pressure'
    ],
    causes: [
      'Prolonged stress',
      'Poor sleep',
      'Nutrient deficiencies'
    ],
    naturalSolutions: [
      {
        type: 'herb',
        name: 'Licorice Root',
        description: 'Traditionally used for adrenal support',
        affiliateLink: 'https://amzn.to/example-licorice',
        price: '$12-20'
      }
    ],
    variants: [],
    herb: null,
    extract: null,
    supplements: null,
    cautions: null,
    related: null,
    faq: null,
  },
  'circadian-support': {
    title: 'Circadian Support',
    description: 'Support for healthy sleep-wake cycles and circadian rhythm.',
    symptoms: [
      'Difficulty falling asleep',
      'Daytime sleepiness',
      'Irregular sleep patterns',
      'Mood changes'
    ],
    causes: [
      'Shift work',
      'Jet lag',
      'Screen time at night',
      'Irregular routines'
    ],
    naturalSolutions: [
      {
        type: 'supplement',
        name: 'Melatonin',
        description: 'Supports healthy sleep onset and circadian rhythm',
        affiliateLink: 'https://amzn.to/example-melatonin',
        price: '$10-18'
      }
    ],
    variants: [],
    herb: null,
    extract: null,
    supplements: null,
    cautions: null,
    related: null,
    faq: null,
  },
  'vagus-nerve': {
    title: 'Vagus Nerve Support',
    description: 'Support for vagus nerve function and relaxation response.',
    symptoms: [
      'Digestive issues',
      'Anxiety',
      'Heart palpitations',
      'Difficulty relaxing'
    ],
    causes: [
      'Chronic stress',
      'Nervous system imbalance',
      'Poor gut health'
    ],
    naturalSolutions: [
      {
        type: 'herb',
        name: 'Gotu Kola',
        description: 'Traditionally used for nervous system and vagus support',
        affiliateLink: 'https://amzn.to/example-gotu-kola',
        price: '$14-22'
      }
    ],
    variants: [],
    herb: null,
    extract: null,
    supplements: null,
    cautions: null,
    related: null,
    faq: null,
  },
  'dysbiosis': {
    title: 'Dysbiosis',
    description: 'Imbalance of gut bacteria affecting health.',
    symptoms: [
      'Bloating',
      'Digestive discomfort',
      'Brain fog',
      'Food sensitivities'
    ],
    causes: [
      'Antibiotic use',
      'Poor diet',
      'Stress',
      'Infections'
    ],
    naturalSolutions: [
      {
        type: 'supplement',
        name: 'Probiotics',
        description: 'Supports healthy gut flora balance',
        affiliateLink: 'https://amzn.to/example-probiotics',
        price: '$18-30'
      }
    ],
    variants: [],
    herb: null,
    extract: null,
    supplements: null,
    cautions: null,
    related: null,
    faq: null,
  },
  'leaky-gut': {
    title: 'Leaky Gut / Leaky Brain',
    description: 'Increased intestinal permeability affecting health.',
    symptoms: [
      'Digestive issues',
      'Brain fog',
      'Fatigue',
      'Food sensitivities'
    ],
    causes: [
      'Gut inflammation',
      'Poor diet',
      'Stress',
      'Infections'
    ],
    naturalSolutions: [
      {
        type: 'supplement',
        name: 'L-Glutamine',
        description: 'Supports gut lining integrity',
        affiliateLink: 'https://amzn.to/example-glutamine',
        price: '$15-25'
      }
    ],
    variants: [],
    herb: null,
    extract: null,
    supplements: null,
    cautions: null,
    related: null,
    faq: null,
  },
  'ibs': {
    title: 'IBS (Irritable Bowel Syndrome)',
    description: 'Digestive disorder with abdominal pain and changes in bowel habits.',
    symptoms: [
      'Abdominal pain',
      'Bloating',
      'Diarrhea or constipation',
      'Gas',
      'Cramping'
    ],
    causes: [
      'Gut-brain axis dysfunction',
      'Food intolerances',
      'Stress',
      'Infections'
    ],
    naturalSolutions: [
      {
        type: 'supplement',
        name: 'Peppermint Oil',
        description: 'Traditionally used for IBS symptom relief',
        affiliateLink: 'https://amzn.to/example-peppermint',
        price: '$10-18'
      }
    ],
    variants: [],
    herb: null,
    extract: null,
    supplements: null,
    cautions: null,
    related: null,
    faq: null,
  },
  'migraine': {
    title: 'Migraine Relief',
    description: 'Natural solutions for migraine management and prevention.',
    quickActions: [
      { name: 'Anxiety & Stress', href: '/symptoms/anxiety', color: 'purple' },
      { name: 'Sleep Issues', href: '/symptoms/insomnia', color: 'blue' },
      { name: 'Muscle Tension', href: '/symptoms/muscle-tension', color: 'green' },
    ],
    variants: {
      'Migraine Relief': {
        paragraphs: [
          "Migraines are complex neurological conditions that can be debilitating. They involve changes in brain chemistry, blood vessel dilation, and inflammation. Common triggers include hormonal changes, food sensitivities, stress, sleep disturbances, environmental factors, and dehydration.",
          "Natural approaches to migraine relief focus on reducing frequency, intensity, and duration of attacks through evidence-based herbs, supplements, and lifestyle changes."
        ],
        bestHerb: {
          name: 'Feverfew',
          description: 'Traditional migraine herb with anti-inflammatory properties.',
          affiliateLink: 'https://amzn.to/feverfew-migraine',
          price: '$15-22'
        },
        bestStandardized: {
          name: 'Butterbur',
          description: 'Clinically proven to reduce migraine frequency.',
          affiliateLink: 'https://amzn.to/butterbur-migraine',
          price: '$18-28'
        },
        topSupplements: [
          {
            name: 'Magnesium',
            description: 'Essential mineral for nerve function and muscle relaxation.',
            affiliateLink: 'https://amzn.to/magnesium-migraine',
            price: '$18-28'
          },
          {
            name: 'Riboflavin (B2)',
            description: 'High-dose B2 reduces migraine frequency.',
            affiliateLink: 'https://amzn.to/b2-migraine',
            price: '$15-22'
          }
        ]
      }
    },
    relatedSymptoms: [
      { name: 'Nausea & Vomiting', href: '/symptoms/nausea', color: 'purple' },
      { name: 'Light Sensitivity', href: '/symptoms/light-sensitivity', color: 'blue' },
      { name: 'Sound Sensitivity', href: '/symptoms/sound-sensitivity', color: 'green' }
    ],
    emergencyNote: 'If you experience a severe, sudden headache unlike any you\'ve had before, seek immediate medical attention. Call emergency services or go to the nearest emergency room.',
    disclaimer: 'These recommendations are for general support. Consult your healthcare provider for personalized advice.',
    herb: null,
    extract: null,
    supplements: null,
    cautions: null,
    related: null,
    faq: null
  },
  'burnout': {
    title: 'Emotional Burnout',
    description: 'Chronic stress and emotional exhaustion affecting mood, energy, and motivation.',
    quickActions: [
      { name: 'Anxiety', href: '/symptoms/anxiety', color: 'purple' },
      { name: 'Fatigue', href: '/symptoms/fatigue', color: 'green' },
      { name: 'Depression', href: '/symptoms/depression', color: 'blue' },
    ],
    variants: {
      'Burnout': {
        paragraphs: [
          "Burnout is a state of chronic stress and emotional exhaustion that can affect mood, energy, motivation, and overall wellbeing. It is common in high-pressure jobs, caregiving roles, and during prolonged periods of stress.",
          "Natural approaches to burnout focus on stress reduction, nervous system support, and restoring energy and resilience."
        ],
        bestHerb: {
          name: 'Rhodiola Rosea',
          description: 'Adaptogenic herb that improves energy, reduces fatigue, and enhances stress resilience.',
          affiliateLink: 'https://amzn.to/rhodiola-burnout',
          price: '$25-35'
        },
        bestStandardized: {
          name: 'Ashwagandha',
          description: 'Adaptogenic herb that reduces stress hormones and supports adrenal function.',
          affiliateLink: 'https://amzn.to/ashwagandha-burnout',
          price: '$18-28'
        },
        topSupplements: [
          {
            name: 'B-Complex Vitamins',
            description: 'Essential for energy production and nervous system function.',
            affiliateLink: 'https://amzn.to/b-complex-burnout',
            price: '$15-25'
          },
          {
            name: 'Magnesium',
            description: 'Essential mineral for nervous system relaxation and stress resilience.',
            affiliateLink: 'https://amzn.to/magnesium-burnout',
            price: '$18-28'
          }
        ]
      }
    },
    relatedSymptoms: [
      { name: 'Anxiety', href: '/symptoms/anxiety', color: 'purple' },
      { name: 'Fatigue', href: '/symptoms/fatigue', color: 'green' },
      { name: 'Depression', href: '/symptoms/depression', color: 'blue' }
    ],
    disclaimer: 'These recommendations are for general support. Consult your healthcare provider for personalized advice.',
    herb: null,
    extract: null,
    supplements: null,
    cautions: null,
    related: null,
    faq: null
  },
  'thyroid-issues': {
    title: 'Thyroid Issues',
    description: 'Support for thyroid function, energy, and metabolism.',
    quickActions: [
      { name: 'Fatigue', href: '/symptoms/fatigue', color: 'green' },
      { name: 'Mood Swings', href: '/symptoms/mood-swings', color: 'purple' },
      { name: 'Hormonal Imbalances', href: '/symptoms/hormonal-imbalances', color: 'blue' },
    ],
    variants: {
      'Thyroid Support': {
        paragraphs: [
          "Thyroid issues can affect energy, metabolism, mood, and overall wellbeing. Common symptoms include fatigue, weight changes, mood swings, and sensitivity to cold or heat.",
          "Natural approaches to thyroid support focus on providing key nutrients, supporting hormone synthesis, and reducing stress."
        ],
        bestHerb: {
          name: 'Ashwagandha',
          description: 'Adaptogenic herb that supports thyroid hormone balance and stress resilience.',
          affiliateLink: 'https://amzn.to/ashwagandha-thyroid',
          price: '$18-28'
        },
        bestStandardized: {
          name: 'Selenium',
          description: 'Essential mineral for thyroid hormone synthesis and conversion.',
          affiliateLink: 'https://amzn.to/selenium-thyroid',
          price: '$15-22'
        },
        topSupplements: [
          {
            name: 'Zinc',
            description: 'Essential for thyroid hormone synthesis and immune function.',
            affiliateLink: 'https://amzn.to/zinc-thyroid',
            price: '$15-22'
          },
          {
            name: 'Vitamin D3',
            description: 'Supports immune function and thyroid health.',
            affiliateLink: 'https://amzn.to/vitamin-d-thyroid',
            price: '$15-25'
          }
        ]
      }
    },
    relatedSymptoms: [
      { name: 'Fatigue', href: '/symptoms/fatigue', color: 'green' },
      { name: 'Mood Swings', href: '/symptoms/mood-swings', color: 'purple' },
      { name: 'Hormonal Imbalances', href: '/symptoms/hormonal-imbalances', color: 'blue' }
    ],
    disclaimer: 'These recommendations are for general support. Consult your healthcare provider for personalized advice.',
    herb: null,
    extract: null,
    supplements: null,
    cautions: null,
    related: null,
    faq: null
  },
  'poor-focus': {
    title: 'Poor Focus',
    description: 'Difficulty concentrating, maintaining attention, or staying focused on tasks.',
    paragraphs: [
      "Poor focus can manifest as difficulty concentrating, easily getting distracted, or having trouble completing tasks. This can be caused by stress, poor sleep, nutrient deficiencies, or underlying health conditions.",
      "Brain fog specifically refers to a feeling of mental cloudiness, confusion, or difficulty thinking clearly. It's often associated with fatigue, stress, or hormonal imbalances.",
      "Poor memory involves difficulty recalling information, learning new things, or retaining details. This can be age-related or due to stress, sleep issues, or nutrient deficiencies.",
      "Natural approaches to improving focus and memory often involve supporting brain health through specific herbs and supplements that enhance blood flow, neurotransmitter function, and cellular energy production."
    ],
    variants: {
      'Brain Fog': {
        bestHerb: {
          name: 'Ginkgo Biloba',
          description: 'Traditional herb that improves blood flow to the brain and clears mental fog.',
          affiliateLink: 'https://amzn.to/ginkgo-brain-fog',
          price: '$20-30'
        },
        bestStandardized: {
          name: 'L-Theanine',
          description: 'Amino acid that promotes calm focus and reduces mental fatigue.',
          affiliateLink: 'https://amzn.to/theanine-brain-fog',
          price: '$15-25'
        },
        topSupplements: [
          {
            name: 'Bacopa Monnieri',
            description: 'Ayurvedic herb that enhances memory and cognitive clarity.',
            affiliateLink: 'https://amzn.to/bacopa-brain-fog',
            price: '$25-35'
          },
          {
            name: 'Phosphatidylserine',
            description: 'Essential brain phospholipid that supports cognitive function.',
            affiliateLink: 'https://amzn.to/phosphatidylserine-brain-fog',
            price: '$25-35'
          }
        ]
      },
      'Poor Memory': {
        bestHerb: {
          name: 'Bacopa Monnieri',
          description: 'Ayurvedic herb that enhances memory, learning, and information retention.',
          affiliateLink: 'https://amzn.to/bacopa-memory',
          price: '$25-35'
        },
        bestStandardized: {
          name: 'Phosphatidylserine',
          description: 'Essential brain phospholipid that supports memory formation and recall.',
          affiliateLink: 'https://amzn.to/phosphatidylserine-memory',
          price: '$25-35'
        },
        topSupplements: [
          {
            name: 'Acetyl-L-Carnitine',
            description: 'Amino acid that supports brain energy and memory function.',
            affiliateLink: 'https://amzn.to/acetyl-carnitine-memory',
            price: '$20-30'
          },
          {
            name: 'Omega-3 DHA',
            description: 'Essential brain fat that supports memory and cognitive performance.',
            affiliateLink: 'https://amzn.to/omega3-memory',
            price: '$25-40'
          }
        ]
      }
    },
    disclaimer: 'These recommendations are for general support. Consult your healthcare provider for personalized advice.',
    herb: null,
    extract: null,
    supplements: null,
    cautions: null,
    related: null,
    faq: null
  }
};

export default async function SymptomPage({ params }: SymptomPageProps) {
  const { slug } = await params;
  const symptom = symptoms[slug as keyof typeof symptoms];

  if (!symptom) {
    notFound();
  }

  // --- VARIANT LOGIC ---
  const hasVariants = symptom.variants && typeof symptom.variants === 'object' && !Array.isArray(symptom.variants);
  if (hasVariants) {
    return <VariantSymptomPage symptom={symptom} />;
  }

  // --- OLD STRUCTURE FALLBACK ---
  // Example: Add placeholder products if not present (for plug-and-play API integration)
  const products = symptom.products || [
    {
      name: "Best Magnesium Glycinate",
      description: "Highly bioavailable magnesium for stress and sleep support.",
      affiliateUrl: "https://amzn.to/placeholder-magnesium",
      price: "$18.99",
      qualityScore: 9.2,
      affiliateRevenue: 0.08, // 8% commission
      image: "/images/magnesium.jpg",
      supplier: "Amazon"
    },
    {
      name: "Premium Ashwagandha Extract",
      description: "Clinically studied adaptogen for stress and anxiety.",
      affiliateUrl: "https://amzn.to/placeholder-ashwagandha",
      price: "$21.99",
      qualityScore: 9.5,
      affiliateRevenue: 0.10,
      image: "/images/ashwagandha.jpg",
      supplier: "Amazon"
    },
    {
      name: "Top L-Theanine Capsules",
      description: "Supports calm focus and relaxation without drowsiness.",
      affiliateUrl: "https://amzn.to/placeholder-theanine",
      price: "$16.99",
      qualityScore: 9.0,
      affiliateRevenue: 0.07,
      image: "/images/theanine.jpg",
      supplier: "Amazon"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {symptom.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {symptom.description}
          </p>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Body Map
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Education */}
          <div className="md:col-span-2 space-y-8">
            {/* Understanding Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Understanding {symptom.title}
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  {symptom.description} Understanding the underlying causes and symptoms can help you 
                  make informed decisions about natural support options.
                </p>
                <p className="text-gray-700 mb-4">
                  Natural approaches to {symptom.title.toLowerCase()} often involve addressing root causes, 
                  supporting the body&apos;s natural healing processes, and using evidence-based herbs and 
                  supplements that have been traditionally and clinically studied.
                </p>
              </div>
            </div>

            {/* Symptoms Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Common Symptoms
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Primary Symptoms</h3>
                  <ul className="text-gray-700 space-y-1">
                    {symptom.symptoms && symptom.symptoms.slice(0, 6).map((symptomItem: string, index: number) => (
                      <li key={index}>• {symptomItem}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Common Causes</h3>
                  <ul className="text-gray-700 space-y-1">
                    {symptom.causes && symptom.causes.slice(0, 6).map((cause: string, index: number) => (
                      <li key={index}>• {cause}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Natural Solutions Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Natural Support Options
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Herbal Support</h3>
                  <ul className="text-gray-700 space-y-1">
                    {symptom.naturalSolutions && symptom.naturalSolutions
                      .filter((solution: { type: string }) => solution.type === 'herb')
                      .slice(0, 3)
                      .map((solution: { name: string; description: string }, index: number) => (
                        <li key={index}>• {solution.name} - {solution.description}</li>
                      ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Supplemental Support</h3>
                  <ul className="text-gray-700 space-y-1">
                    {symptom.naturalSolutions && symptom.naturalSolutions
                      .filter((solution: { type: string }) => solution.type === 'supplement')
                      .slice(0, 3)
                      .map((solution: { name: string; description: string }, index: number) => (
                        <li key={index}>• {solution.name} - {solution.description}</li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Product Recommendations */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Recommended Products
              </h2>
              <div className="space-y-4">
                {products.map((product, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 flex flex-col gap-4">
                    <Image 
                      src={product.image || '/images/closed-medical-brown-glass-bottle-yellow-vitamins.png'} 
                      alt={product.name} 
                      width={80}
                      height={80}
                      className="object-contain rounded mb-2" 
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-blue-700 font-bold">{product.price}</span>
                        <span className="text-xs text-green-700 bg-green-100 rounded px-2 py-0.5">Quality: {product.qualityScore}</span>
                        <span className="text-xs text-purple-700 bg-purple-100 rounded px-2 py-0.5">Affiliate: {Math.round(product.affiliateRevenue * 100)}%</span>
                        {product.supplier && (
                          <span className="text-xs text-gray-500 ml-2">{product.supplier}</span>
                        )}
                      </div>
                      <a 
                        href={product.affiliateUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                      >
                        View on {product.supplier || 'Amazon'} →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Conditions */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-3">Related Conditions</h3>
              <div className="space-y-2">
                <Link 
                  href="/symptoms/anxiety" 
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                >
                  → Anxiety
                </Link>
                <Link 
                  href="/symptoms/depression" 
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                >
                  → Depression
                </Link>
                <Link 
                  href="/symptoms/fatigue" 
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                >
                  → Fatigue
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> This information is for educational purposes only and should not 
            replace professional medical advice. Always consult with a healthcare provider before starting 
            any new supplement regimen, especially if you have underlying health conditions or are taking 
            medications. The product links are affiliate links that support this educational content.
          </p>
        </div>
      </div>
    </div>
  );
} 