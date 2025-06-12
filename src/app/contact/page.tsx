'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Send, CheckCircle, AlertCircle } from 'lucide-react'
import ContactSection from '@/components/ContactSection'
import DynamicFooter from '@/components/DynamicFooter'
import AnnouncementBanner from '@/components/AnnouncementBanner'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      // محاكاة إرسال النموذج
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSubmitStatus({
        type: 'success',
        message: 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.'
      })
      
      // إعادة تعيين النموذج
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Announcement Banner */}
      <AnnouncementBanner />

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TM</span>
                </div>
                <span className="mr-3 text-xl font-bold text-gray-900">Top Marketing</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4 space-x-reverse">
              <Link
                href="/"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                الرئيسية
              </Link>
              <Link
                href="/services"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                الخدمات
              </Link>
              <Link
                href="/packages"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                الباقات
              </Link>
              <Link
                href="/contact"
                className="text-blue-600 bg-blue-50 px-3 py-2 rounded-md text-sm font-medium"
              >
                تواصل معنا
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">تواصل معنا</h1>
          <p className="text-xl text-blue-100 mb-6">
            نحن هنا لمساعدتك في تحقيق أهدافك التسويقية
          </p>
          <nav className="flex justify-center" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 space-x-reverse">
              <li>
                <Link href="/" className="text-blue-200 hover:text-white transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <ArrowRight className="w-4 h-4 text-blue-300" />
              </li>
              <li>
                <span className="text-white">تواصل معنا</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <ContactSection 
              variant="default"
              showTitle={false}
              className="mb-8"
            />
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">أرسل لنا رسالة</h2>
            
            {/* Status Message */}
            {submitStatus.type && (
              <div className={`mb-6 p-4 rounded-lg flex items-center ${
                submitStatus.type === 'success' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                {submitStatus.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 ml-2" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 ml-2" />
                )}
                <span className={submitStatus.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                  {submitStatus.message}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="01xxxxxxxxx"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  موضوع الرسالة *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">اختر موضوع الرسالة</option>
                  <option value="services">استفسار عن الخدمات</option>
                  <option value="packages">استفسار عن الباقات</option>
                  <option value="pricing">استفسار عن الأسعار</option>
                  <option value="support">دعم فني</option>
                  <option value="partnership">شراكة تجارية</option>
                  <option value="other">أخرى</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  الرسالة *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="اكتب رسالتك هنا..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 ml-2" />
                    إرسال الرسالة
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Additional Contact Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <ContactSection 
            variant="card"
            title="الدعم الفني"
            className="text-center"
          />
          <ContactSection 
            variant="card"
            title="المبيعات"
            className="text-center"
          />
          <ContactSection 
            variant="card"
            title="الشراكات"
            className="text-center"
          />
        </div>
      </div>

      {/* Footer */}
      <DynamicFooter />
    </div>
  )
}
