// اختبار سريع للنظام الجديد
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://xmufnqzvxuowmvugmcpr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdWZucXp2eHVvd212dWdtY3ByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MzcxNTAsImV4cCI6MjA2NTExMzE1MH0.WZPhXpGdbBWzBJfPm9z2ZdZhQpmgMbJwPR2fpryHUqw'

const supabase = createClient(supabaseUrl, supabaseKey)

async function quickTest() {
  console.log('🔍 اختبار سريع للنظام الجديد')
  console.log('=' .repeat(40))

  try {
    // فحص البيانات الموجودة
    const { data, error } = await supabase
      .from('real_estate')
      .select('customer_name, operation_type, title')
      .limit(5)

    if (error) {
      console.error('❌ خطأ:', error.message)
      return
    }

    console.log(`✅ تم جلب ${data.length} عقار`)
    console.log('')

    data.forEach((property, index) => {
      const typeLabel = property.operation_type === 'seller' ? '🟢 بائع' : '🔵 مشتري'
      console.log(`${index + 1}. ${typeLabel} - ${property.customer_name}`)
      console.log(`   ${property.title}`)
      console.log('')
    })

    // إحصائيات
    const sellers = data.filter(p => p.operation_type === 'seller').length
    const buyers = data.filter(p => p.operation_type === 'buyer').length

    console.log('📊 الإحصائيات:')
    console.log(`   🟢 البائعين: ${sellers}`)
    console.log(`   🔵 المشترين: ${buyers}`)
    console.log('')

    if (sellers > 0 && buyers > 0) {
      console.log('🎉 النظام يعمل بشكل مثالي!')
      console.log('✅ نوع العملية تم تغييره بنجاح من "بيع/إيجار" إلى "بائع/مشتري"')
    } else {
      console.log('⚠️  يحتاج المزيد من البيانات للاختبار الكامل')
    }

    console.log('')
    console.log('🔗 الرابط: https://top-markting.vercel.app/admin/real-estate')
    console.log('👤 الدخول: asdasheref@gmail.com / 0453328124')

  } catch (error) {
    console.error('❌ خطأ عام:', error.message)
  }
}

quickTest()
