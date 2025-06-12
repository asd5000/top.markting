'use client'

import { useState } from 'react'
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Video, 
  FileText,
  Save,
  User,
  Building2,
  MapPin,
  DollarSign,
  Phone,
  Mail,
  MessageSquare
} from 'lucide-react'

interface PropertyFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  property?: any
}

export default function PropertyForm({ isOpen, onClose, onSubmit, property }: PropertyFormProps) {
  const [formData, setFormData] = useState({
    // بيانات العميل
    clientType: property?.clientType || 'seller',
    clientName: property?.clientName || '',
    phone: property?.phone || '',
    whatsapp: property?.whatsapp || '',
    email: property?.email || '',

    // بيانات العقار
    propertyType: property?.propertyType || 'apartment',
    operationType: property?.operationType || 'sale',
    area: property?.area || '',
    rooms: property?.rooms || '',
    bathrooms: property?.bathrooms || '',
    floors: property?.floors || '',
    finishing: property?.finishing || 'none',
    age: property?.age || '',
    elevator: property?.elevator || false,
    garage: property?.garage || false,
    view: property?.view || '',

    // التفاصيل المالية
    price: property?.price || '',
    negotiable: property?.negotiable || false,
    paymentMethod: property?.paymentMethod || 'cash',

    // الموقع
    governorate: property?.governorate || '',
    city: property?.city || '',
    district: property?.district || '',
    street: property?.street || '',
    landmark: property?.landmark || '',

    // تفاصيل إضافية
    description: property?.description || '',
    features: property?.features || '',
    notes: property?.notes || '',

    // حقول إدارية
    status: property?.status || 'pending',
    priority: property?.priority || 'medium',
    adminNotes: property?.adminNotes || ''
  })

  const [files, setFiles] = useState({
    images: [],
    video: null,
    documents: []
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const propertyData = {
      ...formData,
      id: property?.id || Date.now().toString(),
      images: files.images,
      video: files.video,
      documents: files.documents,
      createdAt: property?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewsCount: property?.viewsCount || 0,
      inquiriesCount: property?.inquiriesCount || 0
    }

    onSubmit(propertyData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">
              {property ? 'تعديل العقار' : 'إضافة عقار جديد'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* بيانات العميل */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 ml-2" />
              بيانات العميل
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">نوع العميل *</label>
                <select
                  name="clientType"
                  value={formData.clientType}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="seller">بائع</option>
                  <option value="buyer">مشتري</option>
                </select>
              </div>
              <div>
                <label className="form-label">الاسم الكامل *</label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  className="form-input"
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
                  required
                />
              </div>
              <div>
                <label className="form-label">رقم الواتساب</label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="md:col-span-2">
                <label className="form-label">البريد الإلكتروني</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* بيانات العقار */}
          <div className="bg-green-50 p-6 rounded-lg">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Building2 className="w-5 h-5 ml-2" />
              بيانات العقار
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label">نوع العقار *</label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="apartment">شقة</option>
                  <option value="villa">فيلا</option>
                  <option value="house">بيت</option>
                  <option value="land">أرض</option>
                  <option value="shop">محل تجاري</option>
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
                  <option value="sale">بيع</option>
                  <option value="rent">إيجار</option>
                </select>
              </div>
              <div>
                <label className="form-label">المساحة (م²) *</label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="form-label">عدد الغرف</label>
                <input
                  type="number"
                  name="rooms"
                  value={formData.rooms}
                  onChange={handleInputChange}
                  className="form-input"
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
                />
              </div>
              <div>
                <label className="form-label">نوع التشطيب</label>
                <select
                  name="finishing"
                  value={formData.finishing}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="none">بدون تشطيب</option>
                  <option value="semi">نصف تشطيب</option>
                  <option value="full">تشطيب كامل</option>
                  <option value="luxury">تشطيب فاخر</option>
                </select>
              </div>
              <div>
                <label className="form-label">عمر العقار (سنة)</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">الإطلالة</label>
                <input
                  type="text"
                  name="view"
                  value={formData.view}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="مثل: شارع رئيسي، حديقة، بحر"
                />
              </div>
              <div className="md:col-span-3">
                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="elevator"
                      checked={formData.elevator}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="mr-2 text-sm text-gray-700">مصعد</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="garage"
                      checked={formData.garage}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="mr-2 text-sm text-gray-700">جراج</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* التفاصيل المالية */}
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 ml-2" />
              التفاصيل المالية
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label">السعر (ج.م) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="form-input"
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
                  <option value="cash">كاش</option>
                  <option value="installments">أقساط</option>
                  <option value="both">كاش أو أقساط</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="negotiable"
                    checked={formData.negotiable}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="mr-2 text-sm text-gray-700">قابل للتفاوض</span>
                </label>
              </div>
            </div>
          </div>

          {/* الموقع */}
          <div className="bg-purple-50 p-6 rounded-lg">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 ml-2" />
              الموقع
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">المحافظة *</label>
                <select
                  name="governorate"
                  value={formData.governorate}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="">اختر المحافظة</option>
                  <option value="القاهرة">القاهرة</option>
                  <option value="الجيزة">الجيزة</option>
                  <option value="الإسكندرية">الإسكندرية</option>
                  <option value="القاهرة الجديدة">القاهرة الجديدة</option>
                  <option value="6 أكتوبر">6 أكتوبر</option>
                </select>
              </div>
              <div>
                <label className="form-label">المدينة *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="form-label">الحي *</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="form-input"
                  required
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
                />
              </div>
              <div className="md:col-span-2">
                <label className="form-label">أقرب معلم</label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="مثل: بجوار مترو المعادي، خلف مول العرب"
                />
              </div>
            </div>
          </div>

          {/* تفاصيل إضافية */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 ml-2" />
              تفاصيل إضافية
            </h4>
            <div className="space-y-4">
              <div>
                <label className="form-label">وصف العقار</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-input"
                  rows={3}
                  placeholder="اكتب وصف مفصل للعقار..."
                />
              </div>
              <div>
                <label className="form-label">المميزات الخاصة</label>
                <textarea
                  name="features"
                  value={formData.features}
                  onChange={handleInputChange}
                  className="form-input"
                  rows={2}
                  placeholder="مثل: تكييف مركزي، أمن وحراسة، حديقة..."
                />
              </div>
              <div>
                <label className="form-label">ملاحظات</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="form-input"
                  rows={2}
                  placeholder="أي ملاحظات إضافية..."
                />
              </div>
            </div>
          </div>

          {/* حقول إدارية */}
          <div className="bg-red-50 p-6 rounded-lg">
            <h4 className="text-lg font-bold text-gray-900 mb-4">إعدادات إدارية</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">حالة العقار</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="pending">معلق</option>
                  <option value="approved">موافق عليه</option>
                  <option value="rejected">مرفوض</option>
                  <option value="featured">مميز</option>
                </select>
              </div>
              <div>
                <label className="form-label">الأولوية</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="low">منخفضة</option>
                  <option value="medium">متوسطة</option>
                  <option value="high">عالية</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="form-label">ملاحظات إدارية</label>
                <textarea
                  name="adminNotes"
                  value={formData.adminNotes}
                  onChange={handleInputChange}
                  className="form-input"
                  rows={2}
                  placeholder="ملاحظات للفريق الإداري..."
                />
              </div>
            </div>
          </div>

          {/* أزرار الحفظ */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button 
              type="button"
              onClick={onClose}
              className="btn border border-gray-300"
            >
              إلغاء
            </button>
            <button 
              type="submit" 
              className="btn btn-primary flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {property ? 'تحديث العقار' : 'حفظ العقار'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
