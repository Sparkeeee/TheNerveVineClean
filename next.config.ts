import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Aggressive image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 YEAR cache
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Reduced sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256], // Reduced sizes
    dangerouslyAllowSVG: true, // Allow SVG optimization
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Aggressive compression
  compress: true,
  
  // Static generation optimization
  trailingSlash: false,
  
  // Ensure public access
  publicRuntimeConfig: {
    publicAccess: true,
  },
  
  // Fix for Next.js 15 - moved from experimental
  serverExternalPackages: ['@prisma/client'],
  
  // Experimental features for performance
  experimental: {
    optimizeCss: true,
    // Removed conflicting optimizePackageImports
  },
  
  // Fixed headers - remove aggressive API caching
  async headers() {
    return [
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 year for images only
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=900', // 5min browser, 15min CDN for API routes
          },
        ],
      },
    ];
  },
};

export default nextConfig;
