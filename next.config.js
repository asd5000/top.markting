/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'xanzptntwwmpulqutoiv.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  // دعم اللغة العربية و RTL
  i18n: {
    locales: ['ar'],
    defaultLocale: 'ar',
  },
  // تحسين البناء للإنتاج
  swcMinify: true,
}

module.exports = nextConfig
