import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { RealtimeChannel } from '@supabase/supabase-js'

export function useRealtimeServices() {
  const [services, setServices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    // Load initial data
    const loadServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error loading services:', error)
          return
        }

        setServices(data || [])
        console.log('✅ Initial services loaded:', data?.length)
      } catch (error) {
        console.error('Error in loadServices:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadServices()

    // Set up real-time subscription
    const servicesChannel = supabase
      .channel('services-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'services'
        },
        (payload) => {
          console.log('🔄 Real-time services change:', payload)
          
          if (payload.eventType === 'INSERT') {
            setServices(prev => [payload.new as any, ...prev])
            console.log('✅ Service added via real-time')
          } else if (payload.eventType === 'UPDATE') {
            setServices(prev => 
              prev.map(service => 
                service.id === payload.new.id ? payload.new as any : service
              )
            )
            console.log('✅ Service updated via real-time')
          } else if (payload.eventType === 'DELETE') {
            setServices(prev => 
              prev.filter(service => service.id !== payload.old.id)
            )
            console.log('✅ Service deleted via real-time')
          }
        }
      )
      .subscribe((status) => {
        console.log('Services subscription status:', status)
      })

    setChannel(servicesChannel)

    return () => {
      if (servicesChannel) {
        supabase.removeChannel(servicesChannel)
        console.log('🔌 Services subscription cleaned up')
      }
    }
  }, [])

  return { services, isLoading, setServices }
}

export function useRealtimeUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load initial data
    const loadUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error loading users:', error)
          return
        }

        setUsers(data || [])
        console.log('✅ Initial users loaded:', data?.length)
      } catch (error) {
        console.error('Error in loadUsers:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()

    // Set up real-time subscription
    const usersChannel = supabase
      .channel('users-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users'
        },
        (payload) => {
          console.log('🔄 Real-time users change:', payload)
          
          if (payload.eventType === 'INSERT') {
            setUsers(prev => [payload.new as any, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setUsers(prev => 
              prev.map(user => 
                user.id === payload.new.id ? payload.new as any : user
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setUsers(prev => 
              prev.filter(user => user.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(usersChannel)
    }
  }, [])

  return { users, isLoading, setUsers }
}

export function useRealtimeAdmins() {
  const [admins, setAdmins] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load initial data
    const loadAdmins = async () => {
      try {
        const { data, error } = await supabase
          .from('admins')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error loading admins:', error)
          return
        }

        setAdmins(data || [])
        console.log('✅ Initial admins loaded:', data?.length)
      } catch (error) {
        console.error('Error in loadAdmins:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAdmins()

    // Set up real-time subscription
    const adminsChannel = supabase
      .channel('admins-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'admins'
        },
        (payload) => {
          console.log('🔄 Real-time admins change:', payload)
          
          if (payload.eventType === 'INSERT') {
            setAdmins(prev => [payload.new as any, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setAdmins(prev => 
              prev.map(admin => 
                admin.id === payload.new.id ? payload.new as any : admin
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setAdmins(prev => 
              prev.filter(admin => admin.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(adminsChannel)
    }
  }, [])

  return { admins, isLoading, setAdmins }
}
