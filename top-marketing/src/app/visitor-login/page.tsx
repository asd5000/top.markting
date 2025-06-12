'use client'

import { useState } from 'react'
import { Eye, EyeOff, Lock, Mail, ArrowLeft, User, UserPlus } from 'lucide-react'
import Link from 'next/link'

export default function VisitorLoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // محاكاة تسجيل الدخول أو التسجيل
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (formData.email && formData.password) {
        // حفظ بيانات الزائر
        const userData = {
          email: formData.email,
          name: formData.name || 'زائر',
          role: 'visitor',
          phone: formData.phone
        }
        
        localStorage.setItem('visitor', JSON.stringify(userData))
        setSuccess(true)
        
        // توجيه للصفحة الرئيسية بعد 2 ثانية
        setTimeout(() => {
          window.location.href = '/'
        }, 2000)
      } else {
        setError('يرجى إدخال جميع البيانات المطلوبة')
      }
    } catch (err) {
      setError('حدث خطأ أثناء العملية')
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

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center py-12 px-4" dir="rtl">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              مرحباً بك! 🎉
            </h2>
            <p className="text-gray-600 mb-6">
              تم {isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب'} بنجاح. سيتم توجيهك للصفحة الرئيسية...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12 px-4" dir="rtl">
      {/* Moving Banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white py-2 overflow-hidden mb-8">
        <div className="animate-marquee whitespace-nowrap">
          <span className="text-sm font-medium mx-4">
            🌟 صلِّ على محمد ﷺ 🌟 صلِّ على محمد ﷺ 🌟 صلِّ على محمد ﷺ 🌟 صلِّ على محمد ﷺ 🌟 صلِّ على محمد ﷺ 🌟
          </span>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            {isLogin ? <User className="w-8 h-8 text-white" /> : <UserPlus className="w-8 h-8 text-white" />}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'تسجيل دخول الزائر' : 'إنشاء حساب جديد'}
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'ادخل بياناتك للوصول إلى حسابك' : 'أنشئ حساباً جديداً للاستفادة من خدماتنا'}
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="bg-white rounded-xl p-2 mb-6 flex">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              isLogin 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              !isLogin 
                ? 'bg-green-600 text-white' 
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            حساب جديد
          </button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field (for registration only) */}
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الكامل *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required={!isLogin}
                    value={formData.name}
                    onChange={handleChange}
                    className="appearance-none relative block w-full pr-10 pl-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني *
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
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pr-10 pl-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أدخل بريدك الإلكتروني"
                />
              </div>
            </div>

            {/* Phone Field (for registration only) */}
            {!isLogin && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="01xxxxxxxxx"
                />
              </div>
            )}

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور *
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
                  value={formData.password}
                  onChange={handleChange}
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

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                  isLogin 
                    ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' 
                    : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                    {isLogin ? 'جاري تسجيل الدخول...' : 'جاري إنشاء الحساب...'}
                  </div>
                ) : (
                  isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب'
                )}
              </button>
            </div>

            {/* Additional Info */}
            <div className="text-center text-sm text-gray-600">
              {isLogin ? (
                <p>
                  ليس لديك حساب؟{' '}
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className="font-medium text-green-600 hover:text-green-500"
                  >
                    إنشاء حساب جديد
                  </button>
                </p>
              ) : (
                <p>
                  لديك حساب بالفعل؟{' '}
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    تسجيل الدخول
                  </button>
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
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
