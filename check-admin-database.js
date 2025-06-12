// 🔍 فحص شامل لقاعدة البيانات والمدراء
const { createClient } = require('@supabase/supabase-js')

// إعدادات Supabase
const supabaseUrl = 'https://xmufnqzvxuowmvugmcpr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdWZucXp2eHVvd212dWdtY3ByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MzcxNTAsImV4cCI6MjA2NTExMzE1MH0.WZPhXpGdbBWzBJfPm9z2ZdZhQpmgMbJwPR2fpryHUqw'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkDatabase() {
  try {
    console.log('🔍 === فحص شامل لقاعدة البيانات ===')
    
    // 1. فحص جدول users
    console.log('\n📊 1. فحص جدول users:')
    const { data: allUsers, error: usersError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (usersError) {
      console.error('❌ خطأ في جدول users:', usersError)
    } else {
      console.log(`✅ عدد المستخدمين: ${allUsers.length}`)
      allUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name} (${user.email}) - ${user.role} - ${user.is_active ? 'نشط' : 'غير نشط'}`)
      })
    }

    // 2. البحث عن المدير المطلوب
    console.log('\n🔍 2. البحث عن المدير المطلوب:')
    const { data: targetAdmin, error: targetError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'asdasheref@gmail.com')
      .single()

    if (targetError) {
      console.log('❌ المدير غير موجود:', targetError.message)
      
      // إضافة المدير
      console.log('➕ إضافة المدير الجديد...')
      const { data: newAdmin, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            email: 'asdasheref@gmail.com',
            name: 'أشرف الشريف',
            phone: '01068275557',
            role: 'super_admin',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()

      if (insertError) {
        console.error('❌ خطأ في إضافة المدير:', insertError)
      } else {
        console.log('✅ تم إضافة المدير بنجاح!')
      }
    } else {
      console.log('✅ المدير موجود:', targetAdmin.name, '- الدور:', targetAdmin.role, '- نشط:', targetAdmin.is_active)
      
      // تحديث بيانات المدير للتأكد
      const { error: updateError } = await supabase
        .from('users')
        .update({
          role: 'super_admin',
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('email', 'asdasheref@gmail.com')

      if (updateError) {
        console.error('❌ خطأ في تحديث المدير:', updateError)
      } else {
        console.log('✅ تم تحديث بيانات المدير')
      }
    }

    // 3. فحص جدول admins (إذا كان موجود)
    console.log('\n📊 3. فحص جدول admins:')
    const { data: adminsData, error: adminsError } = await supabase
      .from('admins')
      .select('*')

    if (adminsError) {
      console.log('ℹ️ جدول admins غير موجود أو فارغ:', adminsError.message)
    } else {
      console.log(`✅ عدد المدراء في جدول admins: ${adminsData.length}`)
      adminsData.forEach((admin, index) => {
        console.log(`   ${index + 1}. ${admin.name} (${admin.email}) - ${admin.role}`)
      })
    }

    // 4. اختبار الاتصال
    console.log('\n🌐 4. اختبار الاتصال:')
    const { data: connectionTest, error: connectionError } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    if (connectionError) {
      console.error('❌ مشكلة في الاتصال:', connectionError)
    } else {
      console.log('✅ الاتصال بقاعدة البيانات يعمل بشكل صحيح')
    }

    console.log('\n🎯 === انتهى الفحص ===')
    
  } catch (error) {
    console.error('❌ خطأ عام:', error)
  }
}

// تشغيل الفحص
checkDatabase()
