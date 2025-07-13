"use client";

import Link from "next/link";

export default function AdrenalExhaustionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Adrenal Exhaustion
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Understanding adrenal fatigue and restoring your energy naturally
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
                What is Adrenal Exhaustion?
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  Adrenal exhaustion, also known as adrenal fatigue, occurs when your adrenal glands 
                  become depleted from chronic stress and can no longer produce adequate levels of 
                  cortisol and other stress hormones. This leads to persistent fatigue and a host of 
                  other symptoms.
                </p>
                <p className="text-gray-700 mb-4">
                  After prolonged periods of stress, the adrenal glands may become unable to meet the 
                  body&apos;s demands for cortisol, resulting in a state of exhaustion that affects your 
                  energy, mood, and overall well-being.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Key Symptoms
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Primary Symptoms</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Extreme fatigue that doesn&apos;t improve with sleep</li>
                    <li>• Difficulty getting out of bed in the morning</li>
                    <li>• Cravings for salty or sweet foods</li>
                    <li>• Low blood pressure</li>
                    <li>• Dizziness when standing up</li>
                    <li>• Decreased ability to handle stress</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Additional Symptoms</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Brain fog and difficulty concentrating</li>
                    <li>• Mood swings and irritability</li>
                    <li>• Weakened immune system</li>
                    <li>• Muscle weakness</li>
                    <li>• Sleep disturbances</li>
                    <li>• Loss of libido</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Recovery Strategies
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Rest and Recovery</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Prioritize sleep and rest</li>
                    <li>• Take naps when needed</li>
                    <li>• Reduce physical and mental stress</li>
                    <li>• Practice gentle exercise (walking, yoga)</li>
                    <li>• Avoid overexertion</li>
                    <li>• Consider adrenal glandular support</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Nutritional Support</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Eat regular, balanced meals</li>
                    <li>• Include healthy fats and proteins</li>
                    <li>• Add sea salt to support adrenal function</li>
                    <li>• Avoid caffeine and refined sugars</li>
                    <li>• Stay well hydrated</li>
                    <li>• Consider adrenal-supporting supplements</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Product Recommendations */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Recovery Supplements
              </h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Adrenal Glandular</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Natural adrenal gland support for recovery
                  </p>
                  <a 
                    href="https://amzn.to/3adrenal-glandular" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    View on Amazon →
                  </a>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Licorice Root</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Natural licorice for adrenal support
                  </p>
                  <a 
                    href="https://amzn.to/3adrenal-licorice" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    View on Amazon →
                  </a>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Pantothenic Acid</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Vitamin B5 for adrenal hormone production
                  </p>
                  <a 
                    href="https://amzn.to/3adrenal-b5" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    View on Amazon →
                  </a>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Rhodiola Rosea</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Adaptogenic herb for energy and stress
                  </p>
                  <a 
                    href="https://amzn.to/3adrenal-rhodiola" 
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
                  href="/symptoms/adrenal-overload" 
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                >
                  → Adrenal Overload
                </Link>
                <Link 
                  href="/symptoms/circadian-support" 
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                >
                  → Circadian Support
                </Link>
                <Link 
                  href="/symptoms/fatigue" 
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                >
                  → Chronic Fatigue
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