'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import DynamicFooter from '@/components/DynamicFooter'
import AnnouncementBanner from '@/components/AnnouncementBanner'
import { ArrowLeft, Star, Users, Award, CheckCircle, User, LogOut, ShoppingCart } from 'lucide-react'

interface Service {
  id: string
  name: string
  description: string
  short_description: string
  image_url: string
  icon_url: string
  custom_color: string
  sort_order: number
  is_featured: boolean
  status: string
  is_active: boolean
}

interface Service {
  id: string
  name: string
  description: string
  short_description: string
  image_url: string
  icon_url: string
  custom_color: string
  sort_order: number
  is_featured: boolean
  status: string
  is_active: boolean
}

export default function HomePage() {
  const [visitor, setVisitor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [services, setServices] = useState<Service[]>([])
  const [servicesLoading, setServicesLoading] = useState(true)

  useEffect(() => {
    checkVisitorAuth()
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      setServicesLoading(true)
      console.log('🔍 Loading services from database...')

      const { data: servicesData, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (error) {
        console.error('Error loading services:', error)
      } else {
        console.log('✅ Services loaded:', servicesData)
        setServices(servicesData || [])
      }
    } catch (error) {
      console.error('Error loading services:', error)
    } finally {
      setServicesLoading(false)
    }
  }

  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
  }

  // دالة لتحويل اسم الخدمة إلى slug إنجليزي
  const createEnglishSlug = (name: string) => {
    const arabicToEnglish: { [key: string]: string } = {
      'التصميم الجرافيكي': 'design',
      'التصميم': 'design',
      'تصميم': 'design',
      'التسويق الرقمي': 'marketing',
      'التسويق': 'marketing',
      'تسويق': 'marketing',
      'المونتاج والفيديو': 'montage',
      'المونتاج': 'montage',
      'مونتاج': 'montage',
      'سحب البيانات': 'data-extraction',
      'سحب الداتا': 'data-extraction',
      'مواقع الويب': 'websites',
      'المواقع': 'websites',
      'مواقع': 'websites'
    }

    return arabicToEnglish[name] || createSlug(name)
  }

  const checkVisitorAuth = async () => {
    try {
      // التحقق من localStorage أولاً
      const savedVisitor = localStorage.getItem('visitor')
      const userSession = localStorage.getItem('userSession')

      if (savedVisitor && userSession) {
        const visitorData = JSON.parse(savedVisitor)
        const sessionData = JSON.parse(userSession)

        // التحقق من صحة الجلسة
        if (sessionData.isLoggedIn && visitorData.id) {
          // التحقق من وجود المستخدم في قاعدة البيانات
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', visitorData.id)
            .eq('is_active', true)
            .single()

          if (userData && !error) {
            setVisitor(userData)
          } else {
            // إزالة البيانات المحلية إذا لم تعد صالحة
            localStorage.removeItem('visitor')
            localStorage.removeItem('userSession')
          }
        }
      }
    } catch (error) {
      console.error('Error checking visitor auth:', error)
      localStorage.removeItem('visitor')
      localStorage.removeItem('userSession')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      // مسح جميع بيانات الجلسة
      localStorage.removeItem('visitor')
      localStorage.removeItem('userSession')
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

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">TM</span>
              </div>
              <span className="mr-3 text-xl font-bold text-gray-900">Top Marketing</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-blue-600 font-medium">الرئيسية</Link>
              <Link href="/services" className="text-gray-700 hover:text-blue-600">الخدمات</Link>
              <Link href="/packages" className="text-gray-700 hover:text-blue-600">الباقات</Link>
              <Link href="/portfolio" className="text-gray-700 hover:text-blue-600">معرض الأعمال</Link>
              <Link href="/add-property" className="text-gray-700 hover:text-blue-600">إضافة عقار</Link>
              <Link href="/cart" className="text-gray-700 hover:text-blue-600 flex items-center">
                <ShoppingCart className="w-4 h-4 ml-1" />
                السلة
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              ) : visitor ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center bg-green-50 px-3 py-2 rounded-lg">
                    <User className="w-4 h-4 text-green-600 ml-2" />
                    <span className="text-sm font-medium text-green-700">
                      مرحباً، {visitor.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-red-600 text-sm font-medium flex items-center"
                  >
                    <LogOut className="w-4 h-4 ml-1" />
                    تسجيل خروج
                  </button>
                </div>
              ) : (
                <Link
                  href="/visitor-login"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  تسجيل الدخول
                </Link>
              )}

            </div>
          </div>
        </div>
      </header>

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Dynamic Services from Database */}
            {servicesLoading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-xl p-6 animate-pulse">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))
            ) : (
              services.map((service) => (
                <div
                  key={service.id}
                  className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6 hover:shadow-lg hover:border-blue-400 hover:from-blue-100 hover:to-blue-200 transition-all duration-300"
                  style={{
                    background: service.custom_color ?
                      `linear-gradient(135deg, ${service.custom_color}15, ${service.custom_color}25)` :
                      undefined,
                    borderColor: service.custom_color ? `${service.custom_color}40` : undefined
                  }}
                >
                  <div className="text-center">
                    {service.image_url ? (
                      <img
                        src={service.image_url}
                        alt={service.name}
                        className="w-12 h-12 mx-auto mb-3 rounded-lg object-cover"
                      />
                    ) : (
                      <div
                        className="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: service.custom_color || '#3B82F6' }}
                      >
                        {service.name.charAt(0)}
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {service.short_description || service.description}
                    </p>
                    {service.is_featured && (
                      <div className="inline-flex items-center bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs mb-3">
                        <Star className="w-3 h-3 ml-1" />
                        مميزة
                      </div>
                    )}
                    <div className="mt-auto">
                      <Link
                        href={`/services/${service.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors inline-block"
                      >
                        اطلب الآن
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Packages */}
            <div className="group bg-gradient-to-br from-purple-500 to-blue-600 text-white rounded-xl shadow-sm p-6 hover:shadow-lg hover:from-purple-600 hover:to-blue-700 transition-all duration-300">
              <div className="text-center">
                <div className="text-3xl mb-3">📦</div>
                <h3 className="text-lg font-bold mb-2">باقات الصفحات</h3>
                <p className="text-blue-100 text-sm mb-4">إدارة صفحات السوشيال ميديا</p>
                <div className="space-y-2">
                  <Link
                    href="/packages"
                    className="block bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg text-sm transition-colors"
                  >
                    عرض الباقات
                  </Link>
                  <Link
                    href="/packages"
                    className="block bg-white text-purple-600 hover:bg-gray-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    اشترك الآن
                  </Link>
                </div>
              </div>
            </div>

            {/* Real Estate */}
            <div className="group bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-xl shadow-sm p-6 hover:shadow-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300">
              <div className="text-center">
                <div className="text-3xl mb-3">🏠</div>
                <h3 className="text-lg font-bold mb-2">التسويق العقاري</h3>
                <p className="text-green-100 text-sm mb-4">عقارات للبيع والإيجار</p>
                <div className="space-y-2">
                  <Link
                    href="/add-property"
                    className="block bg-white text-green-600 hover:bg-gray-100 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                  >
                    أضف عقارك مجاناً
                  </Link>
                </div>
              </div>
            </div>

            {/* Portfolio */}
            <Link
              href="/portfolio"
              className="group bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-xl shadow-sm p-6 hover:shadow-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300"
            >
              <div className="text-center">
                <div className="text-3xl mb-3">🎨</div>
                <h3 className="text-lg font-bold mb-2">أعمالنا</h3>
                <p className="text-orange-100 text-sm mb-3">معرض أعمالنا السابقة</p>
                <div className="inline-flex items-center bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
                  <span>مشاريع مميزة</span>
                </div>
              </div>
            </Link>
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
  )
}
