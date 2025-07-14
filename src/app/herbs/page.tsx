import Link from "next/link";
import { herbs } from "../../data/herbs";

export default function HerbsPage() {
  // Sort herbs alphabetically by name
  const sortedHerbs = [...herbs].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Herbal Medicines</h1>
        <p className="text-lg text-gray-700 mb-8 text-center max-w-3xl mx-auto">
          Discover the power of natural herbs for nervous system support, stress relief, 
          and overall wellness. Each herb has unique properties to support your health journey.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedHerbs.map((herb, index) => (
            <Link 
              key={index} 
              href={`/herbs/${herb.slug}`}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <h3 className="text-xl font-semibold text-blue-800 mb-2">{herb.name}</h3>
              <p className="text-gray-600 text-sm">{herb.description}</p>
            </Link>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            ← Back to NerveVine
          </Link>
        </div>
      </div>
    </div>
  );
} 