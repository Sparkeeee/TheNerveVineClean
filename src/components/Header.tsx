'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import SearchComponent from './SearchComponent'
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Assisted Search', href: '/search' },
    { name: 'Herbs', href: '/herbs' },
    { name: 'Supplements', href: '/supplements' },
    { name: 'Symptoms', href: '/symptoms' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
  ]

  return (
    <>
      {/* Green bar above header */}
      <div className="font-sans w-full bg-green-800 py-1.5 text-white text-center text-base font-semibold tracking-wide z-50">
        Herbalist curated natural support at your fingertips.
      </div>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Row - Navigation and Search */}
          <div className="flex justify-between items-center h-16">
            {/* Desktop Navigation and Search */}
            <div className="hidden custom900:flex flex-1 items-center justify-between w-full">
              <nav className="flex space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`font-sans text-gray-700 hover:text-green-800 px-3 py-2 text-lg font-semibold transition-colors duration-200 ${pathname === item.href ? 'border-b-2 border-green-700 font-bold' : ''}`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="ml-8 w-80 max-w-xs">
                <SearchComponent />
              </div>
              {/* Admin and Login/Logout Buttons */}
              <div className="flex-shrink-0 ml-4 flex gap-2">
                {status === 'loading' ? null : session ? (
                  <>
                    <Link
                      href="/admin"
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold transition-colors duration-200"
                    >
                      Admin
                    </Link>
                    <button
                      onClick={async () => {
                        await signOut({ redirect: false });
                        router.push('/login');
                      }}
                      className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 font-semibold transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 font-semibold transition-colors duration-200"
                  >
                    Admin Login
                  </Link>
                )}
              </div>
            </div>
            {/* Mobile menu button */}
            <div className="custom900:hidden">
              <button
                type="button"
                className="text-gray-700 hover:text-green-800 p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="custom900:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
                {/* Mobile Search */}
                <div className="px-3 py-2">
                  <SearchComponent />
                </div>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-gray-700 hover:text-green-800 block px-3 py-2 text-base font-medium transition-colors duration-200 ${pathname === item.href ? 'border-b-2 border-green-700 font-bold' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                {/* Mobile Admin and Login/Logout Buttons */}
                <div className="mt-2 space-y-2">
                  {status === 'loading' ? null : session ? (
                    <>
                      <Link
                        href="/admin"
                        className="w-full block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold transition-colors duration-200 text-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin
                      </Link>
                      <button
                        onClick={async () => {
                          await signOut({ redirect: false });
                          router.push('/login');
                        }}
                        className="w-full bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 font-semibold transition-colors duration-200"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      className="w-full block bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 font-semibold transition-colors duration-200 text-center"
                    >
                      Admin Login
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  )
} 