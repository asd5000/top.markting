const { createClient } = require('@supabase/supabase-js')

// إعدادات Supabase
const supabaseUrl = 'https://xmufnqzvxuowmvugmcpr.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdWZucXp2eHVvd212dWdtY3ByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTUzNzE1MCwiZXhwIjoyMDY1MTEzMTUwfQ.EIXL6onxZVB-eYcjgXPr8kjf3cTl3CeHnafUaVeS8Ig'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkSystemStatus() {
  console.log('🔍 فحص حالة النظام...\n')
  
  const results = {
    database: false,
    storage: false,
    packages: false,
    services: false,
    realEstate: false,
    receipts: false,
    settings: false
  }

  try {
    // 1. فحص قاعدة البيانات
    console.log('📊 فحص قاعدة البيانات...')
    const { data: dbTest, error: dbError } = await supabase
      .from('system_settings')
      .select('setting_key')
      .limit(1)

    if (dbError) {
      console.log('❌ قاعدة البيانات: فشل الاتصال')
      console.log('   خطأ:', dbError.message)
    } else {
      console.log('✅ قاعدة البيانات: متصلة')
      results.database = true
    }

    // 2. فحص Storage
    console.log('\n📦 فحص Storage...')
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets()
    
    if (storageError) {
      console.log('❌ Storage: غير متاح')
      console.log('   خطأ:', storageError.message)
    } else {
      console.log('✅ Storage: متاح')
      console.log('   Buckets:', buckets.map(b => b.name).join(', '))
      results.storage = true
    }

    // 3. فحص الباقات
    console.log('\n📋 فحص الباقات...')
    const { data: packages, error: packagesError } = await supabase
      .from('packages')
      .select('id, name')
      .limit(3)

    if (packagesError) {
      console.log('❌ الباقات: خطأ في التحميل')
      console.log('   خطأ:', packagesError.message)
    } else {
      console.log('✅ الباقات: تعمل بشكل صحيح')
      console.log(`   عدد الباقات: ${packages.length}`)
      results.packages = true
    }

    // 4. فحص الخدمات
    console.log('\n🛠️ فحص الخدمات...')
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('id, name')
      .limit(3)

    if (servicesError) {
      console.log('❌ الخدمات: خطأ في التحميل')
      console.log('   خطأ:', servicesError.message)
    } else {
      console.log('✅ الخدمات: تعمل بشكل صحيح')
      console.log(`   عدد الخدمات: ${services.length}`)
      results.services = true

      // فحص الخدمات الفرعية
      if (services.length > 0) {
        const { data: subServices, error: subError } = await supabase
          .from('sub_services')
          .select('id')
          .eq('service_id', services[0].id)

        if (!subError) {
          console.log(`   الخدمات الفرعية لـ "${services[0].name}": ${subServices.length}`)
        }
      }
    }

    // 5. فحص العقارات
    console.log('\n🏠 فحص العقارات...')
    const { data: realEstate, error: realEstateError } = await supabase
      .from('real_estate')
      .select('id, title')
      .limit(3)

    if (realEstateError) {
      console.log('❌ العقارات: خطأ في التحميل')
      console.log('   خطأ:', realEstateError.message)
    } else {
      console.log('✅ العقارات: تعمل بشكل صحيح')
      console.log(`   عدد العقارات: ${realEstate.length}`)
      results.realEstate = true
    }

    // 6. فحص الإيصالات
    console.log('\n🧾 فحص الإيصالات...')
    const { data: receipts, error: receiptsError } = await supabase
      .from('receipts')
      .select('id, amount')
      .limit(3)

    if (receiptsError) {
      console.log('❌ الإيصالات: خطأ في التحميل')
      console.log('   خطأ:', receiptsError.message)
    } else {
      console.log('✅ الإيصالات: تعمل بشكل صحيح')
      console.log(`   عدد الإيصالات: ${receipts.length}`)
      results.receipts = true
    }

    // 7. فحص إعدادات الموقع
    console.log('\n⚙️ فحص إعدادات الموقع...')
    const { data: settings, error: settingsError } = await supabase
      .from('system_settings')
      .select('setting_key, setting_value')
      .in('setting_key', ['site_name', 'phone_number'])

    if (settingsError) {
      console.log('❌ إعدادات الموقع: خطأ في التحميل')
      console.log('   خطأ:', settingsError.message)
    } else {
      console.log('✅ إعدادات الموقع: تعمل بشكل صحيح')
      settings.forEach(setting => {
        console.log(`   ${setting.setting_key}: ${setting.setting_value}`)
      })
      results.settings = true
    }

    // 8. ملخص النتائج
    console.log('\n' + '='.repeat(50))
    console.log('📊 ملخص حالة النظام:')
    console.log('='.repeat(50))
    
    const totalChecks = Object.keys(results).length
    const passedChecks = Object.values(results).filter(Boolean).length
    const healthPercentage = Math.round((passedChecks / totalChecks) * 100)

    console.log(`🎯 الصحة العامة للنظام: ${healthPercentage}% (${passedChecks}/${totalChecks})`)
    console.log('')

    Object.entries(results).forEach(([key, status]) => {
      const labels = {
        database: 'قاعدة البيانات',
        storage: 'التخزين',
        packages: 'الباقات',
        services: 'الخدمات',
        realEstate: 'العقارات',
        receipts: 'الإيصالات',
        settings: 'إعدادات الموقع'
      }
      
      const icon = status ? '✅' : '❌'
      const statusText = status ? 'يعمل' : 'لا يعمل'
      console.log(`${icon} ${labels[key]}: ${statusText}`)
    })

    console.log('')
    
    if (healthPercentage === 100) {
      console.log('🎉 ممتاز! جميع أجزاء النظام تعمل بشكل صحيح')
    } else if (healthPercentage >= 80) {
      console.log('⚠️ النظام يعمل بشكل جيد مع بعض المشاكل البسيطة')
    } else if (healthPercentage >= 60) {
      console.log('🔧 النظام يحتاج إلى إصلاح بعض المشاكل')
    } else {
      console.log('🚨 النظام يحتاج إلى إصلاح عاجل')
    }

    console.log('')
    console.log('🔗 روابط مفيدة:')
    console.log('- الموقع المباشر: https://top-markting.vercel.app')
    console.log('- لوحة التحكم: https://top-markting.vercel.app/admin')
    console.log('- Vercel Dashboard: https://vercel.com/asd5000/top-markting')
    console.log('- Supabase Dashboard: https://supabase.com/dashboard/project/xmufnqzvxuowmvugmcpr')

    if (healthPercentage < 100) {
      console.log('')
      console.log('💡 للإصلاح السريع، شغل:')
      console.log('   node fix-all-issues.js')
      console.log('   أو راجع ملف QUICK-FIX.md')
    }

  } catch (error) {
    console.error('❌ خطأ عام في فحص النظام:', error.message)
  }
}

// تشغيل الفحص
checkSystemStatus()
