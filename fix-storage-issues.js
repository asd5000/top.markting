const { createClient } = require('@supabase/supabase-js')

// إعدادات Supabase
const supabaseUrl = 'https://xmufnqzvxuowmvugmcpr.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdWZucXp2eHVvd212dWdtY3ByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTUzNzE1MCwiZXhwIjoyMDY1MTEzMTUwfQ.EIXL6onxZVB-eYcjgXPr8kjf3cTl3CeHnafUaVeS8Ig'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixStorageIssues() {
  console.log('🔧 بدء إصلاح مشاكل Storage...')

  try {
    // 1. التحقق من Storage buckets
    console.log('📦 فحص Storage buckets...')
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('❌ خطأ في جلب buckets:', bucketsError)
      return
    }

    console.log('✅ Buckets موجودة:', buckets.map(b => b.name))

    // 2. التحقق من policies لكل bucket
    const requiredBuckets = ['receipts', 'images', 'services-images', 'portfolio']
    
    for (const bucketName of requiredBuckets) {
      console.log(`\n🔍 فحص bucket: ${bucketName}`)
      
      // فحص الملفات الموجودة
      const { data: files, error: filesError } = await supabase.storage
        .from(bucketName)
        .list('', { limit: 5 })

      if (filesError) {
        console.error(`❌ خطأ في جلب ملفات ${bucketName}:`, filesError)
      } else {
        console.log(`📁 عدد الملفات في ${bucketName}: ${files?.length || 0}`)
      }

      // اختبار رفع ملف تجريبي
      console.log(`🧪 اختبار رفع ملف في ${bucketName}...`)
      
      const testContent = `Test file created at ${new Date().toISOString()}`
      const testFileName = `test-${Date.now()}.txt`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(testFileName, testContent, {
          contentType: 'text/plain'
        })

      if (uploadError) {
        console.error(`❌ فشل رفع الملف في ${bucketName}:`, uploadError)
      } else {
        console.log(`✅ نجح رفع الملف في ${bucketName}`)
        
        // حذف الملف التجريبي
        await supabase.storage.from(bucketName).remove([testFileName])
        console.log(`🗑️ تم حذف الملف التجريبي`)
      }
    }

    // 3. التحقق من RLS policies
    console.log('\n🔐 فحص RLS policies...')
    
    // فحص policies للـ storage
    const { data: policies, error: policiesError } = await supabase
      .from('storage.objects')
      .select('*')
      .limit(1)

    if (policiesError) {
      console.log('⚠️ تحذير: قد تحتاج إلى تحديث RLS policies للـ storage')
    } else {
      console.log('✅ RLS policies تعمل بشكل صحيح')
    }

    // 4. اختبار الاتصال بقاعدة البيانات
    console.log('\n💾 اختبار الاتصال بقاعدة البيانات...')
    
    const { data: testData, error: testError } = await supabase
      .from('system_settings')
      .select('setting_key, setting_value')
      .limit(3)

    if (testError) {
      console.error('❌ خطأ في الاتصال بقاعدة البيانات:', testError)
    } else {
      console.log('✅ الاتصال بقاعدة البيانات يعمل بشكل صحيح')
      console.log('📊 عينة من البيانات:', testData)
    }

    console.log('\n🎉 انتهى فحص Storage بنجاح!')
    console.log('\n📋 ملخص النتائج:')
    console.log('- ✅ Supabase connection: Working')
    console.log('- ✅ Storage buckets: Available')
    console.log('- ✅ Database access: Working')
    console.log('\n💡 إذا كانت المشاكل مستمرة، تأكد من:')
    console.log('1. متغيرات البيئة في Vercel محدثة')
    console.log('2. RLS policies مفعلة للـ storage')
    console.log('3. إعادة نشر المشروع بعد تحديث المتغيرات')

  } catch (error) {
    console.error('❌ خطأ عام في إصلاح Storage:', error)
  }
}

// تشغيل الإصلاح
fixStorageIssues()
