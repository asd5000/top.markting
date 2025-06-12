'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getDefaultRoute, getRoleName } from '@/lib/permissions'
import bcrypt from 'bcryptjs'
import {
  Shield,
  User,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle
} from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('🔐 محاولة تسجيل دخول:', {
        username: formData.username,
        password: formData.password ? '***' : 'empty'
      })

      // تحديد البريد الإلكتروني بناءً على اسم المستخدم
      let emailToSearch = formData.username

      // إذا كان اسم المستخدم مختصر، نحوله للبريد الإلكتروني الكامل
      const userMappings: { [key: string]: string } = {
        'admin': 'admin@topmarketing.com',
        'test': 'admin@topmarketing.com',
        'marketing': 'marketing@topmarketing.com',
        'packages': 'packages@topmarketing.com',
        'realestate': 'realestate@topmarketing.com',
        'support': 'support@topmarketing.com'
      }

      if (userMappings[formData.username.toLowerCase()]) {
        emailToSearch = userMappings[formData.username.toLowerCase()]
      }

      console.log('🔍 Searching for email:', emailToSearch)

      // البحث عن المشرف في جدول users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', emailToSearch)
        .eq('is_active', true)
        .single()

      console.log('👤 User search result:', { data: userData, error: userError })

      // التحقق من وجود المستخدم وأنه مشرف
      if (!userData || !['super_admin', 'marketing_manager', 'packages_manager', 'real_estate_manager', 'support'].includes(userData.role)) {
        setError(`المستخدم غير موجود أو ليس لديه صلاحيات إدارية. جرب: admin, marketing, packages, realestate, support`)
        return
      }

      console.log('✅ Admin found:', userData.name, '- Role:', userData.role)

      // التحقق من كلمة المرور (كلمات مرور بسيطة للاختبار)
      const validPasswords = ['admin123', 'admin', '123456', '123', 'password', 'test']

      if (!validPasswords.includes(formData.password)) {
        setError(`كلمة المرور غير صحيحة. جرب: ${validPasswords.join(', ')}`)
        return
      }

      console.log('✅ Password verified successfully')

      // إنشاء جلسة المشرف
      const adminSession = {
        id: userData.id,
        username: userData.email,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        phone: userData.phone,
        permissions: { all: userData.role === 'super_admin' },
        loginTime: new Date().toISOString(),
        source: 'users'
      }
      
      localStorage.setItem('admin', JSON.stringify(adminSession))
      localStorage.setItem('adminSession', JSON.stringify(adminSession))

      console.log('✅ Admin session saved:', adminSession)
      console.log('📋 localStorage admin:', localStorage.getItem('admin'))

      // تحديث آخر تسجيل دخول
      await supabase
        .from('users')
        .update({
          updated_at: new Date().toISOString()
        })
        .eq('id', userData.id)

      // توجيه المستخدم حسب دوره
      const defaultRoute = getDefaultRoute(userData.role)
      console.log('🚀 Redirecting to default route for role:', userData.role, '→', defaultRoute)
      router.push(defaultRoute)
      
    } catch (err) {
      console.error('Login error:', err)
      setError('حدث خطأ أثناء تسجيل الدخول')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center" dir="rtl">
      <div className="max-w-md w-full mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">لوحة التحكم الإدارية</h1>
          <p className="text-blue-200">تسجيل دخول المشرفين</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">تسجيل الدخول</h2>
            <p className="text-gray-600">أدخل بيانات المشرف للوصول للوحة التحكم</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 ml-2" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم المستخدم
              </label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أدخل اسم المستخدم"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pr-10 pl-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أدخل كلمة المرور"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogIn className="w-5 h-5 ml-2" />
                  تسجيل الدخول
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-blue-900 mb-3">🔑 بيانات تسجيل الدخول المتاحة:</h4>
            <div className="text-sm text-blue-700 space-y-2">
              <div className="bg-white p-3 rounded border">
                <p><strong>👤 اسم المستخدم:</strong> admin</p>
                <p><strong>🔒 كلمة المرور:</strong> admin123</p>
                <p className="text-xs text-blue-600">مدير النظام الرئيسي</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <p><strong>👤 اسم المستخدم:</strong> test</p>
                <p><strong>🔒 كلمة المرور:</strong> 123456</p>
                <p className="text-xs text-blue-600">مدير تجريبي</p>
              </div>
              <div className="text-xs text-blue-600 mt-2">
                💡 يمكن أيضاً استخدام كلمة المرور: <code>admin</code>
              </div>
              <div className="mt-3 flex space-x-2">
                <button
                  onClick={() => {
                    setFormData({ username: 'admin', password: 'admin123' })
                  }}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                >
                  ملء تلقائي - admin
                </button>
                <button
                  onClick={() => {
                    setFormData({ username: 'test', password: '123456' })
                  }}
                  className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
                >
                  ملء تلقائي - test
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-blue-200 text-sm">
            © 2024 Top Marketing - جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </div>
  )
}
