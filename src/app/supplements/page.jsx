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
function getSupplements() {
    return __awaiter(this, void 0, void 0, function* () {
        const prisma = new PrismaClient();
        try {
            const supplements = yield prisma.supplement.findMany();
            return supplements;
        }
        catch (error) {
            console.error('Error fetching supplements:', error);
            return [];
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
export default function SupplementsPage() {
    return __awaiter(this, void 0, void 0, function* () {
        // Fetch supplements from database and sort alphabetically by name
        const supplements = yield getSupplements();
        const sortedSupplements = supplements.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        return (<div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Supplements</h1>
        <p className="text-lg text-gray-700 mb-8 text-center max-w-3xl mx-auto">
          Essential nutrients and compounds to support your nervous system health, 
          cognitive function, and overall wellness. Quality supplements can fill 
          nutritional gaps and enhance your natural healing processes.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedSupplements.map((supplement, index) => {
                var _a;
                return (<Link key={index} href={`/supplements/${supplement.slug}`} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-200 hover:scale-105">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">{supplement.name}</h3>
              <p className="text-gray-600 text-sm">{((_a = supplement.description) === null || _a === void 0 ? void 0 : _a.split('\n')[0]) || ''}</p>
            </Link>);
            })}
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
