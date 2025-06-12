'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff,
  UserPlus,
  Check
} from 'lucide-react'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registrationComplete, setRegistrationComplete] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert('كلمات المرور غير متطابقة')
      return
    }

    if (!formData.agreeToTerms) {
      alert('يجب الموافقة على الشروط والأحكام')
      return
    }

    setIsSubmitting(true)

    // محاكاة إنشاء الحساب
    setTimeout(() => {
      console.log('تم إنشاء الحساب:', formData)
      setIsSubmitting(false)
      setRegistrationComplete(true)
    }, 2000)
  }

  if (registrationComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">تم إنشاء حسابك بنجاح!</h2>
          <p className="text-gray-600 mb-6">
            مرحباً بك في Top Marketing! يمكنك الآن تسجيل الدخول والاستفادة من خدماتنا.
          </p>
          <div className="space-y-3">
            <Link href="/login" className="btn btn-primary w-full">
              تسجيل الدخول
            </Link>
            <Link href="/" className="btn border border-gray-300 w-full">
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">TM</span>
              </div>
              <span className="mr-3 text-xl font-bold text-gray-900">Top Marketing</span>
            </Link>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600">الرئيسية</Link>
              <Link href="/services" className="text-gray-700 hover:text-blue-600">الخدمات</Link>
              <Link href="/packages" className="text-gray-700 hover:text-blue-600">إدارة الصفحات</Link>
              <Link href="/real-estate" className="text-gray-700 hover:text-blue-600">العقارات</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <UserPlus className="mx-auto h-12 w-12 text-blue-600" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">إنشاء حساب جديد</h2>
            <p className="mt-2 text-sm text-gray-600">
              أو{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                سجل دخولك إذا كان لديك حساب
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="form-label">الاسم الكامل *</label>
                <div className="relative">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input pr-10"
                    placeholder="أدخل اسمك الكامل"
                  />
                  <User className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="form-label">البريد الإلكتروني *</label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input pr-10"
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                  <Mail className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="form-label">رقم الهاتف *</label>
                <div className="relative">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input pr-10"
                    placeholder="أدخل رقم هاتفك"
                  />
                  <Phone className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="form-label">كلمة المرور *</label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="form-input pr-10 pl-10"
                    placeholder="أدخل كلمة المرور"
                  />
                  <Lock className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="form-label">تأكيد كلمة المرور *</label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="form-input pr-10 pl-10"
                    placeholder="أعد إدخال كلمة المرور"
                  />
                  <Lock className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="agreeToTerms" className="mr-2 block text-sm text-gray-900">
                  أوافق على{' '}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                    الشروط والأحكام
                  </Link>
                  {' '}و{' '}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                    سياسة الخصوصية
                  </Link>
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full py-3 text-lg disabled:opacity-50"
              >
                {isSubmitting ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                لديك حساب بالفعل؟{' '}
                <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  سجل دخولك هنا
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
