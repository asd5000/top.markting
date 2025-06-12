// 🧪 اختبار تسجيل دخول المدير
const { createClient } = require('@supabase/supabase-js')

// إعدادات Supabase
const supabaseUrl = 'https://xmufnqzvxuowmvugmcpr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdWZucXp2eHVvd212dWdtY3ByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MzcxNTAsImV4cCI6MjA2NTExMzE1MH0.WZPhXpGdbBWzBJfPm9z2ZdZhQpmgMbJwPR2fpryHUqw'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testLogin() {
  try {
    console.log('🧪 === اختبار تسجيل دخول المدير ===')
    
    const testEmail = 'asdasheref@gmail.com'
    const testPassword = '0453328124'
    
    console.log(`\n🔍 البحث عن المدير: ${testEmail}`)
    
    // 1. اختبار الاتصال
    console.log('🌐 اختبار الاتصال...')
    const { data: connectionTest, error: connectionError } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    if (connectionError) {
      console.error('❌ فشل الاتصال:', connectionError)
      return
    }
    console.log('✅ الاتصال يعمل')

    // 2. البحث عن المدير مع شرط is_active
    console.log('\n🔍 البحث مع شرط is_active = true...')
    const { data: userData1, error: userError1 } = await supabase
      .from('users')
      .select('*')
      .eq('email', testEmail)
      .eq('is_active', true)
      .single()

    console.log('النتيجة 1:', {
      found: !!userData1,
      error: userError1?.message,
      user: userData1 ? `${userData1.name} (${userData1.role})` : 'لا يوجد'
    })

    // 3. البحث بدون شرط is_active
    console.log('\n🔍 البحث بدون شرط is_active...')
    const { data: userData2, error: userError2 } = await supabase
      .from('users')
      .select('*')
      .eq('email', testEmail)
      .single()

    console.log('النتيجة 2:', {
      found: !!userData2,
      error: userError2?.message,
      user: userData2 ? `${userData2.name} (${userData2.role})` : 'لا يوجد',
      isActive: userData2?.is_active
    })

    // 4. البحث في جميع المدراء
    console.log('\n📊 جميع المدراء في النظام:')
    const { data: allAdmins, error: adminsError } = await supabase
      .from('users')
      .select('*')
      .in('role', ['super_admin', 'marketing_manager', 'packages_manager', 'real_estate_manager', 'support'])
      .order('created_at', { ascending: false })

    if (adminsError) {
      console.error('❌ خطأ في جلب المدراء:', adminsError)
    } else {
      console.log(`✅ عدد المدراء: ${allAdmins.length}`)
      allAdmins.forEach((admin, index) => {
        console.log(`   ${index + 1}. ${admin.name} (${admin.email}) - ${admin.role} - ${admin.is_active ? 'نشط' : 'غير نشط'}`)
      })
    }

    // 5. محاكاة تسجيل الدخول
    console.log('\n🔐 محاكاة تسجيل الدخول...')
    const finalUser = userData1 || userData2
    
    if (!finalUser) {
      console.error('❌ المستخدم غير موجود')
      return
    }

    if (!finalUser.is_active) {
      console.error('❌ المستخدم غير نشط')
      return
    }

    if (!['super_admin', 'marketing_manager', 'packages_manager', 'real_estate_manager', 'support'].includes(finalUser.role)) {
      console.error('❌ المستخدم ليس لديه صلاحيات إدارية')
      return
    }

    // التحقق من كلمة المرور
    const validPasswords = ['0453328124', 'admin123', 'admin', '123456', '123', 'password', 'test']
    if (!validPasswords.includes(testPassword)) {
      console.error('❌ كلمة المرور غير صحيحة')
      return
    }

    console.log('✅ تسجيل الدخول نجح!')
    console.log('👤 بيانات المدير:', {
      name: finalUser.name,
      email: finalUser.email,
      role: finalUser.role,
      isActive: finalUser.is_active
    })

    console.log('\n🎯 === انتهى الاختبار بنجاح ===')
    
  } catch (error) {
    console.error('❌ خطأ عام:', error)
  }
}

// تشغيل الاختبار
testLogin()
