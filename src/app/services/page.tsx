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
  Package,
  Search,
  Filter,
  Star,
  Eye,
  Sparkles,
  Zap
} from 'lucide-react'

interface Service {
  id: string
  name: string
  description: string
  short_description: string
  icon: string
  color: string
  slug: string
  image_url: string
  icon_url: string
  custom_color: string
  is_active: boolean
  is_featured: boolean
  sort_order: number
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadServices()
  }, [])

  useEffect(() => {
    filterServices()
  }, [services, searchTerm])

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

  const filterServices = () => {
    let filtered = services

    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.short_description && service.short_description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredServices(filtered)
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
      <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center bg-white bg-opacity-20 rounded-full px-6 py-3 mb-6">
              <Sparkles className="w-6 h-6 ml-2" />
              <span className="font-medium">خدمات احترافية متكاملة</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            خدمات التسويق والتصميم
            <span className="block text-yellow-300">الاحترافية</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed text-purple-100">
            نقدم مجموعة شاملة من الخدمات المتخصصة في التصميم والتسويق والمونتاج
            <span className="block mt-2 font-semibold text-yellow-200">بجودة عالمية وأسعار تنافسية</span>
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث عن الخدمة التي تحتاجها..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-12 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg"
              />
            </div>
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm text-purple-200">
            <div className="flex items-center">
              <Zap className="w-5 h-5 ml-2 text-yellow-300" />
              <span>تسليم سريع</span>
            </div>
            <div className="flex items-center">
              <Star className="w-5 h-5 ml-2 text-yellow-300" />
              <span>جودة عالية</span>
            </div>
            <div className="flex items-center">
              <Package className="w-5 h-5 ml-2 text-yellow-300" />
              <span>أسعار تنافسية</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-gray-900">خدماتنا المتخصصة</h2>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {filteredServices.length} خدمة
              </span>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>فلترة</span>
            </button>
          </div>

          {filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {searchTerm ? 'لا توجد نتائج للبحث' : 'لا توجد خدمات متاحة'}
              </h3>
              <p className="text-gray-600">
                {searchTerm ? 'جرب كلمات بحث أخرى' : 'سيتم إضافة الخدمات قريباً'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service, index) => (
                <Link
                  key={service.id}
                  href={`/services/${service.slug || service.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                    {/* Service Image */}
                    <div className="relative h-48 overflow-hidden">
                      {service.image_url ? (
                        <img
                          src={service.image_url}
                          alt={service.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div
                          className={`w-full h-full bg-gradient-to-br ${getServiceColor(service.color)} flex items-center justify-center`}
                        >
                          <div className="text-white">
                            {getServiceIcon(service.icon)}
                          </div>
                        </div>
                      )}

                      {/* Featured Badge */}
                      {service.is_featured && (
                        <div className="absolute top-4 right-4">
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                            <Star className="w-3 h-3 ml-1" />
                            مميز
                          </div>
                        </div>
                      )}

                      {/* Color Accent */}
                      <div
                        className="absolute bottom-0 left-0 right-0 h-1"
                        style={{ backgroundColor: service.custom_color || '#3B82F6' }}
                      ></div>
                    </div>

                    {/* Service Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {service.name}
                        </h3>
                        {service.icon_url && (
                          <img
                            src={service.icon_url}
                            alt=""
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                        )}
                      </div>

                      <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
                        {service.short_description || service.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg text-blue-600 font-medium group-hover:bg-blue-100 transition-colors">
                          <Eye className="w-4 h-4 ml-2" />
                          عرض التفاصيل
                        </div>

                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
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
