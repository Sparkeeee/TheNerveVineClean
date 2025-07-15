import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about The NerveVine and our mission to provide natural herbal supplements for nervous system health.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white via-blue-50 to-blue-100 pt-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100 max-w-6xl w-full">
        <h1 className="text-5xl font-bold mb-6 text-gray-800 text-center">About The NerveVine</h1>
        <p className="text-center max-w-2xl mb-8 text-gray-700 text-lg leading-relaxed mx-auto">
          The NerveVine is dedicated to providing high-quality, natural herbal supplements that support nervous system health and overall wellness.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4 text-center">Our Mission</h2>
          <p className="text-gray-700 text-center max-w-2xl mx-auto mb-6">
            We believe in the power of natural remedies and traditional herbal medicine to support modern health challenges. Our carefully curated selection of herbs and supplements focuses on nervous system support, stress relief, and natural wellness.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4 text-center">Quality Commitment</h2>
          <p className="text-gray-700 text-center max-w-2xl mx-auto mb-6">
            Every product in our collection undergoes rigorous quality testing and filtering to ensure you receive only the best natural supplements for your health journey.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4 text-center">Expert Guidance</h2>
          <p className="text-gray-700 text-center max-w-2xl mx-auto mb-6">
            Our team of herbal medicine experts and wellness professionals work together to provide you with reliable information and guidance on natural health solutions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-blue-700 mb-2">What is this site?</h3>
              <p className="text-gray-700">The NerveVine is a resource for evidence-based, herbalist-guided recommendations for natural health, focusing on herbs, supplements, and lifestyle strategies for nervous system and stress-related concerns.</p>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-blue-700 mb-2">How does it work?</h3>
              <p className="text-gray-700">We use a blend of traditional herbalist expertise and modern research to determine what criteria a treatment should meet for a given symptom. Then, we scour the web for the best, most reputable sources—prioritizing quality, safety, and value. Only products that meet all our standards are recommended.</p>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-blue-700 mb-2">How is this valuable?</h3>
              <p className="text-gray-700">We save you time and uncertainty by curating only the best natural options for your needs. Our recommendations are unbiased, evidence-based, and focused on your wellbeing—helping you avoid low-quality or overpriced products.</p>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-blue-700 mb-2">Who is behind this site?</h3>
              <p className="text-gray-700">The NerveVine is created and maintained by a team of herbalists, researchers, and health writers passionate about natural medicine and transparency. Our goal is to empower you with trustworthy, actionable information.</p>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-blue-700 mb-2">What are our standards?</h3>
              <p className="text-gray-700 mb-2">We only recommend products that meet three strict criteria: high quality (third-party tested, reputable brands), best match for your needs (herbalist-reviewed for your specific concern), and affordability (good value for money). The Venn diagram below shows how we find the sweet spot for our recommendations:</p>
              <div className="flex justify-center items-center h-40 bg-blue-50 rounded-lg border border-blue-100 mb-2">
                <span className="text-blue-400 italic">[Venn diagram placeholder]</span>
              </div>
              <p className="text-gray-700">We call this intersection our “Top Picks”—products that are high quality, a great match, and affordable.</p>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-blue-700 mb-2">How do we get paid?</h3>
              <p className="text-gray-700">Some links on this site are affiliate links, which means we may earn a small commission if you make a purchase—at no extra cost to you. This helps support our work and keeps the site free for everyone. We never accept payment for positive reviews or to feature specific products.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
} 