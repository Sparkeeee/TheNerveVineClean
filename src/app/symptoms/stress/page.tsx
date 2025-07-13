import Link from "next/link";

export default function StressPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <nav className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to NerveVine
          </Link>
        </nav>
        
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Stress Management & Relief</h1>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100">
          <p className="text-lg text-gray-700 mb-6">
            Chronic stress can take a toll on your nervous system and overall health. 
            Natural herbs and adaptogens can help your body adapt to stress, reduce 
            cortisol levels, and promote a sense of calm and resilience.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">Adaptogenic Herbs</h2>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  <Link href="/herbs/ashwagandha" className="text-blue-600 hover:text-blue-800">
                    Ashwagandha
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  <Link href="/herbs/rhodiola" className="text-blue-600 hover:text-blue-800">
                    Rhodiola Rosea
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  <Link href="/herbs/holy-basil" className="text-blue-600 hover:text-blue-800">
                    Holy Basil
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  <Link href="/herbs/lemon-balm" className="text-blue-600 hover:text-blue-800">
                    Lemon Balm
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-800 mb-4">Calming Supplements</h2>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  <Link href="/supplements/l-theanine" className="text-blue-600 hover:text-blue-800">
                    L-Theanine
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  <Link href="/supplements/magnesium" className="text-blue-600 hover:text-blue-800">
                    Magnesium
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  <Link href="/supplements/b-complex" className="text-blue-600 hover:text-blue-800">
                    B-Complex Vitamins
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