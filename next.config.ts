import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  eslint: {
    // It's recommended to disable this for production builds
    // to ensure code quality.
    ignoreDuringBuilds: false,
  },
  typescript: {
    // It's recommended to disable this for production builds
    // to ensure type safety.
    ignoreBuildErrors: false,
  },
  turbopack: {
    resolveAlias: {
      // PDF.js module resolution aliases can be added here if needed
    },
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  },
  webpack: (config: any, { dev, isServer }: any) => {
    // Only apply webpack config when not using turbopack
    if (process.env.TURBOPACK || process.env.__NEXT_EXPERIMENTAL_TURBOPACK) {
      return config;
    }
    
    // Handle PDF.js module resolution for webpack builds
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
    };

    // Ensure PDF.js can be imported properly
    config.externals = config.externals || [];

    return config;
  },

};

export default nextConfig;
