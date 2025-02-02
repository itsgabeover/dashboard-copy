import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (config.resolve && config.resolve.alias) {
      config.resolve.alias.canvas = false
    }
    return config
  },
}

export default nextConfig

