'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  CreditCard,
  Upload,
  Check,
  ArrowRight,
  MessageCircle,
  DollarSign,
  Smartphone,
  Package
} from 'lucide-react'

function SubscribeCheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const subscriptionId = searchParams.get('subscription_id') || searchParams.get('order_id')
  const orderType = searchParams.get('type') || 'package' // package أو service
  const serviceName = searchParams.get('service_name')
  const amount = searchParams.get('amount')

  const [subscription, setSubscription] = useState<any>(null)
  const [packageData, setPackageData] = useState<any>(null)
  const [orderData, setOrderData] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [paymentMethod, setPaymentMethod] = useState('vodafone_cash')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (subscriptionId) {
      if (orderType === 'service') {
        loadServiceOrderData()
      } else {
        loadSubscriptionData()
      }
    }
    checkUserSession()
  }, [subscriptionId, orderType])

  const checkUserSession = () => {
    const savedUser = localStorage.getItem('visitor')
    if (!savedUser) {
      router.push('/visitor-login')
      return
    }
    setUser(JSON.parse(savedUser))
  }

  const loadServiceOrderData = async () => {
    try {
      setLoading(true)
      console.log('🔄 Loading service order data for ID:', subscriptionId)

      if (!subscriptionId) {
        console.error('❌ No order ID provided')
        alert('معرف الطلب مفقود')
        router.push('/services')
        return
      }

      // تحميل بيانات الطلب من جدول orders
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', subscriptionId)
        .single()

      if (orderError) {
        console.error('❌ Error loading order:', orderError)
        if (orderError.code === 'PGRST116') {
          alert('لم يتم العثور على الطلب المطلوب')
        } else {
          alert(`حدث خطأ في تحميل بيانات الطلب: ${orderError.message}`)
        }
        router.push('/services')
        return
      }

      if (!orderData) {
        console.error('❌ No order found with ID:', subscriptionId)
        alert('لم يتم العثور على الطلب')
        router.push('/services')
        return
      }

      console.log('✅ Service order loaded:', orderData)
      setOrderData(orderData)

    } catch (error) {
      console.error('❌ Error loading service order data:', error)
      alert('حدث خطأ أثناء تحميل البيانات')
      router.push('/services')
    } finally {
      setLoading(false)
    }
  }

  const loadSubscriptionData = async () => {
    try {
      setLoading(true)
      console.log('🔄 Loading subscription data for ID:', subscriptionId)

      if (!subscriptionId) {
        console.error('❌ No subscription ID provided')
        alert('معرف الاشتراك مفقود')
        router.push('/packages')
        return
      }

      // تحميل بيانات الاشتراك
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('id', subscriptionId)

      if (subscriptionError) {
        console.error('❌ Error loading subscription:', subscriptionError)
        if (subscriptionError.code === 'PGRST116') {
          alert('لم يتم العثور على الاشتراك المطلوب')
        } else {
          alert(`حدث خطأ في تحميل بيانات الاشتراك: ${subscriptionError.message}`)
        }
        router.push('/packages')
        return
      }

      if (!subscriptionData || subscriptionData.length === 0) {
        console.error('❌ No subscription found with ID:', subscriptionId)
        alert('لم يتم العثور على الاشتراك')
        router.push('/packages')
        return
      }

      if (subscriptionData.length > 1) {
        console.error('❌ Multiple subscriptions found with same ID:', subscriptionId)
        alert('خطأ في بيانات الاشتراك')
        router.push('/packages')
        return
      }

      const subscription = subscriptionData[0]
      console.log('✅ Subscription loaded:', subscription)

      // تحميل بيانات الباقة منفصلة
      const { data: packageData, error: packageError } = await supabase
        .from('packages')
        .select('*')
        .eq('id', subscription.package_id)

      if (packageError) {
        console.error('❌ Error loading package:', packageError)
        alert(`حدث خطأ في تحميل بيانات الباقة: ${packageError.message}`)
        router.push('/packages')
        return
      }

      if (!packageData || packageData.length === 0) {
        console.error('❌ No package found with ID:', subscription.package_id)
        alert('لم يتم العثور على بيانات الباقة')
        router.push('/packages')
        return
      }

      const packageInfo = packageData[0]
      console.log('✅ Package loaded:', packageInfo)

      setSubscription(subscription)
      setPackageData(packageInfo)

    } catch (error) {
      console.error('❌ Error loading subscription data:', error)
      alert('حدث خطأ أثناء تحميل البيانات')
      router.push('/packages')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setReceiptFile(file)
    }
  }

  const handleSubmitReceipt = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!receiptFile) {
      alert('يرجى رفع إيصال الدفع')
      return
    }

    setIsSubmitting(true)

    try {
      // رفع الإيصال إلى Supabase Storage
      const fileName = `receipt_${Date.now()}_${receiptFile.name}`

      console.log('📤 Uploading receipt file:', fileName)

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(fileName, receiptFile)

      if (uploadError) {
        console.error('❌ Error uploading receipt:', uploadError)
        alert(`حدث خطأ أثناء رفع الإيصال: ${uploadError.message}`)
        return
      }

      console.log('✅ Receipt uploaded successfully:', uploadData)

      // الحصول على الرابط العام للإيصال
      const { data: urlData } = supabase.storage
        .from('receipts')
        .getPublicUrl(fileName)

      const receiptUrl = urlData.publicUrl
      console.log('🔗 Receipt public URL:', receiptUrl)

      console.log('📄 Creating receipt record with data:', {
        user_id: user?.id,
        subscription_id: subscriptionId,
        receipt_url: receiptUrl,
        payment_method: paymentMethod,
        amount: subscription?.total_amount,
        status: 'pending'
      })

      // إنشاء سجل الإيصال في قاعدة البيانات
      const receiptData = {
        user_id: user?.id || null,
        subscription_id: subscriptionId,
        receipt_url: receiptUrl,
        payment_method: paymentMethod,
        amount: orderType === 'service'
          ? parseFloat(orderData?.total_amount) || parseFloat(amount || '0') || 0
          : parseFloat(subscription?.total_amount) || 0,
        status: 'pending'
      }

      const { data: receiptResult, error: receiptError } = await supabase
        .from('receipts')
        .insert([receiptData])
        .select()

      if (receiptError) {
        console.error('❌ Error creating receipt record:', receiptError)
        alert(`حدث خطأ أثناء حفظ بيانات الإيصال: ${receiptError.message}`)
        return
      }

      console.log('✅ Receipt record created successfully:', receiptResult)

      // تحديث حالة الطلب/الاشتراك إلى "في انتظار الموافقة"
      console.log('🔄 Updating order/subscription status to waiting approval...')

      const tableName = orderType === 'service' ? 'orders' : 'subscriptions'
      const updateData = orderType === 'service'
        ? {
            status: 'pending',
            payment_status: 'pending',
            payment_method: paymentMethod,
            receipt_url: receiptUrl,
            updated_at: new Date().toISOString()
          }
        : {
            status: 'pending',
            payment_method: paymentMethod,
            receipt_url: receiptUrl,
            updated_at: new Date().toISOString()
          }

      const { error: updateError } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('id', subscriptionId)

      if (updateError) {
        console.error('❌ Error updating order/subscription:', updateError)
        alert(`حدث خطأ أثناء تحديث حالة ${orderType === 'service' ? 'الطلب' : 'الاشتراك'}: ${updateError.message}`)
        return
      }

      console.log('✅ Order/Subscription status updated successfully')

      // توجيه المستخدم إلى صفحة النجاح مع تمرير معلومات الاشتراك
      const successUrl = `/receipt-success?subscription_id=${subscriptionId}&payment_method=${paymentMethod}`
      router.push(successUrl)
      
    } catch (error) {
      console.error('❌ Unexpected error submitting receipt:', error)
      alert(`❌ حدث خطأ غير متوقع أثناء إرسال الإيصال

🔧 يرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني إذا استمرت المشكلة.

📞 للدعم: 01068275557`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getPaymentInstructions = () => {
    switch (paymentMethod) {
      case 'vodafone_cash':
        return {
          title: 'فودافون كاش',
          number: '01068275557',
          instructions: 'قم بتحويل المبلغ إلى رقم فودافون كاش أعلاه ثم ارفق صورة الإيصال'
        }
      case 'instapay':
        return {
          title: 'إنستاباي',
          number: '01068275557',
          instructions: 'قم بتحويل المبلغ عبر إنستاباي إلى الرقم أعلاه ثم ارفق صورة الإيصال'
        }
      case 'fawry':
        return {
          title: 'فوري باي',
          number: '01068275557',
          instructions: 'قم بتحويل المبلغ عبر فوري باي إلى الرقم أعلاه ثم ارفق صورة الإيصال'
        }
      case 'whatsapp':
        return {
          title: 'واتساب (للدفع خارج مصر)',
          number: '01068275557',
          instructions: 'تواصل معنا عبر واتساب لترتيب طريقة الدفع المناسبة'
        }
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات الاشتراك...</p>
        </div>
      </div>
    )
  }

  if ((orderType === 'package' && (!subscription || !packageData)) ||
      (orderType === 'service' && !orderData)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {orderType === 'service' ? 'طلب غير موجود' : 'اشتراك غير موجود'}
          </h2>
          <p className="text-gray-600 mb-6">
            {orderType === 'service' ? 'لم يتم العثور على بيانات الطلب' : 'لم يتم العثور على بيانات الاشتراك'}
          </p>
          <button
            onClick={() => router.push(orderType === 'service' ? '/services' : '/packages')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {orderType === 'service' ? 'العودة للخدمات' : 'العودة للباقات'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {orderType === 'service' ? 'إتمام طلب الخدمة' : 'إتمام الاشتراك'}
          </h1>
          <p className="text-gray-600">
            {orderType === 'service' ? 'ارفع إيصال الدفع لتأكيد طلبك' : 'ارفع إيصال الدفع لتفعيل اشتراكك'}
          </p>
        </div>

        {/* Order/Package Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Package className="w-6 h-6 ml-2" />
            {orderType === 'service' ? 'ملخص الطلب' : 'ملخص الباقة'}
          </h2>

          <div className="bg-blue-50 rounded-lg p-4">
            {orderType === 'service' ? (
              // عرض بيانات الخدمة
              <>
                <h3 className="text-lg font-bold text-blue-900 mb-2">
                  {orderData?.service_name || serviceName || 'خدمة مخصصة'}
                </h3>
                <p className="text-blue-700 mb-4">
                  {orderData?.service_category && `من قسم: ${orderData.service_category}`}
                </p>
                {orderData?.notes && (
                  <p className="text-blue-600 text-sm mb-4">{orderData.notes}</p>
                )}

                <div className="border-t border-blue-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-900">المبلغ المطلوب:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {orderData?.total_amount || amount || 0} ج.م
                    </span>
                  </div>
                </div>
              </>
            ) : (
              // عرض بيانات الباقة
              <>
                <h3 className="text-lg font-bold text-blue-900 mb-2">{packageData?.name}</h3>
                <p className="text-blue-700 mb-4">{packageData?.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{packageData?.max_designs || 0}</div>
                    <div className="text-sm text-blue-600">تصميم شهرياً</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{packageData?.max_videos || 0}</div>
                    <div className="text-sm text-blue-600">فيديو شهرياً</div>
                  </div>
                </div>

                <div className="border-t border-blue-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-900">المبلغ المطلوب:</span>
                    <span className="text-2xl font-bold text-blue-600">{subscription?.total_amount} ج.م</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <CreditCard className="w-6 h-6 ml-2" />
            رفع إيصال الدفع
          </h2>

          <form onSubmit={handleSubmitReceipt} className="space-y-6">
            {/* Payment Methods */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">طريقة الدفع *</label>
              <div className="space-y-3">
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="vodafone_cash"
                    checked={paymentMethod === 'vodafone_cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="ml-3"
                  />
                  <Smartphone className="w-5 h-5 text-red-600 ml-2" />
                  <span className="font-medium">فودافون كاش - 01068275557</span>
                </label>

                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="instapay"
                    checked={paymentMethod === 'instapay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="ml-3"
                  />
                  <CreditCard className="w-5 h-5 text-blue-600 ml-2" />
                  <span className="font-medium">إنستاباي - 01068275557</span>
                </label>

                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="fawry"
                    checked={paymentMethod === 'fawry'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="ml-3"
                  />
                  <DollarSign className="w-5 h-5 text-green-600 ml-2" />
                  <span className="font-medium">فوري باي - 01068275557</span>
                </label>

                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="whatsapp"
                    checked={paymentMethod === 'whatsapp'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="ml-3"
                  />
                  <MessageCircle className="w-5 h-5 text-green-600 ml-2" />
                  <span className="font-medium">واتساب (للدفع خارج مصر) - 01068275557</span>
                </label>
              </div>
            </div>

            {/* Payment Instructions */}
            {getPaymentInstructions() && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-bold text-yellow-800 mb-2">
                  تعليمات الدفع - {getPaymentInstructions()?.title}
                </h3>
                <p className="text-yellow-700 mb-3">
                  {getPaymentInstructions()?.instructions}
                </p>
                <div className="bg-yellow-100 rounded-lg p-3">
                  <p className="text-yellow-800 font-bold text-center">
                    رقم المحفظة: {getPaymentInstructions()?.number}
                  </p>
                </div>
              </div>
            )}

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رفع إيصال الدفع *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-gray-600">اضغط لرفع إيصال الدفع</p>
                  <p className="text-sm text-gray-500">PNG, JPG, PDF حتى 10MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
              </div>
              {receiptFile && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 ml-2" />
                    <span className="text-green-700 font-medium">تم رفع الملف: {receiptFile.name}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !receiptFile}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center ${
                isSubmitting || !receiptFile
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5 ml-2" />
                  تأكيد الدفع
                </>
              )}
            </button>
          </form>
        </div>

        {/* Support Contact */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-2">تحتاج مساعدة؟</p>
          <a
            href="https://wa.me/201068275557"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
          >
            <MessageCircle className="w-4 h-4 ml-1" />
            تواصل معنا عبر واتساب
          </a>
        </div>
      </div>
    </div>
  )
}

export default function SubscribeCheckout() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    }>
      <SubscribeCheckoutContent />
    </Suspense>
  )
}
