// اختبار صفحات لوحة التحكم
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://xmufnqzvxuowmvugmcpr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdWZucXp2eHVvd212dWdtY3ByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MzcxNTAsImV4cCI6MjA2NTExMzE1MH0.WZPhXpGdbBWzBJfPm9z2ZdZhQpmgMbJwPR2fpryHUqw'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testAdminPages() {
  console.log('🔧 اختبار صفحات لوحة التحكم')
  console.log('=' .repeat(50))

  const adminPages = [
    { name: 'تسجيل الدخول', url: '/admin/login', shouldWork: true },
    { name: 'لوحة التحكم', url: '/admin/dashboard', shouldWork: false },
    { name: 'النسخ الاحتياطية', url: '/admin/backup', shouldWork: false },
    { name: 'إدارة الخدمات', url: '/admin/services', shouldWork: false },
    { name: 'إدارة الباقات', url: '/admin/packages', shouldWork: false },
    { name: 'إعدادات الموقع', url: '/admin/site-settings', shouldWork: false }
  ]

  try {
    console.log('1️⃣ اختبار الوصول لصفحات لوحة التحكم...')
    console.log('')

    for (const page of adminPages) {
      try {
        const response = await fetch(`https://top-markting.vercel.app${page.url}`)
        const html = await response.text()
        
        const is404 = html.includes('404') || html.includes('This page could not be found')
        const hasLoginForm = html.includes('تسجيل الدخول') || html.includes('البريد الإلكتروني')
        const hasRedirect = html.includes('إعادة التوجيه') || html.includes('جاري التحقق')
        
        let status = '❌ خطأ'
        let details = ''
        
        if (page.shouldWork) {
          if (!is404 && hasLoginForm) {
            status = '✅ يعمل'
            details = 'صفحة تسجيل الدخول تعمل بشكل طبيعي'
          } else if (is404) {
            status = '❌ 404'
            details = 'صفحة غير موجودة'
          }
        } else {
          if (hasLoginForm) {
            status = '✅ إعادة توجيه'
            details = 'تم إعادة التوجيه لصفحة تسجيل الدخول'
          } else if (hasRedirect) {
            status = '⚠️ تحميل'
            details = 'في حالة تحميل/إعادة توجيه'
          } else if (is404) {
            status = '❌ 404'
            details = 'صفحة غير موجودة'
          }
        }
        
        console.log(`   ${page.name}: ${status}`)
        console.log(`      الرابط: ${page.url}`)
        console.log(`      التفاصيل: ${details}`)
        console.log('')
        
      } catch (error) {
        console.log(`   ${page.name}: ❌ خطأ في الاتصال`)
        console.log(`      الخطأ: ${error.message}`)
        console.log('')
      }
    }

    // 2. اختبار تسجيل دخول إداري
    console.log('2️⃣ اختبار تسجيل دخول إداري...')
    
    const adminCredentials = {
      email: 'asdasheref@gmail.com',
      password: '0453328124'
    }

    // التحقق من وجود المدير في قاعدة البيانات
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('email', adminCredentials.email)
      .eq('is_active', true)
      .single()

    if (adminError) {
      console.log('❌ خطأ في جلب بيانات المدير:', adminError.message)
    } else if (adminData) {
      console.log('✅ المدير موجود في قاعدة البيانات')
      console.log(`   الاسم: ${adminData.name}`)
      console.log(`   البريد: ${adminData.email}`)
      console.log(`   الدور: ${adminData.role}`)
      console.log(`   نشط: ${adminData.is_active ? 'نعم' : 'لا'}`)
    } else {
      console.log('❌ المدير غير موجود في قاعدة البيانات')
    }
    console.log('')

    // 3. اختبار بنية الملفات
    console.log('3️⃣ فحص بنية الملفات...')
    
    const fs = require('fs')
    const path = require('path')
    
    const adminFiles = [
      'src/app/admin/layout.tsx',
      'src/app/admin/backup/page.tsx',
      'src/app/admin/dashboard/page.tsx',
      'src/app/admin/login/page.tsx',
      'src/components/admin/BackupSettings.tsx',
      'src/components/admin/BackupReport.tsx'
    ]

    for (const filePath of adminFiles) {
      try {
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath)
          console.log(`   ✅ ${filePath} (${Math.round(stats.size / 1024)} KB)`)
        } else {
          console.log(`   ❌ ${filePath} - غير موجود`)
        }
      } catch (error) {
        console.log(`   ❌ ${filePath} - خطأ: ${error.message}`)
      }
    }
    console.log('')

    // 4. اختبار الصفحة الرئيسية للمقارنة
    console.log('4️⃣ اختبار الصفحة الرئيسية للمقارنة...')
    
    try {
      const response = await fetch('https://top-markting.vercel.app/')
      const html = await response.text()
      
      const is404 = html.includes('404')
      const hasContent = html.includes('Top Marketing') || html.includes('خدماتنا')
      
      if (!is404 && hasContent) {
        console.log('   ✅ الصفحة الرئيسية تعمل بشكل طبيعي')
        console.log('   📝 هذا يعني أن المشكلة محددة في صفحات لوحة التحكم')
      } else {
        console.log('   ❌ الصفحة الرئيسية لا تعمل أيضاً')
        console.log('   📝 قد تكون مشكلة عامة في النشر')
      }
    } catch (error) {
      console.log('   ❌ خطأ في الوصول للصفحة الرئيسية:', error.message)
    }
    console.log('')

    // 5. ملخص التشخيص
    console.log('📋 ملخص تشخيص مشكلة لوحة التحكم:')
    console.log('=' .repeat(50))
    
    console.log('🔍 المشكلة المحتملة:')
    console.log('   1. مشكلة في Next.js routing لصفحات لوحة التحكم')
    console.log('   2. مشكلة في layout.tsx تمنع عرض المحتوى')
    console.log('   3. مشكلة في نشر Vercel للمجلدات الفرعية')
    console.log('   4. مشكلة في middleware أو حماية الصفحات')
    console.log('')
    
    console.log('✅ الحلول المقترحة:')
    console.log('   1. التأكد من أن جميع الملفات موجودة في المكان الصحيح')
    console.log('   2. إضافة console.log في layout.tsx للتشخيص')
    console.log('   3. إنشاء صفحة اختبار بسيطة في /admin/test')
    console.log('   4. فحص logs النشر في Vercel')
    console.log('')
    
    console.log('🌐 للاختبار اليدوي:')
    console.log('   1. اذهب إلى: https://top-markting.vercel.app/admin/login')
    console.log('   2. سجل دخول بالبيانات: asdasheref@gmail.com / 0453328124')
    console.log('   3. جرب الوصول لصفحة النسخ الاحتياطية')
    console.log('   4. إذا لم تعمل، فالمشكلة في الكود وليس في التحديث')

  } catch (error) {
    console.error('❌ خطأ عام في الاختبار:', error.message)
  }
}

// تشغيل الاختبار
testAdminPages()
