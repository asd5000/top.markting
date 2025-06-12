'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Building2,
  Upload,
  MapPin,
  DollarSign,
  Home,
  Camera,
  Video,
  FileText,
  Check,
  AlertCircle
} from 'lucide-react'

export default function RealEstatePage() {
  const [formData, setFormData] = useState({
    // بيانات أساسية
    clientType: '',
    propertyType: '',
    operationType: '',
    
    // تفاصيل العقار
    area: '',
    bedrooms: '',
    bathrooms: '',
    floors: '',
    finishingType: '',
    propertyAge: '',
    hasElevator: false,
    hasGarage: false,
    viewDirection: '',
    
    // تفاصيل مالية
    price: '',
    isNegotiable: true,
    paymentMethod: '',
    
    // الموقع
    governorate: '',
    city: '',
    district: '',
    street: '',
    nearestLandmark: '',
    
    // بيانات التواصل
    contactName: '',
    phone: '',
    whatsapp: '',
    email: '',
    
    // تفاصيل إضافية
    description: '',
    specialFeatures: '',
    notes: ''
  })

  const [images, setImages] = useState<File[]>([])
  const [video, setVideo] = useState<File | null>(null)
  const [documents, setDocuments] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files))
    }
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0])
    }
  }

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // محاكاة إرسال البيانات
    setTimeout(() => {
      console.log('تم إرسال بيانات العقار:', formData)
      setSubmitSuccess(true)
      setIsSubmitting(false)
    }, 2000)
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">تم إرسال البيانات بنجاح!</h2>
          <p className="text-gray-600 mb-6">
            شكراً لك! تم استلام بيانات العقار وسيتم مراجعتها من قبل فريقنا والتواصل معك قريباً.
          </p>
          <div className="space-y-3">
            <Link href="/real-estate" className="btn btn-primary w-full">
              إضافة عقار آخر
            </Link>
            <Link href="/" className="btn border border-gray-300 w-full">
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">TM</span>
              </div>
              <span className="mr-3 text-xl font-bold text-gray-900">Top Marketing</span>
            </Link>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600">الرئيسية</Link>
              <Link href="/services" className="text-gray-700 hover:text-blue-600">الخدمات</Link>
              <Link href="/packages" className="text-gray-700 hover:text-blue-600">إدارة الصفحات</Link>
              <Link href="/real-estate" className="text-blue-600 font-medium">العقارات</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إضافة عقار</h1>
          <p className="text-gray-600">املأ البيانات التالية لإضافة عقارك أو طلب شراء عقار</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* البيانات الأساسية */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Home className="w-6 h-6 ml-2" />
              البيانات الأساسية
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="form-label">نوع العميل *</label>
                <select 
                  name="clientType" 
                  value={formData.clientType}
                  onChange={handleInputChange}
                  className="form-input" 
                  required
                >
                  <option value="">اختر</option>
                  <option value="seller">بائع</option>
                  <option value="buyer">شاري</option>
                </select>
              </div>
              
              <div>
                <label className="form-label">نوع العقار *</label>
                <select 
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className="form-input" 
                  required
                >
                  <option value="">اختر</option>
                  <option value="apartment">شقة</option>
                  <option value="villa">فيلا</option>
                  <option value="house">بيت</option>
                  <option value="land">أرض</option>
                  <option value="shop">محل</option>
                  <option value="office">مكتب</option>
                </select>
              </div>
              
              <div>
                <label className="form-label">نوع العملية *</label>
                <select 
                  name="operationType"
                  value={formData.operationType}
                  onChange={handleInputChange}
                  className="form-input" 
                  required
                >
                  <option value="">اختر</option>
                  <option value="sale">بيع</option>
                  <option value="rent">إيجار</option>
                </select>
              </div>
            </div>
          </div>

          {/* تفاصيل العقار */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-6">تفاصيل العقار</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="form-label">المساحة (متر مربع)</label>
                <input 
                  type="number" 
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  className="form-input" 
                  placeholder="مثال: 120"
                />
              </div>
              
              <div>
                <label className="form-label">عدد الغرف</label>
                <input 
                  type="number" 
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  className="form-input" 
                  placeholder="مثال: 3"
                />
              </div>
              
              <div>
                <label className="form-label">عدد الحمامات</label>
                <input 
                  type="number" 
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  className="form-input" 
                  placeholder="مثال: 2"
                />
              </div>
              
              <div>
                <label className="form-label">عدد الأدوار</label>
                <input 
                  type="number" 
                  name="floors"
                  value={formData.floors}
                  onChange={handleInputChange}
                  className="form-input" 
                  placeholder="مثال: 1"
                />
              </div>
              
              <div>
                <label className="form-label">نوع التشطيب</label>
                <select 
                  name="finishingType"
                  value={formData.finishingType}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">اختر</option>
                  <option value="super_lux">سوبر لوكس</option>
                  <option value="lux">لوكس</option>
                  <option value="normal">عادي</option>
                  <option value="brick">على الطوب</option>
                </select>
              </div>
              
              <div>
                <label className="form-label">عمر العقار (سنة)</label>
                <input 
                  type="number" 
                  name="propertyAge"
                  value={formData.propertyAge}
                  onChange={handleInputChange}
                  className="form-input" 
                  placeholder="مثال: 5"
                />
              </div>
              
              <div>
                <label className="form-label">الإطلالة</label>
                <select 
                  name="viewDirection"
                  value={formData.viewDirection}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">اختر</option>
                  <option value="north">بحري</option>
                  <option value="south">قبلي</option>
                  <option value="east">شرقي</option>
                  <option value="west">غربي</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  name="hasElevator"
                  checked={formData.hasElevator}
                  onChange={handleInputChange}
                  className="ml-2" 
                />
                <label className="text-gray-700">يوجد مصعد</label>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  name="hasGarage"
                  checked={formData.hasGarage}
                  onChange={handleInputChange}
                  className="ml-2" 
                />
                <label className="text-gray-700">يوجد جراج</label>
              </div>
            </div>
          </div>

          {/* التفاصيل المالية */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <DollarSign className="w-6 h-6 ml-2" />
              التفاصيل المالية
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="form-label">السعر المطلوب (جنيه) *</label>
                <input 
                  type="number" 
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="form-input" 
                  placeholder="مثال: 500000"
                  required
                />
              </div>
              
              <div>
                <label className="form-label">طريقة الدفع</label>
                <select 
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">اختر</option>
                  <option value="cash">كاش</option>
                  <option value="installments">أقساط</option>
                  <option value="mortgage">تمويل عقاري</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  name="isNegotiable"
                  checked={formData.isNegotiable}
                  onChange={handleInputChange}
                  className="ml-2" 
                />
                <label className="text-gray-700">قابل للتفاوض</label>
              </div>
            </div>
          </div>

          {/* الموقع */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <MapPin className="w-6 h-6 ml-2" />
              الموقع
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">المحافظة *</label>
                <input 
                  type="text" 
                  name="governorate"
                  value={formData.governorate}
                  onChange={handleInputChange}
                  className="form-input" 
                  placeholder="مثال: القاهرة"
                  required
                />
              </div>
              
              <div>
                <label className="form-label">المدينة/المنطقة *</label>
                <input 
                  type="text" 
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="form-input" 
                  placeholder="مثال: مدينة نصر"
                  required
                />
              </div>
              
              <div>
                <label className="form-label">الحي</label>
                <input 
                  type="text" 
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="form-input" 
                  placeholder="مثال: الحي السابع"
                />
              </div>
              
              <div>
                <label className="form-label">الشارع</label>
                <input 
                  type="text" 
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  className="form-input" 
                  placeholder="مثال: شارع مصطفى النحاس"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="form-label">أقرب معلم مشهور</label>
                <input 
                  type="text" 
                  name="nearestLandmark"
                  value={formData.nearestLandmark}
                  onChange={handleInputChange}
                  className="form-input" 
                  placeholder="مثال: سيتي ستارز مول"
                />
              </div>
            </div>
          </div>

          {/* بيانات التواصل */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-6">بيانات التواصل</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">الاسم الكامل *</label>
                <input 
                  type="text" 
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  className="form-input" 
                  placeholder="مثال: أحمد محمد علي"
                  required
                />
              </div>
              
              <div>
                <label className="form-label">رقم الهاتف *</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input" 
                  placeholder="مثال: 01012345678"
                  required
                />
              </div>
              
              <div>
                <label className="form-label">واتساب</label>
                <input 
                  type="tel" 
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  className="form-input" 
                  placeholder="مثال: 01012345678"
                />
              </div>
              
              <div>
                <label className="form-label">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input" 
                  placeholder="مثال: ahmed@example.com"
                />
              </div>
            </div>
          </div>

          {/* تفاصيل إضافية */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-6">تفاصيل إضافية</h3>
            
            <div className="space-y-6">
              <div>
                <label className="form-label">وصف مفصل</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="form-input" 
                  placeholder="اكتب وصف مفصل للعقار..."
                />
              </div>
              
              <div>
                <label className="form-label">مميزات خاصة</label>
                <textarea 
                  name="specialFeatures"
                  value={formData.specialFeatures}
                  onChange={handleInputChange}
                  rows={3}
                  className="form-input" 
                  placeholder="مثال: حديقة خاصة، مسبح، أمن وحراسة..."
                />
              </div>
              
              <div>
                <label className="form-label">ملاحظات</label>
                <textarea 
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="form-input" 
                  placeholder="أي ملاحظات إضافية..."
                />
              </div>
            </div>
          </div>

          {/* رفع الملفات */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Upload className="w-6 h-6 ml-2" />
              الصور والملفات
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="form-label flex items-center">
                  <Camera className="w-5 h-5 ml-2" />
                  صور العقار
                </label>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="form-input" 
                />
                {images.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    تم اختيار {images.length} صورة
                  </p>
                )}
              </div>
              
              <div>
                <label className="form-label flex items-center">
                  <Video className="w-5 h-5 ml-2" />
                  فيديو العقار (اختياري)
                </label>
                <input 
                  type="file" 
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="form-input" 
                />
                {video && (
                  <p className="text-sm text-gray-600 mt-2">
                    تم اختيار: {video.name}
                  </p>
                )}
              </div>
              
              <div>
                <label className="form-label flex items-center">
                  <FileText className="w-5 h-5 ml-2" />
                  مستندات (اختياري)
                </label>
                <input 
                  type="file" 
                  multiple 
                  accept=".pdf,.doc,.docx"
                  onChange={handleDocumentUpload}
                  className="form-input" 
                />
                {documents.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    تم اختيار {documents.length} مستند
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* تنبيه */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 ml-2" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">ملاحظة مهمة:</p>
                <p>
                  سيتم مراجعة بيانات العقار من قبل فريقنا قبل نشرها على الموقع. 
                  سنتواصل معك خلال 24 ساعة لتأكيد البيانات.
                </p>
              </div>
            </div>
          </div>

          {/* أزرار الإرسال */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary px-8 py-3 text-lg disabled:opacity-50"
            >
              {isSubmitting ? 'جاري الإرسال...' : 'إرسال البيانات'}
            </button>
            <Link href="/" className="btn border border-gray-300 px-8 py-3 text-lg text-center">
              إلغاء
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
