const { createClient } = require('@supabase/supabase-js')

// إعدادات Supabase
const supabaseUrl = 'https://xmufnqzvxuowmvugmcpr.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdWZucXp2eHVvd212dWdtY3ByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MzcxNTAsImV4cCI6MjA2NTExMzE1MH0.WZPhXpGdbBWzBJfPm9z2ZdZhQpmgMbJwPR2fpryHUqw'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// الإعدادات الجديدة
const siteSettings = [
  { setting_key: 'site_name', setting_value: 'Top Marketing', setting_type: 'text', description: 'اسم الموقع' },
  { setting_key: 'site_description', setting_value: 'شركة التسويق الرقمي الرائدة', setting_type: 'text', description: 'وصف الموقع' },
  { setting_key: 'primary_color', setting_value: '#dc2626', setting_type: 'text', description: 'اللون الأساسي للموقع' },
  { setting_key: 'secondary_color', setting_value: '#1f2937', setting_type: 'text', description: 'اللون الثانوي للموقع' },
  { setting_key: 'phone_number', setting_value: '01068275557', setting_type: 'text', description: 'رقم الهاتف' },
  { setting_key: 'whatsapp_number', setting_value: '01068275557', setting_type: 'text', description: 'رقم الواتساب' },
  { setting_key: 'email', setting_value: 'info@topmarketing.com', setting_type: 'text', description: 'البريد الإلكتروني' },
  { setting_key: 'facebook_url', setting_value: '', setting_type: 'text', description: 'رابط فيسبوك' },
  { setting_key: 'instagram_url', setting_value: '', setting_type: 'text', description: 'رابط إنستاجرام' },
  { setting_key: 'twitter_url', setting_value: '', setting_type: 'text', description: 'رابط تويتر' },
  { setting_key: 'youtube_url', setting_value: '', setting_type: 'text', description: 'رابط يوتيوب' },
  { setting_key: 'vodafone_cash', setting_value: '01068275557', setting_type: 'text', description: 'رقم فودافون كاش' },
  { setting_key: 'instapay', setting_value: '01068275557', setting_type: 'text', description: 'رقم إنستاباي' },
  { setting_key: 'fori_pay', setting_value: '01068275557', setting_type: 'text', description: 'رقم فوري باي' },
  { setting_key: 'announcement_text', setting_value: '', setting_type: 'text', description: 'نص الإعلان' },
  { setting_key: 'announcement_active', setting_value: 'false', setting_type: 'boolean', description: 'تفعيل الإعلان' },
  { setting_key: 'logo_url', setting_value: '', setting_type: 'text', description: 'رابط شعار الموقع' },
  { setting_key: 'favicon_url', setting_value: '', setting_type: 'text', description: 'رابط أيقونة الموقع' }
]

async function updateSiteSettings() {
  console.log('🚀 بدء تحديث إعدادات الموقع...')
  
  try {
    // حذف الإعدادات القديمة
    console.log('🗑️ حذف الإعدادات القديمة...')
    const { error: deleteError } = await supabase
      .from('system_settings')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // حذف جميع السجلات

    if (deleteError) {
      console.log('⚠️ تحذير عند حذف الإعدادات القديمة:', deleteError.message)
    }

    // إضافة الإعدادات الجديدة
    console.log('📝 إضافة الإعدادات الجديدة...')
    const { data, error } = await supabase
      .from('system_settings')
      .insert(siteSettings)
      .select()

    if (error) {
      console.error('❌ خطأ في إضافة الإعدادات:', error.message)
      return
    }

    console.log('✅ تم تحديث إعدادات الموقع بنجاح!')
    console.log(`📊 تم إضافة ${data.length} إعداد`)

    // عرض الإعدادات المضافة
    console.log('\n📋 الإعدادات المضافة:')
    data.forEach(setting => {
      console.log(`   ${setting.setting_key}: ${setting.setting_value}`)
    })

    // التحقق من الإعدادات
    console.log('\n🔍 التحقق من الإعدادات...')
    const { data: verifyData, error: verifyError } = await supabase
      .from('system_settings')
      .select('setting_key, setting_value')
      .order('setting_key')

    if (verifyError) {
      console.error('❌ خطأ في التحقق:', verifyError.message)
      return
    }

    console.log(`✅ تم التحقق من ${verifyData.length} إعداد في قاعدة البيانات`)

    console.log('\n🎉 تم تحديث إعدادات الموقع بنجاح!')
    console.log('🌐 يمكنك الآن رؤية التغييرات في الموقع')

  } catch (error) {
    console.error('❌ خطأ عام:', error.message)
  }
}

// تشغيل الدالة
updateSiteSettings()
  .then(() => {
    console.log('\n✨ انتهت العملية')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 خطأ في تشغيل السكريبت:', error)
    process.exit(1)
  })
