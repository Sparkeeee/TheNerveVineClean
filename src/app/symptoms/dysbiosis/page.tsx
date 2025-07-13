"use client";

import Link from "next/link";

export default function DysbiosisPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            Dysbiosis
          </h1>
          <p className="text-xl text-blue-700 max-w-3xl mx-auto">
            Understanding and restoring gut microbiome balance for optimal health
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Education */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                What is Dysbiosis?
              </h2>
              <p className="text-gray-700 mb-4">
                Dysbiosis refers to an imbalance in your gut microbiome - the trillions of bacteria, fungi, and other microorganisms that live in your digestive tract. When this delicate ecosystem becomes disrupted, it can lead to a wide range of health issues.
              </p>
              <p className="text-gray-700 mb-4">
                A healthy gut microbiome is essential for proper digestion, immune function, nutrient absorption, and even mental health through the gut-brain axis. Dysbiosis can occur due to poor diet, stress, antibiotics, infections, and other factors.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                Signs and Symptoms of Dysbiosis
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Digestive Symptoms</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>Bloating and gas</li>
                    <li>Constipation or diarrhea</li>
                    <li>Abdominal pain and cramping</li>
                    <li>Food intolerances</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Systemic Symptoms</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>Fatigue and low energy</li>
                    <li>Skin issues (acne, eczema)</li>
                    <li>Frequent infections</li>
                    <li>Autoimmune conditions</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Mental Health</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>Brain fog and poor concentration</li>
                    <li>Mood swings and anxiety</li>
                    <li>Depression</li>
                    <li>Sleep disturbances</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Other Issues</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>Nutrient deficiencies</li>
                    <li>Weight changes</li>
                    <li>Inflammation</li>
                    <li>Metabolic issues</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                Common Causes of Dysbiosis
              </h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Poor Diet</h3>
                  <p>High sugar, processed foods, low fiber, and artificial sweeteners can disrupt beneficial bacteria.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Antibiotics</h3>
                  <p>While necessary for treating infections, antibiotics can kill both harmful and beneficial bacteria.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Chronic Stress</h3>
                  <p>Stress hormones can alter gut bacteria composition and increase inflammation.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Infections</h3>
                  <p>Bacterial, viral, or parasitic infections can disrupt the microbiome balance.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Environmental Factors</h3>
                  <p>Exposure to toxins, chemicals, and pollutants can affect gut health.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                Natural Restoration Strategies
              </h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Probiotic Supplements</h3>
                  <p>Take high-quality probiotics with diverse strains to repopulate beneficial bacteria.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Prebiotic Foods</h3>
                  <p>Eat foods rich in prebiotic fiber to feed beneficial bacteria (garlic, onions, asparagus, bananas).</p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Diverse Diet</h3>
                  <p>Include a wide variety of plant-based foods to support microbiome diversity.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Fermented Foods</h3>
                  <p>Incorporate naturally fermented foods like sauerkraut, kimchi, and kefir.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Stress Management</h3>
                  <p>Practice relaxation techniques and regular exercise to support gut-brain axis health.</p>
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
                  <h3 className="font-semibold text-blue-700 mb-2">Multi-Strain Probiotics</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Comprehensive probiotic blend with diverse beneficial bacteria strains
                  </p>
                  <a 
                    href="https://amzn.to/3example16" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    View on Amazon
                  </a>
                </div>

                <div className="border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-700 mb-2">Prebiotic Fiber</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Inulin or resistant starch to feed beneficial gut bacteria
                  </p>
                  <a 
                    href="https://amzn.to/3example17" 
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
                    href="https://amzn.to/3example18" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    View on Amazon
                  </a>
                </div>

                <div className="border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-700 mb-2">Omega-3 Fish Oil</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Reduces inflammation and supports overall gut health
                  </p>
                  <a 
                    href="https://amzn.to/3example19" 
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
                    href="https://amzn.to/3example20" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    View on Amazon
                  </a>
                </div>

                <div className="border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-700 mb-2">Colostrum</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Natural immune support that may help restore gut balance
                  </p>
                  <a 
                    href="https://amzn.to/3example21" 
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
                This information is for educational purposes only. Dysbiosis can be complex and may require professional evaluation. Always consult with a healthcare provider for proper diagnosis and treatment recommendations.
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