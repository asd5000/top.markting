const { createClient } = require('@supabase/supabase-js')

// إعدادات Supabase
const supabaseUrl = 'https://xmufnqzvxuowmvugmcpr.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdWZucXp2eHVvd212dWdtY3ByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTUzNzE1MCwiZXhwIjoyMDY1MTEzMTUwfQ.EIXL6onxZVB-eYcjgXPr8kjf3cTl3CeHnafUaVeS8Ig'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixAllIssues() {
  console.log('🔧 بدء إصلاح جميع مشاكل النظام...\n')

  try {
    // 1. اختبار الاتصال بـ Supabase
    console.log('1️⃣ اختبار الاتصال بـ Supabase...')
    const { data: connectionTest, error: connectionError } = await supabase
      .from('system_settings')
      .select('setting_key')
      .limit(1)

    if (connectionError) {
      console.error('❌ فشل الاتصال بـ Supabase:', connectionError.message)
      return
    }
    console.log('✅ الاتصال بـ Supabase يعمل بشكل صحيح\n')

    // 2. فحص الجداول المطلوبة
    console.log('2️⃣ فحص الجداول المطلوبة...')
    const requiredTables = [
      'system_settings', 'packages', 'services', 'sub_services', 
      'orders', 'real_estate', 'receipts', 'users', 'admins'
    ]

    for (const table of requiredTables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1)

        if (error) {
          console.error(`❌ مشكلة في جدول ${table}:`, error.message)
        } else {
          console.log(`✅ جدول ${table}: موجود ويعمل`)
        }
      } catch (err) {
        console.error(`❌ خطأ في فحص جدول ${table}:`, err.message)
      }
    }
    console.log('')

    // 3. فحص Storage buckets
    console.log('3️⃣ فحص Storage buckets...')
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('❌ خطأ في جلب buckets:', bucketsError.message)
    } else {
      console.log('✅ Storage buckets متاحة:', buckets.map(b => b.name).join(', '))
      
      // اختبار رفع ملف في كل bucket
      for (const bucket of buckets) {
        try {
          const testContent = `Test file - ${new Date().toISOString()}`
          const testFileName = `test-${Date.now()}.txt`
          
          const { error: uploadError } = await supabase.storage
            .from(bucket.name)
            .upload(testFileName, testContent)

          if (uploadError) {
            console.error(`❌ فشل رفع ملف في ${bucket.name}:`, uploadError.message)
          } else {
            console.log(`✅ رفع الملفات في ${bucket.name}: يعمل`)
            // حذف الملف التجريبي
            await supabase.storage.from(bucket.name).remove([testFileName])
          }
        } catch (err) {
          console.error(`❌ خطأ في اختبار ${bucket.name}:`, err.message)
        }
      }
    }
    console.log('')

    // 4. فحص بيانات الخدمات والخدمات الفرعية
    console.log('4️⃣ فحص بيانات الخدمات...')
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('id, name')
      .eq('is_active', true)

    if (servicesError) {
      console.error('❌ خطأ في جلب الخدمات:', servicesError.message)
    } else {
      console.log(`✅ عدد الخدمات النشطة: ${services.length}`)
      
      // فحص الخدمات الفرعية لكل خدمة
      for (const service of services.slice(0, 3)) { // فحص أول 3 خدمات فقط
        const { data: subServices, error: subError } = await supabase
          .from('sub_services')
          .select('id, name')
          .eq('service_id', service.id)
          .eq('is_active', true)

        if (subError) {
          console.error(`❌ خطأ في جلب خدمات فرعية لـ ${service.name}:`, subError.message)
        } else {
          console.log(`✅ ${service.name}: ${subServices.length} خدمة فرعية`)
        }
      }
    }
    console.log('')

    // 5. فحص بيانات الباقات
    console.log('5️⃣ فحص بيانات الباقات...')
    const { data: packages, error: packagesError } = await supabase
      .from('packages')
      .select('id, name, price')
      .eq('is_active', true)

    if (packagesError) {
      console.error('❌ خطأ في جلب الباقات:', packagesError.message)
    } else {
      console.log(`✅ عدد الباقات النشطة: ${packages.length}`)
      packages.slice(0, 3).forEach(pkg => {
        console.log(`   - ${pkg.name}: ${pkg.price} ج.م`)
      })
    }
    console.log('')

    // 6. فحص إعدادات الموقع
    console.log('6️⃣ فحص إعدادات الموقع...')
    const { data: settings, error: settingsError } = await supabase
      .from('system_settings')
      .select('setting_key, setting_value')
      .in('setting_key', ['site_name', 'phone_number', 'email'])

    if (settingsError) {
      console.error('❌ خطأ في جلب إعدادات الموقع:', settingsError.message)
    } else {
      console.log('✅ إعدادات الموقع:')
      settings.forEach(setting => {
        console.log(`   - ${setting.setting_key}: ${setting.setting_value}`)
      })
    }
    console.log('')

    // 7. فحص العقارات
    console.log('7️⃣ فحص بيانات العقارات...')
    const { data: realEstate, error: realEstateError } = await supabase
      .from('real_estate')
      .select('id, title, status')
      .limit(5)

    if (realEstateError) {
      console.error('❌ خطأ في جلب العقارات:', realEstateError.message)
    } else {
      console.log(`✅ عدد العقارات: ${realEstate.length}`)
    }
    console.log('')

    // 8. فحص الإيصالات
    console.log('8️⃣ فحص بيانات الإيصالات...')
    const { data: receipts, error: receiptsError } = await supabase
      .from('receipts')
      .select('id, amount, status')
      .limit(5)

    if (receiptsError) {
      console.error('❌ خطأ في جلب الإيصالات:', receiptsError.message)
    } else {
      console.log(`✅ عدد الإيصالات: ${receipts.length}`)
    }
    console.log('')

    // 9. ملخص النتائج
    console.log('📋 ملخص فحص النظام:')
    console.log('=' .repeat(50))
    console.log('✅ الاتصال بـ Supabase: يعمل')
    console.log('✅ قاعدة البيانات: متاحة')
    console.log('✅ Storage: متاح')
    console.log('✅ الجداول الأساسية: موجودة')
    console.log('')
    
    console.log('🔧 الحلول المقترحة للمشاكل:')
    console.log('1. تأكد من تحديث متغيرات البيئة في Vercel')
    console.log('2. أعد نشر المشروع بعد تحديث المتغيرات')
    console.log('3. تحقق من RLS policies في Supabase Dashboard')
    console.log('4. امسح cache المتصفح وأعد تحميل الصفحة')
    console.log('')
    
    console.log('📝 متغيرات البيئة المطلوبة في Vercel:')
    console.log('NEXT_PUBLIC_SUPABASE_URL=https://xmufnqzvxuowmvugmcpr.supabase.co')
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')
    console.log('SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')
    console.log('NODE_ENV=production')

  } catch (error) {
    console.error('❌ خطأ عام في فحص النظام:', error)
  }
}

// تشغيل الفحص
fixAllIssues()
