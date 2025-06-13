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
  UserCheck, UserX, FileText, Download, Share2,
  ArrowRight, ArrowUp, StickyNote, Bell, RefreshCw
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
    price_negotiable: false,
    sale_status: 'new',
    internal_notes: '',
    follow_up_status: 'pending'
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
    <RouteGuard>
      <div className="min-h-screen bg-gray-50 flex" dir="rtl">
        {/* القائمة الجانبية الجديدة */}
        <div className="w-80 bg-white shadow-lg border-l border-gray-200 flex flex-col">
          {/* رأس القائمة الجانبية */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div className="mr-3">
                <h1 className="text-lg font-bold">برنامج التسويق العقاري</h1>
                <p className="text-sm text-green-100">نظام إدارة العقارات المتكامل</p>
              </div>
            </div>
          </div>

          {/* قائمة التنقل */}
          <div className="flex-1 p-4">
            <nav className="space-y-2">
              {/* لوحة التحكم */}
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-right transition-all duration-200 ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Home className="w-5 h-5 ml-3 flex-shrink-0" />
                <span>🏠 لوحة التحكم</span>
              </button>

              {/* إضافة عقار */}
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full flex items-center px-4 py-3 rounded-lg text-right text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200"
              >
                <Plus className="w-5 h-5 ml-3 flex-shrink-0" />
                <span>➕ إضافة عقار</span>
              </button>

              {/* الإحصائيات */}
              <button
                onClick={() => setActiveTab('statistics')}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-right transition-all duration-200 ${
                  activeTab === 'statistics'
                    ? 'bg-purple-100 text-purple-700 border border-purple-200 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <BarChart3 className="w-5 h-5 ml-3 flex-shrink-0" />
                <span>📊 الإحصائيات</span>
              </button>

              {/* المطابقة الذكية */}
              <button
                onClick={() => setActiveTab('matching')}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-right transition-all duration-200 ${
                  activeTab === 'matching'
                    ? 'bg-yellow-100 text-yellow-700 border border-yellow-200 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Target className="w-5 h-5 ml-3 flex-shrink-0" />
                <span>🔍 المطابقة</span>
              </button>

              {/* جاري البيع */}
              <button
                onClick={() => setActiveTab('selling')}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-right transition-all duration-200 ${
                  activeTab === 'selling'
                    ? 'bg-orange-100 text-orange-700 border border-orange-200 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <TrendingUp className="w-5 h-5 ml-3 flex-shrink-0" />
                <div className="flex items-center justify-between w-full">
                  <span>🔁 جاري البيع</span>
                  <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded-full text-xs">
                    {properties.filter(p => p.sale_status === 'selling').length}
                  </span>
                </div>
              </button>

              {/* تم البيع */}
              <button
                onClick={() => setActiveTab('sold')}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-right transition-all duration-200 ${
                  activeTab === 'sold'
                    ? 'bg-green-100 text-green-700 border border-green-200 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <CheckCircle className="w-5 h-5 ml-3 flex-shrink-0" />
                <div className="flex items-center justify-between w-full">
                  <span>✅ تم البيع</span>
                  <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs">
                    {properties.filter(p => p.sale_status === 'sold').length}
                  </span>
                </div>
              </button>

              {/* عرض جميع العقارات */}
              <button
                onClick={() => setActiveTab('properties')}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-right transition-all duration-200 ${
                  activeTab === 'properties'
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Building className="w-5 h-5 ml-3 flex-shrink-0" />
                <span>🏢 جميع العقارات</span>
              </button>
            </nav>
          </div>

          {/* معلومات المستخدم */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div className="mr-3">
                <p className="text-sm font-medium text-gray-900">مدير عقارات</p>
                <p className="text-xs text-gray-600">النظام المطور</p>
              </div>
            </div>
          </div>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* الشريط العلوي */}
          <div className="bg-white shadow-sm border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {activeTab === 'dashboard' && '🏠 لوحة التحكم'}
                  {activeTab === 'statistics' && '📊 الإحصائيات المتقدمة'}
                  {activeTab === 'matching' && '🔍 المطابقة الذكية'}
                  {activeTab === 'selling' && '🔁 العقارات جاري البيع'}
                  {activeTab === 'sold' && '✅ العقارات المباعة'}
                  {activeTab === 'properties' && '🏢 جميع العقارات'}
                  {!activeTab && '🏠 برنامج التسويق العقاري'}
                </h2>
                <p className="text-gray-600 mt-1">
                  إجمالي العقارات: <span className="font-semibold text-blue-600">{properties.length}</span> |
                  بائعين: <span className="font-semibold text-green-600">{properties.filter(p => p.operation_type === 'seller').length}</span> |
                  مشترين: <span className="font-semibold text-blue-600">{properties.filter(p => p.operation_type === 'buyer').length}</span>
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-200">
                  <span className="text-sm font-medium">✨ النظام المطور يعمل!</span>
                </div>
              </div>
            </div>
          </div>

          {/* المحتوى */}
          <div className="flex-1 p-6 space-y-6">

            {/* لوحة التحكم الجديدة */}
            {(activeTab === 'dashboard' || !activeTab) && (
              <div className="space-y-6">
                {/* بطاقات الإحصائيات الرئيسية */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm">إجمالي العقارات</p>
                        <p className="text-3xl font-bold">{properties.length}</p>
                      </div>
                      <Building className="w-8 h-8 text-blue-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm">البائعين</p>
                        <p className="text-3xl font-bold">{properties.filter(p => p.operation_type === 'seller').length}</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm">المشترين</p>
                        <p className="text-3xl font-bold">{properties.filter(p => p.operation_type === 'buyer').length}</p>
                      </div>
                      <Users className="w-8 h-8 text-purple-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-sm">جاري البيع</p>
                        <p className="text-3xl font-bold">{properties.filter(p => p.sale_status === 'selling').length}</p>
                      </div>
                      <Activity className="w-8 h-8 text-orange-200" />
                    </div>
                  </div>
                </div>

                {/* إحصائيات حسب نوع العقار */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 إحصائيات حسب نوع العقار</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {['apartment', 'villa', 'house', 'land', 'shop', 'office'].map(type => {
                      const sellers = properties.filter(p => p.property_type === type && p.operation_type === 'seller').length
                      const buyers = properties.filter(p => p.property_type === type && p.operation_type === 'buyer').length
                      return (
                        <div key={type} className="bg-gray-50 rounded-lg p-4 text-center">
                          <h4 className="font-medium text-gray-900 mb-2">{getPropertyTypeLabel(type)}</h4>
                          <div className="space-y-1">
                            <div className="text-sm">
                              <span className="text-green-600 font-semibold">بائع: {sellers}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-blue-600 font-semibold">مشتري: {buyers}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* أحدث العقارات */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">🆕 أحدث العقارات المضافة</h3>
                  <div className="space-y-3">
                    {properties.slice(0, 5).map(property => (
                      <div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ml-3 ${
                            property.operation_type === 'seller' ? 'bg-green-500' : 'bg-blue-500'
                          }`}></div>
                          <div>
                            <p className="font-medium text-gray-900">{property.title}</p>
                            <p className="text-sm text-gray-600">{property.customer_name} - {property.city}</p>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900">{property.price.toLocaleString()} جنيه</p>
                          <p className="text-xs text-gray-500">{getPropertyTypeLabel(property.property_type)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

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

                  {/* Advanced Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        حالة البيع
                      </label>
                      <select
                        value={formData.sale_status}
                        onChange={(e) => setFormData({...formData, sale_status: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="new">جديد</option>
                        <option value="selling">جاري البيع</option>
                        <option value="sold">تم البيع</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        حالة المتابعة
                      </label>
                      <select
                        value={formData.follow_up_status}
                        onChange={(e) => setFormData({...formData, follow_up_status: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="pending">في الانتظار</option>
                        <option value="contacted">تم التواصل</option>
                        <option value="needs_follow_up">يحتاج متابعة</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ملاحظات داخلية
                    </label>
                    <textarea
                      value={formData.internal_notes}
                      onChange={(e) => setFormData({...formData, internal_notes: e.target.value})}
                      placeholder="مثال: يرد فقط بالليل، يفضل التواصل عبر واتساب..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
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