'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Clock,
  Send,
  CheckCircle
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { toast } from 'react-hot-toast'

const contactInfo = [
  {
    title: 'الهاتف',
    value: '+201068275557',
    icon: Phone,
    href: 'tel:+201068275557',
    color: 'bg-blue-500'
  },
  {
    title: 'البريد الإلكتروني',
    value: 'info@topmarketing.com',
    icon: Mail,
    href: 'mailto:info@topmarketing.com',
    color: 'bg-green-500'
  },
  {
    title: 'واتساب',
    value: '+201068275557',
    icon: MessageCircle,
    href: 'https://wa.me/201068275557',
    color: 'bg-green-600'
  },
  {
    title: 'العنوان',
    value: 'القاهرة، مصر',
    icon: MapPin,
    href: '#',
    color: 'bg-purple-500'
  }
]

const workingHours = [
  { day: 'السبت - الخميس', hours: '9:00 ص - 6:00 م' },
  { day: 'الجمعة', hours: '2:00 م - 6:00 م' },
  { day: 'الدعم الفني', hours: '24/7' }
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً')
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      })
    } catch (error) {
      toast.error('حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى')
    } finally {
      setIsSubmitting(false)
    }
  }

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
              تواصل معنا
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              نحن هنا لمساعدتك. تواصل معنا اليوم واحصل على استشارة مجانية
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <motion.a
                key={index}
                href={info.href}
                target={info.href.startsWith('http') ? '_blank' : undefined}
                rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer group"
              >
                <div className={`${info.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <info.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {info.title}
                </h3>
                <p className="text-gray-600">
                  {info.value}
                </p>
              </motion.a>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                أرسل لنا رسالة
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="form-label">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="form-label">
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="form-label">
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="أدخل رقم هاتفك"
                  />
                </div>

                <div>
                  <label htmlFor="service" className="form-label">
                    الخدمة المطلوبة
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="">اختر الخدمة</option>
                    <option value="design">التصميم الجرافيكي</option>
                    <option value="web-development">تطوير المواقع</option>
                    <option value="marketing">التسويق الرقمي</option>
                    <option value="data-extraction">استخراج البيانات</option>
                    <option value="followers">زيادة المتابعين</option>
                    <option value="real-estate">التسويق العقاري</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="form-label">
                    الرسالة *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="form-input resize-none"
                    placeholder="اكتب رسالتك هنا..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner ml-2" />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 ml-2" />
                      إرسال الرسالة
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Working Hours */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Clock className="w-6 h-6 ml-2 text-blue-600" />
                  ساعات العمل
                </h3>
                <div className="space-y-4">
                  {workingHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-600">{schedule.day}</span>
                      <span className="font-semibold text-gray-900">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Contact */}
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-8 text-white">
                <h3 className="text-xl font-bold mb-4">
                  تحتاج مساعدة فورية؟
                </h3>
                <p className="mb-6 opacity-90">
                  تواصل معنا مباشرة عبر الهاتف أو واتساب للحصول على رد سريع
                </p>
                <div className="space-y-3">
                  <a
                    href="tel:+201068275557"
                    className="flex items-center justify-center w-full bg-white text-blue-600 py-3 px-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    <Phone className="w-5 h-5 ml-2" />
                    اتصل بنا الآن
                  </a>
                  <a
                    href="https://wa.me/201068275557"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full border-2 border-white text-white py-3 px-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5 ml-2" />
                    واتساب
                  </a>
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  أسئلة شائعة
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      كم يستغرق تنفيذ المشروع؟
                    </h4>
                    <p className="text-gray-600 text-sm">
                      يختلف وقت التنفيذ حسب نوع وحجم المشروع، عادة من 3 أيام إلى 4 أسابيع
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      هل تقدمون ضمان على الخدمات؟
                    </h4>
                    <p className="text-gray-600 text-sm">
                      نعم، نقدم ضمان على جميع خدماتنا مع دعم فني مجاني لمدة شهر
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      هل يمكنني الحصول على عرض سعر مجاني؟
                    </h4>
                    <p className="text-gray-600 text-sm">
                      بالطبع! نقدم استشارة وعرض سعر مجاني لجميع المشاريع
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
