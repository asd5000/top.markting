'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import RouteGuard from '@/components/admin/RouteGuard'
import {
  Building, Search, Plus, Edit, Trash2, Eye,
  MapPin, DollarSign, Home, Users, Phone, Mail,
  Save, X, MessageCircle, CheckCircle, AlertCircle,
  BarChart3, Filter, Calendar, Clock, Star,
  TrendingUp, TrendingDown, Activity, Target,
  UserCheck, UserX, FileText, Download
} from 'lucide-react'

interface Property {
  id: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  customer_whatsapp?: string
  property_type: 'apartment' | 'villa' | 'land' | 'shop' | 'house' | 'office'
  operation_type: 'seller' | 'buyer'
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
  const [activeTab, setActiveTab] = useState('properties')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterOperation, setFilterOperation] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [message, setMessage] = useState<{
    type: 'success' | 'error' | null
    text: string
  }>({ type: null, text: '' })

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    customer_whatsapp: '',
    property_type: 'apartment',
    operation_type: 'seller',
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
  }, [])

  const loadProperties = async () => {
    try {
      setLoading(true)
      console.log('🏠 تحميل العقارات...')

      const { data, error } = await supabase
        .from('real_estate')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ خطأ في تحميل العقارات:', error)
        setMessage({
          type: 'error',
          text: `خطأ في تحميل العقارات: ${error.message}`
        })
        return
      }

      console.log('✅ تم تحميل العقارات:', data)
      setProperties(data || [])

    } catch (error) {
      console.error('❌ خطأ عام:', error)
      setMessage({
        type: 'error',
        text: 'حدث خطأ أثناء تحميل العقارات'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.customer_name || !formData.customer_phone || !formData.title) {
      setMessage({
        type: 'error',
        text: 'يرجى ملء جميع الحقول المطلوبة'
      })
      return
    }

    try {
      const propertyData = {
        customer_name: formData.customer_name.trim(),
        customer_phone: formData.customer_phone.trim(),
        customer_email: formData.customer_email?.trim() || null,
        customer_whatsapp: formData.customer_whatsapp?.trim() || null,
        property_type: formData.property_type,
        operation_type: formData.operation_type,
        title: formData.title.trim(),
        description: formData.description?.trim() || null,
        governorate: formData.governorate.trim(),
        city: formData.city.trim(),
        district: formData.district?.trim() || null,
        area: formData.area ? parseInt(formData.area) : null,
        rooms: formData.rooms ? parseInt(formData.rooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        price: parseFloat(formData.price),
        price_negotiable: formData.price_negotiable
      }

      let result
      if (editingProperty) {
        result = await supabase
          .from('real_estate')
          .update(propertyData)
          .eq('id', editingProperty.id)
          .select()
      } else {
        result = await supabase
          .from('real_estate')
          .insert([propertyData])
          .select()
      }

      if (result.error) {
        console.error('❌ خطأ في حفظ العقار:', result.error)
        setMessage({
          type: 'error',
          text: `خطأ في حفظ العقار: ${result.error.message}`
        })
        return
      }

      console.log('✅ تم حفظ العقار بنجاح:', result.data)

      setMessage({
        type: 'success',
        text: editingProperty ? 'تم تحديث العقار بنجاح!' : 'تم إضافة العقار بنجاح!'
      })

      resetForm()
      await loadProperties()

      setTimeout(() => {
        setMessage({ type: null, text: '' })
      }, 3000)

    } catch (error) {
      console.error('❌ خطأ عام في حفظ العقار:', error)
      setMessage({
        type: 'error',
        text: 'حدث خطأ أثناء حفظ العقار'
      })
    }
  }

  const resetForm = () => {
    setFormData({
      customer_name: '',
      customer_phone: '',
      customer_email: '',
      customer_whatsapp: '',
      property_type: 'apartment',
      operation_type: 'seller',
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
    setEditingProperty(null)
    setShowAddForm(false)
  }

  const handleEdit = (property: Property) => {
    setFormData({
      customer_name: property.customer_name,
      customer_phone: property.customer_phone,
      customer_email: property.customer_email || '',
      customer_whatsapp: property.customer_whatsapp || '',
      property_type: property.property_type,
      operation_type: property.operation_type,
      title: property.title,
      description: property.description || '',
      governorate: property.governorate,
      city: property.city,
      district: property.district || '',
      area: property.area?.toString() || '',
      rooms: property.rooms?.toString() || '',
      bathrooms: property.bathrooms?.toString() || '',
      price: property.price.toString(),
      price_negotiable: property.price_negotiable
    })
    setEditingProperty(property)
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العقار؟')) return

    try {
      const { error } = await supabase
        .from('real_estate')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('❌ خطأ في حذف العقار:', error)
        setMessage({
          type: 'error',
          text: `خطأ في حذف العقار: ${error.message}`
        })
        return
      }

      setMessage({
        type: 'success',
        text: 'تم حذف العقار بنجاح!'
      })

      await loadProperties()

      setTimeout(() => {
        setMessage({ type: null, text: '' })
      }, 3000)

    } catch (error) {
      console.error('❌ خطأ عام في حذف العقار:', error)
      setMessage({
        type: 'error',
        text: 'حدث خطأ أثناء حذف العقار'
      })
    }
  }

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.customer_phone.includes(searchTerm)

    const matchesType = filterType === 'all' || property.property_type === filterType
    const matchesOperation = filterOperation === 'all' || property.operation_type === filterOperation

    return matchesSearch && matchesType && matchesOperation
  })

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
    let cleanNumber = phone.replace(/\D/g, '')
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
    <RouteGuard>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Building className="w-6 h-6 text-green-600 ml-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">برنامج التسويق العقاري</h1>
                <p className="text-gray-600">نظام مكتمل لإدارة البائعين والمشترين ومقارنة المواصفات - محدث</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-t-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة عقار جديد
              </button>
              <button
                onClick={() => setActiveTab('matching')}
                className="bg-purple-600 text-white px-6 py-3 rounded-t-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                <Users className="w-4 h-4 ml-2" />
                المطابقة
              </button>
              <button
                onClick={() => setActiveTab('statistics')}
                className="bg-blue-600 text-white px-6 py-3 rounded-t-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <BarChart3 className="w-4 h-4 ml-2" />
                الإحصائيات
              </button>
            </nav>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Sub Tabs">
              <button
                onClick={() => setActiveTab('clients')}
                className={`py-3 px-4 border-b-2 font-medium text-sm ${
                  activeTab === 'clients'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="w-4 h-4 ml-2 inline" />
                إدارة العملاء
              </button>
              <button
                onClick={() => setActiveTab('statistics')}
                className={`py-3 px-4 border-b-2 font-medium text-sm ${
                  activeTab === 'statistics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart3 className="w-4 h-4 ml-2 inline" />
                الإحصائيات
              </button>
              <button
                onClick={() => setActiveTab('matching')}
                className={`py-3 px-4 border-b-2 font-medium text-sm ${
                  activeTab === 'matching'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Target className="w-4 h-4 ml-2 inline" />
                المطابقة والتوافق
              </button>
              <button
                onClick={() => setActiveTab('properties')}
                className={`py-3 px-4 border-b-2 font-medium text-sm ${
                  activeTab === 'properties'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Building className="w-4 h-4 ml-2 inline" />
                إدارة العقارات
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-3 px-4 border-b-2 font-medium text-sm ${
                  activeTab === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Home className="w-4 h-4 ml-2 inline" />
                لوحة التحكم
              </button>
            </nav>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">بحث بالاسم، الرقم</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث بالاسم أو المدينة أو الهاتف..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">6 عقار</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">جميع الأنواع</option>
                <option value="apartment">شقة</option>
                <option value="villa">فيلا</option>
                <option value="house">بيت</option>
                <option value="land">أرض</option>
                <option value="shop">محل</option>
                <option value="office">مكتب</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نوع العملية</label>
              <select
                value={filterOperation}
                onChange={(e) => setFilterOperation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">الكل</option>
                <option value="seller">بائع</option>
                <option value="buyer">مشتري</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">المحافظة</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">جميع المحافظات</option>
                <option value="cairo">القاهرة</option>
                <option value="giza">الجيزة</option>
                <option value="alexandria">الإسكندرية</option>
              </select>
            </div>

            <div className="flex items-end">
              <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                إجمالي العقارات: {filteredProperties.length}
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        {message.type && (
          <div className={`p-4 rounded-lg flex items-center ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 ml-2" />
            ) : (
              <AlertCircle className="w-5 h-5 ml-2" />
            )}
            {message.text}
          </div>
        )}

        {/* Properties Grid - Card View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">جاري تحميل العقارات...</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">لا توجد عقارات متاحة</p>
            </div>
          ) : (
            filteredProperties.map((property) => (
              <div key={property.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Property Type Badge */}
                <div className="p-4 pb-2">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      property.operation_type === 'seller'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {property.operation_type === 'seller' ? 'بائع' : 'مشتري'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      property.property_type === 'apartment' ? 'bg-orange-100 text-orange-800' :
                      property.property_type === 'villa' ? 'bg-purple-100 text-purple-800' :
                      property.property_type === 'house' ? 'bg-indigo-100 text-indigo-800' :
                      property.property_type === 'land' ? 'bg-yellow-100 text-yellow-800' :
                      property.property_type === 'shop' ? 'bg-pink-100 text-pink-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {getPropertyTypeLabel(property.property_type)}
                    </span>
                  </div>

                  {/* Property Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>

                  {/* Customer Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 ml-2" />
                      <span className="font-medium">{property.customer_name}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 ml-2" />
                      <span>{property.customer_phone}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 ml-2" />
                      <span>{property.city}, {property.governorate}</span>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    {property.area && (
                      <div className="flex items-center text-gray-600">
                        <Home className="w-4 h-4 ml-1" />
                        <span>{property.area} م²</span>
                      </div>
                    )}
                    {property.rooms && (
                      <div className="flex items-center text-gray-600">
                        <Building className="w-4 h-4 ml-1" />
                        <span>{property.rooms} غرف</span>
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex items-center text-gray-600">
                        <Home className="w-4 h-4 ml-1" />
                        <span>{property.bathrooms} حمام</span>
                      </div>
                    )}
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-4 h-4 ml-1" />
                      <span>{property.price.toLocaleString()} جنيه</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <a
                      href={getWhatsAppLink(property.customer_phone, property.customer_name, property.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center text-sm"
                    >
                      <MessageCircle className="w-4 h-4 ml-1" />
                      واتساب
                    </a>
                    <button
                      onClick={() => handleEdit(property)}
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(property.id)}
                      className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add/Edit Property Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingProperty ? 'تعديل العقار' : 'إضافة عقار جديد'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Customer Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        اسم العميل *
                      </label>
                      <input
                        type="text"
                        value={formData.customer_name}
                        onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        رقم الهاتف *
                      </label>
                      <input
                        type="tel"
                        value={formData.customer_phone}
                        onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        البريد الإلكتروني
                      </label>
                      <input
                        type="email"
                        value={formData.customer_email}
                        onChange={(e) => setFormData({...formData, customer_email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        واتساب
                      </label>
                      <input
                        type="tel"
                        value={formData.customer_whatsapp}
                        onChange={(e) => setFormData({...formData, customer_whatsapp: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Property Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        نوع العقار *
                      </label>
                      <select
                        value={formData.property_type}
                        onChange={(e) => setFormData({...formData, property_type: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="apartment">شقة</option>
                        <option value="villa">فيلا</option>
                        <option value="house">بيت</option>
                        <option value="land">أرض</option>
                        <option value="shop">محل</option>
                        <option value="office">مكتب</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        نوع العملية *
                      </label>
                      <select
                        value={formData.operation_type}
                        onChange={(e) => setFormData({...formData, operation_type: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="seller">بائع</option>
                        <option value="buyer">مشتري</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      عنوان العقار *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      وصف العقار
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Location */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        المحافظة *
                      </label>
                      <input
                        type="text"
                        value={formData.governorate}
                        onChange={(e) => setFormData({...formData, governorate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        المدينة *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الحي
                      </label>
                      <input
                        type="text"
                        value={formData.district}
                        onChange={(e) => setFormData({...formData, district: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        المساحة (م²)
                      </label>
                      <input
                        type="number"
                        value={formData.area}
                        onChange={(e) => setFormData({...formData, area: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        عدد الغرف
                      </label>
                      <input
                        type="number"
                        value={formData.rooms}
                        onChange={(e) => setFormData({...formData, rooms: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        عدد الحمامات
                      </label>
                      <input
                        type="number"
                        value={formData.bathrooms}
                        onChange={(e) => setFormData({...formData, bathrooms: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        السعر (جنيه) *
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="price_negotiable"
                      checked={formData.price_negotiable}
                      onChange={(e) => setFormData({...formData, price_negotiable: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="price_negotiable" className="mr-2 block text-sm text-gray-900">
                      السعر قابل للتفاوض
                    </label>
                  </div>

                  {/* Form Actions */}
                  <div className="flex space-x-4 pt-6">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <Save className="w-4 h-4 ml-2" />
                      {editingProperty ? 'تحديث العقار' : 'إضافة العقار'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                    >
                      <X className="w-4 h-4 ml-2" />
                      إلغاء
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </RouteGuard>
  )
}