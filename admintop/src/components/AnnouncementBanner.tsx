'use client'

import { useState, useEffect } from 'react'
import { X, Megaphone } from 'lucide-react'
import { useSiteSettings } from '@/hooks/useSiteSettings'

export default function AnnouncementBanner() {
  const { settings, loading } = useSiteSettings()
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // فحص إذا كان الإعلان مفعل ويحتوي على نص
    if (settings?.announcement_active && settings?.announcement_text && !isDismissed) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [settings, isDismissed])

  const handleDismiss = () => {
    setIsDismissed(true)
    setIsVisible(false)
  }

  if (loading || !isVisible || !settings?.announcement_text) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center flex-1">
          <Megaphone className="w-5 h-5 ml-3 flex-shrink-0" />
          <p className="text-sm md:text-base font-medium text-center flex-1">
            {settings.announcement_text}
          </p>
        </div>
        
        <button
          onClick={handleDismiss}
          className="text-white hover:text-gray-200 transition-colors p-1 flex-shrink-0"
          aria-label="إغلاق الإعلان"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
