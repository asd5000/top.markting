'use client'

import { useState, useEffect } from 'react'
import { 
  Building2, 
  Search, 
  Filter, 
  Plus,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  MapPin,
  Calendar,
  DollarSign,
  Home,
  Users,
  MoreVertical,
  Download,
  Upload,
  Grid,
  List,
  Star,
  Phone,
  Mail,
  Bed,
  Bath,
  Square,
  Car,
  Elevator,
  Mountain,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  Image,
  Video,
  RefreshCw,
  Settings,
  BarChart3
} from 'lucide-react'
import Header from '@/components/admin/Header'
import Sidebar from '@/components/admin/Sidebar'
import PropertyForm from '@/components/admin/PropertyForm'

interface RealEstateProperty {
  id: string
  clientType: 'seller' | 'buyer'
  propertyType: 'apartment' | 'villa' | 'house' | 'land' | 'shop' | 'office'
  operationType: 'sale' | 'rent'
  
  // Property Details
  area: number
  rooms: number
  bathrooms: number
  floors: number
  finishing: 'none' | 'semi' | 'full' | 'luxury'
  age: number
  elevator: boolean
  garage: boolean
  view: string
  
  // Financial Details
  price: number
  negotiable: boolean
  paymentMethod: 'cash' | 'installments' | 'both'
  
  // Location
  governorate: string
  city: string
  district: string
  street: string
  landmark: string
  
  // Contact Info
  clientName: string
  phone: string
  whatsapp: string
  email: string
  
  // Additional Details
  description: string
  features: string
  notes: string
  
  // Files
  images: string[]
  video?: string
  documents: string[]
  
  // System Fields
  status: 'pending' | 'approved' | 'rejected' | 'featured'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
  viewsCount: number
  inquiriesCount: number
  adminNotes: string
}

export default function RealEstateManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [properties, setProperties] = useState<RealEstateProperty[]>([])
  const [filteredProperties, setFilteredProperties] = useState<RealEstateProperty[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [operationFilter, setOperationFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [selectedProperties, setSelectedProperties] = useState<string[]>([])
  const [showPropertyForm, setShowPropertyForm] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<RealEstateProperty | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const user = {
    name: 'أحمد محمد',
    email: 'admin@topmarketing.com',
    role: 'مدير عام'
  }

  // Mock data - نفس البيانات من الفورم الأصلي
  const mockProperties: RealEstateProperty[] = [
    {
      id: '1',
      clientType: 'seller',
      propertyType: 'apartment',
      operationType: 'sale',
      area: 120,
      rooms: 3,
      bathrooms: 2,
      floors: 1,
      finishing: 'full',
      age: 5,
      elevator: true,
      garage: true,
      view: 'شارع رئيسي',
      price: 850000,
      negotiable: true,
      paymentMethod: 'both',
      governorate: 'القاهرة',
      city: 'المعادي',
      district: 'المعادي الجديدة',
      street: 'شارع 9',
      landmark: 'بجوار مترو المعادي',
      clientName: 'أحمد محمد علي',
      phone: '01012345678',
      whatsapp: '01012345678',
      email: 'ahmed@example.com',
      description: 'شقة مميزة في موقع حيوي',
      features: 'تكييف مركزي، أمن وحراسة، حديقة',
      notes: 'متاحة للمعاينة في أي وقت',
      images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
      documents: [],
      status: 'pending',
      priority: 'high',
      createdAt: '2024-06-10T10:30:00Z',
      updatedAt: '2024-06-10T10:30:00Z',
      viewsCount: 45,
      inquiriesCount: 8,
      adminNotes: ''
    },
    {
      id: '2',
      clientType: 'buyer',
      propertyType: 'villa',
      operationType: 'rent',
      area: 300,
      rooms: 5,
      bathrooms: 4,
      floors: 2,
      finishing: 'luxury',
      age: 2,
      elevator: false,
      garage: true,
      view: 'حديقة',
      price: 15000,
      negotiable: false,
      paymentMethod: 'cash',
      governorate: 'الجيزة',
      city: 'الشيخ زايد',
      district: 'الحي الأول',
      street: 'شارع البستان',
      landmark: 'بجوار مول العرب',
      clientName: 'فاطمة محمود',
      phone: '01098765432',
      whatsapp: '01098765432',
      email: 'fatma@example.com',
      description: 'فيلا فاخرة للإيجار',
      features: 'حمام سباحة، حديقة خاصة، جراج مغطى',
      notes: 'مطلوب عائلة محترمة',
      images: ['/api/placeholder/400/300'],
      documents: [],
      status: 'approved',
      priority: 'medium',
      createdAt: '2024-06-09T14:20:00Z',
      updatedAt: '2024-06-10T09:15:00Z',
      viewsCount: 78,
      inquiriesCount: 15,
      adminNotes: 'عقار مميز - تم التحقق من المالك'
    },
    {
      id: '3',
      clientType: 'seller',
      propertyType: 'land',
      operationType: 'sale',
      area: 500,
      rooms: 0,
      bathrooms: 0,
      floors: 0,
      finishing: 'none',
      age: 0,
      elevator: false,
      garage: false,
      view: 'شارع فرعي',
      price: 1200000,
      negotiable: true,
      paymentMethod: 'installments',
      governorate: 'القاهرة الجديدة',
      city: 'التجمع الخامس',
      district: 'الحي الثالث',
      street: 'شارع التسعين',
      landmark: 'خلف الجامعة الأمريكية',
      clientName: 'خالد حسن',
      phone: '01156789012',
      whatsapp: '01156789012',
      email: 'khaled@example.com',
      description: 'أرض للبيع في موقع استراتيجي',
      features: 'على شارعين، مرافق متاحة',
      notes: 'صالحة للبناء السكني والتجاري',
      images: ['/api/placeholder/400/300'],
      documents: [],
      status: 'featured',
      priority: 'high',
      createdAt: '2024-06-08T16:45:00Z',
      updatedAt: '2024-06-10T11:00:00Z',
      viewsCount: 120,
      inquiriesCount: 25,
      adminNotes: 'عقار مميز - موقع ممتاز'
    }
  ]

  useEffect(() => {
    // محاكاة تحميل البيانات
    setTimeout(() => {
      setProperties(mockProperties)
      setFilteredProperties(mockProperties)
      setLoading(false)
    }, 1000)
  }, [])

  // تطبيق الفلاتر
  useEffect(() => {
    let filtered = properties

    // فلتر البحث
    if (searchTerm) {
      filtered = filtered.filter(property => 
        property.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // فلتر الحالة
    if (statusFilter !== 'all') {
      filtered = filtered.filter(property => property.status === statusFilter)
    }

    // فلتر نوع العقار
    if (typeFilter !== 'all') {
      filtered = filtered.filter(property => property.propertyType === typeFilter)
    }

    // فلتر نوع العملية
    if (operationFilter !== 'all') {
      filtered = filtered.filter(property => property.operationType === operationFilter)
    }

    setFilteredProperties(filtered)
  }, [properties, searchTerm, statusFilter, typeFilter, operationFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'featured': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'معلق'
      case 'approved': return 'موافق عليه'
      case 'rejected': return 'مرفوض'
      case 'featured': return 'مميز'
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'approved': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      case 'featured': return <Star className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getPropertyTypeLabel = (type: string) => {
    switch (type) {
      case 'apartment': return 'شقة'
      case 'villa': return 'فيلا'
      case 'house': return 'بيت'
      case 'land': return 'أرض'
      case 'shop': return 'محل'
      case 'office': return 'مكتب'
      default: return type
    }
  }

  const getOperationTypeLabel = (type: string) => {
    return type === 'sale' ? 'بيع' : 'إيجار'
  }

  const handleSelectProperty = (propertyId: string) => {
    setSelectedProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    )
  }

  const handleSelectAll = () => {
    setSelectedProperties(
      selectedProperties.length === filteredProperties.length 
        ? [] 
        : filteredProperties.map(property => property.id)
    )
  }

  const updatePropertyStatus = (propertyId: string, newStatus: string) => {
    setProperties(properties.map(property => 
      property.id === propertyId 
        ? { ...property, status: newStatus as any, updatedAt: new Date().toISOString() }
        : property
    ))
  }

  const deleteProperty = (propertyId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا العقار؟')) {
      setProperties(properties.filter(property => property.id !== propertyId))
    }
  }

  const stats = [
    { 
      label: 'إجمالي العقارات', 
      value: properties.length, 
      color: 'text-blue-600',
      icon: Building2,
      bgColor: 'bg-blue-500'
    },
    { 
      label: 'معلقة المراجعة', 
      value: properties.filter(p => p.status === 'pending').length, 
      color: 'text-yellow-600',
      icon: Clock,
      bgColor: 'bg-yellow-500'
    },
    { 
      label: 'موافق عليها', 
      value: properties.filter(p => p.status === 'approved').length, 
      color: 'text-green-600',
      icon: CheckCircle,
      bgColor: 'bg-green-500'
    },
    { 
      label: 'مميزة', 
      value: properties.filter(p => p.status === 'featured').length, 
      color: 'text-purple-600',
      icon: Star,
      bgColor: 'bg-purple-500'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات العقارات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        
        <main className="flex-1 lg:mr-64">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 sm:px-0">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <Building2 className="w-8 h-8 ml-3" />
                    إدارة العقارات الشاملة
                  </h1>
                  <p className="text-gray-600 mt-2">نظام متكامل لإدارة ومراجعة جميع العقارات</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="btn border border-gray-300 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    تصدير
                  </button>
                  <button className="btn border border-gray-300 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    استيراد
                  </button>
                  <button 
                    onClick={() => setShowPropertyForm(true)}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    إضافة عقار جديد
                  </button>
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="card hover:shadow-lg transition-shadow">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="mr-4">
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Search and Filters */}
              <div className="card mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="البحث في العقارات..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input pr-10"
                      />
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="flex items-center space-x-4">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="form-input"
                    >
                      <option value="all">جميع الحالات</option>
                      <option value="pending">معلق</option>
                      <option value="approved">موافق عليه</option>
                      <option value="rejected">مرفوض</option>
                      <option value="featured">مميز</option>
                    </select>

                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="form-input"
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
                      value={operationFilter}
                      onChange={(e) => setOperationFilter(e.target.value)}
                      className="form-input"
                    >
                      <option value="all">جميع العمليات</option>
                      <option value="sale">بيع</option>
                      <option value="rent">إيجار</option>
                    </select>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <List className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <Grid className="w-5 h-5" />
                      </button>
                    </div>

                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="btn border border-gray-300 flex items-center gap-2"
                    >
                      <Filter className="w-4 h-4" />
                      فلاتر متقدمة
                    </button>
                  </div>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="form-label">المحافظة</label>
                        <select className="form-input">
                          <option value="">جميع المحافظات</option>
                          <option value="cairo">القاهرة</option>
                          <option value="giza">الجيزة</option>
                          <option value="alexandria">الإسكندرية</option>
                        </select>
                      </div>
                      <div>
                        <label className="form-label">نطاق السعر</label>
                        <div className="flex space-x-2">
                          <input type="number" placeholder="من" className="form-input" />
                          <input type="number" placeholder="إلى" className="form-input" />
                        </div>
                      </div>
                      <div>
                        <label className="form-label">المساحة</label>
                        <div className="flex space-x-2">
                          <input type="number" placeholder="من" className="form-input" />
                          <input type="number" placeholder="إلى" className="form-input" />
                        </div>
                      </div>
                      <div>
                        <label className="form-label">عدد الغرف</label>
                        <select className="form-input">
                          <option value="">أي عدد</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4+</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Properties Table/Grid */}
              {viewMode === 'list' ? (
                <div className="card">
                  <div className="overflow-x-auto">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>
                            <input
                              type="checkbox"
                              checked={selectedProperties.length === filteredProperties.length && filteredProperties.length > 0}
                              onChange={handleSelectAll}
                              className="rounded border-gray-300"
                            />
                          </th>
                          <th>العقار</th>
                          <th>العميل</th>
                          <th>الموقع</th>
                          <th>السعر</th>
                          <th>التفاصيل</th>
                          <th>الحالة</th>
                          <th>الأولوية</th>
                          <th>الإحصائيات</th>
                          <th>إجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProperties.map((property) => (
                          <tr key={property.id} className="hover:bg-gray-50">
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedProperties.includes(property.id)}
                                onChange={() => handleSelectProperty(property.id)}
                                className="rounded border-gray-300"
                              />
                            </td>
                            <td>
                              <div className="flex items-center">
                                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                                  {property.images[0] && (
                                    <img
                                      src={property.images[0]}
                                      alt="عقار"
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                </div>
                                <div className="mr-3">
                                  <div className="font-medium text-gray-900">
                                    {getPropertyTypeLabel(property.propertyType)} - {getOperationTypeLabel(property.operationType)}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {property.area} م² - {property.rooms} غرف
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div>
                                <div className="font-medium text-gray-900">{property.clientName}</div>
                                <div className="text-sm text-gray-600 flex items-center">
                                  <Phone className="w-3 h-3 ml-1" />
                                  {property.phone}
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="text-sm">
                                <div className="font-medium text-gray-900">{property.city}</div>
                                <div className="text-gray-600">{property.district}</div>
                              </div>
                            </td>
                            <td>
                              <div className="font-medium text-gray-900">
                                {property.price.toLocaleString()} ج.م
                              </div>
                              <div className="text-sm text-gray-600">
                                {property.negotiable ? 'قابل للتفاوض' : 'غير قابل للتفاوض'}
                              </div>
                            </td>
                            <td>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <Bed className="w-4 h-4 ml-1" />
                                  {property.rooms}
                                </div>
                                <div className="flex items-center">
                                  <Bath className="w-4 h-4 ml-1" />
                                  {property.bathrooms}
                                </div>
                                <div className="flex items-center">
                                  <Square className="w-4 h-4 ml-1" />
                                  {property.area}م²
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="flex items-center">
                                {getStatusIcon(property.status)}
                                <span className={`mr-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                                  {getStatusLabel(property.status)}
                                </span>
                              </div>
                            </td>
                            <td>
                              <span className={`font-medium ${getPriorityColor(property.priority)}`}>
                                {property.priority === 'high' ? 'عالية' :
                                 property.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                              </span>
                            </td>
                            <td>
                              <div className="text-sm text-gray-600">
                                <div className="flex items-center">
                                  <Eye className="w-3 h-3 ml-1" />
                                  {property.viewsCount} مشاهدة
                                </div>
                                <div className="flex items-center mt-1">
                                  <Phone className="w-3 h-3 ml-1" />
                                  {property.inquiriesCount} استفسار
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => setSelectedProperty(property)}
                                  className="p-1 text-blue-600 hover:text-blue-800"
                                  title="عرض التفاصيل"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-1 text-green-600 hover:text-green-800" title="تعديل">
                                  <Edit className="w-4 h-4" />
                                </button>
                                {property.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => updatePropertyStatus(property.id, 'approved')}
                                      className="p-1 text-green-600 hover:text-green-800"
                                      title="موافقة"
                                    >
                                      <Check className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => updatePropertyStatus(property.id, 'rejected')}
                                      className="p-1 text-red-600 hover:text-red-800"
                                      title="رفض"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() => deleteProperty(property.id)}
                                  className="p-1 text-red-600 hover:text-red-800"
                                  title="حذف"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {filteredProperties.length === 0 && (
                    <div className="text-center py-12">
                      <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">لا توجد عقارات مطابقة للبحث</p>
                    </div>
                  )}
                </div>
              ) : (
                // Grid View
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map((property) => (
                    <div key={property.id} className="card hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <div className="h-48 bg-gray-200 rounded-lg overflow-hidden">
                          {property.images[0] && (
                            <img
                              src={property.images[0]}
                              alt="عقار"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="absolute top-2 right-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                            {getStatusLabel(property.status)}
                          </span>
                        </div>
                        <div className="absolute top-2 left-2">
                          <span className={`font-medium text-sm ${getPriorityColor(property.priority)}`}>
                            {property.priority === 'high' ? '🔴' :
                             property.priority === 'medium' ? '🟡' : '🟢'}
                          </span>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            {getPropertyTypeLabel(property.propertyType)} - {getOperationTypeLabel(property.operationType)}
                          </h3>
                          <span className="text-lg font-bold text-blue-600">
                            {property.price.toLocaleString()} ج.م
                          </span>
                        </div>

                        <div className="text-sm text-gray-600 mb-3">
                          <div className="flex items-center mb-1">
                            <MapPin className="w-4 h-4 ml-1" />
                            {property.city} - {property.district}
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Bed className="w-4 h-4 ml-1" />
                              {property.rooms} غرف
                            </div>
                            <div className="flex items-center">
                              <Bath className="w-4 h-4 ml-1" />
                              {property.bathrooms} حمام
                            </div>
                            <div className="flex items-center">
                              <Square className="w-4 h-4 ml-1" />
                              {property.area} م²
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <div className="text-sm text-gray-600">
                            <div className="flex items-center">
                              <User className="w-3 h-3 ml-1" />
                              {property.clientName}
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            <div className="flex items-center space-x-3">
                              <span className="flex items-center">
                                <Eye className="w-3 h-3 ml-1" />
                                {property.viewsCount}
                              </span>
                              <span className="flex items-center">
                                <Phone className="w-3 h-3 ml-1" />
                                {property.inquiriesCount}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedProperty(property)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                              title="عرض التفاصيل"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg" title="تعديل">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteProperty(property.id)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {property.status === 'pending' && (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updatePropertyStatus(property.id, 'approved')}
                                className="btn btn-sm bg-green-500 text-white hover:bg-green-600"
                              >
                                موافقة
                              </button>
                              <button
                                onClick={() => updatePropertyStatus(property.id, 'rejected')}
                                className="btn btn-sm bg-red-500 text-white hover:bg-red-600"
                              >
                                رفض
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Property Form Modal */}
      <PropertyForm
        isOpen={showPropertyForm}
        onClose={() => {
          setShowPropertyForm(false)
          setSelectedProperty(null)
        }}
        onSubmit={(propertyData) => {
          if (selectedProperty) {
            // تحديث عقار موجود
            setProperties(properties.map(p =>
              p.id === selectedProperty.id ? propertyData : p
            ))
          } else {
            // إضافة عقار جديد
            setProperties([...properties, propertyData])
          }
        }}
        property={selectedProperty}
      />

      {/* Property Details Modal */}
      {selectedProperty && !showPropertyForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">تفاصيل العقار</h3>
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* معلومات العقار */}
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-3">معلومات العقار</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">النوع:</span>
                        <span className="font-medium">{getPropertyTypeLabel(selectedProperty.propertyType)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">العملية:</span>
                        <span className="font-medium">{getOperationTypeLabel(selectedProperty.operationType)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">المساحة:</span>
                        <span className="font-medium">{selectedProperty.area} م²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">الغرف:</span>
                        <span className="font-medium">{selectedProperty.rooms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">الحمامات:</span>
                        <span className="font-medium">{selectedProperty.bathrooms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">السعر:</span>
                        <span className="font-medium text-blue-600">{selectedProperty.price.toLocaleString()} ج.م</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-3">معلومات العميل</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">الاسم:</span>
                        <span className="font-medium">{selectedProperty.clientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">الهاتف:</span>
                        <span className="font-medium">{selectedProperty.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">البريد:</span>
                        <span className="font-medium">{selectedProperty.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-3">الموقع</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">المحافظة:</span>
                        <span className="font-medium">{selectedProperty.governorate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">المدينة:</span>
                        <span className="font-medium">{selectedProperty.city}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">الحي:</span>
                        <span className="font-medium">{selectedProperty.district}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* الوصف والملاحظات */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">وصف العقار</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {selectedProperty.description || 'لا يوجد وصف'}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">المميزات</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {selectedProperty.features || 'لا توجد مميزات محددة'}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">ملاحظات</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {selectedProperty.notes || 'لا توجد ملاحظات'}
                    </p>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-3">إحصائيات</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">المشاهدات:</span>
                        <span className="font-medium">{selectedProperty.viewsCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">الاستفسارات:</span>
                        <span className="font-medium">{selectedProperty.inquiriesCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">تاريخ الإضافة:</span>
                        <span className="font-medium">{new Date(selectedProperty.createdAt).toLocaleDateString('ar-EG')}</span>
                      </div>
                    </div>
                  </div>

                  {/* أزرار الإجراءات */}
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => {
                        setShowPropertyForm(true)
                      }}
                      className="btn btn-primary flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      تعديل
                    </button>
                    {selectedProperty.status === 'pending' && (
                      <>
                        <button
                          onClick={() => {
                            updatePropertyStatus(selectedProperty.id, 'approved')
                            setSelectedProperty(null)
                          }}
                          className="btn bg-green-500 text-white hover:bg-green-600 flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          موافقة
                        </button>
                        <button
                          onClick={() => {
                            updatePropertyStatus(selectedProperty.id, 'rejected')
                            setSelectedProperty(null)
                          }}
                          className="btn bg-red-500 text-white hover:bg-red-600 flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          رفض
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
