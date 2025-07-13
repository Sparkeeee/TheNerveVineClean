import SearchComponent from '@/components/SearchComponent';

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
                <span>Search by symptom: "anxiety", "insomnia", "stress"</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Search by herb name: "lemon balm", "chamomile", "ashwagandha"</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Search by supplement: "magnesium", "omega-3", "vitamin d"</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Search by benefit: "calming", "sleep", "energy", "focus"</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">🔍 Popular Searches</h2>
            <div className="grid grid-cols-2 gap-2">
              <a href="/symptoms/anxiety" className="text-blue-600 hover:text-blue-800 text-sm p-2 rounded bg-blue-50 hover:bg-blue-100 transition-colors">
                Anxiety
              </a>
              <a href="/symptoms/insomnia" className="text-blue-600 hover:text-blue-800 text-sm p-2 rounded bg-blue-50 hover:bg-blue-100 transition-colors">
                Insomnia
              </a>
              <a href="/herbs/lemon-balm" className="text-green-600 hover:text-green-800 text-sm p-2 rounded bg-green-50 hover:bg-green-100 transition-colors">
                Lemon Balm
              </a>
              <a href="/supplements/magnesium" className="text-purple-600 hover:text-purple-800 text-sm p-2 rounded bg-purple-50 hover:bg-purple-100 transition-colors">
                Magnesium
              </a>
              <a href="/symptoms/stress" className="text-red-600 hover:text-red-800 text-sm p-2 rounded bg-red-50 hover:bg-red-100 transition-colors">
                Stress
              </a>
              <a href="/herbs/ashwagandha" className="text-green-600 hover:text-green-800 text-sm p-2 rounded bg-green-50 hover:bg-green-100 transition-colors">
                Ashwagandha
              </a>
              <a href="/supplements/omega-3" className="text-purple-600 hover:text-purple-800 text-sm p-2 rounded bg-purple-50 hover:bg-purple-100 transition-colors">
                Omega-3
              </a>
              <a href="/symptoms/depression" className="text-red-600 hover:text-red-800 text-sm p-2 rounded bg-red-50 hover:bg-red-100 transition-colors">
                Depression
              </a>
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
              <a href="/herbs" className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Browse Herbs
              </a>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">💊</div>
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Supplements</h3>
              <p className="text-gray-600 mb-4">Essential vitamins, minerals, and nutrients</p>
              <a href="/supplements" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Browse Supplements
              </a>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">🩺</div>
              <h3 className="text-xl font-semibold text-red-800 mb-2">Symptoms</h3>
              <p className="text-gray-600 mb-4">Find solutions for specific health concerns</p>
              <a href="/symptoms" className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                Browse Symptoms
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 