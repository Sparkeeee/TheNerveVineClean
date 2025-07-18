"use client";
import Link from "next/link";
export default function LeakyGutPage() {
    return (<div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            Leaky Gut / Leaky Brain
          </h1>
          <p className="text-xl text-blue-700 max-w-3xl mx-auto">
            Understanding the connection between gut health and brain function
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Education */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                What is Leaky Gut?
              </h2>
              <p className="text-gray-700 mb-4">
                Leaky gut, or increased intestinal permeability, occurs when the tight junctions between cells in your intestinal lining become compromised, allowing undigested food particles, toxins, and bacteria to pass through into your bloodstream.
              </p>
              <p className="text-gray-700 mb-4">
                This can trigger an immune response and inflammation throughout your body, potentially affecting your brain function and contributing to various health issues.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                The Gut-Brain Connection
              </h2>
              <p className="text-gray-700 mb-4">
                Your gut and brain are connected through the gut-brain axis, a complex communication network involving the vagus nerve, immune system, and various signaling molecules. When your gut barrier is compromised, it can affect brain function and contribute to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Brain fog and cognitive issues</li>
                <li>Mood disorders and anxiety</li>
                <li>Inflammation in the brain</li>
                <li>Autoimmune responses</li>
                <li>Neurological symptoms</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                Common Signs and Symptoms
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Digestive Symptoms</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>Bloating and gas</li>
                    <li>Food sensitivities</li>
                    <li>IBS-like symptoms</li>
                    <li>Chronic diarrhea or constipation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Systemic Symptoms</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>Fatigue and low energy</li>
                    <li>Joint pain and inflammation</li>
                    <li>Skin issues (eczema, acne)</li>
                    <li>Autoimmune conditions</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Brain Symptoms</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>Brain fog and poor concentration</li>
                    <li>Mood swings and anxiety</li>
                    <li>Memory problems</li>
                    <li>Headaches and migraines</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Other Issues</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>Nutrient deficiencies</li>
                    <li>Weakened immune system</li>
                    <li>Chronic inflammation</li>
                    <li>Sleep disturbances</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                Natural Healing Strategies
              </h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Remove Triggers</h3>
                  <p>Eliminate inflammatory foods like gluten, dairy, processed foods, and alcohol that may be contributing to gut damage.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Support Gut Lining</h3>
                  <p>Use supplements like L-glutamine, collagen, and zinc to help repair and strengthen the intestinal barrier.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Restore Microbiome</h3>
                  <p>Take probiotics and eat prebiotic foods to support beneficial gut bacteria and improve gut-brain communication.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Reduce Inflammation</h3>
                  <p>Incorporate anti-inflammatory foods and supplements like omega-3 fatty acids and curcumin.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Manage Stress</h3>
                  <p>Practice stress-reduction techniques as chronic stress can worsen gut permeability and brain function.</p>
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
                  <h3 className="font-semibold text-blue-700 mb-2">L-Glutamine</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Essential amino acid that supports gut lining repair and integrity
                  </p>
                  <a href="https://amzn.to/3example10" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm">
                    View on Amazon
                  </a>
                </div>

                <div className="border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-700 mb-2">Collagen Peptides</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Supports gut lining structure and repair
                  </p>
                  <a href="https://amzn.to/3example11" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm">
                    View on Amazon
                  </a>
                </div>

                <div className="border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-700 mb-2">Probiotics</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Support healthy gut microbiome and gut-brain axis
                  </p>
                  <a href="https://amzn.to/3example12" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm">
                    View on Amazon
                  </a>
                </div>

                <div className="border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-700 mb-2">Omega-3 Fish Oil</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Reduces inflammation and supports brain health
                  </p>
                  <a href="https://amzn.to/3example13" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm">
                    View on Amazon
                  </a>
                </div>

                <div className="border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-700 mb-2">Zinc</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Essential mineral for gut lining integrity and immune function
                  </p>
                  <a href="https://amzn.to/3example14" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm">
                    View on Amazon
                  </a>
                </div>

                <div className="border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-700 mb-2">Curcumin</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Powerful anti-inflammatory that may help with gut and brain inflammation
                  </p>
                  <a href="https://amzn.to/3example15" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm">
                    View on Amazon
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-800 mb-3">Important Disclaimer</h3>
              <p className="text-sm text-blue-700">
                This information is for educational purposes only. Leaky gut is a complex condition that requires proper medical evaluation. Always consult with a healthcare provider for diagnosis and treatment recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Body Map */}
        <div className="text-center mt-12">
          <Link href="/" className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            ← Back to Interactive Body Map
          </Link>
        </div>
      </div>
    </div>);
}
