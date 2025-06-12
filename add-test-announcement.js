const { createClient } = require('@supabase/supabase-js')

// إعدادات Supabase
const supabaseUrl = 'https://xmufnqzvxuowmvugmcpr.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdWZucXp2eHVvd212dWdtY3ByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MzcxNTAsImV4cCI6MjA2NTExMzE1MH0.WZPhXpGdbBWzBJfPm9z2ZdZhQpmgMbJwPR2fpryHUqw'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function addTestAnnouncement() {
  console.log('🚀 إضافة إعلان تجريبي...')
  
  try {
    // تحديث نص الإعلان وتفعيله
    const { error: announcementError } = await supabase
      .from('system_settings')
      .update({
        setting_value: '🎉 مرحباً بكم في Top Marketing - خصم 20% على جميع الخدمات لفترة محدودة! 🎉',
        updated_at: new Date().toISOString()
      })
      .eq('setting_key', 'announcement_text')

    if (announcementError) {
      console.error('❌ خطأ في تحديث نص الإعلان:', announcementError.message)
      return
    }

    // تفعيل الإعلان
    const { error: activeError } = await supabase
      .from('system_settings')
      .update({
        setting_value: 'true',
        updated_at: new Date().toISOString()
      })
      .eq('setting_key', 'announcement_active')

    if (activeError) {
      console.error('❌ خطأ في تفعيل الإعلان:', activeError.message)
      return
    }

    console.log('✅ تم إضافة الإعلان التجريبي بنجاح!')
    console.log('📢 النص: 🎉 مرحباً بكم في Top Marketing - خصم 20% على جميع الخدمات لفترة محدودة! 🎉')
    console.log('🔛 الحالة: مفعل')
    console.log('🌐 يمكنك رؤية الإعلان في أعلى الموقع الآن')

  } catch (error) {
    console.error('❌ خطأ عام:', error.message)
  }
}

// تشغيل الدالة
addTestAnnouncement()
  .then(() => {
    console.log('\n✨ انتهت العملية')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 خطأ في تشغيل السكريبت:', error)
    process.exit(1)
  })
