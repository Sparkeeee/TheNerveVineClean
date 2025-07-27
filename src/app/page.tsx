import Link from "next/link";
import BodyMap from "@/components/BodyMap";
import Image from "next/image";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-center p-0 bg-gradient-to-br from-yellow-50 via-blue-50 to-green-100 pt-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 w-full max-w-none flex flex-col items-center px-0 relative">
          {/* Grid hero: logo | headline | venn */}
          <div className="w-full grid grid-cols-3 items-center gap-4 py-6 px-4 md:px-12 max-md:grid-cols-1 max-md:gap-6">
            <div className="flex justify-center">
              <Image
                src="/images/Logo with Vitality Theme.png"
                alt="The NerveVine Logo with Vitality Theme"
                width={210}
                height={210}
                className="max-w-[210px] w-full h-auto"
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            <div className="flex flex-col items-center text-center">
              <h1 className="text-5xl font-extrabold mb-3 text-green-800 drop-shadow">Welcome</h1>
              <p className="max-w-2xl mb-4 text-gray-700 text-lg leading-relaxed mx-auto">
                Your trusted guide to natural nervous system support, stress relief, and emotional resilience. We connect you with the best herbs, supplements, and lifestyle tips—rooted in science, tradition, and compassion.
              </p>
            </div>
            <div className="flex justify-center">
              <Image
                src="/images/Venn1.png"
                alt="NerveVine Venn Diagram"
                width={250}
                height={250}
                className="max-w-[250px] w-full h-auto"
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </div>

          {/* Testimonial/Quote */}
          <div className="bg-green-50 border-l-4 border-green-300 rounded-lg p-4 mb-8 max-w-xl mx-auto shadow-sm w-full md:w-auto">
            <p className="italic text-green-900 text-lg text-center">“I finally found natural solutions that work for me—The NerveVine made it easy to understand and take action.”</p>
            <div className="text-right text-green-700 font-semibold mt-2 pr-2">— Real User</div>
          </div>

          {/* BodyMap and Navigation */}
          <div className="w-full flex flex-col items-center px-0">
            <Suspense fallback={<div className="text-center py-8">Loading interactive body map...</div>}>
              <BodyMap />
            </Suspense>
            <div className="text-center mt-8">
              <Link 
                href="/systems/nervous" 
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                Or view Nervous System herbs →
              </Link>
            </div>
          </div>
        </div>
      </main>
      <footer className="w-full bg-green-900 text-white py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-green-100">&copy; {new Date().getFullYear()} The NerveVine. All rights reserved.</div>
          <div className="text-green-200 text-sm italic text-center md:text-left">
            Empowering you with herbal wisdom and natural support—rooted in science, tradition, and care.
          </div>
          <div className="flex gap-6 text-green-100 text-sm">
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </>
  );
} 
