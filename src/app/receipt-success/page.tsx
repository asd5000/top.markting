'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  CheckCircle,
  ArrowRight,
  Package,
  CreditCard,
  Clock,
  MessageCircle,
  Home
} from 'lucide-react'

function ReceiptSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const subscriptionId = searchParams.get('subscription_id')
  const paymentMethod = searchParams.get('payment_method')
  
  const [orderData, setOrderData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (subscriptionId) {
      loadOrderData()
    }
  }, [subscriptionId])

  const loadOrderData = async () => {
    try {
      // محاولة تحميل من جدول الطلبات أولاً
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', subscriptionId)
        .single()

      if (!orderError && orderData) {
        setOrderData({ ...orderData, type: 'service' })
      } else {
        // محاولة تحميل من جدول الاشتراكات
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('id', subscriptionId)
          .single()

        if (!subscriptionError && subscriptionData) {
          setOrderData({ ...subscriptionData, type: 'subscription' })
        }
      }
    } catch (error) {
      console.error('Error loading order data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPaymentMethodName = (method: string) => {
    const methods: { [key: string]: string } = {
      'vodafone_cash': 'فودافون كاش',
      'instapay': 'إنستاباي',
      'fawry': 'فوري باي',
      'whatsapp': 'واتساب'
    }
    return methods[method] || method
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            تم إرسال الطلب بنجاح!
          </h1>
          <p className="text-gray-600">
            تم رفع إيصال الدفع وسيتم مراجعته من قبل فريقنا
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Package className="w-6 h-6 ml-2" />
            تفاصيل الطلب
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">رقم الطلب:</span>
              <span className="font-medium text-gray-900">
                {subscriptionId?.slice(0, 8)}...
              </span>
            </div>

            {orderData && (
              <>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">نوع الطلب:</span>
                  <span className="font-medium text-gray-900">
                    {orderData.type === 'service' ? 'خدمة' : 'اشتراك'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">المبلغ:</span>
                  <span className="font-medium text-gray-900">
                    {orderData.total_amount} ج.م
                  </span>
                </div>

                {orderData.service_name && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">الخدمة:</span>
                    <span className="font-medium text-gray-900">
                      {orderData.service_name}
                    </span>
                  </div>
                )}
              </>
            )}

            {paymentMethod && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">طريقة الدفع:</span>
                <span className="font-medium text-gray-900">
                  {getPaymentMethodName(paymentMethod)}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">الحالة:</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                <Clock className="w-4 h-4 ml-1" />
                في انتظار المراجعة
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">الخطوات التالية:</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold ml-3 mt-0.5">1</span>
              سيتم مراجعة إيصال الدفع من قبل فريقنا خلال 24 ساعة
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold ml-3 mt-0.5">2</span>
              سيتم التواصل معك لتأكيد الطلب وبدء العمل
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold ml-3 mt-0.5">3</span>
              ستحصل على تحديثات منتظمة حول حالة طلبك
            </li>
          </ul>
        </div>

        {/* Contact Support */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">تحتاج مساعدة؟</h3>
          <p className="text-gray-600 mb-4">
            فريق الدعم الفني متاح للإجابة على استفساراتك
          </p>
          <a
            href="https://wa.me/201068275557"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            <MessageCircle className="w-5 h-5 ml-2" />
            تواصل عبر واتساب
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 space-x-reverse">
          <button
            onClick={() => router.push('/')}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
          >
            <Home className="w-5 h-5 ml-2" />
            العودة للصفحة الرئيسية
          </button>
          
          <button
            onClick={() => router.push('/services')}
            className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center justify-center"
          >
            <Package className="w-5 h-5 ml-2" />
            تصفح الخدمات
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ReceiptSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الصفحة...</p>
        </div>
      </div>
    }>
      <ReceiptSuccessContent />
    </Suspense>
  )
}
