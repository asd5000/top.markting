// اختبار التسجيل التلقائي بدون تأكيد البريد الإلكتروني
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://xmufnqzvxuowmvugmcpr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdWZucXp2eHVvd212dWdtY3ByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MzcxNTAsImV4cCI6MjA2NTExMzE1MH0.WZPhXpGdbBWzBJfPm9z2ZdZhQpmgMbJwPR2fpryHUqw'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testAutoLogin() {
  console.log('🔐 اختبار التسجيل التلقائي بدون تأكيد البريد الإلكتروني')
  console.log('=' .repeat(60))

  // بيانات مستخدم تجريبي
  const testUser = {
    email: `test${Date.now()}@example.com`,
    password: 'test123456',
    name: 'مستخدم تجريبي',
    phone: '01234567890'
  }

  try {
    // 1. اختبار إنشاء حساب جديد
    console.log('1️⃣ اختبار إنشاء حساب جديد...')
    console.log(`   البريد: ${testUser.email}`)
    console.log(`   كلمة المرور: ${testUser.password}`)
    console.log('')

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
    console.log(`   البريد: ${signUpData.user?.email}`)
    console.log(`   مؤكد: ${signUpData.user?.email_confirmed_at ? 'نعم' : 'لا'}`)
    console.log(`   الجلسة: ${signUpData.session ? 'موجودة' : 'غير موجودة'}`)
    console.log('')

    // 2. التحقق من حالة الجلسة
    console.log('2️⃣ التحقق من حالة الجلسة...')
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      console.error('❌ خطأ في جلب الجلسة:', sessionError.message)
    } else if (sessionData.session) {
      console.log('✅ الجلسة نشطة - المستخدم مسجل دخول تلقائياً!')
      console.log(`   User ID: ${sessionData.session.user.id}`)
      console.log(`   البريد: ${sessionData.session.user.email}`)
    } else {
      console.log('⚠️ لا توجد جلسة نشطة')
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

    // 4. اختبار تسجيل الدخول مباشرة
    console.log('4️⃣ اختبار تسجيل الدخول مباشرة...')
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: testUser.email,
      password: testUser.password
    })

    if (loginError) {
      console.error('❌ خطأ في تسجيل الدخول:', loginError.message)
    } else {
      console.log('✅ تم تسجيل الدخول بنجاح!')
      console.log(`   User ID: ${loginData.user?.id}`)
      console.log(`   البريد: ${loginData.user?.email}`)
      console.log(`   الجلسة: ${loginData.session ? 'موجودة' : 'غير موجودة'}`)
    }
    console.log('')

    // 5. تنظيف البيانات التجريبية
    console.log('5️⃣ تنظيف البيانات التجريبية...')
    
    // حذف من جدول users
    if (signUpData.user) {
      const { error: deleteUserError } = await supabase
        .from('users')
        .delete()
        .eq('id', signUpData.user.id)

      if (deleteUserError) {
        console.error('❌ خطأ في حذف بيانات المستخدم:', deleteUserError.message)
      } else {
        console.log('✅ تم حذف بيانات المستخدم من جدول users')
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
    console.log('📋 ملخص اختبار التسجيل التلقائي:')
    console.log('=' .repeat(60))
    
    if (signUpData.session) {
      console.log('🎉 النظام يعمل بشكل مثالي!')
      console.log('✅ إنشاء الحساب: يعمل')
      console.log('✅ تسجيل الدخول التلقائي: يعمل')
      console.log('✅ لا يحتاج تأكيد البريد الإلكتروني: صحيح')
      console.log('')
      console.log('🔗 يمكن للمستخدمين الآن:')
      console.log('   - إنشاء حساب جديد')
      console.log('   - الدخول مباشرة بدون تأكيد البريد')
      console.log('   - استخدام الموقع فوراً')
    } else {
      console.log('⚠️ يحتاج مراجعة - لم يتم تسجيل الدخول التلقائي')
    }

    console.log('')
    console.log('🌐 للاختبار على الموقع:')
    console.log('   https://top-markting.vercel.app/register')
    console.log('   https://top-markting.vercel.app/visitor-login')

  } catch (error) {
    console.error('❌ خطأ عام في الاختبار:', error.message)
  }
}

// تشغيل الاختبار
testAutoLogin()
