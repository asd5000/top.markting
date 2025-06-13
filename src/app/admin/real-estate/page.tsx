'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import RouteGuard from '@/components/admin/RouteGuard'
import {
  Building, Search, Plus, Edit, Trash2, Eye,
  MapPin, DollarSign, Home, Users, Phone, Mail,
  Save, X, MessageCircle
} from 'lucide-react'

interface Property {
  id: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  customer_whatsapp?: string
  property_type: 'apartment' | 'villa' | 'land' | 'shop' | 'house' | 'office'
  operation_type: 'sale' | 'rent'
  title: string
  description?: string
  governorate: string
  city: string
  district?: string
  area?: number
  rooms?: number
  bathrooms?: number
  price: number
  price_negotiable: boolean
  created_at: string
}

export default function RealEstateManagement() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterOperation, setFilterOperation] = useState('all')
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error' | null
    text: string
  }>({ type: null, text: '' })

  const [newProperty, setNewProperty] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    customer_whatsapp: '',
    property_type: 'apartment',
    operation_type: 'sale',
    title: '',
    description: '',
    governorate: '',
    city: '',
    district: '',
    area: '',
    rooms: '',
    bathrooms: '',
    price: '',
    price_negotiable: false
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
      console.log('🏠 تحميل العقارات من قاعدة البيانات...')

      const { data: propertiesData, error } = await supabase
        .from('real_estate')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ خطأ في تحميل العقارات:', error)
        alert(`خطأ في تحميل العقارات: ${error.message}`)
        return
      }

      console.log('✅ تم تحميل العقارات بنجاح:', propertiesData)
      setProperties(propertiesData || [])

    } catch (error) {
      console.error('❌ خطأ عام في تحميل العقارات:', error)
      alert('حدث خطأ أثناء تحميل العقارات')
    } finally {
      setLoading(false)
    }
  }

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (property.city && property.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (property.district && property.district.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (property.title && property.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         property.customer_phone.includes(searchTerm)

    const matchesType = filterType === 'all' || property.property_type === filterType
    const matchesOperation = filterListingType === 'all' || property.operation_type === filterListingType

    return matchesSearch && matchesType && matchesOperation
  })

  // إحصائيات العقارات
  const getStatistics = () => {
    const stats = {
      total: properties.length,
      sellers: properties.filter(p => p.listing_type === 'seller').length,
      buyers: properties.filter(p => p.listing_type === 'buyer').length,
      byType: {} as { [key: string]: { sellers: number, buyers: number } }
    }

    // إحصائيات حسب نوع العقار
    const propertyTypes = ['apartment', 'villa', 'house', 'land', 'shop', 'office']
    propertyTypes.forEach(type => {
      stats.byType[type] = {
        sellers: properties.filter(p => p.property_type === type && p.listing_type === 'seller').length,
        buyers: properties.filter(p => p.property_type === type && p.listing_type === 'buyer').length
      }
    })

    return stats
  }

  // البحث عن توافق محتمل بين البائعين والمشترين
  const findMatches = (property: Property) => {
    if (!property) return []

    const oppositeType = property.listing_type === 'seller' ? 'buyer' : 'seller'

    return properties.filter(p =>
      p.id !== property.id &&
      p.listing_type === oppositeType &&
      p.property_type === property.property_type &&
      p.city === property.city &&
      Math.abs((p.price || 0) - (property.price || 0)) <= (property.price || 0) * 0.2 && // فرق السعر أقل من 20%
      Math.abs((p.area || 0) - (property.area || 0)) <= (property.area || 0) * 0.3 // فرق المساحة أقل من 30%
    )
  }

  const handleAddProperty = async () => {
    if (!newProperty.customer_name || !newProperty.customer_phone || !newProperty.title) {
      alert('يرجى ملء جميع الحقول المطلوبة (الاسم، الهاتف، العنوان)')
      return
    }

    try {
      console.log('🏠 إضافة عقار جديد:', newProperty)

      const propertyData = {
        customer_name: newProperty.customer_name.trim(),
        customer_phone: newProperty.customer_phone.trim(),
        customer_email: newProperty.customer_email?.trim() || null,
        customer_whatsapp: newProperty.customer_whatsapp?.trim() || null,
        title: newProperty.title.trim(),
        description: newProperty.description?.trim() || null,
        property_type: newProperty.property_type,
        operation_type: newProperty.listing_type, // تحويل listing_type إلى operation_type
        price: newProperty.price ? parseFloat(newProperty.price) : 0,
        area: newProperty.area ? parseFloat(newProperty.area) : null,
        rooms: newProperty.bedrooms ? parseInt(newProperty.bedrooms) : null,
        bathrooms: newProperty.bathrooms ? parseInt(newProperty.bathrooms) : null,
        floor_number: newProperty.floor_number ? parseInt(newProperty.floor_number) : null,
        total_floors: newProperty.total_floors ? parseInt(newProperty.total_floors) : null,
        governorate: newProperty.governorate.trim(),
        city: newProperty.city.trim(),
        district: newProperty.district?.trim() || null,
        street: newProperty.address?.trim() || null,
        price_negotiable: true, // افتراضي
        payment_method: 'cash', // افتراضي
        status: 'pending', // افتراضي
        priority: 'normal', // افتراضي
        views_count: 0,
        inquiries_count: 0,
        images: []
      }

      const { data, error } = await supabase
        .from('real_estate')
        .insert([propertyData])
        .select()

      if (error) {
        console.error('❌ خطأ في إضافة العقار:', error)
        alert(`خطأ في إضافة العقار: ${error.message}`)
        return
      }

      console.log('✅ تم إضافة العقار بنجاح:', data)

      // إعادة تحميل العقارات
      await loadProperties()

      // إعادة تعيين النموذج
      setNewProperty({
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

      setShowAddForm(false)
      alert('تم إضافة العقار بنجاح!')
    } catch (error) {
      console.error('❌ خطأ عام في إضافة العقار:', error)
      alert('حدث خطأ أثناء إضافة العقار')
    }
  }

  // تم إزالة دالة تغيير الحالة - البرنامج لجمع البيانات فقط

  const handleDeleteProperty = async (propertyId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا العقار؟')) {
      try {
        const { error } = await supabase
          .from('real_estate')
          .delete()
          .eq('id', propertyId)

        if (error) {
          console.error('Error deleting property:', error)
          alert('حدث خطأ أثناء حذف العقار')
          return
        }

        // تحديث القائمة محلياً
        setProperties(properties.filter(property => property.id !== propertyId))
        alert('تم حذف العقار بنجاح!')
      } catch (error) {
        console.error('Error deleting property:', error)
        alert('حدث خطأ أثناء حذف العقار')
      }
    }
  }

  const handleViewProperty = (property: Property) => {
    setSelectedProperty(property)
  }

  const handleEditProperty = (property: Property) => {
    setNewProperty({
      customer_name: property.customer_name,
      customer_phone: property.customer_phone,
      customer_email: property.customer_email || '',
      customer_whatsapp: property.customer_whatsapp || '',
      property_type: property.property_type,
      listing_type: property.listing_type,
      title: (property as any).title || '',
      description: (property as any).description || '',
      governorate: (property as any).governorate || '',
      city: (property as any).city || '',
      district: property.district || '',
      address: property.address || '',
      area: property.area?.toString() || '',
      price: property.price.toString(),
      bedrooms: property.bedrooms?.toString() || '',
      bathrooms: property.bathrooms?.toString() || '',
      floor_number: property.floor_number?.toString() || '',
      total_floors: property.total_floors?.toString() || '',
      has_garden: property.has_garden || false,
      has_parking: property.has_parking || false,
      has_elevator: property.has_elevator || false,
      has_balcony: property.has_balcony || false,
      is_furnished: property.is_furnished || false,
      has_security: property.has_security || false,
      notes: ''
    })
    setSelectedProperty(property)
    setShowAddForm(true)
  }

  const handleUpdateProperty = async () => {
    if (!selectedProperty || !newProperty.customer_name || !newProperty.customer_phone) {
      alert('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    try {
      const { data, error } = await supabase
        .from('real_estate')
        .update({
          customer_name: newProperty.customer_name.trim(),
          customer_phone: newProperty.customer_phone.trim(),
          customer_email: newProperty.customer_email?.trim() || null,
          customer_whatsapp: newProperty.customer_whatsapp?.trim() || null,
          title: newProperty.title?.trim() || `${getPropertyTypeLabel(newProperty.property_type)} ${newProperty.listing_type === 'seller' ? 'للبيع' : 'للشراء'}`,
          description: newProperty.description?.trim() || null,
          property_type: newProperty.property_type,
          operation_type: newProperty.listing_type,
          price: newProperty.price ? parseFloat(newProperty.price) : 0,
          area: newProperty.area ? parseFloat(newProperty.area) : null,
          rooms: newProperty.bedrooms ? parseInt(newProperty.bedrooms) : null,
          bathrooms: newProperty.bathrooms ? parseInt(newProperty.bathrooms) : null,
          floor_number: newProperty.floor_number ? parseInt(newProperty.floor_number) : null,
          total_floors: newProperty.total_floors ? parseInt(newProperty.total_floors) : null,
          governorate: newProperty.governorate.trim(),
          city: newProperty.city.trim(),
          district: newProperty.district?.trim() || null,
          street: newProperty.address?.trim() || null,
          has_garden: newProperty.has_garden || false,
          has_parking: newProperty.has_parking || false,
          has_elevator: newProperty.has_elevator || false,
          has_balcony: newProperty.has_balcony || false,
          is_furnished: newProperty.is_furnished || false,
          has_security: newProperty.has_security || false,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedProperty.id)
        .select()

      if (error) {
        console.error('Error updating property:', error)
        alert('حدث خطأ أثناء تحديث العقار')
        return
      }

      console.log('Property updated successfully:', data)

      // إعادة تحميل العقارات
      await loadProperties()

      // إعادة تعيين النموذج
      setNewProperty({
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        customer_whatsapp: '',
        property_type: 'apartment',
        listing_type: 'seller',
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

      setSelectedProperty(null)
      setShowAddForm(false)
      alert('تم تحديث العقار بنجاح!')
    } catch (error) {
      console.error('Error updating property:', error)
      alert('حدث خطأ أثناء تحديث العقار')
    }
  }

  // تم إزالة دوال الحالة - البرنامج لجمع البيانات فقط

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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Building className="w-6 h-6 text-green-600 ml-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">برنامج التسويق العقاري</h1>
              <p className="text-gray-600">نظام متكامل لإدارة البائعين والمشترين العقاريين ومقارنة المتطلبات وتقديم اقتراحات آلية بناء على التوافق</p>
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

      {/* Content */}
      <div className="space-y-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
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
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">البائعين</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {properties.filter(p => p.operation_type === 'sale').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">الإيجار</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {properties.filter(p => p.operation_type === 'rent').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Home className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">شقق</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {properties.filter(p => p.property_type === 'apartment').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Building className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">فيلل</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {properties.filter(p => p.property_type === 'villa').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">أراضي</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {properties.filter(p => p.property_type === 'land').length}
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
                        property.listing_type === 'seller' ? 'bg-blue-100' : 'bg-orange-100'
                      }`}>
                        {property.listing_type === 'seller' ?
                          <Home className="w-5 h-5 text-blue-600" /> :
                          <Users className="w-5 h-5 text-orange-600" />
                        }
                      </div>
                      <div className="mr-3">
                        <p className="font-medium text-gray-900">{property.customer_name}</p>
                        <p className="text-sm text-gray-600">
                          {getPropertyTypeLabel(property.property_type)} - {property.city}
                        </p>
                        <p className="text-xs text-blue-600">
                          {property.listing_type === 'seller' ? 'بائع' : 'مشتري'}
                        </p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{property.price.toLocaleString()} ج.م</p>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                        نشط
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
                    placeholder="بحث بالاسم، الهاتف، المدينة، أو نوع العقار..."
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
                  value={filterListingType}
                  onChange={(e) => setFilterListingType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">جميع العمليات</option>
                  <option value="sale">بيع</option>
                  <option value="rent">إيجار</option>
                </select>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {filteredProperties.length} عقار
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-green-600">
                      {properties.filter(p => p.operation_type === 'sale').length} بيع
                    </span>
                    <span className="text-xs text-blue-600">
                      {properties.filter(p => p.operation_type === 'rent').length} إيجار
                    </span>
                  </div>
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
                        property.operation_type === 'sale' ? 'bg-blue-100' : 'bg-orange-100'
                      }`}>
                        {property.operation_type === 'sale' ?
                          <Home className="w-4 h-4 text-blue-600" /> :
                          <Users className="w-4 h-4 text-orange-600" />
                        }
                      </div>
                      <div className="mr-3">
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                          {property.listing_type === 'seller' ? 'بائع' : 'مشتري'}
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
                      <button
                        onClick={() => handleViewProperty(property)}
                        className="p-1 text-gray-400 hover:text-blue-600"
                        title="عرض التفاصيل"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditProperty(property)}
                        className="p-1 text-gray-400 hover:text-green-600"
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProperty(property.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {getPropertyTypeLabel(property.property_type)} {property.listing_type === 'seller' ? 'للبيع' : 'للشراء'}
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
                        <p className="text-xs text-gray-500">{property.listing_type === 'seller' ? 'بائع' : 'مشتري'}</p>
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
                              (property as any).title
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-gray-400 hover:text-green-600 bg-green-50 hover:bg-green-100 rounded"
                            title="واتساب"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                        )}

                        {/* أزرار إضافية */}
                        <div className="flex space-x-1 mr-2">
                          <span className="text-xs text-gray-500">
                            {new Date(property.created_at).toLocaleDateString('ar-EG')}
                          </span>
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

        {/* Matching Tab */}
        {activeTab === 'matching' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Users className="w-6 h-6 text-purple-600 ml-2" />
                مقارنة العقارات والتوافق المحتمل
              </h3>

              <div className="space-y-6">
                {filteredProperties.map((property) => {
                  const matches = findMatches(property)
                  if (matches.length === 0) return null

                  return (
                    <div key={property.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">
                            {getPropertyTypeLabel(property.property_type)} - {property.customer_name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {property.listing_type === 'seller' ? 'بائع' : 'مشتري'} - {property.city} - {property.price?.toLocaleString()} ج.م
                          </p>
                        </div>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          {matches.length} توافق محتمل
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {matches.map((match) => (
                          <div key={match.id} className="bg-blue-50 p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-blue-900">{match.customer_name}</h5>
                              <span className="text-xs text-blue-600">
                                {match.listing_type === 'sale' ? 'بائع' : 'مشتري'}
                              </span>
                            </div>
                            <div className="text-sm text-blue-800 space-y-1">
                              <div>السعر: {match.price?.toLocaleString()} ج.م</div>
                              <div>المساحة: {match.area} م²</div>
                              <div>المدينة: {match.city}</div>
                            </div>
                            <div className="mt-2 flex space-x-2">
                              <a
                                href={`tel:${match.customer_phone}`}
                                className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                              >
                                اتصال
                              </a>
                              {match.customer_whatsapp && (
                                <a
                                  href={getWhatsAppLink(match.customer_whatsapp, match.customer_name, `${getPropertyTypeLabel(match.property_type)} في ${match.city}`)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                                >
                                  واتساب
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'statistics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <BarChart3 className="w-6 h-6 text-blue-600 ml-2" />
                إحصائيات العقارات التفصيلية
              </h3>

              {(() => {
                const stats = getStatistics()
                return (
                  <div className="space-y-6">
                    {/* إحصائيات عامة */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                        <div className="text-sm text-blue-800">إجمالي العقارات</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">{stats.sellers}</div>
                        <div className="text-sm text-green-800">عقارات للبيع</div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-orange-600">{stats.buyers}</div>
                        <div className="text-sm text-orange-800">طلبات شراء</div>
                      </div>
                    </div>

                    {/* إحصائيات حسب نوع العقار */}
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">إحصائيات حسب نوع العقار</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full border border-gray-200 rounded-lg">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">نوع العقار</th>
                              <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">عدد البائعين</th>
                              <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">عدد المشترين</th>
                              <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">الإجمالي</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {Object.entries(stats.byType).map(([type, data]) => (
                              <tr key={type} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm text-gray-900">{getPropertyTypeLabel(type)}</td>
                                <td className="px-4 py-3 text-sm text-center text-green-600 font-medium">{data.sellers}</td>
                                <td className="px-4 py-3 text-sm text-center text-orange-600 font-medium">{data.buyers}</td>
                                <td className="px-4 py-3 text-sm text-center text-blue-600 font-bold">{data.sellers + data.buyers}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        )}

        {/* Clients Tab */}
        {activeTab === 'clients' && (
          <div className="space-y-6">
            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 text-blue-600 ml-2" />
                  البائعين ({properties.filter(p => p.listing_type === 'seller').length})
                </h3>
                <div className="space-y-2">
                  {['apartment', 'villa', 'house', 'land', 'shop', 'office'].map(type => {
                    const count = properties.filter(p => p.property_type === type && p.listing_type === 'seller').length
                    return count > 0 && (
                      <div key={type} className="flex justify-between text-sm">
                        <span>{getPropertyTypeLabel(type)}</span>
                        <span className="font-medium text-blue-600">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-orange-900 mb-4 flex items-center">
                  <Users className="w-5 h-5 text-orange-600 ml-2" />
                  المشترين ({properties.filter(p => p.listing_type === 'buyer').length})
                </h3>
                <div className="space-y-2">
                  {['apartment', 'villa', 'house', 'land', 'shop', 'office'].map(type => {
                    const count = properties.filter(p => p.property_type === type && p.listing_type === 'buyer').length
                    return count > 0 && (
                      <div key={type} className="flex justify-between text-sm">
                        <span>{getPropertyTypeLabel(type)}</span>
                        <span className="font-medium text-orange-600">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* جدول العملاء */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Users className="w-6 h-6 text-green-600 ml-2" />
                جدول العملاء التفصيلي
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">اسم العميل</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">رقم الهاتف</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">نوع العميل</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">تفاصيل العقارات</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Array.from(new Set(properties.map(p => p.customer_name))).map((customerName) => {
                      const customerProperties = properties.filter(p => p.customer_name === customerName)
                      const customer = customerProperties[0]

                      // تجميع العقارات حسب النوع
                      const propertyTypes = customerProperties.reduce((acc, prop) => {
                        acc[prop.property_type] = (acc[prop.property_type] || 0) + 1
                        return acc
                      }, {} as { [key: string]: number })

                      return (
                        <tr key={customerName} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900 font-medium">{customerName}</td>
                          <td className="px-4 py-3 text-sm text-center text-gray-600">{customer.customer_phone}</td>
                          <td className="px-4 py-3 text-sm text-center">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              customer.listing_type === 'seller' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                            }`}>
                              {customer.listing_type === 'seller' ? 'بائع' : 'مشتري'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-center">
                            <div className="space-y-1">
                              {Object.entries(propertyTypes).map(([type, count]) => (
                                <div key={type} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {getPropertyTypeLabel(type)}: {count}
                                </div>
                              ))}
                              <div className="text-xs font-medium text-gray-600">
                                إجمالي: {customerProperties.length}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-center">
                            <div className="flex justify-center space-x-2">
                              <a
                                href={`tel:${customer.customer_phone}`}
                                className="text-green-600 hover:text-green-700"
                                title="اتصال"
                              >
                                <Phone className="w-4 h-4" />
                              </a>
                              {(customer.customer_whatsapp || customer.customer_phone) && (
                                <a
                                  href={getWhatsAppLink(customer.customer_whatsapp || customer.customer_phone, customer.customer_name, 'استفسار عن العقارات')}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-green-600 hover:text-green-700"
                                  title="واتساب"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                </a>
                              )}
                              {customer.customer_email && (
                                <a
                                  href={`mailto:${customer.customer_email}`}
                                  className="text-blue-600 hover:text-blue-700"
                                  title="إيميل"
                                >
                                  <Mail className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}



        {/* Add Property Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedProperty ? 'تعديل العقار' : 'إضافة عقار جديد'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddForm(false)
                    setSelectedProperty(null)
                    setNewProperty({
                      customer_name: '',
                      customer_phone: '',
                      customer_email: '',
                      customer_whatsapp: '',
                      property_type: 'apartment',
                      listing_type: 'seller',
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
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* بيانات العميل */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Users className="w-5 h-5 ml-2" />
                    بيانات العميل
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">اسم العميل *</label>
                      <input
                        type="text"
                        value={newProperty.customer_name}
                        onChange={(e) => setNewProperty({...newProperty, customer_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="أدخل اسم العميل"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف *</label>
                      <input
                        type="tel"
                        value={newProperty.customer_phone}
                        onChange={(e) => setNewProperty({...newProperty, customer_phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="01xxxxxxxxx"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">رقم الواتساب</label>
                      <input
                        type="tel"
                        value={newProperty.customer_whatsapp}
                        onChange={(e) => setNewProperty({...newProperty, customer_whatsapp: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="01xxxxxxxxx"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                      <input
                        type="email"
                        value={newProperty.customer_email}
                        onChange={(e) => setNewProperty({...newProperty, customer_email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="client@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* بيانات العقار */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Building className="w-5 h-5 ml-2" />
                    بيانات العقار
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">نوع العقار *</label>
                      <select
                        value={newProperty.property_type}
                        onChange={(e) => setNewProperty({...newProperty, property_type: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      >
                        <option value="apartment">شقة</option>
                        <option value="villa">فيلا</option>
                        <option value="house">بيت</option>
                        <option value="land">أرض</option>
                        <option value="shop">محل تجاري</option>
                        <option value="office">مكتب</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">نوع العميل *</label>
                      <select
                        value={newProperty.listing_type}
                        onChange={(e) => setNewProperty({...newProperty, listing_type: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      >
                        <option value="seller">بائع</option>
                        <option value="buyer">مشتري</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">السعر (ج.م) *</label>
                      <input
                        type="number"
                        value={newProperty.price}
                        onChange={(e) => setNewProperty({...newProperty, price: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="2500000"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">المساحة (م²)</label>
                      <input
                        type="number"
                        value={newProperty.area}
                        onChange={(e) => setNewProperty({...newProperty, area: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="150"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">عدد الغرف</label>
                      <input
                        type="number"
                        value={newProperty.bedrooms}
                        onChange={(e) => setNewProperty({...newProperty, bedrooms: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">عدد الحمامات</label>
                      <input
                        type="number"
                        value={newProperty.bathrooms}
                        onChange={(e) => setNewProperty({...newProperty, bathrooms: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">الطابق</label>
                      <input
                        type="number"
                        value={newProperty.floor_number}
                        onChange={(e) => setNewProperty({...newProperty, floor_number: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">إجمالي الطوابق</label>
                      <input
                        type="number"
                        value={newProperty.total_floors}
                        onChange={(e) => setNewProperty({...newProperty, total_floors: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="5"
                      />
                    </div>
                  </div>
                </div>

                {/* الموقع */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 ml-2" />
                    الموقع
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">المحافظة *</label>
                      <input
                        type="text"
                        value={newProperty.governorate}
                        onChange={(e) => setNewProperty({...newProperty, governorate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="القاهرة"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">المدينة *</label>
                      <input
                        type="text"
                        value={newProperty.city}
                        onChange={(e) => setNewProperty({...newProperty, city: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="المعادي"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">الحي</label>
                      <input
                        type="text"
                        value={newProperty.district}
                        onChange={(e) => setNewProperty({...newProperty, district: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="المعادي الجديدة"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">العنوان التفصيلي</label>
                      <input
                        type="text"
                        value={newProperty.address}
                        onChange={(e) => setNewProperty({...newProperty, address: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="شارع 9، المعادي الجديدة"
                      />
                    </div>
                  </div>
                </div>

                {/* المميزات */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Star className="w-5 h-5 ml-2" />
                    المميزات الإضافية
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { key: 'has_garden', label: 'حديقة' },
                      { key: 'has_parking', label: 'موقف سيارات' },
                      { key: 'has_elevator', label: 'مصعد' },
                      { key: 'has_balcony', label: 'بلكونة' },
                      { key: 'is_furnished', label: 'مفروش' },
                      { key: 'has_security', label: 'أمن وحراسة' }
                    ].map((feature) => (
                      <label key={feature.key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newProperty[feature.key as keyof typeof newProperty] as boolean}
                          onChange={(e) => setNewProperty({
                            ...newProperty,
                            [feature.key]: e.target.checked
                          })}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="mr-2 text-sm text-gray-700">{feature.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* الوصف */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الوصف التفصيلي</label>
                  <textarea
                    value={newProperty.description}
                    onChange={(e) => setNewProperty({...newProperty, description: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="وصف تفصيلي للعقار، المميزات، الموقع، إلخ..."
                  />
                </div>

                {/* ملاحظات */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ملاحظات إضافية</label>
                  <textarea
                    value={newProperty.notes}
                    onChange={(e) => setNewProperty({...newProperty, notes: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="أي ملاحظات إضافية..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={selectedProperty ? handleUpdateProperty : handleAddProperty}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Save className="w-4 h-4 ml-2" />
                  {selectedProperty ? 'تحديث العقار' : 'حفظ العقار'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Property Details Modal */}
        {selectedProperty && !showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">تفاصيل العقار</h2>
                  <button
                    onClick={() => setSelectedProperty(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* معلومات العميل */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات العميل</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">الاسم</label>
                        <p className="text-gray-900">{selectedProperty.customer_name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">رقم الهاتف</label>
                        <p className="text-gray-900">{selectedProperty.customer_phone}</p>
                      </div>
                      {selectedProperty.customer_email && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">البريد الإلكتروني</label>
                          <p className="text-gray-900">{selectedProperty.customer_email}</p>
                        </div>
                      )}
                      {selectedProperty.customer_whatsapp && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">واتساب</label>
                          <p className="text-gray-900">{selectedProperty.customer_whatsapp}</p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium text-gray-600">نوع العميل</label>
                        <p className="text-gray-900">
                          {selectedProperty.listing_type === 'seller' ? 'بائع' : 'مشتري'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* معلومات العقار */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات العقار</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">نوع العقار</label>
                        <p className="text-gray-900">{getPropertyTypeLabel(selectedProperty.property_type)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">السعر</label>
                        <p className="text-gray-900">{selectedProperty.price.toLocaleString()} ج.م</p>
                      </div>
                      {selectedProperty.area && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">المساحة</label>
                          <p className="text-gray-900">{selectedProperty.area} م²</p>
                        </div>
                      )}
                      {selectedProperty.bedrooms && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">عدد الغرف</label>
                          <p className="text-gray-900">{selectedProperty.bedrooms}</p>
                        </div>
                      )}
                      {selectedProperty.bathrooms && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">عدد الحمامات</label>
                          <p className="text-gray-900">{selectedProperty.bathrooms}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* الموقع */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">الموقع</h3>
                    <div className="space-y-3">
                      {selectedProperty.governorate && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">المحافظة</label>
                          <p className="text-gray-900">{selectedProperty.governorate}</p>
                        </div>
                      )}
                      {selectedProperty.city && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">المدينة</label>
                          <p className="text-gray-900">{selectedProperty.city}</p>
                        </div>
                      )}
                      {selectedProperty.district && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">الحي</label>
                          <p className="text-gray-900">{selectedProperty.district}</p>
                        </div>
                      )}
                      {selectedProperty.address && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">العنوان التفصيلي</label>
                          <p className="text-gray-900">{selectedProperty.address}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* المميزات */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">المميزات</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedProperty.has_garden && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 ml-1" />
                          حديقة
                        </div>
                      )}
                      {selectedProperty.has_parking && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 ml-1" />
                          موقف سيارات
                        </div>
                      )}
                      {selectedProperty.has_elevator && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 ml-1" />
                          مصعد
                        </div>
                      )}
                      {selectedProperty.has_balcony && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 ml-1" />
                          شرفة
                        </div>
                      )}
                      {selectedProperty.is_furnished && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 ml-1" />
                          مفروش
                        </div>
                      )}
                      {selectedProperty.has_security && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 ml-1" />
                          أمن
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* الوصف */}
                {selectedProperty.description && (
                  <div className="mt-6 bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">الوصف</h3>
                    <p className="text-gray-700">{selectedProperty.description}</p>
                  </div>
                )}

                {/* أزرار التحكم */}
                <div className="mt-6 flex justify-between">
                  <div className="flex space-x-3">
                    <a
                      href={`tel:${selectedProperty.customer_phone}`}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                    >
                      <Phone className="w-4 h-4 ml-2" />
                      اتصال
                    </a>

                    {(selectedProperty.customer_whatsapp || selectedProperty.customer_phone) && (
                      <a
                        href={getWhatsAppLink(
                          selectedProperty.customer_whatsapp || selectedProperty.customer_phone,
                          selectedProperty.customer_name,
                          `${getPropertyTypeLabel(selectedProperty.property_type)} ${selectedProperty.listing_type === 'seller' ? 'للبيع' : 'للشراء'}`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center"
                      >
                        <MessageCircle className="w-4 h-4 ml-2" />
                        واتساب
                      </a>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEditProperty(selectedProperty)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <Edit className="w-4 h-4 ml-2" />
                      تعديل
                    </button>

                    <button
                      onClick={() => setSelectedProperty(null)}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      إغلاق
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
