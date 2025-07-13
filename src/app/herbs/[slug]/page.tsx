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
  'passionflower': {
    title: 'Passionflower',
    subtitle: 'The Calming Vine',
    description: 'Passionflower is a beautiful flowering vine that has been used for centuries to promote calm and relaxation. It\'s particularly effective for anxiety, insomnia, and nervous tension.',
    benefits: [
      'Reduces anxiety and nervous tension',
      'Promotes restful sleep',
      'Soothes digestive spasms',
      'May help with pain relief',
      'Supports nervous system health',
      'Gentle and non-habit forming'
    ],
    traditionalUses: [
      'Anxiety and nervous tension',
      'Insomnia and sleep disorders',
      'Digestive spasms',
      'Mild pain relief',
      'Restlessness and agitation',
      'Menstrual cramps'
    ],
    preparation: 'Tea: 1-2 tsp dried herb per cup, steep 10-15 minutes. Tincture: 30-60 drops 2-3 times daily. Capsules: 200-400mg daily.',
    safety: 'Generally safe. May cause drowsiness. Avoid with sedatives. Safe for short-term use.',
    topProducts: [
      {
        name: 'Traditional Medicinals Passionflower Tea',
        description: 'Calming passionflower tea',
        price: '$5.99',
        affiliateLink: 'https://amzn.to/traditional-passionflower',
        rating: '4.6/5',
        features: ['16 tea bags', 'Caffeine-free', 'Calming blend', 'Easy to use']
      },
      {
        name: 'Nature\'s Way Passionflower',
        description: 'Passionflower extract capsules',
        price: '$12.99',
        affiliateLink: 'https://amzn.to/natures-way-passionflower',
        rating: '4.5/5',
        features: ['100 capsules', '400mg per serving', 'Vegetarian', 'Affordable']
      },
      {
        name: 'Herb Pharm Passionflower',
        description: 'Liquid passionflower extract',
        price: '$16.99',
        affiliateLink: 'https://amzn.to/herb-pharm-passionflower',
        rating: '4.7/5',
        features: ['1 oz bottle', 'Alcohol-free', 'Concentrated', 'Easy dosing']
      }
    ]
  },
  'skullcap': {
    title: 'Skullcap',
    subtitle: 'The Nerve Tonic',
    description: 'Skullcap is a traditional nervine herb that has been used for centuries to support nervous system health and promote calm. It\'s particularly effective for anxiety, stress, and nervous tension.',
    benefits: [
      'Calms nervous tension',
      'Reduces anxiety and stress',
      'Supports nervous system health',
      'May help with muscle spasms',
      'Promotes relaxation',
      'Supports sleep quality'
    ],
    traditionalUses: [
      'Anxiety and nervous tension',
      'Stress and overstimulation',
      'Nervous system support',
      'Muscle tension and spasms',
      'Sleep disturbances',
      'Mild pain relief'
    ],
    preparation: 'Tea: 1-2 tsp dried herb per cup, steep 10-15 minutes. Tincture: 30-60 drops 2-3 times daily. Capsules: 200-400mg daily.',
    safety: 'Generally safe. May cause drowsiness. Avoid with sedatives. Safe for short-term use.',
    topProducts: [
      {
        name: 'Herb Pharm Skullcap',
        description: 'Liquid skullcap extract',
        price: '$18.99',
        affiliateLink: 'https://amzn.to/herb-pharm-skullcap',
        rating: '4.7/5',
        features: ['1 oz bottle', 'Alcohol-free', 'Concentrated', 'Easy dosing']
      },
      {
        name: 'Nature\'s Way Skullcap',
        description: 'Skullcap herb capsules',
        price: '$14.99',
        affiliateLink: 'https://amzn.to/natures-way-skullcap',
        rating: '4.6/5',
        features: ['100 capsules', '400mg per serving', 'Vegetarian', 'Affordable']
      },
      {
        name: 'Traditional Medicinals Skullcap Tea',
        description: 'Calming skullcap tea blend',
        price: '$6.99',
        affiliateLink: 'https://amzn.to/traditional-skullcap',
        rating: '4.5/5',
        features: ['16 tea bags', 'Caffeine-free', 'Calming blend', 'Easy to use']
      }
    ]
  },
  'motherwort': {
    title: 'Motherwort',
    subtitle: 'The Heart Herb',
    description: 'Motherwort is a traditional herb known for its ability to calm the heart and nervous system. It\'s particularly effective for anxiety, heart palpitations, and stress-related conditions.',
    benefits: [
      'Calms heart palpitations',
      'Reduces anxiety and stress',
      'Supports nervous system health',
      'May help with menstrual issues',
      'Promotes relaxation',
      'Supports cardiovascular health'
    ],
    traditionalUses: [
      'Heart palpitations and anxiety',
      'Nervous tension and stress',
      'Menstrual discomfort',
      'Nervous system support',
      'Mild cardiovascular support',
      'Sleep disturbances'
    ],
    preparation: 'Tea: 1-2 tsp dried herb per cup, steep 10-15 minutes. Tincture: 30-60 drops 2-3 times daily. Capsules: 200-400mg daily.',
    safety: 'Generally safe. May cause mild uterine stimulation. Avoid during pregnancy. Consult your doctor if taking heart medications.',
    topProducts: [
      {
        name: 'Herb Pharm Motherwort',
        description: 'Liquid motherwort extract',
        price: '$17.99',
        affiliateLink: 'https://amzn.to/herb-pharm-motherwort',
        rating: '4.6/5',
        features: ['1 oz bottle', 'Alcohol-free', 'Concentrated', 'Easy dosing']
      },
      {
        name: 'Nature\'s Way Motherwort',
        description: 'Motherwort herb capsules',
        price: '$13.99',
        affiliateLink: 'https://amzn.to/natures-way-motherwort',
        rating: '4.5/5',
        features: ['100 capsules', '400mg per serving', 'Vegetarian', 'Affordable']
      },
      {
        name: 'Traditional Medicinals Motherwort Tea',
        description: 'Calming motherwort tea',
        price: '$5.99',
        affiliateLink: 'https://amzn.to/traditional-motherwort',
        rating: '4.4/5',
        features: ['16 tea bags', 'Caffeine-free', 'Heart support', 'Easy to use']
      }
    ]
  },
  'oatstraw': {
    title: 'Oatstraw',
    subtitle: 'The Nerve Nourisher',
    description: 'Oatstraw is the green, milky tops of the oat plant harvested before the grain forms. It\'s a gentle, nourishing herb that supports nervous system health and promotes calm.',
    benefits: [
      'Nourishes the nervous system',
      'Reduces stress and anxiety',
      'Supports healthy sleep',
      'May help with skin conditions',
      'Gentle and safe for long-term use',
      'Supports overall vitality'
    ],
    traditionalUses: [
      'Nervous system nourishment',
      'Stress and anxiety relief',
      'Sleep support',
      'Skin conditions (topical)',
      'Convalescence and recovery',
      'General nervous system support'
    ],
    preparation: 'Tea: 1-2 tsp dried herb per cup, steep 10-15 minutes. Tincture: 30-60 drops 2-3 times daily. Capsules: 200-400mg daily.',
    safety: 'Very safe. Gentle enough for children and elderly. Safe for long-term use. No known contraindications.',
    topProducts: [
      {
        name: 'Herb Pharm Oatstraw',
        description: 'Liquid oatstraw extract',
        price: '$16.99',
        affiliateLink: 'https://amzn.to/herb-pharm-oatstraw',
        rating: '4.7/5',
        features: ['1 oz bottle', 'Alcohol-free', 'Concentrated', 'Easy dosing']
      },
      {
        name: 'Traditional Medicinals Oatstraw Tea',
        description: 'Nourishing oatstraw tea',
        price: '$5.99',
        affiliateLink: 'https://amzn.to/traditional-oatstraw',
        rating: '4.6/5',
        features: ['16 tea bags', 'Caffeine-free', 'Nervous system support', 'Easy to use']
      },
      {
        name: 'Nature\'s Way Oatstraw',
        description: 'Oatstraw herb capsules',
        price: '$12.99',
        affiliateLink: 'https://amzn.to/natures-way-oatstraw',
        rating: '4.5/5',
        features: ['100 capsules', '400mg per serving', 'Vegetarian', 'Affordable']
      }
    ]
  },
  'ginkgo': {
    title: 'Ginkgo Biloba',
    subtitle: 'The Memory Tree',
    description: 'Ginkgo biloba is one of the oldest living tree species, known for its distinctive fan-shaped leaves and powerful cognitive-enhancing properties. It\'s particularly effective for memory, concentration, and circulation.',
    benefits: [
      'Improves memory and cognitive function',
      'Enhances concentration and focus',
      'Supports healthy blood circulation',
      'May help with age-related cognitive decline',
      'Supports nervous system health',
      'Antioxidant protection'
    ],
    traditionalUses: [
      'Memory and cognitive enhancement',
      'Concentration and focus',
      'Age-related cognitive decline',
      'Poor circulation',
      'Tinnitus and vertigo',
      'Nervous system support'
    ],
    preparation: 'Capsules: 120-240mg daily. Extract: 60-120mg daily. Take with meals for better absorption.',
    safety: 'Generally safe. May increase bleeding risk. Avoid with blood thinners. Consult your doctor if taking medications.',
    topProducts: [
      {
        name: 'Nature\'s Way Ginkgo Biloba',
        description: 'Standardized ginkgo extract',
        price: '$18.99',
        affiliateLink: 'https://amzn.to/natures-way-ginkgo',
        rating: '4.7/5',
        features: ['60 capsules', '120mg per serving', 'Vegetarian', 'Popular brand']
      },
      {
        name: 'NOW Foods Ginkgo Biloba',
        description: 'High-potency ginkgo supplement',
        price: '$16.99',
        affiliateLink: 'https://amzn.to/now-ginkgo',
        rating: '4.6/5',
        features: ['100 capsules', '120mg per serving', 'Vegetarian', 'Affordable']
      },
      {
        name: 'Jarrow Formulas Ginkgo Biloba',
        description: 'Clinically studied ginkgo extract',
        price: '$22.99',
        affiliateLink: 'https://amzn.to/jarrow-ginkgo',
        rating: '4.8/5',
        features: ['120 capsules', '120mg per serving', 'Clinically studied', 'Quality brand']
      }
    ]
  },
  'siberian-ginseng': {
    title: 'Siberian Ginseng',
    subtitle: 'The Adaptogenic Root',
    description: 'Siberian Ginseng (Eleutherococcus senticosus) is a powerful adaptogenic herb that helps the body adapt to stress and maintain energy levels. Unlike true ginseng, it\'s more gentle and suitable for long-term use.',
    benefits: [
      'Increases stress resistance',
      'Boosts energy and stamina',
      'Supports immune function',
      'Improves mental performance',
      'Reduces fatigue',
      'Supports overall vitality'
    ],
    traditionalUses: [
      'Stress and burnout',
      'Low energy and fatigue',
      'Immune system support',
      'Mental performance',
      'Physical endurance',
      'General vitality'
    ],
    preparation: 'Capsules: 200-400mg daily. Tincture: 30-60 drops 1-2 times daily. Take in the morning.',
    safety: 'Generally safe. May cause mild stimulation. Avoid in the evening. Consult your doctor if taking blood pressure medications.',
    topProducts: [
      {
        name: 'Nature\'s Way Siberian Ginseng',
        description: 'Traditional Siberian ginseng supplement',
        price: '$19.99',
        affiliateLink: 'https://amzn.to/natures-way-siberian-ginseng',
        rating: '4.6/5',
        features: ['60 capsules', '400mg per serving', 'Vegetarian', 'Popular brand']
      },
      {
        name: 'NOW Foods Siberian Ginseng',
        description: 'High-potency Siberian ginseng extract',
        price: '$16.99',
        affiliateLink: 'https://amzn.to/now-siberian-ginseng',
        rating: '4.5/5',
        features: ['90 capsules', '400mg per serving', 'Vegetarian', 'Affordable']
      },
      {
        name: 'Gaia Herbs Siberian Ginseng',
        description: 'Organic Siberian ginseng root',
        price: '$23.99',
        affiliateLink: 'https://amzn.to/gaia-siberian-ginseng',
        rating: '4.7/5',
        features: ['60 capsules', 'Certified organic', '400mg per serving', 'Vegan']
      }
    ]
  },
  'astragalus': {
    title: 'Astragalus',
    subtitle: 'The Immune Guardian',
    description: 'Astragalus (Astragalus membranaceus) is a traditional Chinese herb known for its powerful immune-supporting properties. It\'s particularly effective for boosting immunity, energy, and overall vitality.',
    benefits: [
      'Supports immune system function',
      'Boosts energy and vitality',
      'Promotes healthy aging',
      'Supports cardiovascular health',
      'May help with fatigue',
      'Supports overall well-being'
    ],
    traditionalUses: [
      'Immune system support',
      'Low energy and fatigue',
      'Cardiovascular health',
      'Healthy aging',
      'Recovery from illness',
      'General vitality'
    ],
    preparation: 'Capsules: 200-400mg daily. Tea: 1-2 tsp dried root per cup, steep 10-15 minutes. Tincture: 30-60 drops 2-3 times daily.',
    safety: 'Generally safe. May interact with immune suppressants. Avoid during acute illness. Consult your doctor if taking medications.',
    topProducts: [
      {
        name: 'Nature\'s Way Astragalus',
        description: 'Traditional astragalus supplement',
        price: '$18.99',
        affiliateLink: 'https://amzn.to/natures-way-astragalus',
        rating: '4.6/5',
        features: ['60 capsules', '400mg per serving', 'Vegetarian', 'Popular brand']
      },
      {
        name: 'NOW Foods Astragalus',
        description: 'High-potency astragalus extract',
        price: '$15.99',
        affiliateLink: 'https://amzn.to/now-astragalus',
        rating: '4.5/5',
        features: ['90 capsules', '400mg per serving', 'Vegetarian', 'Affordable']
      },
      {
        name: 'Gaia Herbs Astragalus',
        description: 'Organic astragalus root',
        price: '$21.99',
        affiliateLink: 'https://amzn.to/gaia-astragalus',
        rating: '4.7/5',
        features: ['60 capsules', 'Certified organic', '400mg per serving', 'Vegan']
      }
    ]
  },
  'reishi': {
    title: 'Reishi',
    subtitle: 'The Mushroom of Immortality',
    description: 'Reishi (Ganoderma lucidum) is a revered medicinal mushroom in traditional Chinese medicine, known for supporting longevity, immune function, and stress resilience.',
    benefits: [
      'Supports immune system function',
      'Promotes longevity and vitality',
      'Reduces stress and fatigue',
      'Supports cardiovascular health',
      'Enhances overall energy',
      'Antioxidant protection'
    ],
    traditionalUses: [
      'Immune system strengthening',
      'Stress and fatigue relief',
      'Longevity and healthy aging',
      'Cardiovascular support',
      'Sleep quality improvement',
      'Overall vitality enhancement'
    ],
    preparation: 'Capsules: 500-1000mg daily. Powder: 1-2 tsp daily. Tea: 1-2 cups daily.',
    safety: 'Generally safe. May interact with blood thinners. Avoid during pregnancy. Consult your doctor if taking medications.',
    topProducts: [
      {
        name: 'Host Defense Reishi',
        description: 'Premium reishi mushroom supplement',
        price: '$34.99',
        affiliateLink: 'https://amzn.to/host-defense-reishi',
        rating: '4.8/5',
        features: ['60 capsules', 'Organic', 'Whole mushroom', 'Quality brand']
      },
      {
        name: 'NOW Foods Reishi',
        description: 'High-potency reishi extract',
        price: '$28.99',
        affiliateLink: 'https://amzn.to/now-reishi',
        rating: '4.6/5',
        features: ['90 capsules', '500mg per serving', 'Vegetarian', 'Affordable']
      },
      {
        name: 'Nature\'s Way Reishi',
        description: 'Traditional reishi supplement',
        price: '$22.99',
        affiliateLink: 'https://amzn.to/natures-way-reishi',
        rating: '4.5/5',
        features: ['60 capsules', '400mg per serving', 'Vegetarian', 'Popular brand']
      }
    ]
  },
  'damiana': {
    title: 'Damiana',
    subtitle: 'The Mood Enhancer',
    description: 'Damiana (Turnera diffusa) is a traditional herb native to Central and South America, known for its mood-enhancing and aphrodisiac properties.',
    benefits: [
      'Enhances mood and emotional well-being',
      'Supports natural energy and vitality',
      'Promotes healthy libido',
      'Reduces stress and anxiety',
      'Supports digestive health',
      'Promotes relaxation and calm'
    ],
    traditionalUses: [
      'Mood enhancement',
      'Energy and vitality',
      'Libido support',
      'Stress relief',
      'Digestive health',
      'Emotional balance'
    ],
    preparation: 'Tea: 1-2 tsp dried herb per cup, steep 10 minutes. Tincture: 30-60 drops 2-3 times daily.',
    safety: 'Generally safe. May interact with diabetes medications. Avoid during pregnancy. Consult your doctor if taking medications.',
    topProducts: [
      {
        name: 'Herb Pharm Damiana',
        description: 'High-quality damiana tincture',
        price: '$27.99',
        affiliateLink: 'https://amzn.to/herb-pharm-damiana',
        rating: '4.6/5',
        features: ['1 oz bottle', 'Alcohol-free', 'Concentrated', 'Easy dosing']
      },
      {
        name: 'Nature\'s Way Damiana',
        description: 'Traditional damiana supplement',
        price: '$19.99',
        affiliateLink: 'https://amzn.to/natures-way-damiana',
        rating: '4.5/5',
        features: ['100 capsules', '400mg per serving', 'Vegetarian', 'Affordable']
      },
      {
        name: 'Traditional Medicinals Damiana Tea',
        description: 'Mood-enhancing damiana tea',
        price: '$6.99',
        affiliateLink: 'https://amzn.to/traditional-damiana',
        rating: '4.4/5',
        features: ['16 tea bags', 'Caffeine-free', 'Easy to use', 'Gentle formula']
      }
    ]
  },
  'lions-mane': {
    title: "Lion's Mane",
    subtitle: 'The Smart Mushroom',
    description: "Lion's Mane (Hericium erinaceus) is a unique medicinal mushroom that has gained recognition as one of the most effective natural supplements for brain health and cognitive function.",
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
