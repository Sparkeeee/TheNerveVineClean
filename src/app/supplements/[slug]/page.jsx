var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { notFound } from 'next/navigation';
export const supplements = {
    'omega-3': {
        name: 'Omega-3 Fatty Acids',
        description: 'Omega-3 fatty acids are essential fats that your body cannot produce on its own. They are crucial for brain health, heart health, and overall well-being.',
        cautions: [
            'Supports brain function and memory',
            'Reduces inflammation throughout the body',
            'Supports heart health',
            'May help with mood and depression',
            'Supports eye health',
            'Important for fetal development during pregnancy'
        ],
        productFormulations: [
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
        name: 'Vitamin D',
        description: 'Vitamin D is a fat-soluble vitamin that plays a crucial role in many bodily functions. It\'s often called the "sunshine vitamin" because your body produces it when your skin is exposed to sunlight.',
        cautions: [
            'Supports bone health and calcium absorption',
            'Boosts immune system function',
            'May improve mood and reduce depression',
            'Supports muscle function',
            'Important for heart health',
            'May reduce risk of certain cancers'
        ],
        productFormulations: [
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
        name: 'Magnesium',
        description: 'Magnesium is an essential mineral that plays a role in over 300 enzymatic reactions in your body. It\'s particularly important for muscle and nerve function, blood sugar control, and bone health.',
        cautions: [
            'Helps relax muscles and reduce tension',
            'Supports healthy sleep patterns',
            'May reduce anxiety and stress',
            'Supports heart health',
            'Helps with muscle cramps',
            'Supports bone health'
        ],
        productFormulations: [
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
        name: 'B-Complex Vitamins',
        description: 'B-complex vitamins are a group of eight water-soluble vitamins that play essential roles in energy production, nervous system function, and overall cellular health.',
        cautions: [
            'Supports energy production and metabolism',
            'Essential for nervous system function',
            'Helps convert food into energy',
            'Supports brain health and cognitive function',
            'May reduce stress and anxiety',
            'Important for red blood cell formation'
        ],
        productFormulations: [
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
        name: 'L-Theanine',
        description: 'L-theanine is a unique amino acid found primarily in green tea that promotes relaxation without drowsiness. It\'s known for its ability to enhance focus while reducing stress.',
        cautions: [
            'Promotes calm focus and concentration',
            'Reduces stress and anxiety',
            'Improves sleep quality',
            'May enhance cognitive performance',
            'Supports relaxation without drowsiness',
            'May help with blood pressure'
        ],
        productFormulations: [
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
    },
    'melatonin': {
        name: 'Melatonin',
        description: 'Melatonin is a hormone naturally produced by the pineal gland that helps regulate the sleep-wake cycle. Supplemental melatonin is commonly used for insomnia, jet lag, and circadian rhythm disorders.',
        cautions: [
            'Helps regulate sleep-wake cycles',
            'May reduce time to fall asleep',
            'Supports circadian rhythm alignment',
            'Useful for jet lag and shift work',
            'May improve sleep quality in some cases',
            'Generally safe for short-term use'
        ],
        productFormulations: [
            {
                name: 'Natrol Melatonin',
                description: 'Fast dissolve tablets for quick absorption',
                price: '$9.99',
                affiliateLink: 'https://amzn.to/natrol-melatonin',
                rating: '4.7/5',
                features: ['Fast dissolve', '1mg, 3mg, 5mg options', 'Strawberry flavor']
            },
            {
                name: 'NOW Foods Melatonin',
                description: 'Vegetarian capsules, 3mg per serving',
                price: '$8.99',
                affiliateLink: 'https://amzn.to/now-melatonin',
                rating: '4.6/5',
                features: ['Vegetarian', '3mg per capsule', 'Affordable']
            },
            {
                name: 'Nature Made Melatonin',
                description: 'Trusted brand, 3mg tablets',
                price: '$10.99',
                affiliateLink: 'https://amzn.to/nature-made-melatonin',
                rating: '4.5/5',
                features: ['3mg per tablet', 'USP verified', 'Easy to swallow']
            }
        ]
    },
    'glycine': {
        name: 'Glycine',
        description: 'Glycine is a non-essential amino acid that supports healthy sleep, cognitive function, and metabolic processes. It is often used to improve sleep quality and promote relaxation.',
        cautions: [
            'May improve sleep quality',
            'Supports relaxation and calm',
            'Helps lower core body temperature for sleep',
            'Supports cognitive function',
            'Involved in collagen synthesis',
            'May support metabolic health'
        ],
        productFormulations: [
            {
                name: 'NOW Foods Glycine',
                description: 'Pure glycine powder for flexible dosing',
                price: '$13.99',
                affiliateLink: 'https://amzn.to/now-glycine',
                rating: '4.7/5',
                features: ['Pure powder', '1000mg per scoop', 'Non-GMO']
            },
            {
                name: 'BulkSupplements Glycine',
                description: 'Lab-tested, high-purity glycine powder',
                price: '$19.99',
                affiliateLink: 'https://amzn.to/bulksupplements-glycine',
                rating: '4.6/5',
                features: ['Lab-tested', 'Flexible dosing', 'Bulk packaging']
            },
            {
                name: 'Source Naturals Glycine',
                description: 'Tablets for convenient dosing',
                price: '$11.99',
                affiliateLink: 'https://amzn.to/source-naturals-glycine',
                rating: '4.5/5',
                features: ['Tablets', '1000mg per serving', 'Easy to take']
            }
        ]
    },
    'tryptophan': {
        name: 'L-Tryptophan',
        description: 'L-Tryptophan is an essential amino acid and precursor to serotonin and melatonin. It supports healthy mood, relaxation, and sleep quality.',
        cautions: [
            'Supports serotonin and melatonin production',
            'May improve mood and emotional well-being',
            'Promotes healthy sleep patterns',
            'May help with mild anxiety',
            'Supports relaxation',
            'Essential amino acid (must be obtained from diet)'
        ],
        productFormulations: [
            {
                name: 'NOW Foods L-Tryptophan',
                description: 'Pure tryptophan capsules for mood and sleep',
                price: '$18.99',
                affiliateLink: 'https://amzn.to/now-tryptophan',
                rating: '4.7/5',
                features: ['1000mg per serving', 'Vegetarian', 'Non-GMO']
            },
            {
                name: 'Doctor’s Best L-Tryptophan',
                description: 'High-quality tryptophan supplement',
                price: '$16.99',
                affiliateLink: 'https://amzn.to/doctors-best-tryptophan',
                rating: '4.6/5',
                features: ['500mg per capsule', 'Tested for purity', 'Affordable']
            },
            {
                name: 'Source Naturals L-Tryptophan',
                description: 'Trusted brand for sleep support',
                price: '$19.99',
                affiliateLink: 'https://amzn.to/source-naturals-tryptophan',
                rating: '4.5/5',
                features: ['500mg per tablet', 'Vegetarian', 'Quality tested']
            }
        ]
    },
    'l-tyrosine': {
        name: 'L-Tyrosine',
        description: 'L-Tyrosine is a non-essential amino acid that supports the production of dopamine, norepinephrine, and thyroid hormones. It is used to promote focus, alertness, and stress resilience.',
        cautions: [
            'Supports dopamine and norepinephrine synthesis',
            'May improve focus and mental performance',
            'Helps with stress adaptation',
            'Supports thyroid hormone production',
            'May reduce fatigue during stress',
            'Non-essential amino acid (body can synthesize)'
        ],
        productFormulations: [
            {
                name: 'NOW Foods L-Tyrosine',
                description: 'Pure tyrosine capsules for focus and stress',
                price: '$13.99',
                affiliateLink: 'https://amzn.to/now-tyrosine',
                rating: '4.7/5',
                features: ['500mg per capsule', 'Vegetarian', 'Non-GMO']
            },
            {
                name: 'Doctor’s Best L-Tyrosine',
                description: 'High-quality tyrosine supplement',
                price: '$12.99',
                affiliateLink: 'https://amzn.to/doctors-best-tyrosine',
                rating: '4.6/5',
                features: ['500mg per capsule', 'Tested for purity', 'Affordable']
            },
            {
                name: 'Source Naturals L-Tyrosine',
                description: 'Trusted brand for cognitive support',
                price: '$14.99',
                affiliateLink: 'https://amzn.to/source-naturals-tyrosine',
                rating: '4.5/5',
                features: ['500mg per tablet', 'Vegetarian', 'Quality tested']
            }
        ]
    },
    'coq10': {
        name: 'CoQ10 (Ubiquinone)',
        description: 'Coenzyme Q10 (CoQ10) is a vitamin-like compound essential for mitochondrial energy production. It supports heart health, cellular energy, and antioxidant protection.',
        cautions: [
            'Supports cellular energy production',
            'Promotes heart and cardiovascular health',
            'Acts as a powerful antioxidant',
            'May improve exercise performance',
            'Supports healthy aging',
            'May help with statin-induced muscle symptoms'
        ],
        productFormulations: [
            {
                name: 'Qunol Ultra CoQ10',
                description: 'Highly absorbable CoQ10 softgels',
                price: '$27.99',
                affiliateLink: 'https://amzn.to/qunol-coq10',
                rating: '4.8/5',
                features: ['100mg per softgel', 'Water and fat soluble', 'Highly bioavailable']
            },
            {
                name: 'Doctor’s Best CoQ10',
                description: 'Science-based CoQ10 for heart health',
                price: '$21.99',
                affiliateLink: 'https://amzn.to/doctors-best-coq10',
                rating: '4.7/5',
                features: ['100mg per capsule', 'With BioPerine', 'Non-GMO']
            },
            {
                name: 'NOW Foods CoQ10',
                description: 'Trusted brand, value size',
                price: '$19.99',
                affiliateLink: 'https://amzn.to/now-coq10',
                rating: '4.6/5',
                features: ['100mg per capsule', 'Vegetarian', 'Quality tested']
            }
        ]
    }
};
export default function SupplementPage(_a) {
    return __awaiter(this, arguments, void 0, function* ({ params }) {
        const { slug } = yield params;
        const supplement = supplements[slug];
        if (!supplement) {
            notFound();
        }
        return (<div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-900 mb-2">{supplement.name}</h1>
          <p className="text-xl text-green-700 mb-4">{supplement.description}</p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{supplement.description}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Benefits & Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-green-800 mb-4">Key Benefits</h2>
              <ul className="space-y-3">
                {supplement.cautions.map((caution, index) => (<li key={index} className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">✓</span>
                    <span className="text-gray-700">{caution}</span>
                  </li>))}
              </ul>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <h3 className="font-semibold text-green-800 mb-2">Recommended Dosage</h3>
                <p className="text-gray-700">Follow label instructions (typically 1 capsule daily)</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <h3 className="font-semibold text-green-800 mb-2">Best Time to Take</h3>
                <p className="text-gray-700">Morning with breakfast</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <h3 className="font-semibold text-green-800 mb-2">Side Effects</h3>
                <p className="text-gray-700 text-sm">Generally safe. May cause bright yellow urine (normal). High doses may cause nausea.</p>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg p-6 shadow-lg h-fit">
            <h2 className="text-2xl font-semibold text-green-800 mb-6">Top Products</h2>
            <div className="space-y-4">
              {supplement.productFormulations.map((product, index) => (<div key={index} className="border border-green-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-green-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-green-600 font-bold">{product.price}</span>
                    <span className="text-yellow-500 text-sm">★ {product.rating}</span>
                  </div>
                  <ul className="text-xs text-gray-600 mb-4 space-y-1">
                    {product.features.map((feature, featureIndex) => (<li key={featureIndex} className="flex items-center">
                        <span className="text-green-500 mr-1">•</span>
                        {feature}
                      </li>))}
                  </ul>
                  <a href={product.affiliateLink} target="_blank" rel="noopener noreferrer" className="block w-full bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                    Check Price →
                  </a>
                </div>))}
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
    </div>);
    });
}
