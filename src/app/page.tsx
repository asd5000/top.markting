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
  sub_services?: SubService[]
}

interface SubService {
  id: string
  service_id: string
  name: string
  description: string
  price: number
  image_url: string
  icon_url: string
  sort_order: number
  features: string[]
  delivery_time: string
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

      // تحميل الخدمات الأساسية
      const { data: servicesData, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (error) {
        console.error('Error loading services:', error)
        // استخدام خدمات افتراضية في حالة الخطأ
        setServices(getDefaultServices())
      } else if (servicesData && servicesData.length > 0) {
        console.log('✅ Services loaded:', servicesData)

        // تحميل الخدمات الفرعية لكل خدمة
        const servicesWithSubs = await Promise.all(
          servicesData.map(async (service) => {
            const { data: subServices, error: subError } = await supabase
              .from('sub_services')
              .select('*')
              .eq('service_id', service.id)
              .eq('is_active', true)
              .order('sort_order', { ascending: true })

            if (subError) {
              console.error('Error loading sub-services for', service.name, ':', subError)
            }

            return {
              ...service,
              sub_services: subServices || []
            }
          })
        )

        setServices(servicesWithSubs)
      } else {
        // استخدام خدمات افتراضية إذا لم توجد بيانات
        console.log('No services found, using default services')
        setServices(getDefaultServices())
      }
    } catch (error) {
      console.error('Error loading services:', error)
      setServices(getDefaultServices())
    } finally {
      setServicesLoading(false)
    }
  }

  // دالة للحصول على خدمات افتراضية
  const getDefaultServices = () => {
    return [
      {
        id: '1',
        name: 'التصميم',
        description: 'خدمات التصميم الجرافيكي والهوية البصرية',
        short_description: 'تصميم جرافيكي احترافي',
        image_url: '',
        icon_url: '',
        custom_color: '#FF6B35',
        sort_order: 1,
        is_featured: true,
        status: 'active',
        is_active: true,
        sub_services: [
          { id: '1', service_id: '1', name: 'هوية بصرية', description: 'تصميم هوية بصرية كاملة', price: 500, image_url: '', icon_url: '', sort_order: 1, features: ['لوجو', 'كارت شخصي', 'ورق رسمي'], delivery_time: '3-5 أيام', status: 'active', is_active: true },
          { id: '2', service_id: '1', name: 'لوجو', description: 'تصميم لوجو احترافي', price: 200, image_url: '', icon_url: '', sort_order: 2, features: ['3 مفاهيم', 'تعديلات مفتوحة', 'ملفات عالية الجودة'], delivery_time: '2-3 أيام', status: 'active', is_active: true },
          { id: '3', service_id: '1', name: 'بنر إعلاني', description: 'تصميم بنرات إعلانية', price: 100, image_url: '', icon_url: '', sort_order: 3, features: ['جميع المقاسات', 'تصميم جذاب', 'جاهز للطباعة'], delivery_time: '1-2 يوم', status: 'active', is_active: true }
        ]
      },
      {
        id: '2',
        name: 'المونتاج',
        description: 'خدمات المونتاج والفيديو',
        short_description: 'مونتاج فيديو احترافي',
        image_url: '',
        icon_url: '',
        custom_color: '#8B5CF6',
        sort_order: 2,
        is_featured: false,
        status: 'active',
        is_active: true,
        sub_services: [
          { id: '4', service_id: '2', name: 'فيديو إعلاني', description: 'مونتاج فيديو إعلاني', price: 300, image_url: '', icon_url: '', sort_order: 1, features: ['موسيقى', 'مؤثرات بصرية', 'نصوص متحركة'], delivery_time: '3-5 أيام', status: 'active', is_active: true },
          { id: '5', service_id: '2', name: 'موشن جرافيك', description: 'رسوم متحركة احترافية', price: 500, image_url: '', icon_url: '', sort_order: 2, features: ['رسوم متحركة', 'تأثيرات خاصة', 'صوت احترافي'], delivery_time: '5-7 أيام', status: 'active', is_active: true }
        ]
      },
      {
        id: '3',
        name: 'التسويق',
        description: 'خدمات التسويق الرقمي',
        short_description: 'تسويق رقمي فعال',
        image_url: '',
        icon_url: '',
        custom_color: '#10B981',
        sort_order: 3,
        is_featured: false,
        status: 'active',
        is_active: true,
        sub_services: [
          { id: '6', service_id: '3', name: 'إدارة صفحات', description: 'إدارة صفحات السوشيال ميديا', price: 400, image_url: '', icon_url: '', sort_order: 1, features: ['منشورات يومية', 'تفاعل مع العملاء', 'تقارير شهرية'], delivery_time: 'شهري', status: 'active', is_active: true },
          { id: '7', service_id: '3', name: 'حملة إعلانية', description: 'حملات إعلانية مدفوعة', price: 600, image_url: '', icon_url: '', sort_order: 2, features: ['استهداف دقيق', 'تحليل النتائج', 'تحسين مستمر'], delivery_time: '1-2 أسبوع', status: 'active', is_active: true }
        ]
      }
    ]
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

          {/* Services Grid with Sub-services */}
          {servicesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-xl p-6 animate-pulse">
                  <div className="h-6 bg-gray-300 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                  style={{
                    borderTopColor: service.custom_color || '#3B82F6',
                    borderTopWidth: '4px'
                  }}
                >
                  {/* Service Header */}
                  <div
                    className="p-6 text-white"
                    style={{
                      background: `linear-gradient(135deg, ${service.custom_color || '#3B82F6'}, ${service.custom_color || '#3B82F6'}dd)`
                    }}
                  >
                    <div className="flex items-center mb-3">
                      {service.image_url ? (
                        <img
                          src={service.image_url}
                          alt={service.name}
                          className="w-10 h-10 rounded-lg object-cover ml-3"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center text-white font-bold ml-3">
                          {service.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-bold">{service.name}</h3>
                        {service.is_featured && (
                          <div className="inline-flex items-center bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs mt-1">
                            <Star className="w-3 h-3 ml-1" />
                            مميزة
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-white text-opacity-90 text-sm">
                      {service.short_description || service.description}
                    </p>
                  </div>

                  {/* Sub-services */}
                  <div className="p-6">
                    {service.sub_services && service.sub_services.length > 0 ? (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 mb-3">الخدمات المتاحة:</h4>
                        {service.sub_services.slice(0, 3).map((subService) => (
                          <div key={subService.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900 text-sm">{subService.name}</h5>
                              <p className="text-gray-600 text-xs">{subService.description}</p>
                            </div>
                            <div className="text-left">
                              <div className="text-lg font-bold text-green-600">{subService.price} ج.م</div>
                              <div className="text-xs text-gray-500">{subService.delivery_time}</div>
                            </div>
                          </div>
                        ))}

                        {service.sub_services.length > 3 && (
                          <div className="text-center text-sm text-gray-500">
                            +{service.sub_services.length - 3} خدمات أخرى
                          </div>
                        )}

                        <div className="pt-4 border-t border-gray-200">
                          <Link
                            href={`/services/${service.id}`}
                            className="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            عرض جميع الخدمات
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-gray-400 mb-2">لا توجد خدمات فرعية</div>
                        <Link
                          href={`/services/${service.id}`}
                          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          عرض التفاصيل
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Additional Services Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">

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
