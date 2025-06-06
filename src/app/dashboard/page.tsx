'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ShoppingCart, 
  Package, 
  Clock, 
  CheckCircle, 
  User,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  Star,
  Eye,
  Download
} from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Order } from '@/lib/auth/auth-types'

// Mock data for customer orders
const mockOrders: Order[] = [
  {
    id: '1',
    customerId: '2',
    serviceId: 'logo-design',
    serviceName: 'تصميم لوجو',
    quantity: 1,
    price: 500,
    totalAmount: 500,
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'vodafone_cash',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-18'),
    completedAt: new Date('2024-01-18'),
    requirements: 'تصميم لوجو لشركة تقنية بألوان زرقاء وبيضاء'
  },
  {
    id: '2',
    customerId: '2',
    serviceId: 'social-media-design',
    serviceName: 'تصميم سوشيال ميديا',
    quantity: 5,
    price: 200,
    totalAmount: 1000,
    status: 'in_progress',
    paymentStatus: 'paid',
    paymentMethod: 'instapay',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-22'),
    requirements: '5 تصاميم لمنشورات فيسبوك وانستجرام'
  },
  {
    id: '3',
    customerId: '2',
    serviceId: 'video-editing',
    serviceName: 'مونتاج فيديو',
    quantity: 1,
    price: 800,
    totalAmount: 800,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    requirements: 'مونتاج فيديو تعريفي للشركة مدة 2 دقيقة'
  }
]

export default function CustomerDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalSpent: 0
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
      return
    }

    if (user?.role !== 'customer') {
      router.push('/auth/login')
      return
    }

    // Load customer orders
    setOrders(mockOrders)
    
    // Calculate stats
    const totalOrders = mockOrders.length
    const completedOrders = mockOrders.filter(o => o.status === 'completed').length
    const pendingOrders = mockOrders.filter(o => o.status === 'pending').length
    const totalSpent = mockOrders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.totalAmount, 0)

    setStats({
      totalOrders,
      completedOrders,
      pendingOrders,
      totalSpent
    })
  }, [user, isAuthenticated, isLoading, router])

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
              <Link href="/" className="text-2xl font-bold text-gradient-primary">
                توب ماركتنج
              </Link>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="flex items-center">
                <User className="w-5 h-5 text-gray-400 ml-2" />
                <span className="text-gray-700">{user?.name}</span>
              </div>
              <Link
                href="/services-shop"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                تصفح الخدمات
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            مرحباً، {user?.name}
          </h1>
          <p className="text-gray-600">
            إليك ملخص حسابك وطلباتك الحالية
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">إجمالي الطلبات</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">طلبات مكتملة</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedOrders}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">طلبات معلقة</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">إجمالي المبلغ</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSpent} جنيه</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">طلباتي الأخيرة</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.serviceName}
                        </div>
                        <div className="text-sm text-gray-500">
                          الكمية: {order.quantity}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.totalAmount} جنيه
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {getPaymentStatusText(order.paymentStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.createdAt.toLocaleDateString('ar-EG')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2 space-x-reverse">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        {order.status === 'completed' && (
                          <button className="text-green-600 hover:text-green-900">
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Link
            href="/services-shop"
            className="bg-blue-600 text-white p-6 rounded-xl hover:bg-blue-700 transition-colors text-center"
          >
            <ShoppingCart className="w-8 h-8 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">طلب خدمة جديدة</h3>
            <p className="text-blue-100">تصفح خدماتنا واطلب ما تحتاجه</p>
          </Link>

          <a
            href={`https://wa.me/201068275557?text=مرحباً، أحتاج مساعدة في طلبي`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white p-6 rounded-xl hover:bg-green-700 transition-colors text-center"
          >
            <Phone className="w-8 h-8 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">تواصل معنا</h3>
            <p className="text-green-100">احصل على دعم فوري عبر واتساب</p>
          </a>

          <Link
            href="/dashboard/profile"
            className="bg-purple-600 text-white p-6 rounded-xl hover:bg-purple-700 transition-colors text-center"
          >
            <User className="w-8 h-8 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">إدارة الحساب</h3>
            <p className="text-purple-100">تحديث بياناتك الشخصية</p>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
