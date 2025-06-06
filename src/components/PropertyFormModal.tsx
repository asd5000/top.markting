'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Building, 
  MapPin, 
  DollarSign, 
  Home, 
  CheckCircle,
  X,
  Plus,
  User,
  Phone,
  Mail
} from 'lucide-react'
import { 
  realEstatePropertyTypes, 
  realEstateOperationTypes, 
  egyptianGovernorates,
  propertyFeatures,
  RealEstateProperty 
} from '@/data/services/services-data'

interface PropertyFormModalProps {
  type: 'sell-property' | 'buy-property'
  onSubmit: (data: any) => void
  onClose: () => void
}

export default function PropertyFormModal({ type, onSubmit, onClose }: PropertyFormModalProps) {
  const [formData, setFormData] = useState<Partial<RealEstateProperty>>({
    operationType: type === 'sell-property' ? 'seller' : 'buyer',
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
      nearbyLandmarks: []
    },
    details: {
      rooms: 0,
      bathrooms: 0,
      furnished: 'unfurnished'
    },
    features: [],
    contactInfo: {
      name: '',
      phone: '',
      email: '',
      isOwner: true
    }
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type: inputType } = e.target
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
          [field]: inputType === 'checkbox' ? checked : 
                   (field === 'rooms' || field === 'bathrooms') ? Number(value) : value
        }
      }))
    } else if (name.startsWith('contactInfo.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo!,
          [field]: inputType === 'checkbox' ? checked : value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: inputType === 'checkbox' ? checked : 
                (name === 'area' || name === 'price') ? Number(value) : value
      }))
    }
  }

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...(prev.features || []), feature]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const isSelling = type === 'sell-property'

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-right align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <Building className="w-6 h-6 ml-3" />
              {isSelling ? 'بيع عقار' : 'شراء عقار'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Property Type */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-4">
                نوع العقار
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {realEstatePropertyTypes.map((type) => (
                  <label
                    key={type.id}
                    className={`flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
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
                    <span className="text-2xl mb-1">{type.icon}</span>
                    <span className="text-sm font-medium text-center">{type.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="form-label">
                {isSelling ? 'عنوان الإعلان' : 'وصف العقار المطلوب'} *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title || ''}
                onChange={handleInputChange}
                className="form-input"
                placeholder={isSelling ? 'مثال: شقة للبيع في المعادي' : 'مثال: أبحث عن شقة في المعادي'}
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

            {/* Area and Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div>
                <label htmlFor="price" className="form-label">
                  {isSelling ? 'السعر المطلوب' : 'الميزانية المتاحة'} (جنيه) *
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
            </div>

            {/* Property Details */}
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
                  <option value="negotiable">قابل للتفاوض</option>
                </select>
              </div>
            </div>

            {/* Features */}
            <div>
              <label className="form-label">المميزات المطلوبة</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {propertyFeatures.slice(0, 12).map((feature) => (
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
                      onChange={() => handleFeatureToggle(feature)}
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

            {/* Description */}
            <div>
              <label htmlFor="description" className="form-label">
                {isSelling ? 'وصف العقار' : 'تفاصيل إضافية'}
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                rows={4}
                className="form-input resize-none"
                placeholder={isSelling ? 'اكتب وصفاً مفصلاً للعقار...' : 'اكتب أي تفاصيل إضافية...'}
              />
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {isSelling ? 'عرض العقار للبيع' : 'إرسال طلب الشراء'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
