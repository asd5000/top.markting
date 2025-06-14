'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import RouteGuard from '@/components/admin/RouteGuard'
import {
  Settings, Plus, Edit, Trash2, Eye, Save, X,
  ArrowLeft, DollarSign, ToggleLeft, ToggleRight,
  Package, Layers, Search, Filter, CheckCircle, Star
} from 'lucide-react'
import Link from 'next/link'
import { ServiceForm, SubServiceForm } from './forms'

interface Service {
  id: string
  name: string
  description: string
  short_description: string
  icon: string
  image_url: string
  icon_url: string
  custom_color: string
  sort_order: number
  is_featured: boolean
  status: 'active' | 'inactive' | 'draft'
  is_active: boolean
  created_at: string
  updated_at: string
}

interface SubService {
  id: string
  service_id: string
  name: string
  description: string
  price: number
  image_url: string
  icon_url: string
  sort_order: number
  features: string[]
  delivery_time: string
  status: 'active' | 'inactive' | 'draft'
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([])
  const [subServices, setSubServices] = useState<SubService[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'services' | 'subservices'>('services')

  // Service form states
  const [showServiceForm, setShowServiceForm] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    short_description: '',
    icon: 'package',
    image_url: '',
    icon_url: '',
    custom_color: '#3B82F6',
    sort_order: 0,
    is_featured: false,
    status: 'active' as const,
    is_active: true
  })

  // Sub-service form states
  const [showSubServiceForm, setShowSubServiceForm] = useState(false)
  const [editingSubService, setEditingSubService] = useState<SubService | null>(null)
  const [subServiceForm, setSubServiceForm] = useState({
    service_id: '',
    name: '',
    description: '',
    price: 0,
    image_url: '',
    icon_url: '',
    sort_order: 0,
    features: [] as string[],
    delivery_time: '',
    status: 'active' as const,
    is_active: true
  })

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)

      // Load services with new fields
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .order('sort_order', { ascending: true })

      if (servicesError) {
        console.error('Error loading services:', servicesError)
      } else {
        console.log('✅ Services loaded:', servicesData)
        setServices(servicesData || [])
      }

      // Load sub-services with new fields
      const { data: subServicesData, error: subServicesError } = await supabase
        .from('sub_services')
        .select('*')
        .order('sort_order', { ascending: true })

      if (subServicesError) {
        console.error('Error loading sub-services:', subServicesError)
      } else {
        console.log('✅ Sub-services loaded:', subServicesData)
        setSubServices(subServicesData || [])
      }

    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveService = async () => {
    try {
      console.log('💾 Saving service:', serviceForm)

      const serviceData = {
        ...serviceForm,
        is_active: serviceForm.status === 'active',
        updated_at: new Date().toISOString()
      }

      if (editingService) {
        // Update existing service
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id)

        if (error) throw error
        console.log('✅ Service updated successfully')
      } else {
        // Create new service
        const { error } = await supabase
          .from('services')
          .insert([serviceData])

        if (error) throw error
        console.log('✅ Service created successfully')
      }

      setShowServiceForm(false)
      setEditingService(null)
      setServiceForm({
        name: '',
        description: '',
        short_description: '',
        icon: 'package',
        image_url: '',
        icon_url: '',
        custom_color: '#3B82F6',
        sort_order: 0,
        is_featured: false,
        status: 'active',
        is_active: true
      })
      loadData()

    } catch (error) {
      console.error('Error saving service:', error)
      alert('حدث خطأ أثناء حفظ الخدمة')
    }
  }

  const handleSaveSubService = async () => {
    try {
      console.log('💾 Saving sub-service:', subServiceForm)

      const subServiceData = {
        ...subServiceForm,
        is_active: subServiceForm.status === 'active',
        updated_at: new Date().toISOString()
      }

      if (editingSubService) {
        // Update existing sub-service
        const { error } = await supabase
          .from('sub_services')
          .update(subServiceData)
          .eq('id', editingSubService.id)

        if (error) throw error
        console.log('✅ Sub-service updated successfully')
      } else {
        // Create new sub-service
        const { error } = await supabase
          .from('sub_services')
          .insert([subServiceData])

        if (error) throw error
        console.log('✅ Sub-service created successfully')
      }

      setShowSubServiceForm(false)
      setEditingSubService(null)
      setSubServiceForm({
        service_id: '',
        name: '',
        description: '',
        price: 0,
        image_url: '',
        icon_url: '',
        sort_order: 0,
        features: [],
        delivery_time: '',
        status: 'active',
        is_active: true
      })
      loadData()

    } catch (error) {
      console.error('Error saving sub-service:', error)
      alert('حدث خطأ أثناء حفظ الخدمة الفرعية')
    }
  }

  const handleDeleteService = async (serviceId: string) => {
    try {
      console.log('🗑️ Deleting service:', serviceId)

      // حذف الخدمات الفرعية أولاً
      const { error: subServicesError } = await supabase
        .from('sub_services')
        .delete()
        .eq('service_id', serviceId)

      if (subServicesError) {
        console.error('Error deleting sub-services:', subServicesError)
        alert(`خطأ في حذف الخدمات الفرعية: ${subServicesError.message}`)
        return
      }

      // حذف الخدمة الأساسية
      const { error: serviceError } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId)

      if (serviceError) {
        console.error('Error deleting service:', serviceError)
        alert(`خطأ في حذف الخدمة: ${serviceError.message}`)
        return
      }

      console.log('✅ Service deleted successfully')
      alert('تم حذف الخدمة وجميع خدماتها الفرعية بنجاح')
      await loadData()

    } catch (error) {
      console.error('Error deleting service:', error)
      alert('حدث خطأ أثناء حذف الخدمة')
    }
  }

  const handleDeleteSubService = async (subServiceId: string) => {
    try {
      console.log('🗑️ Deleting sub-service:', subServiceId)

      const { error } = await supabase
        .from('sub_services')
        .delete()
        .eq('id', subServiceId)

      if (error) {
        console.error('Error deleting sub-service:', error)
        alert(`خطأ في حذف الخدمة الفرعية: ${error.message}`)
        return
      }

      console.log('✅ Sub-service deleted successfully')
      alert('تم حذف الخدمة الفرعية بنجاح')
      await loadData()

    } catch (error) {
      console.error('Error deleting sub-service:', error)
      alert('حدث خطأ أثناء حذف الخدمة الفرعية')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الخدمات...</p>
        </div>
      </div>
    )
  }

  return (
    <RouteGuard>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Settings className="w-6 h-6 text-blue-600 ml-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">إدارة الخدمات</h1>
                <p className="text-gray-600">إدارة الخدمات الأساسية والفرعية</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setActiveTab('services')
                  setShowServiceForm(true)
                  setEditingService(null)
                  setServiceForm({
                    name: '',
                    description: '',
                    short_description: '',
                    icon: 'package',
                    image_url: '',
                    icon_url: '',
                    custom_color: '#3B82F6',
                    sort_order: 0,
                    is_featured: false,
                    status: 'active',
                    is_active: true
                  })
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة خدمة أساسية
              </button>

              <button
                onClick={() => {
                  setActiveTab('subservices')
                  setShowSubServiceForm(true)
                  setEditingSubService(null)
                  setSubServiceForm({
                    service_id: '',
                    name: '',
                    description: '',
                    price: 0,
                    image_url: '',
                    icon_url: '',
                    sort_order: 0,
                    features: [],
                    delivery_time: '',
                    status: 'active',
                    is_active: true
                  })
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة خدمة فرعية
              </button>
            </div>
          </div>
        </div>

        {/* Forms */}
        <ServiceForm
          show={showServiceForm}
          onClose={() => setShowServiceForm(false)}
          onSave={handleSaveService}
          editing={editingService}
          form={serviceForm}
          setForm={setServiceForm}
        />

        <SubServiceForm
          show={showSubServiceForm}
          onClose={() => setShowSubServiceForm(false)}
          onSave={handleSaveSubService}
          editing={editingSubService}
          form={subServiceForm}
          setForm={setSubServiceForm}
          services={services}
        />

        {/* Content */}
        <div className="space-y-6">
        {/* عرض الخدمات الفعلية */}
        {services.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد خدمات</h3>
            <p className="text-gray-600 mb-4">ابدأ بإضافة خدمة أساسية جديدة</p>
            <button
              onClick={() => {
                setShowServiceForm(true)
                setEditingService(null)
                setServiceForm({
                  name: '',
                  description: '',
                  short_description: '',
                  icon: 'package',
                  image_url: '',
                  icon_url: '',
                  custom_color: '#3B82F6',
                  sort_order: 0,
                  is_featured: false,
                  status: 'active',
                  is_active: true
                })
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
            >
              <Plus className="w-5 h-5 ml-2" />
              إضافة خدمة أساسية
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <Package className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">الخدمات الأساسية</h3>
                <div className="text-2xl font-bold text-blue-600">{services.length}</div>
                <p className="text-sm text-gray-600">خدمة متاحة</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <Layers className="w-8 h-8 text-green-600 mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">الخدمات الفرعية</h3>
                <div className="text-2xl font-bold text-green-600">{subServices.length}</div>
                <p className="text-sm text-gray-600">خدمة فرعية</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <DollarSign className="w-8 h-8 text-purple-600 mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">متوسط الأسعار</h3>
                <div className="text-2xl font-bold text-purple-600">
                  {subServices.length > 0 ? Math.round(subServices.reduce((sum, sub) => sum + sub.price, 0) / subServices.length) : 0}
                </div>
                <p className="text-sm text-gray-600">جنيه مصري</p>
              </div>
            </div>

            {/* قائمة الخدمات */}
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* رأس الخدمة الأساسية */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {service.image_url && (
                        <img
                          src={service.image_url}
                          alt={service.name}
                          className="w-12 h-12 rounded-lg object-cover ml-4"
                        />
                      )}
                      <div
                        className="w-4 h-12 rounded-lg ml-4"
                        style={{ backgroundColor: service.custom_color || '#3B82F6' }}
                      ></div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                          {service.name}
                          {service.is_featured && (
                            <Star className="w-5 h-5 text-yellow-500 mr-2" />
                          )}
                        </h3>
                        <p className="text-gray-600 mt-1">{service.short_description}</p>
                        <div className="flex items-center mt-2 space-x-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            service.status === 'active' ? 'bg-green-100 text-green-800' :
                            service.status === 'inactive' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {service.status === 'active' ? 'نشط' :
                             service.status === 'inactive' ? 'غير نشط' : 'مسودة'}
                          </span>
                          <span className="text-xs text-gray-500">
                            ترتيب: {service.sort_order}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingService(service)
                          setServiceForm({
                            name: service.name,
                            description: service.description,
                            short_description: service.short_description || '',
                            icon: service.icon,
                            image_url: service.image_url || '',
                            icon_url: service.icon_url || '',
                            custom_color: service.custom_color || '#3B82F6',
                            sort_order: service.sort_order || 0,
                            is_featured: service.is_featured || false,
                            status: 'active' as const,
                            is_active: service.is_active
                          })
                          setShowServiceForm(true)
                        }}
                        className="text-blue-600 hover:text-blue-800 p-2"
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('هل أنت متأكد من حذف هذه الخدمة؟ سيتم حذف جميع الخدمات الفرعية المرتبطة بها.')) {
                            handleDeleteService(service.id)
                          }
                        }}
                        className="text-red-600 hover:text-red-800 p-2"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* الخدمات الفرعية */}
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Package className="w-5 h-5 ml-2 text-green-600" />
                    الخدمات الفرعية ({subServices.filter(sub => sub.service_id === service.id).length})
                  </h4>

                  {subServices.filter(sub => sub.service_id === service.id).length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>لا توجد خدمات فرعية</p>
                      <button
                        onClick={() => {
                          setSubServiceForm({
                            service_id: service.id,
                            name: '',
                            description: '',
                            price: 0,
                            image_url: '',
                            icon_url: '',
                            sort_order: 0,
                            features: [],
                            delivery_time: '',
                            status: 'active',
                            is_active: true
                          })
                          setShowSubServiceForm(true)
                        }}
                        className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        إضافة خدمة فرعية
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {subServices
                        .filter(sub => sub.service_id === service.id)
                        .map((subService) => (
                          <div key={subService.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-gray-900">{subService.name}</h5>
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => {
                                    setEditingSubService(subService)
                                    setSubServiceForm({
                                      service_id: subService.service_id,
                                      name: subService.name,
                                      description: subService.description,
                                      price: subService.price,
                                      image_url: subService.image_url || '',
                                      icon_url: subService.icon_url || '',
                                      sort_order: subService.sort_order || 0,
                                      features: subService.features || [],
                                      delivery_time: subService.delivery_time || '',
                                      status: 'active' as const,
                                      is_active: subService.is_active
                                    })
                                    setShowSubServiceForm(true)
                                  }}
                                  className="text-blue-600 hover:text-blue-800 p-1"
                                  title="تعديل"
                                >
                                  <Edit className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm('هل أنت متأكد من حذف هذه الخدمة الفرعية؟')) {
                                      handleDeleteSubService(subService.id)
                                    }
                                  }}
                                  className="text-red-600 hover:text-red-800 p-1"
                                  title="حذف"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            <p className="text-sm text-gray-600 mb-2">{subService.description}</p>

                            <div className="flex items-center justify-between mb-2">
                              <span className="text-lg font-bold text-green-600">
                                {subService.price} ج.م
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                subService.status === 'active' ? 'bg-green-100 text-green-800' :
                                subService.status === 'inactive' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {subService.status === 'active' ? 'نشط' :
                                 subService.status === 'inactive' ? 'غير نشط' : 'مسودة'}
                              </span>
                            </div>

                            {subService.delivery_time && (
                              <p className="text-xs text-gray-500 mb-2">
                                مدة التسليم: {subService.delivery_time}
                              </p>
                            )}

                            {subService.features && subService.features.length > 0 && (
                              <div className="text-xs">
                                <span className="text-gray-600 block mb-1">المميزات:</span>
                                <div className="space-y-1">
                                  {subService.features.slice(0, 2).map((feature, index) => (
                                    <div key={index} className="text-gray-700 flex items-center">
                                      <CheckCircle className="w-3 h-3 text-green-500 ml-1" />
                                      {feature}
                                    </div>
                                  ))}
                                  {subService.features.length > 2 && (
                                    <div className="text-gray-500">
                                      +{subService.features.length - 2} مميزات أخرى
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </RouteGuard>
  )
}


