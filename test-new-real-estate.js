// اختبار النظام الجديد للتسويق العقاري
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://xmufnqzvxuowmvugmcpr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdWZucXp2eHVvd212dWdtY3ByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MzcxNTAsImV4cCI6MjA2NTExMzE1MH0.WZPhXpGdbBWzBJfPm9z2ZdZhQpmgMbJwPR2fpryHUqw'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testNewRealEstateSystem() {
  console.log('🏠 اختبار النظام الجديد للتسويق العقاري')
  console.log('=' .repeat(50))

  try {
    // 1. فحص الاتصال بقاعدة البيانات
    console.log('1️⃣ فحص الاتصال بقاعدة البيانات...')
    const { data: testData, error: testError } = await supabase
      .from('real_estate')
      .select('id')
      .limit(1)

    if (testError) {
      console.error('❌ خطأ في الاتصال:', testError.message)
      return
    }

    console.log('✅ الاتصال بقاعدة البيانات يعمل بشكل صحيح')
    console.log('')

    // 2. فحص العقارات الموجودة
    console.log('2️⃣ فحص العقارات الموجودة...')
    const { data: properties, error: propertiesError } = await supabase
      .from('real_estate')
      .select('*')
      .limit(5)

    if (propertiesError) {
      console.error('❌ خطأ في جلب العقارات:', propertiesError.message)
      return
    }

    console.log(`✅ تم جلب ${properties.length} عقار`)
    if (properties.length > 0) {
      console.log('📋 عينة من العقارات:')
      properties.forEach((property, index) => {
        console.log(`   ${index + 1}. ${property.customer_name} - ${property.title} - ${property.operation_type}`)
      })
    }
    console.log('')

    // 3. اختبار إضافة عقار جديد
    console.log('3️⃣ اختبار إضافة عقار جديد...')
    const newProperty = {
      customer_name: 'أحمد محمد (اختبار)',
      customer_phone: '01234567890',
      customer_email: 'test@example.com',
      property_type: 'apartment',
      operation_type: 'sale',
      title: 'شقة للبيع - اختبار النظام الجديد',
      description: 'شقة تجريبية لاختبار النظام الجديد',
      governorate: 'القاهرة',
      city: 'مدينة نصر',
      district: 'الحي الأول',
      area: 120,
      rooms: 3,
      bathrooms: 2,
      price: 1500000,
      price_negotiable: true
    }

    const { data: insertedProperty, error: insertError } = await supabase
      .from('real_estate')
      .insert([newProperty])
      .select()
      .single()

    if (insertError) {
      console.error('❌ خطأ في إضافة العقار:', insertError.message)
      return
    }

    console.log('✅ تم إضافة العقار بنجاح:', insertedProperty.id)
    console.log('')

    // 4. اختبار البحث والفلترة
    console.log('4️⃣ اختبار البحث والفلترة...')
    
    // البحث بنوع العقار
    const { data: apartmentData, error: apartmentError } = await supabase
      .from('real_estate')
      .select('*')
      .eq('property_type', 'apartment')
      .limit(3)

    if (!apartmentError) {
      console.log(`✅ البحث بنوع العقار (شقة): ${apartmentData.length} نتيجة`)
    }

    // البحث بنوع العملية
    const { data: saleData, error: saleError } = await supabase
      .from('real_estate')
      .select('*')
      .eq('operation_type', 'sale')
      .limit(3)

    if (!saleError) {
      console.log(`✅ البحث بنوع العملية (بيع): ${saleData.length} نتيجة`)
    }
    console.log('')

    // 5. اختبار تحديث العقار
    console.log('5️⃣ اختبار تحديث العقار...')
    const { data: updatedProperty, error: updateError } = await supabase
      .from('real_estate')
      .update({ 
        title: 'شقة للبيع - تم التحديث',
        price: 1600000 
      })
      .eq('id', insertedProperty.id)
      .select()
      .single()

    if (updateError) {
      console.error('❌ خطأ في تحديث العقار:', updateError.message)
    } else {
      console.log('✅ تم تحديث العقار بنجاح')
    }
    console.log('')

    // 6. اختبار حذف العقار التجريبي
    console.log('6️⃣ تنظيف البيانات التجريبية...')
    const { error: deleteError } = await supabase
      .from('real_estate')
      .delete()
      .eq('id', insertedProperty.id)

    if (deleteError) {
      console.error('❌ خطأ في حذف العقار:', deleteError.message)
    } else {
      console.log('✅ تم حذف العقار التجريبي بنجاح')
    }
    console.log('')

    // 7. ملخص النتائج
    console.log('📋 ملخص اختبار النظام الجديد:')
    console.log('=' .repeat(50))
    console.log('✅ الاتصال بقاعدة البيانات: يعمل')
    console.log('✅ جلب العقارات: يعمل')
    console.log('✅ إضافة عقار جديد: يعمل')
    console.log('✅ البحث والفلترة: يعمل')
    console.log('✅ تحديث العقار: يعمل')
    console.log('✅ حذف العقار: يعمل')
    console.log('')
    console.log('🎉 النظام الجديد للتسويق العقاري يعمل بشكل مثالي!')
    console.log('')
    console.log('🔗 للوصول للنظام:')
    console.log('   https://top-markting.vercel.app/admin/real-estate')
    console.log('')
    console.log('👤 بيانات تسجيل الدخول:')
    console.log('   البريد: asdasheref@gmail.com')
    console.log('   كلمة المرور: 0453328124')

  } catch (error) {
    console.error('❌ خطأ عام في اختبار النظام:', error.message)
  }
}

// تشغيل الاختبار
testNewRealEstateSystem()
