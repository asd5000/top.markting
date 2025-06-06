'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Search,
  Download,
  DollarSign,
  Clock,
  CheckCircle,
  X,
  Save
} from 'lucide-react'
import { useAuth, usePermissions } from '@/lib/auth/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { servicesData, ServiceItem, ServiceCategory } from '@/data/services/services-data'
import { toast } from 'react-hot-toast'
import { storageManager } from '@/lib/storage/local-storage'

export default function AdminServicesPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { isAdmin } = usePermissions()
  const router = useRouter()
  const [categories, setCategories] = useState<ServiceCategory[]>(servicesData)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingService, setEditingService] = useState<ServiceItem | null>(null)

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin())) {
      router.push('/auth/login')
      return
    }
  }, [user, isAuthenticated, isLoading, isAdmin, router])

  // Load services from localStorage on component mount
  useEffect(() => {
    const savedServices = storageManager.getServices()
    if (savedServices.length > 0) {
      setCategories(savedServices)
    }
  }, [])

  // Save services to localStorage whenever categories change
  useEffect(() => {
    storageManager.saveServices(categories)
  }, [categories])



  const getAllServices = () => {
    return categories.flatMap(category => 
      category.services.map(service => ({
        ...service,
        categoryName: category.name
      }))
    )
  }

  const filteredServices = getAllServices().filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const updateService = (updatedService: ServiceItem) => {
    setCategories(prev => prev.map(category => ({
      ...category,
      services: category.services.map(service =>
        service.id === updatedService.id ? updatedService : service
      )
    })))
    toast.success('تم تحديث الخدمة بنجاح')
    setShowEditModal(false)
    setEditingService(null)
  }

  const addService = (newService: Omit<ServiceItem, 'id'>) => {
    const serviceWithId = {
      ...newService,
      id: `service-${Date.now()}`
    }

    setCategories(prev => prev.map(category =>
      category.id === newService.category
        ? { ...category, services: [...category.services, serviceWithId] }
        : category
    ))

    toast.success('تم إضافة الخدمة بنجاح')
    setShowEditModal(false)
    setEditingService(null)
  }

  const deleteService = (serviceId: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
      setCategories(prev => prev.map(category => ({
        ...category,
        services: category.services.filter(service => service.id !== serviceId)
      })))
      toast.success('تم حذف الخدمة بنجاح')
    }
  }

  const toggleServiceStatus = (serviceId: string) => {
    setCategories(prev => prev.map(category => ({
      ...category,
      services: category.services.map(service => 
        service.id === serviceId 
          ? { ...service, isActive: !service.isActive }
          : service
      )
    })))
    toast.success('تم تحديث حالة الخدمة')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4" />
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-800 ml-4">
                ← العودة للوحة التحكم
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">إدارة الخدمات</h1>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                onClick={() => {
                  setEditingService({
                    id: '',
                    name: '',
                    description: '',
                    price: 0,
                    duration: '',
                    features: [],
                    isActive: true,
                    category: categories[0]?.id || ''
                  })
                  setShowEditModal(true)
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة خدمة
              </button>
              <button
                onClick={() => toast.success('سيتم تصدير البيانات')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Download className="w-4 h-4 ml-2" />
                تصدير
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="بحث في الخدمات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">جميع الفئات</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Results Count */}
            <div className="flex items-center justify-center bg-blue-50 rounded-lg p-2">
              <span className="text-blue-600 font-semibold">
                {filteredServices.length} خدمة
              </span>
            </div>
          </div>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              {/* Service Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${service.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="mr-2 text-sm text-gray-500">{service.categoryName}</span>
                </div>
                <div className="flex space-x-1 space-x-reverse">
                  <button
                    onClick={() => {
                      setEditingService(service)
                      setShowEditModal(true)
                    }}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="تعديل"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteService(service.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Service Info */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 ml-1" />
                    السعر
                  </div>
                  <span className="font-semibold text-green-600">
                    {service.price === 0 ? 'مجاني' : `${service.price} جنيه`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 ml-1" />
                    المدة
                  </div>
                  <span className="text-sm">{service.duration}</span>
                </div>
              </div>

              {/* Features */}
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">المميزات:</div>
                <div className="flex flex-wrap gap-1">
                  {service.features.slice(0, 3).map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                  {service.features.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{service.features.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 space-x-reverse">
                <button
                  onClick={() => setSelectedService(service)}
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  title="عرض التفاصيل"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleServiceStatus(service.id)}
                  className={`flex-1 py-2 px-3 rounded-lg transition-colors flex items-center justify-center ${
                    service.isActive
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                  title={service.isActive ? 'إيقاف' : 'تفعيل'}
                >
                  {service.isActive ? <X className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              لا توجد خدمات
            </h3>
            <p className="text-gray-600 mb-6">
              لم يتم العثور على خدمات مطابقة للبحث
            </p>
          </motion.div>
        )}

        {/* Service Details Modal */}
        {selectedService && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setSelectedService(null)} />
              
              <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-right align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    تفاصيل الخدمة
                  </h3>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        اسم الخدمة
                      </label>
                      <div className="text-lg font-semibold">
                        {selectedService.name}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الفئة
                      </label>
                      <div className="text-lg">
                        {selectedService.category}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        السعر
                      </label>
                      <div className="text-lg font-semibold text-green-600">
                        {selectedService.price === 0 ? 'مجاني' : `${selectedService.price} جنيه`}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        مدة التنفيذ
                      </label>
                      <div className="text-lg">
                        {selectedService.duration}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الوصف
                    </label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {selectedService.description}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المميزات
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedService.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6 border-t">
                    <button
                      onClick={() => {
                        setEditingService(selectedService)
                        setSelectedService(null)
                        setShowEditModal(true)
                      }}
                      className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <Edit className="w-5 h-5 ml-2" />
                      تعديل
                    </button>
                    <button
                      onClick={() => setSelectedService(null)}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      إغلاق
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit/Add Service Modal */}
        {showEditModal && editingService && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowEditModal(false)} />

              <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-right align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {editingService.id ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
                  </h3>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault()
                  if (editingService.id) {
                    updateService(editingService)
                  } else {
                    addService(editingService)
                  }
                }}>
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="form-label">اسم الخدمة *</label>
                        <input
                          type="text"
                          value={editingService.name}
                          onChange={(e) => setEditingService(prev => ({ ...prev!, name: e.target.value }))}
                          className="form-input"
                          required
                        />
                      </div>

                      <div>
                        <label className="form-label">الفئة *</label>
                        <select
                          value={editingService.category}
                          onChange={(e) => setEditingService(prev => ({ ...prev!, category: e.target.value }))}
                          className="form-input"
                          required
                        >
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="form-label">السعر (جنيه) *</label>
                        <input
                          type="number"
                          min="0"
                          value={editingService.price}
                          onChange={(e) => setEditingService(prev => ({ ...prev!, price: Number(e.target.value) }))}
                          className="form-input"
                          required
                        />
                      </div>

                      <div>
                        <label className="form-label">مدة التنفيذ *</label>
                        <input
                          type="text"
                          value={editingService.duration}
                          onChange={(e) => setEditingService(prev => ({ ...prev!, duration: e.target.value }))}
                          className="form-input"
                          placeholder="مثال: 2-3 أيام"
                          required
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="form-label">الوصف *</label>
                      <textarea
                        value={editingService.description}
                        onChange={(e) => setEditingService(prev => ({ ...prev!, description: e.target.value }))}
                        className="form-input"
                        rows={4}
                        required
                      />
                    </div>

                    {/* Features */}
                    <div>
                      <label className="form-label">المميزات</label>
                      <div className="space-y-2">
                        {editingService.features.map((feature, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={feature}
                              onChange={(e) => {
                                const newFeatures = [...editingService.features]
                                newFeatures[index] = e.target.value
                                setEditingService(prev => ({ ...prev!, features: newFeatures }))
                              }}
                              className="form-input flex-1"
                              placeholder={`ميزة ${index + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newFeatures = editingService.features.filter((_, i) => i !== index)
                                setEditingService(prev => ({ ...prev!, features: newFeatures }))
                              }}
                              className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingService(prev => ({
                              ...prev!,
                              features: [...prev!.features, '']
                            }))
                          }}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
                        >
                          <Plus className="w-4 h-4 ml-2" />
                          إضافة ميزة
                        </button>
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editingService.isActive}
                          onChange={(e) => setEditingService(prev => ({ ...prev!, isActive: e.target.checked }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 ml-2"
                        />
                        <span className="text-gray-700">خدمة نشطة</span>
                      </label>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-6 border-t">
                      <button
                        type="button"
                        onClick={() => setShowEditModal(false)}
                        className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        <Save className="w-5 h-5 ml-2" />
                        {editingService.id ? 'حفظ التغييرات' : 'إضافة الخدمة'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
