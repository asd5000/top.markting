'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import RouteGuard from '@/components/admin/RouteGuard'
import {
  Package, Plus, Edit, Trash2, Eye, Users,
  DollarSign, Calendar, Settings, Star,
  CheckCircle, XCircle, Clock, ArrowLeft,
  Save, AlertCircle, Palette, Video, Target
} from 'lucide-react'
import Link from 'next/link'

interface PackageData {
  id: string
  name: string
  description: string
  price: number
  duration_months: number
  features: string[]
  is_active: boolean
  created_at: string
  updated_at: string
  image_url?: string

  // حقول جديدة للنظام المتكامل
  package_type: string
  monthly_price: number
  package_description: string

  // خدمات التصميم
  designs_count: number
  design_price: number

  // خدمات الفيديو
  includes_videos: boolean
  videos_count: number
  video_types: string[]

  // الإعلانات
  includes_ads: boolean
  ads_count: number
  ad_price: number
  ad_duration_days: number

  // إدارة الصفحات
  includes_page_management: boolean
  includes_auto_replies: boolean
  includes_whatsapp_campaigns: boolean
  includes_google_campaigns: boolean

  // إحصائيات
  subscribers_count: number
  completed_designs: number
  completed_videos: number
}

interface ServiceItem {
  id: string
  service_type: string
  quantity: number
  unit_price: number
  total_price: number
}

interface Subscription {
  id: string
  packageId: string
  customerName: string
  customerEmail: string
  status: 'pending' | 'active' | 'completed' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'rejected'
  designsCompleted: number
  videosCompleted: number
  postsCompleted: number
  adsCompleted: number
  startDate: string
  endDate: string
}

export default function PackagesManagement() {
  const [packages, setPackages] = useState<PackageData[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('packages')
  const [showAddForm, setShowAddForm] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error' | null
    text: string
  }>({ type: null, text: '' })

  const [newPackage, setNewPackage] = useState({
    // معلومات عامة
    name: '',
    description: '',
    price: 0,
    duration_months: 1,
    features: [] as string[],
    package_type: 'social_media',
    monthly_price: 0,
    package_description: '',
    image_url: '',

    // خدمات التصميم
    designs_count: 0,
    design_price: 0,

    // خدمات الفيديو
    includes_videos: false,
    videos_count: 0,
    video_types: [] as string[],

    // الإعلانات
    includes_ads: false,
    ads_count: 0,
    ad_price: 0,
    ad_duration_days: 7,

    // إدارة الصفحات
    includes_page_management: false,
    includes_auto_replies: false,
    includes_whatsapp_campaigns: false,
    includes_google_campaigns: false
  })

  // حالة جديدة لإدارة عناصر الخدمات
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      console.log('📦 Loading packages from database...')

      // تحميل الباقات من قاعدة البيانات
      const { data: packagesData, error: packagesError } = await supabase
        .from('packages')
        .select('*')
        .order('created_at', { ascending: false })

      if (packagesError) {
        console.error('Error loading packages:', packagesError)
        setMessage({
          type: 'error',
          text: `خطأ في تحميل الباقات: ${packagesError.message}`
        })
      } else {
        console.log('✅ Packages loaded:', packagesData)
        setPackages(packagesData || [])
      }

      // تحميل الاشتراكات من قاعدة البيانات
      const { data: subscriptionsData, error: subscriptionsError } = await supabase
        .from('page_subscriptions')
        .select(`
          *,
          packages (
            name,
            price
          )
        `)
        .order('created_at', { ascending: false })

      if (subscriptionsError) {
        console.error('Error loading subscriptions:', subscriptionsError)
      } else {
        console.log('✅ Subscriptions loaded:', subscriptionsData)
        setSubscriptions(subscriptionsData || [])
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      social_media: 'إدارة صفحات',
      design: 'تصميم',
      marketing: 'تسويق',
      comprehensive: 'شامل',
      premium: 'مميز'
    }
    return types[type] || type
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  // دالة رفع الصور
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `plan-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `plans/${fileName}`

      const { data, error } = await supabase.storage
        .from('plan-images')
        .upload(filePath, file)

      if (error) {
        console.error('Error uploading image:', error)
        setMessage({ type: 'error', text: `خطأ في رفع الصورة: ${error.message}` })
        return null
      }

      const { data: { publicUrl } } = supabase.storage
        .from('plan-images')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      setMessage({ type: 'error', text: 'حدث خطأ أثناء رفع الصورة' })
      return null
    } finally {
      setUploading(false)
    }
  }

  // دالة إضافة عنصر خدمة جديد
  const addServiceItem = () => {
    const newItem: ServiceItem = {
      id: Date.now().toString(),
      service_type: '',
      quantity: 1,
      unit_price: 0,
      total_price: 0
    }
    setServiceItems([...serviceItems, newItem])
  }

  // دالة تحديث عنصر خدمة
  const updateServiceItem = (id: string, field: keyof ServiceItem, value: any) => {
    setServiceItems(items => items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        if (field === 'quantity' || field === 'unit_price') {
          updatedItem.total_price = updatedItem.quantity * updatedItem.unit_price
        }
        return updatedItem
      }
      return item
    }))
  }

  // دالة حذف عنصر خدمة
  const removeServiceItem = (id: string) => {
    setServiceItems(items => items.filter(item => item.id !== id))
  }

  // دالة حساب السعر الإجمالي
  const calculateTotalPrice = () => {
    return serviceItems.reduce((total, item) => total + item.total_price, 0)
  }

  const handleAddPackage = async () => {
    if (!newPackage.name || !newPackage.monthly_price) {
      setMessage({
        type: 'error',
        text: 'يرجى ملء جميع الحقول المطلوبة (اسم الباقة والسعر الشهري)'
      })
      return
    }

    try {
      console.log('📦 Creating new comprehensive package:', newPackage)

      // حساب السعر الإجمالي من عناصر الخدمات أو استخدام السعر المدخل يدوياً
      const calculatedPrice = calculateTotalPrice()
      const finalPrice = calculatedPrice > 0 ? calculatedPrice : newPackage.monthly_price

      const packageData = {
        // معلومات عامة
        name: newPackage.name.trim(),
        description: newPackage.description.trim(),
        price: finalPrice, // السعر المحسوب أو المدخل يدوياً
        duration_months: newPackage.duration_months,
        features: newPackage.features,
        is_active: true,
        image_url: newPackage.image_url,

        // حقول جديدة
        package_type: newPackage.package_type,
        monthly_price: finalPrice,
        package_description: newPackage.package_description.trim(),

        // خدمات التصميم
        designs_count: newPackage.designs_count,
        design_price: newPackage.design_price,

        // خدمات الفيديو
        includes_videos: newPackage.includes_videos,
        videos_count: newPackage.includes_videos ? newPackage.videos_count : 0,
        video_types: newPackage.includes_videos ? newPackage.video_types : [],

        // الإعلانات
        includes_ads: newPackage.includes_ads,
        ads_count: newPackage.includes_ads ? newPackage.ads_count : 0,
        ad_price: newPackage.includes_ads ? newPackage.ad_price : 0,
        ad_duration_days: newPackage.includes_ads ? newPackage.ad_duration_days : 7,

        // إدارة الصفحات
        includes_page_management: newPackage.includes_page_management,
        includes_auto_replies: newPackage.includes_auto_replies,
        includes_whatsapp_campaigns: newPackage.includes_whatsapp_campaigns,
        includes_google_campaigns: newPackage.includes_google_campaigns,

        // إحصائيات ابتدائية
        subscribers_count: 0,
        completed_designs: 0,
        completed_videos: 0
      }

      const { data, error } = await supabase
        .from('packages')
        .insert([packageData])
        .select()
        .single()

      if (error) {
        console.error('Error creating package:', error)
        setMessage({
          type: 'error',
          text: `خطأ في إنشاء الباقة: ${error.message}`
        })
        return
      }

      console.log('✅ Comprehensive package created successfully:', data)

      // حفظ عناصر الخدمات إذا كانت موجودة
      if (serviceItems.length > 0 && data.id) {
        const itemsToInsert = serviceItems.map(item => ({
          plan_id: data.id,
          service_type: item.service_type,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price
        }))

        const { error: itemsError } = await supabase
          .from('plan_items')
          .insert(itemsToInsert)

        if (itemsError) {
          console.error('Error saving service items:', itemsError)
          setMessage({
            type: 'error',
            text: `تم إنشاء الباقة ولكن حدث خطأ في حفظ عناصر الخدمات: ${itemsError.message}`
          })
        } else {
          console.log('✅ Service items saved successfully')
        }
      }

      // إعادة تحميل البيانات
      await loadData()

      // مسح النموذج
      setNewPackage({
        name: '',
        description: '',
        price: 0,
        duration_months: 1,
        features: [],
        package_type: 'social_media',
        monthly_price: 0,
        package_description: '',
        image_url: '',
        designs_count: 0,
        design_price: 0,
        includes_videos: false,
        videos_count: 0,
        video_types: [],
        includes_ads: false,
        ads_count: 0,
        ad_price: 0,
        ad_duration_days: 7,
        includes_page_management: false,
        includes_auto_replies: false,
        includes_whatsapp_campaigns: false,
        includes_google_campaigns: false
      })

      setServiceItems([])
      setShowAddForm(false)
      setMessage({
        type: 'success',
        text: 'تم إنشاء الباقة الشاملة بنجاح!'
      })

    } catch (error) {
      console.error('Error creating package:', error)
      setMessage({
        type: 'error',
        text: 'حدث خطأ أثناء إنشاء الباقة'
      })
    }
  }

  const handleDeletePackage = async (packageId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الباقة؟')) {
      return
    }

    try {
      console.log('🗑️ Deleting package:', packageId)

      const { error } = await supabase
        .from('packages')
        .delete()
        .eq('id', packageId)

      if (error) {
        console.error('Error deleting package:', error)
        setMessage({
          type: 'error',
          text: `خطأ في حذف الباقة: ${error.message}`
        })
        return
      }

      console.log('✅ Package deleted successfully')

      // إعادة تحميل البيانات
      await loadData()

      setMessage({
        type: 'success',
        text: 'تم حذف الباقة بنجاح!'
      })

    } catch (error) {
      console.error('Error deleting package:', error)
      setMessage({
        type: 'error',
        text: 'حدث خطأ أثناء حذف الباقة'
      })
    }
  }

  const togglePackageStatus = async (packageId: string) => {
    try {
      const pkg = packages.find(p => p.id === packageId)
      if (!pkg) return

      console.log('🔄 Toggling package status:', packageId)

      const { error } = await supabase
        .from('packages')
        .update({ is_active: !pkg.is_active })
        .eq('id', packageId)

      if (error) {
        console.error('Error updating package status:', error)
        setMessage({
          type: 'error',
          text: `خطأ في تحديث حالة الباقة: ${error.message}`
        })
        return
      }

      console.log('✅ Package status updated successfully')

      // إعادة تحميل البيانات
      await loadData()

    } catch (error) {
      console.error('Error updating package status:', error)
      setMessage({
        type: 'error',
        text: 'حدث خطأ أثناء تحديث حالة الباقة'
      })
    }
  }

  return (
    <RouteGuard>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Package className="w-6 h-6 text-purple-600 ml-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">برنامج إدارة الباقات</h1>
                <p className="text-gray-600">إدارة الباقات الشهرية والاشتراكات</p>
              </div>
            </div>

            <button
              onClick={() => setShowAddForm(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 ml-2" />
              إنشاء باقة جديدة
            </button>
          </div>
        </div>
        {/* رسائل النجاح/الخطأ */}
        {message.type && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
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

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('packages')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'packages'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                الباقات ({packages.length})
              </button>
              <button
                onClick={() => setActiveTab('subscriptions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'subscriptions'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                الاشتراكات ({subscriptions.length})
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                التحليلات
              </button>
            </nav>
          </div>
        </div>

        {/* Packages Tab */}
        {activeTab === 'packages' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{pkg.name}</h3>
                      <span className="text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                        باقة إدارة صفحات
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      <button className="p-1 text-gray-400 hover:text-blue-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">السعر الشهري</span>
                      <span className="font-bold text-purple-600">{pkg.price} ج.م</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">مدة الباقة</span>
                      <span className="font-medium">{pkg.duration_months} شهر</span>
                    </div>

                    {/* عرض المميزات */}
                    <div className="text-sm">
                      <span className="text-gray-600 block mb-2">المميزات:</span>
                      <div className="space-y-1">
                        {pkg.features && pkg.features.length > 0 ? (
                          pkg.features.slice(0, 3).map((feature, index) => (
                            <div key={index} className="text-xs text-gray-700 flex items-center">
                              <CheckCircle className="w-3 h-3 text-green-500 ml-1" />
                              {feature}
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-gray-500">لا توجد مميزات محددة</div>
                        )}
                        {pkg.features && pkg.features.length > 3 && (
                          <div className="text-xs text-purple-600">
                            +{pkg.features.length - 3} مميزات أخرى
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-gray-400 ml-1" />
                        <span className="text-sm text-gray-600">0 مشترك</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => togglePackageStatus(pkg.id)}
                          className={`px-2 py-1 rounded-full text-xs ${
                            pkg.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {pkg.is_active ? 'نشط' : 'غير نشط'}
                        </button>
                        <button
                          onClick={() => handleDeletePackage(pkg.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Subscriptions Tab */}
        {activeTab === 'subscriptions' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      العميل
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الباقة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التقدم
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      حالة الاشتراك
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      حالة الدفع
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subscriptions.map((subscription) => {
                    const pkg = packages.find(p => p.id === subscription.packageId)
                    return (
                      <tr key={subscription.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {subscription.customerName || 'غير محدد'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {subscription.customerEmail || 'غير محدد'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{pkg?.name}</div>
                          <div className="text-sm text-gray-500">{pkg?.price} ج.م/شهر</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-xs space-y-1">
                            <div>مدة الاشتراك: {pkg?.duration_months} شهر</div>
                            <div>تاريخ البداية: {new Date(subscription.startDate).toLocaleDateString('ar-EG')}</div>
                            <div>تاريخ الانتهاء: {new Date(subscription.endDate).toLocaleDateString('ar-EG')}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                            subscription.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            subscription.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {subscription.status === 'active' ? 'نشط' :
                             subscription.status === 'completed' ? 'مكتمل' :
                             subscription.status === 'cancelled' ? 'ملغي' : 'معلق'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            subscription.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                            subscription.paymentStatus === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {subscription.paymentStatus === 'paid' ? 'مدفوع' :
                             subscription.paymentStatus === 'rejected' ? 'مرفوض' : 'معلق'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">إجمالي الباقات</p>
                  <p className="text-2xl font-bold text-gray-900">{packages.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">إجمالي المشتركين</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {subscriptions.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">الإيرادات الشهرية</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {packages.reduce((sum, pkg) => sum + pkg.price, 0).toLocaleString()} ج.م
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">معدل الرضا</p>
                  <p className="text-2xl font-bold text-gray-900">94%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* نموذج إضافة باقة جديدة */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">إضافة باقة جديدة</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-8">
                {/* معلومات عامة */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Package className="w-5 h-5 ml-2 text-purple-600" />
                    معلومات عامة
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        اسم الباقة *
                      </label>
                      <input
                        type="text"
                        value={newPackage.name}
                        onChange={(e) => setNewPackage({...newPackage, name: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="مثال: باقة احترافية"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        السعر الشهري (ج.م) *
                      </label>
                      <input
                        type="number"
                        value={newPackage.monthly_price}
                        onChange={(e) => setNewPackage({...newPackage, monthly_price: Number(e.target.value)})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="500"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      وصف مميز للباقة
                    </label>
                    <textarea
                      value={newPackage.package_description}
                      onChange={(e) => setNewPackage({...newPackage, package_description: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="وصف تفصيلي وجذاب للباقة يوضح مميزاتها الفريدة"
                    />
                  </div>

                  {/* رفع صورة الباقة */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      صورة الباقة
                    </label>
                    <div className="flex items-center space-x-4">
                      {newPackage.image_url && (
                        <img
                          src={newPackage.image_url}
                          alt="معاينة الباقة"
                          className="w-20 h-20 rounded-lg object-cover border border-gray-300"
                        />
                      )}
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const url = await uploadImage(file)
                              if (url) {
                                setNewPackage({...newPackage, image_url: url})
                              }
                            }
                          }}
                          className="hidden"
                          id="package-image"
                        />
                        <label
                          htmlFor="package-image"
                          className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 transition-colors flex items-center justify-center cursor-pointer"
                        >
                          {uploading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                          ) : (
                            <>
                              <Upload className="w-5 h-5 ml-2 text-gray-400" />
                              <span className="text-gray-600">
                                {newPackage.image_url ? 'تغيير الصورة' : 'رفع صورة الباقة'}
                              </span>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* جدول تفاصيل الخدمات */}
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Calculator className="w-5 h-5 ml-2 text-indigo-600" />
                    تفاصيل الخدمات والأسعار
                  </h4>

                  <div className="space-y-4">
                    {serviceItems.length > 0 && (
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg border border-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">نوع الخدمة</th>
                              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">العدد</th>
                              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">سعر الوحدة</th>
                              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">السعر الكلي</th>
                              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">إجراءات</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {serviceItems.map((item) => (
                              <tr key={item.id}>
                                <td className="px-4 py-3">
                                  <select
                                    value={item.service_type}
                                    onChange={(e) => updateServiceItem(item.id, 'service_type', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                  >
                                    <option value="">اختر نوع الخدمة</option>
                                    <option value="تصميمات">تصميمات</option>
                                    <option value="ريلز">ريلز</option>
                                    <option value="محتوى مكتوب">محتوى مكتوب</option>
                                    <option value="فيديو تعريفي">فيديو تعريفي</option>
                                    <option value="رد تلقائي">رد تلقائي</option>
                                    <option value="متابعة إعلانات">متابعة إعلانات</option>
                                    <option value="زيادة متابعين">زيادة متابعين</option>
                                    <option value="إدارة صفحات">إدارة صفحات</option>
                                  </select>
                                </td>
                                <td className="px-4 py-3">
                                  <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => updateServiceItem(item.id, 'quantity', Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    min="1"
                                  />
                                </td>
                                <td className="px-4 py-3">
                                  <input
                                    type="number"
                                    value={item.unit_price}
                                    onChange={(e) => updateServiceItem(item.id, 'unit_price', Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    min="0"
                                    step="0.01"
                                  />
                                </td>
                                <td className="px-4 py-3">
                                  <span className="font-bold text-indigo-600">{item.total_price.toFixed(2)} ج.م</span>
                                </td>
                                <td className="px-4 py-3">
                                  <button
                                    onClick={() => removeServiceItem(item.id)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-gray-50">
                            <tr>
                              <td colSpan={3} className="px-4 py-3 text-right font-bold text-gray-900">
                                إجمالي السعر:
                              </td>
                              <td className="px-4 py-3">
                                <span className="font-bold text-lg text-indigo-600">
                                  {calculateTotalPrice().toFixed(2)} ج.م
                                </span>
                              </td>
                              <td></td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    )}

                    <button
                      onClick={addServiceItem}
                      className="w-full px-4 py-3 border-2 border-dashed border-indigo-300 rounded-lg hover:border-indigo-500 transition-colors flex items-center justify-center text-indigo-600 hover:text-indigo-800"
                    >
                      <Plus className="w-5 h-5 ml-2" />
                      إضافة خدمة جديدة
                    </button>

                    {serviceItems.length > 0 && (
                      <div className="bg-indigo-100 p-3 rounded-lg">
                        <p className="text-sm text-indigo-800">
                          💡 <strong>ملاحظة:</strong> إذا تم إدخال خدمات في الجدول أعلاه، سيتم حساب السعر تلقائياً من مجموع الخدمات.
                          وإلا سيتم استخدام السعر الشهري المدخل يدوياً.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* خدمات التصميم */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Palette className="w-5 h-5 ml-2 text-blue-600" />
                    خدمات التصميم
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        عدد التصميمات في الشهر
                      </label>
                      <input
                        type="number"
                        value={newPackage.designs_count}
                        onChange={(e) => setNewPackage({...newPackage, designs_count: Number(e.target.value)})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="10"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        سعر التصميم الواحد (ج.م)
                      </label>
                      <input
                        type="number"
                        value={newPackage.design_price}
                        onChange={(e) => setNewPackage({...newPackage, design_price: Number(e.target.value)})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="25"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* خدمات الفيديو */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Video className="w-5 h-5 ml-2 text-green-600" />
                    خدمات الفيديو
                  </h4>

                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newPackage.includes_videos}
                        onChange={(e) => setNewPackage({...newPackage, includes_videos: e.target.checked})}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="mr-2 text-sm font-medium text-gray-700">
                        تحتوي الباقة على فيديوهات
                      </span>
                    </label>
                  </div>

                  {newPackage.includes_videos && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          عدد الفيديوهات في الشهر
                        </label>
                        <input
                          type="number"
                          value={newPackage.videos_count}
                          onChange={(e) => setNewPackage({...newPackage, videos_count: Number(e.target.value)})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="5"
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          نوع الفيديوهات (يمكن اختيار أكثر من نوع)
                        </label>
                        <div className="space-y-2">
                          {[
                            { value: 'reels', label: 'ريلز' },
                            { value: 'intro', label: 'فيديو تعريفي' },
                            { value: 'motion_graphics', label: 'موشن جرافيك' }
                          ].map((type) => (
                            <label key={type.value} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={newPackage.video_types.includes(type.value)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewPackage({
                                      ...newPackage,
                                      video_types: [...newPackage.video_types, type.value]
                                    })
                                  } else {
                                    setNewPackage({
                                      ...newPackage,
                                      video_types: newPackage.video_types.filter(t => t !== type.value)
                                    })
                                  }
                                }}
                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                              />
                              <span className="mr-2 text-sm text-gray-700">{type.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* الإعلانات */}
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Target className="w-5 h-5 ml-2 text-orange-600" />
                    الإعلانات الممولة
                  </h4>

                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newPackage.includes_ads}
                        onChange={(e) => setNewPackage({...newPackage, includes_ads: e.target.checked})}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="mr-2 text-sm font-medium text-gray-700">
                        تشمل إعلانات ممولة
                      </span>
                    </label>
                  </div>

                  {newPackage.includes_ads && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          عدد الإعلانات
                        </label>
                        <input
                          type="number"
                          value={newPackage.ads_count}
                          onChange={(e) => setNewPackage({...newPackage, ads_count: Number(e.target.value)})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="3"
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          سعر الإعلان الواحد (ج.م)
                        </label>
                        <input
                          type="number"
                          value={newPackage.ad_price}
                          onChange={(e) => setNewPackage({...newPackage, ad_price: Number(e.target.value)})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="100"
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          مدة الإعلان (أيام)
                        </label>
                        <input
                          type="number"
                          value={newPackage.ad_duration_days}
                          onChange={(e) => setNewPackage({...newPackage, ad_duration_days: Number(e.target.value)})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="7"
                          min="1"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* إدارة الصفحات */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Settings className="w-5 h-5 ml-2 text-purple-600" />
                    إدارة الصفحات والحملات
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newPackage.includes_page_management}
                        onChange={(e) => setNewPackage({...newPackage, includes_page_management: e.target.checked})}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="mr-2 text-sm font-medium text-gray-700">
                        إدارة صفحات سوشيال ميديا
                      </span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newPackage.includes_auto_replies}
                        onChange={(e) => setNewPackage({...newPackage, includes_auto_replies: e.target.checked})}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="mr-2 text-sm font-medium text-gray-700">
                        الردود التلقائية
                      </span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newPackage.includes_whatsapp_campaigns}
                        onChange={(e) => setNewPackage({...newPackage, includes_whatsapp_campaigns: e.target.checked})}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="mr-2 text-sm font-medium text-gray-700">
                        حملات واتساب
                      </span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newPackage.includes_google_campaigns}
                        onChange={(e) => setNewPackage({...newPackage, includes_google_campaigns: e.target.checked})}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="mr-2 text-sm font-medium text-gray-700">
                        حملات Google
                      </span>
                    </label>
                  </div>
                </div>

                {/* مميزات إضافية */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Star className="w-5 h-5 ml-2 text-yellow-600" />
                    مميزات إضافية
                  </h4>
                  <div className="space-y-2">
                    {newPackage.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [...newPackage.features]
                            newFeatures[index] = e.target.value
                            setNewPackage({...newPackage, features: newFeatures})
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                          placeholder="مثال: دعم فني على مدار الساعة"
                        />
                        <button
                          onClick={() => {
                            const newFeatures = newPackage.features.filter((_, i) => i !== index)
                            setNewPackage({...newPackage, features: newFeatures})
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => setNewPackage({...newPackage, features: [...newPackage.features, '']})}
                      className="text-yellow-600 hover:text-yellow-800 text-sm flex items-center"
                    >
                      <Plus className="w-4 h-4 ml-1" />
                      إضافة ميزة إضافية
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleAddPackage}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                >
                  <Save className="w-4 h-4 ml-2" />
                  حفظ الباقة
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RouteGuard>
  )
}
