'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Package,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  Download,
  Phone,
  MessageCircle,
  User,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  X,
  Mail
} from 'lucide-react'
import { useAuth, usePermissions } from '@/lib/auth/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { storageManager } from '@/lib/storage/local-storage'

type Order = {
  id: string
  customer: {
    name: string
    email: string
    phone: string
  }
  service_name: string
  quantity: number
  price: number
  total_amount: number
  status: string
  payment_status: string
  payment_method: string
  requirements: string
  admin_notes?: string
  created_at: string
  updated_at: string
}




export default function AdminOrdersPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { isAdmin } = usePermissions()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin())) {
      router.push('/auth/login')
      return
    }
  }, [user, isAuthenticated, isLoading, isAdmin, router])

  // Load orders from localStorage on component mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const savedOrders = storageManager.getOrders()
    setOrders(savedOrders)
    setFilteredOrders(savedOrders)
  }, [])

  // Save orders to localStorage whenever orders change
  useEffect(() => {
    if (typeof window === 'undefined') return

    if (orders.length > 0) {
      storageManager.saveOrders(orders)
    }
  }, [orders])



  useEffect(() => {
    let filtered = orders

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.includes(searchTerm) ||
        (order.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    // Filter by payment status
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(order => order.payment_status === paymentFilter)
    }

    setFilteredOrders(filtered)
  }, [searchTerm, statusFilter, paymentFilter, orders])

  const getCustomerName = (order: Order) => {
    return order.customer?.name || 'غير معروف'
  }

  const getCustomerPhone = (order: Order) => {
    return (order.customer as any)?.whatsapp_number || order.customer?.phone || ''
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتمل'
      case 'in_progress':
        return 'قيد التنفيذ'
      case 'pending':
        return 'في الانتظار'
      case 'cancelled':
        return 'ملغي'
      default:
        return status
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'مدفوع'
      case 'pending':
        return 'في الانتظار'
      case 'failed':
        return 'فشل'
      default:
        return status
    }
  }

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId
        ? { ...order, status: newStatus as any, updated_at: new Date().toISOString() }
        : order
    ))
    toast.success('تم تحديث حالة الطلب')
    setSelectedOrder(null)
  }

  const updatePaymentStatus = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId
        ? { ...order, payment_status: newStatus as any, updated_at: new Date().toISOString() }
        : order
    ))
    toast.success('تم تحديث حالة الدفع')
    setSelectedOrder(prev => prev ? { ...prev, payment_status: newStatus as any } : null)
  }

  const addAdminNote = (orderId: string, note: string) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId
        ? { ...order, admin_notes: note, updated_at: new Date().toISOString() }
        : order
    ))
    toast.success('تم حفظ الملاحظات')
  }

  const openWhatsApp = (phone: string, orderInfo: string) => {
    const message = `مرحباً، بخصوص طلبك: ${orderInfo}`
    const whatsappUrl = `https://wa.me/${phone.replace('+', '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const openGoogleMessages = (phone: string, orderInfo: string) => {
    const message = `مرحباً، بخصوص طلبك: ${orderInfo}`
    // This would typically integrate with Google Messages API
    toast('سيتم فتح Google Messages')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4" />
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-800 ml-4">
                ← العودة للوحة التحكم
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">إدارة الطلبات</h1>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                onClick={() => {
                  // Export functionality
                  toast.success('سيتم تصدير البيانات')
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Download className="w-4 h-4 ml-2" />
                تصدير
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="بحث في الطلبات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">جميع الحالات</option>
              <option value="pending">في الانتظار</option>
              <option value="in_progress">قيد التنفيذ</option>
              <option value="completed">مكتمل</option>
              <option value="cancelled">ملغي</option>
            </select>

            {/* Payment Filter */}
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">جميع حالات الدفع</option>
              <option value="paid">مدفوع</option>
              <option value="pending">في انتظار الدفع</option>
              <option value="failed">فشل الدفع</option>
            </select>

            {/* Results Count */}
            <div className="flex items-center justify-center bg-blue-50 rounded-lg p-2">
              <span className="text-blue-600 font-semibold">
                {filteredOrders.length} طلب
              </span>
            </div>
          </div>
        </motion.div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {isLoadingOrders ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="spinner w-8 h-8 mx-auto mb-4" />
                <p className="text-gray-600">جاري تحميل الطلبات...</p>
              </div>
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    رقم الطلب
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    العميل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الخدمة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المبلغ
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
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 ml-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {getCustomerName(order)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {getCustomerPhone(order)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.service_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        الكمية: {order.quantity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.total_amount} جنيه
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.payment_status)}`}>
                        {getPaymentStatusText(order.payment_status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2 space-x-reverse">
                        <button
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowOrderModal(true)
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="عرض التفاصيل"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openWhatsApp(getCustomerPhone(order), order.service_name)}
                          className="text-green-600 hover:text-green-900"
                          title="واتساب"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openGoogleMessages(getCustomerPhone(order), order.service_name)}
                          className="text-purple-600 hover:text-purple-900"
                          title="Google Messages"
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </motion.div>



        {/* Order Details Modal */}
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowOrderModal(false)} />

              <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-right align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    تفاصيل الطلب #{selectedOrder.id}
                  </h3>
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Order Info */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">معلومات العميل</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">الاسم:</span>
                          <span className="font-medium">{getCustomerName(selectedOrder)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">الهاتف:</span>
                          <span className="font-medium">{getCustomerPhone(selectedOrder)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">البريد:</span>
                          <span className="font-medium">{selectedOrder.customer?.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">تفاصيل الطلب</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">الخدمة:</span>
                          <span className="font-medium">{selectedOrder.service_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">الكمية:</span>
                          <span className="font-medium">{selectedOrder.quantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">السعر:</span>
                          <span className="font-medium">{selectedOrder.price} جنيه</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">المجموع:</span>
                          <span className="font-bold text-lg">{selectedOrder.total_amount} جنيه</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">حالة الطلب</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">حالة الطلب:</span>
                          <select
                            value={selectedOrder.status}
                            onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1"
                          >
                            <option value="pending">في الانتظار</option>
                            <option value="processing">قيد المعالجة</option>
                            <option value="active">نشط</option>
                            <option value="completed">مكتمل</option>
                            <option value="cancelled">ملغي</option>
                          </select>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">حالة الدفع:</span>
                          <select
                            value={selectedOrder.payment_status}
                            onChange={(e) => updatePaymentStatus(selectedOrder.id, e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1"
                          >
                            <option value="pending">في الانتظار</option>
                            <option value="paid">مدفوع</option>
                            <option value="failed">فشل</option>
                          </select>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">طريقة الدفع:</span>
                          <span className="font-medium">{selectedOrder.payment_method}</span>
                        </div>
                      </div>
                    </div>

                    {selectedOrder.requirements && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-3">متطلبات العميل</h4>
                        <p className="text-gray-700">{selectedOrder.requirements}</p>
                      </div>
                    )}

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">ملاحظات الإدارة</h4>
                      <textarea
                        value={selectedOrder.admin_notes || ''}
                        onChange={(e) => {
                          setSelectedOrder(prev => prev ? { ...prev, admin_notes: e.target.value } : null)
                        }}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        rows={3}
                        placeholder="أضف ملاحظات..."
                      />
                      <button
                        onClick={() => addAdminNote(selectedOrder.id, selectedOrder.admin_notes || '')}
                        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        حفظ الملاحظات
                      </button>
                    </div>
                  </div>

                  {/* Payment Receipt */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">إيصال الدفع</h4>
                      {(selectedOrder as any).payment_receipt_url ? (
                        <div className="space-y-3">
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                            <img
                              src={(selectedOrder as any).payment_receipt_url}
                              alt="إيصال الدفع"
                              className="w-full h-64 object-contain rounded-lg"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder-receipt.png'
                              }}
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => window.open((selectedOrder as any).payment_receipt_url, '_blank')}
                              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                            >
                              عرض بالحجم الكامل
                            </button>
                            <button
                              onClick={() => {
                                const link = document.createElement('a')
                                link.href = (selectedOrder as any).payment_receipt_url!
                                link.download = `receipt-${selectedOrder.id}.jpg`
                                link.click()
                              }}
                              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                            >
                              تحميل
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="text-gray-400 text-4xl mb-2">📄</div>
                          <p className="text-gray-600">لم يتم رفع إيصال دفع</p>
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">إجراءات سريعة</h4>
                      <div className="space-y-2">
                        <a
                          href={`https://wa.me/${getCustomerPhone(selectedOrder).replace('+', '')}?text=مرحباً، بخصوص طلبك رقم ${selectedOrder.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center"
                        >
                          <MessageCircle className="w-4 h-4 ml-2" />
                          تواصل عبر واتساب
                        </a>
                        <a
                          href={`tel:${getCustomerPhone(selectedOrder)}`}
                          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center"
                        >
                          <Phone className="w-4 h-4 ml-2" />
                          اتصال هاتفي
                        </a>
                        <a
                          href={`mailto:${selectedOrder.customer?.email}?subject=بخصوص طلبك رقم ${selectedOrder.id}`}
                          className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 flex items-center justify-center"
                        >
                          <Mail className="w-4 h-4 ml-2" />
                          إرسال بريد إلكتروني
                        </a>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">معلومات إضافية</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">تاريخ الطلب:</span>
                          <span>{new Date(selectedOrder.created_at).toLocaleDateString('ar-EG')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">آخر تحديث:</span>
                          <span>{new Date(selectedOrder.updated_at).toLocaleDateString('ar-EG')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">رقم الطلب:</span>
                          <span className="font-mono">{selectedOrder.id}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t mt-6">
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    إغلاق
                  </button>
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'completed')
                      setShowOrderModal(false)
                    }}
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    تأكيد اكتمال الطلب
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
