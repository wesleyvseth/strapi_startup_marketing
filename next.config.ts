import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable compression for better performance
  compress: true,

  // Optimize images with caching
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache for images
  },

  // Enable experimental features for better caching
  experimental: {
    // Enable static generation optimization
    optimizePackageImports: ["axios"],
  },

  // Security and performance headers
  async headers() {
    return [
      // Cache static assets aggressively
      {
        source: "/(.*\\.(?:ico|png|jpg|jpeg|gif|webp|svg|css|js))",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable", // 1 year
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
      // Cache fonts aggressively
      {
        source: "/fonts/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
      // API routes with shorter cache
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400", // 1 hour cache, 24 hour stale
          },
        ],
      },
      // HTML pages with smart caching
      {
        source: "/((?!api|_next|static).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=600, stale-while-revalidate=86400", // 10 min cache, 24 hour stale
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // Enable static optimization
  output: "standalone",

  // Optimize webpack for better caching
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Better long-term caching for client bundles
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;
