'use client'

import { motion } from 'framer-motion'
import { Users, Heart, MessageCircle, Share, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const services = [
  {
    title: 'زيادة متابعين فيسبوك',
    description: 'زيادة متابعين حقيقيين ومتفاعلين على صفحتك',
    icon: Users,
    features: ['متابعين حقيقيين', 'تفاعل طبيعي', 'نمو تدريجي', 'ضمان الجودة'],
    price: 'يبدأ من 200 جنيه'
  },
  {
    title: 'زيادة متابعين انستجرام',
    description: 'نمو طبيعي لحسابك على انستجرام',
    icon: Heart,
    features: ['متابعين مستهدفين', 'زيادة الإعجابات', 'تحسين الوصول', 'محتوى جذاب'],
    price: 'يبدأ من 250 جنيه'
  },
  {
    title: 'إدارة المحتوى',
    description: 'إنشاء ونشر محتوى يومي جذاب',
    icon: MessageCircle,
    features: ['محتوى يومي', 'تصاميم احترافية', 'جدولة النشر', 'تفاعل مع التعليقات'],
    price: 'يبدأ من 500 جنيه شهرياً'
  },
  {
    title: 'تحليل الأداء',
    description: 'تقارير مفصلة عن أداء حساباتك',
    icon: Share,
    features: ['إحصائيات مفصلة', 'تحليل الجمهور', 'أفضل أوقات النشر', 'توصيات للتحسين'],
    price: 'يبدأ من 300 جنيه شهرياً'
  }
]

export default function FollowersPage() {
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
              زيادة المتابعين والتفاعل
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              نساعدك في بناء جمهور حقيقي ومتفاعل على وسائل التواصل الاجتماعي
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
                <div className="bg-pink-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                  <service.icon className="w-8 h-8 text-pink-600" />
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
                    className="w-full bg-pink-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-pink-700 transition-colors flex items-center justify-center group"
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
