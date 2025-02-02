import type { NextConfig } from "next"
import type { Configuration as WebpackConfig } from "webpack"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config: WebpackConfig) => {
    if (config.resolve && config.resolve.alias) {
      config.resolve.alias.canvas = false
    }
    return config
  },
}

export default nextConfig

