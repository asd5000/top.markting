'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function SetupDatabasePage() {
  const [status, setStatus] = useState<'ready' | 'creating' | 'success' | 'error'>('ready')
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const createTables = async () => {
    setStatus('creating')
    setLogs([])
    addLog('🚀 بدء إنشاء الجداول...')

    try {
      // إنشاء جدول الخدمات
      addLog('📊 إنشاء جدول الخدمات...')
      
      const { error: createError } = await supabase.rpc('create_services_table', {})
      
      if (createError) {
        // إذا فشل RPC، نجرب الطريقة المباشرة
        addLog('⚠️ جاري المحاولة بطريقة مختلفة...')
        
        // محاولة إنشاء الجدول مباشرة
        const { error: directError } = await supabase
          .from('services')
          .select('*')
          .limit(1)
        
        if (directError && directError.message.includes('relation "services" does not exist')) {
          addLog('❌ جدول الخدمات غير موجود - يحتاج إنشاء يدوي')
          setStatus('error')
          return
        }
      }

      // اختبار إدخال بيانات تجريبية
      addLog('📝 إدخال بيانات تجريبية...')
      
      const testServices = [
        {
          name_ar: 'تصميم شعار احترافي',
          name_en: 'Professional Logo Design',
          description_ar: 'تصميم شعار احترافي يعكس هوية علامتك التجارية',
          description_en: 'Professional logo design that reflects your brand identity',
          price: 500.00,
          currency: 'EGP',
          duration_text: '2-3 أيام',
          features: ['تصميم احترافي', '3 مراجعات مجانية', 'ملفات عالية الجودة'],
          category: 'design',
          category_name: 'التصميم',
          is_active: true,
          is_featured: true
        },
        {
          name_ar: 'إدارة حسابات التواصل الاجتماعي',
          name_en: 'Social Media Management',
          description_ar: 'إدارة شاملة لحساباتك على منصات التواصل الاجتماعي',
          description_en: 'Comprehensive management of your social media accounts',
          price: 1200.00,
          currency: 'EGP',
          duration_text: '30 يوم',
          features: ['إدارة يومية', 'محتوى إبداعي', 'تقارير شهرية'],
          category: 'marketing',
          category_name: 'التسويق',
          is_active: true,
          is_featured: true
        },
        {
          name_ar: 'مونتاج فيديو احترافي',
          name_en: 'Professional Video Editing',
          description_ar: 'مونتاج فيديو احترافي بأعلى جودة مع مؤثرات بصرية',
          description_en: 'Professional video editing with highest quality and visual effects',
          price: 800.00,
          currency: 'EGP',
          duration_text: '5-7 أيام',
          features: ['مونتاج احترافي', 'مؤثرات بصرية', 'موسيقى مجانية'],
          category: 'video-editing',
          category_name: 'مونتاج الفيديو',
          is_active: true,
          is_featured: false
        }
      ]

      const { data, error: insertError } = await supabase
        .from('services')
        .insert(testServices)
        .select()

      if (insertError) {
        addLog(`❌ خطأ في إدخال البيانات: ${insertError.message}`)
        setStatus('error')
        return
      }

      addLog(`✅ تم إدخال ${data?.length || 0} خدمة بنجاح`)
      addLog('🎉 تم إعداد قاعدة البيانات بنجاح!')
      setStatus('success')

    } catch (error: any) {
      addLog(`❌ خطأ عام: ${error.message}`)
      setStatus('error')
    }
  }

  const testConnection = async () => {
    addLog('🔍 اختبار الاتصال...')
    
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .limit(5)

      if (error) {
        addLog(`❌ خطأ في الاتصال: ${error.message}`)
        return
      }

      addLog(`✅ تم العثور على ${data?.length || 0} خدمة`)
      
      if (data && data.length > 0) {
        data.forEach((service, index) => {
          addLog(`${index + 1}. ${service.name_ar} - ${service.price} ${service.currency}`)
        })
      }

    } catch (error: any) {
      addLog(`❌ خطأ في الاختبار: ${error.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🛠️ إعداد قاعدة البيانات
        </h1>

        {/* Status */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">حالة الإعداد</h2>
          <div className="flex items-center">
            <div className={`w-6 h-6 rounded-full mr-3 ${
              status === 'ready' ? 'bg-blue-500' :
              status === 'creating' ? 'bg-yellow-500 animate-pulse' :
              status === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-lg font-medium">
              {status === 'ready' && '🔵 جاهز للإعداد'}
              {status === 'creating' && '🔄 جاري الإعداد...'}
              {status === 'success' && '✅ تم الإعداد بنجاح'}
              {status === 'error' && '❌ حدث خطأ في الإعداد'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">الإجراءات</h2>
          <div className="space-x-4 space-x-reverse">
            <button
              onClick={createTables}
              disabled={status === 'creating'}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {status === 'creating' ? '🔄 جاري الإعداد...' : '🚀 إعداد قاعدة البيانات'}
            </button>
            
            <button
              onClick={testConnection}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              🔍 اختبار الاتصال
            </button>
          </div>
        </div>

        {/* Logs */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">سجل العمليات</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500">لا توجد عمليات بعد...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">{log}</div>
              ))
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">📋 تعليمات مهمة:</h3>
          <div className="text-yellow-700 space-y-2">
            <p>1. إذا فشل الإعداد التلقائي، ستحتاج لإنشاء الجداول يدوياً في Supabase</p>
            <p>2. اذهب إلى: <code className="bg-yellow-100 px-2 py-1 rounded">https://supabase.com/dashboard/project/xanzptntwwmpulqutoiv/editor</code></p>
            <p>3. أنشئ جدول جديد باسم "services" مع الأعمدة المطلوبة</p>
            <p>4. ثم عد هنا واضغط "اختبار الاتصال"</p>
          </div>
        </div>
      </div>
    </div>
  )
}
