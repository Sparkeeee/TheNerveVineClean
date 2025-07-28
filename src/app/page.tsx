import Link from "next/link";
import BodyMap from "@/components/BodyMap";
import Image from "next/image";
import { Suspense } from "react";

export default function Home() {
  const productCategories = [
    {
      name: "Single-Herb Supplements",
      description: "Pure botanical extracts for targeted wellness",
      href: "/herbs",
      image: "/images/Astragalus_membranaceu_2.jpg",
      badge: "Premium Quality"
    },
    {
      name: "Blended Formulas",
      description: "Expert-formulated combinations for comprehensive support",
      href: "/supplements", 
      image: "/images/Panax_ginseng_Korean_g_1.jpg",
      badge: "Herbalist-Curated"
    },
    {
      name: "Symptom-Specific Solutions",
      description: "Targeted remedies for your specific health concerns",
      href: "/symptoms",
      image: "/images/Rhodiola_rosea_Rhodiol_3.jpg",
      badge: "Scientifically Backed"
    },
    {
      name: "Custom Recommendations",
      description: "Personalized guidance based on your unique needs",
      href: "/search",
      image: "/images/Withania_somnifera_Ash_2.jpg",
      badge: "Personalized"
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Wellness Enthusiast",
      content: "The NerveVine made it so easy to find natural solutions that actually work. Their symptom-based approach helped me target exactly what I needed.",
      rating: 5
    },
    {
      name: "Michael R.",
      role: "Health Coach",
      content: "As a health professional, I appreciate the quality and transparency. The herbalist-curated approach gives me confidence in recommending their products.",
      rating: 5
    },
    {
      name: "Emma L.",
      role: "Natural Health Advocate",
      content: "Finally, a platform that combines traditional herbal wisdom with modern science. The detailed product information helps me make informed decisions.",
      rating: 5
    }
  ];

  const trustFeatures = [
    {
      icon: "🌿",
      title: "Herbalist-Curated",
      description: "Expert-formulated by certified herbalists and naturopathic doctors"
    },
    {
      icon: "🔬",
      title: "Scientifically Backed",
      description: "Research-based formulations with proven efficacy and safety"
    },
    {
      icon: "🌱",
      title: "Premium Quality",
      description: "Organic, sustainably sourced ingredients with rigorous quality control"
    },
    {
      icon: "💚",
      title: "Natural & Safe",
      description: "Pure botanical extracts free from harmful additives and chemicals"
    }
  ];

  return (
    <>
      <main className="herbal-wellness">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-max">
            <div className="hero-section p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="text-center lg:text-left">
                                     <h1 className="text-hero text-green-800 mb-6">
                     Your Trusted Guide to
                     <span className="block text-lime-600">Natural Wellness</span>
                   </h1>
                  <p className="text-subtitle text-gray-700 mb-8 max-w-2xl">
                    Discover premium herbal supplements for nervous system support, stress relief, and natural wellness. 
                    Expert-curated products with quality filtering for optimal health outcomes.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Link 
                      href="/search" 
                      className="cta-button px-8 py-4 text-lg font-semibold"
                    >
                      Find Your Solution
                    </Link>
                    <Link 
                      href="/about" 
                      className="px-8 py-4 text-lg font-semibold text-green-700 border-2 border-green-700 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Image
                    src="/images/Logo with Vitality Theme.png"
                    alt="The NerveVine Logo"
                    width={400}
                    height={400}
                    className="max-w-[400px] w-full h-auto"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Features */}
        <section className="section-padding bg-white">
          <div className="container-max">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose The NerveVine?</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We combine traditional herbal wisdom with modern science to provide you with the highest quality natural wellness solutions.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {trustFeatures.map((feature, index) => (
                <div key={index} className="text-center p-6">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="section-padding">
          <div className="container-max">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Our Solutions</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                From single herbs to expert-formulated blends, find the natural support you need.
              </p>
            </div>
            <div className="category-grid">
              {productCategories.map((category, index) => (
                <Link key={index} href={category.href} className="product-card p-6 group">
                  <div className="relative mb-4">
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="quality-badge">{category.badge}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <span className="text-green-700 font-semibold group-hover:text-green-800 transition-colors">
                    Explore →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Body Map */}
        <section className="section-padding bg-white">
          <div className="container-max">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Solutions by Symptom</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Use our interactive body map to discover natural remedies for your specific health concerns.
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <Suspense fallback={
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading interactive body map...</p>
                </div>
              }>
                <BodyMap />
              </Suspense>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="section-padding">
          <div className="container-max">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Community Says</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Join thousands of satisfied customers who have found natural solutions through The NerveVine.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial-card p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">&ldquo;{testimonial.content}&rdquo;</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-green-700">
          <div className="container-max text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Wellness Journey?</h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Discover natural solutions that work with your body, not against it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/search" 
                className="bg-white text-green-700 px-8 py-4 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Find Your Solution
              </Link>
              <Link 
                href="/systems/nervous" 
                className="border-2 border-white text-white px-8 py-4 text-lg font-semibold rounded-lg hover:bg-white hover:text-green-700 transition-colors"
              >
                Nervous System Support
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-blue-950 text-white py-12">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">The NerveVine</h3>
              <p className="text-gray-300 mb-4">
                Your trusted guide to natural nervous system support, stress relief, and emotional resilience.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/herbs" className="hover:text-white transition-colors">Herbs</Link></li>
                <li><Link href="/supplements" className="hover:text-white transition-colors">Supplements</Link></li>
                <li><Link href="/symptoms" className="hover:text-white transition-colors">Symptom Solutions</Link></li>
                <li><Link href="/search" className="hover:text-white transition-colors">Custom Search</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quality Assurance</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Herbalist-Curated</li>
                <li>Scientifically Backed</li>
                <li>Premium Quality</li>
                <li>Natural & Safe</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} The NerveVine. All rights reserved.</p>
            <p className="mt-2 text-sm">
              Empowering you with herbal wisdom and natural support—rooted in science, tradition, and care.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
} 
