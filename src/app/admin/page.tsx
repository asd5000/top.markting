'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ShoppingCart,
  Package,
  Building,
  Settings,
  Users,
  FileText,
  BarChart3,
  Receipt,
  Image,
  Globe
} from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [adminData, setAdminData] = useState<any>(null)

  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = () => {
    try {
      console.log('🔍 فحص جلسة المدير...')

      // التحقق من جلسة المدير
      const adminSession = localStorage.getItem('admin') || localStorage.getItem('adminSession')
      if (!adminSession) {
        console.log('❌ لا توجد جلسة مدير')
        router.push('/admin/login')
        return
      }

      const admin = JSON.parse(adminSession)
      console.log('👤 بيانات المدير:', admin)

      if (!admin || !admin.name || !admin.role) {
        console.log('❌ بيانات المدير غير صحيحة')
        router.push('/admin/login')
        return
      }

      console.log('✅ جلسة المدير صحيحة')
      setAdminData(admin)
      setLoading(false)
    } catch (error) {
      console.error('❌ خطأ في فحص جلسة المدير:', error)
      router.push('/admin/login')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحقق من صلاحيات الوصول...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg shadow-sm p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">مرحباً {adminData?.name || 'المدير'}</h1>
        <p className="opacity-90">لوحة التحكم الإدارية - إدارة شاملة لجميع خدمات الموقع</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="mr-3">
              <p className="text-sm text-gray-600">العملاء</p>
              <p className="text-xl font-bold text-gray-900">150+</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
            <div className="mr-3">
              <p className="text-sm text-gray-600">الطلبات</p>
              <p className="text-xl font-bold text-gray-900">45</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <div className="mr-3">
              <p className="text-sm text-gray-600">الباقات</p>
              <p className="text-xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Building className="w-6 h-6 text-orange-600" />
            </div>
            <div className="mr-3">
              <p className="text-sm text-gray-600">العقارات</p>
              <p className="text-xl font-bold text-gray-900">28</p>
            </div>
          </div>
        </div>
      </div>

      {/* Management Sections */}
      {/* Emergency Link for New Real Estate System */}
      <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
            <Building className="w-6 h-6 text-white" />
          </div>
          <div className="mr-3 flex-1">
            <h3 className="text-lg font-bold text-green-900">🆕 النظام العقاري الجديد متاح الآن!</h3>
            <p className="text-green-700">نظام محدث بقائمة جانبية وإحصائيات متقدمة</p>
          </div>
          <a
            href="/real-estate-new"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <Building className="w-5 h-5 ml-2" />
            جرب النظام الجديد
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <a href="/admin/services" className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <Settings className="w-8 h-8 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 mr-3">إدارة الخدمات</h3>
          </div>
          <p className="text-gray-600 text-sm">إدارة الخدمات الأساسية والفرعية</p>
        </a>

        <a href="/admin/packages" className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <Package className="w-8 h-8 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900 mr-3">إدارة الباقات</h3>
          </div>
          <p className="text-gray-600 text-sm">إدارة باقات الاشتراكات والأسعار</p>
        </a>

        <a href="/admin/real-estate" className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <Building className="w-8 h-8 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900 mr-3">التسويق العقاري</h3>
          </div>
          <p className="text-gray-600 text-sm">إدارة العقارات والعملاء</p>
        </a>

        <a href="/admin/store" className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <Package className="w-8 h-8 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900 mr-3">إدارة المتجر</h3>
          </div>
          <p className="text-gray-600 text-sm">إدارة المنتجات والمخزون</p>
        </a>

        <a href="/admin/orders" className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <ShoppingCart className="w-8 h-8 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900 mr-3">إدارة الطلبات</h3>
          </div>
          <p className="text-gray-600 text-sm">متابعة وإدارة طلبات العملاء</p>
        </a>

        <a href="/admin/receipts" className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <Receipt className="w-8 h-8 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900 mr-3">إدارة الإيصالات</h3>
          </div>
          <p className="text-gray-600 text-sm">مراجعة وإدارة إيصالات الدفع</p>
        </a>

        <a href="/admin/portfolio" className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <Image className="w-8 h-8 text-pink-600" />
            <h3 className="text-lg font-semibold text-gray-900 mr-3">معرض الأعمال</h3>
          </div>
          <p className="text-gray-600 text-sm">إدارة معرض الأعمال والمشاريع</p>
        </a>

        <a href="/admin/site-settings" className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <Globe className="w-8 h-8 text-cyan-600" />
            <h3 className="text-lg font-semibold text-gray-900 mr-3">إعدادات الموقع</h3>
          </div>
          <p className="text-gray-600 text-sm">إدارة إعدادات الموقع العامة</p>
        </a>

        <a href="/admin/manage-admins" className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <Users className="w-8 h-8 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900 mr-3">إدارة المدراء</h3>
          </div>
          <p className="text-gray-600 text-sm">إدارة حسابات المدراء والصلاحيات</p>
        </a>

        <a href="/admin/dashboard" className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <BarChart3 className="w-8 h-8 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900 mr-3">التقارير والإحصائيات</h3>
          </div>
          <p className="text-gray-600 text-sm">عرض التقارير والإحصائيات التفصيلية</p>
        </a>
      </div>
    </div>
  )
}
