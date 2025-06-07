import { supabase } from './client'

// ===================================
// عمليات قاعدة البيانات الجديدة والمحسنة
// ===================================

// Service operations - محدث للهيكل الجديد
export const serviceOperations = {
  async getActiveServices() {
    try {
      console.log('🔄 Loading active services...')
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (error) {
        console.error('❌ Error fetching services:', error)
        throw error
      }

      console.log(`✅ Loaded ${data?.length || 0} active services`)
      return data || []
    } catch (error) {
      console.error('💥 Service fetch error:', error)
      return []
    }
  },

  async getAllServices() {
    try {
      console.log('🔄 Loading all services...')
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error fetching all services:', error)
        throw error
      }

      console.log(`✅ Loaded ${data?.length || 0} services`)
      return data || []
    } catch (error) {
      console.error('💥 All services fetch error:', error)
      return []
    }
  },

  async createService(serviceData: any) {
    try {
      console.log('🔄 Creating service:', serviceData)
      
      // التأكد من وجود البيانات المطلوبة
      const requiredFields = ['name_ar', 'description_ar', 'category', 'price']
      for (const field of requiredFields) {
        if (!serviceData[field]) {
          throw new Error(`الحقل ${field} مطلوب`)
        }
      }

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
        console.error('❌ Error creating service:', error)
        throw error
      }

      console.log('✅ Service created successfully:', data)
      return data
    } catch (error) {
      console.error('💥 Service creation error:', error)
      throw error
    }
  },

  async updateService(id: string, serviceData: any) {
    try {
      console.log('🔄 Updating service:', id, serviceData)
      
      const { data, error } = await supabase
        .from('services')
        .update({
          ...serviceData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('❌ Error updating service:', error)
        throw error
      }

      console.log('✅ Service updated successfully:', data)
      return data
    } catch (error) {
      console.error('💥 Service update error:', error)
      throw error
    }
  },

  async deleteService(id: string) {
    try {
      console.log('🔄 Deleting service:', id)
      
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('❌ Error deleting service:', error)
        throw error
      }

      console.log('✅ Service deleted successfully')
      return true
    } catch (error) {
      console.error('💥 Service deletion error:', error)
      throw error
    }
  },

  async getServiceById(id: string) {
    try {
      console.log('🔄 Loading service by ID:', id)
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('❌ Error fetching service by ID:', error)
        throw error
      }

      console.log('✅ Service loaded:', data)
      return data
    } catch (error) {
      console.error('💥 Service by ID fetch error:', error)
      return null
    }
  }
}

// Admin operations - محدث للهيكل الجديد
export const adminOperations = {
  async getAllAdmins() {
    try {
      console.log('🔄 Loading all admins...')
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error fetching admins:', error)
        throw error
      }

      console.log(`✅ Loaded ${data?.length || 0} admins`)
      return data || []
    } catch (error) {
      console.error('💥 Admins fetch error:', error)
      return []
    }
  },

  async createAdmin(adminData: any) {
    try {
      console.log('🔄 Creating admin:', adminData)
      
      // التأكد من وجود البيانات المطلوبة
      const requiredFields = ['email', 'username', 'full_name', 'password_hash']
      for (const field of requiredFields) {
        if (!adminData[field]) {
          throw new Error(`الحقل ${field} مطلوب`)
        }
      }

      const { data, error } = await supabase
        .from('admins')
        .insert({
          ...adminData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('❌ Error creating admin:', error)
        throw error
      }

      console.log('✅ Admin created successfully:', data)
      return data
    } catch (error) {
      console.error('💥 Admin creation error:', error)
      throw error
    }
  },

  async updateAdmin(id: string, adminData: any) {
    try {
      console.log('🔄 Updating admin:', id, adminData)
      
      const { data, error } = await supabase
        .from('admins')
        .update({
          ...adminData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('❌ Error updating admin:', error)
        throw error
      }

      console.log('✅ Admin updated successfully:', data)
      return data
    } catch (error) {
      console.error('💥 Admin update error:', error)
      throw error
    }
  },

  async deleteAdmin(id: string) {
    try {
      console.log('🔄 Deleting admin:', id)
      
      const { error } = await supabase
        .from('admins')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('❌ Error deleting admin:', error)
        throw error
      }

      console.log('✅ Admin deleted successfully')
      return true
    } catch (error) {
      console.error('💥 Admin deletion error:', error)
      throw error
    }
  },

  async getAdminByEmail(email: string) {
    try {
      console.log('🔄 Loading admin by email:', email)
      
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error fetching admin by email:', error)
        throw error
      }

      console.log('✅ Admin loaded:', data)
      return data
    } catch (error) {
      console.error('💥 Admin by email fetch error:', error)
      return null
    }
  }
}

// Customer operations - محدث للهيكل الجديد
export const customerOperations = {
  async getAllCustomers() {
    try {
      console.log('🔄 Loading all customers...')
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error fetching customers:', error)
        throw error
      }

      console.log(`✅ Loaded ${data?.length || 0} customers`)
      return data || []
    } catch (error) {
      console.error('💥 Customers fetch error:', error)
      return []
    }
  },

  async createCustomer(customerData: any) {
    try {
      console.log('🔄 Creating customer:', customerData)
      
      const { data, error } = await supabase
        .from('customers')
        .insert({
          ...customerData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('❌ Error creating customer:', error)
        throw error
      }

      console.log('✅ Customer created successfully:', data)
      return data
    } catch (error) {
      console.error('💥 Customer creation error:', error)
      throw error
    }
  }
}

// Settings operations - محدث للهيكل الجديد
export const settingsOperations = {
  async getPublicSettings() {
    try {
      console.log('🔄 Loading public settings...')
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('is_public', true)

      if (error) {
        console.error('❌ Error fetching public settings:', error)
        throw error
      }

      console.log(`✅ Loaded ${data?.length || 0} public settings`)
      return data || []
    } catch (error) {
      console.error('💥 Public settings fetch error:', error)
      return []
    }
  },

  async getAllSettings() {
    try {
      console.log('🔄 Loading all settings...')
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .order('category', { ascending: true })

      if (error) {
        console.error('❌ Error fetching all settings:', error)
        throw error
      }

      console.log(`✅ Loaded ${data?.length || 0} settings`)
      return data || []
    } catch (error) {
      console.error('💥 All settings fetch error:', error)
      return []
    }
  }
}
