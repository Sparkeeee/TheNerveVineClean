'use client'

import { useState } from 'react';
import Link from 'next/link';

export default function AuthSection() {
  const [showAuth, setShowAuth] = useState(false);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (showAuth) return;
    
    setShowAuth(true);
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      setSession(data.user ? data : null);
    } catch (error) {
      setSession(null);
    }
    setLoading(false);
  };

  // Ultra-simple: always render the same thing until clicked
  if (!showAuth) {
    return (
      <div className="w-20 h-6 flex items-center justify-end">
        <button
          onClick={handleClick}
          className="px-2 py-1 text-xs bg-white text-lime-700 font-semibold rounded hover:bg-gray-100"
        >
          Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-20 h-6 flex items-center justify-end">
        <div className="w-16 h-6 bg-green-500 animate-pulse rounded"></div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="w-20 h-6 flex items-center justify-end">
        <div className="flex items-center gap-1">
          <button
            onClick={() => window.location.href = '/admin'}
            className="px-2 py-1 text-xs bg-white text-lime-700 font-semibold rounded hover:bg-gray-100"
          >
            Admin
          </button>
          <button
            onClick={async () => {
              await fetch('/api/auth/signout', { method: 'POST' });
              window.location.href = '/login';
            }}
            className="px-2 py-1 text-xs bg-white text-lime-700 font-semibold rounded hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-20 h-6 flex items-center justify-end">
      <Link
        href="/login"
        className="px-2 py-1 text-xs bg-white text-lime-700 font-semibold rounded hover:bg-gray-100"
      >
        Admin Login
      </Link>
    </div>
  );
} 