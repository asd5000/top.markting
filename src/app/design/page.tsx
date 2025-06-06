'use client'

import { motion } from 'framer-motion'
import { 
  Palette, 
  Layers, 
  Image, 
  FileText,
  CheckCircle,
  Star,
  ArrowLeft,
  Phone,
  MessageCircle
} from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const services = [
  {
    title: 'تصميم الشعارات',
    description: 'تصميم شعارات احترافية تعكس هوية علامتك التجارية',
    icon: Palette,
    features: [
      'تصميم شعار أساسي',
      '3 مفاهيم مختلفة',
      'ملفات عالية الجودة',
      'تعديلات مجانية'
    ],
    price: 'يبدأ من 500 جنيه',
    duration: '3-5 أيام'
  },
  {
    title: 'الهوية البصرية',
    description: 'تطوير هوية بصرية متكاملة لعلامتك التجارية',
    icon: Layers,
    features: [
      'دليل الهوية البصرية',
      'بطاقات العمل',
      'أوراق رسمية',
      'قوالب العروض التقديمية'
    ],
    price: 'يبدأ من 1500 جنيه',
    duration: '1-2 أسبوع'
  },
  {
    title: 'تصميم المطبوعات',
    description: 'تصميم جميع أنواع المطبوعات التسويقية والإعلانية',
    icon: FileText,
    features: [
      'بروشورات وكتالوجات',
      'فلايرز وبوسترات',
      'بطاقات دعوة',
      'تصاميم للطباعة'
    ],
    price: 'يبدأ من 300 جنيه',
    duration: '2-4 أيام'
  },
  {
    title: 'تصميم الوسائط الرقمية',
    description: 'تصميم محتوى بصري لوسائل التواصل الاجتماعي',
    icon: Image,
    features: [
      'منشورات وسائل التواصل',
      'قصص انستجرام',
      'أغلفة الصفحات',
      'إعلانات رقمية'
    ],
    price: 'يبدأ من 200 جنيه',
    duration: '1-3 أيام'
  }
]

const portfolio = [
  {
    title: 'هوية بصرية لشركة تقنية',
    category: 'هوية بصرية',
    image: '/portfolio/design-tech.jpg'
  },
  {
    title: 'تصميم شعار لمطعم',
    category: 'شعار',
    image: '/portfolio/design-restaurant.jpg'
  },
  {
    title: 'كتالوج منتجات',
    category: 'مطبوعات',
    image: '/portfolio/design-catalog.jpg'
  },
  {
    title: 'حملة إعلانية رقمية',
    category: 'وسائط رقمية',
    image: '/portfolio/design-digital.jpg'
  }
]

const process = [
  {
    step: '01',
    title: 'الاستشارة',
    description: 'نناقش معك متطلباتك ورؤيتك للمشروع'
  },
  {
    step: '02',
    title: 'البحث والتخطيط',
    description: 'ندرس السوق والمنافسين لوضع استراتيجية التصميم'
  },
  {
    step: '03',
    title: 'التصميم الأولي',
    description: 'نقدم لك مفاهيم أولية للتصميم للمراجعة'
  },
  {
    step: '04',
    title: 'التطوير والتحسين',
    description: 'نطور التصميم المختار ونضيف التفاصيل النهائية'
  },
  {
    step: '05',
    title: 'التسليم',
    description: 'نسلمك الملفات النهائية بجميع الصيغ المطلوبة'
  }
]

export default function DesignPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="gradient-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                التصميم الجرافيكي
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                نحول أفكارك إلى تصاميم بصرية مذهلة تترك انطباعاً لا يُنسى
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
                >
                  احصل على عرض سعر
                </Link>
                <a
                  href="https://wa.me/201068275557"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-center"
                >
                  تواصل معنا
                </a>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white bg-opacity-10 rounded-2xl p-8 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                    <Palette className="w-8 h-8 mx-auto mb-2" />
                    <span className="text-sm">شعارات</span>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                    <Layers className="w-8 h-8 mx-auto mb-2" />
                    <span className="text-sm">هوية بصرية</span>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                    <FileText className="w-8 h-8 mx-auto mb-2" />
                    <span className="text-sm">مطبوعات</span>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                    <Image className="w-8 h-8 mx-auto mb-2" />
                    <span className="text-sm">وسائط رقمية</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              خدمات التصميم الجرافيكي
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              نقدم مجموعة شاملة من خدمات التصميم الجرافيكي لتلبية جميع احتياجاتك البصرية
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="bg-purple-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                  <service.icon className="w-8 h-8 text-purple-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <div className="space-y-3 mb-6">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 ml-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-sm text-gray-500">السعر:</span>
                      <div className="font-bold text-gray-900">{service.price}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">المدة:</span>
                      <div className="font-bold text-gray-900">{service.duration}</div>
                    </div>
                  </div>
                  
                  <Link
                    href="/contact"
                    className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center group"
                  >
                    <span>اطلب الخدمة</span>
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              كيف نعمل
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              عملية منظمة ومدروسة لضمان الحصول على أفضل النتائج
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {process.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                className="text-center"
              >
                <div className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              أعمالنا في التصميم
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              مجموعة مختارة من أفضل مشاريع التصميم التي نفذناها
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {portfolio.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
              >
                <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-600 relative">
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                    <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Palette className="w-8 h-8 mx-auto mb-2" />
                      <span className="text-sm font-medium">عرض المشروع</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.category}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/portfolio"
              className="inline-flex items-center bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              <span>شاهد جميع الأعمال</span>
              <ArrowLeft className="w-5 h-5 mr-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              جاهز لبدء مشروع التصميم؟
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              تواصل معنا اليوم واحصل على استشارة مجانية وعرض سعر مخصص لمشروعك
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                <Phone className="w-5 h-5 ml-2" />
                احصل على عرض سعر
              </Link>
              <a
                href="https://wa.me/201068275557"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5 ml-2" />
                واتساب
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
