// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    domains: [
      'images.clerk.dev',
      'img.clerk.com',
      'localhost',
      'your-backend-domain.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
      },
    ],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Optimize for production
  poweredByHeader: false,
  reactStrictMode: true,

  // File uploads configuration
  serverExternalPackages: ['sharp'],

  // Webpack configuration to fix cache serialization warning
  webpack: (config, { dev, isServer }) => {
    // Suppress the webpack cache warning about large strings
    config.infrastructureLogging = {
      level: 'error',
    }

    // Optimize chunk splitting for better caching
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          clerk: {
            test: /[\\/]node_modules[\\/]@clerk[\\/]/,
            name: 'clerk',
            chunks: 'all',
            priority: 20,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
        },
      }
    }

    return config
  },
}

export default nextConfig