'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Building, 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  MapPin, 
  DollarSign, 
  Home, 
  CheckCircle,
  X,
  Plus,
  Camera,
  FileText,
  User,
  Phone,
  Mail
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { 
  realEstatePropertyTypes, 
  realEstateOperationTypes, 
  egyptianGovernorates,
  propertyFeatures,
  propertyAmenities,
  propertyViews,
  RealEstateProperty 
} from '@/data/services/services-data'
import { toast } from 'react-hot-toast'

const steps = [
  { id: 1, title: 'نوع العملية والعقار', icon: Building },
  { id: 2, title: 'الموقع والتفاصيل', icon: MapPin },
  { id: 3, title: 'المواصفات والمميزات', icon: Home },
  { id: 4, title: 'السعر والشروط المالية', icon: DollarSign },
  { id: 5, title: 'الصور والوسائط', icon: Camera },
  { id: 6, title: 'بيانات التواصل', icon: User }
]

export default function AddPropertyPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<RealEstateProperty>>({
    operationType: 'seller',
    propertyType: 'apartment',
    title: '',
    description: '',
    area: 0,
    price: 0,
    priceType: 'total',
    location: {
      governorate: '',
      city: '',
      district: '',
      street: '',
      nearbyLandmarks: []
    },
    details: {
      rooms: 0,
      bathrooms: 0,
      floors: 0,
      floor: 0,
      buildingAge: 0,
      furnished: 'unfurnished',
      direction: 'north',
      view: [],
      parking: false,
      garden: false,
      balcony: false,
      elevator: false,
      security: false,
      airConditioning: false
    },
    features: [],
    amenities: [],
    financial: {
      downPayment: 0,
      monthlyInstallment: 0,
      installmentPeriod: 0
    },
    images: [],
    contactInfo: {
      name: '',
      phone: '',
      email: '',
      whatsapp: '',
      preferredContactTime: '',
      isOwner: true
    }
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    if (name.startsWith('location.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location!,
          [field]: value
        }
      }))
    } else if (name.startsWith('details.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        details: {
          ...prev.details!,
          [field]: type === 'checkbox' ? checked : 
                   (field === 'rooms' || field === 'bathrooms' || field === 'floors' || field === 'floor' || field === 'buildingAge') 
                   ? Number(value) : value
        }
      }))
    } else if (name.startsWith('financial.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        financial: {
          ...prev.financial!,
          [field]: Number(value)
        }
      }))
    } else if (name.startsWith('contactInfo.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo!,
          [field]: type === 'checkbox' ? checked : value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : 
                (name === 'area' || name === 'price') ? Number(value) : value
      }))
    }
  }

  const handleArrayToggle = (arrayName: 'features' | 'amenities', item: string) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName]?.includes(item)
        ? prev[arrayName].filter(i => i !== item)
        : [...(prev[arrayName] || []), item]
    }))
  }

  const handleViewToggle = (view: string) => {
    setFormData(prev => ({
      ...prev,
      details: {
        ...prev.details!,
        view: prev.details?.view?.includes(view)
          ? prev.details.view.filter(v => v !== view)
          : [...(prev.details?.view || []), view]
      }
    }))
  }

  const addLandmark = (landmark: string) => {
    if (landmark.trim() && !formData.location?.nearbyLandmarks.includes(landmark.trim())) {
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location!,
          nearbyLandmarks: [...(prev.location?.nearbyLandmarks || []), landmark.trim()]
        }
      }))
    }
  }

  const removeLandmark = (landmark: string) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location!,
        nearbyLandmarks: prev.location?.nearbyLandmarks.filter(l => l !== landmark) || []
      }
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // محاكاة إرسال البيانات
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('تم إضافة العقار بنجاح! سيتم مراجعته قريباً')
      router.push('/real-estate-system')
    } catch (error) {
      toast.error('حدث خطأ في إضافة العقار')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCurrentPropertyType = () => {
    return realEstatePropertyTypes.find(type => type.id === formData.propertyType)
  }

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.operationType && formData.propertyType
      case 2:
        return formData.location?.governorate && formData.location?.city && formData.area && formData.area > 0
      case 3:
        return true // المواصفات اختيارية
      case 4:
        return formData.price && formData.price > 0
      case 5:
        return true // الصور اختيارية
      case 6:
        return formData.contactInfo?.name && formData.contactInfo?.phone
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Building className="w-12 h-12 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              إضافة عقار جديد
            </h1>
            <p className="text-lg opacity-90">
              املأ البيانات التالية لإضافة عقارك إلى منصة الوساطة العقارية
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <div className="mr-3 hidden md:block">
                  <div className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    خطوة {step.id}
                  </div>
                  <div className="text-xs text-gray-500">{step.title}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          {/* Step 1: Operation and Property Type */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  نوع العملية والعقار
                </h2>

                {/* Operation Type */}
                <div className="mb-8">
                  <label className="block text-lg font-medium text-gray-700 mb-4">
                    نوع العملية
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {realEstateOperationTypes.map((type) => (
                      <label
                        key={type.id}
                        className={`flex items-center justify-center p-6 border-2 rounded-xl cursor-pointer transition-all ${
                          formData.operationType === type.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="operationType"
                          value={type.id}
                          checked={formData.operationType === type.id}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <span className="text-4xl mb-3 block">{type.icon}</span>
                          <span className="text-xl font-semibold">{type.name}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-4">
                    نوع العقار
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {realEstatePropertyTypes.map((type) => (
                      <label
                        key={type.id}
                        className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          formData.propertyType === type.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="propertyType"
                          value={type.id}
                          checked={formData.propertyType === type.id}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <span className="text-3xl mb-2">{type.icon}</span>
                        <span className="text-sm font-medium text-center">{type.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location and Basic Details */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                الموقع والتفاصيل الأساسية
              </h2>

              {/* Title */}
              <div>
                <label htmlFor="title" className="form-label">
                  عنوان الإعلان *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="مثال: شقة للبيع في المعادي"
                  required
                />
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="location.governorate" className="form-label">
                    المحافظة *
                  </label>
                  <select
                    id="location.governorate"
                    name="location.governorate"
                    value={formData.location?.governorate || ''}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  >
                    <option value="">اختر المحافظة</option>
                    {egyptianGovernorates.map((gov) => (
                      <option key={gov} value={gov}>{gov}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="location.city" className="form-label">
                    المدينة *
                  </label>
                  <input
                    type="text"
                    id="location.city"
                    name="location.city"
                    value={formData.location?.city || ''}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="اسم المدينة"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="location.district" className="form-label">
                    الحي
                  </label>
                  <input
                    type="text"
                    id="location.district"
                    name="location.district"
                    value={formData.location?.district || ''}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="اسم الحي"
                  />
                </div>
              </div>

              {/* Street */}
              <div>
                <label htmlFor="location.street" className="form-label">
                  الشارع
                </label>
                <input
                  type="text"
                  id="location.street"
                  name="location.street"
                  value={formData.location?.street || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="اسم الشارع"
                />
              </div>

              {/* Area */}
              <div>
                <label htmlFor="area" className="form-label">
                  المساحة (متر مربع) *
                </label>
                <input
                  type="number"
                  id="area"
                  name="area"
                  value={formData.area || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="120"
                  min="1"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="form-label">
                  وصف العقار
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows={4}
                  className="form-input resize-none"
                  placeholder="اكتب وصفاً مفصلاً للعقار..."
                />
              </div>
            </div>
          )}

          {/* Step 3: Property Specifications */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                المواصفات والتفاصيل
              </h2>

              {/* Property Details based on type */}
              {getCurrentPropertyType()?.fields.includes('rooms') && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <label htmlFor="details.rooms" className="form-label">
                      عدد الغرف
                    </label>
                    <input
                      type="number"
                      id="details.rooms"
                      name="details.rooms"
                      value={formData.details?.rooms || ''}
                      onChange={handleInputChange}
                      className="form-input"
                      min="0"
                    />
                  </div>

                  <div>
                    <label htmlFor="details.bathrooms" className="form-label">
                      عدد الحمامات
                    </label>
                    <input
                      type="number"
                      id="details.bathrooms"
                      name="details.bathrooms"
                      value={formData.details?.bathrooms || ''}
                      onChange={handleInputChange}
                      className="form-input"
                      min="0"
                    />
                  </div>

                  {getCurrentPropertyType()?.fields.includes('floors') && (
                    <div>
                      <label htmlFor="details.floors" className="form-label">
                        عدد الطوابق
                      </label>
                      <input
                        type="number"
                        id="details.floors"
                        name="details.floors"
                        value={formData.details?.floors || ''}
                        onChange={handleInputChange}
                        className="form-input"
                        min="0"
                      />
                    </div>
                  )}

                  {getCurrentPropertyType()?.fields.includes('floor') && (
                    <div>
                      <label htmlFor="details.floor" className="form-label">
                        الطابق
                      </label>
                      <input
                        type="number"
                        id="details.floor"
                        name="details.floor"
                        value={formData.details?.floor || ''}
                        onChange={handleInputChange}
                        className="form-input"
                        min="0"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Building Age */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="details.buildingAge" className="form-label">
                    عمر البناء (سنة)
                  </label>
                  <input
                    type="number"
                    id="details.buildingAge"
                    name="details.buildingAge"
                    value={formData.details?.buildingAge || ''}
                    onChange={handleInputChange}
                    className="form-input"
                    min="0"
                  />
                </div>

                <div>
                  <label htmlFor="details.furnished" className="form-label">
                    حالة التأثيث
                  </label>
                  <select
                    id="details.furnished"
                    name="details.furnished"
                    value={formData.details?.furnished || 'unfurnished'}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="unfurnished">غير مفروش</option>
                    <option value="semi_furnished">نصف مفروش</option>
                    <option value="furnished">مفروش بالكامل</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="details.direction" className="form-label">
                    الاتجاه
                  </label>
                  <select
                    id="details.direction"
                    name="details.direction"
                    value={formData.details?.direction || 'north'}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="north">شمالي</option>
                    <option value="south">جنوبي</option>
                    <option value="east">شرقي</option>
                    <option value="west">غربي</option>
                    <option value="north_east">شمالي شرقي</option>
                    <option value="north_west">شمالي غربي</option>
                    <option value="south_east">جنوبي شرقي</option>
                    <option value="south_west">جنوبي غربي</option>
                  </select>
                </div>
              </div>

              {/* Property Views */}
              <div>
                <label className="form-label">الإطلالة</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {propertyViews.map((view) => (
                    <label
                      key={view}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.details?.view?.includes(view)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.details?.view?.includes(view) || false}
                        onChange={() => handleViewToggle(view)}
                        className="sr-only"
                      />
                      <CheckCircle className={`w-4 h-4 ml-2 ${
                        formData.details?.view?.includes(view) ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <span className="text-sm">{view}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Basic Features Checkboxes */}
              <div>
                <label className="form-label">المرافق الأساسية</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['parking', 'garden', 'balcony', 'elevator', 'security', 'airConditioning'].map((feature) => (
                    <label
                      key={feature}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.details?.[feature as keyof typeof formData.details]
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        name={`details.${feature}`}
                        checked={formData.details?.[feature as keyof typeof formData.details] as boolean || false}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <CheckCircle className={`w-4 h-4 ml-2 ${
                        formData.details?.[feature as keyof typeof formData.details] ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <span className="text-sm">
                        {feature === 'parking' && 'موقف سيارات'}
                        {feature === 'garden' && 'حديقة'}
                        {feature === 'balcony' && 'بلكونة'}
                        {feature === 'elevator' && 'مصعد'}
                        {feature === 'security' && 'أمن وحراسة'}
                        {feature === 'airConditioning' && 'تكييف'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Price and Financial Details */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                السعر والشروط المالية
              </h2>

              {/* Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="price" className="form-label">
                    السعر (جنيه مصري) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price || ''}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="500000"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="priceType" className="form-label">
                    نوع السعر
                  </label>
                  <select
                    id="priceType"
                    name="priceType"
                    value={formData.priceType || 'total'}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="total">السعر الإجمالي</option>
                    <option value="per_meter">سعر المتر</option>
                    <option value="negotiable">قابل للتفاوض</option>
                  </select>
                </div>
              </div>

              {/* Financial Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="financial.downPayment" className="form-label">
                    المقدم (جنيه)
                  </label>
                  <input
                    type="number"
                    id="financial.downPayment"
                    name="financial.downPayment"
                    value={formData.financial?.downPayment || ''}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="100000"
                    min="0"
                  />
                </div>

                <div>
                  <label htmlFor="financial.monthlyInstallment" className="form-label">
                    القسط الشهري (جنيه)
                  </label>
                  <input
                    type="number"
                    id="financial.monthlyInstallment"
                    name="financial.monthlyInstallment"
                    value={formData.financial?.monthlyInstallment || ''}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="5000"
                    min="0"
                  />
                </div>

                <div>
                  <label htmlFor="financial.installmentPeriod" className="form-label">
                    مدة التقسيط (شهر)
                  </label>
                  <input
                    type="number"
                    id="financial.installmentPeriod"
                    name="financial.installmentPeriod"
                    value={formData.financial?.installmentPeriod || ''}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="60"
                    min="0"
                  />
                </div>
              </div>

              {/* Additional Features */}
              <div>
                <label className="form-label">المميزات الإضافية</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {propertyFeatures.map((feature) => (
                    <label
                      key={feature}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.features?.includes(feature)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.features?.includes(feature) || false}
                        onChange={() => handleArrayToggle('features', feature)}
                        className="sr-only"
                      />
                      <CheckCircle className={`w-4 h-4 ml-2 ${
                        formData.features?.includes(feature) ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <span className="text-sm">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="form-label">المرافق والخدمات</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {propertyAmenities.map((amenity) => (
                    <label
                      key={amenity}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.amenities?.includes(amenity)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.amenities?.includes(amenity) || false}
                        onChange={() => handleArrayToggle('amenities', amenity)}
                        className="sr-only"
                      />
                      <CheckCircle className={`w-4 h-4 ml-2 ${
                        formData.amenities?.includes(amenity) ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <span className="text-sm">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Images and Media */}
          {currentStep === 5 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                الصور والوسائط
              </h2>

              {/* Image Upload */}
              <div>
                <label className="form-label">صور العقار</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    اضغط لرفع الصور
                  </h3>
                  <p className="text-gray-600 mb-4">
                    يمكنك رفع حتى 10 صور بصيغة JPG أو PNG
                  </p>
                  <button
                    type="button"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    اختيار الصور
                  </button>
                </div>
              </div>

              {/* Virtual Tour */}
              <div>
                <label htmlFor="virtualTour" className="form-label">
                  رابط الجولة الافتراضية (اختياري)
                </label>
                <input
                  type="url"
                  id="virtualTour"
                  name="virtualTour"
                  className="form-input"
                  placeholder="https://example.com/virtual-tour"
                />
              </div>

              {/* Nearby Landmarks */}
              <div>
                <label className="form-label">المعالم القريبة</label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="أضف معلم قريب (مثل: مترو، مول، مدرسة)"
                      className="form-input flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addLandmark((e.target as HTMLInputElement).value)
                          ;(e.target as HTMLInputElement).value = ''
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        const input = (e.target as HTMLButtonElement).previousElementSibling as HTMLInputElement
                        addLandmark(input.value)
                        input.value = ''
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {formData.location?.nearbyLandmarks && formData.location.nearbyLandmarks.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.location.nearbyLandmarks.map((landmark, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {landmark}
                          <button
                            type="button"
                            onClick={() => removeLandmark(landmark)}
                            className="mr-2 text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Contact Information */}
          {currentStep === 6 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                بيانات التواصل
              </h2>

              {/* Contact Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contactInfo.name" className="form-label">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    id="contactInfo.name"
                    name="contactInfo.name"
                    value={formData.contactInfo?.name || ''}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="أدخل اسمك الكامل"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contactInfo.phone" className="form-label">
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    id="contactInfo.phone"
                    name="contactInfo.phone"
                    value={formData.contactInfo?.phone || ''}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="+201xxxxxxxxx"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contactInfo.email" className="form-label">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    id="contactInfo.email"
                    name="contactInfo.email"
                    value={formData.contactInfo?.email || ''}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="contactInfo.whatsapp" className="form-label">
                    رقم واتساب
                  </label>
                  <input
                    type="tel"
                    id="contactInfo.whatsapp"
                    name="contactInfo.whatsapp"
                    value={formData.contactInfo?.whatsapp || ''}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="+201xxxxxxxxx"
                  />
                </div>
              </div>

              {/* Preferred Contact Time */}
              <div>
                <label htmlFor="contactInfo.preferredContactTime" className="form-label">
                  الوقت المفضل للتواصل
                </label>
                <select
                  id="contactInfo.preferredContactTime"
                  name="contactInfo.preferredContactTime"
                  value={formData.contactInfo?.preferredContactTime || ''}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">أي وقت</option>
                  <option value="صباحاً">صباحاً (9 ص - 12 ظ)</option>
                  <option value="ظهراً">ظهراً (12 ظ - 3 م)</option>
                  <option value="عصراً">عصراً (3 م - 6 م)</option>
                  <option value="مساءً">مساءً (6 م - 9 م)</option>
                </select>
              </div>

              {/* Owner Status */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="contactInfo.isOwner"
                    checked={formData.contactInfo?.isOwner || false}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="mr-2 text-gray-700">أنا مالك العقار</span>
                </label>
              </div>

              {/* Agent Info (if not owner) */}
              {!formData.contactInfo?.isOwner && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label htmlFor="contactInfo.agentName" className="form-label">
                      اسم الوسيط
                    </label>
                    <input
                      type="text"
                      id="contactInfo.agentName"
                      name="contactInfo.agentName"
                      className="form-input"
                      placeholder="اسم الوسيط العقاري"
                    />
                  </div>

                  <div>
                    <label htmlFor="contactInfo.agentPhone" className="form-label">
                      رقم هاتف الوسيط
                    </label>
                    <input
                      type="tel"
                      id="contactInfo.agentPhone"
                      name="contactInfo.agentPhone"
                      className="form-input"
                      placeholder="+201xxxxxxxxx"
                    />
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">
                  ملخص الإعلان
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">نوع العملية:</span> {realEstateOperationTypes.find(t => t.id === formData.operationType)?.name}
                  </div>
                  <div>
                    <span className="font-medium">نوع العقار:</span> {realEstatePropertyTypes.find(t => t.id === formData.propertyType)?.name}
                  </div>
                  <div>
                    <span className="font-medium">الموقع:</span> {formData.location?.city}, {formData.location?.governorate}
                  </div>
                  <div>
                    <span className="font-medium">المساحة:</span> {formData.area} متر مربع
                  </div>
                  <div>
                    <span className="font-medium">السعر:</span> {formData.price?.toLocaleString()} جنيه
                  </div>
                  <div>
                    <span className="font-medium">المميزات:</span> {formData.features?.length || 0} ميزة
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRight className="w-5 h-5 ml-2" />
              السابق
            </button>

            <div className="text-sm text-gray-500">
              {currentStep} من {steps.length}
            </div>

            {currentStep < steps.length ? (
              <button
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                التالي
                <ArrowLeft className="w-5 h-5 mr-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStepValid(currentStep) || isSubmitting}
                className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner ml-2" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    حفظ العقار
                    <CheckCircle className="w-5 h-5 mr-2" />
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>

        {/* Back to Properties */}
        <div className="mt-8 text-center">
          <Link
            href="/real-estate-system"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowRight className="w-4 h-4 ml-1" />
            العودة إلى قائمة العقارات
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
