'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { hasRouteAccess, getDefaultRoute, getRoleName } from '@/lib/permissions'
import { AlertCircle, Shield, ArrowLeft } from 'lucide-react'

interface RouteGuardProps {
  children: React.ReactNode
  requiredPermission?: string
}

export default function RouteGuard({ children, requiredPermission }: RouteGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const [adminData, setAdminData] = useState<any>(null)

  useEffect(() => {
    const checkAccess = () => {
      console.log('🔐 RouteGuard: Checking access for:', pathname)
      
      // الحصول على بيانات المشرف
      const adminDataStr = localStorage.getItem('admin')
      if (!adminDataStr) {
        console.log('❌ No admin data found, redirecting to login')
        router.push('/admin/login')
        return
      }

      try {
        const admin = JSON.parse(adminDataStr)
        setAdminData(admin)
        
        console.log('👤 Admin data:', {
          name: admin.name,
          role: admin.role,
          email: admin.email
        })

        // فحص صلاحية الوصول للمسار الحالي
        const hasAccess = hasRouteAccess(admin.role, pathname)
        
        console.log('🔍 Access check result:', {
          userRole: admin.role,
          currentPath: pathname,
          hasAccess: hasAccess
        })

        if (!hasAccess) {
          console.log('❌ Access denied, redirecting to default route')
          const defaultRoute = getDefaultRoute(admin.role)
          console.log('🔄 Redirecting to:', defaultRoute)
          router.push(defaultRoute)
          return
        }

        console.log('✅ Access granted')
        setIsAuthorized(true)

      } catch (error) {
        console.error('❌ Error parsing admin data:', error)
        localStorage.removeItem('admin')
        localStorage.removeItem('adminSession')
        router.push('/admin/login')
      }
    }

    checkAccess()
  }, [pathname, router])

  // حالة التحميل
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    )
  }

  // حالة عدم وجود صلاحية
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              ممنوع الوصول
            </h1>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 ml-2" />
                <span className="text-red-700 text-sm">
                  ليس لديك صلاحية للوصول إلى هذه الصفحة
                </span>
              </div>
            </div>

            {adminData && (
              <div className="text-sm text-gray-600 mb-6">
                <p><strong>المستخدم:</strong> {adminData.name}</p>
                <p><strong>الدور:</strong> {getRoleName(adminData.role)}</p>
                <p><strong>المسار المطلوب:</strong> {pathname}</p>
              </div>
            )}

            <button
              onClick={() => {
                const defaultRoute = adminData ? getDefaultRoute(adminData.role) : '/admin'
                router.push(defaultRoute)
              }}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 ml-2" />
              العودة إلى لوحة التحكم
            </button>
          </div>
        </div>
      </div>
    )
  }

  // عرض المحتوى إذا كانت الصلاحيات صحيحة
  return <>{children}</>
}
