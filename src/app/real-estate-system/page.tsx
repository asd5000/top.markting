'use client'

// Force rebuild - Sidebar Navigation Complete
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import {
  Building, Search, Plus, Edit, Trash2, Eye,
  MapPin, DollarSign, Home, Users, Phone, Mail,
  Save, X, MessageCircle, CheckCircle, AlertCircle,
  BarChart3, Filter, Calendar, Clock, Star,
  TrendingUp, TrendingDown, Activity, Target,
  UserCheck, UserX, FileText, Download, Share2,
  ArrowRight, ArrowUp, StickyNote, Bell, RefreshCw,
  ArrowLeft, LogOut, Camera
} from 'lucide-react'

interface Property {
  id: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  customer_whatsapp?: string
  property_type: 'apartment' | 'villa' | 'land' | 'shop' | 'house' | 'office'
  operation_type: 'seller' | 'buyer'
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
  sale_status?: 'new' | 'selling' | 'sold'
  internal_notes?: string
  follow_up_status?: 'pending' | 'contacted' | 'needs_follow_up'
  last_contact_date?: string
  contact_count?: number
  trust_rating?: number
  video_url?: string
  images?: string
  created_at: string
}

export default function RealEstateSystemPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Real Estate System States
  const [properties, setProperties] = useState<Property[]>([])
  const [activeTab, setActiveTab] = useState('properties')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterOperation, setFilterOperation] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterFollowUp, setFilterFollowUp] = useState('all')
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
    operation_type: 'seller',
    title: '',
    description: '',
    governorate: '',
    city: '',
    district: '',
    area: '',
    rooms: '',
    bathrooms: '',
    price: '',
    price_negotiable: false,
    sale_status: 'new',
    internal_notes: '',
    follow_up_status: 'pending',
    video_url: '',
    images: []
  })

  // States for image upload
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (admin) {
      loadProperties()
    }
  }, [admin])

  const checkAuth = () => {
    try {
      const adminData = localStorage.getItem('admin')
      const adminSession = localStorage.getItem('adminSession')

      if (adminData || adminSession) {
        const adminInfo = JSON.parse(adminData || adminSession || '{}')
        setAdmin(adminInfo)
      } else {
        router.push('/admin/login')
        return
      }
    } catch (error) {
      console.error('Error checking auth:', error)
      router.push('/admin/login')
      return
    }

    setLoading(false)
  }

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

  const handleLogout = () => {
    localStorage.removeItem('admin')
    localStorage.removeItem('adminSession')
    router.push('/admin/login')
  }

  // Image upload functions
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    if (selectedImages.length + files.length > 4) {
      setMessage({
        type: 'error',
        text: 'يمكن رفع 4 صور كحد أقصى'
      })
      return
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/')
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB

      if (!isValidType) {
        setMessage({
          type: 'error',
          text: `${file.name} ليس ملف صورة صالح`
        })
        return false
      }

      if (!isValidSize) {
        setMessage({
          type: 'error',
          text: `${file.name} حجم الملف كبير جداً (الحد الأقصى 5MB)`
        })
        return false
      }

      return true
    })

    setSelectedImages(prev => [...prev, ...validFiles])

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreviewUrls(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  const uploadImages = async (): Promise<string[]> => {
    if (selectedImages.length === 0) return []

    setUploading(true)
    const uploadedUrls: string[] = []

    try {
      for (const file of selectedImages) {
        const fileExt = file.name.split('.').pop()
        const fileName = `property_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`

        const { data, error } = await supabase.storage
          .from('images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (error) {
          console.error('Upload error:', error)
          throw error
        }

        const { data: urlData } = supabase.storage
          .from('images')
          .getPublicUrl(fileName)

        uploadedUrls.push(urlData.publicUrl)
      }

      return uploadedUrls
    } catch (error) {
      console.error('Error uploading images:', error)
      throw error
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحقق من جلسة المدير...</p>
        </div>
      </div>
    )
  }

  if (!admin) {
    return null
  }

  // Real Estate Functions
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
      setUploading(true)

      // Upload images first
      let imageUrls: string[] = []
      if (selectedImages.length > 0) {
        imageUrls = await uploadImages()
      }

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
        price_negotiable: formData.price_negotiable,
        sale_status: formData.sale_status,
        internal_notes: formData.internal_notes?.trim() || null,
        follow_up_status: formData.follow_up_status,
        contact_count: 0,
        trust_rating: 0,
        video_url: formData.video_url?.trim() || null,
        images: JSON.stringify(imageUrls)
      }

      let result
      if (editingProperty) {
        result = await supabase
          .from('real_estate')
          .update(propertyData)
          .eq('id', editingProperty.id)
          .select()
      } else {
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

      resetForm()
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
      operation_type: 'seller',
      title: '',
      description: '',
      governorate: '',
      city: '',
      district: '',
      area: '',
      rooms: '',
      bathrooms: '',
      price: '',
      price_negotiable: false,
      sale_status: 'new',
      internal_notes: '',
      follow_up_status: 'pending',
      video_url: '',
      images: []
    })
    setSelectedImages([])
    setImagePreviewUrls([])
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
      price_negotiable: property.price_negotiable,
      sale_status: property.sale_status || 'new',
      internal_notes: property.internal_notes || '',
      follow_up_status: property.follow_up_status || 'pending',
      video_url: (property as any).video_url || '',
      images: []
    })

    // Load existing images if any
    if ((property as any).images) {
      try {
        const existingImages = JSON.parse((property as any).images)
        setImagePreviewUrls(existingImages)
      } catch (e) {
        console.error('Error parsing existing images:', e)
      }
    }

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
    const matchesStatus = filterStatus === 'all' || property.sale_status === filterStatus
    const matchesFollowUp = filterFollowUp === 'all' || property.follow_up_status === filterFollowUp

    return matchesSearch && matchesType && matchesOperation && matchesStatus && matchesFollowUp
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

  // دوال إدارة حالات البيع
  const updateSaleStatus = async (propertyId: string, newStatus: 'new' | 'selling' | 'sold') => {
    try {
      const { error } = await supabase
        .from('real_estate')
        .update({ sale_status: newStatus })
        .eq('id', propertyId)

      if (error) {
        console.error('Error updating sale status:', error)
        setMessage({
          type: 'error',
          text: `خطأ في تحديث حالة البيع: ${error.message}`
        })
        return
      }

      setMessage({
        type: 'success',
        text: `تم تحديث حالة العقار إلى "${newStatus === 'selling' ? 'جاري البيع' : newStatus === 'sold' ? 'تم البيع' : 'جديد'}" بنجاح!`
      })

      await loadProperties()

      setTimeout(() => {
        setMessage({ type: null, text: '' })
      }, 3000)

    } catch (error) {
      console.error('Error:', error)
      setMessage({
        type: 'error',
        text: 'حدث خطأ أثناء تحديث حالة البيع'
      })
    }
  }

  const updateFollowUpStatus = async (propertyId: string, status: 'contacted' | 'needs_follow_up') => {
    try {
      const updateData: any = {
        follow_up_status: status,
        last_contact_date: new Date().toISOString()
      }

      if (status === 'contacted') {
        // زيادة عدد مرات التواصل
        const property = properties.find(p => p.id === propertyId)
        updateData.contact_count = (property?.contact_count || 0) + 1
        updateData.trust_rating = Math.min(5, Math.floor((property?.contact_count || 0) / 2) + 1)
      }

      const { error } = await supabase
        .from('real_estate')
        .update(updateData)
        .eq('id', propertyId)

      if (error) {
        console.error('Error updating follow-up status:', error)
        return
      }

      await loadProperties()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const updateInternalNotes = async (propertyId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('real_estate')
        .update({ internal_notes: notes })
        .eq('id', propertyId)

      if (error) {
        console.error('Error updating notes:', error)
        return
      }

      await loadProperties()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Statistics calculations
  const stats = {
    total: properties.length,
    selling: properties.filter(p => p.sale_status === 'selling').length,
    sold: properties.filter(p => p.sale_status === 'sold').length,
    new: properties.filter(p => p.sale_status === 'new').length,
    sellers: properties.filter(p => p.operation_type === 'seller').length,
    buyers: properties.filter(p => p.operation_type === 'buyer').length,
    byType: {
      apartment: properties.filter(p => p.property_type === 'apartment').length,
      villa: properties.filter(p => p.property_type === 'villa').length,
      house: properties.filter(p => p.property_type === 'house').length,
      land: properties.filter(p => p.property_type === 'land').length,
      shop: properties.filter(p => p.property_type === 'shop').length,
      office: properties.filter(p => p.property_type === 'office').length,
    },
    sellersByType: {
      apartment: properties.filter(p => p.property_type === 'apartment' && p.operation_type === 'seller').length,
      villa: properties.filter(p => p.property_type === 'villa' && p.operation_type === 'seller').length,
      house: properties.filter(p => p.property_type === 'house' && p.operation_type === 'seller').length,
      land: properties.filter(p => p.property_type === 'land' && p.operation_type === 'seller').length,
      shop: properties.filter(p => p.property_type === 'shop' && p.operation_type === 'seller').length,
      office: properties.filter(p => p.property_type === 'office' && p.operation_type === 'seller').length,
    },
    buyersByType: {
      apartment: properties.filter(p => p.property_type === 'apartment' && p.operation_type === 'buyer').length,
      villa: properties.filter(p => p.property_type === 'villa' && p.operation_type === 'buyer').length,
      house: properties.filter(p => p.property_type === 'house' && p.operation_type === 'buyer').length,
      land: properties.filter(p => p.property_type === 'land' && p.operation_type === 'buyer').length,
      shop: properties.filter(p => p.property_type === 'shop' && p.operation_type === 'buyer').length,
      office: properties.filter(p => p.property_type === 'office' && p.operation_type === 'buyer').length,
    }
  }

  // Enhanced Export to Excel function
  const exportToExcel = () => {
    const csvContent = [
      [
        'اسم العميل', 'الهاتف', 'الواتساب', 'الإيميل', 'نوع العملية', 'نوع العقار',
        'العنوان', 'المدينة', 'المحافظة', 'المنطقة', 'السعر', 'قابل للتفاوض',
        'المساحة', 'عدد الغرف', 'عدد الحمامات', 'حالة البيع', 'حالة المتابعة',
        'عدد مرات التواصل', 'تقييم الثقة', 'الملاحظات الداخلية', 'تاريخ الإضافة', 'آخر تواصل'
      ],
      ...filteredProperties.map(property => [
        property.customer_name,
        property.customer_phone,
        property.customer_whatsapp || '',
        property.customer_email || '',
        property.operation_type === 'seller' ? 'بائع' : 'مشتري',
        getPropertyTypeLabel(property.property_type),
        property.title,
        property.city,
        property.governorate,
        property.district || '',
        property.price.toLocaleString(),
        property.price_negotiable ? 'نعم' : 'لا',
        property.area || '',
        property.rooms || '',
        property.bathrooms || '',
        property.sale_status === 'selling' ? 'جاري البيع' : property.sale_status === 'sold' ? 'تم البيع' : 'جديد',
        property.follow_up_status === 'contacted' ? 'تم التواصل' : property.follow_up_status === 'needs_follow_up' ? 'يحتاج متابعة' : 'في الانتظار',
        property.contact_count || 0,
        property.trust_rating || 0,
        property.internal_notes || '',
        new Date(property.created_at).toLocaleDateString('ar-EG'),
        property.last_contact_date ? new Date(property.last_contact_date).toLocaleDateString('ar-EG') : ''
      ])
    ]

    const csvString = csvContent.map(row => row.join(',')).join('\n')
    const blob = new Blob(['\ufeff' + csvString], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `عقارات_مفصل_${new Date().toLocaleDateString('ar-EG').replace(/\//g, '-')}.csv`
    link.click()
  }

  // Enhanced WhatsApp sharing functions
  const sharePropertyWhatsApp = (property: Property) => {
    const message = `🏠 *عقار ${getPropertyTypeLabel(property.property_type)}*

📍 *الموقع:* ${property.city}, ${property.governorate}
💰 *السعر:* ${property.price.toLocaleString()} جنيه ${property.price_negotiable ? '(قابل للتفاوض)' : ''}
📐 *المساحة:* ${property.area ? property.area + ' م²' : 'غير محدد'}
${property.rooms ? `🛏️ *الغرف:* ${property.rooms}` : ''}
${property.bathrooms ? `🚿 *الحمامات:* ${property.bathrooms}` : ''}

📝 *التفاصيل:* ${property.title}
${property.description ? `\n📋 *الوصف:* ${property.description}` : ''}

👤 *${property.operation_type === 'seller' ? 'البائع' : 'المشتري'}:* ${property.customer_name}
📞 *للتواصل:* ${property.customer_phone}

---
🏢 *برنامج التسويق العقاري*`

    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank')
  }

  const shareMatchingResults = () => {
    const matchingData = Object.entries(stats.byType)
      .filter(([type]) => {
        const sellers = stats.sellersByType[type as keyof typeof stats.sellersByType]
        const buyers = stats.buyersByType[type as keyof typeof stats.buyersByType]
        return sellers > 0 && buyers > 0
      })
      .map(([type]) => {
        const sellers = stats.sellersByType[type as keyof typeof stats.sellersByType]
        const buyers = stats.buyersByType[type as keyof typeof stats.buyersByType]
        return `${getPropertyTypeLabel(type)}: ${sellers} بائع، ${buyers} مشتري`
      })

    const message = `📊 *تقرير التطابقات العقارية*

${matchingData.length > 0 ? matchingData.join('\n') : 'لا توجد تطابقات حالياً'}

📈 *الإحصائيات العامة:*
• إجمالي العقارات: ${stats.total}
• البائعين: ${stats.sellers}
• المشترين: ${stats.buyers}
• جاري البيع: ${stats.selling}
• تم البيع: ${stats.sold}

---
🏢 *برنامج التسويق العقاري*`

    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      {/* القائمة الجانبية الجديدة */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-16'} bg-white shadow-lg border-l border-gray-200 flex flex-col transition-all duration-300`}>
        {/* رأس القائمة الجانبية */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              {sidebarOpen && (
                <div className="mr-3">
                  <h1 className="text-lg font-bold">برنامج التسويق العقاري</h1>
                  <p className="text-sm text-blue-100">نظام إدارة العقارات المتكامل</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              <ArrowLeft className={`w-5 h-5 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
            </button>
          </div>
        </div>

        {/* قائمة التنقل الرئيسية */}
        <div className="flex-1 p-4">
          <nav className="space-y-3">
            {/* لوحة التحكم */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center px-4 py-4 rounded-xl text-right transition-all duration-200 ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 shadow-sm border border-gray-200'
              }`}
            >
              <Home className="w-6 h-6 ml-3 flex-shrink-0" />
              {sidebarOpen && <span className="font-medium">🏠 لوحة التحكم</span>}
            </button>

            {/* إضافة عقار */}
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full flex items-center px-4 py-4 rounded-xl text-right bg-white text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200 shadow-sm border border-gray-200 hover:border-green-300"
            >
              <Plus className="w-6 h-6 ml-3 flex-shrink-0" />
              {sidebarOpen && <span className="font-medium">➕ إضافة عقار</span>}
            </button>

            {/* الإحصائيات */}
            <button
              onClick={() => setActiveTab('statistics')}
              className={`w-full flex items-center px-4 py-4 rounded-xl text-right transition-all duration-200 ${
                activeTab === 'statistics'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-700 shadow-sm border border-gray-200'
              }`}
            >
              <BarChart3 className="w-6 h-6 ml-3 flex-shrink-0" />
              {sidebarOpen && <span className="font-medium">📊 الإحصائيات</span>}
            </button>

            {/* المطابقة الذكية */}
            <button
              onClick={() => setActiveTab('matching')}
              className={`w-full flex items-center px-4 py-4 rounded-xl text-right transition-all duration-200 ${
                activeTab === 'matching'
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 shadow-sm border border-gray-200'
              }`}
            >
              <Target className="w-6 h-6 ml-3 flex-shrink-0" />
              {sidebarOpen && <span className="font-medium">🔍 المطابقة</span>}
            </button>

            {/* جاري البيع */}
            <button
              onClick={() => setActiveTab('selling')}
              className={`w-full flex items-center px-4 py-4 rounded-xl text-right transition-all duration-200 ${
                activeTab === 'selling'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-700 shadow-sm border border-gray-200'
              }`}
            >
              <TrendingUp className="w-6 h-6 ml-3 flex-shrink-0" />
              {sidebarOpen && (
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">🔁 جاري البيع</span>
                  <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded-full text-xs">
                    {stats.selling}
                  </span>
                </div>
              )}
            </button>

            {/* تم البيع */}
            <button
              onClick={() => setActiveTab('sold')}
              className={`w-full flex items-center px-4 py-4 rounded-xl text-right transition-all duration-200 ${
                activeTab === 'sold'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-700 shadow-sm border border-gray-200'
              }`}
            >
              <CheckCircle className="w-6 h-6 ml-3 flex-shrink-0" />
              {sidebarOpen && (
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">✅ تم البيع</span>
                  <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs">
                    {stats.sold}
                  </span>
                </div>
              )}
            </button>
          </nav>

          {/* عرض جميع العقارات */}
          <div className="mt-4">
            <button
              onClick={() => setActiveTab('properties')}
              className={`w-full flex items-center px-4 py-4 rounded-xl text-right transition-all duration-200 ${
                activeTab === 'properties'
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 shadow-sm border border-gray-200'
              }`}
            >
              <Building className="w-6 h-6 ml-3 flex-shrink-0" />
              {sidebarOpen && <span className="font-medium">🏢 جميع العقارات</span>}
            </button>
          </div>

          {/* قسم الفلاتر الجانبية */}
          {sidebarOpen && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="px-4 mb-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  🔍 فلاتر البحث
                </h3>
              </div>

              <div className="space-y-4 px-4">
                {/* البحث */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">بحث سريع</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="اسم، مدينة، هاتف..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* نوع العقار */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">نوع العقار</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">جميع الأنواع</option>
                    <option value="apartment">شقة ({stats.byType.apartment})</option>
                    <option value="villa">فيلا ({stats.byType.villa})</option>
                    <option value="house">بيت ({stats.byType.house})</option>
                    <option value="land">أرض ({stats.byType.land})</option>
                    <option value="shop">محل ({stats.byType.shop})</option>
                    <option value="office">مكتب ({stats.byType.office})</option>
                  </select>
                </div>

                {/* نوع العملية */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">نوع العملية</label>
                  <select
                    value={filterOperation}
                    onChange={(e) => setFilterOperation(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">الكل</option>
                    <option value="seller">بائع ({stats.sellers})</option>
                    <option value="buyer">مشتري ({stats.buyers})</option>
                  </select>
                </div>

                {/* حالة البيع */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">حالة البيع</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">جميع الحالات</option>
                    <option value="new">جديد ({stats.new})</option>
                    <option value="selling">جاري البيع ({stats.selling})</option>
                    <option value="sold">تم البيع ({stats.sold})</option>
                  </select>
                </div>

                {/* حالة المتابعة */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">حالة المتابعة</label>
                  <select
                    value={filterFollowUp}
                    onChange={(e) => setFilterFollowUp(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">جميع حالات المتابعة</option>
                    <option value="pending">في الانتظار</option>
                    <option value="contacted">تم التواصل</option>
                    <option value="needs_follow_up">يحتاج متابعة</option>
                  </select>
                </div>

                {/* عداد النتائج */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{filteredProperties.length}</div>
                    <div className="text-xs text-blue-700">من {stats.total} عقار</div>
                  </div>
                </div>

                {/* زر إعادة تعيين الفلاتر */}
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setFilterType('all')
                    setFilterOperation('all')
                    setFilterStatus('all')
                    setFilterFollowUp('all')
                  }}
                  className="w-full bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center justify-center"
                >
                  <RefreshCw className="w-4 h-4 ml-2" />
                  إعادة تعيين الفلاتر
                </button>
              </div>
            </div>
          )}
        </div>

        {/* معلومات المستخدم */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-white" />
            </div>
            {sidebarOpen && (
              <div className="mr-3">
                <p className="text-sm font-medium text-gray-900">{admin.name}</p>
                <p className="text-xs text-gray-600">مدير عقارات</p>
              </div>
            )}
          </div>

          {sidebarOpen && (
            <div className="space-y-2">
              <Link
                href="/admin"
                className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:text-blue-600 rounded-lg hover:bg-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة للوحة التحكم
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:text-red-600 rounded-lg hover:bg-white transition-colors"
              >
                <LogOut className="w-4 h-4 ml-2" />
                تسجيل الخروج
              </button>
            </div>
          )}
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* الشريط العلوي */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {activeTab === 'dashboard' && '🏠 لوحة التحكم'}
                {activeTab === 'statistics' && '📊 الإحصائيات'}
                {activeTab === 'matching' && '🔍 المطابقة'}
                {activeTab === 'selling' && '🔁 جاري البيع'}
                {activeTab === 'sold' && '✅ تم البيع'}
                {activeTab === 'properties' && '🏢 جميع العقارات'}
              </h2>
              <p className="text-gray-600 mt-1">
                إجمالي العقارات: <span className="font-semibold text-blue-600">{stats.total}</span> |
                بائعين: <span className="font-semibold text-green-600">{stats.sellers}</span> |
                مشترين: <span className="font-semibold text-blue-600">{stats.buyers}</span>
              </p>
            </div>

            {/* Status Indicator Only */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-200 shadow-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-2"></div>
                <span className="text-sm font-medium">النظام المطور يعمل! ✨</span>
              </div>
            </div>
          </div>
        </div>



        {/* المحتوى الرئيسي */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Messages */}
          {message.type && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-100 border border-green-400 text-green-700'
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}>
              <div className="flex">
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 ml-2" />
                ) : (
                  <AlertCircle className="w-5 h-5 ml-2" />
                )}
                <span>{message.text}</span>
              </div>
            </div>
          )}

          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="mr-4">
                      <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                      <p className="text-gray-600">إجمالي العقارات</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="mr-4">
                      <p className="text-2xl font-bold text-gray-900">{stats.selling}</p>
                      <p className="text-gray-600">جاري البيع</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="mr-4">
                      <p className="text-2xl font-bold text-gray-900">{stats.sold}</p>
                      <p className="text-gray-600">تم البيع</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="mr-4">
                      <p className="text-2xl font-bold text-gray-900">{stats.new}</p>
                      <p className="text-gray-600">عقارات جديدة</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Type Statistics with Enhanced Counters */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">📊 إحصائيات مفصلة حسب نوع العقار</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(stats.byType).map(([type, count]) => {
                    const sellers = stats.sellersByType[type as keyof typeof stats.sellersByType]
                    const buyers = stats.buyersByType[type as keyof typeof stats.buyersByType]
                    const hasMatches = sellers > 0 && buyers > 0

                    return (
                      <div key={type} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-bold text-lg text-gray-900">{getPropertyTypeLabel(type)}</span>
                          <span className="text-3xl font-bold text-blue-600">{count}</span>
                        </div>

                        {/* مربعات العدادات المطلوبة */}
                        <div className="space-y-3">
                          {/* عداد البائعين */}
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                  <TrendingUp className="w-4 h-4 text-white" />
                                </div>
                                <span className="mr-2 font-medium text-green-700">بائعين</span>
                              </div>
                              <span className="text-2xl font-bold text-green-600">{sellers}</span>
                            </div>
                          </div>

                          {/* عداد المشترين */}
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                  <Users className="w-4 h-4 text-white" />
                                </div>
                                <span className="mr-2 font-medium text-blue-700">مشترين</span>
                              </div>
                              <span className="text-2xl font-bold text-blue-600">{buyers}</span>
                            </div>
                          </div>

                          {/* مؤشر التطابق */}
                          {hasMatches && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                                    <Target className="w-4 h-4 text-white" />
                                  </div>
                                  <span className="mr-2 font-medium text-yellow-700">تطابقات محتملة</span>
                                </div>
                                <span className="text-xl font-bold text-yellow-600">{Math.min(sellers, buyers)}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Properties View - Simplified without filters */}
          {activeTab === 'properties' && (
            <div className="space-y-6">
              {/* Info Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Building className="w-4 h-4 text-white" />
                  </div>
                  <div className="mr-3">
                    <p className="text-sm font-medium text-blue-900">
                      استخدم الفلاتر في القائمة الجانبية للبحث والتصفية
                    </p>
                    <p className="text-xs text-blue-700">
                      عرض {filteredProperties.length} من {stats.total} عقار
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Statistics View */}
          {activeTab === 'statistics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sellers vs Buyers */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">البائعين مقابل المشترين</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-green-600 font-medium">البائعين</span>
                      <span className="text-2xl font-bold text-green-600">{stats.sellers}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 font-medium">المشترين</span>
                      <span className="text-2xl font-bold text-blue-600">{stats.buyers}</span>
                    </div>
                  </div>
                </div>

                {/* Sale Status */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">حالة البيع</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">جديد</span>
                      <span className="text-2xl font-bold text-gray-600">{stats.new}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-orange-600 font-medium">جاري البيع</span>
                      <span className="text-2xl font-bold text-orange-600">{stats.selling}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-green-600 font-medium">تم البيع</span>
                      <span className="text-2xl font-bold text-green-600">{stats.sold}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Statistics by Type */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">إحصائيات مفصلة حسب نوع العقار</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right py-2">نوع العقار</th>
                        <th className="text-center py-2">إجمالي</th>
                        <th className="text-center py-2">بائعين</th>
                        <th className="text-center py-2">مشترين</th>
                        <th className="text-center py-2">نسبة التطابق</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(stats.byType).map(([type, total]) => {
                        const sellers = stats.sellersByType[type as keyof typeof stats.sellersByType]
                        const buyers = stats.buyersByType[type as keyof typeof stats.buyersByType]
                        const matchRate = sellers > 0 && buyers > 0 ? Math.min(sellers, buyers) : 0
                        return (
                          <tr key={type} className="border-b hover:bg-gray-50">
                            <td className="py-2 font-medium">{getPropertyTypeLabel(type)}</td>
                            <td className="text-center py-2">{total}</td>
                            <td className="text-center py-2 text-green-600">{sellers}</td>
                            <td className="text-center py-2 text-blue-600">{buyers}</td>
                            <td className="text-center py-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                matchRate > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {matchRate} تطابق
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Smart Matching View - Enhanced */}
          {activeTab === 'matching' && (
            <div className="space-y-6">
              {/* Alert Summary */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <div className="mr-4">
                    <h3 className="text-xl font-bold text-gray-900">🚨 نظام التنبيه الذكي</h3>
                    <p className="text-gray-600">تطابقات محتملة بين البائعين والمشترين</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-yellow-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {Object.values(stats.byType).reduce((total, count, index) => {
                          const type = Object.keys(stats.byType)[index]
                          const sellers = stats.sellersByType[type as keyof typeof stats.sellersByType]
                          const buyers = stats.buyersByType[type as keyof typeof stats.buyersByType]
                          return total + (sellers > 0 && buyers > 0 ? Math.min(sellers, buyers) : 0)
                        }, 0)}
                      </div>
                      <div className="text-sm text-gray-600">إجمالي التطابقات المحتملة</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{stats.sellers}</div>
                      <div className="text-sm text-gray-600">إجمالي البائعين</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{stats.buyers}</div>
                      <div className="text-sm text-gray-600">إجمالي المشترين</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Matches by Property Type */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">🔍 تطابقات مفصلة حسب نوع العقار</h3>
                <div className="space-y-4">
                  {Object.entries(stats.byType).map(([type, total]) => {
                    const sellers = stats.sellersByType[type as keyof typeof stats.sellersByType]
                    const buyers = stats.buyersByType[type as keyof typeof stats.buyersByType]
                    const hasMatches = sellers > 0 && buyers > 0
                    const matchCount = hasMatches ? Math.min(sellers, buyers) : 0

                    return (
                      <div key={type} className={`rounded-lg p-4 border-2 transition-all duration-200 ${
                        hasMatches
                          ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300 hover:shadow-md'
                          : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {hasMatches ? (
                              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                                <Target className="w-5 h-5 text-white" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                                <Building className="w-5 h-5 text-white" />
                              </div>
                            )}
                            <div className="mr-3">
                              <span className="font-bold text-lg text-gray-900">
                                {getPropertyTypeLabel(type)}
                              </span>
                              {hasMatches && (
                                <div className="flex items-center mt-1">
                                  <AlertCircle className="w-4 h-4 text-yellow-600 ml-1" />
                                  <span className="text-sm text-yellow-700 font-medium">
                                    تطابق محتمل متاح!
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">{sellers}</div>
                              <div className="text-xs text-gray-600">بائع</div>
                            </div>

                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">{buyers}</div>
                              <div className="text-xs text-gray-600">مشتري</div>
                            </div>

                            <div className="text-center">
                              <div className={`text-2xl font-bold ${hasMatches ? 'text-yellow-600' : 'text-gray-400'}`}>
                                {matchCount}
                              </div>
                              <div className="text-xs text-gray-600">تطابق</div>
                            </div>

                            {hasMatches && (
                              <div className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-full">
                                <div className="flex items-center">
                                  <Bell className="w-4 h-4 ml-1" />
                                  <span className="text-sm font-medium">يحتاج متابعة</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {hasMatches && (
                          <div className="mt-4 pt-4 border-t border-yellow-200">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">
                                💡 نصيحة: يمكنك التواصل مع البائعين والمشترين لترتيب المعاينات
                              </span>
                              <button
                                onClick={() => {
                                  setFilterType(type)
                                  setActiveTab('properties')
                                }}
                                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm flex items-center"
                              >
                                <Eye className="w-4 h-4 ml-1" />
                                عرض التفاصيل
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>


            </div>
          )}

          {/* Selling Properties View */}
          {(activeTab === 'selling' || activeTab === 'sold') && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {activeTab === 'selling' ? '🔁 العقارات جاري البيع' : '✅ العقارات المباعة'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {properties
                    .filter(p => p.sale_status === (activeTab === 'selling' ? 'selling' : 'sold'))
                    .map((property) => (
                      <div key={property.id} className="bg-gray-50 rounded-lg p-4 border">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            property.operation_type === 'seller' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {property.operation_type === 'seller' ? 'بائع' : 'مشتري'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {getPropertyTypeLabel(property.property_type)}
                          </span>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">{property.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{property.customer_name}</p>
                        <p className="text-sm text-gray-600 mb-2">{property.city}, {property.governorate}</p>
                        <p className="text-lg font-bold text-green-600">{property.price.toLocaleString()} جنيه</p>

                        <div className="mt-3 flex space-x-2">
                          <a
                            href={getWhatsAppLink(property.customer_phone, property.customer_name, property.title)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors flex items-center justify-center"
                          >
                            <MessageCircle className="w-3 h-3 ml-1" />
                            واتساب
                          </a>
                          <button
                            onClick={() => sharePropertyWhatsApp(property)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors flex items-center justify-center"
                            title="مشاركة عبر واتساب"
                          >
                            <Share2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

        {/* Properties Grid - Card View (for properties tab) */}
        {activeTab === 'properties' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">جاري تحميل العقارات...</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">لا توجد عقارات متاحة</p>
            </div>
          ) : (
            filteredProperties.map((property) => (
              <div key={property.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Property Type Badge */}
                <div className="p-4 pb-2">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      property.operation_type === 'seller'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {property.operation_type === 'seller' ? 'بائع' : 'مشتري'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      property.property_type === 'apartment' ? 'bg-orange-100 text-orange-800' :
                      property.property_type === 'villa' ? 'bg-purple-100 text-purple-800' :
                      property.property_type === 'house' ? 'bg-indigo-100 text-indigo-800' :
                      property.property_type === 'land' ? 'bg-yellow-100 text-yellow-800' :
                      property.property_type === 'shop' ? 'bg-pink-100 text-pink-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {getPropertyTypeLabel(property.property_type)}
                    </span>
                  </div>

                  {/* Property Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>

                  {/* Customer Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 ml-2" />
                      <span className="font-medium">{property.customer_name}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 ml-2" />
                      <span>{property.customer_phone}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 ml-2" />
                      <span>{property.city}, {property.governorate}</span>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    {property.area && (
                      <div className="flex items-center text-gray-600">
                        <Home className="w-4 h-4 ml-1" />
                        <span>{property.area} م²</span>
                      </div>
                    )}
                    {property.rooms && (
                      <div className="flex items-center text-gray-600">
                        <Building className="w-4 h-4 ml-1" />
                        <span>{property.rooms} غرف</span>
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex items-center text-gray-600">
                        <Home className="w-4 h-4 ml-1" />
                        <span>{property.bathrooms} حمام</span>
                      </div>
                    )}
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-4 h-4 ml-1" />
                      <span>{property.price.toLocaleString()} جنيه</span>
                    </div>
                  </div>

                  {/* Sale Status */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">حالة البيع:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        property.sale_status === 'selling' ? 'bg-orange-100 text-orange-800' :
                        property.sale_status === 'sold' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {property.sale_status === 'selling' ? 'جاري البيع' :
                         property.sale_status === 'sold' ? 'تم البيع' : 'جديد'}
                      </span>
                    </div>

                    {/* Sale Status Buttons */}
                    {property.sale_status !== 'sold' && (
                      <div className="flex space-x-2 mb-3">
                        {property.sale_status !== 'selling' && (
                          <button
                            onClick={() => updateSaleStatus(property.id, 'selling')}
                            className="flex-1 bg-orange-600 text-white px-2 py-1 rounded text-xs hover:bg-orange-700 transition-colors flex items-center justify-center"
                          >
                            <ArrowRight className="w-3 h-3 ml-1" />
                            نقل إلى جاري البيع
                          </button>
                        )}
                        <button
                          onClick={() => updateSaleStatus(property.id, 'sold')}
                          className="flex-1 bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors flex items-center justify-center"
                        >
                          <CheckCircle className="w-3 h-3 ml-1" />
                          تم البيع
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Follow-up Status */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">المتابعة:</span>
                      <div className="flex items-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                          property.follow_up_status === 'contacted' ? 'bg-green-100 text-green-800' :
                          property.follow_up_status === 'needs_follow_up' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {property.follow_up_status === 'contacted' ? 'تم التواصل' :
                           property.follow_up_status === 'needs_follow_up' ? 'يحتاج متابعة' : 'في الانتظار'}
                        </span>
                        {property.trust_rating && property.trust_rating > 0 && (
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`text-sm ${
                                  star <= property.trust_rating! ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Follow-up Buttons */}
                    <div className="flex space-x-2 mb-3">
                      <button
                        onClick={() => updateFollowUpStatus(property.id, 'contacted')}
                        className="flex-1 bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors flex items-center justify-center"
                      >
                        <Phone className="w-3 h-3 ml-1" />
                        تم التواصل
                      </button>
                      <button
                        onClick={() => updateFollowUpStatus(property.id, 'needs_follow_up')}
                        className="flex-1 bg-yellow-600 text-white px-2 py-1 rounded text-xs hover:bg-yellow-700 transition-colors flex items-center justify-center"
                      >
                        <Bell className="w-3 h-3 ml-1" />
                        يحتاج متابعة
                      </button>
                    </div>
                  </div>

                  {/* Internal Notes */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات داخلية:</label>
                    <textarea
                      value={property.internal_notes || ''}
                      onChange={(e) => updateInternalNotes(property.id, e.target.value)}
                      placeholder="مثال: يرد فقط بالليل"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs resize-none"
                      rows={2}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <a
                      href={getWhatsAppLink(property.customer_phone, property.customer_name, property.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center text-sm"
                    >
                      <MessageCircle className="w-4 h-4 ml-1" />
                      واتساب
                    </a>
                    <button
                      onClick={() => sharePropertyWhatsApp(property)}
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                      title="مشاركة عبر واتساب"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(property)}
                      className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(property.id)}
                      className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        )}

        {/* Add/Edit Property Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingProperty ? 'تعديل العقار' : 'إضافة عقار جديد'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Customer Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        اسم العميل *
                      </label>
                      <input
                        type="text"
                        value={formData.customer_name}
                        onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        رقم الهاتف *
                      </label>
                      <input
                        type="tel"
                        value={formData.customer_phone}
                        onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Property Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        نوع العقار *
                      </label>
                      <select
                        value={formData.property_type}
                        onChange={(e) => setFormData({...formData, property_type: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="apartment">شقة</option>
                        <option value="house">بيت</option>
                        <option value="villa">فيلا</option>
                        <option value="land">أرض</option>
                        <option value="shop">محل</option>
                        <option value="office">مكتب</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        نوع العملية *
                      </label>
                      <select
                        value={formData.operation_type}
                        onChange={(e) => setFormData({...formData, operation_type: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="seller">بائع</option>
                        <option value="buyer">مشتري</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      عنوان العقار *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        المحافظة *
                      </label>
                      <input
                        type="text"
                        value={formData.governorate}
                        onChange={(e) => setFormData({...formData, governorate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        المدينة *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        المساحة (م²)
                      </label>
                      <input
                        type="number"
                        value={formData.area}
                        onChange={(e) => setFormData({...formData, area: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        عدد الغرف
                      </label>
                      <input
                        type="number"
                        value={formData.rooms}
                        onChange={(e) => setFormData({...formData, rooms: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        السعر (جنيه) *
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Video URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رابط فيديو العقار (اختياري)
                    </label>
                    <input
                      type="url"
                      value={formData.video_url}
                      onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      يمكنك إضافة رابط فيديو من YouTube أو أي منصة أخرى
                    </p>
                  </div>

                  {/* Images Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      صور العقار (حتى 4 صور)
                    </label>

                    {/* Image Upload Input */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        id="image-upload"
                        disabled={selectedImages.length >= 4}
                      />
                      <label
                        htmlFor="image-upload"
                        className={`cursor-pointer flex flex-col items-center ${
                          selectedImages.length >= 4 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                          <Plus className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-600">
                          {selectedImages.length >= 4
                            ? 'تم الوصول للحد الأقصى (4 صور)'
                            : 'اضغط لاختيار الصور أو اسحبها هنا'
                          }
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                          PNG, JPG, WEBP حتى 5MB لكل صورة
                        </span>
                      </label>
                    </div>

                    {/* Image Previews */}
                    {imagePreviewUrls.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {imagePreviewUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`معاينة ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Form Actions */}
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      disabled={uploading}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                          جاري الرفع...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 ml-2" />
                          {editingProperty ? 'تحديث العقار' : 'إضافة العقار'}
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      disabled={uploading}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X className="w-4 h-4 ml-2" />
                      إلغاء
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
    </div>
    </div>
  )
}
// Force rebuild - Image upload features added
