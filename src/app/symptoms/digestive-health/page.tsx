import Link from "next/link";

export default function DigestiveHealthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-800 mb-4">Hormonal Imbalances</h1>
          <p className="text-lg text-orange-600">Natural approaches to support hormonal balance and endocrine health</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-orange-800 mb-6">Understanding Hormonal Imbalances</h2>
          
          <div className="prose prose-orange max-w-none">
            <p className="text-gray-700 mb-6">
              Hormonal imbalances can affect various aspects of health including energy, mood, metabolism, and reproductive function. 
              The liver plays a crucial role in hormone regulation and detoxification, making liver health essential for hormonal balance.
            </p>

            <h3 className="text-xl font-semibold text-orange-700 mb-4">Natural Hormonal Balance Strategies</h3>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Support liver function with detoxifying foods and supplements</li>
              <li>Maintain a balanced diet rich in essential fatty acids</li>
              <li>Manage stress through relaxation techniques and adequate sleep</li>
              <li>Exercise regularly to support hormone regulation</li>
              <li>Avoid endocrine disruptors in food and environment</li>
              <li>Consider adaptogenic herbs for hormone support</li>
            </ul>

            <h3 className="text-xl font-semibold text-orange-700 mb-4">When to Consider Hormonal Support</h3>
            <p className="text-gray-700 mb-6">
              Consider hormonal support if you experience fatigue, mood swings, irregular cycles, weight changes, 
              or other symptoms of hormonal imbalance. Always consult with a healthcare provider for personalized advice.
            </p>
          </div>
        </div>

        {/* Product Recommendations */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-orange-800 mb-6">Recommended Products</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Product 1 */}
            <div className="border border-orange-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-orange-800 mb-3">Probiotic Supplement</h3>
              <p className="text-gray-600 mb-4">
                High-quality probiotic blend to support healthy gut flora and digestive function.
              </p>
              <a 
                href="https://amzn.to/3QxYzLm" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                View on Amazon
              </a>
            </div>

            {/* Product 2 */}
            <div className="border border-orange-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-orange-800 mb-3">Digestive Enzyme Complex</h3>
              <p className="text-gray-600 mb-4">
                Natural enzymes to support the breakdown and absorption of nutrients from food.
              </p>
              <a 
                href="https://amzn.to/3QxYzLm" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                View on Amazon
              </a>
            </div>

            {/* Product 3 */}
            <div className="border border-orange-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-orange-800 mb-3">Ginger Root Supplement</h3>
              <p className="text-gray-600 mb-4">
                Traditional digestive aid that helps soothe the stomach and support healthy digestion.
              </p>
              <a 
                href="https://amzn.to/3QxYzLm" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                View on Amazon
              </a>
            </div>

            {/* Product 4 */}
            <div className="border border-orange-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-orange-800 mb-3">Fiber Supplement</h3>
              <p className="text-gray-600 mb-4">
                Natural fiber blend to support regular bowel movements and digestive health.
              </p>
              <a 
                href="https://amzn.to/3QxYzLm" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                View on Amazon
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">Important Disclaimer</h3>
          <p className="text-yellow-700 text-sm">
            This information is for educational purposes only and should not replace professional medical advice. 
            Always consult with a healthcare provider before starting any new supplement regimen, especially if you 
            have existing health conditions or are taking medications.
          </p>
        </div>

        {/* Back to Body Map */}
        <div className="text-center mt-8">
          <Link 
            href="/"
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            ← Back to Body Map
          </Link>
        </div>
      </div>
    </div>
  );
} 