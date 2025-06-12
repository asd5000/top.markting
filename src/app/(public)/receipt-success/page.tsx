'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, Package, Clock, Phone, ArrowRight, Home } from 'lucide-react'

export default function ReceiptSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(10)

  const subscriptionId = searchParams.get('subscription_id')
  const paymentMethod = searchParams.get('payment_method')

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'vodafone_cash':
        return 'فودافون كاش'
      case 'instapay':
        return 'إنستاباي'
      case 'fawry':
        return 'فوري باي'
      case 'whatsapp':
        return 'واتساب'
      default:
        return 'غير محدد'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-8" dir="rtl">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 text-center">
            <CheckCircle className="w-20 h-20 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">تم رفع الإيصال بنجاح!</h1>
            <p className="text-green-100 text-lg">شكراً لك على اختيار خدماتنا</p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="space-y-6">
              {/* Success Message */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-green-800 mb-3 flex items-center">
                  <Package className="w-6 h-6 ml-2" />
                  تفاصيل العملية
                </h2>
                <div className="space-y-3 text-green-700">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 ml-2" />
                    <span>تم رفع الإيصال وحفظه بأمان</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 ml-2" />
                    <span>تم تحديث حالة الاشتراك إلى "في انتظار الموافقة"</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 ml-2" />
                    <span>تم إرسال إشعار لفريق الإدارة</span>
                  </div>
                  {paymentMethod && (
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 ml-2" />
                      <span>طريقة الدفع: {getPaymentMethodName(paymentMethod)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
                  <Clock className="w-5 h-5 ml-2" />
                  الخطوات التالية
                </h3>
                <div className="space-y-2 text-blue-700">
                  <p>• سيتم مراجعة الإيصال من قبل فريق الإدارة</p>
                  <p>• ستتلقى إشعاراً عند تفعيل اشتراكك</p>
                  <p>• مدة المراجعة: عادة خلال 24 ساعة</p>
                  <p>• يمكنك متابعة حالة اشتراكك من خلال حسابك</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                  <Phone className="w-5 h-5 ml-2" />
                  هل تحتاج مساعدة؟
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>للاستفسارات أو المساعدة، تواصل معنا:</p>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-600 ml-2" />
                    <span className="font-medium">01068275557</span>
                  </div>
                  <p className="text-sm text-gray-600">متاح 24/7 لخدمتك</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => router.push('/')}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Home className="w-5 h-5 ml-2" />
                  العودة للصفحة الرئيسية
                </button>
                
                <button
                  onClick={() => router.push('/services')}
                  className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
                >
                  تصفح الخدمات
                  <ArrowRight className="w-5 h-5 mr-2" />
                </button>
              </div>

              {/* Auto Redirect */}
              <div className="text-center text-gray-500 text-sm pt-4 border-t border-gray-200">
                <p>سيتم توجيهك تلقائياً للصفحة الرئيسية خلال {countdown} ثانية</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
