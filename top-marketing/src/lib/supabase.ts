import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface Service {
  id: string
  name: string
  description: string
  icon: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SubService {
  id: string
  service_id: string
  name: string
  description: string
  price: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  email: string
  full_name: string
  phone: string
  city: string
  country: string
  created_at: string
  updated_at: string
}

export interface Manager {
  id: string
  email: string
  full_name: string
  role: 'super_admin' | 'marketing' | 'support' | 'content'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  client_id: string
  total_amount: number
  status: 'pending' | 'paid' | 'in_progress' | 'completed' | 'cancelled'
  payment_receipt_url?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  sub_service_id: string
  quantity: number
  price: number
  notes?: string
  created_at: string
}

export interface Package {
  id: string
  name: string
  description: string
  price: number
  duration_months: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PageSubscription {
  id: string
  client_id: string
  package_id: string
  status: 'active' | 'expired' | 'cancelled'
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
}

export interface RealEstateListing {
  id: string
  client_id: string
  title: string
  description: string
  property_type: 'apartment' | 'villa' | 'land' | 'shop' | 'house' | 'office'
  listing_type: 'sale' | 'rent'
  price: number
  location: string
  area: number
  bedrooms?: number
  bathrooms?: number
  images: string[]
  status: 'pending' | 'approved' | 'rejected'
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface Receipt {
  id: string
  order_id: string
  image_url: string
  status: 'pending' | 'approved' | 'rejected'
  reviewed_by?: string
  reviewed_at?: string
  notes?: string
  created_at: string
}
