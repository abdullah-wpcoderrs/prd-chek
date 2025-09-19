import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
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
