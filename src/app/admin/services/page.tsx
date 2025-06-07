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
import { toast } from 'react-hot-toast'
import { serviceOperations } from '@/lib/supabase/operations'
import { useRealtimeServices } from '@/hooks/useRealtime'

interface Service {
  id: string
  name_ar: string
  name_en: string
  description_ar: string | null
  description_en: string | null
  price: number
  currency: string | null
  duration_text: string | null
  features: string[] | null
  is_active: boolean | null
  category: string | null
  category_name: string | null
}

export default function AdminServicesPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { isAdmin } = usePermissions()
  const router = useRouter()
  const { services, isLoading: isLoadingServices, setServices } = useRealtimeServices()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin())) {
      router.push('/auth/login')
      return
    }
  }, [user, isAuthenticated, isLoading, isAdmin, router])

  // Authentication check
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin())) {
      router.push('/auth/login')
      return
    }
  }, [user, isAuthenticated, isLoading, isAdmin, router])



  const filteredServices = services.filter(service => {
    const matchesSearch = (service.name_ar?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         (service.description_ar?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         (service.name_en?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const updateService = async (updatedService: Service) => {
    if (isProcessing) return

    try {
      setIsProcessing(true)
      console.log('🔄 Updating service:', updatedService.id)

      const result = await serviceOperations.updateService(updatedService.id, {
        name_ar: updatedService.name_ar,
        name_en: updatedService.name_en,
        description_ar: updatedService.description_ar,
        description_en: updatedService.description_en,
        price: updatedService.price,
        duration_text: updatedService.duration_text,
        features: updatedService.features,
        is_active: updatedService.is_active,
        category: updatedService.category,
        category_name: updatedService.category_name
      })

      // Real-time will handle the update automatically
      toast.success('✅ تم تحديث الخدمة بنجاح')
      setShowEditModal(false)
      setEditingService(null)

    } catch (error) {
      console.error('❌ Error updating service:', error)
      toast.error('حدث خطأ أثناء تحديث الخدمة')
    } finally {
      setIsProcessing(false)
    }
  }

  const addService = async (newService: Omit<Service, 'id'>) => {
    if (isProcessing) return

    try {
      setIsProcessing(true)
      console.log('🔄 Adding new service:', newService)

      const data = await serviceOperations.createService({
        name_ar: newService.name_ar,
        name_en: newService.name_en,
        description_ar: newService.description_ar,
        description_en: newService.description_en,
        price: newService.price,
        duration_text: newService.duration_text,
        features: newService.features,
        is_active: newService.is_active ?? true,
        category: newService.category,
        category_name: newService.category_name
      })

      // Real-time will handle the addition automatically
      toast.success('✅ تم إضافة الخدمة بنجاح')
      setShowEditModal(false)
      setEditingService(null)

    } catch (error) {
      console.error('❌ Error adding service:', error)
      toast.error('حدث خطأ أثناء إضافة الخدمة')
    } finally {
      setIsProcessing(false)
    }
  }

  const deleteService = async (serviceId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
      return
    }

    if (isProcessing) return

    try {
      setIsProcessing(true)
      console.log('🔄 Deleting service:', serviceId)

      await serviceOperations.deleteService(serviceId)

      // Real-time will handle the deletion automatically
      toast.success('✅ تم حذف الخدمة بنجاح')

    } catch (error) {
      console.error('❌ Error deleting service:', error)
      toast.error('حدث خطأ أثناء حذف الخدمة')
    } finally {
      setIsProcessing(false)
    }
  }

  const toggleServiceStatus = async (serviceId: string) => {
    if (isProcessing) return

    try {
      setIsProcessing(true)

      const service = services.find(s => s.id === serviceId)
      if (!service) return

      console.log('🔄 Toggling service status:', serviceId, 'to', !service.is_active)

      await serviceOperations.updateService(serviceId, {
        is_active: !service.is_active
      })

      // Real-time will handle the update automatically
      toast.success('✅ تم تحديث حالة الخدمة')

    } catch (error) {
      console.error('❌ Error toggling service status:', error)
      toast.error('حدث خطأ أثناء تحديث حالة الخدمة')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading || isLoadingServices) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل الخدمات...</p>
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
                    name_ar: '',
                    name_en: '',
                    description_ar: '',
                    description_en: '',
                    price: 0,
                    currency: 'EGP',
                    duration_text: '',
                    features: [],
                    is_active: true,
                    category: 'design',
                    category_name: 'التصميم'
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
              <option value="design">التصميم</option>
              <option value="marketing">التسويق</option>
              <option value="video-editing">مونتاج الفيديو</option>
              <option value="followers">زيادة المتابعين</option>
              <option value="data-extraction">استخراج البيانات</option>
              <option value="web-development">تطوير المواقع</option>
              <option value="real-estate">التسويق العقاري</option>
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
                  <div className={`w-3 h-3 rounded-full ${service.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="mr-2 text-sm text-gray-500">{service.category_name}</span>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name_ar}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description_ar}</p>

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
                  <span className="text-sm">{service.duration_text}</span>
                </div>
              </div>

              {/* Features */}
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">المميزات:</div>
                <div className="flex flex-wrap gap-1">
                  {service.features?.slice(0, 3).map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full"
                    >
                      {feature}
                    </span>
                  )) || []}
                  {(service.features?.length || 0) > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{(service.features?.length || 0) - 3}
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
                    service.is_active
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                  title={service.is_active ? 'إيقاف' : 'تفعيل'}
                >
                  {service.is_active ? <X className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
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
                        {selectedService.name_ar}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الفئة
                      </label>
                      <div className="text-lg">
                        {selectedService.category_name}
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
                        {selectedService.duration_text}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الوصف
                    </label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {selectedService.description_ar}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المميزات
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedService.features?.map((feature, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {feature}
                        </span>
                      )) || []}
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
                        <label className="form-label">اسم الخدمة (عربي) *</label>
                        <input
                          type="text"
                          value={editingService.name_ar || ''}
                          onChange={(e) => setEditingService(prev => ({ ...prev!, name_ar: e.target.value }))}
                          className="form-input"
                          required
                        />
                      </div>

                      <div>
                        <label className="form-label">اسم الخدمة (إنجليزي)</label>
                        <input
                          type="text"
                          value={editingService.name_en || ''}
                          onChange={(e) => setEditingService(prev => ({ ...prev!, name_en: e.target.value }))}
                          className="form-input"
                        />
                      </div>

                      <div>
                        <label className="form-label">الفئة *</label>
                        <select
                          value={editingService.category || ''}
                          onChange={(e) => {
                            const categoryNames: Record<string, string> = {
                              'design': 'التصميم',
                              'marketing': 'التسويق',
                              'video-editing': 'مونتاج الفيديو',
                              'followers': 'زيادة المتابعين',
                              'data-extraction': 'استخراج البيانات',
                              'web-development': 'تطوير المواقع',
                              'real-estate': 'التسويق العقاري'
                            }
                            setEditingService(prev => ({
                              ...prev!,
                              category: e.target.value,
                              category_name: categoryNames[e.target.value] || e.target.value
                            }))
                          }}
                          className="form-input"
                          required
                        >
                          <option value="design">التصميم</option>
                          <option value="marketing">التسويق</option>
                          <option value="video-editing">مونتاج الفيديو</option>
                          <option value="followers">زيادة المتابعين</option>
                          <option value="data-extraction">استخراج البيانات</option>
                          <option value="web-development">تطوير المواقع</option>
                          <option value="real-estate">التسويق العقاري</option>
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
                          value={editingService.duration_text || ''}
                          onChange={(e) => setEditingService(prev => ({ ...prev!, duration_text: e.target.value }))}
                          className="form-input"
                          placeholder="مثال: 2-3 أيام"
                          required
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="form-label">الوصف (عربي) *</label>
                        <textarea
                          value={editingService.description_ar || ''}
                          onChange={(e) => setEditingService(prev => ({ ...prev!, description_ar: e.target.value }))}
                          className="form-input"
                          rows={4}
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label">الوصف (إنجليزي)</label>
                        <textarea
                          value={editingService.description_en || ''}
                          onChange={(e) => setEditingService(prev => ({ ...prev!, description_en: e.target.value }))}
                          className="form-input"
                          rows={4}
                        />
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <label className="form-label">المميزات</label>
                      <div className="space-y-2">
                        {(editingService.features || []).map((feature, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={feature}
                              onChange={(e) => {
                                const newFeatures = [...(editingService.features || [])]
                                newFeatures[index] = e.target.value
                                setEditingService(prev => ({ ...prev!, features: newFeatures }))
                              }}
                              className="form-input flex-1"
                              placeholder={`ميزة ${index + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newFeatures = (editingService.features || []).filter((_, i) => i !== index)
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
                              features: [...(prev!.features || []), '']
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
                          checked={editingService.is_active || false}
                          onChange={(e) => setEditingService(prev => ({ ...prev!, is_active: e.target.checked }))}
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
