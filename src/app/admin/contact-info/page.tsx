'use client'

import { useState, useEffect } from 'react'
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Save, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Globe,
  Building,
  Clock,
  Users
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ContactInfo {
  phone_number: string
  whatsapp_number: string
  email: string
  address: string
  city: string
  country: string
  working_hours: string
  support_hours: string
  emergency_phone: string
  business_phone: string
  fax_number: string
  postal_code: string
}

export default function ContactInfoPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phone_number: '01068275557',
    whatsapp_number: '01068275557',
    email: 'info@topmarketing.com',
    address: 'شارع التحرير، وسط البلد',
    city: 'القاهرة',
    country: 'مصر',
    working_hours: 'السبت - الخميس: 9:00 ص - 6:00 م',
    support_hours: '24/7 دعم فني',
    emergency_phone: '01068275557',
    business_phone: '01068275557',
    fax_number: '',
    postal_code: '11511'
  })

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [message, setMessage] = useState<{
    type: 'success' | 'error' | null
    text: string
  }>({ type: null, text: '' })

  useEffect(() => {
    loadContactInfo()
  }, [])

  const loadContactInfo = async () => {
    try {
      setInitialLoading(true)
      console.log('🔄 Loading contact info...')

      // التحقق من المصادقة أولاً
      const adminData = localStorage.getItem('admin') || localStorage.getItem('adminSession')
      if (!adminData) {
        console.log('❌ No admin session found')
        setMessage({
          type: 'error',
          text: 'يجب تسجيل الدخول كمدير للوصول لهذه الصفحة'
        })
        setInitialLoading(false)
        return
      }

      console.log('👤 Admin session found, loading data...')

      const { data: settingsData, error } = await supabase
        .from('system_settings')
        .select('setting_key, setting_value')
        .in('setting_key', [
          'phone_number', 'whatsapp_number', 'email', 'address',
          'city', 'country', 'working_hours', 'support_hours',
          'emergency_phone', 'business_phone', 'fax_number', 'postal_code'
        ])

      console.log('📊 Supabase response:', { data: settingsData, error })

      if (error) {
        console.error('❌ Error loading contact info:', error)
        setMessage({
          type: 'error',
          text: `خطأ في تحميل معلومات الاتصال: ${error.message}`
        })
        return
      }

      if (settingsData && settingsData.length > 0) {
        const settingsObj: any = { ...contactInfo }
        settingsData.forEach((setting) => {
          settingsObj[setting.setting_key] = setting.setting_value || ''
        })
        setContactInfo(settingsObj)
        console.log('✅ Contact info loaded:', settingsObj)
        setMessage({
          type: 'success',
          text: `تم تحميل ${settingsData.length} معلومة اتصال بنجاح`
        })
      } else {
        console.log('⚠️ No contact info found in database')
        setMessage({
          type: 'error',
          text: 'لم يتم العثور على معلومات اتصال في قاعدة البيانات'
        })
      }

    } catch (error) {
      console.error('❌ Error loading contact info:', error)
      setMessage({
        type: 'error',
        text: `حدث خطأ أثناء تحميل معلومات الاتصال: ${error}`
      })
    } finally {
      setInitialLoading(false)
    }
  }

  const saveContactInfo = async () => {
    try {
      setLoading(true)
      setMessage({ type: null, text: '' })

      // التحقق من المصادقة أولاً
      const adminData = localStorage.getItem('admin') || localStorage.getItem('adminSession')
      if (!adminData) {
        setMessage({
          type: 'error',
          text: 'يجب تسجيل الدخول كمدير لحفظ التغييرات'
        })
        setLoading(false)
        return
      }

      console.log('💾 Saving contact info:', contactInfo)

      let hasError = false
      let savedCount = 0

      // حفظ كل معلومة بشكل منفصل
      for (const [key, value] of Object.entries(contactInfo)) {
        console.log(`💾 Saving: ${key} = ${value}`)

        try {
          // محاولة التحديث أولاً
          const { data: updateData, error: updateError } = await supabase
            .from('system_settings')
            .update({
              setting_value: value?.toString() || '',
              setting_type: 'text',
              updated_at: new Date().toISOString()
            })
            .eq('setting_key', key)
            .select()

          console.log(`📊 Update result for ${key}:`, { data: updateData, error: updateError })

          // إذا لم يتم العثور على السجل، أنشئه
          if (updateError || !updateData || updateData.length === 0) {
            console.log(`📝 Creating new setting: ${key}`)

            const { data: insertData, error: insertError } = await supabase
              .from('system_settings')
              .insert({
                setting_key: key,
                setting_value: value?.toString() || '',
                setting_type: 'text',
                description: getSettingDescription(key),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .select()

            console.log(`📊 Insert result for ${key}:`, { data: insertData, error: insertError })

            if (insertError) {
              console.error(`❌ Error creating ${key}:`, insertError)
              hasError = true
              setMessage({
                type: 'error',
                text: `خطأ في إنشاء ${key}: ${insertError.message}`
              })
              break
            }
          }

          savedCount++
          console.log(`✅ Successfully saved ${key}`)

        } catch (error) {
          console.error(`❌ Error saving ${key}:`, error)
          hasError = true
          setMessage({
            type: 'error',
            text: `خطأ في حفظ ${key}: ${error}`
          })
          break
        }
      }

      if (!hasError) {
        setMessage({
          type: 'success',
          text: `تم حفظ ${savedCount} معلومة اتصال بنجاح! 🎉`
        })
        console.log(`✅ All ${savedCount} contact info saved successfully`)

        // إعادة تحميل البيانات للتأكد
        setTimeout(() => {
          loadContactInfo()
        }, 2000)
      }

    } catch (error) {
      console.error('❌ Error saving contact info:', error)
      setMessage({
        type: 'error',
        text: `حدث خطأ أثناء حفظ معلومات الاتصال: ${error}`
      })
    } finally {
      setLoading(false)
    }
  }

  const getSettingDescription = (key: string): string => {
    const descriptions: { [key: string]: string } = {
      phone_number: 'رقم الهاتف الرئيسي',
      whatsapp_number: 'رقم الواتساب',
      email: 'البريد الإلكتروني',
      address: 'العنوان',
      city: 'المدينة',
      country: 'البلد',
      working_hours: 'ساعات العمل',
      support_hours: 'ساعات الدعم الفني',
      emergency_phone: 'رقم الطوارئ',
      business_phone: 'رقم العمل',
      fax_number: 'رقم الفاكس',
      postal_code: 'الرمز البريدي'
    }
    return descriptions[key] || key
  }

  const updateContactInfo = (key: keyof ContactInfo, value: string) => {
    setContactInfo(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const formatPhoneNumber = (phone: string) => {
    // تنسيق رقم الهاتف للعرض
    return phone.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3')
  }

  const testDatabaseConnection = async () => {
    try {
      setMessage({ type: null, text: '' })
      console.log('🔍 Testing database connection...')

      const { data, error } = await supabase
        .from('system_settings')
        .select('count(*)')
        .limit(1)

      if (error) {
        console.error('❌ Database connection failed:', error)
        setMessage({
          type: 'error',
          text: `فشل الاتصال بقاعدة البيانات: ${error.message}`
        })
      } else {
        console.log('✅ Database connection successful:', data)
        setMessage({
          type: 'success',
          text: 'تم الاتصال بقاعدة البيانات بنجاح! ✅'
        })
      }
    } catch (error) {
      console.error('❌ Database test error:', error)
      setMessage({
        type: 'error',
        text: `خطأ في اختبار قاعدة البيانات: ${error}`
      })
    }
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل معلومات الاتصال...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Phone className="w-6 h-6 text-blue-600 ml-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">معلومات الاتصال</h1>
              <p className="text-gray-600">إدارة معلومات التواصل والاتصال بالشركة</p>
            </div>
          </div>

          <div className="flex space-x-3 space-x-reverse">
            <button
              onClick={testDatabaseConnection}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4 ml-2" />
              اختبار الاتصال
            </button>

            <button
              onClick={loadContactInfo}
              disabled={loading}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4 ml-2" />
              تحديث
            </button>

            <button
              onClick={saveContactInfo}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
              ) : (
                <Save className="w-4 h-4 ml-2" />
              )}
              {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </div>
        </div>
      </div>

      {/* Status Message */}
      {message.type && (
        <div className={`rounded-lg p-4 ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 ml-2" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 ml-2" />
            )}
            <span className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.text}
            </span>
          </div>
        </div>
      )}

      {/* Contact Information Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Primary Contact Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Phone className="w-5 h-5 ml-2" />
            معلومات الاتصال الأساسية
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رقم الهاتف الرئيسي
              </label>
              <input
                type="tel"
                value={contactInfo.phone_number}
                onChange={(e) => updateContactInfo('phone_number', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="01068275557"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رقم الواتساب
              </label>
              <input
                type="tel"
                value={contactInfo.whatsapp_number}
                onChange={(e) => updateContactInfo('whatsapp_number', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="01068275557"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={contactInfo.email}
                onChange={(e) => updateContactInfo('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="info@topmarketing.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رقم الطوارئ
              </label>
              <input
                type="tel"
                value={contactInfo.emergency_phone}
                onChange={(e) => updateContactInfo('emergency_phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="01068275557"
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 ml-2" />
            معلومات العنوان
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                العنوان
              </label>
              <input
                type="text"
                value={contactInfo.address}
                onChange={(e) => updateContactInfo('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="شارع التحرير، وسط البلد"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                المدينة
              </label>
              <input
                type="text"
                value={contactInfo.city}
                onChange={(e) => updateContactInfo('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="القاهرة"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                البلد
              </label>
              <input
                type="text"
                value={contactInfo.country}
                onChange={(e) => updateContactInfo('country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="مصر"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الرمز البريدي
              </label>
              <input
                type="text"
                value={contactInfo.postal_code}
                onChange={(e) => updateContactInfo('postal_code', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="11511"
              />
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Building className="w-5 h-5 ml-2" />
            معلومات العمل
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ساعات العمل
              </label>
              <input
                type="text"
                value={contactInfo.working_hours}
                onChange={(e) => updateContactInfo('working_hours', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="السبت - الخميس: 9:00 ص - 6:00 م"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ساعات الدعم الفني
              </label>
              <input
                type="text"
                value={contactInfo.support_hours}
                onChange={(e) => updateContactInfo('support_hours', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="24/7 دعم فني"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رقم العمل
              </label>
              <input
                type="tel"
                value={contactInfo.business_phone}
                onChange={(e) => updateContactInfo('business_phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="01068275557"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رقم الفاكس (اختياري)
              </label>
              <input
                type="tel"
                value={contactInfo.fax_number}
                onChange={(e) => updateContactInfo('fax_number', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="02-12345678"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Globe className="w-5 h-5 ml-2" />
            معاينة كيف ستظهر في الموقع
          </h2>

          <div className="bg-gray-800 text-white p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-4 text-center">تواصل معنا</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <Mail className="w-4 h-4 ml-2 flex-shrink-0" />
                <span>{contactInfo.email}</span>
              </div>

              <div className="flex items-center">
                <Phone className="w-4 h-4 ml-2 flex-shrink-0" />
                <span>{formatPhoneNumber(contactInfo.phone_number)}</span>
              </div>

              <div className="flex items-center">
                <MessageCircle className="w-4 h-4 ml-2 flex-shrink-0" />
                <span>واتساب: {formatPhoneNumber(contactInfo.whatsapp_number)}</span>
              </div>

              <div className="flex items-center">
                <MapPin className="w-4 h-4 ml-2 flex-shrink-0" />
                <span>{contactInfo.city}, {contactInfo.country}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-600">
              <h4 className="text-sm font-medium mb-2">تابعنا على</h4>
              <div className="text-xs text-gray-400">
                <p>ساعات العمل: {contactInfo.working_hours}</p>
                <p>الدعم الفني: {contactInfo.support_hours}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
