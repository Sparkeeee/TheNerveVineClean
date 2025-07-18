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
import Image from 'next/image';
import { herbs } from '../../../data/herbs';
import Link from "next/link";
export default function HerbPage(_a) {
    return __awaiter(this, arguments, void 0, function* ({ params }) {
        const { slug } = yield params;
        const herb = herbs.find(h => h.slug === slug);
        if (!herb) {
            notFound();
        }
        return (<div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header with Image */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
          <div className="flex-shrink-0">
            <Image src={herb.heroImageUrl || '/images/placeholder.png'} alt={herb.name} width={200} height={200} className="rounded-full object-cover shadow-lg border-4 border-white"/>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-purple-900 mb-2">{herb.name}</h1>
            <div className="text-lg text-gray-600 max-w-3xl space-y-4">
              {herb.description.split('\\n\\n').map((paragraph, index) => (<p key={index}>{paragraph}</p>))}
            </div>
          </div>
        </div>

        {herb.indications && herb.indications.length > 0 && (<div className="my-4">
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
                    const match = symptoms.find(s => s.slug.toLowerCase() === indication.toLowerCase() ||
                        s.name.toLowerCase() === indication.toLowerCase());
                    return match ? (<Link key={idx} href={`/symptoms/${match.slug}`} className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold hover:bg-blue-200 transition">
                    {indication}
                  </Link>) : (<span key={idx} className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {indication}
                  </span>);
                })}
            </div>
          </div>)}

        {/* Traditional Uses Section */}
        {herb.traditionalUses && (<div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 my-4">
            <h3 className="font-semibold text-green-800 mb-2">Traditional Wisdom</h3>
            <ul className="space-y-1">
              {herb.traditionalUses.map((use, index) => (<li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span className="text-gray-700 text-sm">{use}</span>
                </li>))}
            </ul>
          </div>)}

        {/* Safety Section */}
        {herb.cautions && (<div className="bg-white rounded-lg p-6 shadow-lg my-4">
            <h2 className="text-2xl font-semibold text-purple-800 mb-4">🛡️ Safety & Usage Guidelines</h2>
            <div className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-800 mb-2">📋 Specific Considerations</h3>
                <p className="text-orange-700 text-sm">{herb.cautions}</p>
              </div>
            </div>
          </div>)}

        {herb.productFormulations && herb.productFormulations.length > 0 && (<div className="bg-white rounded-lg p-6 shadow-lg my-4">
            <h2 className="text-2xl font-semibold text-purple-800 mb-4">Top Products</h2>
            <div className="space-y-4">
              {herb.productFormulations.map((product, idx) => (<div key={idx} className="border border-purple-200 rounded-lg p-4 flex flex-col gap-2">
                  <div className="font-semibold">{product.type}</div>
                  <div className="text-sm text-gray-600">{product.qualityCriteria}</div>
                  {product.price && <div className="text-purple-600 font-bold">{product.price}</div>}
                  {product.affiliateLink && (<a href={product.affiliateLink} target="_blank" rel="noopener noreferrer" className="block w-full bg-purple-600 text-white text-center py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium mt-2">
                      Buy Now →
                    </a>)}
                </div>))}
            </div>
          </div>)}

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
    </div>);
    });
}
