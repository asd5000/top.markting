'use client'

import { useState, useEffect } from 'react'
import {
  ShoppingCart, Search, Filter, Eye, CheckCircle, XCircle,
  Clock, DollarSign, User, Phone, Mail, ArrowLeft,
  Download, RefreshCw, MessageCircle, FileText, Image, Shield
} from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import ReceiptViewer from '@/components/ReceiptViewer'

// ✅ مكون لعرض معاينة الإيصال - محدث
const ReceiptPreview = ({ receiptUrl }: { receiptUrl: string }) => {
  const [imageError, setImageError] = useState(false)
  const [loading, setLoading] = useState(true)

  if (!receiptUrl) {
    return (
      <div className="p-8 text-center">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p className="text-red-600">❌ لا يوجد إيصال</p>
      </div>
    )
  }

  // استخدام الرابط كما هو (لأنه صحيح من Supabase)
  const cleanUrl = receiptUrl

  // التحقق من نوع الملف
  const isImage = cleanUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)
  const isPDF = cleanUrl.match(/\.pdf$/i)

  if (imageError) {
    return (
      <div className="p-8 text-center">
        <XCircle className="w-12 h-12 text-red-400 mx-auto mb-2" />
        <p className="text-gray-600">خطأ في تحميل الإيصال</p>
        <p className="text-sm text-gray-500 mb-3">تحقق من الرابط أو اضغط على "عرض" لفتح الملف</p>
        <div className="space-y-2">
          <button
            onClick={() => window.open(receiptUrl, '_blank')}
            className="block mx-auto bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            محاولة فتح الملف
          </button>
          <p className="text-xs text-gray-400">الرابط: {receiptUrl.substring(0, 50)}...</p>
        </div>
      </div>
    )
  }

  if (!isImage && !isPDF) {
    return (
      <div className="p-8 text-center">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600">ملف الإيصال</p>
        <p className="text-sm text-gray-500">اضغط على "عرض" أو "تحميل" لفتح الملف</p>
        <p className="text-xs text-gray-400 mt-1">نوع الملف: {receiptUrl.split('.').pop()?.toUpperCase()}</p>
      </div>
    )
  }

  if (isImage) {
    return (
      <div className="relative min-h-[200px]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">جاري تحميل الإيصال...</p>
            </div>
          </div>
        )}
        <img
          src={cleanUrl}
          alt="إيصال الدفع"
          className="w-48 h-auto border rounded"
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false)
            setImageError(true)
          }}
          style={{ display: loading ? 'none' : 'block' }}
        />
      </div>
    )
  }

  if (isPDF) {
    return (
      <div className="p-8 text-center">
        <FileText className="w-12 h-12 text-red-500 mx-auto mb-2" />
        <p className="text-gray-600">ملف PDF</p>
        <p className="text-sm text-gray-500">اضغط على "عرض" لفتح الملف</p>
        <button
          onClick={() => window.open(receiptUrl, '_blank')}
          className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
        >
          فتح PDF
        </button>
      </div>
    )
  }

  return null
}

interface OrderItem {
  id: string
  service_name: string
  sub_service_name: string
  price: number
  quantity: number
}

interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_whatsapp: string
  customer_address: string
  notes: string
  payment_method: string
  receipt_url: string
  total_amount: number
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'rejected'
  created_at: string
  updated_at: string
  order_items: OrderItem[]
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPayment, setFilterPayment] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState('')
  const [selectedCustomerName, setSelectedCustomerName] = useState('')

  useEffect(() => {
    loadOrders()

    // تحديث تلقائي كل 30 ثانية
    const interval = setInterval(() => {
      loadOrders()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // إعادة تحميل عند التركيز على النافذة
  useEffect(() => {
    const handleFocus = () => {
      loadOrders()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)

      // جلب الطلبات العادية
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*),
          users (
            id,
            name,
            email,
            phone
          )
        `)
        .order('created_at', { ascending: false })

      if (ordersError) {
        console.error('Error loading orders:', ordersError)
      }

      // جلب الاشتراكات وتحويلها لتبدو مثل الطلبات
      const { data: subscriptionsData, error: subscriptionsError } = await supabase
        .from('subscriptions')
        .select(`
          *,
          users (
            id,
            name,
            email,
            phone
          ),
          packages (
            name,
            price
          )
        `)
        .order('created_at', { ascending: false })

      if (subscriptionsError) {
        console.error('Error loading subscriptions:', subscriptionsError)
      }

      // تحويل الاشتراكات لتبدو مثل الطلبات
      const convertedSubscriptions = (subscriptionsData || []).map(sub => ({
        id: sub.id,
        customer_name: sub.users?.name || 'غير محدد',
        customer_email: sub.users?.email || 'غير محدد',
        customer_phone: sub.users?.phone || 'غير محدد',
        customer_whatsapp: sub.users?.phone || 'غير محدد',
        customer_address: 'اشتراك في باقة',
        notes: `اشتراك في باقة: ${sub.packages?.name || 'غير محدد'}`,
        payment_method: sub.payment_method || 'غير محدد',
        receipt_url: sub.receipt_url,
        total_amount: parseFloat(sub.total_amount || '0'),
        status: sub.status,
        payment_status: sub.status === 'active' ? 'paid' : sub.status === 'suspended' ? 'pending' : 'pending',
        created_at: sub.created_at,
        updated_at: sub.updated_at,
        order_items: [{
          id: sub.id,
          service_name: `باقة: ${sub.packages?.name || 'غير محدد'}`,
          sub_service_name: 'اشتراك شهري',
          price: parseFloat(sub.total_amount || '0'),
          quantity: 1
        }],
        users: sub.users,
        type: 'subscription' // تمييز الاشتراكات عن الطلبات
      }))

      // دمج الطلبات والاشتراكات وترتيبها حسب التاريخ
      const allOrders = [...(ordersData || []), ...convertedSubscriptions]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      console.log('Loaded orders and subscriptions:', allOrders)
      setOrders(allOrders)
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)

      if (error) {
        console.error('Error updating order status:', error)
        alert('حدث خطأ أثناء تحديث حالة الطلب')
        return
      }

      // تحديث الحالة محلياً
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: status as any }
          : order
      ))

      alert('تم تحديث حالة الطلب بنجاح!')
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('حدث خطأ أثناء تحديث حالة الطلب')
    }
  }

  const updatePaymentStatus = async (orderId: string, paymentStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          payment_status: paymentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)

      if (error) {
        console.error('Error updating payment status:', error)
        alert('حدث خطأ أثناء تحديث حالة الدفع')
        return
      }

      // تحديث الحالة محلياً
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, payment_status: paymentStatus as any }
          : order
      ))

      alert('تم تحديث حالة الدفع بنجاح!')
    } catch (error) {
      console.error('Error updating payment status:', error)
      alert('حدث خطأ أثناء تحديث حالة الدفع')
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer_phone.includes(searchTerm) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    const matchesPayment = filterPayment === 'all' || order.payment_status === filterPayment
    
    return matchesSearch && matchesStatus && matchesPayment
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: 'معلق',
      confirmed: 'مؤكد',
      in_progress: 'قيد التنفيذ',
      completed: 'مكتمل',
      cancelled: 'ملغي'
    }
    return labels[status] || status
  }

  const getPaymentStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: 'معلق',
      paid: 'مدفوع',
      rejected: 'مرفوض'
    }
    return labels[status] || status
  }

  const getPaymentMethodLabel = (method: string) => {
    const methods: { [key: string]: string } = {
      vodafone_cash: 'فودافون كاش',
      instapay: 'إنستاباي',
      fawry: 'فوري باي',
      whatsapp: 'واتساب'
    }
    return methods[method] || method
  }

  const formatWhatsAppNumber = (phone: string) => {
    if (!phone) return ''

    // إزالة أي رموز غير رقمية
    let cleanNumber = phone.replace(/\D/g, '')

    // إضافة كود مصر إذا لم يكن موجود
    if (cleanNumber.startsWith('01')) {
      cleanNumber = '2' + cleanNumber
    } else if (!cleanNumber.startsWith('2')) {
      cleanNumber = '2' + cleanNumber
    }

    return cleanNumber
  }

  const getWhatsAppLink = (phone: string, customerName: string, orderId: string) => {
    const formattedNumber = formatWhatsAppNumber(phone)
    const message = encodeURIComponent(
      `مرحباً ${customerName}،\n\nبخصوص طلبكم رقم: ${orderId.slice(0, 8)}\n\nنحن هنا لخدمتكم.`
    )
    return `https://wa.me/${formattedNumber}?text=${message}`
  }

  const openReceiptModal = (receiptUrl: string, customerName: string) => {
    setSelectedReceiptUrl(receiptUrl)
    setSelectedCustomerName(customerName)
    setShowReceiptModal(true)
  }

  // دالة لتنظيف أسماء الملفات من الأحرف العربية والرموز الخاصة
  const sanitizeFileName = (fileName: string) => {
    if (!fileName) return 'receipt'

    // إزالة الأحرف العربية والرموز الخاصة
    let cleanName = fileName
      .replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g, '') // أحرف عربية
      .replace(/[^\w\-_.]/g, '') // رموز خاصة عدا الشرطة والنقطة والشرطة السفلية
      .replace(/\s+/g, '_') // استبدال المسافات بشرطة سفلية
      .toLowerCase()

    // إذا لم يبق شيء، استخدم اسم افتراضي
    if (!cleanName || cleanName.length < 3) {
      cleanName = 'receipt'
    }

    // التأكد من وجود امتداد
    if (!cleanName.includes('.')) {
      cleanName += '.png'
    }

    return cleanName
  }

  // دالة لاستخراج اسم ملف آمن من الرابط
  const extractSafeFileName = (url: string) => {
    try {
      const urlParts = url.split('/')
      let fileName = urlParts[urlParts.length - 1] || 'receipt'

      // إزالة معاملات الاستعلام
      fileName = fileName.split('?')[0]

      // تنظيف اسم الملف
      return sanitizeFileName(fileName)
    } catch (e) {
      return 'receipt.png'
    }
  }

  // دالة للتحقق من صحة رابط الإيصال
  const validateReceiptUrl = (url: string) => {
    if (!url) return false

    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // دالة لإصلاح رابط الإيصال
  const getValidReceiptUrl = (url: string) => {
    if (!url) return ''

    // إذا كان رابط كامل وصحيح، نعيده كما هو
    if (url.startsWith('http') && url.includes('storage/v1/object/public/receipts/')) {
      return url
    }

    // إذا كان رابط كامل لكن ليس من Supabase، نعيده كما هو (للروابط الخارجية)
    if (url.startsWith('http')) {
      return url
    }

    // إذا كان مسار نسبي، نبني الرابط الصحيح
    if (!url.startsWith('http')) {
      // إزالة أي / في البداية
      const cleanPath = url.startsWith('/') ? url.slice(1) : url

      // إذا كان المسار لا يحتوي على receipts/ نضيفه
      const finalPath = cleanPath.startsWith('receipts/') ? cleanPath : `receipts/${cleanPath}`

      return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${finalPath}`
    }

    return url
  }

  // دالة لتحميل الإيصال
  const downloadReceiptFromStorage = async (url: string) => {
    try {
      const validUrl = getValidReceiptUrl(url)

      // محاولة تحميل الملف مباشرة من الرابط
      const response = await fetch(validUrl)

      if (!response.ok) {
        // إذا فشل التحميل، نفتح الرابط في نافذة جديدة
        window.open(validUrl, '_blank')
        return true
      }

      const blob = await response.blob()

      // إنشاء رابط للتحميل
      const downloadUrl = URL.createObjectURL(blob)

      // استخراج اسم ملف آمن
      const fileName = extractSafeFileName(validUrl)

      // إنشاء رابط تحميل مؤقت
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // تنظيف الرابط المؤقت
      URL.revokeObjectURL(downloadUrl)

      return true
    } catch (error) {
      console.error('Error downloading receipt:', error)
      // في حالة الفشل، نفتح الرابط في نافذة جديدة
      window.open(getValidReceiptUrl(url), '_blank')
      return false
    }
  }

  // دالة لرفع إيصال تجريبي إلى Supabase Storage
  const uploadTestReceipt = async () => {
    try {
      // إنشاء صورة تجريبية (canvas)
      const canvas = document.createElement('canvas')
      canvas.width = 400
      canvas.height = 600
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        throw new Error('Failed to get canvas context')
      }

      // رسم خلفية بيضاء
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, 400, 600)

      // رسم إطار
      ctx.strokeStyle = '#4CAF50'
      ctx.lineWidth = 3
      ctx.strokeRect(10, 10, 380, 580)

      // كتابة نص الإيصال
      ctx.fillStyle = '#333333'
      ctx.font = 'bold 24px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('إيصال دفع تجريبي', 200, 60)

      ctx.font = '18px Arial'
      ctx.fillText('رقم الإيصال: ' + Date.now().toString().slice(-8), 200, 120)
      ctx.fillText('المبلغ: 1500 ج.م', 200, 160)
      ctx.fillText('طريقة الدفع: فودافون كاش', 200, 200)
      ctx.fillText('التاريخ: ' + new Date().toLocaleDateString('ar-EG'), 200, 240)

      // تحويل Canvas إلى Blob
      return new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/png')
      })
    } catch (error) {
      console.error('Error creating test receipt:', error)
      return null
    }
  }

  // دالة لإنشاء طلب تجريبي للاختبار
  const createTestOrder = async () => {
    try {
      // رفع إيصال تجريبي
      const receiptBlob = await uploadTestReceipt()
      let receiptUrl = 'https://via.placeholder.com/400x600/4CAF50/white?text=Test+Receipt'

      if (receiptBlob) {
        // استخدام نفس الطريقة المجربة
        const fileName = `${Date.now()}.png`
        const filePath = `receipts/${fileName}`

        const { data, error } = await supabase.storage
          .from('receipts')
          .upload(filePath, receiptBlob as Blob)

        if (!error && data) {
          // الحصول على رابط علني
          const { data: publicUrlData } = supabase.storage
            .from('receipts')
            .getPublicUrl(filePath)

          receiptUrl = publicUrlData.publicUrl
          console.log('✅ Test receipt uploaded:', receiptUrl)
        } else {
          console.error('❌ Error uploading test receipt:', error?.message)
        }
      }

      const testOrder = {
        customer_name: 'احمد محمد (تجريبي)',
        customer_email: 'test@example.com',
        customer_phone: '01012345678',
        customer_whatsapp: '01012345678',
        customer_address: 'القاهرة، مصر',
        notes: 'طلب تجريبي للاختبار',
        payment_method: 'vodafone_cash',
        receipt_url: receiptUrl,
        total_amount: 1500,
        status: 'pending',
        payment_status: 'pending'
      }

      const { data, error } = await supabase
        .from('orders')
        .insert([testOrder])
        .select()
        .single()

      if (error) {
        console.error('Error creating test order:', error)
        alert('حدث خطأ أثناء إنشاء الطلب التجريبي')
        return
      }

      // إضافة عناصر الطلب
      const orderItems = [
        {
          order_id: data.id,
          service_name: 'تصميم لوجو',
          sub_service_name: 'لوجو احترافي',
          price: 500,
          quantity: 1
        },
        {
          order_id: data.id,
          service_name: 'تسويق رقمي',
          sub_service_name: 'إدارة صفحات التواصل',
          price: 1000,
          quantity: 1
        }
      ]

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        console.error('Error creating order items:', itemsError)
      }

      alert('تم إنشاء طلب تجريبي بنجاح!')
      loadOrders()
    } catch (error) {
      console.error('Error creating test order:', error)
      alert('حدث خطأ أثناء إنشاء الطلب التجريبي')
    }
  }

  // دالة لإنشاء عدة طلبات تجريبية
  const createMultipleTestOrders = async () => {
    try {
      // إنشاء إيصالات تجريبية ورفعها
      const testOrders = []

      const orderData = [
        {
          customer_name: 'فاطمة علي',
          customer_email: 'fatma@example.com',
          customer_phone: '01098765432',
          customer_whatsapp: '01098765432',
          customer_address: 'الإسكندرية، مصر',
          notes: 'طلب تصميم شعار للشركة',
          payment_method: 'instapay',
          total_amount: 2500,
          status: 'confirmed',
          payment_status: 'paid'
        },
        {
          customer_name: 'محمد حسن',
          customer_email: 'mohamed@example.com',
          customer_phone: '01123456789',
          customer_whatsapp: '01123456789',
          customer_address: 'الجيزة، مصر',
          notes: 'حملة تسويقية على السوشيال ميديا',
          payment_method: 'vodafone_cash',
          total_amount: 3000,
          status: 'in_progress',
          payment_status: 'paid'
        },
        {
          customer_name: 'سارة أحمد',
          customer_email: 'sara@example.com',
          customer_phone: '01234567890',
          customer_whatsapp: '01234567890',
          customer_address: 'المنصورة، مصر',
          notes: 'مونتاج فيديو إعلاني',
          payment_method: 'fawry',
          total_amount: 1800,
          status: 'pending',
          payment_status: 'pending'
        }
      ]

      // إنشاء إيصالات ورفعها لكل طلب
      for (const orderInfo of orderData) {
        // إنشاء إيصال تجريبي
        const receiptBlob = await uploadTestReceipt()
        let receiptUrl = 'https://via.placeholder.com/400x600/4CAF50/white?text=Test+Receipt'

        if (receiptBlob) {
          // استخدام نفس الطريقة المجربة
          const fileName = `${Date.now()}_${orderInfo.customer_name.replace(/\s+/g, '-')}.png`
          const filePath = `receipts/${fileName}`

          const { data, error } = await supabase.storage
            .from('receipts')
            .upload(filePath, receiptBlob as Blob)

          if (!error && data) {
            // الحصول على رابط علني
            const { data: publicUrlData } = supabase.storage
              .from('receipts')
              .getPublicUrl(filePath)

            receiptUrl = publicUrlData.publicUrl
            console.log(`✅ Receipt uploaded for ${orderInfo.customer_name}:`, receiptUrl)
          } else {
            console.error(`❌ Error uploading receipt for ${orderInfo.customer_name}:`, error?.message)
          }
        }

        // إضافة رابط الإيصال للطلب
        const orderWithReceipt = {
          ...orderInfo,
          receipt_url: receiptUrl
        }

        testOrders.push(orderWithReceipt)
      }

      // إدراج الطلبات في قاعدة البيانات
      for (const order of testOrders) {
        const { data, error } = await supabase
          .from('orders')
          .insert([order])
          .select()
          .single()

        if (!error && data) {
          // إضافة عناصر الطلب
          const orderItems = [
            {
              order_id: data.id,
              service_name: 'خدمة تجريبية',
              sub_service_name: 'خدمة فرعية',
              price: order.total_amount,
              quantity: 1
            }
          ]

          await supabase
            .from('order_items')
            .insert(orderItems)
        }
      }

      alert('تم إنشاء 3 طلبات تجريبية بنجاح!')
      loadOrders()
    } catch (error) {
      console.error('Error creating test orders:', error)
      alert('حدث خطأ أثناء إنشاء الطلبات التجريبية')
    }
  }

  // دالة لاختبار رفع ملف حقيقي - الكود المجرب
  const handleTestFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      console.log('🚀 Starting file upload test...')

      // ✅ الكود المجرب النهائي
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `receipts/${fileName}`

      console.log('📁 File details:')
      console.log('- Original name:', file.name)
      console.log('- New filename:', fileName)
      console.log('- File path:', filePath)
      console.log('- File size:', file.size)
      console.log('- File type:', file.type)

      // 1. رفع الملف مع تحقق مفصل
      console.log('🚀 Starting upload to Supabase...')
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('receipts') // اسم البكت لازم يكون دقيق
        .upload(filePath, file)

      console.log('📊 Upload result:')
      console.log('- Data:', uploadData)
      console.log('- Error:', uploadError)

      if (uploadError) {
        console.error("❌ رفع فشل:", uploadError)
        alert(`❌ رفع فشل: ${uploadError.message}\n\nتفاصيل الخطأ:\n${JSON.stringify(uploadError, null, 2)}`)
        return
      }

      if (!uploadData) {
        console.error("❌ لا توجد بيانات من الرفع")
        alert("❌ لا توجد بيانات من الرفع")
        return
      }

      console.log('✅ Upload successful:', uploadData)
      console.log('📁 File uploaded to path:', uploadData.path)

      // 2. توليد رابط التحميل
      const { data: publicUrlData } = supabase
        .storage
        .from('receipts')
        .getPublicUrl(filePath)

      const publicUrl = publicUrlData?.publicUrl

      if (!publicUrl) {
        console.error("❌ فشل في توليد الرابط")
        alert("❌ فشل في توليد الرابط")
        return
      }

      console.log('🔗 Public URL:', publicUrl)

      // 3. اختبار فتح الرابط
      console.log('🔍 Testing URL access...')
      console.log('📋 Copy this URL to test in browser:', publicUrl)
      console.log('🌐 Expected format: https://xyz.supabase.co/storage/v1/object/public/receipts/' + fileName)

      // إنشاء طلب تجريبي مع الإيصال المرفوع
      const testOrder = {
        customer_name: `مستخدم تجريبي (${fileName})`,
        customer_email: 'real-file@example.com',
        customer_phone: '01000000000',
        customer_whatsapp: '01000000000',
        customer_address: 'اختبار رفع ملف حقيقي',
        notes: `طلب تجريبي مع إيصال حقيقي مرفوع: ${fileName}`,
        payment_method: 'vodafone_cash',
        receipt_url: publicUrl,
        total_amount: 999,
        status: 'pending',
        payment_status: 'pending'
      }

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([testOrder])
        .select()
        .single()

      if (orderError) {
        console.error('Order creation error:', orderError)
        alert(`خطأ في إنشاء الطلب: ${orderError.message}`)
        return
      }

      // إضافة عناصر الطلب
      const orderItems = [
        {
          order_id: orderData.id,
          service_name: 'اختبار رفع ملف',
          sub_service_name: 'رفع إيصال حقيقي',
          price: 999,
          quantity: 1
        }
      ]

      await supabase
        .from('order_items')
        .insert(orderItems)

      alert('تم رفع الملف وإنشاء الطلب بنجاح!')
      console.log('Test order created with real file:', orderData)

      loadOrders()

      // إعادة تعيين input
      e.target.value = ''

    } catch (error) {
      console.error('Unexpected error:', error)
      alert('حدث خطأ غير متوقع')
    }
  }

  // دالة لفحص ملفات Storage مع اختبار شامل
  const checkStorageFiles = async () => {
    try {
      console.log('🔍 Starting comprehensive storage check...')

      // 1. فحص bucket
      console.log('📦 Checking bucket info...')
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()

      if (bucketError) {
        console.error('❌ Error checking buckets:', bucketError)
      } else {
        console.log('✅ Available buckets:', buckets)
        const receiptsBucket = buckets.find(b => b.id === 'receipts')
        console.log('📦 Receipts bucket:', receiptsBucket)
      }

      // 2. فحص الملفات
      console.log('📁 Checking files in receipts folder...')
      const { data: files, error } = await supabase.storage
        .from('receipts')
        .list('receipts', {
          limit: 10,
          offset: 0
        })

      if (error) {
        console.error('❌ Error listing files:', error)
        alert(`خطأ في فحص الملفات: ${error.message}`)
        return
      }

      console.log('📁 Files in storage:', files)

      // 3. اختبار رفع ملف تجريبي صغير
      console.log('🧪 Testing upload capability...')
      const testBlob = new Blob(['test'], { type: 'text/plain' })
      const testPath = `receipts/test-${Date.now()}.txt`

      const { data: testUpload, error: testError } = await supabase.storage
        .from('receipts')
        .upload(testPath, testBlob)

      if (testError) {
        console.error('❌ Upload test failed:', testError)
        alert(`❌ اختبار الرفع فشل: ${testError.message}`)
      } else {
        console.log('✅ Upload test successful:', testUpload)

        // حذف الملف التجريبي
        await supabase.storage.from('receipts').remove([testPath])
        console.log('🗑️ Test file cleaned up')
      }

      if (files && files.length > 0) {
        console.log('✅ Found files:')
        files.forEach((file, index) => {
          const fullPath = `receipts/${file.name}`
          const { data: urlData } = supabase.storage
            .from('receipts')
            .getPublicUrl(fullPath)

          console.log(`${index + 1}. ${file.name}`)
          console.log(`   📅 Created: ${file.created_at}`)
          console.log(`   📏 Size: ${file.metadata?.size || 'Unknown'} bytes`)
          console.log(`   🔗 URL: ${urlData.publicUrl}`)
          console.log('---')
        })

        alert(`✅ تم العثور على ${files.length} ملف في Storage.\n🧪 اختبار الرفع: ${testError ? 'فشل' : 'نجح'}\n\nتحقق من Console للتفاصيل.`)
      } else {
        console.log('📭 No files found in storage')
        alert(`📭 لا توجد ملفات في Storage\n🧪 اختبار الرفع: ${testError ? 'فشل' : 'نجح'}`)
      }

    } catch (error) {
      console.error('Unexpected error:', error)
      alert('حدث خطأ غير متوقع أثناء فحص Storage')
    }
  }

  // دالة لإنشاء سياسة Storage للوصول العام
  const createStoragePolicy = async () => {
    try {
      console.log('🔐 Creating storage policy...')

      // محاولة إنشاء سياسة للوصول العام للقراءة
      const policySQL = `
        CREATE POLICY "Public read access" ON storage.objects
        FOR SELECT USING (bucket_id = 'receipts');
      `

      console.log('📝 Policy SQL:', policySQL)

      alert(`
🛠 لإنشاء سياسة Storage يدوياً:

1. اذهب إلى: Supabase Dashboard → Storage → receipts → Policies
2. اضغط "Create a new policy"
3. املأ البيانات:
   - Policy Name: Public read access
   - Action: SELECT
   - Condition: true
   - Role: anon

أو استخدم SQL Editor:
${policySQL}
      `)

    } catch (error) {
      console.error('Error creating policy:', error)
      alert('تحقق من Console للتعليمات')
    }
  }

  // دالة لاختبار اتصال Supabase
  const testSupabaseConnection = async () => {
    try {
      console.log('🔌 Testing Supabase connection...')

      // 1. اختبار قاعدة البيانات
      console.log('🗄️ Testing database connection...')
      const { data: dbTest, error: dbError } = await supabase
        .from('orders')
        .select('count')
        .limit(1)

      console.log('Database test result:', { data: dbTest, error: dbError })

      // 2. اختبار Storage
      console.log('📦 Testing storage connection...')
      const { data: storageTest, error: storageError } = await supabase.storage.listBuckets()

      console.log('Storage test result:', { data: storageTest, error: storageError })

      // 3. اختبار متغيرات البيئة
      console.log('🔧 Checking environment variables...')
      console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'موجود' : 'مفقود')

      const results = {
        database: !dbError,
        storage: !storageError,
        envVars: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      }

      console.log('🧪 Test results:', results)

      const message = `
🔌 نتائج اختبار Supabase:

✅ قاعدة البيانات: ${results.database ? 'متصلة' : 'فشل الاتصال'}
✅ Storage: ${results.storage ? 'متصل' : 'فشل الاتصال'}
✅ متغيرات البيئة: ${results.envVars ? 'موجودة' : 'مفقودة'}

${!results.database ? `❌ خطأ قاعدة البيانات: ${dbError?.message}` : ''}
${!results.storage ? `❌ خطأ Storage: ${storageError?.message}` : ''}
      `

      alert(message)

    } catch (error) {
      console.error('❌ Connection test failed:', error)
      alert(`❌ فشل اختبار الاتصال: ${error}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ShoppingCart className="w-6 h-6 text-blue-600 ml-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">إدارة الطلبات</h1>
              <p className="text-gray-600">متابعة ومراجعة جميع الطلبات</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={loadOrders}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
            >
              <RefreshCw className="w-4 h-4 ml-2" />
              تحديث
            </button>
            <button
              onClick={createTestOrder}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <ShoppingCart className="w-4 h-4 ml-2" />
              إنشاء طلب تجريبي
            </button>
            <button
              onClick={createMultipleTestOrders}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <ShoppingCart className="w-4 h-4 ml-2" />
              إنشاء 3 طلبات تجريبية
            </button>

            {/* زر رفع إيصال تجريبي */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleTestFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="test-file-upload"
              />
              <label
                htmlFor="test-file-upload"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center cursor-pointer"
              >
                <Download className="w-4 h-4 ml-2" />
                اختبار رفع إيصال
              </label>
            </div>

            <button
              onClick={checkStorageFiles}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center"
            >
              <Eye className="w-4 h-4 ml-2" />
              فحص ملفات Storage
            </button>

            <button
              onClick={createStoragePolicy}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
            >
              <Shield className="w-4 h-4 ml-2" />
              إنشاء سياسة Storage
            </button>

            <button
              onClick={testSupabaseConnection}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
            >
              <CheckCircle className="w-4 h-4 ml-2" />
              اختبار اتصال Supabase
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي الطلبات</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">طلبات معلقة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(order => order.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">طلبات مكتملة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(order => order.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.reduce((sum, order) => sum + order.total_amount, 0).toLocaleString()} ج.م
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="بحث بالاسم أو الهاتف أو رقم الطلب..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">جميع الحالات</option>
              <option value="pending">معلق</option>
              <option value="confirmed">مؤكد</option>
              <option value="in_progress">قيد التنفيذ</option>
              <option value="completed">مكتمل</option>
              <option value="cancelled">ملغي</option>
            </select>
            
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">جميع حالات الدفع</option>
              <option value="pending">معلق</option>
              <option value="paid">مدفوع</option>
              <option value="rejected">مرفوض</option>
            </select>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {filteredOrders.length} طلب
              </span>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    العميل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الطلب
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المبلغ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    طريقة الدفع
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    حالة الطلب
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    حالة الدفع
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التاريخ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">جاري تحميل الطلبات...</p>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">لا توجد طلبات</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                          <div className="text-sm text-gray-500">{order.customer_phone}</div>
                          {order.customer_email && (
                            <div className="text-xs text-gray-400">{order.customer_email}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {order.order_items?.length || 0} عنصر
                        </div>
                        <div className="text-xs text-gray-500">
                          #{order.id.slice(0, 8)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.total_amount.toLocaleString()} ج.م
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {getPaymentMethodLabel(order.payment_method)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className={`text-xs rounded-full px-2 py-1 border-0 ${getStatusColor(order.status)}`}
                        >
                          <option value="pending">معلق</option>
                          <option value="confirmed">مؤكد</option>
                          <option value="in_progress">قيد التنفيذ</option>
                          <option value="completed">مكتمل</option>
                          <option value="cancelled">ملغي</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.payment_status}
                          onChange={(e) => updatePaymentStatus(order.id, e.target.value)}
                          className={`text-xs rounded-full px-2 py-1 border-0 ${getPaymentStatusColor(order.payment_status)}`}
                        >
                          <option value="pending">معلق</option>
                          <option value="paid">مدفوع</option>
                          <option value="rejected">مرفوض</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="عرض التفاصيل"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {order.receipt_url ? (
                            <div className="flex space-x-1">
                              <button
                                onClick={() => openReceiptModal(order.receipt_url, order.customer_name)}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                title="عرض الإيصال"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={async () => {
                                  const success = await downloadReceiptFromStorage(order.receipt_url)
                                  if (!success) {
                                    alert('تم فتح الإيصال في نافذة جديدة')
                                  }
                                }}
                                className="text-green-600 hover:text-green-900 p-1 rounded"
                                title="تحميل الإيصال"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400 p-1" title="لا يوجد إيصال">
                              <FileText className="w-4 h-4" />
                            </span>
                          )}

                          {(order.customer_phone || order.customer_whatsapp) && (
                            <a
                              href={getWhatsAppLink(
                                order.customer_whatsapp || order.customer_phone,
                                order.customer_name,
                                order.id
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-900 p-1 rounded bg-green-50 hover:bg-green-100"
                              title="تواصل عبر الواتساب"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                تفاصيل الطلب #{selectedOrder.id.slice(0, 8)}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-blue-900 mb-3">معلومات العميل</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">الاسم</label>
                    <p className="text-gray-900">{selectedOrder.customer_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">الهاتف</label>
                    <p className="text-gray-900">{selectedOrder.customer_phone}</p>
                  </div>
                  {selectedOrder.customer_email && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                      <p className="text-gray-900">{selectedOrder.customer_email}</p>
                    </div>
                  )}
                  {selectedOrder.customer_whatsapp && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">الواتساب</label>
                      <p className="text-gray-900">{selectedOrder.customer_whatsapp}</p>
                    </div>
                  )}
                  {selectedOrder.customer_address && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">العنوان</label>
                      <p className="text-gray-900">{selectedOrder.customer_address}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">عناصر الطلب</h4>
                <div className="space-y-3">
                  {selectedOrder.order_items?.map((item, index) => (
                    <div key={item.id || index} className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium text-gray-900">{item.service_name}</h5>
                          {item.sub_service_name && (
                            <p className="text-sm text-gray-600">{item.sub_service_name}</p>
                          )}
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">
                            {item.price.toLocaleString()} ج.م × {item.quantity}
                          </p>
                          <p className="text-sm text-gray-600">
                            المجموع: {(item.price * item.quantity).toLocaleString()} ج.م
                          </p>
                        </div>
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-center py-4">لا توجد عناصر في الطلب</p>
                  )}
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-green-900 mb-3">معلومات الدفع</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">المبلغ الإجمالي</label>
                    <p className="text-xl font-bold text-green-600">
                      {selectedOrder.total_amount.toLocaleString()} ج.م
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">طريقة الدفع</label>
                    <p className="text-gray-900">{getPaymentMethodLabel(selectedOrder.payment_method)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">حالة الدفع</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${getPaymentStatusColor(selectedOrder.payment_status)}`}>
                      {getPaymentStatusLabel(selectedOrder.payment_status)}
                    </span>
                  </div>
                </div>

                {/* Receipt */}
                {selectedOrder.receipt_url && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">إيصال الدفع</label>
                    <div className="border border-gray-300 rounded-lg p-4 bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">إيصال الدفع المرفوع</span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => window.open(getValidReceiptUrl(selectedOrder.receipt_url), '_blank')}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center"
                          >
                            <Eye className="w-4 h-4 ml-1" />
                            عرض
                          </button>
                          <button
                            onClick={async () => {
                              const success = await downloadReceiptFromStorage(selectedOrder.receipt_url)
                              if (!success) {
                                alert('تم فتح الإيصال في نافذة جديدة')
                              }
                            }}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center"
                          >
                            <Download className="w-4 h-4 ml-1" />
                            تحميل
                          </button>
                        </div>
                      </div>

                      {/* Receipt Preview */}
                      <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                        <ReceiptPreview receiptUrl={getValidReceiptUrl(selectedOrder.receipt_url)} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Status & Notes */}
              <div className="bg-yellow-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-yellow-900 mb-3">حالة الطلب والملاحظات</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">حالة الطلب</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">تاريخ الطلب</label>
                    <p className="text-gray-900">
                      {new Date(selectedOrder.created_at).toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">ملاحظات العميل</label>
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <p className="text-gray-900">{selectedOrder.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="flex space-x-3">
                  {selectedOrder.payment_status === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          updatePaymentStatus(selectedOrder.id, 'paid')
                          setSelectedOrder(null)
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                      >
                        <CheckCircle className="w-4 h-4 ml-2" />
                        قبول الدفع
                      </button>
                      <button
                        onClick={() => {
                          updatePaymentStatus(selectedOrder.id, 'rejected')
                          setSelectedOrder(null)
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
                      >
                        <XCircle className="w-4 h-4 ml-2" />
                        رفض الدفع
                      </button>
                    </>
                  )}
                </div>

                <div className="flex space-x-3">
                  {(selectedOrder.customer_phone || selectedOrder.customer_whatsapp) && (
                    <a
                      href={getWhatsAppLink(
                        selectedOrder.customer_whatsapp || selectedOrder.customer_phone,
                        selectedOrder.customer_name,
                        selectedOrder.id
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                    >
                      <MessageCircle className="w-4 h-4 ml-2" />
                      تواصل عبر الواتساب
                    </a>
                  )}

                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                إيصال الدفع - {selectedCustomerName}
              </h3>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <ReceiptViewer
                receiptUrl={selectedReceiptUrl}
                customerName={selectedCustomerName}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
