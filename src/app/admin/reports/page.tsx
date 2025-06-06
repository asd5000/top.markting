'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Package, 
  Calendar,
  Download,
  Filter,
  Eye
} from 'lucide-react'
import { useAuth, usePermissions } from '@/lib/auth/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { orderOperations, userOperations } from '@/lib/supabase/client'
import { toast } from 'react-hot-toast'

interface ReportData {
  totalRevenue: number
  monthlyRevenue: number
  totalOrders: number
  completedOrders: number
  totalCustomers: number
  activeCustomers: number
  averageOrderValue: number
  topServices: Array<{
    name: string
    orders: number
    revenue: number
  }>
  monthlyStats: Array<{
    month: string
    revenue: number
    orders: number
  }>
}

export default function AdminReportsPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { isAdmin } = usePermissions()
  const router = useRouter()
  const [reportData, setReportData] = useState<ReportData>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalOrders: 0,
    completedOrders: 0,
    totalCustomers: 0,
    activeCustomers: 0,
    averageOrderValue: 0,
    topServices: [],
    monthlyStats: []
  })
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin())) {
      router.push('/auth/login')
      return
    }
  }, [user, isAuthenticated, isLoading, isAdmin, router])

  useEffect(() => {
    if (isAuthenticated && isAdmin()) {
      loadReportData()
    }
  }, [isAuthenticated, isAdmin, selectedPeriod])

  const loadReportData = async () => {
    try {
      setIsLoadingData(true)

      // Mock data for demonstration
      const mockReportData: ReportData = {
        totalRevenue: 45600,
        monthlyRevenue: 12800,
        totalOrders: 156,
        completedOrders: 98,
        totalCustomers: 89,
        activeCustomers: 67,
        averageOrderValue: 292,
        topServices: [
          { name: 'تصميم لوجو', orders: 45, revenue: 22500 },
          { name: 'إدارة سوشيال ميديا', orders: 23, revenue: 34500 },
          { name: 'تصميم موقع إلكتروني', orders: 12, revenue: 36000 },
          { name: 'مونتاج فيديو', orders: 18, revenue: 14400 },
          { name: 'متابعين إنستجرام', orders: 32, revenue: 12800 }
        ],
        monthlyStats: [
          { month: 'يناير', revenue: 12800, orders: 45 },
          { month: 'ديسمبر', revenue: 11400, orders: 38 },
          { month: 'نوفمبر', revenue: 9800, orders: 32 },
          { month: 'أكتوبر', revenue: 11600, orders: 41 }
        ]
      }

      setReportData(mockReportData)
    } catch (error) {
      console.error('Error loading report data:', error)
      toast.error('خطأ في تحميل بيانات التقارير')
    } finally {
      setIsLoadingData(false)
    }
  }

  const exportReport = () => {
    const csvData = [
      ['التقرير المالي - توب ماركتنج'],
      [''],
      ['الإحصائيات العامة'],
      ['إجمالي الإيرادات', reportData.totalRevenue],
      ['إيرادات الشهر', reportData.monthlyRevenue],
      ['إجمالي الطلبات', reportData.totalOrders],
      ['الطلبات المكتملة', reportData.completedOrders],
      ['العملاء النشطين', reportData.activeCustomers],
      ['متوسط قيمة الطلب', reportData.averageOrderValue],
      [''],
      ['أفضل الخدمات'],
      ['الخدمة', 'عدد الطلبات', 'الإيرادات'],
      ...reportData.topServices.map(service => [service.name, service.orders, service.revenue]),
      [''],
      ['الإحصائيات الشهرية'],
      ['الشهر', 'عدد الطلبات', 'الإيرادات'],
      ...reportData.monthlyStats.map(stat => [stat.month, stat.orders, stat.revenue])
    ]

    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `تقرير_مالي_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success('تم تصدير التقرير بنجاح')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (isLoading || isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل التقارير...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">التقارير المالية</h1>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="week">هذا الأسبوع</option>
                <option value="month">هذا الشهر</option>
                <option value="quarter">هذا الربع</option>
                <option value="year">هذا العام</option>
              </select>
              <button
                onClick={exportReport}
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
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(reportData.totalRevenue)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500 ml-1" />
              <span className="text-sm text-green-500">+12.5% من الشهر الماضي</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إيرادات هذا الشهر</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(reportData.monthlyRevenue)}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-blue-500 ml-1" />
              <span className="text-sm text-blue-500">+8.2% من الشهر الماضي</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الطلبات</p>
                <p className="text-2xl font-bold text-purple-600">{reportData.totalOrders}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-500">مكتمل: {reportData.completedOrders}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">العملاء النشطين</p>
                <p className="text-2xl font-bold text-orange-600">{reportData.activeCustomers}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-500">من أصل {reportData.totalCustomers} عميل</span>
            </div>
          </motion.div>
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">أفضل الخدمات</h3>
            <div className="space-y-4">
              {reportData.topServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{service.name}</h4>
                    <p className="text-sm text-gray-500">{service.orders} طلب</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{formatCurrency(service.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Monthly Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">الإحصائيات الشهرية</h3>
            <div className="space-y-4">
              {reportData.monthlyStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-4 border-b border-gray-100">
                  <div>
                    <h4 className="font-medium text-gray-900">{stat.month}</h4>
                    <p className="text-sm text-gray-500">{stat.orders} طلب</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">{formatCurrency(stat.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Additional Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6 mt-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">مؤشرات إضافية</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{formatCurrency(reportData.averageOrderValue)}</p>
              <p className="text-sm text-gray-600">متوسط قيمة الطلب</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {reportData.totalOrders > 0 ? Math.round((reportData.completedOrders / reportData.totalOrders) * 100) : 0}%
              </p>
              <p className="text-sm text-gray-600">معدل إتمام الطلبات</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {reportData.totalCustomers > 0 ? Math.round((reportData.activeCustomers / reportData.totalCustomers) * 100) : 0}%
              </p>
              <p className="text-sm text-gray-600">معدل العملاء النشطين</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
