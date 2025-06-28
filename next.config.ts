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
  swcMinify: true,
  poweredByHeader: false,
  reactStrictMode: true,
  
  // File uploads configuration
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
  },
  
  // API routes configuration
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default nextConfig