'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  ArrowLeft,
  CreditCard,
  Phone,
  Upload,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  MessageCircle
} from 'lucide-react'

interface CartItem {
  id: string
  name: string
  price: number
  service_name?: string
  quantity: number
  image_url?: string
  type?: string
  subscription_id?: string
}

interface OrderForm {
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_whatsapp: string
  customer_address: string
  payment_method: string
  notes: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [receiptUrl, setReceiptUrl] = useState<string>('')
  const [form, setForm] = useState<OrderForm>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_whatsapp: '',
    customer_address: '',
    payment_method: 'vodafone_cash',
    notes: ''
  })

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      if (cart.length === 0) {
        router.push('/cart')
        return
      }
      setCartItems(cart)
    } catch (error) {
      console.error('Error loading cart:', error)
      router.push('/cart')
    } finally {
      setLoading(false)
    }
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const uploadReceipt = async (file: File): Promise<string | null> => {
    try {
      setUploading(true)
      console.log('📤 Uploading receipt:', file.name)

      const fileExt = file.name.split('.').pop()
      const fileName = `receipt-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `receipts/${fileName}`

      const { data, error } = await supabase.storage
        .from('receipts')
        .upload(filePath, file)

      if (error) {
        console.error('Error uploading receipt:', error)
        alert(`خطأ في رفع الإيصال: ${error.message}`)
        return null
      }

      const { data: { publicUrl } } = supabase.storage
        .from('receipts')
        .getPublicUrl(filePath)

      console.log('✅ Receipt uploaded successfully:', publicUrl)
      return publicUrl

    } catch (error) {
      console.error('Error uploading receipt:', error)
      alert('حدث خطأ أثناء رفع الإيصال')
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleReceiptUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setReceiptFile(file)
    const url = await uploadReceipt(file)
    if (url) {
      setReceiptUrl(url)
    }
  }

  const submitOrder = async () => {
    if (!form.customer_name || !form.customer_phone) {
      alert('يرجى ملء الحقول المطلوبة')
      return
    }

    if (form.payment_method !== 'whatsapp' && !receiptUrl) {
      alert('يرجى رفع إيصال الدفع')
      return
    }

    try {
      setSubmitting(true)

      // فصل العناصر حسب النوع
      const packageItems = cartItems.filter(item => item.type === 'package')
      const serviceItems = cartItems.filter(item => item.type !== 'package')

      // معالجة الباقات
      if (packageItems.length > 0) {
        for (const packageItem of packageItems) {
          if (packageItem.subscription_id) {
            // تحديث الاشتراك بالإيصال
            // القيم المسموحة للاشتراكات: 'active', 'expired', 'cancelled', 'suspended'
            const { error: subscriptionError } = await supabase
              .from('subscriptions')
              .update({
                receipt_url: receiptUrl,
                payment_method: form.payment_method,
                // نبدأ بـ suspended حتى يتم تفعيلها من قبل الإدارة
                status: 'suspended'
              })
              .eq('id', packageItem.subscription_id)

            if (subscriptionError) {
              console.error('❌ Error updating subscription:', subscriptionError)
              alert(`حدث خطأ أثناء تحديث الاشتراك: ${subscriptionError.message}`)
              return
            }
          }
        }
      }

      // معالجة الخدمات العادية
      let createdOrderId = null
      if (serviceItems.length > 0) {
        // إنشاء بيانات الطلب بدون user_id (للمستخدمين غير المسجلين)
        const orderData = {
          customer_name: form.customer_name,
          customer_email: form.customer_email,
          customer_phone: form.customer_phone,
          customer_whatsapp: form.customer_whatsapp,
          customer_address: form.customer_address,
          payment_method: form.payment_method,
          receipt_url: receiptUrl,
          total_amount: serviceItems.reduce((total, item) => total + (item.price * item.quantity), 0),
          items: serviceItems,
          notes: form.notes,
          // القيم المسموحة: 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'
          status: 'pending',
          // القيم المسموحة: 'pending', 'paid', 'rejected'
          payment_status: 'pending'
          // إزالة user_id لتجنب مشاكل RLS
        }

        console.log('📤 Submitting order data:', orderData)

        const { data, error } = await supabase
          .from('orders')
          .insert([orderData])
          .select()

        if (error) {
          console.error('❌ Supabase error creating order:', error)
          alert(`حدث خطأ أثناء إنشاء الطلب: ${error.message}`)
          return
        }

        console.log('✅ Order created successfully:', data[0])
        createdOrderId = data[0].id

        // إنشاء سجل في جدول receipts إذا كان هناك إيصال
        if (receiptUrl && form.payment_method !== 'whatsapp') {
          const receiptData = {
            order_id: createdOrderId,
            receipt_url: receiptUrl,
            payment_method: form.payment_method,
            amount: serviceItems.reduce((total, item) => total + (item.price * item.quantity), 0),
            status: 'pending',
            notes: `إيصال للطلب: ${form.customer_name}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }

          const { error: receiptError } = await supabase
            .from('receipts')
            .insert([receiptData])

          if (receiptError) {
            console.error('❌ Error creating receipt record:', receiptError)
            // لا نوقف العملية، فقط نسجل الخطأ
          } else {
            console.log('✅ Receipt record created successfully')
          }
        }
      }

      // مسح السلة
      localStorage.removeItem('cart')

      // التوجيه لصفحة النجاح مع تمرير ID الطلب
      if (packageItems.length > 0) {
        router.push(`/subscription-success`)
      } else {
        // تمرير ID الطلب إلى صفحة النجاح
        if (createdOrderId) {
          router.push(`/order-success?order_id=${createdOrderId}`)
        } else {
          // في حالة عدم وجود طلب (مثل طلبات الواتساب)
          router.push(`/order-success`)
        }
      }

    } catch (error) {
      console.error('❌ Unexpected error submitting order:', error)
      alert(`حدث خطأ غير متوقع: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`)
    } finally {
      setSubmitting(false)
    }
  }

  const generateWhatsAppMessage = () => {
    const itemsList = cartItems.map(item => {
      const itemType = item.type === 'package' ? 'باقة اشتراك' : item.service_name
      return `• ${item.name} (${itemType}) - ${item.quantity}x - ${item.price * item.quantity} ج.م`
    }).join('\n')

    const customerInfo = `الاسم: ${form.customer_name}\nالهاتف: ${form.customer_phone}\nالإيميل: ${form.customer_email}`

    return `طلب جديد:\n\n${customerInfo}\n\nالعناصر المطلوبة:\n${itemsList}\n\nالإجمالي: ${getTotalPrice()} ج.م\n\nملاحظات: ${form.notes || 'لا توجد'}`
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

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/cart"
              className="text-gray-600 hover:text-blue-600 flex items-center"
            >
              <ArrowLeft className="w-5 h-5 ml-2" />
              العودة للسلة
            </Link>
            
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <CreditCard className="w-6 h-6 ml-2" />
              إتمام الطلب
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">بيانات العميل</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الكامل *
                </label>
                <div className="relative">
                  <User className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={form.customer_name}
                    onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل اسمك الكامل"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف *
                </label>
                <div className="relative">
                  <Phone className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    value={form.customer_phone}
                    onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="01xxxxxxxxx"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={form.customer_email}
                    onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الواتساب
                </label>
                <div className="relative">
                  <MessageCircle className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    value={form.customer_whatsapp}
                    onChange={(e) => setForm({ ...form, customer_whatsapp: e.target.value })}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="01xxxxxxxxx"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان
                </label>
                <textarea
                  value={form.customer_address}
                  onChange={(e) => setForm({ ...form, customer_address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أدخل عنوانك (اختياري)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ملاحظات إضافية
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أي ملاحظات أو متطلبات خاصة (اختياري)"
                />
              </div>
            </div>
          </div>

          {/* Payment & Order Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">ملخص الطلب</h3>
              
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.type === 'package' ? 'باقة اشتراك' : item.service_name} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-green-600">{item.price * item.quantity} ج.م</p>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>الإجمالي:</span>
                  <span className="text-green-600">{getTotalPrice()} ج.م</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">طريقة الدفع</h3>
              
              <div className="space-y-3">
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment_method"
                    value="vodafone_cash"
                    checked={form.payment_method === 'vodafone_cash'}
                    onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                    className="ml-3"
                  />
                  <div>
                    <p className="font-medium">فودافون كاش</p>
                    <p className="text-sm text-gray-600">01068275557</p>
                  </div>
                </label>

                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment_method"
                    value="fori_pay"
                    checked={form.payment_method === 'fori_pay'}
                    onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                    className="ml-3"
                  />
                  <div>
                    <p className="font-medium">فوري باي</p>
                    <p className="text-sm text-gray-600">للدفع الإلكتروني</p>
                  </div>
                </label>

                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment_method"
                    value="instapay"
                    checked={form.payment_method === 'instapay'}
                    onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                    className="ml-3"
                  />
                  <div>
                    <p className="font-medium">إنستاباي</p>
                    <p className="text-sm text-gray-600">للتحويل الفوري</p>
                  </div>
                </label>

                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment_method"
                    value="whatsapp"
                    checked={form.payment_method === 'whatsapp'}
                    onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                    className="ml-3"
                  />
                  <div>
                    <p className="font-medium">طلب عبر واتساب</p>
                    <p className="text-sm text-gray-600">للعملاء الدوليين</p>
                  </div>
                </label>
              </div>

              {/* Receipt Upload */}
              {form.payment_method !== 'whatsapp' && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رفع إيصال الدفع *
                  </label>
                  <div className="flex items-center space-x-4">
                    {receiptUrl && (
                      <img
                        src={receiptUrl}
                        alt="إيصال الدفع"
                        className="w-20 h-20 rounded-lg object-cover border border-gray-300"
                      />
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleReceiptUpload}
                        className="hidden"
                        id="receipt-upload"
                      />
                      <label
                        htmlFor="receipt-upload"
                        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors flex items-center justify-center cursor-pointer"
                      >
                        {uploading ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        ) : (
                          <>
                            <Upload className="w-5 h-5 ml-2 text-gray-400" />
                            <span className="text-gray-600">
                              {receiptUrl ? 'تغيير الإيصال' : 'رفع إيصال الدفع'}
                            </span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="mt-6 space-y-3">
                {form.payment_method === 'whatsapp' ? (
                  <a
                    href={`https://wa.me/201068275557?text=${encodeURIComponent(generateWhatsAppMessage())}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
                  >
                    <MessageCircle className="w-5 h-5 ml-2" />
                    إرسال الطلب عبر واتساب
                  </a>
                ) : (
                  <button
                    onClick={submitOrder}
                    disabled={submitting || !receiptUrl}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 ml-2" />
                        تأكيد الطلب
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 ml-2" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">ملاحظات مهمة:</p>
                    <ul className="space-y-1">
                      <li>• سيتم مراجعة طلبك خلال 24 ساعة</li>
                      <li>• ستتلقى تأكيد الطلب عبر الهاتف أو الواتساب</li>
                      <li>• يمكنك تتبع حالة طلبك من خلال التواصل معنا</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
