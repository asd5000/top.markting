'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Target, BarChart, Users, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const services = [
  {
    title: 'إدارة وسائل التواصل الاجتماعي',
    description: 'إدارة شاملة لحساباتك على جميع منصات التواصل الاجتماعي',
    icon: Users,
    features: ['إنشاء محتوى يومي', 'تفاعل مع الجمهور', 'تحليل الأداء', 'تقارير شهرية'],
    price: 'يبدأ من 1000 جنيه شهرياً'
  },
  {
    title: 'الحملات الإعلانية المدفوعة',
    description: 'حملات إعلانية مستهدفة على فيسبوك وجوجل وانستجرام',
    icon: Target,
    features: ['استهداف دقيق', 'تصميم الإعلانات', 'تحسين الحملات', 'تقارير يومية'],
    price: 'يبدأ من 500 جنيه + ميزانية الإعلان'
  },
  {
    title: 'تحسين محركات البحث SEO',
    description: 'تحسين موقعك ليظهر في النتائج الأولى لمحركات البحث',
    icon: TrendingUp,
    features: ['تحليل الكلمات المفتاحية', 'تحسين المحتوى', 'بناء الروابط', 'تقارير شهرية'],
    price: 'يبدأ من 800 جنيه شهرياً'
  },
  {
    title: 'التسويق بالمحتوى',
    description: 'إنشاء محتوى قيم يجذب عملاءك المحتملين',
    icon: BarChart,
    features: ['استراتيجية المحتوى', 'كتابة المقالات', 'تصميم الانفوجرافيك', 'جدولة النشر'],
    price: 'يبدأ من 600 جنيه شهرياً'
  }
]

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <section className="gradient-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              التسويق الرقمي
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              نساعدك في الوصول لجمهورك المستهدف وزيادة مبيعاتك من خلال استراتيجيات تسويقية مدروسة
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                className="bg-gray-50 rounded-xl p-8"
              >
                <div className="bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                  <service.icon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <div className="space-y-3 mb-6">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 ml-3" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-6">
                  <div className="font-bold text-gray-900 mb-4">{service.price}</div>
                  <Link
                    href="/contact"
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center group"
                  >
                    <span>اطلب الخدمة</span>
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
