import { notFound } from 'next/navigation';

interface SupplementPageProps {
  params: Promise<{ slug: string }>;
}

const supplements = {
  'omega-3': {
    title: 'Omega-3 Fatty Acids',
    subtitle: 'Essential Brain Health Supplement',
    description: 'Omega-3 fatty acids are essential fats that your body cannot produce on its own. They are crucial for brain health, heart health, and overall well-being.',
    benefits: [
      'Supports brain function and memory',
      'Reduces inflammation throughout the body',
      'Supports heart health',
      'May help with mood and depression',
      'Supports eye health',
      'Important for fetal development during pregnancy'
    ],
    dosage: '1000-2000mg daily',
    bestTime: 'With meals',
    sideEffects: 'Generally safe. May cause fishy burps or mild digestive upset.',
    topProducts: [
      {
        name: 'Nordic Naturals Ultimate Omega',
        description: 'High-quality fish oil with excellent absorption',
        price: '$35.99',
        affiliateLink: 'https://amzn.to/nordic-naturals-omega',
        rating: '4.8/5',
        features: ['Third-party tested', 'No fishy aftertaste', 'High EPA/DHA content']
      },
      {
        name: 'Nature Made Fish Oil',
        description: 'Affordable and reliable fish oil supplement',
        price: '$18.99',
        affiliateLink: 'https://amzn.to/nature-made-fish-oil',
        rating: '4.6/5',
        features: ['USP verified', 'No artificial colors', 'Easy to swallow']
      },
      {
        name: 'Viva Naturals Omega-3',
        description: 'Premium fish oil with high concentration',
        price: '$42.99',
        affiliateLink: 'https://amzn.to/viva-naturals-omega',
        rating: '4.7/5',
        features: ['High potency', 'Molecularly distilled', 'Mercury-free']
      }
    ]
  },
  'vitamin-d': {
    title: 'Vitamin D',
    subtitle: 'The Sunshine Vitamin',
    description: 'Vitamin D is a fat-soluble vitamin that plays a crucial role in many bodily functions. It\'s often called the "sunshine vitamin" because your body produces it when your skin is exposed to sunlight.',
    benefits: [
      'Supports bone health and calcium absorption',
      'Boosts immune system function',
      'May improve mood and reduce depression',
      'Supports muscle function',
      'Important for heart health',
      'May reduce risk of certain cancers'
    ],
    dosage: '1000-4000 IU daily (consult doctor for higher doses)',
    bestTime: 'With a meal containing fat',
    sideEffects: 'Generally safe. High doses may cause nausea, vomiting, or kidney problems.',
    topProducts: [
      {
        name: 'NatureWise Vitamin D3',
        description: 'High-potency vitamin D3 with excellent absorption',
        price: '$19.99',
        affiliateLink: 'https://amzn.to/naturewise-vitamin-d',
        rating: '4.7/5',
        features: ['5000 IU per serving', 'Non-GMO', 'Gluten-free']
      },
      {
        name: 'NOW Foods Vitamin D3',
        description: 'Affordable and reliable vitamin D supplement',
        price: '$12.99',
        affiliateLink: 'https://amzn.to/now-vitamin-d',
        rating: '4.5/5',
        features: ['2000 IU per serving', 'Soy-free', 'Easy to swallow']
      },
      {
        name: 'Garden of Life Vitamin D3',
        description: 'Organic vitamin D3 with whole food blend',
        price: '$24.99',
        affiliateLink: 'https://amzn.to/garden-life-vitamin-d',
        rating: '4.6/5',
        features: ['Organic', 'Whole food blend', '2000 IU per serving']
      }
    ]
  },
  'magnesium': {
    title: 'Magnesium',
    subtitle: 'The Relaxation Mineral',
    description: 'Magnesium is an essential mineral that plays a role in over 300 enzymatic reactions in your body. It\'s particularly important for muscle and nerve function, blood sugar control, and bone health.',
    benefits: [
      'Helps relax muscles and reduce tension',
      'Supports healthy sleep patterns',
      'May reduce anxiety and stress',
      'Supports heart health',
      'Helps with muscle cramps',
      'Supports bone health'
    ],
    dosage: '200-400mg daily',
    bestTime: 'Evening (for sleep benefits) or with meals',
    sideEffects: 'May cause diarrhea at high doses. Start with lower doses.',
    topProducts: [
      {
        name: 'Natural Calm Magnesium',
        description: 'Popular magnesium citrate powder for relaxation',
        price: '$29.99',
        affiliateLink: 'https://amzn.to/natural-calm-magnesium',
        rating: '4.8/5',
        features: ['Citrate form', 'Easy to absorb', 'Calming effect']
      },
      {
        name: 'Doctor\'s Best Magnesium',
        description: 'High-absorption magnesium glycinate',
        price: '$22.99',
        affiliateLink: 'https://amzn.to/doctors-best-magnesium',
        rating: '4.6/5',
        features: ['Glycinate form', 'Gentle on stomach', '200mg per capsule']
      },
      {
        name: 'NOW Foods Magnesium',
        description: 'Affordable magnesium oxide supplement',
        price: '$15.99',
        affiliateLink: 'https://amzn.to/now-magnesium',
        rating: '4.4/5',
        features: ['400mg per serving', 'Easy to swallow', 'Budget-friendly']
      }
    ]
  },
  'b-complex': {
    title: 'B-Complex Vitamins',
    subtitle: 'Energy and Nervous System Support',
    description: 'B-complex vitamins are a group of eight water-soluble vitamins that play essential roles in energy production, nervous system function, and overall cellular health.',
    benefits: [
      'Supports energy production and metabolism',
      'Essential for nervous system function',
      'Helps convert food into energy',
      'Supports brain health and cognitive function',
      'May reduce stress and anxiety',
      'Important for red blood cell formation'
    ],
    dosage: 'Follow label instructions (typically 1 capsule daily)',
    bestTime: 'Morning with breakfast',
    sideEffects: 'Generally safe. May cause bright yellow urine (normal). High doses may cause nausea.',
    topProducts: [
      {
        name: 'Nature Made Super B-Complex',
        description: 'Complete B-vitamin complex with folic acid',
        price: '$12.99',
        affiliateLink: 'https://amzn.to/nature-made-b-complex',
        rating: '4.6/5',
        features: ['All 8 B vitamins', 'Folic acid included', 'Easy to swallow']
      },
      {
        name: 'NOW Foods B-50 Complex',
        description: 'High-potency B-vitamin supplement',
        price: '$15.99',
        affiliateLink: 'https://amzn.to/now-b-complex',
        rating: '4.5/5',
        features: ['50mg of most B vitamins', 'Vegetarian', 'Affordable']
      },
      {
        name: 'Garden of Life B-Complex',
        description: 'Organic whole food B-vitamin blend',
        price: '$24.99',
        affiliateLink: 'https://amzn.to/garden-life-b-complex',
        rating: '4.7/5',
        features: ['Organic', 'Whole food blend', 'Easy absorption']
      }
    ]
  },
  'l-theanine': {
    title: 'L-Theanine',
    subtitle: 'The Calm Focus Amino Acid',
    description: 'L-theanine is a unique amino acid found primarily in green tea that promotes relaxation without drowsiness. It\'s known for its ability to enhance focus while reducing stress.',
    benefits: [
      'Promotes calm focus and concentration',
      'Reduces stress and anxiety',
      'Improves sleep quality',
      'May enhance cognitive performance',
      'Supports relaxation without drowsiness',
      'May help with blood pressure'
    ],
    dosage: '100-400mg daily',
    bestTime: 'Morning or afternoon (not before bed)',
    sideEffects: 'Very safe. May cause mild drowsiness in some people.',
    topProducts: [
      {
        name: 'NOW Foods L-Theanine',
        description: 'Pure L-theanine amino acid supplement',
        price: '$18.99',
        affiliateLink: 'https://amzn.to/now-l-theanine',
        rating: '4.7/5',
        features: ['200mg per capsule', 'Vegetarian', 'Pure amino acid']
      },
      {
        name: 'Nature\'s Trove L-Theanine',
        description: 'High-quality L-theanine with good absorption',
        price: '$22.99',
        affiliateLink: 'https://amzn.to/natures-trove-l-theanine',
        rating: '4.6/5',
        features: ['300mg per serving', 'Easy to swallow', 'Quality brand']
      },
      {
        name: 'Doctor\'s Best L-Theanine',
        description: 'Reliable L-theanine supplement',
        price: '$16.99',
        affiliateLink: 'https://amzn.to/doctors-best-l-theanine',
        rating: '4.5/5',
        features: ['200mg per capsule', 'Affordable', 'Reliable brand']
      }
    ]
  }
};

export default async function SupplementPage({ params }: SupplementPageProps) {
  const { slug } = await params;
  const supplement = supplements[slug as keyof typeof supplements];

  if (!supplement) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-900 mb-2">{supplement.title}</h1>
          <p className="text-xl text-green-700 mb-4">{supplement.subtitle}</p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{supplement.description}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Benefits & Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-green-800 mb-4">Key Benefits</h2>
              <ul className="space-y-3">
                {supplement.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">✓</span>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <h3 className="font-semibold text-green-800 mb-2">Recommended Dosage</h3>
                <p className="text-gray-700">{supplement.dosage}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <h3 className="font-semibold text-green-800 mb-2">Best Time to Take</h3>
                <p className="text-gray-700">{supplement.bestTime}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <h3 className="font-semibold text-green-800 mb-2">Side Effects</h3>
                <p className="text-gray-700 text-sm">{supplement.sideEffects}</p>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg p-6 shadow-lg h-fit">
            <h2 className="text-2xl font-semibold text-green-800 mb-6">Top Products</h2>
            <div className="space-y-4">
              {supplement.topProducts.map((product, index) => (
                <div key={index} className="border border-green-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-green-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-green-600 font-bold">{product.price}</span>
                    <span className="text-yellow-500 text-sm">★ {product.rating}</span>
                  </div>
                  <ul className="text-xs text-gray-600 mb-4 space-y-1">
                    {product.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <span className="text-green-500 mr-1">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={product.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    Check Price →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            <strong>Disclaimer:</strong> These statements have not been evaluated by the FDA. 
            This product is not intended to diagnose, treat, cure, or prevent any disease. 
            Always consult with a healthcare professional before starting any new supplement regimen.
          </p>
        </div>
      </div>
    </div>
  );
} 