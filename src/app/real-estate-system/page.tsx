'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Building, 
  Home, 
  ArrowLeft, 
  Users, 
  BarChart3, 
  TrendingUp, 
  CheckCircle,
  Target,
  Settings,
  LogOut
} from 'lucide-react'

export default function RealEstateSystemPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    try {
      const adminData = localStorage.getItem('admin')
      const adminSession = localStorage.getItem('adminSession')
      
      if (adminData || adminSession) {
        const adminInfo = JSON.parse(adminData || adminSession || '{}')
        setAdmin(adminInfo)
      } else {
        router.push('/admin/login')
        return
      }
    } catch (error) {
      console.error('Error checking auth:', error)
      router.push('/admin/login')
      return
    }
    
    setLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('admin')
    localStorage.removeItem('adminSession')
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحقق من جلسة المدير...</p>
        </div>
      </div>
    )
  }

  if (!admin) {
    return null
  }

  const quickLinks = [
    {
      title: 'إدارة العقارات',
      description: 'عرض وإدارة جميع العقارات',
      href: '/admin/real-estate',
      icon: Building,
      color: 'bg-blue-600'
    },
    {
      title: 'العقارات جاري البيع',
      description: 'العقارات في مرحلة البيع النشط',
      href: '/admin/selling-now',
      icon: TrendingUp,
      color: 'bg-orange-600'
    },
    {
      title: 'العقارات المباعة',
      description: 'أرشيف العقارات المباعة',
      href: '/admin/sold',
      icon: CheckCircle,
      color: 'bg-green-600'
    },
    {
      title: 'المطابقة الذكية',
      description: 'ربط البائعين والمشترين',
      href: '/admin/matching',
      icon: Target,
      color: 'bg-purple-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div className="mr-3">
                <h1 className="text-xl font-bold text-gray-900">برنامج التسويق العقاري</h1>
                <p className="text-sm text-gray-600">نظام إدارة العقارات المتكامل</p>
              </div>
            </div>

            {/* User Info and Actions */}
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="text-gray-600 hover:text-blue-600 flex items-center text-sm"
              >
                <ArrowLeft className="w-4 h-4 ml-1" />
                العودة للوحة التحكم
              </Link>
              
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div className="mr-3">
                  <p className="text-sm font-medium text-gray-900">{admin.name}</p>
                  <p className="text-xs text-gray-600">مدير عقارات</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 flex items-center text-sm"
              >
                <LogOut className="w-4 h-4 ml-1" />
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-sm p-8 text-white mb-8">
          <div className="flex items-center">
            <Building className="w-12 h-12 ml-4" />
            <div>
              <h2 className="text-3xl font-bold mb-2">مرحباً بك في برنامج التسويق العقاري</h2>
              <p className="text-blue-100 text-lg">
                نظام متكامل لإدارة العقارات مع ميزات ذكية للمطابقة والتتبع
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-2xl font-bold text-gray-900">--</p>
                <p className="text-gray-600">إجمالي العقارات</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div className="mr-4">
                <p className="text-2xl font-bold text-gray-900">--</p>
                <p className="text-gray-600">جاري البيع</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="mr-4">
                <p className="text-2xl font-bold text-gray-900">--</p>
                <p className="text-gray-600">تم البيع</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div className="mr-4">
                <p className="text-2xl font-bold text-gray-900">--</p>
                <p className="text-gray-600">التطابقات</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 group"
            >
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 ${link.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <link.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{link.title}</h3>
              <p className="text-gray-600 text-sm">{link.description}</p>
              <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                <span>الدخول</span>
                <ArrowLeft className="w-4 h-4 mr-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-12 bg-white rounded-lg shadow p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">ميزات النظام</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">إدارة شاملة</h4>
              <p className="text-gray-600">إدارة كاملة للعقارات مع تتبع المراحل والحالات</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">مطابقة ذكية</h4>
              <p className="text-gray-600">نظام ذكي لمطابقة البائعين والمشترين تلقائياً</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">تقارير متقدمة</h4>
              <p className="text-gray-600">إحصائيات شاملة وتقارير مفصلة للأداء</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
