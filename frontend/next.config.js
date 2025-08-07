/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com', 'res.cloudinary.com', 'avatars.githubusercontent.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    appDir: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'production' 
      ? 'https://your-backend-url.vercel.app/api'
      : 'http://localhost:5000/api'
  }
}

module.exports = nextConfig