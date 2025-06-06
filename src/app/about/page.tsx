'use client'

import { motion } from 'framer-motion'
import { 
  Target, 
  Eye, 
  Heart, 
  Users, 
  Award, 
  Clock,
  CheckCircle,
  Star
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const stats = [
  { number: '500+', label: 'عميل راضي', icon: Users },
  { number: '1000+', label: 'مشروع مكتمل', icon: CheckCircle },
  { number: '5+', label: 'سنوات خبرة', icon: Clock },
  { number: '24/7', label: 'دعم فني', icon: Award }
]

const values = [
  {
    title: 'الجودة',
    description: 'نلتزم بأعلى معايير الجودة في جميع مشاريعنا',
    icon: Award,
    color: 'bg-blue-500'
  },
  {
    title: 'الابتكار',
    description: 'نستخدم أحدث التقنيات والأساليب المبتكرة',
    icon: Star,
    color: 'bg-purple-500'
  },
  {
    title: 'الشفافية',
    description: 'نؤمن بالشفافية الكاملة مع عملائنا',
    icon: Eye,
    color: 'bg-green-500'
  },
  {
    title: 'الالتزام',
    description: 'نلتزم بالمواعيد المحددة ونحترم وقت عملائنا',
    icon: Clock,
    color: 'bg-orange-500'
  }
]

const team = [
  {
    name: 'أحمد محمد',
    role: 'مدير المشاريع',
    description: 'خبرة 8 سنوات في إدارة المشاريع الرقمية',
    image: '/team/ahmed.jpg'
  },
  {
    name: 'فاطمة علي',
    role: 'مصممة جرافيك',
    description: 'متخصصة في التصميم الجرافيكي والهويات البصرية',
    image: '/team/fatma.jpg'
  },
  {
    name: 'محمد حسن',
    role: 'مطور ويب',
    description: 'خبير في تطوير المواقع والتطبيقات',
    image: '/team/mohamed.jpg'
  },
  {
    name: 'سارة أحمد',
    role: 'أخصائية تسويق',
    description: 'متخصصة في التسويق الرقمي ووسائل التواصل',
    image: '/team/sara.jpg'
  }
]

export default function AboutPage() {
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
              من نحن
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              شركة توب ماركتنج - شريكك المثالي في عالم الخدمات الرقمية والتسويقية
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                قصتنا
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                بدأت توب ماركتنج كحلم صغير في عام 2019، برؤية واضحة لتقديم خدمات رقمية متميزة 
                تساعد الشركات والأفراد على تحقيق أهدافهم في العالم الرقمي.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                على مدار السنوات، نمت الشركة لتصبح واحدة من الشركات الرائدة في مجال الخدمات 
                الرقمية في مصر، حيث خدمنا أكثر من 500 عميل وأنجزنا أكثر من 1000 مشروع ناجح.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                نحن نؤمن بأن النجاح يأتي من خلال الشراكة الحقيقية مع عملائنا، ولذلك نسعى دائماً 
                لفهم احتياجاتهم وتقديم حلول مبتكرة تتجاوز توقعاتهم.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">رؤيتنا</h3>
                <p className="text-lg opacity-90 mb-6">
                  أن نكون الشركة الرائدة في مجال الخدمات الرقمية في الشرق الأوسط
                </p>
                <h3 className="text-2xl font-bold mb-4">رسالتنا</h3>
                <p className="text-lg opacity-90">
                  تمكين الشركات والأفراد من تحقيق أهدافهم الرقمية من خلال حلول مبتكرة وخدمات متميزة
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              إنجازاتنا بالأرقام
            </h2>
            <p className="text-xl text-gray-600">
              أرقام تتحدث عن جودة خدماتنا ورضا عملائنا
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="text-center bg-white rounded-xl p-6 shadow-lg"
              >
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              قيمنا
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              القيم التي نؤمن بها وتوجه عملنا اليومي
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                className="text-center group"
              >
                <div className={`${value.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              فريق العمل
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              فريق من المحترفين المتخصصين في مختلف المجالات الرقمية
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                    <Users className="w-12 h-12 text-gray-400" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.description}
                  </p>
                </div>
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
              انضم إلى عائلة عملائنا الراضين
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              دعنا نساعدك في تحقيق أهدافك الرقمية وبناء حضور قوي على الإنترنت
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                تواصل معنا
              </a>
              <a
                href="/portfolio"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
              >
                شاهد أعمالنا
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
