import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable compression for better performance
  compress: true,

  // Disable caching in development
  ...(process.env.NODE_ENV === "development" && {
    onDemandEntries: {
      // period (in ms) where the server will keep pages in the buffer
      maxInactiveAge: 25 * 1000,
      // number of pages that should be kept simultaneously without being disposed
      pagesBufferLength: 2,
    },
  }),

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
    const isDev = process.env.NODE_ENV === "development";

    return [
      // Cache static assets aggressively (disabled in development)
      {
        source: "/(.*\\.(?:ico|png|jpg|jpeg|gif|webp|svg|css|js))",
        headers: [
          {
            key: "Cache-Control",
            value: isDev
              ? "no-cache, no-store, must-revalidate" // No caching in development
              : "public, max-age=31536000, immutable", // 1 year in production
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
      // Cache fonts aggressively (disabled in development)
      {
        source: "/fonts/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: isDev
              ? "no-cache, no-store, must-revalidate" // No caching in development
              : "public, max-age=31536000, immutable", // 1 year in production
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
      // API routes with shorter cache (disabled in development)
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: isDev
              ? "no-cache, no-store, must-revalidate" // No caching in development
              : "public, s-maxage=3600, stale-while-revalidate=86400", // 1 hour cache, 24 hour stale in production
          },
        ],
      },
      // HTML pages with smart caching (disabled in development)
      {
        source: "/((?!api|_next|static).*)",
        headers: [
          {
            key: "Cache-Control",
            value: isDev
              ? "no-cache, no-store, must-revalidate" // No caching in development
              : "public, s-maxage=600, stale-while-revalidate=86400", // 10 min cache, 24 hour stale in production
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
