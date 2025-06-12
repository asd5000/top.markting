'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestAdminPage() {
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const addResult = (message: string) => {
    setResults(prev => [...prev, message])
    console.log(message)
  }

  const testDatabase = async () => {
    setLoading(true)
    setResults([])
    
    try {
      addResult('🧪 === بدء اختبار قاعدة البيانات ===')
      
      const testEmail = 'asdasheref@gmail.com'
      
      // 1. اختبار الاتصال
      addResult('🌐 اختبار الاتصال...')
      const { data: connectionTest, error: connectionError } = await supabase
        .from('users')
        .select('count')
        .limit(1)

      if (connectionError) {
        addResult(`❌ فشل الاتصال: ${connectionError.message}`)
        return
      }
      addResult('✅ الاتصال يعمل')

      // 2. البحث عن المدير مع شرط is_active
      addResult(`🔍 البحث عن المدير: ${testEmail}`)
      const { data: userData1, error: userError1 } = await supabase
        .from('users')
        .select('*')
        .eq('email', testEmail)
        .eq('is_active', true)
        .single()

      addResult(`النتيجة مع is_active=true: ${userData1 ? `✅ موجود - ${userData1.name} (${userData1.role})` : `❌ غير موجود - ${userError1?.message}`}`)

      // 3. البحث بدون شرط is_active
      const { data: userData2, error: userError2 } = await supabase
        .from('users')
        .select('*')
        .eq('email', testEmail)
        .single()

      addResult(`النتيجة بدون شرط is_active: ${userData2 ? `✅ موجود - ${userData2.name} (${userData2.role}) - نشط: ${userData2.is_active}` : `❌ غير موجود - ${userError2?.message}`}`)

      // 4. جميع المدراء
      addResult('📊 جميع المدراء في النظام:')
      const { data: allAdmins, error: adminsError } = await supabase
        .from('users')
        .select('*')
        .in('role', ['super_admin', 'marketing_manager', 'packages_manager', 'real_estate_manager', 'support'])
        .order('created_at', { ascending: false })

      if (adminsError) {
        addResult(`❌ خطأ في جلب المدراء: ${adminsError.message}`)
      } else {
        addResult(`✅ عدد المدراء: ${allAdmins.length}`)
        allAdmins.forEach((admin, index) => {
          addResult(`   ${index + 1}. ${admin.name} (${admin.email}) - ${admin.role} - ${admin.is_active ? 'نشط' : 'غير نشط'}`)
        })
      }

      // 5. محاكاة تسجيل الدخول
      addResult('🔐 محاكاة تسجيل الدخول...')
      const finalUser = userData1 || userData2
      
      if (!finalUser) {
        addResult('❌ المستخدم غير موجود')
        return
      }

      if (!finalUser.is_active) {
        addResult('❌ المستخدم غير نشط')
        return
      }

      if (!['super_admin', 'marketing_manager', 'packages_manager', 'real_estate_manager', 'support'].includes(finalUser.role)) {
        addResult('❌ المستخدم ليس لديه صلاحيات إدارية')
        return
      }

      addResult('✅ تسجيل الدخول يجب أن ينجح!')
      addResult(`👤 بيانات المدير: ${finalUser.name} (${finalUser.email}) - ${finalUser.role}`)

      addResult('🎯 === انتهى الاختبار ===')
      
    } catch (error: any) {
      addResult(`❌ خطأ عام: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">🧪 اختبار قاعدة البيانات والمدراء</h1>
          
          <button
            onClick={testDatabase}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-6"
          >
            {loading ? 'جاري الاختبار...' : 'بدء الاختبار'}
          </button>

          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <div className="text-gray-500">اضغط "بدء الاختبار" لبدء فحص قاعدة البيانات</div>
            ) : (
              results.map((result, index) => (
                <div key={index} className="mb-1">
                  {result}
                </div>
              ))
            )}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-bold text-blue-900 mb-2">🔑 بيانات تسجيل الدخول المطلوبة:</h3>
            <p><strong>البريد الإلكتروني:</strong> asdasheref@gmail.com</p>
            <p><strong>كلمة المرور:</strong> 0453328124</p>
          </div>
        </div>
      </div>
    </div>
  )
}
