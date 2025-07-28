import Link from "next/link";

export default function BrainFogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <nav className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to NerveVine
          </Link>
        </nav>
        
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Brain Fog & Cognitive Support</h1>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100">
          <p className="text-lg text-gray-700 mb-6">
            Brain fog can impact your daily life and productivity. Natural herbs and supplements 
            can help improve mental clarity, focus, and cognitive function by supporting 
            your nervous system and brain health.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">Cognitive Herbs</h2>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="text-lime-600 mr-2">✓</span>
                  <Link href="/herbs/lions-mane" className="text-blue-600 hover:text-blue-800">
                    Lion&apos;s Mane (Brain Health)
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="text-lime-600 mr-2">✓</span>
                  <Link href="/herbs/ginkgo" className="text-blue-600 hover:text-blue-800">
                    Ginkgo Biloba
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="text-lime-600 mr-2">✓</span>
                  <Link href="/herbs/ashwagandha" className="text-blue-600 hover:text-blue-800">
                    Ashwagandha
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="text-lime-600 mr-2">✓</span>
                  <Link href="/herbs/rhodiola" className="text-blue-600 hover:text-blue-800">
                    Rhodiola Rosea
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="text-lime-600 mr-2">✓</span>
                  <Link href="/herbs/holy-basil" className="text-blue-600 hover:text-blue-800">
                    Holy Basil
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-800 mb-4">Brain Health Supplements</h2>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="text-lime-600 mr-2">✓</span>
                  <Link href="/supplements/omega-3" className="text-blue-600 hover:text-blue-800">
                    Omega-3 Fatty Acids
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="text-lime-600 mr-2">✓</span>
                  <Link href="/supplements/b-complex" className="text-blue-600 hover:text-blue-800">
                    B-Complex Vitamins
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="text-lime-600 mr-2">✓</span>
                  <Link href="/supplements/vitamin-d" className="text-blue-600 hover:text-blue-800">
                    Vitamin D
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="text-lime-600 mr-2">✓</span>
                  <Link href="/supplements/magnesium" className="text-blue-600 hover:text-blue-800">
                    Magnesium
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link 
              href="/systems/nervous" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Explore Nervous System Support →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 