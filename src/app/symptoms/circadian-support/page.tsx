"use client";

import Link from "next/link";

export default function CircadianSupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Circadian Support
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Optimizing your natural sleep-wake cycle for better health and energy
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
                Understanding Circadian Rhythms
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  Your circadian rhythm is your body&apos;s natural 24-hour internal clock that regulates 
                  sleep-wake cycles, hormone production, body temperature, and other physiological 
                  processes. When this rhythm is disrupted, it can affect your health, energy, and 
                  overall well-being.
                </p>
                <p className="text-gray-700 mb-4">
                  Modern lifestyle factors like artificial lighting, screen time, irregular schedules, 
                  and stress can disrupt your natural circadian rhythm, leading to sleep problems, 
                  fatigue, and other health issues.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Signs of Circadian Disruption
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Sleep Issues</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Difficulty falling asleep</li>
                    <li>• Waking up frequently at night</li>
                    <li>• Feeling tired despite adequate sleep</li>
                    <li>• Irregular sleep patterns</li>
                    <li>• Early morning awakenings</li>
                    <li>• Excessive daytime sleepiness</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Other Symptoms</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Low energy throughout the day</li>
                    <li>• Difficulty concentrating</li>
                    <li>• Mood swings and irritability</li>
                    <li>• Digestive issues</li>
                    <li>• Hormonal imbalances</li>
                    <li>• Weakened immune function</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Natural Circadian Support
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Light Exposure</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Get morning sunlight exposure (10-30 minutes)</li>
                    <li>• Reduce blue light exposure in the evening</li>
                    <li>• Use blue light filters on devices</li>
                    <li>• Create a dark sleep environment</li>
                    <li>• Consider light therapy for seasonal issues</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Lifestyle Habits</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Maintain consistent sleep-wake times</li>
                    <li>• Avoid large meals close to bedtime</li>
                    <li>• Exercise regularly but not too close to sleep</li>
                    <li>• Create a relaxing bedtime routine</li>
                    <li>• Keep your bedroom cool and quiet</li>
                    <li>• Limit caffeine and alcohol</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Product Recommendations */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Sleep & Circadian Support
              </h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Melatonin</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Natural sleep hormone for circadian regulation
                  </p>
                  <a 
                    href="https://amzn.to/3circadian-melatonin" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    View on Amazon →
                  </a>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Blue Light Blocking Glasses</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Reduce evening blue light exposure
                  </p>
                  <a 
                    href="https://amzn.to/3circadian-glasses" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    View on Amazon →
                  </a>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Magnesium</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Natural muscle relaxant for better sleep
                  </p>
                  <a 
                    href="https://amzn.to/3circadian-magnesium" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    View on Amazon →
                  </a>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">L-Theanine</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Amino acid for relaxation and sleep quality
                  </p>
                  <a 
                    href="https://amzn.to/3circadian-theanine" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    View on Amazon →
                  </a>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Sleep Tracker</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Monitor your sleep patterns and quality
                  </p>
                  <a 
                    href="https://amzn.to/3circadian-tracker" 
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
                  href="/symptoms/adrenal-exhaustion" 
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                >
                  → Adrenal Exhaustion
                </Link>
                <Link 
                  href="/symptoms/insomnia" 
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                >
                  → Insomnia
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