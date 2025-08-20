import type { Metadata } from "next";
import { Lato, Merriweather } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
// import { Analytics } from '@vercel/analytics/react';
// import { SpeedInsights } from '@vercel/speed-insights/next';

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["700", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "The NerveVine - Natural Herbal Supplements for Nervous System Health",
    template: "%s | The NerveVine"
  },
  description: "Discover premium herbal supplements for nervous system support, stress relief, and natural wellness. Expert-curated products with quality filtering for optimal health outcomes.",
  icons: {
    icon: '/images/favfavicon.png',
    shortcut: '/images/favfavicon.png',
    apple: '/images/favfavicon.png',
  },
  keywords: [
    "herbal supplements",
    "nervous system health",
    "natural stress relief",
    "anxiety supplements",
    "sleep herbs",
    "organic supplements",
    "nervous system support",
    "herbal medicine",
    "natural wellness",
    "stress management",
    "adaptogens",
    "nervine herbs"
  ],
  authors: [{ name: "The NerveVine" }],
  creator: "The NerveVine",
  publisher: "The NerveVine",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://thenervevine.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://thenervevine.com',
    title: 'The NerveVine - Natural Herbal Supplements for Nervous System Health',
    description: 'Discover premium herbal supplements for nervous system support, stress relief, and natural wellness.',
    siteName: 'The NerveVine',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'The NerveVine - Natural Herbal Supplements',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The NerveVine - Natural Herbal Supplements for Nervous System Health',
    description: 'Discover premium herbal supplements for nervous system support, stress relief, and natural wellness.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  other: {
    'geo.region': 'US',
    'geo.placename': 'United States',
    'geo.position': '37.0902;-95.7129',
    'ICBM': '37.0902, -95.7129',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "The NerveVine",
              "url": "https://thenervevine.com",
              "logo": "https://thenervevine.com/images/nervevine smalllogo1.svg",
              "description": "Natural herbal supplements for nervous system health and wellness",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "US"
              },
              "sameAs": [
                "https://facebook.com/thenervevine",
                "https://twitter.com/thenervevine",
                "https://instagram.com/thenervevine"
              ]
            })
          }}
        />
      </head>
      <body className={`${lato.variable} ${merriweather.variable} font-sans flex flex-col min-h-screen`}>
        <SessionProviderWrapper>
          <Header />
          <main className="flex-grow pt-32">
            {children}
          </main>
          <Footer />
        </SessionProviderWrapper>
        {/* <Analytics /> */}
        {/* <SpeedInsights /> */}
      </body>
    </html>
  );
}
