import Link from "next/link";

export default function SupplementsPage() {
  const supplements = [
    { name: "Omega-3", href: "/supplements/omega-3", description: "Essential fatty acids for brain health" },
    { name: "Vitamin D", href: "/supplements/vitamin-d", description: "Sunshine vitamin for mood and immunity" },
    { name: "Magnesium", href: "/supplements/magnesium", description: "Mineral for relaxation and sleep" },
    { name: "B-Complex", href: "/supplements/b-complex", description: "Energy and nervous system support" },
    { name: "L-Theanine", href: "/supplements/l-theanine", description: "Amino acid for calm focus" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Supplements</h1>
        
        <p className="text-lg text-gray-700 mb-8 text-center max-w-3xl mx-auto">
          Essential nutrients and compounds to support your nervous system health, 
          cognitive function, and overall wellness. Quality supplements can fill 
          nutritional gaps and enhance your natural healing processes.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {supplements.map((supplement, index) => (
            <Link 
              key={index} 
              href={supplement.href}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <h3 className="text-xl font-semibold text-blue-800 mb-2">{supplement.name}</h3>
              <p className="text-gray-600 text-sm">{supplement.description}</p>
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