'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminRealEstatePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the main real estate system
    router.push('/real-estate-system')
  }, [router])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center" dir="rtl">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">جاري التوجيه إلى نظام العقارات...</p>
      </div>
    </div>
  )
}
