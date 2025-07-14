import Link from "next/link";

export default function InsomniaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <nav className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to NerveVine
          </Link>
        </nav>
        
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Insomnia & Sleep Issues</h1>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100">
          <p className="text-lg text-gray-700 mb-6">
            Insomnia can significantly impact your nervous system health and overall well-being. 
            Natural herbal solutions can help restore healthy sleep patterns without the side effects 
            of conventional sleep medications.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">Recommended Herbs</h2>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  <Link href="/herbs/valerian" className="text-blue-600 hover:text-blue-800">
                    Valerian Root
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  <Link href="/herbs/passionflower" className="text-blue-600 hover:text-blue-800">
                    Passionflower
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  <Link href="/herbs/chamomile" className="text-blue-600 hover:text-blue-800">
                    Chamomile
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  <Link href="/herbs/lavender" className="text-blue-600 hover:text-blue-800">
                    Lavender
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  <Link href="/herbs/kava-kava" className="text-blue-600 hover:text-blue-800">
                    Kava Kava
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  <Link href="/herbs/california-poppy" className="text-blue-600 hover:text-blue-800">
                    California Poppy
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  <Link href="/herbs/blue-vervain" className="text-blue-600 hover:text-blue-800">
                    Blue Vervain
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  <Link href="/herbs/wood-betony" className="text-blue-600 hover:text-blue-800">
                    Wood Betony
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  <Link href="/herbs/hops" className="text-blue-600 hover:text-blue-800">
                    Hops
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  <Link href="/herbs/magnolia-bark" className="text-blue-600 hover:text-blue-800">
                    Magnolia Bark
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-800 mb-4">Lifestyle Tips</h2>
              <ul className="space-y-3 text-sm">
                <li>• Establish a consistent sleep schedule</li>
                <li>• Create a relaxing bedtime routine</li>
                <li>• Avoid screens 1-2 hours before bed</li>
                <li>• Keep your bedroom cool and dark</li>
                <li>• Limit caffeine after 2 PM</li>
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