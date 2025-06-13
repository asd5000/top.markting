'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import RouteGuard from '@/components/admin/RouteGuard'
import { 
  Building, 
  MapPin, 
  DollarSign, 
  User, 
  Phone, 
  Calendar,
  TrendingUp,
  Home,
  Store,
  TreePine,
  Building2,
  Briefcase
} from 'lucide-react'

interface Property {
  id: string
  name: string
  phone: string
  operation_type: string
  property_type: string
  area: string
  price: string
  location: string
  description: string
  sale_status: string
  internal_notes: string
  follow_up_status: string
  last_contact_date: string
  contact_count: number
  trust_rating: number
  created_at: string
}

export default function SellingNowPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<string>('all')

  useEffect(() => {
    loadSellingProperties()
  }, [])

  const loadSellingProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('sale_status', 'selling')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading selling properties:', error)
      } else {
        setProperties(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'apartment': return <Building className="w-5 h-5" />
      case 'house': return <Home className="w-5 h-5" />
      case 'shop': return <Store className="w-5 h-5" />
      case 'land': return <TreePine className="w-5 h-5" />
      case 'villa': return <Building2 className="w-5 h-5" />
      case 'office': return <Briefcase className="w-5 h-5" />
      default: return <Building className="w-5 h-5" />
    }
  }

  const getPropertyTypeName = (type: string) => {
    const types: { [key: string]: string } = {
      apartment: 'شقة',
      house: 'بيت',
      shop: 'محل',
      land: 'أرض',
      villa: 'فيلا',
      office: 'مكتب'
    }
    return types[type] || type
  }

  const calculateCommission = (price: string, rate: number) => {
    const numPrice = parseFloat(price.replace(/[^\d.]/g, ''))
    if (isNaN(numPrice)) return '0'
    return (numPrice * rate / 100).toLocaleString('ar-EG')
  }

  const filteredProperties = selectedType === 'all' 
    ? properties 
    : properties.filter(p => p.property_type === selectedType)

  const propertyTypes = [
    { value: 'all', label: 'جميع الأنواع', count: properties.length },
    { value: 'apartment', label: 'شقق', count: properties.filter(p => p.property_type === 'apartment').length },
    { value: 'house', label: 'بيوت', count: properties.filter(p => p.property_type === 'house').length },
    { value: 'shop', label: 'محلات', count: properties.filter(p => p.property_type === 'shop').length },
    { value: 'land', label: 'أراضي', count: properties.filter(p => p.property_type === 'land').length },
    { value: 'villa', label: 'فيلات', count: properties.filter(p => p.property_type === 'villa').length },
    { value: 'office', label: 'مكاتب', count: properties.filter(p => p.property_type === 'office').length }
  ]

  if (loading) {
    return (
      <RouteGuard>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل العقارات...</p>
          </div>
        </div>
      </RouteGuard>
    )
  }

  return (
    <RouteGuard>
      <div className="space-y-6" dir="rtl">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 ml-3" />
            <div>
              <h1 className="text-2xl font-bold">العقارات جاري البيع</h1>
              <p className="opacity-90">إدارة العقارات التي في مرحلة البيع النشط</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">تصنيف حسب نوع العقار</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {propertyTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`p-3 rounded-lg border text-center transition-colors ${
                  selectedType === type.value
                    ? 'bg-orange-100 border-orange-500 text-orange-700'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="font-medium text-sm">{type.label}</div>
                <div className="text-xs text-gray-500 mt-1">({type.count})</div>
              </button>
            ))}
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg shadow-md border border-orange-200 overflow-hidden">
              {/* Header */}
              <div className="bg-orange-50 p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getPropertyTypeIcon(property.property_type)}
                    <span className="mr-2 font-medium text-orange-800">
                      {getPropertyTypeName(property.property_type)}
                    </span>
                  </div>
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                    جاري البيع
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                {/* Client Info */}
                <div className="flex items-center">
                  <User className="w-4 h-4 text-gray-500 ml-2" />
                  <span className="font-medium">{property.name}</span>
                  <span className={`mr-auto px-2 py-1 rounded-full text-xs ${
                    property.operation_type === 'seller' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {property.operation_type === 'seller' ? 'بائع' : 'مشتري'}
                  </span>
                </div>

                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-gray-500 ml-2" />
                  <span className="text-gray-700">{property.phone}</span>
                </div>

                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-gray-500 ml-2" />
                  <span className="text-gray-700">{property.location}</span>
                </div>

                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 text-gray-500 ml-2" />
                  <span className="font-bold text-green-600">{property.price}</span>
                </div>

                {/* Commission Calculations */}
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">حساب العمولة:</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>2.5%:</span>
                      <span className="font-medium">{calculateCommission(property.price, 2.5)} جنيه</span>
                    </div>
                    <div className="flex justify-between">
                      <span>2%:</span>
                      <span className="font-medium">{calculateCommission(property.price, 2)} جنيه</span>
                    </div>
                    <div className="flex justify-between">
                      <span>1.5%:</span>
                      <span className="font-medium">{calculateCommission(property.price, 1.5)} جنيه</span>
                    </div>
                  </div>
                </div>

                {/* Trust Rating */}
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 ml-2">تقييم الثقة:</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-lg ${
                          star <= property.trust_rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 mr-2">({property.contact_count} تواصل)</span>
                </div>

                {/* Internal Notes */}
                {property.internal_notes && (
                  <div className="bg-yellow-50 p-2 rounded border-r-4 border-yellow-400">
                    <p className="text-sm text-yellow-800">{property.internal_notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد عقارات جاري بيعها</h3>
            <p className="text-gray-600">لم يتم نقل أي عقارات إلى مرحلة "جاري البيع" بعد</p>
          </div>
        )}
      </div>
    </RouteGuard>
  )
}
