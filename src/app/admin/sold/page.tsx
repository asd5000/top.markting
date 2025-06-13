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
  CheckCircle,
  Home,
  Store,
  TreePine,
  Building2,
  Briefcase,
  Download
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

export default function SoldPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<string>('all')

  useEffect(() => {
    loadSoldProperties()
  }, [])

  const loadSoldProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('sale_status', 'sold')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading sold properties:', error)
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

  const exportToExcel = () => {
    // تحويل البيانات إلى CSV
    const headers = ['الاسم', 'الهاتف', 'نوع العملية', 'نوع العقار', 'المساحة', 'السعر', 'الموقع', 'تاريخ البيع']
    const csvData = properties.map(property => [
      property.name,
      property.phone,
      property.operation_type === 'seller' ? 'بائع' : 'مشتري',
      getPropertyTypeName(property.property_type),
      property.area,
      property.price,
      property.location,
      new Date(property.created_at).toLocaleDateString('ar-EG')
    ])

    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `العقارات_المباعة_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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

  // حساب إجمالي العمولات
  const totalCommissions = {
    rate25: properties.reduce((sum, p) => sum + parseFloat(calculateCommission(p.price, 2.5).replace(/,/g, '')), 0),
    rate20: properties.reduce((sum, p) => sum + parseFloat(calculateCommission(p.price, 2).replace(/,/g, '')), 0),
    rate15: properties.reduce((sum, p) => sum + parseFloat(calculateCommission(p.price, 1.5).replace(/,/g, '')), 0)
  }

  if (loading) {
    return (
      <RouteGuard>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل العقارات المباعة...</p>
          </div>
        </div>
      </RouteGuard>
    )
  }

  return (
    <RouteGuard>
      <div className="space-y-6" dir="rtl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 ml-3" />
              <div>
                <h1 className="text-2xl font-bold">العقارات المباعة</h1>
                <p className="opacity-90">سجل العقارات التي تم بيعها بنجاح</p>
              </div>
            </div>
            <button
              onClick={exportToExcel}
              className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 flex items-center"
            >
              <Download className="w-4 h-4 ml-2" />
              تصدير Excel
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{properties.length}</div>
              <div className="text-gray-600">إجمالي المبيعات</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{totalCommissions.rate25.toLocaleString('ar-EG')}</div>
              <div className="text-gray-600">عمولة 2.5%</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{totalCommissions.rate20.toLocaleString('ar-EG')}</div>
              <div className="text-gray-600">عمولة 2%</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{totalCommissions.rate15.toLocaleString('ar-EG')}</div>
              <div className="text-gray-600">عمولة 1.5%</div>
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
                    ? 'bg-green-100 border-green-500 text-green-700'
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
            <div key={property.id} className="bg-white rounded-lg shadow-md border border-green-200 overflow-hidden">
              {/* Header */}
              <div className="bg-green-50 p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getPropertyTypeIcon(property.property_type)}
                    <span className="mr-2 font-medium text-green-800">
                      {getPropertyTypeName(property.property_type)}
                    </span>
                  </div>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    تم البيع ✓
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

                {/* Commission Earned */}
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">العمولة المحققة:</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>2.5%:</span>
                      <span className="font-medium text-green-700">{calculateCommission(property.price, 2.5)} جنيه</span>
                    </div>
                    <div className="flex justify-between">
                      <span>2%:</span>
                      <span className="font-medium text-green-700">{calculateCommission(property.price, 2)} جنيه</span>
                    </div>
                    <div className="flex justify-between">
                      <span>1.5%:</span>
                      <span className="font-medium text-green-700">{calculateCommission(property.price, 1.5)} جنيه</span>
                    </div>
                  </div>
                </div>

                {/* Sale Date */}
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 ml-2" />
                  <span>تاريخ البيع: {new Date(property.created_at).toLocaleDateString('ar-EG')}</span>
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
              </div>
            </div>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد عقارات مباعة</h3>
            <p className="text-gray-600">لم يتم بيع أي عقارات بعد</p>
          </div>
        )}
      </div>
    </RouteGuard>
  )
}
