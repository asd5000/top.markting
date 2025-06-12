'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Palette, 
  Megaphone, 
  Video, 
  Database, 
  Globe, 
  Building2, 
  Calendar,
  Star,
  ArrowLeft,
  Phone,
  Mail,
  MapPin
} from 'lucide-react'

export default function HomePage() {
  const [activeService, setActiveService] = useState(0)

  const mainServices = [
    {
      id: 'design',
      name: 'تصميم',
      icon: Palette,
      description: 'خدمات التصميم الجرافيكي والهوية البصرية',
      color: 'from-pink-500 to-rose-500',
      services: ['تصميم لوجو', 'تصميم بنر', 'تصميم غلاف', 'هوية بصرية كاملة']
    },
    {
      id: 'marketing',
      name: 'تسويق',
      icon: Megaphone,
      description: 'خدمات التسويق الرقمي والإعلانات',
      color: 'from-blue-500 to-cyan-500',
      services: ['تسويق منتج', 'تسويق خدمة', 'حملات إعلانية', 'إدارة صفحات']
    },
    {
      id: 'video',
      name: 'مونتاج',
      icon: Video,
      description: 'خدمات المونتاج والفيديو',
      color: 'from-purple-500 to-indigo-500',
      services: ['فيديو تعريفي', 'ريلز', 'موشن جرافيك', 'إنترو مقدمة']
    },
    {
      id: 'data',
      name: 'سحب داتا',
      icon: Database,
      description: 'خدمات استخراج وتحليل البيانات',
      color: 'from-green-500 to-emerald-500',
      services: ['سحب داتا عامة', 'داتا شركات', 'داتا مصانع', 'تحليل البيانات']
    },
    {
      id: 'web',
      name: 'موقع ويب',
      icon: Globe,
      description: 'خدمات تطوير المواقع والتطبيقات',
      color: 'from-orange-500 to-red-500',
      services: ['صفحة هبوط', 'موقع تعريفي', 'متجر إلكتروني', 'تطبيق ويب']
    }
  ]

  const packages = [
    {
      name: 'باقة عادية',
      price: '500',
      duration: 'شهرياً',
      features: ['إدارة صفحة واحدة', '5 منشورات أسبوعياً', 'رد على التعليقات', 'تقرير شهري'],
      color: 'border-gray-200'
    },
    {
      name: 'باقة متوسطة',
      price: '800',
      duration: 'شهرياً',
      features: ['إدارة 3 صفحات', '10 منشورات أسبوعياً', 'رد على التعليقات', 'تقارير أسبوعية', 'حملة إعلانية'],
      color: 'border-blue-500',
      popular: true
    },
    {
      name: 'باقة احترافية',
      price: '1200',
      duration: 'شهرياً',
      features: ['إدارة 5 صفحات', '15 منشور أسبوعياً', 'رد على التعليقات', 'تقارير يومية', '3 حملات إعلانية', 'استشارة مجانية'],
      color: 'border-purple-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Moving Banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white py-2 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          <span className="text-sm font-medium mx-4">
            🌟 صلِّ على محمد ﷺ 🌟 صلِّ على محمد ﷺ 🌟 صلِّ على محمد ﷺ 🌟 صلِّ على محمد ﷺ 🌟 صلِّ على محمد ﷺ 🌟
          </span>
        </div>
      </div>

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
              <Link href="/" className="text-blue-600 font-medium">الرئيسية</Link>
              <Link href="/services" className="text-gray-700 hover:text-blue-600">الخدمات</Link>
              <Link href="/packages" className="text-gray-700 hover:text-blue-600">إدارة الصفحات</Link>
              <Link href="/real-estate" className="text-gray-700 hover:text-blue-600">العقارات</Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600">اتصل بنا</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link href="/visitor-login" className="text-gray-700 hover:text-blue-600">تسجيل دخول الزائر</Link>
              <Link href="/services" className="btn btn-primary">ابدأ الآن</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            نحن نجعل علامتك التجارية تتألق
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            خدمات تسويقية وتصميمية متكاملة لنمو أعمالك
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services" className="btn bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
              استكشف خدماتنا
            </Link>
            <Link href="/contact" className="btn border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg">
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">خدماتنا الأساسية</h2>
            <p className="text-xl text-gray-600">نقدم مجموعة شاملة من الخدمات التسويقية والتقنية</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainServices.map((service, index) => (
              <div 
                key={service.id}
                className="card hover:shadow-lg transition-shadow cursor-pointer"
                onMouseEnter={() => setActiveService(index)}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-lg flex items-center justify-center mb-4`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.services.map((item, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <Star className="w-4 h-4 text-yellow-500 ml-2" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/services" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  اطلب الآن
                  <ArrowLeft className="w-4 h-4 mr-2" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">باقات إدارة الصفحات</h2>
            <p className="text-xl text-gray-600">اختر الباقة المناسبة لاحتياجاتك</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div 
                key={index}
                className={`card relative ${pkg.popular ? 'ring-2 ring-blue-500' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 right-1/2 transform translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      الأكثر شعبية
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {pkg.price} <span className="text-lg text-gray-600">ج.م</span>
                  </div>
                  <p className="text-gray-600">{pkg.duration}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-600">
                      <Star className="w-4 h-4 text-green-500 ml-2" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link 
                  href="/packages"
                  className={`btn w-full ${pkg.popular ? 'btn-primary' : 'border border-gray-300 hover:border-blue-500'}`}
                >
                  اشترك الآن
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Estate Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                تسويق العقارات
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                منصة متكاملة لتسويق وبيع العقارات. سواء كنت بائع أو مشتري، نحن هنا لمساعدتك في العثور على الصفقة المثالية.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Building2 className="w-6 h-6 text-blue-600 ml-3" />
                  <span className="text-gray-700">جميع أنواع العقارات (شقق، فيلل، أراضي، محلات)</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-6 h-6 text-blue-600 ml-3" />
                  <span className="text-gray-700">تغطية شاملة لجميع المحافظات</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-6 h-6 text-blue-600 ml-3" />
                  <span className="text-gray-700">تواصل مباشر بين البائع والمشتري</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/real-estate" className="btn btn-primary px-8 py-3 text-lg">
                  عرض العقارات
                </Link>
                <Link href="/real-estate/register" className="btn bg-green-600 text-white hover:bg-green-700 px-8 py-3 text-lg">
                  إضافة عقار
                </Link>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">أضف عقارك مجاناً</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center ml-3">
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <span>املأ بيانات العقار</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center ml-3">
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <span>ارفع الصور والمستندات</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center ml-3">
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <span>ابدأ في استقبال العروض</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">TM</span>
                </div>
                <span className="mr-3 text-xl font-bold">Top Marketing</span>
              </div>
              <p className="text-gray-400">
                نحن نقدم خدمات تسويقية وتصميمية متكاملة لمساعدة أعمالك على النمو والتطور.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">خدماتنا</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/services" className="hover:text-white">التصميم</Link></li>
                <li><Link href="/services" className="hover:text-white">التسويق</Link></li>
                <li><Link href="/services" className="hover:text-white">المونتاج</Link></li>
                <li><Link href="/services" className="hover:text-white">سحب البيانات</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">روابط سريعة</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/packages" className="hover:text-white">إدارة الصفحات</Link></li>
                <li><Link href="/real-estate" className="hover:text-white">العقارات</Link></li>
                <li><Link href="/contact" className="hover:text-white">اتصل بنا</Link></li>
                <li><Link href="/admin" className="hover:text-white">لوحة التحكم</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">تواصل معنا</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 ml-2" />
                  <span>+20 xxx xxx xxxx</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 ml-2" />
                  <span>info@topmarketing.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 ml-2" />
                  <span>القاهرة، مصر</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Top Marketing. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
