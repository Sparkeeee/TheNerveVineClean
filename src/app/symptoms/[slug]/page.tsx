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
        name: 'Magnesium',
        description: 'Helps relax muscles and calm the nervous system',
        affiliateLink: 'https://amzn.to/example-magnesium',
        price: '$15-25'
      },
      {
        type: 'supplement',
        name: 'L-Theanine',
        description: 'Amino acid that promotes relaxation without drowsiness',
        affiliateLink: 'https://amzn.to/example-l-theanine',
        price: '$20-30'
      },
      {
        type: 'herb',
        name: 'Lemon Balm',
        description: 'Traditional herb for sleep and relaxation',
        affiliateLink: 'https://amzn.to/example-lemon-balm',
        price: '$12-18'
      },
      {
        type: 'herb',
        name: 'Valerian Root',
        description: 'Natural sedative that improves sleep quality',
        affiliateLink: 'https://amzn.to/example-valerian',
        price: '$18-25'
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
        name: 'Omega-3 Fatty Acids',
        description: 'Essential fats that support brain health and mood',
        affiliateLink: 'https://amzn.to/example-omega3',
        price: '$25-40'
      },
      {
        type: 'supplement',
        name: 'Vitamin D',
        description: 'Sunshine vitamin that supports mood and brain function',
        affiliateLink: 'https://amzn.to/example-vitamin-d',
        price: '$15-25'
      },
      {
        type: 'herb',
        name: 'St. John\'s Wort',
        description: 'Traditional herb for mild to moderate depression',
        affiliateLink: 'https://amzn.to/example-st-johns-wort',
        price: '$20-30'
      },
      {
        type: 'supplement',
        name: 'B-Complex Vitamins',
        description: 'Essential for brain function and neurotransmitter production',
        affiliateLink: 'https://amzn.to/example-b-complex',
        price: '$18-28'
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
        name: 'Ashwagandha',
        description: 'Adaptogenic herb that reduces stress and anxiety',
        affiliateLink: 'https://amzn.to/example-ashwagandha',
        price: '$20-35'
      },
      {
        type: 'supplement',
        name: 'L-Theanine',
        description: 'Amino acid that promotes calm focus',
        affiliateLink: 'https://amzn.to/example-l-theanine-anxiety',
        price: '$25-35'
      },
      {
        type: 'herb',
        name: 'Chamomile',
        description: 'Gentle herb that soothes nerves and promotes relaxation',
        affiliateLink: 'https://amzn.to/example-chamomile',
        price: '$12-20'
      },
      {
        type: 'supplement',
        name: 'Magnesium',
        description: 'Mineral that supports nervous system function',
        affiliateLink: 'https://amzn.to/example-magnesium-anxiety',
        price: '$18-28'
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
        name: 'Ginkgo Biloba',
        description: 'Improves blood flow to the brain and cognitive function',
        affiliateLink: 'https://amzn.to/example-ginkgo',
        price: '$22-35'
      },
      {
        type: 'supplement',
        name: 'Omega-3 Fatty Acids',
        description: 'Essential for brain health and memory function',
        affiliateLink: 'https://amzn.to/example-omega3-memory',
        price: '$28-45'
      },
      {
        type: 'supplement',
        name: 'B-Complex Vitamins',
        description: 'Essential for brain function and memory',
        affiliateLink: 'https://amzn.to/example-b-complex-memory',
        price: '$20-30'
      },
      {
        type: 'supplement',
        name: 'Acetyl-L-Carnitine',
        description: 'Amino acid that supports brain energy and memory',
        affiliateLink: 'https://amzn.to/example-acetyl-carnitine',
        price: '$25-40'
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
                  <a
                    href={solution.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    View Product →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            <strong>Disclaimer:</strong> This information is for educational purposes only. 
            Always consult with a healthcare professional before starting any new supplement regimen, 
            especially if you have underlying health conditions or are taking medications.
          </p>
        </div>
      </div>
    </div>
  );
} 