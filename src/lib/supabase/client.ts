import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xanzptntwwmpulqutoiv.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhbnpwdG50d3dtcHVscXV0b2l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzI4NzQsImV4cCI6MjA1MDU0ODg3NH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Helper function to handle Supabase errors with detailed logging
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error details:', {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code,
    stack: error.stack
  })
  throw new Error(error.message || 'Database operation failed')
}

// Test connection function
export async function testConnection() {
  try {
    console.log('Testing Supabase connection...')
    const { data, error } = await supabase.from('services').select('count').limit(1)
    if (error) {
      console.error('Connection test failed:', error)
      return false
    }
    console.log('✅ Supabase connection successful')
    return true
  } catch (error) {
    console.error('❌ Connection test error:', error)
    return false
  }
}

// Initialize connection test
testConnection()

// User operations
export const userOperations = {
  async getUser(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) handleSupabaseError(error)
    return data
  },

  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error && error.code !== 'PGRST116') handleSupabaseError(error)
    return data
  },

  async createUser(userData: Database['public']['Tables']['users']['Insert']) {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single()
    
    if (error) handleSupabaseError(error)
    return data
  },

  async updateUser(id: string, updates: Database['public']['Tables']['users']['Update']) {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) handleSupabaseError(error)
    return data
  },

  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) handleSupabaseError(error)
    return data || []
  },

  async getUsers() {
    return this.getAllUsers()
  },

  async deleteUser(id: string) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (error) handleSupabaseError(error)
    return { success: true }
  }
}

// Admin operations for managers
export const managerOperations = {
  async getAllManagers() {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) handleSupabaseError(error)
    return data || []
  },

  async createManager(managerData: Database['public']['Tables']['admins']['Insert']) {
    const { data, error } = await supabase
      .from('admins')
      .insert({
        ...managerData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) handleSupabaseError(error)
    return data
  },

  async updateManager(id: string, updates: Database['public']['Tables']['admins']['Update']) {
    const { data, error } = await supabase
      .from('admins')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) handleSupabaseError(error)
    return data
  },

  async deleteManager(id: string) {
    const { error } = await supabase
      .from('admins')
      .delete()
      .eq('id', id)

    if (error) handleSupabaseError(error)
    return { success: true }
  },

  async getManagerByEmail(email: string) {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single()

    if (error && error.code !== 'PGRST116') handleSupabaseError(error)
    return data
  }
}

// Service operations
export const serviceOperations = {
  async getAllServices() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) handleSupabaseError(error)
    return data || []
  },

  async getActiveServices() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) handleSupabaseError(error)
    return data || []
  },

  async getService(id: string) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single()

    if (error) handleSupabaseError(error)
    return data
  },

  async createService(serviceData: Database['public']['Tables']['services']['Insert']) {
    console.log('Creating service with data:', serviceData)

    const { data, error } = await supabase
      .from('services')
      .insert({
        ...serviceData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to create service:', error)
      handleSupabaseError(error)
    }

    console.log('✅ Service created successfully:', data)
    return data
  },

  async updateService(id: string, updates: Database['public']['Tables']['services']['Update']) {
    console.log('Updating service:', id, 'with data:', updates)

    const { data, error } = await supabase
      .from('services')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Failed to update service:', error)
      handleSupabaseError(error)
    }

    console.log('✅ Service updated successfully:', data)
    return data
  },

  async deleteService(id: string) {
    console.log('Deleting service:', id)

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Failed to delete service:', error)
      handleSupabaseError(error)
    }

    console.log('✅ Service deleted successfully')
    return { success: true }
  },

  async getServicesByCategory(category: string) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) handleSupabaseError(error)
    return data || []
  }
}

// Order operations
export const orderOperations = {
  async createOrder(orderData: Database['public']['Tables']['orders']['Insert']) {
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single()
    
    if (error) handleSupabaseError(error)
    return data
  },

  async getOrder(id: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        customer:users(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) handleSupabaseError(error)
    return data
  },

  async getAllOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        customer:users!customer_id(name, email, phone, whatsapp_number)
      `)
      .order('created_at', { ascending: false })

    if (error) handleSupabaseError(error)
    return data || []
  },

  async getOrdersByCustomer(customerId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })
    
    if (error) handleSupabaseError(error)
    return data || []
  },

  async updateOrder(id: string, updates: Database['public']['Tables']['orders']['Update']) {
    const { data, error } = await supabase
      .from('orders')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) handleSupabaseError(error)
    return data
  },

  async updateOrderStatus(id: string, status: Database['public']['Tables']['orders']['Row']['status']) {
    return this.updateOrder(id, { status })
  },

  async updatePaymentStatus(id: string, paymentStatus: Database['public']['Tables']['orders']['Row']['payment_status'], receiptUrl?: string) {
    const updates: Database['public']['Tables']['orders']['Update'] = { payment_status: paymentStatus }
    if (receiptUrl) updates.payment_receipt_url = receiptUrl
    return this.updateOrder(id, updates)
  }
}

// Real estate operations
export const realEstateOperations = {
  async createProperty(propertyData: Database['public']['Tables']['real_estate_properties']['Insert']) {
    const { data, error } = await supabase
      .from('real_estate_properties')
      .insert(propertyData)
      .select()
      .single()
    
    if (error) handleSupabaseError(error)
    return data
  },

  async getAllProperties() {
    const { data, error } = await supabase
      .from('real_estate_properties')
      .select(`
        *,
        customer:users(name, email, phone, whatsapp_number)
      `)
      .order('created_at', { ascending: false })
    
    if (error) handleSupabaseError(error)
    return data || []
  },

  async getProperty(id: string) {
    const { data, error } = await supabase
      .from('real_estate_properties')
      .select(`
        *,
        customer:users(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) handleSupabaseError(error)
    return data
  },

  async updateProperty(id: string, updates: Database['public']['Tables']['real_estate_properties']['Update']) {
    const { data, error } = await supabase
      .from('real_estate_properties')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) handleSupabaseError(error)
    return data
  },

  async incrementViews(id: string) {
    const { data, error } = await supabase
      .rpc('increment_property_views', { property_id: id })
    
    if (error) handleSupabaseError(error)
    return data
  }
}

// Admin settings operations
export const adminOperations = {
  async getSetting(key: string) {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('*')
      .eq('key', key)
      .single()
    
    if (error && error.code !== 'PGRST116') handleSupabaseError(error)
    return data
  },

  async setSetting(key: string, value: any, description?: string) {
    const { data, error } = await supabase
      .from('admin_settings')
      .upsert({
        key,
        value,
        description,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) handleSupabaseError(error)
    return data
  },

  async getAllSettings() {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('*')
      .order('key', { ascending: true })
    
    if (error) handleSupabaseError(error)
    return data || []
  }
}

// Real-time subscriptions
export const subscriptions = {
  subscribeToOrders(callback: (payload: any) => void) {
    return supabase
      .channel('orders')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' }, 
        callback
      )
      .subscribe()
  },

  subscribeToUsers(callback: (payload: any) => void) {
    return supabase
      .channel('users')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'users' }, 
        callback
      )
      .subscribe()
  }
}
