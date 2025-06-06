'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  Save, 
  Phone, 
  Mail, 
  Globe, 
  DollarSign,
  MessageCircle,
  Bell,
  Shield,
  Palette,
  Database,
  Upload
} from 'lucide-react'
import { useAuth, usePermissions } from '@/lib/auth/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { adminOperations } from '@/lib/supabase/client'
import { toast } from 'react-hot-toast'

interface SiteSettings {
  siteName: string
  contactPhone: string
  contactEmail: string
  whatsappNumber: string
  siteDescription: string
  siteKeywords: string
  maintenanceMode: boolean
  allowRegistration: boolean
  emailNotifications: boolean
  smsNotifications: boolean
  paymentMethods: {
    vodafoneCash: {
      enabled: boolean
      number: string
    }
    instaPay: {
      enabled: boolean
    }
    fawry: {
      enabled: boolean
    }
    whatsapp: {
      enabled: boolean
      number: string
    }
  }
  socialMedia: {
    facebook: string
    instagram: string
    twitter: string
    linkedin: string
    youtube: string
  }
  seoSettings: {
    metaTitle: string
    metaDescription: string
    metaKeywords: string
    googleAnalytics: string
    facebookPixel: string
  }
}

export default function AdminSettingsPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { isAdmin } = usePermissions()
  const router = useRouter()
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'توب ماركتنج',
    contactPhone: '+201068275557',
    contactEmail: 'info@topmarketing.com',
    whatsappNumber: '+201068275557',
    siteDescription: 'منصة توب ماركتنج للخدمات التسويقية والوساطة العقارية',
    siteKeywords: 'تسويق, تصميم, عقارات, خدمات',
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
    smsNotifications: false,
    paymentMethods: {
      vodafoneCash: {
        enabled: true,
        number: '01068275557'
      },
      instaPay: {
        enabled: true
      },
      fawry: {
        enabled: true
      },
      whatsapp: {
        enabled: true,
        number: '+201068275557'
      }
    },
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
      youtube: ''
    },
    seoSettings: {
      metaTitle: 'توب ماركتنج - خدمات التسويق والوساطة العقارية',
      metaDescription: 'منصة توب ماركتنج تقدم خدمات التسويق الرقمي والتصميم والوساطة العقارية',
      metaKeywords: 'تسويق رقمي, تصميم, عقارات, خدمات تسويقية',
      googleAnalytics: '',
      facebookPixel: ''
    }
  })
  const [isLoadingSettings, setIsLoadingSettings] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin())) {
      router.push('/auth/login')
      return
    }
  }, [user, isAuthenticated, isLoading, isAdmin, router])

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true)

      // Simulate saving to database
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Save to localStorage for persistence
      localStorage.setItem('topmarketing_settings', JSON.stringify(settings))

      toast.success('تم حفظ الإعدادات بنجاح')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('خطأ في حفظ الإعدادات')
    } finally {
      setIsSaving(false)
    }
  }

  const exportSettings = () => {
    const settingsData = JSON.stringify(settings, null, 2)
    const blob = new Blob([settingsData], { type: 'application/json' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `system_settings_${new Date().toISOString().split('T')[0]}.json`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success('تم تصدير الإعدادات بنجاح')
  }

  const handleInputChange = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof SiteSettings] as any),
        [field]: value
      }
    }))
  }

  const handleDirectChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const tabs = [
    { id: 'general', name: 'عام', icon: Settings },
    { id: 'contact', name: 'التواصل', icon: Phone },
    { id: 'payment', name: 'الدفع', icon: DollarSign },
    { id: 'social', name: 'التواصل الاجتماعي', icon: MessageCircle },
    { id: 'seo', name: 'SEO', icon: Globe },
    { id: 'notifications', name: 'الإشعارات', icon: Bell }
  ]

  if (isLoading || isLoadingSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل الإعدادات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-800 ml-4">
                ← العودة للوحة التحكم
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">إعدادات النظام</h1>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                onClick={exportSettings}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Upload className="w-4 h-4 ml-2" />
                تصدير
              </button>
              <button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="spinner ml-2" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 ml-2" />
                    حفظ الإعدادات
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-right rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-5 h-5 ml-3" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </motion.div>
          </div>

          {/* Content */}
          <div className="lg:w-3/4">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">الإعدادات العامة</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label">اسم الموقع</label>
                      <input
                        type="text"
                        value={settings.siteName}
                        onChange={(e) => handleDirectChange('siteName', e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label className="form-label">وصف الموقع</label>
                      <textarea
                        value={settings.siteDescription}
                        onChange={(e) => handleDirectChange('siteDescription', e.target.value)}
                        className="form-input"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="form-label">الكلمات المفتاحية</label>
                      <input
                        type="text"
                        value={settings.siteKeywords}
                        onChange={(e) => handleDirectChange('siteKeywords', e.target.value)}
                        className="form-input"
                        placeholder="كلمة1, كلمة2, كلمة3"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.maintenanceMode}
                        onChange={(e) => handleDirectChange('maintenanceMode', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 ml-2"
                      />
                      <span className="text-gray-700">وضع الصيانة</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.allowRegistration}
                        onChange={(e) => handleDirectChange('allowRegistration', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 ml-2"
                      />
                      <span className="text-gray-700">السماح بالتسجيل الجديد</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Contact Settings */}
              {activeTab === 'contact' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">معلومات التواصل</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label">رقم الهاتف الرئيسي</label>
                      <input
                        type="tel"
                        value={settings.contactPhone}
                        onChange={(e) => handleDirectChange('contactPhone', e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label className="form-label">البريد الإلكتروني</label>
                      <input
                        type="email"
                        value={settings.contactEmail}
                        onChange={(e) => handleDirectChange('contactEmail', e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label className="form-label">رقم واتساب</label>
                      <input
                        type="tel"
                        value={settings.whatsappNumber}
                        onChange={(e) => handleDirectChange('whatsappNumber', e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Settings */}
              {activeTab === 'payment' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">إعدادات الدفع</h2>
                  
                  <div className="space-y-6">
                    {/* Vodafone Cash */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">فودافون كاش</h3>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.paymentMethods.vodafoneCash.enabled}
                            onChange={(e) => handleInputChange('paymentMethods', 'vodafoneCash', {
                              ...settings.paymentMethods.vodafoneCash,
                              enabled: e.target.checked
                            })}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 ml-2"
                          />
                          <span>مفعل</span>
                        </label>
                      </div>
                      {settings.paymentMethods.vodafoneCash.enabled && (
                        <div>
                          <label className="form-label">رقم فودافون كاش</label>
                          <input
                            type="tel"
                            value={settings.paymentMethods.vodafoneCash.number}
                            onChange={(e) => handleInputChange('paymentMethods', 'vodafoneCash', {
                              ...settings.paymentMethods.vodafoneCash,
                              number: e.target.value
                            })}
                            className="form-input"
                          />
                        </div>
                      )}
                    </div>

                    {/* InstaPay */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">إنستا باي</h3>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.paymentMethods.instaPay.enabled}
                            onChange={(e) => handleInputChange('paymentMethods', 'instaPay', {
                              enabled: e.target.checked
                            })}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 ml-2"
                          />
                          <span>مفعل</span>
                        </label>
                      </div>
                    </div>

                    {/* Fawry */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">فوري</h3>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.paymentMethods.fawry.enabled}
                            onChange={(e) => handleInputChange('paymentMethods', 'fawry', {
                              enabled: e.target.checked
                            })}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 ml-2"
                          />
                          <span>مفعل</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Social Media Settings */}
              {activeTab === 'social' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">وسائل التواصل الاجتماعي</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label">فيسبوك</label>
                      <input
                        type="url"
                        value={settings.socialMedia.facebook}
                        onChange={(e) => handleInputChange('socialMedia', 'facebook', e.target.value)}
                        className="form-input"
                        placeholder="https://facebook.com/yourpage"
                      />
                    </div>

                    <div>
                      <label className="form-label">إنستجرام</label>
                      <input
                        type="url"
                        value={settings.socialMedia.instagram}
                        onChange={(e) => handleInputChange('socialMedia', 'instagram', e.target.value)}
                        className="form-input"
                        placeholder="https://instagram.com/yourpage"
                      />
                    </div>

                    <div>
                      <label className="form-label">تويتر</label>
                      <input
                        type="url"
                        value={settings.socialMedia.twitter}
                        onChange={(e) => handleInputChange('socialMedia', 'twitter', e.target.value)}
                        className="form-input"
                        placeholder="https://twitter.com/yourpage"
                      />
                    </div>

                    <div>
                      <label className="form-label">لينكد إن</label>
                      <input
                        type="url"
                        value={settings.socialMedia.linkedin}
                        onChange={(e) => handleInputChange('socialMedia', 'linkedin', e.target.value)}
                        className="form-input"
                        placeholder="https://linkedin.com/company/yourpage"
                      />
                    </div>

                    <div>
                      <label className="form-label">يوتيوب</label>
                      <input
                        type="url"
                        value={settings.socialMedia.youtube}
                        onChange={(e) => handleInputChange('socialMedia', 'youtube', e.target.value)}
                        className="form-input"
                        placeholder="https://youtube.com/channel/yourchannel"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SEO Settings */}
              {activeTab === 'seo' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">إعدادات SEO</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="form-label">عنوان الصفحة (Meta Title)</label>
                      <input
                        type="text"
                        value={settings.seoSettings.metaTitle}
                        onChange={(e) => handleInputChange('seoSettings', 'metaTitle', e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label className="form-label">وصف الصفحة (Meta Description)</label>
                      <textarea
                        value={settings.seoSettings.metaDescription}
                        onChange={(e) => handleInputChange('seoSettings', 'metaDescription', e.target.value)}
                        className="form-input"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="form-label">الكلمات المفتاحية (Meta Keywords)</label>
                      <input
                        type="text"
                        value={settings.seoSettings.metaKeywords}
                        onChange={(e) => handleInputChange('seoSettings', 'metaKeywords', e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label className="form-label">Google Analytics ID</label>
                      <input
                        type="text"
                        value={settings.seoSettings.googleAnalytics}
                        onChange={(e) => handleInputChange('seoSettings', 'googleAnalytics', e.target.value)}
                        className="form-input"
                        placeholder="GA-XXXXXXXXX-X"
                      />
                    </div>

                    <div>
                      <label className="form-label">Facebook Pixel ID</label>
                      <input
                        type="text"
                        value={settings.seoSettings.facebookPixel}
                        onChange={(e) => handleInputChange('seoSettings', 'facebookPixel', e.target.value)}
                        className="form-input"
                        placeholder="123456789012345"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">إعدادات الإشعارات</h2>
                  
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => handleDirectChange('emailNotifications', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 ml-2"
                      />
                      <span className="text-gray-700">إشعارات البريد الإلكتروني</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.smsNotifications}
                        onChange={(e) => handleDirectChange('smsNotifications', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 ml-2"
                      />
                      <span className="text-gray-700">إشعارات الرسائل النصية</span>
                    </label>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
