import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    if (config.resolve && config.resolve.alias) {
      config.resolve.alias.canvas = false
    }
    return config
  },
}

export default nextConfig

