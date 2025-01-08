import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: true
  },
  webpack: (config: any) => {
    config.externals = [...config.externals, 'chrome-aws-lambda'];
    return config;
  }
};

export default nextConfig;
