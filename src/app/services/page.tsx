'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import {
  ArrowLeft,
  ArrowRight,
  Palette,
  TrendingUp,
  Database,
  Globe,
  Video,
  Package
} from 'lucide-react'

interface Service {
  id: string
  name: string
  description: string
  icon: string
  color: string
  slug: string
  is_active: boolean
  sort_order: number
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (error) {
        console.error('Error loading services:', error)
        return
      }

      setServices(data || [])
    } catch (error) {
      console.error('Error loading services:', error)
    } finally {
      setLoading(false)
    }
  }

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Palette':
        return <Palette className="w-8 h-8" />
      case 'TrendingUp':
        return <TrendingUp className="w-8 h-8" />
      case 'Database':
        return <Database className="w-8 h-8" />
      case 'Globe':
        return <Globe className="w-8 h-8" />
      case 'Video':
        return <Video className="w-8 h-8" />
      default:
        return <Package className="w-8 h-8" />
    }
  }

  const getServiceColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'blue': 'from-blue-500 to-blue-600',
      'green': 'from-green-500 to-green-600',
      'purple': 'from-purple-500 to-purple-600',
      'red': 'from-red-500 to-red-600',
      'yellow': 'from-yellow-500 to-yellow-600',
      'indigo': 'from-indigo-500 to-indigo-600',
      'pink': 'from-pink-500 to-pink-600',
      'teal': 'from-teal-500 to-teal-600'
    }
    return colorMap[color] || 'from-blue-500 to-blue-600'
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
            
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Package className="w-6 h-6 ml-2" />
              خدماتنا
            </h1>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-6">
            خدمات التسويق والتصميم الاحترافية
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            نقدم مجموعة شاملة من الخدمات المتخصصة في التصميم والتسويق والمونتاج لتلبية جميع احتياجاتك
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {services.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">لا توجد خدمات متاحة</h3>
              <p className="text-gray-600">سيتم إضافة الخدمات قريباً</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="group"
                >
                  <div className={`bg-gradient-to-br ${getServiceColor(service.color)} text-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}>
                    <div className="text-center">
                      <div className="text-white mb-6 flex justify-center">
                        {getServiceIcon(service.icon)}
                      </div>
                      <h3 className="text-2xl font-bold mb-4">{service.name}</h3>
                      <p className="text-white text-opacity-90 mb-6 leading-relaxed">
                        {service.description}
                      </p>
                      <div className="inline-flex items-center bg-white bg-opacity-20 px-6 py-3 rounded-lg text-sm font-medium hover:bg-opacity-30 transition-colors">
                        اطلب الآن
                        <ArrowRight className="w-4 h-4 mr-2" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              لماذا تختار خدماتنا؟
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              نحن نقدم حلول متكاملة وعالية الجودة لجميع احتياجاتك التسويقية والتصميمية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">تصميم احترافي</h3>
              <p className="text-gray-600">
                تصاميم عصرية ومبتكرة تعكس هوية علامتك التجارية بأفضل شكل ممكن
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">استراتيجية تسويقية</h3>
              <p className="text-gray-600">
                خطط تسويقية مدروسة ومبنية على أحدث الاتجاهات والممارسات في السوق
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">محتوى متميز</h3>
              <p className="text-gray-600">
                إنتاج محتوى بصري ومرئي عالي الجودة يجذب جمهورك المستهدف
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">جاهز لبدء مشروعك؟</h2>
          <p className="text-xl mb-8">تواصل معنا اليوم واحصل على استشارة مجانية</p>
          <div className="flex items-center justify-center space-x-4">
            <Link
              href="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              تواصل معنا
            </Link>
            <Link
              href="/packages"
              className="border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors"
            >
              اشترك في باقة
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
