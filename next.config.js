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
  // Ensure images from placeholder.svg are allowed
  images: {
    domains: ["placeholder.svg"],
  },
}

module.exports = nextConfig

