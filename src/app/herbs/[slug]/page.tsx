import { notFound } from 'next/navigation';

interface HerbPageProps {
  params: Promise<{ slug: string }>;
}

const herbs = {
  'lemon-balm': {
    title: 'Lemon Balm',
    subtitle: 'The Calming Herb',
    description: 'Lemon balm (Melissa officinalis) is a perennial herb from the mint family that has been used for centuries to promote calm and relaxation. Its gentle, lemony aroma and mild sedative properties make it a popular choice for stress relief and sleep support.',
    benefits: [
      'Reduces anxiety and stress',
      'Promotes restful sleep',
      'Supports digestive health',
      'May help with cold sores',
      'Improves mood and cognitive function',
      'Gentle enough for children'
    ],
    traditionalUses: [
      'Anxiety and nervous tension',
      'Insomnia and sleep disorders',
      'Digestive complaints',
      'Headaches and migraines',
      'Viral infections (cold sores)',
      'Mild depression'
    ],
    preparation: 'Tea: 1-2 tsp dried herb per cup of hot water, steep 5-10 minutes. Tincture: 30-60 drops 2-3 times daily.',
    safety: 'Generally safe. May interact with thyroid medications. Avoid during pregnancy.',
    topProducts: [
      {
        name: 'Traditional Medicinals Lemon Balm Tea',
        description: 'Organic lemon balm tea bags for daily use',
        price: '$5.99',
        affiliateLink: 'https://amzn.to/traditional-medicinals-lemon-balm',
        rating: '4.6/5',
        features: ['Organic', '16 tea bags', 'Caffeine-free', 'Easy to use']
      },
      {
        name: 'Herb Pharm Lemon Balm Tincture',
        description: 'High-quality liquid extract for concentrated benefits',
        price: '$18.99',
        affiliateLink: 'https://amzn.to/herb-pharm-lemon-balm',
        rating: '4.7/5',
        features: ['Alcohol-free', '1 oz bottle', 'Concentrated', 'Easy to dose']
      },
      {
        name: 'Nature\'s Way Lemon Balm Capsules',
        description: 'Convenient capsules for on-the-go use',
        price: '$12.99',
        affiliateLink: 'https://amzn.to/natures-way-lemon-balm',
        rating: '4.5/5',
        features: ['60 capsules', 'Vegetarian', 'No artificial colors', 'Affordable']
      }
    ]
  },
  'chamomile': {
    title: 'Chamomile',
    subtitle: 'The Gentle Healer',
    description: 'Chamomile is one of the most popular and widely used herbs in the world. Known for its gentle, calming properties, it\'s particularly effective for sleep, digestion, and stress relief.',
    benefits: [
      'Promotes deep, restful sleep',
      'Soothes digestive discomfort',
      'Reduces anxiety and stress',
      'Supports skin health',
      'Anti-inflammatory properties',
      'Safe for children and elderly'
    ],
    traditionalUses: [
      'Insomnia and sleep disorders',
      'Digestive issues and stomach upset',
      'Anxiety and nervous tension',
      'Skin irritation and inflammation',
      'Menstrual cramps',
      'Teething pain in infants'
    ],
    preparation: 'Tea: 1 tsp dried flowers per cup, steep 5-10 minutes. Essential oil: Dilute for topical use.',
    safety: 'Very safe. Rare allergic reactions possible. Avoid if allergic to ragweed.',
    topProducts: [
      {
        name: 'Celestial Seasonings Chamomile Tea',
        description: 'Classic chamomile tea with gentle flavor',
        price: '$4.99',
        affiliateLink: 'https://amzn.to/celestial-chamomile',
        rating: '4.8/5',
        features: ['20 tea bags', 'Caffeine-free', 'Affordable', 'Widely available']
      },
      {
        name: 'Now Foods Chamomile Essential Oil',
        description: 'Pure chamomile essential oil for aromatherapy',
        price: '$15.99',
        affiliateLink: 'https://amzn.to/now-chamomile-oil',
        rating: '4.6/5',
        features: ['1 oz bottle', 'Pure essential oil', 'Aromatherapy use', 'Topical application']
      },
      {
        name: 'Nature\'s Answer Chamomile Tincture',
        description: 'Concentrated liquid extract for maximum benefits',
        price: '$22.99',
        affiliateLink: 'https://amzn.to/natures-answer-chamomile',
        rating: '4.7/5',
        features: ['2 oz bottle', 'Alcohol-free', 'Concentrated', 'Easy dosing']
      }
    ]
  },
  'lavender': {
    title: 'Lavender',
    subtitle: 'The Purple Calm',
    description: 'Lavender is one of the most versatile and beloved herbs, known for its beautiful purple flowers and distinctive calming aroma. It\'s widely used for relaxation, sleep, and skin care.',
    benefits: [
      'Promotes deep relaxation and sleep',
      'Reduces anxiety and stress',
      'Soothes skin irritation',
      'Natural pain relief',
      'Improves mood and focus',
      'Antimicrobial properties'
    ],
    traditionalUses: [
      'Insomnia and sleep disorders',
      'Anxiety and stress relief',
      'Skin conditions and burns',
      'Headaches and migraines',
      'Muscle tension and pain',
      'Respiratory support'
    ],
    preparation: 'Essential oil: 2-3 drops in diffuser or diluted for topical use. Tea: 1 tsp dried flowers per cup.',
    safety: 'Generally safe. May cause skin irritation in some. Avoid during pregnancy.',
    topProducts: [
      {
        name: 'doTERRA Lavender Essential Oil',
        description: 'Premium therapeutic-grade lavender oil',
        price: '$28.99',
        affiliateLink: 'https://amzn.to/doterra-lavender',
        rating: '4.9/5',
        features: ['15ml bottle', 'Therapeutic grade', 'Pure essential oil', 'Multiple uses']
      },
      {
        name: 'Yogi Lavender Honey Stress Relief Tea',
        description: 'Soothing tea blend with lavender and honey',
        price: '$6.99',
        affiliateLink: 'https://amzn.to/yogi-lavender-tea',
        rating: '4.7/5',
        features: ['16 tea bags', 'Honey flavor', 'Stress relief blend', 'Caffeine-free']
      },
      {
        name: 'Aura Cacia Lavender Essential Oil',
        description: 'Affordable pure lavender essential oil',
        price: '$12.99',
        affiliateLink: 'https://amzn.to/aura-cacia-lavender',
        rating: '4.6/5',
        features: ['1 oz bottle', 'Pure essential oil', 'Affordable', 'Quality brand']
      }
    ]
  },
  'valerian': {
    title: 'Valerian Root',
    subtitle: 'Nature\'s Sleep Aid',
    description: 'Valerian root has been used for centuries as a natural sleep aid and sedative. It\'s particularly effective for insomnia and sleep disorders, though it has a distinctive earthy aroma.',
    benefits: [
      'Promotes deep, restful sleep',
      'Reduces time to fall asleep',
      'Improves sleep quality',
      'Reduces anxiety and stress',
      'May help with pain relief',
      'Non-habit forming'
    ],
    traditionalUses: [
      'Insomnia and sleep disorders',
      'Anxiety and nervous tension',
      'Restlessness and agitation',
      'Mild pain relief',
      'Menstrual cramps',
      'Digestive spasms'
    ],
    preparation: 'Capsules: 300-600mg 30 minutes before bed. Tea: 1 tsp dried root per cup, steep 10-15 minutes.',
    safety: 'Generally safe. May cause drowsiness. Avoid with alcohol or sedatives.',
    topProducts: [
      {
        name: 'Nature\'s Way Valerian Root',
        description: 'Standardized valerian root capsules',
        price: '$14.99',
        affiliateLink: 'https://amzn.to/natures-way-valerian',
        rating: '4.5/5',
        features: ['100 capsules', '530mg per serving', 'Vegetarian', 'Affordable']
      },
      {
        name: 'NOW Foods Valerian Root',
        description: 'High-potency valerian root supplement',
        price: '$18.99',
        affiliateLink: 'https://amzn.to/now-valerian',
        rating: '4.6/5',
        features: ['90 capsules', '500mg per serving', 'Quality brand', 'Good value']
      },
      {
        name: 'Herb Pharm Valerian Tincture',
        description: 'Liquid valerian extract for easy dosing',
        price: '$24.99',
        affiliateLink: 'https://amzn.to/herb-pharm-valerian',
        rating: '4.7/5',
        features: ['1 oz bottle', 'Alcohol-free', 'Concentrated', 'Easy to dose']
      }
    ]
  },
  'st-johns-wort': {
    title: "St. John's Wort",
    subtitle: 'The Mood Lifter',
    description: "St. John's Wort (Hypericum perforatum) is a flowering plant traditionally used for its mood-boosting properties. It's one of the most researched herbs for mild to moderate depression and emotional balance.",
    benefits: [
      'Supports emotional well-being',
      'May help with mild to moderate depression',
      'Promotes positive mood',
      'Supports nervous system health',
      'May reduce symptoms of anxiety',
      'Traditionally used for nerve pain'
    ],
    traditionalUses: [
      'Mild to moderate depression',
      'Seasonal affective disorder (SAD)',
      'Anxiety and nervous tension',
      'Nerve pain',
      'Wound healing (topical)',
      'Sleep disturbances'
    ],
    preparation: 'Capsules: 300mg 1-3 times daily. Tea: 1-2 tsp dried herb per cup, steep 10 minutes.',
    safety: 'May interact with many medications (antidepressants, birth control, etc.). Consult your doctor before use. Avoid during pregnancy.',
    topProducts: [
      {
        name: "Nature's Way St. John's Wort",
        description: 'Standardized extract for mood support',
        price: '$16.99',
        affiliateLink: 'https://amzn.to/natures-way-st-johns-wort',
        rating: '4.6/5',
        features: ['100 capsules', '0.3% Hypericin', 'Vegetarian', 'Popular brand']
      },
      {
        name: 'Solaray St. John’s Wort Extract',
        description: 'High-potency herbal supplement',
        price: '$19.99',
        affiliateLink: 'https://amzn.to/solaray-st-johns-wort',
        rating: '4.7/5',
        features: ['60 capsules', 'Guaranteed potency', 'Vegan', 'Trusted brand']
      },
      {
        name: 'Herb Pharm St. John’s Wort Tincture',
        description: 'Liquid extract for flexible dosing',
        price: '$15.99',
        affiliateLink: 'https://amzn.to/herb-pharm-st-johns-wort',
        rating: '4.5/5',
        features: ['1 oz bottle', 'Alcohol-free', 'Easy to use', 'Concentrated']
      }
    ]
  },
  'ashwagandha': {
    title: 'Ashwagandha',
    subtitle: 'The Stress Adaptogen',
    description: 'Ashwagandha (Withania somnifera) is a powerful adaptogenic herb used in Ayurvedic medicine to help the body adapt to stress, support energy, and promote calm focus.',
    benefits: [
      'Reduces stress and anxiety',
      'Supports energy and stamina',
      'Promotes restful sleep',
      'May improve cognitive function',
      'Supports immune health',
      'Balances mood and hormones'
    ],
    traditionalUses: [
      'Chronic stress and anxiety',
      'Fatigue and low energy',
      'Sleep disturbances',
      'Cognitive support',
      'Immune system support',
      'Hormonal balance'
    ],
    preparation: 'Capsules: 300-600mg daily. Powder: 1-2 tsp in warm milk or water. Tincture: 30-60 drops 1-2 times daily.',
    safety: 'Generally safe. May cause mild stomach upset. Avoid during pregnancy. Consult your doctor if taking thyroid medication.',
    topProducts: [
      {
        name: 'Organic India Ashwagandha',
        description: 'Organic ashwagandha root capsules',
        price: '$24.99',
        affiliateLink: 'https://amzn.to/organic-india-ashwagandha',
        rating: '4.7/5',
        features: ['90 capsules', 'Certified organic', '500mg per serving', 'Vegan']
      },
      {
        name: 'NOW Foods Ashwagandha',
        description: 'High-potency ashwagandha extract',
        price: '$18.99',
        affiliateLink: 'https://amzn.to/now-ashwagandha',
        rating: '4.6/5',
        features: ['450mg per serving', 'Vegetarian capsules', 'Popular brand', 'Affordable']
      },
      {
        name: 'Himalaya Organic Ashwagandha',
        description: 'Clinically studied adaptogen',
        price: '$21.99',
        affiliateLink: 'https://amzn.to/himalaya-ashwagandha',
        rating: '4.8/5',
        features: ['60 caplets', 'Certified organic', 'Gluten-free', 'Clinically studied']
      }
    ]
  }
};

export default async function HerbPage({ params }: HerbPageProps) {
  const { slug } = await params;
  const herb = herbs[slug as keyof typeof herbs];

  if (!herb) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-900 mb-2">{herb.title}</h1>
          <p className="text-xl text-purple-700 mb-4">{herb.subtitle}</p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{herb.description}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Benefits & Traditional Uses */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">Key Benefits</h2>
              <ul className="space-y-3">
                {herb.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-purple-500 mr-3 mt-1">✓</span>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
        ))}
      </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">Traditional Uses</h2>
              <ul className="space-y-2">
                {herb.traditionalUses.map((use, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span className="text-gray-700">{use}</span>
                  </li>
        ))}
      </ul>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <h3 className="font-semibold text-purple-800 mb-2">Preparation</h3>
                <p className="text-gray-700 text-sm">{herb.preparation}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <h3 className="font-semibold text-purple-800 mb-2">Safety</h3>
                <p className="text-gray-700 text-sm">{herb.safety}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <h3 className="font-semibold text-purple-800 mb-2">Best Time</h3>
                <p className="text-gray-700 text-sm">Evening or as needed for sleep support</p>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg p-6 shadow-lg h-fit">
            <h2 className="text-2xl font-semibold text-purple-800 mb-6">Top Products</h2>
            <div className="space-y-4">
              {herb.topProducts.map((product, index) => (
                <div key={index} className="border border-purple-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-purple-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-purple-600 font-bold">{product.price}</span>
                    <span className="text-yellow-500 text-sm">★ {product.rating}</span>
                  </div>
                  <ul className="text-xs text-gray-600 mb-4 space-y-1">
                    {product.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <span className="text-purple-500 mr-1">•</span>
                        {feature}
          </li>
        ))}
      </ul>
                  <a
                    href={product.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-purple-600 text-white text-center py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
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
            Always consult with a healthcare professional before starting any new herbal regimen, 
            especially if you are pregnant, nursing, or taking medications.
          </p>
        </div>
      </div>
    </div>
  );
}
