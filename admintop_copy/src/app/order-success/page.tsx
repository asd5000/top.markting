'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  CheckCircle,
  Home,
  MessageCircle,
  Phone,
  Clock,
  Package,
  CreditCard
} from 'lucide-react'

interface Order {
  id: string
  customer_name: string
  customer_phone: string
  total_amount: number
  payment_method: string
  status: string
  payment_status: string
  created_at: string
  items: any[]
}

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (orderId) {
      fetchOrder()
    } else {
      // إذا لم يكن هناك order_id، نعرض صفحة نجاح عامة
      setLoading(false)
    }
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

      if (error) {
        console.error('Error fetching order:', error)
        return
      }

      setOrder(data)
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'في انتظار المراجعة'
      case 'waiting_approval':
        return 'في انتظار الموافقة'
      case 'approved':
        return 'تم الموافقة'
      case 'in_progress':
        return 'قيد التنفيذ'
      case 'completed':
        return 'مكتمل'
      case 'cancelled':
        return 'ملغي'
      default:
        return status
    }
  }

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'في انتظار الدفع'
      case 'waiting_approval':
        return 'في انتظار تأكيد الدفع'
      case 'paid':
        return 'تم الدفع'
      case 'refunded':
        return 'تم الاسترداد'
      default:
        return status
    }
  }

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'vodafone_cash':
        return 'فودافون كاش'
      case 'fori_pay':
        return 'فوري باي'
      case 'instapay':
        return 'إنستاباي'
      case 'whatsapp':
        return 'طلب عبر واتساب'
      default:
        return method
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات الطلب...</p>
        </div>
      </div>
    )
  }

  // إذا لم يكن هناك order_id، نعرض صفحة نجاح عامة
  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">تم إرسال طلبك بنجاح!</h1>
            <p className="text-lg text-gray-600">
              شكراً لك، سيتم مراجعة طلبك والتواصل معك قريباً
            </p>
          </div>

          {/* General Success Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-blue-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 ml-2" />
              الخطوات التالية
            </h3>
            <div className="space-y-3 text-blue-800">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold ml-3 mt-0.5">1</div>
                <p>سيتم مراجعة طلبك خلال 24 ساعة من فريق العمل</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold ml-3 mt-0.5">2</div>
                <p>ستتلقى مكالمة هاتفية أو رسالة واتساب لتأكيد التفاصيل</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold ml-3 mt-0.5">3</div>
                <p>سيبدأ العمل على طلبك فور تأكيد جميع التفاصيل</p>
              </div>
            </div>
          </div>

          {/* Contact & Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">تحتاج مساعدة؟</h3>
              <p className="text-gray-600 mb-4">
                يمكنك التواصل معنا في أي وقت للاستفسار عن طلبك
              </p>
              <div className="space-y-3">
                <a
                  href="https://wa.me/201068275557?text=استفسار عن طلب جديد"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <MessageCircle className="w-4 h-4 ml-2" />
                  واتساب
                </a>
                <a
                  href="tel:01068275557"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Phone className="w-4 h-4 ml-2" />
                  اتصال هاتفي
                </a>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">استمر في التسوق</h3>
              <p className="text-gray-600 mb-4">
                اكتشف المزيد من خدماتنا المميزة
              </p>
              <div className="space-y-3">
                <Link
                  href="/services"
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                >
                  <Package className="w-4 h-4 ml-2" />
                  تصفح الخدمات
                </Link>
                <Link
                  href="/"
                  className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <Home className="w-4 h-4 ml-2" />
                  الصفحة الرئيسية
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // إذا كان هناك order_id لكن لم يتم العثور على الطلب
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">طلب غير موجود</h2>
          <p className="text-gray-600 mb-6">لم يتم العثور على الطلب المطلوب</p>
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            <Home className="w-5 h-5 ml-2" />
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">تم إرسال طلبك بنجاح!</h1>
          <p className="text-lg text-gray-600">
            شكراً لك، سيتم مراجعة طلبك والتواصل معك قريباً
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">تفاصيل الطلب</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">معلومات الطلب</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">رقم الطلب:</span>
                    <span className="font-mono">{order.id.slice(0, 8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">تاريخ الطلب:</span>
                    <span>{new Date(order.created_at).toLocaleDateString('ar-EG')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">حالة الطلب:</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">معلومات الدفع</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">طريقة الدفع:</span>
                    <span>{getPaymentMethodText(order.payment_method)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">حالة الدفع:</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {getPaymentStatusText(order.payment_status)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">المبلغ الإجمالي:</span>
                    <span className="font-bold text-green-600">{order.total_amount} ج.م</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">الخدمات المطلوبة</h3>
              <div className="space-y-3">
                {order.items?.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.service_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{item.quantity} × {item.price} ج.م</p>
                      <p className="text-sm text-gray-600">{item.quantity * item.price} ج.م</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-bold text-blue-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 ml-2" />
            الخطوات التالية
          </h3>
          <div className="space-y-3 text-blue-800">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold ml-3 mt-0.5">1</div>
              <p>سيتم مراجعة طلبك خلال 24 ساعة من فريق العمل</p>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold ml-3 mt-0.5">2</div>
              <p>ستتلقى مكالمة هاتفية أو رسالة واتساب لتأكيد التفاصيل</p>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold ml-3 mt-0.5">3</div>
              <p>سيبدأ العمل على طلبك فور تأكيد جميع التفاصيل</p>
            </div>
          </div>
        </div>

        {/* Contact & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">تحتاج مساعدة؟</h3>
            <p className="text-gray-600 mb-4">
              يمكنك التواصل معنا في أي وقت للاستفسار عن طلبك
            </p>
            <div className="space-y-3">
              <a
                href={`https://wa.me/201068275557?text=استفسار عن الطلب رقم: ${order.id.slice(0, 8)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <MessageCircle className="w-4 h-4 ml-2" />
                واتساب
              </a>
              <a
                href="tel:01068275557"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Phone className="w-4 h-4 ml-2" />
                اتصال هاتفي
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">استمر في التسوق</h3>
            <p className="text-gray-600 mb-4">
              اكتشف المزيد من خدماتنا المميزة
            </p>
            <div className="space-y-3">
              <Link
                href="/services"
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
              >
                <Package className="w-4 h-4 ml-2" />
                تصفح الخدمات
              </Link>
              <Link
                href="/"
                className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <Home className="w-4 h-4 ml-2" />
                الصفحة الرئيسية
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  )
}
