import Link from "next/link";

export default function SymptomsPage() {
  const symptoms = [
    { name: "Insomnia", href: "/symptoms/insomnia", description: "Sleep issues and restlessness" },
    { name: "Depression", href: "/symptoms/depression", description: "Low mood and emotional support" },
    { name: "Anxiety", href: "/symptoms/anxiety", description: "Stress and nervous tension" },
    { name: "Brain Fog", href: "/symptoms/brain-fog", description: "Mental clarity and focus" },
    { name: "Tension Headaches", href: "/symptoms/muscle-tension", description: "Muscle tension and pain" },
    { name: "Emotional Burnout", href: "/symptoms/burnout", description: "Stress-related exhaustion" },
    { name: "Thyroid Issues", href: "/symptoms/thyroid-issues", description: "Thyroid function support" },
    { name: "Neck Tension", href: "/symptoms/neck-tension", description: "Neck and shoulder tension" },
    { name: "Blood Pressure Balance", href: "/symptoms/blood-pressure", description: "Cardiovascular support" },
    { name: "Heart Muscle Support", href: "/symptoms/heart-support", description: "Heart health and function" },
    { name: "Liver Function Support", href: "/symptoms/liver-detox", description: "Liver detoxification" },
    { name: "Hormonal Imbalances", href: "/symptoms/digestive-health", description: "Hormone balance support" },
    { name: "Adrenal Overload", href: "/symptoms/adrenal-overload", description: "Stress hormone regulation" },
    { name: "Adrenal Exhaustion", href: "/symptoms/adrenal-exhaustion", description: "Adrenal fatigue support" },
    { name: "Circadian Support", href: "/symptoms/circadian-support", description: "Sleep-wake cycle regulation" },
    { name: "Vagus Nerve Support", href: "/symptoms/vagus-nerve", description: "Nervous system regulation" },
    { name: "Dysbiosis", href: "/symptoms/dysbiosis", description: "Gut microbiome balance" },
    { name: "Leaky Gut", href: "/symptoms/leaky-gut", description: "Intestinal barrier support" },
    { name: "IBS", href: "/symptoms/ibs", description: "Irritable bowel syndrome" },
    { name: "Stress", href: "/symptoms/stress", description: "Stress management and relief" },
    { name: "Fatigue", href: "/symptoms/fatigue", description: "Energy and vitality support" },
    { name: "Mood Swings", href: "/symptoms/mood-swings", description: "Emotional balance and stability" },
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