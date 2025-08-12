"use client";
import React from 'react';
import Link from 'next/link';

export default function AdminHomePage() {
  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10" style={{
        backgroundImage: "url('/images/RoseWPWM.PNG')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>
        <div className="absolute inset-0 bg-pink-100 opacity-90"></div>
      </div>
      
      <div className="h-12"></div>
      <div className="relative z-10 flex flex-col items-center p-6">
        <div className="w-full max-w-6xl mx-auto rounded-xl p-8 shadow-sm border-2 border-gray-300" 
             style={{background: 'linear-gradient(135deg, #fffef7 0%, #fefcf3 50%, #faf8f3 100%)'}}>
          <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">Admin Dashboard</h1>
                     <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 w-full">
                         <Link href="/admin/content" 
                   className="inline-flex flex-col items-center justify-center px-6 py-4 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-gray-400 hover:text-gray-600 hover:shadow-gray-300 hover:shadow-lg hover:scale-105 text-center">
                                           <span className="material-symbols-outlined mb-2">stacks</span>
               Manage Herbs, Supplements & Symptoms
             </Link>
             <Link href="/admin/product-hunt" 
                   className="inline-flex flex-col items-center justify-center px-6 py-4 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-gray-400 hover:text-gray-600 hover:shadow-gray-300 hover:shadow-lg hover:scale-105 text-center">
                                           <span className="material-symbols-outlined mb-2">search</span>
               Product Hunt Dashboard
             </Link>
             <Link href="/admin/data-hub" 
                   className="inline-flex flex-col items-center justify-center px-6 py-4 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-gray-400 hover:text-gray-600 hover:shadow-gray-300 hover:shadow-lg hover:scale-105 text-center">
                                           <span className="material-symbols-outlined mb-2">database</span>
               Data Processing Hub
             </Link>
             <Link href="/admin/quality-specifications" 
                   className="inline-flex flex-col items-center justify-center px-6 py-4 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-gray-400 hover:text-gray-600 hover:shadow-gray-300 hover:shadow-lg hover:scale-105 text-center">
                                           <span className="material-symbols-outlined mb-2">verified</span>
               Quality Specifications
             </Link>
             <Link href="/admin/product-scraper" 
                   className="inline-flex flex-col items-center justify-center px-6 py-4 rounded-full font-semibold border-2 transition-all duration-200 shadow-sm bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-gray-400 hover:text-gray-600 hover:shadow-gray-300 hover:shadow-lg hover:scale-105 text-center">
                                           <span className="material-symbols-outlined mb-2">download</span>
               Product Data Scraper
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 