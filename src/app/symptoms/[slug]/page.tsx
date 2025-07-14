import { notFound } from 'next/navigation';
import Link from 'next/link';

interface SymptomPageProps {
  params: Promise<{ slug: string }>;
}

const symptoms = {
  'insomnia': {
    title: 'Insomnia',
    description: 'Difficulty falling asleep or staying asleep',
    symptoms: [
      'Trouble falling asleep',
      'Waking up frequently during the night',
      'Waking up too early',
      'Feeling tired during the day',
      'Difficulty concentrating',
      'Mood changes'
    ],
    causes: [
      'Stress and anxiety',
      'Poor sleep habits',
      'Medical conditions',
      'Medications',
      'Caffeine or alcohol consumption',
      'Environmental factors'
    ],
    naturalSolutions: [
      {
        type: 'supplement',
        name: 'Melatonin',
        description: 'Most researched sleep supplement. Regulates circadian rhythm naturally.',
        affiliateLink: 'https://amzn.to/melatonin-sleep',
        price: '$15-25',
        clinicalEvidence: '0.5-5mg 30-60 min before bed. Most effective for circadian rhythm issues'
      },
      {
        type: 'supplement',
        name: 'Magnesium Glycinate',
        description: 'Essential mineral for muscle relaxation and GABA support. Deficiency common in insomnia.',
        affiliateLink: 'https://amzn.to/magnesium-sleep',
        price: '$18-28',
        clinicalEvidence: '200-400mg daily improves sleep quality and reduces wake time'
      },
      {
        type: 'supplement',
        name: '5-HTP',
        description: 'Precursor to serotonin and melatonin. Supports natural sleep hormone production.',
        affiliateLink: 'https://amzn.to/5htp-sleep',
        price: '$20-30',
        clinicalEvidence: '100-300mg daily increases REM sleep and reduces sleep latency'
      },
      {
        type: 'supplement',
        name: 'GABA',
        description: 'Direct calming neurotransmitter that promotes deep, restorative sleep.',
        affiliateLink: 'https://amzn.to/gaba-sleep',
        price: '$20-30',
        clinicalEvidence: '500-750mg before bed improves sleep quality and reduces anxiety'
      },
      {
        type: 'herb',
        name: 'Valerian Root',
        description: 'Traditional sleep herb with modern clinical studies showing effectiveness.',
        affiliateLink: 'https://amzn.to/valerian-sleep',
        price: '$18-25',
        clinicalEvidence: '400-900mg extract improves sleep quality and reduces time to fall asleep'
      },
      {
        type: 'herb',
        name: 'Passionflower',
        description: 'Gentle nervine herb that enhances GABA activity for natural sleep support.',
        affiliateLink: 'https://amzn.to/passionflower-sleep',
        price: '$15-25',
        clinicalEvidence: 'Traditional use with modern safety studies for sleep and anxiety'
      }
    ],
    variants: ['Sleep Onset Insomnia', 'Sleep Maintenance Insomnia', 'Early Morning Awakening'],
    herb: {
      name: 'Valerian Root',
      description: 'Traditional sleep herb with modern clinical studies showing effectiveness.',
      affiliateUrl: 'https://amzn.to/valerian-sleep',
    },
    extract: {
      name: 'Melatonin (0.5-5mg)',
      description: 'Most researched sleep supplement. Regulates circadian rhythm naturally.',
      affiliateUrl: 'https://amzn.to/melatonin-sleep',
    },
    supplements: [
      {
        name: 'Magnesium Glycinate',
        description: 'Essential mineral for muscle relaxation and GABA support.',
        affiliateUrl: 'https://amzn.to/magnesium-sleep',
      },
      {
        name: '5-HTP',
        description: 'Precursor to serotonin and melatonin. Supports natural sleep hormone production.',
        affiliateUrl: 'https://amzn.to/5htp-sleep',
      },
    ],
    cautions: [
      'Consult your doctor before starting new supplements, especially if you take medication.',
      'Valerian may cause drowsiness or vivid dreams in some people.',
      'Melatonin is best for circadian rhythm issues, not general insomnia.',
    ],
    related: [
      { slug: 'anxiety', name: 'Anxiety' },
      { slug: 'fatigue', name: 'Fatigue' },
    ],
    faq: [
      {
        q: 'Can I take melatonin and valerian together?',
        a: 'Yes, but start with low doses and monitor your response. Both are generally safe but may cause drowsiness.',
      },
      {
        q: 'How long until I notice results?',
        a: 'Herbal and supplement effects may take 1–2 weeks of consistent use.',
      },
    ],
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
    description: 'Stiffness or pain in the neck, often related to stress or posture.',
    symptoms: [
      'Stiff neck',
      'Pain with movement',
      'Tension headaches',
      'Shoulder tightness'
    ],
    causes: [
      'Stress',
      'Poor posture',
      'Injury',
      'Prolonged computer use'
    ],
    naturalSolutions: [
      {
        type: 'herb',
        name: 'Lavender',
        description: 'Calming herb that may help with muscle relaxation',
        affiliateLink: 'https://amzn.to/example-lavender',
        price: '$12-20'
      },
      {
        type: 'herb',
        name: 'Cramp Bark (Viburnum opulus)',
        description: 'Skeletal muscle relaxant and nerve relaxant. Excellent for neck tension, muscle cramps, and pinched nerves.',
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
    symptoms: [
      'Fatigue',
      'Digestive issues',
      'Skin problems',
      'Brain fog'
    ],
    causes: [
      'Toxin exposure',
      'Poor diet',
      'Alcohol use',
      'Medications'
    ],
    naturalSolutions: [
      {
        type: 'herb',
        name: 'Milk Thistle',
        description: 'Supports liver detoxification and regeneration',
        affiliateLink: 'https://amzn.to/example-milk-thistle',
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
    title: 'Migraine',
    description: 'Severe recurring headaches often accompanied by nausea, sensitivity to light and sound, and visual disturbances.',
    symptoms: [
      'Intense throbbing headache',
      'Nausea and vomiting',
      'Sensitivity to light and sound',
      'Visual disturbances (aura)',
      'Dizziness',
      'Fatigue'
    ],
    causes: [
      'Hormonal changes',
      'Stress and tension',
      'Food triggers',
      'Environmental factors',
      'Sleep disturbances',
      'Dehydration'
    ],
    naturalSolutions: [
      {
        type: 'herb',
        name: 'Feverfew',
        description: 'Traditional herb used for migraine prevention and relief',
        affiliateLink: 'https://amzn.to/example-feverfew',
        price: '$12-20',
        herbLink: '/herbs/feverfew'
      },
      {
        type: 'herb',
        name: 'Butterbur',
        description: 'Natural supplement that may reduce migraine frequency',
        affiliateLink: 'https://amzn.to/example-butterbur',
        price: '$15-25'
      },
      {
        type: 'supplement',
        name: 'Magnesium',
        description: 'Mineral that may help prevent migraines',
        affiliateLink: 'https://amzn.to/example-magnesium',
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
  }
};

export default async function SymptomPage({ params }: SymptomPageProps) {
  const { slug } = await params;
  const symptom = symptoms[slug as keyof typeof symptoms];

  if (!symptom) {
    notFound();
  }

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
                  supporting the body's natural healing processes, and using evidence-based herbs and 
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
                      .filter((solution: any) => solution.type === 'herb')
                      .slice(0, 3)
                      .map((solution: any, index: number) => (
                        <li key={index}>• {solution.name} - {solution.description}</li>
                      ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Supplemental Support</h3>
                  <ul className="text-gray-700 space-y-1">
                    {symptom.naturalSolutions && symptom.naturalSolutions
                      .filter((solution: any) => solution.type === 'supplement')
                      .slice(0, 3)
                      .map((solution: any, index: number) => (
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
                    <img 
                      src={product.image || '/images/closed-medical-brown-glass-bottle-yellow-vitamins.png'} 
                      alt={product.name} 
                      className="w-20 h-20 object-contain rounded mb-2" 
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