'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession, signIn, signOut, getSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import SearchComponent from './SearchComponent'

export default function Header() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isActivePath = (path: string) => {
    return pathname?.startsWith(path)
  }

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <>
        {/* Trust Banner - Dark Blue - Hidden on mobile */}
        <div className="hidden lg:block bg-blue-950 text-white py-2">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center relative">
              <div className="flex items-center space-x-4 text-sm">
                <span>Traditional Remedies</span>
                <span>•</span>
                <span>Premium Quality Assured</span>
                <span>•</span>
                <span>Fully referenced sources</span>
              </div>
              <div className="absolute right-0 text-xs">
                <div className="flex items-center gap-2">
                  <div className="bg-white text-green-700 px-4 py-2 rounded-md border border-green-200">
                    Admin Login
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header - White with Shadow */}
        <header className="bg-white shadow border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              {/* Left Side - Logo and Site Name */}
              <Link href="/" className="flex items-center space-x-2">
                <Image 
                  src="/images/nervevine smalllogo1.svg" 
                  alt="The NerveVine Logo" 
                  width={90} 
                  height={90}
                  className="h-10 sm:h-12 md:h-16 lg:h-20 w-auto"
                />
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">The NerveVine</h1>
              </Link>
              
              {/* Right Side - Navigation and Search */}
              <div className="hidden lg:flex flex-col items-end space-y-3">
                {/* Navigation Links */}
                <nav className="flex items-center space-x-8">
                  <Link href="/" className="font-medium transition-colors text-gray-700 hover:text-green-600">
                    Home
                  </Link>
                  <Link href="/herbs" className="font-medium transition-colors text-gray-700 hover:text-green-600">
                    Herbs
                  </Link>
                  <Link href="/supplements" className="font-medium transition-colors text-gray-700 hover:text-green-600">
                    Supplements
                  </Link>
                  <Link href="/symptoms" className="font-medium transition-colors text-gray-700 hover:text-green-600">
                    Symptom Solutions
                  </Link>
                  <Link href="/blog" className="font-medium transition-colors text-gray-700 hover:text-green-600">
                    Wellness Blog
                  </Link>
                  <Link href="/about" className="font-medium transition-colors text-gray-700 hover:text-green-600">
                    About
                  </Link>
                </nav>
                
                {/* Search Bar - Positioned below navigation */}
                <div className="w-64">
                  <SearchComponent uniqueId="desktop" />
                </div>
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <button 
                  className="p-2 rounded-md text-gray-700 hover:text-green-600"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Search Bar */}
            <div className="lg:hidden pb-4">
              <SearchComponent uniqueId="mobile" />
            </div>
          </div>
        </header>
      </>
    )
  }

  return (
    <>
      {/* Trust Banner - Dark Blue - Hidden on mobile */}
      <div className="hidden lg:block bg-blue-950 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center relative">
            <div className="flex items-center space-x-4 text-sm">
              <span>Traditional Remedies</span>
              <span>•</span>
              <span>Modern Supplements</span>
              <span>•</span>
              <span>Premium Quality Assured</span>
              <span>•</span>
              <span>Fully Referenced Sources</span>
            </div>
            <div className="absolute right-0 text-xs">
              <div className="flex items-center gap-2">
                {status !== 'loading' && session ? (
                  <>
                    <Link 
                      href="/admin"
                      className="bg-white text-blue-900 border border-blue-200 h-6 flex items-center px-3 rounded hover:bg-blue-100 hover:text-blue-900 cursor-pointer transition-colors font-medium shadow-sm text-sm"
                      style={{ minHeight: '1.5rem', height: '1.5rem' }}
                    >
                      Admin
                    </Link>
                    <button 
                      onClick={async () => {
                        try {
                          // Clear any local session data
                          localStorage.removeItem('next-auth.session-token')
                          sessionStorage.clear()
                          
                          await signOut({ 
                            callbackUrl: '/',
                            redirect: true 
                          })
                          
                          // Force page reload after a short delay
                          setTimeout(() => {
                            window.location.href = '/'
                          }, 100)
                        } catch (error) {
                          console.error('SignOut error:', error)
                        }
                      }} 
                      className="bg-blue-950 text-white border border-white h-6 flex items-center px-3 rounded hover:bg-blue-900 cursor-pointer transition-colors font-medium shadow-sm text-sm"
                      style={{ minHeight: '1.5rem', height: '1.5rem' }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/login"
                      className="bg-blue-950 text-white border border-white h-6 flex items-center px-3 rounded hover:bg-blue-900 cursor-pointer transition-colors font-medium shadow-sm text-sm"
                      style={{ minHeight: '1.5rem', height: '1.5rem' }}
                    >
                      Admin Login
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - White with Shadow */}
      <header className="bg-white shadow border-b">
        <div className="container mx-auto px-4">
                       <div className="flex items-center justify-between py-4">
            {/* Left Side - Logo and Site Name */}
                           <Link href="/" className="flex items-center space-x-2">
              <Image 
                src="/images/nervevine smalllogo1.svg" 
                alt="The NerveVine Logo" 
                width={90} 
                height={90}
                className="h-10 sm:h-12 md:h-16 lg:h-20 w-auto"
              />
                             <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">The NerveVine</h1>
            </Link>
            
            {/* Right Side - Navigation and Search */}
            <div className="hidden lg:flex flex-col items-end space-y-3">
              {/* Navigation Links */}
              <nav className="flex items-center space-x-8">
                <Link href="/" className={`font-medium transition-colors ${isActivePath('/') && pathname === '/' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-700 hover:text-green-600'}`}>
                  Home
                </Link>
                <Link href="/herbs" className={`font-medium transition-colors ${isActivePath('/herbs') ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-700 hover:text-green-600'}`}>
                  Herbs
                </Link>
                <Link href="/supplements" className={`font-medium transition-colors ${isActivePath('/supplements') ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-700 hover:text-green-600'}`}>
                  Supplements
                </Link>
                <Link href="/symptoms" className={`font-medium transition-colors ${isActivePath('/symptoms') ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-700 hover:text-green-600'}`}>
                  Symptom Solutions
                </Link>
                <Link href="/blog" className={`font-medium transition-colors ${isActivePath('/blog') ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-700 hover:text-green-600'}`}>
                  Wellness Blog
                </Link>
                <Link href="/about" className={`font-medium transition-colors ${isActivePath('/about') ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-700 hover:text-green-600'}`}>
                  About
                </Link>
              </nav>
              
              {/* Search Bar - Positioned below navigation */}
              <div className="w-64">
                <SearchComponent uniqueId="desktop" />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button 
                className="p-2 rounded-md text-gray-700 hover:text-green-600"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

                     {/* Mobile Search Bar - Always visible */}
           <div className="lg:hidden pb-4">
             <SearchComponent uniqueId="mobile" />
           </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col space-y-2">
                <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
                  Home
                </Link>
                <Link href="/herbs" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
                  Herbs
                </Link>
                <Link href="/supplements" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
                  Supplements
                </Link>
                <Link href="/symptoms" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
                  Symptom Solutions
                </Link>
                <Link href="/blog" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
                  Wellness Blog
                </Link>
                <Link href="/about" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
                  About
                </Link>
                                 
                {/* Admin Section - Mobile */}
                {status !== 'loading' && session ? (
                  <>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <Link href="/admin" className="px-3 py-2 rounded-md text-sm font-medium text-purple-700 hover:text-purple-600 hover:bg-purple-50 flex items-center">
                        <span className="mr-2">👤</span>
                        Admin
                      </Link>
                      <button 
                        onClick={async () => {
                          try {
                            localStorage.removeItem('next-auth.session-token')
                            sessionStorage.clear()
                            
                            await signOut({ 
                              callbackUrl: '/',
                              redirect: true 
                            })
                            
                            setTimeout(() => {
                              window.location.href = '/'
                            }, 100)
                          } catch (error) {
                            console.error('SignOut error:', error)
                          }
                        }} 
                        className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center"
                      >
                        <span className="mr-2">🚪</span>
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <Link href="/login" className="px-3 py-2 rounded-md text-sm font-medium text-blue-700 hover:text-blue-600 hover:bg-blue-50 flex items-center">
                        <span className="mr-2">🔐</span>
                        Admin Login
                      </Link>
                    </div>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  )
} 