'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import RouteGuard from '@/components/admin/RouteGuard'
import {
  Building, Search, Plus, Edit, Trash2, Eye,
  MapPin, DollarSign, Home, Users, Phone, Mail,
  Save, X, MessageCircle, CheckCircle, AlertCircle
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

export default function SimpleRealEstate() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
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
        // تحديث عقار موجود
        result = await supabase
          .from('real_estate')
          .update(propertyData)
          .eq('id', editingProperty.id)
          .select()
      } else {
        // إضافة عقار جديد
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

      // إعادة تعيين النموذج
      resetForm()
      
      // إعادة تحميل العقارات
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

  const getOperationTypeLabel = (type: string) => {
    return type === 'sale' ? 'بيع' : 'إيجار'
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
                <p className="text-gray-600">نظام بسيط لإدارة البائعين والمشترين</p>
              </div>
            </div>

            <button
              onClick={() => setShowAddForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 ml-2" />
              إضافة عقار جديد
            </button>
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

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">البحث</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث بالاسم أو المدينة أو الهاتف..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نوع العقار</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">الكل</option>
                <option value="sale">بيع</option>
                <option value="rent">إيجار</option>
              </select>
            </div>

            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                إجمالي العقارات: {filteredProperties.length}
              </div>
            </div>
          </div>
        </div>
