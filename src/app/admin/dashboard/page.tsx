'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Bell,
  Settings,
  LogOut,
  BarChart3,
  Shield,
  Cog,
  Home
} from 'lucide-react'
import { useAuth, usePermissions } from '@/lib/auth/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardStats, Order, Notification } from '@/lib/auth/auth-types'

// Mock data for admin dashboard
const mockStats: DashboardStats = {
  totalCustomers: 156,
  totalOrders: 342,
  totalRevenue: 125000,
  pendingOrders: 23,
  completedOrders: 298,
  activeServices: 28,
  newCustomersThisMonth: 34,
  revenueThisMonth: 45000,
  topServices: [
    { serviceId: 'logo-design', serviceName: 'تصميم لوجو', orderCount: 45, revenue: 22500 },
    { serviceId: 'social-media-design', serviceName: 'تصميم سوشيال ميديا', orderCount: 38, revenue: 7600 },
    { serviceId: 'video-editing', serviceName: 'مونتاج فيديو', orderCount: 25, revenue: 20000 },
    { serviceId: 'website-design', serviceName: 'تصميم موقع', orderCount: 15, revenue: 30000 }
  ],
  recentOrders: [
    {
      id: '1',
      customerId: '2',
      serviceId: 'logo-design',
      serviceName: 'تصميم لوجو',
      quantity: 1,
      price: 500,
      totalAmount: 500,
      status: 'pending',
      paymentStatus: 'paid',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      customerId: '3',
      serviceId: 'video-editing',
      serviceName: 'مونتاج فيديو',
      quantity: 1,
      price: 800,
      totalAmount: 800,
      status: 'in_progress',
      paymentStatus: 'paid',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  monthlyRevenue: [
    { month: 'يناير', revenue: 35000, orders: 45 },
    { month: 'فبراير', revenue: 42000, orders: 52 },
    { month: 'مارس', revenue: 38000, orders: 48 },
    { month: 'أبريل', revenue: 45000, orders: 58 }
  ]
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'new_order',
    title: 'طلب جديد',
    message: 'تم استلام طلب جديد لتصميم لوجو',
    isRead: false,
    createdAt: new Date(),
    priority: 'high'
  },
  {
    id: '2',
    type: 'payment_received',
    title: 'دفعة جديدة',
    message: 'تم استلام دفعة بقيمة 800 جنيه',
    isRead: false,
    createdAt: new Date(),
    priority: 'medium'
  },
  {
    id: '3',
    type: 'new_customer',
    title: 'عميل جديد',
    message: 'انضم عميل جديد للمنصة',
    isRead: true,
    createdAt: new Date(),
    priority: 'low'
  }
]

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const { isAdmin } = usePermissions()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>(mockStats)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [showNotifications, setShowNotifications] = useState(false)


  const quickActions = [
    {
      title: 'إدارة الطلبات',
      description: 'عرض ومتابعة جميع الطلبات',
      icon: Package,
      href: '/admin/orders',
      color: 'bg-blue-500',
      count: stats.totalOrders
    },
    {
      title: 'إدارة العملاء',
      description: 'إدارة بيانات العملاء',
      icon: Users,
      href: '/admin/customers',
      color: 'bg-green-500',
      count: stats.totalCustomers
    },
    {
      title: 'إدارة الخدمات',
      description: 'تحديث وإضافة خدمات جديدة',
      icon: Settings,
      href: '/admin/services',
      color: 'bg-purple-500',
      count: stats.topServices?.length || 0
    },
    {
      title: 'التقارير المالية',
      description: 'عرض التقارير والإحصائيات',
      icon: BarChart3,
      href: '/admin/reports',
      color: 'bg-orange-500'
    },

    {
      title: 'إعدادات النظام',
      description: 'إعدادات عامة للموقع',
      icon: Cog,
      href: '/admin/settings',
      color: 'bg-gray-500'
    },
    {
      title: 'عملاء التسويق العقاري',
      description: 'عرض عملاء خدمة التسويق العقاري',
      icon: Home,
      href: '/admin/real-estate-data',
      color: 'bg-orange-500'
    },
    {
      title: 'إدارة الاشتراكات',
      description: 'إدارة اشتراكات باقات إدارة الصفحات',
      icon: Package,
      href: '/admin/subscriptions',
      color: 'bg-purple-500'
    },
    {
      title: 'إدارة المديرين',
      description: 'إدارة المديرين والصلاحيات',
      icon: Shield,
      href: '/admin/admins',
      color: 'bg-red-500'
    },

  ]

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin())) {
      router.push('/auth/login')
      return
    }
  }, [user, isAuthenticated, isLoading, isAdmin, router])

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

  const unreadNotifications = notifications.filter(n => !n.isRead).length

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
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gradient-primary">
                لوحة تحكم المدير
              </h1>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Bell className="w-6 h-6" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -left-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold">التنبيهات</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b hover:bg-gray-50 ${
                            !notification.isRead ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{notification.title}</h4>
                              <p className="text-sm text-gray-600">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notification.createdAt.toLocaleString('ar-EG')}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <span className="text-gray-700">{user?.name}</span>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0)}
                  </span>
                </div>
              </div>

              <button
                onClick={logout}
                className="text-gray-600 hover:text-red-600 transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut className="w-5 h-5" />
              </button>
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
            إليك ملخص شامل لأداء المنصة اليوم
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
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">إجمالي العملاء</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                <p className="text-xs text-green-600">+{stats.newCustomersThisMonth} هذا الشهر</p>
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
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">إجمالي الطلبات</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                <p className="text-xs text-yellow-600">{stats.pendingOrders} في الانتظار</p>
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
              <div className="bg-purple-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString()} جنيه</p>
                <p className="text-xs text-green-600">{stats.revenueThisMonth.toLocaleString()} هذا الشهر</p>
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
              <div className="bg-orange-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">الخدمات النشطة</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeServices}</p>
                <p className="text-xs text-blue-600">{stats.completedOrders} مكتملة</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">الطلبات الأخيرة</h2>
              <Link
                href="/admin/orders"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                عرض الكل
              </Link>
            </div>
            
            <div className="divide-y divide-gray-200">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{order.serviceName}</h3>
                      <p className="text-sm text-gray-600">طلب #{order.id}</p>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">
                        {order.totalAmount} جنيه
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">أفضل الخدمات</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {stats.topServices.map((service, index) => (
                  <div key={service.serviceId} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="mr-3">
                        <h3 className="font-medium text-gray-900">{service.serviceName}</h3>
                        <p className="text-sm text-gray-600">{service.orderCount} طلب</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">
                        {service.revenue.toLocaleString()} جنيه
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>


        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
            >
              <Link
                href={action.href}
                className={`${action.color} text-white p-6 rounded-xl hover:opacity-90 transition-all transform hover:scale-105 block relative overflow-hidden`}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <action.icon className="w-8 h-8" />
                    {action.count && (
                      <span className="bg-white bg-opacity-20 text-white px-2 py-1 rounded-full text-sm font-semibold">
                        {action.count}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                  <p className="text-white text-opacity-90 text-sm">{action.description}</p>
                </div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white from-0% to-transparent to-50% opacity-10" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
