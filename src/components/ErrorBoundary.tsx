'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react'
import { notifications } from '@/lib/notifications/toast-config'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 Error Boundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Log error to monitoring service (if available)
    this.logErrorToService(error, errorInfo)
    
    // Show user notification
    notifications.error('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.')
  }

  logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // In production, you would send this to your error monitoring service
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }

    console.error('Error logged:', errorData)
    
    // Example: Send to monitoring service
    // fetch('/api/log-error', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorData)
    // })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  handleReportError = () => {
    const subject = encodeURIComponent('تقرير خطأ في الموقع')
    const body = encodeURIComponent(`
تفاصيل الخطأ:
- الرسالة: ${this.state.error?.message}
- الصفحة: ${window.location.href}
- الوقت: ${new Date().toLocaleString('ar-EG')}
- المتصفح: ${navigator.userAgent}

يرجى وصف ما كنت تفعله عند حدوث الخطأ:
[اكتب هنا...]
    `)
    
    window.open(`mailto:alsheref.antaka@gmail.com?subject=${subject}&body=${body}`)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </motion.div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              عذراً، حدث خطأ!
            </h1>

            <p className="text-gray-600 mb-6 leading-relaxed">
              حدث خطأ غير متوقع في التطبيق. نحن نعمل على حل هذه المشكلة.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 mb-2">
                  تفاصيل الخطأ (للمطورين)
                </summary>
                <div className="bg-gray-100 p-3 rounded text-xs font-mono overflow-auto max-h-32">
                  <div className="text-red-600 font-semibold mb-2">
                    {this.state.error.message}
                  </div>
                  <div className="text-gray-700">
                    {this.state.error.stack}
                  </div>
                </div>
              </details>
            )}

            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <RefreshCw className="w-5 h-5 ml-2" />
                إعادة المحاولة
              </button>

              <button
                onClick={this.handleGoHome}
                className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
              >
                <Home className="w-5 h-5 ml-2" />
                العودة للرئيسية
              </button>

              <button
                onClick={this.handleReportError}
                className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center"
              >
                <Mail className="w-5 h-5 ml-2" />
                إبلاغ عن المشكلة
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                إذا استمرت المشكلة، يرجى التواصل معنا على:
              </p>
              <a
                href="mailto:alsheref.antaka@gmail.com"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                alsheref.antaka@gmail.com
              </a>
            </div>
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}

// Hook for error handling in functional components
export function useErrorHandler() {
  const handleError = (error: Error, errorInfo?: any) => {
    console.error('🚨 Error handled:', error, errorInfo)
    notifications.error('حدث خطأ. يرجى المحاولة مرة أخرى.')
    
    // Log to monitoring service
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      additionalInfo: errorInfo
    }
    
    console.error('Error data:', errorData)
  }

  return { handleError }
}

// Simple error fallback component
export function ErrorFallback({ 
  error, 
  resetError 
}: { 
  error: Error
  resetError: () => void 
}) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-red-900 mb-2">
        حدث خطأ في هذا القسم
      </h3>
      <p className="text-red-700 mb-4">
        {error.message || 'خطأ غير معروف'}
      </p>
      <button
        onClick={resetError}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
      >
        إعادة المحاولة
      </button>
    </div>
  )
}

export default ErrorBoundary
