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
  MessageCircle,
  Search,
  Filter,
  Grid,
  List,
  Badge,
  Eye,
  ShoppingCart,
  Zap,
  Award,
  Heart,
  Share2
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
  short_description: string
  price: number
  image_url: string
  icon_url: string
  sort_order: number
  features: string[]
  delivery_time: string
  status: string
  is_active: boolean
  is_featured: boolean
  badge_text: string
  badge_color: string
  gallery_images: string[]
  detailed_description: string
  purchase_enabled: boolean
}

export default function ServicePage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [service, setService] = useState<Service | null>(null)
  const [subServices, setSubServices] = useState<SubService[]>([])
  const [filteredSubServices, setFilteredSubServices] = useState<SubService[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cartMessage, setCartMessage] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [priceFilter, setPriceFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedSubService, setSelectedSubService] = useState<SubService | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    loadServiceData()
    checkAuth()
  }, [slug])

  useEffect(() => {
    filterSubServices()
  }, [subServices, searchTerm, priceFilter])

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Error checking auth:', error)
    }
  }

  const filterSubServices = () => {
    let filtered = subServices

    // فلترة بالبحث
    if (searchTerm) {
      filtered = filtered.filter(subService =>
        subService.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subService.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (subService.short_description && subService.short_description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // فلترة بالسعر
    if (priceFilter !== 'all') {
      switch (priceFilter) {
        case 'low':
          filtered = filtered.filter(subService => subService.price <= 500)
          break
        case 'medium':
          filtered = filtered.filter(subService => subService.price > 500 && subService.price <= 1500)
          break
        case 'high':
          filtered = filtered.filter(subService => subService.price > 1500)
          break
      }
    }

    setFilteredSubServices(filtered)
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
        console.log('❌ No user session found, redirecting to login')
        alert('يجب تسجيل الدخول أولاً لإتمام عملية الشراء')
        window.location.href = '/visitor-login'
        return
      }

      // إنشاء طلب مباشر في قاعدة البيانات
      const orderData = {
        user_id: userData.id,
        customer_name: userData.name,
        customer_email: userData.email,
        customer_phone: userData.phone || '',
        service_name: subService.name,
        service_category: service?.name,
        total_amount: subService.price,
        status: 'pending',
        notes: `طلب خدمة: ${subService.name} من قسم ${service?.name}`,
        created_at: new Date().toISOString()
      }

      console.log('📝 Creating order:', orderData)

      const { data: orderResult, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single()

      if (orderError) {
        console.error('❌ Error creating order:', orderError)
        setCartMessage('حدث خطأ أثناء إنشاء الطلب')
        setTimeout(() => setCartMessage(null), 3000)
        return
      }

      console.log('✅ Order created successfully:', orderResult)

      setCartMessage('تم إنشاء الطلب بنجاح! جاري التوجيه للدفع...')
      setTimeout(() => setCartMessage(null), 3000)

      // التوجيه لصفحة الدفع مع معرف الطلب
      setTimeout(() => {
        window.location.href = `/(public)/checkout/subscribe?order_id=${orderResult.id}&type=service&service_name=${encodeURIComponent(subService.name)}&amount=${subService.price}`
      }, 1500)

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
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">خدماتنا في {service.name}</h2>
          <p className="text-gray-600">اختر الخدمة التي تناسب احتياجاتك</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="ابحث في الخدمات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">جميع الأسعار</option>
                <option value="low">أقل من 500 ج.م</option>
                <option value="medium">500 - 1500 ج.م</option>
                <option value="high">أكثر من 1500 ج.م</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {filteredSubServices.length} من {subServices.length} خدمة
            </span>
            {(searchTerm || priceFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setPriceFilter('all')
                }}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                مسح الفلاتر
              </button>
            )}
          </div>
        </div>

        {filteredSubServices.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm || priceFilter !== 'all' ? 'لا توجد نتائج للبحث' : 'لا توجد خدمات فرعية'}
            </h3>
            <p className="text-gray-600">
              {searchTerm || priceFilter !== 'all' ? 'جرب تغيير معايير البحث' : 'سيتم إضافة خدمات فرعية قريباً'}
            </p>
          </div>
        ) : (
          <div className={`${
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
              : 'space-y-6'
          }`}>
            {filteredSubServices.map((subService) => (
              <div
                key={subService.id}
                className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* صورة الخدمة الفرعية */}
                <div className={`relative overflow-hidden ${
                  viewMode === 'list' ? 'w-64 h-48' : 'h-56'
                }`}>
                  {subService.image_url ? (
                    <img
                      src={subService.image_url}
                      alt={subService.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Package className="w-12 h-12 text-white" />
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex flex-col space-y-2">
                    {subService.is_featured && (
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                        <Star className="w-3 h-3 ml-1" />
                        مميز
                      </div>
                    )}
                    {subService.badge_text && (
                      <div
                        className="text-white px-3 py-1 rounded-full text-xs font-bold"
                        style={{ backgroundColor: subService.badge_color || '#10B981' }}
                      >
                        {subService.badge_text}
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute top-4 left-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-colors">
                      <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-colors">
                      <Share2 className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                      {subService.name}
                    </h3>
                    {subService.icon_url && (
                      <img
                        src={subService.icon_url}
                        alt=""
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                    )}
                  </div>

                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {subService.short_description || subService.description}
                  </p>

                  {/* السعر والوقت */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      {subService.price > 0 ? (
                        <>
                          <DollarSign className="w-5 h-5 text-green-600 ml-1" />
                          <span className="text-2xl font-bold text-green-600">
                            {subService.price} ج.م
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-semibold text-blue-600">
                          حسب الطلب
                        </span>
                      )}
                    </div>

                    {subService.delivery_time && (
                      <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                        <Clock className="w-4 h-4 text-blue-600 ml-1" />
                        <span className="text-sm text-blue-600 font-medium">
                          {subService.delivery_time}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* المميزات */}
                  {subService.features && subService.features.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Award className="w-5 h-5 text-blue-600 ml-2" />
                        المميزات:
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {subService.features.slice(0, viewMode === 'list' ? 6 : 4).map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-700 bg-gray-50 rounded-lg p-2">
                            <CheckCircle className="w-4 h-4 text-green-500 ml-2 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                        {subService.features.length > (viewMode === 'list' ? 6 : 4) && (
                          <div className="text-xs text-blue-600 font-medium">
                            +{subService.features.length - (viewMode === 'list' ? 6 : 4)} مميزة أخرى
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* أزرار الإجراء */}
                  <div className="space-y-3">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setSelectedSubService(subService)
                          setShowModal(true)
                        }}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium flex items-center justify-center"
                      >
                        <Eye className="w-4 h-4 ml-2" />
                        عرض التفاصيل
                      </button>

                      {subService.purchase_enabled !== false && (
                        <button
                          onClick={() => buyNow(subService)}
                          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white text-center py-3 px-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-medium flex items-center justify-center"
                        >
                          <ShoppingCart className="w-4 h-4 ml-2" />
                          اشتري الآن
                        </button>
                      )}
                    </div>

                    <a
                      href={`https://wa.me/201068275557?text=أريد طلب خدمة: ${subService.name} - ${subService.price > 0 ? subService.price + ' ج.م' : 'حسب الطلب'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-center py-3 px-4 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all font-medium flex items-center justify-center"
                    >
                      <MessageCircle className="w-4 h-4 ml-2" />
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

      {/* Service Details Modal */}
      {showModal && selectedSubService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedSubService.name}</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 p-2"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Image Gallery */}
                {selectedSubService.gallery_images && selectedSubService.gallery_images.length > 0 ? (
                  <div className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedSubService.gallery_images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${selectedSubService.name} ${index + 1}`}
                          className="w-full h-64 object-cover rounded-xl"
                        />
                      ))}
                    </div>
                  </div>
                ) : selectedSubService.image_url && (
                  <div className="mb-6">
                    <img
                      src={selectedSubService.image_url}
                      alt={selectedSubService.name}
                      className="w-full h-64 object-cover rounded-xl"
                    />
                  </div>
                )}

                {/* Detailed Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">وصف تفصيلي</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedSubService.detailed_description || selectedSubService.description}
                  </p>
                </div>

                {/* Features */}
                {selectedSubService.features && selectedSubService.features.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">جميع المميزات</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedSubService.features.map((feature, index) => (
                        <div key={index} className="flex items-center bg-green-50 rounded-lg p-3">
                          <CheckCircle className="w-5 h-5 text-green-500 ml-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price and Actions */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {selectedSubService.price > 0 ? (
                        <>
                          <DollarSign className="w-6 h-6 text-green-600 ml-2" />
                          <span className="text-3xl font-bold text-green-600">
                            {selectedSubService.price} ج.م
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-blue-600">
                          حسب الطلب
                        </span>
                      )}
                    </div>

                    {selectedSubService.delivery_time && (
                      <div className="flex items-center bg-blue-100 px-4 py-2 rounded-lg">
                        <Clock className="w-5 h-5 text-blue-600 ml-2" />
                        <span className="text-blue-600 font-medium">
                          {selectedSubService.delivery_time}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    {selectedSubService.purchase_enabled !== false && (
                      <button
                        onClick={() => {
                          buyNow(selectedSubService)
                          setShowModal(false)
                        }}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium flex items-center justify-center"
                      >
                        <ShoppingCart className="w-5 h-5 ml-2" />
                        اشتري الآن
                      </button>
                    )}

                    <a
                      href={`https://wa.me/201068275557?text=أريد طلب خدمة: ${selectedSubService.name} - ${selectedSubService.price > 0 ? selectedSubService.price + ' ج.م' : 'حسب الطلب'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-medium flex items-center justify-center"
                    >
                      <MessageCircle className="w-5 h-5 ml-2" />
                      طلب عبر واتساب
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        message="يجب تسجيل الدخول أولاً لإتمام عملية الشراء."
      />
    </div>
  )
}
