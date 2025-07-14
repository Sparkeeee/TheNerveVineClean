"use client";

import Link from "next/link";

export default function DysbiosisPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Dysbiosis
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Understanding and restoring gut microbiome balance for optimal health
          </p>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Body Map
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Education */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                What is Dysbiosis?
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  Dysbiosis refers to an imbalance in your gut microbiome - the trillions of bacteria, 
                  fungi, and other microorganisms that live in your digestive tract. When this delicate 
                  ecosystem becomes disrupted, it can lead to a wide range of health issues.
                </p>
                <p className="text-gray-700 mb-4">
                  A healthy gut microbiome is essential for proper digestion, immune function, nutrient 
                  absorption, and even mental health through the gut-brain axis. Dysbiosis can occur due 
                  to poor diet, stress, antibiotics, infections, and other factors.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Signs and Symptoms
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Digestive Symptoms</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Bloating and gas</li>
                    <li>• Constipation or diarrhea</li>
                    <li>• Abdominal pain and cramping</li>
                    <li>• Food intolerances</li>
                    <li>• Nausea and indigestion</li>
                    <li>• Acid reflux</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Systemic Symptoms</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Fatigue and low energy</li>
                    <li>• Skin issues (acne, eczema)</li>
                    <li>• Frequent infections</li>
                    <li>• Autoimmune conditions</li>
                    <li>• Brain fog and poor concentration</li>
                    <li>• Mood swings and anxiety</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Natural Restoration Strategies
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Dietary Changes</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Take high-quality probiotics with diverse strains</li>
                    <li>• Eat prebiotic-rich foods (garlic, onions, asparagus)</li>
                    <li>• Include a variety of plant-based foods</li>
                    <li>• Incorporate fermented foods (sauerkraut, kimchi)</li>
                    <li>• Avoid processed foods and artificial sweeteners</li>
                    <li>• Stay well hydrated</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Lifestyle Support</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Practice stress management techniques</li>
                    <li>• Exercise regularly</li>
                    <li>• Get adequate sleep</li>
                    <li>• Avoid unnecessary antibiotics</li>
                    <li>• Consider gut-healing supplements</li>
                    <li>• Support gut-brain axis health</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Product Recommendations */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Recommended Supplements
              </h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Multi-Strain Probiotics</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Comprehensive probiotic blend with diverse beneficial bacteria strains
                  </p>
                  <a 
                    href="https://amzn.to/3dysbiosis-probiotics" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    View on Amazon →
                  </a>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Prebiotic Fiber</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Inulin or resistant starch to feed beneficial gut bacteria
                  </p>
                  <a 
                    href="https://amzn.to/3dysbiosis-prebiotics" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    View on Amazon →
                  </a>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">L-Glutamine</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Amino acid that supports gut lining integrity and repair
                  </p>
                  <a 
                    href="https://amzn.to/3dysbiosis-glutamine" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    View on Amazon →
                  </a>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Omega-3 Fish Oil</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Reduces inflammation and supports overall gut health
                  </p>
                  <a 
                    href="https://amzn.to/3dysbiosis-omega3" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    View on Amazon →
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-3">Related Conditions</h3>
              <div className="space-y-2">
                <Link 
                  href="/symptoms/digestive-health" 
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                >
                  → Digestive Health
                </Link>
                <Link 
                  href="/symptoms/leaky-gut" 
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                >
                  → Leaky Gut
                </Link>
                <Link 
                  href="/symptoms/ibs" 
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                >
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
    </div>
  );
} 