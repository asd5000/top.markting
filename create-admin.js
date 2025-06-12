const { createClient } = require('@supabase/supabase-js')

// إعدادات Supabase
const supabaseUrl = 'https://xmufnqzvxuowmvugmcpr.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdWZucXp2eHVvd212dWdtY3ByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MzcxNTAsImV4cCI6MjA2NTExMzE1MH0.WZPhXpGdbBWzBJfPm9z2ZdZhQpmgMbJwPR2fpryHUqw'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdminUser() {
  console.log('🚀 بدء إنشاء المدير الرئيسي...')
  
  const adminEmail = 'asdasheref@gmail.com'
  const adminPassword = '0453328124'
  const adminName = 'أشرف الشريف'
  
  try {
    // 1. إنشاء المستخدم في Supabase Auth
    console.log('📝 إنشاء المستخدم في نظام المصادقة...')

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          name: adminName
        }
      }
    })

    if (authError) {
      console.error('❌ خطأ في إنشاء المستخدم:', authError.message)
      return
    }

    console.log('✅ تم إنشاء المستخدم في نظام المصادقة')
    console.log('👤 معرف المستخدم:', authData.user.id)

    // 2. إضافة المستخدم إلى جدول users
    console.log('📊 إضافة المستخدم إلى قاعدة البيانات...')
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          email: adminEmail,
          name: adminName,
          role: 'super_admin',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()

    if (userError) {
      console.error('❌ خطأ في إضافة المستخدم لقاعدة البيانات:', userError.message)
      
      // محاولة حذف المستخدم من Auth إذا فشل إدراجه في قاعدة البيانات
      console.log('🗑️ لا يمكن حذف المستخدم من نظام المصادقة')
      return
    }

    console.log('✅ تم إضافة المستخدم إلى قاعدة البيانات')

    // 3. التحقق من البيانات
    console.log('🔍 التحقق من البيانات...')
    
    const { data: verifyData, error: verifyError } = await supabase
      .from('users')
      .select('*')
      .eq('email', adminEmail)
      .single()

    if (verifyError) {
      console.error('❌ خطأ في التحقق:', verifyError.message)
      return
    }

    console.log('✅ تم التحقق من البيانات بنجاح')
    console.log('📋 بيانات المدير:')
    console.log('   📧 البريد الإلكتروني:', verifyData.email)
    console.log('   👤 الاسم:', verifyData.name)
    console.log('   🔑 الدور:', verifyData.role)
    console.log('   ✅ نشط:', verifyData.is_active)
    console.log('   📅 تاريخ الإنشاء:', verifyData.created_at)

    console.log('\n🎉 تم إنشاء المدير الرئيسي بنجاح!')
    console.log('🔐 بيانات تسجيل الدخول:')
    console.log('   📧 البريد الإلكتروني: asdasheref@gmail.com')
    console.log('   🔑 كلمة المرور: 0453328124')
    console.log('   🌐 رابط لوحة التحكم: http://localhost:3001/لوحة%20التحكم%20-%20admin')

  } catch (error) {
    console.error('❌ خطأ عام:', error.message)
  }
}

// تشغيل الدالة
createAdminUser()
  .then(() => {
    console.log('\n✨ انتهت العملية')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 خطأ في تشغيل السكريبت:', error)
    process.exit(1)
  })
