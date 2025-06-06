'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Home, Search, Building, MapPin } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { storageManager } from '@/lib/storage/local-storage'

interface RealEstateModalProps {
  onClose: () => void
}

type PropertyType = 'house' | 'apartment' | 'land' | 'shop' | 'villa'
type ClientType = 'seller' | 'buyer'

const propertyTypeLabels: Record<PropertyType, string> = {
  house: 'بيت',
  apartment: 'شقة', 
  land: 'أرض',
  shop: 'محل',
  villa: 'فيلا'
}

const egyptGovernorates = [
  { id: 'cairo', name: 'القاهرة' },
  { id: 'giza', name: 'الجيزة' },
  { id: 'alexandria', name: 'الإسكندرية' },
  { id: 'qalyubia', name: 'القليوبية' },
  { id: 'dakahlia', name: 'الدقهلية' },
  { id: 'sharqia', name: 'الشرقية' },
  { id: 'gharbia', name: 'الغربية' },
  { id: 'menoufia', name: 'المنوفية' },
  { id: 'beheira', name: 'البحيرة' },
  { id: 'kafr_el_sheikh', name: 'كفر الشيخ' }
]

export default function RealEstateModal({ onClose }: RealEstateModalProps) {
  const [activeTab, setActiveTab] = useState<ClientType>('seller')
  
  // نموذج بيع العقار
  const [sellForm, setSellForm] = useState({
    name: '', phone: '', whatsapp: '', email: '', address: '',
    propertyType: 'apartment' as PropertyType, title: '', description: '', price: '', area: '',
    governorate: '', city: '', district: '', street: '', bedrooms: '', bathrooms: '',
    livingRooms: '', floor: '', totalFloors: '', buildingAge: '', condition: 'good',
    parking: false, garden: false, elevator: false, furnished: false, features: '', notes: ''
  })

  // نموذج شراء العقار
  const [buyForm, setBuyForm] = useState({
    name: '', phone: '', whatsapp: '', email: '', address: '',
    propertyTypes: [] as PropertyType[], budgetMin: '', budgetMax: '',
    preferredGovernorates: [] as string[], minArea: '', maxArea: '', minBedrooms: '', maxBedrooms: '', 
    minBathrooms: '', maxFloor: '', maxBuildingAge: '', parking: false, garden: false,
    elevator: false, furnished: false, urgency: 'medium', notes: ''
  })

  const handleSellSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!sellForm.name || !sellForm.phone || !sellForm.title || !sellForm.price) {
      toast.error('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    try {
      const client = {
        id: `seller-${Date.now()}`,
        type: 'seller' as ClientType,
        name: sellForm.name,
        phone: sellForm.phone,
        whatsapp: sellForm.whatsapp || sellForm.phone,
        email: sellForm.email,
        address: sellForm.address,
        notes: sellForm.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        property: {
          type: sellForm.propertyType,
          title: sellForm.title,
          description: sellForm.description,
          price: Number(sellForm.price),
          area: Number(sellForm.area),
          location: {
            governorate: sellForm.governorate,
            city: sellForm.city,
            district: sellForm.district,
            street: sellForm.street
          },
          specifications: {
            bedrooms: sellForm.bedrooms ? Number(sellForm.bedrooms) : undefined,
            bathrooms: sellForm.bathrooms ? Number(sellForm.bathrooms) : undefined,
            livingRooms: sellForm.livingRooms ? Number(sellForm.livingRooms) : undefined,
            floor: sellForm.floor ? Number(sellForm.floor) : undefined,
            totalFloors: sellForm.totalFloors ? Number(sellForm.totalFloors) : undefined,
            buildingAge: sellForm.buildingAge ? Number(sellForm.buildingAge) : undefined,
            condition: sellForm.condition as any,
            parking: sellForm.parking,
            garden: sellForm.garden,
            elevator: sellForm.elevator,
            furnished: sellForm.furnished
          },
          features: sellForm.features ? sellForm.features.split(',').map(f => f.trim()) : [],
          status: 'available' as const,
          listed_date: new Date().toISOString()
        }
      }

      const existingClients = storageManager.getRealEstateClients()
      storageManager.saveRealEstateClients([...existingClients, client])

      toast.success('تم إضافة العقار بنجاح! سنتواصل معك قريباً لتقديم خدمات التسويق')
      onClose()
    } catch (error) {
      toast.error('حدث خطأ في إرسال البيانات')
    }
  }

  const handleBuySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!buyForm.name || !buyForm.phone || buyForm.propertyTypes.length === 0) {
      toast.error('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    try {
      const client = {
        id: `buyer-${Date.now()}`,
        type: 'buyer' as ClientType,
        name: buyForm.name,
        phone: buyForm.phone,
        whatsapp: buyForm.whatsapp || buyForm.phone,
        email: buyForm.email,
        address: buyForm.address,
        notes: buyForm.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        requirements: {
          propertyTypes: buyForm.propertyTypes,
          budget: {
            min: Number(buyForm.budgetMin) || 0,
            max: Number(buyForm.budgetMax) || 999999999
          },
          preferredLocations: buyForm.preferredGovernorates.map(gov => ({ governorate: gov })),
          specifications: {
            minArea: buyForm.minArea ? Number(buyForm.minArea) : undefined,
            maxArea: buyForm.maxArea ? Number(buyForm.maxArea) : undefined,
            minBedrooms: buyForm.minBedrooms ? Number(buyForm.minBedrooms) : undefined,
            maxBedrooms: buyForm.maxBedrooms ? Number(buyForm.maxBedrooms) : undefined,
            minBathrooms: buyForm.minBathrooms ? Number(buyForm.minBathrooms) : undefined,
            maxFloor: buyForm.maxFloor ? Number(buyForm.maxFloor) : undefined,
            maxBuildingAge: buyForm.maxBuildingAge ? Number(buyForm.maxBuildingAge) : undefined,
            parking: buyForm.parking,
            garden: buyForm.garden,
            elevator: buyForm.elevator,
            furnished: buyForm.furnished
          },
          urgency: buyForm.urgency as any,
          notes: buyForm.notes
        }
      }

      const existingClients = storageManager.getRealEstateClients()
      storageManager.saveRealEstateClients([...existingClients, client])

      toast.success('تم إضافة طلب البحث بنجاح! سنتواصل معك عند توفر عقار مناسب')
      onClose()
    } catch (error) {
      toast.error('حدث خطأ في إرسال البيانات')
    }
  }

  const togglePropertyType = (type: PropertyType) => {
    setBuyForm(prev => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter(t => t !== type)
        : [...prev.propertyTypes, type]
    }))
  }

  const toggleGovernorate = (gov: string) => {
    setBuyForm(prev => ({
      ...prev,
      preferredGovernorates: prev.preferredGovernorates.includes(gov)
        ? prev.preferredGovernorates.filter(g => g !== gov)
        : [...prev.preferredGovernorates, gov]
    }))
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-right align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              التسويق العقاري
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('seller')}
              className={`flex-1 py-3 px-4 rounded-md transition-colors flex items-center justify-center ${
                activeTab === 'seller'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Home className="w-5 h-5 ml-2" />
              أريد بيع عقار
            </button>
            <button
              onClick={() => setActiveTab('buyer')}
              className={`flex-1 py-3 px-4 rounded-md transition-colors flex items-center justify-center ${
                activeTab === 'buyer'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Search className="w-5 h-5 ml-2" />
              أريد شراء عقار
            </button>
          </div>

          {/* Sell Form */}
          {activeTab === 'seller' && (
            <form onSubmit={handleSellSubmit} className="space-y-6">
              {/* بيانات المالك */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">بيانات المالك</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">الاسم الكامل *</label>
                    <input
                      type="text"
                      value={sellForm.name}
                      onChange={(e) => setSellForm(prev => ({ ...prev, name: e.target.value }))}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">رقم الهاتف *</label>
                    <input
                      type="tel"
                      value={sellForm.phone}
                      onChange={(e) => setSellForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">رقم الواتساب</label>
                    <input
                      type="tel"
                      value={sellForm.whatsapp}
                      onChange={(e) => setSellForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">البريد الإلكتروني</label>
                    <input
                      type="email"
                      value={sellForm.email}
                      onChange={(e) => setSellForm(prev => ({ ...prev, email: e.target.value }))}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* بيانات العقار */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">بيانات العقار</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">نوع العقار *</label>
                    <select
                      value={sellForm.propertyType}
                      onChange={(e) => setSellForm(prev => ({ ...prev, propertyType: e.target.value as PropertyType }))}
                      className="form-input"
                      required
                    >
                      {Object.entries(propertyTypeLabels).map(([type, label]) => (
                        <option key={type} value={type}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">عنوان العقار *</label>
                    <input
                      type="text"
                      value={sellForm.title}
                      onChange={(e) => setSellForm(prev => ({ ...prev, title: e.target.value }))}
                      className="form-input"
                      placeholder="مثال: شقة 3 غرف في مدينة نصر"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">السعر (جنيه) *</label>
                    <input
                      type="number"
                      value={sellForm.price}
                      onChange={(e) => setSellForm(prev => ({ ...prev, price: e.target.value }))}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">المساحة (متر مربع) *</label>
                    <input
                      type="number"
                      value={sellForm.area}
                      onChange={(e) => setSellForm(prev => ({ ...prev, area: e.target.value }))}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">المحافظة *</label>
                    <select
                      value={sellForm.governorate}
                      onChange={(e) => setSellForm(prev => ({ ...prev, governorate: e.target.value }))}
                      className="form-input"
                      required
                    >
                      <option value="">اختر المحافظة</option>
                      {egyptGovernorates.map(gov => (
                        <option key={gov.id} value={gov.name}>{gov.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">المدينة *</label>
                    <input
                      type="text"
                      value={sellForm.city}
                      onChange={(e) => setSellForm(prev => ({ ...prev, city: e.target.value }))}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="form-label">وصف العقار</label>
                  <textarea
                    value={sellForm.description}
                    onChange={(e) => setSellForm(prev => ({ ...prev, description: e.target.value }))}
                    className="form-input"
                    rows={3}
                    placeholder="اكتب وصفاً مفصلاً للعقار..."
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
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  إرسال البيانات
                </button>
              </div>
            </form>
          )}

          {/* Buy Form */}
          {activeTab === 'buyer' && (
            <form onSubmit={handleBuySubmit} className="space-y-6">
              {/* بيانات المشتري */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">بيانات المشتري</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">الاسم الكامل *</label>
                    <input
                      type="text"
                      value={buyForm.name}
                      onChange={(e) => setBuyForm(prev => ({ ...prev, name: e.target.value }))}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">رقم الهاتف *</label>
                    <input
                      type="tel"
                      value={buyForm.phone}
                      onChange={(e) => setBuyForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">رقم الواتساب</label>
                    <input
                      type="tel"
                      value={buyForm.whatsapp}
                      onChange={(e) => setBuyForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">البريد الإلكتروني</label>
                    <input
                      type="email"
                      value={buyForm.email}
                      onChange={(e) => setBuyForm(prev => ({ ...prev, email: e.target.value }))}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* متطلبات العقار */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">متطلبات العقار</h4>
                
                <div className="mb-4">
                  <label className="form-label">أنواع العقارات المطلوبة *</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
                    {Object.entries(propertyTypeLabels).map(([type, label]) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={buyForm.propertyTypes.includes(type as PropertyType)}
                          onChange={() => togglePropertyType(type as PropertyType)}
                          className="ml-2"
                        />
                        <span className="text-sm">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">الحد الأدنى للسعر (جنيه)</label>
                    <input
                      type="number"
                      value={buyForm.budgetMin}
                      onChange={(e) => setBuyForm(prev => ({ ...prev, budgetMin: e.target.value }))}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">الحد الأقصى للسعر (جنيه)</label>
                    <input
                      type="number"
                      value={buyForm.budgetMax}
                      onChange={(e) => setBuyForm(prev => ({ ...prev, budgetMax: e.target.value }))}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="form-label">المحافظات المفضلة</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {egyptGovernorates.map(gov => (
                      <label key={gov.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={buyForm.preferredGovernorates.includes(gov.name)}
                          onChange={() => toggleGovernorate(gov.name)}
                          className="ml-2"
                        />
                        <span className="text-sm">{gov.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="form-label">ملاحظات إضافية</label>
                  <textarea
                    value={buyForm.notes}
                    onChange={(e) => setBuyForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="form-input"
                    rows={3}
                    placeholder="اكتب أي متطلبات خاصة..."
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
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  إرسال الطلب
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
