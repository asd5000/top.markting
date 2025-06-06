'use client'

import { motion } from 'framer-motion'
import { 
  Palette, 
  Code, 
  TrendingUp, 
  Database, 
  Users, 
  Building,
  ArrowLeft,
  CheckCircle,
  Star
} from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const services = [
  {
    id: 'design',
    title: 'التصميم الجرافيكي',
    description: 'تصميم شعارات، هويات بصرية، ومواد تسويقية احترافية تعكس هوية علامتك التجارية',
    icon: Palette,
    color: 'bg-purple-500',
    href: '/design',
    features: [
      'تصميم الشعارات والهويات البصرية',
      'تصميم المواد التسويقية والإعلانية',
      'تصميم واجهات المستخدم UI/UX',
      'تصميم المطبوعات والكتالوجات'
    ],
    price: 'يبدأ من 500 جنيه',
    duration: '3-7 أيام'
  },
  {
    id: 'web-development',
    title: 'تطوير المواقع',
    description: 'تطوير مواقع ويب وتطبيقات متجاوبة وحديثة باستخدام أحدث التقنيات',
    icon: Code,
    color: 'bg-blue-500',
    href: '/web-development',
    features: [
      'مواقع ويب متجاوبة وسريعة',
      'متاجر إلكترونية متكاملة',
      'تطبيقات ويب تفاعلية',
      'أنظمة إدارة المحتوى'
    ],
    price: 'يبدأ من 2000 جنيه',
    duration: '1-4 أسابيع'
  },
  {
    id: 'marketing',
    title: 'التسويق الرقمي',
    description: 'حملات تسويقية مدروسة لزيادة المبيعات والوصول لجمهورك المستهدف',
    icon: TrendingUp,
    color: 'bg-green-500',
    href: '/marketing',
    features: [
      'إدارة حسابات وسائل التواصل',
      'حملات إعلانية مدفوعة',
      'تحسين محركات البحث SEO',
      'التسويق بالمحتوى'
    ],
    price: 'يبدأ من 1000 جنيه شهرياً',
    duration: 'خدمة مستمرة'
  },
  {
    id: 'data-extraction',
    title: 'استخراج البيانات',
    description: 'جمع وتحليل البيانات من مصادر مختلفة لمساعدتك في اتخاذ قرارات مدروسة',
    icon: Database,
    color: 'bg-orange-500',
    href: '/data-extraction',
    features: [
      'استخراج بيانات من المواقع',
      'تنظيف وتحليل البيانات',
      'إنشاء تقارير تفصيلية',
      'أتمتة عمليات جمع البيانات'
    ],
    price: 'يبدأ من 300 جنيه',
    duration: '1-5 أيام'
  },
  {
    id: 'followers',
    title: 'زيادة المتابعين',
    description: 'خدمات زيادة المتابعين والتفاعل على وسائل التواصل الاجتماعي بطرق آمنة',
    icon: Users,
    color: 'bg-pink-500',
    href: '/followers',
    features: [
      'زيادة متابعين حقيقيين',
      'تحسين معدل التفاعل',
      'إدارة المحتوى اليومي',
      'تحليل الأداء والإحصائيات'
    ],
    price: 'يبدأ من 200 جنيه',
    duration: '1-30 يوم'
  },
  {
    id: 'real-estate',
    title: 'التسويق العقاري',
    description: 'حلول تسويقية متخصصة للقطاع العقاري لزيادة المبيعات والإيجارات',
    icon: Building,
    color: 'bg-indigo-500',
    href: '/real-estate',
    features: [
      'تصوير وتسويق العقارات',
      'إنشاء جولات افتراضية',
      'حملات إعلانية متخصصة',
      'إدارة قواعد بيانات العملاء'
    ],
    price: 'يبدأ من 800 جنيه',
    duration: '1-2 أسابيع'
  }
]

const whyChooseUs = [
  {
    title: 'خبرة واسعة',
    description: 'أكثر من 5 سنوات في مجال الخدمات الرقمية',
    icon: Star
  },
  {
    title: 'جودة عالية',
    description: 'نلتزم بأعلى معايير الجودة في جميع مشاريعنا',
    icon: CheckCircle
  },
  {
    title: 'أسعار تنافسية',
    description: 'أسعار مناسبة لجميع الميزانيات مع ضمان الجودة',
    icon: TrendingUp
  },
  {
    title: 'دعم مستمر',
    description: 'دعم فني متواصل حتى بعد تسليم المشروع',
    icon: Users
  }
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="gradient-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              خدماتنا المتميزة
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              نقدم مجموعة شاملة من الخدمات الرقمية والتسويقية لمساعدتك في تحقيق أهدافك
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className={`${service.color} w-16 h-16 rounded-lg flex items-center justify-center mb-4`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 ml-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4 mb-4">
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                      <span>السعر:</span>
                      <span className="font-semibold text-gray-900">{service.price}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>المدة:</span>
                      <span className="font-semibold text-gray-900">{service.duration}</span>
                    </div>
                  </div>
                  
                  <Link
                    href={service.href}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center group"
                  >
                    <span>اعرف المزيد</span>
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              لماذا تختار توب ماركتنج؟
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              نحن نقدم أكثر من مجرد خدمات، نحن شريكك في النجاح
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                className="text-center"
              >
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </motion.div>
            ))}
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
              جاهز لبدء مشروعك؟
            </h2>
            <p className="text-xl mb-8 opacity-90">
              تواصل معنا اليوم واحصل على استشارة مجانية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                احصل على عرض سعر
              </Link>
              <a
                href="https://wa.me/201068275557"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
              >
                تواصل عبر واتساب
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
