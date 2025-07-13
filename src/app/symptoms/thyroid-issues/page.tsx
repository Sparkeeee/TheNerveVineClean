"use client";

import Link from "next/link";

export default function ThyroidIssuesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Thyroid Health Support
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Understanding and supporting thyroid function for energy and metabolism
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
                Understanding Thyroid Function
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  Your thyroid gland regulates metabolism, energy production, body temperature, and 
                  many other vital functions. When thyroid function is compromised, it can affect 
                  every system in your body, leading to a wide range of symptoms.
                </p>
                <p className="text-gray-700 mb-4">
                  Thyroid issues can be caused by nutrient deficiencies, stress, environmental 
                  factors, autoimmune conditions, and other health imbalances. Supporting thyroid 
                  health through diet, lifestyle, and targeted supplements can help restore balance.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Common Thyroid Symptoms
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Hypothyroidism (Underactive)</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Fatigue and low energy</li>
                    <li>• Weight gain and difficulty losing weight</li>
                    <li>• Cold intolerance</li>
                    <li>• Dry skin and hair</li>
                    <li>• Constipation</li>
                    <li>• Depression and brain fog</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Hyperthyroidism (Overactive)</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Rapid heartbeat and palpitations</li>
                    <li>• Weight loss despite increased appetite</li>
                    <li>• Heat intolerance and sweating</li>
                    <li>• Anxiety and irritability</li>
                    <li>• Insomnia</li>
                    <li>• Tremors and nervousness</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Natural Thyroid Support
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Nutritional Support</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Ensure adequate iodine intake (sea vegetables, fish)</li>
                    <li>• Include selenium-rich foods (Brazil nuts, fish)</li>
                    <li>• Eat zinc-rich foods (oysters, pumpkin seeds)</li>
                    <li>• Include healthy fats and proteins</li>
                    <li>• Avoid goitrogenic foods in excess</li>
                    <li>• Consider thyroid-supporting supplements</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Lifestyle Support</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Manage stress levels (stress affects thyroid)</li>
                    <li>• Get adequate sleep and rest</li>
                    <li>• Exercise regularly but avoid overtraining</li>
                    <li>• Reduce exposure to environmental toxins</li>
                    <li>• Support gut health (affects thyroid conversion)</li>
                    <li>• Consider adrenal support (thyroid-adrenal connection)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Product Recommendations */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Thyroid Support Supplements
              </h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Iodine</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Essential mineral for thyroid hormone production
                  </p>
                  <a 
                    href="https://amzn.to/3thyroid-iodine" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    View on Amazon →
                  </a>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Selenium</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Critical for thyroid hormone conversion and function
                  </p>
                  <a 
                    href="https://amzn.to/3thyroid-selenium" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    View on Amazon →
                  </a>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Zinc</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Essential for thyroid hormone synthesis and conversion
                  </p>
                  <a 
                    href="https://amzn.to/3thyroid-zinc" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    View on Amazon →
                  </a>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Ashwagandha</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Adaptogenic herb that may support thyroid function
                  </p>
                  <a 
                    href="https://amzn.to/3thyroid-ashwagandha" 
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
                  href="/symptoms/adrenal-exhaustion" 
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                >
                  → Adrenal Exhaustion
                </Link>
                <Link 
                  href="/symptoms/fatigue" 
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                >
                  → Fatigue
                </Link>
                <Link 
                  href="/symptoms/depression" 
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                >
                  → Depression
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