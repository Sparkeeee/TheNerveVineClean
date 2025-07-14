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
        name: 'Solaray St. John\'s Wort Extract',
        description: 'High-potency herbal supplement',
        price: '$19.99',
        affiliateLink: 'https://amzn.to/solaray-st-johns-wort',
        rating: '4.7/5',
        features: ['60 capsules', 'Guaranteed potency', 'Vegan', 'Trusted brand']
      },
      {
        name: 'Herb Pharm St. John\'s Wort Tincture',
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
  },
  'rhodiola': {
    title: 'Rhodiola Rosea',
    subtitle: 'The Golden Root',
    description: 'Rhodiola rosea is a powerful adaptogenic herb that grows in cold, mountainous regions. It\'s particularly effective for mental and physical fatigue, stress, and cognitive enhancement.',
    benefits: [
      'Improves mental and physical performance',
      'Reduces fatigue and exhaustion',
      'Enhances cognitive function',
      'Supports stress adaptation',
      'May improve mood and motivation',
      'Supports immune function'
    ],
    traditionalUses: [
      'Mental and physical fatigue',
      'Stress and burnout',
      'Cognitive enhancement',
      'Depression and low mood',
      'Altitude sickness',
      'Immune system support'
    ],
    preparation: 'Capsules: 200-400mg daily. Tincture: 30-60 drops 1-2 times daily. Take in the morning.',
    safety: 'Generally safe. May cause mild stimulation. Avoid in the evening. Consult your doctor if taking antidepressants.',
    topProducts: [
      {
        name: 'NOW Foods Rhodiola Rosea',
        description: 'Standardized rhodiola extract',
        price: '$19.99',
        affiliateLink: 'https://amzn.to/now-rhodiola',
        rating: '4.6/5',
        features: ['60 capsules', '500mg per serving', 'Vegetarian', 'Popular brand']
      },
      {
        name: 'Gaia Herbs Rhodiola Rosea',
        description: 'Organic rhodiola root capsules',
        price: '$26.99',
        affiliateLink: 'https://amzn.to/gaia-rhodiola',
        rating: '4.7/5',
        features: ['60 capsules', 'Certified organic', '400mg per serving', 'Vegan']
      },
      {
        name: 'Nature\'s Way Rhodiola Rosea',
        description: 'High-potency rhodiola supplement',
        price: '$22.99',
        affiliateLink: 'https://amzn.to/natures-way-rhodiola',
        rating: '4.5/5',
        features: ['60 capsules', '500mg per serving', 'Vegetarian', 'Quality brand']
      }
    ]
  },
  'holy-basil': {
    title: 'Holy Basil (Tulsi)',
    subtitle: 'The Sacred Herb',
    description: 'Holy Basil, also known as Tulsi, is considered sacred in Ayurvedic medicine. It\'s an excellent adaptogen that helps the body adapt to stress while promoting mental clarity and spiritual well-being.',
    benefits: [
      'Reduces stress and anxiety',
      'Promotes mental clarity',
      'Supports immune function',
      'Balances blood sugar levels',
      'Anti-inflammatory properties',
      'Supports respiratory health'
    ],
    traditionalUses: [
      'Stress and anxiety relief',
      'Mental clarity and focus',
      'Respiratory support',
      'Blood sugar balance',
      'Immune system support',
      'Spiritual well-being'
    ],
    preparation: 'Tea: 1-2 tsp dried leaves per cup, steep 5-10 minutes. Capsules: 400-800mg daily. Tincture: 30-60 drops 2-3 times daily.',
    safety: 'Generally safe. May lower blood sugar. Monitor if diabetic. Avoid during pregnancy.',
    topProducts: [
      {
        name: 'Organic India Tulsi Tea',
        description: 'Traditional tulsi tea blend',
        price: '$8.99',
        affiliateLink: 'https://amzn.to/organic-india-tulsi',
        rating: '4.7/5',
        features: ['25 tea bags', 'Certified organic', 'Traditional blend', 'Caffeine-free']
      },
      {
        name: 'Gaia Herbs Holy Basil',
        description: 'Organic holy basil capsules',
        price: '$24.99',
        affiliateLink: 'https://amzn.to/gaia-holy-basil',
        rating: '4.6/5',
        features: ['60 capsules', 'Certified organic', '400mg per serving', 'Vegan']
      },
      {
        name: 'Banyan Botanicals Tulsi',
        description: 'Traditional Ayurvedic tulsi',
        price: '$18.99',
        affiliateLink: 'https://amzn.to/banyan-tulsi',
        rating: '4.8/5',
        features: ['90 capsules', 'Traditional formula', 'Vegan', 'Ayurvedic']
      }
    ]
  },
  'licorice-root': {
    title: 'Licorice Root',
    subtitle: 'The Sweet Healer',
    description: 'Licorice root is a traditional herb known for its sweet taste and powerful healing properties. It\'s particularly effective for adrenal support, digestive health, and respiratory conditions.',
    benefits: [
      'Supports adrenal gland function',
      'Soothes digestive issues',
      'Supports respiratory health',
      'Anti-inflammatory properties',
      'May help with hormonal balance',
      'Supports liver health'
    ],
    traditionalUses: [
      'Adrenal fatigue and exhaustion',
      'Digestive ulcers and inflammation',
      'Respiratory conditions',
      'Hormonal imbalances',
      'Liver support',
      'Skin conditions'
    ],
    preparation: 'Tea: 1 tsp dried root per cup, steep 10-15 minutes. Tincture: 30-60 drops 2-3 times daily. Capsules: 200-400mg daily.',
    safety: 'May raise blood pressure. Avoid if hypertensive. Limit use to 4-6 weeks. Consult your doctor if taking medications.',
    topProducts: [
      {
        name: 'Traditional Medicinals Licorice Root Tea',
        description: 'Pure licorice root tea',
        price: '$6.99',
        affiliateLink: 'https://amzn.to/traditional-licorice',
        rating: '4.5/5',
        features: ['16 tea bags', 'Pure licorice', 'Caffeine-free', 'Easy to use']
      },
      {
        name: 'Nature\'s Way Licorice Root',
        description: 'Licorice root capsules',
        price: '$14.99',
        affiliateLink: 'https://amzn.to/natures-way-licorice',
        rating: '4.6/5',
        features: ['100 capsules', '400mg per serving', 'Vegetarian', 'Affordable']
      },
      {
        name: 'Herb Pharm Licorice Root',
        description: 'Liquid licorice extract',
        price: '$19.99',
        affiliateLink: 'https://amzn.to/herb-pharm-licorice',
        rating: '4.7/5',
        features: ['1 oz bottle', 'Alcohol-free', 'Concentrated', 'Easy dosing']
      }
    ]
  },
  'korean-ginseng': {
    title: 'Korean Ginseng',
    subtitle: 'The King of Herbs',
    description: 'Korean Ginseng (Panax ginseng) is one of the most revered herbs in traditional medicine, known for its ability to enhance energy, mental clarity, and overall vitality. It\'s particularly effective for stress and fatigue.',
    benefits: [
      'Enhances energy and stamina',
      'Improves mental clarity',
      'Supports stress adaptation',
      'Boosts immune function',
      'May improve cognitive function',
      'Supports overall vitality'
    ],
    traditionalUses: [
      'Fatigue and low energy',
      'Mental and physical stress',
      'Cognitive enhancement',
      'Immune system support',
      'Sexual vitality',
      'Recovery from illness'
    ],
    preparation: 'Capsules: 200-400mg daily. Tea: 1 tsp dried root per cup, steep 10-15 minutes. Tincture: 30-60 drops 1-2 times daily.',
    safety: 'May cause stimulation. Avoid in the evening. May interact with blood thinners. Consult your doctor if taking medications.',
    topProducts: [
      {
        name: 'Nature\'s Way Korean Ginseng',
        description: 'High-potency Korean ginseng',
        price: '$24.99',
        affiliateLink: 'https://amzn.to/natures-way-ginseng',
        rating: '4.7/5',
        features: ['60 capsules', '500mg per serving', 'Vegetarian', 'Quality brand']
      },
      {
        name: 'NOW Foods American Ginseng',
        description: 'American ginseng root capsules',
        price: '$19.99',
        affiliateLink: 'https://amzn.to/now-ginseng',
        rating: '4.6/5',
        features: ['90 capsules', '400mg per serving', 'Vegetarian', 'Popular brand']
      },
      {
        name: 'Traditional Medicinals Ginseng Tea',
        description: 'Ginseng and green tea blend',
        price: '$7.99',
        affiliateLink: 'https://amzn.to/traditional-ginseng',
        rating: '4.5/5',
        features: ['16 tea bags', 'Green tea blend', 'Natural energy', 'Caffeinated']
      }
    ]
  },
  'kava-kava': {
    title: 'Kava Kava',
    subtitle: 'The Pacific Calm',
    description: 'Kava Kava (Piper methysticum) is a powerful anxiolytic herb from the Pacific Islands, traditionally used in ceremonial drinks. It\'s particularly effective for social anxiety, muscle tension, and stress relief.',
    benefits: [
      'Powerful anxiety relief',
      'Muscle relaxation',
      'Social anxiety support',
      'Stress reduction',
      'Sleep promotion',
      'Non-addictive sedative'
    ],
    traditionalUses: [
      'Social anxiety and phobias',
      'Muscle tension and spasms',
      'Insomnia and sleep disorders',
      'Stress and nervous tension',
      'Pain relief',
      'Pacific Island ceremonies'
    ],
    preparation: 'Capsules: 250-500mg daily. Tincture: 30-60 drops 2-3 times daily. Traditional: Kava tea or tincture.',
    safety: 'Generally safe when used properly. May cause liver issues with excessive use. Avoid with alcohol. Not recommended for long-term use.',
    topProducts: [
      {
        name: 'NOW Foods Kava Kava',
        description: 'Standardized kava kava extract',
        price: '$24.99',
        affiliateLink: 'https://amzn.to/now-kava-kava',
        rating: '4.6/5',
        features: ['60 capsules', '250mg per serving', 'Standardized', 'Quality brand']
      },
      {
        name: 'Nature\'s Way Kava Kava',
        description: 'Traditional kava kava supplement',
        price: '$19.99',
        affiliateLink: 'https://amzn.to/natures-way-kava',
        rating: '4.5/5',
        features: ['60 capsules', '200mg per serving', 'Vegetarian', 'Affordable']
      },
      {
        name: 'Herb Pharm Kava Kava',
        description: 'Liquid kava kava extract',
        price: '$28.99',
        affiliateLink: 'https://amzn.to/herb-pharm-kava',
        rating: '4.7/5',
        features: ['1 oz bottle', 'Alcohol-free', 'Concentrated', 'Easy dosing']
      }
    ]
  },
  'passionflower': {
    title: 'Passionflower',
    subtitle: 'The GABA Enhancer',
    description: 'Passionflower (Passiflora incarnata) is a beautiful flowering vine that enhances GABA activity in the brain, making it particularly effective for anxiety, insomnia, and nervous tension.',
    benefits: [
      'Enhances GABA activity',
      'Reduces anxiety and stress',
      'Promotes restful sleep',
      'Relieves nervous tension',
      'Supports ADHD symptoms',
      'Gentle and non-addictive'
    ],
    traditionalUses: [
      'Anxiety and panic disorders',
      'Insomnia and sleep disorders',
      'ADHD and hyperactivity',
      'Nervous tension and restlessness',
      'Muscle spasms',
      'Mild pain relief'
    ],
    preparation: 'Tea: 1-2 tsp dried herb per cup, steep 10-15 minutes. Tincture: 30-60 drops 2-3 times daily. Capsules: 500-1000mg daily.',
    safety: 'Very safe. May cause drowsiness. Avoid with sedatives. Safe for children.',
    topProducts: [
      {
        name: 'Nature\'s Way Passionflower',
        description: 'High-quality passionflower capsules',
        price: '$16.99',
        affiliateLink: 'https://amzn.to/natures-way-passionflower',
        rating: '4.7/5',
        features: ['60 capsules', '500mg per serving', 'Vegetarian', 'Affordable']
      },
      {
        name: 'Herb Pharm Passionflower',
        description: 'Liquid passionflower extract',
        price: '$22.99',
        affiliateLink: 'https://amzn.to/herb-pharm-passionflower',
        rating: '4.8/5',
        features: ['1 oz bottle', 'Alcohol-free', 'Concentrated', 'Easy dosing']
      },
      {
        name: 'Traditional Medicinals Passionflower Tea',
        description: 'Soothing passionflower tea blend',
        price: '$7.99',
        affiliateLink: 'https://amzn.to/traditional-passionflower',
        rating: '4.6/5',
        features: ['16 tea bags', 'Caffeine-free', 'Organic', 'Easy to use']
      }
    ]
  },
  'california-poppy': {
    title: 'California Poppy',
    subtitle: 'The Gentle Sedative',
    description: 'California Poppy (Eschscholzia californica) is a gentle, non-addictive sedative herb that promotes relaxation and sleep without the side effects of stronger sedatives.',
    benefits: [
      'Gentle sedative effects',
      'Promotes restful sleep',
      'Reduces anxiety and stress',
      'Pain relief properties',
      'Non-addictive alternative',
      'Safe for children and elderly'
    ],
    traditionalUses: [
      'Insomnia and sleep disorders',
      'Anxiety and nervous tension',
      'Mild pain relief',
      'Restlessness and agitation',
      'Children\'s sleep support',
      'Gentle sedative alternative'
    ],
    preparation: 'Tea: 1-2 tsp dried herb per cup, steep 10-15 minutes. Tincture: 30-60 drops 2-3 times daily. Capsules: 250-500mg daily.',
    safety: 'Very safe. Non-addictive. May cause drowsiness. Safe for children.',
    topProducts: [
      {
        name: 'Herb Pharm California Poppy',
        description: 'Liquid California poppy extract',
        price: '$24.99',
        affiliateLink: 'https://amzn.to/herb-pharm-california-poppy',
        rating: '4.7/5',
        features: ['1 oz bottle', 'Alcohol-free', 'Concentrated', 'Gentle formula']
      },
      {
        name: 'Nature\'s Answer California Poppy',
        description: 'California poppy capsules',
        price: '$18.99',
        affiliateLink: 'https://amzn.to/natures-answer-california-poppy',
        rating: '4.6/5',
        features: ['90 capsules', '250mg per serving', 'Vegetarian', 'Affordable']
      },
      {
        name: 'Frontier Co-op California Poppy',
        description: 'Bulk California poppy herb',
        price: '$12.99',
        affiliateLink: 'https://amzn.to/frontier-california-poppy',
        rating: '4.5/5',
        features: ['16 oz bag', 'Organic', 'Bulk', 'Tea preparation']
      }
    ]
  },
  'blue-vervain': {
    title: 'Blue Vervain',
    subtitle: 'The Nervous Tonic',
    description: 'Blue Vervain (Verbena hastata) is a powerful nervous system tonic that helps restore balance to an overactive nervous system, making it excellent for anxiety, depression, and nervous exhaustion.',
    benefits: [
      'Nervous system tonic',
      'Reduces anxiety and depression',
      'Supports emotional balance',
      'Relieves nervous tension',
      'Promotes restful sleep',
      'Supports liver function'
    ],
    traditionalUses: [
      'Nervous exhaustion',
      'Anxiety and depression',
      'Insomnia and sleep disorders',
      'Nervous tension and restlessness',
      'Liver support',
      'Emotional balance'
    ],
    preparation: 'Tea: 1 tsp dried herb per cup, steep 10-15 minutes. Tincture: 20-40 drops 2-3 times daily. Capsules: 250-500mg daily.',
    safety: 'Generally safe. May cause nausea in high doses. Avoid during pregnancy.',
    topProducts: [
      {
        name: 'Herb Pharm Blue Vervain',
        description: 'Liquid blue vervain extract',
        price: '$26.99',
        affiliateLink: 'https://amzn.to/herb-pharm-blue-vervain',
        rating: '4.8/5',
        features: ['1 oz bottle', 'Alcohol-free', 'Concentrated', 'Nervous tonic']
      },
      {
        name: 'Nature\'s Answer Blue Vervain',
        description: 'Blue vervain capsules',
        price: '$20.99',
        affiliateLink: 'https://amzn.to/natures-answer-blue-vervain',
        rating: '4.6/5',
        features: ['90 capsules', '250mg per serving', 'Vegetarian', 'Quality brand']
      },
      {
        name: 'Frontier Co-op Blue Vervain',
        description: 'Bulk blue vervain herb',
        price: '$14.99',
        affiliateLink: 'https://amzn.to/frontier-blue-vervain',
        rating: '4.5/5',
        features: ['16 oz bag', 'Organic', 'Bulk', 'Tea preparation']
      }
    ]
  },
  'wood-betony': {
    title: 'Wood Betony',
    subtitle: 'The Headache Healer',
    description: 'Wood Betony (Stachys officinalis) is a traditional European herb known for its ability to relieve nervous headaches, anxiety, and tension. It\'s particularly effective for stress-related symptoms.',
    benefits: [
      'Relieves nervous headaches',
      'Reduces anxiety and tension',
      'Supports nervous system',
      'Promotes mental clarity',
      'Gentle sedative effects',
      'Traditional European remedy'
    ],
    traditionalUses: [
      'Nervous headaches and migraines',
      'Anxiety and nervous tension',
      'Mental fatigue and brain fog',
      'Insomnia and sleep disorders',
      'Stress-related symptoms',
      'Traditional European medicine'
    ],
    preparation: 'Tea: 1-2 tsp dried herb per cup, steep 10-15 minutes. Tincture: 30-60 drops 2-3 times daily. Capsules: 250-500mg daily.',
    safety: 'Very safe. Gentle herb. May cause drowsiness. Safe for most people.',
    topProducts: [
      {
        name: 'Herb Pharm Wood Betony',
        description: 'Liquid wood betony extract',
        price: '$24.99',
        affiliateLink: 'https://amzn.to/herb-pharm-wood-betony',
        rating: '4.7/5',
        features: ['1 oz bottle', 'Alcohol-free', 'Concentrated', 'Traditional remedy']
      },
      {
        name: 'Nature\'s Answer Wood Betony',
        description: 'Wood betony capsules',
        price: '$18.99',
        affiliateLink: 'https://amzn.to/natures-answer-wood-betony',
        rating: '4.6/5',
        features: ['90 capsules', '250mg per serving', 'Vegetarian', 'Quality brand']
      },
      {
        name: 'Frontier Co-op Wood Betony',
        description: 'Bulk wood betony herb',
        price: '$13.99',
        affiliateLink: 'https://amzn.to/frontier-wood-betony',
        rating: '4.5/5',
        features: ['16 oz bag', 'Organic', 'Bulk', 'Tea preparation']
      }
    ]
  },
  'hops': {
    title: 'Hops',
    subtitle: 'The Sleep Promoter',
    description: 'Hops (Humulus lupulus) are best known for beer brewing, but they\'re also a powerful natural sedative and sleep aid. They\'re particularly effective for insomnia and anxiety.',
    benefits: [
      'Promotes deep sleep',
      'Reduces anxiety and stress',
      'Natural sedative effects',
      'Supports hormonal balance',
      'Anti-inflammatory properties',
      'Estrogenic effects for women'
    ],
    traditionalUses: [
      'Insomnia and sleep disorders',
      'Anxiety and nervous tension',
      'Menopausal symptoms',
      'Restlessness and agitation',
      'Mild pain relief',
      'Traditional European remedy'
    ],
    preparation: 'Tea: 1-2 tsp dried herb per cup, steep 10-15 minutes. Tincture: 30-60 drops before bed. Capsules: 250-500mg daily.',
    safety: 'Generally safe. May cause drowsiness. Avoid with alcohol. May have estrogenic effects.',
    topProducts: [
      {
        name: 'Nature\'s Way Hops',
        description: 'Hops capsules for sleep support',
        price: '$16.99',
        affiliateLink: 'https://amzn.to/natures-way-hops',
        rating: '4.7/5',
        features: ['60 capsules', '250mg per serving', 'Vegetarian', 'Sleep support']
      },
      {
        name: 'Herb Pharm Hops',
        description: 'Liquid hops extract',
        price: '$24.99',
        affiliateLink: 'https://amzn.to/herb-pharm-hops',
        rating: '4.8/5',
        features: ['1 oz bottle', 'Alcohol-free', 'Concentrated', 'Sleep aid']
      },
      {
        name: 'Traditional Medicinals Hops Tea',
        description: 'Soothing hops tea blend',
        price: '$6.99',
        affiliateLink: 'https://amzn.to/traditional-hops-tea',
        rating: '4.6/5',
        features: ['16 tea bags', 'Caffeine-free', 'Sleep support', 'Easy to use']
      }
    ]
  },
  'magnolia-bark': {
    title: 'Magnolia Bark',
    subtitle: 'The Ancient Calm',
    description: 'Magnolia Bark (Magnolia officinalis) is a traditional Chinese herb known for its powerful anxiolytic properties. It\'s particularly effective for anxiety, stress, and sleep disorders.',
    benefits: [
      'Powerful anxiety relief',
      'Promotes restful sleep',
      'Reduces stress and tension',
      'Anti-inflammatory properties',
      'Supports digestive health',
      'Traditional Chinese medicine'
    ],
    traditionalUses: [
      'Anxiety and panic disorders',
      'Insomnia and sleep disorders',
      'Stress and nervous tension',
      'Digestive complaints',
      'Inflammatory conditions',
      'Traditional Chinese medicine'
    ],
    preparation: 'Capsules: 250-500mg daily. Tincture: 30-60 drops 2-3 times daily. Tea: 1-2 tsp dried bark per cup.',
    safety: 'Generally safe. May interact with sedatives. Avoid during pregnancy. Consult doctor if taking medications.',
    topProducts: [
      {
        name: 'NOW Foods Magnolia Bark',
        description: 'Magnolia bark extract capsules',
        price: '$22.99',
        affiliateLink: 'https://amzn.to/now-magnolia-bark',
        rating: '4.7/5',
        features: ['60 capsules', '250mg per serving', 'Vegetarian', 'Quality brand']
      },
      {
        name: 'Nature\'s Way Magnolia Bark',
        description: 'Traditional magnolia bark supplement',
        price: '$19.99',
        affiliateLink: 'https://amzn.to/natures-way-magnolia-bark',
        rating: '4.6/5',
        features: ['60 capsules', '200mg per serving', 'Vegetarian', 'Affordable']
      },
      {
        name: 'Herb Pharm Magnolia Bark',
        description: 'Liquid magnolia bark extract',
        price: '$28.99',
        affiliateLink: 'https://amzn.to/herb-pharm-magnolia-bark',
        rating: '4.8/5',
        features: ['1 oz bottle', 'Alcohol-free', 'Concentrated', 'Traditional formula']
      }
    ]
  },
  'schisandra': {
    title: 'Schisandra',
    subtitle: 'The Five-Flavored Berry',
    description: 'Schisandra (Schisandra chinensis) is a powerful adaptogenic herb from traditional Chinese medicine. It helps the body adapt to stress while supporting liver health and cognitive function.',
    benefits: [
      'Adaptogenic stress support',
      'Enhances cognitive function',
      'Supports liver health',
      'Improves physical endurance',
      'Balances energy levels',
      'Traditional Chinese medicine'
    ],
    traditionalUses: [
      'Stress adaptation and resilience',
      'Mental clarity and focus',
      'Liver support and detoxification',
      'Physical and mental endurance',
      'Energy balance',
      'Traditional Chinese medicine'
    ],
    preparation: 'Capsules: 500-1000mg daily. Tincture: 30-60 drops 2-3 times daily. Powder: 1-2 tsp daily.',
    safety: 'Generally safe. May cause stomach upset. Avoid during pregnancy. Safe for long-term use.',
    topProducts: [
      {
        name: 'NOW Foods Schisandra',
        description: 'Schisandra berry extract',
        price: '$24.99',
        affiliateLink: 'https://amzn.to/now-schisandra',
        rating: '4.7/5',
        features: ['60 capsules', '500mg per serving', 'Vegetarian', 'Quality brand']
      },
      {
        name: 'Nature\'s Way Schisandra',
        description: 'Traditional schisandra supplement',
        price: '$21.99',
        affiliateLink: 'https://amzn.to/natures-way-schisandra',
        rating: '4.6/5',
        features: ['60 capsules', '400mg per serving', 'Vegetarian', 'Affordable']
      },
      {
        name: 'Herb Pharm Schisandra',
        description: 'Liquid schisandra extract',
        price: '$26.99',
        affiliateLink: 'https://amzn.to/herb-pharm-schisandra',
        rating: '4.8/5',
        features: ['1 oz bottle', 'Alcohol-free', 'Concentrated', 'Traditional formula']
      }
    ]
  },
  'gotu-kola': {
    title: 'Gotu Kola',
    subtitle: 'The Brain Tonic',
    description: 'Gotu Kola (Centella asiatica) is a traditional Ayurvedic herb known as the "herb of longevity." It\'s particularly effective for cognitive enhancement, memory, and nervous system support.',
    benefits: [
      'Enhances memory and cognition',
      'Reduces anxiety and stress',
      'Supports nervous system',
      'Promotes wound healing',
      'Improves circulation',
      'Traditional Ayurvedic remedy'
    ],
    traditionalUses: [
      'Memory and cognitive enhancement',
      'Anxiety and stress relief',
      'Nervous system support',
      'Wound healing and skin health',
      'Circulation improvement',
      'Traditional Ayurvedic medicine'
    ],
    preparation: 'Capsules: 500-1000mg daily. Tincture: 30-60 drops 2-3 times daily. Powder: 1-2 tsp daily.',
    safety: 'Very safe. May cause drowsiness. Safe for long-term use. Gentle herb.',
    topProducts: [
      {
        name: 'NOW Foods Gotu Kola',
        description: 'Gotu kola extract capsules',
        price: '$18.99',
        affiliateLink: 'https://amzn.to/now-gotu-kola',
        rating: '4.7/5',
        features: ['60 capsules', '500mg per serving', 'Vegetarian', 'Quality brand']
      },
      {
        name: 'Nature\'s Way Gotu Kola',
        description: 'Traditional gotu kola supplement',
        price: '$16.99',
        affiliateLink: 'https://amzn.to/natures-way-gotu-kola',
        rating: '4.6/5',
        features: ['60 capsules', '400mg per serving', 'Vegetarian', 'Affordable']
      },
      {
        name: 'Herb Pharm Gotu Kola',
        description: 'Liquid gotu kola extract',
        price: '$24.99',
        affiliateLink: 'https://amzn.to/herb-pharm-gotu-kola',
        rating: '4.8/5',
        features: ['1 oz bottle', 'Alcohol-free', 'Concentrated', 'Traditional formula']
      }
    ]
  },
  'bacopa': {
    title: 'Bacopa',
    subtitle: 'The Memory Enhancer',
    description: 'Bacopa (Bacopa monnieri) is a traditional Ayurvedic herb known for its powerful cognitive-enhancing properties. It\'s particularly effective for memory, learning, and anxiety relief.',
    benefits: [
      'Enhances memory and learning',
      'Reduces anxiety and stress',
      'Improves cognitive function',
      'Supports brain health',
      'Antioxidant properties',
      'Traditional Ayurvedic remedy'
    ],
    traditionalUses: [
      'Memory and learning enhancement',
      'Anxiety and stress relief',
      'Cognitive function support',
      'ADHD and attention issues',
      'Brain health and protection',
      'Traditional Ayurvedic medicine'
    ],
    preparation: 'Capsules: 300-600mg daily. Tincture: 30-60 drops 2-3 times daily. Powder: 1-2 tsp daily.',
    safety: 'Very safe. May cause stomach upset. Safe for long-term use. Take with food.',
    topProducts: [
      {
        name: 'NOW Foods Bacopa',
        description: 'Bacopa monnieri extract',
        price: '$22.99',
        affiliateLink: 'https://amzn.to/now-bacopa',
        rating: '4.8/5',
        features: ['60 capsules', '450mg per serving', 'Vegetarian', 'Quality brand']
      },
      {
        name: 'Nature\'s Way Bacopa',
        description: 'Traditional bacopa supplement',
        price: '$19.99',
        affiliateLink: 'https://amzn.to/natures-way-bacopa',
        rating: '4.7/5',
        features: ['60 capsules', '400mg per serving', 'Vegetarian', 'Affordable']
      },
      {
        name: 'Herb Pharm Bacopa',
        description: 'Liquid bacopa extract',
        price: '$26.99',
        affiliateLink: 'https://amzn.to/herb-pharm-bacopa',
        rating: '4.9/5',
        features: ['1 oz bottle', 'Alcohol-free', 'Concentrated', 'Traditional formula']
      }
    ]
  },
  'nettle-seed': {
    title: 'Nettle Seed',
    subtitle: 'The Nutritive Tonic',
    description: 'Nettle Seed (Urtica dioica) is a nutritive herb valued for its ability to support energy, adrenal function, and overall vitality.',
    benefits: [
      'Provides nutritive support',
      'Supports adrenal function',
      'Boosts energy and vitality',
      'Supports kidney health',
      'Promotes healthy skin',
      'Rich in minerals'
    ],
    traditionalUses: [
      'Adrenal support',
      'Fatigue and low energy',
      'Kidney health',
      'Skin conditions',
      'General vitality',
      'Nutritional tonic'
    ],
    preparation: 'Capsules: 200-400mg daily. Tincture: 30-60 drops 2-3 times daily. Sprinkle seeds on food.',
    safety: 'Very safe. Gentle enough for long-term use. No known contraindications.',
    topProducts: [
      {
        name: 'Herb Pharm Nettle Seed',
        description: 'High-quality nettle seed tincture',
        price: '$21.99',
        affiliateLink: 'https://amzn.to/herb-pharm-nettle-seed',
        rating: '4.7/5',
        features: ['1 oz bottle', 'Alcohol-free', 'Concentrated', 'Easy dosing']
      },
      {
        name: 'Frontier Co-op Nettle Seed',
        description: 'Bulk organic nettle seed',
        price: '$14.99',
        affiliateLink: 'https://amzn.to/frontier-nettle-seed',
        rating: '4.6/5',
        features: ['16 oz bag', 'Organic', 'Bulk', 'Nutritive tonic']
      },
      {
        name: 'Nature\'s Answer Nettle Seed',
        description: 'Nettle seed capsules',
        price: '$18.99',
        affiliateLink: 'https://amzn.to/natures-answer-nettle-seed',
        rating: '4.5/5',
        features: ['90 capsules', '400mg per serving', 'Vegetarian', 'Affordable']
      }
    ]
  },
  'borage': {
    title: 'Borage',
    subtitle: 'The Courage Herb',
    description: 'Borage (Borago officinalis) is a traditional herb known for its beautiful blue flowers and its ability to support adrenal function and emotional balance.',
    benefits: [
      'Supports adrenal function',
      'Promotes emotional balance',
      'Rich in gamma-linolenic acid (GLA)',
      'Supports skin health',
      'May help with hormonal balance',
      'Traditional courage herb'
    ],
    traditionalUses: [
      'Adrenal support and fatigue',
      'Emotional balance and courage',
      'Skin conditions and inflammation',
      'Hormonal balance',
      'Respiratory support',
      'Traditional European medicine'
    ],
    preparation: 'Capsules: 500-1000mg daily. Oil: 1-2 capsules daily. Tea: 1-2 tsp dried herb per cup.',
    safety: 'Generally safe. May cause mild liver issues in high doses. Avoid during pregnancy.',
    topProducts: [
      {
        name: 'NOW Foods Borage Oil',
        description: 'High-quality borage oil capsules',
        price: '$16.99',
        affiliateLink: 'https://amzn.to/now-borage-oil',
        rating: '4.6/5',
        features: ['60 capsules', '1000mg per serving', 'Vegetarian', 'Affordable']
      },
      {
        name: 'Nature\'s Way Borage Oil',
        description: 'Traditional borage oil supplement',
        price: '$19.99',
        affiliateLink: 'https://amzn.to/natures-way-borage',
        rating: '4.5/5',
        features: ['60 capsules', '1000mg per serving', 'Vegetarian', 'Quality brand']
      },
      {
        name: 'Herb Pharm Borage',
        description: 'Liquid borage extract',
        price: '$24.99',
        affiliateLink: 'https://amzn.to/herb-pharm-borage',
        rating: '4.7/5',
        features: ['1 oz bottle', 'Alcohol-free', 'Concentrated', 'Traditional formula']
      }
    ]
  },
  'lions-mane': {
    title: 'Lion\'s Mane',
    subtitle: 'The Smart Mushroom',
    description: 'Lion\'s Mane (Hericium erinaceus) is a unique medicinal mushroom that has gained recognition as one of the most effective natural supplements for brain health and cognitive function.',
    benefits: [
      'Enhances memory and learning',
      'Improves focus and concentration',
      'Supports brain health',
      'Promotes nerve growth',
      'Reduces brain fog',
      'Supports nervous system repair'
    ],
    traditionalUses: [
      'Cognitive enhancement',
      'Memory improvement',
      'Focus and concentration',
      'Nervous system support',
      'Brain fog relief',
      'Neuroprotective support'
    ],
    preparation: 'Capsules: 500-1000mg daily. Powder: 1-2 tsp daily. Take consistently for best results.',
    safety: 'Generally safe. May interact with blood thinners. Avoid during pregnancy. Consult your doctor if taking medications.',
    topProducts: [
      {
        name: 'Host Defense Lion\'s Mane',
        description: 'Premium lion\'s mane mushroom',
        price: '$39.99',
        affiliateLink: 'https://amzn.to/host-defense-lions-mane',
        rating: '4.8/5',
        features: ['60 capsules', 'Organic', 'Whole mushroom', 'Quality brand']
      },
      {
        name: 'NOW Foods Lion\'s Mane',
        description: 'High-potency lion\'s mane extract',
        price: '$32.99',
        affiliateLink: 'https://amzn.to/now-lions-mane',
        rating: '4.7/5',
        features: ['90 capsules', '500mg per serving', 'Vegetarian', 'Affordable']
      },
      {
        name: 'Nature\'s Way Lion\'s Mane',
        description: 'Traditional lion\'s mane supplement',
        price: '$26.99',
        affiliateLink: 'https://amzn.to/natures-way-lions-mane',
        rating: '4.6/5',
        features: ['60 capsules', '400mg per serving', 'Vegetarian', 'Popular brand']
      }
    ]
  },
  'damiana': {
    title: 'Damiana',
    subtitle: 'The Mood Enhancer',
    description: 'Damiana (Turnera diffusa) is a traditional herb native to Mexico and Central America, known for its mood-enhancing and aphrodisiac properties. It has been used for centuries to support emotional well-being and vitality.',
    benefits: [
      'Enhances mood and emotional well-being',
      'Supports healthy libido and energy',
      'Reduces anxiety and stress',
      'Traditional aphrodisiac properties',
      'May improve cognitive function',
      'Supports hormonal balance'
    ],
    traditionalUses: [
      'Mood enhancement and depression',
      'Low libido and sexual health',
      'Anxiety and nervous tension',
      'Fatigue and low energy',
      'Hormonal imbalances',
      'Digestive support'
    ],
    preparation: 'Tea: 1-2 tsp dried herb per cup, steep 5-10 minutes. Tincture: 30-60 drops 2-3 times daily.',
    safety: 'Generally safe. May interact with diabetes medications. Avoid during pregnancy. Consult your doctor if taking medications.',
    topProducts: [
      {
        name: 'Nature\'s Way Damiana',
        description: 'Traditional damiana herb capsules',
        price: '$13.99',
        affiliateLink: 'https://amzn.to/natures-way-damiana',
        rating: '4.5/5',
        features: ['60 capsules', 'Vegetarian', 'Traditional use', 'Affordable']
      },
      {
        name: 'Herb Pharm Damiana Tincture',
        description: 'Liquid damiana extract for easy dosing',
        price: '$19.99',
        affiliateLink: 'https://amzn.to/herb-pharm-damiana',
        rating: '4.6/5',
        features: ['1 oz bottle', 'Alcohol-free', 'Concentrated', 'Easy to dose']
      },
      {
        name: 'Traditional Medicinals Damiana Tea',
        description: 'Organic damiana tea for daily use',
        price: '$8.99',
        affiliateLink: 'https://amzn.to/traditional-damiana',
        rating: '4.4/5',
        features: ['16 tea bags', 'Organic', 'Caffeine-free', 'Traditional preparation']
      }
    ]
  },
  'feverfew': {
    title: 'Feverfew',
    subtitle: 'The Migraine Preventer',
    description: 'Feverfew (Tanacetum parthenium) is a traditional herb specifically used for migraine prevention and relief. It has been used for centuries to reduce inflammation and prevent blood vessel constriction in the brain.',
    benefits: [
      'Prevents and reduces migraine frequency',
      'Reduces inflammation in blood vessels',
      'May help with tension headaches',
      'Traditional pain relief',
      'Anti-inflammatory properties',
      'Supports vascular health'
    ],
    traditionalUses: [
      'Migraine prevention and treatment',
      'Tension headaches',
      'Inflammation and pain',
      'Fever and chills',
      'Arthritis and joint pain',
      'Digestive complaints'
    ],
    preparation: 'Capsules: 50-100mg daily for prevention. Tea: 1 tsp dried herb per cup, steep 5-10 minutes.',
    safety: 'Generally safe. May cause mouth ulcers in some. Avoid during pregnancy. May interact with blood thinners.',
    topProducts: [
      {
        name: 'Nature\'s Way Feverfew',
        description: 'Standardized feverfew capsules for migraine prevention',
        price: '$12.99',
        affiliateLink: 'https://amzn.to/natures-way-feverfew',
        rating: '4.6/5',
        features: ['60 capsules', '0.2% parthenolide', 'Vegetarian', 'Affordable']
      },
      {
        name: 'NOW Foods Feverfew',
        description: 'High-quality feverfew supplement',
        price: '$15.99',
        affiliateLink: 'https://amzn.to/now-feverfew',
        rating: '4.7/5',
        features: ['90 capsules', '500mg per serving', 'Quality brand', 'Good value']
      },
      {
        name: 'Herb Pharm Feverfew Tincture',
        description: 'Liquid feverfew extract for easy dosing',
        price: '$22.99',
        affiliateLink: 'https://amzn.to/herb-pharm-feverfew',
        rating: '4.5/5',
        features: ['1 oz bottle', 'Alcohol-free', 'Concentrated', 'Traditional preparation']
      }
    ]
  },
  'butterbur': {
    title: 'Butterbur',
    subtitle: 'The Natural Migraine Solution',
    description: 'Butterbur (Petasites hybridus) is a natural supplement that may reduce migraine frequency and severity. It also supports respiratory health and reduces inflammation through its unique petasin compounds.',
    benefits: [
      'Reduces migraine frequency and severity',
      'Supports respiratory health',
      'Reduces inflammation',
      'May help with allergies',
      'Supports vascular function',
      'Traditional pain relief'
    ],
    traditionalUses: [
      'Migraine prevention and treatment',
      'Allergies and hay fever',
      'Respiratory conditions',
      'Inflammation and pain',
      'Asthma support',
      'Digestive complaints'
    ],
    preparation: 'Capsules: 50-150mg daily. Take consistently for best results. Choose PA-free products.',
    safety: 'Choose PA-free products. May interact with blood thinners. Avoid during pregnancy. Consult your doctor.',
    topProducts: [
      {
        name: 'Nature\'s Way Butterbur',
        description: 'PA-free butterbur for migraine relief',
        price: '$15.99',
        affiliateLink: 'https://amzn.to/natures-way-butterbur',
        rating: '4.7/5',
        features: ['60 capsules', 'PA-free', '75mg per serving', 'Quality brand']
      },
      {
        name: 'NOW Foods Butterbur',
        description: 'High-quality PA-free butterbur supplement',
        price: '$18.99',
        affiliateLink: 'https://amzn.to/now-butterbur',
        rating: '4.8/5',
        features: ['90 capsules', 'PA-free', '100mg per serving', 'Vegetarian']
      },
      {
        name: 'Swanson Butterbur',
        description: 'Affordable PA-free butterbur option',
        price: '$12.99',
        affiliateLink: 'https://amzn.to/swanson-butterbur',
        rating: '4.5/5',
        features: ['60 capsules', 'PA-free', '50mg per serving', 'Budget-friendly']
      }
    ]
  },
  'maca': {
    title: 'Maca',
    subtitle: 'The Vitality Enhancer',
    description: 'Maca (Lepidium meyenii) is a powerful adaptogenic root native to the high Andes of Peru. Traditionally used for vitality, stress adaptation, and hormonal balance, it has been consumed for centuries to support natural energy and well-being.',
    benefits: [
      'Supports natural energy and vitality',
      'Helps the body adapt to stress',
      'Supports hormonal balance',
      'Traditional aphrodisiac properties',
      'Nutrient-dense superfood',
      'May improve mood and well-being'
    ],
    traditionalUses: [
      'Low energy and fatigue',
      'Stress adaptation and resilience',
      'Hormonal imbalances',
      'Low libido and vitality',
      'Mood enhancement',
      'General well-being and vitality'
    ],
    preparation: 'Powder: 1-3 tsp daily mixed in smoothies or food. Capsules: 500-1000mg daily. Start with small amounts and gradually increase.',
    safety: 'Generally safe when used appropriately. May cause mild digestive upset initially. Avoid if pregnant or breastfeeding. May interact with diabetes medications. Start with small doses to assess tolerance.',
    contraindications: 'Pregnancy, breastfeeding, hormone-sensitive conditions, diabetes (use with caution)',
    interactions: 'May interact with diabetes medications, hormone therapies',
    dosage: 'Powder: 1-3 tsp daily. Capsules: 500-1000mg daily',
    timing: 'Best taken in the morning or early afternoon',
    duration: 'Can be used long-term. Take breaks periodically',
    quality: 'Look for organic, gelatinized maca powder for better digestibility',
    storage: 'Store in a cool, dry place away from direct sunlight',
    sourcing: 'Choose Peruvian-grown maca for authenticity and quality',
    affiliates: [
      {
        name: 'Navitas Organics Maca Powder',
        url: 'https://amzn.to/navitas-maca',
        price: '$19.99',
        description: 'Organic gelatinized maca powder'
      }
    ],
    topProducts: [
      {
        name: 'Navitas Organics Maca Powder',
        description: 'Organic gelatinized maca powder for optimal absorption',
        price: '$19.99',
        affiliateLink: 'https://amzn.to/navitas-maca',
        rating: '4.5',
        features: [
          'Organic and non-GMO',
          'Gelatinized for better digestibility',
          'Rich in nutrients and minerals',
          'Traditional Peruvian sourcing'
        ]
      },
      {
        name: 'Terrasoul Superfoods Maca Powder',
        description: 'Premium organic maca root powder',
        price: '$16.99',
        affiliateLink: 'https://amzn.to/terrasoul-maca',
        rating: '4.4',
        features: [
          '100% organic maca root',
          'Raw and unprocessed',
          'High nutrient content',
          'Fair trade certified'
        ]
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
            {/* Enhanced Benefits Section */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">🌟 Key Benefits & Research Highlights</h2>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-800 mb-2">Primary Benefits</h3>
                  <ul className="space-y-2">
                    {herb.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-purple-500 mr-3 mt-1">✓</span>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Traditional Wisdom</h3>
                  <p className="text-gray-700 text-sm mb-3">
                    This herb has been valued for centuries across multiple cultures for its gentle yet effective properties. 
                    Traditional healers have long recognized its ability to support natural healing processes.
                  </p>
                  <ul className="space-y-1">
                    {herb.traditionalUses.map((use, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        <span className="text-gray-700 text-sm">{use}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Enhanced Safety Section */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">🛡️ Safety & Usage Guidelines</h2>
              <div className="space-y-4">
                {/* Positive Safety Info */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">✅ Generally Safe For</h3>
                  <p className="text-green-700 text-sm">
                    Most healthy adults can safely use this herb when following recommended dosages. 
                    It has a long history of safe use in traditional medicine and is well-tolerated by most people.
                  </p>
                </div>

                {/* Important Warnings */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-800 mb-2">⚠️ Important Safety Information</h3>
                  <div className="space-y-2 text-sm text-red-700">
                    <div className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span><strong>Medical Consultation Required:</strong> Always consult with a qualified healthcare professional before starting any herbal supplement.</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span><strong>Drug Interactions:</strong> Herbs can interact with prescription medications, over-the-counter drugs, and other supplements.</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span><strong>Pregnancy & Nursing:</strong> Many herbs are not recommended during pregnancy or while breastfeeding.</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span><strong>Individual Responses:</strong> Everyone responds differently to herbs. Start slowly and monitor for any adverse reactions.</span>
                    </div>
                  </div>
                </div>

                {/* Specific Safety Info */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-800 mb-2">📋 Specific Considerations</h3>
                  <p className="text-orange-700 text-sm">{herb.safety}</p>
                </div>
              </div>
            </div>

            {/* Usage Guidelines */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <h3 className="font-semibold text-purple-800 mb-2">🌿 Preparation</h3>
                <p className="text-gray-700 text-sm">{herb.preparation}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <h3 className="font-semibold text-purple-800 mb-2">⏰ Best Time</h3>
                <p className="text-gray-700 text-sm">Evening or as needed for sleep support</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <h3 className="font-semibold text-purple-800 mb-2">💡 Tips</h3>
                <p className="text-gray-700 text-sm">Start with lower doses and gradually increase as needed. Consistency is key for best results.</p>
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
