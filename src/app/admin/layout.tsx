'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { canViewMenuItem, getRoleName } from '@/lib/permissions'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  FileText,
  CreditCard,
  Building,
  Image,
  Database,
  Phone
} from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [admin, setAdmin] = useState<any>(null)

  useEffect(() => {
    // تجاهل التحقق إذا كانت صفحة تسجيل الدخول
    if (pathname === '/admin/login') {
      return
    }

    console.log('🔍 فحص جلسة المدير في Layout...')

    // التحقق من تسجيل الدخول
    const adminData = localStorage.getItem('admin') || localStorage.getItem('adminSession')
    if (!adminData) {
      console.log('❌ لا توجد جلسة مدير في Layout')
      router.push('/admin/login')
      return
    }

    try {
      const parsedAdmin = JSON.parse(adminData)
      console.log('👤 بيانات المدير في Layout:', parsedAdmin)

      if (!parsedAdmin || !parsedAdmin.name || !parsedAdmin.role) {
        console.log('❌ بيانات المدير غير صحيحة في Layout')
        router.push('/admin/login')
        return
      }

      console.log('✅ جلسة المدير صحيحة في Layout')
      setAdmin(parsedAdmin)
    } catch (error) {
      console.error('❌ خطأ في تحليل بيانات المدير:', error)
      router.push('/admin/login')
    }
  }, [router, pathname])

  const handleLogout = () => {
    localStorage.removeItem('admin')
    router.push('/admin/login')
  }

  // إنشاء قائمة التنقل بناءً على صلاحيات المدير
  const allNavigationItems = [
    {
      name: 'لوحة التحكم',
      href: '/admin',
      icon: LayoutDashboard,
      current: pathname === '/admin',
      menuItem: 'dashboard',
      alwaysShow: true // الصفحة الرئيسية متاحة للجميع
    },
    {
      name: 'إدارة الخدمات',
      href: '/admin/services',
      icon: Package,
      current: pathname === '/admin/services',
      menuItem: 'services'
    },
    {
      name: 'إدارة الطلبات',
      href: '/admin/orders',
      icon: ShoppingCart,
      current: pathname === '/admin/orders',
      menuItem: 'orders'
    },
    {
      name: 'إدارة الباقات',
      href: '/admin/packages',
      icon: CreditCard,
      current: pathname === '/admin/packages',
      menuItem: 'packages'
    },
    {
      name: 'سابقات الأعمال',
      href: '/admin/portfolio',
      icon: Image,
      current: pathname === '/admin/portfolio',
      menuItem: 'portfolio'
    },
    {
      name: 'برنامج التسويق العقاري',
      href: '/real-estate-system',
      icon: Building,
      current: pathname === '/real-estate-system',
      menuItem: 'real-estate',
      external: true
    },
    {
      name: 'الإيصالات',
      href: '/admin/receipts',
      icon: FileText,
      current: pathname === '/admin/receipts',
      menuItem: 'receipts'
    },
    {
      name: 'إدارة المديرين',
      href: '/admin/manage-admins',
      icon: Users,
      current: pathname === '/admin/manage-admins',
      menuItem: 'manage-admins'
    },
    {
      name: 'النسخ الاحتياطية',
      href: '/admin/backup-system',
      icon: Database,
      current: pathname === '/admin/backup-system',
      menuItem: 'backup-system'
    },
    {
      name: 'إعدادات الموقع',
      href: '/admin/site-settings',
      icon: Settings,
      current: pathname === '/admin/site-settings',
      menuItem: 'site-settings'
    },
    {
      name: 'معلومات الاتصال',
      href: '/admin/contact-info',
      icon: Phone,
      current: pathname === '/admin/contact-info',
      menuItem: 'contact-info'
    }
  ]

  // تصفية القائمة بناءً على صلاحيات المدير
  const navigation = allNavigationItems.filter(item => {
    if (item.alwaysShow) return true
    if (!admin?.role) return false
    return canViewMenuItem(admin.role, item.menuItem)
  })

  // إذا كانت صفحة تسجيل الدخول، عرض المحتوى مباشرة
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // إذا لم يكن هناك مدير مسجل دخول، إعادة توجيه لصفحة تسجيل الدخول
  if (!admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحقق من جلسة المدير...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 right-0 flex w-full max-w-xs flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <h2 className="text-lg font-semibold text-gray-900">لوحة التحكم</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const Icon = item.icon
              return item.external ? (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    item.current
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="ml-3 h-5 w-5" />
                  {item.name}
                  <span className="mr-auto text-xs text-gray-400">↗</span>
                </a>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    item.current
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="ml-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:right-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-slate-800 px-6 pb-4 border-l border-slate-700">
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TM</span>
              </div>
              <span className="mr-3 text-xl font-bold text-slate-100">Top Marketing</span>
            </div>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    return (
                      <li key={item.name}>
                        {item.external ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                              item.current
                                ? 'bg-slate-700 text-slate-100'
                                : 'text-slate-300 hover:text-slate-100 hover:bg-slate-700'
                            }`}
                          >
                            <Icon className="h-5 w-5 shrink-0" />
                            {item.name}
                            <span className="mr-auto text-xs text-slate-400">↗</span>
                          </a>
                        ) : (
                          <Link
                            href={item.href}
                            className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                              item.current
                                ? 'bg-slate-700 text-slate-100'
                                : 'text-slate-300 hover:text-slate-100 hover:bg-slate-700'
                            }`}
                          >
                            <Icon className="h-5 w-5 shrink-0" />
                            {item.name}
                          </Link>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </li>
              <li className="mt-auto">
                <div className="border-t border-slate-700 pt-4">
                  <div className="flex items-center px-2 py-2 text-sm text-slate-300">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="mr-3">
                      <p className="font-medium">{admin.name}</p>
                      <p className="text-xs text-slate-400">{getRoleName(admin.role)}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="group flex w-full items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOut className="h-5 w-5 shrink-0" />
                    تسجيل الخروج
                  </button>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pr-72">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <Link
                href="/"
                className="text-gray-600 hover:text-blue-600 flex items-center text-sm"
              >
                <Home className="w-4 h-4 ml-1" />
                الموقع الرئيسي
              </Link>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6 mr-auto">
              <div className="text-sm text-gray-600">
                مرحباً، {admin.name}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
