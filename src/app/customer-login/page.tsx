'use client'

import { useState } from 'react'
import { Eye, EyeOff, Lock, Mail, ArrowLeft, User, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function CustomerLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!email || !password) {
      setError('يرجى ملء جميع الحقول')
      return
    }

    try {
      setLoading(true)

      // تسجيل الدخول باستخدام Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) {
        console.error('Auth error:', authError)
        if (authError.message.includes('Invalid login credentials')) {
          setError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
        } else {
          setError(`خطأ في تسجيل الدخول: ${authError.message}`)
        }
        return
      }

      if (authData.user) {
        console.log('✅ Auth successful, user ID:', authData.user.id)

        // التحقق من أن المستخدم عميل وليس مدير
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single()

        console.log('🔍 User data query result:', { userData, userError })

        if (userError || !userData) {
          console.log('👤 User not found in users table, creating new record...')

          // إذا لم يوجد في جدول users، إنشاء سجل جديد للعميل
          const newUserData = {
            id: authData.user.id,
            email: authData.user.email,
            name: authData.user.user_metadata?.name || authData.user.email?.split('@')[0] || 'عميل جديد',
            phone: authData.user.user_metadata?.phone || '',
            role: 'customer',
            is_active: true,
            created_at: new Date().toISOString()
          }

          console.log('📝 Creating user with data:', newUserData)

          const { error: insertError } = await supabase
            .from('users')
            .insert([newUserData])

          if (insertError) {
            console.error('❌ Error creating user record:', insertError)
            // لا نعرض خطأ للمستخدم هنا لأن تسجيل الدخول تم بنجاح
          } else {
            console.log('✅ User record created successfully')
          }
        } else {
          // التحقق من أن المستخدم ليس مدير
          const adminRoles = ['super_admin', 'marketing_manager', 'support', 'content_manager', 'real_estate_manager', 'packages_manager']
          if (adminRoles.includes(userData.role)) {
            await supabase.auth.signOut()
            setError('هذا الحساب مخصص للإدارة. يرجى استخدام صفحة تسجيل دخول المدراء')
            return
          }

          // التحقق من أن الحساب نشط
          if (!userData.is_active) {
            await supabase.auth.signOut()
            setError('حسابك غير نشط. يرجى التواصل مع الإدارة')
            return
          }
        }

        setSuccess('تم تسجيل الدخول بنجاح! جاري التوجيه...')

        // توجيه للصفحة الرئيسية
        setTimeout(() => {
          console.log('🚀 Redirecting to home page...')
          window.location.href = '/'
        }, 1000)
      }

    } catch (err) {
      console.error('Login error:', err)
      setError('حدث خطأ أثناء تسجيل الدخول')
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            تسجيل دخول العملاء
          </h2>
          <p className="text-gray-600">
            ادخل بياناتك للوصول إلى حسابك كعميل
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none relative block w-full pr-10 pl-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full pr-10 pl-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل كلمة المرور"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 left-0 pl-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 ml-2" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 ml-2" />
                <span className="text-green-700 text-sm">{success}</span>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                    جاري تسجيل الدخول...
                  </div>
                ) : (
                  'تسجيل الدخول'
                )}
              </button>
            </div>

            {/* Register Link */}
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                ليس لديك حساب؟{' '}
                <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                  إنشاء حساب جديد
                </Link>
              </p>

              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 block"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>
          </form>
        </div>



        {/* Back to Home */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 ml-1" />
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}
