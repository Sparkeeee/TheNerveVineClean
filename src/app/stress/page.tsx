"use client";

import Link from "next/link";

export default function StressPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Stress Management
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Understanding and managing stress for better health and well-being
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
                Understanding Stress
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  Stress is your body&apos;s natural response to challenges and demands. While some stress 
                  can be beneficial and motivating, chronic or excessive stress can have negative 
                  effects on your physical and mental health.
                </p>
                <p className="text-gray-700 mb-4">
                  When stress becomes chronic, it can lead to a cascade of health issues including 
                  adrenal dysfunction, immune system suppression, digestive problems, and mental 
                  health challenges. Learning to manage stress effectively is crucial for overall wellness.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Signs of Chronic Stress
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Physical Symptoms</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Fatigue and low energy</li>
                    <li>• Headaches and muscle tension</li>
                    <li>• Sleep disturbances</li>
                    <li>• Digestive issues</li>
                    <li>• Weakened immune system</li>
                    <li>• Rapid heartbeat</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Mental Symptoms</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Anxiety and worry</li>
                    <li>• Irritability and mood swings</li>
                    <li>• Difficulty concentrating</li>
                    <li>• Memory problems</li>
                    <li>• Feeling overwhelmed</li>
                    <li>• Depression</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Natural Stress Management
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Lifestyle Strategies</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Practice regular exercise and movement</li>
                    <li>• Prioritize quality sleep (7-9 hours)</li>
                    <li>• Learn relaxation techniques (meditation, deep breathing)</li>
                    <li>• Maintain a balanced diet</li>
                    <li>• Set healthy boundaries</li>
                    <li>• Spend time in nature</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Mindfulness Practices</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Daily meditation or mindfulness</li>
                    <li>• Journaling and self-reflection</li>
                    <li>• Progressive muscle relaxation</li>
                    <li>• Yoga or tai chi</li>
                    <li>• Spending time with loved ones</li>
                    <li>• Engaging in hobbies and interests</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Product Recommendations */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Stress Support Supplements
              </h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Adaptogenic Herbs</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Natural herbs that help your body adapt to stress
                  </p>
                  <a 
                    href="https://amzn.to/3stress-adaptogens" 
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
                    Essential mineral for relaxation and stress relief
                  </p>
                  <a 
                    href="https://amzn.to/3stress-magnesium" 
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
                    Amino acid that promotes calmness and focus
                  </p>
                  <a 
                    href="https://amzn.to/3stress-theanine" 
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
                    Essential B vitamins for energy and nervous system support
                  </p>
                  <a 
                    href="https://amzn.to/3stress-bcomplex" 
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
                  href="/symptoms/burnout" 
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                >
                  → Burnout
                </Link>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-3">Supporting Herbs</h3>
              <div className="space-y-2">
                <Link 
                  href="/herbs/ashwagandha" 
                  className="block text-lime-600 hover:text-lime-800 transition-colors"
                >
                  → Ashwagandha (Adaptogen)
                </Link>
                <Link 
                  href="/herbs/reishi" 
                  className="block text-lime-600 hover:text-lime-800 transition-colors"
                >
                  → Reishi (Immune Support)
                </Link>
                <Link 
                  href="/herbs/holy-basil" 
                  className="block text-lime-600 hover:text-lime-800 transition-colors"
                >
                  → Holy Basil (Mental Clarity)
                </Link>
                <Link 
                  href="/herbs/siberian-ginseng" 
                  className="block text-lime-600 hover:text-lime-800 transition-colors"
                >
                  → Siberian Ginseng (Stress Resistance)
                </Link>
                <Link 
                  href="/herbs/lemon-balm" 
                  className="block text-lime-600 hover:text-lime-800 transition-colors"
                >
                  → Lemon Balm (Calming)
                </Link>
                <Link 
                  href="/herbs/skullcap" 
                  className="block text-lime-600 hover:text-lime-800 transition-colors"
                >
                  → Skullcap (Nervine)
                </Link>
                <Link 
                  href="/herbs/kava-kava" 
                  className="block text-lime-600 hover:text-lime-800 transition-colors"
                >
                  → Kava Kava (Anxiety Relief)
                </Link>
                <Link 
                  href="/herbs/passionflower" 
                  className="block text-lime-600 hover:text-lime-800 transition-colors"
                >
                  → Passionflower (GABA Enhancement)
                </Link>
                <Link 
                  href="/herbs/california-poppy" 
                  className="block text-lime-600 hover:text-lime-800 transition-colors"
                >
                  → California Poppy (Gentle Sedative)
                </Link>
                <Link 
                  href="/herbs/blue-vervain" 
                  className="block text-lime-600 hover:text-lime-800 transition-colors"
                >
                  → Blue Vervain (Nervous Tonic)
                </Link>
                <Link 
                  href="/herbs/wood-betony" 
                  className="block text-lime-600 hover:text-lime-800 transition-colors"
                >
                  → Wood Betony (Headache Relief)
                </Link>
                <Link 
                  href="/herbs/hops" 
                  className="block text-lime-600 hover:text-lime-800 transition-colors"
                >
                  → Hops (Sleep Support)
                </Link>
                <Link 
                  href="/herbs/magnolia-bark" 
                  className="block text-lime-600 hover:text-lime-800 transition-colors"
                >
                  → Magnolia Bark (Ancient Calm)
                </Link>
                <Link 
                  href="/herbs/schisandra" 
                  className="block text-lime-600 hover:text-lime-800 transition-colors"
                >
                  → Schisandra (Stress Resilience)
                </Link>
                <Link 
                  href="/herbs/gotu-kola" 
                  className="block text-lime-600 hover:text-lime-800 transition-colors"
                >
                  → Gotu Kola (Brain Tonic)
                </Link>
                <Link 
                  href="/herbs/bacopa" 
                  className="block text-lime-600 hover:text-lime-800 transition-colors"
                >
                  → Bacopa (Memory Enhancement)
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