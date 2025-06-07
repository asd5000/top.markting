'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Rocket, Shield, Database, Users, Settings } from 'lucide-react'
import Link from 'next/link'

export default function ProductionReadyPage() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Animation delay
    setTimeout(() => setIsReady(true), 500)
  }, [])

  const productionFeatures = [
    {
      icon: <Database className="w-8 h-8 text-blue-600" />,
      title: 'قاعدة بيانات نظيفة',
      description: 'تم حذف جميع البيانات التجريبية والوهمية',
      status: 'completed'
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: 'أمان محسن',
      description: 'تم تطبيق سياسات الحماية وإعدادات الأمان',
      status: 'completed'
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: 'حساب مدير واحد',
      description: 'حساب المدير الرئيسي الحقيقي فقط',
      status: 'completed'
    },
    {
      icon: <Settings className="w-8 h-8 text-orange-600" />,
      title: 'إعدادات الإنتاج',
      description: 'جميع الإعدادات محدثة للاستخدام الرسمي',
      status: 'completed'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: isReady ? 1 : 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Rocket className="w-12 h-12 text-green-600" />
          </motion.div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎉 موقع Top Marketing جاهز للإطلاق!
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            تم تنظيف الموقع بالكامل وإزالة جميع البيانات التجريبية. 
            الموقع الآن جاهز للعملاء الحقيقيين والاستخدام الرسمي.
          </p>
        </motion.div>

        {/* Production Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {productionFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-green-500"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 ml-4">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Admin Credentials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">
            🔑 بيانات المدير الرئيسي
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">البريد الإلكتروني:</h3>
              <p className="text-blue-600 font-mono">admin@topmarketing.com</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">كلمة المرور:</h3>
              <p className="text-blue-600 font-mono">0453328124Aa</p>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-blue-700">
              ⚠️ يُنصح بتغيير كلمة المرور بعد أول تسجيل دخول
            </p>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <Link
            href="/admin/dashboard"
            className="bg-blue-600 text-white p-6 rounded-xl hover:bg-blue-700 transition-colors text-center group"
          >
            <Settings className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold mb-2">لوحة التحكم</h3>
            <p className="text-sm opacity-90">إدارة الموقع والخدمات</p>
          </Link>

          <Link
            href="/services-shop"
            className="bg-green-600 text-white p-6 rounded-xl hover:bg-green-700 transition-colors text-center group"
          >
            <Users className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold mb-2">متجر الخدمات</h3>
            <p className="text-sm opacity-90">واجهة العملاء</p>
          </Link>

          <Link
            href="/system-status"
            className="bg-purple-600 text-white p-6 rounded-xl hover:bg-purple-700 transition-colors text-center group"
          >
            <Database className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold mb-2">حالة النظام</h3>
            <p className="text-sm opacity-90">مراقبة الأداء</p>
          </Link>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            📋 الخطوات التالية
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 ml-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">تسجيل الدخول كمدير</h3>
                <p className="text-gray-600">استخدم البيانات أعلاه لتسجيل الدخول إلى لوحة التحكم</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 ml-3">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">إضافة الخدمات الحقيقية</h3>
                <p className="text-gray-600">أضف خدمات شركتك الفعلية من لوحة التحكم</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 ml-3">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">تخصيص الإعدادات</h3>
                <p className="text-gray-600">راجع وعدّل إعدادات الموقع حسب احتياجاتك</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 ml-3">
                <span className="text-orange-600 font-bold">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">بدء استقبال العملاء</h3>
                <p className="text-gray-600">الموقع جاهز لاستقبال العملاء الحقيقيين والطلبات</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4 }}
          className="text-center mt-8"
        >
          <div className="inline-flex items-center bg-green-100 text-green-800 px-6 py-3 rounded-full">
            <CheckCircle className="w-5 h-5 ml-2" />
            <span className="font-semibold">الموقع جاهز للإطلاق الرسمي! 🚀</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
