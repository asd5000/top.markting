'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Palette,
  Code,
  TrendingUp,
  Database,
  Users,
  Building,
  Phone,
  Mail,
  MessageCircle,
  Star,
  CheckCircle,
  ArrowLeft,
  LogIn,
  UserPlus,
  ShoppingCart,
  Package
} from 'lucide-react'
import Link from 'next/link'

const services = [
  {
    id: 'design',
    title: 'التصميم الجرافيكي',
    description: 'تصميم شعارات، هويات بصرية، ومواد تسويقية احترافية',
    icon: Palette,
    color: 'bg-purple-500',
    href: '/design'
  },
  {
    id: 'web-development',
    title: 'تطوير المواقع',
    description: 'تطوير مواقع ويب وتطبيقات متجاوبة وحديثة',
    icon: Code,
    color: 'bg-blue-500',
    href: '/web-development'
  },
  {
    id: 'marketing',
    title: 'التسويق الرقمي',
    description: 'حملات تسويقية مدروسة لزيادة المبيعات والوصول',
    icon: TrendingUp,
    color: 'bg-green-500',
    href: '/marketing'
  },
  {
    id: 'data-extraction',
    title: 'استخراج البيانات',
    description: 'جمع وتحليل البيانات من مصادر مختلفة',
    icon: Database,
    color: 'bg-orange-500',
    href: '/data-extraction'
  },
  {
    id: 'followers',
    title: 'زيادة المتابعين',
    description: 'خدمات زيادة المتابعين والتفاعل على وسائل التواصل',
    icon: Users,
    color: 'bg-pink-500',
    href: '/followers'
  },
  {
    id: 'real-estate-marketing',
    title: 'التسويق العقاري',
    description: 'خدمات تسويق العقارات للبيع والشراء',
    icon: Building,
    color: 'bg-orange-500',
    href: '/services-shop?category=real-estate'
  },
  {
    id: 'page-management',
    title: 'باقات إدارة الصفحات',
    description: 'باقات شاملة لإدارة وتطوير حضورك الرقمي',
    icon: Package,
    color: 'bg-purple-500',
    href: '/services-shop'
  }
]

const stats = [
  { number: '500+', label: 'عميل راضي' },
  { number: '1000+', label: 'مشروع مكتمل' },
  { number: '5+', label: 'سنوات خبرة' },
  { number: '24/7', label: 'دعم فني' }
]

const testimonials = [
  {
    name: 'أحمد محمد',
    role: 'مدير شركة',
    content: 'خدمة ممتازة وجودة عالية في التصميم والتطوير',
    rating: 5
  },
  {
    name: 'فاطمة علي',
    role: 'صاحبة متجر إلكتروني',
    content: 'ساعدوني في زيادة مبيعاتي بشكل كبير',
    rating: 5
  },
  {
    name: 'محمد حسن',
    role: 'مطور',
    content: 'فريق محترف ومتعاون، أنصح بالتعامل معهم',
    rating: 5
  }
]

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gradient-primary">
                توب ماركتنج
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-4 space-x-reverse">
              <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
                من نحن
              </Link>
              <Link href="/services" className="text-gray-600 hover:text-blue-600 transition-colors">
                خدماتنا
              </Link>
              <Link href="/services-shop" className="text-gray-600 hover:text-blue-600 transition-colors">
                متجر الخدمات
              </Link>
              <Link href="/portfolio" className="text-gray-600 hover:text-blue-600 transition-colors">
                معرض الأعمال
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                تواصل معنا
              </Link>
              <Link href="/auth/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <LogIn className="w-4 h-4 ml-2" />
                دخول
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="gradient-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              نحول أفكارك إلى واقع رقمي
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              شركة توب ماركتنج للخدمات الرقمية والتسويقية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/services-shop"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                <ShoppingCart className="w-5 h-5 ml-2" />
                تسوق الخدمات
              </Link>
              <Link
                href="/auth/login"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center"
              >
                <LogIn className="w-5 h-5 ml-2" />
                تسجيل الدخول
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              خدماتنا المتميزة
            </h2>
            <p className="text-xl text-gray-600">
              نقدم مجموعة شاملة من الخدمات الرقمية لتلبية احتياجاتك
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
              >
                <Link href={service.href}>
                  <div className="card-hover group cursor-pointer">
                    <div className={`${service.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <service.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {service.description}
                    </p>
                    <div className="flex items-center text-blue-600 group-hover:text-blue-700">
                      <span className="font-medium">اعرف المزيد</span>
                      <ArrowLeft className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 gradient-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              جاهز لبدء مشروعك؟
            </h2>
            <p className="text-xl mb-8 opacity-90">
              تواصل معنا اليوم واحصل على استشارة مجانية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+201068275557"
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                <Phone className="w-5 h-5 ml-2" />
                اتصل بنا
              </a>
              <a
                href="https://wa.me/201068275557"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5 ml-2" />
                واتساب
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">توب ماركتنج</h3>
              <p className="text-gray-400">
                شركة متخصصة في الخدمات الرقمية والتسويقية
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">من نحن</Link></li>
                <li><Link href="/services" className="text-gray-400 hover:text-white transition-colors">خدماتنا</Link></li>
                <li><Link href="/portfolio" className="text-gray-400 hover:text-white transition-colors">معرض الأعمال</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">تواصل معنا</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">تواصل معنا</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 ml-2" />
                  <span className="text-gray-400">+201068275557</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 ml-2" />
                  <span className="text-gray-400">info@topmarketing.com</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 توب ماركتنج. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
