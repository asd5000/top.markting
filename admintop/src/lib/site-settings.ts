import { supabase } from './supabase'

export interface SiteSettings {
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

// Cache للإعدادات
let settingsCache: SiteSettings | null = null
let lastFetch = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 دقائق

// الإعدادات الافتراضية
const defaultSettings: SiteSettings = {
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
}

// جلب إعدادات الموقع
export async function getSiteSettings(): Promise<SiteSettings> {
  const now = Date.now()
  
  // استخدام Cache إذا كان متاحاً وحديثاً
  if (settingsCache && (now - lastFetch) < CACHE_DURATION) {
    return settingsCache
  }

  try {
    console.log('🔄 Fetching site settings from database...')
    
    const { data: settingsData, error } = await supabase
      .from('system_settings')
      .select('setting_key, setting_value')
      .order('setting_key')

    if (error) {
      console.error('❌ Error fetching site settings:', error)
      return defaultSettings
    }

    if (!settingsData || settingsData.length === 0) {
      console.log('⚠️ No settings found, using defaults')
      return defaultSettings
    }

    // تحويل البيانات إلى كائن
    const settings: any = { ...defaultSettings }
    
    settingsData.forEach((setting) => {
      let value = setting.setting_value
      
      // معالجة القيم المنطقية
      if (value === 'true') value = true
      if (value === 'false') value = false
      
      settings[setting.setting_key] = value
    })

    // تحديث Cache
    settingsCache = settings
    lastFetch = now
    
    console.log('✅ Site settings loaded successfully')
    return settings

  } catch (error) {
    console.error('❌ Error loading site settings:', error)
    return defaultSettings
  }
}

// مسح Cache (للاستخدام بعد تحديث الإعدادات)
export function clearSettingsCache() {
  settingsCache = null
  lastFetch = 0
  console.log('🗑️ Settings cache cleared')
}

// جلب إعداد واحد
export async function getSetting(key: keyof SiteSettings): Promise<string | boolean> {
  const settings = await getSiteSettings()
  return settings[key]
}

// تنسيق رقم الهاتف للواتساب
export function formatWhatsAppNumber(phoneNumber: string): string {
  // إزالة جميع الرموز غير الرقمية
  let cleaned = phoneNumber.replace(/\D/g, '')
  
  // إضافة كود مصر إذا لم يكن موجوداً
  if (cleaned.startsWith('01')) {
    cleaned = '2' + cleaned
  } else if (!cleaned.startsWith('201')) {
    cleaned = '201' + cleaned
  }
  
  return cleaned
}

// إنشاء رابط واتساب
export async function getWhatsAppLink(message?: string): Promise<string> {
  const settings = await getSiteSettings()
  const formattedNumber = formatWhatsAppNumber(settings.whatsapp_number)
  const encodedMessage = message ? encodeURIComponent(message) : ''
  
  return `https://wa.me/${formattedNumber}${encodedMessage ? `?text=${encodedMessage}` : ''}`
}

// إنشاء رابط الاتصال
export async function getPhoneLink(): Promise<string> {
  const settings = await getSiteSettings()
  return `tel:${settings.phone_number}`
}

// إنشاء رابط البريد الإلكتروني
export async function getEmailLink(subject?: string): Promise<string> {
  const settings = await getSiteSettings()
  const encodedSubject = subject ? encodeURIComponent(subject) : ''
  
  return `mailto:${settings.email}${encodedSubject ? `?subject=${encodedSubject}` : ''}`
}
