'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { User, AuthState, LoginCredentials, RegisterData } from './auth-types'
import { toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabase/client'

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => void
  updateUser: (user: Partial<User>) => void
  checkAuth: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGOUT' }

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null
      }
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    case 'LOGOUT':
      return { ...initialState, isLoading: false }
    default:
      return state
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Mock authentication functions - في التطبيق الحقيقي ستكون متصلة بـ API
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      // محاكاة API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // تم إزالة المستخدمين التجريبيين للإطلاق الرسمي
      // سيتم استخدام قاعدة البيانات الحقيقية فقط

      // استخدام Supabase للمصادقة الحقيقية
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password
        })

        if (error) {
          throw error
        }

        // التحقق من وجود المستخدم في قاعدة البيانات
        const { data: adminData } = await supabase
          .from('admins')
          .select('*')
          .eq('email', credentials.email)
          .single()

        const { data: customerData } = await supabase
          .from('customers')
          .select('*')
          .eq('email', credentials.email)
          .single()

        const userData = adminData || customerData

        if (userData) {
          const user: User = {
            id: userData.id,
            email: userData.email,
            name: userData.full_name || userData.name,
            phone: userData.phone || '',
            role: userData.role,
            isActive: userData.is_active,
            createdAt: new Date(userData.created_at),
            lastLogin: new Date()
          }

          // حفظ بيانات المستخدم في localStorage
          localStorage.setItem('auth_user', JSON.stringify(user))
          localStorage.setItem('auth_token', data.session?.access_token || '')

          dispatch({ type: 'SET_USER', payload: user })
          toast.success('تم تسجيل الدخول بنجاح')
          return true
        } else {
          dispatch({ type: 'SET_ERROR', payload: 'المستخدم غير موجود في النظام' })
          toast.error('المستخدم غير موجود في النظام')
          return false
        }
      } catch (error: any) {
        dispatch({ type: 'SET_ERROR', payload: 'بيانات الدخول غير صحيحة' })
        toast.error('بيانات الدخول غير صحيحة')
        return false
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'حدث خطأ في تسجيل الدخول' })
      toast.error('حدث خطأ في تسجيل الدخول')
      return false
    }
  }

  const register = async (data: RegisterData): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      // محاكاة API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (data.password !== data.confirmPassword) {
        dispatch({ type: 'SET_ERROR', payload: 'كلمات المرور غير متطابقة' })
        toast.error('كلمات المرور غير متطابقة')
        return false
      }

      // إنشاء مستخدم جديد
      const newUser: User = {
        id: Date.now().toString(),
        email: data.email,
        name: data.name,
        phone: data.phone,
        role: 'customer',
        isActive: true,
        createdAt: new Date()
      }

      // حفظ بيانات المستخدم
      localStorage.setItem('auth_user', JSON.stringify(newUser))
      localStorage.setItem('auth_token', 'mock_token_' + newUser.id)
      
      dispatch({ type: 'SET_USER', payload: newUser })
      toast.success('تم إنشاء الحساب بنجاح')
      return true
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'حدث خطأ في إنشاء الحساب' })
      toast.error('حدث خطأ في إنشاء الحساب')
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token')
    dispatch({ type: 'LOGOUT' })
    toast.success('تم تسجيل الخروج بنجاح')
  }

  const updateUser = (userData: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...userData }
      localStorage.setItem('auth_user', JSON.stringify(updatedUser))
      dispatch({ type: 'SET_USER', payload: updatedUser })
    }
  }

  const checkAuth = () => {
    try {
      const storedUser = localStorage.getItem('auth_user')
      const storedToken = localStorage.getItem('auth_token')
      
      if (storedUser && storedToken) {
        const user = JSON.parse(storedUser)
        dispatch({ type: 'SET_USER', payload: user })
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    } catch (error) {
      console.error('Error checking auth:', error)
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook للتحقق من الصلاحيات
export function usePermissions() {
  const { user } = useAuth()
  
  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    if (user.role === 'super_admin') return true
    
    return user.permissions?.some(p => p.id === permission) || false
  }

  const canAccessModule = (module: string): boolean => {
    if (!user) return false
    if (user.role === 'super_admin') return true
    
    return user.permissions?.some(p => p.module === module) || false
  }

  const isAdmin = (): boolean => {
    return user?.role === 'admin' || user?.role === 'super_admin' || false
  }

  const isCustomer = (): boolean => {
    return user?.role === 'customer' || false
  }

  return {
    hasPermission,
    canAccessModule,
    isAdmin,
    isCustomer,
    user
  }
}
