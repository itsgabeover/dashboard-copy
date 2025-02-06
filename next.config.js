/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  // Add any other necessary configurations here
}

module.exports = nextConfig
