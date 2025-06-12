'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Palette, 
  Megaphone, 
  Video, 
  Database, 
  Globe,
  ShoppingCart,
  Plus,
  Minus,
  X,
  Check
} from 'lucide-react'

interface SubService {
  id: string
  name: string
  description: string
  price: number
}

interface Service {
  id: string
  name: string
  description: string
  icon: any
  color: string
  subServices: SubService[]
}

interface CartItem {
  serviceId: string
  subServiceId: string
  serviceName: string
  subServiceName: string
  price: number
  quantity: number
}

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState('design')
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // استخدام البيانات الثابتة فقط
  useEffect(() => {
    // محاكاة تحميل البيانات
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  const services: Service[] = [
    {
      id: 'design',
      name: 'تصميم',
      description: 'خدمات التصميم الجرافيكي والهوية البصرية',
      icon: Palette,
      color: 'from-pink-500 to-rose-500',
      subServices: [
        { id: 'logo', name: 'تصميم لوجو', description: 'تصميم شعار احترافي للعلامة التجارية', price: 500 },
        { id: 'banner', name: 'تصميم بنر إعلاني', description: 'تصميم بنرات إعلانية جذابة ومؤثرة', price: 200 },
        { id: 'cover', name: 'تصميم غلاف فيسبوك', description: 'تصميم أغلفة احترافية للصفحات', price: 150 },
        { id: 'social', name: 'تصميم بوست سوشيال ميديا', description: 'تصميم منشورات وسائل التواصل الاجتماعي', price: 100 },
        { id: 'story', name: 'تصميم ستوري', description: 'تصميم قصص انستجرام وفيسبوك', price: 80 },
        { id: 'print', name: 'تصميم مطبوعات', description: 'تصميم الكتيبات والمطبوعات', price: 400 },
        { id: 'card', name: 'تصميم كرت شخصي', description: 'تصميم كروت العمل والدعوات', price: 250 },
        { id: 'thumbnail', name: 'تصميم صورة مصغّرة يوتيوب', description: 'تصميم thumbnails احترافية', price: 120 },
        { id: 'flyer', name: 'تصميم فلاير', description: 'تصميم منشورات ترويجية', price: 180 },
        { id: 'menu', name: 'تصميم منيو', description: 'تصميم قوائم المطاعم والكافيهات', price: 300 },
        { id: 'catalog', name: 'تصميم كتالوج', description: 'تصميم كتالوجات المنتجات', price: 600 },
        { id: 'identity', name: 'هوية بصرية كاملة', description: 'تصميم هوية بصرية متكاملة', price: 2000 },
        { id: 'package', name: 'تصميم تغليف منتج', description: 'تصميم عبوات وتغليف المنتجات', price: 450 },
        { id: 'presentation', name: 'تصميم عرض تقديمي', description: 'تصميم عروض بوربوينت احترافية', price: 350 }
      ]
    },
    {
      id: 'marketing',
      name: 'تسويق',
      description: 'خدمات التسويق الرقمي والإعلانات',
      icon: Megaphone,
      color: 'from-blue-500 to-cyan-500',
      subServices: [
        { id: 'product', name: 'تسويق منتج', description: 'حملات تسويقية شاملة للمنتجات', price: 800 },
        { id: 'service', name: 'تسويق خدمة', description: 'حملات تسويقية متخصصة للخدمات', price: 700 },
        { id: 'pages', name: 'إدارة صفحات سوشيال ميديا', description: 'إدارة وتسويق صفحات السوشيال ميديا', price: 600 },
        { id: 'groups', name: 'إدارة جروبات', description: 'إدارة وتسويق المجموعات والكوميونيتي', price: 500 },
        { id: 'ads-facebook', name: 'إعلانات فيسبوك', description: 'إنشاء وإدارة حملات إعلانية على فيسبوك', price: 900 },
        { id: 'ads-google', name: 'إعلانات جوجل', description: 'إنشاء وإدارة حملات إعلانية على جوجل', price: 1000 },
        { id: 'ads-instagram', name: 'إعلانات انستجرام', description: 'إنشاء وإدارة حملات إعلانية على انستجرام', price: 850 },
        { id: 'ads-youtube', name: 'إعلانات يوتيوب', description: 'إنشاء وإدارة حملات إعلانية على يوتيوب', price: 1100 },
        { id: 'google-store', name: 'إنشاء متجر Google', description: 'إنشاء وإعداد متجر على Google My Business', price: 400 },
        { id: 'google-maps', name: 'إضافة على خرائط Google', description: 'إضافة النشاط التجاري على خرائط Google', price: 300 },
        { id: 'seo', name: 'تحسين محركات البحث SEO', description: 'تحسين ظهور الموقع في نتائج البحث', price: 1200 },
        { id: 'content', name: 'كتابة محتوى تسويقي', description: 'كتابة محتوى تسويقي احترافي', price: 450 },
        { id: 'email', name: 'التسويق عبر البريد الإلكتروني', description: 'حملات تسويقية عبر البريد الإلكتروني', price: 550 },
        { id: 'influencer', name: 'التسويق عبر المؤثرين', description: 'حملات تسويقية مع المؤثرين', price: 1500 },
        { id: 'landing', name: 'صفحات هبوط تسويقية', description: 'إنشاء صفحات هبوط عالية التحويل', price: 1800 }
      ]
    },
    {
      id: 'video',
      name: 'مونتاج',
      description: 'خدمات المونتاج والفيديو',
      icon: Video,
      color: 'from-purple-500 to-indigo-500',
      subServices: [
        { id: 'intro-video', name: 'فيديو تعريفي للشركة', description: 'إنتاج فيديوهات تعريفية احترافية للشركات', price: 1000 },
        { id: 'product-video', name: 'فيديو تعريفي للمنتج', description: 'إنتاج فيديوهات تعريفية للمنتجات', price: 800 },
        { id: 'reels', name: 'مونتاج ريلز', description: 'إنتاج مقاطع ريلز قصيرة وجذابة', price: 300 },
        { id: 'shorts', name: 'مونتاج شورتس يوتيوب', description: 'إنتاج مقاطع شورتس لليوتيوب', price: 350 },
        { id: 'motion', name: 'موشن جرافيك', description: 'إنتاج رسوم متحركة احترافية', price: 1500 },
        { id: 'animation', name: 'رسوم متحركة 2D', description: 'إنتاج رسوم متحركة ثنائية الأبعاد', price: 1200 },
        { id: 'whiteboard', name: 'فيديو سبورة بيضاء', description: 'إنتاج فيديوهات تعليمية بالسبورة البيضاء', price: 800 },
        { id: 'powerpoint', name: 'فيديو من عرض تقديمي', description: 'تحويل العروض التقديمية لفيديوهات', price: 500 },
        { id: 'intro', name: 'إنترو احترافي', description: 'إنتاج مقدمات احترافية للفيديوهات', price: 400 },
        { id: 'outro', name: 'أوترو احترافي', description: 'إنتاج خاتمات احترافية للفيديوهات', price: 350 },
        { id: 'testimonial', name: 'مونتاج فيديو شهادات', description: 'مونتاج فيديوهات شهادات العملاء', price: 600 },
        { id: 'tutorial', name: 'فيديو تعليمي', description: 'إنتاج فيديوهات تعليمية احترافية', price: 700 },
        { id: 'commercial', name: 'إعلان تجاري', description: 'إنتاج إعلانات تجارية احترافية', price: 2000 },
        { id: 'social-video', name: 'فيديو سوشيال ميديا', description: 'مونتاج فيديوهات مخصصة للسوشيال ميديا', price: 450 }
      ]
    },
    {
      id: 'data',
      name: 'سحب داتا',
      description: 'خدمات استخراج وتحليل البيانات',
      icon: Database,
      color: 'from-green-500 to-emerald-500',
      subServices: [
        { id: 'general', name: 'سحب بيانات عامة', description: 'استخراج بيانات عامة من مصادر مختلفة', price: 600 },
        { id: 'custom', name: 'سحب بيانات مخصصة', description: 'استخراج بيانات مخصصة حسب المتطلبات', price: 1000 },
        { id: 'companies', name: 'بيانات الشركات', description: 'قواعد بيانات الشركات والمؤسسات', price: 800 },
        { id: 'factories', name: 'بيانات المصانع', description: 'قواعد بيانات المصانع والوحدات الإنتاجية', price: 900 },
        { id: 'contacts', name: 'بيانات جهات اتصال', description: 'قواعد بيانات جهات الاتصال والعملاء المحتملين', price: 700 },
        { id: 'competitors', name: 'بيانات المنافسين', description: 'تحليل وجمع بيانات المنافسين', price: 1200 },
        { id: 'social-data', name: 'بيانات سوشيال ميديا', description: 'استخراج بيانات من منصات التواصل الاجتماعي', price: 850 },
        { id: 'market-research', name: 'بحث السوق', description: 'جمع وتحليل بيانات السوق والعملاء', price: 1500 },
        { id: 'leads', name: 'بيانات عملاء محتملين', description: 'قواعد بيانات العملاء المحتملين المؤهلين', price: 950 },
        { id: 'emails', name: 'قوائم بريدية', description: 'قواعد بيانات البريد الإلكتروني المستهدفة', price: 650 }
      ]
    },
    {
      id: 'web',
      name: 'موقع ويب',
      description: 'خدمات تطوير المواقع والتطبيقات',
      icon: Globe,
      color: 'from-orange-500 to-red-500',
      subServices: [
        { id: 'landing-page', name: 'صفحة هبوط', description: 'تطوير صفحة هبوط احترافية عالية التحويل', price: 1200 },
        { id: 'corporate', name: 'موقع تعريفي للشركة', description: 'تطوير موقع تعريفي شامل للشركة', price: 2500 },
        { id: 'ecommerce', name: 'متجر إلكتروني', description: 'تطوير متجر إلكتروني متكامل مع نظام دفع', price: 5000 },
        { id: 'blog', name: 'موقع مدونة', description: 'تطوير مدونة احترافية مع نظام إدارة المحتوى', price: 1800 },
        { id: 'portfolio', name: 'موقع معرض أعمال', description: 'تطوير موقع لعرض الأعمال والمشاريع', price: 2000 },
        { id: 'booking', name: 'موقع حجوزات', description: 'تطوير موقع نظام حجوزات ومواعيد', price: 3500 },
        { id: 'directory', name: 'موقع دليل', description: 'تطوير موقع دليل الشركات والخدمات', price: 4000 },
        { id: 'news', name: 'موقع إخباري', description: 'تطوير موقع إخباري مع نظام إدارة المحتوى', price: 3000 },
        { id: 'educational', name: 'موقع تعليمي', description: 'تطوير منصة تعليمية مع نظام الكورسات', price: 6000 },
        { id: 'restaurant', name: 'موقع مطعم', description: 'تطوير موقع مطعم مع قائمة الطعام ونظام الطلبات', price: 2800 },
        { id: 'real-estate', name: 'موقع عقاري', description: 'تطوير موقع عقاري مع نظام البحث والفلترة', price: 4500 },
        { id: 'medical', name: 'موقع طبي', description: 'تطوير موقع طبي مع نظام المواعيد', price: 3800 }
      ]
    }
  ]

  const addToCart = (serviceId: string, subServiceId: string) => {
    const service = services.find(s => s.id === serviceId)
    const subService = service?.subServices.find(ss => ss.id === subServiceId)
    
    if (service && subService) {
      const existingItem = cart.find(item => 
        item.serviceId === serviceId && item.subServiceId === subServiceId
      )
      
      if (existingItem) {
        setCart(cart.map(item =>
          item.serviceId === serviceId && item.subServiceId === subServiceId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ))
      } else {
        setCart([...cart, {
          serviceId,
          subServiceId,
          serviceName: service.name,
          subServiceName: subService.name,
          price: subService.price,
          quantity: 1
        }])
      }
    }
  }

  const removeFromCart = (serviceId: string, subServiceId: string) => {
    setCart(cart.filter(item => 
      !(item.serviceId === serviceId && item.subServiceId === subServiceId)
    ))
  }

  const updateQuantity = (serviceId: string, subServiceId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(serviceId, subServiceId)
    } else {
      setCart(cart.map(item =>
        item.serviceId === serviceId && item.subServiceId === subServiceId
          ? { ...item, quantity: newQuantity }
          : item
      ))
    }
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const currentService = services.find(s => s.id === selectedService)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">TM</span>
                </div>
                <span className="mr-3 text-xl font-bold text-gray-900">Top Marketing</span>
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600">الرئيسية</Link>
              <Link href="/services" className="text-blue-600 font-medium">الخدمات</Link>
              <Link href="/packages" className="text-gray-700 hover:text-blue-600">إدارة الصفحات</Link>
              <Link href="/real-estate" className="text-gray-700 hover:text-blue-600">العقارات</Link>
            </nav>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-700 hover:text-blue-600"
            >
              <ShoppingCart className="w-6 h-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -left-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">خدماتنا</h1>
          <p className="text-xl text-gray-600">اختر من مجموعة واسعة من الخدمات المتخصصة</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Services Sidebar */}
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-4">الخدمات</h3>
              <div className="space-y-2">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : (
                  services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={`w-full text-right p-3 rounded-lg transition-colors ${
                        selectedService === service.id
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <service.icon className="w-5 h-5 ml-3" />
                        <span className="font-medium">{service.name}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Services Content */}
          <div className="lg:col-span-3">
            {currentService && (
              <div>
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${currentService.color} rounded-lg flex items-center justify-center`}>
                      <currentService.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="mr-4">
                      <h2 className="text-2xl font-bold text-gray-900">{currentService.name}</h2>
                      <p className="text-gray-600">{currentService.description}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      أهلاً وسهلاً بيك! 😊😊
                    </h3>
                    <p className="text-gray-600">
                      الفاهرة؟ اختار واحد من الخيارات اللي تحت عشان أقدر أوجهك بشكل أفضل:
                    </p>
                  </div>

                  <div className="space-y-3">
                    {currentService.subServices.map((subService) => {
                      const cartItem = cart.find(item =>
                        item.serviceId === currentService.id && item.subServiceId === subService.id
                      )

                      return (
                        <div key={subService.id} className="group">
                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer">
                            <div className="flex items-center flex-1">
                              <div className="w-4 h-4 border-2 border-gray-300 rounded-full ml-3 group-hover:border-blue-500 transition-colors">
                                {cartItem && (
                                  <div className="w-full h-full bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                                  {subService.name}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">{subService.description}</p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-lg font-bold text-blue-600">
                                    {subService.price} <span className="text-sm text-gray-600">ج.م</span>
                                  </span>

                                  {cartItem ? (
                                    <div className="flex items-center space-x-2">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          updateQuantity(currentService.id, subService.id, cartItem.quantity - 1)
                                        }}
                                        className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                                      >
                                        <Minus className="w-3 h-3" />
                                      </button>
                                      <span className="w-6 text-center text-sm font-medium">{cartItem.quantity}</span>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          updateQuantity(currentService.id, subService.id, cartItem.quantity + 1)
                                        }}
                                        className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                                      >
                                        <Plus className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        addToCart(currentService.id, subService.id)
                                      }}
                                      className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                      اختيار
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {cart.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <span className="mr-2 text-green-700 font-medium">
                            تواصل مع الدعم التقني ✅
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">إجمالي المختار</p>
                          <p className="text-xl font-bold text-green-600">{getTotalPrice()} ج.م</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsCartOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-96 bg-white shadow-xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-bold">سلة التسوق</h3>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">السلة فارغة</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={`${item.serviceId}-${item.subServiceId}`} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{item.subServiceName}</h4>
                            <p className="text-sm text-gray-600">{item.serviceName}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.serviceId, item.subServiceId)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.serviceId, item.subServiceId, item.quantity - 1)}
                              className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.serviceId, item.subServiceId, item.quantity + 1)}
                              className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-bold text-blue-600">
                            {item.price * item.quantity} ج.م
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {cart.length > 0 && (
                <div className="border-t p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold">الإجمالي:</span>
                    <span className="text-2xl font-bold text-blue-600">{getTotalPrice()} ج.م</span>
                  </div>
                  <Link href="/checkout" className="btn btn-primary w-full block text-center">
                    إتمام الطلب
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
