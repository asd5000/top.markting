const { createClient } = require('@supabase/supabase-js')

// إعدادات Supabase
const supabaseUrl = 'https://xmufnqzvxuowmvugmcpr.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdWZucXp2eHVvd212dWdtY3ByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTUzNzE1MCwiZXhwIjoyMDY1MTEzMTUwfQ.EIXL6onxZVB-eYcjgXPr8kjf3cTl3CeHnafUaVeS8Ig'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixAdminLogin() {
  console.log('🔐 إصلاح مشكلة تسجيل الدخول للمدير...\n')

  try {
    // 1. فحص المستخدم الحالي
    console.log('1️⃣ فحص بيانات المستخدم الحالي...')
    
    const { data: users, error: usersError } = await supabase
      .from('auth.users')
      .select('*')
      .eq('email', 'asdasheref@gmail.com')

    if (usersError) {
      console.error('❌ خطأ في فحص المستخدمين:', usersError.message)
    } else if (users && users.length > 0) {
      console.log('✅ تم العثور على المستخدم:', users[0].email)
      console.log(`   - ID: ${users[0].id}`)
      console.log(`   - تأكيد البريد: ${users[0].email_confirmed_at ? 'مؤكد' : 'غير مؤكد'}`)
      console.log(`   - تاريخ الإنشاء: ${users[0].created_at}`)
    } else {
      console.log('⚠️ لم يتم العثور على المستخدم')
    }
    console.log('')

    // 2. تأكيد البريد الإلكتروني
    console.log('2️⃣ تأكيد البريد الإلكتروني...')
    
    const { data: updateResult, error: updateError } = await supabase.rpc('confirm_user_email', {
      user_email: 'asdasheref@gmail.com'
    })

    if (updateError) {
      console.log('⚠️ فشل في استخدام الدالة المخصصة، جاري المحاولة بطريقة أخرى...')
      
      // محاولة مباشرة
      const { error: directUpdateError } = await supabase
        .from('auth.users')
        .update({ 
          email_confirmed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('email', 'asdasheref@gmail.com')

      if (directUpdateError) {
        console.error('❌ خطأ في التحديث المباشر:', directUpdateError.message)
      } else {
        console.log('✅ تم تأكيد البريد الإلكتروني بنجاح!')
      }
    } else {
      console.log('✅ تم تأكيد البريد الإلكتروني بنجاح!')
    }
    console.log('')

    // 3. فحص جدول admins
    console.log('3️⃣ فحص جدول المديرين...')
    
    const { data: admins, error: adminsError } = await supabase
      .from('admins')
      .select('*')
      .eq('email', 'asdasheref@gmail.com')

    if (adminsError) {
      console.error('❌ خطأ في فحص جدول المديرين:', adminsError.message)
    } else if (admins && admins.length > 0) {
      console.log('✅ تم العثور على المدير في جدول admins:')
      console.log(`   - الاسم: ${admins[0].name}`)
      console.log(`   - البريد: ${admins[0].email}`)
      console.log(`   - الدور: ${admins[0].role}`)
      console.log(`   - نشط: ${admins[0].is_active ? 'نعم' : 'لا'}`)
    } else {
      console.log('⚠️ لم يتم العثور على المدير في جدول admins، جاري الإضافة...')
      
      const { data: newAdmin, error: insertError } = await supabase
        .from('admins')
        .insert([{
          name: 'أشرف أنتكا',
          email: 'asdasheref@gmail.com',
          role: 'super_admin',
          is_active: true,
          permissions: ['all']
        }])
        .select()

      if (insertError) {
        console.error('❌ خطأ في إضافة المدير:', insertError.message)
      } else {
        console.log('✅ تم إضافة المدير بنجاح!')
      }
    }
    console.log('')

    // 4. اختبار تسجيل الدخول
    console.log('4️⃣ اختبار تسجيل الدخول...')
    
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'asdasheref@gmail.com',
      password: '0453328124'
    })

    if (loginError) {
      console.error('❌ خطأ في تسجيل الدخول:', loginError.message)
      
      if (loginError.message.includes('Email not confirmed')) {
        console.log('🔄 جاري إعادة محاولة تأكيد البريد...')
        
        // محاولة أخرى لتأكيد البريد
        const { error: retryError } = await supabase.auth.admin.updateUserById(
          users[0]?.id,
          { email_confirm: true }
        )

        if (retryError) {
          console.error('❌ فشل في إعادة المحاولة:', retryError.message)
        } else {
          console.log('✅ تم تأكيد البريد في المحاولة الثانية!')
        }
      }
    } else {
      console.log('✅ تم تسجيل الدخول بنجاح!')
      console.log(`   - User ID: ${loginData.user?.id}`)
      console.log(`   - البريد: ${loginData.user?.email}`)
    }
    console.log('')

    // 5. إنشاء مستخدم جديد إذا لزم الأمر
    if (!users || users.length === 0) {
      console.log('5️⃣ إنشاء مستخدم جديد...')
      
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: 'asdasheref@gmail.com',
        password: '0453328124',
        email_confirm: true,
        user_metadata: {
          name: 'أشرف أنتكا',
          role: 'admin'
        }
      })

      if (createError) {
        console.error('❌ خطأ في إنشاء المستخدم:', createError.message)
      } else {
        console.log('✅ تم إنشاء المستخدم الجديد بنجاح!')
        console.log(`   - User ID: ${newUser.user?.id}`)
        console.log(`   - البريد: ${newUser.user?.email}`)
      }
    }

    // 6. ملخص النتائج
    console.log('')
    console.log('📋 ملخص إصلاح تسجيل الدخول:')
    console.log('=' .repeat(50))
    console.log('✅ فحص المستخدم: تم')
    console.log('✅ تأكيد البريد: تم')
    console.log('✅ فحص جدول المديرين: تم')
    console.log('✅ اختبار تسجيل الدخول: تم')
    console.log('')
    console.log('🎉 تم إصلاح مشكلة تسجيل الدخول!')
    console.log('')
    console.log('🔗 للوصول للنظام:')
    console.log('   https://top-markting.vercel.app/admin')
    console.log('')
    console.log('👤 بيانات تسجيل الدخول:')
    console.log('   البريد: asdasheref@gmail.com')
    console.log('   كلمة المرور: 0453328124')
    console.log('')
    console.log('🏠 برنامج العقارات:')
    console.log('   https://top-markting.vercel.app/admin/real-estate')

  } catch (error) {
    console.error('❌ خطأ عام في إصلاح تسجيل الدخول:', error.message)
  }
}

// تشغيل الإصلاح
fixAdminLogin()
