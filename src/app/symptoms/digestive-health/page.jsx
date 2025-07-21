"use client";
import Link from "next/link";
export default function DigestiveHealthPage() {
    return (<div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Digestive Health
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Supporting optimal digestion and gut health for overall wellness
          </p>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
            ← Back to Body Map
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Education */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Understanding Digestive Health
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  Your digestive system is responsible for breaking down food, absorbing nutrients, and 
                  eliminating waste. A healthy digestive system is essential for overall health, energy 
                  levels, immune function, and even mental well-being through the gut-brain connection.
                </p>
                <p className="text-gray-700 mb-4">
                  When digestion is compromised, it can lead to a wide range of symptoms including 
                  bloating, gas, constipation, diarrhea, nutrient deficiencies, and systemic inflammation 
                  that affects your entire body.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Common Digestive Issues
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Functional Issues</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Bloating and gas</li>
                    <li>• Constipation or diarrhea</li>
                    <li>• Acid reflux and heartburn</li>
                    <li>• Abdominal pain and cramping</li>
                    <li>• Food intolerances</li>
                    <li>• Nausea and indigestion</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Systemic Effects</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Fatigue and low energy</li>
                    <li>• Skin issues (acne, eczema)</li>
                    <li>• Mood changes and brain fog</li>
                    <li>• Nutrient deficiencies</li>
                    <li>• Weakened immune function</li>
                    <li>• Inflammation throughout body</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Natural Digestive Support
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Dietary Changes</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Eat slowly and chew thoroughly</li>
                    <li>• Include fiber-rich foods</li>
                    <li>• Stay well hydrated</li>
                    <li>• Limit processed foods and sugar</li>
                    <li>• Include probiotic-rich foods</li>
                    <li>• Avoid trigger foods</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Lifestyle Support</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Manage stress levels</li>
                    <li>• Exercise regularly</li>
                    <li>• Get adequate sleep</li>
                    <li>• Practice mindful eating</li>
                    <li>• Consider food sensitivity testing</li>
                    <li>• Support gut microbiome</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Product Recommendations */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Digestive Support Supplements
              </h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Probiotics</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Beneficial bacteria to support gut microbiome balance
                  </p>
                  <a href="https://amzn.to/3digestive-probiotics" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm">
                    View on Amazon →
                  </a>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Digestive Enzymes</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Natural enzymes to support food breakdown and absorption
                  </p>
                  <a href="https://amzn.to/3digestive-enzymes" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm">
                    View on Amazon →
                  </a>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Ginger Root</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Traditional digestive aid for nausea and stomach comfort
                  </p>
                  <a href="https://amzn.to/3digestive-ginger" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm">
                    View on Amazon →
                  </a>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Fiber Supplement</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Natural fiber to support regular bowel movements
                  </p>
                  <a href="https://amzn.to/3digestive-fiber" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm">
                    View on Amazon →
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-3">Related Conditions</h3>
              <div className="space-y-2">
                <Link href="/symptoms/dysbiosis" className="block text-blue-600 hover:text-blue-800 transition-colors">
                  → Dysbiosis
                </Link>
                <Link href="/symptoms/leaky-gut" className="block text-blue-600 hover:text-blue-800 transition-colors">
                  → Leaky Gut
                </Link>
                <Link href="/symptoms/ibs" className="block text-blue-600 hover:text-blue-800 transition-colors">
                  → IBS
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> This information is for educational purposes only and should not 
            replace professional medical advice. Always consult with a healthcare provider before starting 
            any new supplement regimen, especially if you have underlying health conditions or are taking 
            medications. The product links are affiliate links that support this educational content.
          </p>
        </div>
      </div>
    </div>);
}
