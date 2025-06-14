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
  Target,
  Home,
  Store,
  TreePine,
  Building2,
  Briefcase,
  ArrowLeftRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface Property {
  id: string
  customer_name: string
  customer_phone: string
  property_type: string
  operation_type: string
  title: string
  area: number
  price: number
  city: string
  governorate: string
  created_at: string
}

interface Match {
  seller: Property
  buyer: Property
  matchType: 'area' | 'price'
  compatibility: number
}

export default function MatchingPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [matchType, setMatchType] = useState<'area' | 'price'>('area')

  useEffect(() => {
    loadProperties()
  }, [])

  useEffect(() => {
    if (properties.length > 0) {
      findMatches()
    }
  }, [properties, matchType])

  const loadProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('real_estate')
        .select('*')
        .in('sale_status', ['new', 'selling'])
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading properties:', error)
      } else {
        setProperties(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const findMatches = () => {
    const sellers = properties.filter(p => p.operation_type === 'seller')
    const buyers = properties.filter(p => p.operation_type === 'buyer')
    const foundMatches: Match[] = []

    sellers.forEach(seller => {
      buyers.forEach(buyer => {
        // التطابق يجب أن يكون نفس نوع العقار
        if (seller.property_type === buyer.property_type) {
          let compatibility = 0

          if (matchType === 'area' && seller.area && buyer.area) {
            // مطابقة المساحة (±20%)
            const areaDiff = Math.abs(seller.area - buyer.area) / Math.max(seller.area, buyer.area)
            if (areaDiff <= 0.2) {
              compatibility = Math.round((1 - areaDiff) * 100)
            }
          } else if (matchType === 'price') {
            // مطابقة السعر (±30%)
            const priceDiff = Math.abs(seller.price - buyer.price) / Math.max(seller.price, buyer.price)
            if (priceDiff <= 0.3) {
              compatibility = Math.round((1 - priceDiff) * 100)
            }
          }

          if (compatibility > 50) {
            foundMatches.push({
              seller,
              buyer,
              matchType,
              compatibility
            })
          }
        }
      })
    })

    // ترتيب حسب التوافق
    foundMatches.sort((a, b) => b.compatibility - a.compatibility)
    setMatches(foundMatches)
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

  const getWhatsAppLink = (sellerPhone: string, buyerPhone: string, propertyType: string) => {
    const message = encodeURIComponent(
      `مرحباً، لدينا تطابق في ${getPropertyTypeName(propertyType)}.\n\nبيانات البائع: ${sellerPhone}\nبيانات المشتري: ${buyerPhone}\n\nللتواصل والتنسيق.`
    )
    return `https://wa.me/?text=${message}`
  }

  if (loading) {
    return (
      <RouteGuard>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري البحث عن التطابقات...</p>
          </div>
        </div>
      </RouteGuard>
    )
  }

  return (
    <RouteGuard>
      <div className="space-y-6" dir="rtl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center">
            <Target className="w-8 h-8 ml-3" />
            <div>
              <h1 className="text-2xl font-bold">المطابقة الذكية</h1>
              <p className="opacity-90">نظام ذكي لمطابقة البائعين والمشترين حسب المواصفات</p>
            </div>
          </div>
        </div>

        {/* Match Type Selection */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">نوع المطابقة</h3>
          <div className="flex space-x-4">
            <button
              onClick={() => setMatchType('area')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                matchType === 'area'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              مطابقة حسب المساحة
            </button>
            <button
              onClick={() => setMatchType('price')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                matchType === 'price'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              مطابقة حسب السعر
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{matches.length}</div>
              <div className="text-gray-600">إجمالي التطابقات</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {matches.filter(m => m.compatibility >= 80).length}
              </div>
              <div className="text-gray-600">تطابق عالي (80%+)</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {properties.filter(p => p.operation_type === 'seller').length}
              </div>
              <div className="text-gray-600">البائعين</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {properties.filter(p => p.operation_type === 'buyer').length}
              </div>
              <div className="text-gray-600">المشترين</div>
            </div>
          </div>
        </div>

        {/* Matches */}
        <div className="space-y-6">
          {matches.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد تطابقات</h3>
              <p className="text-gray-600">
                لم يتم العثور على تطابقات حسب {matchType === 'area' ? 'المساحة' : 'السعر'}
              </p>
            </div>
          ) : (
            matches.map((match, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md border overflow-hidden">
                {/* Match Header */}
                <div className={`p-4 ${
                  match.compatibility >= 80 ? 'bg-green-50 border-green-200' :
                  match.compatibility >= 70 ? 'bg-yellow-50 border-yellow-200' :
                  'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getPropertyTypeIcon(match.seller.property_type)}
                      <span className="mr-2 font-medium">
                        تطابق {getPropertyTypeName(match.seller.property_type)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        match.compatibility >= 80 ? 'bg-green-100 text-green-800' :
                        match.compatibility >= 70 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {match.compatibility}% توافق
                      </span>
                    </div>
                  </div>
                </div>

                {/* Match Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Seller */}
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <div className="flex items-center mb-3">
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                          بائع
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-500 ml-2" />
                          <span className="font-medium">{match.seller.customer_name}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-gray-500 ml-2" />
                          <span>{match.seller.customer_phone}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-500 ml-2" />
                          <span>{match.seller.city}, {match.seller.governorate}</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 text-gray-500 ml-2" />
                          <span>{match.seller.price.toLocaleString()} جنيه</span>
                        </div>
                        {match.seller.area && (
                          <div className="flex items-center">
                            <Home className="w-4 h-4 text-gray-500 ml-2" />
                            <span>{match.seller.area} م²</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Buyer */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center mb-3">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          مشتري
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-500 ml-2" />
                          <span className="font-medium">{match.buyer.customer_name}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-gray-500 ml-2" />
                          <span>{match.buyer.customer_phone}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-500 ml-2" />
                          <span>{match.buyer.city}, {match.buyer.governorate}</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 text-gray-500 ml-2" />
                          <span>{match.buyer.price.toLocaleString()} جنيه</span>
                        </div>
                        {match.buyer.area && (
                          <div className="flex items-center">
                            <Home className="w-4 h-4 text-gray-500 ml-2" />
                            <span>{match.buyer.area} م²</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-6 text-center">
                    <a
                      href={getWhatsAppLink(match.seller.customer_phone, match.buyer.customer_phone, match.seller.property_type)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center"
                    >
                      <ArrowLeftRight className="w-4 h-4 ml-2" />
                      ربط البائع والمشتري عبر واتساب
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </RouteGuard>
  )
}
