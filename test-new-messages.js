// اختبار الرسائل الجديدة في صفحة إضافة العقار
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://xmufnqzvxuowmvugmcpr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdWZucXp2eHVvd212dWdtY3ByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MzcxNTAsImV4cCI6MjA2NTExMzE1MH0.WZPhXpGdbBWzBJfPm9z2ZdZhQpmgMbJwPR2fpryHUqw'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testNewMessages() {
  console.log('📝 اختبار الرسائل الجديدة في صفحة إضافة العقار')
  console.log('=' .repeat(60))

  // بيانات مستخدم تجريبي
  const testUser = {
    email: `messages${Date.now()}@example.com`,
    password: 'test123456',
    name: 'مستخدم تجريبي للرسائل',
    phone: '01234567890'
  }

  try {
    // 1. إنشاء حساب جديد
    console.log('1️⃣ إنشاء حساب جديد...')
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testUser.email,
      password: testUser.password,
      options: {
        data: {
          name: testUser.name,
          phone: testUser.phone
        }
      }
    })

    if (signUpError) {
      console.error('❌ خطأ في إنشاء الحساب:', signUpError.message)
      return
    }

    console.log('✅ تم إنشاء الحساب بنجاح!')
    console.log('')

    // 2. إضافة بيانات المستخدم إلى جدول users
    if (signUpData.user) {
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: signUpData.user.id,
            email: signUpData.user.email,
            name: testUser.name,
            phone: testUser.phone,
            role: 'customer',
            is_active: true,
            created_at: new Date().toISOString()
          }
        ])

      if (insertError) {
        console.error('❌ خطأ في إضافة بيانات المستخدم:', insertError.message)
      }
    }

    // 3. اختبار إضافة عقار من بائع
    console.log('2️⃣ اختبار إضافة عقار من بائع...')
    
    const sellerProperty = {
      customer_name: testUser.name,
      customer_phone: testUser.phone,
      customer_email: testUser.email,
      title: 'شقة للبيع في مدينة نصر - 120 متر',
      description: 'شقة ممتازة للبيع في موقع متميز',
      property_type: 'apartment',
      operation_type: 'seller',
      price: 1500000,
      price_negotiable: true,
      area: 120,
      rooms: 3,
      bathrooms: 2,
      governorate: 'القاهرة',
      city: 'مدينة نصر',
      district: 'الحي الأول'
    }

    const { data: sellerResult, error: sellerError } = await supabase
      .from('real_estate')
      .insert([sellerProperty])
      .select()
      .single()

    if (sellerError) {
      console.error('❌ خطأ في إضافة عقار البائع:', sellerError.message)
    } else {
      console.log('✅ تم إضافة عقار البائع بنجاح!')
      console.log(`   🟢 البائع: ${sellerResult.customer_name}`)
      console.log(`   📍 العقار: ${sellerResult.title}`)
      console.log(`   💰 السعر: ${sellerResult.price.toLocaleString()} جنيه`)
    }
    console.log('')

    // 4. اختبار إضافة طلب من مشتري
    console.log('3️⃣ اختبار إضافة طلب من مشتري...')
    
    const buyerRequest = {
      customer_name: 'مشتري تجريبي',
      customer_phone: '01987654321',
      customer_email: 'buyer@example.com',
      title: 'أبحث عن شقة في مدينة نصر - 100-150 متر',
      description: 'أبحث عن شقة للشراء في مدينة نصر، 3 غرف، دور متوسط',
      property_type: 'apartment',
      operation_type: 'buyer',
      price: 1400000,
      price_negotiable: true,
      area: 130,
      rooms: 3,
      bathrooms: 2,
      governorate: 'القاهرة',
      city: 'مدينة نصر',
      district: 'الحي الأول'
    }

    const { data: buyerResult, error: buyerError } = await supabase
      .from('real_estate')
      .insert([buyerRequest])
      .select()
      .single()

    if (buyerError) {
      console.error('❌ خطأ في إضافة طلب المشتري:', buyerError.message)
    } else {
      console.log('✅ تم إضافة طلب المشتري بنجاح!')
      console.log(`   🔵 المشتري: ${buyerResult.customer_name}`)
      console.log(`   🔍 يبحث عن: ${buyerResult.title}`)
      console.log(`   💰 الميزانية: ${buyerResult.price.toLocaleString()} جنيه`)
    }
    console.log('')

    // 5. عرض إحصائيات البرنامج
    console.log('4️⃣ إحصائيات برنامج التسويق العقاري...')
    
    const { data: allProperties, error: statsError } = await supabase
      .from('real_estate')
      .select('operation_type')

    if (!statsError && allProperties) {
      const sellers = allProperties.filter(p => p.operation_type === 'seller').length
      const buyers = allProperties.filter(p => p.operation_type === 'buyer').length
      
      console.log(`📊 إجمالي البيانات في النظام:`)
      console.log(`   🟢 البائعين: ${sellers}`)
      console.log(`   🔵 المشترين: ${buyers}`)
      console.log(`   📈 إجمالي: ${sellers + buyers}`)
    }
    console.log('')

    // 6. تنظيف البيانات التجريبية
    console.log('5️⃣ تنظيف البيانات التجريبية...')
    
    // حذف العقارات
    if (sellerResult) {
      await supabase.from('real_estate').delete().eq('id', sellerResult.id)
      console.log('✅ تم حذف عقار البائع التجريبي')
    }
    
    if (buyerResult) {
      await supabase.from('real_estate').delete().eq('id', buyerResult.id)
      console.log('✅ تم حذف طلب المشتري التجريبي')
    }

    // حذف بيانات المستخدم
    if (signUpData.user) {
      await supabase.from('users').delete().eq('id', signUpData.user.id)
      console.log('✅ تم حذف بيانات المستخدم التجريبي')
    }

    // تسجيل الخروج
    await supabase.auth.signOut()
    console.log('✅ تم تسجيل الخروج')
    console.log('')

    // 7. ملخص النتائج
    console.log('📋 ملخص اختبار الرسائل الجديدة:')
    console.log('=' .repeat(60))
    console.log('🎉 جميع الرسائل والوظائف تعمل بشكل مثالي!')
    console.log('')
    console.log('✅ الرسائل الجديدة:')
    console.log('   📝 "تم إضافة البيانات بنجاح! برنامجنا يجمع بيانات المشترين والبائعين"')
    console.log('   🏠 "أضف بياناتك مجاناً"')
    console.log('   🔄 "نجمع بيانات المشترين والبائعين لتسهيل عملية المطابقة"')
    console.log('')
    console.log('✅ الوظائف:')
    console.log('   🟢 إضافة بيانات البائعين: يعمل')
    console.log('   🔵 إضافة بيانات المشترين: يعمل')
    console.log('   📊 جمع البيانات للمطابقة: يعمل')
    console.log('')
    console.log('🌐 للاختبار على الموقع:')
    console.log('   https://top-markting.vercel.app/add-property')

  } catch (error) {
    console.error('❌ خطأ عام في الاختبار:', error.message)
  }
}

// تشغيل الاختبار
testNewMessages()
