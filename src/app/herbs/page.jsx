var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Link from "next/link";
import { PrismaClient } from '@prisma/client';
// Import the full symptoms list from the symptoms page
const symptoms = [
    { name: "Insomnia", href: "/symptoms/insomnia", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
    { name: "Depression", href: "/symptoms/depression", color: "bg-pink-100 text-pink-700 border-pink-200" },
    { name: "Anxiety", href: "/symptoms/anxiety", color: "bg-blue-100 text-blue-700 border-blue-200" },
    { name: "Poor Focus", href: "/symptoms/poor-focus", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    { name: "Tension Headaches", href: "/symptoms/muscle-tension", color: "bg-green-100 text-green-700 border-green-200" },
    { name: "Emotional Burnout", href: "/symptoms/burnout", color: "bg-orange-100 text-orange-700 border-orange-200" },
    { name: "Thyroid Issues", href: "/symptoms/thyroid-issues", color: "bg-purple-100 text-purple-700 border-purple-200" },
    { name: "Neck Tension", href: "/symptoms/neck-tension", color: "bg-teal-100 text-teal-700 border-teal-200" },
    { name: "Blood Pressure Balance", href: "/symptoms/blood-pressure", color: "bg-red-100 text-red-700 border-red-200" },
    { name: "Heart Muscle Support", href: "/symptoms/heart-support", color: "bg-rose-100 text-rose-700 border-rose-200" },
    { name: "Liver Function Support", href: "/symptoms/liver-detox", color: "bg-lime-100 text-lime-700 border-lime-200" },
    { name: "Hormonal Imbalances", href: "/symptoms/hormonal-imbalances", color: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200" },
    { name: "Adrenal Overload", href: "/symptoms/adrenal-overload", color: "bg-cyan-100 text-cyan-700 border-cyan-200" },
    { name: "Adrenal Exhaustion", href: "/symptoms/adrenal-exhaustion", color: "bg-amber-100 text-amber-700 border-amber-200" },
    { name: "Circadian Support", href: "/symptoms/circadian-support", color: "bg-sky-100 text-sky-700 border-sky-200" },
    { name: "Vagus Nerve Support", href: "/symptoms/vagus-nerve", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    { name: "Dysbiosis", href: "/symptoms/dysbiosis", color: "bg-gray-100 text-gray-700 border-gray-200" },
    { name: "Leaky Gut", href: "/symptoms/leaky-gut", color: "bg-stone-100 text-stone-700 border-stone-200" },
    { name: "IBS", href: "/symptoms/ibs", color: "bg-violet-100 text-violet-700 border-violet-200" },
    { name: "Stress", href: "/symptoms/stress", color: "bg-blue-200 text-blue-800 border-blue-300" },
    { name: "Fatigue", href: "/symptoms/fatigue", color: "bg-orange-200 text-orange-800 border-orange-300" },
    { name: "Mood Swings", href: "/symptoms/mood-swings", color: "bg-pink-200 text-pink-800 border-pink-300" },
];
// Helper to extract latin name from description if subtitle is missing
function getLatinName(description) {
    const match = description.match(/\(([^)]+)\)/);
    return match ? match[1] : '';
}
function getSymptomTag(usedFor) {
    // Find a matching symptom (case-insensitive)
    return symptoms.find(s => s.name.toLowerCase() === usedFor.toLowerCase());
}
function getHerbs() {
    return __awaiter(this, void 0, void 0, function* () {
        const prisma = new PrismaClient();
        try {
            const herbs = yield prisma.herb.findMany();
            return herbs;
        }
        catch (error) {
            console.error('Error fetching herbs:', error);
            return [];
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
export default function HerbsPage() {
    return __awaiter(this, void 0, void 0, function* () {
        // Fetch herbs from database and sort alphabetically by name
        const herbs = yield getHerbs();
        const sortedHerbs = herbs.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        return (<div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Herbal Medicines</h1>
        <p className="text-lg text-gray-700 mb-8 text-center max-w-3xl mx-auto">
          Discover the power of natural herbs for nervous system support, stress relief, 
          and overall wellness. Each herb has unique properties to support your health journey.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedHerbs.map((herb, index) => (<div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-200 hover:scale-105">
              <h3 className="text-xl font-semibold text-blue-800 mb-1">
                <Link href={`/herbs/${herb.slug}`}>{herb.name}</Link>
              </h3>
              {/* Latin name from database */}
              <p className="text-gray-500 text-sm italic mb-2">
                {herb.latinName || getLatinName(herb.description || '')}
              </p>
              <hr className="my-3 border-blue-100"/>
              {/* Tags for main indications (symptoms) */}
              <div className="flex flex-wrap gap-2 mt-4">
                {herb.indications && Array.isArray(herb.indications) && herb.indications.map((indication, i) => {
                    const tag = getSymptomTag(indication);
                    return tag ? (<Link key={i} href={tag.href} className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold mr-2 mb-2 ${tag.color} transition-colors duration-200 hover:brightness-110`}>
                      {tag.name}
                    </Link>) : null;
                })}
              </div>
              {/* Traditional Uses */}
              <div className="flex flex-wrap gap-2 mt-4">
                {herb.traditionalUses && Array.isArray(herb.traditionalUses) && herb.traditionalUses.map((use, i) => (<span key={i} className="inline-block px-3 py-1 rounded-full border text-xs font-semibold mr-2 mb-2 bg-gray-100 text-gray-700 border-gray-200">
                                            {use}
                  </span>))}
              </div>
            </div>))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg">
            ← Back to NerveVine
          </Link>
        </div>
      </div>
    </div>);
    });
}
