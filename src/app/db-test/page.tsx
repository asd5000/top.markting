'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function DatabaseTestPage() {
  const [status, setStatus] = useState<'testing' | 'success' | 'failed'>('testing')
  const [services, setServices] = useState<any[]>([])
  const [logs, setLogs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
    console.log(`[${timestamp}] ${message}`)
  }

  const testDatabase = async () => {
    setIsLoading(true)
    setLogs([])
    addLog('🔄 بدء اختبار قاعدة البيانات...')

    try {
      // Test 1: Environment variables
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        addLog('❌ متغيرات البيئة غير موجودة')
        setStatus('failed')
        return
      }

      addLog(`✅ متغيرات البيئة موجودة`)
      addLog(`URL: ${supabaseUrl}`)

      // Test 2: Read services
      addLog('📖 اختبار قراءة الخدمات...')
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false })

      if (servicesError) {
        addLog(`❌ خطأ في قراءة الخدمات: ${servicesError.message}`)
        setStatus('failed')
        return
      }

      addLog(`✅ تم قراءة ${servicesData?.length || 0} خدمة`)
      setServices(servicesData || [])

      // Test 3: Insert test service
      addLog('📝 اختبار إدخال خدمة جديدة...')
      const testService = {
        name_ar: `خدمة اختبار ${new Date().getTime()}`,
        name_en: `Test Service ${new Date().getTime()}`,
        description_ar: 'هذه خدمة اختبار للتحقق من الاتصال',
        description_en: 'This is a test service to verify connection',
        price: 100,
        currency: 'EGP',
        duration_text: '1 يوم',
        features: ['اختبار', 'تحقق'],
        category: 'test',
        category_name: 'اختبار',
        is_active: true
      }

      const { data: newService, error: insertError } = await supabase
        .from('services')
        .insert(testService)
        .select()
        .single()

      if (insertError) {
        addLog(`❌ خطأ في إدخال الخدمة: ${insertError.message}`)
        setStatus('failed')
        return
      }

      addLog(`✅ تم إدخال خدمة جديدة: ${newService.id}`)

      // Test 4: Update service
      addLog('🔄 اختبار تحديث الخدمة...')
      const { error: updateError } = await supabase
        .from('services')
        .update({ price: 150 })
        .eq('id', newService.id)

      if (updateError) {
        addLog(`❌ خطأ في تحديث الخدمة: ${updateError.message}`)
        setStatus('failed')
        return
      }

      addLog('✅ تم تحديث الخدمة بنجاح')

      // Test 5: Delete test service
      addLog('🗑️ اختبار حذف الخدمة...')
      const { error: deleteError } = await supabase
        .from('services')
        .delete()
        .eq('id', newService.id)

      if (deleteError) {
        addLog(`❌ خطأ في حذف الخدمة: ${deleteError.message}`)
        setStatus('failed')
        return
      }

      addLog('✅ تم حذف الخدمة بنجاح')

      // Final read
      const { data: finalData } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false })

      setServices(finalData || [])
      setStatus('success')
      addLog('🎉 جميع الاختبارات نجحت! قاعدة البيانات تعمل بشكل مثالي')

    } catch (error: any) {
      addLog(`❌ خطأ عام: ${error.message}`)
      setStatus('failed')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    testDatabase()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🔗 اختبار قاعدة البيانات - Supabase
        </h1>

        {/* Status */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">حالة الاتصال</h2>
          <div className="flex items-center">
            <div className={`w-6 h-6 rounded-full mr-3 ${
              status === 'testing' ? 'bg-yellow-500 animate-pulse' :
              status === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-lg font-medium">
              {status === 'testing' && '🔄 جاري الاختبار...'}
              {status === 'success' && '✅ قاعدة البيانات تعمل بنجاح'}
              {status === 'failed' && '❌ فشل في الاتصال'}
            </span>
          </div>
        </div>

        {/* Services */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">الخدمات المحملة ({services.length})</h2>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {services.map((service) => (
              <div key={service.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-semibold">{service.name_ar}</div>
                  <div className="text-sm text-gray-600">{service.price} {service.currency}</div>
                </div>
                <div className={`px-2 py-1 rounded text-xs ${
                  service.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {service.is_active ? 'نشط' : 'غير نشط'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logs */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">سجل الاختبارات</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="mb-1">{log}</div>
            ))}
          </div>
        </div>

        {/* Test Button */}
        <div className="mt-6 text-center">
          <button
            onClick={testDatabase}
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? '🔄 جاري الاختبار...' : '🔄 إعادة اختبار'}
          </button>
        </div>
      </div>
    </div>
  )
}
