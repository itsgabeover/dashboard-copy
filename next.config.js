import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    if (config.resolve) {
      // Preserve existing canvas alias configuration
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: false,
      }

      // Add support for framer-motion and SVG animations
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      }
    }

    return config
  },
  // Ensure images from placeholder.svg are allowed
  images: {
    domains: ["placeholder.svg"],
  },
}

export default nextConfig

