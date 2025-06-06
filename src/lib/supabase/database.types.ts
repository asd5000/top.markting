export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          password_hash: string
          name: string | null
          phone: string | null
          role: string | null
          is_active: boolean | null
          created_at: string
          updated_at: string
          last_login: string | null
          total_spent: number | null
          whatsapp_number: string | null
          preferred_payment_method: string | null
        }
        Insert: {
          id?: string
          email: string
          username: string
          password_hash: string
          name?: string | null
          phone?: string | null
          role?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
          total_spent?: number | null
          whatsapp_number?: string | null
          preferred_payment_method?: string | null
        }
        Update: {
          id?: string
          email?: string
          username?: string
          password_hash?: string
          name?: string | null
          phone?: string | null
          role?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
          total_spent?: number | null
          whatsapp_number?: string | null
          preferred_payment_method?: string | null
        }
      }
      admins: {
        Row: {
          id: string
          email: string
          username: string
          password_hash: string
          full_name: string | null
          role: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          email: string
          username: string
          password_hash: string
          full_name?: string | null
          role?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          username?: string
          password_hash?: string
          full_name?: string | null
          role?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      services: {
        Row: {
          id: string
          category_id: string | null
          name_ar: string
          name_en: string
          description_ar: string | null
          description_en: string | null
          price: number
          currency: string | null
          duration_days: number | null
          duration_text: string | null
          features: string[] | null
          requirements: string | null
          deliverables: string | null
          is_featured: boolean | null
          is_active: boolean | null
          sort_order: number | null
          created_at: string | null
          updated_at: string | null
          category: string | null
          category_name: string | null
          is_form: boolean | null
          form_type: string | null
          duration: string | null
        }
        Insert: {
          id?: string
          category_id?: string | null
          name_ar: string
          name_en: string
          description_ar?: string | null
          description_en?: string | null
          price: number
          currency?: string | null
          duration_days?: number | null
          duration_text?: string | null
          features?: string[] | null
          requirements?: string | null
          deliverables?: string | null
          is_featured?: boolean | null
          is_active?: boolean | null
          sort_order?: number | null
          created_at?: string | null
          updated_at?: string | null
          category?: string | null
          category_name?: string | null
          is_form?: boolean | null
          form_type?: string | null
          duration?: string | null
        }
        Update: {
          id?: string
          category_id?: string | null
          name_ar?: string
          name_en?: string
          description_ar?: string | null
          description_en?: string | null
          price?: number
          currency?: string | null
          duration_days?: number | null
          duration_text?: string | null
          features?: string[] | null
          requirements?: string | null
          deliverables?: string | null
          is_featured?: boolean | null
          is_active?: boolean | null
          sort_order?: number | null
          created_at?: string | null
          updated_at?: string | null
          category?: string | null
          category_name?: string | null
          is_form?: boolean | null
          form_type?: string | null
          duration?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          service_id: string
          service_name: string
          quantity: number
          price: number
          total_amount: number
          status: 'pending' | 'processing' | 'active' | 'completed' | 'cancelled'
          payment_status: 'pending' | 'paid' | 'failed'
          payment_method: string | null
          payment_receipt_url: string | null
          requirements: string | null
          notes: string | null
          admin_notes: string | null
          created_at: string
          updated_at: string
          form_data: any | null
        }
        Insert: {
          id?: string
          customer_id: string
          service_id: string
          service_name: string
          quantity: number
          price: number
          total_amount: number
          status?: 'pending' | 'processing' | 'active' | 'completed' | 'cancelled'
          payment_status?: 'pending' | 'paid' | 'failed'
          payment_method?: string | null
          payment_receipt_url?: string | null
          requirements?: string | null
          notes?: string | null
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
          form_data?: any | null
        }
        Update: {
          id?: string
          customer_id?: string
          service_id?: string
          service_name?: string
          quantity?: number
          price?: number
          total_amount?: number
          status?: 'pending' | 'processing' | 'active' | 'completed' | 'cancelled'
          payment_status?: 'pending' | 'paid' | 'failed'
          payment_method?: string | null
          payment_receipt_url?: string | null
          requirements?: string | null
          notes?: string | null
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
          form_data?: any | null
        }
      }
      real_estate_properties: {
        Row: {
          id: string
          customer_id: string
          operation_type: 'seller' | 'buyer'
          property_type: 'house' | 'apartment' | 'land' | 'shop' | 'villa'
          title: string
          description: string | null
          area: number
          price: number
          price_type: 'total' | 'per_meter' | 'negotiable'
          location: any
          details: any
          features: string[]
          amenities: string[]
          financial: any | null
          images: string[]
          contact_info: any
          status: 'pending' | 'active' | 'sold' | 'rented' | 'cancelled'
          priority: 'low' | 'medium' | 'high'
          featured: boolean
          views: number
          inquiries: number
          admin_notes: string | null
          verification_status: 'pending' | 'verified' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          operation_type: 'seller' | 'buyer'
          property_type: 'house' | 'apartment' | 'land' | 'shop' | 'villa'
          title: string
          description?: string | null
          area: number
          price: number
          price_type?: 'total' | 'per_meter' | 'negotiable'
          location: any
          details: any
          features?: string[]
          amenities?: string[]
          financial?: any | null
          images?: string[]
          contact_info: any
          status?: 'pending' | 'active' | 'sold' | 'rented' | 'cancelled'
          priority?: 'low' | 'medium' | 'high'
          featured?: boolean
          views?: number
          inquiries?: number
          admin_notes?: string | null
          verification_status?: 'pending' | 'verified' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          operation_type?: 'seller' | 'buyer'
          property_type?: 'house' | 'apartment' | 'land' | 'shop' | 'villa'
          title?: string
          description?: string | null
          area?: number
          price?: number
          price_type?: 'total' | 'per_meter' | 'negotiable'
          location?: any
          details?: any
          features?: string[]
          amenities?: string[]
          financial?: any | null
          images?: string[]
          contact_info?: any
          status?: 'pending' | 'active' | 'sold' | 'rented' | 'cancelled'
          priority?: 'low' | 'medium' | 'high'
          featured?: boolean
          views?: number
          inquiries?: number
          admin_notes?: string | null
          verification_status?: 'pending' | 'verified' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      admin_settings: {
        Row: {
          id: string
          key: string
          value: any
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: any
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: any
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
