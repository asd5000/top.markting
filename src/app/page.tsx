'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import DynamicFooter from '@/components/DynamicFooter'
import AnnouncementBanner from '@/components/AnnouncementBanner'
import { ArrowLeft, Star, Users, Award, CheckCircle, User, LogOut, ShoppingCart, Package, Home, Settings, Briefcase, Image, Building, Phone } from 'lucide-react'

interface Service {
  id: string
  name: string
  description: string
  short_description: string
  icon: string
  image_url: string
  icon_url: string
  custom_color: string
  sort_order: number
  is_featured: boolean
  status: 'active' | 'inactive' | 'draft'
  is_active: boolean
  created_at: string
  updated_at: string
}

// ألوان افتراضية للخدمات
const defaultColors = [
  'from-blue-500 to-blue-600',
  'from-purple-500 to-purple-600',
  'from-green-500 to-green-600',
  'from-orange-500 to-orange-600',
  'from-red-500 to-red-600',
  'from-indigo-500 to-indigo-600',
  'from-pink-500 to-pink-600',
  'from-yellow-500 to-yellow-600',
  'from-teal-500 to-teal-600',
  'from-cyan-500 to-cyan-600'
]

// أيقونات افتراضية للخدمات
const defaultIcons = ['📱', '🎨', '⚙️', '🎯', '🏠', '📄', '🎬', '✂️', '🔧', '💼']

// دالة لتحويل اللون من hex إلى gradient
const hexToGradient = (color: string, index: number) => {
  if (color && color !== '#3B82F6') {
    // إذا كان لون مخصص، لا نستخدم class بل style
    return ''
  }
  // استخدم لون افتراضي
  return defaultColors[index % defaultColors.length]
}

export default function HomePage() {
  const [visitor, setVisitor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [services, setServices] = useState<Service[]>([])
  const [servicesLoading, setServicesLoading] = useState(true)
  const [cartItems, setCartItems] = useState<any[]>([])


  useEffect(() => {
    checkVisitorAuth()
    loadServices()
    loadCartItems()
  }, [])

  const loadCartItems = () => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error('Error loading cart:', error)
    }
  }

  const loadServices = async () => {
    try {
      setServicesLoading(true)
      console.log('🔄 Loading services from database...')

      const { data: servicesData, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .eq('status', 'active')
        .order('sort_order', { ascending: true })

      if (error) {
        console.error('❌ Error loading services:', error)
        setServices([])
      } else {
        console.log('✅ Services loaded successfully:', servicesData)
        setServices(servicesData || [])
      }
    } catch (error) {
      console.error('❌ Error loading services:', error)
      setServices([])
    } finally {
      setServicesLoading(false)
    }
  }





  const checkVisitorAuth = async () => {
    try {
      // التحقق من Supabase Auth
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Error getting session:', error)
        return
      }

      if (session?.user) {
        // جلب بيانات المستخدم من قاعدة البيانات
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .eq('is_active', true)
          .single()

        if (userData && !userError) {
          setVisitor(userData)
        } else {
          console.log('User not found in database or inactive')
        }
      }
    } catch (error) {
      console.error('Error checking visitor auth:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      // تسجيل الخروج من Supabase Auth
      await supabase.auth.signOut()

      // مسح البيانات المحلية
      localStorage.removeItem('cart')
      setVisitor(null)

      // إعادة تحميل الصفحة لضمان المسح الكامل
      window.location.reload()
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }


  const stats = [
    { number: '500+', label: 'عميل راضي' },
    { number: '1000+', label: 'مشروع مكتمل' },
    { number: '50+', label: 'خدمة متخصصة' },
    { number: '24/7', label: 'دعم فني' }
  ]

  const features = [
    {
      icon: '⚡',
      title: 'سرعة في التنفيذ',
      description: 'نلتزم بالمواعيد المحددة ونسلم المشاريع في الوقت المناسب'
    },
    {
      icon: '🎯',
      title: 'جودة عالية',
      description: 'نضمن أعلى معايير الجودة في جميع خدماتنا'
    },
    {
      icon: '💰',
      title: 'أسعار تنافسية',
      description: 'أسعار مناسبة لجميع الميزانيات مع ضمان الجودة'
    },
    {
      icon: '🔧',
      title: 'دعم مستمر',
      description: 'دعم فني متواصل حتى بعد تسليم المشروع'
    }
  ]

  return (
    <div className="min-h-screen bg-white" dir="rtl">


      {/* شريط التنقل العلوي */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* الشعار */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">TM</span>
              </div>
              <div className="mr-3">
                <h1 className="text-xl font-bold text-gray-900">Top Marketing</h1>
                <p className="text-xs text-gray-600">نظام إداري متكامل</p>
              </div>
            </div>

            {/* قائمة التنقل */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                🏠 الرئيسية
              </Link>
              <Link href="/services" className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                ⚙️ الخدمات
              </Link>
              <Link href="/packages" className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                📦 الباقات
              </Link>
              <Link href="/store" className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                🛒 المتجر
              </Link>
              <Link href="/portfolio" className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                🎨 معرض الأعمال
              </Link>
              <Link href="/add-property" className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                🏠 إضافة عقار
              </Link>
              <Link href="/cart" className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors relative">
                🛒 السلة
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            </div>

            {/* أزرار تسجيل الدخول */}
            <div className="flex items-center space-x-4">
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              ) : visitor ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">مرحباً، {visitor.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-800 font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    تسجيل الخروج
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/customer-login"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    تسجيل الدخول
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* المحتوى الرئيسي */}
      <div className="w-full">
        {/* Announcement Banner */}
        <AnnouncementBanner />

        {/* Moving Banner */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 text-white py-2 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap">
            <span className="text-sm font-medium mx-4">
              🌟 صلِّ على محمد ﷺ 🌟 صلِّ على محمد ﷺ 🌟 صلِّ على محمد ﷺ 🌟 صلِّ على محمد ﷺ 🌟 صلِّ على محمد ﷺ 🌟
            </span>
          </div>
        </div>



      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              نظام إداري متكامل لخدمات التسويق
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              منصة شاملة لإدارة خدمات التصميم والتسويق والمونتاج وصفحات السوشيال ميديا مع نظام إدارة العقارات
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link
                href="/services"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center"
              >
                استكشف خدماتنا
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Link>
              <Link
                href="/packages"
                className="border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors"
              >
                الباقات الشهرية
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">خدماتنا المتخصصة</h2>
            <p className="text-xl text-gray-600">نقدم مجموعة شاملة من الخدمات المتخصصة لتلبية احتياجاتك</p>
          </div>

          {/* Services Grid - Dynamic from Database */}
          {servicesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-gray-200 animate-pulse rounded-xl p-6 h-48">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded mb-3"></div>
                    <div className="h-3 bg-gray-300 rounded mb-6"></div>
                    <div className="h-8 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">لا توجد خدمات متاحة</h3>
              <p className="text-gray-600">سيتم إضافة خدمات قريباً</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => {
                const gradientColor = hexToGradient(service.custom_color, index)
                const serviceIcon = service.icon_url || defaultIcons[index % defaultIcons.length]

                // تحديد الخلفية - إما لون مخصص أو لون افتراضي
                const backgroundStyle = service.custom_color && service.custom_color !== '#3B82F6'
                  ? { background: `linear-gradient(135deg, ${service.custom_color}, ${service.custom_color}dd)` }
                  : {}

                return (
                  <div
                    key={service.id}
                    className={`${gradientColor || 'bg-gradient-to-br from-blue-500 to-blue-600'} text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}
                    style={backgroundStyle}
                  >
                    <div className="text-center">
                      {service.image_url ? (
                        <img
                          src={service.image_url}
                          alt={service.name}
                          className="w-12 h-12 mx-auto mb-4 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="text-4xl mb-4">{serviceIcon}</div>
                      )}
                      <h3 className="text-xl font-bold mb-3">{service.name}</h3>
                      <p className="text-white text-opacity-90 text-sm mb-6">
                        {service.short_description || service.description}
                      </p>
                      <Link
                        href={`/services/${service.id}`}
                        className="inline-block bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
                      >
                        اطلب الآن
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Additional Services Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {/* Real Estate */}
            <Link
              href="/add-property"
              className="group bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-xl shadow-lg p-6 hover:shadow-xl hover:from-green-600 hover:to-teal-700 transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">🏠</div>
                <h3 className="text-xl font-bold mb-3">التسويق العقاري</h3>
                <p className="text-green-100 text-sm mb-4">أضف عقارك مجاناً واحصل على عملاء</p>
                <div className="inline-block bg-white bg-opacity-20 px-4 py-2 rounded-lg text-sm font-medium">
                  أضف عقارك الآن
                </div>
              </div>
            </Link>

            {/* Portfolio */}
            <Link
              href="/portfolio"
              className="group bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-xl shadow-lg p-6 hover:shadow-xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-xl font-bold mb-3">معرض أعمالنا</h3>
                <p className="text-orange-100 text-sm mb-4">شاهد مشاريعنا المميزة والناجحة</p>
                <div className="inline-block bg-white bg-opacity-20 px-4 py-2 rounded-lg text-sm font-medium">
                  شاهد الأعمال
                </div>
              </div>
            </Link>

            {/* Packages Management */}
            <div className="group bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-xl shadow-lg p-6 hover:shadow-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-center">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-xl font-bold mb-3">إدارة الصفحات</h3>
                <p className="text-purple-100 text-sm mb-4">باقات إدارة احترافية لصفحاتك</p>
                <Link
                  href="/packages"
                  className="inline-block bg-white bg-opacity-20 px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-30 transition-colors"
                >
                  اطلب الآن
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Preview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">أعمالنا المميزة</h2>
            <p className="text-xl text-gray-600">مجموعة مختارة من أفضل مشاريعنا وإنجازاتنا</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Portfolio Preview Cards */}
            <div className="group relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="relative p-8 text-white">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-xl font-bold mb-2">تصميم هوية بصرية</h3>
                <p className="text-blue-100 mb-4">أكثر من 50 هوية بصرية مميزة</p>
                <div className="flex items-center text-sm">
                  <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full">تصميم جرافيك</span>
                </div>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-green-500 to-teal-600 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="relative p-8 text-white">
                <div className="text-4xl mb-4">🎬</div>
                <h3 className="text-xl font-bold mb-2">فيديوهات إعلانية</h3>
                <p className="text-green-100 mb-4">مئات الفيديوهات الاحترافية</p>
                <div className="flex items-center text-sm">
                  <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full">موشن جرافيك</span>
                </div>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-orange-500 to-red-600 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="relative p-8 text-white">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-xl font-bold mb-2">حملات سوشيال ميديا</h3>
                <p className="text-orange-100 mb-4">حملات ناجحة لعشرات العملاء</p>
                <div className="flex items-center text-sm">
                  <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full">سوشيال ميديا</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/portfolio"
              className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              عرض جميع الأعمال
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">لماذا تختارنا؟</h2>
            <p className="text-xl text-gray-600">نتميز بالجودة والاحترافية في جميع خدماتنا</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">جاهز لبدء مشروعك؟</h2>
          <p className="text-xl mb-8">تواصل معنا اليوم واحصل على استشارة مجانية</p>
          <div className="flex items-center justify-center space-x-4">
            <Link
              href="/services"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              ابدأ مشروعك
            </Link>
            <Link
              href="/packages"
              className="border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors"
            >
              اشترك في باقة
            </Link>
          </div>
        </div>
      </section>

        {/* Footer */}
        <DynamicFooter />
      </div>
    </div>
  )
}
// Force rebuild
