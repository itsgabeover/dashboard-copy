/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Ensure config.resolve exists
    if (!config.resolve) {
      config.resolve = {}
    }
    // Ensure alias object exists
    if (!config.resolve.alias) {
      config.resolve.alias = {}
    }
    // Preserve existing canvas alias configuration
    config.resolve.alias.canvas = false
    // Ensure fallback object exists
    if (!config.resolve.fallback) {
      config.resolve.fallback = {}
    }
    // Add support for framer-motion and SVG animations
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    }
    return config
  },
  // Ensure images from placeholder.svg and other necessary domains are allowed
  images: {
    domains: ["placeholder.svg", "openai.com", "avatars.githubusercontent.com"],
  },
  // Enable SWC minification for improved performance
  swcMinify: true,
  // Experimental features
  experimental: {
    serverComponents: true,
    appDir: true,
    serverActions: true,
  },
  // Configure headers for security and content types
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: "/api/text-to-speech",
        headers: [
          {
            key: "Content-Type",
            value: "audio/mpeg",
          },
        ],
      },
    ]
  },
  // Optimize for Vercel deployment
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
  },
}

module.exports = nextConfig
