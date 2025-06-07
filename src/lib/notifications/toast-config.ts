import { toast, ToastOptions } from 'react-hot-toast'

// Custom toast configurations
const defaultOptions: ToastOptions = {
  duration: 4000,
  position: 'top-center',
  style: {
    background: '#fff',
    color: '#333',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    padding: '16px 20px',
    fontSize: '14px',
    fontWeight: '500',
    maxWidth: '400px',
  },
}

const successOptions: ToastOptions = {
  ...defaultOptions,
  style: {
    ...defaultOptions.style,
    background: '#10B981',
    color: '#fff',
  },
  iconTheme: {
    primary: '#fff',
    secondary: '#10B981',
  },
}

const errorOptions: ToastOptions = {
  ...defaultOptions,
  style: {
    ...defaultOptions.style,
    background: '#EF4444',
    color: '#fff',
  },
  iconTheme: {
    primary: '#fff',
    secondary: '#EF4444',
  },
}

const warningOptions: ToastOptions = {
  ...defaultOptions,
  style: {
    ...defaultOptions.style,
    background: '#F59E0B',
    color: '#fff',
  },
  iconTheme: {
    primary: '#fff',
    secondary: '#F59E0B',
  },
}

const loadingOptions: ToastOptions = {
  ...defaultOptions,
  style: {
    ...defaultOptions.style,
    background: '#3B82F6',
    color: '#fff',
  },
  iconTheme: {
    primary: '#fff',
    secondary: '#3B82F6',
  },
}

// Enhanced toast functions
export const notifications = {
  success: (message: string, options?: ToastOptions) => {
    return toast.success(message, { ...successOptions, ...options })
  },

  error: (message: string, options?: ToastOptions) => {
    return toast.error(message, { ...errorOptions, ...options })
  },

  warning: (message: string, options?: ToastOptions) => {
    return toast(message, { 
      ...warningOptions, 
      icon: '⚠️',
      ...options 
    })
  },

  info: (message: string, options?: ToastOptions) => {
    return toast(message, { 
      ...defaultOptions, 
      icon: 'ℹ️',
      ...options 
    })
  },

  loading: (message: string, options?: ToastOptions) => {
    return toast.loading(message, { ...loadingOptions, ...options })
  },

  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    },
    options?: ToastOptions
  ) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        ...defaultOptions,
        ...options,
        success: successOptions,
        error: errorOptions,
        loading: loadingOptions,
      }
    )
  },

  // Database operation notifications
  database: {
    created: (itemName: string) => 
      notifications.success(`✅ تم إنشاء ${itemName} بنجاح`),
    
    updated: (itemName: string) => 
      notifications.success(`✅ تم تحديث ${itemName} بنجاح`),
    
    deleted: (itemName: string) => 
      notifications.success(`✅ تم حذف ${itemName} بنجاح`),
    
    error: (operation: string, itemName: string) => 
      notifications.error(`❌ فشل في ${operation} ${itemName}`),
    
    loading: (operation: string, itemName: string) => 
      notifications.loading(`🔄 جاري ${operation} ${itemName}...`),
  },

  // Authentication notifications
  auth: {
    loginSuccess: () => notifications.success('🎉 تم تسجيل الدخول بنجاح'),
    loginError: () => notifications.error('❌ خطأ في تسجيل الدخول'),
    logoutSuccess: () => notifications.success('👋 تم تسجيل الخروج بنجاح'),
    registerSuccess: () => notifications.success('🎉 تم إنشاء الحساب بنجاح'),
    registerError: () => notifications.error('❌ خطأ في إنشاء الحساب'),
    unauthorized: () => notifications.error('🔒 غير مصرح لك بالوصول'),
  },

  // Order notifications
  order: {
    created: () => notifications.success('🛒 تم إرسال طلبك بنجاح'),
    updated: (status: string) => notifications.success(`📋 تم تحديث حالة الطلب إلى: ${status}`),
    paymentReceived: () => notifications.success('💰 تم استلام الدفع بنجاح'),
    completed: () => notifications.success('✅ تم إكمال طلبك بنجاح'),
    cancelled: () => notifications.warning('❌ تم إلغاء الطلب'),
  },

  // Real-time notifications
  realtime: {
    connected: () => notifications.info('🔗 تم الاتصال بالخادم'),
    disconnected: () => notifications.warning('⚠️ انقطع الاتصال بالخادم'),
    reconnected: () => notifications.success('🔄 تم إعادة الاتصال بالخادم'),
    newData: (type: string) => notifications.info(`📊 تم تحديث بيانات ${type}`),
  },

  // File upload notifications
  upload: {
    started: () => notifications.loading('📤 جاري رفع الملف...'),
    success: () => notifications.success('✅ تم رفع الملف بنجاح'),
    error: () => notifications.error('❌ فشل في رفع الملف'),
    sizeError: () => notifications.error('📏 حجم الملف كبير جداً'),
    typeError: () => notifications.error('📄 نوع الملف غير مدعوم'),
  },

  // Custom dismiss function
  dismiss: (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId)
    } else {
      toast.dismiss()
    }
  },

  // Remove all toasts
  clear: () => {
    toast.dismiss()
  }
}

// Export default toast for backward compatibility
export default notifications
