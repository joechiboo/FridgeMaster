/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/FridgeMaster' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/FridgeMaster/' : '',
}

module.exports = nextConfig
