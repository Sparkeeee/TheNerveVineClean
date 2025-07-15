import { notFound } from 'next/navigation';

interface SymptomPageProps {
  params: Promise<{ slug: string }>;
}

type Product = {
  name: string;
  description: string;
  affiliateLink: string;
  price: string;
  image?: string;
  type?: string; // e.g., 'herb', 'supplement', 'tincture', etc.
  herbLink?: string; // Internal link to herb details, if available
  // Reminder: If you add new properties to product objects, add them here to avoid TypeScript errors
};

type Variant = {
  bestHerb?: Product;
  bestStandardized?: Product;
  topSupplements?: Product[];
};

type Symptom = {
  title: string;
  description: string;
  paragraphs?: string[];
  variants?: Record<string, Variant>;
  bestHerb?: Product;
  bestStandardized?: Product;
  topSupplements?: Product[];
  disclaimer?: string;
  symptoms?: string[];
  causes?: string[];
  naturalSolutions?: Product[];
  products?: Product[];
};

const symptoms: { [key: string]: Symptom } = {
  'insomnia': {
    title: 'Insomnia',
    description: 'Difficulty falling asleep, staying asleep, or waking too early. Chronic insomnia can impact mood, cognition, and overall health.',
    paragraphs: [
      "Insomnia is a common sleep disorder that can present as difficulty falling asleep (sleep onset), staying asleep (sleep maintenance), or waking up too early and being unable to return to sleep. It can lead to daytime fatigue, poor concentration, irritability, and a reduced quality of life. Chronic insomnia increases the risk of depression, anxiety, and cardiovascular disease.",
      "There are many potential causes of insomnia, including stress, anxiety, poor sleep habits, medical conditions, medications, caffeine or alcohol use, and environmental factors such as noise or light. Identifying and addressing the underlying cause is crucial for effective management.",
      "Non-pharmacological approaches are the foundation of insomnia management. These include practicing good sleep hygiene (consistent sleep schedule, limiting screen time before bed, creating a comfortable sleep environment), managing stress, and avoiding stimulants in the evening. Cognitive behavioral therapy for insomnia (CBT-I) is considered the gold standard for chronic cases.",
      "Natural remedies can be helpful for some people, especially when combined with lifestyle changes. Herbal medicines and supplements may support relaxation and sleep quality, but should be chosen carefully and used under the guidance of a healthcare professional."
    ],
    variants: {
      'Sleep Onset Insomnia': {
        bestHerb: {
          name: 'Valerian Root',
          description: 'Traditional sleep herb with modern clinical studies showing effectiveness for falling asleep faster. Valerian is best for those who struggle to fall asleep at bedtime.',
          affiliateLink: 'https://amzn.to/valerian-sleep',
          price: '$18-25'
        },
        bestStandardized: {
          name: 'Standardized Valerian Extract (0.8% Valerenic Acids)',
          description: 'Standardized valerian extract has been shown to reduce sleep latency and improve sleep quality. Look for products with clear standardization and third-party testing.',
          affiliateLink: 'https://amzn.to/valerian-extract',
          price: '$20-30'
        },
        topSupplements: [
          {
            name: 'Melatonin',
            description: 'Melatonin is the most researched sleep supplement. It helps regulate circadian rhythm and is especially effective for sleep onset insomnia and jet lag.',
            affiliateLink: 'https://amzn.to/melatonin-sleep',
            price: '$15-25'
          },
          {
            name: 'L-Theanine',
            description: 'A calming amino acid from green tea. L-Theanine promotes relaxation and can help reduce the time it takes to fall asleep without causing drowsiness.',
            affiliateLink: 'https://amzn.to/l-theanine-sleep',
            price: '$18-28'
          }
        ]
      },
      'Sleep Maintenance Insomnia': {
        bestHerb: {
          name: 'California Poppy',
          description: 'Traditional herb for sleep maintenance and reducing nighttime awakenings. California poppy is gentle and non-habit forming.',
          affiliateLink: 'https://amzn.to/california-poppy-sleep',
          price: '$16-24'
        },
        bestStandardized: {
          name: 'Standardized Passionflower Extract',
          description: 'Passionflower extract (standardized for flavonoids) has been shown to improve sleep quality and reduce nighttime awakenings, especially in people with stress-related insomnia.',
          affiliateLink: 'https://amzn.to/passionflower-sleep',
          price: '$15-25'
        },
        topSupplements: [
          {
            name: 'Magnesium Glycinate',
            description: 'Magnesium is essential for muscle relaxation and GABA support. Magnesium glycinate is gentle on the stomach and may improve sleep quality, especially in people with deficiency.',
            affiliateLink: 'https://amzn.to/magnesium-sleep',
            price: '$18-28'
          },
          {
            name: 'Glycine',
            description: 'An amino acid that supports deep sleep and reduces nighttime awakenings. Glycine is especially helpful for people who wake up frequently during the night.',
            affiliateLink: 'https://amzn.to/glycine-sleep',
            price: '$12-18'
          }
        ]
      }
    },
    disclaimer: "This information is for educational purposes only and should not be considered medical advice. The content provided is not intended to diagnose, treat, cure, or prevent any disease. Always consult a healthcare professional before starting any new supplement regimen."
  },
  'depression': {
    title: 'Depression',
    description: 'Persistent feelings of sadness and loss of interest',
    paragraphs: [
      "Depression is a common and serious mood disorder characterized by persistent feelings of sadness, hopelessness, and a loss of interest or pleasure in activities. It can affect how you feel, think, and handle daily activities such as sleeping, eating, or working. Depression can range from mild to severe and may be triggered by life events, chronic stress, medical conditions, or imbalances in brain chemistry.",
      "Symptoms of depression include changes in appetite or weight, sleep disturbances, fatigue, difficulty concentrating, feelings of worthlessness or guilt, and sometimes thoughts of self-harm. It is important to recognize that depression is a medical condition, not a sign of weakness, and effective treatments are available.",
      "Management of depression often involves a combination of approaches, including psychotherapy (such as cognitive behavioral therapy), lifestyle changes (regular exercise, social support, healthy diet), and, in some cases, medication. Addressing underlying causes such as nutrient deficiencies, chronic illness, or hormonal imbalances can also be important.",
      "Natural remedies and supplements may provide additional support for some individuals, especially when used alongside conventional treatments. Always consult a healthcare professional before starting any new supplement, especially if you are taking prescription medications or have a history of mental health conditions."
    ],
    bestHerb: {
      name: "St. John's Wort",
      description: "Traditional herb with extensive clinical research for mild to moderate depression. St. John's Wort may help improve mood and emotional balance, but can interact with many medications.",
      affiliateLink: 'https://amzn.to/st-johns-wort-depression',
      price: '$20-30'
    },
    bestStandardized: {
      name: "Standardized St. John's Wort Extract (0.3% Hypericin)",
      description: "Standardized extracts of St. John's Wort (0.3% hypericin) have been shown to be effective for mild to moderate depression in clinical trials. Always check for drug interactions before use.",
      affiliateLink: 'https://amzn.to/st-johns-wort-extract',
      price: '$22-32'
    },
    topSupplements: [
      {
        name: 'Omega-3 EPA/DHA',
        description: 'Essential anti-inflammatory fats. EPA specifically supports mood regulation. 2-3g daily EPA/DHA shows significant benefits for depression in multiple studies.',
        affiliateLink: 'https://amzn.to/omega3-depression',
        price: '$25-40'
      },
      {
        name: 'Vitamin D3',
        description: 'Vitamin D deficiency is strongly linked to depression and seasonal affective disorder. Supplementation may improve mood, especially in those who are deficient.',
        affiliateLink: 'https://amzn.to/vitamin-d-depression',
        price: '$15-25'
      }
    ],
    disclaimer: "This information is for educational purposes only and should not be considered medical advice. The content provided is not intended to diagnose, treat, cure, or prevent any disease. Always consult a healthcare professional before starting any new supplement regimen, especially if you are taking prescription medications or have a history of mental health conditions."
  },
  'anxiety': {
    title: 'Anxiety',
    description: 'Excessive worry and nervousness',
    paragraphs: [
      "Anxiety is a common emotional state characterized by excessive worry, nervousness, or fear that can interfere with daily life. While occasional anxiety is a normal response to stress, chronic or severe anxiety can become debilitating and may be associated with conditions such as generalized anxiety disorder, panic disorder, or social anxiety disorder.",
      "Symptoms of anxiety include restlessness, muscle tension, difficulty concentrating, irritability, sleep disturbances, and physical symptoms such as rapid heartbeat or stomach upset. Anxiety can be triggered by stressful life events, trauma, medical conditions, or imbalances in brain chemistry.",
      "Effective management of anxiety often involves a combination of approaches, including cognitive behavioral therapy (CBT), mindfulness practices, regular exercise, and healthy sleep habits. Reducing caffeine and alcohol intake, building social support, and addressing underlying medical issues are also important.",
      "Natural remedies and supplements may provide additional support for some individuals. Herbal medicines and nutrients can help promote relaxation and support the body’s stress response, but should be used with caution and under the guidance of a healthcare professional, especially if you are taking prescription medications."
    ],
    bestHerb: {
      name: 'Passionflower',
      description: 'Traditional nervine herb that enhances GABA activity naturally. Passionflower is used for anxiety, restlessness, and sleep disturbances, and is generally well-tolerated.',
      affiliateLink: 'https://amzn.to/passionflower-anxiety',
      price: '$15-25'
    },
    bestStandardized: {
      name: 'Standardized Ashwagandha Extract',
      description: 'Ashwagandha is an adaptogenic herb with multiple clinical trials showing significant reductions in anxiety and stress. Look for standardized extracts (e.g., KSM-66 or Sensoril) for best results.',
      affiliateLink: 'https://amzn.to/ashwagandha-anxiety',
      price: '$20-35'
    },
    topSupplements: [
      {
        name: 'L-Theanine',
        description: 'A calming amino acid found in green tea. L-Theanine promotes relaxation without drowsiness and is clinically proven to reduce anxiety and promote calm focus.',
        affiliateLink: 'https://amzn.to/l-theanine-anxiety',
        price: '$25-35'
      },
      {
        name: 'Magnesium Glycinate',
        description: 'Magnesium is essential for nervous system function. Magnesium glycinate is gentle on the stomach and may help reduce anxiety and improve sleep quality.',
        affiliateLink: 'https://amzn.to/magnesium-glycinate',
        price: '$18-28'
      }
    ],
    disclaimer: "This information is for educational purposes only and should not be considered medical advice. The content provided is not intended to diagnose, treat, cure, or prevent any disease. Always consult a healthcare professional before starting any new supplement regimen, especially if you are taking prescription medications or have a history of mental health conditions."
  },
  'poor-focus': {
    title: 'Poor Focus',
    description: 'Difficulty with mental clarity, concentration, or memory. Includes both brain fog and poor memory.',
    paragraphs: [
      "Poor focus is a common complaint that can manifest as mental cloudiness (brain fog), forgetfulness, or difficulty concentrating. It can affect productivity, learning, and quality of life. While occasional lapses are normal, persistent issues may signal underlying health or lifestyle factors.",
      "Brain fog is characterized by a sense of mental cloudiness, slow thinking, and lack of clarity. It is often associated with fatigue, stress, inflammation, or hormonal changes. Poor memory, on the other hand, refers to difficulty recalling information, learning new things, or keeping track of details. Both can overlap and share similar causes.",
      "Common contributors to poor focus include sleep deprivation, chronic stress, nutritional deficiencies (such as B vitamins, omega-3s), blood sugar imbalances, and certain medications. Addressing these root causes is essential for lasting improvement.",
      "Natural remedies, including specific herbs and supplements, can support cognitive function, mental clarity, and memory. These should be used alongside healthy lifestyle habits and under the guidance of a healthcare professional, especially if symptoms are severe or worsening."
    ],
    variants: {
      'Brain Fog': {
        bestHerb: {
          name: 'Rhodiola rosea',
          description: 'Adaptogenic herb shown to reduce mental fatigue and improve clarity, especially under stress. Rhodiola is best for brain fog related to exhaustion or burnout.',
          affiliateLink: 'https://amzn.to/rhodiola-brainfog',
          price: '$18-28'
        },
        bestStandardized: {
          name: 'Standardized Lion’s Mane Extract',
          description: 'Lion’s Mane mushroom extract (standardized for hericenones/erinacines) supports neurogenesis and cognitive clarity. Clinical studies show benefits for mental fog and mild cognitive impairment.',
          affiliateLink: 'https://amzn.to/lions-mane-brainfog',
          price: '$22-38'
        },
        topSupplements: [
          {
            name: 'Phosphatidylserine',
            description: 'A phospholipid that supports brain cell membranes and stress resilience. Shown to improve attention and reduce mental fatigue.',
            affiliateLink: 'https://amzn.to/phosphatidylserine-brainfog',
            price: '$30-45'
          },
          {
            name: 'Omega-3 EPA/DHA',
            description: 'Essential fatty acids for brain health. EPA/DHA support cognitive clarity and reduce inflammation, which can contribute to brain fog.',
            affiliateLink: 'https://amzn.to/omega3-brainfog',
            price: '$25-40'
          }
        ]
      },
      'Poor Memory': {
        bestHerb: {
          name: 'Bacopa monnieri',
          description: 'Traditional nootropic herb with strong evidence for memory enhancement. Bacopa improves recall, learning, and information processing, especially with long-term use.',
          affiliateLink: 'https://amzn.to/bacopa-memory',
          price: '$20-35'
        },
        bestStandardized: {
          name: 'Standardized Ginkgo Biloba Extract',
          description: 'Ginkgo biloba extract (standardized to 24% flavone glycosides and 6% terpene lactones) is widely used to support memory and cognitive function, especially in older adults.',
          affiliateLink: 'https://amzn.to/ginkgo-memory',
          price: '$18-30'
        },
        topSupplements: [
          {
            name: 'Alpha-GPC',
            description: 'A bioavailable choline source essential for acetylcholine production and memory. Alpha-GPC may improve memory, focus, and cognitive performance.',
            affiliateLink: 'https://amzn.to/alpha-gpc-memory',
            price: '$25-40'
          },
          {
            name: 'Magnesium L-Threonate',
            description: 'A form of magnesium shown to cross the blood-brain barrier and support memory and synaptic plasticity.',
            affiliateLink: 'https://amzn.to/magnesium-threonate-memory',
            price: '$30-50'
          }
        ]
      }
    },
    disclaimer: "This information is for educational purposes only and should not be considered medical advice. The content provided is not intended to diagnose, treat, cure, or prevent any disease. Always consult a healthcare professional before starting any new supplement regimen, especially if you have a medical condition or take prescription medications."
  },
  'muscle-tension': {
    title: 'Muscle Tension / Tension Headaches',
    description: 'Muscle tightness, tension, or headaches related to stress, posture, or overuse.',
    paragraphs: [
      "Muscle tension and tension headaches are among the most common complaints in modern life. They often result from chronic stress, poor posture, overuse, or jaw clenching, and can lead to pain in the head, neck, shoulders, or jaw. Tension headaches are typically described as a band-like pressure or tightness around the head, while muscle tension may present as soreness, stiffness, or difficulty relaxing.",
      "Triggers for tension headaches and muscle tension include emotional stress, long hours at a desk, inadequate ergonomics, dehydration, and sleep disturbances. Addressing these root causes is essential for lasting relief.",
      "Non-pharmacological approaches such as regular movement, stretching, ergonomic adjustments, stress management, and adequate hydration form the foundation of prevention and treatment. Mind-body practices like yoga, meditation, and massage can also be highly beneficial.",
      "Natural remedies, including specific herbs and supplements, can support muscle relaxation, reduce pain, and promote nervous system balance. These should be used alongside healthy lifestyle habits and under the guidance of a healthcare professional, especially if symptoms are severe or persistent."
    ],
    variants: {
      'Tension Headaches': {
        bestHerb: {
          name: 'Skullcap (Scutellaria lateriflora)',
          description: 'Traditional nervine herb used for tension headaches and nervous system relaxation. Skullcap is especially helpful for stress-related headaches and muscle tightness in the head and neck.',
          affiliateLink: 'https://amzn.to/skullcap-tension-headache',
          price: '$15-25'
        },
        bestStandardized: {
          name: 'Standardized Feverfew Extract',
          description: 'Feverfew extract (standardized for parthenolide) has clinical evidence for reducing the frequency and severity of tension and migraine headaches.',
          affiliateLink: 'https://amzn.to/feverfew-tension-headache',
          price: '$14-22'
        },
        topSupplements: [
          {
            name: 'Magnesium Glycinate',
            description: 'Magnesium is essential for muscle and nerve relaxation. Magnesium glycinate is gentle on the stomach and may reduce headache frequency and severity.',
            affiliateLink: 'https://amzn.to/magnesium-tension-headache',
            price: '$18-28'
          },
          {
            name: 'Riboflavin (Vitamin B2)',
            description: 'Riboflavin has been shown to reduce headache frequency in clinical studies, especially when combined with magnesium.',
            affiliateLink: 'https://amzn.to/riboflavin-tension-headache',
            price: '$8-15'
          }
        ]
      },
      'Muscle Tension (Jaw/Neck/Shoulders)': {
        bestHerb: {
          name: 'Cramp Bark (Viburnum opulus)',
          description: 'Traditional skeletal muscle relaxant and nerve relaxant. Cramp bark is used for pain, pinched nerves, muscle cramps, and tension in the jaw, neck, and shoulders.',
          affiliateLink: 'https://amzn.to/cramp-bark-muscle-tension',
          price: '$14-22'
        },
        bestStandardized: {
          name: 'Standardized Lavender Oil Capsules',
          description: 'Lavender oil (standardized for linalool and linalyl acetate) has evidence for reducing muscle tension, anxiety, and pain. Oral capsules are used for systemic relaxation.',
          affiliateLink: 'https://amzn.to/lavender-muscle-tension',
          price: '$12-20'
        },
        topSupplements: [
          {
            name: 'Magnesium Malate',
            description: 'A highly bioavailable form of magnesium that supports muscle relaxation and energy production. Especially helpful for chronic muscle tightness.',
            affiliateLink: 'https://amzn.to/magnesium-malate-muscle-tension',
            price: '$18-28'
          },
          {
            name: 'CBD Softgels',
            description: 'CBD (cannabidiol) is used for muscle relaxation, pain relief, and nervous system balance. Choose a reputable, third-party tested brand.',
            affiliateLink: 'https://amzn.to/cbd-muscle-tension',
            price: '$30-50'
          }
        ]
      }
    },
    disclaimer: "This information is for educational purposes only and should not be considered medical advice. The content provided is not intended to diagnose, treat, cure, or prevent any disease. Always consult a healthcare professional before starting any new supplement regimen, especially if you have a medical condition or take prescription medications."
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
        name: 'Lavender',
        description: 'Calming herb that may help with muscle relaxation',
        affiliateLink: 'https://amzn.to/example-lavender',
        price: '$12-20'
      },
      {
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
        name: 'CoQ10',
        description: 'Supports heart muscle energy and function',
        affiliateLink: 'https://amzn.to/example-coq10',
        price: '$20-35'
      },
      {
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
    paragraphs: [
      "The liver can struggle for many reasons—not just from self-inflicted causes like alcohol or chemical use, but also due to genetics, chronic illness, medications, infections, or nutrient deficiencies. When the liver is not functioning optimally, it cannot effectively clear hormones and metabolic byproducts from the bloodstream. This impaired clearance can disrupt healthy hormonal feedback loops and rhythms, leading to hormonal imbalances that may profoundly affect mood, focus, energy, and general wellbeing. Supporting liver health is therefore essential not only for detoxification, but also for maintaining balanced hormone signaling and overall vitality.",
      "Common symptoms of liver dysfunction include fatigue, digestive issues, skin problems, and brain fog. These symptoms can be subtle at first but may worsen over time if the underlying liver stress is not addressed. It's important to note that these symptoms can also be caused by other conditions, so proper medical evaluation is essential.",
      "The liver plays a crucial role in detoxifying harmful substances, processing nutrients, and regulating metabolism. When liver function is compromised, it can affect multiple body systems and contribute to a wide range of health issues. Supporting liver health through lifestyle changes and targeted supplements can help restore optimal function.",
      "Natural approaches to liver support include reducing toxin exposure, maintaining a healthy diet rich in antioxidants, staying hydrated, and using specific herbs and supplements that support liver function. Always consult with a healthcare professional before starting any new supplement regimen, especially if you have existing liver conditions."
    ],
    causes: [
      'Toxin exposure',
      'Poor diet',
      'Alcohol use',
      'Medications'
    ],
    naturalSolutions: [
      {
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
        name: 'Peppermint Oil',
        description: 'Traditionally used for IBS symptom relief',
        affiliateLink: 'https://amzn.to/example-peppermint',
        price: '$10-18'
      }
    ]
  },
  'migraine': {
    title: "Migraine",
    description: "Severe recurring headaches often accompanied by nausea, sensitivity to light and sound, and visual disturbances.",
    paragraphs: [
      "Migraines are intense, often debilitating headaches that can last from hours to days. They are frequently accompanied by symptoms such as nausea, vomiting, and sensitivity to light and sound. Migraines are more than just headaches—they are complex neurological events involving changes in brain chemistry, blood vessel dilation, and inflammation. The pain can be throbbing or pulsating and is often located on one side of the head, but can affect both sides.",
      "There are several types of migraines, including those with aura (visual or sensory disturbances before the headache) and those without. While the presence of aura can help with diagnosis and early intervention, the core treatment strategies are the same for both types. Triggers can include hormonal changes, stress, certain foods (such as aged cheese, chocolate, or processed meats), dehydration, and sleep disturbances. Keeping a migraine diary can help identify personal triggers and patterns.",
      "Management of migraines often involves identifying and avoiding triggers, as well as using targeted herbal and nutritional support. Some individuals may respond better to certain treatments depending on the type of migraine they experience. Non-pharmacological approaches such as stress management, regular sleep, hydration, and dietary adjustments are foundational.",
      "For best results, a combination of lifestyle changes, herbal remedies, and supplements is often recommended. Always consult a healthcare provider for persistent or severe symptoms. Early intervention at the first sign of a migraine can sometimes prevent progression to a full-blown attack."
    ],
    variants: {
      "Migraine": {
        bestHerb: {
          name: "Feverfew",
          description: "Traditional herb used for migraine prevention and relief. Feverfew may help reduce the frequency and severity of migraine attacks, especially when taken regularly.",
          affiliateLink: "https://amzn.to/example-feverfew",
          price: "$12-20"
        },
        bestStandardized: {
          name: "PA-free Butterbur",
          description: "Standardized extract with pyrrolizidine alkaloids removed. Butterbur has been shown in clinical studies to reduce migraine frequency and is considered one of the best-researched herbal options.",
          affiliateLink: "https://amzn.to/example-butterbur",
          price: "$15-25"
        },
        topSupplements: [
          {
            name: "Magnesium (Citrate or Glycinate)",
            description: "Magnesium deficiency is common in migraine sufferers. Supplementation can reduce frequency and severity, and is especially helpful for menstrual migraines.",
            affiliateLink: "https://amzn.to/example-magnesium",
            price: "$10-18"
          },
          {
            name: "Riboflavin (Vitamin B2)",
            description: "High-dose riboflavin has been shown to reduce migraine frequency and duration. It is safe, well-tolerated, and can be used long-term.",
            affiliateLink: "https://amzn.to/example-b2",
            price: "$8-15"
          }
        ]
      },
      "Gastric Migraine": {
        bestHerb: {
          name: "Ginger",
          description: "Traditional herb for nausea and digestive upset, often used in gastric migraine to reduce both headache and stomach symptoms. Ginger can be taken as tea, capsules, or chews.",
          affiliateLink: "https://amzn.to/example-ginger",
          price: "$10-16"
        },
        bestStandardized: {
          name: "PA-free Butterbur",
          description: "Standardized extract with pyrrolizidine alkaloids removed. May help reduce both headache and digestive symptoms in gastric migraine.",
          affiliateLink: "https://amzn.to/example-butterbur",
          price: "$15-25"
        },
        topSupplements: [
          {
            name: "Magnesium (Citrate or Glycinate)",
            description: "Magnesium can help reduce migraine frequency and is gentle on the stomach in these forms.",
            affiliateLink: "https://amzn.to/example-magnesium",
            price: "$10-18"
          },
          {
            name: "Vitamin B6 (Pyridoxine)",
            description: "Supports neurotransmitter balance and may help with nausea in gastric migraine. Vitamin B6 is often used in combination with magnesium for best results.",
            affiliateLink: "https://amzn.to/example-b6",
            price: "$8-14"
          }
        ]
      }
    },
    disclaimer: "This information is for educational purposes only and should not be considered medical advice. The content provided is not intended to diagnose, treat, cure, or prevent any disease. Always consult with a healthcare professional before starting any new supplement regimen."
  },
  'fatigue': {
    title: 'Fatigue',
    description: 'Persistent tiredness, low energy, or exhaustion that is not relieved by rest.',
    paragraphs: [
      "Fatigue is a common complaint that can have many causes, including stress, poor sleep, nutrient deficiencies, chronic illness, and hormonal imbalances. It can affect your ability to function at work, at home, and in social situations.",
      "Addressing fatigue requires a holistic approach: improving sleep quality, managing stress, optimizing nutrition, and supporting underlying health conditions. Herbal and nutritional supplements can provide targeted support for energy, resilience, and recovery.",
      "If fatigue is severe, persistent, or accompanied by other symptoms (such as weight loss, fever, or pain), consult a healthcare professional to rule out underlying medical conditions.",
      "The following recommendations are evidence-based and focus on restoring healthy energy levels and resilience to stress."
    ],
    bestHerb: {
      name: 'Rhodiola rosea',
      description: 'Adaptogenic herb shown to improve energy, stamina, and resilience to stress. Rhodiola is especially helpful for fatigue related to burnout or chronic stress.',
      affiliateLink: 'https://amzn.to/rhodiola-fatigue',
      price: '$18-28'
    },
    bestStandardized: {
      name: 'Standardized Panax Ginseng Extract',
      description: 'Panax ginseng (standardized for ginsenosides) is a classic energy tonic with clinical evidence for reducing fatigue and improving mental and physical performance.',
      affiliateLink: 'https://amzn.to/panax-ginseng-fatigue',
      price: '$22-38'
    },
    topSupplements: [
      {
        name: 'CoQ10',
        description: 'Supports cellular energy production and is especially helpful for fatigue related to statin use or mitochondrial dysfunction.',
        affiliateLink: 'https://amzn.to/coq10-fatigue',
        price: '$20-35'
      },
      {
        name: 'Vitamin B12 (Methylcobalamin)',
        description: 'Essential for red blood cell production and energy. B12 deficiency is a common, reversible cause of fatigue.',
        affiliateLink: 'https://amzn.to/b12-fatigue',
        price: '$12-20'
      }
    ],
    disclaimer: "This information is for educational purposes only and should not be considered medical advice. The content provided is not intended to diagnose, treat, cure, or prevent any disease. Always consult a healthcare professional before starting any new supplement regimen."
  },
  'mood-swings': {
    title: 'Mood Swings',
    description: 'Rapid or unpredictable changes in mood, energy, or emotional state.',
    paragraphs: [
      "Mood swings can be caused by hormonal fluctuations, stress, sleep disturbances, blood sugar imbalances, or underlying mental health conditions. They can affect relationships, work, and overall quality of life.",
      "Stabilizing mood involves supporting healthy brain chemistry, hormone balance, and stress resilience. Lifestyle changes, therapy, and targeted supplements can all play a role.",
      "If mood swings are severe, persistent, or associated with thoughts of self-harm, seek professional help immediately.",
      "The following recommendations are designed to support emotional balance and resilience to stress."
    ],
    bestHerb: {
      name: "St. John's Wort",
      description: "Traditional herb with clinical evidence for supporting mood stability and emotional balance. May interact with medications—consult your doctor before use.",
      affiliateLink: 'https://amzn.to/st-johns-wort-mood',
      price: '$20-30'
    },
    bestStandardized: {
      name: 'Standardized Saffron Extract',
      description: 'Saffron extract (standardized for crocin and safranal) has been shown in clinical trials to improve mood and reduce symptoms of mild to moderate depression and mood swings.',
      affiliateLink: 'https://amzn.to/saffron-mood',
      price: '$24-40'
    },
    topSupplements: [
      {
        name: 'Omega-3 EPA/DHA',
        description: 'Essential fatty acids for brain health and mood stability. EPA in particular is linked to improved emotional balance.',
        affiliateLink: 'https://amzn.to/omega3-mood',
        price: '$25-40'
      },
      {
        name: 'Magnesium Glycinate',
        description: 'Supports nervous system balance and may help reduce mood swings, irritability, and anxiety.',
        affiliateLink: 'https://amzn.to/magnesium-mood',
        price: '$18-28'
      }
    ],
    disclaimer: "This information is for educational purposes only and should not be considered medical advice. The content provided is not intended to diagnose, treat, cure, or prevent any disease. Always consult a healthcare professional before starting any new supplement regimen."
  }
};

export default async function SymptomPage({ params }: SymptomPageProps) {
  const { slug } = await params;
  const symptom = symptoms[slug as keyof typeof symptoms] as Symptom;

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

        {/* Symptom Info Paragraphs */}
        {symptom.paragraphs && Array.isArray(symptom.paragraphs) && (
          <div className="mb-8 space-y-4">
            {symptom.paragraphs.map((para, idx) => (
              <p key={idx} className="text-gray-700 text-base">{para}</p>
            ))}
          </div>
        )}

        {/* Variant Recommendations */}
        {symptom.variants ? (
          <div className="space-y-10">
            {Object.entries(symptom.variants).map(([variant, data]) => (
              <div key={variant} className="bg-white rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-semibold text-blue-800 mb-4">{variant}</h2>
                <div className="mb-4">
                  <h3 className="font-semibold text-blue-700">Best Traditional Herb</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-900 font-medium">{data.bestHerb?.name}</span>
                    <span className="text-green-600 font-medium">{data.bestHerb?.price}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{data.bestHerb?.description}</p>
                  <a href={data.bestHerb?.affiliateLink} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">View Product &rarr;</a>
                </div>
                <div className="mb-4">
                  <h3 className="font-semibold text-blue-700">Best Standardized Extract</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-900 font-medium">{data.bestStandardized?.name}</span>
                    <span className="text-green-600 font-medium">{data.bestStandardized?.price}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{data.bestStandardized?.description}</p>
                  <a href={data.bestStandardized?.affiliateLink} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">View Product &rarr;</a>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Top Non-Herbal Supplements</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {data.topSupplements?.map((supp, idx) => (
                      <div key={idx} className="border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-blue-900 font-medium">{supp.name}</span>
                          <span className="text-green-600 font-medium">{supp.price}</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{supp.description}</p>
                        <a href={supp.affiliateLink} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">View Product &rarr;</a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Featured Treatments for Non-Variant Symptoms */}
            {symptom.bestHerb && (
              <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
                <h2 className="text-2xl font-semibold text-blue-800 mb-4">Best Traditional Herb</h2>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-900 font-medium">{symptom.bestHerb.name}</span>
                  <span className="text-green-600 font-medium">{symptom.bestHerb.price}</span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{symptom.bestHerb.description}</p>
                <a href={symptom.bestHerb.affiliateLink} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">View Product &rarr;</a>
              </div>
            )}
            {symptom.bestStandardized && (
              <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
                <h2 className="text-2xl font-semibold text-blue-800 mb-4">Best Standardized Extract</h2>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-900 font-medium">{symptom.bestStandardized.name}</span>
                  <span className="text-green-600 font-medium">{symptom.bestStandardized.price}</span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{symptom.bestStandardized.description}</p>
                <a href={symptom.bestStandardized.affiliateLink} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">View Product &rarr;</a>
              </div>
            )}
            {symptom.topSupplements && (
              <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
                <h2 className="text-2xl font-semibold text-blue-800 mb-4">Top Non-Herbal Supplements</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {symptom.topSupplements.map((supp, idx) => (
                    <div key={idx} className="border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-blue-900 font-medium">{supp.name}</span>
                        <span className="text-green-600 font-medium">{supp.price}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{supp.description}</p>
                      <a href={supp.affiliateLink} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">View Product &rarr;</a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

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
              <strong>Disclaimer:</strong> {symptom.disclaimer || "This information is for educational purposes only and should not be considered medical advice. The content provided is not intended to diagnose, treat, cure, or prevent any disease. Herbal supplements are not regulated by the FDA and may not be suitable for everyone. Always consult with a healthcare professional before starting any new supplement regimen, especially if you have underlying health conditions, are taking medications, or are pregnant/nursing."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 