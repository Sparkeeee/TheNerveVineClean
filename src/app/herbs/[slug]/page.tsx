import { notFound } from 'next/navigation';
import Image from 'next/image';
import { PrismaClient } from '@prisma/client';
import Link from "next/link";

async function getHerb(slug: string) {
  const prisma = new PrismaClient();
  try {
    const herb = await prisma.herb.findFirst({
      where: { slug: slug }
    });
    return herb;
  } catch (error) {
    console.error('Error fetching herb:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

// Helper to generate mock products for a given herb
function getMockProducts(herbName: string) {
  return [
    {
      name: `${herbName} Supreme by Herbalist's Choice`,
      description: `A premium, organic ${herbName.toLowerCase()} extract designed for maximum potency and purity. Trusted by herbalists for daily wellness support.`,
      price: '$24.99',
      tags: ['organic', 'high potency', 'vegan'],
      company: "Herbalist's Choice",
      affiliateLink: '#',
    },
    {
      name: `${herbName} Vitality Drops by Nature's Gold`,
      description: `Concentrated liquid ${herbName.toLowerCase()} for fast absorption and rapid results. Perfect for busy lifestyles and on-the-go support.`,
      price: '$19.99',
      tags: ['liquid', 'fast-acting', 'non-GMO'],
      company: "Nature's Gold",
      affiliateLink: '#',
    },
    {
      name: `${herbName} Pure Capsules by GreenLeaf Labs`,
      description: `Clean, lab-tested ${herbName.toLowerCase()} in easy-to-swallow capsules. Ideal for daily use and formulated for optimal bioavailability.`,
      price: '$17.99',
      tags: ['capsule', 'lab-tested', 'gluten-free'],
      company: 'GreenLeaf Labs',
      affiliateLink: '#',
    },
  ];
}

export default async function HerbPage({ params }: any) {
  const { slug } = params;
  const herb = await getHerb(slug);

  if (!herb) {
    notFound();
  }

  const mockProducts = getMockProducts(herb.name || 'Herb');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header with Image */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
          <div className="flex-shrink-0">
            <Image
              src={herb.heroImageUrl || '/images/placeholder.png'}
              alt={herb.name || 'Herb image'}
              width={200}
              height={200}
              className="rounded-full object-cover shadow-lg border-4 border-white"
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-purple-900 mb-2">{herb.name}</h1>
            {herb.latinName && (
              <p className="text-xl text-gray-600 italic mb-4">{herb.latinName}</p>
            )}
            <div className="text-lg text-gray-600 max-w-3xl space-y-4">
              {herb.description && herb.description.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        {herb.indications && Array.isArray(herb.indications) && herb.indications.length > 0 && (
          <div className="my-4">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">Common Uses</h3>
            <div className="flex flex-wrap gap-2">
              {herb.indications.map((indication, idx) => {
                // List of symptoms from the symptoms page
                const symptoms = [
                  { name: "Insomnia", slug: "insomnia" },
                  { name: "Depression", slug: "depression" },
                  { name: "Anxiety", slug: "anxiety" },
                  { name: "Poor Focus", slug: "poor-focus" },
                  { name: "Tension Headaches", slug: "muscle-tension" },
                  { name: "Emotional Burnout", slug: "burnout" },
                  { name: "Thyroid Issues", slug: "thyroid-issues" },
                  { name: "Neck Tension", slug: "neck-tension" },
                  { name: "Blood Pressure Balance", slug: "blood-pressure" },
                  { name: "Heart Muscle Support", slug: "heart-support" },
                  { name: "Liver Function Support", slug: "liver-detox" },
                  { name: "Hormonal Imbalances", slug: "hormonal-imbalances" },
                  { name: "Adrenal Overload", slug: "adrenal-overload" },
                  { name: "Adrenal Exhaustion", slug: "adrenal-exhaustion" },
                  { name: "Circadian Support", slug: "circadian-support" },
                  { name: "Vagus Nerve Support", slug: "vagus-nerve" },
                  { name: "Dysbiosis", slug: "dysbiosis" },
                  { name: "Leaky Gut", slug: "leaky-gut" },
                  { name: "IBS", slug: "ibs" },
                  { name: "Stress", slug: "stress" },
                  { name: "Fatigue", slug: "fatigue" },
                  { name: "Mood Swings", slug: "mood-swings" },
                ];
                const match = symptoms.find(s =>
                  s.slug.toLowerCase() === (indication as string)?.toLowerCase() ||
                  s.name.toLowerCase() === (indication as string)?.toLowerCase()
                );
                return match ? (
                  <Link
                    key={idx}
                    href={`/symptoms/${match.slug}`}
                    className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold hover:bg-blue-200 transition"
                  >
                    {indication as string}
                  </Link>
                ) : (
                  <span
                    key={idx}
                    className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold"
                  >
                    {indication as string}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Traditional Uses Section */}
        {herb.traditionalUses && Array.isArray(herb.traditionalUses) && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 my-4">
            <h3 className="font-semibold text-green-800 mb-2">Traditional Wisdom</h3>
            <ul className="space-y-1">
              {herb.traditionalUses.map((use, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span className="text-gray-700 text-sm">{use as string}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Safety Section */}
        {herb.cautions && (
          <div className="bg-white rounded-lg p-6 shadow-lg my-4">
            <h2 className="text-2xl font-semibold text-purple-800 mb-4">🛡️ Safety & Usage Guidelines</h2>
            <div className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-800 mb-2">📋 Specific Considerations</h3>
                <p className="text-orange-700 text-sm">{herb.cautions}</p>
              </div>
            </div>
          </div>
        )}

        {/* Top Products */}
        <div className="bg-white rounded-lg p-6 shadow-lg h-fit">
          <h2 className="text-2xl font-semibold text-green-800 mb-6">Top Products</h2>
          <div className="space-y-4">
            {mockProducts.map((product, idx) => (
              <div key={idx} className="border border-green-200 rounded-lg p-4 hover:shadow-md transition-shadow mb-4 bg-white">
                <h3 className="font-semibold text-green-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2 text-left">{product.description}</p>
                <img src="/images/closed-medical-brown-glass-bottle-yellow-vitamins.png" alt="Product" className="w-24 h-24 object-contain mb-2" />
                <div className="text-green-600 font-bold mb-2">{product.price}</div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {product.tags.map((tag: string, i: number) => (
                    <span key={i} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">{tag}</span>
                  ))}
                </div>
                <div className="text-xs text-gray-500 mb-1">by {product.company}</div>
                {product.affiliateLink && (
                  <a href={product.affiliateLink} target="_blank" rel="noopener noreferrer" className="block w-full bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium mt-2">Check Price →</a>
                )}
              </div>
            ))}
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
