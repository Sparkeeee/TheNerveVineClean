import Link from "next/link";

export default function SymptomsPage() {
  const symptoms = [
    // Original hardcoded symptoms (preserved)
    { name: "Insomnia", href: "/symptoms/insomnia", description: "Sleep issues and restlessness" },
    { name: "Depression", href: "/symptoms/depression", description: "Low mood and emotional support" },
    { name: "Anxiety", href: "/symptoms/anxiety", description: "Stress and nervous tension" },
    { name: "Poor Focus", href: "/symptoms/poor-focus", description: "Difficulty concentrating, maintaining attention, or staying focused on tasks" },
    { name: "Neck Tension", href: "/symptoms/neck-tension", description: "Muscle tightness, pain, or stiffness in the neck and upper shoulders (includes muscle tension and tension headache variants)" },
    { name: "Emotional Burnout", href: "/symptoms/burnout", description: "Chronic stress and emotional exhaustion affecting mood, energy, and motivation" },
    { name: "Thyroid Issues", href: "/symptoms/thyroid-issues", description: "Understanding and supporting thyroid function for energy and metabolism" },
    { name: "Blood Pressure Balance", href: "/symptoms/blood-pressure", description: "Support for healthy blood pressure levels" },
    { name: "Heart Muscle Support", href: "/symptoms/heart-support", description: "Support for heart muscle function and cardiovascular health" },
    { name: "Liver Function Support", href: "/symptoms/liver-detox", description: "Support for liver detoxification and function" },
    { name: "Hormonal Imbalances", href: "/symptoms/hormonal-imbalances", description: "Disruptions in hormone levels affecting health and wellbeing" },
    { name: "Adrenal Overload", href: "/symptoms/adrenal-overload", description: "Symptoms of excess stress and adrenal hormone output" },
    { name: "Adrenal Exhaustion", href: "/symptoms/adrenal-exhaustion", description: "Symptoms of depleted adrenal function from chronic stress" },
    { name: "Circadian Support", href: "/symptoms/circadian-support", description: "Support for healthy sleep-wake cycles and circadian rhythm" },
    { name: "Vagus Nerve Support", href: "/symptoms/vagus-nerve", description: "Understanding and supporting your body's most important nerve for overall health and well-being" },
    { name: "Dysbiosis", href: "/symptoms/dysbiosis", description: "Imbalance of gut bacteria affecting health" },
    { name: "Leaky Gut", href: "/symptoms/leaky-gut", description: "Understanding the connection between gut health and brain function" },
    { name: "IBS", href: "/symptoms/ibs", description: "Digestive disorder with abdominal pain and changes in bowel habits" },
    { name: "Stress", href: "/symptoms/stress", description: "Physical and emotional responses to challenging or demanding situations" },
    { name: "Fatigue", href: "/symptoms/fatigue", description: "Persistent tiredness and lack of energy" },
    { name: "Mood Swings", href: "/symptoms/mood-swings", description: "Rapid or unpredictable changes in mood, energy, or emotional state" },
    
    // Additional symptoms from the large symptoms object (preserved)
    { name: "Memory Loss", href: "/symptoms/memory-loss", description: "Difficulty remembering information or events" },
    { name: "Migraine Relief", href: "/symptoms/migraine", description: "Natural solutions for migraine management and prevention" },
    { name: "Digestive Health", href: "/symptoms/digestive-health", description: "Support for digestive function and gut health" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Symptoms & Conditions</h1>
        
        <p className="text-lg text-gray-700 mb-8 text-center max-w-3xl mx-auto">
          Explore natural solutions for various health concerns. Each symptom page provides 
          targeted herbal and supplement recommendations to support your wellness journey.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {symptoms.map((symptom, index) => (
            <Link 
              key={index} 
              href={symptom.href}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <h3 className="text-xl font-semibold text-blue-800 mb-2">{symptom.name}</h3>
              <p className="text-gray-600 text-sm">{symptom.description}</p>
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