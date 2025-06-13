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
    e.stopPropagation()
    setLoading(true)
    setError('')

    try {
      console.log('🔐 محاولة تسجيل دخول:', {
        username: formData.username,
        password: formData.password ? '***' : 'empty'
      })

      // التحقق من البيانات المدخلة أولاً
      if (!formData.username || !formData.password) {
        setError('يرجى إدخال اسم المستخدم وكلمة المرور')
        return
      }

      // التحقق السريع من البيانات المعروفة
      const knownCredentials = [
        { username: 'asdasheref@gmail.com', password: '0453328124', name: 'أشرف الشريف', role: 'super_admin' },
        { username: 'admin@topmarketing.com', password: 'admin123', name: 'أحمد محمد', role: 'super_admin' },
        { username: 'admin@topmarketing.com', password: 'admin', name: 'أحمد محمد', role: 'super_admin' },
        { username: 'admin', password: 'admin123', name: 'أحمد محمد', role: 'super_admin' },
        { username: 'admin', password: 'admin', name: 'أحمد محمد', role: 'super_admin' },
        { username: 'test', password: '123456', name: 'مدير تجريبي', role: 'super_admin' },
        { username: 'test', password: '123', name: 'مدير تجريبي', role: 'super_admin' }
      ]

      const matchedCredential = knownCredentials.find(cred =>
        (cred.username === formData.username || cred.username === formData.username.toLowerCase()) &&
        cred.password === formData.password
      )

      if (matchedCredential) {
        console.log('✅ تسجيل دخول سريع نجح:', matchedCredential.name)
        console.log('📝 البيانات المدخلة:', { username: formData.username, password: formData.password })
        console.log('📝 البيانات المطابقة:', matchedCredential)

        // إنشاء جلسة المشرف
        const adminSession = {
          id: 'quick-login-' + Date.now(),
          username: matchedCredential.username,
          email: matchedCredential.username,
          name: matchedCredential.name,
          role: matchedCredential.role,
          phone: '01068275557',
          permissions: { all: true },
          loginTime: new Date().toISOString(),
          source: 'quick-login'
        }

        localStorage.setItem('admin', JSON.stringify(adminSession))
        localStorage.setItem('adminSession', JSON.stringify(adminSession))

        console.log('✅ جلسة المدير محفوظة')

        // إعادة التوجيه مباشرة للوحة التحكم مع تأخير قصير
        console.log('🔄 إعادة التوجيه للوحة التحكم...')

        // تأخير قصير لضمان حفظ البيانات ثم الانتقال
        setTimeout(() => {
          window.location.href = '/admin'
        }, 500)

        return
      }

      // إذا لم تتطابق البيانات
      console.log('❌ بيانات تسجيل الدخول غير صحيحة')
      setError('بيانات تسجيل الدخول غير صحيحة. استخدم البيانات المعروضة أدناه.')
      
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
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <p><strong>👤 اسم المستخدم:</strong> asdasheref@gmail.com</p>
                <p><strong>🔒 كلمة المرور:</strong> 0453328124</p>
                <p className="text-xs text-green-600">المدير الرئيسي - أشرف الشريف</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <p><strong>👤 اسم المستخدم:</strong> admin</p>
                <p><strong>🔒 كلمة المرور:</strong> admin123</p>
                <p className="text-xs text-blue-600">مدير النظام</p>
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
                    setFormData({ username: 'asdasheref@gmail.com', password: '0453328124' })
                  }}
                  className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
                >
                  ملء تلقائي - المدير الرئيسي
                </button>
                <button
                  onClick={() => {
                    setFormData({ username: 'admin', password: 'admin123' })
                  }}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                >
                  ملء تلقائي - admin
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
