// 🔧 سكريبت إضافة المدير الرئيسي لقاعدة البيانات
const { createClient } = require('@supabase/supabase-js')

// إعدادات Supabase
const supabaseUrl = 'https://xmufnqzvxuowmvugmcpr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdWZucXp2eHVvd212dWdtY3ByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MzcxNTAsImV4cCI6MjA2NTExMzE1MH0.WZPhXpGdbBWzBJfPm9z2ZdZhQpmgMbJwPR2fpryHUqw'

const supabase = createClient(supabaseUrl, supabaseKey)

async function addMainAdmin() {
  try {
    console.log('🔍 جاري البحث عن المدير الرئيسي...')

    // البحث عن المدير الرئيسي
    const { data: existingAdmin, error: searchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'asdasheref@gmail.com')
      .single()

    if (existingAdmin) {
      console.log('✅ المدير الرئيسي موجود بالفعل:', existingAdmin.name)

      // تحديث بيانات المدير إذا لزم الأمر
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
        console.log('✅ تم تحديث بيانات المدير بنجاح')
      }
      return
    }

    console.log('➕ إضافة المدير الرئيسي الجديد...')

    // إضافة المدير الرئيسي
    const { data: newAdmin, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          email: 'asdasheref@gmail.com',
          name: 'المدير العام',
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
      return
    }

    console.log('✅ تم إضافة المدير الرئيسي بنجاح!')
    console.log('📧 البريد الإلكتروني: asdasheref@gmail.com')
    console.log('🔑 كلمة المرور: 0453328124')
    console.log('👤 الدور: super_admin')

  } catch (error) {
    console.error('❌ خطأ عام:', error)
  }
}

// تشغيل السكريبت
addMainAdmin()