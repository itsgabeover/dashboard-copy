/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false
  },
  experimental: {
    serverActions: true
  },
  webpack: (
    config: any,
    { isServer }: { isServer: boolean }
  ) => {
    if (isServer) {
      config.externals = [...config.externals, 'puppeteer'];
    }
    return config;
  }
}

module.exports = nextConfig
