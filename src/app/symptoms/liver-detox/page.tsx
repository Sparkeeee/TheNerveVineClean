"use client";

import Link from "next/link";

export default function LiverDetoxPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Liver Detox Support
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Supporting your liver's natural detoxification processes for optimal health
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
                Understanding Liver Health
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  Your liver is your body's primary detoxification organ, responsible for filtering 
                  toxins, processing nutrients, and maintaining metabolic balance. A healthy liver is 
                  essential for energy production, hormone regulation, and overall wellness.
                </p>
                <p className="text-gray-700 mb-4">
                  Modern lifestyle factors like poor diet, stress, environmental toxins, and medications 
                  can burden the liver and impair its natural detoxification processes. Supporting liver 
                  health can improve energy, digestion, skin health, and overall vitality.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Signs of Liver Stress
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Physical Symptoms</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Fatigue and low energy</li>
                    <li>• Digestive issues and bloating</li>
                    <li>• Skin problems (acne, rashes)</li>
                    <li>• Weight gain around midsection</li>
                    <li>• Dark circles under eyes</li>
                    <li>• Body odor and bad breath</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Other Symptoms</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Brain fog and poor concentration</li>
                    <li>• Mood swings and irritability</li>
                    <li>• Hormonal imbalances</li>
                    <li>• Food sensitivities</li>
                    <li>• Poor sleep quality</li>
                    <li>• Headaches and migraines</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Natural Liver Support
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Dietary Support</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Eat plenty of leafy greens and cruciferous vegetables</li>
                    <li>• Include liver-supporting foods (beets, garlic, onions)</li>
                    <li>• Stay well hydrated with clean water</li>
                    <li>• Limit processed foods and added sugars</li>
                    <li>• Include healthy fats and proteins</li>
                    <li>• Consider intermittent fasting</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Lifestyle Support</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Exercise regularly to support circulation</li>
                    <li>• Manage stress levels</li>
                    <li>• Get adequate sleep</li>
                    <li>• Avoid excessive alcohol consumption</li>
                    <li>• Reduce exposure to environmental toxins</li>
                    <li>• Consider liver-supporting supplements</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Product Recommendations */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Liver Support Supplements
              </h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Milk Thistle</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Traditional herb for liver protection and regeneration
                  </p>
                  <a 
                    href="https://amzn.to/3liver-milkthistle" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    View on Amazon →
                  </a>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">N-Acetyl Cysteine</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Precursor to glutathione for liver detoxification
                  </p>
                  <a 
                    href="https://amzn.to/3liver-nac" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    View on Amazon →
                  </a>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Dandelion Root</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Natural diuretic and liver support herb
                  </p>
                  <a 
                    href="https://amzn.to/3liver-dandelion" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    View on Amazon →
                  </a>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">B-Complex Vitamins</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Essential for liver enzyme function and detoxification
                  </p>
                  <a 
                    href="https://amzn.to/3liver-bcomplex" 
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
                  href="/symptoms/dysbiosis" 
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                >
                  → Dysbiosis
                </Link>
                <Link 
                  href="/symptoms/fatigue" 
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                >
                  → Fatigue
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