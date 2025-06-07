'use client'

import { useState, useEffect } from 'react'
import { serviceOperations, testConnection } from '@/lib/supabase/client'
import { toast } from 'react-hot-toast'

export default function TestIntegrationPage() {
  const [connectionStatus, setConnectionStatus] = useState<boolean | null>(null)
  const [services, setServices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [testResults, setTestResults] = useState<string[]>([])

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testDatabaseConnection = async () => {
    addTestResult('🔄 Testing database connection...')
    const isConnected = await testConnection()
    setConnectionStatus(isConnected)
    addTestResult(isConnected ? '✅ Database connection successful' : '❌ Database connection failed')
  }

  const testLoadServices = async () => {
    try {
      addTestResult('🔄 Testing load services...')
      setIsLoading(true)
      const data = await serviceOperations.getAllServices()
      setServices(data || [])
      addTestResult(`✅ Loaded ${data?.length || 0} services successfully`)
    } catch (error) {
      addTestResult(`❌ Failed to load services: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testCreateService = async () => {
    try {
      addTestResult('🔄 Testing create service...')
      const testService = {
        name_ar: 'خدمة اختبار',
        name_en: 'Test Service',
        description_ar: 'هذه خدمة اختبار للتحقق من التكامل',
        description_en: 'This is a test service for integration testing',
        price: 100,
        currency: 'EGP',
        duration_text: '1 يوم',
        features: ['اختبار', 'تكامل'],
        is_active: true,
        category: 'test',
        category_name: 'اختبار'
      }

      const result = await serviceOperations.createService(testService)
      addTestResult(`✅ Service created successfully with ID: ${result.id}`)
      
      // Reload services to see the new one
      await testLoadServices()
    } catch (error) {
      addTestResult(`❌ Failed to create service: ${error}`)
    }
  }

  const testUpdateService = async () => {
    if (services.length === 0) {
      addTestResult('❌ No services available to update')
      return
    }

    try {
      addTestResult('🔄 Testing update service...')
      const firstService = services[0]
      const updates = {
        name_ar: firstService.name_ar + ' (محدث)',
        price: firstService.price + 50
      }

      await serviceOperations.updateService(firstService.id, updates)
      addTestResult(`✅ Service updated successfully: ${firstService.id}`)
      
      // Reload services to see the update
      await testLoadServices()
    } catch (error) {
      addTestResult(`❌ Failed to update service: ${error}`)
    }
  }

  const testDeleteService = async () => {
    const testServices = services.filter(s => s.category === 'test')
    if (testServices.length === 0) {
      addTestResult('❌ No test services available to delete')
      return
    }

    try {
      addTestResult('🔄 Testing delete service...')
      const serviceToDelete = testServices[0]
      
      await serviceOperations.deleteService(serviceToDelete.id)
      addTestResult(`✅ Service deleted successfully: ${serviceToDelete.id}`)
      
      // Reload services to see the deletion
      await testLoadServices()
    } catch (error) {
      addTestResult(`❌ Failed to delete service: ${error}`)
    }
  }

  const runAllTests = async () => {
    setTestResults([])
    addTestResult('🚀 Starting integration tests...')
    
    await testDatabaseConnection()
    await testLoadServices()
    await testCreateService()
    await testUpdateService()
    await testDeleteService()
    
    addTestResult('🎉 All tests completed!')
  }

  useEffect(() => {
    testDatabaseConnection()
    testLoadServices()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">اختبار التكامل مع Supabase</h1>
        
        {/* Connection Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">حالة الاتصال</h2>
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-3 ${
              connectionStatus === null ? 'bg-yellow-500' : 
              connectionStatus ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span>
              {connectionStatus === null ? 'جاري الاختبار...' : 
               connectionStatus ? 'متصل بنجاح' : 'فشل الاتصال'}
            </span>
          </div>
        </div>

        {/* Services Count */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">الخدمات المحملة</h2>
          <div className="text-2xl font-bold text-blue-600">
            {isLoading ? 'جاري التحميل...' : `${services.length} خدمة`}
          </div>
        </div>

        {/* Test Buttons */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">اختبارات العمليات</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={testLoadServices}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              تحميل الخدمات
            </button>
            <button
              onClick={testCreateService}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              إنشاء خدمة
            </button>
            <button
              onClick={testUpdateService}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            >
              تحديث خدمة
            </button>
            <button
              onClick={testDeleteService}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              حذف خدمة
            </button>
          </div>
          <button
            onClick={runAllTests}
            className="w-full mt-4 bg-purple-600 text-white px-4 py-3 rounded hover:bg-purple-700 font-semibold"
          >
            تشغيل جميع الاختبارات
          </button>
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">نتائج الاختبارات</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <div className="text-gray-500">لا توجد نتائج بعد...</div>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="mb-1">{result}</div>
              ))
            )}
          </div>
        </div>

        {/* Services List */}
        {services.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">قائمة الخدمات</h2>
            <div className="space-y-2">
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
        )}
      </div>
    </div>
  )
}
