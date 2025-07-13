import Link from "next/link";
import BodyMap from "@/components/BodyMap";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white via-blue-50 to-blue-100 pt-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100 max-w-6xl w-full">
        <h1 className="text-5xl font-bold mb-6 text-gray-800 text-center">The NerveVine</h1>
        <p className="text-center max-w-2xl mb-8 text-gray-700 text-lg leading-relaxed mx-auto">
          Explore herbs that support the nervous system, stress response, and emotional resilience.
          Start by clicking a system below:
        </p>

        {/* Replace inline SVG with your component */}
        <BodyMap />

        <div className="text-center mt-8">
          <Link 
            href="/systems/nervous" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Or view Nervous System herbs →
          </Link>
        </div>
      </div>
    </main>
  );
}

"// Force deployment update" 
