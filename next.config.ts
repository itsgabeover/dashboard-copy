import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'  // Or whatever limit you need
    }
  },
  webpack: (config: any) => {
    config.externals = [...config.externals, 'chrome-aws-lambda'];
    return config;
  }
};

export default nextConfig;
