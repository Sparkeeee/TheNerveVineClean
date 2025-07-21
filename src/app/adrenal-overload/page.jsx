"use client";
import Link from "next/link";
export default function AdrenalOverloadPage() {
    return (<div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Adrenal Overload
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Understanding and managing adrenal stress overload for better health and vitality
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
                What is Adrenal Overload?
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  Adrenal overload occurs when your adrenal glands are constantly stimulated by stress, 
                  leading to excessive cortisol production and eventual burnout. This condition affects 
                  your energy levels, mood, sleep, and overall health.
                </p>
                <p className="text-gray-700 mb-4">
                  The adrenal glands, located on top of your kidneys, produce hormones that help 
                  regulate stress response, blood pressure, and metabolism. When constantly stressed, 
                  these glands can become overworked and dysfunctional.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Common Symptoms
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Physical Symptoms</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Fatigue and low energy</li>
                    <li>• Difficulty sleeping</li>
                    <li>• Weight gain around midsection</li>
                    <li>• High blood pressure</li>
                    <li>• Muscle weakness</li>
                    <li>• Frequent infections</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Mental Symptoms</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Anxiety and irritability</li>
                    <li>• Difficulty concentrating</li>
                    <li>• Mood swings</li>
                    <li>• Brain fog</li>
                    <li>• Depression</li>
                    <li>• Memory problems</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Natural Solutions
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Lifestyle Changes</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Practice stress management techniques (meditation, yoga)</li>
                    <li>• Get adequate sleep (7-9 hours per night)</li>
                    <li>• Exercise regularly but avoid overtraining</li>
                    <li>• Maintain a balanced diet</li>
                    <li>• Limit caffeine and alcohol</li>
                    <li>• Take regular breaks throughout the day</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Dietary Support</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Eat regular meals to stabilize blood sugar</li>
                    <li>• Include healthy fats and protein</li>
                    <li>• Reduce refined sugars and processed foods</li>
                    <li>• Stay hydrated throughout the day</li>
                    <li>• Consider adrenal-supporting foods</li>
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
                  <h3 className="font-semibold text-gray-800 mb-2">Adaptogenic Herbs</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Natural herbs that help your body adapt to stress
                  </p>
                  <a href="https://amzn.to/3adrenal-adaptogens" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm">
                    View on Amazon →
                  </a>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Vitamin C Complex</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    High-dose vitamin C to support adrenal function
                  </p>
                  <a href="https://amzn.to/3adrenal-vitaminc" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm">
                    View on Amazon →
                  </a>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">B-Complex Vitamins</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Essential B vitamins for energy and stress support
                  </p>
                  <a href="https://amzn.to/3adrenal-bcomplex" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm">
                    View on Amazon →
                  </a>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Magnesium</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Magnesium for relaxation and stress relief
                  </p>
                  <a href="https://amzn.to/3adrenal-magnesium" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm">
                    View on Amazon →
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-3">Related Conditions</h3>
              <div className="space-y-2">
                <Link href="/symptoms/adrenal-exhaustion" className="block text-blue-600 hover:text-blue-800 transition-colors">
                  → Adrenal Exhaustion
                </Link>
                <Link href="/symptoms/circadian-support" className="block text-blue-600 hover:text-blue-800 transition-colors">
                  → Circadian Support
                </Link>
                <Link href="/symptoms/stress" className="block text-blue-600 hover:text-blue-800 transition-colors">
                  → Stress Management
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
