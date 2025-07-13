import Link from "next/link";

export default function HerbsPage() {
  const herbs = [
    // Adaptogens & Stress Support
    { name: "Ashwagandha", href: "/herbs/ashwagandha", description: "Adaptogen for stress and energy", category: "Adaptogens" },
    { name: "Holy Basil", href: "/herbs/holy-basil", description: "Adaptogenic stress support", category: "Adaptogens" },

    { name: "Korean Ginseng", href: "/herbs/korean-ginseng", description: "Traditional adaptogenic herb", category: "Adaptogens" },
    { name: "Siberian Ginseng", href: "/herbs/siberian-ginseng", description: "Stress resistance and energy", category: "Adaptogens" },
    { name: "Astragalus", href: "/herbs/astragalus", description: "Immune support and vitality", category: "Adaptogens" },
    { name: "Reishi", href: "/herbs/reishi", description: "Immune support and longevity", category: "Adaptogens" },
    
    // Nervines & Calming Herbs
    { name: "Lemon Balm", href: "/herbs/lemon-balm", description: "Calming and stress relief", category: "Nervines" },
    { name: "Chamomile", href: "/herbs/chamomile", description: "Gentle relaxation and sleep", category: "Nervines" },
    { name: "Lavender", href: "/herbs/lavender", description: "Aromatherapy and calm", category: "Nervines" },
    { name: "Valerian", href: "/herbs/valerian", description: "Natural sleep support", category: "Nervines" },
    { name: "Skullcap", href: "/herbs/skullcap", description: "Nervine for anxiety and stress", category: "Nervines" },
    { name: "Oatstraw", href: "/herbs/oatstraw", description: "Nourishing nervine herb", category: "Nervines" },
    
    // Mood & Energy Support
    { name: "St. John&apos;s Wort", href: "/herbs/st-johns-wort", description: "Mood support and depression", category: "Mood Support" },
    { name: "Damiana", href: "/herbs/damiana", description: "Mood enhancement and energy", category: "Mood Support" },
    { name: "Rhodiola", href: "/herbs/rhodiola", description: "Mental performance and fatigue", category: "Mood Support" },
    
    // Cognitive & Brain Health
    { name: "Ginkgo Biloba", href: "/herbs/ginkgo", description: "Cognitive function and memory", category: "Brain Health" },
    { name: "Lion&apos;s Mane", href: "/herbs/lions-mane", description: "Brain health and cognitive function", category: "Brain Health" },
    
    // Nutritive & Support Herbs
    { name: "Borage", href: "/herbs/borage", description: "Hormonal balance and skin health", category: "Nutritive" },
    { name: "Nettle Seed", href: "/herbs/nettle-seed", description: "Energy and adrenal support", category: "Nutritive" },
  ];

  const categories = [...new Set(herbs.map(herb => herb.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Herbal Medicines</h1>
        
        <p className="text-lg text-gray-700 mb-8 text-center max-w-3xl mx-auto">
          Discover the power of natural herbs for nervous system support, stress relief, 
          and overall wellness. Each herb has unique properties to support your health journey.
        </p>
        
        {categories.map(category => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
              {category}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {herbs
                .filter(herb => herb.category === category)
                .map((herb, index) => (
                  <Link 
                    key={index} 
                    href={herb.href}
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    <h3 className="text-xl font-semibold text-blue-800 mb-2">{herb.name}</h3>
                    <p className="text-gray-600 text-sm">{herb.description}</p>
                  </Link>
                ))}
            </div>
          </div>
        ))}
        
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