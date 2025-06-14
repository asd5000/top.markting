'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  User,
  Phone
} from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!formData.name || !formData.email || !formData.password) {
      setError('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('كلمة المرور وتأكيد كلمة المرور غير متطابقتين')
      return
    }

    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return
    }

    try {
      setLoading(true)

      // إنشاء حساب جديد باستخدام Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone
          }
        }
      })

      if (authError) {
        console.error('Auth error:', authError)
        if (authError.message.includes('already registered')) {
          setError('البريد الإلكتروني مسجل بالفعل')
        } else {
          setError(`حدث خطأ أثناء إنشاء الحساب: ${authError.message}`)
        }
        return
      }

      // إضافة بيانات المستخدم إلى جدول users
      if (authData.user) {
        const { error: insertError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email: authData.user.email,
              name: formData.name,
              phone: formData.phone,
              role: 'customer',
              is_active: true,
              created_at: new Date().toISOString()
            }
          ])

        if (insertError) {
          console.error('Error inserting user data:', insertError)
          // لا نعرض خطأ للمستخدم هنا لأن الحساب تم إنشاؤه بنجاح
        }
      }

      console.log('✅ User created successfully:', authData.user)

      // التحقق من حالة المستخدم
      if (authData.user && authData.session) {
        // المستخدم مسجل دخول تلقائياً
        setSuccess('تم إنشاء الحساب وتسجيل الدخول بنجاح! جاري التوجيه...')

        // التوجيه لصفحة لوحة تحكم الزائر
        setTimeout(() => {
          router.push('/visitor-dashboard')
        }, 2000)
      } else {
        // في حالة عدم تسجيل الدخول التلقائي
        setSuccess('تم إنشاء الحساب بنجاح! جاري تسجيل الدخول...')

        // محاولة تسجيل الدخول تلقائياً
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        })

        if (loginError) {
          console.error('Login error:', loginError)
          setSuccess('تم إنشاء الحساب بنجاح! يرجى تسجيل الدخول')
          setTimeout(() => {
            router.push('/customer-login')
          }, 2000)
        } else {
          setSuccess('تم إنشاء الحساب وتسجيل الدخول بنجاح! جاري التوجيه...')
          setTimeout(() => {
            router.push('/visitor-dashboard')
          }, 2000)
        }
      }

    } catch (error: any) {
      console.error('Register error:', error)
      setError(error.message || 'حدث خطأ أثناء إنشاء الحساب')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="w-5 h-5 ml-2" />
            العودة للصفحة الرئيسية
          </Link>
          
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">TM</span>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            إنشاء حساب جديد
          </h2>
          <p className="text-gray-600">
            أنشئ حسابك للاستمتاع بخدماتنا المميزة
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                الاسم الكامل *
              </label>
              <div className="relative">
                <User className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني *
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أدخل بريدك الإلكتروني"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                رقم الهاتف
              </label>
              <div className="relative">
                <Phone className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="01xxxxxxxxx"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور *
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pr-10 pl-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أدخل كلمة المرور (6 أحرف على الأقل)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                تأكيد كلمة المرور *
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pr-10 pl-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أعد إدخال كلمة المرور"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              'إنشاء الحساب'
            )}
          </button>

          {/* Links */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              لديك حساب بالفعل؟{' '}
              <Link href="/customer-login" className="text-blue-600 hover:text-blue-700 font-medium">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
