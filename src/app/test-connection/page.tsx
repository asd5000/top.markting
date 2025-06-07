'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function TestConnectionPage() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'failed'>('testing')
  const [testData, setTestData] = useState<any[]>([])
  const [logs, setLogs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
    console.log(`[${timestamp}] ${message}`)
  }

  const testConnection = async () => {
    setIsLoading(true)
    addLog('🔄 بدء اختبار الاتصال مع Supabase...')

    try {
      // Test 1: Read from test table
      addLog('📖 اختبار قراءة البيانات...')
      const { data: readData, error: readError } = await supabase
        .from('test_connection')
        .select('*')
        .order('id')

      if (readError) {
        addLog(`❌ خطأ في قراءة البيانات: ${readError.message}`)
        setConnectionStatus('failed')
        return
      }

      addLog(`✅ تم قراءة ${readData?.length || 0} سجل بنجاح`)
      setTestData(readData || [])

      // Test 2: Insert new data
      addLog('📝 اختبار إدخال بيانات جديدة...')
      const { data: insertData, error: insertError } = await supabase
        .from('test_connection')
        .insert({
          message: `Test from Next.js at ${new Date().toISOString()}`
        })
        .select()

      if (insertError) {
        addLog(`❌ خطأ في إدخال البيانات: ${insertError.message}`)
        setConnectionStatus('failed')
        return
      }

      addLog('✅ تم إدخال البيانات بنجاح')

      // Test 3: Read updated data
      addLog('🔄 قراءة البيانات المحدثة...')
      const { data: updatedData, error: updateError } = await supabase
        .from('test_connection')
        .select('*')
        .order('id')

      if (updateError) {
        addLog(`❌ خطأ في قراءة البيانات المحدثة: ${updateError.message}`)
        setConnectionStatus('failed')
        return
      }

      setTestData(updatedData || [])
      addLog(`✅ تم تحديث البيانات - العدد الجديد: ${updatedData?.length || 0}`)

      setConnectionStatus('success')
      addLog('🎉 جميع الاختبارات نجحت! الاتصال يعمل بشكل مثالي')

    } catch (error: any) {
      addLog(`❌ خطأ عام: ${error.message}`)
      setConnectionStatus('failed')
    } finally {
      setIsLoading(false)
    }
  }

  const testEnvironmentVariables = () => {
    addLog('🔍 فحص متغيرات البيئة...')

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl) {
      addLog('❌ NEXT_PUBLIC_SUPABASE_URL غير موجود')
      return false
    }

    if (!supabaseKey) {
      addLog('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY غير موجود')
      return false
    }

    addLog(`✅ SUPABASE_URL: ${supabaseUrl}`)
    addLog(`✅ SUPABASE_KEY: ${supabaseKey.substring(0, 20)}...`)

    return true
  }

  const testServicesTable = async () => {
    try {
      addLog('🔄 اختبار جدول الخدمات...')

      // Test reading services
      const { data: services, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .limit(5)

      if (servicesError) {
        addLog(`❌ خطأ في قراءة جدول الخدمات: ${servicesError.message}`)
        return false
      }

      addLog(`✅ تم قراءة ${services?.length || 0} خدمة من قاعدة البيانات`)

      // Test inserting a service
      const testService = {
        name_ar: 'خدمة اختبار الاتصال',
        name_en: 'Connection Test Service',
        description_ar: 'هذه خدمة تجريبية للتحقق من الاتصال',
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
        addLog(`❌ خطأ في إدخال خدمة جديدة: ${insertError.message}`)
        return false
      }

      addLog(`✅ تم إدخال خدمة جديدة بنجاح: ${newService.id}`)

      return true
    } catch (error: any) {
      addLog(`❌ خطأ في اختبار جدول الخدمات: ${error.message}`)
      return false
    }
  }

  const runComprehensiveTest = async () => {
    setIsLoading(true)
    setLogs([])
    addLog('🚀 بدء الاختبار الشامل للاتصال مع Supabase...')

    // Test 1: Environment variables
    if (!testEnvironmentVariables()) {
      setConnectionStatus('failed')
      setIsLoading(false)
      return
    }

    // Test 2: Basic connection
    await testConnection()

    // Test 3: Services table
    const servicesTest = await testServicesTable()

    if (servicesTest) {
      setConnectionStatus('success')
      addLog('🎉 جميع الاختبارات نجحت! الاتصال مع Supabase يعمل بشكل مثالي')
    } else {
      setConnectionStatus('failed')
      addLog('❌ فشل في بعض الاختبارات')
    }

    setIsLoading(false)
  }

  useEffect(() => {
    runComprehensiveTest()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🔗 اختبار الاتصال مع Supabase
        </h1>

        {/* Connection Status */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">حالة الاتصال</h2>
          <div className="flex items-center">
            <div className={`w-6 h-6 rounded-full mr-3 ${
              connectionStatus === 'testing' ? 'bg-yellow-500 animate-pulse' :
              connectionStatus === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-lg font-medium">
              {connectionStatus === 'testing' && '🔄 جاري الاختبار...'}
              {connectionStatus === 'success' && '✅ الاتصال يعمل بنجاح'}
              {connectionStatus === 'failed' && '❌ فشل الاتصال'}
            </span>
          </div>
        </div>

        {/* Test Data */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">البيانات التجريبية</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-right">ID</th>
                  <th className="px-4 py-2 text-right">الرسالة</th>
                  <th className="px-4 py-2 text-right">تاريخ الإنشاء</th>
                </tr>
              </thead>
              <tbody>
                {testData.map((row) => (
                  <tr key={row.id} className="border-t">
                    <td className="px-4 py-2">{row.id}</td>
                    <td className="px-4 py-2">{row.message}</td>
                    <td className="px-4 py-2">
                      {new Date(row.created_at).toLocaleString('ar-EG')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Test Logs */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">سجل الاختبارات</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="mb-1">{log}</div>
            ))}
          </div>
        </div>

        {/* Test Buttons */}
        <div className="mt-6 text-center space-x-4 space-x-reverse">
          <button
            onClick={runComprehensiveTest}
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '🔄 جاري الاختبار...' : '🔄 اختبار شامل'}
          </button>

          <button
            onClick={testServicesTable}
            disabled={isLoading}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            اختبار جدول الخدمات
          </button>
        </div>
      </div>
    </div>
  )
}
