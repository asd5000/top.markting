'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Users,
  Building2,
  Package,
  DollarSign,
  TrendingUp,
  Calendar,
  Bell,
  Settings,
  BarChart3,
  PieChart,
  Activity,
  Eye,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react'
import Header from '@/components/admin/Header'
import Sidebar from '@/components/admin/Sidebar'

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const user = {
    name: 'أحمد محمد',
    email: 'admin@topmarketing.com',
    role: 'مدير عام',
    avatar: '/api/placeholder/40/40'
  }

  // محاكاة تحميل البيانات
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const stats = [
    {
      title: 'إجمالي العملاء',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-blue-500',
      trend: [65, 78, 82, 95, 88, 92, 98]
    },
    {
      title: 'العقارات المدرجة',
      value: '856',
      change: '+8%',
      changeType: 'positive',
      icon: Building2,
      color: 'bg-green-500',
      trend: [45, 52, 48, 61, 69, 74, 78]
    },
    {
      title: 'الاشتراكات النشطة',
      value: '342',
      change: '+15%',
      changeType: 'positive',
      icon: Package,
      color: 'bg-purple-500',
      trend: [25, 28, 32, 35, 38, 42, 45]
    },
    {
      title: 'الإيرادات الشهرية',
      value: '125,000 ج.م',
      change: '+22%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-orange-500',
      trend: [85, 92, 88, 95, 102, 108, 115]
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'new_property',
      title: 'طلب عقار جديد',
      description: 'شقة 120 متر في المعادي',
      time: 'منذ 5 دقائق',
      icon: Building2,
      color: 'bg-blue-500',
      status: 'pending'
    },
    {
      id: 2,
      type: 'new_subscription',
      title: 'اشتراك جديد',
      description: 'باقة متوسطة - أحمد علي',
      time: 'منذ 15 دقيقة',
      icon: Package,
      color: 'bg-green-500',
      status: 'completed'
    },
    {
      id: 3,
      type: 'expiring_subscription',
      title: 'انتهاء اشتراك قريب',
      description: 'باقة احترافية - فاطمة محمد',
      time: 'منذ ساعة',
      icon: Calendar,
      color: 'bg-orange-500',
      status: 'warning'
    },
    {
      id: 4,
      type: 'property_approved',
      title: 'تم الموافقة على عقار',
      description: 'فيلا 300 متر في التجمع الخامس',
      time: 'منذ ساعتين',
      icon: CheckCircle,
      color: 'bg-green-500',
      status: 'completed'
    }
  ]

  const quickStats = [
    { label: 'طلبات اليوم', value: '23', color: 'text-blue-600' },
    { label: 'عقارات معلقة', value: '8', color: 'text-orange-600' },
    { label: 'اشتراكات تنتهي هذا الأسبوع', value: '5', color: 'text-red-600' },
    { label: 'عملاء جدد', value: '12', color: 'text-green-600' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 lg:mr-64">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 sm:px-0">
              {/* Welcome Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">مرحباً، {user.name}</h1>
                    <p className="text-gray-600 mt-2">إليك نظرة عامة على أداء النظام اليوم</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">آخر تحديث</p>
                      <p className="text-sm font-medium text-gray-900">{new Date().toLocaleString('ar-EG')}</p>
                    </div>
                    <button className="btn btn-primary flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      إضافة جديد
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {quickStats.map((stat, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="card hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className={`flex items-center text-sm ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.changeType === 'positive' ? (
                          <ArrowUpRight className="w-4 h-4 ml-1" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 ml-1" />
                        )}
                        {stat.change}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">من الشهر الماضي</p>
                        <div className="flex items-center space-x-1">
                          {stat.trend.map((point, i) => (
                            <div
                              key={i}
                              className="w-1 bg-gray-300 rounded-full"
                              style={{ height: `${point / 5}px` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Quick Actions */}
                <div className="lg:col-span-2">
                  <div className="card">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-gray-900">الإجراءات السريعة</h3>
                      <Link href="/admin/settings" className="text-blue-600 hover:text-blue-800 text-sm">
                        إعدادات أخرى
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Link href="/admin/real-estate" className="group flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-all">
                        <Building2 className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium text-gray-900 text-center">إدارة العقارات</span>
                        <span className="text-xs text-gray-500 mt-1">856 عقار</span>
                      </Link>
                      <Link href="/admin/clients" className="group flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 transition-all">
                        <Users className="w-8 h-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium text-gray-900 text-center">إدارة العملاء</span>
                        <span className="text-xs text-gray-500 mt-1">1,234 عميل</span>
                      </Link>
                      <Link href="/admin/packages" className="group flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-200 transition-all">
                        <Package className="w-8 h-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium text-gray-900 text-center">إدارة الباقات</span>
                        <span className="text-xs text-gray-500 mt-1">342 اشتراك</span>
                      </Link>
                      <Link href="/admin/reports" className="group flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-200 transition-all">
                        <BarChart3 className="w-8 h-8 text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium text-gray-900 text-center">التقارير</span>
                        <span className="text-xs text-gray-500 mt-1">تحليلات</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">النشاطات الحديثة</h3>
                    <Link href="/admin/activities" className="text-blue-600 hover:text-blue-800 text-sm">
                      عرض الكل
                    </Link>
                  </div>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className={`w-8 h-8 ${activity.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <activity.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="mr-3 flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                          <p className="text-xs text-gray-600 truncate">{activity.description}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-gray-500">{activity.time}</p>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                              activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {activity.status === 'completed' ? 'مكتمل' :
                               activity.status === 'pending' ? 'معلق' : 'تحذير'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                      <BarChart3 className="w-5 h-5 ml-2" />
                      الإيرادات الشهرية
                    </h3>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      عرض التفاصيل
                    </button>
                  </div>
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-dashed border-blue-200">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                      <p className="text-blue-600 font-medium">رسم بياني للإيرادات</p>
                      <p className="text-blue-500 text-sm">سيتم إضافة الرسوم البيانية قريباً</p>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                      <PieChart className="w-5 h-5 ml-2" />
                      توزيع العقارات
                    </h3>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      عرض التفاصيل
                    </button>
                  </div>
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-2 border-dashed border-green-200">
                    <div className="text-center">
                      <PieChart className="w-12 h-12 text-green-400 mx-auto mb-2" />
                      <p className="text-green-600 font-medium">رسم بياني دائري</p>
                      <p className="text-green-500 text-sm">سيتم إضافة الرسوم البيانية قريباً</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
