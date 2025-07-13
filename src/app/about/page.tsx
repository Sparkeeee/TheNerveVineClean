import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about The NerveVine and our mission to provide natural herbal supplements for nervous system health.',
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">About The NerveVine</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-lg text-gray-700 mb-6">
          The NerveVine is dedicated to providing high-quality, natural herbal supplements that support nervous system health and overall wellness.
        </p>
        
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Mission</h2>
        <p className="text-gray-700 mb-6">
          We believe in the power of natural remedies and traditional herbal medicine to support modern health challenges. Our carefully curated selection of herbs and supplements focuses on nervous system support, stress relief, and natural wellness.
        </p>
        
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Quality Commitment</h2>
        <p className="text-gray-700 mb-6">
          Every product in our collection undergoes rigorous quality testing and filtering to ensure you receive only the best natural supplements for your health journey.
        </p>
        
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Expert Guidance</h2>
        <p className="text-gray-700 mb-6">
          Our team of herbal medicine experts and wellness professionals work together to provide you with reliable information and guidance on natural health solutions.
        </p>
      </div>
    </div>
  )
} 