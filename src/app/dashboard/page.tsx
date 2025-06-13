'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  FileText, 
  Settings, 
  Database,
  BarChart3,
  ShoppingCart,
  Home,
  LogOut,
  User,
  Phone,
  Mail,
  Calendar,
  TrendingUp
} from 'lucide-react'

export default function DashboardPage() {
  const [admin, setAdmin] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // جلب بيانات المدير من localStorage
    const adminData = localStorage.getItem('admin') || localStorage.getItem('adminSession')
    if (adminData) {
      try {
        const parsedAdmin = JSON.parse(adminData)
        setAdmin(parsedAdmin)
        console.log('✅ تم تحميل بيانات المدير:', parsedAdmin)
      } catch (error) {
        console.error('❌ خطأ في قراءة بيانات المدير:', error)
        // إعادة توجيه لتسجيل الدخول
        window.location.href = '/admin/login'
      }
    } else {
      console.log('❌ لا توجد جلسة مدير، إعادة توجيه لتسجيل الدخول')
      window.location.href = '/admin/login'
    }
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('admin')
    localStorage.removeItem('adminSession')
    alert('تم تسجيل الخروج بنجاح')
    window.location.href = '/admin/login'
  }

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

  if (!admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">جاري إعادة التوجيه لتسجيل الدخول...</p>
        </div>
      </div>
    )
  }

  const dashboardCards = [
    {
      title: 'إدارة المستخدمين',
      description: 'عرض وإدارة حسابات المستخدمين',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      href: '/admin/users',
      count: '150+'
    },
    {
      title: 'إدارة الخدمات',
      description: 'إضافة وتعديل الخدمات المتاحة',
      icon: Package,
      color: 'from-green-500 to-green-600',
      href: '/admin/services',
      count: '25'
    },
    {
      title: 'إدارة الباقات',
      description: 'إدارة باقات إدارة الصفحات',
      icon: ShoppingCart,
      color: 'from-purple-500 to-purple-600',
      href: '/admin/packages',
      count: '8'
    },
    {
      title: 'الطلبات والاشتراكات',
      description: 'متابعة طلبات العملاء والاشتراكات',
      icon: FileText,
      color: 'from-orange-500 to-orange-600',
      href: '/admin/orders',
      count: '45'
    },
    {
      title: 'النسخ الاحتياطية',
      description: 'إدارة النسخ الاحتياطية للنظام',
      icon: Database,
      color: 'from-red-500 to-red-600',
      href: '/admin/backup',
      count: '12'
    },
    {
      title: 'إعدادات الموقع',
      description: 'تخصيص إعدادات الموقع العامة',
      icon: Settings,
      color: 'from-gray-500 to-gray-600',
      href: '/admin/site-settings',
      count: '∞'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div className="mr-3">
                <h1 className="text-xl font-bold text-gray-900">لوحة التحكم الإدارية</h1>
                <p className="text-sm text-gray-600">Top Marketing</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link
                href="/"
                className="text-gray-600 hover:text-blue-600 flex items-center text-sm"
              >
                <Home className="w-4 h-4 ml-1" />
                الموقع الرئيسي
              </Link>
              
              <div className="flex items-center bg-green-50 px-3 py-2 rounded-lg">
                <User className="w-4 h-4 text-green-600 ml-2" />
                <span className="text-sm font-medium text-green-700">
                  {admin.name}
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 flex items-center text-sm"
              >
                <LogOut className="w-4 h-4 ml-1" />
                تسجيل خروج
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">مرحباً بك، {admin.name}! 👋</h2>
              <p className="text-blue-100">الدور: {admin.role} | البريد: {admin.email}</p>
              <p className="text-blue-100 text-sm mt-1">آخر تسجيل دخول: {new Date(admin.loginTime).toLocaleString('ar-EG')}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{new Date().toLocaleDateString('ar-EG')}</div>
              <div className="text-blue-100">{new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي المستخدمين</p>
                <p className="text-2xl font-bold text-gray-900">150</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">الخدمات النشطة</p>
                <p className="text-2xl font-bold text-gray-900">25</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-purple-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">الطلبات الجديدة</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">الإيرادات الشهرية</p>
                <p className="text-2xl font-bold text-gray-900">45,000 ج.م</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardCards.map((card, index) => {
            const Icon = card.icon
            return (
              <div key={index} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-r ${card.color} rounded-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-gray-400">{card.count}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{card.description}</p>
                  
                  <button
                    onClick={() => {
                      // محاولة الوصول للصفحة، وإذا فشلت اعرض رسالة
                      try {
                        window.location.href = card.href
                      } catch (error) {
                        alert(`الصفحة ${card.title} غير متاحة حالياً بسبب مشكلة في النشر.\nيمكنك الوصول للخدمات من الصفحة الرئيسية.`)
                      }
                    }}
                    className={`w-full bg-gradient-to-r ${card.color} text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium`}
                  >
                    فتح القسم
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">إجراءات سريعة</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Home className="w-5 h-5 text-blue-600 ml-3" />
              <span className="text-blue-700 font-medium">عرض الموقع</span>
            </Link>
            
            <Link
              href="/packages"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Package className="w-5 h-5 text-green-600 ml-3" />
              <span className="text-green-700 font-medium">صفحة الباقات</span>
            </Link>
            
            <button
              onClick={() => window.location.reload()}
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <BarChart3 className="w-5 h-5 text-gray-600 ml-3" />
              <span className="text-gray-700 font-medium">تحديث البيانات</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
