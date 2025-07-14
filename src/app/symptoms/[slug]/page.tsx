import { notFound } from 'next/navigation';

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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
  }
};

export default async function SymptomPage({ params }: SymptomPageProps) {
  const { slug } = await params;
  const symptom = symptoms[slug as keyof typeof symptoms];

  if (!symptom) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">{symptom.title}</h1>
          <p className="text-xl text-blue-700 mb-6">{symptom.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Symptoms & Causes */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">Common Symptoms</h2>
              <ul className="space-y-2">
                {symptom.symptoms.map((symptomItem, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span className="text-gray-700">{symptomItem}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">Possible Causes</h2>
              <ul className="space-y-2">
                {symptom.causes.map((cause, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span className="text-gray-700">{cause}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Precautions */}
            {symptom.precautions && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-orange-800 mb-4">⚠️ Precautions</h2>
                <ul className="space-y-2">
                  {symptom.precautions.map((precaution, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span className="text-orange-700">{precaution}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contraindications */}
            {symptom.contraindications && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-red-800 mb-4">🚫 Contraindications</h2>
                <ul className="space-y-2">
                  {symptom.contraindications.map((contraindication, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span className="text-red-700">{contraindication}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Natural Solutions */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-blue-800 mb-6">Natural Solutions</h2>
            <div className="space-y-4">
              {symptom.naturalSolutions.map((solution, index) => (
                <div key={index} className="border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-blue-900">{solution.name}</h3>
                    <span className="text-green-600 font-medium">{solution.price}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{solution.description}</p>
                  
                  <div className="flex gap-2">
                    <a
                      href={solution.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      View Product →
                    </a>
                    {solution.herbLink && (
                      <a
                        href={solution.herbLink}
                        className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Learn More →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 space-y-6">
          {/* Safety Information */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-4">⚠️ Important Safety Information</h3>
            <div className="space-y-3 text-sm text-red-700">
              <div className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span><strong>Medical Consultation Required:</strong> Always consult with a qualified healthcare professional before starting any herbal supplement, especially if you have underlying health conditions, are pregnant, nursing, or taking medications.</span>
              </div>
              <div className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span><strong>Drug Interactions:</strong> Herbs can interact with prescription medications, over-the-counter drugs, and other supplements. These interactions can be serious and potentially life-threatening.</span>
              </div>
              <div className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span><strong>Not Suitable for Everyone:</strong> Herbs may not be appropriate for people with certain medical conditions, allergies, or sensitivities. Individual responses can vary significantly.</span>
              </div>
              <div className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span><strong>Quality Matters:</strong> Choose reputable brands and ensure proper sourcing. Contaminated or adulterated herbs can cause serious health problems.</span>
              </div>
              <div className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span><strong>Start Slowly:</strong> Begin with one herb at a time to monitor for adverse reactions. Stop immediately if you experience any negative side effects.</span>
              </div>
            </div>
          </div>

          {/* General Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              <strong>Disclaimer:</strong> This information is for educational purposes only and should not be considered medical advice. 
              The content provided is not intended to diagnose, treat, cure, or prevent any disease. 
              Herbal supplements are not regulated by the FDA and may not be suitable for everyone. 
              Always consult with a healthcare professional before starting any new supplement regimen, 
              especially if you have underlying health conditions, are taking medications, or are pregnant/nursing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 