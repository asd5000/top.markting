// Database Types for Top Marketing System

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  whatsapp?: string
  address?: string
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  name: string
  description?: string
  image_url?: string
  color?: string
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SubService {
  id: string
  service_id: string
  name: string
  description?: string
  price: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_whatsapp?: string
  customer_address?: string
  notes?: string
  payment_method: string
  receipt_url?: string
  total_amount: number
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'rejected'
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  service_name: string
  sub_service_name: string
  price: number
  quantity: number
  created_at: string
}

export interface Package {
  id: string
  name: string
  description?: string
  price: number
  duration_months: number
  max_designs?: number
  max_videos?: number
  features: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  packageId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerWhatsapp?: string
  totalAmount: number
  startDate: string
  endDate: string
  status: 'pending' | 'active' | 'completed' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'rejected'
  created_at: string
  updated_at: string
}

export interface Receipt {
  id: string
  order_id?: string
  subscription_id?: string
  customer_name: string
  customer_email: string
  customer_phone: string
  payment_method: string
  amount: number
  receipt_url: string
  status: 'pending' | 'approved' | 'rejected'
  admin_notes?: string
  created_at: string
  updated_at: string
}

export interface Property {
  id: string
  user_id?: string
  property_type: 'apartment' | 'villa' | 'office' | 'shop' | 'land' | 'warehouse'
  listing_type: 'sale' | 'rent'
  title: string
  description?: string
  governorate: string
  city: string
  area: number
  price: number
  bedrooms?: number
  bathrooms?: number
  floor?: number
  total_floors?: number
  age?: number
  features: string[]
  contact_name: string
  contact_phone: string
  contact_whatsapp?: string
  contact_email?: string
  images: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Admin {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'package_manager' | 'marketing_manager' | 'real_estate_manager' | 'support'
  permissions: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SiteSettings {
  id: string
  site_name: string
  site_description?: string
  contact_email: string
  contact_phone: string
  contact_whatsapp?: string
  contact_address?: string
  social_facebook?: string
  social_instagram?: string
  social_twitter?: string
  social_linkedin?: string
  payment_methods: string[]
  announcement_text?: string
  announcement_active: boolean
  primary_color: string
  secondary_color: string
  created_at: string
  updated_at: string
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  limit: number
  total_pages: number
}

// Form Types
export interface OrderFormData {
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_whatsapp?: string
  customer_address?: string
  notes?: string
  payment_method: string
  items: {
    service_name: string
    sub_service_name: string
    price: number
    quantity: number
  }[]
}

export interface PropertyFormData {
  property_type: Property['property_type']
  listing_type: Property['listing_type']
  title: string
  description?: string
  governorate: string
  city: string
  area: number
  price: number
  bedrooms?: number
  bathrooms?: number
  floor?: number
  total_floors?: number
  age?: number
  features: string[]
  contact_name: string
  contact_phone: string
  contact_whatsapp?: string
  contact_email?: string
}

// Statistics Types
export interface DashboardStats {
  total_orders: number
  total_revenue: number
  pending_orders: number
  active_subscriptions: number
  total_properties: number
  monthly_revenue: number
  growth_rate: number
}

export interface OrderStats {
  total: number
  pending: number
  confirmed: number
  in_progress: number
  completed: number
  cancelled: number
}

export interface PropertyStats {
  total: number
  for_sale: number
  for_rent: number
  by_type: Record<Property['property_type'], number>
  by_governorate: Record<string, number>
}
