'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Wifi, WifiOff, Database, Clock, AlertTriangle } from 'lucide-react'

interface PerformanceMetrics {
  dbLatency: number
  connectionStatus: 'connected' | 'disconnected' | 'connecting'
  lastUpdate: Date
  errorCount: number
  successRate: number
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    dbLatency: 0,
    connectionStatus: 'connecting',
    lastUpdate: new Date(),
    errorCount: 0,
    successRate: 100
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show monitor in development or when there are issues
    const isDev = process.env.NODE_ENV === 'development'
    const hasIssues = metrics.errorCount > 0 || metrics.successRate < 95
    setIsVisible(isDev || hasIssues)
  }, [metrics.errorCount, metrics.successRate])

  useEffect(() => {
    const checkPerformance = async () => {
      const startTime = Date.now()
      
      try {
        // Test database connection
        const response = await fetch('/api/test-db')
        const endTime = Date.now()
        const latency = endTime - startTime

        if (response.ok) {
          setMetrics(prev => ({
            ...prev,
            dbLatency: latency,
            connectionStatus: 'connected',
            lastUpdate: new Date(),
            successRate: Math.min(100, prev.successRate + 1)
          }))
        } else {
          throw new Error('Database connection failed')
        }
      } catch (error) {
        setMetrics(prev => ({
          ...prev,
          connectionStatus: 'disconnected',
          errorCount: prev.errorCount + 1,
          successRate: Math.max(0, prev.successRate - 5),
          lastUpdate: new Date()
        }))
      }
    }

    // Check performance every 30 seconds
    const interval = setInterval(checkPerformance, 30000)
    
    // Initial check
    checkPerformance()

    return () => clearInterval(interval)
  }, [])

  if (!isVisible) return null

  const getStatusColor = () => {
    switch (metrics.connectionStatus) {
      case 'connected':
        return metrics.dbLatency < 500 ? 'text-green-500' : 'text-yellow-500'
      case 'disconnected':
        return 'text-red-500'
      case 'connecting':
        return 'text-blue-500'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusIcon = () => {
    switch (metrics.connectionStatus) {
      case 'connected':
        return <Wifi className="w-4 h-4" />
      case 'disconnected':
        return <WifiOff className="w-4 h-4" />
      case 'connecting':
        return <Activity className="w-4 h-4 animate-pulse" />
      default:
        return <Database className="w-4 h-4" />
    }
  }

  const getLatencyStatus = () => {
    if (metrics.dbLatency < 200) return { color: 'text-green-500', label: 'ممتاز' }
    if (metrics.dbLatency < 500) return { color: 'text-yellow-500', label: 'جيد' }
    if (metrics.dbLatency < 1000) return { color: 'text-orange-500', label: 'بطيء' }
    return { color: 'text-red-500', label: 'بطيء جداً' }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 left-4 z-50"
      >
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[280px]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Activity className="w-5 h-5 text-blue-600 ml-2" />
              <span className="font-semibold text-gray-900">مراقب الأداء</span>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="space-y-3">
            {/* Connection Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className={getStatusColor()}>{getStatusIcon()}</span>
                <span className="text-sm text-gray-600 mr-2">حالة الاتصال</span>
              </div>
              <span className={`text-sm font-medium ${getStatusColor()}`}>
                {metrics.connectionStatus === 'connected' ? 'متصل' : 
                 metrics.connectionStatus === 'disconnected' ? 'منقطع' : 'جاري الاتصال'}
              </span>
            </div>

            {/* Database Latency */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-gray-400 ml-2" />
                <span className="text-sm text-gray-600">زمن الاستجابة</span>
              </div>
              <div className="text-left">
                <span className={`text-sm font-medium ${getLatencyStatus().color}`}>
                  {metrics.dbLatency}ms
                </span>
                <span className={`text-xs mr-1 ${getLatencyStatus().color}`}>
                  ({getLatencyStatus().label})
                </span>
              </div>
            </div>

            {/* Success Rate */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Database className="w-4 h-4 text-gray-400 ml-2" />
                <span className="text-sm text-gray-600">معدل النجاح</span>
              </div>
              <span className={`text-sm font-medium ${
                metrics.successRate >= 95 ? 'text-green-500' : 
                metrics.successRate >= 80 ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {metrics.successRate.toFixed(1)}%
              </span>
            </div>

            {/* Error Count */}
            {metrics.errorCount > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="w-4 h-4 text-red-500 ml-2" />
                  <span className="text-sm text-gray-600">الأخطاء</span>
                </div>
                <span className="text-sm font-medium text-red-500">
                  {metrics.errorCount}
                </span>
              </div>
            )}

            {/* Last Update */}
            <div className="pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                آخر تحديث: {metrics.lastUpdate.toLocaleTimeString('ar-EG')}
              </span>
            </div>
          </div>

          {/* Performance Bar */}
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full ${
                  metrics.successRate >= 95 ? 'bg-green-500' : 
                  metrics.successRate >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${metrics.successRate}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Hook for performance monitoring
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    dbLatency: 0,
    connectionStatus: 'connecting',
    lastUpdate: new Date(),
    errorCount: 0,
    successRate: 100
  })

  const recordSuccess = (latency: number) => {
    setMetrics(prev => ({
      ...prev,
      dbLatency: latency,
      connectionStatus: 'connected',
      lastUpdate: new Date(),
      successRate: Math.min(100, prev.successRate + 0.1)
    }))
  }

  const recordError = () => {
    setMetrics(prev => ({
      ...prev,
      connectionStatus: 'disconnected',
      errorCount: prev.errorCount + 1,
      successRate: Math.max(0, prev.successRate - 1),
      lastUpdate: new Date()
    }))
  }

  return { metrics, recordSuccess, recordError }
}
