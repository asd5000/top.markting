'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { isAuthenticated, getCurrentUser, User } from '@/lib/auth'
import AuthModal from '@/components/AuthModal'
import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Star,
  Package,
  DollarSign,
  Phone,
  MessageCircle
} from 'lucide-react'

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

export default function ServicePage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [service, setService] = useState<Service | null>(null)
  const [subServices, setSubServices] = useState<SubService[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cartMessage, setCartMessage] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    loadServiceData()
    checkAuth()
  }, [slug])

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Error checking auth:', error)
    }
  }

  // دالة لتحويل slug إلى اسم الخدمة
  const getServiceFromSlug = async (slug: string) => {
    // أولاً: تحميل جميع الخدمات
    const { data: allServices, error: servicesError } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)

    if (servicesError) {
      console.error('Error loading services:', servicesError)
      return null
    }

    // البحث بالـ ID أولاً (إذا كان slug هو ID)
    let foundService = allServices?.find(service => service.id === slug)

    if (foundService) {
      return foundService
    }

    // البحث بالاسم المُرمز
    const decodedSlug = decodeURIComponent(slug).replace(/-/g, ' ')
    foundService = allServices?.find(service => {
      return service.name === decodedSlug ||
             service.name.includes(decodedSlug) ||
             decodedSlug.includes(service.name)
    })

    if (foundService) {
      return foundService
    }

    // البحث بالأسماء الإنجليزية المعروفة
    const slugToArabic: { [key: string]: string } = {
      'design': 'التصميم الجرافيكي',
      'marketing': 'التسويق الرقمي',
      'montage': 'المونتاج والفيديو',
      'data-extraction': 'سحب البيانات',
      'websites': 'مواقع الويب'
    }

    const arabicName = slugToArabic[slug]
    if (arabicName) {
      foundService = allServices?.find(service => {
        return service.name === arabicName ||
               service.name.includes(arabicName) ||
               arabicName.includes(service.name)
      })
    }

    return foundService
  }

  const loadServiceData = async () => {
    try {
      setLoading(true)
      console.log('🔍 Loading service data for slug:', slug)

      // البحث عن الخدمة باستخدام الدالة المحدثة
      const foundService = await getServiceFromSlug(slug)

      if (!foundService) {
        console.error('Service not found for slug:', slug)
        setError('الخدمة غير موجودة')
        return
      }

      console.log('✅ Service found:', foundService)
      setService(foundService)

      // تحميل الخدمات الفرعية
      const { data: subServices, error: subServicesError } = await supabase
        .from('sub_services')
        .select('*')
        .eq('service_id', foundService.id)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (subServicesError) {
        console.error('Error loading sub-services:', subServicesError)
      } else {
        console.log('✅ Sub-services loaded:', subServices)
        setSubServices(subServices || [])
      }

    } catch (error) {
      console.error('Error loading service data:', error)
      setError('حدث خطأ أثناء تحميل البيانات')
    } finally {
      setLoading(false)
    }
  }

  const buyNow = async (subService: SubService) => {
    try {
      console.log('🛒 Buy now:', subService)

      // التحقق من تسجيل الدخول - فحص Supabase Auth أولاً
      const { data: { session }, error } = await supabase.auth.getSession()

      let userData = null

      if (session && session.user) {
        // المستخدم مسجل دخول عبر Supabase Auth
        userData = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'مستخدم',
          phone: session.user.user_metadata?.phone || '',
          isLoggedIn: true
        }
        console.log('👤 User data from Supabase:', userData)
      } else {
        // التحقق من localStorage كبديل
        const visitor = localStorage.getItem('visitor') || localStorage.getItem('userSession')
        if (visitor) {
          userData = JSON.parse(visitor)
          console.log('👤 User data from localStorage:', userData)
        }
      }

      if (!userData) {
        console.log('❌ No user session found')
        setShowAuthModal(true)
        return
      }

      // إضافة إلى localStorage
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const existingItem = cart.find((item: any) => item.id === subService.id)

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        cart.push({
          id: subService.id,
          name: subService.name,
          price: subService.price,
          service_name: service?.name,
          quantity: 1,
          image_url: subService.image_url,
          type: 'service',
          user_id: userData.id
        })
      }

      localStorage.setItem('cart', JSON.stringify(cart))

      setCartMessage('تم إضافة الخدمة للسلة بنجاح!')
      setTimeout(() => setCartMessage(null), 3000)

      // التوجيه لصفحة السلة أولاً
      window.location.href = '/cart'

    } catch (error) {
      console.error('❌ Error in buy now:', error)
      setCartMessage('حدث خطأ أثناء إضافة الخدمة')
      setTimeout(() => setCartMessage(null), 3000)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الخدمة...</p>
        </div>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">الخدمة غير موجودة</h1>
          <p className="text-gray-600 mb-6">{error || 'لم يتم العثور على الخدمة المطلوبة'}</p>
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            <ArrowLeft className="w-5 h-5 ml-2" />
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-gray-600 hover:text-blue-600 flex items-center"
            >
              <ArrowLeft className="w-5 h-5 ml-2" />
              العودة للصفحة الرئيسية
            </Link>
            
            <div className="flex items-center space-x-4">
              <a
                href="tel:01068275557"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center text-sm"
              >
                <Phone className="w-4 h-4 ml-2" />
                اتصل بنا
              </a>
              <a
                href="https://wa.me/201068275557"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center text-sm"
              >
                <MessageCircle className="w-4 h-4 ml-2" />
                واتساب
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Service Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              {service.image_url && (
                <img
                  src={service.image_url}
                  alt={service.name}
                  className="w-20 h-20 rounded-lg object-cover ml-4"
                />
              )}
              <div
                className="w-6 h-20 rounded-lg"
                style={{ backgroundColor: service.custom_color || '#3B82F6' }}
              ></div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              {service.name}
              {service.is_featured && (
                <Star className="w-8 h-8 text-yellow-500 mr-3" />
              )}
            </h1>
            
            <p className="text-xl text-gray-600 mb-2">{service.short_description}</p>
            <p className="text-gray-700 max-w-3xl mx-auto">{service.description}</p>
          </div>
        </div>
      </div>

      {/* رسالة السلة */}
      {cartMessage && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {cartMessage}
        </div>
      )}

      {/* Sub Services */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">خدماتنا في {service.name}</h2>
          <p className="text-gray-600">اختر الخدمة التي تناسب احتياجاتك</p>
        </div>

        {subServices.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">لا توجد خدمات فرعية</h3>
            <p className="text-gray-600">سيتم إضافة خدمات فرعية قريباً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subServices.map((subService) => (
              <div
                key={subService.id}
                className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* صورة الخدمة الفرعية */}
                {subService.image_url && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={subService.image_url}
                      alt={subService.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{subService.name}</h3>
                  <p className="text-gray-600 mb-4">{subService.description}</p>

                  {/* السعر */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <DollarSign className="w-5 h-5 text-green-600 ml-1" />
                      <span className="text-2xl font-bold text-green-600">
                        {subService.price} ج.م
                      </span>
                    </div>
                    
                    {subService.delivery_time && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 ml-1" />
                        {subService.delivery_time}
                      </div>
                    )}
                  </div>

                  {/* المميزات */}
                  {subService.features && subService.features.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-2">المميزات:</h4>
                      <ul className="space-y-2">
                        {subService.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-500 ml-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* أزرار الإجراء */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => buyNow(subService)}
                      className="flex-1 bg-blue-600 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      اشتري الآن
                    </button>
                    <a
                      href={`https://wa.me/201068275557?text=أريد طلب خدمة: ${subService.name} - ${subService.price} ج.م`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-green-600 text-white text-center py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      طلب عبر واتساب
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">هل تحتاج استشارة مجانية؟</h2>
          <p className="text-xl text-gray-300 mb-8">
            تواصل معنا الآن للحصول على استشارة مجانية حول خدمات {service.name}
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href={`https://wa.me/201068275557?text=أريد استشارة مجانية حول خدمات ${service.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center"
            >
              <MessageCircle className="w-5 h-5 ml-2" />
              واتساب
            </a>
            <a
              href="tel:01068275557"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
            >
              <Phone className="w-5 h-5 ml-2" />
              اتصل بنا
            </a>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        message="يجب تسجيل الدخول أولاً لإتمام عملية الشراء."
      />
    </div>
  )
}
