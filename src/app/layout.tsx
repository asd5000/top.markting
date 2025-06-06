import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/lib/auth/auth-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'توب ماركتنج - خدمات التسويق الرقمي',
  description: 'شركة توب ماركتنج للخدمات الرقمية والتسويقية. نقدم خدمات التصميم، التطوير، التسويق الرقمي، واستخراج البيانات.',
  keywords: 'تسويق رقمي, تصميم مواقع, تطوير تطبيقات, استخراج بيانات, زيادة متابعين, عقارات',
  authors: [{ name: 'Top Marketing' }],
  creator: 'Top Marketing',
  publisher: 'Top Marketing',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'توب ماركتنج - خدمات التسويق الرقمي',
    description: 'شركة توب ماركتنج للخدمات الرقمية والتسويقية',
    url: 'http://localhost:3000',
    siteName: 'Top Marketing',
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'توب ماركتنج - خدمات التسويق الرقمي',
    description: 'شركة توب ماركتنج للخدمات الرقمية والتسويقية',
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
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                fontFamily: 'inherit',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
