/** @type {import('next').NextConfig} */
const nextConfig = {
  // appDir 在 Next.js 13.4+ 中默认启用，无需在 experimental 中配置
  swcMinify: true,
  
  // 配置允许的外部图片域名 (使用新的 remotePatterns 配置)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pvznifymjkunclzzquje.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      }
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // 性能优化配置
  poweredByHeader: false,
  compress: true,
  
  // 实验性功能
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'framer-motion']
  }
}

module.exports = nextConfig
