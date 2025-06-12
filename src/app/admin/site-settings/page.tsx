'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import RouteGuard from '@/components/admin/RouteGuard'
import {
  Settings,
  Save,
  ArrowLeft,
  Globe,
  Palette,
  Phone,
  CreditCard,
  Link as LinkIcon,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon
} from 'lucide-react'
import Link from 'next/link'

interface SiteSettings {
  site_name: string
  site_description: string
  primary_color: string
  secondary_color: string
  phone_number: string
  whatsapp_number: string
  email: string
  facebook_url: string
  instagram_url: string
  twitter_url: string
  youtube_url: string
  vodafone_cash: string
  instapay: string
  fori_pay: string
  announcement_text: string
  announcement_active: boolean
  logo_url: string
  favicon_url: string
}

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: 'Top Marketing',
    site_description: 'شركة التسويق الرقمي الرائدة',
    primary_color: '#dc2626',
    secondary_color: '#1f2937',
    phone_number: '01068275557',
    whatsapp_number: '01068275557',
    email: 'info@topmarketing.com',
    facebook_url: '',
    instagram_url: '',
    twitter_url: '',
    youtube_url: '',
    vodafone_cash: '01068275557',
    instapay: '01068275557',
    fori_pay: '01068275557',
    announcement_text: '',
    announcement_active: false,
    logo_url: '',
    favicon_url: ''
  })

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [message, setMessage] = useState<{
    type: 'success' | 'error' | null
    text: string
  }>({ type: null, text: '' })

  // State للروابط الإضافية وطرق الدفع
  const [additionalLinks, setAdditionalLinks] = useState<any[]>([])
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)

  // State للنماذج المتقدمة
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [showLinkForm, setShowLinkForm] = useState(false)
  const [newPayment, setNewPayment] = useState({
    name: '',
    account_number: '',
    description: '',
    icon: ''
  })
  const [newLink, setNewLink] = useState({
    name: '',
    url: '',
    icon: ''
  })

  // تحميل الإعدادات الحالية
  const loadSettings = async () => {
    try {
      setInitialLoading(true)
      console.log('🔄 Loading settings...')
      const { data: settingsData, error } = await supabase
        .from('system_settings')
        .select('setting_key, setting_value, updated_at')
        .order('setting_key')

      if (error) {
        console.error('❌ Error loading settings:', error)
        setMessage({
          type: 'error',
          text: `خطأ في تحميل الإعدادات: ${error.message}`
        })
        return
      }

      console.log('✅ Settings loaded:', settingsData)

      if (settingsData && settingsData.length > 0) {
        const settingsObj: any = {}
        settingsData.forEach((setting) => {
          // معالجة القيم المنطقية
          let value = setting.setting_value
          if (value === 'true') value = true
          if (value === 'false') value = false

          settingsObj[setting.setting_key] = value
        })

        console.log('📝 Settings object:', settingsObj)
        // استبدال الإعدادات بالكامل بدلاً من الدمج
        setSettings({
          site_name: settingsObj.site_name || 'Top Marketing',
          site_description: settingsObj.site_description || 'شركة التسويق الرقمي الرائدة',
          primary_color: settingsObj.primary_color || '#dc2626',
          secondary_color: settingsObj.secondary_color || '#1f2937',
          phone_number: settingsObj.phone_number || '01068275557',
          whatsapp_number: settingsObj.whatsapp_number || '01068275557',
          email: settingsObj.email || 'info@topmarketing.com',
          facebook_url: settingsObj.facebook_url || '',
          instagram_url: settingsObj.instagram_url || '',
          twitter_url: settingsObj.twitter_url || '',
          youtube_url: settingsObj.youtube_url || '',
          vodafone_cash: settingsObj.vodafone_cash || '01068275557',
          instapay: settingsObj.instapay || '01068275557',
          fori_pay: settingsObj.fori_pay || '01068275557',
          announcement_text: settingsObj.announcement_text || '',
          announcement_active: settingsObj.announcement_active === true || settingsObj.announcement_active === 'true',
          logo_url: settingsObj.logo_url || '',
          favicon_url: settingsObj.favicon_url || ''
        })

        console.log('🔄 Settings state updated with explicit values')
      }
    } catch (error) {
      console.error('❌ Error loading settings:', error)
      setMessage({
        type: 'error',
        text: 'حدث خطأ أثناء تحميل الإعدادات'
      })
    } finally {
      setInitialLoading(false)
    }
  }

  // تحميل الروابط الإضافية
  const loadAdditionalLinks = async () => {
    try {
      console.log('🔄 Loading additional links...')
      const { data, error } = await supabase
        .from('additional_links')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')

      if (error) {
        console.error('❌ Error loading additional links:', error)
        setMessage({
          type: 'error',
          text: `خطأ في تحميل الروابط الإضافية: ${error.message}`
        })
      } else {
        console.log('✅ Additional links loaded:', data)
        setAdditionalLinks(data || [])
      }
    } catch (error) {
      console.error('❌ Error loading additional links:', error)
    }
  }

  // تحميل طرق الدفع
  const loadPaymentMethods = async () => {
    try {
      console.log('🔄 Loading payment methods...')
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')

      if (error) {
        console.error('❌ Error loading payment methods:', error)
        setMessage({
          type: 'error',
          text: `خطأ في تحميل طرق الدفع: ${error.message}`
        })
      } else {
        console.log('✅ Payment methods loaded:', data)
        setPaymentMethods(data || [])
      }
    } catch (error) {
      console.error('❌ Error loading payment methods:', error)
    }
  }

  useEffect(() => {
    loadSettings()
    loadAdditionalLinks()
    loadPaymentMethods()
  }, [])

  // حفظ الإعدادات
  const saveSettings = async () => {
    try {
      setLoading(true)
      setMessage({ type: null, text: '' })

      console.log('💾 Saving settings:', settings)

      // حفظ كل إعداد بشكل منفصل
      let hasError = false
      let savedCount = 0

      for (const [key, value] of Object.entries(settings)) {
        console.log(`💾 Saving setting: ${key} = ${value}`)

        try {
          const { error } = await supabase
            .from('system_settings')
            .update({
              setting_value: value?.toString() || '',
              setting_type: typeof value === 'boolean' ? 'boolean' : 'text',
              updated_at: new Date().toISOString()
            })
            .eq('setting_key', key)

          if (error) {
            console.error(`❌ Error updating ${key}:`, error)
            hasError = true
            setMessage({
              type: 'error',
              text: `خطأ في حفظ ${key}: ${error.message}`
            })
            break
          } else {
            savedCount++
            console.log(`✅ Successfully saved ${key}`)
          }
        } catch (error) {
          console.error(`❌ Error saving ${key}:`, error)
          hasError = true
          setMessage({
            type: 'error',
            text: `خطأ في حفظ ${key}`
          })
          break
        }
      }

      if (!hasError) {
        setMessage({
          type: 'success',
          text: `تم حفظ ${savedCount} إعداد بنجاح!`
        })
        console.log(`✅ All ${savedCount} settings saved successfully`)

        // إعادة تحميل الإعدادات فوراً للتأكد من الحفظ
        console.log('🔄 Reloading settings after save...')
        await loadSettings()

        // فرض إعادة رسم المكونات
        setInitialLoading(true)
        setTimeout(() => {
          setInitialLoading(false)
        }, 500)
      }

    } catch (error) {
      console.error('❌ Error saving settings:', error)
      setMessage({
        type: 'error',
        text: `حدث خطأ أثناء حفظ الإعدادات: ${error}`
      })
    } finally {
      setLoading(false)
    }
  }

  // رفع الشعار
  const uploadLogo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)

      // فحص نوع الملف
      if (!file.type.startsWith('image/')) {
        alert('يرجى اختيار ملف صورة صحيح')
        return
      }

      // فحص حجم الملف (حد أقصى 2 ميجابايت)
      if (file.size > 2 * 1024 * 1024) {
        alert('حجم الملف كبير جداً. الحد الأقصى 2 ميجابايت')
        return
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `logo_${Date.now()}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Error uploading logo:', error)
        alert(`خطأ في رفع الشعار: ${error.message}`)
        return
      }

      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(fileName)

      updateSetting('logo_url', urlData.publicUrl)
      alert('تم رفع الشعار بنجاح!')

    } catch (error) {
      console.error('Error uploading logo:', error)
      alert('حدث خطأ أثناء رفع الشعار')
    } finally {
      setUploading(false)
    }
  }

  // تحديث قيمة إعداد
  const updateSetting = (key: keyof SiteSettings, value: string | boolean) => {
    console.log(`🔄 Updating setting: ${key} = ${value}`)
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // اختبار الحفظ المباشر
  const testDirectSave = async () => {
    try {
      const testValue = `Test Save ${new Date().getTime()}`
      console.log('🧪 Testing direct save with value:', testValue)

      const { error } = await supabase
        .from('system_settings')
        .update({
          setting_value: testValue,
          updated_at: new Date().toISOString()
        })
        .eq('setting_key', 'site_name')

      if (error) {
        console.error('❌ Direct save test failed:', error)
        alert(`فشل الاختبار: ${error.message}`)
      } else {
        console.log('✅ Direct save test successful')
        alert(`نجح الاختبار! القيمة الجديدة: ${testValue}`)
        await loadSettings()
      }
    } catch (error) {
      console.error('❌ Direct save test error:', error)
      alert('خطأ في الاختبار')
    }
  }

  // إضافة رابط جديد
  const addAdditionalLink = async () => {
    if (!newLink.name || !newLink.url) {
      setMessage({
        type: 'error',
        text: 'يرجى ملء جميع الحقول المطلوبة (الاسم والرابط)'
      })
      return
    }

    try {
      console.log('💾 Adding additional link:', newLink)

      const { data, error } = await supabase
        .from('additional_links')
        .insert({
          name: newLink.name.trim(),
          url: newLink.url.trim(),
          icon: newLink.icon.trim() || null,
          sort_order: additionalLinks.length,
          is_active: true
        })
        .select()

      if (error) {
        console.error('❌ Error adding link:', error)
        setMessage({
          type: 'error',
          text: `خطأ في إضافة الرابط: ${error.message}`
        })
      } else {
        console.log('✅ Link added successfully:', data)
        await loadAdditionalLinks()
        setNewLink({ name: '', url: '', icon: '' })
        setShowLinkForm(false)
        setMessage({
          type: 'success',
          text: 'تم إضافة الرابط بنجاح!'
        })
      }
    } catch (error) {
      console.error('❌ Error adding link:', error)
      setMessage({
        type: 'error',
        text: 'حدث خطأ أثناء إضافة الرابط'
      })
    }
  }

  // حذف رابط
  const deleteAdditionalLink = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الرابط؟')) return

    try {
      const { error } = await supabase
        .from('additional_links')
        .delete()
        .eq('id', id)

      if (error) {
        alert(`خطأ في حذف الرابط: ${error.message}`)
      } else {
        loadAdditionalLinks()
        alert('تم حذف الرابط بنجاح!')
      }
    } catch (error) {
      alert('حدث خطأ أثناء حذف الرابط')
    }
  }

  // إضافة طريقة دفع جديدة
  const addPaymentMethod = async () => {
    if (!newPayment.name || !newPayment.account_number) {
      setMessage({
        type: 'error',
        text: 'يرجى ملء جميع الحقول المطلوبة (الاسم ورقم الحساب)'
      })
      return
    }

    try {
      console.log('💾 Adding payment method:', newPayment)

      const { data, error } = await supabase
        .from('payment_methods')
        .insert({
          name: newPayment.name.trim(),
          account_number: newPayment.account_number.trim(),
          description: newPayment.description.trim() || null,
          icon: newPayment.icon.trim() || null,
          sort_order: paymentMethods.length,
          is_active: true
        })
        .select()

      if (error) {
        console.error('❌ Error adding payment method:', error)
        setMessage({
          type: 'error',
          text: `خطأ في إضافة طريقة الدفع: ${error.message}`
        })
      } else {
        console.log('✅ Payment method added successfully:', data)
        await loadPaymentMethods()
        setNewPayment({ name: '', account_number: '', description: '', icon: '' })
        setShowPaymentForm(false)
        setMessage({
          type: 'success',
          text: 'تم إضافة طريقة الدفع بنجاح!'
        })
      }
    } catch (error) {
      console.error('❌ Error adding payment method:', error)
      setMessage({
        type: 'error',
        text: 'حدث خطأ أثناء إضافة طريقة الدفع'
      })
    }
  }

  // حذف طريقة دفع
  const deletePaymentMethod = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف طريقة الدفع هذه؟')) return

    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id)

      if (error) {
        alert(`خطأ في حذف طريقة الدفع: ${error.message}`)
      } else {
        loadPaymentMethods()
        alert('تم حذف طريقة الدفع بنجاح!')
      }
    } catch (error) {
      alert('حدث خطأ أثناء حذف طريقة الدفع')
    }
  }

  return (
    <RouteGuard>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Settings className="w-6 h-6 text-blue-600 ml-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">إعدادات الموقع</h1>
                <p className="text-gray-600">إدارة إعدادات الموقع العامة</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={testDirectSave}
                disabled={loading || initialLoading}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center disabled:opacity-50"
              >
                🧪 اختبار
              </button>

              <button
                onClick={() => {
                  loadSettings()
                  loadAdditionalLinks()
                  loadPaymentMethods()
                }}
                disabled={loading || initialLoading}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4 ml-2" />
                تحديث
              </button>

              <button
                onClick={saveSettings}
                disabled={loading || initialLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
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
        {/* رسائل النجاح/الخطأ */}
        {message.type && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 ml-2" />
            ) : (
              <AlertCircle className="w-5 h-5 ml-2" />
            )}
            {message.text}
          </div>
        )}

        {initialLoading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="mr-3 text-gray-600">جاري تحميل الإعدادات...</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* إعدادات عامة */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Globe className="w-6 h-6 text-blue-600 ml-3" />
              <h2 className="text-xl font-bold text-gray-900">الإعدادات العامة</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الموقع
                </label>
                <input
                  type="text"
                  value={settings.site_name}
                  onChange={(e) => updateSetting('site_name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="اسم الموقع"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف الموقع
                </label>
                <textarea
                  value={settings.site_description}
                  onChange={(e) => updateSetting('site_description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="وصف مختصر للموقع"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => updateSetting('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="info@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  شعار الموقع
                </label>
                <div className="space-y-3">
                  {settings.logo_url && (
                    <div className="flex items-center space-x-3">
                      <img
                        src={settings.logo_url}
                        alt="شعار الموقع"
                        className="w-16 h-16 object-contain border border-gray-300 rounded-lg"
                      />
                      <button
                        onClick={() => updateSetting('logo_url', '')}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        حذف الشعار
                      </button>
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={uploadLogo}
                      disabled={uploading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      اختر ملف صورة (PNG, JPG, GIF) - حد أقصى 2 ميجابايت
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* إعدادات الألوان */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Palette className="w-6 h-6 text-purple-600 ml-3" />
              <h2 className="text-xl font-bold text-gray-900">ألوان الموقع</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اللون الأساسي
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={settings.primary_color}
                    onChange={(e) => updateSetting('primary_color', e.target.value)}
                    className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.primary_color}
                    onChange={(e) => updateSetting('primary_color', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="#dc2626"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اللون الثانوي
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={settings.secondary_color}
                    onChange={(e) => updateSetting('secondary_color', e.target.value)}
                    className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.secondary_color}
                    onChange={(e) => updateSetting('secondary_color', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="#1f2937"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* معلومات الاتصال */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Phone className="w-6 h-6 text-green-600 ml-3" />
              <h2 className="text-xl font-bold text-gray-900">معلومات الاتصال</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  value={settings.phone_number}
                  onChange={(e) => updateSetting('phone_number', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="01068275557"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الواتساب
                </label>
                <input
                  type="tel"
                  value={settings.whatsapp_number}
                  onChange={(e) => updateSetting('whatsapp_number', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="01068275557"
                />
              </div>
            </div>
          </div>

          {/* طرق الدفع */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <CreditCard className="w-6 h-6 text-yellow-600 ml-3" />
                <h2 className="text-xl font-bold text-gray-900">طرق الدفع</h2>
              </div>
              <button
                onClick={() => setShowPaymentForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center"
              >
                <Plus className="w-4 h-4 ml-1" />
                إضافة طريقة دفع
              </button>
            </div>

            <div className="space-y-4">
              {/* طرق الدفع الأساسية */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  فودافون كاش
                </label>
                <input
                  type="tel"
                  value={settings.vodafone_cash}
                  onChange={(e) => updateSetting('vodafone_cash', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="01068275557"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  إنستاباي
                </label>
                <input
                  type="tel"
                  value={settings.instapay}
                  onChange={(e) => updateSetting('instapay', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="01068275557"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  فوري باي
                </label>
                <input
                  type="tel"
                  value={settings.fori_pay}
                  onChange={(e) => updateSetting('fori_pay', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="01068275557"
                />
              </div>

              {/* طرق الدفع الإضافية */}
              {paymentMethods.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    طرق الدفع الإضافية ({paymentMethods.length})
                  </h3>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border">
                        <div className="flex-1">
                          <div className="flex items-center">
                            {method.icon && (
                              <span className="text-lg mr-2">{method.icon}</span>
                            )}
                            <div>
                              <span className="font-medium text-gray-900 block">{method.name}</span>
                              <span className="text-gray-600 text-sm">رقم الحساب: {method.account_number}</span>
                              {method.description && (
                                <span className="text-gray-500 text-xs block">{method.description}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => deletePaymentMethod(method.id)}
                          className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="حذف طريقة الدفع"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* نموذج إضافة طريقة دفع */}
              {showPaymentForm && (
                <div className="border-t pt-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">إضافة طريقة دفع جديدة</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          اسم طريقة الدفع *
                        </label>
                        <input
                          type="text"
                          value={newPayment.name}
                          onChange={(e) => setNewPayment({ ...newPayment, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="مثال: البنك الأهلي"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          رقم الحساب *
                        </label>
                        <input
                          type="text"
                          value={newPayment.account_number}
                          onChange={(e) => setNewPayment({ ...newPayment, account_number: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="مثال: 1234567890123456"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          الأيقونة (اختياري)
                        </label>
                        <input
                          type="text"
                          value={newPayment.icon}
                          onChange={(e) => setNewPayment({ ...newPayment, icon: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="مثال: credit-card"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          الوصف (اختياري)
                        </label>
                        <input
                          type="text"
                          value={newPayment.description}
                          onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="مثال: حساب جاري"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-4">
                      <button
                        onClick={() => {
                          setShowPaymentForm(false)
                          setNewPayment({ name: '', account_number: '', description: '', icon: '' })
                        }}
                        className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        إلغاء
                      </button>
                      <button
                        onClick={addPaymentMethod}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        إضافة
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* روابط التواصل الاجتماعي */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <LinkIcon className="w-6 h-6 text-blue-600 ml-3" />
                <h2 className="text-xl font-bold text-gray-900">روابط التواصل الاجتماعي</h2>
              </div>
              <button
                onClick={() => setShowLinkForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center"
              >
                <Plus className="w-4 h-4 ml-1" />
                إضافة رابط
              </button>
            </div>

            <div className="space-y-4">
              {/* الروابط الأساسية */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  فيسبوك
                </label>
                <input
                  type="url"
                  value={settings.facebook_url}
                  onChange={(e) => updateSetting('facebook_url', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://facebook.com/topmarketing"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  إنستاجرام
                </label>
                <input
                  type="url"
                  value={settings.instagram_url}
                  onChange={(e) => updateSetting('instagram_url', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://instagram.com/topmarketing"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  يوتيوب
                </label>
                <input
                  type="url"
                  value={settings.youtube_url}
                  onChange={(e) => updateSetting('youtube_url', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://youtube.com/topmarketing"
                />
              </div>

              {/* الروابط الإضافية */}
              {additionalLinks.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    روابط إضافية ({additionalLinks.length})
                  </h3>
                  <div className="space-y-3">
                    {additionalLinks.map((link) => (
                      <div key={link.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border">
                        <div className="flex-1">
                          <div className="flex items-center">
                            {link.icon && (
                              <span className="text-lg mr-2">{link.icon}</span>
                            )}
                            <div>
                              <span className="font-medium text-gray-900 block">{link.name}</span>
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 text-sm break-all"
                              >
                                {link.url}
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                            title="فتح الرابط"
                          >
                            <LinkIcon className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => deleteAdditionalLink(link.id)}
                            className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title="حذف الرابط"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* نموذج إضافة رابط */}
              {showLinkForm && (
                <div className="border-t pt-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">إضافة رابط جديد</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          اسم الرابط *
                        </label>
                        <input
                          type="text"
                          value={newLink.name}
                          onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="مثال: تيك توك"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          الرابط *
                        </label>
                        <input
                          type="url"
                          value={newLink.url}
                          onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://tiktok.com/@topmarketing"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          الأيقونة (اختياري)
                        </label>
                        <input
                          type="text"
                          value={newLink.icon}
                          onChange={(e) => setNewLink({ ...newLink, icon: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="مثال: link"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-4">
                      <button
                        onClick={() => {
                          setShowLinkForm(false)
                          setNewLink({ name: '', url: '', icon: '' })
                        }}
                        className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        إلغاء
                      </button>
                      <button
                        onClick={addAdditionalLink}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        إضافة
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* إعلان الموقع */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <AlertCircle className="w-6 h-6 text-orange-600 ml-3" />
              <h2 className="text-xl font-bold text-gray-900">إعلان الموقع</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  تفعيل الإعلان
                </label>
                <button
                  onClick={() => updateSetting('announcement_active', !settings.announcement_active)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.announcement_active ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.announcement_active ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نص الإعلان
                </label>
                <textarea
                  value={settings.announcement_text}
                  onChange={(e) => updateSetting('announcement_text', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="اكتب نص الإعلان هنا..."
                />
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </RouteGuard>
  )
}
