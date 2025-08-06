import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - The NerveVine',
  description: 'Contact The NerveVine for questions, support, or feedback.',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white via-blue-50 to-blue-100 pt-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100 max-w-2xl w-full">
        <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">Contact Us</h1>
        
        <div className="text-center">
          <p className="text-gray-700 mb-8 text-lg">
            Have questions, feedback, or need support? We&apos;d love to hear from you.
          </p>
          
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-gray-700 mb-4">
              Email us at:
            </p>
            <a 
              href="mailto:contact@thenervevine.com" 
              className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              contact@thenervevine.com
            </a>
          </div>
          
          <p className="text-gray-600 mt-8 text-sm">
            We typically respond within 24-48 hours.
          </p>
        </div>
      </div>
    </main>
  )
} 