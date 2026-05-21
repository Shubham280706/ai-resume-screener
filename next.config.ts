import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standalone output for smaller Docker images and better performance
  output: "standalone",

  // Optimize production builds
  productionBrowserSourceMaps: false,

  // Enable SWR (stale-while-revalidate) for better caching
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },

  // Compression
  compress: true,

  // Security headers
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },

  // Turbopack config for development (replaces webpack polling in Docker)
  turbopack: {
    resolveAlias: {},
  },
};

export default nextConfig;
