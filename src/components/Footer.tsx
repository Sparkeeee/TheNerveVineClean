import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4">The NerveVine</h3>
            <p className="text-gray-300 mb-4">
              Natural herbal supplements for nervous system health and wellness.
            </p>
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} The NerveVine. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/herbs" className="text-gray-300 hover:text-white transition-colors">
                  Herbs
                </Link>
              </li>
              <li>
                <Link href="/supplements" className="text-gray-300 hover:text-white transition-colors">
                  Supplements
                </Link>
              </li>
              <li>
                <Link href="/symptoms" className="text-gray-300 hover:text-white transition-colors">
                  Symptoms
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            This site contains affiliate links. We may earn a commission for purchases made through these links at no additional cost to you.
          </p>
        </div>
      </div>
    </footer>
  )
} 