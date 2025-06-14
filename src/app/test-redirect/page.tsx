'use client'

import { useEffect } from 'react'

export default function TestRedirect() {
  useEffect(() => {
    console.log('🧪 Test redirect page loaded')
    
    // اختبار التوجيه بعد 2 ثانية
    setTimeout(() => {
      console.log('🚀 Redirecting to visitor dashboard...')
      window.location.href = '/visitor-dashboard'
    }, 2000)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          اختبار التوجيه
        </h1>
        <p className="text-gray-600">
          سيتم التوجيه إلى لوحة التحكم خلال ثانيتين...
        </p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    </div>
  )
}
