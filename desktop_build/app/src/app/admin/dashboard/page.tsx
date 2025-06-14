'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminDashboardRedirect() {
  const router = useRouter()

  useEffect(() => {
    // إعادة توجيه فورية إلى /admin
    router.replace('/admin')
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">جاري إعادة التوجيه إلى لوحة التحكم...</p>
      </div>
    </div>
  )
}
