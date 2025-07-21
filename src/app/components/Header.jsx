"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";
export default function Header() {
    const { data: session } = useSession();
    return (<header className="flex items-center justify-between px-6 py-4 bg-white shadow w-full">
      {/* Left: Nav */}
      <nav className="flex items-center gap-8 flex-shrink-0">
        {/* ...existing nav and logo... */}
        <Link href="/" className="font-bold text-lg text-green-900">Home</Link>
        <Link href="/assisted-search" className="font-semibold">Assisted Search</Link>
        <Link href="/herbs" className="font-semibold">Herbs</Link>
        <Link href="/supplements" className="font-semibold">Supplements</Link>
        <Link href="/symptoms" className="font-semibold">Symptoms</Link>
        <Link href="/blog" className="font-semibold">Blog</Link>
        <Link href="/about" className="font-semibold">About</Link>
      </nav>
      {/* Center: Search Bar */}
      <div className="flex-1 flex justify-center items-center min-w-0">
        <input type="text" placeholder="Search herbs, supplements, symptoms..." className="w-full max-w-xs border rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"/>
      </div>
      {/* Right: Login/Logout Button */}
      <div className="flex items-center flex-shrink-0 ml-4">
        {(session === null || session === void 0 ? void 0 : session.user) ? (<button onClick={() => signOut({ callbackUrl: "/admin/login" })} className="px-4 py-2 bg-green-700 text-black rounded font-bold hover:bg-green-800 transition">
            Logout
          </button>) : (<Link href="/admin/login" className="px-4 py-2 bg-green-700 text-black rounded font-bold hover:bg-green-800 transition">
            Admin Login
          </Link>)}
      </div>
    </header>);
}
