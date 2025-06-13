// اختبار صفحة إضافة العقار مع التسجيل التلقائي
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://xmufnqzvxuowmvugmcpr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdWZucXp2eHVvd212dWdtY3ByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MzcxNTAsImV4cCI6MjA2NTExMzE1MH0.WZPhXpGdbBWzBJfPm9z2ZdZhQpmgMbJwPR2fpryHUqw'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testAddPropertyFlow() {
  console.log('🏠 اختبار تدفق إضافة العقار مع التسجيل التلقائي')
  console.log('=' .repeat(60))

  // بيانات مستخدم تجريبي
  const testUser = {
    email: `property${Date.now()}@example.com`,
    password: 'test123456',
    name: 'مالك عقار تجريبي',
    phone: '01234567890'
  }

  try {
    // 1. إنشاء حساب جديد
    console.log('1️⃣ إنشاء حساب جديد...')
    console.log(`   البريد: ${testUser.email}`)
    
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
    console.log(`   User ID: ${signUpData.user?.id}`)
    console.log(`   الجلسة: ${signUpData.session ? 'موجودة' : 'غير موجودة'}`)
    console.log('')

    // 2. التحقق من إمكانية الوصول لصفحة إضافة العقار
    console.log('2️⃣ التحقق من إمكانية الوصول لصفحة إضافة العقار...')
    
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('❌ خطأ في جلب الجلسة:', sessionError.message)
      return
    }

    if (sessionData.session) {
      console.log('✅ الجلسة نشطة - يمكن الوصول لصفحة إضافة العقار')
      console.log(`   User ID: ${sessionData.session.user.id}`)
      console.log(`   البريد: ${sessionData.session.user.email}`)
    } else {
      console.log('❌ لا توجد جلسة نشطة - سيتم توجيه المستخدم لتسجيل الدخول')
      return
    }
    console.log('')

    // 3. إضافة بيانات المستخدم إلى جدول users
    console.log('3️⃣ إضافة بيانات المستخدم إلى جدول users...')
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
      } else {
        console.log('✅ تم إضافة بيانات المستخدم بنجاح!')
      }
    }
    console.log('')

    // 4. اختبار إضافة عقار
    console.log('4️⃣ اختبار إضافة عقار...')
    
    const propertyData = {
      customer_name: testUser.name,
      customer_phone: testUser.phone,
      customer_email: testUser.email,
      title: 'شقة تجريبية للبيع',
      description: 'شقة تجريبية لاختبار النظام',
      property_type: 'apartment',
      operation_type: 'seller',
      price: 1000000,
      price_negotiable: true,
      area: 120,
      rooms: 3,
      bathrooms: 2,
      governorate: 'القاهرة',
      city: 'مدينة نصر',
      district: 'الحي الأول'
    }

    const { data: insertedProperty, error: propertyError } = await supabase
      .from('real_estate')
      .insert([propertyData])
      .select()
      .single()

    if (propertyError) {
      console.error('❌ خطأ في إضافة العقار:', propertyError.message)
    } else {
      console.log('✅ تم إضافة العقار بنجاح!')
      console.log(`   Property ID: ${insertedProperty.id}`)
      console.log(`   العنوان: ${insertedProperty.title}`)
      console.log(`   النوع: ${insertedProperty.operation_type}`)
    }
    console.log('')

    // 5. تنظيف البيانات التجريبية
    console.log('5️⃣ تنظيف البيانات التجريبية...')
    
    // حذف العقار
    if (insertedProperty) {
      const { error: deletePropertyError } = await supabase
        .from('real_estate')
        .delete()
        .eq('id', insertedProperty.id)

      if (deletePropertyError) {
        console.error('❌ خطأ في حذف العقار:', deletePropertyError.message)
      } else {
        console.log('✅ تم حذف العقار التجريبي')
      }
    }

    // حذف بيانات المستخدم
    if (signUpData.user) {
      const { error: deleteUserError } = await supabase
        .from('users')
        .delete()
        .eq('id', signUpData.user.id)

      if (deleteUserError) {
        console.error('❌ خطأ في حذف بيانات المستخدم:', deleteUserError.message)
      } else {
        console.log('✅ تم حذف بيانات المستخدم')
      }
    }

    // تسجيل الخروج
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) {
      console.error('❌ خطأ في تسجيل الخروج:', signOutError.message)
    } else {
      console.log('✅ تم تسجيل الخروج بنجاح')
    }
    console.log('')

    // 6. ملخص النتائج
    console.log('📋 ملخص اختبار تدفق إضافة العقار:')
    console.log('=' .repeat(60))
    
    if (signUpData.session && insertedProperty) {
      console.log('🎉 التدفق يعمل بشكل مثالي!')
      console.log('✅ إنشاء الحساب: يعمل')
      console.log('✅ تسجيل الدخول التلقائي: يعمل')
      console.log('✅ الوصول لصفحة إضافة العقار: يعمل')
      console.log('✅ إضافة العقار: يعمل')
      console.log('')
      console.log('🔗 يمكن للمستخدمين الآن:')
      console.log('   - إنشاء حساب جديد')
      console.log('   - الدخول مباشرة بدون تأكيد البريد')
      console.log('   - الوصول لصفحة إضافة العقار')
      console.log('   - إضافة عقاراتهم بنجاح')
    } else {
      console.log('⚠️ يحتاج مراجعة - بعض الخطوات لم تعمل بشكل صحيح')
    }

    console.log('')
    console.log('🌐 للاختبار على الموقع:')
    console.log('   1. اذهب إلى: https://top-markting.vercel.app/register')
    console.log('   2. أنشئ حساب جديد')
    console.log('   3. ستدخل تلقائياً')
    console.log('   4. اذهب إلى: https://top-markting.vercel.app/add-property')
    console.log('   5. أضف عقارك')

  } catch (error) {
    console.error('❌ خطأ عام في الاختبار:', error.message)
  }
}

// تشغيل الاختبار
testAddPropertyFlow()
