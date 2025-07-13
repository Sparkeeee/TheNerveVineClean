"use client";

import Link from "next/link";

export default function VagusNervePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            Vagus Nerve Support
          </h1>
          <p className="text-xl text-blue-700 max-w-3xl mx-auto">
            Understanding and supporting your body's most important nerve for overall health and well-being
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Education */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                What is the Vagus Nerve?
              </h2>
              <p className="text-gray-700 mb-4">
                The vagus nerve is the longest cranial nerve in your body, running from your brainstem through your neck and into your chest and abdomen. It's often called the "wandering nerve" because of its extensive reach throughout your body.
              </p>
              <p className="text-gray-700 mb-4">
                This nerve is crucial for your parasympathetic nervous system - the "rest and digest" system that helps your body relax, recover, and maintain homeostasis. It controls many vital functions including heart rate, digestion, breathing, and immune response.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                Signs of Vagus Nerve Dysfunction
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Digestive issues (bloating, constipation, acid reflux)</li>
                <li>Heart rate variability problems</li>
                <li>Difficulty relaxing or feeling constantly stressed</li>
                <li>Poor immune function and frequent illness</li>
                <li>Inflammation throughout the body</li>
                <li>Mood disorders and anxiety</li>
                <li>Sleep disturbances</li>
                <li>Chronic fatigue</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                Natural Ways to Support Vagus Nerve Function
              </h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Deep Breathing Exercises</h3>
                  <p>Practice slow, deep breathing (4-7-8 technique) to activate the vagus nerve and promote relaxation.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Cold Exposure</h3>
                  <p>Cold showers or cold water face immersion can stimulate vagus nerve activity.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Meditation and Mindfulness</h3>
                  <p>Regular meditation practices can improve vagal tone and reduce stress responses.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Probiotics and Gut Health</h3>
                  <p>Supporting your gut microbiome can improve vagus nerve communication between gut and brain.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Omega-3 Fatty Acids</h3>
                  <p>Essential fatty acids support nerve function and reduce inflammation.</p>
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
                  <h3 className="font-semibold text-blue-700 mb-2">Omega-3 Fish Oil</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    High-quality fish oil supports nerve function and reduces inflammation
                  </p>
                  <a 
                    href="https://amzn.to/3example1" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    View on Amazon
                  </a>
                </div>

                <div className="border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-700 mb-2">Probiotics</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Support gut-brain axis and vagus nerve communication
                  </p>
                  <a 
                    href="https://amzn.to/3example2" 
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
                    Essential mineral for nerve function and relaxation
                  </p>
                  <a 
                    href="https://amzn.to/3example3" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    View on Amazon
                  </a>
                </div>

                <div className="border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-700 mb-2">L-Theanine</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Amino acid that promotes relaxation and reduces stress
                  </p>
                  <a 
                    href="https://amzn.to/3example4" 
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
                This information is for educational purposes only. Always consult with a healthcare provider before starting any new supplement regimen, especially if you have underlying health conditions or are taking medications.
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