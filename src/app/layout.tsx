import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Top Marketing - نظام إداري متكامل',
  description: 'نظام إداري متكامل لإدارة خدمات التسويق والتصميم والمونتاج وصفحات السوشيال ميديا',
  keywords: 'تسويق, تصميم, مونتاج, سوشيال ميديا, عقارات, إدارة صفحات',
  authors: [{ name: 'Top Marketing Team' }],
  creator: 'Top Marketing',
  publisher: 'Top Marketing',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'Top Marketing - نظام إداري متكامل',
    description: 'نظام إداري متكامل لإدارة خدمات التسويق والتصميم والمونتاج وصفحات السوشيال ميديا',
    url: 'http://localhost:3000',
    siteName: 'Top Marketing',
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top Marketing - نظام إداري متكامل',
    description: 'نظام إداري متكامل لإدارة خدمات التسويق والتصميم والمونتاج وصفحات السوشيال ميديا',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
