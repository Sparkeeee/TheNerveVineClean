"use client";

import Link from "next/link";

export default function IBSPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            IBS (Irritable Bowel Syndrome)
          </h1>
          <p className="text-xl text-blue-700 max-w-3xl mx-auto">
            Understanding and managing irritable bowel syndrome for better digestive health
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Education */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                What is IBS?
              </h2>
              <p className="text-gray-700 mb-4">
                Irritable Bowel Syndrome (IBS) is a common functional gastrointestinal disorder that affects the large intestine. It's characterized by a group of symptoms that occur together, including abdominal pain and changes in bowel habits.
              </p>
              <p className="text-gray-700 mb-4">
                IBS is considered a "functional" disorder because it affects how the gut works, rather than causing structural damage. It's often related to gut-brain axis dysfunction and can be triggered by stress, diet, and other factors.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                Common IBS Symptoms
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Abdominal Pain</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>Cramping or bloating</li>
                    <li>Pain that improves after bowel movements</li>
                    <li>Pain that changes with eating</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Bowel Changes</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>Diarrhea or constipation</li>
                    <li>Alternating between both</li>
                    <li>Changes in stool consistency</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Other Symptoms</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>Excessive gas</li>
                    <li>Mucus in stool</li>
                    <li>Feeling of incomplete evacuation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Associated Issues</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>Fatigue</li>
                    <li>Anxiety or depression</li>
                    <li>Sleep disturbances</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                Natural Management Strategies
              </h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Dietary Changes</h3>
                  <p>Consider a low-FODMAP diet, eliminate trigger foods, and maintain regular meal times.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Stress Management</h3>
                  <p>Practice relaxation techniques, meditation, and regular exercise to reduce stress impact on gut.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Probiotics</h3>
                  <p>Support gut microbiome balance with specific probiotic strains that may help IBS symptoms.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Fiber Management</h3>
                  <p>Gradually increase soluble fiber intake while monitoring how your body responds.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Hydration</h3>
                  <p>Maintain adequate water intake to support digestive function and prevent constipation.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Product Recommendations */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">
                Recommended Supplements
              </h2>
              <div className="space-y-4">
                <div className="border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-700 mb-2">Probiotics for IBS</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Specific probiotic strains that may help with IBS symptoms
                  </p>
                  <a 
                    href="https://amzn.to/3example5" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    View on Amazon
                  </a>
                </div>

                <div className="border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-700 mb-2">Digestive Enzymes</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Support proper digestion and nutrient absorption
                  </p>
                  <a 
                    href="https://amzn.to/3example6" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    View on Amazon
                  </a>
                </div>

                <div className="border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-700 mb-2">Peppermint Oil</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Natural remedy that may help with abdominal pain and bloating
                  </p>
                  <a 
                    href="https://amzn.to/3example7" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    View on Amazon
                  </a>
                </div>

                <div className="border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-700 mb-2">L-Glutamine</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Amino acid that supports gut lining integrity and repair
                  </p>
                  <a 
                    href="https://amzn.to/3example8" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    View on Amazon
                  </a>
                </div>

                <div className="border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-700 mb-2">Magnesium</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    May help with constipation and muscle relaxation
                  </p>
                  <a 
                    href="https://amzn.to/3example9" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    View on Amazon
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-800 mb-3">Important Disclaimer</h3>
              <p className="text-sm text-blue-700">
                This information is for educational purposes only. IBS symptoms can vary greatly between individuals. Always consult with a healthcare provider for proper diagnosis and treatment recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Body Map */}
        <div className="text-center mt-12">
          <Link 
            href="/"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Back to Interactive Body Map
          </Link>
        </div>
      </div>
    </div>
  );
} 