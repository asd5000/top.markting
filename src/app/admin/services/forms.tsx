import React, { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import {
  X, Save, Package, Palette, Megaphone, Video, Database, Globe, Layers, Star, Upload,
  Camera, Code, Smartphone, Monitor, Headphones, Mic, Edit, Image, Film,
  Zap, Target, TrendingUp, Users, Heart, ShoppingCart, Mail, Phone,
  Settings, Wrench, Cpu, Cloud, Shield, Lock, Key
} from 'lucide-react'

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

interface ServiceFormProps {
  show: boolean
  onClose: () => void
  onSave: () => void
  editing: Service | null
  form: {
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
  }
  setForm: (form: any) => void
}

interface SubServiceFormProps {
  show: boolean
  onClose: () => void
  onSave: () => void
  editing: SubService | null
  form: {
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
  }
  setForm: (form: any) => void
  services: Service[]
}

export const ServiceForm: React.FC<ServiceFormProps> = ({
  show,
  onClose,
  onSave,
  editing,
  form,
  setForm
}) => {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!show) return null

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true)
      console.log('📤 Uploading service image:', file.name)

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت')
        return null
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('يرجى اختيار ملف صورة صحيح')
        return null
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `service_${Date.now()}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Error uploading image:', error)
        alert(`خطأ في رفع الصورة: ${error.message}`)
        return null
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName)

      console.log('✅ Image uploaded successfully:', publicUrl)
      alert('تم رفع الصورة بنجاح!')
      return publicUrl

    } catch (error) {
      console.error('Error uploading image:', error)
      alert('حدث خطأ أثناء رفع الصورة')
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const imageUrl = await uploadImage(file)
    if (imageUrl) {
      setForm({ ...form, image_url: imageUrl })
    }
  }

  const iconOptions = [
    // خدمات أساسية
    { value: 'package', label: 'حزمة', icon: Package },
    { value: 'palette', label: 'تصميم', icon: Palette },
    { value: 'megaphone', label: 'تسويق', icon: Megaphone },
    { value: 'video', label: 'فيديو', icon: Video },
    { value: 'database', label: 'قاعدة بيانات', icon: Database },
    { value: 'globe', label: 'موقع ويب', icon: Globe },
    { value: 'layers', label: 'طبقات', icon: Layers },

    // تصميم ومونتاج
    { value: 'camera', label: 'كاميرا', icon: Camera },
    { value: 'image', label: 'صورة', icon: Image },
    { value: 'film', label: 'فيلم', icon: Film },
    { value: 'edit', label: 'تحرير', icon: Edit },

    // تطوير وبرمجة
    { value: 'code', label: 'برمجة', icon: Code },
    { value: 'smartphone', label: 'موبايل', icon: Smartphone },
    { value: 'monitor', label: 'شاشة', icon: Monitor },
    { value: 'cpu', label: 'معالج', icon: Cpu },
    { value: 'cloud', label: 'سحابة', icon: Cloud },

    // تسويق ومبيعات
    { value: 'target', label: 'هدف', icon: Target },
    { value: 'trending-up', label: 'نمو', icon: TrendingUp },
    { value: 'users', label: 'مستخدمين', icon: Users },
    { value: 'heart', label: 'قلب', icon: Heart },
    { value: 'shopping-cart', label: 'سلة', icon: ShoppingCart },
    { value: 'zap', label: 'برق', icon: Zap },

    // تواصل وخدمات
    { value: 'mail', label: 'بريد', icon: Mail },
    { value: 'phone', label: 'هاتف', icon: Phone },
    { value: 'headphones', label: 'سماعات', icon: Headphones },
    { value: 'mic', label: 'ميكروفون', icon: Mic },

    // أدوات وإعدادات
    { value: 'settings', label: 'إعدادات', icon: Settings },
    { value: 'wrench', label: 'مفتاح', icon: Wrench },
    { value: 'shield', label: 'حماية', icon: Shield },
    { value: 'lock', label: 'قفل', icon: Lock },
    { value: 'key', label: 'مفتاح', icon: Key },
    { value: 'star', label: 'نجمة', icon: Star }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">
            {editing ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* معلومات أساسية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم الخدمة *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="مثال: التصميم الجرافيكي"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ترتيب الظهور
              </label>
              <input
                type="number"
                value={form.sort_order || 0}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              وصف قصير
            </label>
            <input
              type="text"
              value={form.short_description || ''}
              onChange={(e) => setForm({ ...form, short_description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="وصف مختصر يظهر تحت اسم الخدمة"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الوصف التفصيلي
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="وصف تفصيلي للخدمة وما تتضمنه"
            />
          </div>

          {/* رفع الصورة */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              صورة الخدمة
            </label>
            <div className="flex items-center space-x-4">
              {form.image_url && (
                <img
                  src={form.image_url}
                  alt="صورة الخدمة"
                  className="w-20 h-20 rounded-lg object-cover border border-gray-300"
                />
              )}
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors flex items-center justify-center"
                >
                  {uploading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 ml-2 text-gray-400" />
                      <span className="text-gray-600">
                        {form.image_url ? 'تغيير الصورة' : 'رفع صورة'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* اللون المخصص */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اللون المخصص
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={form.custom_color || '#3B82F6'}
                  onChange={(e) => setForm({ ...form, custom_color: e.target.value })}
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={form.custom_color || '#3B82F6'}
                  onChange={(e) => setForm({ ...form, custom_color: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="#3B82F6"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الحالة
              </label>
              <select
                value={form.status || 'active'}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
                <option value="draft">مسودة</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              أيقونة الخدمة
            </label>
            <div className="grid grid-cols-6 gap-2 max-h-64 overflow-y-auto">
              {iconOptions.map((option) => {
                const IconComponent = option.icon
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setForm({ ...form, icon: option.value })}
                    className={`p-2 border rounded-lg flex flex-col items-center space-y-1 transition-colors ${
                      form.icon === option.value
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    title={option.label}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-xs truncate w-full text-center">{option.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* خيارات إضافية */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={form.is_featured || false}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="mr-2 text-sm text-gray-700 flex items-center">
                <Star className="w-4 h-4 ml-1 text-yellow-500" />
                خدمة مميزة
              </span>
            </label>
          </div>

          {/* معاينة الرابط */}
          {form.name && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">رابط الخدمة:</h4>
              <p className="text-blue-700 text-sm font-mono">
                /services/{form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')}
              </p>
              <p className="text-blue-600 text-xs mt-1">
                سيتم إنشاء هذا الرابط تلقائياً عند حفظ الخدمة
              </p>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            إلغاء
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Save className="w-4 h-4 ml-2" />
            {editing ? 'تحديث' : 'حفظ'}
          </button>
        </div>
      </div>
    </div>
  )
}

export const SubServiceForm: React.FC<SubServiceFormProps> = ({
  show,
  onClose,
  onSave,
  editing,
  form,
  setForm,
  services
}) => {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!show) return null

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true)
      console.log('📤 Uploading sub-service image:', file.name)

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت')
        return null
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('يرجى اختيار ملف صورة صحيح')
        return null
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `sub_service_${Date.now()}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Error uploading image:', error)
        alert(`خطأ في رفع الصورة: ${error.message}`)
        return null
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName)

      console.log('✅ Image uploaded successfully:', publicUrl)
      alert('تم رفع الصورة بنجاح!')
      return publicUrl

    } catch (error) {
      console.error('Error uploading image:', error)
      alert('حدث خطأ أثناء رفع الصورة')
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const imageUrl = await uploadImage(file)
    if (imageUrl) {
      setForm({ ...form, image_url: imageUrl })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">
            {editing ? 'تعديل الخدمة الفرعية' : 'إضافة خدمة فرعية جديدة'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الخدمة الأساسية *
            </label>
            <select
              value={form.service_id}
              onChange={(e) => setForm({ ...form, service_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">اختر الخدمة الأساسية</option>
              {services.filter(s => s.is_active).map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم الخدمة الفرعية *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="مثال: تصميم لوجو، فيديو إعلاني، تسويق منتج..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              وصف الخدمة الفرعية
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="وصف تفصيلي للخدمة الفرعية..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                السعر (ج.م) *
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ترتيب العرض
              </label>
              <input
                type="number"
                value={form.sort_order || 0}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          {/* رفع الصورة */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              صورة الخدمة الفرعية
            </label>
            <div className="flex items-center space-x-4">
              {form.image_url && (
                <img
                  src={form.image_url}
                  alt="صورة الخدمة الفرعية"
                  className="w-20 h-20 rounded-lg object-cover border border-gray-300"
                />
              )}
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 transition-colors flex items-center justify-center"
                >
                  {uploading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 ml-2 text-gray-400" />
                      <span className="text-gray-600">
                        {form.image_url ? 'تغيير الصورة' : 'رفع صورة'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* رفع الصورة */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              صورة الخدمة الفرعية
            </label>
            <div className="flex items-center space-x-4">
              {form.image_url && (
                <img
                  src={form.image_url}
                  alt="صورة الخدمة الفرعية"
                  className="w-20 h-20 rounded-lg object-cover border border-gray-300"
                />
              )}
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 transition-colors flex items-center justify-center"
                >
                  {uploading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 ml-2 text-gray-400" />
                      <span className="text-gray-600">
                        {form.image_url ? 'تغيير الصورة' : 'رفع صورة'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              مدة التسليم
            </label>
            <input
              type="text"
              value={form.delivery_time || ''}
              onChange={(e) => setForm({ ...form, delivery_time: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="3-5 أيام عمل"
            />
          </div>

          {/* المميزات */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              مميزات الخدمة
            </label>
            <div className="space-y-2">
              {(form.features || []).map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => {
                      const newFeatures = [...(form.features || [])]
                      newFeatures[index] = e.target.value
                      setForm({ ...form, features: newFeatures })
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="مثال: 3 مراجعات مجانية"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newFeatures = (form.features || []).filter((_, i) => i !== index)
                      setForm({ ...form, features: newFeatures })
                    }}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setForm({ ...form, features: [...(form.features || []), ''] })
                }}
                className="text-green-600 hover:text-green-800 text-sm flex items-center"
              >
                <Package className="w-4 h-4 ml-1" />
                إضافة ميزة
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الحالة
            </label>
            <select
              value={form.status || 'active'}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
              <option value="draft">مسودة</option>
            </select>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            إلغاء
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
          >
            <Save className="w-4 h-4 ml-2" />
            {editing ? 'تحديث' : 'حفظ'}
          </button>
        </div>
      </div>
    </div>
  )
}
