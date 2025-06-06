'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Building, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  Home, 
  Eye,
  Phone,
  MessageCircle,
  Star,
  Calendar,
  User,
  Camera,
  FileText,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { 
  realEstatePropertyTypes, 
  realEstateOperationTypes, 
  egyptianGovernorates,
  RealEstateProperty 
} from '@/data/services/services-data'

// Mock data for properties
const mockProperties: RealEstateProperty[] = [
  {
    id: '1',
    operationType: 'seller',
    propertyType: 'apartment',
    title: 'شقة للبيع في المعادي',
    description: 'شقة 3 غرف وصالة في موقع متميز بالمعادي، تشطيب سوبر لوكس',
    area: 150,
    price: 2500000,
    priceType: 'total',
    location: {
      governorate: 'القاهرة',
      city: 'المعادي',
      district: 'المعادي الجديدة',
      nearbyLandmarks: ['مترو المعادي', 'كورنيش النيل']
    },
    details: {
      rooms: 3,
      bathrooms: 2,
      floor: 5,
      furnished: 'semi_furnished',
      direction: 'north',
      view: ['إطلالة على النيل'],
      parking: true,
      balcony: true,
      elevator: true
    },
    features: ['مصعد', 'موقف سيارات', 'بلكونة', 'إطلالة مميزة'],
    amenities: ['كهرباء', 'مياه', 'غاز طبيعي', 'إنترنت'],
    financial: {
      downPayment: 500000,
      monthlyInstallment: 15000,
      installmentPeriod: 60
    },
    images: [],
    contactInfo: {
      name: 'أحمد محمد',
      phone: '+201234567890',
      email: 'ahmed@example.com',
      isOwner: true,
      preferredContactTime: 'مساءً'
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    status: 'active',
    priority: 'high',
    featured: true,
    views: 45,
    inquiries: 8,
    verificationStatus: 'verified'
  },
  {
    id: '2',
    operationType: 'buyer',
    propertyType: 'villa',
    title: 'مطلوب فيلا في الشيخ زايد',
    description: 'أبحث عن فيلا 4 غرف في الشيخ زايد، ميزانية حتى 8 مليون',
    area: 300,
    price: 8000000,
    priceType: 'negotiable',
    location: {
      governorate: 'الجيزة',
      city: 'الشيخ زايد',
      district: 'الحي الأول',
      nearbyLandmarks: ['مول العرب', 'جامعة زايد']
    },
    details: {
      rooms: 4,
      bathrooms: 3,
      floors: 2,
      garden: true,
      parking: true,
      security: true
    },
    features: ['حديقة', 'موقف سيارات', 'أمن وحراسة'],
    amenities: ['كهرباء', 'مياه', 'غاز طبيعي'],
    financial: {
      downPayment: 2000000
    },
    images: [],
    contactInfo: {
      name: 'فاطمة علي',
      phone: '+201987654321',
      isOwner: true,
      preferredContactTime: 'صباحاً'
    },
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    status: 'active',
    priority: 'medium',
    featured: false,
    views: 23,
    inquiries: 3,
    verificationStatus: 'pending'
  }
]

export default function RealEstateSystemPage() {
  const [properties, setProperties] = useState<RealEstateProperty[]>(mockProperties)
  const [selectedOperation, setSelectedOperation] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Filter properties
  const filteredProperties = properties.filter(property => {
    const matchesOperation = selectedOperation === 'all' || property.operationType === selectedOperation
    const matchesType = selectedType === 'all' || property.propertyType === selectedType
    const matchesGovernorate = selectedGovernorate === 'all' || property.location.governorate === selectedGovernorate
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.city.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesOperation && matchesType && matchesGovernorate && matchesSearch
  })

  const getOperationColor = (operation: string) => {
    return operation === 'seller' ? 'text-green-600 bg-green-100' : 'text-blue-600 bg-blue-100'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100'
      case 'sold':
        return 'text-gray-600 bg-gray-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)} مليون جنيه`
    }
    return `${price.toLocaleString()} جنيه`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Building className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              نظام الوساطة العقارية
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              منصة متكاملة للبيع والشراء العقاري - اعثر على عقارك المثالي أو اعرض عقارك للبيع
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/real-estate-system/add-property"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                <Plus className="w-5 h-5 ml-2" />
                أضف عقارك
              </Link>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
              >
                <Filter className="w-5 h-5 ml-2" />
                فلترة النتائج
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث عن عقار..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Quick Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Operation Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع العملية
              </label>
              <select
                value={selectedOperation}
                onChange={(e) => setSelectedOperation(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع العمليات</option>
                {realEstateOperationTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع العقار
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع الأنواع</option>
                {realEstatePropertyTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Governorate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المحافظة
              </label>
              <select
                value={selectedGovernorate}
                onChange={(e) => setSelectedGovernorate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع المحافظات</option>
                {egyptianGovernorates.map((gov) => (
                  <option key={gov} value={gov}>
                    {gov}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-blue-600">{filteredProperties.length}</span> عقار متاح
              </div>
            </div>
          </div>
        </motion.div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Property Image */}
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOperationColor(property.operationType)}`}>
                    {realEstateOperationTypes.find(t => t.id === property.operationType)?.name}
                  </span>
                </div>
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(property.status)}`}>
                    {property.status === 'active' ? 'متاح' : property.status}
                  </span>
                </div>
                {property.featured && (
                  <div className="absolute bottom-4 right-4">
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                      <Star className="w-3 h-3 ml-1" />
                      مميز
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="text-4xl mb-2">
                      {realEstatePropertyTypes.find(t => t.id === property.propertyType)?.icon}
                    </div>
                    <Camera className="w-8 h-8 mx-auto opacity-60" />
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Title and Price */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900 flex-1">
                    {property.title}
                  </h3>
                  <div className="text-left mr-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatPrice(property.price)}
                    </div>
                    {property.priceType === 'per_meter' && (
                      <div className="text-sm text-gray-500">للمتر المربع</div>
                    )}
                    {property.priceType === 'negotiable' && (
                      <div className="text-sm text-green-600">قابل للتفاوض</div>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center mb-4">
                  <MapPin className="w-4 h-4 text-gray-400 ml-2" />
                  <span className="text-gray-600">
                    {property.location.city}, {property.location.governorate}
                  </span>
                </div>

                {/* Property Details */}
                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">{property.area}</div>
                    <div className="text-gray-500">متر مربع</div>
                  </div>
                  {property.details.rooms && (
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{property.details.rooms}</div>
                      <div className="text-gray-500">غرفة</div>
                    </div>
                  )}
                  {property.details.bathrooms && (
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{property.details.bathrooms}</div>
                      <div className="text-gray-500">حمام</div>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {property.features.slice(0, 3).map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                  {property.features.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{property.features.length - 3} مميزات
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 ml-1" />
                    {property.views} مشاهدة
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="w-4 h-4 ml-1" />
                    {property.inquiries} استفسار
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 ml-1" />
                    {property.createdAt.toLocaleDateString('ar-EG')}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 ml-2" />
                      <span className="text-gray-700">{property.contactInfo.name}</span>
                      {property.contactInfo.isOwner && (
                        <span className="mr-2 px-2 py-1 bg-green-100 text-green-600 text-xs rounded">
                          مالك
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2 space-x-reverse">
                      <a
                        href={`tel:${property.contactInfo.phone}`}
                        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                        title="اتصال"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                      <a
                        href={`https://wa.me/${property.contactInfo.phone.replace('+', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
                        title="واتساب"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                      <Link
                        href={`/real-estate-system/property/${property.id}`}
                        className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
                        title="عرض التفاصيل"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProperties.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              لا توجد عقارات مطابقة للبحث
            </h3>
            <p className="text-gray-600 mb-6">
              جرب تغيير معايير البحث أو إضافة عقارك الآن
            </p>
            <Link
              href="/real-estate-system/add-property"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <Plus className="w-5 h-5 ml-2" />
              أضف عقارك
            </Link>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  )
}
