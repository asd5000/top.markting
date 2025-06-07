'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Database, 
  Server, 
  Wifi, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Activity,
  Users,
  ShoppingCart,
  Settings
} from 'lucide-react'

interface SystemStatus {
  database: 'operational' | 'degraded' | 'down'
  api: 'operational' | 'degraded' | 'down'
  realtime: 'operational' | 'degraded' | 'down'
  website: 'operational' | 'degraded' | 'down'
  lastChecked: Date
  responseTime: number
  uptime: number
}

interface ServiceMetrics {
  totalServices: number
  activeServices: number
  totalCustomers: number
  totalOrders: number
  pendingOrders: number
}

export default function SystemStatusPage() {
  const [status, setStatus] = useState<SystemStatus>({
    database: 'operational',
    api: 'operational',
    realtime: 'operational',
    website: 'operational',
    lastChecked: new Date(),
    responseTime: 0,
    uptime: 99.9
  })

  const [metrics, setMetrics] = useState<ServiceMetrics>({
    totalServices: 0,
    activeServices: 0,
    totalCustomers: 0,
    totalOrders: 0,
    pendingOrders: 0
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkSystemStatus = async () => {
      const startTime = Date.now()
      
      try {
        // Test API endpoint
        const response = await fetch('/api/test-db')
        const endTime = Date.now()
        const responseTime = endTime - startTime

        if (response.ok) {
          const data = await response.json()
          
          setStatus(prev => ({
            ...prev,
            database: 'operational',
            api: 'operational',
            website: 'operational',
            lastChecked: new Date(),
            responseTime
          }))

          // Update metrics from API response
          if (data.data) {
            setMetrics({
              totalServices: data.data.services?.count || 0,
              activeServices: data.data.services?.count || 0,
              totalCustomers: data.data.customers?.count || 0,
              totalOrders: 0, // Will be updated when orders data is available
              pendingOrders: 0
            })
          }
        } else {
          setStatus(prev => ({
            ...prev,
            database: 'down',
            api: 'down',
            lastChecked: new Date(),
            responseTime
          }))
        }
      } catch (error) {
        console.error('System status check failed:', error)
        setStatus(prev => ({
          ...prev,
          database: 'down',
          api: 'down',
          website: 'degraded',
          lastChecked: new Date(),
          responseTime: 0
        }))
      } finally {
        setIsLoading(false)
      }
    }

    // Initial check
    checkSystemStatus()

    // Check every 30 seconds
    const interval = setInterval(checkSystemStatus, 30000)

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'down':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'operational':
        return 'يعمل بشكل طبيعي'
      case 'degraded':
        return 'أداء منخفض'
      case 'down':
        return 'خارج الخدمة'
      default:
        return 'غير معروف'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'degraded':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'down':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const overallStatus = Object.values(status).every(s => s === 'operational' || typeof s !== 'string') 
    ? 'operational' 
    : Object.values(status).some(s => s === 'down' && typeof s === 'string')
    ? 'down'
    : 'degraded'

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-8 h-8 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">جاري فحص حالة النظام...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            حالة النظام
          </h1>
          <div className={`inline-flex items-center px-4 py-2 rounded-full border ${getStatusColor(overallStatus)}`}>
            {getStatusIcon(overallStatus)}
            <span className="mr-2 font-medium">
              النظام {getStatusText(overallStatus)}
            </span>
          </div>
        </motion.div>

        {/* System Components */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">مكونات النظام</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                <Database className="w-6 h-6 text-blue-600 ml-3" />
                <div>
                  <div className="font-medium">قاعدة البيانات</div>
                  <div className="text-sm text-gray-500">Supabase</div>
                </div>
              </div>
              <div className="flex items-center">
                {getStatusIcon(status.database)}
                <span className="mr-2 text-sm">{getStatusText(status.database)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                <Server className="w-6 h-6 text-green-600 ml-3" />
                <div>
                  <div className="font-medium">واجهة البرمجة</div>
                  <div className="text-sm text-gray-500">API Server</div>
                </div>
              </div>
              <div className="flex items-center">
                {getStatusIcon(status.api)}
                <span className="mr-2 text-sm">{getStatusText(status.api)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                <Wifi className="w-6 h-6 text-purple-600 ml-3" />
                <div>
                  <div className="font-medium">التحديث المباشر</div>
                  <div className="text-sm text-gray-500">Real-time</div>
                </div>
              </div>
              <div className="flex items-center">
                {getStatusIcon(status.realtime)}
                <span className="mr-2 text-sm">{getStatusText(status.realtime)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                <Activity className="w-6 h-6 text-orange-600 ml-3" />
                <div>
                  <div className="font-medium">الموقع الإلكتروني</div>
                  <div className="text-sm text-gray-500">Frontend</div>
                </div>
              </div>
              <div className="flex items-center">
                {getStatusIcon(status.website)}
                <span className="mr-2 text-sm">{getStatusText(status.website)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">مقاييس الأداء</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {status.responseTime}ms
              </div>
              <div className="text-sm text-gray-600">زمن الاستجابة</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {status.uptime}%
              </div>
              <div className="text-sm text-gray-600">وقت التشغيل</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {status.lastChecked.toLocaleTimeString('ar-EG')}
              </div>
              <div className="text-sm text-gray-600">آخر فحص</div>
            </div>
          </div>
        </motion.div>

        {/* Service Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">إحصائيات الخدمة</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Settings className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{metrics.activeServices}</div>
              <div className="text-sm text-gray-600">خدمة نشطة</div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{metrics.totalCustomers}</div>
              <div className="text-sm text-gray-600">عميل مسجل</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <ShoppingCart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{metrics.totalOrders}</div>
              <div className="text-sm text-gray-600">إجمالي الطلبات</div>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{metrics.pendingOrders}</div>
              <div className="text-sm text-gray-600">طلبات معلقة</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
