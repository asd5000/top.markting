'use client'

import { useState, useEffect } from 'react'
import { getSiteSettings, SiteSettings, getWhatsAppLink, getPhoneLink, getEmailLink } from '@/lib/site-settings'

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const siteSettings = await getSiteSettings()
      setSettings(siteSettings)
      
    } catch (err) {
      console.error('Error loading site settings:', err)
      setError('فشل في تحميل إعدادات الموقع')
    } finally {
      setLoading(false)
    }
  }

  // دوال مساعدة للروابط
  const getContactLinks = async () => {
    if (!settings) return null

    return {
      whatsapp: await getWhatsAppLink(),
      phone: await getPhoneLink(),
      email: await getEmailLink()
    }
  }

  return {
    settings,
    loading,
    error,
    reload: loadSettings,
    getContactLinks
  }
}
