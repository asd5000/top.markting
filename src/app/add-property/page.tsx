'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Home, MapPin, User, Shield, Plus, X, Camera } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AddPropertyPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    // بيانات العميل
    customer_name: '',
    customer_phone: '',
    customer_whatsapp: '',
    customer_email: '',

    // بيانات العقار
    title: '',
    description: '',
    property_type: 'apartment',
    operation_type: 'sale',
    price: '',
    price_negotiable: false,
    area: '',
    rooms: '',
    bathrooms: '',
    floor: '',
    total_floors: '',

    // الموقع
    governorate: '',
    city: '',
    district: '',
    address: '',

    // مميزات إضافية
    has_garden: false,
    has_parking: false,
    has_elevator: false,
    has_balcony: false,
    is_furnished: false,
    has_security: false,

    // ملاحظات
    notes: '',

    // صور وفيديو
    video_url: '',
    images: []
  })

  // States for image upload
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    checkUserSession()
  }, [])

  const checkUserSession = async () => {
    try {
      // التحقق من جلسة Supabase أولاً
      const { data: { session }, error } = await supabase.auth.getSession()

      if (session && session.user) {
        // المستخدم مسجل دخول عبر Supabase Auth
        const userData = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'مستخدم',
          phone: session.user.user_metadata?.phone || '',
          isLoggedIn: true
        }

        setUser(userData)

        // ملء بيانات العميل من بيانات المستخدم
        setFormData(prev => ({
          ...prev,
          customer_name: userData.name || '',
          customer_email: userData.email || '',
          customer_phone: userData.phone || ''
        }))

        setLoading(false)
        return
      }

      // التحقق من localStorage كبديل
      const savedUser = localStorage.getItem('visitor') || localStorage.getItem('userSession')
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        setUser(userData)

        // ملء بيانات العميل من بيانات المستخدم
        setFormData(prev => ({
          ...prev,
          customer_name: userData.name || '',
          customer_email: userData.email || '',
          customer_phone: userData.phone || ''
        }))

        setLoading(false)
        return
      }

      // لا يوجد مستخدم مسجل دخول
      alert('يجب تسجيل الدخول أولاً لإضافة عقار')
      localStorage.setItem('redirectAfterLogin', '/add-property')
      router.push('/visitor-login')

    } catch (error) {
      console.error('Error checking user session:', error)
      alert('يجب تسجيل الدخول أولاً لإضافة عقار')
      localStorage.setItem('redirectAfterLogin', '/add-property')
      router.push('/visitor-login')
    }
  }

  // Image upload functions
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    if (selectedImages.length + files.length > 4) {
      alert('يمكن رفع 4 صور كحد أقصى')
      return
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/')
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB

      if (!isValidType) {
        alert(`${file.name} ليس ملف صورة صالح`)
        return false
      }

      if (!isValidSize) {
        alert(`${file.name} حجم الملف كبير جداً (الحد الأقصى 5MB)`)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // التحقق من الحقول المطلوبة
    if (!formData.customer_name || !formData.customer_phone || !formData.title || !formData.operation_type || !formData.governorate || !formData.city) {
      alert('يرجى ملء جميع الحقول المطلوبة (الاسم، الهاتف، عنوان العقار، نوع العملية، المحافظة، المدينة)')
      return
    }

    setIsSubmitting(true)

    try {
      console.log('Submitting property data:', formData)
      setUploading(true)

      // Upload images first
      let imageUrls: string[] = []
      if (selectedImages.length > 0) {
        imageUrls = await uploadImages()
      }

      // إعداد بيانات العقار مع التأكد من صحة البيانات
      const propertyData = {
        customer_name: formData.customer_name.trim(),
        customer_phone: formData.customer_phone.trim(),
        customer_whatsapp: formData.customer_whatsapp?.trim() || null,
        customer_email: formData.customer_email?.trim() || null,
        title: formData.title?.trim() || 'عقار جديد',
        description: formData.description?.trim() || null,
        property_type: formData.property_type,
        operation_type: formData.operation_type, // seller أو buyer
        price: parseFloat(formData.price) || 0,
        price_negotiable: formData.price_negotiable || false,
        area: formData.area ? parseFloat(formData.area) : null,
        rooms: formData.rooms ? parseInt(formData.rooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        governorate: formData.governorate.trim(),
        city: formData.city.trim(),
        district: formData.district?.trim() || null,
        video_url: formData.video_url?.trim() || null,
        images: JSON.stringify(imageUrls)
      }

      console.log('Prepared property data for database:', propertyData)

      // إدراج البيانات في قاعدة البيانات
      const { data: insertedProperty, error } = await supabase
        .from('real_estate')
        .insert([propertyData])
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        alert(`حدث خطأ أثناء إضافة العقار: ${error.message}`)
        return
      }

      console.log('Property inserted successfully:', insertedProperty)

      alert('تم إضافة البيانات بنجاح في التسويق العقاري بالموقع!')

      // إعادة تعيين النموذج
      setFormData({
        customer_name: user.name || '',
        customer_phone: user.phone || '',
        customer_whatsapp: '',
        customer_email: user.email || '',
        title: '',
        description: '',
        property_type: 'apartment',
        operation_type: 'seller',
        price: '',
        price_negotiable: false,
        area: '',
        rooms: '',
        bathrooms: '',
        floor: '',
        total_floors: '',
        governorate: '',
        city: '',
        district: '',
        address: '',
        has_garden: false,
        has_parking: false,
        has_elevator: false,
        has_balcony: false,
        is_furnished: false,
        has_security: false,
        notes: '',
        video_url: '',
        images: []
      })

      // Reset image states
      setSelectedImages([])
      setImagePreviewUrls([])

    } catch (error) {
      console.error('Unexpected error:', error)
      alert('حدث خطأ غير متوقع أثناء إرسال العقار')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحقق من تسجيل الدخول...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">TM</span>
              </div>
              <span className="mr-3 text-xl font-bold text-gray-900">Top Marketing</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600">الرئيسية</Link>
              <Link href="/add-property" className="text-blue-600 font-medium">إضافة عقار</Link>
            </nav>

            {/* User Info & Login */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">مرحباً، {user.name}</span>
                  <button
                    onClick={async () => {
                      // تسجيل الخروج من Supabase
                      await supabase.auth.signOut()
                      // حذف البيانات من localStorage
                      localStorage.removeItem('visitor')
                      localStorage.removeItem('userSession')
                      router.push('/')
                    }}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    تسجيل خروج
                  </button>
                </div>
              ) : (
                <Link
                  href="/visitor-login"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  تسجيل الدخول
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Home className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">أضف بياناتك مجاناً</h1>
          <p className="text-xl mb-8">برنامج التسويق العقاري - نجمع بيانات المشترين والبائعين لتسهيل عملية المطابقة والتواصل</p>
        </div>
      </section>

      {/* Add Property Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Section */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 mb-8 border border-blue-200">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🏠 برنامج التسويق العقاري</h2>
            <p className="text-lg text-gray-700 mb-4">
              نحن نجمع بيانات <span className="font-bold text-green-600">البائعين</span> و <span className="font-bold text-blue-600">المشترين</span> لتسهيل عملية المطابقة والتواصل
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-green-100 rounded-lg p-4">
                <h3 className="font-bold text-green-800 mb-2">🟢 إذا كنت بائع</h3>
                <p className="text-sm text-green-700">أضف بيانات العقار الذي تريد بيعه وسنساعدك في الوصول للمشترين المهتمين</p>
              </div>
              <div className="bg-blue-100 rounded-lg p-4">
                <h3 className="font-bold text-blue-800 mb-2">🔵 إذا كنت مشتري</h3>
                <p className="text-sm text-blue-700">أضف مواصفات العقار الذي تبحث عنه وسنساعدك في العثور على العقار المناسب</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* بيانات العميل */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center">
                <User className="w-6 h-6 ml-2" />
                بيانات العميل
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل *</label>
                  <input
                    type="text"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف *</label>
                  <input
                    type="tel"
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رقم الواتساب</label>
                  <input
                    type="tel"
                    value={formData.customer_whatsapp}
                    onChange={(e) => setFormData({...formData, customer_whatsapp: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) => setFormData({...formData, customer_email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* بيانات العقار */}
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-green-900 mb-6 flex items-center">
                <Home className="w-6 h-6 ml-2" />
                بيانات العقار
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">عنوان الإعلان *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="مثال: شقة للبيع في المعادي 120 متر أو أبحث عن شقة في مدينة نصر"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">نوع العقار *</label>
                    <select
                      value={formData.property_type}
                      onChange={(e) => setFormData({...formData, property_type: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">أنت *</label>
                    <select
                      value={formData.operation_type}
                      onChange={(e) => setFormData({...formData, operation_type: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">اختر نوع العملية</option>
                      <option value="seller">🟢 بائع (لدي عقار أريد بيعه)</option>
                      <option value="buyer">🔵 مشتري (أبحث عن عقار للشراء)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">السعر (ج.م) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">المساحة (م²)</label>
                    <input
                      type="number"
                      value={formData.area}
                      onChange={(e) => setFormData({...formData, area: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center pt-8">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.price_negotiable}
                        onChange={(e) => setFormData({...formData, price_negotiable: e.target.checked})}
                        className="ml-2"
                      />
                      <span className="text-sm text-gray-700">السعر قابل للتفاوض</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">عدد الغرف</label>
                    <input
                      type="number"
                      value={formData.rooms}
                      onChange={(e) => setFormData({...formData, rooms: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">عدد الحمامات</label>
                    <input
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({...formData, bathrooms: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الدور</label>
                    <input
                      type="number"
                      value={formData.floor}
                      onChange={(e) => setFormData({...formData, floor: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">إجمالي الأدوار</label>
                    <input
                      type="number"
                      value={formData.total_floors}
                      onChange={(e) => setFormData({...formData, total_floors: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">وصف العقار</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="اكتب وصف مفصل للعقار، المميزات، الموقع، وأي تفاصيل أخرى مهمة..."
                  />
                </div>
              </div>
            </div>

            {/* الموقع */}
            <div className="bg-yellow-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-yellow-900 mb-6 flex items-center">
                <MapPin className="w-6 h-6 ml-2" />
                موقع العقار
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المحافظة *</label>
                  <select
                    value={formData.governorate}
                    onChange={(e) => setFormData({...formData, governorate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">اختر المحافظة</option>
                    <option value="القاهرة">القاهرة</option>
                    <option value="الجيزة">الجيزة</option>
                    <option value="الإسكندرية">الإسكندرية</option>
                    <option value="القليوبية">القليوبية</option>
                    <option value="الشرقية">الشرقية</option>
                    <option value="المنوفية">المنوفية</option>
                    <option value="الدقهلية">الدقهلية</option>
                    <option value="البحيرة">البحيرة</option>
                    <option value="كفر الشيخ">كفر الشيخ</option>
                    <option value="الغربية">الغربية</option>
                    <option value="المنيا">المنيا</option>
                    <option value="بني سويف">بني سويف</option>
                    <option value="الفيوم">الفيوم</option>
                    <option value="أسيوط">أسيوط</option>
                    <option value="سوهاج">سوهاج</option>
                    <option value="قنا">قنا</option>
                    <option value="الأقصر">الأقصر</option>
                    <option value="أسوان">أسوان</option>
                    <option value="البحر الأحمر">البحر الأحمر</option>
                    <option value="الوادي الجديد">الوادي الجديد</option>
                    <option value="مطروح">مطروح</option>
                    <option value="شمال سيناء">شمال سيناء</option>
                    <option value="جنوب سيناء">جنوب سيناء</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المدينة *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مثال: المعادي، الزمالك، مدينة نصر"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المنطقة</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({...formData, district: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مثال: الحي الأول، شارع التسعين"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">العنوان التفصيلي</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="العنوان الكامل للعقار"
                />
              </div>
            </div>

            {/* صور وفيديو العقار */}
            <div className="bg-indigo-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-indigo-900 mb-6 flex items-center">
                <Camera className="w-6 h-6 ml-2" />
                صور وفيديو العقار
              </h3>

              {/* Video URL */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رابط فيديو العقار (اختياري)
                </label>
                <input
                  type="url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                  placeholder="https://youtube.com/watch?v=... أو أي رابط فيديو آخر"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  يمكنك إضافة رابط فيديو من YouTube أو أي منصة أخرى لعرض العقار
                </p>
              </div>

              {/* Images Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  صور العقار (حتى 4 صور)
                </label>

                {/* Image Upload Input */}
                <div className="border-2 border-dashed border-indigo-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
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
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                      <Plus className="w-8 h-8 text-indigo-600" />
                    </div>
                    <span className="text-lg text-gray-700 font-medium mb-2">
                      {selectedImages.length >= 4
                        ? 'تم الوصول للحد الأقصى (4 صور)'
                        : 'اضغط لاختيار الصور أو اسحبها هنا'
                      }
                    </span>
                    <span className="text-sm text-gray-500">
                      PNG, JPG, WEBP حتى 5MB لكل صورة
                    </span>
                  </label>
                </div>

                {/* Image Previews */}
                {imagePreviewUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`معاينة ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          صورة {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* المميزات الإضافية */}
            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-purple-900 mb-6 flex items-center">
                <Shield className="w-6 h-6 ml-2" />
                المميزات الإضافية
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.has_garden}
                    onChange={(e) => setFormData({...formData, has_garden: e.target.checked})}
                    className="ml-2"
                  />
                  <span className="text-sm text-gray-700">حديقة</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.has_parking}
                    onChange={(e) => setFormData({...formData, has_parking: e.target.checked})}
                    className="ml-2"
                  />
                  <span className="text-sm text-gray-700">موقف سيارة</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.has_elevator}
                    onChange={(e) => setFormData({...formData, has_elevator: e.target.checked})}
                    className="ml-2"
                  />
                  <span className="text-sm text-gray-700">مصعد</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.has_balcony}
                    onChange={(e) => setFormData({...formData, has_balcony: e.target.checked})}
                    className="ml-2"
                  />
                  <span className="text-sm text-gray-700">بلكونة</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_furnished}
                    onChange={(e) => setFormData({...formData, is_furnished: e.target.checked})}
                    className="ml-2"
                  />
                  <span className="text-sm text-gray-700">مفروش</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.has_security}
                    onChange={(e) => setFormData({...formData, has_security: e.target.checked})}
                    className="ml-2"
                  />
                  <span className="text-sm text-gray-700">حراسة</span>
                </label>
              </div>
            </div>

            {/* ملاحظات إضافية */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">ملاحظات إضافية</h3>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أي ملاحظات أو تفاصيل إضافية تريد إضافتها..."
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting || uploading}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                    جاري رفع الصور...
                  </>
                ) : isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                    جاري الإرسال...
                  </>
                ) : (
                  'إرسال العقار للمراجعة'
                )}
              </button>
              <p className="text-sm text-gray-500 mt-3">
                سيتم مراجعة العقار من قبل الإدارة قبل النشر
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
// ✅ CONFIRMED DEPLOYMENT - Image upload & video features active
