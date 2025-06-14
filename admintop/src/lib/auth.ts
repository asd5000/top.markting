import { supabase } from './supabase'

export interface User {
  id: string
  email: string
  name?: string
  phone?: string
  created_at: string
}

// التحقق من حالة تسجيل الدخول
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }

    // جلب بيانات المستخدم الإضافية من جدول users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (userError) {
      console.error('Error fetching user data:', userError)
      return {
        id: user.id,
        email: user.email || '',
        created_at: user.created_at || ''
      }
    }

    return userData
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// التحقق من صحة الجلسة
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    return !error && !!session
  } catch (error) {
    console.error('Error checking authentication:', error)
    return false
  }
}

// تسجيل الخروج
export const signOut = async (): Promise<void> => {
  try {
    await supabase.auth.signOut()
  } catch (error) {
    console.error('Error signing out:', error)
  }
}

// تسجيل الدخول للعملاء
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      throw error
    }

    // التحقق من أن المستخدم عميل وليس مدير
    if (data.user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (userError || !userData) {
        // إذا لم يوجد في جدول users، فهو عميل جديد
        console.log('New customer user')
      } else if (userData.role && ['super_admin', 'marketing_manager', 'support', 'content_manager', 'real_estate_manager', 'packages_manager'].includes(userData.role)) {
        // إذا كان مدير، منع تسجيل الدخول من صفحة العملاء
        await supabase.auth.signOut()
        throw new Error('هذا الحساب مخصص للإدارة. يرجى استخدام صفحة تسجيل دخول المدراء')
      }
    }

    return { user: data.user, session: data.session }
  } catch (error) {
    console.error('Error signing in:', error)
    throw error
  }
}

// تسجيل الدخول للمدراء
export const signInAdmin = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      throw error
    }

    // التحقق من أن المستخدم مدير
    if (data.user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (userError || !userData) {
        await supabase.auth.signOut()
        throw new Error('الحساب غير موجود في النظام')
      }

      const adminRoles = ['super_admin', 'marketing_manager', 'support', 'content_manager', 'real_estate_manager', 'packages_manager']
      if (!adminRoles.includes(userData.role)) {
        await supabase.auth.signOut()
        throw new Error('ليس لديك صلاحيات إدارية')
      }

      return { user: data.user, session: data.session, userData }
    }

    return { user: data.user, session: data.session }
  } catch (error) {
    console.error('Error signing in admin:', error)
    throw error
  }
}

// إنشاء حساب جديد
export const signUp = async (email: string, password: string, name: string, phone?: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone
        }
      }
    })

    if (error) {
      throw error
    }

    // إضافة بيانات المستخدم إلى جدول users
    if (data.user) {
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: data.user.id,
            email: data.user.email,
            name,
            phone,
            created_at: new Date().toISOString()
          }
        ])

      if (insertError) {
        console.error('Error inserting user data:', insertError)
      }
    }

    return { user: data.user, session: data.session }
  } catch (error) {
    console.error('Error signing up:', error)
    throw error
  }
}

// إعادة تعيين كلمة المرور
export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error('Error resetting password:', error)
    throw error
  }
}

// تحديث كلمة المرور
export const updatePassword = async (newPassword: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error('Error updating password:', error)
    throw error
  }
}
