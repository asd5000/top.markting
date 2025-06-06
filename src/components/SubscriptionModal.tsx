'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Check, Package, Calendar, CreditCard, Plus, Minus } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/lib/auth/auth-context'

interface SubscriptionModalProps {
  package: any
  onClose: () => void
}

interface ServiceSelection {
  design: number
  video: number
  followers: number
  dataExtraction: number
  marketing: boolean
}

export default function SubscriptionModal({ package: pkg, onClose }: SubscriptionModalProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    customerPhone: '',
    companyName: '',
    requirements: '',
    paymentMethod: '',
    startDate: new Date().toISOString().split('T')[0]
  })

  const [serviceSelection, setServiceSelection] = useState<ServiceSelection>({
    design: 0,
    video: 0,
    followers: 0,
    dataExtraction: 0,
    marketing: false
  })

  const [totalPrice, setTotalPrice] = useState(0)

  const paymentMethods = [
    { id: 'vodafone-cash', name: 'فودافون كاش', icon: '💳' },
    { id: 'instapay', name: 'إنستاباي', icon: '📱' },
    { id: 'fawry', name: 'فوري', icon: '🏪' },
    { id: 'bank-transfer', name: 'تحويل بنكي', icon: '🏦' }
  ]

  // حساب السعر الإجمالي
  useEffect(() => {
    let total = 0
    const limits = pkg.limits

    // حساب سعر التصميم
    if (serviceSelection.design > 0) {
      total += serviceSelection.design * limits.design.price
    }

    // حساب سعر الفيديو
    if (serviceSelection.video > 0) {
      total += serviceSelection.video * limits.video.price
    }

    // حساب سعر المتابعين
    if (serviceSelection.followers > 0) {
      const units = Math.ceil(serviceSelection.followers / limits.followers.unit)
      total += units * limits.followers.price
    }

    // حساب سعر سحب البيانات
    if (serviceSelection.dataExtraction > 0) {
      const units = Math.ceil(serviceSelection.dataExtraction / limits.dataExtraction.unit)
      total += units * limits.dataExtraction.price
    }

    // حساب سعر التسويق
    if (serviceSelection.marketing) {
      total += limits.marketing.price
    }

    setTotalPrice(total)
  }, [serviceSelection, pkg.limits])

  // تحديث كمية الخدمة
  const updateServiceQuantity = (service: keyof ServiceSelection, value: number | boolean) => {
    setServiceSelection(prev => ({
      ...prev,
      [service]: value
    }))
  }

  // التحقق من الحد الأقصى
  const getMaxLimit = (service: string) => {
    const limits = pkg.limits
    switch (service) {
      case 'design': return limits.design.max
      case 'video': return limits.video.max
      case 'followers': return limits.followers.max
      case 'dataExtraction': return limits.dataExtraction.max
      default: return 0
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone || !formData.paymentMethod) {
      toast.error('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    // التحقق من اختيار خدمة واحدة على الأقل
    const hasSelectedService = serviceSelection.design > 0 ||
                              serviceSelection.video > 0 ||
                              serviceSelection.followers > 0 ||
                              serviceSelection.dataExtraction > 0 ||
                              serviceSelection.marketing

    if (!hasSelectedService) {
      toast.error('يرجى اختيار خدمة واحدة على الأقل')
      return
    }

    try {
      // إنشاء اشتراك جديد
      const subscription = {
        id: `subscription-${Date.now()}`,
        customer: {
          name: formData.customerName,
          email: formData.customerEmail,
          phone: formData.customerPhone,
          company: formData.companyName
        },
        package: {
          id: pkg.id,
          name: pkg.name,
          type: pkg.packageType,
          price: totalPrice,
          limits: pkg.limits
        },
        selectedServices: serviceSelection,
        status: 'pending',
        payment_status: 'pending',
        payment_method: formData.paymentMethod,
        start_date: formData.startDate,
        end_date: new Date(new Date(formData.startDate).setMonth(new Date(formData.startDate).getMonth() + 1)).toISOString().split('T')[0],
        requirements: formData.requirements,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        usage: {
          design: 0,
          video: 0,
          dataExtraction: 0,
          followers: 0,
          marketing: 0
        }
      }

      // حفظ الاشتراك في localStorage
      const existingSubscriptions = JSON.parse(localStorage.getItem('topmarketing_subscriptions') || '[]')
      localStorage.setItem('topmarketing_subscriptions', JSON.stringify([...existingSubscriptions, subscription]))

      toast.success(`تم تفعيل الاشتراك بنجاح! إجمالي السعر: ${totalPrice} جنيه شهرياً`)
      onClose()
    } catch (error) {
      toast.error('حدث خطأ في تفعيل الاشتراك')
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-right align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <Package className="w-6 h-6 ml-2" />
              تفعيل اشتراك - {pkg.name}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* تفاصيل الباقة */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-semibold text-gray-900">{pkg.name}</h4>
              <div className="text-left">
                <div className="text-2xl font-bold text-blue-600">{totalPrice} جنيه</div>
                <div className="text-sm text-gray-600">{pkg.duration}</div>
              </div>
            </div>

            <p className="text-gray-600 mb-4">{pkg.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-gray-900 mb-2">المميزات المشمولة:</h5>
                <ul className="space-y-1">
                  {pkg.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500 ml-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-semibold text-gray-900 mb-2">الحدود القصوى:</h5>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>تصميم: حتى {pkg.limits.design.max} تصميم</li>
                  <li>فيديو: حتى {pkg.limits.video.max} فيديو</li>
                  <li>متابعين: حتى {pkg.limits.followers.max.toLocaleString()} متابع</li>
                  <li>سحب بيانات: حتى {pkg.limits.dataExtraction.max.toLocaleString()} سجل</li>
                  <li>التسويق: {pkg.limits.marketing.price} جنيه شهرياً</li>
                </ul>
              </div>
            </div>
          </div>

          {/* اختيار الخدمات */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h4 className="font-semibold text-gray-900 mb-4">اختر الخدمات المطلوبة</h4>

            {/* خدمة التصميم */}
            <div className="mb-6 p-4 bg-white rounded-lg border">
              <div className="flex justify-between items-center mb-3">
                <h5 className="font-medium text-gray-900">تصميم المنشورات</h5>
                <span className="text-sm text-gray-600">{pkg.limits.design.price} جنيه/تصميم</span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => updateServiceQuantity('design', Math.max(0, serviceSelection.design - 1))}
                  className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                  disabled={serviceSelection.design <= 0}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-16 text-center font-medium">{serviceSelection.design}</span>
                <button
                  type="button"
                  onClick={() => updateServiceQuantity('design', Math.min(getMaxLimit('design'), serviceSelection.design + 1))}
                  className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600"
                  disabled={serviceSelection.design >= getMaxLimit('design')}
                >
                  <Plus className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-600">
                  (حتى {getMaxLimit('design')} تصميم)
                </span>
                <span className="mr-auto font-medium text-blue-600">
                  {serviceSelection.design * pkg.limits.design.price} جنيه
                </span>
              </div>
            </div>

            {/* خدمة الفيديو */}
            <div className="mb-6 p-4 bg-white rounded-lg border">
              <div className="flex justify-between items-center mb-3">
                <h5 className="font-medium text-gray-900">مونتاج الفيديو</h5>
                <span className="text-sm text-gray-600">{pkg.limits.video.price} جنيه/فيديو</span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => updateServiceQuantity('video', Math.max(0, serviceSelection.video - 1))}
                  className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                  disabled={serviceSelection.video <= 0}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-16 text-center font-medium">{serviceSelection.video}</span>
                <button
                  type="button"
                  onClick={() => updateServiceQuantity('video', Math.min(getMaxLimit('video'), serviceSelection.video + 1))}
                  className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600"
                  disabled={serviceSelection.video >= getMaxLimit('video')}
                >
                  <Plus className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-600">
                  (حتى {getMaxLimit('video')} فيديو)
                </span>
                <span className="mr-auto font-medium text-blue-600">
                  {serviceSelection.video * pkg.limits.video.price} جنيه
                </span>
              </div>
            </div>

            {/* خدمة المتابعين */}
            <div className="mb-6 p-4 bg-white rounded-lg border">
              <div className="flex justify-between items-center mb-3">
                <h5 className="font-medium text-gray-900">إضافة متابعين</h5>
                <span className="text-sm text-gray-600">{pkg.limits.followers.price} جنيه/1000 متابع</span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => updateServiceQuantity('followers', Math.max(0, serviceSelection.followers - 1000))}
                  className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                  disabled={serviceSelection.followers <= 0}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-20 text-center font-medium">{serviceSelection.followers.toLocaleString()}</span>
                <button
                  type="button"
                  onClick={() => updateServiceQuantity('followers', Math.min(getMaxLimit('followers'), serviceSelection.followers + 1000))}
                  className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600"
                  disabled={serviceSelection.followers >= getMaxLimit('followers')}
                >
                  <Plus className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-600">
                  (حتى {getMaxLimit('followers').toLocaleString()} متابع)
                </span>
                <span className="mr-auto font-medium text-blue-600">
                  {Math.ceil(serviceSelection.followers / pkg.limits.followers.unit) * pkg.limits.followers.price} جنيه
                </span>
              </div>
            </div>

            {/* خدمة سحب البيانات */}
            <div className="mb-6 p-4 bg-white rounded-lg border">
              <div className="flex justify-between items-center mb-3">
                <h5 className="font-medium text-gray-900">سحب البيانات</h5>
                <span className="text-sm text-gray-600">{pkg.limits.dataExtraction.price} جنيه/1000 سجل</span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => updateServiceQuantity('dataExtraction', Math.max(0, serviceSelection.dataExtraction - 1000))}
                  className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                  disabled={serviceSelection.dataExtraction <= 0}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-20 text-center font-medium">{serviceSelection.dataExtraction.toLocaleString()}</span>
                <button
                  type="button"
                  onClick={() => updateServiceQuantity('dataExtraction', Math.min(getMaxLimit('dataExtraction'), serviceSelection.dataExtraction + 1000))}
                  className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600"
                  disabled={serviceSelection.dataExtraction >= getMaxLimit('dataExtraction')}
                >
                  <Plus className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-600">
                  (حتى {getMaxLimit('dataExtraction').toLocaleString()} سجل)
                </span>
                <span className="mr-auto font-medium text-blue-600">
                  {Math.ceil(serviceSelection.dataExtraction / pkg.limits.dataExtraction.unit) * pkg.limits.dataExtraction.price} جنيه
                </span>
              </div>
            </div>

            {/* خدمة التسويق */}
            <div className="mb-6 p-4 bg-white rounded-lg border">
              <div className="flex justify-between items-center">
                <div>
                  <h5 className="font-medium text-gray-900">خدمات التسويق</h5>
                  <p className="text-sm text-gray-600">خدمات تسويقية شاملة</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">{pkg.limits.marketing.price} جنيه/شهر</span>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={serviceSelection.marketing}
                      onChange={(e) => updateServiceQuantity('marketing', e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="mr-2 font-medium text-blue-600">
                      {serviceSelection.marketing ? pkg.limits.marketing.price : 0} جنيه
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* إجمالي السعر */}
            <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
              <div className="flex justify-between items-center">
                <h5 className="text-lg font-semibold text-gray-900">إجمالي السعر الشهري</h5>
                <span className="text-2xl font-bold text-blue-600">{totalPrice} جنيه</span>
              </div>
            </div>
          </div>

          {/* نموذج التفعيل */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* بيانات العميل */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-4">بيانات العميل</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">الاسم الكامل *</label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">البريد الإلكتروني *</label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">رقم الهاتف *</label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">اسم الشركة (اختياري)</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* تفاصيل الاشتراك */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-4">تفاصيل الاشتراك</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">تاريخ البدء *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">طريقة الدفع *</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    className="form-input"
                    required
                  >
                    <option value="">اختر طريقة الدفع</option>
                    {paymentMethods.map(method => (
                      <option key={method.id} value={method.id}>
                        {method.icon} {method.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="form-label">متطلبات خاصة</label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                  className="form-input"
                  rows={3}
                  placeholder="اكتب أي متطلبات خاصة أو ملاحظات..."
                />
              </div>
            </div>

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
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <CreditCard className="w-5 h-5 ml-2" />
                تفعيل الاشتراك
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
