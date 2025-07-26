import Link from 'next/link';
import Image from 'next/image';
import VariantSymptomPage from './VariantSymptomPage';
import { Symptom, Product } from '../../../types/symptom';

const symptoms: Record<string, Symptom> = {
  'insomnia': {
    name: 'Insomnia',
    title: 'Insomnia',
    description: 'Difficulty falling asleep, staying asleep, or waking up too early.',
    variants: {
      "Sleep Onset Insomnia": {
        paragraphs: [
          "Sleep onset insomnia is difficulty falling asleep at the beginning of the night. It is often related to stress, anxiety, or an overactive mind.",
          "Supporting relaxation and calming the nervous system before bed is key."
        ],
        productFormulations: {
             "Valerian Root": {
            name: 'Valerian Root',
            description: 'Traditional sleep herb with modern clinical studies showing effectiveness for falling asleep.',
            affiliateLink: 'https://amzn.to/valerian-sleep',
            price: '$18-25'
          },
          Melatonin: {
            name: 'Melatonin (0.5-3mg)',
            description: 'Most researched sleep supplement. Regulates circadian rhythm and helps initiate sleep.',
            affiliateLink: 'https://amzn.to/melatonin-sleep',
            price: '$15-25'
          }
        },
      },
      "Sleep Maintenance Insomnia": {
        paragraphs: [
          "Sleep maintenance insomnia is waking up frequently during the night or having trouble staying asleep. It can be related to blood sugar swings, stress hormones, or environmental factors.",
          "Stabilizing blood sugar and supporting stress resilience can help."
        ],
        productFormulations: {
          Passionflower: {
            name: 'Passionflower',
            description: 'Gentle nervine herb that enhances GABA activity for natural sleep support and reduces nighttime awakenings.',
            affiliateLink: 'https://amzn.to/passionflower-sleep',
            price: '$15-25'
          },
             "Magnesium Glycinate": {
            name: 'Magnesium Glycinate',
            description: 'Essential mineral for muscle relaxation and sleep maintenance.',
            affiliateLink: 'https://amzn.to/magnesium-sleep',
            price: '$18-28'
          }
        },
      },
      "Early Morning Awakening": {
        paragraphs: [
          "Early morning awakening is waking up too early and being unable to return to sleep. It can be related to low mood, hormonal changes, or circadian rhythm disruptions.",
          "Supporting circadian rhythm and mood balance can help restore healthy sleep patterns."
        ],
        productFormulations: {
          "St. John's Wort": {
            name: 'St. John\'s Wort',
            description: 'Traditional herb with evidence for mood support and circadian rhythm regulation.',
            affiliateLink: 'https://amzn.to/st-johns-wort-sleep',
            price: '$20-30'
          },
          "L-Theanine": {
            name: '5-HTP',
            description: 'Precursor to serotonin and melatonin. Supports mood and sleep regulation.',
            affiliateLink: 'https://amzn.to/5htp-sleep',
            price: '$20-30'
          }
        },
      }
    },
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
        name: 'St. John\'s Wort',
        description: 'Traditional herb with extensive clinical research for mild to moderate depression.',
        affiliateLink: 'https://amzn.to/st-johns-wort-depression',
        price: '$20-30',
        clinicalEvidence: '900mg daily extract shows effectiveness comparable to prescription antidepressants'
      }
    ],
    herb: null,
    extract: null,
    supplements: null,
    
    related: null,
    faq: null,
  },
  'depression': {
    name: 'Depression',
    title: 'Depression',
    description: 'Persistent feelings of sadness and loss of interest',
    variants: {
      'Default': {
        paragraphs: [
          "Depression is a complex mental health condition that affects how you feel, think, and behave. It's more than just feeling sad or having the blues for a few days. It's a medical illness that can be treated with medications, therapy, and lifestyle changes. Understanding the symptoms and causes of depression is crucial for effective treatment.",
          "Common symptoms of depression include persistent sadness, loss of interest in activities, changes in appetite or weight, sleep problems, fatigue, and feelings of worthlessness. These symptoms can vary in intensity and duration, and they can be triggered by various factors, including biological, environmental, and lifestyle factors."
        ]
      }
    },
    // Move symptoms, causes, naturalSolutions, etc. to the Symptom level if needed
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
        name: 'St. John\'s Wort',
        description: 'Traditional herb with extensive clinical research for mild to moderate depression.',
        affiliateLink: 'https://amzn.to/st-johns-wort-depression',
        price: '$20-30',
        clinicalEvidence: '900mg daily extract shows effectiveness comparable to prescription antidepressants'
      }
    ],
    herb: null,
    extract: null,
    supplements: null,
    
    related: null,
    faq: null,
  },
  'anxiety': {
    name: 'Anxiety',
    title: 'Anxiety',
    description: 'Excessive worry and nervousness',
    variants: {
      'Default': {
        paragraphs: [
          "Anxiety is a normal response to stress, but when it becomes excessive or chronic, it can significantly impact your quality of life. It's characterized by feelings of worry, nervousness, and fear, often accompanied by physical symptoms like rapid heartbeat, sweating, and trembling. Anxiety disorders are treatable, and natural approaches can play a supportive role in managing symptoms.",
          "Common symptoms of anxiety include excessive worrying, restlessness or feeling on edge, difficulty concentrating, irritability, muscle tension, and sleep problems. These symptoms can vary in intensity and duration, and they can be influenced by various factors, including genetics, brain chemistry, environmental stressors, and medical conditions."
        ],
        productFormulations: {
          Passionflower: {
            name: 'Passionflower',
            description: 'Traditional nervine herb that enhances GABA activity naturally',
            affiliateLink: 'https://amzn.to/passionflower-anxiety',
            price: '$15-25'
          },
          Ashwagandha: {
            name: 'Ashwagandha',
            description: 'Adaptogenic herb with multiple RCTs showing cortisol reduction and stress relief',
            affiliateLink: 'https://amzn.to/ashwagandha-anxiety',
            price: '$20-35'
          }
        },
      }
    },
    herb: null,
    extract: null,
    supplements: null,
    
    related: null,
    faq: null
  },
  'memory-loss': {
    name: 'Memory Loss',
    title: 'Memory Loss',
    description: 'Difficulty remembering information or events',
    variants: {
      'Default': {
        paragraphs: [
          "Memory loss, or cognitive impairment, can affect your ability to learn, remember, and retain information. It's a common symptom of various conditions, including stress, sleep deprivation, nutritional deficiencies, and underlying health issues. Understanding the causes and symptoms of memory loss is important for addressing the underlying cause and finding effective natural solutions.",
          "Common symptoms of memory loss include forgetting recent events, difficulty learning new information, confusion about time or place, trouble with familiar tasks, poor judgment, and changes in mood or behavior. These symptoms can range in severity and duration, and they can be influenced by various factors, including aging, stress, sleep issues, and nutrient deficiencies."
        ],
        productFormulations: {
             "Bacopa Monnieri": {
            name: 'Bacopa Monnieri',
            description: 'Traditional nootropic herb with extensive clinical research for memory enhancement.',
            affiliateLink: 'https://amzn.to/bacopa-memory',
            price: '$20-35'
          },
          "Alpha-GPC": {
            name: 'Alpha-GPC',
            description: 'Bioavailable choline source. Essential for acetylcholine production and memory.',
            affiliateLink: 'https://amzn.to/alpha-gpc-memory',
            price: '$25-40'
          }
        },
      }
    },
    herb: null,
    extract: null,
    supplements: null,
    
    related: null,
    faq: null
  },
  'neck-tension': {
    name: 'Neck Tension',
    title: 'Neck Tension',
    description: 'Muscle tightness, pain, or stiffness in the neck and upper shoulders.',
    variants: {
      'Default': {
        paragraphs: [
          "Neck tension is a common complaint, often caused by stress, poor posture, prolonged computer use, or muscle strain. It can also be associated with headaches, jaw pain, or upper back discomfort.",
          "Natural approaches to neck tension focus on muscle relaxation, stress reduction, and supporting healthy circulation."
        ],
        productFormulations: {
          Lavender: {
            name: 'Lavender',
            description: 'Traditional herb for muscle relaxation and stress relief.',
            affiliateLink: 'https://amzn.to/lavender-neck',
            price: '$15-22'
          },
          Magnesium: {
            name: 'Magnesium',
            description: 'Essential mineral for muscle relaxation and nerve function.',
            affiliateLink: 'https://amzn.to/magnesium-neck',
            price: '$18-28'
          }
        },
      },
      'Muscle Tension': {
        paragraphs: [
          "Muscle tension is a common complaint that can be caused by stress, poor posture, overuse, or dehydration. It can also be associated with neck or shoulder pain, jaw clenching, and difficulty relaxing.",
          "Understanding the causes and symptoms of muscle tension is important for finding effective natural solutions."
        ],
        productFormulations: {
          Skullcap: {
            name: 'Skullcap',
            description: 'Traditionally used for muscle tension and nervous headaches',
            affiliateLink: 'https://amzn.to/example-skullcap',
            price: '$15-25'
          },
          "Cramp Bark": {
            name: 'Cramp Bark (Viburnum opulus)',
            description: 'Skeletal muscle relaxant and nerve relaxant. Traditionally used for pain, pinched nerves, muscle cramps, and menstrual cramps.',
            affiliateLink: 'https://amzn.to/example-cramp-bark',
            price: '$14-22'
          }
        },
      },
      'Tension Headaches': {
        paragraphs: [
          "Tension headaches are the most common type of headache, characterized by a dull, aching pain that feels like a tight band around the head. They are often caused by stress, poor posture, eye strain, or muscle tension in the neck and shoulders.",
          "Natural approaches to tension headaches focus on stress reduction, muscle relaxation, and addressing underlying causes."
        ],
        productFormulations: {
          Peppermint: {
            name: 'Peppermint',
            description: 'Traditional herb for headache relief and muscle relaxation.',
            affiliateLink: 'https://amzn.to/peppermint-headache',
            price: '$12-20'
          },
          "Willow Bark": {
            name: 'Willow Bark',
            description: 'Natural source of salicin, similar to aspirin, for pain relief.',
            affiliateLink: 'https://amzn.to/willow-bark-pain',
            price: '$15-25'
          }
        },
      }
    },
    relatedSymptoms: [
      { name: 'Migraine', href: '/symptoms/migraine', color: 'purple' },
      { name: 'Stress', href: '/symptoms/stress', color: 'blue' },
      { name: 'Fatigue', href: '/symptoms/fatigue', color: 'green' }
    ],
    disclaimer: 'These recommendations are for general support. Consult your healthcare provider for personalized advice.',
    herb: null,
    extract: null,
    supplements: null,
    
    related: null,
    faq: null
  },
  'blood-pressure': {
    name: 'Blood Pressure Balance',
    title: 'Blood Pressure Balance',
    description: 'Support for healthy blood pressure levels.',
    variants: {
      'Default': {
        paragraphs: [
          "Blood pressure is a critical indicator of cardiovascular health. High or low blood pressure can lead to various health complications, including heart disease, stroke, and kidney problems. Understanding the causes and symptoms of blood pressure imbalance is important for managing this vital health marker.",
          "Common symptoms of blood pressure imbalance include high or low blood pressure, dizziness, headaches, and fatigue. These symptoms can vary in intensity and duration, and they can be influenced by various factors, including diet, stress, genetics, and medical conditions."
        ]
      }
    },
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
        productLink: '/herbs/hawthorn'
      }
    ],
    herb: null,
    extract: null,
    supplements: null,
    
    related: null,
    faq: null
  },
  'heart-support': {
    name: 'Heart Muscle Support',
    title: 'Heart Muscle Support',
    description: 'Support for heart muscle function and cardiovascular health.',
    variants: {
      'Default': {
        paragraphs: [
          "Heart health is crucial for overall well-being. Fatigue, shortness of breath, chest discomfort, and palpitations are common symptoms of heart-related issues. Understanding the causes and symptoms of heart muscle support is important for addressing the underlying cause and finding effective natural solutions.",
          "Common symptoms of heart muscle support include fatigue, shortness of breath, chest discomfort, and palpitations. These symptoms can vary in intensity and duration, and they can be influenced by various factors, including cardiovascular conditions, nutrient deficiencies, and stress."
        ]
      }
    },
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
    herb: null,
    extract: null,
    supplements: null,
    
    related: null,
    faq: null
  },
  'liver-detox': {
    name: 'Liver Function Support / Toxicity',
    title: 'Liver Function Support / Toxicity',
    description: 'Support for liver detoxification and function.',
    variants: {
      'Default': {
        paragraphs: [
          "The liver is one of the body's most important organs, responsible for detoxification, metabolism, and hormone regulation. When liver function is compromised, it cannot effectively clear toxins and metabolic byproducts from the bloodstream, leading to hormonal imbalances and other health issues. Understanding the causes and symptoms of poor liver function is crucial for addressing the underlying cause and finding effective natural solutions.",
          "Common symptoms of poor liver function include fatigue, digestive issues, skin problems, and brain fog. These symptoms can vary in intensity and duration, and they can be influenced by various factors, including genetic predisposition, chronic illness, medications, infections, or nutrient deficiencies."
        ]
      }
    },
    symptoms: [
      'Fatigue',
      'Digestive issues',
      'Skin problems',
      'Brain fog'
    ],
    causes: [
      'Genetic predisposition',
      'Chronic illness',
      'Medications',
      'Infections',
      'Nutrient deficiencies'
    ],
    naturalSolutions: [
      {
        type: 'supplement',
        name: 'Milk Thistle',
        description: 'Traditional liver herb with strong evidence for supporting detoxification and liver cell regeneration.',
        affiliateLink: 'https://amzn.to/milk-thistle-liver',
        price: '$18-28'
      },
      {
        type: 'supplement',
        name: 'NAC (N-Acetyl Cysteine)',
        description: 'Amino acid supplement that boosts glutathione, the body’s master antioxidant for liver health.',
        affiliateLink: 'https://amzn.to/nac-liver',
        price: '$20-30'
      },
      {
        type: 'supplement',
        name: 'Dandelion Root',
        description: 'Herbal bitter that stimulates bile flow and supports digestion and detoxification.',
        affiliateLink: 'https://amzn.to/dandelion-liver',
        price: '$15-22'
      },
      {
        type: 'supplement',
        name: 'Alpha Lipoic Acid',
        description: 'Powerful antioxidant that supports liver cell protection and regeneration.',
        affiliateLink: 'https://amzn.to/ala-liver',
        price: '$18-28'
      }
    ],
    relatedSymptoms: [
      { name: 'Hormonal Imbalances', href: '/symptoms/hormonal-imbalances', color: 'purple' },
      { name: 'Fatigue', href: '/symptoms/fatigue', color: 'green' },
      { name: 'Digestive Health', href: '/symptoms/digestive-health', color: 'blue' }
    ],
    disclaimer: 'These recommendations are for general support. Consult your healthcare provider for personalized advice.',
    herb: null,
    extract: null,
    supplements: null,
    
    related: null,
    faq: null
  },
  'digestive-health': {
    name: 'Hormonal Imbalances / Digestive Health',
    title: 'Hormonal Imbalances / Digestive Health',
    description: 'Support for hormone balance and digestive function.',
    variants: {
      'Default': {
        paragraphs: [
          "Hormonal imbalances and digestive health are closely linked. Poor gut health can lead to hormonal dysregulation, which in turn can affect mood, energy, and overall wellbeing. Understanding the causes and symptoms of digestive health issues is important for addressing the underlying cause and finding effective natural solutions.",
          "Common symptoms of digestive health issues include bloating, irregular cycles, digestive discomfort, and mood swings. These symptoms can vary in intensity and duration, and they can be influenced by various factors, including hormonal fluctuations, gut dysbiosis, diet, and stress."
        ]
      }
    },
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
    herb: null,
    extract: null,
    supplements: null,
    
    related: null,
    faq: null
  },
  'adrenal-overload': {
    name: 'Adrenal Overload',
    title: 'Adrenal Overload',
    description: 'Symptoms of excess stress and adrenal hormone output.',
    variants: {
      'Default': {
        paragraphs: [
          "Adrenal overload, or hyperadrenalism, is a state where the adrenal glands produce excessive amounts of stress hormones. This can lead to feelings of wiredness, trouble sleeping, irritability, and cravings for salt or sugar. Understanding the causes and symptoms of adrenal overload is important for addressing the underlying cause and finding effective natural solutions.",
          "Common symptoms of adrenal overload include feeling wired, trouble sleeping, irritability, and cravings for salt or sugar. These symptoms can vary in intensity and duration, and they can be influenced by various factors, including chronic stress, overwork, and poor sleep."
        ]
      }
    },
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
    herb: null,
    extract: null,
    supplements: null,
    
    related: null,
    faq: null
  },
  'adrenal-exhaustion': {
    name: 'Adrenal Exhaustion',
    title: 'Adrenal Exhaustion',
    description: 'Symptoms of depleted adrenal function from chronic stress.',
    variants: {
      'Default': {
        paragraphs: [
          "Adrenal exhaustion, or adrenal fatigue, is a state where the adrenal glands are unable to produce sufficient stress hormones to meet the body's needs. This can lead to fatigue, low motivation, brain fog, cravings for salt, and low blood pressure. Understanding the causes and symptoms of adrenal exhaustion is important for addressing the underlying cause and finding effective natural solutions.",
          "Common symptoms of adrenal exhaustion include fatigue, low motivation, brain fog, cravings for salt, and low blood pressure. These symptoms can vary in intensity and duration, and they can be influenced by various factors, including prolonged stress, poor sleep, and nutrient deficiencies."
        ]
      }
    },
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
    herb: null,
    extract: null,
    supplements: null,
    
    related: null,
    faq: null
  },
  'circadian-support': {
    name: 'Circadian Support',
    title: 'Circadian Support',
    description: 'Support for healthy sleep-wake cycles and circadian rhythm.',
    variants: {
      'Default': {
        paragraphs: [
          "Circadian rhythm, or the body's internal clock, plays a crucial role in regulating sleep, wakefulness, and many other physiological processes. Disruptions in circadian rhythm can lead to difficulties falling asleep, daytime sleepiness, irregular sleep patterns, and mood changes. Understanding the causes and symptoms of circadian support is important for addressing the underlying cause and finding effective natural solutions.",
          "Common symptoms of circadian support include difficulty falling asleep, daytime sleepiness, irregular sleep patterns, and mood changes. These symptoms can vary in intensity and duration, and they can be influenced by various factors, including shift work, jet lag, screen time at night, and irregular routines."
        ]
      }
    },
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
    herb: null,
    extract: null,
    supplements: null,
    
    related: null,
    faq: null
  },
  'vagus-nerve': {
    name: 'Vagus Nerve Support',
    title: 'Vagus Nerve Support',
    description: 'Understanding and supporting your body\'s most important nerve for overall health and well-being',
    paragraphs: [
      'The vagus nerve is the longest cranial nerve in your body, running from your brainstem through your neck and into your chest and abdomen. It\'s often called the "wandering nerve" because of its extensive reach throughout your body.',
      'This nerve is crucial for your parasympathetic nervous system - the "rest and digest" system that helps your body relax, recover, and maintain homeostasis. It controls many vital functions including heart rate, digestion, breathing, and immune response.'
    ],
    symptoms: [
      'Digestive issues (bloating, constipation, acid reflux)',
      'Heart rate variability problems',
      'Difficulty relaxing or feeling constantly stressed',
      'Poor immune function and frequent illness',
      'Inflammation throughout the body',
      'Mood disorders and anxiety',
      'Sleep disturbances',
      'Chronic fatigue'
    ],
    naturalSolutions: [
      { name: 'Omega-3 Fish Oil', description: 'High-quality fish oil supports nerve function and reduces inflammation', affiliateLink: 'https://amzn.to/3example1', price: '' },
      { name: 'Probiotics', description: 'Support gut-brain axis and vagus nerve communication', affiliateLink: 'https://amzn.to/3example2', price: '' },
      { name: 'Magnesium', description: 'Essential mineral for nerve function and relaxation', affiliateLink: 'https://amzn.to/3example3', price: '' },
      { name: 'L-Theanine', description: 'Amino acid that promotes relaxation and reduces stress', affiliateLink: 'https://amzn.to/3example4', price: '' }
    ],
    disclaimer: 'This information is for educational purposes only. Always consult with a healthcare provider before starting any new supplement regimen, especially if you have underlying health conditions or are taking medications.'
  },
  'dysbiosis': {
    name: 'Dysbiosis',
    title: 'Dysbiosis',
    description: 'Imbalance of gut bacteria affecting health.',
    variants: {
      'Default': {
        paragraphs: [
          "Dysbiosis, or an imbalance of gut bacteria, can lead to various health issues, including digestive discomfort, brain fog, and food sensitivities. Understanding the causes and symptoms of dysbiosis is important for addressing the underlying cause and finding effective natural solutions.",
          "Common symptoms of dysbiosis include bloating, digestive discomfort, brain fog, and food sensitivities. These symptoms can vary in intensity and duration, and they can be influenced by various factors, including antibiotic use, poor diet, stress, and infections."
        ]
      }
    },
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
    herb: null,
    extract: null,
    supplements: null,
    
    related: null,
    faq: null
  },
  'leaky-gut': {
    name: 'Leaky Gut / Leaky Brain',
    title: 'Leaky Gut / Leaky Brain',
    description: 'Understanding the connection between gut health and brain function',
    paragraphs: [
      'Leaky gut, or increased intestinal permeability, occurs when the tight junctions between cells in your intestinal lining become compromised, allowing undigested food particles, toxins, and bacteria to pass through into your bloodstream.',
      'This can trigger an immune response and inflammation throughout your body, potentially affecting your brain function and contributing to various health issues.',
      'Your gut and brain are connected through the gut-brain axis, a complex communication network involving the vagus nerve, immune system, and various signaling molecules. When your gut barrier is compromised, it can affect brain function and contribute to brain fog, mood disorders, inflammation, and more.'
    ],
    symptoms: [
      'Bloating and gas',
      'Food sensitivities',
      'IBS-like symptoms',
      'Chronic diarrhea or constipation',
      'Fatigue and low energy',
      'Joint pain and inflammation',
      'Skin issues (eczema, acne)',
      'Autoimmune conditions',
      'Brain fog and poor concentration',
      'Mood swings and anxiety',
      'Memory problems',
      'Headaches and migraines',
      'Nutrient deficiencies',
      'Weakened immune system',
      'Chronic inflammation',
      'Sleep disturbances'
    ],
    naturalSolutions: [
      { name: 'L-Glutamine', description: 'Supports gut lining repair and integrity', affiliateLink: 'https://amzn.to/3example10', price: '' },
      { name: 'Collagen Peptides', description: 'Supports gut lining structure and repair', affiliateLink: 'https://amzn.to/3example11', price: '' },
      { name: 'Probiotics', description: 'Support healthy gut microbiome and gut-brain axis', affiliateLink: 'https://amzn.to/3example12', price: '' },
      { name: 'Omega-3 Fish Oil', description: 'Reduces inflammation and supports brain health', affiliateLink: 'https://amzn.to/3example13', price: '' },
      { name: 'Zinc', description: 'Essential mineral for gut lining integrity and immune function', affiliateLink: 'https://amzn.to/3example14', price: '' },
      { name: 'Curcumin', description: 'Powerful anti-inflammatory that may help with gut and brain inflammation', affiliateLink: 'https://amzn.to/3example15', price: '' }
    ],
    disclaimer: 'This information is for educational purposes only. Leaky gut is a complex condition that requires proper medical evaluation. Always consult with a healthcare provider for diagnosis and treatment recommendations.'
  },
  'ibs': {
    name: 'IBS (Irritable Bowel Syndrome)',
    title: 'IBS (Irritable Bowel Syndrome)',
    description: 'Digestive disorder with abdominal pain and changes in bowel habits.',
    variants: {
      'IBS-D (Diarrhea-predominant)': {
        paragraphs: [
          'IBS-D is characterized by frequent loose stools and abdominal discomfort. Management focuses on calming the gut, reducing triggers, and supporting healthy digestion.',
          'Content coming soon!'
        ]
      },
      'IBS-C (Constipation-predominant)': {
        paragraphs: [
          'IBS-C is characterized by infrequent, hard stools and abdominal discomfort. Management focuses on improving motility, fiber intake, and gut health.',
          'Content coming soon!'
        ]
      },
      'IBS-M (Mixed type)': {
        paragraphs: [
          'IBS-M involves alternating diarrhea and constipation. Management focuses on balancing the gut, reducing stress, and identifying dietary triggers.',
          'Content coming soon!'
        ]
      }
    },
    disclaimer: 'These recommendations are for general support. Consult your healthcare provider for personalized advice.'
  },
  'migraine': {
    name: 'Migraine Relief',
    title: 'Migraine Relief',
    description: 'Natural solutions for migraine management and prevention.',
    variants: {
      'Default': {
        paragraphs: [
          "Migraines are complex neurological conditions that can be debilitating. They involve changes in brain chemistry, blood vessel dilation, and inflammation. Common triggers include hormonal changes, food sensitivities, stress, sleep disturbances, environmental factors, and dehydration.",
          "Natural approaches to migraine relief focus on reducing frequency, intensity, and duration of attacks through evidence-based herbs, supplements, and lifestyle changes."
        ],
        productFormulations: {
          Feverfew: {
            name: 'Feverfew',
            description: 'Traditional migraine herb with anti-inflammatory properties.',
            affiliateLink: 'https://amzn.to/feverfew-migraine',
            price: '$15-22'
          },
          Butterbur: {
            name: 'Butterbur',
            description: 'Clinically proven to reduce migraine frequency.',
            affiliateLink: 'https://amzn.to/butterbur-migraine',
            price: '$18-28'
          }
        },
        cautions: 'These recommendations are for general support. Consult your healthcare provider for personalized advice.',
        relatedSymptoms: [
          { name: 'Nausea & Vomiting', href: '/symptoms/nausea', color: 'purple' },
          { name: 'Light Sensitivity', href: '/symptoms/light-sensitivity', color: 'blue' },
          { name: 'Sound Sensitivity', href: '/symptoms/sound-sensitivity', color: 'green' }
        ],
        emergencyNote: 'If you experience a severe, sudden headache unlike any you\'ve had before, seek immediate medical attention. Call emergency services or go to the nearest emergency room.',
        herb: null,
        extract: null,
        supplements: null,
        
        related: null,
        faq: null
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
    
    related: null,
    faq: null
  },
  'burnout': {
    name: 'Emotional Burnout',
    title: 'Emotional Burnout',
    description: 'Chronic stress and emotional exhaustion affecting mood, energy, and motivation.',
    variants: {
      'Default': {
        paragraphs: [
          "Burnout is a state of chronic stress and emotional exhaustion that can affect mood, energy, motivation, and overall wellbeing. It is common in high-pressure jobs, caregiving roles, and during prolonged periods of stress.",
          "Natural approaches to burnout focus on stress reduction, nervous system support, and restoring energy and resilience."
        ],
        productFormulations: {
             "Rhodiola Rosea": {
            name: 'Rhodiola Rosea',
            description: 'Adaptogenic herb that improves energy, reduces fatigue, and enhances stress resilience.',
            affiliateLink: 'https://amzn.to/rhodiola-burnout',
            price: '$25-35'
          },
          Ashwagandha: {
            name: 'Ashwagandha',
            description: 'Adaptogenic herb that reduces stress hormones and supports adrenal function.',
            affiliateLink: 'https://amzn.to/ashwagandha-burnout',
            price: '$18-28'
          }
        },
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
    
    related: null,
    faq: null
  },
  'thyroid-issues': {
    name: 'Thyroid Health Support',
    title: 'Thyroid Health Support',
    description: 'Understanding and supporting thyroid function for energy and metabolism',
    variants: {
      'Default': {
        paragraphs: [
          'Your thyroid gland regulates metabolism, energy production, body temperature, and many other vital functions. When thyroid function is compromised, it can affect every system in your body, leading to a wide range of symptoms.',
          'Thyroid issues can be caused by nutrient deficiencies, stress, environmental factors, autoimmune conditions, and other health imbalances. Supporting thyroid health through diet, lifestyle, and targeted supplements can help restore balance.'
        ],
        productFormulations: {
          Ashwagandha: {
            name: 'Ashwagandha',
            description: 'Adaptogenic herb that may support thyroid function',
            affiliateLink: 'https://amzn.to/3thyroid-ashwagandha',
            price: ''
          },
          Iodine: {
            name: 'Iodine',
            description: 'Essential mineral for thyroid hormone production',
            affiliateLink: 'https://amzn.to/3thyroid-iodine',
            price: ''
          },
          Selenium: {
            name: 'Selenium',
            description: 'Critical for thyroid hormone conversion and function',
            affiliateLink: 'https://amzn.to/3thyroid-selenium',
            price: ''
          },
          Zinc: {
            name: 'Zinc',
            description: 'Essential for thyroid hormone synthesis and conversion',
            affiliateLink: 'https://amzn.to/3thyroid-zinc',
            price: ''
          }
        },
        cautions: 'This information is for educational purposes only and should not replace professional medical advice. Always consult with a healthcare provider before starting any new supplement regimen, especially if you have underlying health conditions or are taking medications. The product links are affiliate links that support this educational content.'
      }
    },
    herb: null,
    extract: null,
    supplements: null,
    
    related: null,
    faq: null
  },
  'poor-focus': {
    name: 'Poor Focus',
    title: 'Poor Focus',
    description: 'Difficulty concentrating, maintaining attention, or staying focused on tasks.',
    variants: {
      'Default': {
        paragraphs: [
          "Poor focus can manifest as difficulty concentrating, easily getting distracted, or having trouble completing tasks. This can be caused by stress, poor sleep, nutrient deficiencies, or underlying health conditions.",
          "Brain fog specifically refers to a feeling of mental cloudiness, confusion, or difficulty thinking clearly. It's often associated with fatigue, stress, or hormonal imbalances.",
          "Poor memory involves difficulty recalling information, learning new things, or retaining details. This can be age-related or due to stress, sleep issues, or nutrient deficiencies.",
          "Natural approaches to improving focus and memory often involve supporting brain health through specific herbs and supplements that enhance blood flow, neurotransmitter function, and cellular energy production."
        ],
        productFormulations: {
             "Ginkgo Biloba": {
            name: 'Ginkgo Biloba',
            description: 'Traditional herb that improves blood flow to the brain and clears mental fog.',
            affiliateLink: 'https://amzn.to/ginkgo-brain-fog',
            price: '$20-30'
          },
          "L-Theanine": {
            name: 'L-Theanine',
            description: 'Amino acid that promotes calm focus and reduces mental fatigue.',
            affiliateLink: 'https://amzn.to/theanine-brain-fog',
            price: '$15-25'
          },
          "Bacopa Monnieri": {
            name: 'Bacopa Monnieri',
            description: 'Ayurvedic herb that enhances memory and cognitive clarity.',
            affiliateLink: 'https://amzn.to/bacopa-brain-fog',
            price: '$25-35'
          },
          "Phosphatidylserine": {
            name: 'Phosphatidylserine',
            description: 'Essential brain phospholipid that supports cognitive function.',
            affiliateLink: 'https://amzn.to/phosphatidylserine-brain-fog',
            price: '$25-35'
          }
        },
      },
      'Poor Memory': {
        productFormulations: {
          "Bacopa Monnieri": {
            name: 'Bacopa Monnieri',
            description: 'Ayurvedic herb that enhances memory, learning, and information retention.',
            affiliateLink: 'https://amzn.to/bacopa-memory',
            price: '$25-35'
          },
          "Phosphatidylserine": {
            name: 'Phosphatidylserine',
            description: 'Essential brain phospholipid that supports memory formation and recall.',
            affiliateLink: 'https://amzn.to/phosphatidylserine-memory',
            price: '$25-35'
          },
          "Acetyl-L-Carnitine": {
            name: 'Acetyl-L-Carnitine',
            description: 'Amino acid that supports brain energy and memory function.',
            affiliateLink: 'https://amzn.to/acetyl-carnitine-memory',
            price: '$20-30'
          },
          "Omega-3 DHA": {
            name: 'Omega-3 DHA',
            description: 'Essential brain fat that supports memory and cognitive performance.',
            affiliateLink: 'https://amzn.to/omega3-memory',
            price: '$25-40'
          }
        }
      },
    },
    disclaimer: 'These recommendations are for general support. Consult your healthcare provider for personalized advice.',
    herb: null,
    extract: null,
    supplements: null,
    
    related: null,
    faq: null
  },
  'fatigue': {
    name: 'Fatigue',
    title: 'Fatigue',
    description: 'Persistent tiredness and lack of energy.',
    variants: {
      'Default': {
        paragraphs: [
          'Fatigue is a common symptom with many possible causes, including stress, poor sleep, nutritional deficiencies, and underlying health conditions.',
          'Content coming soon!'
        ],
      }
    },
    herb: null,
    extract: null,
    supplements: null,
    
    related: null,
    faq: null
  },
  'hormonal-imbalances': {
    name: 'Hormonal Imbalances',
    title: 'Hormonal Imbalances',
    description: 'Disruptions in hormone levels affecting health and wellbeing.',
    variants: {
      'Default': {
        paragraphs: [
          'Hormonal imbalances can cause a wide range of symptoms, from mood swings to fatigue and more.',
          'Content coming soon!'
        ],
      }
    },
    herb: null,
    extract: null,
    supplements: null,
    
    related: null,
    faq: null
  },
  'mood-swings': {
    name: 'Mood Swings',
    title: 'Mood Swings',
    description: 'Rapid or unpredictable changes in mood, energy, or emotional state.',
    variants: {
      Default: {
        paragraphs: [
          "Mood swings can be caused by hormonal fluctuations, stress, sleep disturbances, blood sugar imbalances, or underlying mental health conditions. They can affect relationships, work, and overall quality of life.",
          "Stabilizing mood involves supporting healthy brain chemistry, hormone balance, and stress resilience. Lifestyle changes, therapy, and targeted supplements can all play a role.",
          "If mood swings are severe, persistent, or associated with thoughts of self-harm, seek professional help immediately.",
          "The following recommendations are designed to support emotional balance and resilience to stress."
        ],
        productFormulations: {
          "St. John's Wort": {
            name: "St. John's Wort",
            description: "Traditional herb with clinical evidence for supporting mood stability and emotional balance. May interact with medications—consult your doctor before use.",
            affiliateLink: 'https://amzn.to/st-johns-wort-mood',
            price: '$20-30'
          },
          "Standardized Saffron Extract": {
            name: 'Standardized Saffron Extract',
            description: 'Saffron extract (standardized for crocin and safranal) has been shown in clinical trials to improve mood and reduce symptoms of mild to moderate depression and mood swings.',
            affiliateLink: 'https://amzn.to/saffron-mood',
            price: '$24-40'
          },
          "Omega-3 EPA/DHA": {
            name: 'Omega-3 EPA/DHA',
            description: 'Essential fatty acids for brain health and mood stability. EPA in particular is linked to improved emotional balance.',
            affiliateLink: 'https://amzn.to/omega3-mood',
            price: '$25-40'
          },
          "Magnesium Glycinate": {
            name: 'Magnesium Glycinate',
            description: 'Supports nervous system balance and may help reduce mood swings, irritability, and anxiety.',
            affiliateLink: 'https://amzn.to/magnesium-mood',
            price: '$18-28'
          }
        },
      }
    },
    disclaimer: "This information is for educational purposes only and should not be considered medical advice. The content provided is not intended to diagnose, treat, cure, or prevent any disease. Always consult a healthcare professional before starting any new supplement regimen."
  },
  'stress': {
    name: 'Stress',
    title: 'Stress',
    description: 'Physical and emotional responses to challenging or demanding situations.',
    variants: {
      Default: {
        paragraphs: [
          "Stress is a natural response to perceived threats or demands, but chronic stress can negatively impact health, mood, and well-being. It can manifest as tension, irritability, sleep problems, digestive issues, and more.",
          "Effective stress management involves a combination of lifestyle changes, relaxation techniques, and, when appropriate, targeted supplements or herbal remedies.",
          "If stress feels overwhelming or persistent, consider seeking support from a healthcare professional or counselor."
        ],
        productFormulations: {
          "Ashwagandha": {
            name: 'Ashwagandha',
            description: 'Herb for stress.',
            affiliateLink: '#',
            price: '$15-25'
          },
          "Rhodiola Extract": {
            name: 'Rhodiola Extract',
            description: 'Standardized extract for stress.',
            affiliateLink: '#',
            price: '$18-28'
          },
          "Magnesium Glycinate": {
            name: 'Magnesium Glycinate',
            description: 'Supplement for stress.',
            affiliateLink: '#',
            price: '$12-22'
          },
          "L-Theanine": {
            name: 'L-Theanine',
            description: 'Supplement for stress.',
            affiliateLink: '#',
            price: '$12-22'
          },
          "B-Complex Vitamins": {
            name: 'B-Complex Vitamins',
            description: 'Supplement for stress.',
            affiliateLink: '#',
            price: '$12-22'
          }
        }
      }
    }
  }
};

// --- Normalization pass to ensure every symptom entry is compatible with the new template ---
Object.keys(symptoms).forEach((key) => {
  const s = symptoms[key];
  // Ensure name and description
  if (!s.name) s.name = key.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  if (!s.description) s.description = 'No description available yet.';
  // Ensure variants object
  if (!s.variants || typeof s.variants !== 'object' || Array.isArray(s.variants)) {
    s.variants = { Default: { paragraphs: ["No information available for this symptom yet."] } };
  }
  // If variants is empty, add Default
  if (Object.keys(s.variants).length === 0) {
    s.variants = { Default: { paragraphs: ["No information available for this symptom yet."] } };
  }
  // For each variant, ensure paragraphs exists and is non-empty
  if (s.variants) {
    Object.keys(s.variants).forEach((v) => {
      const variant = s.variants![v];
      if (!variant.paragraphs || !Array.isArray(variant.paragraphs) || variant.paragraphs.length === 0) {
        variant.paragraphs = ["No information available for this variant yet."];
      }
      // Optionally, ensure products fields exist
      if (!('productFormulations' in variant)) variant.productFormulations = {};
    });
  }
});

// --- FINAL DATA CLEANUP: Fix product fields and remove non-Variant properties at the source ---
Object.values(symptoms).forEach((symptom) => {
  if (symptom.variants && typeof symptom.variants === 'object') {
    Object.entries(symptom.variants).forEach(([, variant]) => {
      // Fix productFormulations
      if (typeof variant.productFormulations === 'string') {
        variant.productFormulations = {
          [variant.productFormulations]: {
            name: variant.productFormulations,
            description: 'Adaptogenic or nervine herb for this symptom.',
            affiliateLink: '#',
            price: '$15-25'
          }
        };
      }
      // Remove all non-Variant properties
      Object.keys(variant).forEach((key) => {
        const allowedKeys = ['paragraphs','productFormulations','emergencyNote','quickActions'];
        if (!allowedKeys.includes(key)) {
          delete (variant as Record<string, unknown>)[key];
        }
      });
    });
  }
});

// --- Add placeholder products for any missing fields in all symptom variants ---
Object.values(symptoms).forEach((symptom) => {
  if (symptom.variants && typeof symptom.variants === 'object') {
    Object.values(symptom.variants).forEach((variant) => {
      if (!variant.productFormulations) {
        variant.productFormulations = {};
      }
      if (Object.keys(variant.productFormulations).length === 0) {
        variant.productFormulations = {
          ExampleHerb: {
            name: 'Example Herb',
            description: 'Placeholder herb for demonstration purposes.',
            affiliateLink: '#',
            price: '$10-20'
          }
        };
      }
    });
  }
});

// --- Remove all non-Variant properties from every variant object ---
Object.values(symptoms).forEach((symptom) => {
  if (symptom.variants && typeof symptom.variants === 'object') {
    Object.values(symptom.variants).forEach((variant) => {
      Object.keys(variant).forEach((key) => {
        const allowedKeys = ['paragraphs','productFormulations','emergencyNote','quickActions'];
        if (!allowedKeys.includes(key)) {
          delete (variant as Record<string, unknown>)[key];
        }
      });
    });
  }
});

export default async function SymptomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const symptom = symptoms[slug as keyof typeof symptoms];

  if (!symptom) {
    return <div>Symptom not found.</div>;
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
            {symptom.name}
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
                Understanding {symptom.name}
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  {symptom.description} Understanding the underlying causes and symptoms can help you 
                  make informed decisions about natural support options.
                </p>
                <p className="text-gray-700 mb-4">
                  Natural approaches to {(symptom.name?.toLowerCase() ?? "")} often involve addressing root causes, 
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
                      .filter((solution: Product) => solution.type === 'herb')
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
                      .filter((solution: Product) => solution.type === 'supplement')
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
                        <span className="text-xs text-purple-700 bg-purple-100 rounded px-2 py-0.5">Affiliate: {Math.round((product.affiliateRevenue ?? 0) * 100)}%</span>
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