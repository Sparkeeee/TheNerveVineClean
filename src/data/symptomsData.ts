import { Symptom } from '../types/symptom';

// Extract the symptoms object from the page file
// This is a copy of the symptoms object from src/app/symptoms/[slug]/page.tsx
export const symptoms: Record<string, Symptom> = {
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
    relatedSymptoms: [
      { name: 'Anxiety', href: '/symptoms/anxiety', color: 'purple' },
      { name: 'Depression', href: '/symptoms/depression', color: 'blue' },
      { name: 'Fatigue', href: '/symptoms/fatigue', color: 'green' },
    ],
  },
  'depression': {
    name: 'Depression',
    title: 'Depression',
    description: 'Persistent feelings of sadness, hopelessness, and loss of interest in activities.',
    relatedSymptoms: [
      { name: 'Anxiety', href: '/symptoms/anxiety', color: 'purple' },
      { name: 'Insomnia', href: '/symptoms/insomnia', color: 'blue' },
      { name: 'Fatigue', href: '/symptoms/fatigue', color: 'green' },
    ],
  },
  'anxiety': {
    name: 'Anxiety',
    title: 'Anxiety',
    description: 'Excessive worry, nervousness, and physical symptoms of stress.',
    relatedSymptoms: [
      { name: 'Insomnia', href: '/symptoms/insomnia', color: 'purple' },
      { name: 'Depression', href: '/symptoms/depression', color: 'blue' },
      { name: 'Stress', href: '/symptoms/stress', color: 'green' },
    ],
  },
  'poor-focus': {
    name: 'Poor Focus',
    title: 'Poor Focus',
    description: 'Difficulty concentrating, maintaining attention, or staying focused on tasks.',
    relatedSymptoms: [
      { name: 'Anxiety', href: '/symptoms/anxiety', color: 'purple' },
      { name: 'Fatigue', href: '/symptoms/fatigue', color: 'blue' },
      { name: 'Stress', href: '/symptoms/stress', color: 'green' },
    ],
  },
  'neck-tension': {
    name: 'Neck Tension',
    title: 'Neck Tension',
    description: 'Muscle tightness, pain, or stiffness in the neck and upper shoulders.',
    variants: {
      'Default': {
        paragraphs: [
          "Neck tension is a common issue that can be caused by stress, poor posture, or muscle strain.",
          "Gentle stretching and stress management techniques can help relieve tension."
        ],
        productFormulations: {
          "Magnesium": {
            name: 'Magnesium Glycinate',
            description: 'Essential mineral for muscle relaxation and tension relief.',
            affiliateLink: 'https://amzn.to/magnesium-tension',
            price: '$18-28'
          },
          "Valerian": {
            name: 'Valerian Root',
            description: 'Natural muscle relaxant and stress reliever.',
            affiliateLink: 'https://amzn.to/valerian-tension',
            price: '$15-25'
          }
        },
      },
      'Muscle Tension': {
        paragraphs: [
          "Muscle tension in the neck and shoulders is often related to stress and poor posture.",
          "Regular stretching and stress management can help prevent and relieve tension."
        ],
        productFormulations: {
          "Magnesium": {
            name: 'Magnesium Glycinate',
            description: 'Essential mineral for muscle relaxation and tension relief.',
            affiliateLink: 'https://amzn.to/magnesium-tension',
            price: '$18-28'
          },
          "Lavender": {
            name: 'Lavender Essential Oil',
            description: 'Natural muscle relaxant and stress reliever.',
            affiliateLink: 'https://amzn.to/lavender-tension',
            price: '$12-20'
          }
        },
      },
      'Tension Headaches': {
        paragraphs: [
          "Tension headaches are often caused by muscle tension in the neck and shoulders.",
          "Stress management and muscle relaxation techniques can help prevent and relieve tension headaches."
        ],
        productFormulations: {
          "Peppermint": {
            name: 'Peppermint Essential Oil',
            description: 'Natural headache relief and muscle relaxant.',
            affiliateLink: 'https://amzn.to/peppermint-headache',
            price: '$10-18'
          },
          "Magnesium": {
            name: 'Magnesium Glycinate',
            description: 'Essential mineral for muscle relaxation and tension relief.',
            affiliateLink: 'https://amzn.to/magnesium-tension',
            price: '$18-28'
          }
        },
      }
    },
    relatedSymptoms: [
      { name: 'Stress', href: '/symptoms/stress', color: 'blue' },
      { name: 'Fatigue', href: '/symptoms/fatigue', color: 'green' },
      { name: 'Migraine', href: '/symptoms/migraine', color: 'purple' },
    ],
  },
  'burnout': {
    name: 'Emotional Burnout',
    title: 'Emotional Burnout',
    description: 'Chronic stress and emotional exhaustion affecting mood, energy, and motivation.',
    relatedSymptoms: [
      { name: 'Fatigue', href: '/symptoms/fatigue', color: 'blue' },
      { name: 'Depression', href: '/symptoms/depression', color: 'green' },
      { name: 'Stress', href: '/symptoms/stress', color: 'purple' },
    ],
  },
  'thyroid-issues': {
    name: 'Thyroid Issues',
    title: 'Thyroid Issues',
    description: 'Understanding and supporting thyroid function for energy and metabolism.',
    relatedSymptoms: [
      { name: 'Fatigue', href: '/symptoms/fatigue', color: 'blue' },
      { name: 'Mood Swings', href: '/symptoms/mood-swings', color: 'green' },
      { name: 'Stress', href: '/symptoms/stress', color: 'purple' },
    ],
  },
  'blood-pressure': {
    name: 'Blood Pressure Balance',
    title: 'Blood Pressure Balance',
    description: 'Support for healthy blood pressure levels.',
    relatedSymptoms: [
      { name: 'Stress', href: '/symptoms/stress', color: 'blue' },
      { name: 'Heart Support', href: '/symptoms/heart-support', color: 'green' },
    ],
  },
  'heart-support': {
    name: 'Heart Muscle Support',
    title: 'Heart Muscle Support',
    description: 'Support for heart muscle function and cardiovascular health.',
    relatedSymptoms: [
      { name: 'Blood Pressure', href: '/symptoms/blood-pressure', color: 'blue' },
      { name: 'Stress', href: '/symptoms/stress', color: 'green' },
    ],
  },
  'liver-detox': {
    name: 'Liver Function Support',
    title: 'Liver Function Support',
    description: 'Support for liver detoxification and function.',
    relatedSymptoms: [
      { name: 'Fatigue', href: '/symptoms/fatigue', color: 'blue' },
      { name: 'Digestive Health', href: '/symptoms/digestive-health', color: 'green' },
    ],
  },
  'hormonal-imbalances': {
    name: 'Hormonal Imbalances',
    title: 'Hormonal Imbalances',
    description: 'Disruptions in hormone levels affecting health and wellbeing.',
    relatedSymptoms: [
      { name: 'Mood Swings', href: '/symptoms/mood-swings', color: 'blue' },
      { name: 'Fatigue', href: '/symptoms/fatigue', color: 'green' },
      { name: 'Stress', href: '/symptoms/stress', color: 'purple' },
    ],
  },
  'adrenal-overload': {
    name: 'Adrenal Overload',
    title: 'Adrenal Overload',
    description: 'Symptoms of excess stress and adrenal hormone output.',
    relatedSymptoms: [
      { name: 'Stress', href: '/symptoms/stress', color: 'blue' },
      { name: 'Fatigue', href: '/symptoms/fatigue', color: 'green' },
      { name: 'Burnout', href: '/symptoms/burnout', color: 'purple' },
    ],
  },
  'adrenal-exhaustion': {
    name: 'Adrenal Exhaustion',
    title: 'Adrenal Exhaustion',
    description: 'Symptoms of depleted adrenal function from chronic stress.',
    relatedSymptoms: [
      { name: 'Fatigue', href: '/symptoms/fatigue', color: 'blue' },
      { name: 'Burnout', href: '/symptoms/burnout', color: 'green' },
      { name: 'Stress', href: '/symptoms/stress', color: 'purple' },
    ],
  },
  'circadian-support': {
    name: 'Circadian Support',
    title: 'Circadian Support',
    description: 'Support for healthy sleep-wake cycles and circadian rhythm.',
    relatedSymptoms: [
      { name: 'Insomnia', href: '/symptoms/insomnia', color: 'blue' },
      { name: 'Fatigue', href: '/symptoms/fatigue', color: 'green' },
      { name: 'Stress', href: '/symptoms/stress', color: 'purple' },
    ],
  },
  'vagus-nerve': {
    name: 'Vagus Nerve Support',
    title: 'Vagus Nerve Support',
    description: 'Understanding and supporting your body\'s most important nerve for overall health and well-being.',
    relatedSymptoms: [
      { name: 'Stress', href: '/symptoms/stress', color: 'blue' },
      { name: 'Anxiety', href: '/symptoms/anxiety', color: 'green' },
      { name: 'Digestive Health', href: '/symptoms/digestive-health', color: 'purple' },
    ],
  },
  'dysbiosis': {
    name: 'Dysbiosis',
    title: 'Dysbiosis',
    description: 'Imbalance of gut bacteria affecting health.',
    relatedSymptoms: [
      { name: 'Digestive Health', href: '/symptoms/digestive-health', color: 'blue' },
      { name: 'Leaky Gut', href: '/symptoms/leaky-gut', color: 'green' },
      { name: 'IBS', href: '/symptoms/ibs', color: 'purple' },
    ],
  },
  'leaky-gut': {
    name: 'Leaky Gut',
    title: 'Leaky Gut',
    description: 'Understanding the connection between gut health and brain function.',
    relatedSymptoms: [
      { name: 'Digestive Health', href: '/symptoms/digestive-health', color: 'blue' },
      { name: 'Dysbiosis', href: '/symptoms/dysbiosis', color: 'green' },
      { name: 'IBS', href: '/symptoms/ibs', color: 'purple' },
    ],
  },
  'ibs': {
    name: 'IBS',
    title: 'IBS',
    description: 'Digestive disorder with abdominal pain and changes in bowel habits.',
    relatedSymptoms: [
      { name: 'Digestive Health', href: '/symptoms/digestive-health', color: 'blue' },
      { name: 'Dysbiosis', href: '/symptoms/dysbiosis', color: 'green' },
      { name: 'Leaky Gut', href: '/symptoms/leaky-gut', color: 'purple' },
    ],
  },
  'stress': {
    name: 'Stress',
    title: 'Stress',
    description: 'Physical and emotional responses to challenging or demanding situations.',
    relatedSymptoms: [
      { name: 'Anxiety', href: '/symptoms/anxiety', color: 'blue' },
      { name: 'Fatigue', href: '/symptoms/fatigue', color: 'green' },
      { name: 'Burnout', href: '/symptoms/burnout', color: 'purple' },
    ],
  },
  'fatigue': {
    name: 'Fatigue',
    title: 'Fatigue',
    description: 'Persistent tiredness and lack of energy.',
    relatedSymptoms: [
      { name: 'Stress', href: '/symptoms/stress', color: 'blue' },
      { name: 'Burnout', href: '/symptoms/burnout', color: 'green' },
      { name: 'Thyroid Issues', href: '/symptoms/thyroid-issues', color: 'purple' },
    ],
  },
  'mood-swings': {
    name: 'Mood Swings',
    title: 'Mood Swings',
    description: 'Rapid or unpredictable changes in mood, energy, or emotional state.',
    relatedSymptoms: [
      { name: 'Stress', href: '/symptoms/stress', color: 'blue' },
      { name: 'Anxiety', href: '/symptoms/anxiety', color: 'green' },
      { name: 'Hormonal Imbalances', href: '/symptoms/hormonal-imbalances', color: 'purple' },
    ],
  },
  'memory-loss': {
    name: 'Memory Loss',
    title: 'Memory Loss',
    description: 'Difficulty remembering information or events.',
    relatedSymptoms: [
      { name: 'Poor Focus', href: '/symptoms/poor-focus', color: 'blue' },
      { name: 'Fatigue', href: '/symptoms/fatigue', color: 'green' },
      { name: 'Stress', href: '/symptoms/stress', color: 'purple' },
    ],
  },
  'migraine': {
    name: 'Migraine Relief',
    title: 'Migraine Relief',
    description: 'Natural solutions for migraine management and prevention.',
    relatedSymptoms: [
      { name: 'Neck Tension', href: '/symptoms/neck-tension', color: 'blue' },
      { name: 'Stress', href: '/symptoms/stress', color: 'green' },
      { name: 'Fatigue', href: '/symptoms/fatigue', color: 'purple' },
    ],
  },
  'digestive-health': {
    name: 'Digestive Health',
    title: 'Digestive Health',
    description: 'Support for digestive function and gut health.',
    relatedSymptoms: [
      { name: 'Dysbiosis', href: '/symptoms/dysbiosis', color: 'blue' },
      { name: 'Leaky Gut', href: '/symptoms/leaky-gut', color: 'green' },
      { name: 'IBS', href: '/symptoms/ibs', color: 'purple' },
    ],
  },
}; 