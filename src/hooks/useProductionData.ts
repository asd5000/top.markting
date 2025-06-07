import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { RealtimeChannel } from '@supabase/supabase-js'
import { notifications } from '@/lib/notifications/toast-config'

// Enhanced hook for production data fetching with error handling and caching
export function useProductionServices() {
  const [services, setServices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetch, setLastFetch] = useState<Date | null>(null)
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  const fetchServices = useCallback(async (showNotification = false) => {
    try {
      setError(null)
      const startTime = Date.now()

      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      const endTime = Date.now()
      const latency = endTime - startTime

      if (error) {
        console.error('❌ Error fetching services:', error)
        setError(error.message)
        if (showNotification) {
          notifications.error('فشل في تحميل الخدمات')
        }
        return
      }

      setServices(data || [])
      setLastFetch(new Date())
      
      if (showNotification && latency > 1000) {
        notifications.warning('تم تحميل البيانات ولكن الاتصال بطيء')
      }

      console.log(`✅ Services loaded: ${data?.length || 0} items in ${latency}ms`)

    } catch (error: any) {
      console.error('💥 Failed to fetch services:', error)
      setError(error.message)
      if (showNotification) {
        notifications.error('خطأ في الاتصال بقاعدة البيانات')
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Initial load
    fetchServices(true)

    // Set up real-time subscription
    const servicesChannel = supabase
      .channel('production-services')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'services'
        },
        (payload) => {
          console.log('🔄 Real-time services update:', payload.eventType)
          
          if (payload.eventType === 'INSERT' && payload.new.is_active) {
            setServices(prev => {
              const newService = payload.new as any
              const exists = prev.find(s => s.id === newService.id)
              if (!exists) {
                notifications.realtime.newData('الخدمات')
                return [newService, ...prev].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
              }
              return prev
            })
          } else if (payload.eventType === 'UPDATE') {
            setServices(prev => {
              const updated = payload.new as any
              if (updated.is_active) {
                return prev.map(service => 
                  service.id === updated.id ? updated : service
                ).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
              } else {
                // Remove if deactivated
                return prev.filter(service => service.id !== updated.id)
              }
            })
          } else if (payload.eventType === 'DELETE') {
            setServices(prev => prev.filter(service => service.id !== payload.old.id))
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Services subscription status:', status)
        if (status === 'SUBSCRIBED') {
          notifications.realtime.connected()
        } else if (status === 'CHANNEL_ERROR') {
          notifications.realtime.disconnected()
        }
      })

    setChannel(servicesChannel)

    // Cleanup
    return () => {
      if (servicesChannel) {
        supabase.removeChannel(servicesChannel)
        console.log('🔌 Services subscription cleaned up')
      }
    }
  }, [fetchServices])

  const refreshServices = useCallback(() => {
    setIsLoading(true)
    fetchServices(true)
  }, [fetchServices])

  return { 
    services, 
    isLoading, 
    error, 
    lastFetch, 
    refreshServices,
    setServices 
  }
}

// Enhanced hook for real estate listings
export function useProductionRealEstate() {
  const [listings, setListings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchListings = useCallback(async () => {
    try {
      setError(null)
      const { data, error } = await supabase
        .from('real_estate_listings')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error fetching real estate:', error)
        setError(error.message)
        return
      }

      setListings(data || [])
      console.log(`✅ Real estate loaded: ${data?.length || 0} listings`)

    } catch (error: any) {
      console.error('💥 Failed to fetch real estate:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchListings()

    // Real-time subscription
    const channel = supabase
      .channel('production-real-estate')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'real_estate_listings'
        },
        (payload) => {
          if (payload.eventType === 'INSERT' && payload.new.is_published) {
            setListings(prev => [payload.new as any, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as any
            if (updated.is_published) {
              setListings(prev => 
                prev.map(listing => 
                  listing.id === updated.id ? updated : listing
                )
              )
            } else {
              setListings(prev => prev.filter(listing => listing.id !== updated.id))
            }
          } else if (payload.eventType === 'DELETE') {
            setListings(prev => prev.filter(listing => listing.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchListings])

  return { listings, isLoading, error, refreshListings: fetchListings }
}

// Enhanced hook for public settings
export function useProductionSettings() {
  const [settings, setSettings] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('key, value')
          .eq('is_public', true)

        if (error) {
          console.error('❌ Error fetching settings:', error)
          setError(error.message)
          return
        }

        const settingsMap = (data || []).reduce((acc, setting) => {
          acc[setting.key] = setting.value
          return acc
        }, {} as Record<string, any>)

        setSettings(settingsMap)
        console.log('✅ Public settings loaded:', Object.keys(settingsMap).length)

      } catch (error: any) {
        console.error('💥 Failed to fetch settings:', error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [])

  return { settings, isLoading, error }
}

// Performance monitoring hook
export function usePerformanceTracking() {
  const [metrics, setMetrics] = useState({
    pageLoadTime: 0,
    apiCalls: 0,
    errors: 0,
    lastUpdate: new Date()
  })

  const trackPageLoad = useCallback((loadTime: number) => {
    setMetrics(prev => ({
      ...prev,
      pageLoadTime: loadTime,
      lastUpdate: new Date()
    }))
  }, [])

  const trackApiCall = useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      apiCalls: prev.apiCalls + 1,
      lastUpdate: new Date()
    }))
  }, [])

  const trackError = useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      errors: prev.errors + 1,
      lastUpdate: new Date()
    }))
  }, [])

  return { metrics, trackPageLoad, trackApiCall, trackError }
}
