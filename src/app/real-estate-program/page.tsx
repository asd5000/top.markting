'use client'

import { useState, useEffect } from 'react'
import {
  Building, Search, Filter, Plus, Edit, Trash2, Eye,
  MapPin, DollarSign, Home, Users, Phone, Mail,
  CheckCircle, XCircle, Clock, Star, ArrowLeft, Save, X, MessageCircle,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Property {
  id: string
  user_id?: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  customer_whatsapp?: string
  description?: string
  property_type: string
  listing_type: string
  price: number
  area?: number
  bedrooms?: number
  bathrooms?: number
  floor_number?: number
  total_floors?: number
  governorate?: string
  city?: string
  district?: string
  address?: string
  has_garden?: boolean
  has_parking?: boolean
  has_elevator?: boolean
  has_balcony?: boolean
  is_furnished?: boolean
  has_security?: boolean
  status: 'pending' | 'approved' | 'rejected' | 'featured'
  created_at: string
  users?: {
    id: string
    name: string
    email: string
    phone: string
  }
}

export default function RealEstateProgramPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterListingType, setFilterListingType] = useState('all')
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [newProperty, setNewProperty] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    customer_whatsapp: '',
    property_type: 'apartment',
    listing_type: 'sale',
    title: '',
    description: '',
    governorate: '',
    city: '',
    district: '',
    address: '',
    area: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    floor_number: '',
    total_floors: '',
    has_garden: false,
    has_parking: false,
    has_elevator: false,
    has_balcony: false,
    is_furnished: false,
    has_security: false,
    notes: ''
  })

  useEffect(() => {
    loadProperties()

    // تحديث تلقائي كل 30 ثانية
    const interval = setInterval(() => {
      loadProperties()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // إعادة تحميل عند التركيز على النافذة
  useEffect(() => {
    const handleFocus = () => {
      loadProperties()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const loadProperties = async () => {
    try {
      setLoading(true)

      // تحميل العقارات من Supabase مع بيانات المستخدمين
      const { data: propertiesData, error } = await supabase
        .from('properties')
        .select(`
          *,
          users (
            id,
            name,
            email,
            phone
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading properties:', error)
        return
      }

      console.log('Loaded properties from database:', propertiesData)
      setProperties(propertiesData || [])

    } catch (error) {
      console.error('Error loading properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (property.city && property.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (property.district && property.district.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (property.description && property.description.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesType = filterType === 'all' || property.property_type === filterType
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus
    const matchesListingType = filterListingType === 'all' || property.listing_type === filterListingType

    return matchesSearch && matchesType && matchesStatus && matchesListingType
  })

  // إحصائيات العقارات
  const getStatistics = () => {
    const stats = {
      total: properties.length,
      sellers: properties.filter(p => p.listing_type === 'sale').length,
      buyers: properties.filter(p => p.listing_type === 'rent').length,
      byType: {} as { [key: string]: { sellers: number, buyers: number } }
    }

    // إحصائيات حسب نوع العقار
    const propertyTypes = ['apartment', 'villa', 'house', 'land', 'shop', 'office']
    propertyTypes.forEach(type => {
      stats.byType[type] = {
        sellers: properties.filter(p => p.property_type === type && p.listing_type === 'sale').length,
        buyers: properties.filter(p => p.property_type === type && p.listing_type === 'rent').length
      }
    })

    return stats
  }

  // البحث عن توافق محتمل
  const findMatches = (property: Property) => {
    if (!property) return []

    const oppositeType = property.listing_type === 'sale' ? 'rent' : 'sale'

    return properties.filter(p =>
      p.id !== property.id &&
      p.listing_type === oppositeType &&
      p.property_type === property.property_type &&
      p.city === property.city &&
      Math.abs((p.price || 0) - (property.price || 0)) <= (property.price || 0) * 0.2 && // فرق السعر أقل من 20%
      Math.abs((p.area || 0) - (property.area || 0)) <= (property.area || 0) * 0.3 // فرق المساحة أقل من 30%
    )
  }

  const handleStatusChange = async (propertyId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', propertyId)

      if (error) {
        console.error('Error updating property status:', error)
        alert('حدث خطأ أثناء تحديث حالة العقار')
        return
      }

      // تحديث الحالة محلياً
      setProperties(properties.map(property =>
        property.id === propertyId
          ? { ...property, status: newStatus as any }
          : property
      ))

      alert('تم تحديث حالة العقار بنجاح!')
    } catch (error) {
      console.error('Error updating property status:', error)
      alert('حدث خطأ أثناء تحديث حالة العقار')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'featured': return 'bg-blue-100 text-blue-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      case 'featured': return <Star className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getPropertyTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      apartment: 'شقة',
      villa: 'فيلا',
      house: 'بيت',
      land: 'أرض',
      shop: 'محل',
      office: 'مكتب'
    }
    return types[type] || type
  }

  const formatWhatsAppNumber = (phone: string) => {
    if (!phone) return ''

    // إزالة أي رموز غير رقمية
    let cleanNumber = phone.replace(/\D/g, '')

    // إضافة كود مصر إذا لم يكن موجود
    if (cleanNumber.startsWith('01')) {
      cleanNumber = '2' + cleanNumber
    } else if (!cleanNumber.startsWith('2')) {
      cleanNumber = '2' + cleanNumber
    }

    return cleanNumber
  }

  const getWhatsAppLink = (phone: string, customerName: string, propertyTitle: string) => {
    const formattedNumber = formatWhatsAppNumber(phone)
    const message = encodeURIComponent(
      `مرحباً ${customerName}،\n\nبخصوص العقار: ${propertyTitle}\n\nنحن هنا لخدمتكم.`
    )
    return `https://wa.me/${formattedNumber}?text=${message}`
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-gray-600 hover:text-blue-600 ml-4">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Building className="w-6 h-6 text-green-600 ml-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">برنامج التسويق العقاري المتكامل</h1>
              <p className="text-gray-600">نظام احترافي شامل لإدارة البائعين والمشترين العقاريين مع مطابقة ذكية وإحصائيات متقدمة</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setActiveTab('statistics')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <BarChart3 className="w-4 h-4 ml-2" />
              الإحصائيات
            </button>

            <button
              onClick={() => setActiveTab('matching')}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <Users className="w-4 h-4 ml-2" />
              المطابقة
            </button>

            <button
              onClick={() => setShowAddForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 ml-2" />
              إضافة عقار جديد
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'dashboard', name: 'لوحة التحكم', icon: Home },
                { id: 'properties', name: 'إدارة العقارات', icon: Building },
                { id: 'matching', name: 'المطابقة والتوافق', icon: Users },
                { id: 'statistics', name: 'الإحصائيات', icon: BarChart3 },
                { id: 'clients', name: 'إدارة العملاء', icon: Users }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <tab.icon className="w-4 h-4 ml-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">إجمالي العقارات</p>
                    <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">موافق عليها</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {properties.filter(p => p.status === 'approved').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">في الانتظار</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {properties.filter(p => p.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">مميزة</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {properties.filter(p => p.status === 'featured').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Properties */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">العقارات الحديثة</h3>
              <div className="space-y-4">
                {properties.slice(0, 5).map((property) => (
                  <div key={property.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        property.listing_type === 'sale' ? 'bg-blue-100' : 'bg-orange-100'
                      }`}>
                        {property.listing_type === 'sale' ?
                          <Home className="w-5 h-5 text-blue-600" /> :
                          <Users className="w-5 h-5 text-orange-600" />
                        }
                      </div>
                      <div className="mr-3">
                        <p className="font-medium text-gray-900">{property.customer_name}</p>
                        <p className="text-sm text-gray-600">
                          {getPropertyTypeLabel(property.property_type)} - {property.city}
                        </p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{property.price.toLocaleString()} ج.م</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(property.status)}`}>
                        {property.status === 'approved' ? 'موافق عليه' :
                         property.status === 'rejected' ? 'مرفوض' :
                         property.status === 'featured' ? 'مميز' : 'معلق'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Properties Management Tab */}
        {activeTab === 'properties' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="بحث بالاسم أو العنوان..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">جميع الأنواع</option>
                  <option value="apartment">شقة</option>
                  <option value="villa">فيلا</option>
                  <option value="house">بيت</option>
                  <option value="land">أرض</option>
                  <option value="shop">محل</option>
                  <option value="office">مكتب</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="pending">معلق</option>
                  <option value="approved">موافق عليه</option>
                  <option value="rejected">مرفوض</option>
                  <option value="featured">مميز</option>
                </select>

                <select
                  value={filterListingType}
                  onChange={(e) => setFilterListingType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">جميع العملاء</option>
                  <option value="sale">بائعين</option>
                  <option value="rent">مشترين</option>
                </select>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {filteredProperties.length} عقار
                  </span>
                  <button className="text-green-600 hover:text-green-700 flex items-center text-sm">
                    <Filter className="w-4 h-4 ml-1" />
                    تصفية متقدمة
                  </button>
                </div>
              </div>
            </div>

            {/* Properties Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">جاري تحميل العقارات...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
              <div key={property.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        property.listing_type === 'sale' ? 'bg-blue-100' : 'bg-orange-100'
                      }`}>
                        {property.listing_type === 'sale' ?
                          <Home className="w-4 h-4 text-blue-600" /> :
                          <Users className="w-4 h-4 text-orange-600" />
                        }
                      </div>
                      <div className="mr-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(property.status)}`}>
                          {getStatusIcon(property.status)}
                          <span className="mr-1">
                            {property.status === 'approved' ? 'موافق عليه' :
                             property.status === 'rejected' ? 'مرفوض' :
                             property.status === 'featured' ? 'مميز' : 'معلق'}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-1">
                      {(() => {
                        const matches = findMatches(property)
                        return matches.length > 0 && (
                          <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium ml-2">
                            <Users className="w-3 h-3 ml-1" />
                            {matches.length} توافق
                          </div>
                        )
                      })()}
                      <button className="p-1 text-gray-400 hover:text-blue-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {getPropertyTypeLabel(property.property_type)} {property.listing_type === 'sale' ? 'للبيع' : 'للإيجار'}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{property.description || 'لا يوجد وصف'}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 ml-2" />
                      {property.district && property.city ? `${property.district}, ${property.city}` :
                       property.city ? property.city :
                       property.governorate ? property.governorate : 'غير محدد'}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Building className="w-4 h-4 ml-2" />
                      {getPropertyTypeLabel(property.property_type)}
                      {property.area && ` - ${property.area} م²`}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 ml-2" />
                      {property.price.toLocaleString()} ج.م
                    </div>
                    {(property.bedrooms || property.bathrooms) && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Home className="w-4 h-4 ml-2" />
                        {property.bedrooms && `${property.bedrooms} غرف`}
                        {property.bedrooms && property.bathrooms && ' - '}
                        {property.bathrooms && `${property.bathrooms} حمام`}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{property.customer_name}</p>
                        <p className="text-xs text-gray-500">{property.listing_type === 'sale' ? 'بائع' : 'مشتري'}</p>
                        <p className="text-xs text-gray-400">{property.customer_phone}</p>
                        {property.users && (
                          <p className="text-xs text-blue-600">مسجل: {property.users.name}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <a
                          href={`tel:${property.customer_phone}`}
                          className="p-1 text-gray-400 hover:text-green-600"
                          title="اتصال"
                        >
                          <Phone className="w-4 h-4" />
                        </a>

                        {property.customer_email && (
                          <a
                            href={`mailto:${property.customer_email}`}
                            className="p-1 text-gray-400 hover:text-blue-600"
                            title="إيميل"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        )}

                        {(property.customer_whatsapp || property.customer_phone) && (
                          <a
                            href={getWhatsAppLink(
                              property.customer_whatsapp || property.customer_phone,
                              property.customer_name,
                              `${getPropertyTypeLabel(property.property_type)} ${property.listing_type === 'sale' ? 'للبيع' : 'للإيجار'}`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-gray-400 hover:text-green-600 bg-green-50 hover:bg-green-100 rounded"
                            title="واتساب"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                        )}

                        {/* أزرار الحالة */}
                        <div className="flex space-x-1 mr-2">
                          {property.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(property.id, 'approved')}
                                className="p-1 text-gray-400 hover:text-green-600"
                                title="موافقة"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleStatusChange(property.id, 'rejected')}
                                className="p-1 text-gray-400 hover:text-red-600"
                                title="رفض"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {property.status === 'approved' && (
                            <button
                              onClick={() => handleStatusChange(property.id, 'featured')}
                              className="p-1 text-gray-400 hover:text-blue-600"
                              title="جعل مميز"
                            >
                              <Star className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
