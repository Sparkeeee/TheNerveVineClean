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
  
  // Remove problematic output setting
  // output: 'standalone', // THIS BREAKS PRISMA
  
  // Ensure public access
  publicRuntimeConfig: {
    publicAccess: true,
  },
  
  // Experimental features for performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@prisma/client'],
    serverComponentsExternalPackages: ['@prisma/client'], // Fix Prisma in production
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
            value: 'no-cache', // No caching for API routes during debugging
          },
        ],
      },
    ];
  },
};

export default nextConfig;
