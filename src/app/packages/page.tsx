'use client'

import { useState, useEffect } from 'react'
import { Check, Star, ArrowLeft, Package, User, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Package {
  id: string
  name: string
  description: string
  price: number
  duration: number
  features: string[]
  popular?: boolean
  subscribersCount: number
}

export default function PackagesPage() {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  // تحميل الباقات من قاعدة البيانات
  useEffect(() => {
    loadPackages()
    checkUserAuth()
  }, [])

  // فحص حالة المستخدم
  const checkUserAuth = async () => {
    try {
      // التحقق من Supabase Auth
      const { data: { session }, error } = await supabase.auth.getSession()

      if (session && session.user) {
        // المستخدم مسجل دخول عبر Supabase Auth
        const userData = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'مستخدم',
          phone: session.user.user_metadata?.phone || '',
          isLoggedIn: true
        }
        setUser(userData)
        console.log('👤 User logged in via Supabase:', userData)
      } else {
        // التحقق من localStorage كبديل
        const savedUser = localStorage.getItem('visitor') || localStorage.getItem('userSession')
        if (savedUser) {
          const userData = JSON.parse(savedUser)
          setUser(userData)
          console.log('👤 User logged in via localStorage:', userData)
        } else {
          console.log('👤 No user session found')
        }
      }
    } catch (error) {
      console.error('Error checking user auth:', error)
    }
  }

  const loadPackages = async () => {
    try {
      setLoading(true)
      console.log('🔄 Loading packages from database...')

      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)
        .order('price')

      if (error) {
        console.error('❌ Error loading packages:', error)
        // في حالة الخطأ، نستخدم البيانات الاحتياطية مع UUID صحيحة
        setPackages(fallbackPackages)
        return
      }

      if (!data || data.length === 0) {
        console.log('⚠️ No packages found, using fallback data')
        setPackages(fallbackPackages)
        return
      }

      const formattedPackages = data.map((pkg, index) => ({
        id: pkg.id, // UUID من قاعدة البيانات
        name: pkg.name,
        description: pkg.description || 'باقة مميزة لتطوير أعمالك',
        price: parseFloat(pkg.price) || 0,
        duration: pkg.duration_months || 1,
        features: Array.isArray(pkg.features) ? pkg.features : [
          'خدمات تسويقية متميزة',
          'دعم فني متخصص',
          'تقارير دورية',
          'استشارات مجانية'
        ],
        popular: index === 1, // الباقة الثانية تكون الأكثر شعبية
        subscribersCount: pkg.subscribers_count || Math.floor(Math.random() * 50) + 10
      }))

      console.log('✅ Packages loaded successfully:', formattedPackages)
      setPackages(formattedPackages)
    } catch (error) {
      console.error('❌ Error loading packages:', error)
      // في حالة الخطأ، نستخدم البيانات الاحتياطية
      setPackages(fallbackPackages)
    } finally {
      setLoading(false)
    }
  }

  // بيانات الباقات الاحتياطية (بـ UUID صحيحة من قاعدة البيانات)
  const fallbackPackages: Package[] = [
    {
      id: '8e534a54-f9ce-48a3-9bae-fa24660d0cbe',
      name: 'باقة أساسية',
      description: 'مثالية للشركات الصغيرة والمشاريع الناشئة',
      price: 500,
      duration: 1,
      features: [
        'إدارة صفحة واحدة',
        '5 منشورات أسبوعياً',
        'رد على التعليقات',
        'تقرير شهري',
        'دعم فني أساسي'
      ],
      subscribersCount: 25
    },
    {
      id: '37c498af-4b58-4e3a-b1cf-6ba867eca5b3',
      name: 'باقة احترافية',
      description: 'الأكثر شعبية للشركات المتوسطة',
      price: 1200,
      duration: 1,
      features: [
        'إدارة 3 صفحات',
        '10 منشورات أسبوعياً',
        'رد على التعليقات',
        'تقارير أسبوعية',
        'حملة إعلانية شهرية',
        'تصميم منشورات مخصصة',
        'دعم فني متقدم'
      ],
      popular: true,
      subscribersCount: 45
    },
    {
      id: 'e2d9e211-734b-41d1-b439-f1be12a4722a',
      name: 'باقة الشركات',
      description: 'للشركات الكبيرة والعلامات التجارية المتقدمة',
      price: 2500,
      duration: 1,
      features: [
        'إدارة 5 صفحات',
        '15 منشور أسبوعياً',
        'تقارير يومية',
        '3 حملات إعلانية شهرياً',
        'استشارة تسويقية مجانية',
        'تصميم هوية بصرية',
        'فيديوهات ترويجية',
        'دعم فني على مدار الساعة'
      ],
      subscribersCount: 18
    }
  ]

  const handleSubscribe = async (pkg: Package) => {
    // التحقق من صحة UUID الباقة
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(pkg.id)) {
      console.error('❌ Invalid package UUID:', pkg.id)
      alert('خطأ في معرف الباقة. يرجى إعادة تحميل الصفحة.')
      return
    }

    // التحقق من تسجيل الدخول - فحص Supabase Auth أولاً
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

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
      const savedUser = localStorage.getItem('visitor') || localStorage.getItem('userSession')
      if (savedUser) {
        userData = JSON.parse(savedUser)
        console.log('👤 User data from localStorage:', userData)
      }
    }

    if (!userData) {
      alert('يرجى تسجيل الدخول أولاً')
      window.location.href = '/visitor-login'
      return
    }

    try {
      console.log('👤 User data:', userData)
      console.log('📦 Package data with UUID:', pkg)
      console.log('🔍 Package ID validation:', {
        id: pkg.id,
        isValidUUID: uuidRegex.test(pkg.id),
        type: typeof pkg.id
      })

      setSelectedPackage(pkg)

      // إنشاء اشتراك جديد بحالة pending
      const startDate = new Date()
      const endDate = new Date()
      endDate.setMonth(endDate.getMonth() + pkg.duration)

      const subscriptionData = {
        user_id: userData.id || null, // يمكن أن يكون null للزوار
        package_id: pkg.id,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        status: 'suspended', // حالة معلقة حتى رفع الإيصال وتفعيلها من الإدارة
        payment_method: null,
        total_amount: pkg.price,
        used_designs: 0,
        used_videos: 0,
        used_posts: 0,
        auto_renew: false
      }

      console.log('💾 Subscription data to insert:', subscriptionData)

      // التحقق النهائي من UUID قبل الإرسال
      if (!subscriptionData.package_id || typeof subscriptionData.package_id !== 'string') {
        console.error('❌ Invalid package_id before insert:', subscriptionData.package_id)
        alert('خطأ في معرف الباقة. يرجى المحاولة مرة أخرى.')
        return
      }

      const { data: subscriptionResult, error } = await supabase
        .from('subscriptions')
        .insert([subscriptionData])
        .select()
        .single()

      if (error) {
        console.error('❌ Supabase error:', error)

        // معالجة أخطاء UUID المحددة
        if (error.message.includes('invalid input syntax for type uuid')) {
          alert('خطأ في معرف الباقة. يرجى إعادة تحميل الصفحة والمحاولة مرة أخرى.')
        } else if (error.message.includes('violates check constraint')) {
          alert('خطأ في بيانات الاشتراك. يرجى المحاولة مرة أخرى.')
        } else {
          alert(`حدث خطأ أثناء إنشاء الاشتراك: ${error.message}`)
        }
        return
      }

      console.log('✅ Subscription created successfully:', subscriptionResult)

      // إضافة البيانات للسلة مؤقتاً
      const cartItem = {
        id: `package_${pkg.id}`,
        type: 'package',
        name: pkg.name,
        price: pkg.price,
        quantity: 1,
        subscription_id: subscriptionResult.id
      }

      localStorage.setItem('cart', JSON.stringify([cartItem]))

      // توجيه المستخدم لصفحة السلة أولاً
      window.location.href = '/cart'

    } catch (error) {
      console.error('❌ Error subscribing:', error)
      alert('حدث خطأ أثناء الاشتراك. يرجى المحاولة مرة أخرى.')
    }
  }

  // استخدام الباقات المحملة (التي تحتوي على UUID صحيحة)
  const displayPackages = packages

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الباقات...</p>
        </div>
      </div>
    )
  }

  // التحقق من وجود باقات للعرض
  if (!displayPackages || displayPackages.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">لا توجد باقات متاحة</h2>
          <p className="text-gray-600 mb-6">لم يتم العثور على باقات للعرض</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            إعادة تحميل
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">TM</span>
              </div>
              <span className="mr-3 text-xl font-bold text-gray-900">Top Marketing</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600">الرئيسية</Link>
              <Link href="/services" className="text-gray-700 hover:text-blue-600">الخدمات</Link>
              <Link href="/packages" className="text-blue-600 font-medium">الباقات</Link>
              <Link href="/real-estate" className="text-gray-700 hover:text-blue-600">العقارات</Link>
            </nav>

            {/* User Status */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center bg-green-50 px-3 py-2 rounded-lg">
                    <User className="w-4 h-4 text-green-600 ml-2" />
                    <span className="text-sm font-medium text-green-700">
                      مرحباً، {user.name}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      // تسجيل الخروج
                      supabase.auth.signOut()
                      localStorage.removeItem('visitor')
                      localStorage.removeItem('userSession')
                      setUser(null)
                      window.location.reload()
                    }}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">باقات إدارة الصفحات</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            اختر الباقة المناسبة لك واترك إدارة صفحاتك على السوشيال ميديا لنا - محدث
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center">
              <Check className="w-4 h-4 ml-1" />
              <span>إدارة احترافية</span>
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 ml-1" />
              <span>محتوى مميز</span>
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 ml-1" />
              <span>تقارير دورية</span>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">اختر الباقة المناسبة لك</h2>
            <p className="text-xl text-gray-600">جميع الباقات تشمل إدارة احترافية لصفحاتك</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                  pkg.popular 
                    ? 'border-blue-500 transform scale-105' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                      <Star className="w-4 h-4 ml-1" />
                      الأكثر شعبية
                    </div>
                  </div>
                )}

                <div className="p-8">
                  {/* Package Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                    <p className="text-gray-600 mb-4">{pkg.description}</p>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-blue-600">{pkg.price}</span>
                      <span className="text-gray-600 mr-1">ج.م/شهر</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {pkg.subscribersCount} عميل يثق بهذه الباقة
                    </p>
                  </div>

                  {/* Features */}
                  <div className="mb-8">
                    <h4 className="font-bold text-gray-900 mb-4">ما تشمله الباقة:</h4>
                    <ul className="space-y-3">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="w-5 h-5 text-green-500 ml-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Subscribe Button */}
                  <button
                    onClick={() => handleSubscribe(pkg)}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center ${
                      pkg.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    اشترك الآن
                    <ArrowLeft className="w-4 h-4 mr-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
