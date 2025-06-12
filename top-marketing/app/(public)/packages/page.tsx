'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Calendar, 
  Check, 
  Star, 
  Users, 
  BarChart3, 
  MessageCircle,
  Megaphone,
  FileText,
  Crown,
  Zap
} from 'lucide-react'

interface Package {
  id: string
  name: string
  price: number
  duration: string
  description: string
  features: string[]
  popular?: boolean
  color: string
  icon: any
}

export default function PackagesPage() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [showSubscribeForm, setShowSubscribeForm] = useState(false)
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)

  // استخدام البيانات الثابتة فقط
  useEffect(() => {
    // محاكاة تحميل البيانات
    setTimeout(() => {
      setPackages(mockPackages)
      setLoading(false)
    }, 300)
  }, [])

  const mockPackages: Package[] = [
    {
      id: 'basic',
      name: 'باقة عادية',
      price: 500,
      duration: 'شهرياً',
      description: 'مثالية للشركات الصغيرة والمشاريع الناشئة',
      color: 'border-gray-200',
      icon: Users,
      features: [
        'إدارة صفحة واحدة',
        '5 منشورات أسبوعياً',
        'رد على التعليقات',
        'تقرير شهري',
        'دعم فني أساسي',
        'تصميم 2 بوست شهرياً'
      ]
    },
    {
      id: 'standard',
      name: 'باقة متوسطة',
      price: 800,
      duration: 'شهرياً',
      description: 'الأكثر شعبية للشركات المتوسطة',
      color: 'border-blue-500',
      icon: BarChart3,
      popular: true,
      features: [
        'إدارة 3 صفحات',
        '10 منشورات أسبوعياً',
        'رد على التعليقات والرسائل',
        'تقارير أسبوعية',
        'حملة إعلانية شهرياً',
        'تصميم 5 بوست شهرياً',
        'فيديو ريلز شهرياً',
        'دعم فني متقدم'
      ]
    },
    {
      id: 'premium',
      name: 'باقة احترافية',
      price: 1200,
      duration: 'شهرياً',
      description: 'للشركات الكبيرة والعلامات التجارية المتقدمة',
      color: 'border-purple-500',
      icon: Crown,
      features: [
        'إدارة 5 صفحات',
        '15 منشور أسبوعياً',
        'رد على التعليقات والرسائل',
        'تقارير يومية',
        '3 حملات إعلانية شهرياً',
        'تصميم 10 بوست شهرياً',
        '3 فيديو ريلز شهرياً',
        'استشارة تسويقية مجانية',
        'دعم فني مخصص 24/7',
        'تحليل المنافسين'
      ]
    }
  ]

  const handleSubscribe = (packageId: string) => {
    setSelectedPackage(packageId)
    setShowSubscribeForm(true)
  }

  const selectedPkg = packages.find(pkg => pkg.id === selectedPackage)

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
              <Link href="/packages" className="text-blue-600 font-medium">إدارة الصفحات</Link>
              <Link href="/real-estate" className="text-gray-700 hover:text-blue-600">العقارات</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            باقات إدارة الصفحات
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            اختر الباقة المناسبة لاحتياجاتك وابدأ في نمو حضورك الرقمي
          </p>
          <div className="flex items-center justify-center space-x-6 text-lg">
            <div className="flex items-center">
              <Check className="w-6 h-6 ml-2" />
              <span>إدارة احترافية</span>
            </div>
            <div className="flex items-center">
              <Check className="w-6 h-6 ml-2" />
              <span>محتوى إبداعي</span>
            </div>
            <div className="flex items-center">
              <Check className="w-6 h-6 ml-2" />
              <span>تقارير دورية</span>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">اختر باقتك المثالية</h2>
            <p className="text-xl text-gray-600">جميع الباقات تشمل إدارة احترافية ومحتوى عالي الجودة</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="card animate-pulse">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-4"></div>
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="h-8 bg-gray-300 rounded mb-1"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </div>
                  <div className="space-y-3 mb-8">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-4 bg-gray-300 rounded"></div>
                    ))}
                  </div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              ))
            ) : (
              packages.map((pkg) => (
                <div
                key={pkg.id}
                className={`card relative ${pkg.popular ? 'ring-2 ring-blue-500 scale-105' : ''} hover:shadow-xl transition-all duration-300`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 right-1/2 transform translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                      <Star className="w-4 h-4 ml-1" />
                      الأكثر شعبية
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${
                    pkg.id === 'basic' ? 'from-gray-500 to-gray-600' :
                    pkg.id === 'standard' ? 'from-blue-500 to-blue-600' :
                    'from-purple-500 to-purple-600'
                  } rounded-lg flex items-center justify-center`}>
                    <pkg.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <p className="text-gray-600 mb-4">{pkg.description}</p>
                  
                  <div className="text-4xl font-bold text-blue-600 mb-1">
                    {pkg.price} <span className="text-lg text-gray-600">ج.م</span>
                  </div>
                  <p className="text-gray-600">{pkg.duration}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <Check className="w-5 h-5 text-green-500 ml-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => handleSubscribe(pkg.id)}
                  className={`btn w-full ${
                    pkg.popular 
                      ? 'btn-primary' 
                      : 'border border-gray-300 hover:border-blue-500 hover:text-blue-600'
                  }`}
                >
                  اشترك الآن
                </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">لماذا تختار خدماتنا؟</h2>
            <p className="text-xl text-gray-600">نقدم خدمات إدارة صفحات متكاملة ومتخصصة</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">محتوى إبداعي</h3>
              <p className="text-gray-600">نصوص ومنشورات جذابة تناسب جمهورك المستهدف</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">تقارير مفصلة</h3>
              <p className="text-gray-600">تحليلات دقيقة لأداء صفحاتك ومعدلات التفاعل</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Megaphone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">حملات إعلانية</h3>
              <p className="text-gray-600">إعلانات مدفوعة مستهدفة لزيادة الوصول والمبيعات</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">استجابة سريعة</h3>
              <p className="text-gray-600">رد فوري على التعليقات والرسائل من العملاء</p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe Modal */}
      {showSubscribeForm && selectedPkg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              اشتراك في {selectedPkg.name}
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">الباقة:</span>
                <span className="font-medium">{selectedPkg.name}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">السعر:</span>
                <span className="font-bold text-blue-600">{selectedPkg.price} ج.م</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">المدة:</span>
                <span className="font-medium">{selectedPkg.duration}</span>
              </div>
            </div>

            <form className="space-y-4">
              <div>
                <label className="form-label">الاسم الكامل *</label>
                <input type="text" className="form-input" required />
              </div>
              
              <div>
                <label className="form-label">البريد الإلكتروني *</label>
                <input type="email" className="form-input" required />
              </div>
              
              <div>
                <label className="form-label">رقم الهاتف *</label>
                <input type="tel" className="form-input" required />
              </div>
              
              <div>
                <label className="form-label">اسم الشركة/النشاط</label>
                <input type="text" className="form-input" />
              </div>
              
              <div>
                <label className="form-label">روابط الصفحات المراد إدارتها</label>
                <textarea className="form-input" rows={3} placeholder="ضع روابط صفحاتك هنا..."></textarea>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button type="submit" className="btn btn-primary flex-1">
                  تأكيد الاشتراك
                </button>
                <button 
                  type="button"
                  onClick={() => setShowSubscribeForm(false)}
                  className="btn border border-gray-300 flex-1"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">الأسئلة الشائعة</h2>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-2">كم يستغرق بدء الخدمة؟</h3>
              <p className="text-gray-600">نبدأ في إدارة صفحاتك خلال 24 ساعة من تأكيد الاشتراك وتسليم المعلومات المطلوبة.</p>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-2">هل يمكنني تغيير الباقة لاحقاً؟</h3>
              <p className="text-gray-600">نعم، يمكنك ترقية أو تخفيض باقتك في أي وقت مع احتساب الفرق في السعر.</p>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-2">ما هي طرق الدفع المتاحة؟</h3>
              <p className="text-gray-600">نقبل الدفع عبر التحويل البنكي، فودافون كاش، أو الدفع النقدي في مقر الشركة.</p>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-2">هل تقدمون ضمان على الخدمة؟</h3>
              <p className="text-gray-600">نعم، نضمن جودة الخدمة ويمكنك إلغاء الاشتراك في أي وقت مع إشعار مسبق 7 أيام.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">جاهز لبدء رحلتك الرقمية؟</h2>
          <p className="text-xl mb-8 opacity-90">
            انضم إلى أكثر من 500 عميل راضٍ عن خدماتنا
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => handleSubscribe('standard')}
              className="btn bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
            >
              ابدأ الآن
            </button>
            <Link href="/contact" className="btn border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg">
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
