'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import RouteGuard from '@/components/admin/RouteGuard'
import ReceiptViewer from '@/components/ReceiptViewer'
import {
  Receipt,
  ArrowLeft,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Search,
  Filter,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

interface ReceiptData {
  id: string
  customer_name: string
  customer_email: string
  amount: number
  payment_method: string
  receipt_image_url: string
  status: 'pending' | 'approved' | 'rejected'
  notes: string
  created_at: string
  updated_at: string
  order_id?: string
  subscription_id?: string
  source?: 'receipts' | 'orders' | 'subscriptions'
}

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<ReceiptData[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({
    type: null,
    text: ''
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState('')
  const [selectedCustomerName, setSelectedCustomerName] = useState('')

  useEffect(() => {
    loadReceipts()
  }, [])

  const loadReceipts = async () => {
    try {
      setLoading(true)
      console.log('📄 Loading receipts from database...')

      // تحميل الإيصالات من جدول receipts
      const { data: receiptsData, error: receiptsError } = await supabase
        .from('receipts')
        .select('*')
        .order('created_at', { ascending: false })

      // تحميل الطلبات التي تحتوي على إيصالات من جدول orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .not('receipt_url', 'is', null)
        .order('created_at', { ascending: false })

      // تحميل الاشتراكات التي تحتوي على إيصالات من جدول subscriptions
      const { data: subscriptionsData, error: subscriptionsError } = await supabase
        .from('subscriptions')
        .select(`
          *,
          users (name, email, phone),
          packages (name)
        `)
        .not('receipt_url', 'is', null)
        .order('created_at', { ascending: false })

      if (receiptsError && ordersError && subscriptionsError) {
        console.error('Error loading receipts:', receiptsError, ordersError, subscriptionsError)
        setMessage({
          type: 'error',
          text: 'خطأ في تحميل الإيصالات'
        })
        return
      }

      // دمج البيانات من الجدولين
      const combinedReceipts: ReceiptData[] = []

      // إضافة الإيصالات من جدول receipts
      if (receiptsData) {
        receiptsData.forEach(receipt => {
          combinedReceipts.push({
            id: receipt.id,
            customer_name: receipt.notes || 'غير محدد',
            customer_email: '',
            amount: receipt.amount,
            payment_method: receipt.payment_method,
            receipt_image_url: receipt.receipt_url,
            status: receipt.status || 'pending',
            notes: receipt.notes || '',
            created_at: receipt.created_at,
            updated_at: receipt.updated_at,
            order_id: receipt.order_id,
            source: 'receipts'
          })
        })
      }

      // إضافة الطلبات التي تحتوي على إيصالات من جدول orders
      if (ordersData) {
        ordersData.forEach(order => {
          // تحقق من عدم وجود إيصال مطابق في جدول receipts
          const existingReceipt = receiptsData?.find(r => r.order_id === order.id)
          if (!existingReceipt) {
            combinedReceipts.push({
              id: order.id,
              customer_name: order.customer_name,
              customer_email: order.customer_email || '',
              amount: order.total_amount,
              payment_method: order.payment_method,
              receipt_image_url: order.receipt_url,
              status: order.payment_status === 'paid' ? 'approved' : 'pending',
              notes: order.notes || '',
              created_at: order.created_at,
              updated_at: order.updated_at,
              order_id: order.id,
              source: 'orders'
            })
          }
        })
      }

      // إضافة الاشتراكات التي تحتوي على إيصالات من جدول subscriptions
      if (subscriptionsData) {
        subscriptionsData.forEach(subscription => {
          // تحقق من عدم وجود إيصال مطابق في جدول receipts
          const existingReceipt = receiptsData?.find(r => r.subscription_id === subscription.id)
          if (!existingReceipt) {
            combinedReceipts.push({
              id: subscription.id,
              customer_name: subscription.users?.name || 'غير محدد',
              customer_email: subscription.users?.email || '',
              amount: subscription.total_amount,
              payment_method: subscription.payment_method || 'غير محدد',
              receipt_image_url: subscription.receipt_url,
              status: subscription.status === 'active' ? 'approved' : subscription.status === 'suspended' ? 'pending' : 'pending',
              notes: `اشتراك في باقة: ${subscription.packages?.name || 'غير محدد'}`,
              created_at: subscription.created_at,
              updated_at: subscription.updated_at,
              order_id: undefined,
              subscription_id: subscription.id,
              source: 'subscriptions'
            })
          }
        })
      }

      // ترتيب النتائج حسب التاريخ
      combinedReceipts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      console.log('✅ Combined receipts loaded:', combinedReceipts)
      setReceipts(combinedReceipts)
    } catch (error) {
      console.error('Error loading receipts:', error)
      setMessage({
        type: 'error',
        text: 'حدث خطأ أثناء تحميل الإيصالات'
      })
    } finally {
      setLoading(false)
    }
  }

  const updateReceiptStatus = async (receiptId: string, newStatus: 'approved' | 'rejected') => {
    try {
      console.log('🔄 Updating receipt status:', receiptId, '→', newStatus)

      // العثور على الإيصال لمعرفة مصدره
      const receipt = receipts.find(r => r.id === receiptId)
      if (!receipt) {
        setMessage({
          type: 'error',
          text: 'لم يتم العثور على الإيصال'
        })
        return
      }

      if (receipt.source === 'receipts') {
        // تحديث في جدول receipts
        const { error } = await supabase
          .from('receipts')
          .update({
            status: newStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', receiptId)

        if (error) {
          console.error('Error updating receipt status:', error)
          setMessage({
            type: 'error',
            text: `خطأ في تحديث حالة الإيصال: ${error.message}`
          })
          return
        }
      } else if (receipt.source === 'orders') {
        // تحديث في جدول orders
        const paymentStatus = newStatus === 'approved' ? 'paid' : 'rejected'
        const { error } = await supabase
          .from('orders')
          .update({
            payment_status: paymentStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', receiptId)

        if (error) {
          console.error('Error updating order payment status:', error)
          setMessage({
            type: 'error',
            text: `خطأ في تحديث حالة الدفع: ${error.message}`
          })
          return
        }
      } else if (receipt.source === 'subscriptions') {
        // تحديث في جدول subscriptions
        const subscriptionStatus = newStatus === 'approved' ? 'active' : 'suspended'
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: subscriptionStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', receiptId)

        if (error) {
          console.error('Error updating subscription status:', error)
          setMessage({
            type: 'error',
            text: `خطأ في تحديث حالة الاشتراك: ${error.message}`
          })
          return
        }
      }

      console.log('✅ Receipt status updated successfully')
      setMessage({
        type: 'success',
        text: `تم ${newStatus === 'approved' ? 'قبول' : 'رفض'} الإيصال بنجاح`
      })
      await loadReceipts()
    } catch (error) {
      console.error('Error updating receipt status:', error)
      setMessage({
        type: 'error',
        text: 'حدث خطأ أثناء تحديث حالة الإيصال'
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  const openReceiptModal = (receiptUrl: string, customerName: string) => {
    setSelectedReceiptUrl(receiptUrl)
    setSelectedCustomerName(customerName)
    setShowReceiptModal(true)
  }

  const filteredReceipts = receipts.filter(receipt => {
    const matchesSearch = receipt.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receipt.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || receipt.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <RouteGuard>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Receipt className="w-6 h-6 text-green-600 ml-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">إدارة الإيصالات</h1>
                <p className="text-gray-600">مراجعة وإدارة إيصالات الدفع</p>
              </div>
            </div>
          </div>
        </div>

        {/* رسائل النجاح/الخطأ */}
        {message.type && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 ml-2" />
            ) : (
              <AlertCircle className="w-5 h-5 ml-2" />
            )}
            {message.text}
          </div>
        )}

        {/* البحث والفلترة */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="البحث بالاسم أو البريد الإلكتروني..."
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">جميع الحالات</option>
                <option value="pending">معلق</option>
                <option value="approved">مقبول</option>
                <option value="rejected">مرفوض</option>
              </select>
            </div>
          </div>
        </div>

        {/* جدول الإيصالات */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      العميل
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المبلغ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      طريقة الدفع
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
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
                      <td colSpan={6} className="px-6 py-4 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                        <p className="text-gray-500 mt-2">جاري التحميل...</p>
                      </td>
                    </tr>
                  ) : filteredReceipts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        لا توجد إيصالات
                      </td>
                    </tr>
                  ) : (
                    filteredReceipts.map((receipt) => (
                      <tr key={receipt.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {receipt.customer_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {receipt.customer_email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {receipt.amount} ج.م
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {receipt.payment_method}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(receipt.status)}`}>
                            {getStatusIcon(receipt.status)}
                            <span className="mr-1">
                              {receipt.status === 'approved' ? 'مقبول' :
                               receipt.status === 'rejected' ? 'مرفوض' : 'معلق'}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(receipt.created_at).toLocaleDateString('ar-EG')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {receipt.receipt_image_url && (
                              <button
                                onClick={() => openReceiptModal(receipt.receipt_image_url, receipt.customer_name)}
                                className="text-blue-600 hover:text-blue-900"
                                title="عرض الإيصال"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                            
                            {receipt.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => updateReceiptStatus(receipt.id, 'approved')}
                                  className="text-green-600 hover:text-green-900"
                                  title="قبول"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => updateReceiptStatus(receipt.id, 'rejected')}
                                  className="text-red-600 hover:text-red-900"
                                  title="رفض"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
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
    </RouteGuard>
  )
}
