'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import SearchComponent from './SearchComponent'
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();

  // Debug session
  console.log('Header - Session status:', status, 'Session:', session);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Herbs', href: '/herbs' },
    { name: 'Supplements', href: '/supplements' },
    { name: 'Symptom Solutions', href: '/symptoms' },
    { name: 'Wellness Blog', href: '/blog' },
    { name: 'About', href: '/about' },
  ];



  return (
    <>
      {/* Trust Banner */}
      <div className="bg-blue-950 text-white py-2 sm:py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Trust Banner Content */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-semibold flex-1">
            <span className="flex items-center gap-1 sm:gap-2">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="hidden xs:inline">Herbalist-Curated Natural Support</span>
              <span className="xs:hidden">Natural Support</span>
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Premium Quality Assurance</span>
            <span className="hidden lg:inline">•</span>
            <span className="hidden lg:inline">Scientifically Backed</span>
          </div>
          
          {/* Admin and Logout Buttons in Trust Banner */}
          {status === 'loading' ? (
            <div className="w-16 sm:w-20 h-6 bg-green-500 animate-pulse rounded"></div>
          ) : session ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  console.log('Admin button clicked!');
                  window.location.href = '/admin';
                }}
                className="px-3 py-1 text-xs sm:text-sm bg-white text-lime-700 font-semibold rounded hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Admin
              </button>
              <button
                onClick={async () => {
                  try {
                    await signOut({ redirect: false });
                    router.push('/login');
                  } catch (error) {
                    console.error('Logout error:', error);
                    // Fallback to direct navigation
                    router.push('/login');
                  }
                }}
                className="px-3 py-1 text-xs sm:text-sm bg-white text-lime-700 font-semibold rounded hover:bg-gray-100 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1 text-xs sm:text-sm bg-white text-lime-700 font-semibold rounded hover:bg-gray-100 transition-colors"
            >
              Admin Login
            </Link>
          )}
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40 relative">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* Logo spanning both rows */}
          <div className="absolute left-4 sm:left-6 lg:left-8 top-0 bottom-0 flex items-center z-10">
            <Link href="/" className="flex items-center gap-1 sm:gap-1.5 tiny:flex-col tiny:items-start tiny:gap-1">
                              <Image
                  src="/images/nervevine%20smalllogo1.svg"
                  alt="The NerveVine"
                  width={200}
                  height={100}
                  className="w-20 h-10 sm:w-24 sm:h-12 lg:w-28 lg:h-14 flex-shrink-0 object-contain justify-start"
                  style={{ height: '80%' }}
                  priority
                />
              <h1 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 font-serif whitespace-nowrap tiny:whitespace-normal tiny:text-sm justify-start">
                The NerveVine
              </h1>
            </Link>
          </div>
          
          {/* Top Row - Navigation only */}
          <div className="flex flex-col items-start justify-between py-3 lg:py-4">
            {/* Navigation Row */}
            <div className="flex items-center w-full justify-end">

              {/* Desktop Navigation - Above 820px */}
              <nav className="hidden lg:flex items-center gap-4 lg:gap-6 nav:gap-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`nav-link text-gray-700 hover:text-lime-700 px-2 py-1 text-sm font-medium transition-colors duration-200 ${pathname === item.href ? 'text-lime-700 font-semibold' : ''}`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* Mobile menu button - Only show below 767px */}
              <button
                type="button"
                className="md:hidden text-gray-700 hover:text-lime-700 p-1.5 sm:p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>

            {/* Navigation Row - Below 820px: wrapped under logo/name */}
            <div className="w-full mt-2 lg:mt-0 lg:hidden">
              {/* Desktop Navigation - 820px-767px: wrapped */}
              <nav className="hidden md:flex lg:hidden items-center gap-4 lg:gap-6 nav:gap-8 justify-end">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`nav-link text-gray-700 hover:text-lime-700 px-2 py-1 text-sm font-medium transition-colors duration-200 ${pathname === item.href ? 'text-lime-700 font-semibold' : ''}`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Bottom Row - Search Bar */}
          <div className="border-t border-gray-100 py-3">
            <div className="flex justify-end md:justify-end lg:justify-end">
              <div className="w-full max-w-lg ml-20 sm:ml-24 lg:ml-28 md:ml-0 md:mr-4 lg:mr-6">
                <SearchComponent />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Below 767px */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2.5 text-base font-medium transition-colors duration-200 rounded-md ${pathname === item.href ? 'text-green-700 bg-green-50' : 'text-gray-700 hover:text-green-700 hover:bg-gray-50'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Logout Button - Only show when logged in */}
              {status === 'loading' ? null : session ? (
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={async () => {
                      try {
                        await signOut({ redirect: false });
                        router.push('/login');
                        setIsMenuOpen(false);
                      } catch (error) {
                        console.error('Logout error:', error);
                        // Fallback to direct navigation
                        router.push('/login');
                        setIsMenuOpen(false);
                      }
                    }}
                    className="block w-full px-4 py-2.5 text-sm text-gray-700 hover:text-gray-900 font-medium transition-colors rounded-md hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </header>
    </>
  )
} 