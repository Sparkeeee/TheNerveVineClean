"use client";
import Link from "next/link";
export default function BurnoutPage() {
    return (<div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Burnout
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Understanding and recovering from physical and emotional exhaustion
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
                What is Burnout?
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  Burnout is a state of physical, emotional, and mental exhaustion caused by prolonged 
                  stress, overwork, or overwhelming responsibilities. It&apos;s characterized by feelings of 
                  energy depletion, increased mental distance from work, and reduced professional efficacy.
                </p>
                <p className="text-gray-700 mb-4">
                  Unlike regular stress, burnout is a chronic condition that develops over time and 
                  affects your ability to function effectively in both personal and professional life. 
                  It can impact your physical health, relationships, and overall quality of life.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Signs and Symptoms
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Physical Symptoms</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Chronic fatigue and exhaustion</li>
                    <li>• Frequent headaches or muscle tension</li>
                    <li>• Sleep disturbances</li>
                    <li>• Weakened immune system</li>
                    <li>• Digestive issues</li>
                    <li>• Changes in appetite</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Emotional Symptoms</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Feelings of cynicism and detachment</li>
                    <li>• Irritability and mood swings</li>
                    <li>• Anxiety and depression</li>
                    <li>• Decreased motivation</li>
                    <li>• Feelings of helplessness</li>
                    <li>• Reduced sense of accomplishment</li>
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
                  <h3 className="font-semibold text-gray-800 mb-2">Immediate Steps</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Take time off from work if possible</li>
                    <li>• Set clear boundaries and limits</li>
                    <li>• Practice self-care activities</li>
                    <li>• Seek support from friends and family</li>
                    <li>• Consider professional counseling</li>
                    <li>• Prioritize rest and relaxation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Long-term Recovery</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Develop healthy work-life balance</li>
                    <li>• Learn stress management techniques</li>
                    <li>• Establish regular exercise routine</li>
                    <li>• Improve sleep hygiene</li>
                    <li>• Practice mindfulness and meditation</li>
                    <li>• Consider career changes if necessary</li>
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
                  <h3 className="font-semibold text-gray-800 mb-2">Adaptogenic Herbs</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Natural herbs that help your body adapt to stress
                  </p>
                  <a href="https://amzn.to/3burnout-adaptogens" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm">
                    View on Amazon →
                  </a>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">B-Complex Vitamins</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Essential B vitamins for energy and stress support
                  </p>
                  <a href="https://amzn.to/3burnout-bcomplex" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm">
                    View on Amazon →
                  </a>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Magnesium</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Magnesium for relaxation and stress relief
                  </p>
                  <a href="https://amzn.to/3burnout-magnesium" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm">
                    View on Amazon →
                  </a>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Omega-3 Fatty Acids</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Essential fatty acids for brain health and mood support
                  </p>
                  <a href="https://amzn.to/3burnout-omega3" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm">
                    View on Amazon →
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-3">Related Conditions</h3>
              <div className="space-y-2">
                <Link href="/symptoms/adrenal-overload" className="block text-blue-600 hover:text-blue-800 transition-colors">
                  → Adrenal Overload
                </Link>
                <Link href="/symptoms/adrenal-exhaustion" className="block text-blue-600 hover:text-blue-800 transition-colors">
                  → Adrenal Exhaustion
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
