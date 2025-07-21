import SearchComponent from '@/components/SearchComponent';
import Link from "next/link";
export default function SearchPage() {
    return (<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">Search NerveVine</h1>
          <p className="text-xl text-blue-700 mb-6">
            Find the perfect herbs, supplements, and natural solutions for your health concerns
          </p>
        </div>

        {/* Search Component */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <SearchComponent />
        </div>

        {/* Search Tips */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">💡 Search Tips</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Search by symptom: &quot;anxiety&quot;, &quot;insomnia&quot;, &quot;stress&quot;</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Search by herb name: &quot;lemon balm&quot;, &quot;chamomile&quot;, &quot;ashwagandha&quot;</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Search by supplement: &quot;magnesium&quot;, &quot;omega-3&quot;, &quot;vitamin d&quot;</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Search by benefit: &quot;calming&quot;, &quot;sleep&quot;, &quot;energy&quot;, &quot;focus&quot;</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">🔍 Popular Searches</h2>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/symptoms/anxiety" className="text-blue-600 hover:text-blue-800 text-sm p-2 rounded bg-blue-50 hover:bg-blue-100 transition-colors">
                Anxiety
              </Link>
              <Link href="/symptoms/insomnia" className="text-blue-600 hover:text-blue-800 text-sm p-2 rounded bg-blue-50 hover:bg-blue-100 transition-colors">
                Insomnia
              </Link>
              <Link href="/herbs/lemon-balm" className="text-green-600 hover:text-green-800 text-sm p-2 rounded bg-green-50 hover:bg-green-100 transition-colors">
                Lemon Balm
              </Link>
              <Link href="/supplements/magnesium" className="text-purple-600 hover:text-purple-800 text-sm p-2 rounded bg-purple-50 hover:bg-purple-100 transition-colors">
                Magnesium
              </Link>
              <Link href="/symptoms/stress" className="text-red-600 hover:text-red-800 text-sm p-2 rounded bg-red-50 hover:bg-red-100 transition-colors">
                Stress
              </Link>
              <Link href="/herbs/ashwagandha" className="text-green-600 hover:text-green-800 text-sm p-2 rounded bg-green-50 hover:bg-green-100 transition-colors">
                Ashwagandha
              </Link>
              <Link href="/supplements/omega-3" className="text-purple-600 hover:text-purple-800 text-sm p-2 rounded bg-purple-50 hover:bg-purple-100 transition-colors">
                Omega-3
              </Link>
              <Link href="/symptoms/depression" className="text-red-600 hover:text-red-800 text-sm p-2 rounded bg-red-50 hover:bg-red-100 transition-colors">
                Depression
              </Link>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-blue-800 mb-6 text-center">Browse by Category</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">🌿</div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Herbs</h3>
              <p className="text-gray-600 mb-4">Traditional herbal medicines for natural healing</p>
              <Link href="/herbs" className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Browse Herbs
              </Link>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">💊</div>
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Supplements</h3>
              <p className="text-gray-600 mb-4">Essential vitamins, minerals, and nutrients</p>
              <Link href="/supplements" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Browse Supplements
              </Link>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">🩺</div>
              <h3 className="text-xl font-semibold text-red-800 mb-2">Symptoms</h3>
              <p className="text-gray-600 mb-4">Find solutions for specific health concerns</p>
              <Link href="/symptoms" className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                Browse Symptoms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
