import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for database tables
export interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: 'super_admin' | 'marketing_manager' | 'support' | 'content_manager' | 'customer'
  is_active: boolean
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface MainService {
  id: string
  name: string
  name_en?: string
  description?: string
  icon?: string
  category: 'design' | 'marketing' | 'video' | 'data' | 'web'
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface SubService {
  id: string
  main_service_id: string
  name: string
  name_en?: string
  description?: string
  price: number
  duration_days: number
  is_active: boolean
  sort_order: number
  features: string[]
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  customer_id?: string
  customer_name: string
  customer_email: string
  customer_phone: string
  total_amount: number
  status: 'pending' | 'payment_uploaded' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  payment_receipt_url?: string
  notes?: string
  admin_notes?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  sub_service_id: string
  service_name: string
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
}

export interface Package {
  id: string
  name: string
  description?: string
  price: number
  duration_months: number
  features: string[]
  is_active: boolean
  subscribers_count: number
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  package_id: string
  customer_id?: string
  customer_name: string
  customer_email: string
  customer_phone: string
  start_date: string
  end_date: string
  status: 'active' | 'expired' | 'cancelled' | 'pending'
  payment_receipt_url?: string
  auto_renew: boolean
  created_at: string
  updated_at: string
}

export interface RealEstate {
  id: string
  customer_id?: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_whatsapp?: string
  property_type: 'apartment' | 'villa' | 'land' | 'shop' | 'house' | 'office'
  operation_type: 'sale' | 'rent'
  title: string
  description?: string
  governorate: string
  city: string
  district?: string
  street?: string
  landmarks?: string
  area?: number
  rooms?: number
  bathrooms?: number
  floor_number?: number
  total_floors?: number
  age_years?: number
  finishing?: 'finished' | 'semi_finished' | 'unfinished' | 'luxury'
  price: number
  price_negotiable: boolean
  payment_method?: 'cash' | 'installments' | 'both'
  status: 'pending' | 'approved' | 'rejected' | 'featured'
  priority: 'low' | 'normal' | 'high'
  admin_notes?: string
  rejection_reason?: string
  views_count: number
  inquiries_count: number
  images: string[]
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  order_id?: string
  subscription_id?: string
  customer_name: string
  amount: number
  payment_method?: string
  receipt_url: string
  status: 'pending' | 'approved' | 'rejected'
  reviewed_by?: string
  reviewed_at?: string
  rejection_reason?: string
  created_at: string
}

export interface Portfolio {
  id: string
  title: string
  description?: string
  category: string
  service_ids: string[]
  images: string[]
  client_name?: string
  completion_date?: string
  is_featured: boolean
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface SystemSetting {
  id: string
  setting_key: string
  setting_value?: string
  setting_type: 'text' | 'number' | 'boolean' | 'json'
  description?: string
  updated_by?: string
  updated_at: string
}

// Helper functions for database operations
export const dbHelpers = {
  // Services
  async getMainServices() {
    const { data, error } = await supabase
      .from('main_services')
      .select('*')
      .order('sort_order')
    return { data, error }
  },

  async getSubServices(mainServiceId?: string) {
    let query = supabase
      .from('sub_services')
      .select('*')
      .order('sort_order')
    
    if (mainServiceId) {
      query = query.eq('main_service_id', mainServiceId)
    }
    
    const { data, error } = await query
    return { data, error }
  },

  // Orders
  async createOrder(orderData: Partial<Order>) {
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single()
    return { data, error }
  },

  async getOrders(status?: string) {
    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (status) {
      query = query.eq('status', status)
    }
    
    const { data, error } = await query
    return { data, error }
  },

  // Packages
  async getPackages() {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('is_active', true)
      .order('price')
    return { data, error }
  },

  // Real Estate
  async getRealEstate(status?: string) {
    let query = supabase
      .from('real_estate')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (status) {
      query = query.eq('status', status)
    }
    
    const { data, error } = await query
    return { data, error }
  },

  // Payments
  async getPayments(status?: string) {
    let query = supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (status) {
      query = query.eq('status', status)
    }
    
    const { data, error } = await query
    return { data, error }
  },

  // System Settings
  async getSettings() {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
    return { data, error }
  },

  async updateSetting(key: string, value: string) {
    const { data, error } = await supabase
      .from('system_settings')
      .update({ setting_value: value, updated_at: new Date().toISOString() })
      .eq('setting_key', key)
    return { data, error }
  }
}
