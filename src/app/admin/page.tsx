"use client";
import React from 'react';
import Link from 'next/link';

export default function AdminHomePage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/images/Juggling.jpg')",
      }}
    >
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-md mx-auto rounded-lg" style={{background: 'rgba(255,255,255,0.75)'}}>
          <h1 className="text-4xl font-bold mb-8 text-gray-900 text-center pt-8">Admin Home</h1>
          <div className="flex flex-col gap-4 w-full max-w-md pb-8 px-8">
            <Link href="/admin/content" className="bg-green-700 text-white px-6 py-3 rounded shadow hover:bg-green-800 transition font-bold text-lg text-center">
              Manage Herbs, Supplements & Symptoms
            </Link>
            <Link href="/admin/product-hunt" className="bg-blue-700 text-white px-6 py-3 rounded shadow hover:bg-blue-800 transition font-bold text-lg text-center">
              Go to Product Hunt Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 