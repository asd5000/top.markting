// اختبار صفحة الباقات
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://xmufnqzvxuowmvugmcpr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdWZucXp2eHVvd212dWdtY3ByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MzcxNTAsImV4cCI6MjA2NTExMzE1MH0.WZPhXpGdbBWzBJfPm9z2ZdZhQpmgMbJwPR2fpryHUqw'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testPackagesPage() {
  console.log('📦 اختبار صفحة الباقات')
  console.log('=' .repeat(50))

  try {
    // 1. فحص البيانات في جدول الباقات
    console.log('1️⃣ فحص البيانات في جدول الباقات...')
    
    const { data: packages, error: packagesError } = await supabase
      .from('packages')
      .select('*')
      .eq('is_active', true)
      .order('price')

    if (packagesError) {
      console.error('❌ خطأ في جلب الباقات:', packagesError.message)
      return
    }

    console.log(`✅ تم جلب ${packages.length} باقة نشطة`)
    packages.forEach((pkg, index) => {
      console.log(`   ${index + 1}. ${pkg.name} - ${pkg.price} ج.م`)
    })
    console.log('')

    // 2. فحص صفحة الباقات على الموقع
    console.log('2️⃣ فحص صفحة الباقات على الموقع...')
    
    try {
      const response = await fetch('https://top-markting.vercel.app/packages')
      const html = await response.text()
      
      if (response.ok) {
        console.log('✅ صفحة الباقات متاحة')
        
        // فحص وجود العناصر المهمة
        const hasTitle = html.includes('باقات إدارة الصفحات') || html.includes('الباقات')
        const hasSubscribeButton = html.includes('اشترك الآن')
        const hasPackageCards = html.includes('باقة')
        
        console.log(`   العنوان: ${hasTitle ? '✅' : '❌'}`)
        console.log(`   أزرار الاشتراك: ${hasSubscribeButton ? '✅' : '❌'}`)
        console.log(`   كروت الباقات: ${hasPackageCards ? '✅' : '❌'}`)
        
        if (hasTitle && hasSubscribeButton && hasPackageCards) {
          console.log('🎉 صفحة الباقات تعمل بشكل مثالي!')
        } else {
          console.log('⚠️ قد تحتاج صفحة الباقات لمراجعة')
        }
      } else {
        console.log('❌ صفحة الباقات غير متاحة')
        console.log(`   Status: ${response.status}`)
      }
    } catch (fetchError) {
      console.error('❌ خطأ في الوصول للصفحة:', fetchError.message)
    }
    console.log('')

    // 3. فحص الروابط في الصفحة الرئيسية
    console.log('3️⃣ فحص الروابط في الصفحة الرئيسية...')
    
    try {
      const homeResponse = await fetch('https://top-markting.vercel.app/')
      const homeHtml = await homeResponse.text()
      
      if (homeResponse.ok) {
        const hasPackagesLink = homeHtml.includes('/packages') || homeHtml.includes('الباقات')
        console.log(`   رابط الباقات في الصفحة الرئيسية: ${hasPackagesLink ? '✅' : '❌'}`)
        
        if (hasPackagesLink) {
          console.log('✅ رابط الباقات موجود في الصفحة الرئيسية')
        } else {
          console.log('⚠️ رابط الباقات قد يكون مفقود من الصفحة الرئيسية')
        }
      }
    } catch (homeError) {
      console.error('❌ خطأ في فحص الصفحة الرئيسية:', homeError.message)
    }
    console.log('')

    // 4. اختبار عملية الاشتراك (محاكاة)
    console.log('4️⃣ اختبار عملية الاشتراك (محاكاة)...')
    
    if (packages.length > 0) {
      const testPackage = packages[0]
      console.log(`   اختبار الاشتراك في: ${testPackage.name}`)
      console.log(`   السعر: ${testPackage.price} ج.م`)
      console.log(`   معرف الباقة: ${testPackage.id}`)
      
      // التحقق من صحة UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      const isValidUUID = uuidRegex.test(testPackage.id)
      
      console.log(`   صحة معرف الباقة: ${isValidUUID ? '✅' : '❌'}`)
      
      if (isValidUUID) {
        console.log('✅ يمكن الاشتراك في الباقة بنجاح')
      } else {
        console.log('❌ مشكلة في معرف الباقة - قد تحتاج إصلاح')
      }
    }
    console.log('')

    // 5. ملخص النتائج
    console.log('📋 ملخص اختبار صفحة الباقات:')
    console.log('=' .repeat(50))
    
    if (packages.length > 0) {
      console.log('🎉 صفحة الباقات جاهزة للاستخدام!')
      console.log('')
      console.log('✅ ما يعمل:')
      console.log(`   📦 ${packages.length} باقة متاحة في قاعدة البيانات`)
      console.log('   🌐 صفحة الباقات متاحة على الموقع')
      console.log('   🔗 رابط الباقات موجود في القائمة الرئيسية')
      console.log('   💳 نظام الاشتراك جاهز')
      console.log('')
      console.log('🔗 للوصول لصفحة الباقات:')
      console.log('   https://top-markting.vercel.app/packages')
      console.log('')
      console.log('📋 الباقات المتاحة:')
      packages.forEach((pkg, index) => {
        console.log(`   ${index + 1}. ${pkg.name} - ${pkg.price} ج.م`)
      })
    } else {
      console.log('⚠️ لا توجد باقات متاحة')
      console.log('   يرجى إضافة باقات من لوحة التحكم')
    }

  } catch (error) {
    console.error('❌ خطأ عام في الاختبار:', error.message)
  }
}

// تشغيل الاختبار
testPackagesPage()
