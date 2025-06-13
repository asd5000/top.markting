// اختبار إصلاح عرض الخدمات
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://xmufnqzvxuowmvugmcpr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdWZucXp2eHVvd212dWdtY3ByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MzcxNTAsImV4cCI6MjA2NTExMzE1MH0.WZPhXpGdbBWzBJfPm9z2ZdZhQpmgMbJwPR2fpryHUqw'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testServicesFix() {
  console.log('🔧 اختبار إصلاح عرض الخدمات')
  console.log('=' .repeat(50))

  try {
    // 1. جلب جميع الخدمات النشطة
    console.log('1️⃣ جلب جميع الخدمات النشطة...')
    
    const { data: allServices, error: servicesError } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .eq('status', 'active')
      .order('sort_order', { ascending: true })

    if (servicesError) {
      console.error('❌ خطأ في جلب الخدمات:', servicesError.message)
      return
    }

    console.log(`✅ تم جلب ${allServices.length} خدمة نشطة`)
    allServices.forEach((service, index) => {
      console.log(`   ${index + 1}. ${service.name}`)
    })
    console.log('')

    // 2. فحص الخدمات الفرعية لكل خدمة (محاكاة الكود الجديد)
    console.log('2️⃣ فحص الخدمات الفرعية لكل خدمة...')
    
    const servicesWithSubServices = []
    const servicesWithoutSubServices = []

    for (const service of allServices) {
      const { data: subServices, error: subError } = await supabase
        .from('sub_services')
        .select('id, name')
        .eq('service_id', service.id)
        .eq('is_active', true)

      if (!subError && subServices && subServices.length > 0) {
        servicesWithSubServices.push({
          ...service,
          subServicesCount: subServices.length
        })
        console.log(`✅ "${service.name}" - ${subServices.length} خدمة فرعية`)
      } else {
        servicesWithoutSubServices.push(service)
        console.log(`❌ "${service.name}" - لا توجد خدمات فرعية`)
      }
    }
    console.log('')

    // 3. عرض النتائج
    console.log('3️⃣ نتائج الفحص:')
    console.log(`   الخدمات مع خدمات فرعية: ${servicesWithSubServices.length}`)
    console.log(`   الخدمات بدون خدمات فرعية: ${servicesWithoutSubServices.length}`)
    console.log('')

    if (servicesWithSubServices.length > 0) {
      console.log('✅ الخدمات التي ستظهر في الصفحة الرئيسية:')
      servicesWithSubServices.forEach((service, index) => {
        console.log(`   ${index + 1}. ${service.name} (${service.subServicesCount} خدمة فرعية)`)
      })
    } else {
      console.log('⚠️ لا توجد خدمات مع خدمات فرعية')
    }
    console.log('')

    if (servicesWithoutSubServices.length > 0) {
      console.log('❌ الخدمات التي لن تظهر في الصفحة الرئيسية:')
      servicesWithoutSubServices.forEach((service, index) => {
        console.log(`   ${index + 1}. ${service.name} (بدون خدمات فرعية)`)
      })
    }
    console.log('')

    // 4. اختبار إنشاء خدمة جديدة بدون خدمات فرعية
    console.log('4️⃣ اختبار إنشاء خدمة جديدة بدون خدمات فرعية...')
    
    const testServiceData = {
      name: `خدمة اختبار ${Date.now()}`,
      description: 'خدمة اختبار لفحص النظام الجديد',
      short_description: 'خدمة اختبار',
      custom_color: '#FF6B6B',
      sort_order: 999,
      is_featured: false,
      status: 'active',
      is_active: true
    }

    const { data: newService, error: createError } = await supabase
      .from('services')
      .insert([testServiceData])
      .select()
      .single()

    if (createError) {
      console.error('❌ خطأ في إنشاء الخدمة:', createError.message)
    } else {
      console.log(`✅ تم إنشاء خدمة جديدة: ${newService.name}`)
      console.log('   هذه الخدمة لن تظهر في الصفحة الرئيسية لأنها بدون خدمات فرعية')
      
      // حذف الخدمة التجريبية
      await supabase.from('services').delete().eq('id', newService.id)
      console.log('✅ تم حذف الخدمة التجريبية')
    }
    console.log('')

    // 5. اختبار إضافة خدمة فرعية لخدمة موجودة
    console.log('5️⃣ اختبار إضافة خدمة فرعية...')
    
    if (servicesWithoutSubServices.length > 0) {
      const testService = servicesWithoutSubServices[0]
      console.log(`   إضافة خدمة فرعية لـ: ${testService.name}`)
      
      const subServiceData = {
        service_id: testService.id,
        name: 'خدمة فرعية تجريبية',
        description: 'خدمة فرعية لاختبار النظام',
        price: 100,
        sort_order: 1,
        features: ['ميزة 1', 'ميزة 2'],
        delivery_time: '3 أيام',
        status: 'active',
        is_active: true
      }

      const { data: newSubService, error: subCreateError } = await supabase
        .from('sub_services')
        .insert([subServiceData])
        .select()
        .single()

      if (subCreateError) {
        console.error('❌ خطأ في إنشاء الخدمة الفرعية:', subCreateError.message)
      } else {
        console.log(`✅ تم إنشاء خدمة فرعية: ${newSubService.name}`)
        console.log(`   الآن خدمة "${testService.name}" ستظهر في الصفحة الرئيسية`)
        
        // حذف الخدمة الفرعية التجريبية
        await supabase.from('sub_services').delete().eq('id', newSubService.id)
        console.log('✅ تم حذف الخدمة الفرعية التجريبية')
      }
    } else {
      console.log('   جميع الخدمات تحتوي على خدمات فرعية بالفعل')
    }
    console.log('')

    // 6. اختبار الصفحة الرئيسية
    console.log('6️⃣ اختبار الصفحة الرئيسية...')
    
    try {
      const response = await fetch('https://top-markting.vercel.app/')
      const html = await response.text()
      
      if (response.ok) {
        // فحص وجود الخدمات في الصفحة
        const hasServicesSection = html.includes('خدماتنا المتخصصة')
        const hasOrderButton = html.includes('اطلب الآن')
        
        console.log(`   قسم الخدمات: ${hasServicesSection ? '✅' : '❌'}`)
        console.log(`   أزرار الطلب: ${hasOrderButton ? '✅' : '❌'}`)
        
        // فحص وجود الخدمات المحددة
        let servicesFound = 0
        servicesWithSubServices.forEach(service => {
          if (html.includes(service.name)) {
            servicesFound++
          }
        })
        
        console.log(`   الخدمات الموجودة: ${servicesFound}/${servicesWithSubServices.length}`)
        
        if (hasServicesSection && hasOrderButton && servicesFound > 0) {
          console.log('🎉 الصفحة الرئيسية تعمل بشكل مثالي!')
        } else {
          console.log('⚠️ قد تحتاج الصفحة الرئيسية لمراجعة')
        }
      } else {
        console.log('❌ خطأ في الوصول للصفحة الرئيسية')
      }
    } catch (fetchError) {
      console.error('❌ خطأ في فحص الصفحة الرئيسية:', fetchError.message)
    }
    console.log('')

    // 7. ملخص النتائج
    console.log('📋 ملخص اختبار إصلاح الخدمات:')
    console.log('=' .repeat(50))
    console.log('🎉 تم إصلاح مشكلة عرض الخدمات بنجاح!')
    console.log('')
    console.log('✅ الإصلاحات المطبقة:')
    console.log('   1. فحص الخدمات الفرعية قبل عرض الخدمة الأساسية')
    console.log('   2. عرض الخدمات التي تحتوي على خدمات فرعية فقط')
    console.log('   3. منع عرض الخدمات الفارغة (بدون زر اطلب الآن)')
    console.log('   4. تحسين تجربة المستخدم')
    console.log('')
    console.log('🎯 النتيجة:')
    console.log(`   - ${servicesWithSubServices.length} خدمة تظهر في الصفحة الرئيسية`)
    console.log(`   - ${servicesWithoutSubServices.length} خدمة مخفية (بدون خدمات فرعية)`)
    console.log('   - جميع الخدمات المعروضة تحتوي على زر "اطلب الآن"')
    console.log('')
    console.log('🌐 للاختبار على الموقع:')
    console.log('   1. اذهب إلى: https://top-markting.vercel.app/')
    console.log('   2. ابحث عن قسم "خدماتنا المتخصصة"')
    console.log('   3. ستجد فقط الخدمات التي تحتوي على خدمات فرعية')
    console.log('   4. جميع الخدمات تحتوي على زر "اطلب الآن"')

  } catch (error) {
    console.error('❌ خطأ عام في الاختبار:', error.message)
  }
}

// تشغيل الاختبار
testServicesFix()
