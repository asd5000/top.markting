/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  // دعم اللغة العربية و RTL
  i18n: {
    locales: ['ar'],
    defaultLocale: 'ar',
  },
}

module.exports = nextConfig
