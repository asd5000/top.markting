'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navigation = [
  { name: 'الرئيسية', href: '/' },
  { name: 'من نحن', href: '/about' },
  { name: 'خدماتنا', href: '/services' },
  { name: 'معرض الأعمال', href: '/portfolio' },
  { name: 'تواصل معنا', href: '/contact' },
]

const services = [
  { name: 'التصميم الجرافيكي', href: '/design' },
  { name: 'تطوير المواقع', href: '/web-development' },
  { name: 'التسويق الرقمي', href: '/marketing' },
  { name: 'استخراج البيانات', href: '/data-extraction' },
  { name: 'زيادة المتابعين', href: '/followers' },
  { name: 'التسويق العقاري', href: '/real-estate' },
  { name: 'نظام الوساطة العقارية', href: '/real-estate-system' },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="bg-white shadow-lg border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-gradient-primary">
                توب ماركتنج
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.name === 'خدماتنا' ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <Link
                      href={item.href}
                      className={`text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors ${
                        isActive(item.href) ? 'text-blue-600' : ''
                      }`}
                    >
                      {item.name}
                    </Link>
                    
                    <AnimatePresence>
                      {servicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border py-2 z-50"
                        >
                          {services.map((service) => (
                            <Link
                              key={service.name}
                              href={service.href}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                              {service.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors ${
                      isActive(item.href) ? 'text-blue-600' : ''
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Contact Buttons */}
          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            <a
              href="tel:+201068275557"
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              title="اتصل بنا"
            >
              <Phone className="w-5 h-5" />
            </a>
            <a
              href="https://wa.me/201068275557"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
              title="واتساب"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <Link
              href="/contact"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              احصل على عرض سعر
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  
                  {item.name === 'خدماتنا' && (
                    <div className="pr-6 space-y-1">
                      {services.map((service) => (
                        <Link
                          key={service.name}
                          href={service.href}
                          className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {service.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Mobile Contact Buttons */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex space-x-4 space-x-reverse px-3">
                  <a
                    href="tel:+201068275557"
                    className="flex items-center justify-center flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Phone className="w-4 h-4 ml-2" />
                    اتصل بنا
                  </a>
                  <a
                    href="https://wa.me/201068275557"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 ml-2" />
                    واتساب
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
