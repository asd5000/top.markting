'use client'

import { motion } from 'framer-motion'
import { Code, Smartphone, ShoppingCart, Database, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const services = [
  {
    title: 'مواقع الويب التجارية',
    description: 'مواقع ويب احترافية متجاوبة لعرض خدماتك ومنتجاتك',
    icon: Code,
    features: ['تصميم متجاوب', 'سرعة عالية', 'تحسين SEO', 'لوحة تحكم'],
    price: 'يبدأ من 2000 جنيه'
  },
  {
    title: 'تطبيقات الجوال',
    description: 'تطبيقات جوال لنظامي iOS و Android',
    icon: Smartphone,
    features: ['تطبيق أصلي', 'واجهة سهلة', 'إشعارات فورية', 'تحديثات مجانية'],
    price: 'يبدأ من 5000 جنيه'
  },
  {
    title: 'المتاجر الإلكترونية',
    description: 'متاجر إلكترونية متكاملة مع أنظمة الدفع',
    icon: ShoppingCart,
    features: ['نظام دفع آمن', 'إدارة المخزون', 'تقارير المبيعات', 'دعم العملاء'],
    price: 'يبدأ من 3500 جنيه'
  },
  {
    title: 'أنظمة إدارة البيانات',
    description: 'أنظمة مخصصة لإدارة بيانات شركتك',
    icon: Database,
    features: ['قواعد بيانات آمنة', 'تقارير تفصيلية', 'نسخ احتياطية', 'صلاحيات المستخدمين'],
    price: 'يبدأ من 4000 جنيه'
  }
]

export default function WebDevelopmentPage() {
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
              تطوير المواقع والتطبيقات
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              نطور مواقع ويب وتطبيقات جوال حديثة وسريعة باستخدام أحدث التقنيات
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
                <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                  <service.icon className="w-8 h-8 text-blue-600" />
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
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center group"
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
