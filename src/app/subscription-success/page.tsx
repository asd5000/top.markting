'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle, Home, Package, Clock, Phone, MessageCircle } from 'lucide-react'

export default function SubscriptionSuccessPage() {
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          window.location.href = '/'
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          تم إرسال طلب الاشتراك بنجاح!
        </h1>

        <p className="text-gray-600 mb-6 leading-relaxed">
          شكراً لك على اختيار خدماتنا. تم استلام طلب الاشتراك وسيتم مراجعته من قبل فريقنا.
        </p>

        {/* Status Steps */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-right">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center">
            <Clock className="w-5 h-5 ml-2 text-blue-600" />
            الخطوات التالية:
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
              <span>تم استلام طلب الاشتراك ✓</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full ml-2"></div>
              <span>مراجعة الإيصال والبيانات (1-2 ساعة)</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gray-300 rounded-full ml-2"></div>
              <span>تفعيل الاشتراك وبدء الخدمة</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gray-300 rounded-full ml-2"></div>
              <span>التواصل معك لتأكيد التفاصيل</span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-blue-900 mb-3">للاستفسار أو المتابعة:</h3>
          <div className="space-y-2">
            <a
              href="tel:01068275557"
              className="flex items-center justify-center text-blue-600 hover:text-blue-700"
            >
              <Phone className="w-4 h-4 ml-2" />
              <span>01068275557</span>
            </a>
            <a
              href="https://wa.me/201068275557?text=استفسار عن حالة الاشتراك"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center text-green-600 hover:text-green-700"
            >
              <MessageCircle className="w-4 h-4 ml-2" />
              <span>واتساب</span>
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
          >
            <Home className="w-5 h-5 ml-2" />
            العودة للرئيسية
          </Link>

          <Link
            href="/packages"
            className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center"
          >
            <Package className="w-5 h-5 ml-2" />
            عرض الباقات الأخرى
          </Link>
        </div>

        {/* Auto Redirect */}
        <div className="mt-6 text-sm text-gray-500">
          سيتم توجيهك للصفحة الرئيسية خلال {countdown} ثواني
        </div>
      </div>
    </div>
  )
}
