/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'images.unsplash.com', 'via.placeholder.com'],
    unoptimized: true
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  }
}

module.exports = nextConfig
