import Link from 'next/link';

export const metadata = {
  title: 'Herbal Wellness Blog - Expert Insights on Natural Supplements',
  description: 'Discover evidence-based articles on herbal supplements, nervous system health, and natural wellness. Expert insights on anxiety, sleep, stress management, and more.',
  keywords: ['herbal blog', 'natural wellness', 'supplement education', 'nervous system health', 'herbal medicine'],
};

const blogPosts = [
  {
    id: 'ashwagandha-benefits',
    title: 'Ashwagandha Benefits: The Complete Guide to This Ancient Adaptogen',
    excerpt: 'Discover how ashwagandha can reduce stress, improve sleep, and support your nervous system naturally.',
    category: 'Herbs',
    readTime: '8 min read',
    date: '2024-01-15',
    slug: 'ashwagandha-benefits-complete-guide',
  },
  {
    id: 'anxiety-natural-remedies',
    title: '7 Natural Remedies for Anxiety That Actually Work',
    excerpt: 'Evidence-based natural approaches to managing anxiety without prescription medications.',
    category: 'Wellness',
    readTime: '12 min read',
    date: '2024-01-10',
    slug: 'natural-remedies-anxiety-evidence-based',
  },
  {
    id: 'sleep-herbs-comparison',
    title: 'Best Herbs for Sleep: Valerian vs Chamomile vs Passionflower',
    excerpt: 'Compare the effectiveness of popular sleep herbs and find which one works best for you.',
    category: 'Sleep',
    readTime: '10 min read',
    date: '2024-01-08',
    slug: 'best-herbs-sleep-comparison',
  },
  {
    id: 'stress-management-techniques',
    title: 'Holistic Stress Management: Beyond Just Supplements',
    excerpt: 'Comprehensive approach to stress management combining lifestyle, diet, and natural supplements.',
    category: 'Lifestyle',
    readTime: '15 min read',
    date: '2024-01-05',
    slug: 'holistic-stress-management-complete-guide',
  },
  {
    id: 'supplement-quality-guide',
    title: 'How to Choose High-Quality Herbal Supplements: A Buyer\'s Guide',
    excerpt: 'Learn to identify premium supplements and avoid low-quality products that waste your money.',
    category: 'Education',
    readTime: '14 min read',
    date: '2024-01-03',
    slug: 'choose-high-quality-herbal-supplements-guide',
  },
  {
    id: 'nervous-system-support',
    title: 'Supporting Your Nervous System: The Foundation of Health',
    excerpt: 'Understanding how your nervous system works and natural ways to support its optimal function.',
    category: 'Health',
    readTime: '11 min read',
    date: '2024-01-01',
    slug: 'nervous-system-support-foundation-health',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Herbal Wellness Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Evidence-based insights on natural supplements, nervous system health, and holistic wellness. 
            Expert guidance to help you make informed decisions about your health.
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3">
                <div className="h-64 md:h-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-6xl mb-4">🌿</div>
                    <div className="text-sm font-semibold">FEATURED</div>
                  </div>
                </div>
              </div>
              <div className="md:w-2/3 p-8">
                <div className="flex items-center mb-4">
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {blogPosts[0].category}
                  </span>
                  <span className="text-gray-500 text-sm ml-4">{blogPosts[0].readTime}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {blogPosts[0].title}
                </h2>
                <p className="text-gray-600 mb-6">
                  {blogPosts[0].excerpt}
                </p>
                <Link 
                  href={`/blog/${blogPosts[0].slug}`}
                  className="inline-flex items-center text-green-600 font-semibold hover:text-green-700 transition-colors"
                >
                  Read Full Article
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post) => (
            <article key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                <div className="text-4xl">🌱</div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-gray-500 text-xs ml-3">{post.readTime}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <Link 
                  href={`/blog/${post.slug}`}
                  className="text-green-600 text-sm font-semibold hover:text-green-700 transition-colors"
                >
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Stay Updated with Natural Wellness</h3>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Get the latest research, expert tips, and natural remedy guides delivered to your inbox. 
            No spam, just valuable insights for your health journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 