'use client'

import { useState, useEffect } from 'react'
import { 
  Settings, Save, Upload, Palette, Phone, Mail, 
  Globe, Facebook, Instagram, Twitter, Youtube,
  ArrowLeft, Eye, EyeOff, RefreshCw
} from 'lucide-react'
import Link from 'next/link'

interface SiteSettings {
  siteName: string
  siteDescription: string
  logo: string
  primaryColor: string
  secondaryColor: string
  phoneNumber: string
  whatsappNumber: string
  email: string
  address: string
  facebookUrl: string
  instagramUrl: string
  twitterUrl: string
  youtubeUrl: string
  vodafoneCashNumber: string
  instapayNumber: string
  foripayNumber: string
  maintenanceMode: boolean
  allowRegistration: boolean
}

export default function SystemSettings() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'Top Marketing',
    siteDescription: 'أفضل خدمات التصميم والتسويق في مصر',
    logo: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    phoneNumber: '01068275557',
    whatsappNumber: '01068275557',
    email: 'info@topmarketing.com',
    address: 'القاهرة، مصر',
    facebookUrl: '',
    instagramUrl: '',
    twitterUrl: '',
    youtubeUrl: '',
    vodafoneCashNumber: '01068275557',
    instapayNumber: '01068275557',
    foripayNumber: '01068275557',
    maintenanceMode: false,
    allowRegistration: true
  })

  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  const handleSave = async () => {
    setLoading(true)
    try {
      // محاكاة حفظ الإعدادات
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // حفظ في localStorage للمحاكاة
      localStorage.setItem('siteSettings', JSON.stringify(settings))
      
      alert('تم حفظ الإعدادات بنجاح!')
    } catch (error) {
      alert('حدث خطأ أثناء حفظ الإعدادات')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    if (confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات؟')) {
      setSettings({
        siteName: 'Top Marketing',
        siteDescription: 'أفضل خدمات التصميم والتسويق في مصر',
        logo: '',
        primaryColor: '#3B82F6',
        secondaryColor: '#10B981',
        phoneNumber: '01068275557',
        whatsappNumber: '01068275557',
        email: 'info@topmarketing.com',
        address: 'القاهرة، مصر',
        facebookUrl: '',
        instagramUrl: '',
        twitterUrl: '',
        youtubeUrl: '',
        vodafoneCashNumber: '01068275557',
        instapayNumber: '01068275557',
        foripayNumber: '01068275557',
        maintenanceMode: false,
        allowRegistration: true
      })
      alert('تم إعادة تعيين الإعدادات!')
    }
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSettings({...settings, logo: e.target?.result as string})
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Settings className="w-6 h-6 text-blue-600 ml-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">إعدادات النظام</h1>
              <p className="text-gray-600">إدارة إعدادات الموقع والنظام</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleReset}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
            >
              <RefreshCw className="w-4 h-4 ml-2" />
              إعادة تعيين
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
            >
              <Save className="w-4 h-4 ml-2" />
              {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </div>
        </div>
      </div>
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('general')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'general'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                الإعدادات العامة
              </button>
              <button
                onClick={() => setActiveTab('appearance')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'appearance'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                المظهر والألوان
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'contact'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                بيانات التواصل
              </button>
              <button
                onClick={() => setActiveTab('social')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'social'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                وسائل التواصل
              </button>
              <button
                onClick={() => setActiveTab('payment')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'payment'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                طرق الدفع
              </button>
              <button
                onClick={() => setActiveTab('system')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'system'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                إعدادات النظام
              </button>
            </nav>
          </div>
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">الإعدادات العامة</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اسم الموقع</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({...settings, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">وصف الموقع</label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({...settings, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Appearance Settings */}
        {activeTab === 'appearance' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">المظهر والألوان</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">شعار الموقع</label>
                <div className="flex items-center space-x-4">
                  {settings.logo && (
                    <img src={settings.logo} alt="Logo" className="w-16 h-16 object-contain border rounded" />
                  )}
                  <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                    <Upload className="w-4 h-4 ml-2" />
                    رفع شعار
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اللون الأساسي</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اللون الثانوي</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={settings.secondaryColor}
                    onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.secondaryColor}
                    onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Settings */}
        {activeTab === 'contact' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">بيانات التواصل</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                <input
                  type="tel"
                  value={settings.phoneNumber}
                  onChange={(e) => setSettings({...settings, phoneNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رقم الواتساب</label>
                <input
                  type="tel"
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({...settings, whatsappNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Social Media Settings */}
        {activeTab === 'social' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">روابط وسائل التواصل الاجتماعي</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Facebook className="w-5 h-5 text-blue-600" />
                <input
                  type="url"
                  placeholder="رابط صفحة الفيسبوك"
                  value={settings.facebookUrl}
                  onChange={(e) => setSettings({...settings, facebookUrl: e.target.value})}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <Instagram className="w-5 h-5 text-pink-600" />
                <input
                  type="url"
                  placeholder="رابط حساب الانستجرام"
                  value={settings.instagramUrl}
                  onChange={(e) => setSettings({...settings, instagramUrl: e.target.value})}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <Twitter className="w-5 h-5 text-blue-400" />
                <input
                  type="url"
                  placeholder="رابط حساب تويتر"
                  value={settings.twitterUrl}
                  onChange={(e) => setSettings({...settings, twitterUrl: e.target.value})}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <Youtube className="w-5 h-5 text-red-600" />
                <input
                  type="url"
                  placeholder="رابط قناة اليوتيوب"
                  value={settings.youtubeUrl}
                  onChange={(e) => setSettings({...settings, youtubeUrl: e.target.value})}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Payment Settings */}
        {activeTab === 'payment' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">أرقام طرق الدفع</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رقم فودافون كاش</label>
                <input
                  type="tel"
                  value={settings.vodafoneCashNumber}
                  onChange={(e) => setSettings({...settings, vodafoneCashNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رقم إنستاباي</label>
                <input
                  type="tel"
                  value={settings.instapayNumber}
                  onChange={(e) => setSettings({...settings, instapayNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رقم فوري باي</label>
                <input
                  type="tel"
                  value={settings.foripayNumber}
                  onChange={(e) => setSettings({...settings, foripayNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* System Settings */}
        {activeTab === 'system' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">إعدادات النظام</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">وضع الصيانة</h4>
                  <p className="text-sm text-gray-600">تفعيل وضع الصيانة لإخفاء الموقع مؤقتاً</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">السماح بالتسجيل</h4>
                  <p className="text-sm text-gray-600">السماح للزوار الجدد بإنشاء حسابات</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowRegistration}
                    onChange={(e) => setSettings({...settings, allowRegistration: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}
