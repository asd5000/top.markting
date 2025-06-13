'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, Home, Settings, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function LoginSuccessPage() {
  const [admin, setAdmin] = useState<any>(null)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    // جلب بيانات المدير من localStorage
    const adminData = localStorage.getItem('admin') || localStorage.getItem('adminSession')
    if (adminData) {
      try {
        setAdmin(JSON.parse(adminData))
      } catch (error) {
        console.error('خطأ في قراءة بيانات المدير:', error)
      }
    }

    // العد التنازلي للانتقال التلقائي للصفحة الرئيسية
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          // الانتقال للصفحة الرئيسية
          window.location.href = '/'
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center" dir="rtl">
      <div className="max-w-md w-full mx-4">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🎉 تم تسجيل الدخول بنجاح!
          </h1>

          {admin && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-medium">مرحباً بك، {admin.name}</p>
              <p className="text-green-600 text-sm">الدور: {admin.role}</p>
              <p className="text-green-600 text-sm">البريد: {admin.email}</p>
            </div>
          )}

          {/* Countdown */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              سيتم توجيهك للصفحة الرئيسية خلال {countdown} ثواني...
            </p>
            <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((5 - countdown) / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center"
            >
              <Home className="w-5 h-5 ml-2" />
              الذهاب للصفحة الرئيسية
            </Link>

            <button
              onClick={() => window.location.href = '/admin/dashboard'}
              className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-all duration-200 flex items-center justify-center"
            >
              <Settings className="w-5 h-5 ml-2" />
              محاولة الوصول للوحة التحكم الأصلية
            </button>

            <Link
              href="/admin/login"
              className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 flex items-center justify-center text-sm"
            >
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة لصفحة تسجيل الدخول
            </Link>
          </div>

          {/* Info */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              💡 <strong>ملاحظة:</strong> لوحة التحكم الأصلية قد لا تعمل حالياً بسبب مشكلة في النشر.
              يمكنك الوصول لجميع الخدمات من الصفحة الرئيسية.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            © 2024 Top Marketing - جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </div>
  )
}
