'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { 
  Palette, 
  Video, 
  Database, 
  TrendingUp, 
  Globe, 
  ArrowLeft,
  ExternalLink,
  Star,
  Clock,
  Users
} from 'lucide-react'

interface Service {
  id: number
  name: string
  description: string
  icon: string
  color: string
  slug: string
  is_active: boolean
  sub_services_count?: number
}

const defaultServices = [
  {
    id: 1,
    name: 'التصميم',
    description: 'خدمات التصميم الجرافيكي والهوية البصرية',
    icon: 'palette',
    color: 'from-orange-500 to-red-500',
    slug: 'design',
    is_active: true,
    sub_services_count: 7
  },
  {
    id: 2,
    name: 'المونتاج',
    description: 'خدمات المونتاج والفيديو',
    icon: 'video',
    color: 'from-purple-500 to-pink-500',
    slug: 'video-editing',
    is_active: true,
    sub_services_count: 5
  },
  {
    id: 3,
    name: 'سحب الداتا',
    description: 'خدمات استخراج وتحليل البيانات',
    icon: 'database',
    color: 'from-blue-500 to-cyan-500',
    slug: 'data-extraction',
    is_active: true,
    sub_services_count: 5
  },
  {
    id: 4,
    name: 'التسويق',
    description: 'خدمات التسويق الرقمي والحملات الإعلانية',
    icon: 'trending-up',
    color: 'from-green-500 to-emerald-500',
    slug: 'marketing',
    is_active: true,
    sub_services_count: 6
  },
  {
    id: 5,
    name: 'مواقع الويب',
    description: 'تطوير وتصميم المواقع الإلكترونية',
    icon: 'globe',
    color: 'from-indigo-500 to-purple-500',
    slug: 'web-development',
    is_active: true,
    sub_services_count: 6
  }
]

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'palette': return Palette
    case 'video': return Video
    case 'database': return Database
    case 'trending-up': return TrendingUp
    case 'globe': return Globe
    default: return Star
  }
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(defaultServices)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          sub_services(count)
        `)
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (error) {
        console.error('Error fetching services:', error)
        // استخدام الخدمات الافتراضية في حالة الخطأ
        setServices(defaultServices)
      } else if (data && data.length > 0) {
        const formattedServices = data.map(service => ({
          ...service,
          sub_services_count: service.sub_services?.[0]?.count || 0
        }))
        setServices(formattedServices)
      } else {
        // استخدام الخدمات الافتراضية إذا لم توجد بيانات
        setServices(defaultServices)
      }
    } catch (error) {
      console.error('Error:', error)
      setServices(defaultServices)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الخدمات...</p>
        </div>
      </div>
    )
  }

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
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">خدماتنا المتخصصة</h1>
              <p className="mt-2 text-gray-600">اختر الخدمة التي تناسب احتياجاتك</p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 ml-2" />
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const IconComponent = getIcon(service.icon)
            
            return (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className={`h-32 bg-gradient-to-r ${service.color} flex items-center justify-center`}>
                  <IconComponent className="w-12 h-12 text-white" />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 ml-1" />
                      <span>{service.sub_services_count || 0} خدمة فرعية</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 ml-1" />
                      <span>متاح الآن</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-medium group-hover:text-blue-700">
                      استكشف الخدمات
                    </span>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            جاهز لبدء مشروعك؟
          </h2>
          <p className="text-xl mb-8 opacity-90">
            تواصل معنا اليوم واحصل على استشارة مجانية
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/packages"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              عرض الباقات
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors"
            >
              تواصل معنا
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
