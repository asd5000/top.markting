'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import {
  User, Home, Package, ShoppingCart, FileText, 
  LogOut, Settings, Bell, Star, Calendar,
  ArrowLeft, CheckCircle, Clock, AlertCircle
} from 'lucide-react'

interface VisitorData {
  id: string
  name: string
  email: string
  phone?: string
  created_at: string
}

export default function VisitorDashboard() {
  const router = useRouter()
  const [visitor, setVisitor] = useState<VisitorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0
  })

  useEffect(() => {
    checkVisitorAuth()
  }, [])

  const checkVisitorAuth = async () => {
    try {
      console.log('🔍 Checking visitor authentication...')

      // التحقق من جلسة Supabase
      const { data: { session } } = await supabase.auth.getSession()

      console.log('📋 Session status:', session ? 'Found' : 'Not found')
      console.log('📋 Session details:', session)

      if (!session) {
        console.log('❌ No session found, redirecting to login')
        setLoading(false)
        window.location.href = '/customer-login'
        return
      }

      // جلب بيانات المستخدم
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (error || !userData) {
        // إذا لم يوجد المستخدم في جدول users، إنشاء سجل جديد
        console.log('User not found in users table, creating new record...')

        const { error: insertError } = await supabase
          .from('users')
          .insert([
            {
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'عميل جديد',
              phone: session.user.user_metadata?.phone || '',
              role: 'customer',
              is_active: true,
              created_at: new Date().toISOString()
            }
          ])

        if (insertError) {
          console.error('❌ Error creating user record:', insertError)
          setLoading(false)
          window.location.href = '/customer-login'
          return
        }

        // إعادة جلب بيانات المستخدم بعد الإنشاء
        const { data: newUserData, error: newUserError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (newUserError || !newUserData) {
          console.error('❌ Error fetching new user data:', newUserError)
          setLoading(false)
          window.location.href = '/customer-login'
          return
        }

        console.log('✅ New user data loaded successfully')
        setVisitor(newUserData)
        await loadUserOrders(newUserData.id)
        setLoading(false)
        return
      }

      // التحقق من أن المستخدم عميل وليس مدير
      const adminRoles = ['super_admin', 'marketing_manager', 'support', 'content_manager', 'real_estate_manager', 'packages_manager']
      if (adminRoles.includes(userData.role)) {
        console.log('🔒 Admin user detected, redirecting to admin panel')
        setLoading(false)
        window.location.href = '/admin'
        return
      }

      console.log('✅ Customer user verified, loading dashboard')
      setVisitor(userData)
      await loadUserOrders(userData.id)
      setLoading(false)
    } catch (error) {
      console.error('❌ Auth check error:', error)
      setLoading(false)
      window.location.href = '/customer-login'
    }
  }

  const loadUserOrders = async (userId: string) => {
    try {
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading orders:', error)
        return
      }

      setOrders(ordersData || [])
      
      // حساب الإحصائيات
      const total = ordersData?.length || 0
      const pending = ordersData?.filter(order => order.status === 'pending').length || 0
      const completed = ordersData?.filter(order => order.status === 'completed').length || 0

      setStats({
        totalOrders: total,
        pendingOrders: pending,
        completedOrders: completed
      })
    } catch (error) {
      console.error('Error loading orders:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">TM</span>
              </div>
              <div className="mr-3">
                <h1 className="text-xl font-bold text-gray-900">Top Marketing</h1>
                <p className="text-xs text-gray-600">لوحة تحكم العميل</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">مرحباً، {visitor?.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center text-red-600 hover:text-red-800 font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4 ml-1" />
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-sm p-6 text-white mb-8">
            <h1 className="text-2xl font-bold mb-2">مرحباً بك {visitor?.name}</h1>
            <p className="opacity-90">إدارة طلباتك وخدماتك من مكان واحد</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ShoppingCart className="w-8 h-8 text-blue-600" />
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-500">إجمالي الطلبات</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-500">قيد المعالجة</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.pendingOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-500">مكتملة</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.completedOrders}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link
              href="/services"
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-center">
                <Package className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">طلب خدمة جديدة</h3>
                <p className="text-sm text-gray-600">استكشف خدماتنا واطلب ما تحتاجه</p>
              </div>
            </Link>

            <Link
              href="/packages"
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-center">
                <Star className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">الباقات الشهرية</h3>
                <p className="text-sm text-gray-600">اشترك في باقة إدارة شاملة</p>
              </div>
            </Link>

            <Link
              href="/add-property"
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-center">
                <Home className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">إضافة عقار</h3>
                <p className="text-sm text-gray-600">أضف عقارك للتسويق مجاناً</p>
              </div>
            </Link>

            <Link
              href="/portfolio"
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-center">
                <FileText className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">معرض الأعمال</h3>
                <p className="text-sm text-gray-600">شاهد أعمالنا السابقة</p>
              </div>
            </Link>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">طلباتك الأخيرة</h3>
            </div>
            <div className="p-6">
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد طلبات بعد</h3>
                  <p className="text-gray-600 mb-4">ابدأ بطلب خدمة جديدة</p>
                  <Link
                    href="/services"
                    className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    استكشف الخدمات
                    <ArrowLeft className="w-4 h-4 mr-2" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {order.status === 'completed' ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : order.status === 'pending' ? (
                            <Clock className="w-5 h-5 text-yellow-600" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div className="mr-3">
                          <p className="text-sm font-medium text-gray-900">{order.service_name || 'خدمة'}</p>
                          <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString('ar-EG')}</p>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">{order.total_amount} جنيه</p>
                        <p className={`text-sm ${
                          order.status === 'completed' ? 'text-green-600' :
                          order.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {order.status === 'completed' ? 'مكتمل' :
                           order.status === 'pending' ? 'قيد المعالجة' : 'ملغي'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4 ml-1" />
              العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
