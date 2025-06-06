'use client'

import Link from 'next/link'
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Facebook, 
  Instagram, 
  Twitter,
  Linkedin,
  ArrowUp
} from 'lucide-react'
import { useState, useEffect } from 'react'

const services = [
  { name: 'التصميم الجرافيكي', href: '/design' },
  { name: 'تطوير المواقع', href: '/web-development' },
  { name: 'التسويق الرقمي', href: '/marketing' },
  { name: 'استخراج البيانات', href: '/data-extraction' },
  { name: 'زيادة المتابعين', href: '/followers' },
  { name: 'التسويق العقاري', href: '/real-estate' },
]

const quickLinks = [
  { name: 'الرئيسية', href: '/' },
  { name: 'من نحن', href: '/about' },
  { name: 'خدماتنا', href: '/services' },
  { name: 'معرض الأعمال', href: '/portfolio' },
  { name: 'تواصل معنا', href: '/contact' },
]

const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://facebook.com/topmarketing',
    icon: Facebook,
    color: 'hover:text-blue-600'
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/topmarketing',
    icon: Instagram,
    color: 'hover:text-pink-600'
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/topmarketing',
    icon: Twitter,
    color: 'hover:text-blue-400'
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/company/topmarketing',
    icon: Linkedin,
    color: 'hover:text-blue-700'
  },
]

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <footer className="bg-gray-900 text-white relative">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4 text-gradient-primary">
              توب ماركتنج
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              شركة متخصصة في الخدمات الرقمية والتسويقية. نساعدك في تحويل أفكارك إلى واقع رقمي ناجح.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="w-5 h-5 ml-3 text-blue-400" />
                <a 
                  href="tel:+201068275557" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  +201068275557
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 ml-3 text-blue-400" />
                <a 
                  href="mailto:info@topmarketing.com" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  info@topmarketing.com
                </a>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 ml-3 text-blue-400" />
                <span className="text-gray-400">
                  القاهرة، مصر
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">روابط سريعة</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">خدماتنا</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link 
                    href={service.href} 
                    className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-lg font-semibold mb-6">تواصل معنا</h4>
            
            {/* Contact Buttons */}
            <div className="space-y-3 mb-6">
              <a
                href="https://wa.me/201068275557"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4 ml-2" />
                واتساب
              </a>
              <a
                href="tel:+201068275557"
                className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                <Phone className="w-4 h-4 ml-2" />
                اتصل بنا
              </a>
            </div>

            {/* Social Media */}
            <div>
              <h5 className="text-sm font-medium mb-3 text-gray-300">تابعنا على</h5>
              <div className="flex space-x-4 space-x-reverse">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-400 ${social.color} transition-colors p-2 rounded-lg hover:bg-gray-800`}
                    title={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 توب ماركتنج. جميع الحقوق محفوظة.
            </div>
            <div className="flex space-x-6 space-x-reverse text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                سياسة الخصوصية
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                شروط الاستخدام
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors">
                خريطة الموقع
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 left-8 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
          aria-label="العودة إلى الأعلى"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </footer>
  )
}
