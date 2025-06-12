const { createClient } = require('@supabase/supabase-js')

// إعدادات Supabase
const supabaseUrl = 'https://xmufnqzvxuowmvugmcpr.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdWZucXp2eHVvd212dWdtY3ByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MzcxNTAsImV4cCI6MjA2NTExMzE1MH0.WZPhXpGdbBWzBJfPm9z2ZdZhQpmgMbJwPR2fpryHUqw'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// معلومات الاتصال الإضافية
const additionalContactInfo = [
  { setting_key: 'address', setting_value: 'شارع التحرير، وسط البلد', setting_type: 'text', description: 'العنوان' },
  { setting_key: 'city', setting_value: 'القاهرة', setting_type: 'text', description: 'المدينة' },
  { setting_key: 'country', setting_value: 'مصر', setting_type: 'text', description: 'البلد' },
  { setting_key: 'working_hours', setting_value: 'السبت - الخميس: 9:00 ص - 6:00 م', setting_type: 'text', description: 'ساعات العمل' },
  { setting_key: 'support_hours', setting_value: '24/7 دعم فني', setting_type: 'text', description: 'ساعات الدعم الفني' },
  { setting_key: 'emergency_phone', setting_value: '01068275557', setting_type: 'text', description: 'رقم الطوارئ' },
  { setting_key: 'business_phone', setting_value: '01068275557', setting_type: 'text', description: 'رقم العمل' },
  { setting_key: 'fax_number', setting_value: '', setting_type: 'text', description: 'رقم الفاكس' },
  { setting_key: 'postal_code', setting_value: '11511', setting_type: 'text', description: 'الرمز البريدي' }
]

async function addContactInfo() {
  console.log('🚀 إضافة معلومات الاتصال الإضافية...')
  
  try {
    let addedCount = 0
    let updatedCount = 0

    for (const info of additionalContactInfo) {
      console.log(`🔄 معالجة: ${info.setting_key}`)

      // التحقق من وجود الإعداد
      const { data: existingData, error: checkError } = await supabase
        .from('system_settings')
        .select('id')
        .eq('setting_key', info.setting_key)
        .single()

      if (existingData) {
        // تحديث الإعداد الموجود
        const { error: updateError } = await supabase
          .from('system_settings')
          .update({
            setting_value: info.setting_value,
            setting_type: info.setting_type,
            description: info.description,
            updated_at: new Date().toISOString()
          })
          .eq('setting_key', info.setting_key)

        if (updateError) {
          console.error(`❌ خطأ في تحديث ${info.setting_key}:`, updateError.message)
        } else {
          console.log(`✅ تم تحديث ${info.setting_key}`)
          updatedCount++
        }
      } else {
        // إضافة إعداد جديد
        const { error: insertError } = await supabase
          .from('system_settings')
          .insert(info)

        if (insertError) {
          console.error(`❌ خطأ في إضافة ${info.setting_key}:`, insertError.message)
        } else {
          console.log(`✅ تم إضافة ${info.setting_key}`)
          addedCount++
        }
      }
    }

    console.log('\n🎉 تم الانتهاء من إضافة معلومات الاتصال!')
    console.log(`📊 الإحصائيات:`)
    console.log(`   ✅ تم إضافة: ${addedCount} إعداد`)
    console.log(`   🔄 تم تحديث: ${updatedCount} إعداد`)
    console.log(`   📝 المجموع: ${addedCount + updatedCount} إعداد`)

    // التحقق من النتائج
    console.log('\n🔍 التحقق من معلومات الاتصال...')
    const { data: verifyData, error: verifyError } = await supabase
      .from('system_settings')
      .select('setting_key, setting_value')
      .in('setting_key', additionalContactInfo.map(info => info.setting_key))
      .order('setting_key')

    if (verifyError) {
      console.error('❌ خطأ في التحقق:', verifyError.message)
    } else {
      console.log('📋 معلومات الاتصال المحفوظة:')
      verifyData.forEach(setting => {
        console.log(`   ${setting.setting_key}: ${setting.setting_value}`)
      })
    }

    console.log('\n🌐 يمكنك الآن إدارة معلومات الاتصال من:')
    console.log('   http://localhost:3001/admin/contact-info')

  } catch (error) {
    console.error('❌ خطأ عام:', error.message)
  }
}

// تشغيل الدالة
addContactInfo()
  .then(() => {
    console.log('\n✨ انتهت العملية')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 خطأ في تشغيل السكريبت:', error)
    process.exit(1)
  })
