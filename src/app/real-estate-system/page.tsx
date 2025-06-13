'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import {
  Building, Search, Plus, Edit, Trash2, Eye,
  MapPin, DollarSign, Home, Users, Phone, Mail,
  Save, X, MessageCircle, CheckCircle, AlertCircle,
  BarChart3, Filter, Calendar, Clock, Star,
  TrendingUp, TrendingDown, Activity, Target,
  UserCheck, UserX, FileText, Download, Share2,
  ArrowRight, ArrowUp, StickyNote, Bell, RefreshCw,
  ArrowLeft, LogOut
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
  sale_status?: 'new' | 'selling' | 'sold'
  internal_notes?: string
  follow_up_status?: 'pending' | 'contacted' | 'needs_follow_up'
  last_contact_date?: string
  contact_count?: number
  trust_rating?: number
  created_at: string
}

export default function RealEstateSystemPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Real Estate System States
  const [properties, setProperties] = useState<Property[]>([])
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
    price_negotiable: false,
    sale_status: 'new',
    internal_notes: '',
    follow_up_status: 'pending'
  })

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (admin) {
      loadProperties()
    }
  }, [admin])

  const checkAuth = () => {
    try {
      const adminData = localStorage.getItem('admin')
      const adminSession = localStorage.getItem('adminSession')

      if (adminData || adminSession) {
        const adminInfo = JSON.parse(adminData || adminSession || '{}')
        setAdmin(adminInfo)
      } else {
        router.push('/admin/login')
        return
      }
    } catch (error) {
      console.error('Error checking auth:', error)
      router.push('/admin/login')
      return
    }

    setLoading(false)
  }

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

  const handleLogout = () => {
    localStorage.removeItem('admin')
    localStorage.removeItem('adminSession')
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحقق من جلسة المدير...</p>
        </div>
      </div>
    )
  }

  if (!admin) {
    return null
  }

  // Real Estate Functions
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
        price_negotiable: formData.price_negotiable,
        sale_status: formData.sale_status,
        internal_notes: formData.internal_notes?.trim() || null,
        follow_up_status: formData.follow_up_status,
        contact_count: 0,
        trust_rating: 0
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
      price_negotiable: false,
      sale_status: 'new',
      internal_notes: '',
      follow_up_status: 'pending'
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
      price_negotiable: property.price_negotiable,
      sale_status: property.sale_status || 'new',
      internal_notes: property.internal_notes || '',
      follow_up_status: property.follow_up_status || 'pending'
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

  // دوال إدارة حالات البيع
  const updateSaleStatus = async (propertyId: string, newStatus: 'new' | 'selling' | 'sold') => {
    try {
      const { error } = await supabase
        .from('real_estate')
        .update({ sale_status: newStatus })
        .eq('id', propertyId)

      if (error) {
        console.error('Error updating sale status:', error)
        setMessage({
          type: 'error',
          text: `خطأ في تحديث حالة البيع: ${error.message}`
        })
        return
      }

      setMessage({
        type: 'success',
        text: `تم تحديث حالة العقار إلى "${newStatus === 'selling' ? 'جاري البيع' : newStatus === 'sold' ? 'تم البيع' : 'جديد'}" بنجاح!`
      })

      await loadProperties()

      setTimeout(() => {
        setMessage({ type: null, text: '' })
      }, 3000)

    } catch (error) {
      console.error('Error:', error)
      setMessage({
        type: 'error',
        text: 'حدث خطأ أثناء تحديث حالة البيع'
      })
    }
  }

  const updateFollowUpStatus = async (propertyId: string, status: 'contacted' | 'needs_follow_up') => {
    try {
      const updateData: any = {
        follow_up_status: status,
        last_contact_date: new Date().toISOString()
      }

      if (status === 'contacted') {
        // زيادة عدد مرات التواصل
        const property = properties.find(p => p.id === propertyId)
        updateData.contact_count = (property?.contact_count || 0) + 1
        updateData.trust_rating = Math.min(5, Math.floor((property?.contact_count || 0) / 2) + 1)
      }

      const { error } = await supabase
        .from('real_estate')
        .update(updateData)
        .eq('id', propertyId)

      if (error) {
        console.error('Error updating follow-up status:', error)
        return
      }

      await loadProperties()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const updateInternalNotes = async (propertyId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('real_estate')
        .update({ internal_notes: notes })
        .eq('id', propertyId)

      if (error) {
        console.error('Error updating notes:', error)
        return
      }

      await loadProperties()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div className="mr-3">
                <h1 className="text-xl font-bold text-gray-900">برنامج التسويق العقاري</h1>
                <p className="text-sm text-gray-600">نظام إدارة العقارات المتكامل</p>
              </div>
            </div>

            {/* User Info and Actions */}
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="text-gray-600 hover:text-blue-600 flex items-center text-sm"
              >
                <ArrowLeft className="w-4 h-4 ml-1" />
                العودة للوحة التحكم
              </Link>

              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div className="mr-3">
                  <p className="text-sm font-medium text-gray-900">{admin.name}</p>
                  <p className="text-xs text-gray-600">مدير عقارات</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 flex items-center text-sm"
              >
                <LogOut className="w-4 h-4 ml-1" />
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Messages */}
        {message.type && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 border border-green-400 text-green-700'
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            <div className="flex">
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 ml-2" />
              ) : (
                <AlertCircle className="w-5 h-5 ml-2" />
              )}
              <span>{message.text}</span>
            </div>
          </div>
        )}

        {/* Main Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-t-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة عقار جديد
              </button>
              <a
                href="/admin/selling-now"
                target="_blank"
                className="bg-orange-600 text-white px-6 py-3 rounded-t-lg hover:bg-orange-700 transition-colors flex items-center"
              >
                <TrendingUp className="w-4 h-4 ml-2" />
                جاري البيع
              </a>
              <a
                href="/admin/sold"
                target="_blank"
                className="bg-emerald-600 text-white px-6 py-3 rounded-t-lg hover:bg-emerald-700 transition-colors flex items-center"
              >
                <CheckCircle className="w-4 h-4 ml-2" />
                تم البيع
              </a>
              <a
                href="/admin/matching"
                target="_blank"
                className="bg-purple-600 text-white px-6 py-3 rounded-t-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                <Users className="w-4 h-4 ml-2" />
                المطابقة
              </a>
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

        {/* Advanced Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">نوع العقار</label>
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

                  {/* Sale Status */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">حالة البيع:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        property.sale_status === 'selling' ? 'bg-orange-100 text-orange-800' :
                        property.sale_status === 'sold' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {property.sale_status === 'selling' ? 'جاري البيع' :
                         property.sale_status === 'sold' ? 'تم البيع' : 'جديد'}
                      </span>
                    </div>

                    {/* Sale Status Buttons */}
                    {property.sale_status !== 'sold' && (
                      <div className="flex space-x-2 mb-3">
                        {property.sale_status !== 'selling' && (
                          <button
                            onClick={() => updateSaleStatus(property.id, 'selling')}
                            className="flex-1 bg-orange-600 text-white px-2 py-1 rounded text-xs hover:bg-orange-700 transition-colors flex items-center justify-center"
                          >
                            <ArrowRight className="w-3 h-3 ml-1" />
                            نقل إلى جاري البيع
                          </button>
                        )}
                        <button
                          onClick={() => updateSaleStatus(property.id, 'sold')}
                          className="flex-1 bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors flex items-center justify-center"
                        >
                          <CheckCircle className="w-3 h-3 ml-1" />
                          تم البيع
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Follow-up Status */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">المتابعة:</span>
                      <div className="flex items-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                          property.follow_up_status === 'contacted' ? 'bg-green-100 text-green-800' :
                          property.follow_up_status === 'needs_follow_up' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {property.follow_up_status === 'contacted' ? 'تم التواصل' :
                           property.follow_up_status === 'needs_follow_up' ? 'يحتاج متابعة' : 'في الانتظار'}
                        </span>
                        {property.trust_rating && property.trust_rating > 0 && (
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`text-sm ${
                                  star <= property.trust_rating! ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Follow-up Buttons */}
                    <div className="flex space-x-2 mb-3">
                      <button
                        onClick={() => updateFollowUpStatus(property.id, 'contacted')}
                        className="flex-1 bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors flex items-center justify-center"
                      >
                        <Phone className="w-3 h-3 ml-1" />
                        تم التواصل
                      </button>
                      <button
                        onClick={() => updateFollowUpStatus(property.id, 'needs_follow_up')}
                        className="flex-1 bg-yellow-600 text-white px-2 py-1 rounded text-xs hover:bg-yellow-700 transition-colors flex items-center justify-center"
                      >
                        <Bell className="w-3 h-3 ml-1" />
                        يحتاج متابعة
                      </button>
                    </div>
                  </div>

                  {/* Internal Notes */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات داخلية:</label>
                    <textarea
                      value={property.internal_notes || ''}
                      onChange={(e) => updateInternalNotes(property.id, e.target.value)}
                      placeholder="مثال: يرد فقط بالليل"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs resize-none"
                      rows={2}
                    />
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
                      onClick={() => {
                        const shareText = `عقار ${getPropertyTypeLabel(property.property_type)} - ${property.title}\nالسعر: ${property.price.toLocaleString()} جنيه\nالموقع: ${property.city}, ${property.governorate}\nللتواصل: ${property.customer_phone}`
                        navigator.share ? navigator.share({ text: shareText }) : navigator.clipboard.writeText(shareText)
                      }}
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                      title="مشاركة"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(property)}
                      className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
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
                        <option value="house">بيت</option>
                        <option value="villa">فيلا</option>
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

                  {/* Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>

                  {/* Property Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                  {/* Form Actions */}
                  <div className="flex space-x-4 pt-4">
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
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
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
      </main>
    </div>
  )
}
